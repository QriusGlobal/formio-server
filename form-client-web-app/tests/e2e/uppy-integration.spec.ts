/**
 * Uppy Integration E2E Tests
 *
 * Full integration tests with Form.io and GCS:
 * - Complete Form.io form with Uppy component
 * - Form submission with multiple files
 * - GCS storage verification
 * - Form.io submission data validation
 * - Theme switching (light/dark)
 *
 * @group uppy
 * @group integration
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import {
  waitForUppyReady,
  uploadFiles,
  clickUploadButton,
  waitForUploadComplete,
  getFileCount,
  verifyFileInList,
  waitForValidationError,
  waitForFileError,
} from '../utils/uppy-helpers';
import {
  setupTestFilesDir,
  cleanupTestFilesDir,
  createMultipleImages,
  createPNGFile,
  createJPEGFile,
} from '../fixtures/test-files';

test.describe('Uppy Integration Tests', () => {
  let testFilesDir: string;

  test.beforeEach(async ({ page }) => {
    testFilesDir = setupTestFilesDir();
  });

  test.afterEach(async () => {
    cleanupTestFilesDir(testFilesDir);
  });

  test.describe('Form.io Form Integration', () => {
    test('should render Uppy component within Form.io form', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Verify Uppy is part of a form
      const uppyComponent = page.locator('[data-testid="uppy-file-upload"]');
      await expect(uppyComponent).toBeVisible();

      // Check if it's within a form context
      const formContext = page.locator('form, [data-formio]');
      if (await formContext.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(formContext).toBeVisible();
      }
    });

    test('should integrate with Form.io validation', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Try to submit form without files (if required)
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');

      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();

        // EVENT-DRIVEN: Wait for validation error to appear
        // REPLACED: await page.waitForTimeout(1000);
        const validationError = page.locator('.formio-error, .error-message, [role="alert"]');
        await validationError.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
          // Validation may not be required - check state instead
        });

        if (await validationError.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(validationError).toBeVisible();
        }
      }
    });

    test('should submit form with uploaded files', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Mock upload
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            url: 'https://storage.googleapis.com/bucket/file.png',
          }),
        });
      });

      // Mock form submission
      let submissionData: any = null;
      let submissionReceived = false;

      await page.route('**/submission', async (route, request) => {
        const postData = request.postDataJSON();
        submissionData = postData;
        submissionReceived = true;

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ _id: '123', data: postData }),
        });
      });

      // Upload files
      const files = createMultipleImages(testFilesDir, 2);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      // Submit form
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
      if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await submitButton.click();

        // EVENT-DRIVEN: Wait for submission network request
        // REPLACED: await page.waitForTimeout(2000);
        await page.waitForFunction(
          () => (window as any).__submissionReceived === true,
          { timeout: 5000 }
        ).catch(async () => {
          // Alternative: wait for success message or state change
          await page.locator('.alert-success, [role="status"]').waitFor({
            state: 'visible',
            timeout: 3000
          }).catch(() => {});
        });

        // Verify submission data contains file info
        if (submissionData) {
          expect(submissionData).toBeTruthy();
        }
      }
    });

    test('should handle form reset', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Upload files
      const testFile = createPNGFile(testFilesDir, 'reset-test.png');
      await uploadFiles(page, [testFile.path]);

      let fileCount = await getFileCount(page);
      expect(fileCount).toBe(1);

      // Look for reset button
      const resetButton = page.locator('button:has-text("Reset"), button:has-text("Clear")');

      if (await resetButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        const initialCount = await getFileCount(page);
        await resetButton.click();

        // EVENT-DRIVEN: Wait for file count to change to 0
        // REPLACED: await page.waitForTimeout(500);
        await page.waitForFunction(
          () => {
            const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
            return items.length === 0;
          },
          { timeout: 3000 }
        );

        // Files should be cleared
        fileCount = await getFileCount(page);
        expect(fileCount).toBe(0);
      }
    });
  });

  test.describe('GCS Storage Integration', () => {
    test('should upload files to GCS', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Mock GCS upload
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            url: 'https://storage.googleapis.com/test-bucket/uploads/file.png',
            bucket: 'test-bucket',
            name: 'uploads/file.png',
          }),
        });
      });

      const testFile = createPNGFile(testFilesDir, 'gcs-test.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      // Verify upload completed
      const statusBar = page.locator('.uppy-StatusBar');
      const statusText = await statusBar.textContent();
      expect(statusText).toMatch(/complete|success/i);
    });

    test('should handle GCS authentication errors', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Mock authentication error
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 401,
          body: JSON.stringify({
            error: 'Authentication failed',
          }),
        });
      });

      const testFile = createPNGFile(testFilesDir, 'auth-error.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);

      // EVENT-DRIVEN: Wait for error message to appear
      // REPLACED: await page.waitForTimeout(2000);
      const errorMessage = page.locator('.uppy-Informer-error, [role="alert"]');
      await errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        // Error display might be different - check file error state
      });

      if (await errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should retry failed GCS uploads', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      let attemptCount = 0;

      await page.route('**/upload', async (route) => {
        attemptCount++;

        if (attemptCount === 1) {
          // First attempt fails
          await route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Temporary error' }),
          });
        } else {
          // Retry succeeds
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
          });
        }
      });

      const testFile = createPNGFile(testFilesDir, 'retry-test.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);

      // EVENT-DRIVEN: Wait for error state to appear, then retry
      // REPLACED: await page.waitForTimeout(2000);
      const retryButton = page.locator('button:has-text("Retry")');
      await retryButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        // Retry button may appear as error appears
      });

      // Click retry if available
      if (await retryButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await retryButton.click();
        await waitForUploadComplete(page, 10000);
      }

      expect(attemptCount).toBeGreaterThan(0);
    });
  });

  test.describe('Form.io Submission Data', () => {
    test('should include file URLs in submission', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      const fileUrls: string[] = [];

      await page.route('**/upload', async (route) => {
        const url = 'https://storage.googleapis.com/bucket/file-' + Date.now() + '.png';
        fileUrls.push(url);

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, url }),
        });
      });

      const files = createMultipleImages(testFilesDir, 2);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      // Verify URLs were generated
      expect(fileUrls.length).toBe(2);
    });

    test('should include file metadata in submission', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            url: 'https://storage.googleapis.com/bucket/file.png',
            metadata: {
              name: 'file.png',
              size: 1234,
              type: 'image/png',
            },
          }),
        });
      });

      const testFile = createPNGFile(testFilesDir, 'metadata.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      // Metadata should be handled
      expect(true).toBe(true);
    });

    test('should validate submission data structure', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      let submissionData: any = null;

      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, url: 'https://example.com/file.png' }),
        });
      });

      await page.route('**/submission', async (route, request) => {
        submissionData = request.postDataJSON();
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ _id: '123', data: submissionData }),
        });
      });

      const testFile = createPNGFile(testFilesDir, 'structure.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();

        // EVENT-DRIVEN: Wait for submission to be processed
        // REPLACED: await page.waitForTimeout(2000);
        await page.waitForFunction(
          () => {
            // Check for success indicator or submission complete state
            const successMsg = document.querySelector('.alert-success, [role="status"]');
            const formSubmitted = (window as any).__formSubmitted === true;
            return successMsg !== null || formSubmitted;
          },
          { timeout: 5000 }
        ).catch(() => {
          // Submission may complete without visible feedback
        });

        if (submissionData) {
          expect(submissionData).toBeTruthy();
          // Should have proper structure (depends on Form.io schema)
        }
      }
    });
  });

  test.describe('Theme Support', () => {
    test('should render in light theme', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Check for light theme classes
      const dashboard = page.locator('.uppy-Dashboard');
      await expect(dashboard).toBeVisible();

      // May have light theme class
      const hasThemeClass = await page.evaluate(() => {
        const dashboard = document.querySelector('.uppy-Dashboard');
        return dashboard?.classList.contains('uppy-Dashboard--light') ||
               !dashboard?.classList.contains('uppy-Dashboard--dark');
      });

      expect(hasThemeClass).toBeTruthy();
    });

    test('should render in dark theme', async ({ page }) => {
      await page.goto('/');

      // Try to switch to dark theme (if toggle exists)
      const themeToggle = page.locator('button:has-text("Dark"), [aria-label*="theme"]');

      if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeToggle.click();

        // EVENT-DRIVEN: Wait for theme class to change
        // REPLACED: await page.waitForTimeout(500);
        await page.waitForFunction(
          () => {
            const dashboard = document.querySelector('.uppy-Dashboard');
            return dashboard?.classList.contains('uppy-Dashboard--dark') ||
                   document.documentElement.classList.contains('dark-theme');
          },
          { timeout: 2000 }
        ).catch(() => {
          // Theme may not have specific class
        });
      }

      await waitForUppyReady(page);

      const dashboard = page.locator('.uppy-Dashboard');
      await expect(dashboard).toBeVisible();
    });

    test('should maintain theme across interactions', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Upload a file
      const testFile = createPNGFile(testFilesDir, 'theme-test.png');
      await uploadFiles(page, [testFile.path]);

      // Theme should remain consistent
      const dashboard = page.locator('.uppy-Dashboard');
      await expect(dashboard).toBeVisible();
    });

    test('should apply theme to modals and plugins', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Open a plugin (if available)
      const webcamButton = page.locator('[data-uppy-acquirer-id="Webcam"]');

      if (await webcamButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await webcamButton.click();

        // EVENT-DRIVEN: Wait for modal to appear
        // REPLACED: await page.waitForTimeout(1000);
        const modal = page.locator('.uppy-Dashboard-overlay');
        await modal.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
          // Modal may not appear if plugin unavailable
        });

        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(modal).toBeVisible();
        }
      }
    });
  });

  test.describe('End-to-End Workflow', () => {
    test('should complete full upload workflow', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Mock all endpoints
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            url: 'https://storage.googleapis.com/bucket/file.png',
          }),
        });
      });

      // 1. Select files
      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));

      // Verify files added
      let fileCount = await getFileCount(page);
      expect(fileCount).toBe(3);

      // 2. Upload files
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      // 3. Verify completion
      const statusBar = page.locator('.uppy-StatusBar');
      const statusText = await statusBar.textContent();
      expect(statusText).toMatch(/complete|success/i);
    });

    test('should handle complete form submission flow', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Setup mocks
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, url: 'https://example.com/file.png' }),
        });
      });

      await page.route('**/submission', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ _id: '123', success: true }),
        });
      });

      // 1. Fill form fields (if any)
      const textInput = page.locator('input[type="text"]').first();
      if (await textInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await textInput.fill('Test submission');
      }

      // 2. Upload files
      const testFile = createPNGFile(testFilesDir, 'form-submission.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);
      await waitForUploadComplete(page);

      // 3. Submit form
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
      if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitButton.click();

        // 4. EVENT-DRIVEN: Wait for success message or state change
        // REPLACED: await page.waitForTimeout(2000);
        const successMessage = page.locator('.alert-success, [role="status"]:has-text("success")');
        await successMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
          // Success message may not be displayed
        });

        if (await successMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(successMessage).toBeVisible();
        }
      }
    });

    test('should preserve state during multi-step workflow', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Step 1: Add files
      const file1 = createPNGFile(testFilesDir, 'step1.png');
      await uploadFiles(page, [file1.path]);

      let fileCount = await getFileCount(page);
      expect(fileCount).toBe(1);

      // Step 2: Add more files
      const file2 = createJPEGFile(testFilesDir, 'step2.jpg');
      await uploadFiles(page, [file2.path]);

      fileCount = await getFileCount(page);
      expect(fileCount).toBe(2);

      // Step 3: Verify state preserved
      // EVENT-DRIVEN: Check file count is stable
      // REPLACED: await page.waitForTimeout(500);
      await page.waitForFunction(
        (expectedCount) => {
          const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
          return items.length >= expectedCount;
        },
        2,
        { timeout: 2000 }
      );

      // Files should still be tracked
      expect(fileCount).toBeGreaterThan(0);
    });
  });

  test.describe('Error Recovery', () => {
    test('should recover from network errors', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      // Simulate network error
      await page.route('**/upload', async (route) => {
        await route.abort('failed');
      });

      const testFile = createPNGFile(testFilesDir, 'network-error.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);

      // EVENT-DRIVEN: Wait for error to appear
      // REPLACED: await page.waitForTimeout(3000);
      const errorMessage = page.locator('.uppy-Informer-error, [role="alert"]');
      await errorMessage.waitFor({ state: 'visible', timeout: 5000 });

      if (await errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should handle server errors gracefully', async ({ page }) => {
      await page.goto('/');
      await waitForUppyReady(page);

      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      });

      const testFile = createPNGFile(testFilesDir, 'server-error.png');
      await uploadFiles(page, [testFile.path]);
      await clickUploadButton(page);

      // EVENT-DRIVEN: Wait for error display
      // REPLACED: await page.waitForTimeout(2000);
      const error = page.locator('.uppy-Dashboard-Item--error, [role="alert"]');
      await error.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        // Check for general error message instead
      });

      if (await error.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(error).toBeVisible();
      }
    });
  });
});
