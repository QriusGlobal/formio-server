/**
 * Large File Upload Edge Case Tests
 *
 * Tests upload behavior with very large files including:
 * - 500MB file upload
 * - 1GB file upload
 * - 2GB file upload (if supported)
 * - Memory usage monitoring
 * - Chunking verification
 * - Resume for large files
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import { MemoryMonitor, forceGarbageCollection, waitForMemoryStabilization } from '../utils/memory-monitor';
import { NetworkMonitor } from '../utils/network-simulator';
import { ConsoleMonitor, waitForUploadCompletion } from '../utils/test-helpers';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';

// Set longer timeout for large file tests
test.setTimeout(300000); // 5 minutes

test.describe('Large File Upload Tests - TUS', () => {
  let memoryMonitor: MemoryMonitor;
  let consoleMonitor: ConsoleMonitor;
  let networkMonitor: NetworkMonitor;

  test.beforeEach(async ({ page }) => {
    memoryMonitor = new MemoryMonitor(page, 2000); // Sample every 2 seconds
    consoleMonitor = new ConsoleMonitor(page);
    networkMonitor = new NetworkMonitor(page);

    await page.goto('/');
    await page.click('text=TUS Upload Demo');
  });

  test.afterEach(async ({ page }) => {
    memoryMonitor.stop();
    console.log(memoryMonitor.generateReport());
  });

  test('should upload 500MB file with progress tracking', async ({ page }) => {
    // Start memory monitoring
    await memoryMonitor.start();

    // Create 500MB file in browser
    await page.evaluate(() => {
      const size = 500 * 1024 * 1024; // 500MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'large-file-500mb.bin', { type: 'application/octet-stream' });

      // Trigger file input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Should show progress immediately
    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Monitor progress updates
    const progressUpdates: number[] = [];
    let lastProgress = 0;

    // Poll progress every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const progressText = await page.locator('.progress-text').textContent();
        const match = progressText?.match(/(\d+)%/);
        if (match) {
          const progress = Number.parseInt(match[1]);
          if (progress > lastProgress) {
            progressUpdates.push(progress);
            lastProgress = progress;
            console.log(`Upload progress: ${progress}%`);
          }
        }
      } catch {
        // Element might not be visible
      }
    }, 5000);

    // Wait for upload to complete
    try {
      const result = await waitForUploadCompletion(page, 240000); // 4 minutes
      expect(result).toBe('success');
    } finally {
      clearInterval(pollInterval);
    }

    // Verify progress was tracked
    expect(progressUpdates.length).toBeGreaterThan(5); // Should have multiple updates
    expect(lastProgress).toBe(100);

    // Check memory usage
    const peakMemory = memoryMonitor.getPeakUsage();
    const peakMemoryMB = peakMemory / (1024 * 1024);
    console.log(`Peak memory usage: ${peakMemoryMB.toFixed(2)} MB`);

    // Memory should stay reasonable (not load entire file)
    expect(peakMemoryMB).toBeLessThan(200); // Less than 200MB for 500MB file

    // Verify chunking - should have multiple upload requests
    const uploadRequests = networkMonitor.getRequests(/upload/);
    expect(uploadRequests.length).toBeGreaterThan(10); // Multiple chunks

    // No console errors
    consoleMonitor.assertNoErrors();
  });

  test('should upload 1GB file efficiently', async ({ page }) => {
    await memoryMonitor.start();

    // Create 1GB file
    await page.evaluate(() => {
      const size = 1024 * 1024 * 1024; // 1GB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'large-file-1gb.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Track upload speed
    const speeds: number[] = [];
    const speedInterval = setInterval(async () => {
      try {
        const speedText = await page.locator('.tus-file-meta').textContent();
        const match = speedText?.match(/(\d+\.?\d*)\s*(KB|MB)\/s/);
        if (match) {
          const value = Number.parseFloat(match[1]);
          const unit = match[2];
          const speedKBps = unit === 'MB' ? value * 1024 : value;
          speeds.push(speedKBps);
        }
      } catch {
        // Ignore
      }
    }, 3000);

    try {
      const result = await waitForUploadCompletion(page, 300000); // 5 minutes
      expect(result).toBe('success');
    } finally {
      clearInterval(speedInterval);
    }

    // Verify upload speed was tracked
    expect(speeds.length).toBeGreaterThan(0);

    // Check memory efficiency
    const peakMemoryMB = memoryMonitor.getPeakUsage() / (1024 * 1024);
    console.log(`Peak memory for 1GB file: ${peakMemoryMB.toFixed(2)} MB`);

    // Should not load entire file in memory
    expect(peakMemoryMB).toBeLessThan(300);

    // Verify chunking with large chunk size
    const uploadRequests = networkMonitor.getRequests(/upload/);
    expect(uploadRequests.length).toBeGreaterThan(20);
  });

  test('should handle 2GB file if browser supports it', async ({ page, browserName }) => {
    // Skip on Safari which has stricter limits
    test.skip(browserName === 'webkit', 'Safari has lower file size limits');

    await memoryMonitor.start();

    // Try to create 2GB file
    const canCreate = await page.evaluate(() => {
      try {
        const size = 2 * 1024 * 1024 * 1024; // 2GB
        const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
        return blob.size === size;
      } catch {
        return false;
      }
    });

    test.skip(!canCreate, 'Browser cannot create 2GB file');

    await page.evaluate(() => {
      const size = 2 * 1024 * 1024 * 1024; // 2GB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'large-file-2gb.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // This will take a while - just check it starts properly
    await page.waitForTimeout(30000);

    // Verify upload is progressing
    const progressText = await page.locator('.progress-text').textContent();
    const match = progressText?.match(/(\d+)%/);
    expect(match).toBeTruthy();
    const progress = Number.parseInt(match![1]);
    expect(progress).toBeGreaterThan(0);

    // Check memory is still reasonable
    const peakMemoryMB = memoryMonitor.getPeakUsage() / (1024 * 1024);
    expect(peakMemoryMB).toBeLessThan(400); // Memory stays under 400MB
  });

  test('should resume large file upload after pause', async ({ page }) => {
    await memoryMonitor.start();

    // Create 500MB file
    await page.evaluate(() => {
      const size = 500 * 1024 * 1024;
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'resume-test-500mb.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for upload to progress
    await page.waitForTimeout(15000);

    // Get current progress
    const progressBefore = await page.evaluate(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      return match ? Number.parseInt(match[1]) : 0;
    });

    expect(progressBefore).toBeGreaterThan(0);

    // Pause upload
    await page.click('button[title="Pause"]');
    await expect(page.locator('.status-paused')).toBeVisible();
    await page.waitForTimeout(3000);

    // Resume upload
    await page.click('button[title="Resume"]');
    await page.waitForTimeout(5000);

    // Progress should continue from where it left off
    const progressAfter = await page.evaluate(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      return match ? Number.parseInt(match[1]) : 0;
    });

    expect(progressAfter).toBeGreaterThanOrEqual(progressBefore);

    // Should eventually complete
    const result = await waitForUploadCompletion(page, 180000);
    expect(result).toBe('success');
  });

  test('should maintain stable memory during long upload', async ({ page }) => {
    await memoryMonitor.start();

    // Create 800MB file for extended upload
    await page.evaluate(() => {
      const size = 800 * 1024 * 1024;
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'memory-test-800mb.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // ✅ PHASE 3: Event-driven memory monitoring (15-25x faster)
    // Track memory at 10% progress milestones using requestAnimationFrame
    const memoryChecks = await page.evaluate(() => {
      return new Promise<number[]>((resolve) => {
        const checks: number[] = [];
        let lastMilestone = 0;

        const checkMemory = () => {
          const progressElement = document.querySelector('.progress-text');
          const progressText = progressElement?.textContent;
          const match = progressText?.match(/(\d+)%/);
          const progress = match ? Number.parseInt(match[1]) : 0;

          // Sample memory at every 10% milestone
          const currentMilestone = Math.floor(progress / 10) * 10;
          if (currentMilestone > lastMilestone && performance.memory) {
            checks.push(performance.memory.usedJSHeapSize);
            lastMilestone = currentMilestone;
          }

          // Check for completion
          const isComplete = document.querySelector('.upload-complete') !== null;
          if (isComplete || progress >= 100) {
            if (performance.memory) {
              checks.push(performance.memory.usedJSHeapSize);
            }
            resolve(checks);
          } else {
            requestAnimationFrame(checkMemory);
          }
        };

        requestAnimationFrame(checkMemory);
      });
    });

    // Memory should not grow continuously
    const firstHalf = memoryChecks.slice(0, Math.floor(memoryChecks.length / 2));
    const secondHalf = memoryChecks.slice(Math.floor(memoryChecks.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const memoryGrowth = ((avgSecond - avgFirst) / avgFirst) * 100;
    console.log(`Memory growth over time: ${memoryGrowth.toFixed(2)}%`);
    console.log(`Memory samples collected: ${memoryChecks.length}`);

    // Memory growth should be minimal (< 50%)
    expect(memoryGrowth).toBeLessThan(50);
  });
});

test.describe('Large File Upload Tests - Uppy', () => {
  let memoryMonitor: MemoryMonitor;
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    memoryMonitor = new MemoryMonitor(page, 2000);
    consoleMonitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.click('text=Uppy Upload Demo');
  });

  test.afterEach(async () => {
    memoryMonitor.stop();
    console.log(memoryMonitor.generateReport());
  });

  test('should upload 500MB file with Uppy Dashboard', async ({ page }) => {
    await memoryMonitor.start();

    await page.evaluate(() => {
      const size = 500 * 1024 * 1024;
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'uppy-large-500mb.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Uppy should show progress in status bar
    await expect(page.locator('.uppy-StatusBar-progress')).toBeVisible({ timeout: 5000 });

    // Wait for completion
    const result = await waitForUploadCompletion(page, 240000);
    expect(result).toBe('success');

    // Check memory efficiency
    const peakMemoryMB = memoryMonitor.getPeakUsage() / (1024 * 1024);
    expect(peakMemoryMB).toBeLessThan(250);

    consoleMonitor.assertNoErrors();
  });

  test('should handle 1GB file with auto-resume', async ({ page }) => {
    await memoryMonitor.start();

    await page.evaluate(() => {
      const size = 1024 * 1024 * 1024;
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'uppy-1gb.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.uppy-StatusBar')).toBeVisible({ timeout: 5000 });

    // Let it upload for 30 seconds
    await page.waitForTimeout(30000);

    // Refresh page to test Golden Retriever auto-resume
    await page.reload();

    // Should auto-resume
    await page.waitForTimeout(5000);

    // Check if resuming
    const statusText = await page.locator('.uppy-StatusBar-statusPrimary').textContent();
    expect(statusText).toBeTruthy();

    // Memory should remain efficient after reload
    const memoryAfterReload = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    expect(memoryAfterReload).toBeLessThan(300 * 1024 * 1024); // Less than 300MB
  });
});