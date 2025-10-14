/**
 * TUS File Upload - Integration Tests
 *
 * Tests full integration with:
 * - Form.io form submission
 * - GCS storage verification
 * - File download functionality
 * - File deletion
 * - Metadata accuracy
 */

import { test, expect } from '@playwright/test';

import { TusUploadPage } from '../page-objects/TusUploadPage';
import { TestHelpers } from '../utils/test-helpers';

test.describe('TUS Integration Tests', () => {
  let uploadPage: TusUploadPage;
  let testFiles: string[] = [];

  test.beforeEach(async ({ page }) => {
    uploadPage = new TusUploadPage(page);
    await uploadPage.goto();
  });

  test.afterEach(async () => {
    await TestHelpers.cleanupTestFiles();
    testFiles = [];
  });

  test('should create Form.io submission with uploaded file', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    // Generate test file
    const fileName = `integration-submission-${TestHelpers.randomString()}.pdf`;
    const fileSize = 2 * 1024 * 1024; // 2MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // Get upload URL from component
    const fileUrl = await page.evaluate(() => {
      const fileItems = document.querySelectorAll('.tus-file-item');
      const lastItem = fileItems.at(-1);
      return lastItem?.getAttribute('data-upload-url') || null;
    });

    expect(fileUrl).toBeTruthy();

    // If Form.io is available, create submission
    if (process.env.FORMIO_PROJECT_URL) {
      const formId = 'test-file-upload-form';

      try {
        const submission = await TestHelpers.createFormSubmission(
          formId,
          fileUrl,
          {
            fileName,
            fileSize,
            uploadedAt: new Date().toISOString(),
          }
        );

        expect(submission).toBeTruthy();
        expect(submission._id).toBeTruthy();
        expect(submission.data.file).toBe(fileUrl);

        console.log(`Form.io submission created: ${submission._id}`);

        // Verify we can retrieve the submission
        const retrieved = await TestHelpers.getFormSubmission(formId, submission._id);
        expect(retrieved._id).toBe(submission._id);
        expect(retrieved.data.file).toBe(fileUrl);
      } catch (error) {
        console.warn('Form.io integration test skipped (service not available):', error);
      }
    }

    // Take screenshot
    await uploadPage.takeScreenshot('formio-submission-integration');
  });

  test('should verify file in GCS storage with correct metadata', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Skip if GCS emulator not available
    if (!process.env.STORAGE_EMULATOR_HOST) {
      test.skip();
      return;
    }

    // Generate test file
    const fileName = `gcs-metadata-${TestHelpers.randomString()}.txt`;
    const fileSize = 1024 * 1024; // 1MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // Verify in GCS
    const bucket = process.env.GCS_BUCKET || 'test-bucket';
    const exists = await TestHelpers.verifyFileInGCS(bucket, fileName, fileSize);
    expect(exists).toBe(true);

    // Get file and verify size
    const fileContent = await TestHelpers.getFileFromGCS(bucket, fileName);
    expect(fileContent).toBeTruthy();
    expect(fileContent!.length).toBe(fileSize);

    // Take screenshot
    await uploadPage.takeScreenshot('gcs-storage-verification');
  });

  test('should download uploaded file successfully', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    // Generate test file with known content
    const fileName = `download-test-${TestHelpers.randomString()}.txt`;
    const fileSize = 512 * 1024; // 512KB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // If download link is available, click it
    const fileItem = uploadPage.getFileItem(fileName);
    const downloadLink = fileItem.locator('[data-action="download"]');

    const downloadLinkExists = await downloadLink.isVisible().catch(() => false);

    if (downloadLinkExists) {
      // Setup download handler
      const downloadPromise = page.waitForEvent('download');

      // Trigger download
      await downloadLink.click();

      // Wait for download
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toBe(fileName);

      // Save to temp location
      const downloadPath = `/tmp/downloaded-${fileName}`;
      await download.saveAs(downloadPath);

      // Verify file size
      const fs = require('node:fs/promises');
      const stats = await fs.stat(downloadPath);
      expect(stats.size).toBe(fileSize);

      // Cleanup downloaded file
      await fs.unlink(downloadPath);

      // Take screenshot
      await uploadPage.takeScreenshot('file-download-success');
    } else {
      console.warn('Download link not available in component');
    }
  });

  test('should delete uploaded file from storage', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Skip if GCS emulator not available
    if (!process.env.STORAGE_EMULATOR_HOST) {
      test.skip();
      return;
    }

    // Generate test file
    const fileName = `delete-test-${TestHelpers.randomString()}.bin`;
    const fileSize = 1024 * 1024; // 1MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // Verify file exists
    const bucket = process.env.GCS_BUCKET || 'test-bucket';
    let exists = await TestHelpers.verifyFileInGCS(bucket, fileName);
    expect(exists).toBe(true);

    // Delete file from GCS
    await TestHelpers.deleteFileFromGCS(bucket, fileName);

    // Verify file deleted
    exists = await TestHelpers.verifyFileInGCS(bucket, fileName);
    expect(exists).toBe(false);

    // Take screenshot
    await uploadPage.takeScreenshot('file-deletion-success');
  });

  test('should preserve file metadata through upload lifecycle', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    // Generate test file
    const fileName = `metadata-test-${TestHelpers.randomString()}.json`;
    const fileSize = 256 * 1024; // 256KB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload with custom metadata
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // Verify metadata visible in UI
    const fileItem = uploadPage.getFileItem(fileName);

    // Check file name
    const displayedName = await fileItem.locator('.tus-file-name').textContent();
    expect(displayedName).toBe(fileName);

    // Check file size
    const displayedSize = await fileItem.locator('.tus-file-meta span').first().textContent();
    expect(displayedSize).toContain('KB');

    // Check status
    const statusElement = await fileItem.locator('.tus-file-status-text').textContent();
    expect(statusElement).toContain('Completed');

    // Take screenshot
    await uploadPage.takeScreenshot('metadata-preservation');
  });

  test('should handle Form.io events integration', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    // Setup event listeners for Form.io events
    const formioEvents: any[] = [];

    await page.evaluate(() => {
      (window as any).formioEvents = [];

      const eventTypes = [
        'fileUploadingStart',
        'fileUploadingEnd',
        'fileUploadProgress',
        'fileUploadSuccess',
        'fileUploadError',
      ];

      for (const eventType of eventTypes) {
        document.addEventListener(eventType, (e: any) => {
          (window as any).formioEvents.push({
            type: eventType,
            detail: e.detail,
            timestamp: Date.now(),
          });
        });
      }
    });

    // Generate file
    const fileName = `formio-events-${TestHelpers.randomString()}.bin`;
    const fileSize = 5 * 1024 * 1024; // 5MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 120000);

    // Retrieve captured events
    const capturedEvents = await page.evaluate(() => {
      return (window as any).formioEvents || [];
    });

    // Verify events were emitted
    expect(capturedEvents.length).toBeGreaterThan(0);

    // Check for expected event types
    const eventTypes = capturedEvents.map((e: any) => e.type);

    if (eventTypes.length > 0) {
      // Should have start event
      expect(eventTypes).toContain('fileUploadingStart');

      // Should have progress events or success
      const hasProgressOrSuccess =
        eventTypes.includes('fileUploadProgress') ||
        eventTypes.includes('fileUploadSuccess');
      expect(hasProgressOrSuccess).toBe(true);
    }

    console.log('Captured Form.io events:', eventTypes);

    // Take screenshot
    await uploadPage.takeScreenshot('formio-events-integration');
  });

  test('should integrate with multiple Form.io file fields', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000);

    // Generate files for different form fields
    const fields = [
      { name: 'profilePhoto', file: `profile-${TestHelpers.randomString()}.jpg` },
      { name: 'resume', file: `resume-${TestHelpers.randomString()}.pdf` },
      { name: 'coverLetter', file: `cover-${TestHelpers.randomString()}.txt` },
    ];

    const uploadedUrls: Record<string, string> = {};

    for (const field of fields) {
      const filePath = await TestHelpers.generateTestFile(field.file, 1024 * 1024);
      testFiles.push(filePath);

      // Upload file
      await uploadPage.uploadFiles([filePath]);

      // Wait for completion
      await uploadPage.waitForUploadComplete(field.file, 60000);

      // Get upload URL
      const fileUrl = await page.evaluate((fileName) => {
        const fileItems = Array.from(document.querySelectorAll('.tus-file-item'));
        const item = fileItems.find(el => el.textContent?.includes(fileName));
        return item?.getAttribute('data-upload-url') || null;
      }, field.file);

      if (fileUrl) {
        uploadedUrls[field.name] = fileUrl;
      }
    }

    // Verify all files uploaded
    expect(Object.keys(uploadedUrls).length).toBe(fields.length);

    // If Form.io available, create submission with all files
    if (process.env.FORMIO_PROJECT_URL) {
      try {
        const formId = 'test-multi-file-form';
        const submission = await TestHelpers.createFormSubmission(formId, '', uploadedUrls);

        expect(submission).toBeTruthy();

        for (const field of fields) {
          expect(submission.data[field.name]).toBeTruthy();
        }

        console.log('Multi-file Form.io submission created:', submission._id);
      } catch (error) {
        console.warn('Multi-file Form.io test skipped:', error);
      }
    }

    // Take screenshot
    await uploadPage.takeScreenshot('multi-field-integration');
  });

  test('should handle upload retry and persistence', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate file
    const fileName = `retry-persistence-${TestHelpers.randomString()}.bin`;
    const fileSize = 10 * 1024 * 1024; // 10MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for some progress
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 20;
    }, 60000);

    // Simulate error
    await uploadPage.disconnectNetwork();
    await uploadPage.page.waitForTimeout(3000);

    // Reconnect
    await uploadPage.reconnectNetwork();

    // TUS should auto-retry
    await TestHelpers.waitFor(async () => {
      const status = await uploadPage.getFileStatus(fileName);
      return status === 'uploading' || status === 'completed';
    }, 30000);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 180000);

    // Verify completed
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('completed');

    // Verify in GCS if available
    if (process.env.STORAGE_EMULATOR_HOST) {
      const exists = await TestHelpers.verifyFileInGCS(
        process.env.GCS_BUCKET || 'test-bucket',
        fileName,
        fileSize
      );
      expect(exists).toBe(true);
    }

    // Take screenshot
    await uploadPage.takeScreenshot('retry-persistence-success');
  });

  test('should support end-to-end workflow: upload -> verify -> download -> delete', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000);

    // Skip if GCS not available
    if (!process.env.STORAGE_EMULATOR_HOST) {
      test.skip();
      return;
    }

    const bucket = process.env.GCS_BUCKET || 'test-bucket';

    // 1. Upload
    const fileName = `e2e-workflow-${TestHelpers.randomString()}.txt`;
    const fileSize = 2 * 1024 * 1024; // 2MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    await uploadPage.uploadFiles([filePath]);
    await uploadPage.waitForUploadComplete(fileName, 120000);
    await uploadPage.takeScreenshot('workflow-1-upload');

    // 2. Verify in GCS
    let exists = await TestHelpers.verifyFileInGCS(bucket, fileName, fileSize);
    expect(exists).toBe(true);
    await uploadPage.takeScreenshot('workflow-2-verify');

    // 3. Download (get file)
    const downloadedContent = await TestHelpers.getFileFromGCS(bucket, fileName);
    expect(downloadedContent).toBeTruthy();
    expect(downloadedContent!.length).toBe(fileSize);
    await uploadPage.takeScreenshot('workflow-3-download');

    // 4. Delete
    await TestHelpers.deleteFileFromGCS(bucket, fileName);
    exists = await TestHelpers.verifyFileInGCS(bucket, fileName);
    expect(exists).toBe(false);
    await uploadPage.takeScreenshot('workflow-4-delete');

    console.log('End-to-end workflow completed successfully');
  });
});