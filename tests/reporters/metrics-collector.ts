/**
 * Performance Metrics Collector
 * Tracks and reports upload performance metrics
 */

import { Reporter, FullConfig, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadMetrics {
  testName: string;
  uploadDuration: number;
  fileSize: number;
  uploadSpeed: number; // bytes per second
  retries: number;
  success: boolean;
  timestamp: string;
}

export interface PerformanceReport {
  summary: {
    totalUploads: number;
    successRate: number;
    avgUploadDuration: number;
    avgUploadSpeed: number;
    totalDataTransferred: number;
  };
  metrics: UploadMetrics[];
  percentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export class MetricsCollector implements Reporter {
  private metrics: UploadMetrics[] = [];
  private outputFile: string;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile = options.outputFile || 'reports/performance-metrics.json';
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Extract performance metrics from test results
    const perfData = this.extractPerformanceData(result);

    if (perfData) {
      this.metrics.push({
        testName: test.title,
        uploadDuration: perfData.duration,
        fileSize: perfData.fileSize,
        uploadSpeed: perfData.fileSize / (perfData.duration / 1000),
        retries: result.retry,
        success: result.status === 'passed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private extractPerformanceData(
    result: TestResult
  ): { duration: number; fileSize: number } | null {
    // Look for performance data in test attachments or metadata
    const perfAttachment = result.attachments.find((a) => a.name === 'performance-data');

    if (perfAttachment && perfAttachment.body) {
      try {
        const data = JSON.parse(perfAttachment.body.toString());
        return {
          duration: data.duration || result.duration,
          fileSize: data.fileSize || 0,
        };
      } catch (e) {
        // Fall back to duration only
      }
    }

    return null;
  }

  onEnd() {
    if (this.metrics.length === 0) {
      return;
    }

    const report = this.generateReport();

    // Ensure output directory exists
    const dir = path.dirname(this.outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.outputFile, JSON.stringify(report, null, 2));

    console.log('\n=== Performance Metrics ===');
    console.log(`Total Uploads: ${report.summary.totalUploads}`);
    console.log(`Success Rate: ${(report.summary.successRate * 100).toFixed(1)}%`);
    console.log(`Avg Duration: ${report.summary.avgUploadDuration.toFixed(0)}ms`);
    console.log(`Avg Speed: ${this.formatBytes(report.summary.avgUploadSpeed)}/s`);
    console.log(`P95 Duration: ${report.percentiles.p95.toFixed(0)}ms`);
    console.log(`\nReport saved: ${this.outputFile}`);
  }

  private generateReport(): PerformanceReport {
    const successful = this.metrics.filter((m) => m.success);

    const summary = {
      totalUploads: this.metrics.length,
      successRate: successful.length / this.metrics.length,
      avgUploadDuration: this.average(successful.map((m) => m.uploadDuration)),
      avgUploadSpeed: this.average(successful.map((m) => m.uploadSpeed)),
      totalDataTransferred: this.sum(this.metrics.map((m) => m.fileSize)),
    };

    const durations = successful.map((m) => m.uploadDuration).sort((a, b) => a - b);

    const percentiles = {
      p50: this.percentile(durations, 50),
      p90: this.percentile(durations, 90),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
    };

    return {
      summary,
      metrics: this.metrics,
      percentiles,
    };
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private sum(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0);
  }

  private percentile(sortedNumbers: number[], percentile: number): number {
    if (sortedNumbers.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedNumbers.length) - 1;
    return sortedNumbers[Math.max(0, index)];
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Coverage Metrics Collector
 */
export class CoverageCollector {
  private outputFile: string;

  constructor(outputFile: string = 'reports/coverage.json') {
    this.outputFile = outputFile;
  }

  async collectCoverage(): Promise<void> {
    // This would integrate with istanbul/nyc or similar
    console.log('Coverage collection not yet implemented');
  }

  async generateReport(): Promise<void> {
    console.log(`Coverage report would be saved to: ${this.outputFile}`);
  }
}