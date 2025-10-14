/**
 * TUS File Upload - Concurrent Upload Tests
 *
 * Tests concurrent upload scenarios:
 * - Upload 5 files simultaneously
 * - Verify all complete successfully
 * - Check memory usage stays reasonable
 * - Verify correct progress for each file
 * - Test mixed file sizes
 */

import { test, expect } from '@playwright/test';

import { TusUploadPage } from '../page-objects/TusUploadPage';
import { TestHelpers } from '../utils/test-helpers';

test.describe('TUS Concurrent Upload Tests', () => {
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

  test('should upload 5 files simultaneously', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate 5 files of 10MB each
    const fileNames: string[] = [];
    const filePaths: string[] = [];
    const fileSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < 5; i++) {
      const fileName = `concurrent-${i}-${TestHelpers.randomString()}.bin`;
      const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
      fileNames.push(fileName);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Upload all files at once
    await uploadPage.uploadFiles(filePaths);

    // Verify all files appear
    for (const fileName of fileNames) {
      await expect(uploadPage.getFileItem(fileName)).toBeVisible();
    }

    // Verify all start uploading
    for (const fileName of fileNames) {
      await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-(uploading|completed)/, {
        timeout: 10000,
      });
    }

    // Take screenshot during concurrent upload
    await uploadPage.takeScreenshot('concurrent-uploads-in-progress');

    // Wait for all to complete
    await uploadPage.waitForAllUploadsComplete(300000); // 5 minutes

    // Verify all completed
    const allInfo = await uploadPage.getAllFileInfo();
    expect(allInfo.length).toBe(5);

    for (const fileInfo of allInfo) {
      expect(fileInfo.status).toBe('completed');
      expect(fileInfo.progress).toBe(100);
    }

    // Take final screenshot
    await uploadPage.takeScreenshot('concurrent-uploads-complete');

    // Verify in GCS if available
    if (process.env.STORAGE_EMULATOR_HOST) {
      for (const fileName of fileNames) {
        const exists = await TestHelpers.verifyFileInGCS(
          process.env.GCS_BUCKET || 'test-bucket',
          fileName,
          fileSize
        );
        expect(exists).toBe(true);
      }
    }
  });

  test('should handle mixed file sizes concurrently', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate files of different sizes
    const files = [
      { name: `small-${TestHelpers.randomString()}.txt`, size: 100 * 1024 }, // 100KB
      { name: `medium1-${TestHelpers.randomString()}.bin`, size: 5 * 1024 * 1024 }, // 5MB
      { name: `medium2-${TestHelpers.randomString()}.bin`, size: 10 * 1024 * 1024 }, // 10MB
      { name: `large1-${TestHelpers.randomString()}.bin`, size: 25 * 1024 * 1024 }, // 25MB
      { name: `large2-${TestHelpers.randomString()}.bin`, size: 30 * 1024 * 1024 }, // 30MB
    ];

    const filePaths: string[] = [];

    for (const file of files) {
      const filePath = await TestHelpers.generateTestFile(file.name, file.size);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Upload all
    await uploadPage.uploadFiles(filePaths);

    // Track completion order
    const completionOrder: string[] = [];
    const startTime = Date.now();

    // Monitor completion
    while (completionOrder.length < files.length) {
      const allInfo = await uploadPage.getAllFileInfo();

      for (const info of allInfo) {
        if (info.status === 'completed' && !completionOrder.includes(info.name)) {
          completionOrder.push(info.name);
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          console.log(`${info.name} completed after ${elapsed}s`);
        }
      }

      if (completionOrder.length < files.length) {
        await uploadPage.page.waitForTimeout(1000);
      }
    }

    // Verify smallest file likely completed first
    expect(completionOrder[0]).toBe(files[0].name);

    // Verify all completed
    const finalInfo = await uploadPage.getAllFileInfo();
    expect(finalInfo.every(f => f.status === 'completed')).toBe(true);

    // Take screenshot
    await uploadPage.takeScreenshot('mixed-sizes-concurrent-complete');
  });

  test('should maintain individual progress for each concurrent upload', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate 4 files of 15MB each
    const fileNames: string[] = [];
    const filePaths: string[] = [];
    const fileSize = 15 * 1024 * 1024;

    for (let i = 0; i < 4; i++) {
      const fileName = `progress-track-${i}-${TestHelpers.randomString()}.bin`;
      const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
      fileNames.push(fileName);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Upload all
    await uploadPage.uploadFiles(filePaths);

    // Track progress for each file
    const progressHistory = new Map<string, number[]>();
    for (const name of fileNames) progressHistory.set(name, []);

    // Monitor progress for 30 seconds or until all complete
    const monitorDuration = 30000;
    const monitorInterval = 1000;
    const iterations = monitorDuration / monitorInterval;

    for (let i = 0; i < iterations; i++) {
      const allInfo = await uploadPage.getAllFileInfo();

      for (const info of allInfo) {
        const history = progressHistory.get(info.name);
        if (history) {
          history.push(info.progress);
        }
      }

      // Check if all completed
      if (allInfo.every(f => f.progress === 100)) {
        break;
      }

      await uploadPage.page.waitForTimeout(monitorInterval);
    }

    // Verify each file had independent progress
    for (const [fileName, history] of progressHistory.entries()) {
      // Progress should increase
      expect(history.length).toBeGreaterThan(0);

      // Progress should be non-decreasing
      for (let i = 1; i < history.length; i++) {
        expect(history[i]).toBeGreaterThanOrEqual(history[i - 1]);
      }

      // Should reach 100%
      expect(history.at(-1)).toBe(100);

      console.log(`${fileName}: Progress snapshots: ${history.slice(0, 10).join('% -> ')}%`);
    }

    // Wait for all to complete
    await uploadPage.waitForAllUploadsComplete(180000);

    // Take screenshot
    await uploadPage.takeScreenshot('individual-progress-tracking');
  });

  test('should handle memory efficiently during concurrent uploads', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000);

    // Generate 6 files of 20MB each (120MB total)
    const fileNames: string[] = [];
    const filePaths: string[] = [];
    const fileSize = 20 * 1024 * 1024;

    for (let i = 0; i < 6; i++) {
      const fileName = `memory-test-${i}-${TestHelpers.randomString()}.bin`;
      const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
      fileNames.push(fileName);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    // Upload all
    await uploadPage.uploadFiles(filePaths);

    // Monitor memory during upload
    const memorySnapshots: any[] = [];

    const monitorMemory = async () => {
      for (let i = 0; i < 30; i++) {
        const memory = await page.evaluate(() => {
          if (performance.memory) {
            return {
              used: performance.memory.usedJSHeapSize,
              total: performance.memory.totalJSHeapSize,
              timestamp: Date.now(),
            };
          }
          return null;
        });

        if (memory) {
          memorySnapshots.push(memory);
        }

        // Check if uploads complete
        const allInfo = await uploadPage.getAllFileInfo();
        if (allInfo.every(f => f.status === 'completed')) {
          break;
        }

        await page.waitForTimeout(2000);
      }
    };

    await monitorMemory();

    // Wait for all to complete
    await uploadPage.waitForAllUploadsComplete(300000);

    // Get final memory
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    // Analyze memory usage
    if (initialMemory && finalMemory && memorySnapshots.length > 0) {
      const maxMemory = Math.max(...memorySnapshots.map(s => s.used));
      const memoryIncrease = finalMemory.used - initialMemory.used;

      console.log(`Initial memory: ${TestHelpers.formatBytes(initialMemory.used)}`);
      console.log(`Peak memory: ${TestHelpers.formatBytes(maxMemory)}`);
      console.log(`Final memory: ${TestHelpers.formatBytes(finalMemory.used)}`);
      console.log(`Memory increase: ${TestHelpers.formatBytes(memoryIncrease)}`);

      // Memory increase should be reasonable (less than 2x file size)
      // This is a heuristic - actual limits depend on implementation
      expect(memoryIncrease).toBeLessThan(2 * fileSize);
    }

    // Take screenshot
    await uploadPage.takeScreenshot('memory-efficient-concurrent');
  });

  test('should handle pause/resume on specific files during concurrent uploads', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate 5 files
    const fileNames: string[] = [];
    const filePaths: string[] = [];
    const fileSize = 15 * 1024 * 1024;

    for (let i = 0; i < 5; i++) {
      const fileName = `pause-concurrent-${i}-${TestHelpers.randomString()}.bin`;
      const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
      fileNames.push(fileName);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Upload all
    await uploadPage.uploadFiles(filePaths);

    // Wait for all to start
    await uploadPage.page.waitForTimeout(3000);

    // Pause files 0 and 2
    await uploadPage.pauseUpload(fileNames[0]);
    await uploadPage.pauseUpload(fileNames[2]);

    // Wait a bit
    await uploadPage.page.waitForTimeout(2000);

    // Verify paused files stopped
    const pausedProgress0 = await uploadPage.getFileProgress(fileNames[0]);
    const pausedProgress2 = await uploadPage.getFileProgress(fileNames[2]);

    // Other files should continue
    await uploadPage.page.waitForTimeout(3000);

    const stillPaused0 = await uploadPage.getFileProgress(fileNames[0]);
    const stillPaused2 = await uploadPage.getFileProgress(fileNames[2]);

    expect(stillPaused0).toBe(pausedProgress0);
    expect(stillPaused2).toBe(pausedProgress2);

    // Files 1, 3, 4 should have progressed
    const continuing1 = await uploadPage.getFileProgress(fileNames[1]);
    expect(continuing1).toBeGreaterThan(pausedProgress0);

    // Take screenshot
    await uploadPage.takeScreenshot('concurrent-selective-pause');

    // Resume paused files
    await uploadPage.resumeUpload(fileNames[0]);
    await uploadPage.resumeUpload(fileNames[2]);

    // Wait for all to complete
    await uploadPage.waitForAllUploadsComplete(180000);

    // Verify all completed
    const allInfo = await uploadPage.getAllFileInfo();
    expect(allInfo.every(f => f.status === 'completed')).toBe(true);

    // Take screenshot
    await uploadPage.takeScreenshot('concurrent-selective-resume-complete');
  });

  test('should handle cancellation of specific files during concurrent uploads', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate 5 files
    const fileNames: string[] = [];
    const filePaths: string[] = [];
    const fileSize = 12 * 1024 * 1024;

    for (let i = 0; i < 5; i++) {
      const fileName = `cancel-concurrent-${i}-${TestHelpers.randomString()}.bin`;
      const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
      fileNames.push(fileName);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Upload all
    await uploadPage.uploadFiles(filePaths);

    // Wait for uploads to start
    await uploadPage.page.waitForTimeout(3000);

    // Cancel file 1 and file 3
    await uploadPage.cancelUpload(fileNames[1]);
    await uploadPage.cancelUpload(fileNames[3]);

    // Verify cancelled files removed
    await expect(uploadPage.getFileItem(fileNames[1])).not.toBeVisible();
    await expect(uploadPage.getFileItem(fileNames[3])).not.toBeVisible();

    // Other files should continue
    const remainingFiles = [fileNames[0], fileNames[2], fileNames[4]];

    // Wait for remaining to complete
    await uploadPage.waitForAllUploadsComplete(180000);

    // Verify only remaining files completed
    const allInfo = await uploadPage.getAllFileInfo();
    expect(allInfo.length).toBe(3);
    expect(allInfo.every(f => f.status === 'completed')).toBe(true);

    // Take screenshot
    await uploadPage.takeScreenshot('concurrent-selective-cancel');
  });

  test('should maintain upload queue order', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate files with identifiable names
    const files = [
      { name: `order-1-first-${TestHelpers.randomString()}.txt`, size: 1024 },
      { name: `order-2-second-${TestHelpers.randomString()}.txt`, size: 1024 },
      { name: `order-3-third-${TestHelpers.randomString()}.txt`, size: 1024 },
      { name: `order-4-fourth-${TestHelpers.randomString()}.txt`, size: 1024 },
      { name: `order-5-fifth-${TestHelpers.randomString()}.txt`, size: 1024 },
    ];

    const filePaths: string[] = [];

    for (const file of files) {
      const filePath = await TestHelpers.generateTestFile(file.name, file.size);
      filePaths.push(filePath);
      testFiles.push(filePath);
    }

    // Upload sequentially (one at a time to check order)
    for (const filePath of filePaths) {
      await uploadPage.uploadFiles([filePath]);
      await uploadPage.page.waitForTimeout(200);
    }

    // Verify files appear in order in the UI
    const allInfo = await uploadPage.getAllFileInfo();

    for (const [i, file] of files.entries()) {
      expect(allInfo[i].name).toBe(file.name);
    }

    // Wait for all to complete
    await uploadPage.waitForAllUploadsComplete();

    // Take screenshot
    await uploadPage.takeScreenshot('upload-queue-order-maintained');
  });
});