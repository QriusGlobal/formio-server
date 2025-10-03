/**
 * Bulk Upload Testing Utilities
 *
 * Helper functions for stress testing bulk file uploads:
 * - Generate multiple test files dynamically
 * - Batch file selection simulation
 * - Upload progress tracking
 * - Performance metrics collection
 */

import { Page } from '@playwright/test';
import { generateTestFile, TestFile } from './file-helpers';
import path from 'path';

export interface BulkUploadConfig {
  fileCount: number;
  fileSizeKB: number;
  chunkSizeMB?: number;
  parallelUploads?: number;
  filePattern?: 'images' | 'documents' | 'all';
}

export interface BulkUploadMetrics {
  totalFiles: number;
  totalSizeMB: number;
  uploadStartTime: number;
  uploadEndTime: number;
  totalDurationMs: number;
  avgFileUploadMs: number;
  throughputMBps: number;
  peakMemoryMB: number;
  failedUploads: number;
}

/**
 * Generate multiple test files for bulk upload testing
 */
export async function generateBulkTestFiles(
  count: number,
  sizeKB: number,
  prefix = 'bulk-test'
): Promise<TestFile[]> {
  const files: TestFile[] = [];

  for (let i = 0; i < count; i++) {
    const file = await generateTestFile({
      size: sizeKB * 1024,
      filename: `${prefix}-${i + 1}-${sizeKB}kb.bin`,
      mimeType: 'application/octet-stream',
      content: 'random'
    });
    files.push(file);
  }

  return files;
}

/**
 * Generate mixed-size test files for realistic bulk upload scenarios
 */
export async function generateMixedSizeTestFiles(): Promise<TestFile[]> {
  const fileSizes = [
    1,     // 1KB
    10,    // 10KB
    100,   // 100KB
    1024,  // 1MB
    5 * 1024,   // 5MB
    10 * 1024,  // 10MB
    20 * 1024,  // 20MB
    50 * 1024   // 50MB
  ];

  const files: TestFile[] = [];

  for (let i = 0; i < fileSizes.length; i++) {
    const sizeKB = fileSizes[i];
    const file = await generateTestFile({
      size: sizeKB * 1024,
      filename: `mixed-${i + 1}-${sizeKB}kb.bin`,
      mimeType: 'application/octet-stream',
      content: i % 2 === 0 ? 'random' : 'pattern' // Alternate content types
    });
    files.push(file);
  }

  return files;
}

/**
 * Upload files and track progress
 */
export async function uploadWithProgressTracking(
  page: Page,
  files: TestFile[]
): Promise<BulkUploadMetrics> {
  const startTime = Date.now();
  const initialMemory = await getMemoryUsage(page);

  // Select files
  const filePaths = files.map(f => f.path);
  await page.setInputFiles('input[type="file"]', filePaths);

  // Wait for upload completion
  await page.waitForSelector('text=/Submission Successful/i', { timeout: 300000 }); // 5 min timeout

  const endTime = Date.now();
  const finalMemory = await getMemoryUsage(page);

  // Calculate metrics
  const totalSizeBytes = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = totalSizeBytes / (1024 * 1024);
  const totalDurationMs = endTime - startTime;
  const totalDurationSec = totalDurationMs / 1000;
  const throughputMBps = totalSizeMB / totalDurationSec;

  return {
    totalFiles: files.length,
    totalSizeMB,
    uploadStartTime: startTime,
    uploadEndTime: endTime,
    totalDurationMs,
    avgFileUploadMs: totalDurationMs / files.length,
    throughputMBps,
    peakMemoryMB: Math.max(initialMemory, finalMemory),
    failedUploads: 0 // TODO: Track actual failures
  };
}

/**
 * Get current memory usage
 */
export async function getMemoryUsage(page: Page): Promise<number> {
  const memory = await page.evaluate(() => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  });

  return memory / (1024 * 1024); // Convert to MB
}

/**
 * Track concurrent upload count over time
 */
export async function trackConcurrentUploads(
  page: Page,
  intervalMs = 100
): Promise<number[]> {
  const concurrentCounts: number[] = [];

  const tracker = setInterval(async () => {
    const activeCount = await page.evaluate(() => {
      const uploadingElements = document.querySelectorAll('[data-upload-status="uploading"]');
      return uploadingElements.length;
    });
    concurrentCounts.push(activeCount);
  }, intervalMs);

  // Return cleanup function
  return new Promise((resolve) => {
    const checkCompletion = setInterval(async () => {
      const isComplete = await page.locator('text=/Submission Successful/i').isVisible();
      if (isComplete) {
        clearInterval(tracker);
        clearInterval(checkCompletion);
        resolve(concurrentCounts);
      }
    }, 500);
  });
}

/**
 * Validate upload queue management
 */
