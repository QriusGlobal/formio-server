/**
 * Example: Advanced Validation
 * Demonstrates comprehensive validation patterns
 */

import { test, expect } from '@playwright/test';
import { gcsValidator } from '../utils/gcs-validator';
import { formioValidator } from '../utils/formio-validator';
import {
  UploadProgressValidator,
  EventEmissionValidator,
  AccessibilityValidator,
  PerformanceValidator,
} from '../utils/assertions';
import { testDataGenerator } from '../fixtures/test-data-generator';

test.describe('Advanced Validation Examples', () => {
  test('validate complete upload workflow', async ({ page }) => {
    await page.goto('/forms/upload-test');

    // Generate realistic test file
    const testFile = testDataGenerator.generateFile({
      type: 'document',
      size: 1024 * 100, // 100KB
    });

    // Set up event tracking
    const eventValidator = new EventEmissionValidator(page);
    await eventValidator.startListening([
      'upload-start',
      'upload-progress',
      'upload-complete',
    ]);

    // Set up progress tracking
    const progressValidator = new UploadProgressValidator(
      page,
      '[data-testid="upload-component"]'
    );
    await progressValidator.startTracking();

    // Upload file
    await page.locator('input[type="file"]').setInputFiles({
      name: testFile.name,
      buffer: testFile.content,
      mimeType: testFile.mimeType,
    });

    // Validate progress sequence
    await progressValidator.validateProgressSequence();

    // Validate event sequence
    await eventValidator.expectEventSequence([
      'upload-start',
      'upload-progress',
      'upload-complete',
    ]);

    // Wait for file to appear in GCS
    const appeared = await gcsValidator.waitForFile(`uploads/${testFile.name}`, 10000);
    expect(appeared).toBe(true);

    // Comprehensive GCS validation
    const gcsResult = await gcsValidator.validateFile(`uploads/${testFile.name}`, {
      checkMetadata: {
        contentType: testFile.mimeType,
        size: testFile.size,
      },
      checkContent: true,
    });

    expect(gcsResult.exists).toBe(true);
    expect(gcsResult.metadataValid).toBe(true);

    // Get and validate Form.io submission
    const submissionId = await page.getAttribute('[data-submission-id]', 'data-submission-id');
    expect(submissionId).toBeTruthy();

    const formioResult = await formioValidator.validateSubmission('upload-form', submissionId!, {
      checkFileReferences: true,
      checkDownloadable: true,
      checkPermissions: true,
      checkEvents: true,
    });

    expect(formioResult.valid).toBe(true);
    expect(formioResult.fileReferences).toHaveLength(1);
    expect(formioResult.downloadable).toBe(true);
  });

  test('validate upload performance', async ({ page }) => {
    await page.goto('/forms/upload-test');

    const performanceValidator = new PerformanceValidator(page);

    // Generate 1MB file
    const testFile = testDataGenerator.generateFile({
      type: 'document',
      size: 1024 * 1024,
    });

    // Measure upload duration
    const uploadOperation = async () => {
      await page.locator('input[type="file"]').setInputFiles({
        name: testFile.name,
        buffer: testFile.content,
        mimeType: testFile.mimeType,
      });
      await page.waitForSelector('[data-upload-status="complete"]');
    };

    // Execute with performance tracking
    const result = await performanceValidator.expectWithinTimeout(
      uploadOperation,
      10000, // 10 seconds max
      'File upload'
    );

    // Get detailed metrics
    const metrics = await performanceValidator.getPerformanceMetrics();
    console.log('Performance metrics:', metrics);

    // Attach performance data to test report
    test.info().attach('performance-data', {
      body: JSON.stringify({
        duration: result,
        fileSize: testFile.size,
        uploadSpeed: testFile.size / (result / 1000),
        metrics,
      }),
      contentType: 'application/json',
    });
  });

  test('validate accessibility', async ({ page }) => {
    await page.goto('/forms/upload-test');

    const a11yValidator = new AccessibilityValidator(page);

    // Comprehensive accessibility check
    await a11yValidator.validateAccessibility('[data-testid="upload-component"]');

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const fileInput = page.locator('input[type="file"]');
    const isFocused = await fileInput.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);

    // Test ARIA attributes
    const component = page.locator('[data-testid="upload-component"]');
    const role = await component.getAttribute('role');
    const ariaLabel = await component.getAttribute('aria-label');

    expect(role).toBeTruthy();
    expect(ariaLabel || (await component.getAttribute('aria-labelledby'))).toBeTruthy();
  });

  test('validate with multiple file types', async ({ page }) => {
    await page.goto('/forms/upload-test');

    // Generate realistic file set
    const files = testDataGenerator.generateRealisticFileSet();

    // Upload all files
    await page.locator('input[type="file"]').setInputFiles(
      files.map((f) => ({
        name: f.name,
        buffer: f.content,
        mimeType: f.mimeType,
      }))
    );

    await page.waitForSelector('[data-upload-status="complete"]');

    // Verify each file in GCS
    for (const file of files) {
      const result = await gcsValidator.validateFile(`uploads/${file.name}`, {
        checkMetadata: {
          contentType: file.mimeType,
        },
      });
      expect(result.exists).toBe(true);
    }

    // Verify Form.io submission
    const submissionId = await page.getAttribute('[data-submission-id]', 'data-submission-id');
    const formioResult = await formioValidator.validateSubmission('upload-form', submissionId!, {
      checkFileReferences: true,
      expectedFiles: files.map((f) => ({
        originalName: f.name,
        type: f.mimeType,
      })),
    });

    expect(formioResult.valid).toBe(true);
    expect(formioResult.fileReferences).toHaveLength(files.length);
  });

  test('validate edge cases', async ({ page }) => {
    await page.goto('/forms/upload-test');

    const edgeCases = testDataGenerator.generateEdgeCases();

    // Test empty file
    await page.locator('input[type="file"]').setInputFiles({
      name: edgeCases.empty.name,
      buffer: edgeCases.empty.content,
      mimeType: edgeCases.empty.mimeType,
    });

    const emptyError = page.locator('[role="alert"]');
    await expect(emptyError).toContainText(/empty/i);

    // Test file with special characters in name
    await page.locator('input[type="file"]').setInputFiles({
      name: edgeCases.specialChars.name,
      buffer: edgeCases.specialChars.content,
      mimeType: edgeCases.specialChars.mimeType,
    });

    // Should handle special characters gracefully
    await page.waitForSelector('[data-upload-status="complete"]');

    // Verify file exists (name should be sanitized)
    const files = await gcsValidator.listFiles('uploads/');
    expect(files.length).toBeGreaterThan(0);
  });

  test('validate concurrent uploads', async ({ page }) => {
    await page.goto('/forms/multiple-upload');

    // Generate multiple test files
    const files = testDataGenerator.generateFiles(5, {
      type: 'document',
      size: 1024 * 50,
    });

    // Upload all files simultaneously
    await page.locator('input[type="file"]').setInputFiles(
      files.map((f) => ({
        name: f.name,
        buffer: f.content,
        mimeType: f.mimeType,
      }))
    );

    // Wait for all uploads to complete
    await page.waitForSelector('[data-all-uploads-complete="true"]');

    // Verify all files in GCS
    const gcsStats = await gcsValidator.getBucketStats();
    expect(gcsStats.fileCount).toBeGreaterThanOrEqual(files.length);

    // Verify in Form.io
    const submissionId = await page.getAttribute('[data-submission-id]', 'data-submission-id');
    const submission = await formioValidator.getSubmission('upload-form', submissionId!);

    expect(submission).toBeTruthy();
    const fileRefs = formioValidator.extractFileReferences(submission!);
    expect(fileRefs.length).toBe(files.length);
  });
});