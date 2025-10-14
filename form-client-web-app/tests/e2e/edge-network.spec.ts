/**
 * Network Failure Edge Case Tests
 *
 * Tests upload behavior under various network failure scenarios including:
 * - Offline mode
 * - Slow 3G network
 * - Packet loss
 * - DNS resolution failure
 * - Connection timeout
 * - Server unreachable
 * - Retry logic for both TUS and Uppy
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import {
  applyNetworkCondition,
  simulatePacketLoss,
  simulateDNSFailure,
  simulateTimeout,
  simulateServerUnreachable,
  simulateIntermittentFailures,
  NetworkMonitor,
  NETWORK_PRESETS,
} from '../utils/network-simulator';
import { ConsoleMonitor, waitForUploadCompletion } from '../utils/test-helpers';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';

test.describe('Network Failure Scenarios - TUS Upload', () => {
  let consoleMonitor: ConsoleMonitor;
  let networkMonitor: NetworkMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    networkMonitor = new NetworkMonitor(page);
    await page.goto('/');
    // Navigate to TUS upload demo
    await page.click('text=TUS Upload Demo');
  });

  test('should handle offline mode gracefully', async ({ page }) => {
    // Set network to offline
    await page.context().setOffline(true);

    // Try to upload file
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test content'),
    });

    // Check for error message
    await expect(page.locator('.upload-error')).toBeVisible({ timeout: 5000 });

    // Verify error message is user-friendly
    const errorText = await page.locator('.upload-error').textContent();
    expect(errorText).toContain('network');

    // Go back online
    await page.context().setOffline(false);

    // Verify retry button appears
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();

    // Click retry
    await page.click('button:has-text("Retry")');

    // Wait for upload to succeed
    const result = await waitForUploadCompletion(page, 30000);
    expect(result).toBe('success');

    // Check console for errors (should have network errors but graceful handling)
    consoleMonitor.assertNoErrors();
  });

  test('should handle slow 3G network', async ({ page }) => {
    // Apply slow 3G network condition
    await applyNetworkCondition(page, NETWORK_PRESETS.SLOW_3G);

    // Upload a 1MB file
    const buffer = Buffer.alloc(1024 * 1024); // 1MB
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'large-file.bin',
      mimeType: 'application/octet-stream',
      buffer,
    });

    // Should show progress indicator
    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Monitor upload progress
    const progressUpdates: number[] = [];
    const progressText = page.locator('.progress-text');

    // Poll for progress updates using event-driven state monitoring
    for (let i = 0; i < 10; i++) {
      const text = await progressText.textContent();
      const match = text?.match(/(\d+)%/);
      if (match) {
        progressUpdates.push(Number.parseInt(match[1]));
      }

      // Wait for progress state change or completion instead of timeout
      try {
        await Promise.race([
          page.waitForFunction(
            (lastProgress) => {
              const progressEl = document.querySelector('.progress-text');
              const currentText = progressEl?.textContent || '';
              const currentMatch = currentText.match(/(\d+)%/);
              const currentProgress = currentMatch ? Number.parseInt(currentMatch[1]) : 0;
              return currentProgress !== lastProgress;
            },
            progressUpdates.at(-1) || 0,
            { timeout: 3000 }
          ),
          await page.locator('.upload-complete').waitFor({ state: 'visible', timeout: 3000 })
        ]);
      } catch {
        // Continue if no change detected
      }

      // Check if completed
      if (await page.locator('.upload-complete').isVisible()) {
        break;
      }
    }

    // Verify progress was tracked
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates.at(-1)).toBeGreaterThan(0);

    // Check network requests
    const uploadRequests = networkMonitor.getRequests(/upload/);
    expect(uploadRequests.length).toBeGreaterThan(0);
  });

  test('should handle packet loss with retry', async ({ page }) => {
    // Simulate 30% packet loss
    const cleanup = await simulatePacketLoss(page, 0.3);

    try {
      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles({
        name: 'test-file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test content for packet loss'),
      });

      // Should show progress
      await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

      // Wait longer for upload with retries
      const result = await waitForUploadCompletion(page, 60000);

      // Should eventually succeed with retries
      expect(result).toBe('success');

      // Check for retry attempts in network monitor
      const failedRequests = networkMonitor.getFailedRequests();
      expect(failedRequests.length).toBeGreaterThan(0);
    } finally {
      await cleanup();
    }
  });

  test('should handle DNS resolution failure', async ({ page }) => {
    const cleanup = await simulateDNSFailure(page, /upload/);

    try {
      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles({
        name: 'test-file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test content'),
      });

      // Should show DNS error
      await expect(page.locator('.upload-error')).toBeVisible({ timeout: 5000 });

      const errorText = await page.locator('.upload-error').textContent();
      expect(errorText?.toLowerCase()).toMatch(/network|connection|dns|resolve/);

      // Error should be user-friendly
      expect(errorText).not.toContain('namenotresolved');
      expect(errorText).not.toContain('ERR_');
    } finally {
      await cleanup();
    }
  });

  test('should handle connection timeout', async ({ page }) => {
    const cleanup = await simulateTimeout(page, /upload/, 5000);

    try {
      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles({
        name: 'test-file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test content'),
      });

      // Should show timeout error
      await expect(page.locator('.upload-error')).toBeVisible({ timeout: 15000 });

      const errorText = await page.locator('.upload-error').textContent();
      expect(errorText?.toLowerCase()).toMatch(/timeout|time out|took too long/);
    } finally {
      await cleanup();
    }
  });

  test('should handle server unreachable', async ({ page }) => {
    const cleanup = await simulateServerUnreachable(page, /upload/);

    try {
      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles({
        name: 'test-file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test content'),
      });

      // Should show connection error
      await expect(page.locator('.upload-error')).toBeVisible({ timeout: 5000 });

      const errorText = await page.locator('.upload-error').textContent();
      expect(errorText?.toLowerCase()).toMatch(/server|connection|unavailable/);
    } finally {
      await cleanup();
    }
  });

  test('should handle intermittent network failures', async ({ page }) => {
    // 30% failure rate
    const cleanup = await simulateIntermittentFailures(page, /upload/, 0.3);

    try {
      // Upload multiple files
      const files = [];
      for (let i = 0; i < 5; i++) {
        files.push({
          name: `test-file-${i}.txt`,
          mimeType: 'text/plain',
          buffer: Buffer.from(`Test content ${i}`),
        });
      }

      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles(files);

      // Wait for all uploads to complete or fail using event-driven monitoring
      const uploadCount = files.length;
      await page.waitForFunction(
        (expectedCount) => {
          const completed = document.querySelectorAll('.upload-complete').length;
          const failed = document.querySelectorAll('.upload-error').length;
          return (completed + failed) >= expectedCount;
        },
        uploadCount,
        { timeout: 30000 }
      );

      // At least some should succeed despite intermittent failures
      const completedCount = await page.locator('.upload-complete').count();
      expect(completedCount).toBeGreaterThan(0);

      // Check for retry attempts
      const failedRequests = networkMonitor.getFailedRequests();
      expect(failedRequests.length).toBeGreaterThan(0);
    } finally {
      await cleanup();
    }
  });

  test('should pause and resume on network interruption', async ({ page }) => {
    // Start upload
    const buffer = Buffer.alloc(5 * 1024 * 1024); // 5MB
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'large-file.bin',
      mimeType: 'application/octet-stream',
      buffer,
    });

    // Wait for upload to start and progress to be actively updating
    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for progress to actually start changing (upload is active)
    await page.waitForFunction(
      () => {
        const progressEl = document.querySelector('.progress-text');
        const text = progressEl?.textContent || '';
        const match = text.match(/(\d+)%/);
        return match && Number.parseInt(match[1]) > 0;
      },
      { timeout: 5000 }
    );

    // Pause upload
    await page.click('button[title="Pause"]');
    await expect(page.locator('.status-paused')).toBeVisible();

    // Go offline
    await page.context().setOffline(true);

    // Wait for offline state to be detected by application
    await page.waitForFunction(
      () => !navigator.onLine,
      { timeout: 2000 }
    );

    // Try to resume (should fail gracefully)
    await page.click('button[title="Resume"]');

    // Go back online
    await page.context().setOffline(false);

    // Resume should now work
    await page.click('button[title="Resume"]');

    // Should complete
    const result = await waitForUploadCompletion(page, 60000);
    expect(result).toBe('success');
  });

  test('should recover from network switching', async ({ page }) => {
    // Start with WiFi speed
    await applyNetworkCondition(page, NETWORK_PRESETS.WIFI);

    const buffer = Buffer.alloc(2 * 1024 * 1024); // 2MB
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'file.bin',
      mimeType: 'application/octet-stream',
      buffer,
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for initial upload progress
    let initialProgress = 0;
    await page.waitForFunction(
      () => {
        const progressEl = document.querySelector('.progress-text');
        const text = progressEl?.textContent || '';
        const match = text.match(/(\d+)%/);
        return match && Number.parseInt(match[1]) > 0;
      },
      { timeout: 3000 }
    );
    initialProgress = await page.evaluate(() => {
      const progressEl = document.querySelector('.progress-text');
      const text = progressEl?.textContent || '';
      const match = text.match(/(\d+)%/);
      return match ? Number.parseInt(match[1]) : 0;
    });

    // Switch to 3G
    await applyNetworkCondition(page, NETWORK_PRESETS.SLOW_3G);

    // Wait for network condition to affect upload (progress should slow down or stall briefly)
    await page.waitForFunction(
      (prevProgress) => {
        const progressEl = document.querySelector('.progress-text');
        const text = progressEl?.textContent || '';
        const match = text.match(/(\d+)%/);
        const currentProgress = match ? Number.parseInt(match[1]) : 0;
        return currentProgress > prevProgress; // Still progressing despite network change
      },
      initialProgress,
      { timeout: 5000 }
    );

    // Switch back to WiFi
    await applyNetworkCondition(page, NETWORK_PRESETS.WIFI);

    // Should still complete
    const result = await waitForUploadCompletion(page, 60000);
    expect(result).toBe('success');
  });
});

test.describe('Network Failure Scenarios - Uppy Upload', () => {
  let consoleMonitor: ConsoleMonitor;
  let networkMonitor: NetworkMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    networkMonitor = new NetworkMonitor(page);
    await page.goto('/');
    // Navigate to Uppy upload demo
    await page.click('text=Uppy Upload Demo');
  });

  test('should handle offline mode with auto-resume', async ({ page }) => {
    // Upload file
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Test content'),
    });

    // Wait for upload to initiate (network request started)
    await page.waitForEvent('request', {
      predicate: (req) => req.url().includes('upload'),
      timeout: 5000
    });

    // Go offline mid-upload
    await page.context().setOffline(true);

    // Wait for offline state to be detected
    await page.waitForFunction(
      () => !navigator.onLine,
      { timeout: 3000 }
    );

    // Should show retry indicator
    await expect(page.locator('.uppy-StatusBar-statusPrimary:has-text("Retry")')).toBeVisible();

    // Go back online
    await page.context().setOffline(false);

    // Golden Retriever should auto-resume - wait for retry/resume indicator
    await page.waitForFunction(
      () => {
        const retryBtn = document.querySelector('.uppy-StatusBar-statusPrimary:has-text("Retry")');
        const uploadProgress = document.querySelector('.uppy-StatusBar-progress');
        // Either retry is gone (resumed) or progress is visible (uploading)
        return !retryBtn || uploadProgress !== null;
      },
      { timeout: 5000 }
    );

    // Should complete
    const result = await waitForUploadCompletion(page, 30000);
    expect(result).toBe('success');
  });

  test('should handle slow network with progress updates', async ({ page }) => {
    await applyNetworkCondition(page, NETWORK_PRESETS.SLOW_3G);

    const buffer = Buffer.alloc(1024 * 1024); // 1MB
    const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles({
      name: 'file.bin',
      mimeType: 'application/octet-stream',
      buffer,
    });

    // Should show detailed progress
    await expect(page.locator('.uppy-StatusBar-progress')).toBeVisible({ timeout: 5000 });

    // Check for speed indicator
    await expect(page.locator('.uppy-StatusBar-details')).toBeVisible();

    // Should eventually complete
    const result = await waitForUploadCompletion(page, 90000);
    expect(result).toBe('success');
  });

  test('should handle intermittent failures with retry', async ({ page }) => {
    const cleanup = await simulateIntermittentFailures(page, /upload/, 0.4);

    try {
      const buffer = Buffer.alloc(512 * 1024); // 512KB
      const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
      await fileInput.setInputFiles({
        name: 'file.bin',
        mimeType: 'application/octet-stream',
        buffer,
      });

      // Wait for retry attempts by monitoring network request count
      const initialRequestCount = networkMonitor.getRequests(/upload/).length;
      await page.waitForFunction(
        (initial) => {
          // Network monitor is in Node.js context, so we need to wait for DOM changes instead
          const statusBar = document.querySelector('.uppy-StatusBar-statusPrimary');
          const hasRetryIndicator = statusBar?.textContent?.includes('Retry') || false;
          const uploadProgress = document.querySelector('.uppy-StatusBar-progress');
          return hasRetryIndicator || uploadProgress !== null;
        },
        initialRequestCount,
        { timeout: 15000 }
      );

      // Check network monitor for retries
      const requests = networkMonitor.getRequests(/upload/);
      expect(requests.length).toBeGreaterThan(1); // Multiple attempts

      // Should eventually succeed
      const result = await waitForUploadCompletion(page, 60000);
      expect(result).toBe('success');
    } finally {
      await cleanup();
    }
  });
});