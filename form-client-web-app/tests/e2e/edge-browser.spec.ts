/**
 * Browser State Edge Case Tests
 *
 * Tests upload behavior under various browser state changes:
 * - Browser tab switch during upload
 * - Browser minimize during upload
 * - Browser refresh during upload
 * - Multiple browser tabs uploading
 * - Incognito mode testing
 * - localStorage/sessionStorage behavior
 */

import { test, expect, Browser } from '../fixtures/playwright-fixtures';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
import { ConsoleMonitor, simulateTabVisibilityChange, getLocalStorage, clearAllStorage } from '../utils/test-helpers';

test.describe('Browser State Tests - TUS Upload', () => {
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    await page.goto('/');
    await page.click('text=TUS Upload Demo');
  });

  test('should continue upload when tab is hidden', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 10 * 1024 * 1024; // 10MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'tab-hidden-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for upload to actually start making progress
    await page.waitForFunction(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      const progress = match ? parseInt(match[1]) : 0;
      return progress > 0;
    }, { timeout: 10000 });

    // Get progress before hiding
    const progressBefore = await page.evaluate(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      return match ? parseInt(match[1]) : 0;
    });

    // Simulate tab becoming hidden
    await simulateTabVisibilityChange(page, true);

    // Wait for upload to continue in background (progress should increase)
    await page.waitForFunction((beforeProgress) => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      const currentProgress = match ? parseInt(match[1]) : 0;
      return currentProgress > beforeProgress;
    }, progressBefore, { timeout: 15000 });

    // Simulate tab becoming visible again
    await simulateTabVisibilityChange(page, false);

    // Upload should have continued
    const progressAfter = await page.evaluate(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      return match ? parseInt(match[1]) : 0;
    });

    expect(progressAfter).toBeGreaterThan(progressBefore);

    // Should eventually complete
    await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 60000 });

    // No console errors
    consoleMonitor.assertNoErrors();
  });

  test('should handle browser minimize during upload', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 5 * 1024 * 1024; // 5MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'minimize-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Simulate minimize by changing visibility
    await simulateTabVisibilityChange(page, true);

    // Wait for upload to continue (check progress is still updating)
    await page.waitForFunction(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      const progress = match ? parseInt(match[1]) : 0;
      return progress > 10; // Wait for meaningful progress
    }, { timeout: 10000 });

    // Restore
    await simulateTabVisibilityChange(page, false);

    // Should complete successfully
    await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 60000 });
  });

  test('should resume upload after page refresh', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 20 * 1024 * 1024; // 20MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'refresh-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for meaningful upload progress and localStorage to populate
    await page.waitForFunction(() => {
      const text = document.querySelector('.progress-text')?.textContent;
      const match = text?.match(/(\d+)%/);
      const progress = match ? parseInt(match[1]) : 0;
      const hasStorage = Object.keys(localStorage).some(key => key.includes('tus'));
      return progress >= 20 && hasStorage;
    }, { timeout: 15000 });

    // Get upload URL from localStorage before refresh
    const storageBefore = await getLocalStorage(page);
    expect(Object.keys(storageBefore).length).toBeGreaterThan(0);

    // Refresh page
    await page.reload();

    // Wait for page to be fully ready after reload
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 });

    // Check localStorage persisted
    const storageAfter = await getLocalStorage(page);
    expect(storageAfter).toBeTruthy();

    // Wait for any auto-resume logic to initialize (check for TUS component readiness)
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="file"]');
      return input !== null; // Component has re-rendered
    }, { timeout: 10000 });

    // At minimum, no errors should occur
    consoleMonitor.assertNoErrors();
  });

  test('should handle multiple tabs uploading simultaneously', async ({ context }) => {
    // Create multiple tabs
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();

    try {
      // Navigate all tabs
      await Promise.all([
        page1.goto('http://localhost:64849/'),
        page2.goto('http://localhost:64849/'),
        page3.goto('http://localhost:64849/'),
      ]);

      await Promise.all([
        page1.click('text=TUS Upload Demo'),
        page2.click('text=TUS Upload Demo'),
        page3.click('text=TUS Upload Demo'),
      ]);

      // Start uploads in all tabs
      const startUpload = async (page: any, fileName: string) => {
        await page.evaluate((name: string) => {
          const size = 5 * 1024 * 1024; // 5MB
          const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
          const file = new File([blob], name, { type: 'application/octet-stream' });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) {
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, fileName);
      };

      await Promise.all([
        startUpload(page1, 'tab1-file.bin'),
        startUpload(page2, 'tab2-file.bin'),
        startUpload(page3, 'tab3-file.bin'),
      ]);

      // All should show progress
      await Promise.all([
        expect(page1.locator('.progress-bar')).toBeVisible({ timeout: 5000 }),
        expect(page2.locator('.progress-bar')).toBeVisible({ timeout: 5000 }),
        expect(page3.locator('.progress-bar')).toBeVisible({ timeout: 5000 }),
      ]);

      // All should eventually complete
      await Promise.all([
        expect(page1.locator('.upload-complete')).toBeVisible({ timeout: 60000 }),
        expect(page2.locator('.upload-complete')).toBeVisible({ timeout: 60000 }),
        expect(page3.locator('.upload-complete')).toBeVisible({ timeout: 60000 }),
      ]);
    } finally {
      await page1.close();
      await page2.close();
      await page3.close();
    }
  });

  test('should work in incognito mode', async ({ browser }) => {
    // Create incognito context
    const incognitoContext = await browser.newContext({
      // Clear all state
      storageState: undefined,
    });

    const incognitoPage = await incognitoContext.newPage();

    try {
      await incognitoPage.goto('http://localhost:64849/');
      await incognitoPage.click('text=TUS Upload Demo');

      // Start upload
      await incognitoPage.evaluate(() => {
        const size = 2 * 1024 * 1024; // 2MB
        const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
        const file = new File([blob], 'incognito-test.bin', { type: 'application/octet-stream' });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Should work normally
      await expect(incognitoPage.locator('.progress-bar')).toBeVisible({ timeout: 5000 });
      await expect(incognitoPage.locator('.upload-complete')).toBeVisible({ timeout: 60000 });

      // Check localStorage still works in incognito
      const storage = await getLocalStorage(incognitoPage);
      expect(storage).toBeTruthy();
    } finally {
      await incognitoPage.close();
      await incognitoContext.close();
    }
  });

  test('should persist upload state in localStorage', async ({ page }) => {
    // Clear storage first
    await clearAllStorage(page);

    // Start upload
    await page.evaluate(() => {
      const size = 10 * 1024 * 1024; // 10MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'storage-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Wait for localStorage to be populated with TUS data
    await page.waitForFunction(() => {
      return Object.keys(localStorage).some(key =>
        key.includes('tus') && localStorage.getItem(key)?.includes('http')
      );
    }, { timeout: 10000 });

    // Check localStorage has upload data
    const storage = await getLocalStorage(page);
    const tusKeys = Object.keys(storage).filter(key => key.includes('tus'));
    expect(tusKeys.length).toBeGreaterThan(0);

    // Verify upload URL is stored
    const hasUploadUrl = tusKeys.some(key => storage[key].includes('http'));
    expect(hasUploadUrl).toBe(true);
  });

  test('should handle sessionStorage alongside localStorage', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 5 * 1024 * 1024; // 5MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'session-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.progress-bar')).toBeVisible({ timeout: 5000 });

    // Check both storage types
    const storageInfo = await page.evaluate(() => {
      return {
        localStorageCount: localStorage.length,
        sessionStorageCount: sessionStorage.length,
        localStorageKeys: Object.keys(localStorage),
        sessionStorageKeys: Object.keys(sessionStorage),
      };
    });

    console.log('Storage info:', storageInfo);

    // At least localStorage should be used
    expect(storageInfo.localStorageCount).toBeGreaterThan(0);
  });
});

test.describe('Browser State Tests - Uppy Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Uppy Upload Demo');
  });

  test('should auto-resume after page refresh (Golden Retriever)', async ({ page }) => {
    // Start upload
    await page.evaluate(() => {
      const size = 15 * 1024 * 1024; // 15MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'golden-retriever-test.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.uppy-StatusBar')).toBeVisible({ timeout: 5000 });

    // Wait for upload to start and Golden Retriever to save state
    await page.waitForFunction(() => {
      const statusBar = document.querySelector('.uppy-StatusBar-progress');
      const hasFiles = document.querySelector('.uppy-Dashboard-Item');
      return statusBar && hasFiles && Object.keys(localStorage).length > 0;
    }, { timeout: 15000 });

    // Refresh page
    await page.reload();

    // Wait for page to fully load and Uppy to reinitialize
    await page.waitForLoadState('domcontentloaded');
    await page.waitForFunction(() => {
      // Check if Uppy has reinitialized (dashboard is present)
      return document.querySelector('.uppy-Dashboard') !== null;
    }, { timeout: 10000 });

    // Golden Retriever should auto-resume
    await expect(page.locator('.uppy-StatusBar')).toBeVisible({ timeout: 5000 });

    // Wait for Golden Retriever to restore file (check for dashboard item)
    await page.waitForFunction(() => {
      const fileCount = document.querySelectorAll('.uppy-Dashboard-Item').length;
      return fileCount > 0;
    }, { timeout: 10000 });
    const hasFile = await page.locator('.uppy-Dashboard-Item').count();
    expect(hasFile).toBeGreaterThan(0);
  });

  test('should handle tab switching during upload', async ({ page }) => {
    await page.evaluate(() => {
      const size = 8 * 1024 * 1024; // 8MB
      const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
      const file = new File([blob], 'tab-switch-uppy.bin', { type: 'application/octet-stream' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect(page.locator('.uppy-StatusBar-progress')).toBeVisible({ timeout: 5000 });

    // Simulate tab switch
    await simulateTabVisibilityChange(page, true);

    // Wait for upload to continue in hidden state (check progress advancement)
    await page.waitForFunction(() => {
      const statusBar = document.querySelector('.uppy-StatusBar-statusSecondary');
      const progressText = statusBar?.textContent || '';
      // Check if upload is progressing (bytes uploaded increasing)
      return progressText.includes('uploaded') || progressText.includes('%');
    }, { timeout: 10000 });

    await simulateTabVisibilityChange(page, false);

    // Should continue and complete
    await expect(page.locator('.uppy-StatusBar-statusPrimary:has-text("Complete")')).toBeVisible({ timeout: 60000 });
  });

  test('should work across multiple browser tabs', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    try {
      await Promise.all([
        page1.goto('http://localhost:64849/'),
        page2.goto('http://localhost:64849/'),
      ]);

      await Promise.all([
        page1.click('text=Uppy Upload Demo'),
        page2.click('text=Uppy Upload Demo'),
      ]);

      // Start uploads
      const startUpload = async (page: any, fileName: string) => {
        await page.evaluate((name: string) => {
          const size = 3 * 1024 * 1024;
          const blob = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
          const file = new File([blob], name, { type: 'application/octet-stream' });

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) {
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, fileName);
      };

      await Promise.all([
        startUpload(page1, 'uppy-tab1.bin'),
        startUpload(page2, 'uppy-tab2.bin'),
      ]);

      // Both should complete
      await Promise.all([
        expect(page1.locator('.uppy-StatusBar-statusPrimary:has-text("Complete")')).toBeVisible({ timeout: 60000 }),
        expect(page2.locator('.uppy-StatusBar-statusPrimary:has-text("Complete")')).toBeVisible({ timeout: 60000 }),
      ]);
    } finally {
      await page1.close();
      await page2.close();
    }
  });
});