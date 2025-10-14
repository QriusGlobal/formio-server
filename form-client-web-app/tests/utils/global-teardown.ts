/**
 * Global Teardown for Playwright Tests
 *
 * Runs once after all tests complete
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { type FullConfig, chromium } from '@playwright/test';

import { GCSApiHelper, FormioApiHelper } from './api-helpers';
import { cleanupTestFiles } from './file-helpers';

async function globalTeardown(config: FullConfig) {
  console.log('\n🧹 Starting Playwright Test Cleanup...');

  const browser = await chromium.launch();
  const context = await browser.newContext();

  try {
    // 1. Clean up GCS test files
    console.log('✓ Cleaning up GCS test files...');
    const gcsHelper = new GCSApiHelper();
    const deletedCount = await gcsHelper.cleanupTestFiles(context.request);
    console.log(`  ✅ Deleted ${deletedCount} files from GCS`);

    // 2. Clean up Form.io test submissions (if form path is known)
    // Note: This requires knowing the form path, which should be passed via env
    const formPath = process.env.TEST_FORM_PATH;
    if (formPath) {
      console.log('✓ Cleaning up Form.io test submissions...');
      const formioHelper = new FormioApiHelper();
      const submissionCount = await formioHelper.cleanupTestSubmissions(
        context.request,
        formPath
      );
      console.log(`  ✅ Deleted ${submissionCount} test submissions`);
    }

    // 3. Clean up local test files
    console.log('✓ Cleaning up local test files...');
    await cleanupTestFiles();
    console.log('  ✅ Local test files cleaned up');

    // 4. Clean up test results (optional, keep for CI)
    if (!process.env.CI) {
      try {
        const resultsDir = path.join(__dirname, '../../test-results');
        await fs.rm(resultsDir, { recursive: true, force: true });
        console.log('  ✅ Test results cleaned up');
      } catch {
        // Ignore if directory doesn't exist
      }
    }

    console.log('✅ Global teardown completed successfully!\n');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown failures shouldn't fail the test suite
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalTeardown;