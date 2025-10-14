/**
 * Playwright Global Teardown
 *
 * Runs after all tests to:
 * - Stop GCS emulator
 * - Clean up test data
 * - Generate test reports
 * - Archive test artifacts
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import type { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 Starting E2E Test Environment Teardown...\n');

  // 1. Clean up test files
  await cleanupTestFiles();

  // 2. Clean up GCS test data
  await cleanupGCSData();

  // 3. Generate test summary
  await generateTestSummary();

  // 4. Archive test artifacts
  await archiveArtifacts();

  console.log('\n✅ E2E Test Environment Teardown Complete\n');
}

/**
 * Clean up test files
 */
async function cleanupTestFiles() {
  console.log('🗑️  Cleaning up test files...');

  try {
    // Clean up /tmp test files
    const files = await fs.readdir('/tmp');
    const testFiles = files.filter(
      f => f.startsWith('test-file-') ||
           f.startsWith('test-image-') ||
           f.startsWith('concurrent-') ||
           f.startsWith('integration-')
    );

    for (const file of testFiles) {
      try {
        await fs.unlink(path.join('/tmp', file));
      } catch {
        // Ignore errors for individual files
      }
    }

    console.log(`✓ Cleaned up ${testFiles.length} test files`);
  } catch (error) {
    console.warn('⚠️  Could not clean up all test files:', error);
  }
}

/**
 * Clean up GCS test data
 */
async function cleanupGCSData() {
  if (!process.env.STORAGE_EMULATOR_HOST) {
    return;
  }

  console.log('🗑️  Cleaning up GCS test data...');

  try {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage({
      apiEndpoint: `http://${process.env.STORAGE_EMULATOR_HOST}`,
      projectId: 'test-project',
    });

    const bucketName = process.env.GCS_BUCKET || 'test-bucket';
    const bucket = storage.bucket(bucketName);

    // List and delete all test files
    const [files] = await bucket.getFiles();

    for (const file of files) {
      try {
        await file.delete();
      } catch {
        // Ignore errors for individual files
      }
    }

    console.log(`✓ Cleaned up ${files.length} files from GCS bucket`);
  } catch (error) {
    console.warn('⚠️  Could not clean up GCS data:', error);
  }
}

/**
 * Generate test summary
 */
async function generateTestSummary() {
  console.log('📊 Generating test summary...');

  try {
    const resultsPath = path.resolve(__dirname, '../../test-results/results.json');

    // Check if results file exists
    try {
      await fs.access(resultsPath);
    } catch {
      console.log('⚠️  No test results found');
      return;
    }

    // Read results
    const resultsData = await fs.readFile(resultsPath, 'utf-8');
    const results = JSON.parse(resultsData);

    // Calculate summary
    const summary = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      duration: 0,
    };

    // Parse results (structure depends on Playwright version)
    if (results.suites) {
      for (const suite of results.suites) {
        if (suite.specs) {
          for (const spec of suite.specs) {
            summary.totalTests++;

            if (spec.ok) {
              summary.passed++;
            } else {
              summary.failed++;
            }

            if (spec.tests) {
              for (const test of spec.tests) {
                summary.duration += test.results?.[0]?.duration || 0;
              }
            }
          }
        }
      }
    }

    // Write summary
    const summaryPath = path.resolve(__dirname, '../../test-results/summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

    // Print summary
    console.log('\n📈 Test Summary:');
    console.log(`   Total Tests: ${summary.totalTests}`);
    console.log(`   ✓ Passed: ${summary.passed}`);
    console.log(`   ✗ Failed: ${summary.failed}`);
    console.log(`   ⊘ Skipped: ${summary.skipped}`);
    console.log(`   ⏱️  Duration: ${(summary.duration / 1000).toFixed(2)}s\n`);

    // Calculate pass rate
    const passRate = summary.totalTests > 0
      ? ((summary.passed / summary.totalTests) * 100).toFixed(1)
      : '0.0';

    console.log(`   📊 Pass Rate: ${passRate}%\n`);

  } catch (error) {
    console.warn('⚠️  Could not generate test summary:', error);
  }
}

/**
 * Archive test artifacts
 */
async function archiveArtifacts() {
  console.log('📦 Archiving test artifacts...');

  try {
    const artifactsDir = path.resolve(__dirname, '../../test-results/artifacts');
    const archiveDir = path.resolve(__dirname, '../../test-results/archive');

    // Create archive directory
    await fs.mkdir(archiveDir, { recursive: true });

    // Get timestamp
    const timestamp = new Date().toISOString().replace(/[.:]/g, '-');

    // Check if artifacts exist
    try {
      await fs.access(artifactsDir);
    } catch {
      console.log('⚠️  No artifacts to archive');
      return;
    }

    // Copy artifacts to archive
    const archivePath = path.join(archiveDir, `artifacts-${timestamp}`);
    await fs.mkdir(archivePath, { recursive: true });

    // Copy files (screenshots, videos, traces)
    const files = await fs.readdir(artifactsDir);

    for (const file of files) {
      const src = path.join(artifactsDir, file);
      const dest = path.join(archivePath, file);

      try {
        await fs.copyFile(src, dest);
      } catch {
        // Ignore copy errors
      }
    }

    console.log(`✓ Archived ${files.length} artifacts to: ${archivePath}`);

    // Clean up old archives (keep last 10)
    const archives = await fs.readdir(archiveDir);
    const sortedArchives = archives
      .filter(a => a.startsWith('artifacts-'))
      .sort()
      .reverse();

    if (sortedArchives.length > 10) {
      const toDelete = sortedArchives.slice(10);

      for (const archive of toDelete) {
        const archivePath = path.join(archiveDir, archive);
        await fs.rm(archivePath, { recursive: true, force: true });
      }

      console.log(`✓ Cleaned up ${toDelete.length} old archives`);
    }

  } catch (error) {
    console.warn('⚠️  Could not archive artifacts:', error);
  }
}

export default globalTeardown;