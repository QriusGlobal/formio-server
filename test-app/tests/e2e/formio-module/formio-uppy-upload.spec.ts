/**
 * E2E Tests for Form.io Uppy Dashboard Component
 *
 * Tests the @formio/file-upload module's Uppy dashboard functionality
 */

import { test, expect } from '../../fixtures/formio.fixture';
import { FormioModulePage } from '../../pages/FormioModulePage';
import { UppyDashboard } from '../../pages/UppyDashboard';
import { monitorUploadRequests, verifyServerFile } from '../../fixtures/upload.fixture';

test.describe('Form.io Uppy Dashboard Component', () => {
  let formPage: FormioModulePage;
  let uppyDashboard: UppyDashboard;
  let uploadRequests: any[];

  test.beforeEach(async ({ page, formio, upload }) => {
    // Initialize page objects
    formPage = new FormioModulePage(page);
    uppyDashboard = new UppyDashboard(page, 'portfolio');

    // Login to Form.io
    await formio.formioAuth.login('test-admin@test.local', 'TestPass123!');

    // Navigate to module demo
    await formPage.goto();

    // Set up request monitoring
    uploadRequests = await monitorUploadRequests(page, '/files');

    // Open Uppy dashboard
    await uppyDashboard.open();
  });

  test('should upload files via drag and drop', async ({ page, upload }) => {
    // Generate test files
    const files = await upload.files.generateMultiple(3, 1024 * 1024);

    // Drag and drop files
    await uppyDashboard.dragAndDropFiles(files.map(f => f.path));

    // Verify files added to dashboard
    const fileCount = await uppyDashboard.getFileCount();
    expect(fileCount).toBe(3);

    // Start upload
    await uppyDashboard.startUpload();

    // Wait for completion
    await uppyDashboard.waitForUploadComplete();

    // Verify upload progress
    const progress = await uppyDashboard.getUploadProgress();
    expect(progress.percentage).toBe(100);
    expect(progress.uploadedFiles).toBe(3);
  });

  test('should capture photo using webcam plugin', async ({ page, context, upload }) => {
    // Grant camera permissions
    await context.grantPermissions(['camera']);

    // Use webcam
    await uppyDashboard.useWebcam();

    // Mock camera stream if needed
    await page.evaluate(() => {
      // Create mock MediaStream
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      // Draw test pattern
      ctx!.fillStyle = '#4CAF50';
      ctx!.fillRect(0, 0, 640, 480);
      ctx!.fillStyle = '#FFFFFF';
      ctx!.font = '48px Arial';
      ctx!.fillText('Test Photo', 160, 240);

      // Create mock stream
      const stream = canvas.captureStream();

      // Override getUserMedia
      (navigator.mediaDevices as any).getUserMedia = async () => stream;
    });

    // Capture photo
    await uppyDashboard.capturePhoto();

    // Verify photo added
    const fileCount = await uppyDashboard.getFileCount();
    expect(fileCount).toBeGreaterThan(0);

    // Get file names
    const fileNames = await uppyDashboard.getFileNames();
    expect(fileNames.some(name => name.includes('webcam'))).toBe(true);
  });

  test('should record screen using screen capture plugin', async ({ page, context, browserName }) => {
    // Skip on WebKit as screen capture is not supported
    test.skip(browserName === 'webkit', 'Screen capture not supported on WebKit');

    // Grant permissions
    await context.grantPermissions(['camera', 'microphone']);

    // Mock getDisplayMedia
    await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const stream = canvas.captureStream();

      (navigator.mediaDevices as any).getDisplayMedia = async () => stream;
    });

    // Start screen recording
    await uppyDashboard.startScreenRecording();

    // Record for 3 seconds
    await page.waitForTimeout(3000);

    // Stop recording
    await uppyDashboard.stopScreenRecording();

    // Verify recording added
    const fileCount = await uppyDashboard.getFileCount();
    expect(fileCount).toBeGreaterThan(0);

    const fileNames = await uppyDashboard.getFileNames();
    expect(fileNames.some(name => name.includes('screen'))).toBe(true);
  });

  test('should edit images using image editor plugin', async ({ page, upload }) => {
    // Upload an image first
    const imageFile = await upload.files.generate(500 * 1024, 'test-image.jpg', 'image/jpeg');
    await uppyDashboard.browseFiles(imageFile.path);

    // Open image editor
    await uppyDashboard.openImageEditor(0);

    // Apply edits
    await uppyDashboard.editImage('rotate');
    await uppyDashboard.editImage('saturate');

    // Save edits
    await uppyDashboard.saveImageEdits();

    // Verify file still present
    const fileCount = await uppyDashboard.getFileCount();
    expect(fileCount).toBe(1);
  });

  test('should import files from URL', async ({ page, upload }) => {
    // Mock fetch for URL import
    await page.route('https://example.com/test-file.pdf', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('%PDF-1.4 test content')
      });
    });

    // Import from URL
    await uppyDashboard.importFromUrl('https://example.com/test-file.pdf');

    // Verify file added
    const fileCount = await uppyDashboard.getFileCount();
    expect(fileCount).toBe(1);

    const fileNames = await uppyDashboard.getFileNames();
    expect(fileNames[0]).toContain('test-file.pdf');
  });

  test('should record audio using audio plugin', async ({ page, context, browserName }) => {
    // Grant microphone permission
    await context.grantPermissions(['microphone']);

    // Mock audio stream
    await page.evaluate(() => {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const destination = audioContext.createMediaStreamDestination();
      oscillator.connect(destination);
      oscillator.start();

      (navigator.mediaDevices as any).getUserMedia = async () => destination.stream;
    });

    // Record audio
    await uppyDashboard.recordAudio();

    // Verify audio file added
    const fileCount = await uppyDashboard.getFileCount();
    expect(fileCount).toBe(1);

    const fileNames = await uppyDashboard.getFileNames();
    expect(fileNames[0]).toMatch(/audio|recording/i);
  });

  test('should handle multiple files with progress tracking', async ({ page, upload }) => {
    // Generate files of different sizes
    const files = [
      await upload.files.generate(1 * 1024 * 1024, 'small.pdf', 'application/pdf'),
      await upload.files.generate(5 * 1024 * 1024, 'medium.jpg', 'image/jpeg'),
      await upload.files.generate(10 * 1024 * 1024, 'large.mp4', 'video/mp4')
    ];

    // Add all files
    await uppyDashboard.browseFiles(files.map(f => f.path));

    // Verify all files added
    expect(await uppyDashboard.getFileCount()).toBe(3);

    // Track progress
    const progressUpdates: any[] = [];
    const trackProgress = setInterval(async () => {
      const progress = await uppyDashboard.getUploadProgress();
      if (progress.percentage > 0) {
        progressUpdates.push(progress);
      }
    }, 500);

    // Start upload
    await uppyDashboard.startUpload();

    // Wait for completion
    await uppyDashboard.waitForUploadComplete();
    clearInterval(trackProgress);

    // Verify progress tracking
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates[progressUpdates.length - 1].percentage).toBe(100);
    expect(progressUpdates[progressUpdates.length - 1].totalFiles).toBe(3);
  });

  test('should remove files from dashboard', async ({ page, upload }) => {
    // Add multiple files
    const files = await upload.files.generateMultiple(3, 1024);
    await uppyDashboard.browseFiles(files.map(f => f.path));

    // Verify files added
    expect(await uppyDashboard.getFileCount()).toBe(3);

    // Remove one file
    const fileNames = await uppyDashboard.getFileNames();
    await uppyDashboard.removeFile(fileNames[0]);

    // Verify file removed
    expect(await uppyDashboard.getFileCount()).toBe(2);

    // Remove all remaining files
    await uppyDashboard.removeAllFiles();

    // Verify all files removed
    expect(await uppyDashboard.getFileCount()).toBe(0);
  });

  test('should validate file restrictions', async ({ page, upload }) => {
    // Get current restrictions
    const restrictions = await uppyDashboard.getRestrictions();

    // Try to upload file exceeding max size (if set)
    if (restrictions.maxFileSize) {
      const oversizedFile = await upload.files.generate(
        restrictions.maxFileSize + 1024,
        'oversized.bin'
      );

      await uppyDashboard.browseFiles(oversizedFile.path);

      // Check for error
      const hasError = await uppyDashboard.hasErrors();
      expect(hasError).toBe(true);

      const errorMessage = await uppyDashboard.getErrorMessage();
      expect(errorMessage).toContain('size');
    }

    // Try to exceed max file count (if set)
    if (restrictions.maxNumberOfFiles) {
      const files = await upload.files.generateMultiple(
        restrictions.maxNumberOfFiles + 1,
        1024
      );

      await uppyDashboard.browseFiles(files.map(f => f.path));

      // Should only allow max number of files
      const fileCount = await uppyDashboard.getFileCount();
      expect(fileCount).toBeLessThanOrEqual(restrictions.maxNumberOfFiles);
    }
  });

  test('should integrate with Form.io form submission', async ({ page, upload, formio }) => {
    // Close dashboard initially
    await uppyDashboard.close();

    // Fill form
    await formPage.fillForm({
      name: 'Jane Smith',
      email: 'jane@example.com'
    });

    // Open dashboard and upload portfolio files
    await uppyDashboard.open();

    const portfolioFiles = [
      await upload.files.generate(2 * 1024 * 1024, 'project1.jpg', 'image/jpeg'),
      await upload.files.generate(3 * 1024 * 1024, 'project2.pdf', 'application/pdf'),
      await upload.files.generate(1 * 1024 * 1024, 'demo.mp4', 'video/mp4')
    ];

    await uppyDashboard.browseFiles(portfolioFiles.map(f => f.path));
    await uppyDashboard.startUpload();
    await uppyDashboard.waitForUploadComplete();
    await uppyDashboard.close();

    // Submit form
    await formPage.submitForm();

    // Get submission data
    const submission = await formPage.getSubmissionData();

    // Verify submission includes portfolio files
    expect(submission.data).toHaveProperty('name', 'Jane Smith');
    expect(submission.data).toHaveProperty('email', 'jane@example.com');
    expect(submission.data).toHaveProperty('portfolio');
    expect(submission.data.portfolio).toHaveLength(3);
    expect(submission.data.portfolio[0]).toMatchObject({
      originalName: expect.stringContaining('project1.jpg'),
      type: 'image/jpeg'
    });
  });

  test('should retry failed uploads', async ({ page, upload }) => {
    // Mock intermittent failures
    let attemptCount = 0;
    await page.route('**/files', async (route) => {
      attemptCount++;
      // Fail first attempt for each file
      if (attemptCount % 2 === 1) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Upload files
    const files = await upload.files.generateMultiple(2, 1024 * 1024);
    await uppyDashboard.browseFiles(files.map(f => f.path));
    await uppyDashboard.startUpload();

    // Wait for completion with retries
    await uppyDashboard.waitForUploadComplete(60000);

    // Verify all files uploaded despite failures
    const progress = await uppyDashboard.getUploadProgress();
    expect(progress.uploadedFiles).toBe(2);

    // Verify retries occurred
    expect(attemptCount).toBeGreaterThan(2);
  });

  test('should display file thumbnails', async ({ page, upload }) => {
    // Upload image file
    const imageFile = await upload.files.generate(500 * 1024, 'photo.jpg', 'image/jpeg');
    await uppyDashboard.browseFiles(imageFile.path);

    // Check for thumbnail
    const thumbnail = await uppyDashboard.getThumbnail('photo.jpg');
    expect(thumbnail).toBeTruthy();
    expect(thumbnail).toMatch(/^data:image|^blob:/);
  });

  test('should show all available plugins', async ({ page }) => {
    // Get available plugin tabs
    const plugins = await uppyDashboard.getPluginTabs();

    // Verify expected plugins are available
    const expectedPlugins = ['Webcam', 'Screen Capture', 'Image Editor', 'Audio', 'Link'];

    for (const plugin of expectedPlugins) {
      const isAvailable = await uppyDashboard.isPluginAvailable(plugin);
      expect(isAvailable).toBe(true);
    }
  });
});

