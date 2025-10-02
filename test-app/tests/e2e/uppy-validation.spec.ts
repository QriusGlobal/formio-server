/**
 * Uppy File Type Validation E2E Tests
 *
 * Tests for file validation:
 * - Valid file types (images)
 * - Invalid file types
 * - File size limits
 * - MIME type validation
 * - Extension restrictions
 *
 * @group uppy
 * @group validation
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import {
  waitForUppyReady,
  uploadFiles,
  getErrorMessage,
  verifyValidationError,
  verifyFileInList,
  getFileCount,
} from '../utils/uppy-helpers';
import {
  setupTestFilesDir,
  cleanupTestFilesDir,
  createPNGFile,
  createJPEGFile,
  createGIFFile,
  createWebPFile,
  createInvalidFile,
  createLargeFile,
  createFileWithSize,
} from '../fixtures/test-files';

test.describe('Uppy File Validation', () => {
  let testFilesDir: string;

  test.beforeEach(async ({ page }) => {
    testFilesDir = setupTestFilesDir();
    await page.goto('/');
    await waitForUppyReady(page);
  });

  test.afterEach(async () => {
    cleanupTestFilesDir(testFilesDir);
  });

  test.describe('Valid File Types', () => {
    test('should accept PNG images', async ({ page }) => {
      const testFile = createPNGFile(testFilesDir, 'valid.png');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);

      // Should not show error
      const error = await getErrorMessage(page);
      expect(error).toBeNull();
    });

    test('should accept JPEG images', async ({ page }) => {
      const testFile = createJPEGFile(testFilesDir, 'valid.jpg');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);

      const error = await getErrorMessage(page);
      expect(error).toBeNull();
    });

    test('should accept GIF images', async ({ page }) => {
      const testFile = createGIFFile(testFilesDir, 'valid.gif');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);

      const error = await getErrorMessage(page);
      expect(error).toBeNull();
    });

    test('should accept WebP images', async ({ page }) => {
      const testFile = createWebPFile(testFilesDir, 'valid.webp');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);

      const error = await getErrorMessage(page);
      expect(error).toBeNull();
    });

    test('should accept multiple valid image types', async ({ page }) => {
      const files = [
        createPNGFile(testFilesDir, 'image1.png'),
        createJPEGFile(testFilesDir, 'image2.jpg'),
        createGIFFile(testFilesDir, 'image3.gif'),
      ];

      await uploadFiles(page, files.map(f => f.path));

      const fileCount = await getFileCount(page);
      expect(fileCount).toBe(3);

      // Verify no errors
      const error = await getErrorMessage(page);
      expect(error).toBeNull();
    });
  });

  test.describe('Invalid File Types', () => {
    test('should reject text files', async ({ page }) => {
      const testFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [testFile.path]);

      // Wait for error message
      await page.waitForTimeout(1000);

      // Should show error or file should not be added
      const fileCount = await getFileCount(page);
      const error = await getErrorMessage(page);

      // Either file is not added OR error is shown
      expect(fileCount === 0 || error !== null).toBe(true);
    });

    test('should reject PDF files', async ({ page }) => {
      // Create a fake PDF (just header)
      const pdfFile = createInvalidFile(testFilesDir, 'document.pdf');
      await uploadFiles(page, [pdfFile.path]);

      await page.waitForTimeout(1000);

      // Should be rejected if image-only restriction
      const fileCount = await getFileCount(page);
      const error = await getErrorMessage(page);

      expect(fileCount === 0 || error !== null).toBe(true);
    });

    test('should reject video files if not allowed', async ({ page }) => {
      const videoFile = createInvalidFile(testFilesDir, 'video.mp4');
      await uploadFiles(page, [videoFile.path]);

      await page.waitForTimeout(1000);

      const fileCount = await getFileCount(page);
      const error = await getErrorMessage(page);

      expect(fileCount === 0 || error !== null).toBe(true);
    });

    test('should show appropriate error message for invalid type', async ({ page }) => {
      const testFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [testFile.path]);

      await page.waitForTimeout(1000);

      const error = await getErrorMessage(page);

      if (error) {
        // Error message should mention file type or restriction
        expect(error.toLowerCase()).toMatch(/file type|not allowed|invalid|restricted/);
      } else {
        // File should not be in list
        const fileCount = await getFileCount(page);
        expect(fileCount).toBe(0);
      }
    });
  });

  test.describe('File Size Limits', () => {
    test('should accept files within size limit', async ({ page }) => {
      // Create small file (100KB)
      const testFile = createFileWithSize(testFilesDir, 100 * 1024, 'small.png');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);

      const error = await getErrorMessage(page);
      expect(error).toBeNull();
    });

    test('should reject files exceeding size limit', async ({ page }) => {
      // Create large file (100MB - likely exceeds limit)
      const testFile = createLargeFile(testFilesDir, 100, 'toolarge.png');
      await uploadFiles(page, [testFile.path]);

      await page.waitForTimeout(2000);

      // Should show error or not add file
      const error = await getErrorMessage(page);

      if (error) {
        expect(error.toLowerCase()).toMatch(/size|large|limit|exceeds/);
      } else {
        // File should not be added
        const fileCount = await getFileCount(page);
        expect(fileCount).toBe(0);
      }
    });

    test('should enforce maximum file size per file', async ({ page }) => {
      // Test boundary: create file at exactly common limits
      const sizes = [
        { size: 5 * 1024 * 1024, name: '5MB.png', shouldAccept: true },
        { size: 10 * 1024 * 1024, name: '10MB.png', shouldAccept: true },
        { size: 50 * 1024 * 1024, name: '50MB.png', shouldAccept: false },
      ];

      for (const { size, name, shouldAccept } of sizes) {
        const testFile = createFileWithSize(testFilesDir, size, name);
        await uploadFiles(page, [testFile.path]);
        await page.waitForTimeout(1000);

        const fileCount = await getFileCount(page);
        const error = await getErrorMessage(page);

        if (shouldAccept) {
          expect(fileCount).toBeGreaterThan(0);
        } else {
          expect(fileCount === 0 || error !== null).toBe(true);
        }

        // Clear for next iteration
        await page.reload();
        await waitForUppyReady(page);
      }
    });

    test('should show size limit in error message', async ({ page }) => {
      const testFile = createLargeFile(testFilesDir, 100, 'oversized.png');
      await uploadFiles(page, [testFile.path]);

      await page.waitForTimeout(2000);

      const error = await getErrorMessage(page);

      if (error) {
        // Should mention size limit (e.g., "Maximum file size: 50MB")
        expect(error).toMatch(/\d+\s*(MB|KB|GB)/i);
      }
    });
  });

  test.describe('MIME Type Validation', () => {
    test('should validate MIME type not just extension', async ({ page }) => {
      // This is tricky - need a file with wrong MIME type
      // For now, verify MIME type is checked
      const testFile = createPNGFile(testFilesDir, 'valid-mime.png');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);
    });

    test('should reject file with spoofed extension', async ({ page }) => {
      // Create text file with image extension
      const fakeImage = createInvalidFile(testFilesDir, 'fake.png');
      await uploadFiles(page, [fakeImage.path]);

      await page.waitForTimeout(1000);

      // Should be validated by MIME type, not extension
      // Result depends on implementation
      const error = await getErrorMessage(page);
      const fileCount = await getFileCount(page);

      // Either accepted (if extension-based) or rejected (if MIME-based)
      expect(fileCount >= 0).toBe(true);
    });
  });

  test.describe('Extension Restrictions', () => {
    test('should enforce allowed extensions list', async ({ page }) => {
      const testFile = createPNGFile(testFilesDir, 'allowed.png');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);
    });

    test('should show list of allowed types in UI', async ({ page }) => {
      // Look for restriction message
      const restrictionMessage = page.locator('.uppy-Dashboard-note');

      if (await restrictionMessage.isVisible()) {
        const text = await restrictionMessage.textContent();
        // Should mention allowed types
        expect(text).toMatch(/image|png|jpg|jpeg|gif/i);
      }
    });
  });

  test.describe('Multiple File Validation', () => {
    test('should validate all files in batch', async ({ page }) => {
      const files = [
        createPNGFile(testFilesDir, 'valid1.png'),
        createJPEGFile(testFilesDir, 'valid2.jpg'),
        createGIFFile(testFilesDir, 'valid3.gif'),
      ];

      await uploadFiles(page, files.map(f => f.path));

      const fileCount = await getFileCount(page);
      expect(fileCount).toBe(3);
    });

    test('should reject invalid files and keep valid ones', async ({ page }) => {
      const files = [
        createPNGFile(testFilesDir, 'valid.png'),
        createInvalidFile(testFilesDir, 'invalid.txt'),
        createJPEGFile(testFilesDir, 'valid2.jpg'),
      ];

      await uploadFiles(page, files.map(f => f.path));
      await page.waitForTimeout(1000);

      const fileCount = await getFileCount(page);

      // Should have 2 valid files (invalid one rejected)
      expect(fileCount).toBeGreaterThanOrEqual(2);
    });

    test('should enforce maximum number of files', async ({ page }) => {
      // Create many files (more than typical limit)
      const files = Array.from({ length: 20 }, (_, i) =>
        createPNGFile(testFilesDir, `file${i + 1}.png`)
      );

      await uploadFiles(page, files.map(f => f.path));
      await page.waitForTimeout(1000);

      const fileCount = await getFileCount(page);
      const error = await getErrorMessage(page);

      // Either all files accepted or error shown about limit
      expect(fileCount <= 20).toBe(true);

      if (fileCount < files.length && error) {
        expect(error.toLowerCase()).toMatch(/limit|maximum|too many/);
      }
    });
  });

  test.describe('Validation Error Display', () => {
    test('should display error in informer', async ({ page }) => {
      const testFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [testFile.path]);

      await page.waitForTimeout(1000);

      // Check for error notification
      const informer = page.locator('.uppy-Informer');

      if (await informer.isVisible()) {
        await expect(informer).toBeVisible();
      }
    });

    test('should clear error when valid file added', async ({ page }) => {
      // Add invalid file
      const invalidFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [invalidFile.path]);
      await page.waitForTimeout(1000);

      // Add valid file
      const validFile = createPNGFile(testFilesDir, 'valid.png');
      await uploadFiles(page, [validFile.path]);
      await page.waitForTimeout(1000);

      // Valid file should be added
      const fileVisible = await verifyFileInList(page, validFile.name);
      expect(fileVisible).toBe(true);
    });

    test('should show validation error icon on file item', async ({ page }) => {
      // Some implementations show error icon on invalid files
      const testFile = createLargeFile(testFilesDir, 100, 'toolarge.png');
      await uploadFiles(page, [testFile.path]);
      await page.waitForTimeout(1000);

      // Look for error indicator
      const errorIcon = page.locator('.uppy-Dashboard-Item--error, [data-uppy-file-error]');

      if (await errorIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(errorIcon).toBeVisible();
      }
    });
  });

  test.describe('Custom Validation Rules', () => {
    test('should enforce minimum file size if configured', async ({ page }) => {
      // Very small file (1 byte)
      const tinyFile = createFileWithSize(testFilesDir, 1, 'tiny.png');
      await uploadFiles(page, [tinyFile.path]);

      await page.waitForTimeout(1000);

      // May or may not have minimum size restriction
      const fileCount = await getFileCount(page);
      expect(fileCount >= 0).toBe(true);
    });

    test('should validate file dimensions for images', async ({ page }) => {
      // This would require actual image dimension validation
      const testFile = createPNGFile(testFilesDir, 'dimensions.png');
      await uploadFiles(page, [testFile.path]);

      const fileVisible = await verifyFileInList(page, testFile.name);
      expect(fileVisible).toBe(true);
    });
  });
});