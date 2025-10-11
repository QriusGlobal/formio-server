/**
 * Example E2E Test Suite
 * This file demonstrates best practices for writing E2E tests
 */

import { test, expect } from './fixtures';

test.describe('Example Test Suite', () => {
  test.beforeEach(async ({ page, formioUrl }) => {
    // Navigate to the app before each test
    await page.goto(`${formioUrl}/`);
  });

  test('example smoke test @smoke @critical', async ({ page }) => {
    // This is a quick test that runs on pre-commit
    await expect(page).toHaveTitle(/Form\.io/);
  });

  test('example TUS upload test @tus', async ({ page }) => {
    // Test TUS resumable upload functionality
    const fileInput = page.locator('input[type="file"]');

    // Create a test file
    const buffer = Buffer.from('Test file content for TUS upload');
    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer,
    });

    // Wait for upload to complete
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible({
      timeout: 30000,
    });

    // Verify file appears in list
    await expect(page.locator('[data-testid="file-list"]')).toContainText('test-file.txt');
  });

  test('example Uppy UI test @uppy', async ({ page }) => {
    // Test Uppy UI component
    await page.click('[data-testid="upload-button"]');

    // Wait for Uppy modal to appear
    await expect(page.locator('.uppy-Dashboard')).toBeVisible();

    // Check for upload area
    await expect(page.locator('[data-testid="uppy-drop-area"]')).toBeVisible();
  });

  test('example edge case: large file @edge', async ({ page }) => {
    // Test large file upload
    const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'large-file.bin',
      mimeType: 'application/octet-stream',
      buffer: largeBuffer,
    });

    // Wait for chunked upload to complete
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible({
      timeout: 60000,
    });
  });

  test('example visual regression test @visual', async ({ page }) => {
    // Navigate to upload form
    await page.goto('/upload-form');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take and compare screenshot
    await expect(page).toHaveScreenshot('upload-form.png', {
      maxDiffPixels: 100, // Allow small differences
      threshold: 0.2, // 20% threshold
    });
  });

  test('example with custom timeout', async ({ page }) => {
    // Override default timeout for slow operations
    test.setTimeout(120000); // 2 minutes

    // Long-running operation
    await page.goto('/large-form');
    await page.waitForLoadState('networkidle', { timeout: 60000 });
  });

  test('example with retry logic', async ({ page }) => {
    // Retry flaky operations
    let retries = 3;
    while (retries > 0) {
      try {
        await page.click('[data-testid="submit-button"]');
        await expect(page.locator('[data-testid="success-message"]')).toBeVisible({
          timeout: 5000,
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await page.reload();
      }
    }
  });
});

test.describe('Authenticated Tests', () => {
  test.use({ storageState: 'auth-state.json' }); // Reuse auth state

  test('example authenticated test @critical', async ({ page, testUser }) => {
    // Already authenticated via storage state
    await page.goto('/dashboard');

    // Verify user is logged in
    await expect(page.locator('[data-testid="user-email"]')).toContainText(
      testUser.email
    );
  });
});

test.describe('Mobile Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone viewport

  test('example mobile test', async ({ page }) => {
    await page.goto('/');

    // Test mobile-specific UI
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
  });
});

test.describe('Network Conditions', () => {
  test('example slow network test @edge', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', (route) => {
      setTimeout(() => route.continue(), 1000); // 1 second delay
    });

    await page.goto('/');
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  });

  test('example offline test @edge', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    await page.goto('/');
    await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();
  });
});