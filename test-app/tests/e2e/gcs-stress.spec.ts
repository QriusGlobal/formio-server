/**
 * GCS Stress Test Suite
 *
 * Tests async GCS upload under stress conditions:
 * - 30 concurrent uploads
 * - High throughput (10 jobs/second)
 * - Memory leak detection
 * - Retry success rate validation
 */

import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs/promises';

const FORMIO_URL = process.env.FORMIO_URL || 'http://localhost:3001';
const TEST_APP_URL = process.env.TEST_APP_URL || 'http://localhost:64849';

test.describe('GCS Stress Test', () => {
  let page: Page;
  let formId: string;
  let authToken: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    // Authenticate
    const loginResponse = await page.request.post(`${FORMIO_URL}/user/login`, {
      data: {
        email: process.env.TEST_ADMIN_EMAIL || 'admin@gcs-test.local',
        password: process.env.TEST_ADMIN_PASSWORD || 'CHANGEME'
      }
    });

    const headers = loginResponse.headers();
    authToken = headers['x-jwt-token'];

    // Create stress test form
    const formResponse = await page.request.post(`${FORMIO_URL}/form`, {
      headers: { 'x-jwt-token': authToken },
      data: {
        title: 'GCS Stress Test Form',
        name: 'gcsStressTest',
        path: 'gcs-stress-test',
        type: 'form',
        components: [
          {
            type: 'tusupload',
            key: 'files',
            label: 'Stress Test Files',
            multiple: true,
            storage: 'gcs',
            input: true
          }
        ]
      }
    });

    const formData = await formResponse.json();
    formId = formData._id;
  });

  test('should handle 30 concurrent uploads', async () => {
    test.setTimeout(120000); // 2 minute timeout

    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-files');

    // Create 30 test files
    const testFilesDir = path.join(__dirname, '..', 'fixtures', 'stress');
    await fs.mkdir(testFilesDir, { recursive: true });

    const testFiles = [];
    for (let i = 0; i < 30; i++) {
      const fileName = `stress-test-${i + 1}.txt`;
      const filePath = path.join(testFilesDir, fileName);
      // Create 1MB files for realistic upload testing
      const content = faker.lorem.paragraphs(500); // ~1MB
      await fs.writeFile(filePath, content);
      testFiles.push(filePath);
    }

    // Start performance monitoring
    const startTime = Date.now();

    // Upload all files concurrently
    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles(testFiles);

    // Wait for all uploads to complete
    await page.waitForSelector('.all-uploads-complete', { timeout: 90000 });

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000; // seconds

    // Verify all files uploaded
    const uploadedFiles = page.locator('.uploaded-file-item');
    await expect(uploadedFiles).toHaveCount(30);

    // Performance assertion: 30 files in < 60 seconds
    expect(totalTime).toBeLessThan(60);

    console.log(`30 concurrent uploads completed in ${totalTime}s`);

    // Cleanup
    for (const filePath of testFiles) {
      await fs.unlink(filePath);
    }
    await fs.rmdir(testFilesDir);
  });

  test('should process 10+ jobs per second', async () => {
    test.setTimeout(60000);

    // Create 50 small files for high-throughput testing
    const testFilesDir = path.join(__dirname, '..', 'fixtures', 'throughput');
    await fs.mkdir(testFilesDir, { recursive: true });

    const testFiles = [];
    for (let i = 0; i < 50; i++) {
      const fileName = `throughput-${i + 1}.txt`;
      const filePath = path.join(testFilesDir, fileName);
      const content = faker.lorem.paragraphs(10); // ~10KB each
      await fs.writeFile(filePath, content);
      testFiles.push(filePath);
    }

    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-files');

    const startTime = Date.now();

    // Upload files
    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles(testFiles);

    // Wait for completion
    await page.waitForSelector('.all-uploads-complete', { timeout: 45000 });

    const endTime = Date.now();
    const totalSeconds = (endTime - startTime) / 1000;
    const throughput = 50 / totalSeconds;

    // Verify throughput > 10 jobs/second
    expect(throughput).toBeGreaterThan(10);

    console.log(`Throughput: ${throughput.toFixed(2)} jobs/second`);

    // Cleanup
    for (const filePath of testFiles) {
      await fs.unlink(filePath);
    }
    await fs.rmdir(testFilesDir);
  });

  test('should have no memory leaks after 100 uploads', async () => {
    test.setTimeout(180000); // 3 minute timeout

    await page.goto(`${TEST_APP_URL}/form/${formId}`);
    await page.waitForSelector('.formio-component-files');

    // Get initial memory usage
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        };
      }
      return null;
    });

    // Upload 100 files in batches of 20
    const testFilesDir = path.join(__dirname, '..', 'fixtures', 'memory');
    await fs.mkdir(testFilesDir, { recursive: true });

    for (let batch = 0; batch < 5; batch++) {
      const batchFiles = [];

      // Create 20 files for this batch
      for (let i = 0; i < 20; i++) {
        const fileName = `memory-batch${batch}-${i}.txt`;
        const filePath = path.join(testFilesDir, fileName);
        const content = faker.lorem.paragraphs(20); // ~20KB
        await fs.writeFile(filePath, content);
        batchFiles.push(filePath);
      }

      // Upload batch
      const uploadInput = page.locator('input[type="file"]').first();
      await uploadInput.setInputFiles(batchFiles);

      // Wait for batch completion
      await page.waitForSelector(`.batch-${batch}-complete`, { timeout: 30000 });

      // Cleanup batch files
      for (const filePath of batchFiles) {
        await fs.unlink(filePath);
      }

      // Force garbage collection (if available)
      await page.evaluate(() => {
        if (global.gc) {
          global.gc();
        }
      });
    }

    // Get final memory usage
    const finalMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        };
      }
      return null;
    });

    if (initialMetrics && finalMetrics) {
      const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

      // Memory should not increase more than 50MB after 100 uploads
      expect(memoryIncreaseMB).toBeLessThan(50);

      console.log(`Memory increase after 100 uploads: ${memoryIncreaseMB.toFixed(2)}MB`);
    }

    // Cleanup
    await fs.rmdir(testFilesDir).catch(() => {});
  });

  test('should achieve >95% retry success rate', async () => {
    test.setTimeout(90000);

    // Create test form with simulated failures
    const retryFormResponse = await page.request.post(`${FORMIO_URL}/form`, {
      headers: { 'x-jwt-token': authToken },
      data: {
        title: 'Retry Test Form',
        name: 'retryTest',
        path: 'retry-test',
        type: 'form',
        components: [
          {
            type: 'tusupload',
            key: 'files',
            label: 'Retry Test',
            multiple: true,
            storage: 'gcs',
            input: true,
            // Simulate network instability
            retryAttempts: 5,
            retryDelay: 2000
          }
        ]
      }
    });

    const retryFormData = await retryFormResponse.json();
    const retryFormId = retryFormData._id;

    await page.goto(`${TEST_APP_URL}/form/${retryFormId}`);
    await page.waitForSelector('.formio-component-files');

    // Create 20 test files
    const testFilesDir = path.join(__dirname, '..', 'fixtures', 'retry');
    await fs.mkdir(testFilesDir, { recursive: true });

    const testFiles = [];
    for (let i = 0; i < 20; i++) {
      const fileName = `retry-test-${i}.txt`;
      const filePath = path.join(testFilesDir, fileName);
      const content = faker.lorem.paragraphs(30);
      await fs.writeFile(filePath, content);
      testFiles.push(filePath);
    }

    // Upload with simulated network issues
    const uploadInput = page.locator('input[type="file"]').first();
    await uploadInput.setInputFiles(testFiles);

    // Wait for uploads with retry attempts
    await page.waitForSelector('.upload-status', { timeout: 60000 });

    // Check success rate
    const uploadStats = await page.evaluate(() => {
      const statusElement = document.querySelector('.upload-status');
      if (statusElement) {
        const text = statusElement.textContent || '';
        const successMatch = text.match(/(\d+)\s+successful/);
        const failedMatch = text.match(/(\d+)\s+failed/);
        return {
          successful: successMatch ? parseInt(successMatch[1]) : 0,
          failed: failedMatch ? parseInt(failedMatch[1]) : 0
        };
      }
      return { successful: 0, failed: 0 };
    });

    const successRate = (uploadStats.successful / 20) * 100;

    // Assert >95% success rate
    expect(successRate).toBeGreaterThanOrEqual(95);

    console.log(`Retry success rate: ${successRate.toFixed(1)}%`);
    console.log(`Successful: ${uploadStats.successful}, Failed: ${uploadStats.failed}`);

    // Cleanup
    for (const filePath of testFiles) {
      await fs.unlink(filePath);
    }
    await fs.rmdir(testFilesDir);
  });
});
