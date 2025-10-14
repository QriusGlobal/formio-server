/**
 * Test Helper Utilities
 *
 * Common utilities for edge case and stress testing.
 */

import { type Page, expect } from '@playwright/test';

/**
 * Generate test file of specified size
 */
export function generateTestFile(
  sizeInBytes: number,
  fileName: string = 'test-file.bin'
): File {
  const buffer = new ArrayBuffer(sizeInBytes);
  const view = new Uint8Array(buffer);

  // Fill with random data
  for (let i = 0; i < sizeInBytes; i++) {
    view[i] = Math.floor(Math.random() * 256);
  }

  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  return new File([blob], fileName, { type: 'application/octet-stream' });
}

/**
 * Wait for upload to complete or fail
 */
export async function waitForUploadCompletion(
  page: Page,
  timeout: number = 30000
): Promise<'success' | 'error'> {
  try {
    await page.waitForSelector('.upload-complete, .upload-error', { timeout });

    const hasError = await page.locator('.upload-error').count() > 0;
    return hasError ? 'error' : 'success';
  } catch {
    throw new Error(`Upload did not complete within ${timeout}ms`);
  }
}

/**
 * Monitor console for errors
 */
export class ConsoleMonitor {
  private errors: string[] = [];
  private warnings: string[] = [];
  private logs: string[] = [];

  constructor(private page: Page) {
    this.setupListeners();
  }

  private setupListeners() {
    this.page.on('console', msg => {
      const text = msg.text();

      switch (msg.type()) {
        case 'error':
          this.errors.push(text);
          break;
        case 'warning':
          this.warnings.push(text);
          break;
        case 'log':
          this.logs.push(text);
          break;
      }
    });

    this.page.on('pageerror', error => {
      this.errors.push(error.message);
    });
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  getWarnings(): string[] {
    return [...this.warnings];
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  clear() {
    this.errors = [];
    this.warnings = [];
    this.logs = [];
  }

  assertNoErrors() {
    if (this.hasErrors()) {
      throw new Error(`Console errors detected:\n${this.errors.join('\n')}`);
    }
  }
}

/**
 * Create malicious file name
 */
export function createMaliciousFileName(type: 'xss' | 'path-traversal' | 'oversized' | 'special-chars'): string {
  switch (type) {
    case 'xss':
      return '<script>alert("XSS")</script>.txt';
    case 'path-traversal':
      return '../../../etc/passwd';
    case 'oversized':
      return `${'a'.repeat(10000)  }.txt`;
    case 'special-chars':
      return 'file:with*special|chars?.txt';
    default:
      return 'malicious-file.txt';
  }
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout: number = 5000
): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Check if element is visible and enabled
 */
export async function isElementInteractive(
  page: Page,
  selector: string
): Promise<boolean> {
  const element = page.locator(selector);
  const isVisible = await element.isVisible();
  const isEnabled = await element.isEnabled();
  return isVisible && isEnabled;
}

/**
 * Simulate browser tab visibility change
 */
export async function simulateTabVisibilityChange(
  page: Page,
  hidden: boolean
): Promise<void> {
  await page.evaluate((isHidden) => {
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: isHidden,
    });

    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: isHidden ? 'hidden' : 'visible',
    });

    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}

/**
 * Get localStorage items
 */
export async function getLocalStorage(page: Page): Promise<Record<string, string>> {
  return await page.evaluate(() => {
    const items: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        items[key] = localStorage.getItem(key) || '';
      }
    }
    return items;
  });
}

/**
 * Clear all browser storage
 */
export async function clearAllStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.context().clearCookies();
}

/**
 * Simulate slow typing
 */
export async function typeSlowly(
  page: Page,
  selector: string,
  text: string,
  delayMs: number = 100
): Promise<void> {
  const element = page.locator(selector);
  for (const char of text) {
    await element.type(char);
    await page.waitForTimeout(delayMs);
  }
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string
): Promise<string> {
  const timestamp = Date.now();
  const path = `screenshots/${name}-${timestamp}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}