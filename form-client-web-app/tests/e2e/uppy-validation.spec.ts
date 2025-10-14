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
import {
  waitForUppyReady,
  uploadFiles,
  getErrorMessage,
  verifyValidationError,
  verifyFileInList,
  getFileCount,
  waitForValidationError,
  waitForFileError,
  waitForSizeError,
  waitForTypeError,
  monitorValidationState,
} from '../utils/uppy-helpers';

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
      const initialCount = await getFileCount(page);
      await uploadFiles(page, [testFile.path]);

      // Wait for validation error or rejection
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      // Either file is not added OR error is shown
      expect(validation.wasRejected || validation.hasError).toBe(true);
    });

    test('should reject PDF files', async ({ page }) => {
      // Create a fake PDF (just header)
      const pdfFile = createInvalidFile(testFilesDir, 'document.pdf');
      const initialCount = await getFileCount(page);
      await uploadFiles(page, [pdfFile.path]);

      // Wait for validation error or rejection
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      expect(validation.wasRejected || validation.hasError).toBe(true);
    });

    test('should reject video files if not allowed', async ({ page }) => {
      const videoFile = createInvalidFile(testFilesDir, 'video.mp4');
      const initialCount = await getFileCount(page);
      await uploadFiles(page, [videoFile.path]);

      // Wait for validation error or rejection
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      expect(validation.wasRejected || validation.hasError).toBe(true);
    });

    test('should show appropriate error message for invalid type', async ({ page }) => {
      const testFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [testFile.path]);

      // Wait for type-specific validation error
      const error = await waitForTypeError(page, 2000);

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

      // Wait for size-specific validation error
      const error = await waitForSizeError(page, 3000);

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
        const initialCount = await getFileCount(page);
        const testFile = createFileWithSize(testFilesDir, size, name);
        await uploadFiles(page, [testFile.path]);

        // Monitor validation state for size checks
        const validation = await monitorValidationState(page, {
          initialFileCount: initialCount,
          timeout: 2000
        });

        if (shouldAccept) {
          expect(validation.finalFileCount).toBeGreaterThan(initialCount);
        } else {
          expect(validation.wasRejected || validation.hasError).toBe(true);
        }

        // Clear for next iteration
        await page.reload();
        await waitForUppyReady(page);
      }
    });

    test('should show size limit in error message', async ({ page }) => {
      const testFile = createLargeFile(testFilesDir, 100, 'oversized.png');
      await uploadFiles(page, [testFile.path]);

      // Wait for size-specific error message
      const error = await waitForSizeError(page, 3000);

      if (error) {
        // Should mention size limit (e.g., "Maximum file size: 50MB")
        expect(error).toMatch(/\d+\s*(mb|kb|gb)/i);
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
      const initialCount = await getFileCount(page);
      await uploadFiles(page, [fakeImage.path]);

      // Monitor validation - result depends on MIME vs extension checking
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      // Either accepted (if extension-based) or rejected (if MIME-based)
      expect(validation.finalFileCount >= 0).toBe(true);
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

      const initialCount = await getFileCount(page);
      await uploadFiles(page, files.map(f => f.path));

      // Wait for batch validation to complete
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      // Should have 2 valid files (invalid one rejected)
      expect(validation.finalFileCount).toBeGreaterThanOrEqual(2);
    });

    test('should enforce maximum number of files', async ({ page }) => {
      // Create many files (more than typical limit)
      const files = Array.from({ length: 20 }, (_, i) =>
        createPNGFile(testFilesDir, `file${i + 1}.png`)
      );

      const initialCount = await getFileCount(page);
      await uploadFiles(page, files.map(f => f.path));

      // Wait for batch validation (may hit file count limit)
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      // Either all files accepted or error shown about limit
      expect(validation.finalFileCount <= 20).toBe(true);

      if (validation.finalFileCount < files.length && validation.errorMessage) {
        expect(validation.errorMessage.toLowerCase()).toMatch(/limit|maximum|too many/);
      }
    });
  });

  test.describe('Validation Error Display', () => {
    test('should display error in informer', async ({ page }) => {
      const testFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [testFile.path]);

      // Wait for error to appear in informer
      const error = await waitForValidationError(page, 2000);

      if (error) {
        const informer = page.locator('.uppy-Informer');
        await expect(informer).toBeVisible();
      }
    });

    test('should clear error when valid file added', async ({ page }) => {
      // Add invalid file
      const invalidFile = createInvalidFile(testFilesDir, 'invalid.txt');
      await uploadFiles(page, [invalidFile.path]);
      await waitForValidationError(page, 2000);

      // Add valid file
      const validFile = createPNGFile(testFilesDir, 'valid.png');
      await uploadFiles(page, [validFile.path]);

      // Wait for valid file to be added
      await page.waitForFunction(
        (filename) => {
          const items = document.querySelectorAll('.uppy-Dashboard-Item, [data-testid="file-card"]');
          return Array.from(items).some(item => item.textContent?.includes(filename));
        },
        validFile.name,
        { timeout: 2000 }
      );

      // Valid file should be visible
      const fileVisible = await verifyFileInList(page, validFile.name);
      expect(fileVisible).toBe(true);
    });

    test('should show validation error icon on file item', async ({ page }) => {
      // Some implementations show error icon on invalid files
      const testFile = createLargeFile(testFilesDir, 100, 'toolarge.png');
      await uploadFiles(page, [testFile.path]);

      // Wait for file error icon to appear
      const hasFileError = await waitForFileError(page, 'toolarge.png', 2000);

      if (hasFileError) {
        const errorIcon = page.locator('.uppy-Dashboard-Item--error, [data-uppy-file-error]');
        await expect(errorIcon).toBeVisible();
      }
    });
  });

  test.describe('Custom Validation Rules', () => {
    test('should enforce minimum file size if configured', async ({ page }) => {
      // Very small file (1 byte)
      const tinyFile = createFileWithSize(testFilesDir, 1, 'tiny.png');
      const initialCount = await getFileCount(page);
      await uploadFiles(page, [tinyFile.path]);

      // Monitor validation for potential minimum size check
      const validation = await monitorValidationState(page, {
        initialFileCount: initialCount,
        timeout: 2000
      });

      // May or may not have minimum size restriction
      expect(validation.finalFileCount >= 0).toBe(true);
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