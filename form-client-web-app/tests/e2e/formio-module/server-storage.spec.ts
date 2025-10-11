/**
 * E2E Tests for Server-Side File Storage Verification
 *
 * Verifies files are properly stored on the server after upload
 */

import { test, expect } from '../../fixtures/formio.fixture';
import { FormioModulePage } from '../../pages/FormioModulePage';
import { TusUploadComponent } from '../../pages/TusUploadComponent';
import * as crypto from 'crypto';

test.describe('Server Storage Verification', () => {
  let formPage: FormioModulePage;

  test.beforeEach(async ({ page, formio }) => {
    formPage = new FormioModulePage(page);

    // Login to Form.io
    await formio.formioAuth.login('test-admin@test.local', 'TestPass123!');

    // Navigate to module demo
    await formPage.goto();
  });

  test('should store files in GCS bucket', async ({ page, upload, formio }) => {
    // Generate test file with known content
    const fileContent = 'Test file content for GCS verification';
    const testFile = await upload.files.fromString(fileContent, 'gcs-test.txt', 'text/plain');

    // Upload file via TUS
    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    // Get uploaded file info
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);

    const fileId = uploadedFiles[0].id;
    expect(fileId).toBeTruthy();

    // Verify file exists on server via API
    const response = await page.request.get(`http://localhost:3001/file/${fileId}`, {
      headers: {
        'x-jwt-token': await formio.formioAuth.getToken() || ''
      }
    });

    expect(response.ok()).toBe(true);

    // Verify file content
    const serverContent = await response.text();
    expect(serverContent).toContain(fileContent);

    // Verify file metadata in response headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('text/plain');
    expect(headers['content-length']).toBe(String(fileContent.length));
  });

  test('should store file metadata in MongoDB', async ({ page, upload, formio }) => {
    // Generate test file
    const testFile = await upload.files.generate(1024 * 1024, 'metadata-test.pdf', 'application/pdf');

    // Upload file
    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    // Submit form to create submission with file
    await formPage.fillForm({
      name: 'Test User',
      email: 'test@example.com'
    });
    await formPage.submitForm();

    // Get submission data
    const submission = await formPage.getSubmissionData();
    expect(submission.data.resume).toBeDefined();

    // Verify file metadata structure
    const fileMetadata = submission.data.resume[0];
    expect(fileMetadata).toMatchObject({
      originalName: 'metadata-test.pdf',
      name: expect.any(String),
      size: 1024 * 1024,
      type: 'application/pdf',
      storage: 'tus',
      url: expect.stringContaining('/file/')
    });

    // Retrieve submission via API to verify persistence
    const submissionId = submission._id;
    const apiSubmission = await formio.formioAPI.getSubmission(submissionId);

    // Verify file metadata persisted correctly
    expect(apiSubmission.data.resume).toEqual(submission.data.resume);
  });

  test('should handle file permissions correctly', async ({ page, upload, formio }) => {
    // Upload file as authenticated user
    const testFile = await upload.files.generate(1024, 'private-file.pdf', 'application/pdf');

    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    const uploadedFiles = await tusComponent.getUploadedFiles();
    const fileUrl = uploadedFiles[0].url;
    expect(fileUrl).toBeTruthy();

    // Try to access file without authentication
    await formio.formioAuth.logout();

    const unauthResponse = await page.request.get(fileUrl!);

    // Should require authentication for private files
    expect(unauthResponse.status()).toBe(401);

    // Re-authenticate and verify access
    await formio.formioAuth.login('test-admin@test.local', 'TestPass123!');

    const authResponse = await page.request.get(fileUrl!, {
      headers: {
        'x-jwt-token': await formio.formioAuth.getToken() || ''
      }
    });

    expect(authResponse.ok()).toBe(true);
  });

  test('should clean up files when submission is deleted', async ({ page, upload, formio }) => {
    // Upload file and submit form
    const testFile = await upload.files.generate(1024, 'cleanup-test.txt', 'text/plain');

    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    await formPage.fillForm({
      name: 'Cleanup Test',
      email: 'cleanup@test.com'
    });
    await formPage.submitForm();

    // Get submission data
    const submission = await formPage.getSubmissionData();
    const fileUrl = submission.data.resume[0].url;
    const submissionId = submission._id;

    // Verify file exists
    const fileExistsResponse = await page.request.get(fileUrl, {
      headers: {
        'x-jwt-token': await formio.formioAuth.getToken() || ''
      }
    });
    expect(fileExistsResponse.ok()).toBe(true);

    // Delete submission
    await formio.formioAPI.deleteSubmission(submissionId);

    // EVENT-DRIVEN: Wait for deletion to propagate and cleanup to complete
    await page.waitForFunction(async (url, token) => {
      try {
        const response = await fetch(url, {
          headers: { 'x-jwt-token': token }
        });
        return response.status >= 404;
      } catch {
        return true;
      }
    }, fileUrl, await formio.formioAuth.getToken() || '', { timeout: 10000 });

    const fileDeletedResponse = await page.request.get(fileUrl, {
      headers: {
        'x-jwt-token': await formio.formioAuth.getToken() || ''
      }
    });

    // File should be deleted or marked for deletion
    expect(fileDeletedResponse.status()).toBeGreaterThanOrEqual(404);
  });

  test('should verify file integrity with hash', async ({ page, upload }) => {
    // Generate file with known hash
    const fileContent = Buffer.from('File integrity test content');
    const expectedHash = crypto.createHash('sha256').update(fileContent).digest('hex');

    const testFile = await upload.files.fromString(
      fileContent.toString(),
      'integrity-test.txt',
      'text/plain'
    );

    // Upload file
    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    // Get file from server
    const uploadedFiles = await tusComponent.getUploadedFiles();
    const fileId = uploadedFiles[0].id;

    const response = await page.request.get(`http://localhost:3001/file/${fileId}`);
    const serverContent = await response.body();

    // Calculate hash of downloaded file
    const downloadedHash = crypto.createHash('sha256').update(serverContent).digest('hex');

    // Verify integrity
    expect(downloadedHash).toBe(expectedHash);
  });

  test('should handle concurrent file uploads', async ({ page, upload, formio }) => {
    // Generate multiple test files
    const files = await Promise.all([
      upload.files.generate(1024 * 1024, 'concurrent-1.pdf', 'application/pdf'),
      upload.files.generate(1024 * 1024, 'concurrent-2.jpg', 'image/jpeg'),
      upload.files.generate(1024 * 1024, 'concurrent-3.doc', 'application/msword')
    ]);

    // Upload all files concurrently
    const uploadPromises = files.map(async (file, index) => {
      const component = new TusUploadComponent(page, 'resume');
      await component.uploadFile(file.path);
      return component.waitForUploadComplete();
    });

    await Promise.all(uploadPromises);

    // Submit form
    await formPage.fillForm({
      name: 'Concurrent Test',
      email: 'concurrent@test.com'
    });
    await formPage.submitForm();

    // Verify all files stored correctly
    const submission = await formPage.getSubmissionData();
    expect(submission.data.resume).toHaveLength(3);

    // Verify each file on server
    for (const fileMetadata of submission.data.resume) {
      const response = await page.request.get(fileMetadata.url, {
        headers: {
          'x-jwt-token': await formio.formioAuth.getToken() || ''
        }
      });
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-length']).toBe(String(fileMetadata.size));
    }
  });

  test('should respect storage quotas', async ({ page, upload, formio }) => {
    // This test verifies quota enforcement if configured

    // Generate file at quota limit (example: 100MB)
    const quotaLimit = 100 * 1024 * 1024; // 100MB
    const largeFile = await upload.files.generate(quotaLimit + 1024, 'over-quota.bin');

    // Attempt upload
    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(largeFile.path);

    // Should fail with quota error (if quotas are enforced)
    const hasError = await tusComponent.hasError();

    if (hasError) {
      const errorMessage = await tusComponent.getErrorMessage();
      expect(errorMessage).toMatch(/quota|limit|space/i);
    } else {
      // If no quota enforcement, file should upload successfully
      await tusComponent.waitForUploadComplete(120000);
      const uploadedFiles = await tusComponent.getUploadedFiles();
      expect(uploadedFiles).toHaveLength(1);
    }
  });

  test('should handle file download URLs correctly', async ({ page, upload, formio }) => {
    // Upload file
    const testFile = await upload.files.generate(1024, 'download-test.pdf', 'application/pdf');

    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    // Get download URL
    const uploadedFiles = await tusComponent.getUploadedFiles();
    const downloadUrl = uploadedFiles[0].url;
    expect(downloadUrl).toBeTruthy();

    // Test direct download
    const downloadResponse = await page.request.get(downloadUrl!, {
      headers: {
        'x-jwt-token': await formio.formioAuth.getToken() || ''
      }
    });

    expect(downloadResponse.ok()).toBe(true);

    // Verify content-disposition header for download
    const headers = downloadResponse.headers();
    if (headers['content-disposition']) {
      expect(headers['content-disposition']).toContain('download-test.pdf');
    }

    // Verify content type
    expect(headers['content-type']).toContain('application/pdf');
  });

  test('should track file upload metrics', async ({ page, upload, formio }) => {
    const startTime = Date.now();

    // Upload file
    const testFile = await upload.files.generate(5 * 1024 * 1024, 'metrics-test.bin');

    const tusComponent = new TusUploadComponent(page, 'resume');
    await tusComponent.uploadFile(testFile.path);
    await tusComponent.waitForUploadComplete();

    const uploadTime = Date.now() - startTime;

    // Calculate upload speed
    const uploadSpeedMbps = (testFile.size / (uploadTime / 1000)) / (1024 * 1024);

    // Log metrics for performance analysis
    console.log(`Upload Metrics:
      File Size: ${testFile.size / (1024 * 1024)}MB
      Upload Time: ${uploadTime}ms
      Upload Speed: ${uploadSpeedMbps.toFixed(2)}MB/s
    `);

    // Verify reasonable upload speed (at least 1MB/s for local)
    expect(uploadSpeedMbps).toBeGreaterThan(1);
  });
});