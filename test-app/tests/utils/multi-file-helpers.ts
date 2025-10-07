/**
 * Multi-File Upload Helpers
 *
 * Event-driven utilities for multi-file batch operations
 * Eliminates arbitrary timeouts with precise state monitoring
 */

import { Page, Locator } from '@playwright/test';
import { getFileCount } from './uppy-helpers';

/**
 * Wait for batch file addition to complete
 * Monitors file count to reach expected number
 */
export async function waitForBatchFilesAdded(
  page: Page,
  expectedCount: number,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (count) => {
      const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
      return items.length === count;
    },
    expectedCount,
    { timeout }
  );
}

/**
 * Wait for progress percentage to update
 * Monitors for progress > 0% instead of arbitrary delay
 */
export async function waitForProgressStart(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const progressElement = document.querySelector('.uppy-StatusBar-percentage');
      if (!progressElement) return false;

      const text = progressElement.textContent || '';
      const match = text.match(/(\d+)%/);
      if (!match) return false;

      const percentage = parseInt(match[1], 10);
      return percentage > 0;
    },
    { timeout }
  );
}

/**
 * Wait for progress percentage to reach specific threshold
 */
export async function waitForProgressThreshold(
  page: Page,
  threshold: number,
  timeout = 10000
): Promise<void> {
  await page.waitForFunction(
    (targetProgress) => {
      const progressElement = document.querySelector('.uppy-StatusBar-percentage');
      if (!progressElement) return false;

      const text = progressElement.textContent || '';
      const match = text.match(/(\d+)%/);
      if (!match) return false;

      const percentage = parseInt(match[1], 10);
      return percentage >= targetProgress;
    },
    threshold,
    { timeout }
  );
}

/**
 * Wait for completion counter to appear
 * Monitors for "X of Y files" pattern
 */
export async function waitForCompletionCounter(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const statusBar = document.querySelector('.uppy-StatusBar');
      if (!statusBar) return false;

      const text = statusBar.textContent || '';
      // Match patterns like "2 of 3 files", "2/3", etc.
      return /\d+\s*(of|\/)\s*\d+/i.test(text);
    },
    { timeout }
  );
}

/**
 * Wait for specific file count completion
 */
export async function waitForFilesCompleted(
  page: Page,
  completedCount: number,
  totalCount: number,
  timeout = 10000
): Promise<void> {
  await page.waitForFunction(
    ({ completed, total }) => {
      const statusBar = document.querySelector('.uppy-StatusBar');
      if (!statusBar) return false;

      const text = statusBar.textContent || '';
      const match = text.match(/(\d+)\s*(?:of|\/)\s*(\d+)/i);
      if (!match) return false;

      const currentCompleted = parseInt(match[1], 10);
      return currentCompleted >= completed;
    },
    { completed: completedCount, total: totalCount },
    { timeout }
  );
}

/**
 * Wait for upload speed indicator to appear
 */
export async function waitForSpeedIndicator(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const indicators = document.querySelectorAll('.uppy-upload-stats, .uppy-StatusBar-content');
      for (const indicator of indicators) {
        const text = indicator.textContent || '';
        // Match speed patterns: "5 KB/s", "1.2 MB/s", etc.
        if (/\d+\.?\d*\s*(KB|MB|GB)\/s/i.test(text)) {
          return true;
        }
      }
      return false;
    },
    { timeout }
  );
}

/**
 * Wait for ETA (estimated time) to appear
 */
export async function waitForETA(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const etaElements = document.querySelectorAll('[data-cy="eta"], .uppy-StatusBar-eta');
      for (const element of etaElements) {
        if (element instanceof HTMLElement && element.offsetParent !== null) {
          const text = element.textContent || '';
          // Match time patterns: "2m", "30s", "1m 30s", etc.
          if (/\d+[smh]/i.test(text)) {
            return true;
          }
        }
      }
      return false;
    },
    { timeout }
  );
}

/**
 * Wait for batch clear operation to complete
 */
export async function waitForBatchClear(
  page: Page,
  timeout = 3000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
      return items.length === 0;
    },
    { timeout }
  );
}

/**
 * Wait for batch file selection state change
 */
export async function waitForBatchSelection(
  page: Page,
  expectedSelectedCount: number,
  timeout = 3000
): Promise<void> {
  await page.waitForFunction(
    (count) => {
      const selectedItems = document.querySelectorAll('.uppy-Dashboard-Item--selected');
      return selectedItems.length === count;
    },
    expectedSelectedCount,
    { timeout }
  );
}

/**
 * Wait for pause state to be applied
 */
