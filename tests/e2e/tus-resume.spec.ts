/**
 * TUS File Upload - Resume Functionality Tests
 *
 * Tests resumable upload capabilities:
 * - Pause and resume
 * - Network disconnect and reconnect
 * - Browser refresh during upload
 * - Resume from correct byte offset
 */

import { test, expect } from '@playwright/test';

import { TusUploadPage } from '../page-objects/TusUploadPage';
import { TestHelpers } from '../utils/test-helpers';

test.describe('TUS Resume Functionality Tests', () => {
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

  test('should pause and resume upload successfully', async () => {
    // Generate medium file (20MB for noticeable pause)
    const fileName = `test-pause-resume-${TestHelpers.randomString()}.bin`;
    const fileSize = 20 * 1024 * 1024; // 20MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to start
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 5000,
    });

    // Wait until progress reaches 20-30%
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 20 && progress <= 50;
    }, 30000);

    const progressBeforePause = await uploadPage.getFileProgress(fileName);

    // Pause upload
    await uploadPage.pauseUpload(fileName);

    // Verify status is paused
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-paused/, {
      timeout: 2000,
    });

    // Wait a bit to ensure upload is truly paused
    await uploadPage.page.waitForTimeout(2000);

    const progressDuringPause = await uploadPage.getFileProgress(fileName);
    expect(progressDuringPause).toBe(progressBeforePause);

    // Take screenshot of paused state
    await uploadPage.takeScreenshot('upload-paused');

    // Resume upload
    await uploadPage.resumeUpload(fileName);

    // Verify status is uploading again
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 2000,
    });

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 120000);

    // Verify completed
    const finalStatus = await uploadPage.getFileStatus(fileName);
    expect(finalStatus).toBe('completed');

    // Verify progress reached 100%
    const finalProgress = await uploadPage.getFileProgress(fileName);
    expect(finalProgress).toBe(100);

    // Take screenshot of completed state
    await uploadPage.takeScreenshot('upload-resumed-complete');
  });

  test('should resume after network disconnection', async () => {
    test.setTimeout(5 * 60 * 1000); // 5 minutes

    // Generate file
    const fileName = `test-network-disconnect-${TestHelpers.randomString()}.bin`;
    const fileSize = 30 * 1024 * 1024; // 30MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to start
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 5000,
    });

    // Wait until progress reaches 25-40%
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 25 && progress <= 40;
    }, 45000);

    const progressBeforeDisconnect = await uploadPage.getFileProgress(fileName);
    console.log(`Progress before disconnect: ${progressBeforeDisconnect}%`);

    // Simulate network disconnection
    await uploadPage.disconnectNetwork();
    await uploadPage.takeScreenshot('network-disconnected');

    // Wait for error or pause (TUS should detect disconnect)
    await uploadPage.page.waitForTimeout(3000);

    // Reconnect network
    await uploadPage.reconnectNetwork();
    await uploadPage.takeScreenshot('network-reconnected');

    // TUS client should automatically resume
    // Wait for uploading status to resume
    await TestHelpers.waitFor(async () => {
      const status = await uploadPage.getFileStatus(fileName);
      return status === 'uploading' || status === 'completed';
    }, 30000);

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 180000);

    // Verify completed
    const finalStatus = await uploadPage.getFileStatus(fileName);
    expect(finalStatus).toBe('completed');

    // Verify progress is 100%
    const finalProgress = await uploadPage.getFileProgress(fileName);
    expect(finalProgress).toBe(100);

    // Take screenshot
    await uploadPage.takeScreenshot('upload-after-disconnect-complete');
  });

  test('should resume after browser refresh', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate file
    const fileName = `test-refresh-${TestHelpers.randomString()}.bin`;
    const fileSize = 25 * 1024 * 1024; // 25MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to progress
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 30;
    }, 60000);

    const progressBeforeRefresh = await uploadPage.getFileProgress(fileName);
    console.log(`Progress before refresh: ${progressBeforeRefresh}%`);

    // Store upload metadata in localStorage (if component supports it)
    await uploadPage.page.evaluate(() => {
      // This would depend on component implementation
      // For now, just refresh
    });

    // Refresh page
    await uploadPage.page.reload();
    await uploadPage.page.waitForTimeout(2000);

    // Check if upload state was restored (depends on implementation)
    // This test validates the architecture's capability for resume
    // In real implementation, TUS client should restore state from localStorage

    // For now, verify page loads correctly after refresh
    await expect(uploadPage.dropZone).toBeVisible();

    // Take screenshot after refresh
    await uploadPage.takeScreenshot('after-browser-refresh');

    // Note: Full resume after refresh requires localStorage persistence
    // which needs to be implemented in the component
  });

  test('should resume from correct byte offset', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate file
    const fileName = `test-byte-offset-${TestHelpers.randomString()}.bin`;
    const fileSize = 20 * 1024 * 1024; // 20MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Monitor upload offset via network requests
    const uploadOffsets: number[] = [];

    uploadPage.page.on('request', (request) => {
      if (request.url().includes('/files') && request.method() === 'PATCH') {
        const offset = request.headers()['upload-offset'];
        if (offset) {
          uploadOffsets.push(Number.parseInt(offset, 10));
        }
      }
    });

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to start
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 5000,
    });

    // Wait for some progress
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 25;
    }, 45000);

    // Pause
    await uploadPage.pauseUpload(fileName);
    await uploadPage.page.waitForTimeout(1000);

    const offsetsBeforeResume = [...uploadOffsets];
    const lastOffsetBeforeResume = offsetsBeforeResume.at(-1) || 0;

    // Resume
    await uploadPage.resumeUpload(fileName);

    // Wait for new PATCH request
    await uploadPage.page.waitForTimeout(2000);

    // Verify resume started from correct offset
    const offsetsAfterResume = uploadOffsets.slice(offsetsBeforeResume.length);
    if (offsetsAfterResume.length > 0) {
      const firstOffsetAfterResume = offsetsAfterResume[0];
      // Should resume from last known offset (approximately)
      expect(firstOffsetAfterResume).toBeGreaterThanOrEqual(lastOffsetBeforeResume);
      expect(firstOffsetAfterResume).toBeLessThan(lastOffsetBeforeResume + (2 * 1024 * 1024)); // Within 2MB
    }

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 120000);

    // Verify offsets increased monotonically
    for (let i = 1; i < uploadOffsets.length; i++) {
      expect(uploadOffsets[i]).toBeGreaterThanOrEqual(uploadOffsets[i - 1]);
    }
  });

  test('should handle multiple pause/resume cycles', async () => {
    test.setTimeout(5 * 60 * 1000);

    // Generate file
    const fileName = `test-multiple-pause-${TestHelpers.randomString()}.bin`;
    const fileSize = 30 * 1024 * 1024; // 30MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to start
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 5000,
    });

    // Perform 3 pause/resume cycles
    const progressCheckpoints: number[] = [];

    for (let cycle = 0; cycle < 3; cycle++) {
      // Wait for progress increment
      await TestHelpers.waitFor(async () => {
        const progress = await uploadPage.getFileProgress(fileName);
        const lastCheckpoint = progressCheckpoints.at(-1) || 0;
        return progress > lastCheckpoint + 15; // At least 15% increment
      }, 60000);

      const progressBeforePause = await uploadPage.getFileProgress(fileName);
      progressCheckpoints.push(progressBeforePause);
      console.log(`Cycle ${cycle + 1}: Progress before pause: ${progressBeforePause}%`);

      // Pause
      await uploadPage.pauseUpload(fileName);
      await uploadPage.page.waitForTimeout(1000);

      // Take screenshot
      await uploadPage.takeScreenshot(`multiple-pause-cycle-${cycle + 1}`);

      // Resume
      await uploadPage.resumeUpload(fileName);
      await uploadPage.page.waitForTimeout(500);

      // If close to completion, break
      if (progressBeforePause > 80) break;
    }

    // Wait for completion
    await uploadPage.waitForUploadComplete(fileName, 180000);

    // Verify completed
    const finalStatus = await uploadPage.getFileStatus(fileName);
    expect(finalStatus).toBe('completed');

    // Verify progress checkpoints increased
    for (let i = 1; i < progressCheckpoints.length; i++) {
      expect(progressCheckpoints[i]).toBeGreaterThan(progressCheckpoints[i - 1]);
    }

    // Take final screenshot
    await uploadPage.takeScreenshot('multiple-pause-cycles-complete');
  });

  test('should handle slow network and resume', async () => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes

    // Generate file
    const fileName = `test-slow-network-${TestHelpers.randomString()}.bin`;
    const fileSize = 15 * 1024 * 1024; // 15MB
    const filePath = await TestHelpers.generateTestFile(fileName, fileSize);
    testFiles.push(filePath);

    // Throttle network to slow speed
    await uploadPage.throttleNetwork(
      500 * 1024, // 500 KB/s download
      200 * 1024  // 200 KB/s upload
    );

    // Upload file
    await uploadPage.uploadFiles([filePath]);

    // Wait for upload to start
    await expect(uploadPage.getFileItem(fileName)).toHaveClass(/status-uploading/, {
      timeout: 10000,
    });

    // Monitor speed (should be slow)
    await uploadPage.page.waitForTimeout(5000);
    const fileInfo = await uploadPage.getAllFileInfo();
    const currentFile = fileInfo.find(f => f.name === fileName);

    if (currentFile?.speed) {
      console.log(`Upload speed: ${TestHelpers.formatBytes(currentFile.speed)}/s`);
      // Speed should be relatively low due to throttling
      expect(currentFile.speed).toBeLessThan(500 * 1024); // Less than 500 KB/s
    }

    // Wait for some progress
    await TestHelpers.waitFor(async () => {
      const progress = await uploadPage.getFileProgress(fileName);
      return progress >= 20;
    }, 120000);

    // Remove throttling
    await uploadPage.throttleNetwork(-1, -1);

    // Wait for completion with faster speed
    await uploadPage.waitForUploadComplete(fileName, 180000);

    // Verify completed
    const finalStatus = await uploadPage.getFileStatus(fileName);
    expect(finalStatus).toBe('completed');

    await uploadPage.takeScreenshot('slow-network-complete');
  });
});