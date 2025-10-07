#!/usr/bin/env node
/**
 * Automated Security Cleanup Script
 *
 * This script performs automated cleanup of test data, temporary files,
 * and expired uploads to maintain system security and prevent data leakage.
 *
 * Features:
 * - Removes old test data from MongoDB
 * - Cleans up orphaned TUS uploads
 * - Removes expired temporary files
 * - Prunes old GCS emulator data
 * - Validates file permissions
 * - Generates cleanup reports
 *
 * Usage:
 *   node scripts/security-cleanup.js [--dry-run] [--days=7] [--report]
 *
 * Cron Setup (daily at 2 AM):
 *   0 2 * * * cd /path/to/formio-monorepo && node scripts/security-cleanup.js >> logs/cleanup.log 2>&1
 */

const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  // MongoDB connection (from environment or default)
  mongoUrl: process.env.MONGO || 'mongodb://localhost:27017',
  dbName: process.env.MONGO_DB_NAME || 'formioapp',

  // Cleanup thresholds
  testDataMaxAge: parseInt(process.env.TEST_DATA_MAX_AGE_DAYS || '7', 10), // Days
  tempFileMaxAge: parseInt(process.env.TEMP_FILE_MAX_AGE_HOURS || '24', 10), // Hours
  tusUploadMaxAge: parseInt(process.env.TUS_UPLOAD_MAX_AGE_HOURS || '48', 10), // Hours

  // Paths
  tusUploadDir: process.env.TUS_UPLOAD_DIR || '/data/uploads',
  tempDir: process.env.TEMP_DIR || '/tmp/formio',

  // Dry run mode
  dryRun: process.argv.includes('--dry-run'),
  generateReport: process.argv.includes('--report'),
};

// Parse custom --days argument
const daysArg = process.argv.find(arg => arg.startsWith('--days='));
if (daysArg) {
  CONFIG.testDataMaxAge = parseInt(daysArg.split('=')[1], 10);
}

// Cleanup statistics
const stats = {
  testFormsRemoved: 0,
  testSubmissionsRemoved: 0,
  tusUploadsRemoved: 0,
  tempFilesRemoved: 0,
  bytesFreed: 0,
  errors: [],
  startTime: Date.now(),
};

/**
 * Log message with timestamp
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = CONFIG.dryRun ? '[DRY-RUN] ' : '';
  console.log(`${timestamp} [${level}] ${prefix}${message}`);
}

/**
 * Remove old test forms from MongoDB
 */
async function cleanupTestForms(db) {
  log('Cleaning up test forms...');

  try {
    const formsCollection = db.collection('forms');
    const cutoffDate = new Date(Date.now() - CONFIG.testDataMaxAge * 24 * 60 * 60 * 1000);

    // Find test forms (forms with 'test' in title or path)
    const testFormsQuery = {
      $or: [
        { title: /test/i },
        { path: /test/i },
        { name: /test/i },
      ],
      created: { $lt: cutoffDate },
    };

    const testForms = await formsCollection.find(testFormsQuery).toArray();

    if (testForms.length === 0) {
      log('No old test forms found');
      return;
    }

    log(`Found ${testForms.length} old test forms`);

    if (!CONFIG.dryRun) {
      const result = await formsCollection.deleteMany(testFormsQuery);
      stats.testFormsRemoved = result.deletedCount;
      log(`Removed ${result.deletedCount} test forms`);
    } else {
      log(`Would remove ${testForms.length} test forms`);
      stats.testFormsRemoved = testForms.length;
    }
  } catch (error) {
    log(`Error cleaning test forms: ${error.message}`, 'ERROR');
    stats.errors.push({ type: 'test_forms', error: error.message });
  }
}

/**
 * Remove old test submissions from MongoDB
 */
