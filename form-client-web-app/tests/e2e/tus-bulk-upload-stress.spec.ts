/**
 * TUS Bulk Upload Stress Tests
 *
 * Comprehensive stress testing for bulk file upload functionality:
 * - Multiple file count scenarios (10, 15, 20, 30 files)
 * - Performance benchmarking and metrics
 * - Memory usage monitoring
 * - Network resilience testing
 * - Upload queue management validation
 */

import { test, expect } from '@playwright/test';

import {
  BULK_TEST_SCENARIOS,
  PERFORMANCE_BENCHMARKS,
  MIXED_SIZE_SCENARIOS,
  PERFORMANCE_THRESHOLDS
} from '../fixtures/bulk-test-data';
import { TusBulkUploadPage } from '../pages/TusBulkUploadPage';
import {
  generateBulkTestFiles,
  generateMixedSizeTestFiles,
  uploadWithProgressTracking,
  waitForBulkUploadComplete,
  formatMetrics,
  generateBenchmarkReport,
  type BenchmarkResult
} from '../utils/bulk-upload-helpers';

test.describe('TUS Bulk Upload Stress Tests', () => {
  let uploadPage: TusBulkUploadPage;

  test.beforeEach(async ({ page }) => {
    uploadPage = new TusBulkUploadPage(page);
    await uploadPage.goto();
    await page.waitForLoadState('networkidle');
  });

  test.describe('File Count Stress Tests', () => {
    test('Baseline: Upload 10 files (5MB each)', async ({ page }) => {
      const scenario = BULK_TEST_SCENARIOS[0]; // Baseline
      const files = await generateBulkTestFiles(scenario.fileCount, scenario.fileSizeKB);

      await uploadPage.configureTest({
        chunkSizeMB: scenario.chunkSizeMB,
        parallelUploads: scenario.parallelUploads,
        maxFiles: scenario.fileCount
      });

      const startTime = Date.now();
      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();
      const duration = Date.now() - startTime;

      // Validate success
      const isValid = await uploadPage.validateSubmission(scenario.fileCount);
      expect(isValid).toBe(true);

      // Performance assertion
      expect(duration / 1000).toBeLessThan(PERFORMANCE_THRESHOLDS.maxDuration10Files);

      // Log metrics
      console.log(`Baseline Test: ${scenario.fileCount} files uploaded in ${(duration / 1000).toFixed(2)}s`);
    });

    test('Standard: Upload 15 files (5MB each)', async ({ page }) => {
      const scenario = BULK_TEST_SCENARIOS[1]; // Standard
      const files = await generateBulkTestFiles(scenario.fileCount, scenario.fileSizeKB);

      await uploadPage.configureTest({
        chunkSizeMB: scenario.chunkSizeMB,
        parallelUploads: scenario.parallelUploads,
        maxFiles: scenario.fileCount
      });

      const startTime = Date.now();
      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();
      const duration = Date.now() - startTime;

      const isValid = await uploadPage.validateSubmission(scenario.fileCount);
      expect(isValid).toBe(true);

      expect(duration / 1000).toBeLessThan(PERFORMANCE_THRESHOLDS.maxDuration15Files);

      console.log(`Standard Test: ${scenario.fileCount} files uploaded in ${(duration / 1000).toFixed(2)}s`);
    });

    test('Heavy Load: Upload 20 files (10MB each)', async ({ page }) => {
      const scenario = BULK_TEST_SCENARIOS[2]; // Heavy Load
      const files = await generateBulkTestFiles(scenario.fileCount, scenario.fileSizeKB);

      await uploadPage.configureTest({
        chunkSizeMB: scenario.chunkSizeMB,
        parallelUploads: scenario.parallelUploads,
        maxFiles: scenario.fileCount
      });

      const startTime = Date.now();
      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();
      const duration = Date.now() - startTime;

      const isValid = await uploadPage.validateSubmission(scenario.fileCount);
      expect(isValid).toBe(true);

      expect(duration / 1000).toBeLessThan(PERFORMANCE_THRESHOLDS.maxDuration20Files);

      console.log(`Heavy Load Test: ${scenario.fileCount} files uploaded in ${(duration / 1000).toFixed(2)}s`);
    });

    test('Maximum Stress: Upload 30 files (5MB each)', async ({ page }) => {
      const scenario = BULK_TEST_SCENARIOS[3]; // Maximum Stress
      const files = await generateBulkTestFiles(scenario.fileCount, scenario.fileSizeKB);

      await uploadPage.configureTest({
        chunkSizeMB: scenario.chunkSizeMB,
        parallelUploads: scenario.parallelUploads,
        maxFiles: scenario.fileCount
      });

      const startTime = Date.now();
      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete(300000); // 5 min timeout
      const duration = Date.now() - startTime;

      const isValid = await uploadPage.validateSubmission(scenario.fileCount);
      expect(isValid).toBe(true);

      expect(duration / 1000).toBeLessThan(PERFORMANCE_THRESHOLDS.maxDuration30Files);

      console.log(`Maximum Stress Test: ${scenario.fileCount} files uploaded in ${(duration / 1000).toFixed(2)}s`);
    });
  });

  test.describe('Parallel Upload Configuration Tests', () => {
    for (const benchmark of PERFORMANCE_BENCHMARKS) {
      test(`Parallel=${benchmark.parallelUploads}: ${benchmark.description}`, async ({ page }) => {
        const files = await generateBulkTestFiles(benchmark.fileCount, benchmark.fileSizeKB);

        await uploadPage.configureTest({
          chunkSizeMB: benchmark.chunkSizeMB,
          parallelUploads: benchmark.parallelUploads,
          maxFiles: benchmark.fileCount
        });

        const startTime = Date.now();
        await uploadPage.uploadAndSubmit(files);
        await uploadPage.waitForUploadComplete();
        const duration = Date.now() - startTime;

        const isValid = await uploadPage.validateSubmission(benchmark.fileCount);
        expect(isValid).toBe(true);

        console.log(
          `Parallel=${benchmark.parallelUploads}: ${benchmark.fileCount} files in ${(duration / 1000).toFixed(2)}s ` +
          `(Throughput: ${((benchmark.fileCount * benchmark.fileSizeKB) / 1024 / (duration / 1000)).toFixed(2)} MB/s)`
        );
      });
    }
  });

  test.describe('Mixed File Size Tests', () => {
    test('Upload mixed-size files (1KB-50MB)', async ({ page }) => {
      const files = await generateMixedSizeTestFiles();

      await uploadPage.configureTest({
        chunkSizeMB: 5,
        parallelUploads: 3,
        maxFiles: 15
      });

      const startTime = Date.now();
      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();
      const duration = Date.now() - startTime;

      const isValid = await uploadPage.validateSubmission(files.length);
      expect(isValid).toBe(true);

      console.log(`Mixed Size Test: ${files.length} files uploaded in ${(duration / 1000).toFixed(2)}s`);
    });
  });

  test.describe('Performance Benchmarking', () => {
    test('Generate comprehensive performance report', async ({ page }) => {
      const results: BenchmarkResult[] = [];

      for (const scenario of BULK_TEST_SCENARIOS.slice(0, 4)) {
        const files = await generateBulkTestFiles(scenario.fileCount, scenario.fileSizeKB);

        await uploadPage.configureTest({
          chunkSizeMB: scenario.chunkSizeMB,
          parallelUploads: scenario.parallelUploads,
          maxFiles: scenario.fileCount
        });

        const startTime = Date.now();
        await uploadPage.uploadAndSubmit(files);
        await uploadPage.waitForUploadComplete();
        const duration = Date.now() - startTime;

        const totalSizeMB = (scenario.fileCount * scenario.fileSizeKB) / 1024;
        const durationSec = duration / 1000;
        const throughputMBps = totalSizeMB / durationSec;

        results.push({
          scenario: scenario.name,
          files: scenario.fileCount,
          totalSizeMB,
          durationSec,
          throughputMBps,
          parallelUploads: scenario.parallelUploads,
          chunkSizeMB: scenario.chunkSizeMB
        });

        await uploadPage.resetTest();

        // EVENT-DRIVEN: Wait for reset to complete
        await page.waitForFunction(() => {
          const fileItems = document.querySelectorAll('[data-upload-status]');
          return fileItems.length === 0;
        }, { timeout: 5000 });
      }

      const report = generateBenchmarkReport(results);
      console.log(`\n${  report  }\n`);

      // Verify at least 3 scenarios completed
      expect(results.length).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Memory Usage Tests', () => {
    test('Monitor memory during 15-file upload', async ({ page }) => {
      const files = await generateBulkTestFiles(15, 5 * 1024);

      await uploadPage.configureTest({
        chunkSizeMB: 5,
        parallelUploads: 3,
        maxFiles: 15
      });

      // Get initial memory
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();

      // Get peak memory
      const peakMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      const memoryIncreaseMB = (peakMemory - initialMemory) / (1024 * 1024);

      console.log(`Memory Increase: ${memoryIncreaseMB.toFixed(2)} MB`);

      // Memory should not increase excessively
      expect(memoryIncreaseMB).toBeLessThan(PERFORMANCE_THRESHOLDS.maxMemoryIncrease);
    });
  });

  test.describe('Upload Queue Management', () => {
    test('Verify parallel upload limit is respected', async ({ page }) => {
      const parallelLimit = 3;
      const files = await generateBulkTestFiles(15, 5 * 1024);

      await uploadPage.configureTest({
        chunkSizeMB: 5,
        parallelUploads: parallelLimit,
        maxFiles: 15
      });

      await uploadPage.uploadFiles(files);

      // Monitor concurrent uploads
      const concurrentCounts: number[] = [];
      let uploading = true;

      const monitor = async () => {
        const activeCount = await page.evaluate(() => {
          return document.querySelectorAll('[data-upload-status="uploading"]').length;
        });

        if (activeCount > 0) {
          concurrentCounts.push(activeCount);
        }

        const isComplete = await uploadPage.successBanner.isVisible();
        if (!isComplete && uploading) {
          await page.waitForTimeout(100);
          await monitor();
        } else {
          uploading = false;
        }
      };

      await uploadPage.submit();
      await monitor();
      await uploadPage.waitForUploadComplete();

      // Verify never exceeded parallel limit
      const maxConcurrent = Math.max(...concurrentCounts);
      console.log(`Max Concurrent Uploads: ${maxConcurrent} (Limit: ${parallelLimit})`);

      expect(maxConcurrent).toBeLessThanOrEqual(parallelLimit);
    });
  });

  test.describe('Validation Tests', () => {
    test('Validate all uploaded files have correct metadata', async ({ page }) => {
      const files = await generateBulkTestFiles(10, 5 * 1024);

      await uploadPage.configureTest({
        chunkSizeMB: 5,
        parallelUploads: 3,
        maxFiles: 10
      });

      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();

      // Get validation results
      const validation = await uploadPage.getValidationResults();

      expect(validation.multipleFiles).toBe(true);
      expect(validation.fileDataStructure).toBe(true);
      expect(validation.fileUrlsPresent).toBe(true);
      expect(validation.tusStorage).toBe(true);
      expect(validation.fileMetadata).toBe(true);
    });

    test('Verify submission data structure', async ({ page }) => {
      const files = await generateBulkTestFiles(10, 5 * 1024);

      await uploadPage.configureTest({
        chunkSizeMB: 5,
        parallelUploads: 3,
        maxFiles: 10
      });

      await uploadPage.uploadAndSubmit(files);
      await uploadPage.waitForUploadComplete();

      const submissionData = await uploadPage.getSubmissionData();

      // Verify data structure
      expect(submissionData).toHaveProperty('bulkPhotos');
      expect(Array.isArray(submissionData.bulkPhotos)).toBe(true);
      expect(submissionData.bulkPhotos).toHaveLength(10);

      // Verify each file has required properties
      submissionData.bulkPhotos.forEach((file: any) => {
        expect(file).toHaveProperty('name');
        expect(file).toHaveProperty('size');
        expect(file).toHaveProperty('type');
        expect(file).toHaveProperty('url');
        expect(file).toHaveProperty('storage');
        expect(file.storage).toBe('tus');
      });
    });
  });

  test.describe('Visual Regression Tests', () => {
    test('Capture upload progress screenshots', async ({ page }) => {
      const files = await generateBulkTestFiles(15, 5 * 1024);

      await uploadPage.configureTest({
        chunkSizeMB: 5,
        parallelUploads: 3,
        maxFiles: 15
      });

      await uploadPage.uploadAndSubmit(files);

      // Screenshot at different stages
      await page.waitForTimeout(1000);
      await uploadPage.takeScreenshot('bulk-upload-progress');

      await uploadPage.waitForUploadComplete();
      await uploadPage.takeScreenshot('bulk-upload-complete');

      // Verify success
      await expect(uploadPage.successBanner).toBeVisible();
    });
  });
});

test.describe('TUS Bulk Upload Edge Cases', () => {
  let uploadPage: TusBulkUploadPage;

  test.beforeEach(async ({ page }) => {
    uploadPage = new TusBulkUploadPage(page);
    await uploadPage.goto();
  });

  test('Handle empty file selection gracefully', async ({ page }) => {
    await uploadPage.configureTest({
      chunkSizeMB: 5,
      parallelUploads: 3,
      maxFiles: 15
    });

    // Try to submit without files
    await uploadPage.submit();

    // Should show validation error
    await expect(page.locator('text=/required/i')).toBeVisible({ timeout: 5000 });
  });

  test('Handle exceeding max file limit', async ({ page }) => {
    const maxFiles = 10;
    const files = await generateBulkTestFiles(maxFiles + 5, 1 * 1024); // 15 files when max is 10

    await uploadPage.configureTest({
      chunkSizeMB: 5,
      parallelUploads: 3,
      maxFiles
    });

    await uploadPage.uploadAndSubmit(files);

    // Should show validation error about too many files
    const errorVisible = await page.locator('text=/validation failed|too many files|exceeded/i').isVisible();
    expect(errorVisible).toBe(true);
  });
});
