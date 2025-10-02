/**
 * Custom Validation Assertions
 * Extends test framework with domain-specific matchers
 */

import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import { gcsValidator, GCSFile } from './gcs-validator';
import { formioValidator, FormioFileReference } from './formio-validator';

/**
 * Custom matcher for file existence in GCS
 */
export async function expectFileExists(fileName: string, bucket?: string): Promise<void> {
  const exists = await gcsValidator.fileExists(fileName);
  expect(exists, `Expected file '${fileName}' to exist in GCS bucket`).toBe(true);
}

/**
 * Custom matcher for file metadata validation
 */
export async function expectFileMetadata(
  fileName: string,
  expected: {
    size?: number;
    contentType?: string;
    minSize?: number;
    maxSize?: number;
  }
): Promise<void> {
  const result = await gcsValidator.verifyMetadata(fileName, expected);

  if (!result.valid) {
    throw new Error(`File metadata validation failed:\n${result.errors.join('\n')}`);
  }
}

/**
 * Upload progress validation
 */
export class UploadProgressValidator {
  private page: Page;
  private locator: Locator;
  private progressValues: number[] = [];

  constructor(page: Page, componentSelector: string) {
    this.page = page;
    this.locator = page.locator(componentSelector);
  }

  /**
   * Start tracking upload progress
   */
  async startTracking(): Promise<void> {
    this.progressValues = [];

    // Listen for progress events
    await this.page.evaluate(() => {
      window.addEventListener('upload-progress', ((event: CustomEvent) => {
        (window as any).__uploadProgress = (window as any).__uploadProgress || [];
        (window as any).__uploadProgress.push(event.detail.progress);
      }) as EventListener);
    });
  }

  /**
   * Get collected progress values
   */
  async getProgressValues(): Promise<number[]> {
    const values = await this.page.evaluate(() => (window as any).__uploadProgress || []);
    return values;
  }

  /**
   * Validate progress sequence
   */
  async validateProgressSequence(): Promise<void> {
    const values = await this.getProgressValues();

    expect(values.length, 'Progress events should be emitted').toBeGreaterThan(0);

    // Progress should be increasing
    for (let i = 1; i < values.length; i++) {
      expect(
        values[i],
        `Progress should increase: ${values[i - 1]} -> ${values[i]}`
      ).toBeGreaterThanOrEqual(values[i - 1]);
    }

    // Progress should be between 0 and 100
    values.forEach((value, index) => {
      expect(value, `Progress value at index ${index}`).toBeGreaterThanOrEqual(0);
      expect(value, `Progress value at index ${index}`).toBeLessThanOrEqual(100);
    });

    // Last value should be 100
    const lastValue = values[values.length - 1];
    expect(lastValue, 'Final progress should be 100').toBe(100);
  }

  /**
   * Validate progress timing
   */
  async validateProgressTiming(expectedMinDuration: number, expectedMaxDuration: number): Promise<void> {
    const startTime = Date.now();
    await this.validateProgressSequence();
    const duration = Date.now() - startTime;

    expect(duration, 'Upload duration').toBeGreaterThanOrEqual(expectedMinDuration);
    expect(duration, 'Upload duration').toBeLessThanOrEqual(expectedMaxDuration);
  }
}

/**
 * Event emission assertions
 */
export class EventEmissionValidator {
  private page: Page;
  private events: Array<{ type: string; detail: any; timestamp: number }> = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Start listening for events
   */
  async startListening(eventTypes: string[]): Promise<void> {
    this.events = [];

    await this.page.evaluate((types) => {
      (window as any).__testEvents = [];

      types.forEach((type) => {
        window.addEventListener(type, ((event: CustomEvent) => {
          (window as any).__testEvents.push({
            type: event.type,
            detail: event.detail,
            timestamp: Date.now(),
          });
        }) as EventListener);
      });
    }, eventTypes);
  }

  /**
   * Get collected events
   */
  async getEvents(): Promise<Array<{ type: string; detail: any; timestamp: number }>> {
    const events = await this.page.evaluate(() => (window as any).__testEvents || []);
    return events;
  }

  /**
   * Expect event was emitted
   */
  async expectEventEmitted(eventType: string, detailMatcher?: (detail: any) => boolean): Promise<void> {
    const events = await this.getEvents();
    const matchingEvents = events.filter((e) => {
      if (e.type !== eventType) return false;
      if (detailMatcher && !detailMatcher(e.detail)) return false;
      return true;
    });

    expect(
      matchingEvents.length,
      `Event '${eventType}' should have been emitted`
    ).toBeGreaterThan(0);
  }

  /**
   * Expect event sequence
   */
  async expectEventSequence(expectedSequence: string[]): Promise<void> {
    const events = await this.getEvents();
    const eventTypes = events.map((e) => e.type);

    expect(eventTypes, 'Event sequence should match').toEqual(expectedSequence);
  }
}

