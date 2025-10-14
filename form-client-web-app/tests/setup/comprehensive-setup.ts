/**
 * Comprehensive Playwright Global Setup
 *
 * Performs complete test environment initialization:
 * 1. Verify Docker services running
 * 2. Wait for Form.io server ready
 * 3. Create admin user if not exists
 * 4. Seed test forms
 * 5. Clean MongoDB test data
 * 6. Clean Redis queue
 * 7. Generate large test files if needed
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { chromium, type FullConfig } from '@playwright/test';
import { Redis } from 'ioredis';

import { E2E_CONFIG, TEST_USERS } from '../config/e2e-test.config';

interface SetupResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Check if Docker service is running
 */
async function checkDockerService(serviceName: string, port: number): Promise<boolean> {
  try {
    const result = execSync(`docker ps --filter "name=${serviceName}" --format "{{.Status}}"`, {
      encoding: 'utf-8',
      timeout: 5000,
    });
    return result.includes('Up');
  } catch {
    return false;
  }
}

/**
 * Wait for service to be ready with exponential backoff
 */
async function waitForService(
  name: string,
  checkFn: () => Promise<boolean>,
  maxAttempts: number = 30,
  initialDelay: number = 1000
): Promise<boolean> {
  console.log(`⏳ Waiting for ${name} to be ready...`);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const ready = await checkFn();
      if (ready) {
        console.log(`  ✅ ${name} is ready`);
        return true;
      }
    } catch {
      // Ignore errors during startup
    }

    const delay = initialDelay * Math.pow(1.5, Math.min(attempt, 5));
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  console.error(`  ❌ ${name} failed to become ready after ${maxAttempts} attempts`);
  return false;
}

/**
 * Verify Docker services are running
 */
async function verifyDockerServices(): Promise<SetupResult> {
  console.log('\n📦 Verifying Docker services...');

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check MongoDB
  const mongoRunning = await checkDockerService('mongodb', 27017);
  if (!mongoRunning) {
    errors.push('MongoDB container not running. Start with: docker-compose up -d mongodb');
  }

  // Check GCS emulator
  const gcsRunning = await checkDockerService('gcs-emulator', 4443);
  if (!gcsRunning) {
    warnings.push('GCS emulator not running. Some tests may fail.');
  }

  // Check Redis
  const redisRunning = await checkDockerService('redis', 6379);
  if (!redisRunning) {
    warnings.push('Redis not running. Queue tests will be skipped.');
  }

  return { success: errors.length === 0, errors, warnings };
}

/**
 * Wait for Form.io server to be ready
 */
async function waitForFormioServer(): Promise<boolean> {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const ready = await waitForService('Form.io server', async () => {
    try {
      const response = await context.request.get(`${E2E_CONFIG.services.formio}/health`, {
        timeout: 5000,
      });
      return response.ok();
    } catch {
      return false;
    }
  });

  await context.close();
  await browser.close();

  return ready;
}

/**
 * Create admin user if not exists
 */
async function createAdminUser(): Promise<SetupResult> {
  console.log('\n👤 Setting up admin user...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Try to login first
    const loginResponse = await context.request.post(`${E2E_CONFIG.services.formio}/user/login`, {
      data: {
        data: {
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        },
      },
    });

    if (loginResponse.ok()) {
      console.log('  ✅ Admin user already exists');
      await context.close();
      await browser.close();
      return { success: true, errors, warnings };
    }

    // Create admin user if login failed
    const registerResponse = await context.request.post(
      `${E2E_CONFIG.services.formio}/user/register`,
      {
        data: {
          data: {
            email: TEST_USERS.admin.email,
            password: TEST_USERS.admin.password,
          },
        },
      }
    );

    if (registerResponse.ok()) {
      console.log('  ✅ Admin user created successfully');
    } else {
      warnings.push('Failed to create admin user - may already exist');
    }
  } catch (error) {
    errors.push(`Failed to setup admin user: ${error}`);
  } finally {
    await context.close();
    await browser.close();
  }

  return { success: errors.length === 0, errors, warnings };
}

/**
 * Seed test forms
 */
async function seedTestForms(): Promise<SetupResult> {
  console.log('\n📝 Seeding test forms...');

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const scriptsDir = path.join(__dirname, '../../scripts');
    const seedScript = path.join(scriptsDir, 'create-tus-forms.js');

    if (await fs.access(seedScript).then(() => true).catch(() => false)) {
      execSync(`node "${seedScript}"`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          FORMIO_URL: E2E_CONFIG.services.formio,
        },
      });
      console.log('  ✅ Test forms seeded successfully');
    } else {
      warnings.push('Seed script not found - skipping form creation');
    }
  } catch (error) {
    warnings.push(`Failed to seed test forms: ${error}`);
  }

  return { success: true, errors, warnings };
}

/**
 * Clean MongoDB test data
 */