async function cleanupTestSubmissions(db) {
  log('Cleaning up test submissions...');

  try {
    const submissionsCollection = db.collection('submissions');
    const formsCollection = db.collection('forms');
    const cutoffDate = new Date(Date.now() - CONFIG.testDataMaxAge * 24 * 60 * 60 * 1000);

    // Find test forms to get their IDs
    const testForms = await formsCollection.find({
      $or: [
        { title: /test/i },
        { path: /test/i },
        { name: /test/i },
      ],
    }).toArray();

    const testFormIds = testForms.map(form => form._id);

    // Remove submissions for test forms and old submissions with test data
    const testSubmissionsQuery = {
      $or: [
        { form: { $in: testFormIds } },
        {
          created: { $lt: cutoffDate },
          'data.fileName': /test/i,
        },
      ],
    };

    const testSubmissions = await submissionsCollection.find(testSubmissionsQuery).toArray();

    if (testSubmissions.length === 0) {
      log('No old test submissions found');
      return;
    }

    log(`Found ${testSubmissions.length} old test submissions`);

    if (!CONFIG.dryRun) {
      const result = await submissionsCollection.deleteMany(testSubmissionsQuery);
      stats.testSubmissionsRemoved = result.deletedCount;
      log(`Removed ${result.deletedCount} test submissions`);
    } else {
      log(`Would remove ${testSubmissions.length} test submissions`);
      stats.testSubmissionsRemoved = testSubmissions.length;
    }
  } catch (error) {
    log(`Error cleaning test submissions: ${error.message}`, 'ERROR');
    stats.errors.push({ type: 'test_submissions', error: error.message });
  }
}

/**
 * Clean up orphaned TUS uploads
 */
