/**
 * Accessibility Test Helpers
 *
 * WCAG 2.1 AA compliant test utilities for ARIA state polling
 * and accessibility event monitoring.
 */

import { type Page, Locator } from '@playwright/test';

/**
 * Wait for ARIA busy state to clear (upload/processing completion)
 */
export async function waitForAriaBusyFalse(
  page: Page,
  selector?: string,
  timeout = 10000
): Promise<void> {
  const targetSelector = selector || '[aria-busy]';

  await page.waitForFunction(
    (sel) => {
      const elements = document.querySelectorAll(sel);
      if (elements.length === 0) return true; // No busy elements
      return Array.from(elements).every(el =>
        el.getAttribute('aria-busy') !== 'true'
      );
    },
    targetSelector,
    { timeout }
  );
}

/**
 * Wait for ARIA live region announcement
 */
export async function waitForAriaLiveAnnouncement(
  page: Page,
  expectedText?: string,
  timeout = 5000
): Promise<string> {
  return page.waitForFunction(
    (text) => {
      const liveRegions = document.querySelectorAll('[aria-live="polite"], [aria-live="assertive"]');
      for (const region of liveRegions) {
        const content = region.textContent || '';
        if (!text || content.includes(text)) {
          return content;
        }
      }
      return false;
    },
    expectedText,
    { timeout }
  );
}

/**
 * Wait for specific element to receive focus
 */
export async function waitForFocus(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      return element && document.activeElement === element;
    },
    selector,
    { timeout }
  );
}

/**
 * Wait for focus to move (detect focus change)
 */
export async function waitForFocusChange(
  page: Page,
  timeout = 5000
): Promise<string> {
  const initialFocus = await page.evaluate(() => {
    return document.activeElement?.className || '';
  });

  return page.waitForFunction(
    (initial) => {
      const current = document.activeElement?.className || '';
      return current !== initial;
    },
    initialFocus,
    { timeout }
  );
}

/**
 * Wait for role=alert to appear with error message
 */
export async function waitForAlertRole(
  page: Page,
  expectedText?: string,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (text) => {
      const alerts = document.querySelectorAll('[role="alert"]');
      if (alerts.length === 0) return false;

      if (!text) return true;

      return Array.from(alerts).some(alert =>
        (alert.textContent || '').includes(text)
      );
    },
    expectedText,
    { timeout }
  );
}

/**
 * Wait for aria-expanded state change
 */
export async function waitForAriaExpandedChange(
  page: Page,
  selector: string,
  expectedState: boolean,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ sel, state }) => {
      const element = document.querySelector(sel);
      return element?.getAttribute('aria-expanded') === String(state);
    },
    { sel: selector, state: expectedState },
    { timeout }
  );
}

/**
 * Monitor keyboard event and wait for specific key
 */
export async function waitForKeyPress(
  page: Page,
  key: string,
  timeout = 5000
): Promise<void> {
  await page.evaluate((k) => {
    return new Promise((resolve) => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === k) {
          document.removeEventListener('keydown', handler);
          resolve(true);
        }
      };
      document.addEventListener('keydown', handler);
    });
  }, key);
}

/**
 * Wait for focus to be trapped within container (modal focus management)
 */
export async function waitForFocusTrap(
  page: Page,
  containerSelector: string,
  timeout = 5000
): Promise<boolean> {
  return page.waitForFunction(
    (sel) => {
      const container = document.querySelector(sel);
      if (!container) return false;

      const activeElement = document.activeElement;
      return container.contains(activeElement);
    },
    containerSelector,
    { timeout }
  );
}

/**
 * Wait for upload progress to reach percentage (via ARIA)
 */
export async function waitForUploadProgress(
  page: Page,
  targetPercent: number,
  timeout = 30000
): Promise<void> {
  await page.waitForFunction(
    (target) => {
      // Check for aria-valuenow on progress bars
      const progressBars = document.querySelectorAll('[role="progressbar"]');
      for (const bar of progressBars) {
        const value = Number.parseInt(bar.getAttribute('aria-valuenow') || '0');
        if (value >= target) return true;
      }

      // Fallback: check text content
      const percentageElements = document.querySelectorAll('.uppy-StatusBar-percentage, .uppy-ProgressBar-percentage');
      for (const el of percentageElements) {
        const match = (el.textContent || '').match(/(\d+)%/);
        if (match && Number.parseInt(match[1]) >= target) return true;
      }

      return false;
    },
    targetPercent,
    { timeout }
  );
}

