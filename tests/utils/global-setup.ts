/**
 * Playwright Global Setup
 *
 * Runs before all tests to:
 * - Start GCS emulator
 * - Initialize test database
 * - Setup test environment
 * - Create test fixtures
 */

import { chromium, FullConfig } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let gcsEmulator: ChildProcess | null = null;
let formioServer: ChildProcess | null = null;

async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Starting E2E Test Environment Setup...\n');

  // 1. Start GCS Emulator (if not already running)
  await startGCSEmulator();

  // 2. Wait for services to be ready
  await waitForServices();

  // 3. Initialize test data
  await initializeTestData();

  // 4. Create test fixtures directory
  await createTestFixtures();

  console.log('\n✅ E2E Test Environment Setup Complete\n');
}

/**
 * Start GCS Storage Emulator
 */
async function startGCSEmulator() {
  if (process.env.STORAGE_EMULATOR_HOST) {
    console.log('📦 GCS Emulator already configured at:', process.env.STORAGE_EMULATOR_HOST);
    return;
  }

  try {
    console.log('📦 Starting GCS Emulator...');

    gcsEmulator = spawn('gcloud', [
      'beta',
      'emulators',
      'storage',
      'start',
      '--host=localhost',
      '--port=9023',
    ], {
      stdio: 'pipe',
      env: {
        ...process.env,
      },
    });

    gcsEmulator.stdout?.on('data', (data) => {
      console.log(`   GCS: ${data.toString().trim()}`);
    });

    gcsEmulator.stderr?.on('data', (data) => {
      const msg = data.toString().trim();
      if (!msg.includes('WARNING')) {
        console.error(`   GCS Error: ${msg}`);
      }
    });

    // Set environment variable
    process.env.STORAGE_EMULATOR_HOST = 'localhost:9023';

    // Wait for emulator to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('✓ GCS Emulator started at localhost:9023');
  } catch (error) {
    console.warn('⚠️  Could not start GCS Emulator (tests may be limited):', error);
  }
}

/**
 * Wait for services to be ready
 */
async function waitForServices() {
  console.log('\n⏳ Waiting for services to be ready...');

  // Check GCS Emulator
  if (process.env.STORAGE_EMULATOR_HOST) {
    const maxAttempts = 30;
    let attempts = 0;
    let gcsReady = false;

    while (attempts < maxAttempts && !gcsReady) {
      try {
        const { Storage } = require('@google-cloud/storage');
        const storage = new Storage({
          apiEndpoint: `http://${process.env.STORAGE_EMULATOR_HOST}`,
          projectId: 'test-project',
        });

        // Try to list buckets
        await storage.getBuckets();
        gcsReady = true;
        console.log('✓ GCS Emulator ready');
      } catch (error) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!gcsReady) {
      console.warn('⚠️  GCS Emulator not ready after 30 seconds');
    }
  }

  // Check Form.io (if configured)
  if (process.env.FORMIO_URL) {
    console.log('Checking Form.io server...');
    const maxAttempts = 30;
    let attempts = 0;
    let formioReady = false;

    while (attempts < maxAttempts && !formioReady) {
      try {
        const axios = require('axios');
        const response = await axios.get(`${process.env.FORMIO_URL}/health`, {
          timeout: 2000,
        });

        if (response.status === 200) {
          formioReady = true;
          console.log('✓ Form.io server ready');
        }
      } catch (error) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!formioReady) {
      console.warn('⚠️  Form.io server not ready (integration tests may be skipped)');
    }
  }
}

/**
 * Initialize test data
 */
async function initializeTestData() {
  console.log('\n📊 Initializing test data...');

  // Create GCS test bucket
  if (process.env.STORAGE_EMULATOR_HOST) {
    try {
      const { Storage } = require('@google-cloud/storage');
      const storage = new Storage({
        apiEndpoint: `http://${process.env.STORAGE_EMULATOR_HOST}`,
        projectId: 'test-project',
      });

      const bucketName = process.env.GCS_BUCKET || 'test-bucket';
      const [buckets] = await storage.getBuckets();
      const bucketExists = buckets.some((b: any) => b.name === bucketName);

      if (!bucketExists) {
        await storage.createBucket(bucketName);
        console.log(`✓ Created test bucket: ${bucketName}`);
      } else {
        console.log(`✓ Test bucket exists: ${bucketName}`);
      }
    } catch (error) {
      console.error('❌ Failed to create test bucket:', error);
    }
  }

  // Initialize Form.io test forms (if available)
  if (process.env.FORMIO_PROJECT_URL) {
    try {
      const axios = require('axios');

      // Create test form for file uploads
      const testForm = {
        title: 'Test File Upload Form',
        name: 'test-file-upload-form',
        path: 'test-file-upload-form',
        type: 'form',
        display: 'form',
        components: [
          {
            type: 'file',
            label: 'Upload File',
            key: 'file',
            input: true,
            storage: 'url',
          },
          {
            type: 'textfield',
            label: 'File Name',
            key: 'fileName',
            input: true,
          },
          {
            type: 'button',
            label: 'Submit',
            key: 'submit',
            input: true,
            type: 'submit',
          },
        ],
      };

      await axios.post(`${process.env.FORMIO_PROJECT_URL}/form`, testForm, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('✓ Created test Form.io form');
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('✓ Test Form.io form already exists');
      } else {
        console.warn('⚠️  Could not create test form:', error.message);
      }
    }
  }
}

/**
 * Create test fixtures directory
 */
async function createTestFixtures() {
  console.log('\n📁 Creating test fixtures...');

  const fs = require('fs/promises');
  const fixturesDir = path.resolve(__dirname, '../fixtures');

  try {
    await fs.mkdir(fixturesDir, { recursive: true });
    console.log(`✓ Fixtures directory ready: ${fixturesDir}`);
  } catch (error) {
    console.error('❌ Failed to create fixtures directory:', error);
  }
}

export default globalSetup;