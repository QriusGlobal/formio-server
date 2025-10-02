/**
 * E2E Tests for Network Resilience and Upload Recovery
 *
 * Tests upload behavior under various network conditions
 */

import { test, expect } from '../../fixtures/formio.fixture';
import { FormioModulePage } from '../../pages/FormioModulePage';
import { TusUploadComponent } from '../../pages/TusUploadComponent';
import { UppyDashboard } from '../../pages/UppyDashboard';

test.describe('Network Resilience Tests', () => {
  test('should resume TUS upload after network interruption', async ({ page, upload, context }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Generate large file for interruption test
    const testFile = await upload.files.generate(10 * 1024 * 1024, 'network-test.pdf', 'application/pdf');

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for upload to progress
    await page.waitForTimeout(2000);

    // Get progress before interruption
    const progressBefore = await tusComponent.getProgress();
    expect(progressBefore).toBeGreaterThan(0);
    expect(progressBefore).toBeLessThan(100);

    // Simulate network interruption
    await context.setOffline(true);

    // Wait for error detection
    await page.waitForTimeout(3000);

    // Restore network
    await context.setOffline(false);

    // Upload should automatically resume or allow manual resume
    const resumeButtonVisible = await tusComponent.resumeButton.isVisible();
    if (resumeButtonVisible) {
      await tusComponent.resumeUpload();
    } else {
      // Wait for auto-resume
      await page.waitForTimeout(2000);
    }

    // Wait for upload to complete
    await tusComponent.waitForUploadComplete(60000);

    // Verify upload completed successfully
    const finalProgress = await tusComponent.getProgress();
    expect(finalProgress).toBe(100);

    // Verify file integrity
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
  });

  test('should handle slow network conditions', async ({ page, upload, context }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Simulate slow 3G network
    await context.route('**/*', async (route) => {
      // Add artificial delay to simulate slow network
      await page.waitForTimeout(100);
      await route.continue();
    });

    // Generate test file
    const testFile = await upload.files.generate(2 * 1024 * 1024, 'slow-network.pdf', 'application/pdf');

    // Start upload
    const startTime = Date.now();
    await tusComponent.uploadFile(testFile.path);

    // Wait for upload with extended timeout
    await tusComponent.waitForUploadComplete(120000);

    const uploadTime = Date.now() - startTime;

    // Verify upload completed despite slow network
    const finalProgress = await tusComponent.getProgress();
    expect(finalProgress).toBe(100);

    // Log slow network performance
    console.log(`Slow network upload completed in ${uploadTime}ms`);
  });

  test('should handle intermittent network failures', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Generate test file
    const testFile = await upload.files.generate(5 * 1024 * 1024, 'intermittent-test.pdf', 'application/pdf');

    // Mock intermittent failures
    let requestCount = 0;
    await page.route('**/files/**', async (route) => {
      requestCount++;
      // Fail every 3rd request
      if (requestCount % 3 === 0) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for upload with retries
    await tusComponent.waitForUploadComplete(90000);

    // Verify upload succeeded despite failures
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);

    // Verify multiple attempts were made
    expect(requestCount).toBeGreaterThan(3);
  });

  test('should handle complete network loss and recovery', async ({ page, upload, context }) => {
    const formPage = new FormioModulePage(page);
    const uppyDashboard = new UppyDashboard(page);

    await formPage.goto();
    await uppyDashboard.open();

    // Generate test files
    const files = await upload.files.generateMultiple(2, 3 * 1024 * 1024);

    // Start upload
    await uppyDashboard.browseFiles(files.map(f => f.path));
    await uppyDashboard.startUpload();

    // Wait for upload to start
    await page.waitForTimeout(2000);

    // Simulate complete network loss
    await context.setOffline(true);

    // Wait for error detection
    await page.waitForTimeout(5000);

    // Check for error state
    const hasErrors = await uppyDashboard.hasErrors();
    expect(hasErrors).toBe(true);

    // Restore network
    await context.setOffline(false);

    // Wait for reconnection
    await page.waitForTimeout(2000);

    // Retry failed uploads
    for (const file of await uppyDashboard.getFileNames()) {
      await uppyDashboard.retryFailedUpload(file);
    }

    // Wait for uploads to complete
    await uppyDashboard.waitForUploadComplete(60000);

    // Verify all files uploaded
    const progress = await uppyDashboard.getUploadProgress();
    expect(progress.uploadedFiles).toBe(2);
    expect(progress.percentage).toBe(100);
  });

  test('should preserve upload progress across page refresh', async ({ page, upload, context }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Generate large file
    const testFile = await upload.files.generate(20 * 1024 * 1024, 'refresh-test.pdf', 'application/pdf');

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for partial upload
    await page.waitForTimeout(3000);

    // Get progress and upload ID
    const progressBefore = await tusComponent.getProgress();
    const chunkInfo = await tusComponent.getChunkInfo();
    expect(progressBefore).toBeGreaterThan(0);
    expect(progressBefore).toBeLessThan(100);

    // Get upload metadata
    const uploadMetadata = await tusComponent.getUploadMetadata();

    // Refresh the page
    await page.reload();
    await formPage.waitForFormReady();

    // Restore upload state
    await page.evaluate((metadata) => {
      localStorage.setItem('tus-upload-metadata', JSON.stringify(metadata));
    }, uploadMetadata);

    // Resume upload
    if (await tusComponent.resumeButton.isVisible()) {
      await tusComponent.resumeUpload();
    }

    // Wait for completion
    await tusComponent.waitForUploadComplete(60000);

    // Verify upload completed from where it left off
    const finalProgress = await tusComponent.getProgress();
    expect(finalProgress).toBe(100);

    const finalChunkInfo = await tusComponent.getChunkInfo();
    expect(finalChunkInfo.uploadedChunks).toBeGreaterThanOrEqual(chunkInfo.uploadedChunks);
  });

  test('should handle timeout and retry', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Generate test file
    const testFile = await upload.files.generate(1024 * 1024, 'timeout-test.pdf', 'application/pdf');

    // Mock slow responses to trigger timeout
    await page.route('**/files/**', async (route) => {
      // Delay response to trigger timeout
      await page.waitForTimeout(15000);
      await route.continue();
    });

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for timeout and retry
    await page.waitForTimeout(20000);

    // Should show error or retry state
    const hasError = await tusComponent.hasError();
    const canResume = await tusComponent.resumeButton.isVisible();

    expect(hasError || canResume).toBe(true);
  });

  test('should handle concurrent uploads with network issues', async ({ page, upload, context }) => {
    const formPage = new FormioModulePage(page);
    const uppyDashboard = new UppyDashboard(page);

    await formPage.goto();
    await uppyDashboard.open();

    // Generate multiple files
    const files = await upload.files.generateMultiple(5, 2 * 1024 * 1024);

    // Add all files
    await uppyDashboard.browseFiles(files.map(f => f.path));

    // Mock network issues for some uploads
    let requestCount = 0;
    await page.route('**/files/**', async (route) => {
      requestCount++;
      // Fail some requests randomly
      if (Math.random() < 0.3) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Start all uploads
    await uppyDashboard.startUpload();

    // Wait for uploads with retries
    await uppyDashboard.waitForUploadComplete(120000);

    // Verify all files eventually uploaded
    const progress = await uppyDashboard.getUploadProgress();
    expect(progress.uploadedFiles).toBe(5);
    expect(progress.percentage).toBe(100);

    // Verify retries occurred
    expect(requestCount).toBeGreaterThan(5);
  });

  test('should handle network bandwidth throttling', async ({ page, upload, context }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Apply network throttling (simulate slow connection)
    await context.route('**/*', async (route, request) => {
      const response = await route.fetch();

      // Throttle response
      if (request.method() === 'PATCH') {
        await page.waitForTimeout(500); // Add 500ms delay per chunk
      }

      await route.fulfill({ response });
    });

    // Generate test file
    const testFile = await upload.files.generate(5 * 1024 * 1024, 'throttled.pdf', 'application/pdf');

    // Track upload speed
    const startTime = Date.now();
    await tusComponent.uploadFile(testFile.path);

    // Monitor progress periodically
    const progressUpdates: { time: number; progress: number }[] = [];
    const interval = setInterval(async () => {
      const progress = await tusComponent.getProgress();
      progressUpdates.push({
        time: Date.now() - startTime,
        progress
      });
    }, 1000);

    // Wait for completion
    await tusComponent.waitForUploadComplete(180000);
    clearInterval(interval);

    const totalTime = Date.now() - startTime;

    // Calculate average speed
    const avgSpeed = (testFile.size / (totalTime / 1000)) / (1024 * 1024);

    console.log(`Throttled upload completed:
      File Size: ${testFile.size / (1024 * 1024)}MB
      Total Time: ${totalTime}ms
      Average Speed: ${avgSpeed.toFixed(2)}MB/s
      Progress Updates: ${progressUpdates.length}
    `);

    // Verify upload completed despite throttling
    expect(await tusComponent.getProgress()).toBe(100);
  });

  test('should handle server connection reset', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Generate test file
    const testFile = await upload.files.generate(3 * 1024 * 1024, 'reset-test.pdf', 'application/pdf');

    // Mock connection reset after partial upload
    let resetTriggered = false;
    await page.route('**/files/**', async (route, request) => {
      if (request.method() === 'PATCH' && !resetTriggered) {
        // Simulate connection reset mid-upload
        const randomDelay = Math.random() * 2000 + 1000;
        await page.waitForTimeout(randomDelay);

        resetTriggered = true;
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for error and recovery
    await page.waitForTimeout(5000);

    // Resume if needed
    if (await tusComponent.resumeButton.isVisible()) {
      await tusComponent.resumeUpload();
    }

    // Wait for completion
    await tusComponent.waitForUploadComplete(60000);

    // Verify upload recovered from reset
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
    expect(resetTriggered).toBe(true);
  });
});