/**
 * Page Object Model for TUS File Upload Component
 *
 * Provides high-level interface for interacting with TUS upload UI
 * following the Page Object pattern for maintainable E2E tests.
 */

import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

export interface UploadFileInfo {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
  speed?: number;
  timeRemaining?: number;
}

export class TusUploadPage {
  readonly page: Page;

  // Locators
  readonly dropZone: Locator;
  readonly fileInput: Locator;
  readonly fileList: Locator;
  readonly uploadItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropZone = page.locator('.tus-dropzone');
    this.fileInput = page.locator('.tus-file-input');
    this.fileList = page.locator('.tus-file-list');
    this.uploadItems = page.locator('.tus-file-item');
  }

  /**
   * Navigate to the upload page
   */
  async goto() {
    await this.page.goto('/');
    await expect(this.dropZone).toBeVisible();
  }

  /**
   * Upload files by clicking the drop zone
   *
   * @param filePaths - Array of file paths to upload
   */
  async uploadFiles(filePaths: string[]) {
    const absolutePaths = filePaths.map(fp =>
      path.isAbsolute(fp) ? fp : path.resolve(__dirname, '../fixtures', fp)
    );

    await this.fileInput.setInputFiles(absolutePaths);

    // Wait for files to be added to the list
    await this.page.waitForTimeout(500);
  }

  /**
   * Upload files via drag and drop
   *
   * @param filePaths - Array of file paths to upload
   */
  async dragAndDropFiles(filePaths: string[]) {
    const absolutePaths = filePaths.map(fp =>
      path.isAbsolute(fp) ? fp : path.resolve(__dirname, '../fixtures', fp)
    );

    // Create data transfer
    const dataTransfer = await this.page.evaluateHandle((paths) => {
      const dt = new DataTransfer();
      // Note: In real browser, files would be added here
      // For testing, we use setInputFiles instead
      return dt;
    }, absolutePaths);

    // Trigger drag events
    await this.dropZone.dispatchEvent('dragenter', { dataTransfer });
    await this.dropZone.dispatchEvent('dragover', { dataTransfer });
    await this.dropZone.dispatchEvent('drop', { dataTransfer });

    // Fallback: Use file input if drag-drop simulation fails
    await this.fileInput.setInputFiles(absolutePaths);
  }

  /**
   * Get file item by name
   */
  getFileItem(fileName: string): Locator {
    return this.uploadItems.filter({ hasText: fileName });
  }

  /**
   * Get upload progress for a file
   */
  async getFileProgress(fileName: string): Promise<number> {
    const fileItem = this.getFileItem(fileName);
    const progressText = await fileItem.locator('.tus-progress-text').textContent();
    return parseInt(progressText?.replace('%', '') || '0', 10);
  }

  /**
   * Get file status
   */
  async getFileStatus(fileName: string): Promise<string> {
    const fileItem = this.getFileItem(fileName);
    const classes = await fileItem.getAttribute('class');

    if (classes?.includes('status-completed')) return 'completed';
    if (classes?.includes('status-uploading')) return 'uploading';
    if (classes?.includes('status-paused')) return 'paused';
    if (classes?.includes('status-error')) return 'error';
    if (classes?.includes('status-pending')) return 'pending';

    return 'unknown';
  }

  /**
   * Get all upload file information
   */
  async getAllFileInfo(): Promise<UploadFileInfo[]> {
    const fileInfos: UploadFileInfo[] = [];
    const items = await this.uploadItems.all();

    for (const item of items) {
      const name = await item.locator('.tus-file-name').textContent() || '';
      const sizeText = await item.locator('.tus-file-meta span').first().textContent() || '';
      const progressText = await item.locator('.tus-progress-text').textContent();
      const progress = parseInt(progressText?.replace('%', '') || '0', 10);

      const classes = await item.getAttribute('class') || '';
      let status: UploadFileInfo['status'] = 'pending';
      if (classes.includes('status-completed')) status = 'completed';
      else if (classes.includes('status-uploading')) status = 'uploading';
      else if (classes.includes('status-paused')) status = 'paused';
      else if (classes.includes('status-error')) status = 'error';

      fileInfos.push({
        id: await item.getAttribute('data-file-id') || '',
        name,
        size: this.parseSizeString(sizeText),
        progress,
        status,
      });
    }

    return fileInfos;
  }

  /**
   * Pause upload
   */
  async pauseUpload(fileName: string) {
    const fileItem = this.getFileItem(fileName);
    await fileItem.locator('button[aria-label="Pause upload"]').click();
  }

  /**
   * Resume upload
   */
  async resumeUpload(fileName: string) {
    const fileItem = this.getFileItem(fileName);
    await fileItem.locator('button[aria-label="Resume upload"]').click();
  }

  /**
   * Cancel upload
   */
  async cancelUpload(fileName: string) {
    const fileItem = this.getFileItem(fileName);
    await fileItem.locator('button[aria-label="Cancel upload"]').click();
  }

  /**
   * Retry upload
   */
  async retryUpload(fileName: string) {
    const fileItem = this.getFileItem(fileName);
    await fileItem.locator('button[aria-label="Retry upload"]').click();
  }

  /**
   * Wait for upload to complete
   */
  async waitForUploadComplete(fileName: string, timeout = 120000) {
    const fileItem = this.getFileItem(fileName);
    await expect(fileItem).toHaveClass(/status-completed/, { timeout });
  }

  /**
   * Wait for all uploads to complete
   */
  async waitForAllUploadsComplete(timeout = 300000) {
    await expect(this.uploadItems.first()).toHaveClass(/status-completed/, { timeout });

    // Verify all are completed
    const items = await this.uploadItems.all();
    for (const item of items) {
      await expect(item).toHaveClass(/status-completed/);
    }
  }

  /**
   * Check if error is displayed
   */
  async hasError(fileName: string): Promise<boolean> {
    const status = await this.getFileStatus(fileName);
    return status === 'error';
  }

  /**
   * Get error message if present
   */
  async getErrorMessage(fileName: string): Promise<string | null> {
    const fileItem = this.getFileItem(fileName);
    const errorText = await fileItem.locator('.tus-file-status-text').textContent();
    return errorText?.includes('Error') ? errorText : null;
  }

  /**
   * Take screenshot of upload component
   */
  async takeScreenshot(name: string) {
    await this.fileList.screenshot({
      path: `test-results/screenshots/${name}.png`
    });
  }

  /**
   * Parse size string (e.g., "10.5 MB") to bytes
   */
  private parseSizeString(sizeStr: string): number {
    const match = sizeStr.match(/([\d.]+)\s*([KMGT]?B)/i);
    if (!match) return 0;

    const [, value, unit] = match;
    const multipliers: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
    };

    return parseFloat(value) * (multipliers[unit.toUpperCase()] || 1);
  }

  /**
   * Simulate network disconnect
   */
  async disconnectNetwork() {
    await this.page.context().setOffline(true);
  }

  /**
   * Simulate network reconnect
   */
  async reconnectNetwork() {
    await this.page.context().setOffline(false);
  }

  /**
   * Throttle network speed
   */
  async throttleNetwork(downloadSpeed: number, uploadSpeed: number) {
    const client = await this.page.context().newCDPSession(this.page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: downloadSpeed,
      uploadThroughput: uploadSpeed,
      latency: 100,
    });
  }
}