/**
 * Uppy Test Utilities
 *
 * Helper functions for testing Uppy file upload component
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import { type Page, Locator, expect } from '@playwright/test';

import { UPPY_FILE_INPUT_SELECTOR, SELECTORS, waitForTestId } from "./test-selectors";

/**
 * Wait for Uppy to be fully initialized and ready
 */
export async function waitForUppyReady(page: Page, timeout = 10000): Promise<void> {
  // Wait for Uppy container with data-testid
  await waitForTestId(page, 'uppy-file-upload', timeout).catch(async () => {
    // Fallback to legacy selector if data-testid not found
    await page.waitForSelector(SELECTORS.legacy.uppyDashboard, { timeout });
  });

  // Wait for Dashboard to be rendered (try data-testid first, fallback to legacy)
  await waitForTestId(page, 'uppy-dashboard', timeout).catch(async () => {
    await page.waitForSelector(SELECTORS.legacy.uppyDashboard, { timeout });
  });

  // Wait for loading spinner to disappear (legacy selector)
  await page.waitForSelector('.uppy-loading-spinner', { state: 'hidden', timeout: 5000 }).catch(() => {
    // Loading spinner may not exist if Uppy loads quickly
  });

  // Give plugins time to initialize
  await page.waitForTimeout(500);
}

/**
 * Wait for a specific Uppy plugin to be available
 */
export async function waitForPlugin(page: Page, pluginName: string, timeout = 5000): Promise<void> {
  const pluginSelector = `[data-uppy-acquirer-id="${pluginName}"]`;
  await page.waitForSelector(pluginSelector, { timeout });
}

/**
 * Upload files via file input
 */
export async function uploadFiles(page: Page, filePaths: string[]): Promise<void> {
  const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR).first();
  await fileInput.setInputFiles(filePaths);

  // Wait for files to be added to Uppy
  await page.waitForTimeout(500);
}

/**
 * Create a test file in memory
 */
export function createTestFile(filename: string, content: string, mimeType: string): Buffer {
  return Buffer.from(content);
}

/**
 * Generate test image files
 */
export async function generateTestImages(count: number, basePath: string): Promise<string[]> {
  const files: string[] = [];
  const fsPromises = await import('node:fs/promises');

  for (let i = 0; i < count; i++) {
    const filename = `test-image-${i + 1}.png`;
    const filepath = path.join(basePath, filename);

    // Create a simple 1x1 PNG (valid PNG header + IDAT + IEND chunks)
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, // RGBA, CRC
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, // Compressed data
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, // CRC
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, // IEND chunk
      0x42, 0x60, 0x82 // CRC
    ]);

    await fsPromises.writeFile(filepath, pngData);
    files.push(filepath);
  }

  return files;
}

/**
 * Wait for upload to start
 */
export async function waitForUploadStart(page: Page, timeout = 5000): Promise<void> {
  // Try data-testid first
  await waitForTestId(page, 'uppy-progress-bar', timeout).catch(async () => {
    // Fallback to legacy selectors
    await page.waitForSelector('.uppy-StatusBar-actionBtn--upload[aria-label*="uploading"]', {
      timeout,
      state: 'visible'
    }).catch(async () => {
      // Alternative: check for progress bars
      await page.waitForSelector('.uppy-StatusBar-progress', { timeout });
    });
  });
}

/**
 * Wait for upload to complete
 */
export async function waitForUploadComplete(page: Page, timeout = 30000): Promise<void> {
  // Try data-testid success indicator first
  await waitForTestId(page, 'upload-success', timeout).catch(async () => {
    // Fallback: Wait for "Upload complete" or similar success message
    await page.waitForSelector('.uppy-StatusBar-statusPrimary:has-text("Complete")', {
      timeout
    }).catch(async () => {
      // Alternative: wait for all progress bars to finish
      await page.waitForFunction(() => {
        const progressBars = document.querySelectorAll('.uppy-ProgressBar-percentage');
        return Array.from(progressBars).every(bar =>
          bar.textContent?.includes('100%') || bar.textContent?.includes('complete')
        );
      }, { timeout });
    });
  });
}

/**
 * Get upload progress percentage
 */
