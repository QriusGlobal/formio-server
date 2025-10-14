/**
 * Uppy Upload Page Object
 *
 * Specialized page object for Uppy file upload testing
 */


import { FileUploadPage } from './FileUploadPage';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';

import type { Page, Locator } from '@playwright/test';

export interface UppyOptions {
  autoProceed?: boolean;
  allowMultipleUploads?: boolean;
  restrictions?: {
    maxFileSize?: number;
    maxNumberOfFiles?: number;
    minNumberOfFiles?: number;
    allowedFileTypes?: string[];
  };
}

export class UppyUploadPage extends FileUploadPage {
  // Uppy-specific locators
  readonly uppyDashboard: Locator;
  readonly uppyDragDrop: Locator;
  readonly uppyStatusBar: Locator;
  readonly uppyFileCard: Locator;
  readonly uppyAddMoreButton: Locator;
  readonly uppyRemoveFileButton: Locator;
  readonly uppyUploadButton: Locator;
  readonly uppyCancelButton: Locator;

  constructor(page: Page) {
    super(page);

    // Uppy Dashboard selectors
    this.uppyDashboard = page.locator('.uppy-Dashboard');
    this.uppyDragDrop = page.locator('.uppy-Dashboard-dropFilesHereHint');
    this.uppyStatusBar = page.locator('.uppy-StatusBar');
    this.uppyFileCard = page.locator('.uppy-Dashboard-Item');
    this.uppyAddMoreButton = page.locator('.uppy-DashboardContent-addMore');
    this.uppyRemoveFileButton = page.locator('.uppy-Dashboard-Item-action--remove');
    this.uppyUploadButton = page.locator('.uppy-StatusBar-actionBtn--upload');
    this.uppyCancelButton = page.locator('.uppy-StatusBar-actionBtn--done');
  }

  /**
   * Configure Uppy options
   */
  async configureUppyOptions(options: UppyOptions): Promise<void> {
    await this.page.evaluate((opts) => {
      const uppy = (window as any).__uppy;
      if (!uppy) return;

      if (opts.autoProceed !== undefined) {
        uppy.setOptions({ autoProceed: opts.autoProceed });
      }

      if (opts.allowMultipleUploads !== undefined) {
        uppy.setOptions({ allowMultipleUploads: opts.allowMultipleUploads });
      }

      if (opts.restrictions) {
        uppy.setOptions({ restrictions: opts.restrictions });
      }
    }, options);
  }

  /**
   * Open Uppy Dashboard
   */
  async openDashboard(): Promise<void> {
    const trigger = this.page.locator('[data-testid="uppy-trigger"]');
    await trigger.click();
    await this.uppyDashboard.waitFor({ state: 'visible' });
  }

  /**
   * Close Uppy Dashboard
   */
  async closeDashboard(): Promise<void> {
    const closeButton = this.page.locator('.uppy-Dashboard-close');
    await closeButton.click();
    await this.uppyDashboard.waitFor({ state: 'hidden' });
  }

  /**
   * Upload file via Uppy Dashboard
   */
  async uploadFileWithUppy(filePath: string, options?: UppyOptions): Promise<void> {
    if (options) {
      await this.configureUppyOptions(options);
    }

    await this.openDashboard();

    // Add file
    const fileInput = this.uppyDashboard.locator(UPPY_FILE_INPUT_SELECTOR);
    await fileInput.setInputFiles(filePath);

    // Wait for file to be added
    await this.uppyFileCard.first().waitFor({ state: 'visible' });

    // Click upload if not auto-proceed
    if (!options?.autoProceed) {
      await this.uppyUploadButton.click();
    }

    // Wait for upload to complete
    await this.waitForUploadComplete();
  }

  /**
   * Upload multiple files via Uppy
   */
  async uploadMultipleFilesWithUppy(filePaths: string[]): Promise<void> {
    await this.openDashboard();

    const fileInput = this.uppyDashboard.locator(UPPY_FILE_INPUT_SELECTOR);

    for (const filePath of filePaths) {
      await fileInput.setInputFiles(filePath);
      await this.page.waitForTimeout(500); // Wait between additions
    }

    // Wait for all files to be added
    await this.page.waitForFunction(
      (expectedCount) => {
        const uppy = (window as any).__uppy;
        return uppy && Object.keys(uppy.getFiles()).length === expectedCount;
      },
      filePaths.length
    );

    // Click upload
    await this.uppyUploadButton.click();

    // Wait for all uploads to complete
    await this.waitForUploadComplete();
  }

