/**
 * Global Setup for E2E Tests
 * Runs once before all tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Running global setup...');

  const formioUrl = process.env.FORMIO_URL || 'http://localhost:3001';

  // Wait for Form.io server to be ready
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let retries = 30;
  let ready = false;

  while (retries > 0 && !ready) {
    try {
      const response = await page.goto(`${formioUrl}/health`, {
        waitUntil: 'networkidle',
        timeout: 5000,
      });

      if (response && response.ok()) {
        ready = true;
        console.log('✅ Form.io server is ready');
      }
    } catch (error) {
      console.log(`⏳ Waiting for Form.io server... (${retries} retries left)`);
      retries--;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (!ready) {
    throw new Error('❌ Form.io server did not become ready in time');
  }

  // Optional: Create test admin user if needed
  // await setupTestUser(page, formioUrl);

  await browser.close();

  console.log('✅ Global setup complete');
}

export default globalSetup;