export async function getUploadProgress(page: Page): Promise<number> {
  // Try data-testid first
  let progressText = await page.locator(SELECTORS.uppy.progressText).textContent().catch(() => null);

  // Fallback to legacy selector
  if (!progressText) {
    progressText = await page.locator('.uppy-StatusBar-percentage').textContent().catch(() => null);
  }

  if (!progressText) return 0;

  const match = progressText.match(/(\d+)%/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/**
 * Click the upload button
 */
export async function clickUploadButton(page: Page): Promise<void> {
  // Try data-testid first
  const uploadButton = page.locator(SELECTORS.uppy.uploadButton).or(
    page.locator('.uppy-StatusBar-actionBtn--upload')
  );
  await uploadButton.first().click();
}

/**
 * Remove a file from Uppy
 */
export async function removeFile(page: Page, filename: string): Promise<void> {
  // Try data-testid first
  const fileRow = page.locator(`${SELECTORS.uppy.fileCard}:has-text("${filename}")`).or(
    page.locator(`.uppy-Dashboard-Item:has-text("${filename}")`)
  ).first();

  // Click remove button (try data-testid first, fallback to legacy)
  const removeButton = fileRow.locator(SELECTORS.uppy.removeFileButton).or(
    fileRow.locator('[data-uppy-file-action-remove]')
  ).first();
  await removeButton.click();

  // Wait for file to be removed
  await fileRow.waitFor({ state: 'detached' });
}

/**
 * Verify file is in upload list
 */
export async function verifyFileInList(page: Page, filename: string): Promise<boolean> {
  // Try data-testid first, fallback to legacy
  const fileItem = page.locator(`${SELECTORS.uppy.fileCard}:has-text("${filename}")`).or(
    page.locator(`.uppy-Dashboard-Item:has-text("${filename}")`)
  ).first();
  return fileItem.isVisible();
}

/**
 * Get count of files in upload list
 */
export async function getFileCount(page: Page): Promise<number> {
  // Try data-testid first
  let items = page.locator(SELECTORS.uppy.fileCard);
  let count = await items.count();

  // Fallback to legacy selector if no items found
  if (count === 0) {
    items = page.locator(SELECTORS.legacy.uppyFileCard);
    count = await items.count();
  }

  return count;
}

/**
 * Intercept XHR/Fetch upload requests
 */
export async function interceptUploads(page: Page, mockResponse?: any): Promise<void> {
  await page.route('**/upload', async (route) => {
    if (mockResponse) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Simulate drag and drop file upload
 */
export async function dragAndDropFile(
  page: Page,
  filePath: string,
  dropZoneSelector = '.uppy-Dashboard-dropFilesHereHint'
): Promise<void> {
  const fsPromises = await import('node:fs/promises');
  const fileBuffer = await fsPromises.readFile(filePath);
  const fileName = path.basename(filePath);

  // Create DataTransfer with file
  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    const file = new File([new Uint8Array(data.buffer)], data.name, {
      type: data.type
    });
    dt.items.add(file);
    return dt;
  }, {
    buffer: Array.from(fileBuffer),
    name: fileName,
    type: getMimeType(fileName),
  });

  // Dispatch drop event
  const dropZone = page.locator(dropZoneSelector).first();
  await dropZone.dispatchEvent('drop', { dataTransfer });

  // Wait for file to appear
  await page.waitForTimeout(500);
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Wait for plugin modal to open
 */
export async function waitForPluginModal(page: Page, pluginName: string): Promise<void> {
  const modalSelector = `[data-uppy-super-focusable="true"]`;
  await page.waitForSelector(modalSelector, { state: 'visible' });
}

/**
 * Close plugin modal
 */
export async function closePluginModal(page: Page): Promise<void> {
  const closeButton = page.locator('.uppy-Dashboard-close');
  await closeButton.click();
  await page.waitForTimeout(300);
}

/**
 * Verify upload statistics
 */
export async function verifyUploadStats(
  page: Page,
  expectedFiles: number
): Promise<void> {
  const statsElement = page.locator('.uppy-upload-stats');
  const statsText = await statsElement.textContent();

  expect(statsText).toContain(`${expectedFiles}`);
}

/**
 * Check for error messages
 */
export async function getErrorMessage(page: Page): Promise<string | null> {
  const errorElement = page.locator('.uppy-Informer-error').first();

  if (await errorElement.isVisible()) {
    return errorElement.textContent();
  }

  return null;
}

/**
 * Verify file validation error
 */
export async function verifyValidationError(
  page: Page,
  errorMessage: string
): Promise<void> {
  const error = await getErrorMessage(page);
  expect(error).toBeTruthy();
  expect(error).toContain(errorMessage);
}

/**
 * Wait for validation error to appear
 * Replaces arbitrary timeouts with event-driven error detection
 */
export async function waitForValidationError(
  page: Page,
  timeout = 5000
): Promise<string | null> {
  try {
    // Wait for error informer to become visible
    const errorElement = page.locator('.uppy-Informer-error').first();
    await errorElement.waitFor({ state: 'visible', timeout });
    return await errorElement.textContent();
  } catch {
    // Check if file was simply not added (silent rejection)
    const fileCount = await getFileCount(page);
    if (fileCount === 0) {
      return 'File rejected (not added to list)';
    }
    return null;
  }
}

/**
 * Wait for error state on file item
 * Detects error icons or error states on individual files
 */
export async function waitForFileError(
  page: Page,
  filename?: string,
  timeout = 3000
): Promise<boolean> {
  try {
    let errorLocator;
    if (filename) {
      // Find error on specific file
      const fileItem = page.locator(`.uppy-Dashboard-Item:has-text("${filename}")`).first();
      errorLocator = fileItem.locator('.uppy-Dashboard-Item--error, [data-uppy-file-error]');
    } else {
      // Find any file error
      errorLocator = page.locator('.uppy-Dashboard-Item--error, [data-uppy-file-error]').first();
    }
    await errorLocator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for file rejection (not added to list)
 * Useful for validation that prevents file from being added
 */
export async function waitForFileRejection(
  page: Page,
  initialCount: number,
  timeout = 2000
): Promise<boolean> {
  // Wait a moment for file processing
  await page.waitForTimeout(100);

  try {
    // Use waitForFunction for precise state monitoring
    await page.waitForFunction(
      (count) => {
        const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
        return items.length === count; // File count didn't increase
      },
      initialCount,
      { timeout }
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for size validation error
 * Specifically looks for size-related error messages
 */
export async function waitForSizeError(
  page: Page,
  timeout = 3000
): Promise<string | null> {
  try {
    // Wait for error containing size keywords
    const errorElement = page.locator('.uppy-Informer-error:has-text(/size|large|limit|exceeds/i)').first();
    await errorElement.waitFor({ state: 'visible', timeout });
    return await errorElement.textContent();
  } catch {
    return null;
  }
}

/**
 * Wait for type validation error
 * Specifically looks for type-related error messages
 */
export async function waitForTypeError(
  page: Page,
  timeout = 3000
): Promise<string | null> {
  try {
    // Wait for error containing type keywords
    const errorElement = page.locator('.uppy-Informer-error:has-text(/type|allowed|invalid|restricted/i)').first();
    await errorElement.waitFor({ state: 'visible', timeout });
    return await errorElement.textContent();
  } catch {
    return null;
  }
}

/**
 * Monitor validation state change
 * Waits for either error display OR file rejection
 */
export async function monitorValidationState(
  page: Page,
  options: {
    initialFileCount?: number;
    expectError?: boolean;
    expectRejection?: boolean;
    timeout?: number;
  } = {}
): Promise<{
  hasError: boolean;
  errorMessage: string | null;
  wasRejected: boolean;
  finalFileCount: number;
}> {
  const {
    initialFileCount = 0,
    expectError = false,
    expectRejection = false,
    timeout = 3000
  } = options;

  // Race between error display and file rejection
  const results = await Promise.allSettled([
    waitForValidationError(page, timeout),
    page.waitForFunction(
      (count) => {
        const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
        return items.length !== count;
      },
      initialFileCount,
      { timeout }
    ).catch(() => null)
  ]);

  const errorMessage = results[0].status === 'fulfilled' ? results[0].value : null;
  const fileCountChanged = results[1].status === 'fulfilled';

  const finalFileCount = await getFileCount(page);
  const wasRejected = finalFileCount === initialFileCount;

  return {
    hasError: errorMessage !== null,
    errorMessage,
    wasRejected,
    finalFileCount
  };
}

/**
 * Clear all files from Uppy
 */
export async function clearAllFiles(page: Page): Promise<void> {
  const clearButton = page.locator('[data-cy="clear"]');

  if (await clearButton.isVisible()) {
    await clearButton.click();
    await page.waitForTimeout(300);
  }
}

/**
 * Get Golden Retriever storage data
 */
export async function getGoldenRetrieverData(page: Page): Promise<any> {
  return page.evaluate(() => {
    const keys = Object.keys(localStorage).filter(key =>
      key.startsWith('uppyState')
    );

    return keys.reduce((acc, key) => {
      acc[key] = JSON.parse(localStorage.getItem(key) || '{}');
      return acc;
    }, {} as Record<string, any>);
  });
}

/**
 * Clear Golden Retriever storage
 */
export async function clearGoldenRetrieverStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)
      .filter(key => key.startsWith('uppyState'))) localStorage.removeItem(key);
  });
}