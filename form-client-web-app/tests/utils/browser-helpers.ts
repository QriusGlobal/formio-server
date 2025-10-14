/**
 * Browser-Specific Feature Detection Helpers
 *
 * Provides event-driven utilities for cross-browser compatibility testing
 * without arbitrary timeouts.
 */

import type { Page } from '@playwright/test';

/**
 * Browser Feature Detection Patterns
 */
export const BrowserFeatures = {
  /**
   * Wait for FileReader API to be available
   */
  waitForFileReaderAPI: (page: Page, timeout = 5000) => {
    return page.waitForFunction(() => 'FileReader' in window, { timeout });
  },

  /**
   * Wait for MediaDevices API to be available
   */
  waitForMediaDevicesAPI: (page: Page, timeout = 5000) => {
    return page.waitForFunction(
      () => navigator.mediaDevices !== undefined,
      { timeout }
    );
  },

  /**
   * Wait for Storage APIs to be available
   */
  waitForStorageAPIs: (page: Page, timeout = 5000) => {
    return page.waitForFunction(
      () => 'localStorage' in window && 'sessionStorage' in window,
      { timeout }
    );
  },

  /**
   * Wait for Blob constructor to be available
   */
  waitForBlobAPI: (page: Page, timeout = 5000) => {
    return page.waitForFunction(() => typeof Blob !== 'undefined', { timeout });
  },

  /**
   * Wait for custom polyfill to load
   */
  waitForPolyfill: (page: Page, polyfillName: string, timeout = 10000) => {
    return page.waitForFunction(
      (name) => (window as any)[name] !== undefined,
      polyfillName,
      { timeout }
    );
  },

  /**
   * Check browser-specific behavior availability
   */
  detectBrowserCapabilities: async (page: Page) => {
    return page.evaluate(() => ({
      hasFileAPI: 'File' in window,
      hasFileReader: 'FileReader' in window,
      hasBlob: typeof Blob !== 'undefined',
      hasLocalStorage: 'localStorage' in window,
      hasSessionStorage: 'sessionStorage' in window,
      hasIndexedDB: 'indexedDB' in window,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasMediaDevices: navigator.mediaDevices !== undefined,
      browserName: navigator.userAgent,
    }));
  },
};

/**
 * Upload Progress Tracking Helpers
 */
export const UploadProgress = {
  /**
   * Wait for upload to start (progress > 0%)
   */
  waitForUploadStart: (page: Page, timeout = 10000) => {
    return page.waitForFunction(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      const progress = match ? Number.parseInt(match[1]) : 0;
      return progress > 0;
    }, { timeout });
  },

  /**
   * Wait for upload progress to exceed a threshold
   */
  waitForProgressThreshold: (page: Page, threshold: number, timeout = 15000) => {
    return page.waitForFunction(
      (minProgress) => {
        const text = document.querySelector('.progress-text')?.textContent;
        const match = text?.match(/(\d+)%/);
        const progress = match ? Number.parseInt(match[1]) : 0;
        return progress >= minProgress;
      },
      threshold,
      { timeout }
    );
  },

  /**
   * Wait for progress to advance beyond a baseline
   */
  waitForProgressAdvancement: (
    page: Page,
    baselineProgress: number,
    timeout = 15000
  ) => {
    return page.waitForFunction(
      (baseline) => {
        const text = document.querySelector('.progress-text')?.textContent;
        const match = text?.match(/(\d+)%/);
        const currentProgress = match ? Number.parseInt(match[1]) : 0;
        return currentProgress > baseline;
      },
      baselineProgress,
      { timeout }
    );
  },

  /**
   * Get current upload progress percentage
   */
  getCurrentProgress: (page: Page) => {
    return page.evaluate(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      return match ? Number.parseInt(match[1]) : 0;
    });
  },
};

/**
 * Storage State Helpers
 */
