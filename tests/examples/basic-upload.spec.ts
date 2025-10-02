/**
 * Example: Basic Upload Test
 * Demonstrates simple file upload validation
 */

import { test, expect } from '@playwright/test';
import { gcsValidator } from '../utils/gcs-validator';
import { formioValidator } from '../utils/formio-validator';
import { expectFileExists, expectSubmissionValid } from '../utils/assertions';

test.describe('Basic Upload Examples', () => {
  test('upload single file', async ({ page }) => {
    // Navigate to form
    await page.goto('/forms/upload-test');

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('PDF content here'),
    });

    // Wait for upload completion
    await page.waitForSelector('[data-upload-status="complete"]', { timeout: 10000 });

    // Verify success message
    const successMessage = page.locator('[role="status"]');
    await expect(successMessage).toContainText('Upload successful');

    // Verify file in GCS
    await expectFileExists('uploads/test-document.pdf');

    // Get submission ID
    const submissionId = await page.getAttribute('[data-submission-id]', 'data-submission-id');

    // Verify submission in Form.io
    await expectSubmissionValid('upload-form', submissionId!, {
      hasFileReferences: true,
      expectedFileCount: 1,
    });
  });

  test('upload multiple files', async ({ page }) => {
    await page.goto('/forms/multiple-upload');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      {
        name: 'file1.png',
        mimeType: 'image/png',
        buffer: Buffer.from('PNG data'),
      },
      {
        name: 'file2.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('PDF data'),
      },
    ]);

    await page.waitForSelector('[data-upload-status="complete"]');

    // Verify both files in GCS
    await expectFileExists('uploads/file1.png');
    await expectFileExists('uploads/file2.pdf');
  });

  test('handle file too large error', async ({ page }) => {
    await page.goto('/forms/upload-test');

    // Try to upload file larger than limit
    const largeFile = Buffer.alloc(20 * 1024 * 1024); // 20MB
    await page.locator('input[type="file"]').setInputFiles({
      name: 'large-file.pdf',
      mimeType: 'application/pdf',
      buffer: largeFile,
    });

    // Verify error message
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toContainText(/file size exceeds/i);

    // Verify no file was uploaded to GCS
    const exists = await gcsValidator.fileExists('uploads/large-file.pdf');
    expect(exists).toBe(false);
  });

  test('handle invalid file type', async ({ page }) => {
    await page.goto('/forms/upload-test');

    await page.locator('input[type="file"]').setInputFiles({
      name: 'malicious.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('MZ'),
    });

    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toContainText(/file type not allowed/i);
  });

  test('cancel upload in progress', async ({ page }) => {
    await page.goto('/forms/upload-test');

    // Start upload
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(5 * 1024 * 1024), // 5MB to have time to cancel
    });

    // Wait for upload to start
    await page.waitForSelector('[data-upload-status="uploading"]');

    // Click cancel button
    await page.locator('[data-action="cancel-upload"]').click();

    // Verify upload was cancelled
    const status = page.locator('[data-upload-status]');
    await expect(status).toHaveAttribute('data-upload-status', 'cancelled');
  });
});