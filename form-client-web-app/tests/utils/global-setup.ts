/**
 * Global Setup for Playwright Tests
 *
 * Runs once before all tests to verify environment and bootstrap Form.io
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium, type FullConfig } from '@playwright/test';

import { GCSApiHelper, FormioApiHelper } from './api-helpers';
import { generateStandardTestFiles } from './file-helpers';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run Form.io bootstrap script if needed
 */
async function bootstrapFormio(): Promise<void> {
  const envTestPath = path.join(__dirname, '../../.env.test');
  const bootstrapScript = path.join(__dirname, '../setup/formio-bootstrap.sh');

  // Check if .env.test exists and has required fields
  if (fs.existsSync(envTestPath)) {
    const fsPromises = await import('node:fs/promises');
    const envContent = await fsPromises.readFile(envTestPath, 'utf-8');
    const hasToken = envContent.includes('FORMIO_JWT_TOKEN=') &&
                     envContent.match(/FORMIO_JWT_TOKEN=.+/);
    const hasFormId = envContent.includes('FORMIO_FORM_ID=') &&
                      envContent.match(/FORMIO_FORM_ID=.+/);

    if (hasToken && hasFormId) {
      console.log('  ℹ️  Form.io already configured (found .env.test with credentials)');
      return;
    }
  }

  console.log('🔧 Running Form.io bootstrap...');

  try {
    execSync(`bash "${bootstrapScript}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../..'),
      env: {
        ...process.env,
        FORMIO_URL: process.env.FORMIO_BASE_URL || 'http://localhost:3001',
        ROOT_EMAIL: process.env.FORMIO_ROOT_EMAIL || 'admin@example.com',
        ROOT_PASSWORD: process.env.FORMIO_ROOT_PASSWORD || 'CHANGEME',
        TUS_ENDPOINT: process.env.TUS_ENDPOINT || 'http://localhost:1080/files/',
        ENV_FILE: '.env.test'
      }
    });

    console.log('  ✅ Form.io bootstrap completed');
  } catch (error) {
    console.error('  ⚠️  Form.io bootstrap failed (will retry during tests):', error);
    // Don't throw - tests might still work with manual setup
  }
}

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright Test Setup...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ✅ OPTIMIZED: Run all health checks and setup in parallel (4x faster)
    console.log('✓ Running parallel service checks...');

    const formioHelper = new FormioApiHelper();

    const [appOk, formioOk, gcsOk, testFiles] = await Promise.all([
      // 1. Test app check
      page.goto('http://localhost:64849', {
        timeout: 10000,
        waitUntil: 'domcontentloaded'
      }).then(r => {
        if (!r?.ok()) {
          throw new Error('Test app is not running. Start with: npm run dev');
        }
        console.log('  ✅ Test app is running');
        return true;
      }),

      // 2. Form.io server check
      formioHelper.healthCheck(context.request).then(healthy => {
        if (!healthy) {
          throw new Error('Form.io server is not running. Start with: make local-up');
        }
        console.log('  ✅ Form.io server is running');
        return true;
      }),

      // 3. GCS emulator check
      context.request.get('http://localhost:4443/storage/v1/b', {
        timeout: 5000
      }).then(r => {
        if (!r.ok()) {
          throw new Error('GCS emulator is not running. Start with: make local-up');
        }
        console.log('  ✅ GCS emulator is running');
        return true;
      }),

      // 4. Generate test files in parallel with health checks
      generateStandardTestFiles().then(files => {
        console.log(`  ✅ Generated ${Object.keys(files).length} test files:`,
          Object.keys(files).map(key => files[key].filename).join(', ')
        );
        return files;
      })
    ]);

    // 3. Bootstrap Form.io (must run after health checks)
    await bootstrapFormio();

    // 6. Load and store configuration in environment
    const envTestPath = path.join(__dirname, '../../.env.test');
    if (fs.existsSync(envTestPath)) {
      const fsPromises = await import('node:fs/promises');
      const envContent = await fsPromises.readFile(envTestPath, 'utf-8');
      for (const line of envContent.split('\n')) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          process.env[match[1].trim()] = match[2].trim();
        }
      }
    }

    process.env.PLAYWRIGHT_SETUP_COMPLETE = 'true';
    process.env.TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:64849';
    process.env.FORMIO_BASE_URL = process.env.FORMIO_BASE_URL || 'http://localhost:3001';
    process.env.GCS_BASE_URL = process.env.GCS_BASE_URL || 'http://localhost:4443';

    console.log('✅ Global setup completed successfully!\n');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;