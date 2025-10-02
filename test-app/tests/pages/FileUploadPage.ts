/**
 * Base Page Object for File Upload Testing
 *
 * Provides common functionality for all upload implementations
 */

import { Page, Locator, expect } from '@playwright/test';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
import { FormioEventMonitor, FormioComponentHelper } from '../utils/formio-helpers';

export class FileUploadPage {
  readonly page: Page;
  readonly eventMonitor: FormioEventMonitor;
  readonly componentHelper: FormioComponentHelper;

  // Common locators
  readonly uploadButton: Locator;
  readonly uploadInput: Locator;
  readonly progressBar: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly fileList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventMonitor = new FormioEventMonitor(page);
    this.componentHelper = new FormioComponentHelper(page);

    // Common selectors
    this.uploadButton = page.locator('[data-testid="upload-button"]');
    this.uploadInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
    this.progressBar = page.locator('[data-testid="upload-progress"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.fileList = page.locator('[data-testid="file-list"]');
  }

  /**
   * Navigate to upload page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.componentHelper.waitForFormReady();
  }

  /**
   * Upload file using input
   */
  async uploadFile(filePath: string): Promise<void> {
    await this.uploadInput.setInputFiles(filePath);
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(filePaths: string[]): Promise<void> {
    await this.uploadInput.setInputFiles(filePaths);
  }

  /**
   * Wait for upload to complete
   */
  async waitForUploadComplete(timeoutMs = 60000): Promise<void> {
    await this.eventMonitor.waitForEvent('fileUpload.complete', timeoutMs);
  }

  /**
   * Get upload progress
   */
  async getUploadProgress(): Promise<number> {
    const progressEvents = await this.eventMonitor.monitorUploadProgress();
    if (progressEvents.length === 0) return 0;

    const latest = progressEvents[progressEvents.length - 1];
    return latest.percentage;
  }

  /**
   * Check if upload succeeded
   */
  async isUploadSuccessful(): Promise<boolean> {
    try {
      await expect(this.successMessage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message if upload failed
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Get list of uploaded files
   */
  async getUploadedFiles(): Promise<string[]> {
    await this.fileList.waitFor({ state: 'visible', timeout: 5000 });
    const fileItems = this.fileList.locator('[data-testid="file-item"]');
    const count = await fileItems.count();

    const files: string[] = [];
    for (let i = 0; i < count; i++) {
      const filename = await fileItems.nth(i).textContent();
      if (filename) files.push(filename.trim());
    }

    return files;
  }

  /**
   * Remove uploaded file
   */
  async removeFile(filename: string): Promise<void> {
    const fileItem = this.page.locator(`[data-testid="file-item"]:has-text("${filename}")`);
    const removeButton = fileItem.locator('[data-testid="remove-file"]');
    await removeButton.click();
  }

  /**
   * Download uploaded file
   */
  async downloadFile(filename: string): Promise<Buffer> {
    const fileItem = this.page.locator(`[data-testid="file-item"]:has-text("${filename}")`);
    const downloadButton = fileItem.locator('[data-testid="download-file"]');

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      downloadButton.click()
    ]);

    const path = await download.path();
    if (!path) throw new Error('Download failed');

    const fs = require('fs');
    return fs.readFileSync(path);
  }

  /**
   * Cancel upload in progress
   */
  async cancelUpload(): Promise<void> {
    const cancelButton = this.page.locator('[data-testid="cancel-upload"]');
    await cancelButton.click();
  }

  /**
   * Retry failed upload
   */
  async retryUpload(): Promise<void> {
    const retryButton = this.page.locator('[data-testid="retry-upload"]');
    await retryButton.click();
  }

  /**
   * Clear all uploads
   */
  async clearAllUploads(): Promise<void> {
    const clearButton = this.page.locator('[data-testid="clear-all"]');
    await clearButton.click();
  }

  /**
   * Get form component value
   */
  async getComponentValue(key: string): Promise<any> {
    return await this.componentHelper.getComponentValue(key);
  }

  /**
   * Set form component value
   */
  async setComponentValue(key: string, value: any): Promise<void> {
    await this.componentHelper.setComponentValue(key, value);
  }

  /**
   * Submit form
   */
  async submitForm(): Promise<void> {
    await this.componentHelper.submitForm();
  }

  /**
   * Get form data
   */
  async getFormData(): Promise<Record<string, any>> {
    return await this.componentHelper.getFormData();
  }

  /**
   * Check for form errors
   */
  async hasFormErrors(): Promise<boolean> {
    const errors = await this.componentHelper.getFormErrors();
    return Object.keys(errors).length > 0;
  }

  /**
   * Get form errors
   */
  async getFormErrors(): Promise<Record<string, string[]>> {
    return await this.componentHelper.getFormErrors();
  }

  /**
   * Wait for page to be ready
   */
  async waitForReady(): Promise<void> {
    await this.componentHelper.waitForFormReady();
    await this.eventMonitor.startMonitoring();
  }

  /**
   * Take screenshot
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}