async function cleanMongoDBData(): Promise<SetupResult> {
  console.log('\n🗑️  Cleaning MongoDB test data...');

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Only clean in test environment
    if (process.env.NODE_ENV !== 'test' && !process.env.CI) {
      console.log('  ⏭️  Skipping cleanup (not in test environment)');
      return { success: true, errors, warnings };
    }

    const MongoClient = require('mongodb').MongoClient;
    const client = await MongoClient.connect(E2E_CONFIG.services.mongo);
    const db = client.db();

    // Clean test submissions (keep forms)
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      if (collection.name.includes('submission')) {
        await db.collection(collection.name).deleteMany({});
        console.log(`  ✅ Cleaned ${collection.name}`);
      }
    }

    await client.close();
  } catch (error) {
    warnings.push(`MongoDB cleanup failed: ${error}`);
  }

  return { success: true, errors, warnings };
}

/**
 * Clean Redis queue
 */
async function cleanRedisQueue(): Promise<SetupResult> {
  console.log('\n🗑️  Cleaning Redis queue...');

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const redis = new Redis(E2E_CONFIG.services.redis, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
    });

    // Flush test-related keys
    const keys = await redis.keys('bull:file-uploads-test:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`  ✅ Cleaned ${keys.length} queue keys`);
    } else {
      console.log('  ✅ No queue keys to clean');
    }

    await redis.quit();
  } catch (error) {
    warnings.push(`Redis cleanup failed: ${error}`);
  }

  return { success: true, errors, warnings };
}

/**
 * Generate large test files if needed
 */
async function generateTestFiles(): Promise<SetupResult> {
  console.log('\n📁 Checking test files...');

  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const fixturesDir = path.join(__dirname, '../fixtures/large-files');
    const scriptPath = path.join(fixturesDir, 'generate-files.sh');

    // Check if required files exist
    const requiredFiles = ['10mb.bin', 'sample-resume.pdf'];
    const filesExist = await Promise.all(
      requiredFiles.map(async (file) => {
        const filePath = path.join(fixturesDir, file);
        try {
          await fs.access(filePath);
          return true;
        } catch {
          return false;
        }
      })
    );

    if (filesExist.every(exists => exists)) {
      console.log('  ✅ All required test files exist');
      return { success: true, errors, warnings };
    }

    // Generate files
    console.log('  🔨 Generating test files...');
    execSync(`bash "${scriptPath}" --quick`, {
      stdio: 'inherit',
      cwd: fixturesDir,
    });

    console.log('  ✅ Test files generated successfully');
  } catch (error) {
    warnings.push(`Test file generation failed: ${error}`);
  }

  return { success: true, errors, warnings };
}

/**
 * Main setup function
 */
export default async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Starting Comprehensive Test Environment Setup\n');
  console.log('='.repeat(60));

  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // 1. Verify Docker services
  const dockerResult = await verifyDockerServices();
  allErrors.push(...dockerResult.errors);
  allWarnings.push(...dockerResult.warnings);

  if (!dockerResult.success) {
    console.error('\n❌ Critical services not running. Setup aborted.');
    throw new Error(dockerResult.errors.join('\n'));
  }

  // 2. Wait for Form.io server
  const formioReady = await waitForFormioServer();
  if (!formioReady) {
    throw new Error('Form.io server failed to start. Run: npm run dev (in formio directory)');
  }

  // 3. Create admin user
  const userResult = await createAdminUser();
  allErrors.push(...userResult.errors);
  allWarnings.push(...userResult.warnings);

  // 4. Seed test forms
  const seedResult = await seedTestForms();
  allErrors.push(...seedResult.errors);
  allWarnings.push(...seedResult.warnings);

  // 5. Clean MongoDB
  const mongoResult = await cleanMongoDBData();
  allErrors.push(...mongoResult.errors);
  allWarnings.push(...mongoResult.warnings);

  // 6. Clean Redis queue
  const redisResult = await cleanRedisQueue();
  allErrors.push(...redisResult.errors);
  allWarnings.push(...redisResult.warnings);

  // 7. Generate test files
  const filesResult = await generateTestFiles();
  allErrors.push(...filesResult.errors);
  allWarnings.push(...filesResult.warnings);

  // Print summary
  console.log(`\n${  '='.repeat(60)}`);
  console.log('\n📊 Setup Summary:\n');

  if (allWarnings.length > 0) {
    console.log('⚠️  Warnings:');
    for (const warning of allWarnings) console.log(`   - ${warning}`);
    console.log('');
  }

  if (allErrors.length > 0) {
    console.log('❌ Errors:');
    for (const error of allErrors) console.log(`   - ${error}`);
    console.log('');
    throw new Error('Setup failed with errors');
  }

  console.log('✅ Setup completed successfully!\n');
  console.log('Environment ready for testing 🎉\n');
}
