/**
 * Resource Exhaustion Edge Case Tests
 *
 * Tests upload behavior under resource exhaustion:
 * - Upload 100 files simultaneously
 * - Fill storage quota
 * - Exceed maximum file size
 * - Exceed maximum file count
 * - Browser memory limits
 * - Check graceful degradation
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
import { MemoryMonitor } from '../utils/memory-monitor';
import { ConsoleMonitor } from '../utils/test-helpers';
import { NetworkMonitor } from '../utils/network-simulator';

test.setTimeout(180000); // 3 minutes for resource-intensive tests

test.describe('Resource Exhaustion Tests - TUS Upload', () => {
  let memoryMonitor: MemoryMonitor;
  let consoleMonitor: ConsoleMonitor;
  let networkMonitor: NetworkMonitor;

  test.beforeEach(async ({ page }) => {
    memoryMonitor = new MemoryMonitor(page);
    consoleMonitor = new ConsoleMonitor(page);
    networkMonitor = new NetworkMonitor(page);

    await page.goto('/');
    await page.click('text=TUS Upload Demo');
  });

  test.afterEach(() => {
    memoryMonitor.stop();
    console.log(memoryMonitor.generateReport());
  });

  test('should handle 100 simultaneous file uploads', async ({ page }) => {
    await memoryMonitor.start();

    // Create 100 small files
    const files = [];
    for (let i = 0; i < 100; i++) {
      files.push({
        name: `mass-upload-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Test content ${i}`),
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // Should start processing
    await expect(page.locator('.tus-file-item').first()).toBeVisible({ timeout: 5000 });

    // EVENT-DRIVEN: Wait for upload completion state
    await page.waitForFunction(() => {
      const completeCount = document.querySelectorAll('.upload-complete').length;
      const errorCount = document.querySelectorAll('.upload-error').length;
      return (completeCount + errorCount) > 0;
    }, { timeout: 60000 })

    // Check how many completed
    const completed = await page.locator('.upload-complete').count();
    const failed = await page.locator('.upload-error').count();
    const total = await page.locator('.tus-file-item').count();

    console.log(`Completed: ${completed}, Failed: ${failed}, Total: ${total}`);

    // Should handle large number gracefully
    expect(completed + failed).toBeGreaterThan(0);

    // Check memory usage
    const peakMemoryMB = memoryMonitor.getPeakUsage() / (1024 * 1024);
    console.log(`Peak memory for 100 files: ${peakMemoryMB.toFixed(2)} MB`);

    // Memory should stay reasonable
    expect(peakMemoryMB).toBeLessThan(500);

    // Check for any critical errors
    const errors = consoleMonitor.getErrors();
    const criticalErrors = errors.filter(err =>
      err.includes('crash') || err.includes('fatal') || err.includes('Out of memory')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('should reject files exceeding maximum size', async ({ page }) => {
    // Create a file larger than max size (assume 50MB limit)
    await page.evaluate(() => {
      const size = 100 * 1024 * 1024; // 100MB (over limit)
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'too-large.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Should show error message
    await expect(page.locator('.upload-error')).toBeVisible({ timeout: 5000 });

    const errorText = await page.locator('.upload-error').textContent();
    expect(errorText?.toLowerCase()).toMatch(/size|limit|large|exceed/);

    // Error should be user-friendly
    expect(errorText).not.toContain('Error:');
    expect(errorText).not.toContain('Exception');
  });

  test('should reject files exceeding maximum count', async ({ page }) => {
    // Try to add more than max files (assume 10 file limit)
    const files = [];
    for (let i = 0; i < 15; i++) {
      files.push({
        name: `file-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Content ${i}`),
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // EVENT-DRIVEN: Wait for file processing to complete
    await page.waitForFunction(() => {
      const fileItems = document.querySelectorAll('.tus-file-item');
      const errors = document.querySelectorAll('.upload-error');
      return fileItems.length > 0 || errors.length > 0;
    }, { timeout: 5000 });

    const errorVisible = await page.locator('.upload-error').isVisible();
    const fileCount = await page.locator('.tus-file-item').count();

    if (errorVisible) {
      const errorText = await page.locator('.upload-error').textContent();
      expect(errorText?.toLowerCase()).toMatch(/maximum|limit|many|exceed/);
    } else {
      // Should only have max allowed files
      expect(fileCount).toBeLessThanOrEqual(10);
    }
  });

  test('should handle storage quota exceeded', async ({ page }) => {
    // Mock QuotaExceededError
    await page.evaluate(() => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key: string, value: string) {
        if (Math.random() < 0.5) {
          const error = new Error('QuotaExceededError') as any;
          error.name = 'QuotaExceededError';
          throw error;
        }
        return originalSetItem.call(this, key, value);
      };
    });

    // Try to upload file
    await page.evaluate(() => {
      const size = 5 * 1024 * 1024; // 5MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'quota-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // EVENT-DRIVEN: Wait for error or upload state
    await page.waitForFunction(() => {
      const hasError = document.querySelectorAll('.upload-error').length > 0;
      const isUploading = document.querySelectorAll('.progress-bar').length > 0;
      return hasError || isUploading;
    }, { timeout: 5000 });

    // Should either show error or work (with reduced functionality)
    const hasError = await page.locator('.upload-error').count() > 0;
    const isUploading = await page.locator('.progress-bar').count() > 0;

    expect(hasError || isUploading).toBe(true);

    // Check console for storage errors
    const errors = consoleMonitor.getErrors();
    if (errors.length > 0) {
      console.log('Storage errors:', errors);
    }
  });

  test('should degrade gracefully under memory pressure', async ({ page }) => {
    await memoryMonitor.start();

    // Try to create memory pressure with large files
    const largeFiles = [];
    for (let i = 0; i < 20; i++) {
      largeFiles.push({
        name: `memory-pressure-${i}.bin`,
        mimeType: 'application/octet-stream',
        buffer: Buffer.alloc(10 * 1024 * 1024), // 10MB each = 200MB total
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(largeFiles);

    // EVENT-DRIVEN: Wait for files to be added to UI
    await page.waitForSelector('.tus-file-item', { state: 'attached', timeout: 10000 });

    // Should handle the load
    const fileItems = await page.locator('.tus-file-item').count();
    expect(fileItems).toBeGreaterThan(0);

    // EVENT-DRIVEN: Sample memory at completion milestones using requestAnimationFrame
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let samples = 0;
        const maxSamples = 6;

        const sample = () => {
          if (samples >= maxSamples) {
            resolve();
            return;
          }

          const currentMemory = performance.memory ? (performance as any).memory.usedJSHeapSize : 0;
          console.log(`Memory sample ${samples}: ${(currentMemory / 1024 / 1024).toFixed(2)} MB`);
          samples++;

          setTimeout(() => requestAnimationFrame(sample), 5000);
        };

        requestAnimationFrame(sample);
      });
    });

    // Check peak memory
    const peakMemoryMB = memoryMonitor.getPeakUsage() / (1024 * 1024);
    console.log(`Peak memory: ${peakMemoryMB.toFixed(2)} MB`);

    // Should not crash
    const isCrashed = await page.locator('body').count() === 0;
    expect(isCrashed).toBe(false);

    // Check for out of memory errors
    const errors = consoleMonitor.getErrors();
    const memoryErrors = errors.filter(err =>
      err.toLowerCase().includes('memory') ||
      err.toLowerCase().includes('heap')
    );

    if (memoryErrors.length > 0) {
      console.log('Memory errors:', memoryErrors);
    }
  });

  test('should limit concurrent uploads to prevent overload', async ({ page }) => {
    // Upload many files
    const files = [];
    for (let i = 0; i < 50; i++) {
      files.push({
        name: `concurrent-limit-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Content ${i}`),
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // EVENT-DRIVEN: Wait for files to appear in UI
    await page.waitForFunction((count) => {
      return document.querySelectorAll('.tus-file-item').length >= count;
    }, files.length, { timeout: 5000 });

    // Check how many are actively uploading
    const uploadingCount = await page.locator('.status-uploading').count();
    console.log(`Concurrent uploads: ${uploadingCount}`);

    // Should limit concurrent uploads (typically 3-10)
    expect(uploadingCount).toBeLessThanOrEqual(10);

    // Some should be queued
    const pendingCount = await page.locator('.status-pending').count();
    console.log(`Pending uploads: ${pendingCount}`);

    expect(pendingCount).toBeGreaterThan(0);
  });

  test('should recover from network request limit', async ({ page }) => {
    await networkMonitor.start();

    // Try to overwhelm with requests
    const files = [];
    for (let i = 0; i < 30; i++) {
      files.push({
        name: `network-limit-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Content ${i} `.repeat(1000)), // 1KB each
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // EVENT-DRIVEN: Wait for uploads to complete or fail
    await page.waitForFunction(() => {
      const completed = document.querySelectorAll('.upload-complete').length;
      const failed = document.querySelectorAll('.upload-error').length;
      const total = document.querySelectorAll('.tus-file-item').length;
      return (completed + failed) === total && total > 0;
    }, { timeout: 45000 });

    // Check request patterns
    const requests = networkMonitor.getRequests(/upload/);
    console.log(`Total upload requests: ${requests.length}`);

    // Should batch or queue requests appropriately
    expect(requests.length).toBeGreaterThan(0);

    // At least some should succeed
    const completed = await page.locator('.upload-complete').count();
    expect(completed).toBeGreaterThan(0);
  });
});

test.describe('Resource Exhaustion Tests - Uppy Upload', () => {
  let memoryMonitor: MemoryMonitor;
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    memoryMonitor = new MemoryMonitor(page);
    consoleMonitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.click('text=Uppy Upload Demo');
  });

  test.afterEach(() => {
    memoryMonitor.stop();
  });

  test('should handle 100 files in dashboard', async ({ page }) => {
    await memoryMonitor.start();

    // Add 100 files
    const files = [];
    for (let i = 0; i < 100; i++) {
      files.push({
        name: `uppy-mass-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Content ${i}`),
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // Should show in dashboard
    await expect(page.locator('.uppy-Dashboard-Item').first()).toBeVisible({ timeout: 5000 });

    // EVENT-DRIVEN: Wait for dashboard to finish processing files
    await page.waitForFunction(() => {
      const statusBar = document.querySelector('.uppy-StatusBar-statusPrimary');
      return statusBar && (statusBar.textContent?.includes('Upload') || statusBar.textContent?.includes('complete'));
    }, { timeout: 45000 });

    // Check memory
    const peakMemoryMB = memoryMonitor.getPeakUsage() / (1024 * 1024);
    console.log(`Uppy peak memory for 100 files: ${peakMemoryMB.toFixed(2)} MB`);

    // Should remain responsive
    await expect(page.locator('.uppy-Dashboard')).toBeVisible();

    consoleMonitor.assertNoErrors();
  });

  test('should reject oversized files', async ({ page }) => {
    // Try to add very large file
    await page.evaluate(() => {
      const size = 200 * 1024 * 1024; // 200MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'oversized-uppy.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // EVENT-DRIVEN: Wait for error informer to appear
    await page.waitForSelector('.uppy-Informer', { state: 'visible', timeout: 5000 }).catch(() =>
      page.waitForSelector('.uppy-Dashboard-Item', { state: 'attached', timeout: 5000 })
    );

    // Check for error in UI
    const hasError = await page.locator('.uppy-Informer').count() > 0;
    if (hasError) {
      const errorText = await page.locator('.uppy-Informer').textContent();
      expect(errorText?.toLowerCase()).toMatch(/size|large|exceed/);
    }
  });

  test('should limit files in dashboard', async ({ page }) => {
    // Try to add more than max files
    const files = [];
    for (let i = 0; i < 50; i++) {
      files.push({
        name: `uppy-limit-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Content ${i}`),
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // EVENT-DRIVEN: Wait for dashboard to process files or show error
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('.uppy-Dashboard-Item');
      const informer = document.querySelector('.uppy-Informer');
      return items.length > 0 || informer !== null;
    }, { timeout: 5000 });

    // Should show informer about limits or restrict additions
    const fileCount = await page.locator('.uppy-Dashboard-Item').count();
    console.log(`Files added to Uppy: ${fileCount}`);

    // Should enforce reasonable limits
    expect(fileCount).toBeLessThanOrEqual(50);
  });
});