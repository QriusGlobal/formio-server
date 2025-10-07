/**
 * GCS Upload E2E Test
 *
 * Tests React form with multiple file uploads through complete stack:
 * React Form → TUS → BullMQ → GCS → MongoDB → Visual Validation
 */

import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs/promises';

const FORMIO_URL = process.env.FORMIO_URL || 'http://localhost:3001';
const TEST_APP_URL = process.env.TEST_APP_URL || 'http://localhost:64849';

test.describe('GCS Upload E2E', () => {
  let page: Page;
  let formId: string;
  let authToken: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // Authenticate with Form.io
    const loginResponse = await page.request.post(`${FORMIO_URL}/user/login`, {
      data: {
        email: process.env.TEST_ADMIN_EMAIL || 'admin@formio.local',
        password: process.env.TEST_ADMIN_PASSWORD || 'CHANGEME'
      }
    });

    const headers = loginResponse.headers();
    authToken = headers['x-jwt-token'];

    // Create test form with file upload component
    const formResponse = await page.request.post(`${FORMIO_URL}/form`, {
      headers: { 'x-jwt-token': authToken },
      data: {
        title: 'E2E GCS Upload Form',
        name: 'e2eGcsUpload',
        path: 'e2e-gcs-upload',
        type: 'form',
        components: [
          {
            type: 'tusupload',
            key: 'documents',
            label: 'Upload Documents',
            multiple: true,
            storage: 'gcs',
            input: true,
            validate: {
              required: true
            }
          },
          {
            type: 'textfield',
            key: 'description',
            label: 'Description',
            input: true
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit',
            key: 'submit'
          }
        ]
      }
    });

    const formData = await formResponse.json();
    formId = formData._id;
  });

  test('should render Form.io form with file upload component', async () => {
    await page.goto(`${TEST_APP_URL}/form/${formId}`);

    // Wait for form to render
    await page.waitForSelector('.formio-component-documents');

    // Verify file upload component exists
    const uploadComponent = page.locator('.formio-component-documents');
    await expect(uploadComponent).toBeVisible();

    // Verify it's a TUS upload component
    const uploadInput = uploadComponent.locator('input[type="file"]');
    await expect(uploadInput).toBeVisible();

    // Verify multiple attribute
    await expect(uploadInput).toHaveAttribute('multiple');
  });

  test('should upload files via React form', async () => {
    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-documents');

    // Create test files
    const testFilesDir = path.join(__dirname, '..', 'fixtures', 'e2e');
    await fs.mkdir(testFilesDir, { recursive: true });

    const testFiles = [];
    for (let i = 0; i < 3; i++) {
      const fileName = `test-file-${i + 1}.txt`;
      const filePath = path.join(testFilesDir, fileName);
      await fs.writeFile(filePath, `Test content ${i + 1}\n${faker.lorem.paragraphs(3)}`);
      testFiles.push(filePath);
    }

    // Upload files
    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles(testFiles);

    // Wait for uploads to complete (check for progress indicators)
    await page.waitForSelector('.upload-complete', { timeout: 30000 });

    // Verify all files uploaded
    const uploadedFiles = page.locator('.uploaded-file-item');
    await expect(uploadedFiles).toHaveCount(3);

    // Cleanup
    for (const filePath of testFiles) {
      await fs.unlink(filePath);
    }
  });

  test('should display uploaded files in submission', async () => {
    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-documents');

    // Create and upload test file
    const testFilePath = path.join(__dirname, '..', 'fixtures', 'e2e', 'submission-test.txt');
    await fs.mkdir(path.dirname(testFilePath), { recursive: true });
    await fs.writeFile(testFilePath, 'Submission display test content');

    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles([testFilePath]);

    // Wait for upload
    await page.waitForSelector('.upload-complete', { timeout: 30000 });

    // Fill description
    await page.fill('input[name="data[description]"]', 'Test submission for GCS upload');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for submission success
    await page.waitForSelector('.submission-success', { timeout: 10000 });

    // Verify submission displays file information
    const fileInfo = page.locator('.file-info');
    await expect(fileInfo).toBeVisible();
    await expect(fileInfo).toContainText('submission-test.txt');

    // Verify GCS URL is present
    const fileLink = page.locator('a[href*="http://localhost:4443"]');
    await expect(fileLink).toBeVisible();

    // Cleanup
    await fs.unlink(testFilePath);
  });

  test('should handle bulk upload (10+ files)', async () => {
    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-documents');

    // Create 15 test files
    const testFilesDir = path.join(__dirname, '..', 'fixtures', 'e2e', 'bulk');
    await fs.mkdir(testFilesDir, { recursive: true });

    const testFiles = [];
    for (let i = 0; i < 15; i++) {
      const fileName = `bulk-file-${i + 1}.txt`;
      const filePath = path.join(testFilesDir, fileName);
      await fs.writeFile(filePath, `Bulk test ${i + 1}\n${faker.lorem.paragraphs(2)}`);
      testFiles.push(filePath);
    }

    // Upload all files
    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles(testFiles);

    // Wait for all uploads (increased timeout for bulk)
    await page.waitForSelector('.all-uploads-complete', { timeout: 60000 });

    // Verify upload count
    const uploadedFiles = page.locator('.uploaded-file-item');
    await expect(uploadedFiles).toHaveCount(15);

    // Verify progress indicators showed
    const progressLog = page.locator('.upload-progress-log');
    await expect(progressLog).toContainText('15 of 15 files uploaded');

    // Cleanup
    for (const filePath of testFiles) {
      await fs.unlink(filePath);
    }
    await fs.rmdir(testFilesDir);
  });

  test('should show error message if upload fails', async () => {
    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-documents');

    // Attempt to upload unsupported file type (if validation exists)
    const testFilePath = path.join(__dirname, '..', 'fixtures', 'e2e', 'invalid.exe');
    await fs.mkdir(path.dirname(testFilePath), { recursive: true });
    await fs.writeFile(testFilePath, 'Invalid file content');

    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles([testFilePath]);

    // Wait for error message
    const errorMessage = page.locator('.upload-error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText('Upload failed');

    // Cleanup
    await fs.unlink(testFilePath);
  });
});
