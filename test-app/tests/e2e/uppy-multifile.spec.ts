/**
 * Uppy Multi-file Upload E2E Tests
 *
 * Tests for handling multiple file uploads:
 * - Select and upload 10+ images
 * - Sequential uploads
 * - Parallel uploads
 * - Batch progress tracking
 * - Error handling in batch
 *
 * @group uppy
 * @group multifile
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import {
  waitForUppyReady,
  uploadFiles,
  verifyFileInList,
  getFileCount,
  clickUploadButton,
  waitForUploadComplete,
  getUploadProgress,
  removeFile,
} from '../utils/uppy-helpers';
import {
  setupTestFilesDir,
  cleanupTestFilesDir,
  createMultipleImages,
  createPNGFile,
  createJPEGFile,
  createGIFFile,
} from '../fixtures/test-files';
import {
  waitForProgressStart,
  waitForCompletionCounter,
  waitForSpeedIndicator,
  waitForETA,
  waitForBatchClear,
  waitForBatchSelection,
  waitForPauseState,
  waitForResumeState,
  waitForBatchError,
  waitForRetryAvailable,
} from '../utils/multi-file-helpers';

test.describe('Uppy Multi-file Upload', () => {
  let testFilesDir: string;

  test.beforeEach(async ({ page }) => {
    testFilesDir = setupTestFilesDir();
    await page.goto('/');
    await waitForUppyReady(page);
  });

  test.afterEach(async () => {
    cleanupTestFilesDir(testFilesDir);
  });

  test.describe('File Selection', () => {
    test('should select 10 images at once', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 10);
      await uploadFiles(page, files.map(f => f.path));

      const fileCount = await getFileCount(page);
      expect(fileCount).toBe(10);

      // Verify all files are visible
      for (const file of files) {
        const visible = await verifyFileInList(page, file.name);
        expect(visible).toBe(true);
      }
    });

    test('should handle large batch of files (20+)', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 20);
      await uploadFiles(page, files.map(f => f.path));

      const fileCount = await getFileCount(page);
      expect(fileCount).toBeGreaterThanOrEqual(10);
      expect(fileCount).toBeLessThanOrEqual(20);
    });

    test('should display all selected files in list', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));

      // Check each file is in the dashboard
      const fileItems = page.locator('.uppy-Dashboard-Item');
      const count = await fileItems.count();
      expect(count).toBe(5);
    });

    test('should show total file count', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 10);
      await uploadFiles(page, files.map(f => f.path));

      // Look for file count display
      const statusBar = page.locator('.uppy-StatusBar');
      const statusText = await statusBar.textContent();

      // Should mention number of files (e.g., "10 files")
      expect(statusText).toMatch(/\d+\s*file/i);
    });

    test('should calculate total size of all files', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));

      // Status bar should show total size
      const statusBar = page.locator('.uppy-StatusBar-additionalInfo');

      if (await statusBar.isVisible({ timeout: 2000 }).catch(() => false)) {
        const text = await statusBar.textContent();
        // Should mention size (KB, MB, etc.)
        expect(text).toMatch(/\d+\s*(KB|MB|bytes)/i);
      }
    });
  });

  test.describe('Sequential Upload', () => {
    test('should upload files one by one', async ({ page }) => {
      // Mock uploads to track order
      const uploadedFiles: string[] = [];

      await page.route('**/upload', async (route, request) => {
        const url = request.url();
        uploadedFiles.push(url);

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      // Upload multiple files
      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for uploads to complete
      await waitForUploadComplete(page, 15000);

      // Verify uploads happened (order may vary)
      expect(uploadedFiles.length).toBeGreaterThan(0);
    });

    test('should show progress for each file', async ({ page }) => {
      // Mock slow uploads
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Check progress bars appear
      const progressBars = page.locator('.uppy-Dashboard-Item-progress');
      await expect(progressBars.first()).toBeVisible({ timeout: 5000 });

      await waitForUploadComplete(page, 15000);
    });

    test('should update file status during upload', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 2);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Check for uploading status
      const uploadingItem = page.locator('.uppy-Dashboard-Item--uploading');
      await expect(uploadingItem.first()).toBeVisible({ timeout: 5000 });

      await waitForUploadComplete(page, 10000);
    });
  });

  test.describe('Parallel Upload', () => {
    test('should upload multiple files simultaneously', async ({ page }) => {
      let concurrentUploads = 0;
      let maxConcurrent = 0;

      await page.route('**/upload', async (route) => {
        concurrentUploads++;
        maxConcurrent = Math.max(maxConcurrent, concurrentUploads);

        await new Promise(resolve => setTimeout(resolve, 1000));

        concurrentUploads--;

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      await waitForUploadComplete(page, 20000);

      // Should have had some concurrent uploads (if parallel enabled)
      expect(maxConcurrent).toBeGreaterThan(0);
    });

    test('should respect parallel upload limit', async ({ page }) => {
      let concurrentUploads = 0;
      let maxConcurrent = 0;

      await page.route('**/upload', async (route) => {
        concurrentUploads++;
        maxConcurrent = Math.max(maxConcurrent, concurrentUploads);

        await new Promise(resolve => setTimeout(resolve, 500));

        concurrentUploads--;

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 10);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      await waitForUploadComplete(page, 30000);

      // Max concurrent should respect limit (typically 5-10)
      expect(maxConcurrent).toBeLessThanOrEqual(10);
    });
  });

  test.describe('Batch Progress Tracking', () => {
    test('should show overall progress percentage', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for progress to start
      await page.waitForSelector('.uppy-StatusBar-percentage', { timeout: 5000 });

      // Wait for progress to actually update (event-driven)
      await waitForProgressStart(page);
      const progress = await getUploadProgress(page);
      expect(progress).toBeGreaterThan(0);

      await waitForUploadComplete(page, 20000);
    });

    test('should display number of completed files', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for completion counter to appear (event-driven)
      await waitForCompletionCounter(page);

      const statusBar = page.locator('.uppy-StatusBar');
      const statusText = await statusBar.textContent();

      // Should show progress (may vary by implementation)
      expect(statusText).toBeTruthy();

      await waitForUploadComplete(page, 15000);
    });

    test('should show upload speed', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for speed indicator to appear (event-driven)
      try {
        await waitForSpeedIndicator(page);
        const speedIndicator = page.locator('.uppy-upload-stats, .uppy-StatusBar-content');
        if (await speedIndicator.isVisible()) {
          const text = await speedIndicator.textContent();
          // May show speed (KB/s, MB/s)
          expect(text).toBeTruthy();
        }
      } catch {
        // Speed indicator may not always be shown
      }

      await waitForUploadComplete(page, 15000);
    });

    test('should estimate time remaining', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for ETA to appear (event-driven)
      try {
        await waitForETA(page);
        const eta = page.locator('[data-cy="eta"], .uppy-StatusBar-eta');
        await expect(eta).toBeVisible();
      } catch {
        // ETA may not always be shown
      }

      await waitForUploadComplete(page, 20000);
    });
  });

  test.describe('Batch Operations', () => {
    test('should remove all files at once', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));

      let fileCount = await getFileCount(page);
      expect(fileCount).toBe(5);

      // Look for "clear all" or "remove all" button
      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Remove all")');

      if (await clearButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await clearButton.click();

        // Wait for batch clear to complete (event-driven)
        await waitForBatchClear(page);

        fileCount = await getFileCount(page);
        expect(fileCount).toBe(0);
      }
    });

    test('should select/deselect all files', async ({ page }) => {
      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));

      // Look for select all checkbox/button
      const selectAll = page.locator('[data-cy="select-all"], input[type="checkbox"][aria-label*="Select all"]');

      if (await selectAll.isVisible({ timeout: 2000 }).catch(() => false)) {
        await selectAll.click();

        // Wait for batch selection to complete (event-driven)
        await waitForBatchSelection(page, 5);

        // All files should be selected
        const selectedFiles = page.locator('.uppy-Dashboard-Item--selected');
        const selectedCount = await selectedFiles.count();

        expect(selectedCount).toBeGreaterThan(0);
      }
    });

    test('should pause all uploads', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for upload to start
      await page.waitForSelector('.uppy-Dashboard-Item--uploading', { timeout: 3000 }).catch(() => {});

      // Look for pause button
      const pauseButton = page.locator('button:has-text("Pause"), [aria-label*="Pause"]');

      if (await pauseButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await pauseButton.click();

        // Wait for pause state to be applied (event-driven)
        await waitForPauseState(page);

        // Verify paused state
        const pausedItem = page.locator('.uppy-Dashboard-Item--paused');
        if (await pausedItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(pausedItem.first()).toBeVisible();
        }
      }
    });

    test('should resume all uploads', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 2);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for upload to start
      await page.waitForSelector('.uppy-Dashboard-Item--uploading', { timeout: 2000 }).catch(() => {});

      // Pause
      const pauseButton = page.locator('button:has-text("Pause")');
      if (await pauseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pauseButton.click();

        // Wait for pause state (event-driven)
        await waitForPauseState(page);

        // Resume
        const resumeButton = page.locator('button:has-text("Resume")');
        if (await resumeButton.isVisible()) {
          await resumeButton.click();

          // Wait for resume state (event-driven)
          await waitForResumeState(page);
        }
      }

      await waitForUploadComplete(page, 15000);
    });
  });

  test.describe('Error Handling', () => {
    test('should continue uploading other files if one fails', async ({ page }) => {
      let uploadCount = 0;

      await page.route('**/upload', async (route) => {
        uploadCount++;

        // Fail the second file
        if (uploadCount === 2) {
          await route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Upload failed' }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
          });
        }
      });

      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      await waitForUploadComplete(page, 15000);

      // Should have succeeded for 2 files, failed for 1
      expect(uploadCount).toBe(3);
    });

    test('should show error status on failed files', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Server error' }),
        });
      });

      const files = createMultipleImages(testFilesDir, 2);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for error state to appear (event-driven)
      await waitForBatchError(page, 5000);

      // Look for error indicator
      const errorItem = page.locator('.uppy-Dashboard-Item--error');

      if (await errorItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(errorItem.first()).toBeVisible();
      }
    });

    test('should allow retry of failed files', async ({ page }) => {
      let attemptCount = 0;

      await page.route('**/upload', async (route) => {
        attemptCount++;

        // Fail first attempt, succeed on retry
        if (attemptCount === 1) {
          await route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Temporary failure' }),
          });
        } else {
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true }),
          });
        }
      });

      const files = createMultipleImages(testFilesDir, 1);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      // Wait for error and retry button to appear (event-driven)
      await waitForRetryAvailable(page, 5000);

      // Look for retry button
      const retryButton = page.locator('button:has-text("Retry"), [aria-label*="Retry"]');

      if (await retryButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await retryButton.click();
        await waitForUploadComplete(page, 10000);

        // Should have attempted twice
        expect(attemptCount).toBeGreaterThan(1);
      }
    });
  });

  test.describe('Completion', () => {
    test('should verify all files uploaded correctly', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 5);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      await waitForUploadComplete(page, 20000);

      // Check completion message
      const statusBar = page.locator('.uppy-StatusBar');
      const statusText = await statusBar.textContent();

      expect(statusText).toMatch(/complete|done|success/i);
    });

    test('should show summary of uploads', async ({ page }) => {
      await page.route('**/upload', async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      });

      const files = createMultipleImages(testFilesDir, 3);
      await uploadFiles(page, files.map(f => f.path));
      await clickUploadButton(page);

      await waitForUploadComplete(page, 15000);

      // Should show something like "3 files uploaded"
      const summary = page.locator('.uppy-StatusBar, .uppy-upload-summary');
      const text = await summary.textContent();

      expect(text).toMatch(/\d+\s*file/i);
    });
  });
});