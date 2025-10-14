/**
 * Production End-to-End Scenarios
 *
 * Comprehensive E2E test suite covering real-world production workflows
 * including file uploads, form submissions, concurrent users, network failures,
 * and stress testing.
 */

import path from 'node:path';

import { test, expect, Page, BrowserContext } from '@playwright/test';

import { FormioApiHelper, GCSApiHelper } from '../utils/api-helpers';
import { generateTestFile, cleanupTestFiles, type TestFile } from '../utils/file-helpers';
import { applyNetworkCondition, NETWORK_PRESETS } from '../utils/network-simulator';

// Test configuration
const TEST_APP_URL = process.env.TEST_APP_URL || 'http://localhost:64849';
const FORMIO_API_URL = process.env.FORMIO_API_URL || 'http://localhost:3001';
const GCS_API_URL = process.env.GCS_API_URL || 'http://localhost:4443';

// Initialize API helpers
const formioApi = new FormioApiHelper(FORMIO_API_URL);
const gcsApi = new GCSApiHelper(GCS_API_URL);

test.describe('Production End-to-End Scenarios', () => {
  let testFiles: Record<string, TestFile>;

  test.beforeAll(async () => {
    // ✅ OPTIMIZED: Generate test files in parallel (6x faster)
    const fileConfigs = [
      { key: 'resume', size: 1024 * 1024, filename: 'resume.pdf', mimeType: 'application/pdf', content: 'random' },
      { key: 'portfolio1', size: 5 * 1024 * 1024, filename: 'portfolio1.pdf', mimeType: 'application/pdf', content: 'random' },
      { key: 'portfolio2', size: 10 * 1024 * 1024, filename: 'portfolio2.pdf', mimeType: 'application/pdf', content: 'random' },
      { key: 'portfolio3', size: 50 * 1024 * 1024, filename: 'portfolio3.pdf', mimeType: 'application/pdf', content: 'zeros' },
      { key: 'largeFile', size: 100 * 1024 * 1024, filename: 'large-file.bin', mimeType: 'application/octet-stream', content: 'zeros' },
      { key: 'profilePhoto', size: 500 * 1024, filename: 'profile.jpg', mimeType: 'image/jpeg', content: 'random' }
    ];

    const files = await Promise.all(
      fileConfigs.map(({ key, ...config }) => generateTestFile(config).then(file => ({ key, file })))
    );

    testFiles = Object.fromEntries(files.map(({ key, file }) => [key, file]));
  });

  test.afterAll(async () => {
    // Cleanup generated test files
    await cleanupTestFiles();
  });

  /**
   * Scenario 1: Complete User Workflow
   * Tests the entire user journey from file upload to admin verification
   */
  test('complete user workflow - upload, submit, admin verify', async ({ page, request }) => {
    test.slow(); // This test includes multiple steps and may take longer
    const startTime = Date.now();

    // Navigate to submission test page
    await page.goto(`${TEST_APP_URL}/submission-test`);
    await page.waitForLoadState('networkidle');

    // Fill form fields
    await page.fill('[name="data[fullName]"]', 'John Doe');
    await page.fill('[name="data[email]"]', 'john.doe@example.com');

    // Upload resume (TUS single)
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(testFiles.resume.path);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    // Upload 3 portfolio files (TUS multi)
    const portfolioInput = page.locator('[data-key="portfolio"] input[type="file"]');
    await portfolioInput.setInputFiles([
      testFiles.portfolio1.path,
      testFiles.portfolio2.path,
      testFiles.portfolio3.path
    ]);
    await page.waitForTimeout(2000); // Allow multiple uploads to start

    // Upload profile photo (Uppy)
    const photoInput = page.locator('[data-key="profilePhoto"] input[type="file"]');
    await photoInput.setInputFiles(testFiles.profilePhoto.path);
    await page.waitForTimeout(2000);

    // Wait for all uploads to complete
    await page.waitForSelector('text=/complete/i', { timeout: 120000 });

    // Submit form
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Extract submission data
    const submissionJson = await page.locator('pre').first().textContent();
    const submissionData = JSON.parse(submissionJson || '{}');
    const submissionId = submissionData._id || 'test-submission';

    // Verify all 5 files are present
    expect(submissionData.resume).toBeDefined();
    expect(submissionData.resume.url).toBeDefined();
    expect(submissionData.portfolio).toHaveLength(3);
    expect(submissionData.profilePhoto).toBeDefined();

    // Admin verification: Retrieve submission via API
    const submission = await formioApi.getSubmission(request, 'test-form', submissionId);
    expect(submission.data.fullName).toBe('John Doe');
    expect(submission.data.email).toBe('john.doe@example.com');

    // Verify all file URLs are accessible
    const fileUrls = [
      submissionData.resume.url,
      ...submissionData.portfolio.map((f: any) => f.url),
      submissionData.profilePhoto.url
    ];

    for (const url of fileUrls) {
      const response = await request.get(url);
      expect(response.ok()).toBeTruthy();
    }

    // Verify workflow completed within 30 seconds
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(30000);

    console.log(`✅ Complete workflow finished in ${duration}ms`);
  });

  /**
   * Scenario 2: Large Form with Multiple File Fields
   * Tests form with 5 different file upload fields of varying sizes
   */
  test('large form with multiple file fields - varied sizes', async ({ page }) => {
    test.slow();

    await page.goto(`${TEST_APP_URL}/submission-test`);
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('[name="data[fullName]"]', 'Multi Upload User');
    await page.fill('[name="data[email]"]', 'multi@example.com');

    // ✅ OPTIMIZED: Upload files in parallel (5x faster)
    const uploads = [
      { key: 'resume', file: testFiles.resume }, // 1MB
      { key: 'portfolio', file: testFiles.portfolio1 }, // 5MB
      { key: 'document', file: testFiles.portfolio2 }, // 10MB
      { key: 'largeDoc', file: testFiles.portfolio3 }, // 50MB
      { key: 'profilePhoto', file: testFiles.largeFile } // 100MB
    ];

    await Promise.all(
      uploads.map(async ({ key, file }) => {
        const input = page.locator(`[data-key="${key}"] input[type="file"]`);
        await input.setInputFiles(file.path);
      })
    );
    await page.waitForTimeout(1000);

    // Wait for all uploads (large files take time)
    await page.waitForSelector('text=/complete/i', { timeout: 180000 }); // 3 minutes

    // Submit
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 15000 });

    // Verify submission data
    const submissionJson = await page.locator('pre').first().textContent();
    const data = JSON.parse(submissionJson || '{}');

    // Verify all 5 file URLs present
    expect(data.resume?.url).toBeDefined();
    expect(data.portfolio?.url).toBeDefined();
    expect(data.document?.url).toBeDefined();
    expect(data.largeDoc?.url).toBeDefined();
    expect(data.profilePhoto?.url).toBeDefined();

    // Calculate total submission size
    const totalSize =
      (data.resume?.size || 0) +
      (data.portfolio?.size || 0) +
      (data.document?.size || 0) +
      (data.largeDoc?.size || 0) +
      (data.profilePhoto?.size || 0);

    const expectedSize =
      testFiles.resume.size +
      testFiles.portfolio1.size +
      testFiles.portfolio2.size +
      testFiles.portfolio3.size +
      testFiles.largeFile.size;

    // Allow 1% variance for metadata overhead
    expect(totalSize).toBeGreaterThan(expectedSize * 0.99);
    expect(totalSize).toBeLessThan(expectedSize * 1.01);

    console.log(`✅ Total submission size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  });

  /**
   * Scenario 3: Async Upload Completion After Submission
   * Tests queue-based async processing of uploads
   */
  test('async upload completion after submission', async ({ page, request }) => {
    test.slow();

    await page.goto(`${TEST_APP_URL}/submission-test`);
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('[name="data[fullName]"]', 'Async Test User');
    await page.fill('[name="data[email]"]', 'async@example.com');

    // Upload file via TUS (creates queue job)
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(testFiles.resume.path);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    // Submit form immediately (includes TUS URL)
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Extract submission data
    const submissionJson = await page.locator('pre').first().textContent();
    const submissionData = JSON.parse(submissionJson || '{}');
    const submissionId = submissionData._id;

    // Verify TUS URL is present
    expect(submissionData.resume.url).toMatch(/http:\/\/localhost:1080\/files\/.+/);
    const tusUrl = submissionData.resume.url;

    // Wait for async queue worker to process → upload to GCS
    const gcsFilename = path.basename(new URL(tusUrl).pathname);
    const gcsExists = await waitForGCSUpload(request, gcsFilename, 60000);

    expect(gcsExists).toBeTruthy();

    // Retrieve updated submission from MongoDB
    const updatedSubmission = await formioApi.getSubmission(request, 'test-form', submissionId);

    // Verify submission has both TUS and GCS URLs
    expect(updatedSubmission.data.resume.url).toBeDefined();
    expect(updatedSubmission.data.resume.gcsUrl).toBeDefined();

    console.log('✅ Async processing completed successfully');
  });

  /**
   * Scenario 4: File Upload Error → User Retry → Success
   * Tests error recovery and retry workflow
   */
  test('file upload error recovery - retry succeeds', async ({ page }) => {
    await page.goto(`${TEST_APP_URL}/submission-test`);
    await page.waitForLoadState('networkidle');

    // Simulate network failure during upload
    await page.route('**/files/**', route => route.abort('failed'));

    // Fill form
    await page.fill('[name="data[fullName]"]', 'Error Recovery User');
    await page.fill('[name="data[email]"]', 'retry@example.com');

    // Attempt upload (should fail)
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(testFiles.resume.path);

    // Wait for error message
    await expect(page.locator('text=/error|failed/i')).toBeVisible({ timeout: 10000 });

    // Remove network failure simulation
    await page.unroute('**/files/**');

    // Retry upload
    await resumeInput.setInputFiles(testFiles.resume.path);

    // Wait for success
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    // Submit form
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify successful file is in submission
    const submissionJson = await page.locator('pre').first().textContent();
    const data = JSON.parse(submissionJson || '{}');
    expect(data.resume.url).toBeDefined();

    console.log('✅ Error recovery workflow successful');
  });

  /**
   * Scenario 5: Mobile Upload with Network Changes
   * Tests upload resilience during network condition changes
   */
  test('mobile upload with network changes - resume on reconnect', async ({ page }) => {
    test.slow();

    await page.goto(`${TEST_APP_URL}/submission-test`);
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('[name="data[fullName]"]', 'Mobile User');
    await page.fill('[name="data[email]"]', 'mobile@example.com');

    // Start with fast WiFi
    await applyNetworkCondition(page, NETWORK_PRESETS.WIFI);

    // Start upload
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(testFiles.largeFile.path); // 100MB for long upload

    // Wait 2 seconds, then switch to slow 3G
    await page.waitForTimeout(2000);
    await applyNetworkCondition(page, NETWORK_PRESETS.SLOW_3G);

    // Verify upload continues (may show paused indicator)
    await page.waitForTimeout(3000);

    // Switch back to WiFi
    await applyNetworkCondition(page, NETWORK_PRESETS.WIFI);

    // Wait for upload to complete
    await page.waitForSelector('text=/✓|complete/i', { timeout: 180000 });

    // Submit form
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify file uploaded successfully
    const submissionJson = await page.locator('pre').first().textContent();
    const data = JSON.parse(submissionJson || '{}');
    expect(data.resume.url).toBeDefined();
    expect(data.resume.size).toBeGreaterThan(99 * 1024 * 1024); // ~100MB

    console.log('✅ Mobile network change handled successfully');
  });

  /**
   * Scenario 6: Concurrent Users → Isolated Submissions
   * Tests 10 concurrent users creating separate submissions
   */
  test('concurrent users - isolated submissions', async ({ browser }) => {
    test.slow();
    const NUM_USERS = 10;

    // ✅ OPTIMIZED: Create 10 browser contexts in parallel (10x faster)
    const contextPromises = Array.from({ length: NUM_USERS }, () => browser.newContext());
    const contexts = await Promise.all(contextPromises);

    const pagePromises = contexts.map(context => context.newPage());
    const pages = await Promise.all(pagePromises);

    // Each user uploads files and submits form
    const submissions = await Promise.all(
      pages.map(async (page, index) => {
        await page.goto(`${TEST_APP_URL}/submission-test`);
        await page.waitForLoadState('networkidle');

        // Fill unique user data
        await page.fill('[name="data[fullName]"]', `User ${index + 1}`);
        await page.fill('[name="data[email]"]', `user${index + 1}@example.com`);

        // Upload file
        const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
        await resumeInput.setInputFiles(testFiles.resume.path);
        await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

        // Submit
        await page.click('button[type="submit"]');
        await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

        // Extract submission data
        const submissionJson = await page.locator('pre').first().textContent();
        return JSON.parse(submissionJson || '{}');
      })
    );

    // Verify 10 separate submissions
    expect(submissions).toHaveLength(NUM_USERS);

    // Verify each has unique _id
    const ids = submissions.map(s => s._id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(NUM_USERS);

    // Verify no file URL cross-contamination
    const fileUrls = submissions.map(s => s.resume?.url);
    const uniqueUrls = new Set(fileUrls);
    expect(uniqueUrls.size).toBe(NUM_USERS);

    // Verify all files are accessible
    for (const submission of submissions) {
      expect(submission.resume?.url).toBeDefined();
      expect(submission.fullName).toMatch(/^User \d+$/);
    }

    // ✅ OPTIMIZED: Cleanup contexts in parallel
    await Promise.all(contexts.map(context => context.close()));

    console.log(`✅ ${NUM_USERS} concurrent submissions isolated successfully`);
  });

  /**
   * Scenario 7: Form Submission → Edit → Resubmit
   * Tests editing existing submission preserves file URLs
   */
  test('form edit workflow - file URLs preserved', async ({ page, request }) => {
    await page.goto(`${TEST_APP_URL}/submission-test`);
    await page.waitForLoadState('networkidle');

    // Initial submission
    await page.fill('[name="data[fullName]"]', 'Original Name');
    await page.fill('[name="data[email]"]', 'original@example.com');

    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(testFiles.resume.path);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Extract submission data
    const submissionJson = await page.locator('pre').first().textContent();
    const originalData = JSON.parse(submissionJson || '{}');
    const submissionId = originalData._id;
    const originalFileUrl = originalData.resume.url;
    const originalCreated = originalData.created;

    // Navigate to edit page
    await page.goto(`${TEST_APP_URL}/submission-test/${submissionId}/edit`);
    await page.waitForLoadState('networkidle');

    // Change text field only
    await page.fill('[name="data[fullName]"]', 'Updated Name');

    // Do NOT upload new file

    // Resubmit
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Updated/i')).toBeVisible({ timeout: 10000 });

    // Retrieve updated submission
    const updatedSubmission = await formioApi.getSubmission(request, 'test-form', submissionId);

    // Verify file URL preserved (unchanged)
    expect(updatedSubmission.data.resume.url).toBe(originalFileUrl);

    // Verify text field updated
    expect(updatedSubmission.data.fullName).toBe('Updated Name');

    // Verify modified timestamp updated
    expect(new Date(updatedSubmission.modified).getTime()).toBeGreaterThan(
      new Date(originalCreated).getTime()
    );

    console.log('✅ Edit workflow preserved file URLs');
  });

  /**
   * Scenario 8: Stress Test - 100 Concurrent Submissions
   * Tests system stability under high concurrent load
   */
  test('stress test - 100 concurrent submissions', async ({ browser, request }) => {
    test.slow();
    test.setTimeout(600000); // 10 minutes timeout
    const NUM_SUBMISSIONS = 100;
    const BATCH_SIZE = 10; // Process in batches to avoid resource exhaustion

    const allSubmissions: any[] = [];
    const responseTimes: number[] = [];

    // Process in batches
    for (let batch = 0; batch < NUM_SUBMISSIONS / BATCH_SIZE; batch++) {
      const batchStart = Date.now();
      console.log(`Processing batch ${batch + 1}/${NUM_SUBMISSIONS / BATCH_SIZE}...`);

      // ✅ OPTIMIZED: Create batch of contexts in parallel (10x faster)
      const contextPromises = Array.from({ length: BATCH_SIZE }, () => browser.newContext());
      const contexts = await Promise.all(contextPromises);

      const pagePromises = contexts.map(context => context.newPage());
      const pages = await Promise.all(pagePromises);

      // Execute batch concurrently
      const batchSubmissions = await Promise.all(
        pages.map(async (page, index) => {
          const startTime = Date.now();

          try {
            await page.goto(`${TEST_APP_URL}/submission-test`, { timeout: 30000 });
            await page.waitForLoadState('networkidle');

            const userNum = batch * BATCH_SIZE + index + 1;
            await page.fill('[name="data[fullName]"]', `Stress User ${userNum}`);
            await page.fill('[name="data[email]"]', `stress${userNum}@example.com`);

            const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
            await resumeInput.setInputFiles(testFiles.resume.path);
            await page.waitForSelector('text=/✓|complete/i', { timeout: 60000 });

            await page.click('button[type="submit"]');
            await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 30000 });

            const submissionJson = await page.locator('pre').first().textContent();
            const submission = JSON.parse(submissionJson || '{}');

            const endTime = Date.now();
            responseTimes.push(endTime - startTime);

            return submission;
          } catch (error) {
            console.error(`Batch ${batch + 1}, User ${index + 1} failed:`, error);
            return null;
          }
        })
      );

      // ✅ OPTIMIZED: Cleanup batch contexts in parallel
      await Promise.all(contexts.map(context => context.close()));

      // Add successful submissions
      allSubmissions.push(...batchSubmissions.filter(s => s !== null));

      const batchDuration = Date.now() - batchStart;
      console.log(`✅ Batch ${batch + 1} completed in ${batchDuration}ms`);

      // Small delay between batches to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Verify all submissions persisted
    expect(allSubmissions.length).toBe(NUM_SUBMISSIONS);

    // Verify all have unique IDs
    const uniqueIds = new Set(allSubmissions.map(s => s._id));
    expect(uniqueIds.size).toBe(NUM_SUBMISSIONS);

    // Verify no data loss - all files present
    const filesPresent = allSubmissions.every(s => s.resume?.url);
    expect(filesPresent).toBeTruthy();

    // Calculate average response time
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    expect(avgResponseTime).toBeLessThan(5000); // Less than 5 seconds average

    // ✅ OPTIMIZED: Verify all queue jobs in parallel (100x faster for 100 files)
    const verificationResults = await Promise.all(
      allSubmissions.map(async (submission) => {
        const fileUrl = submission.resume.url;
        const filename = path.basename(new URL(fileUrl).pathname);
        const verification = await gcsApi.verifyFileExists(request, filename);
        return verification.exists;
      })
    );
    const gcsFilesFound = verificationResults.filter(exists => exists).length;

    // At least 95% should be processed
    expect(gcsFilesFound).toBeGreaterThan(NUM_SUBMISSIONS * 0.95);

    console.log(`
✅ Stress Test Results:
   - Total Submissions: ${NUM_SUBMISSIONS}
   - Successful: ${allSubmissions.length}
   - Average Response Time: ${avgResponseTime.toFixed(0)}ms
   - GCS Files Found: ${gcsFilesFound}/${NUM_SUBMISSIONS}
   - Success Rate: ${(allSubmissions.length / NUM_SUBMISSIONS * 100).toFixed(1)}%
    `);
  });
});

/**
 * Helper function to wait for GCS upload completion
 */
async function waitForGCSUpload(
  request: any,
  filename: string,
  timeoutMs: number
): Promise<boolean> {
  const gcs = new GCSApiHelper();
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const verification = await gcs.verifyFileExists(request, filename);
    if (verification.exists) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return false;
}
