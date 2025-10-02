/**
 * Memory Monitoring Utilities
 *
 * Provides utilities for monitoring browser memory usage during tests,
 * particularly useful for large file upload tests.
 */

import { Page } from '@playwright/test';

export interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

export class MemoryMonitor {
  private metrics: MemoryMetrics[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private page: Page, private samplingInterval: number = 1000) {}

  /**
   * Start monitoring memory usage
   */
  async start(): Promise<void> {
    this.metrics = [];

    this.intervalId = setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        this.metrics.push(metrics);
      } catch (error) {
        console.error('Error collecting memory metrics:', error);
      }
    }, this.samplingInterval);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Collect current memory metrics
   */
  async collectMetrics(): Promise<MemoryMetrics> {
    const metrics = await this.page.evaluate(() => {
      if (!performance.memory) {
        throw new Error('performance.memory not available');
      }

      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };
    });

    return metrics;
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): MemoryMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get peak memory usage
   */
  getPeakUsage(): number {
    if (this.metrics.length === 0) return 0;
    return Math.max(...this.metrics.map(m => m.usedJSHeapSize));
  }

  /**
   * Get average memory usage
   */
  getAverageUsage(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.usedJSHeapSize, 0);
    return sum / this.metrics.length;
  }

  /**
   * Get memory increase from start to end
   */
  getMemoryIncrease(): number {
    if (this.metrics.length < 2) return 0;
    const first = this.metrics[0].usedJSHeapSize;
    const last = this.metrics[this.metrics.length - 1].usedJSHeapSize;
    return last - first;
  }

  /**
   * Format bytes to human-readable format
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Check if memory usage is within acceptable limits
   */
  checkMemoryLimit(limitMB: number): boolean {
    const peakUsage = this.getPeakUsage();
    const limitBytes = limitMB * 1024 * 1024;
    return peakUsage <= limitBytes;
  }

  /**
   * Generate memory usage report
   */
  generateReport(): string {
    const peak = this.getPeakUsage();
    const average = this.getAverageUsage();
    const increase = this.getMemoryIncrease();

    return `
Memory Usage Report:
- Samples: ${this.metrics.length}
- Peak: ${MemoryMonitor.formatBytes(peak)}
- Average: ${MemoryMonitor.formatBytes(average)}
- Increase: ${MemoryMonitor.formatBytes(increase)}
- Limit: ${this.metrics[0] ? MemoryMonitor.formatBytes(this.metrics[0].jsHeapSizeLimit) : 'N/A'}
    `.trim();
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

/**
 * Force garbage collection (requires --expose-gc flag)
 */
export async function forceGarbageCollection(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (typeof (global as any).gc === 'function') {
      (global as any).gc();
    }
  });
}

/**
 * Wait for memory to stabilize
 */
export async function waitForMemoryStabilization(
  page: Page,
  maxWaitMs: number = 5000,
  checkIntervalMs: number = 500
): Promise<void> {
  const startTime = Date.now();
  let previousMemory = 0;
  let stableCount = 0;
  const requiredStableChecks = 3;

  while (Date.now() - startTime < maxWaitMs) {
    const currentMemory = await page.evaluate(() => {
      return performance.memory ? performance.memory.usedJSHeapSize : 0;
    });

    const diff = Math.abs(currentMemory - previousMemory);
    const threshold = 1024 * 1024; // 1MB

    if (diff < threshold) {
      stableCount++;
      if (stableCount >= requiredStableChecks) {
        return;
      }
    } else {
      stableCount = 0;
    }

    previousMemory = currentMemory;
    await page.waitForTimeout(checkIntervalMs);
  }
}