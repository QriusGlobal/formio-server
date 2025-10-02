/**
 * E2E Tests for Form.io TUS File Upload Component
 *
 * Tests the @formio/file-upload module's TUS upload functionality
 */

import { test, expect } from '../../fixtures/formio.fixture';
import { FormioModulePage } from '../../pages/FormioModulePage';
import { TusUploadComponent } from '../../pages/TusUploadComponent';
import { monitorUploadRequests, verifyServerFile } from '../../fixtures/upload.fixture';
import * as path from 'path';

test.describe('Form.io TUS Upload Component', () => {
  let formPage: FormioModulePage;
  let tusComponent: TusUploadComponent;
  let uploadRequests: any[];

  test.beforeEach(async ({ page, formio, upload }) => {
    // Initialize page objects
    formPage = new FormioModulePage(page);
    tusComponent = new TusUploadComponent(page, 'resume');

    // Login to Form.io
    await formio.formioAuth.login('test-admin@test.local', 'TestPass123!');

    // Navigate to module demo
    await formPage.goto();

    // Set up request monitoring
    uploadRequests = await monitorUploadRequests(page, '/files');
  });

  test('should upload a single PDF file successfully', async ({ page, upload }) => {
    // Generate test PDF file
    const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 44 >> stream
BT /F1 12 Tf 100 700 Td (Test Resume) Tj ET
endstream endobj
xref
0 5
trailer << /Root 1 0 R >>
%%EOF`;

    const testFile = await upload.files.fromString(pdfContent, 'test-resume.pdf', 'application/pdf');

    // Upload file
    await tusComponent.uploadFile(testFile.path);

    // Wait for upload to complete
    await tusComponent.waitForUploadComplete();

    // Verify progress reached 100%
    const finalProgress = await tusComponent.getProgress();
    expect(finalProgress).toBe(100);

    // Get uploaded file info
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
    expect(uploadedFiles[0].name).toContain('test-resume.pdf');

    // Verify TUS protocol was used
    const tusRequests = uploadRequests.filter(r =>
      r.headers['tus-resumable'] || r.method === 'PATCH'
    );
    expect(tusRequests.length).toBeGreaterThan(0);

    // Verify file on server
    if (uploadedFiles[0].id) {
      const isValid = await verifyServerFile(page, uploadedFiles[0].id, testFile.hash);
      expect(isValid).toBe(true);
    }
  });

  test('should show upload progress incrementally', async ({ page, upload }) => {
    // Generate 10MB file for visible progress
    const largeFile = await upload.files.generate(10 * 1024 * 1024, 'large-document.pdf', 'application/pdf');

    // Track progress updates
    const progressValues: number[] = [];
    const checkProgress = async () => {
      const progress = await tusComponent.getProgress();
      if (progress > 0 && !progressValues.includes(progress)) {
        progressValues.push(progress);
      }
    };

    // Start upload
    await tusComponent.uploadFile(largeFile.path);

    // Monitor progress
    const progressInterval = setInterval(checkProgress, 500);

    // Wait for completion
    await tusComponent.waitForUploadComplete();
    clearInterval(progressInterval);

    // Verify progress increased incrementally
    expect(progressValues.length).toBeGreaterThan(2);
    expect(progressValues[progressValues.length - 1]).toBe(100);

    // Verify progress was incremental
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i]).toBeGreaterThan(progressValues[i - 1]);
    }
  });

  test('should handle pause and resume functionality', async ({ page, upload }) => {
    // Generate large file for pause/resume test
    const largeFile = await upload.files.generate(20 * 1024 * 1024, 'pausable-file.bin');

    // Start upload
    await tusComponent.uploadFile(largeFile.path);

    // Wait for upload to start
    await page.waitForTimeout(1000);

    // Pause upload
    await tusComponent.pauseUpload();

    // Get progress when paused
    const pausedProgress = await tusComponent.getProgress();
    expect(pausedProgress).toBeGreaterThan(0);
    expect(pausedProgress).toBeLessThan(100);

    // Wait a moment
    await page.waitForTimeout(2000);

    // Verify progress hasn't changed while paused
    const stillPausedProgress = await tusComponent.getProgress();
    expect(stillPausedProgress).toBe(pausedProgress);

    // Resume upload
    await tusComponent.resumeUpload();

    // Wait for completion
    await tusComponent.waitForUploadComplete();

    // Verify upload completed
    const finalProgress = await tusComponent.getProgress();
    expect(finalProgress).toBe(100);
  });

  test('should resume upload after network interruption', async ({ page, upload, context }) => {
    // Generate test file
    const testFile = await upload.files.generate(5 * 1024 * 1024, 'network-test.pdf', 'application/pdf');

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for upload to progress
    await page.waitForTimeout(1000);

    // Simulate network interruption
    await context.setOffline(true);

    // Wait for error detection
    await page.waitForTimeout(2000);

    // Restore network
    await context.setOffline(false);

    // Verify upload can be resumed
    const isResumable = await tusComponent.verifyResumable();
    expect(isResumable).toBe(true);

    // Resume if needed
    if (await tusComponent.resumeButton.isVisible()) {
      await tusComponent.resumeUpload();
    }

    // Wait for completion
    await tusComponent.waitForUploadComplete();

    // Verify file uploaded successfully
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
  });

  test('should validate file type restrictions', async ({ page, upload }) => {
    // Try to upload non-PDF file (component only accepts PDFs)
    const txtFile = await upload.files.fromString('Not a PDF', 'test.txt', 'text/plain');

    // Attempt upload
    await tusComponent.uploadFile(txtFile.path);

    // Check for validation error
    const validationError = await tusComponent.getFileValidationError();
    expect(validationError).toContain('pdf');

    // Verify upload is disabled/blocked
    const hasError = await tusComponent.hasError();
    expect(hasError).toBe(true);
  });

  test('should validate file size limits', async ({ page, upload }) => {
    // Component has 10MB limit
    const oversizedFile = await upload.files.generate(
      15 * 1024 * 1024,
      'oversized.pdf',
      'application/pdf'
    );

    // Attempt upload
    await tusComponent.uploadFile(oversizedFile.path);

    // Check for size validation error
    const validationError = await tusComponent.getFileValidationError();
    expect(validationError).toMatch(/size|10MB|too large/i);
  });

  test('should handle multiple file uploads', async ({ page, upload }) => {
    // Generate multiple test files
    const files = await upload.files.generateMultiple(3, 1024 * 1024);

    // Upload all files
    await tusComponent.uploadMultipleFiles(files.map(f => f.path));

    // Wait for all uploads
    await tusComponent.waitForUploadComplete(90000);

    // Verify all files uploaded
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(3);
  });

  test('should show chunk upload information', async ({ page, upload }) => {
    // Generate file larger than chunk size
    const testFile = await upload.files.generate(16 * 1024 * 1024, 'chunked.pdf', 'application/pdf');

    // Start upload
    await tusComponent.uploadFile(testFile.path);

    // Get chunk information during upload
    await page.waitForTimeout(1000);
    const chunkInfo = await tusComponent.getChunkInfo();

    // Verify chunking is active
    expect(chunkInfo.chunkSize).toBeGreaterThan(0);
    expect(chunkInfo.totalChunks).toBeGreaterThan(1);

    // Wait for completion
    await tusComponent.waitForUploadComplete();

    // Verify all chunks uploaded
    const finalChunkInfo = await tusComponent.getChunkInfo();
    expect(finalChunkInfo.uploadedChunks).toBe(finalChunkInfo.totalChunks);
  });

  test('should include JWT token in upload headers', async ({ page, upload, formio }) => {
    // Get current token
    const token = await formio.formioAuth.getToken();
    expect(token).toBeTruthy();

    // Generate test file
    const testFile = await upload.files.generate(1024, 'auth-test.pdf', 'application/pdf');

    // Capture TUS headers
    let tusHeaders: Record<string, string> = {};
    page.on('request', (request) => {
      if (request.url().includes('/files') && request.method() === 'POST') {
        const headers = request.headers();
        if (headers['tus-resumable']) {
          tusHeaders = headers;
        }
      }
    });

    // Upload file
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    // Verify JWT token was included
    expect(tusHeaders['x-jwt-token'] || tusHeaders['authorization']).toContain(token);
  });

  test('should integrate with Form.io form submission', async ({ page, upload, formio }) => {
    // Fill form fields
    await formPage.fillForm({
      name: 'John Doe',
      email: 'john@example.com'
    });

    // Upload resume
    const resumeFile = await upload.files.fromString(
      'John Doe Resume Content',
      'john-doe-resume.pdf',
      'application/pdf'
    );
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Submit form
    await formPage.submitForm();

    // Get submission data
    const submission = await formPage.getSubmissionData();

    // Verify submission includes file data
    expect(submission.data).toHaveProperty('name', 'John Doe');
    expect(submission.data).toHaveProperty('email', 'john@example.com');
    expect(submission.data).toHaveProperty('resume');
    expect(submission.data.resume).toMatchObject([
      {
        originalName: 'john-doe-resume.pdf',
        size: expect.any(Number),
        type: 'application/pdf'
      }
    ]);
  });
});

test.describe('TUS Upload Error Handling', () => {
  test('should retry failed uploads automatically', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Intercept and fail first upload attempt
    let attemptCount = 0;
    await page.route('**/files', async (route) => {
      attemptCount++;
      if (attemptCount <= 2) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    // Generate test file
    const testFile = await upload.files.generate(1024, 'retry-test.pdf');

    // Upload file (should retry automatically)
    await tusComponent.uploadFile(testFile.path);

    // Wait for successful upload after retries
    await tusComponent.waitForUploadComplete(30000);

    // Verify multiple attempts were made
    expect(attemptCount).toBeGreaterThan(2);

    // Verify upload succeeded
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
  });

  test('should handle server errors gracefully', async ({ page, upload }) => {
    const formPage = new FormioModulePage(page);
    const tusComponent = new TusUploadComponent(page);

    await formPage.goto();

    // Mock server error
    await page.route('**/files', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Generate test file
    const testFile = await upload.files.generate(1024, 'error-test.pdf');

    // Attempt upload
    await tusComponent.uploadFile(testFile.path);

    // Wait for error
    await page.waitForTimeout(5000);

    // Verify error is displayed
    const hasError = await tusComponent.hasError();
    expect(hasError).toBe(true);

    const errorMessage = await tusComponent.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
});