export async function waitForPauseState(
  page: Page,
  timeout = 3000
): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check for paused items OR pause button changing to resume
      const pausedItems = document.querySelectorAll('.uppy-Dashboard-Item--paused');
      const resumeButton = document.querySelector('button:has-text("Resume")');

      return pausedItems.length > 0 || resumeButton !== null;
    },
    { timeout }
  );
}

/**
 * Wait for resume state to be applied
 */
export async function waitForResumeState(
  page: Page,
  timeout = 3000
): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check for uploading items OR pause button reappearing
      const uploadingItems = document.querySelectorAll('.uppy-Dashboard-Item--uploading');
      const pauseButton = document.querySelector('button:has-text("Pause")');

      return uploadingItems.length > 0 || pauseButton !== null;
    },
    { timeout }
  );
}

/**
 * Wait for batch error state
 * Monitors for any error indicators in the batch
 */
export async function waitForBatchError(
  page: Page,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const errorItems = document.querySelectorAll('.uppy-Dashboard-Item--error');
      const errorInformer = document.querySelector('.uppy-Informer-error');

      return errorItems.length > 0 || (errorInformer && errorInformer instanceof HTMLElement && errorInformer.offsetParent !== null);
    },
    { timeout }
  );
}

/**
 * Wait for specific error count in batch
 */
export async function waitForErrorCount(
  page: Page,
  expectedErrorCount: number,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (count) => {
      const errorItems = document.querySelectorAll('.uppy-Dashboard-Item--error');
      return errorItems.length === count;
    },
    expectedErrorCount,
    { timeout }
  );
}

/**
 * Wait for retry button to appear
 */
export async function waitForRetryAvailable(
  page: Page,
  timeout = 3000
): Promise<void> {
  await page.waitForFunction(
    () => {
      const retryButton = document.querySelector('button:has-text("Retry"), [aria-label*="Retry"]');
      return retryButton !== null && retryButton instanceof HTMLElement && retryButton.offsetParent !== null;
    },
    { timeout }
  );
}

/**
 * Monitor batch upload completion
 * Waits for all files to reach completed or error state
 */
export async function waitForBatchCompletion(
  page: Page,
  totalFiles: number,
  timeout = 30000
): Promise<{ completed: number; errors: number }> {
  await page.waitForFunction(
    (total) => {
      const completedItems = document.querySelectorAll('.uppy-Dashboard-Item--complete, .uppy-Dashboard-Item--uploaded');
      const errorItems = document.querySelectorAll('.uppy-Dashboard-Item--error');

      return (completedItems.length + errorItems.length) >= total;
    },
    totalFiles,
    { timeout }
  );

  // Get final counts
  const completed = await page.locator('.uppy-Dashboard-Item--complete, .uppy-Dashboard-Item--uploaded').count();
  const errors = await page.locator('.uppy-Dashboard-Item--error').count();

  return { completed, errors };
}

/**
 * Monitor concurrent upload state
 * Tracks number of files actively uploading
 */
export async function getCurrentUploadCount(page: Page): Promise<number> {
  return page.locator('.uppy-Dashboard-Item--uploading').count();
}

/**
 * Wait for concurrent upload limit to be reached
 */
export async function waitForConcurrentUploads(
  page: Page,
  minConcurrent: number,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (min) => {
      const uploadingItems = document.querySelectorAll('.uppy-Dashboard-Item--uploading');
      return uploadingItems.length >= min;
    },
    minConcurrent,
    { timeout }
  );
}

/**
 * Wait for all uploads in batch to start
 */
export async function waitForAllUploadsStarted(
  page: Page,
  totalFiles: number,
  timeout = 10000
): Promise<void> {
  await page.waitForFunction(
    (total) => {
      const uploadingItems = document.querySelectorAll('.uppy-Dashboard-Item--uploading');
      const completedItems = document.querySelectorAll('.uppy-Dashboard-Item--complete, .uppy-Dashboard-Item--uploaded');
      const errorItems = document.querySelectorAll('.uppy-Dashboard-Item--error');

      // All files should be in uploading, completed, or error state
      return (uploadingItems.length + completedItems.length + errorItems.length) === total;
    },
    totalFiles,
    { timeout }
  );
}

/**
 * Get batch upload statistics
 */
export async function getBatchUploadStats(page: Page): Promise<{
  total: number;
  uploading: number;
  completed: number;
  errors: number;
  pending: number;
}> {
  const total = await getFileCount(page);
  const uploading = await page.locator('.uppy-Dashboard-Item--uploading').count();
  const completed = await page.locator('.uppy-Dashboard-Item--complete, .uppy-Dashboard-Item--uploaded').count();
  const errors = await page.locator('.uppy-Dashboard-Item--error').count();
  const pending = total - uploading - completed - errors;

  return { total, uploading, completed, errors, pending };
}