/**
 * Wait for upload completion via ARIA states
 */
export async function waitForUploadCompleteAria(
  page: Page,
  timeout = 30000
): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check for aria-valuenow=100 on progress bars
      const progressBars = document.querySelectorAll('[role="progressbar"]');
      for (const bar of progressBars) {
        const value = Number.parseInt(bar.getAttribute('aria-valuenow') || '0');
        if (value === 100) return true;
      }

      // Check for complete status in live regions
      const liveRegions = document.querySelectorAll('[aria-live]');
      for (const region of liveRegions) {
        const text = (region.textContent || '').toLowerCase();
        if (text.includes('complete') || text.includes('100%')) return true;
      }

      // Check aria-busy=false on upload container
      const busyElements = document.querySelectorAll('[aria-busy="true"]');
      return busyElements.length === 0;
    },
    { timeout }
  );
}

/**
 * Wait for modal to close (aria-hidden or removal)
 */
export async function waitForModalClose(
  page: Page,
  modalSelector: string,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const modal = document.querySelector(sel);
      if (!modal) return true; // Modal removed

      // Check aria-hidden
      if (modal.getAttribute('aria-hidden') === 'true') return true;

      // Check if not visible
      const styles = window.getComputedStyle(modal);
      return styles.display === 'none' || styles.visibility === 'hidden';
    },
    modalSelector,
    { timeout }
  );
}

/**
 * Wait for file count announcement in status region
 */
export async function waitForFileCountUpdate(
  page: Page,
  expectedCount: number,
  timeout = 5000
): Promise<void> {
  await page.waitForFunction(
    (count) => {
      const statusRegions = document.querySelectorAll('[aria-live], .uppy-state-info');
      for (const region of statusRegions) {
        const text = region.textContent || '';
        const match = text.match(/(\d+)\s+file/);
        if (match && Number.parseInt(match[1]) === count) return true;
      }
      return false;
    },
    expectedCount,
    { timeout }
  );
}

/**
 * Get current focused element's accessible name
 */
export async function getFocusedElementLabel(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return '';

    // Check aria-label
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // Check aria-labelledby
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      return labelElement?.textContent || '';
    }

    // Get text content
    return el.textContent || '';
  });
}

/**
 * Verify focus visible indicator exists
 */
export async function hasFocusIndicator(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element || element !== document.activeElement) return false;

    const styles = window.getComputedStyle(element);

    // Check for outline
    if (styles.outline && styles.outline !== 'none' && styles.outline !== '0px') {
      return true;
    }

    // Check for box-shadow
    if (styles.boxShadow && styles.boxShadow !== 'none') {
      return true;
    }

    // Check for border changes
    if (styles.border && styles.border !== 'none') {
      return true;
    }

    return false;
  }, selector);
}

/**
 * Wait for screen reader announcement to complete
 * (monitors aria-live region updates)
 */
export async function waitForScreenReaderAnnouncement(
  page: Page,
  timeout = 3000
): Promise<string[]> {
  return page.evaluate((ms) => {
    return new Promise((resolve) => {
      const announcements: string[] = [];
      const liveRegions = document.querySelectorAll('[aria-live]');

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const target = mutation.target as Element;
            const text = target.textContent || '';
            if (text.trim()) {
              announcements.push(text.trim());
            }
          }
        }
      });

      for (const region of liveRegions) {
        observer.observe(region, {
          characterData: true,
          childList: true,
          subtree: true
        });
      }

      setTimeout(() => {
        observer.disconnect();
        resolve(announcements);
      }, ms);
    });
  }, timeout);
}

/**
 * Verify element has accessible description
 */
export async function hasAccessibleDescription(
  page: Page,
  selector: string
): Promise<boolean> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    // Check aria-describedby
    const describedBy = element.getAttribute('aria-describedby');
    if (describedBy) {
      const description = document.getElementById(describedBy);
      return description !== null && description.textContent !== '';
    }

    // Check title attribute
    const title = element.getAttribute('title');
    return title !== null && title !== '';
  }, selector);
}
