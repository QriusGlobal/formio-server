/**
 * TUS Upload Page Object
 *
 * Specialized page object for TUS resumable upload testing
 */

import { FileUploadPage } from './FileUploadPage';

import type { Page, Locator } from '@playwright/test';


export interface TusUploadOptions {
  chunkSize?: number;
  retryDelays?: number[];
  parallelUploads?: number;
  removeFingerprintOnSuccess?: boolean;
}

export class TusUploadPage extends FileUploadPage {
  // TUS-specific locators
  readonly chunkSizeInput: Locator;
  readonly parallelUploadsInput: Locator;
  readonly resumeButton: Locator;
  readonly pauseButton: Locator;
  readonly uploadDetails: Locator;

  constructor(page: Page) {
    super(page);

    // TUS-specific selectors
    this.chunkSizeInput = page.locator('[data-testid="tus-chunk-size"]');
    this.parallelUploadsInput = page.locator('[data-testid="tus-parallel-uploads"]');
    this.resumeButton = page.locator('[data-testid="tus-resume"]');
    this.pauseButton = page.locator('[data-testid="tus-pause"]');
    this.uploadDetails = page.locator('[data-testid="tus-details"]');
  }

  /**
   * Configure TUS upload options
   */
  async configureTusOptions(options: TusUploadOptions): Promise<void> {
    if (options.chunkSize) {
      await this.chunkSizeInput.fill(options.chunkSize.toString());
    }

    if (options.parallelUploads) {
      await this.parallelUploadsInput.fill(options.parallelUploads.toString());
    }

    // Store options in page context for TUS client
    await this.page.evaluate((opts) => {
      (window as any).__tusOptions = opts;
    }, options);
  }

  /**
   * Upload file with TUS protocol
   */
  async uploadFileWithTus(filePath: string, options?: TusUploadOptions): Promise<void> {
    if (options) {
      await this.configureTusOptions(options);
    }

    // Wait for Form.io to render the form
    await this.page.waitForSelector('.formio-form', {
      state: 'visible',
      timeout: 15000
    });

    // Wait for file input specifically (from parent class)
    await this.uploadInput.waitFor({
      state: 'visible',
      timeout: 10000
    });

    await this.uploadFile(filePath);
  }

  /**
   * Pause TUS upload
   */
  async pauseUpload(): Promise<void> {
    await this.pauseButton.click();

    // Wait for pause to be registered
    await this.page.waitForFunction(() => {
      const tus = (window as any).__tusUpload;
      return tus?.paused === true;
    });
  }

  /**
   * Resume paused TUS upload
   */
  async resumeUpload(): Promise<void> {
    await this.resumeButton.click();

    // Wait for resume to be registered
    await this.page.waitForFunction(() => {
      const tus = (window as any).__tusUpload;
      return tus?.paused === false;
    });
  }

  /**
   * Simulate network interruption
   */
  async simulateNetworkInterruption(durationMs = 5000): Promise<void> {
    // Go offline
    await this.page.context().setOffline(true);

    // Wait for network state to propagate
    await this.page.waitForFunction(() => !navigator.onLine, { timeout: 3000 }).catch(() => {});

    // Wait for specified duration
    await this.page.waitForTimeout(durationMs);

    // Go back online
    await this.page.context().setOffline(false);

    // Wait for network to come back online
    await this.page.waitForFunction(() => navigator.onLine, { timeout: 3000 }).catch(() => {});
  }

  /**
   * Get TUS upload URL
   */
  async getTusUploadUrl(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const tus = (window as any).__tusUpload;
      return tus ? tus.url : null;
    });
  }

  /**
   * Get TUS upload fingerprint
   */
  async getTusFingerprint(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const tus = (window as any).__tusUpload;
      if (!tus?.options?.fingerprint) return null;

      return tus.options.fingerprint(tus.file, tus.options);
    });
  }

  /**
   * Get number of chunks uploaded
   */
  async getChunksUploaded(): Promise<number> {
    return await this.page.evaluate(() => {
      const tus = (window as any).__tusUpload;
      if (!tus) return 0;

      const bytesUploaded = tus.offset || 0;
      const chunkSize = tus.options.chunkSize || 1024 * 1024;

      return Math.floor(bytesUploaded / chunkSize);
    });
  }

  /**
   * Get bytes uploaded
   */
  async getBytesUploaded(): Promise<number> {
    return await this.page.evaluate(() => {
      const tus = (window as any).__tusUpload;
      return tus ? tus.offset || 0 : 0;
    });
  }

  /**
   * Wait for TUS initialization
   */
  async waitForTusInit(): Promise<void> {
    await this.page.waitForFunction(() => {
      return (window as any).__tusUpload !== undefined;
    }, { timeout: 10000 });
  }

  /**
   * Test resume capability
   */
  async testResumability(filePath: string): Promise<boolean> {
    // Start upload
    await this.uploadFileWithTus(filePath);

    // Wait for upload to start and progress (some chunks uploaded)
    await this.page.waitForFunction(() => {
      const tus = (window as any).__tusUpload;
      return tus && (tus.offset || 0) > 0;
    }, { timeout: 5000 });

    // Get current progress
    const bytesBeforePause =  this.getBytesUploaded();

    // Pause upload
    await this.pauseUpload();

    // Simulate network interruption
    await this.simulateNetworkInterruption(3000);

    // Resume upload
    await this.resumeUpload();

    // Wait for upload to complete
    await this.waitForUploadComplete();

    // Verify upload resumed from pause point
    const success = await this.isUploadSuccessful();
    return success && bytesBeforePause > 0;
  }

  /**
   * Get TUS upload statistics
   */
  async getUploadStats(): Promise<{
    totalBytes: number;
    uploadedBytes: number;
    chunkSize: number;
    chunksUploaded: number;
    totalChunks: number;
    percentage: number;
  }> {
    return await this.page.evaluate(() => {
      const tus = (window as any).__tusUpload;
      if (!tus) {
        return {
          totalBytes: 0,
          uploadedBytes: 0,
          chunkSize: 0,
          chunksUploaded: 0,
          totalChunks: 0,
          percentage: 0
        };
      }

      const totalBytes = tus.file.size;
      const uploadedBytes = tus.offset || 0;
      const chunkSize = tus.options.chunkSize || 1024 * 1024;
      const chunksUploaded = Math.floor(uploadedBytes / chunkSize);
      const totalChunks = Math.ceil(totalBytes / chunkSize);
      const percentage = (uploadedBytes / totalBytes) * 100;

      return {
        totalBytes,
        uploadedBytes,
        chunkSize,
        chunksUploaded,
        totalChunks,
        percentage
      };
    });
  }

  /**
   * Clear TUS storage (fingerprints)
   */
  async clearTusStorage(): Promise<void> {
    await this.page.evaluate(() => {
      // Clear localStorage
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('tus::')) {
          localStorage.removeItem(key);
        }
      }

      // Clear IndexedDB if used
      if (window.indexedDB) {
        window.indexedDB.databases().then(databases => {
          for (const db of databases) {
            if (db.name?.startsWith('tus')) {
              window.indexedDB.deleteDatabase(db.name);
            }
          }
        });
      }
    });
  }
}