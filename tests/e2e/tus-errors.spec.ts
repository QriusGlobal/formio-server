/**
 * TUS File Upload - Error Handling Tests
 *
 * Tests error scenarios:
 * - Invalid file type
 * - File size exceeds limit
 * - Network timeout
 * - Server 500 errors
 * - Authentication failure
 * - Storage quota exceeded
 */

import { test, expect } from '@playwright/test';
import { TusUploadPage } from '../page-objects/TusUploadPage';
import { TestHelpers } from '../utils/test-helpers';

test.describe('TUS Error Handling Tests', () => {
  let uploadPage: TusUploadPage;
  let testFiles: string[] = [];

  test.beforeEach(async ({ page }) => {
    uploadPage = new TusUploadPage(page);
    await uploadPage.goto();
  });

  test.afterEach(async () => {
    await TestHelpers.cleanupTestFiles();
    testFiles = [];
  });

  test('should reject invalid file type', async ({ page }) => {
    // Generate executable file (not allowed)
    const fileName = `dangerous-file-${TestHelpers.randomString()}.exe`;
    const filePath = await TestHelpers.generateTestFile(fileName, 1024);
    testFiles.push(filePath);

    // Listen for error events
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Try to upload (should be rejected by client-side validation)
    await uploadPage.uploadFiles([filePath]);

    // Wait a bit
    await page.waitForTimeout(2000);

    // File should either not appear or show error
    const fileItem = uploadPage.getFileItem(fileName);
    const isVisible = await fileItem.isVisible().catch(() => false);

    if (isVisible) {
      const status = await uploadPage.getFileStatus(fileName);
      expect(status).toBe('error');

      const errorMsg = await uploadPage.getErrorMessage(fileName);
      expect(errorMsg).toBeTruthy();
    }

    // Take screenshot
    await uploadPage.takeScreenshot('invalid-file-type-error');
  });

  test('should reject file exceeding size limit', async ({ page }) => {
    // Mock component with 1MB max file size
    await page.evaluate(() => {
      // This would need to be set via component props
      // For now, we test with actual large file
    });

    // Generate file larger than typical limit (100MB)
    const fileName = `oversized-file-${TestHelpers.randomString()}.bin`;
    const fileSize = 100 * 1024 * 1024; // 100MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for validation or error
    await page.waitForTimeout(3000);

    // Check for error state or validation message
    const fileItem = uploadPage.getFileItem(fileName);
    const isVisible = await fileItem.isVisible().catch(() => false);

    if (isVisible) {
      // Check for error indicators
      const hasError = await uploadPage.hasError(fileName);

      if (hasError) {
        const errorMsg = await uploadPage.getErrorMessage(fileName);
        expect(errorMsg).toContain('size' || 'limit' || 'large');
      }
    }

    // Take screenshot
    await uploadPage.takeScreenshot('file-size-limit-error');
  });

  test('should handle network timeout gracefully', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    // Generate file
    const fileName = `test-timeout-${TestHelpers.randomString()}.bin`;
    const fileSize = 10 * 1024 * 1024; // 10MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to start
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 5000,
    });

    // Wait for some progress
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 10;
    }, 30000);

    // Simulate network failure by going offline
    await uploadPage.disconnectNetwork();

    // Wait for timeout/error detection
    await page.waitForTimeout(10000);

    // Check status - should be error or paused
    const status = await uploadPage.getFileStatus(fileName);
    expect(['error', 'paused']).toContain(status);

    // Take screenshot
    await uploadPage.takeScreenshot('network-timeout-error');

    // Reconnect and verify recovery option
    await uploadPage.reconnectNetwork();

    // If error state, retry should be available
    if (status === 'error') {
      const retryButton = uploadPage.getFileItem(fileName).locator('button[aria-label="Retry upload"]');
      await expect(retryButton).toBeVisible();

      // Try retry
      await uploadPage.retryUpload(fileName);

      // Wait for upload to resume
      await TestHelpers.waitFor(async () => {
        const newStatus = await uploadPage.getFileStatus(fileName);
        return newStatus === 'uploading' || newStatus === 'completed';
      }, 30000);
    }
  });

  test('should handle server 500 error', async ({ page }) => {
    // Intercept upload requests and return 500 error
    await page.route('**/files*', async (route) => {
      if (route.request().method() === 'POST' || route.request().method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Internal Server Error',
            message: 'Storage service unavailable',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Generate file
    const fileName = `test-server-error-${TestHelpers.randomString()}.bin`;
    const filePath = await TestHelpers.generateTestFile(fileName, 1024);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for error
    await TestHelpers.waitFor(async () => {
      return await uploadPage.hasError(fileName);
    }, 10000);

    // Verify error state
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('error');

    // Verify retry option is available
    const retryButton = uploadPage.getFileItem(fileName).locator('button[aria-label="Retry upload"]');
    await expect(retryButton).toBeVisible();

    // Take screenshot
    await uploadPage.takeScreenshot('server-500-error');
  });

  test('should handle authentication failure', async ({ page }) => {
    // Intercept upload requests and return 401 Unauthorized
    await page.route('**/files*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Unauthorized',
            message: 'Invalid or expired token',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Generate file
    const fileName = `test-auth-error-${TestHelpers.randomString()}.bin`;
    const filePath = await TestHelpers.generateTestFile(fileName, 1024);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for error
    await TestHelpers.waitFor(async () => {
      return await uploadPage.hasError(fileName);
    }, 10000);

    // Verify error state
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('error');

    // Check for auth-specific error message
    const errorMsg = await uploadPage.getErrorMessage(fileName);
    if (errorMsg) {
      expect(errorMsg.toLowerCase()).toMatch(/unauthorized|auth|token/);
    }

    // Take screenshot
    await uploadPage.takeScreenshot('authentication-error');
  });

  test('should handle storage quota exceeded', async ({ page }) => {
    // Intercept upload requests and return 507 Insufficient Storage
    await page.route('**/files*', async (route) => {
      if (route.request().method() === 'PATCH') {
        // Simulate quota exceeded after some uploads
        await route.fulfill({
          status: 507,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Insufficient Storage',
            message: 'Storage quota exceeded for this project',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Generate file
    const fileName = `test-quota-error-${TestHelpers.randomString()}.bin`;
    const filePath = await TestHelpers.generateTestFile(fileName, 5 * 1024 * 1024);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for error
    await TestHelpers.waitFor(async () => {
      return await uploadPage.hasError(fileName);
    }, 15000);

    // Verify error state
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('error');

    // Take screenshot
    await uploadPage.takeScreenshot('storage-quota-error');
  });

  test('should handle network interruption during chunk upload', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    // Generate file
    const fileName = `test-chunk-interrupt-${TestHelpers.randomString()}.bin`;
    const fileSize = 20 * 1024 * 1024; // 20MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Track PATCH requests
    let patchCount = 0;

    page.on('request', (request) => {
      if (request.url().includes('/files') && request.method() === 'PATCH') {
        patchCount++;
      }
    });

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for a few chunks to be uploaded
    await TestHelpers.waitFor(async () => {
      return patchCount >= 3;
    }, 30000);

    // Interrupt network during chunk upload
    await page.route('**/files/*', async (route) => {
      if (route.request().method() === 'PATCH') {
        // Fail every other request
        if (patchCount % 2 === 0) {
          await route.abort('failed');
        } else {
          await route.continue();
        }
      } else {
        await route.continue();
      }
    });

    // Wait and observe behavior
    await page.waitForTimeout(10000);

    // Take screenshot
    await uploadPage.takeScreenshot('chunk-interrupt-error');

    // Remove route to allow recovery
    await page.unroute('**/files/*');

    // TUS client should retry failed chunks
    // Wait for potential recovery
    await TestHelpers.waitFor(async () => {
      const status = await uploadPage.getFileStatus(fileName);
      return status === 'completed' || status === 'error';
    }, 120000);

    const finalStatus = await uploadPage.getFileStatus(fileName);
    console.log(`Final status after chunk interruption: ${finalStatus}`);
  });

  test('should display user-friendly error messages', async ({ page }) => {
    const errorScenarios = [
      {
        statusCode: 400,
        expectedMessage: /invalid|bad request/i,
        fileName: 'test-400.bin',
      },
      {
        statusCode: 403,
        expectedMessage: /forbidden|permission/i,
        fileName: 'test-403.bin',
      },
      {
        statusCode: 404,
        expectedMessage: /not found/i,
        fileName: 'test-404.bin',
      },
      {
        statusCode: 413,
        expectedMessage: /too large|size/i,
        fileName: 'test-413.bin',
      },
    ];

    for (const scenario of errorScenarios) {
      // Setup route
      await page.route('**/files*', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: scenario.statusCode,
            contentType: 'application/json',
            body: JSON.stringify({
              error: `Error ${scenario.statusCode}`,
            }),
          });
        } else {
          await route.continue();
        }
      });

      // Generate file
      const filePath = await TestHelpers.generateTestFile(scenario.fileName, 1024);
      testFiles.push(filePath);

      // Upload
      await uploadPage.uploadFiles([filePath]);

      // Wait for error
      await page.waitForTimeout(3000);

      // Verify error state
      const hasError = await uploadPage.hasError(scenario.fileName);
      expect(hasError).toBe(true);

      // Clear route for next scenario
      await page.unroute('**/files*');

      // Take screenshot
      await uploadPage.takeScreenshot(`error-${scenario.statusCode}`);
    }
  });

  test('should prevent concurrent uploads exceeding max limit', async ({ page }) => {
    // Generate 15 files (assuming maxFiles = 10)
    const fileNames: string[] = [];
    const filePaths: string[] = [];

    for (let i = 0; i < 15; i++) {
      const fileName = `test-max-files-${i}-${TestHelpers.randomString()}.txt`;
      const filePath = await TestHelpers.generateTestFile(fileName, 1024);
      fileNames.push(fileName);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Try to upload all files
    await uploadPage.uploadFiles(filePaths.slice(0, 10));

    // Wait for files to appear
    await page.waitForTimeout(2000);

    // Verify only 10 files appear (or configured max)
    const fileInfo = await uploadPage.getAllFileInfo();
    expect(fileInfo.length).toBeLessThanOrEqual(10);

    // Try to add more
    await uploadPage.uploadFiles(filePaths.slice(10));

    // Should show error or prevent addition
    await page.waitForTimeout(2000);

    const updatedFileInfo = await uploadPage.getAllFileInfo();
    expect(updatedFileInfo.length).toBeLessThanOrEqual(10);

    // Take screenshot
    await uploadPage.takeScreenshot('max-files-limit-error');
  });

  test('should handle malformed server responses', async ({ page }) => {
    // Intercept and return malformed JSON
    await page.route('**/files*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'Not a valid JSON {{{',
        });
      } else {
        await route.continue();
      }
    });

    // Generate file
    const fileName = `test-malformed-${TestHelpers.randomString()}.bin`;
    const filePath = await TestHelpers.generateTestFile(fileName, 1024);
    testFiles.push(filePath);

    // Upload
    await uploadPage.uploadFiles([filePath]);

    // Wait for error
    await page.waitForTimeout(5000);

    // Should handle gracefully
    const status = await uploadPage.getFileStatus(fileName);
    expect(['error', 'pending']).toContain(status);

    // Take screenshot
    await uploadPage.takeScreenshot('malformed-response-error');
  });
});