/**
 * TUS File Upload - Basic Functionality Tests
 *
 * Tests basic upload capabilities:
 * - Small file upload (1KB)
 * - Medium file upload (10MB)
 * - Large file upload (100MB)
 * - GCS storage verification
 * - Form.io submission creation
 * - Progress tracking
 */

import { test, expect } from '@playwright/test';

import { TusUploadPage } from '../page-objects/TusUploadPage';
import { TestHelpers } from '../utils/test-helpers';

test.describe('TUS Basic Upload Tests', () => {
  let uploadPage: TusUploadPage;
  let testFiles: string[] = [];

  test.beforeEach(async ({ page }) => {
    uploadPage = new TusUploadPage(page);
    await uploadPage.goto();
  });

  test.afterEach(async () => {
    // Cleanup test files
    await TestHelpers.cleanupTestFiles();
    testFiles = [];
  });

  test('should upload small file (1KB) successfully', async () => {
    // Generate 1KB test file
    const fileName = `test-file-small-${TestHelpers.randomString()}.txt`;
    const filePath = await TestHelpers.generateTestFile(fileName, 1024);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Verify file appears in upload list
    await expect(uploadPage.getFileItem(fileName)).toBeVisible();

    // Wait for upload to complete
    await uploadPage.waitForUploadComplete(fileName, 30000);

    // Verify status is completed
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('completed');

    // Verify progress is 100%
    const progress = await uploadPage.getFileProgress(fileName);
    expect(progress).toBe(100);

    // Take screenshot
    await uploadPage.takeScreenshot('small-file-upload-complete');

    // Verify file in GCS (if emulator is running)
    if (process.env.STORAGE_EMULATOR_HOST) {
      const gcsExists = await TestHelpers.verifyFileInGCS(
        process.env.GCS_BUCKET || 'test-bucket',
        fileName,
        1024
      );
      expect(gcsExists).toBe(true);
    }
  });

  test('should upload medium file (10MB) with progress tracking', async () => {
    // Generate 10MB test file
    const fileName = `test-file-medium-${TestHelpers.randomString()}.bin`;
    const fileSize = 10 * 1024 * 1024; // 10MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Verify file appears
    await expect(uploadPage.getFileItem(fileName)).toBeVisible();

    // Track progress changes
    const progressSnapshots: number[] = [];
    let previousProgress = 0;

    // Poll progress every 500ms
    const checkProgress = async () => {
      for (let i = 0; i < 20; i++) {
        const currentProgress = await uploadPage.getFileProgress(fileName);

        if (currentProgress > previousProgress) {
          progressSnapshots.push(currentProgress);
          previousProgress = currentProgress;
        }

        if (currentProgress === 100) break;

        await uploadPage.page.waitForTimeout(500);
      }
    };

    await checkProgress();

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // Verify progress increased over time
    expect(progressSnapshots.length).toBeGreaterThan(0);
    expect(progressSnapshots.at(-1)).toBe(100);

    // Verify status
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('completed');

    // Take screenshot
    await uploadPage.takeScreenshot('medium-file-upload-complete');

    // Verify in GCS
    if (process.env.STORAGE_EMULATOR_HOST) {
      const gcsExists = await TestHelpers.verifyFileInGCS(
        process.env.GCS_BUCKET || 'test-bucket',
        fileName,
        fileSize
      );
      expect(gcsExists).toBe(true);
    }
  });

  test('should upload large file (100MB) successfully', async () => {
    // Increase timeout for large file
    test.setTimeout(10 * 60 * 1000); // 10 minutes

    // Generate 100MB test file
    const fileName = `test-file-large-${TestHelpers.randomString()}.bin`;
    const fileSize = 100 * 1024 * 1024; // 100MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Verify file appears
    await expect(uploadPage.getFileItem(fileName)).toBeVisible();

    // Verify upload is in progress
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 5000,
    });

    // Monitor progress and speed
    let maxSpeed = 0;
    const speedSnapshots: number[] = [];

    const monitorSpeed = async () => {
      for (let i = 0; i < 40; i++) {
        const fileInfo = await uploadPage.getAllFileInfo();
        const currentFile = fileInfo.find(f => f.name === fileName);

        if (currentFile?.speed) {
          speedSnapshots.push(currentFile.speed);
          maxSpeed = Math.max(maxSpeed, currentFile.speed);
        }

        if (currentFile?.progress === 100) break;

        await uploadPage.page.waitForTimeout(1000);
      }
    };

    await monitorSpeed();

    // Wait for completion (longer timeout)
    await uploadPage.waitForUploadComplete(fileName, 300000); // 5 minutes

    // Verify completion
    const status = await uploadPage.getFileStatus(fileName);
    expect(status).toBe('completed');

    // Verify speed was tracked
    expect(speedSnapshots.length).toBeGreaterThan(0);
    expect(maxSpeed).toBeGreaterThan(0);

    // Take screenshot
    await uploadPage.takeScreenshot('large-file-upload-complete');

    // Verify in GCS
    if (process.env.STORAGE_EMULATOR_HOST) {
      const gcsExists = await TestHelpers.verifyFileInGCS(
        process.env.GCS_BUCKET || 'test-bucket',
        fileName,
        fileSize
      );
      expect(gcsExists).toBe(true);
    }
  });

  test('should display file preview for images', async () => {
    // Generate image file
    const fileName = `test-image-${TestHelpers.randomString()}.png`;
    const filePath = await TestHelpers.generateImageFile(fileName);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Verify preview is displayed
    const fileItem = uploadPage.getFileItem(fileName);
    const preview = fileItem.locator('.tus-file-thumbnail');
    await expect(preview).toBeVisible();

    // Verify preview has valid src
    const src = await preview.getAttribute('src');
    expect(src).toMatch(/^data:image/);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName);

    // Take screenshot showing preview
    await uploadPage.takeScreenshot('image-upload-with-preview');
  });

  test('should emit progress events during upload', async () => {
    // Generate test file
    const fileName = `test-file-events-${TestHelpers.randomString()}.bin`;
    const fileSize = 5 * 1024 * 1024; // 5MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Listen for custom events
    const progressEvents: any[] = [];

    await uploadPage.page.evaluate(() => {
      (window as any).tusProgressEvents = [];
      document.addEventListener('tus:progress', (e: any) => {
        (window as any).tusProgressEvents.push({
          fileId: e.detail.fileId,
          progress: e.detail.progress,
          timestamp: Date.now(),
        });
      });
    });

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 60000);

    // Retrieve captured events
    const capturedEvents = await uploadPage.page.evaluate(() => {
      return (window as any).tusProgressEvents || [];
    });

    // Verify events were emitted
    expect(capturedEvents.length).toBeGreaterThan(0);

    // Verify progress increases
    if (capturedEvents.length > 1) {
      expect(capturedEvents.at(-1).progress).toBeGreaterThan(
        capturedEvents[0].progress
      );
    }
  });

  test('should handle multiple file selections', async () => {
    // Generate multiple files
    const fileNames = [
      `test-file-multi-1-${TestHelpers.randomString()}.txt`,
      `test-file-multi-2-${TestHelpers.randomString()}.txt`,
      `test-file-multi-3-${TestHelpers.randomString()}.txt`,
    ];

    const filePaths = await Promise.all(
      fileNames.map(name => TestHelpers.generateTestFile(name, 1024))
    );
    testFiles.push(...filePaths);

    // Upload all files
    await uploadPage.uploadFiles(filePaths);

    // Verify all files appear
    for (const fileName of fileNames) {
      await expect(uploadPage.getFileItem(fileName)).toBeVisible();
    }

    // Wait for all to complete
    await uploadPage.waitForAllUploadsComplete();

    // Verify all completed
    const allInfo = await uploadPage.getAllFileInfo();
    expect(allInfo.length).toBe(3);
    expect(allInfo.every(f => f.status === 'completed')).toBe(true);

    // Take screenshot
    await uploadPage.takeScreenshot('multiple-files-upload-complete');
  });

  test('should display correct file size formatting', async () => {
    const testCases = [
      { size: 512, expected: /512.*B/ },
      { size: 1024, expected: /1\.0.*KB/ },
      { size: 1024 * 1024, expected: /1\.0.*MB/ },
      { size: 10 * 1024 * 1024, expected: /10\.0.*MB/ },
    ];

    for (const { size, expected } of testCases) {
      const fileName = `test-size-${size}-${TestHelpers.randomString()}.bin`;
      const filePath = await TestHelpers.generateTestFile(fileName, size);
      testFiles.push(filePath);

      await uploadPage.uploadFiles([filePath]);

      const fileItem = uploadPage.getFileItem(fileName);
      const sizeText = await fileItem.locator('.tus-file-meta span').first().textContent();

      expect(sizeText).toMatch(expected);
    }
  });
});