export async function validateUploadQueue(
  page: Page,
  expectedMaxConcurrent: number
): Promise<boolean> {
  const concurrentCounts = await trackConcurrentUploads(page);

  // Verify never exceeded max concurrent uploads
  const maxObserved = Math.max(...concurrentCounts);
  return maxObserved <= expectedMaxConcurrent;
}

/**
 * Simulate network conditions
 */
export async function simulateNetworkConditions(
  page: Page,
  condition: '3G' | '4G' | 'slow-wifi' | 'offline'
): Promise<void> {
  const conditions = {
    '3G': {
      downloadThroughput: (750 * 1024) / 8, // 750 Kbps
      uploadThroughput: (250 * 1024) / 8,   // 250 Kbps
      latency: 100
    },
    '4G': {
      downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps
      uploadThroughput: (3 * 1024 * 1024) / 8,   // 3 Mbps
      latency: 50
    },
    'slow-wifi': {
      downloadThroughput: (2 * 1024 * 1024) / 8, // 2 Mbps
      uploadThroughput: (1 * 1024 * 1024) / 8,   // 1 Mbps
      latency: 30
    },
    'offline': {
      downloadThroughput: 0,
      uploadThroughput: 0,
      latency: 0
    }
  };

  const config = conditions[condition];

  await page.route('**/*', (route) => {
    setTimeout(() => {
      route.continue();
    }, config.latency);
  });
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: BulkUploadMetrics): string {
  return `
Bulk Upload Performance Metrics:
================================
Total Files:        ${metrics.totalFiles}
Total Size:         ${metrics.totalSizeMB.toFixed(2)} MB
Duration:           ${(metrics.totalDurationMs / 1000).toFixed(2)} seconds
Avg per File:       ${(metrics.avgFileUploadMs / 1000).toFixed(2)} seconds
Throughput:         ${metrics.throughputMBps.toFixed(2)} MB/s
Peak Memory:        ${metrics.peakMemoryMB.toFixed(2)} MB
Failed Uploads:     ${metrics.failedUploads}
`.trim();
}

/**
 * Generate performance benchmark report
 */
export interface BenchmarkResult {
  scenario: string;
  files: number;
  totalSizeMB: number;
  durationSec: number;
  throughputMBps: number;
  parallelUploads: number;
  chunkSizeMB: number;
}

export function generateBenchmarkReport(results: BenchmarkResult[]): string {
  const header = '| Scenario | Files | Size (MB) | Duration (s) | Throughput (MB/s) | Parallel | Chunk (MB) |';
  const separator = '|----------|-------|-----------|--------------|-------------------|----------|------------|';

  const rows = results.map(r =>
    `| ${r.scenario.padEnd(8)} | ${String(r.files).padEnd(5)} | ${r.totalSizeMB.toFixed(2).padEnd(9)} | ${r.durationSec.toFixed(2).padEnd(12)} | ${r.throughputMBps.toFixed(2).padEnd(17)} | ${String(r.parallelUploads).padEnd(8)} | ${String(r.chunkSizeMB).padEnd(10)} |`
  );

  return [header, separator, ...rows].join('\n');
}

/**
 * Wait for all uploads to complete with timeout
 */
export async function waitForBulkUploadComplete(
  page: Page,
  expectedFileCount: number,
  timeoutMs = 300000 // 5 minutes
): Promise<boolean> {
  try {
    await page.waitForSelector('text=/Submission Successful/i', { timeout: timeoutMs });

    // Verify file count in submission
    const uploadedCount = await page.evaluate(() => {
      const submissionData = document.querySelector('pre')?.textContent;
      if (!submissionData) return 0;

      try {
        const data = JSON.parse(submissionData);
        return Array.isArray(data.bulkPhotos) ? data.bulkPhotos.length : 0;
      } catch {
        return 0;
      }
    });

    return uploadedCount === expectedFileCount;
  } catch (error) {
    return false;
  }
}

/**
 * Extract upload statistics from page
 */
export async function extractUploadStatistics(page: Page): Promise<{
  filesUploaded: number;
  totalSizeMB: number;
  chunkSizeMB: number;
  parallelUploads: number;
}> {
  return page.evaluate(() => {
    const stats = {
      filesUploaded: 0,
      totalSizeMB: 0,
      chunkSizeMB: 0,
      parallelUploads: 0
    };

    // Extract from statistics cards
    const cards = document.querySelectorAll('[style*="grid"] > div');
    cards.forEach((card) => {
      const text = card.textContent || '';
      const value = card.querySelector('div')?.textContent || '0';

      if (text.includes('Files Uploaded')) {
        stats.filesUploaded = parseInt(value, 10);
      } else if (text.includes('Total Size')) {
        stats.totalSizeMB = parseFloat(value);
      } else if (text.includes('Chunk Size')) {
        stats.chunkSizeMB = parseFloat(value);
      } else if (text.includes('Parallel Uploads')) {
        stats.parallelUploads = parseInt(value, 10);
      }
    });

    return stats;
  });
}