  /**
   * Drag and drop file to Uppy
   */
  async dragAndDropToUppy(filePath: string): Promise<void> {
    await this.openDashboard();

    // Use the helper from formio-helpers
    const { dragAndDropFile } = require('../utils/formio-helpers');
    await dragAndDropFile(this.page, '.uppy-Dashboard-dropFilesHereHint', filePath);

    // Wait for file to be added
    await this.uppyFileCard.first().waitFor({ state: 'visible' });

    // Click upload
    await this.uppyUploadButton.click();

    await this.waitForUploadComplete();
  }

  /**
   * Remove file from Uppy queue
   */
  async removeFileFromQueue(filename: string): Promise<void> {
    const fileCard = this.page.locator(`.uppy-Dashboard-Item:has-text("${filename}")`);
    const removeButton = fileCard.locator('.uppy-Dashboard-Item-action--remove');
    await removeButton.click();
  }

  /**
   * Get Uppy file list
   */
  async getUppyFiles(): Promise<string[]> {
    await this.uppyFileCard.first().waitFor({ state: 'visible', timeout: 5000 });

    const count = await this.uppyFileCard.count();
    const files: string[] = [];

    for (let i = 0; i < count; i++) {
      const filename = await this.uppyFileCard.nth(i).locator('.uppy-Dashboard-Item-name').textContent();
      if (filename) files.push(filename.trim());
    }

    return files;
  }

  /**
   * Get Uppy upload progress
   */
  async getUppyProgress(): Promise<number> {
    return await this.page.evaluate(() => {
      const uppy = (window as any).__uppy;
      if (!uppy) return 0;

      const state = uppy.getState();
      return state.totalProgress || 0;
    });
  }

  /**
   * Check if Uppy shows error
   */
  async hasUppyError(): Promise<boolean> {
    const errorElement = this.page.locator('.uppy-Dashboard-Item--error');
    return await errorElement.isVisible();
  }

  /**
   * Get Uppy error message
   */
  async getUppyErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator('.uppy-Dashboard-Item-errorMessage');

    try {
      await errorElement.waitFor({ state: 'visible', timeout: 5000 });
      return await errorElement.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Retry failed Uppy upload
   */
  async retryUppyUpload(filename: string): Promise<void> {
    const fileCard = this.page.locator(`.uppy-Dashboard-Item:has-text("${filename}")`);
    const retryButton = fileCard.locator('.uppy-Dashboard-Item-action--retry');
    await retryButton.click();
  }

  /**
   * Pause Uppy upload
   */
  async pauseUppyUpload(): Promise<void> {
    const pauseButton = this.page.locator('.uppy-StatusBar-actionBtn--pause');
    await pauseButton.click();
  }

  /**
   * Resume Uppy upload
   */
  async resumeUppyUpload(): Promise<void> {
    const resumeButton = this.page.locator('.uppy-StatusBar-actionBtn--resume');
    await resumeButton.click();
  }

  /**
   * Cancel all Uppy uploads
   */
  async cancelAllUppyUploads(): Promise<void> {
    await this.uppyCancelButton.click();

    await this.page.evaluate(() => {
      const uppy = (window as any).__uppy;
      if (uppy) {
        uppy.cancelAll();
      }
    });
  }

  /**
   * Get Uppy state
   */
  async getUppyState(): Promise<any> {
    return await this.page.evaluate(() => {
      const uppy = (window as any).__uppy;
      return uppy ? uppy.getState() : null;
    });
  }

  /**
   * Get Uppy files info
   */
  async getUppyFilesInfo(): Promise<Array<{
    name: string;
    size: number;
    type: string;
    progress: number;
  }>> {
    return await this.page.evaluate(() => {
      const uppy = (window as any).__uppy;
      if (!uppy) return [];

      const files = uppy.getFiles();
      return files.map((file: any) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        progress: file.progress?.percentage || 0
      }));
    });
  }

  /**
   * Test file restrictions
   */
  async testFileRestrictions(restrictions: UppyOptions['restrictions']): Promise<{
    accepted: boolean;
    errorMessage?: string;
  }> {
    await this.configureUppyOptions({ restrictions });

    await this.openDashboard();

    // Try to add a file that violates restrictions
    const fileInput = this.uppyDashboard.locator(UPPY_FILE_INPUT_SELECTOR);

    // This will need to be customized based on actual file being tested
    const errorVisible = await this.hasUppyError();

    if (errorVisible) {
      const message = await this.getUppyErrorMessage();
      return { accepted: false, errorMessage: message || undefined };
    }

    return { accepted: true };
  }

  /**
   * Clear Uppy state
   */
  async clearUppyState(): Promise<void> {
    await this.page.evaluate(() => {
      const uppy = (window as any).__uppy;
      if (uppy) {
        uppy.reset();
      }
    });
  }
}