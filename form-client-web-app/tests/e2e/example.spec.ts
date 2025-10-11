/**
 * Example Playwright Test
 *
 * Demonstrates usage of custom fixtures and page objects
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('File Upload - Basic', () => {
  test('should upload a small file successfully', async ({ fileUploadPage, gcsApi, request }) => {
    // Get test file path
    const testFile = path.join(__dirname, '../fixtures/test-files/test-1kb.txt');

    // Upload file
    await fileUploadPage.uploadFile(testFile);

    // Wait for upload to complete
    await fileUploadPage.waitForUploadComplete();

    // Verify upload succeeded
    const success = await fileUploadPage.isUploadSuccessful();
    expect(success).toBe(true);

    // Verify file appears in list
    const files = await fileUploadPage.getUploadedFiles();
    expect(files).toContain('test-1kb.txt');

    // Verify file exists in GCS
    const verification = await gcsApi.verifyFileExists(request, 'test-1kb.txt');
    expect(verification.exists).toBe(true);
    expect(verification.size).toBeGreaterThan(0);
  });

  test('should show progress during upload', async ({ fileUploadPage, eventMonitor }) => {
    const testFile = path.join(__dirname, '../fixtures/test-files/test-1mb.bin');

    await fileUploadPage.uploadFile(testFile);

    // Monitor progress events
    const progressEvents = await eventMonitor.getEventsByType('fileUpload.progress');
    expect(progressEvents.length).toBeGreaterThan(0);

    // Verify progress increases
    const progress = await fileUploadPage.getUploadProgress();
    expect(progress).toBeGreaterThan(0);

    await fileUploadPage.waitForUploadComplete();
  });

  test('should handle upload errors gracefully', async ({ fileUploadPage }) => {
    // Try to upload a non-existent file (will fail)
    const invalidFile = path.join(__dirname, '../fixtures/test-files/non-existent.txt');

    try {
      await fileUploadPage.uploadFile(invalidFile);
    } catch {
      // Expected to fail
    }

    // Check for error message
    const errorMessage = await fileUploadPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
});

test.describe('File Upload - Multiple Files', () => {
  test('should upload multiple files simultaneously', async ({ fileUploadPage, gcsApi, request }) => {
    const files = [
      path.join(__dirname, '../fixtures/test-files/test-1kb.txt'),
      path.join(__dirname, '../fixtures/test-files/test-1mb.bin')
    ];

    await fileUploadPage.uploadMultipleFiles(files);
    await fileUploadPage.waitForUploadComplete();

    const uploadedFiles = await fileUploadPage.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(2);

    // Verify both files in GCS
    for (const filename of ['test-1kb.txt', 'test-1mb.bin']) {
      const verification = await gcsApi.verifyFileExists(request, filename);
      expect(verification.exists).toBe(true);
    }
  });
});

test.describe('TUS Upload - Resumable', () => {
  test('@tus should support resumable uploads', async ({ tusUploadPage }) => {
    const testFile = path.join(__dirname, '../fixtures/test-files/test-10mb.bin');

    const isResumable = await tusUploadPage.testResumability(testFile);
    expect(isResumable).toBe(true);
  });

  test('@tus should track chunk upload progress', async ({ tusUploadPage }) => {
    const testFile = path.join(__dirname, '../fixtures/test-files/test-1mb.bin');

    await tusUploadPage.uploadFileWithTus(testFile, {
      chunkSize: 256 * 1024 // 256KB chunks
    });

    await tusUploadPage.waitForUploadComplete();

    const stats = await tusUploadPage.getUploadStats();
    expect(stats.percentage).toBe(100);
    expect(stats.chunksUploaded).toBeGreaterThan(0);
  });
});

test.describe('Uppy Upload - Dashboard', () => {
  test('@uppy should upload via Uppy Dashboard', async ({ uppyUploadPage }) => {
    const testFile = path.join(__dirname, '../fixtures/test-files/test-1kb.txt');

    await uppyUploadPage.uploadFileWithUppy(testFile);

    const success = await uppyUploadPage.isUploadSuccessful();
    expect(success).toBe(true);
  });

  test('@uppy should enforce file restrictions', async ({ uppyUploadPage }) => {
    const result = await uppyUploadPage.testFileRestrictions({
      maxFileSize: 1024, // 1KB max
      allowedFileTypes: ['.txt']
    });

    expect(result.accepted).toBeDefined();
  });
});

test.describe('Edge Cases', () => {
  test('@edge should handle very large files', async ({ fileUploadPage }) => {
    test.setTimeout(300000); // 5 minutes

    const testFile = path.join(__dirname, '../fixtures/test-files/test-100mb.bin');

    await fileUploadPage.uploadFile(testFile);
    await fileUploadPage.waitForUploadComplete(180000); // 3 minutes timeout

    const success = await fileUploadPage.isUploadSuccessful();
    expect(success).toBe(true);
  });

  test('@edge should handle network interruptions', async ({ tusUploadPage }) => {
    const testFile = path.join(__dirname, '../fixtures/test-files/test-10mb.bin');

    await tusUploadPage.uploadFileWithTus(testFile);

    // Simulate network interruption after 2 seconds
    await tusUploadPage.page.waitForTimeout(2000);
    await tusUploadPage.simulateNetworkInterruption(5000);

    // Should resume after network recovers
    await tusUploadPage.waitForUploadComplete(120000);

    const success = await tusUploadPage.isUploadSuccessful();
    expect(success).toBe(true);
  });
});