/**
 * Form submission validation
 */
export async function expectSubmissionValid(
  formId: string,
  submissionId: string,
  options: {
    hasFileReferences?: boolean;
    filesDownloadable?: boolean;
    expectedFileCount?: number;
  } = {}
): Promise<void> {
  const result = await formioValidator.validateSubmission(formId, submissionId, {
    checkFileReferences: options.hasFileReferences,
    checkDownloadable: options.filesDownloadable,
  });

  if (!result.valid) {
    throw new Error(`Submission validation failed:\n${result.errors.join('\n')}`);
  }

  if (options.expectedFileCount !== undefined && result.fileReferences) {
    expect(
      result.fileReferences.length,
      'Number of file references'
    ).toBe(options.expectedFileCount);
  }
}

/**
 * Error message validation
 */
export async function expectErrorMessage(
  page: Page,
  componentSelector: string,
  expectedMessage: string | RegExp
): Promise<void> {
  const errorElement = page.locator(`${componentSelector} [role="alert"], ${componentSelector} .error`);

  await expect(errorElement, 'Error message should be visible').toBeVisible();

  if (typeof expectedMessage === 'string') {
    await expect(errorElement, 'Error message text').toContainText(expectedMessage);
  } else {
    const text = await errorElement.textContent();
    expect(text, 'Error message pattern').toMatch(expectedMessage);
  }
}

/**
 * Accessibility validation
 */
export class AccessibilityValidator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Check for required ARIA attributes
   */
  async validateAriaAttributes(selector: string): Promise<void> {
    const element = this.page.locator(selector);

    // Check common ARIA attributes
    const role = await element.getAttribute('role');
    expect(role, `Element ${selector} should have role attribute`).toBeTruthy();

    // Check for labels
    const ariaLabel = await element.getAttribute('aria-label');
    const ariaLabelledBy = await element.getAttribute('aria-labelledby');

    expect(
      ariaLabel || ariaLabelledBy,
      `Element ${selector} should have aria-label or aria-labelledby`
    ).toBeTruthy();
  }

  /**
   * Check keyboard navigation
   */
  async validateKeyboardNavigation(selector: string): Promise<void> {
    const element = this.page.locator(selector);

    // Element should be focusable
    await element.focus();
    const focused = await element.evaluate((el) => document.activeElement === el);
    expect(focused, `Element ${selector} should be focusable`).toBe(true);

    // Check tabindex
    const tabindex = await element.getAttribute('tabindex');
    if (tabindex !== null) {
      const tabindexValue = parseInt(tabindex, 10);
      expect(
        tabindexValue,
        `Element ${selector} tabindex should be >= -1`
      ).toBeGreaterThanOrEqual(-1);
    }
  }

  /**
   * Check color contrast
   */
  async validateColorContrast(selector: string, minRatio: number = 4.5): Promise<void> {
    const contrastRatio = await this.page.evaluate(
      ({ sel }) => {
        const element = document.querySelector(sel);
        if (!element) return 0;

        const style = window.getComputedStyle(element);
        const fg = style.color;
        const bg = style.backgroundColor;

        // Simple luminance calculation (simplified version)
        const getLuminance = (color: string): number => {
          const rgb = color.match(/\d+/g);
          if (!rgb) return 0;

          const [r, g, b] = rgb.map(Number);
          const [rs, gs, bs] = [r, g, b].map((c) => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });

          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const l1 = getLuminance(fg);
        const l2 = getLuminance(bg);

        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      },
      { sel: selector }
    );

    expect(
      contrastRatio,
      `Color contrast ratio for ${selector} should be at least ${minRatio}`
    ).toBeGreaterThanOrEqual(minRatio);
  }

  /**
   * Run comprehensive accessibility check
   */
  async validateAccessibility(selector: string): Promise<void> {
    await this.validateAriaAttributes(selector);
    await this.validateKeyboardNavigation(selector);
    await this.validateColorContrast(selector);
  }
}

/**
 * Performance validation
 */
export class PerformanceValidator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Measure operation duration
   */
  async measureDuration<T>(operation: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;

    return { result, duration };
  }

  /**
   * Validate operation completes within timeout
   */
  async expectWithinTimeout<T>(
    operation: () => Promise<T>,
    maxDuration: number,
    operationName: string
  ): Promise<T> {
    const { result, duration } = await this.measureDuration(operation);

    expect(
      duration,
      `${operationName} should complete within ${maxDuration}ms`
    ).toBeLessThanOrEqual(maxDuration);

    return result;
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
  }> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      return {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    return metrics;
  }
}

/**
 * Helper to create all validators
 */
export function createValidators(page: Page) {
  return {
    uploadProgress: new UploadProgressValidator(page, '[data-testid="upload-component"]'),
    events: new EventEmissionValidator(page),
    accessibility: new AccessibilityValidator(page),
    performance: new PerformanceValidator(page),
  };
}