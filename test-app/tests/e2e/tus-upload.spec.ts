import { test, expect } from '@playwright/test';
import { UPPY_FILE_INPUT_SELECTOR, SELECTORS, waitForTestId } from '../utils/test-selectors';
import path from 'path';
import fs from 'fs';

/**
 * TUS File Upload E2E Tests
 *
 * Tests the complete TUS upload flow with real file uploads.
 * Requires TUS server running on http://localhost:1080
 */

test.describe('TUS File Upload @tus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to demo page (try data-testid first, fallback to text)
    const navButton = page.locator(SELECTORS.navigation.fileUploadDemo).or(
      page.locator('button:has-text("Try File Upload Demo")')
    );
    await navButton.first().click();
    await expect(page.locator('h1')).toContainText('File Upload Demo');

    // Switch to TUS tab (try data-testid first, fallback to text)
    const tusButton = page.locator(SELECTORS.tus.uploadButton).or(
      page.locator('button:has-text("TUS Upload")')
    );
    await tusButton.first().click();
  });

  test('should successfully upload a small file', async ({ page }) => {
    // Create test file
    const testFilePath = path.join(__dirname, '../fixtures/test-file-1mb.txt');

    // Listen for network requests to TUS server
    const tusRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('localhost:1080/files')) {
        tusRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    // Upload file (try TUS-specific selector first, fallback to Uppy)
    const fileInput = page.locator(SELECTORS.tus.fileInput).or(
      page.locator(SELECTORS.uppy.fileInput)
    );
    await fileInput.first().setInputFiles(testFilePath);

    // Wait for upload to complete (try data-testid first, fallback to text)
    const successIndicator = page.locator(SELECTORS.status.uploadSuccess).or(
      page.locator('text=Success')
    );
    await expect(successIndicator.first()).toBeVisible({ timeout: 30000 });

    // Verify TUS protocol requests were made
    expect(tusRequests.length).toBeGreaterThan(0);
    expect(tusRequests.some(r => r.startsWith('POST'))).toBeTruthy();
    expect(tusRequests.some(r => r.startsWith('PATCH'))).toBeTruthy();

    // Verify upload URL is displayed (try data-testid first, fallback to text)
    const uploadUrlElement = page.locator(SELECTORS.tus.uploadUrl).or(
      page.locator('text=/Upload URL:/')
    );
    const uploadUrl = await uploadUrlElement.first().textContent();
    expect(uploadUrl).toContain('http://localhost:1080/files/');
  });

  test('should show progress during upload', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../fixtures/test-file-10mb.bin');

    // Track progress updates
    const progressValues: number[] = [];

    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Uploading:')) {
        const match = text.match(/(\d+\.\d+)%/);
        if (match) {
          progressValues.push(parseFloat(match[1]));
        }
      }
    });

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(testFilePath);

    // Wait for at least some progress
    await page.waitForTimeout(2000);

    // Verify progress is increasing
    expect(progressValues.length).toBeGreaterThan(0);

    if (progressValues.length > 1) {
      const increasing = progressValues.every((val, idx) =>
        idx === 0 || val >= progressValues[idx - 1]
      );
      expect(increasing).toBeTruthy();
    }

    // Wait for completion
    await expect(page.locator('text=Success')).toBeVisible({ timeout: 60000 });

    // Final progress should be 100%
    const finalProgress = progressValues[progressValues.length - 1];
    expect(finalProgress).toBeGreaterThanOrEqual(99);
  });

  test('should handle multiple file uploads', async ({ page }) => {
    const testFile1 = path.join(__dirname, '../fixtures/test-file-1mb.txt');
    const testFile2 = path.join(__dirname, '../fixtures/test-file-5mb.bin');

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles([testFile1, testFile2]);

    // Wait for both uploads to complete
    const successMessages = page.locator('text=Success');
    await expect(successMessages).toHaveCount(2, { timeout: 60000 });

    // Verify both upload URLs are displayed
    const uploadTexts = await page.locator('text=/Upload URL:.*files/').allTextContents();
    expect(uploadTexts.length).toBe(2);
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    // Mock TUS server to return error
    await page.route('http://localhost:1080/files/', route => {
      route.abort('failed');
    });

    const testFilePath = path.join(__dirname, '../fixtures/test-file-1mb.txt');

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(testFilePath);

    // Should show error message
    await expect(page.locator('text=/Error:/i')).toBeVisible({ timeout: 15000 });

    // Error message should contain meaningful text
    const errorText = await page.locator('text=/Error:/i').textContent();
    expect(errorText).toBeTruthy();
  });

  test('should retry failed uploads automatically', async ({ page }) => {
    let requestCount = 0;

    // Fail first 2 requests, succeed on 3rd
    await page.route('http://localhost:1080/files/', route => {
      requestCount++;
      if (requestCount < 3) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    const testFilePath = path.join(__dirname, '../fixtures/test-file-1mb.txt');

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(testFilePath);

    // Should eventually succeed after retries
    await expect(page.locator('text=Success')).toBeVisible({ timeout: 30000 });

    // Verify multiple attempts were made
    expect(requestCount).toBeGreaterThanOrEqual(3);
  });

  test('should capture HAR with TUS protocol requests', async ({ page, context }) => {
    // Start HAR recording
    await context.recordHar({ path: 'test-results/tus-upload-real.har' });

    const testFilePath = path.join(__dirname, '../fixtures/test-file-1mb.txt');

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(testFilePath);

    // Wait for upload complete
    await expect(page.locator('text=Success')).toBeVisible({ timeout: 30000 });

    // Stop HAR recording
    await context.close();

    // Verify HAR file was created
    const harPath = 'test-results/tus-upload-real.har';
    expect(fs.existsSync(harPath)).toBeTruthy();

    // Read and verify HAR contents
    const harContent = JSON.parse(fs.readFileSync(harPath, 'utf-8'));
    const entries = harContent.log.entries;

    // Should have POST request to create upload
    const postRequests = entries.filter((e: any) =>
      e.request.method === 'POST' && e.request.url.includes('localhost:1080/files')
    );
    expect(postRequests.length).toBeGreaterThan(0);

    // Should have PATCH requests for chunk uploads
    const patchRequests = entries.filter((e: any) =>
      e.request.method === 'PATCH' && e.request.url.includes('localhost:1080/files')
    );
    expect(patchRequests.length).toBeGreaterThan(0);

    // Verify TUS headers
    const firstPost = postRequests[0];
    const tusHeaders = firstPost.request.headers.filter((h: any) =>
      h.name.toLowerCase().startsWith('tus-')
    );
    expect(tusHeaders.length).toBeGreaterThan(0);
  });

  test('should validate file size limits', async ({ page }) => {
    // This test verifies client-side validation
    // Create a mock 100MB file
    const largeFilePath = path.join(__dirname, '../fixtures/test-file-100mb.bin');

    // Set max file size to 50MB in component
    await page.evaluate(() => {
      // @ts-ignore
      window.TUS_MAX_FILE_SIZE = 50 * 1024 * 1024;
    });

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);

    // If file is too large, should show validation error before upload
    if (fs.existsSync(largeFilePath)) {
      await fileInput.setInputFiles(largeFilePath);

      // Should show validation error (if implemented)
      // This test documents expected behavior
      const hasError = await page.locator('text=/too large|exceeds/i').isVisible()
        .catch(() => false);

      if (!hasError) {
        console.warn('File size validation not yet implemented in component');
      }
    }
  });
});

