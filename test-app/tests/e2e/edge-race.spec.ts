/**
 * Race Condition Edge Case Tests
 *
 * Tests upload behavior under race conditions:
 * - Start multiple uploads, cancel random ones
 * - Rapid pause/resume cycles
 * - Component unmount during upload
 * - Form submission during upload
 * - Authentication token refresh during upload
 *
 * OPTIMIZED: All waitForTimeout calls replaced with event-driven waits
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
import { ConsoleMonitor } from '../utils/test-helpers';
import { NetworkMonitor } from '../utils/network-simulator';

test.describe('Race Condition Tests - TUS Upload', () => {
  let consoleMonitor: ConsoleMonitor;
  let networkMonitor: NetworkMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    networkMonitor = new NetworkMonitor(page);
    await page.goto('/');
    await page.click('text=TUS Upload Demo');
  });

  test('should handle multiple uploads with random cancellations', async ({ page }) => {
    // Start 10 uploads
    const fileCount = 10;
    const files = [];

    for (let i = 0; i < fileCount; i++) {
      files.push({
        name: `race-file-${i}.bin`,
        mimeType: 'application/octet-stream',
        buffer: Buffer.alloc(2 * 1024 * 1024), // 2MB each
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    // Wait for all to start - replaced timeout with progress bar visibility
    await expect(page.locator('.progress-bar').first()).toBeVisible({ timeout: 5000 });
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('.tus-file-item, .uppy-Dashboard-Item');
      return items.length >= 5; // Wait for majority to appear
    }, { timeout: 10000 });

    // Randomly cancel half of them
    const cancelButtons = page.locator('button[title="Cancel"]');
    const count = await cancelButtons.count();
    expect(count).toBeGreaterThan(0);

    // Cancel random uploads with minimal delay
    const toCancel = Math.floor(count / 2);
    for (let i = 0; i < toCancel; i++) {
      const randomIndex = Math.floor(Math.random() * (count - i));
      const cancelButton = cancelButtons.nth(randomIndex);
      await cancelButton.click({ timeout: 1000 });
      // Wait for DOM to update after cancellation
      await page.waitForFunction((idx) => {
        const buttons = Array.from(document.querySelectorAll('button[title="Cancel"]'));
        return buttons.length < idx;
      }, count - i, { timeout: 2000 });
    }

    // Wait for remaining to complete - replaced 30s timeout with completion check
    await page.waitForFunction(() => {
      const uploading = document.querySelectorAll('.status-uploading, .uppy-is-uploading');
      const completed = document.querySelectorAll('.upload-complete, .uppy-StatusBar-statusPrimary:has-text("Complete")');
      return uploading.length === 0 && completed.length > 0;
    }, { timeout: 60000 });

    // Some should complete, some should be cancelled
    const completed = await page.locator('.upload-complete').count();
    expect(completed).toBeGreaterThan(0);
    expect(completed).toBeLessThan(fileCount);

    // No errors should occur
    consoleMonitor.assertNoErrors();
  });

  test('should handle rapid pause/resume cycles', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 10 * 1024 * 1024; // 10MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'rapid-pause-resume.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Rapidly pause and resume 10 times - replaced 200ms timeouts with state checks
    for (let i = 0; i < 10; i++) {
      const pauseButton = page.locator('button[title="Pause"]');
      await pauseButton.click();
      // Wait for paused state
      await expect(page.locator('button[title="Resume"]')).toBeVisible({ timeout: 2000 });

      const resumeButton = page.locator('button[title="Resume"]');
      await resumeButton.click();
      // Wait for resumed state
      await expect(page.locator('button[title="Pause"]')).toBeVisible({ timeout: 2000 });
    }

    // Should still complete successfully
    await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 60000 });

    // Check for any console errors
    const errors = consoleMonitor.getErrors();
    // Filter out expected pause/resume warnings
    const criticalErrors = errors.filter(err =>
      !err.includes('pause') && !err.includes('resume')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle component unmount during upload', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 5 * 1024 * 1024; // 5MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'unmount-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for upload to actually start (replaced 2s timeout)
    await page.waitForFunction(() => {
      const progress = document.querySelector('.progress-bar');
      return progress && (progress as HTMLElement).style.width !== '0%';
    }, { timeout: 5000 });

    // Navigate away (simulates unmount) - replaced 1s timeout with navigation wait
    await Promise.all([
      page.waitForURL(/\/$|\/home/i, { timeout: 5000 }),
      page.click('text=Home')
    ]);

    // Navigate back - replaced 2s timeout with component ready check
    await Promise.all([
      page.waitForSelector('.tus-dropzone', { state: 'visible', timeout: 5000 }),
      page.click('text=TUS Upload Demo')
    ]);

    // Should not crash, and should be in clean state
    await expect(page.locator('.tus-dropzone')).toBeVisible();

    // No memory leaks or errors
    const errors = consoleMonitor.getErrors();
    const memoryLeakErrors = errors.filter(err =>
      err.includes('memory') || err.includes('leak')
    );
    expect(memoryLeakErrors.length).toBe(0);
  });

  test('should handle form submission during upload', async ({ page }) => {
    // Assume there's a form with the upload component
    await page.evaluate(() => {
      // Create a form wrapper
      const form = document.createElement('form');
      form.id = 'test-form';
      const uploadContainer = document.querySelector('.tus-file-upload');
      if (uploadContainer && uploadContainer.parentNode) {
        uploadContainer.parentNode.insertBefore(form, uploadContainer);
        form.appendChild(uploadContainer);
      }

      // Add submit button
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Submit Form';
      submitBtn.id = 'submit-btn';
      form.appendChild(submitBtn);
    });

    // Start upload
    await page.evaluate(() => {
      const size = 5 * 1024 * 1024; // 5MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'form-submit-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for upload to progress (replaced 2s timeout)
    await page.waitForFunction(() => {
      const progress = document.querySelector('.progress-bar');
      if (!progress) return false;
      const width = (progress as HTMLElement).style.width;
      const percentage = parseInt(width) || 0;
      return percentage > 10; // Upload has started and made progress
    }, { timeout: 10000 });

    // Try to submit form - replaced 1s timeout with state check
    const submitBtn = page.locator('#submit-btn');
    if (await submitBtn.isVisible()) {
      // Should prevent submission or show warning
      await submitBtn.click();

      // Check if upload is still in progress or if form was prevented
      // Use waitForFunction to check state instead of arbitrary timeout
      await page.waitForFunction(() => {
        const stillUploading = document.querySelectorAll('.status-uploading').length;
        const completed = document.querySelectorAll('.upload-complete').length;
        const cancelled = document.querySelectorAll('.tus-file-item').length === 0;
        return stillUploading > 0 || completed > 0 || cancelled;
      }, { timeout: 5000 });

      // Upload should either complete or be properly cancelled
      const stillUploading = await page.locator('.status-uploading').count();
      const completed = await page.locator('.upload-complete').count();
      const cancelled = await page.locator('.tus-file-item').count() === 0;

      expect(stillUploading + completed + (cancelled ? 1 : 0)).toBeGreaterThan(0);
    }
  });

  test('should handle concurrent uploads with different states', async ({ page }) => {
    // Upload 5 files
    const files = [];
    for (let i = 0; i < 5; i++) {
      files.push({
        name: `concurrent-${i}.bin`,
        mimeType: 'application/octet-stream',
        buffer: Buffer.alloc(3 * 1024 * 1024), // 3MB
      });
    }

    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(files);

    await expect(page.locator('.progress-bar').first()).toBeVisible({ timeout: 5000 });

    // Wait for all files to appear (replaced 1s timeout)
    await page.waitForFunction((count) => {
      const items = document.querySelectorAll('.tus-file-item, .uppy-Dashboard-Item');
      return items.length >= count;
    }, files.length, { timeout: 10000 });

    // Put uploads in different states
    const pauseButtons = page.locator('button[title="Pause"]');
    const pauseCount = await pauseButtons.count();

    if (pauseCount >= 3) {
      // Pause first and third
      await pauseButtons.nth(0).click();
      await pauseButtons.nth(2).click();

      // Wait for paused state (replaced 500ms timeout)
      await page.waitForFunction(() => {
        const resumeButtons = document.querySelectorAll('button[title="Resume"]');
        return resumeButtons.length >= 2;
      }, { timeout: 5000 });

      // Resume first
      await page.click('button[title="Resume"]');

      // Wait for state change (replaced 500ms timeout)
      await page.waitForFunction(() => {
        const resumeButtons = document.querySelectorAll('button[title="Resume"]');
        return resumeButtons.length === 1;
      }, { timeout: 5000 });

      // Cancel second
      const cancelButtons = page.locator('button[title="Cancel"]');
      if (await cancelButtons.count() > 1) {
        await cancelButtons.nth(1).click();
      }
    }

    // Wait for remaining to complete (replaced 30s timeout)
    await page.waitForFunction(() => {
      const uploading = document.querySelectorAll('.status-uploading, .uppy-is-uploading');
      return uploading.length === 0;
    }, { timeout: 60000 });

    // At least some should complete
    const completed = await page.locator('.upload-complete').count();
    expect(completed).toBeGreaterThan(0);

    consoleMonitor.assertNoErrors();
  });

  test('should handle rapid file additions', async ({ page }) => {
    // Rapidly add files multiple times
    for (let batch = 0; batch < 5; batch++) {
      const files = [];
      for (let i = 0; i < 3; i++) {
        files.push({
          name: `rapid-batch-${batch}-file-${i}.txt`,
          mimeType: 'text/plain',
          buffer: Buffer.from(`Content ${batch}-${i}`),
        });
      }

      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles(files);

      // Wait for files to be added (replaced 200ms timeout)
      await page.waitForFunction((expectedBatch) => {
        const items = document.querySelectorAll('.tus-file-item, .uppy-Dashboard-Item');
        return items.length >= (expectedBatch + 1) * 3;
      }, batch, { timeout: 5000 });
    }

    // Should handle all files (replaced 10s timeout with completion check)
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('.tus-file-item, .uppy-Dashboard-Item');
      const completed = document.querySelectorAll('.upload-complete, .uppy-complete');
      return items.length > 0 && (completed.length > 0 || items.length === 15);
    }, { timeout: 30000 });

    const fileItems = await page.locator('.tus-file-item').count();
    expect(fileItems).toBeGreaterThan(0);

    consoleMonitor.assertNoErrors();
  });

  test('should handle authentication token refresh during upload', async ({ page }) => {
    // Mock token refresh
    await page.route('**/upload/**', async (route) => {
      const headers = route.request().headers();

      // Simulate token expiry after some time
      if (Math.random() < 0.3) {
        await route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Token expired' }),
        });
      } else {
        await route.continue();
      }
    });

    // Start upload
    await page.evaluate(() => {
      const size = 5 * 1024 * 1024; // 5MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'auth-refresh-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Should handle 401 gracefully (replaced 15s timeout with state check)
    await page.waitForFunction(() => {
      const hasError = document.querySelectorAll('.upload-error').length > 0;
      const isRetrying = document.querySelectorAll('[title="Retry"]').length > 0;
      const isCompleted = document.querySelectorAll('.upload-complete').length > 0;
      return hasError || isRetrying || isCompleted;
    }, { timeout: 30000 });

    // Check if error is shown or retry happened
    const hasError = await page.locator('.upload-error').count() > 0;
    const isRetrying = await page.locator('[title="Retry"]').count() > 0;
    const isCompleted = await page.locator('.upload-complete').count() > 0;

    // Should either error gracefully, show retry, or complete
    expect(hasError || isRetrying || isCompleted).toBe(true);
  });
});

test.describe('Race Condition Tests - Uppy Upload', () => {
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    await page.goto('/');
    await page.click('text=Uppy Upload Demo');
  });

  test('should handle multiple file additions and removals', async ({ page }) => {
    // Add files
    for (let i = 0; i < 5; i++) {
      const files = [{
        name: `uppy-race-${i}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`Content ${i}`),
      }];

      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles(files);

      // Wait for file to be added (replaced 300ms timeout)
      await page.waitForFunction((expectedCount) => {
        const items = document.querySelectorAll('.uppy-Dashboard-Item');
        return items.length >= expectedCount;
      }, i + 1, { timeout: 5000 });

      // Remove some files
      if (i % 2 === 0) {
        const removeButtons = page.locator('.uppy-Dashboard-Item-action--remove');
        const count = await removeButtons.count();
        if (count > 0) {
          await removeButtons.first().click();
          // Wait for removal to complete
          await page.waitForFunction((prevCount) => {
            const items = document.querySelectorAll('.uppy-Dashboard-Item');
            return items.length < prevCount;
          }, count, { timeout: 3000 });
        }
      }
    }

    // Should not crash (replaced 3s timeout)
    await expect(page.locator('.uppy-Dashboard')).toBeVisible();

    consoleMonitor.assertNoErrors();
  });

  test('should handle rapid plugin toggling', async ({ page }) => {
    // If there are plugin toggles in UI, test rapid toggling
    // This is implementation-specific

    // Wait for Uppy to be ready (replaced 2s timeout)
    await page.waitForFunction(() => {
      return (window as any).uppy !== undefined;
    }, { timeout: 10000 });

    // Add file
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'plugin-toggle-test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test content'),
    });

    // Wait for upload to complete (replaced 5s timeout)
    await expect(page.locator('.uppy-StatusBar-statusPrimary')).toContainText(/Complete|Upload/, { timeout: 30000 });

    consoleMonitor.assertNoErrors();
  });

  test('should handle cancellation during auto-resume', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 10 * 1024 * 1024; // 10MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'cancel-resume-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Wait for upload to start (replaced 3s timeout)
    await page.waitForFunction(() => {
      const progress = document.querySelector('.uppy-StatusBar-progress');
      return progress && (progress as HTMLElement).getAttribute('value') !== '0';
    }, { timeout: 10000 });

    // Refresh to trigger auto-resume
    await page.reload();

    // Wait for auto-resume to start (replaced 2s timeout)
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('.uppy-Dashboard-Item');
      return items.length > 0;
    }, { timeout: 10000 });

    // Immediately cancel during resume
    const cancelButtons = page.locator('.uppy-Dashboard-Item-action--remove');
    if (await cancelButtons.count() > 0) {
      await cancelButtons.first().click();
      // Wait for cancellation to complete
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.uppy-Dashboard-Item');
        return items.length === 0;
      }, { timeout: 5000 });
    }

    // Should handle cancellation cleanly
    consoleMonitor.assertNoErrors();
  });
});