export const StorageHelpers = {
  /**
   * Wait for localStorage to contain specific data
   */
  waitForLocalStorageKey: (
    page: Page,
    keyPattern: string,
    timeout = 10000
  ) => {
    return page.waitForFunction(
      (pattern) => {
        return Object.keys(localStorage).some((key) => key.includes(pattern));
      },
      keyPattern,
      { timeout }
    );
  },

  /**
   * Wait for TUS upload URL to be stored
   */
  waitForTUSUploadURL: (page: Page, timeout = 10000) => {
    return page.waitForFunction(() => {
      return Object.keys(localStorage).some(
        (key) =>
          key.includes('tus') &&
          localStorage.getItem(key)?.includes('http')
      );
    }, { timeout });
  },

  /**
   * Wait for localStorage to be populated with data
   */
  waitForStoragePopulation: (page: Page, timeout = 10000) => {
    return page.waitForFunction(
      () => Object.keys(localStorage).length > 0,
      { timeout }
    );
  },
};

/**
 * Uppy-Specific Helpers
 */
export const UppyHelpers = {
  /**
   * Wait for Uppy dashboard to initialize
   */
  waitForUppyDashboard: (page: Page, timeout = 10000) => {
    return page.waitForFunction(
      () => document.querySelector('.uppy-Dashboard') !== null,
      { timeout }
    );
  },

  /**
   * Wait for Uppy to show files
   */
  waitForUppyFiles: (page: Page, timeout = 10000) => {
    return page.waitForFunction(
      () => document.querySelectorAll('.uppy-Dashboard-Item').length > 0,
      { timeout }
    );
  },

  /**
   * Wait for Uppy progress to start
   */
  waitForUppyProgress: (page: Page, timeout = 10000) => {
    return page.waitForFunction(() => {
      const statusBar = document.querySelector('.uppy-StatusBar-progress');
      const hasFiles = document.querySelector('.uppy-Dashboard-Item');
      return statusBar && hasFiles;
    }, { timeout });
  },

  /**
   * Wait for Uppy Golden Retriever to save state
   */
  waitForGoldenRetrieverState: (page: Page, timeout = 15000) => {
    return page.waitForFunction(() => {
      const statusBar = document.querySelector('.uppy-StatusBar-progress');
      const hasFiles = document.querySelector('.uppy-Dashboard-Item');
      return statusBar && hasFiles && Object.keys(localStorage).length > 0;
    }, { timeout });
  },

  /**
   * Wait for Uppy upload progress text
   */
  waitForUppyProgressText: (page: Page, timeout = 10000) => {
    return page.waitForFunction(() => {
      const statusBar = document.querySelector('.uppy-StatusBar-statusSecondary');
      const progressText = statusBar?.textContent || '';
      return progressText.includes('uploaded') || progressText.includes('%');
    }, { timeout });
  },
};

/**
 * Page Load State Helpers
 */
export const PageLoadHelpers = {
  /**
   * Wait for page to be fully ready after reload
   */
  waitForFullPageLoad: async (page: Page, timeout = 10000) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => document.readyState === 'complete', {
      timeout,
    });
  },

  /**
   * Wait for component to reinitialize after refresh
   */
  waitForComponentReady: (page: Page, selector: string, timeout = 10000) => {
    return page.waitForFunction(
      (sel) => document.querySelector(sel) !== null,
      selector,
      { timeout }
    );
  },

  /**
   * Wait for TUS component to be ready
   */
  waitForTUSComponentReady: (page: Page, timeout = 10000) => {
    return page.waitForFunction(
      () => document.querySelector('input[type="file"]') !== null,
      { timeout }
    );
  },
};

/**
 * Browser-Specific Conditional Waits
 */
export const BrowserConditionalWaits = {
  /**
   * Execute different waits based on browser name
   */
  conditionalWait: async (
    page: Page,
    browserName: string,
    waits: Record<string, () => Promise<any>>
  ) => {
    const wait = waits[browserName.toLowerCase()] || waits['default'];
    if (wait) {
      return wait();
    }
  },

  /**
   * Wait with browser-specific timeout adjustments
   */
  browserAdjustedWait: async (
    page: Page,
    condition: () => any,
    baseTimeout = 5000
  ) => {
    const browserInfo = await page.evaluate(() => navigator.userAgent);

    // Adjust timeout based on browser
    let adjustedTimeout = baseTimeout;
    if (browserInfo.includes('Safari')) {
      adjustedTimeout *= 1.5; // Safari can be slower
    } else if (browserInfo.includes('Firefox')) {
      adjustedTimeout *= 1.2; // Firefox slight adjustment
    }

    return page.waitForFunction(condition, { timeout: adjustedTimeout });
  },
};