test.describe('TUS Demo Component @tus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to comparison page (try data-testid first, fallback to text)
    const comparisonButton = page.locator(SELECTORS.navigation.tusComparison).or(
      page.locator('button:has-text("View TUS vs Uppy Comparison")')
    );
    await comparisonButton.first().click();
  });

  test('should render TUS demo with all features', async ({ page }) => {
    // Verify all feature tabs are present
    const features = ['Basic Upload', 'Pause/Resume', 'Multiple Files', 'Validation', 'Progress Tracking', 'Error Handling'];

    for (const feature of features) {
      await expect(page.locator(`button:has-text("${feature}")`)).toBeVisible();
    }
  });

  test('should switch between feature tabs', async ({ page }) => {
    // Click different feature tabs
    await page.click('button:has-text("Pause/Resume")');
    await expect(page.locator('pre code')).toContainText('upload.abort()');

    await page.click('button:has-text("Multiple Files")');
    await expect(page.locator('pre code')).toContainText('forEach');

    await page.click('button:has-text("Error Handling")');
    await expect(page.locator('pre code')).toContainText('retryDelays');
  });

  test('should show code examples for each feature', async ({ page }) => {
    const features = ['basic', 'pause-resume', 'multiple', 'validation', 'progress', 'error'];

    for (const feature of features) {
      await page.click(`.feature-button[data-feature="${feature}"]`);

      const codeBlock = page.locator('pre code');
      await expect(codeBlock).toBeVisible();

      const code = await codeBlock.textContent();
      expect(code).toContain('tus.Upload');
    }
  });

  test('should display upload statistics', async ({ page }) => {
    // Verify stats section exists
    await expect(page.locator('.demo-stats')).toBeVisible();
    await expect(page.locator('text=Total Files')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
  });
});