test.describe('Uppy Dashboard Error Handling', () => {
  test('should handle upload cancellation', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const uppyDashboard = new UppyDashboard(page);

    await formPage.goto();
    await uppyDashboard.open();

    // Upload large file
    const largeFile = await upload.files.generate(20 * 1024 * 1024, 'large.bin');
    await uppyDashboard.browseFiles(largeFile.path);

    // Start upload
    await uppyDashboard.startUpload();

    // Wait a moment for upload to start
    await page.waitForTimeout(1000);

    // Cancel upload
    await uppyDashboard.cancelUpload();

    // Verify upload cancelled
    const progress = await uppyDashboard.getUploadProgress();
    expect(progress.percentage).toBeLessThan(100);

    // Verify no errors shown for cancellation
    const hasErrors = await uppyDashboard.hasErrors();
    expect(hasErrors).toBe(false);
  });

  test('should handle pause and resume', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const uppyDashboard = new UppyDashboard(page);

    await formPage.goto();
    await uppyDashboard.open();

    // Upload large file
    const largeFile = await upload.files.generate(20 * 1024 * 1024, 'pausable.bin');
    await uppyDashboard.browseFiles(largeFile.path);

    // Start upload
    await uppyDashboard.startUpload();

    // Wait for upload to progress
    await page.waitForTimeout(1000);

    // Pause upload
    await uppyDashboard.pauseUpload();

    // Get paused progress
    const pausedProgress = await uppyDashboard.getUploadProgress();
    const pausedPercentage = pausedProgress.percentage;

    // Wait and verify no progress while paused
    await page.waitForTimeout(2000);
    const stillPausedProgress = await uppyDashboard.getUploadProgress();
    expect(stillPausedProgress.percentage).toBe(pausedPercentage);

    // Resume upload
    await uppyDashboard.resumeUpload();

    // Wait for completion
    await uppyDashboard.waitForUploadComplete();

    // Verify completed
    const finalProgress = await uppyDashboard.getUploadProgress();
    expect(finalProgress.percentage).toBe(100);
  });
});