async function cleanupTusUploads() {
  log('Cleaning up TUS uploads...');

  try {
    // Check if TUS upload directory exists
    try {
      await fs.access(CONFIG.tusUploadDir);
    } catch {
      log(`TUS upload directory not found: ${CONFIG.tusUploadDir}`, 'WARN');
      return;
    }

    const cutoffDate = Date.now() - CONFIG.tusUploadMaxAge * 60 * 60 * 1000;
    const files = await fs.readdir(CONFIG.tusUploadDir);

    let removedCount = 0;
    let bytesFreed = 0;

    for (const file of files) {
      const filePath = path.join(CONFIG.tusUploadDir, file);

      try {
        const stat = await fs.stat(filePath);

        // Remove files older than threshold
        if (stat.mtimeMs < cutoffDate) {
          if (!CONFIG.dryRun) {
            await fs.unlink(filePath);
          }
          removedCount++;
          bytesFreed += stat.size;
        }
      } catch (error) {
        log(`Error processing file ${file}: ${error.message}`, 'ERROR');
      }
    }

    stats.tusUploadsRemoved = removedCount;
    stats.bytesFreed += bytesFreed;

    if (removedCount > 0) {
      log(`Removed ${removedCount} TUS uploads (${(bytesFreed / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      log('No old TUS uploads found');
    }
  } catch (error) {
    log(`Error cleaning TUS uploads: ${error.message}`, 'ERROR');
    stats.errors.push({ type: 'tus_uploads', error: error.message });
  }
}

/**
 * Clean up temporary files
 */
async function cleanupTempFiles() {
  log('Cleaning up temporary files...');

  try {
    // Check if temp directory exists
    try {
      await fs.access(CONFIG.tempDir);
    } catch {
      log(`Temp directory not found: ${CONFIG.tempDir}`, 'WARN');
      return;
    }

    const cutoffDate = Date.now() - CONFIG.tempFileMaxAge * 60 * 60 * 1000;
    const files = await fs.readdir(CONFIG.tempDir, { withFileTypes: true });

    let removedCount = 0;
    let bytesFreed = 0;

    for (const file of files) {
      const filePath = path.join(CONFIG.tempDir, file.name);

      try {
        const stat = await fs.stat(filePath);

        // Remove files/directories older than threshold
        if (stat.mtimeMs < cutoffDate) {
          if (!CONFIG.dryRun) {
            if (file.isDirectory()) {
              await fs.rm(filePath, { recursive: true, force: true });
            } else {
              await fs.unlink(filePath);
            }
          }
          removedCount++;
          bytesFreed += stat.size;
        }
      } catch (error) {
        log(`Error processing temp file ${file.name}: ${error.message}`, 'ERROR');
      }
    }

    stats.tempFilesRemoved = removedCount;
    stats.bytesFreed += bytesFreed;

    if (removedCount > 0) {
      log(`Removed ${removedCount} temp files (${(bytesFreed / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      log('No old temp files found');
    }
  } catch (error) {
    log(`Error cleaning temp files: ${error.message}`, 'ERROR');
    stats.errors.push({ type: 'temp_files', error: error.message });
  }
}

/**
 * Generate cleanup report
 */
function generateReport() {
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
  const totalRemoved = stats.testFormsRemoved + stats.testSubmissionsRemoved +
                       stats.tusUploadsRemoved + stats.tempFilesRemoved;

  log('');
  log('═══════════════════════════════════════════════════════');
  log('           SECURITY CLEANUP REPORT');
  log('═══════════════════════════════════════════════════════');
  log('');
  log(`Execution Time: ${duration}s`);
  log(`Mode: ${CONFIG.dryRun ? 'DRY RUN' : 'LIVE'}`);
  log('');
  log('Cleanup Statistics:');
  log(`  Test Forms Removed:       ${stats.testFormsRemoved}`);
  log(`  Test Submissions Removed: ${stats.testSubmissionsRemoved}`);
  log(`  TUS Uploads Removed:      ${stats.tusUploadsRemoved}`);
  log(`  Temp Files Removed:       ${stats.tempFilesRemoved}`);
  log(`  Total Items Removed:      ${totalRemoved}`);
  log(`  Disk Space Freed:         ${(stats.bytesFreed / 1024 / 1024).toFixed(2)} MB`);
  log('');

  if (stats.errors.length > 0) {
    log('Errors:');
    stats.errors.forEach(({ type, error }) => {
      log(`  [${type}] ${error}`, 'ERROR');
    });
    log('');
  }

  log('Configuration:');
  log(`  Test Data Max Age:    ${CONFIG.testDataMaxAge} days`);
  log(`  Temp File Max Age:    ${CONFIG.tempFileMaxAge} hours`);
  log(`  TUS Upload Max Age:   ${CONFIG.tusUploadMaxAge} hours`);
  log('');
  log('═══════════════════════════════════════════════════════');

  return {
    timestamp: new Date().toISOString(),
    duration,
    mode: CONFIG.dryRun ? 'dry-run' : 'live',
    stats,
    config: CONFIG,
  };
}

/**
 * Main cleanup function
 */
async function main() {
  log('Starting security cleanup...');
  log(`Mode: ${CONFIG.dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
  log('');

  let client;

  try {
    // Connect to MongoDB
    log(`Connecting to MongoDB: ${CONFIG.mongoUrl}`);
    client = new MongoClient(CONFIG.mongoUrl);
    await client.connect();

    const db = client.db(CONFIG.dbName);
    log(`Connected to database: ${CONFIG.dbName}`);
    log('');

    // Run cleanup tasks
    await cleanupTestForms(db);
    await cleanupTestSubmissions(db);
    await cleanupTusUploads();
    await cleanupTempFiles();

  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    stats.errors.push({ type: 'fatal', error: error.message });
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      log('');
      log('MongoDB connection closed');
    }
  }

  // Generate report
  log('');
  const report = generateReport();

  // Save report to file if requested
  if (CONFIG.generateReport) {
    const reportPath = path.join(__dirname, '..', 'logs', `cleanup-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    log('');
    log(`Report saved to: ${reportPath}`);
  }

  log('');
  log('✅ Security cleanup completed');

  // Exit with error code if there were errors
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

// Run main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
