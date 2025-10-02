/**
 * Page Object Model for TUS File Upload Component
 *
 * Encapsulates TUS upload component interactions
 */

import { Page, Locator, expect } from '@playwright/test';

export class TusUploadComponent {
  readonly page: Page;
  readonly component: Locator;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly pauseButton: Locator;
  readonly resumeButton: Locator;
  readonly cancelButton: Locator;
  readonly progressBar: Locator;
  readonly progressText: Locator;
  readonly fileList: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, componentKey: string = 'resume') {
    this.page = page;
    this.component = page.locator(`[data-key="${componentKey}"]`);
    this.fileInput = this.component.locator('input[type="file"]');
    this.uploadButton = this.component.locator('.btn-upload, [data-action="upload"]');
    this.pauseButton = this.component.locator('.btn-pause, [data-action="pause"]');
    this.resumeButton = this.component.locator('.btn-resume, [data-action="resume"]');
    this.cancelButton = this.component.locator('.btn-cancel, [data-action="cancel"]');
    this.progressBar = this.component.locator('.progress-bar, [role="progressbar"]');
    this.progressText = this.component.locator('.progress-text, .upload-progress');
    this.fileList = this.component.locator('.file-list, .uploaded-files');
    this.errorMessage = this.component.locator('.alert-danger, .error-message');
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);

    // Auto-upload might be enabled, wait for it to start
    await this.waitForUploadStart();
  }

  async uploadMultipleFiles(filePaths: string[]): Promise<void> {
    await this.fileInput.setInputFiles(filePaths);
    await this.waitForUploadStart();
  }

  async waitForUploadStart(timeout: number = 5000): Promise<void> {
    try {
      await this.progressBar.waitFor({ state: 'visible', timeout });
    } catch {
      // Manual upload might be required
      if (await this.uploadButton.isVisible()) {
        await this.uploadButton.click();
        await this.progressBar.waitFor({ state: 'visible', timeout });
      }
    }
  }

  async pauseUpload(): Promise<void> {
    await this.pauseButton.waitFor({ state: 'visible' });
    await this.pauseButton.click();

    // Verify upload is paused
    await expect(this.resumeButton).toBeVisible();
  }

  async resumeUpload(): Promise<void> {
    await this.resumeButton.waitFor({ state: 'visible' });
    await this.resumeButton.click();

    // Verify upload resumed
    await expect(this.pauseButton).toBeVisible();
  }

  async cancelUpload(): Promise<void> {
    await this.cancelButton.click();

    // Wait for upload to be cancelled
    await this.progressBar.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getProgress(): Promise<number> {
    // Try to get from aria-valuenow attribute
    const ariaValue = await this.progressBar.getAttribute('aria-valuenow');
    if (ariaValue) {
      return parseFloat(ariaValue);
    }

    // Try to get from style width
    const style = await this.progressBar.getAttribute('style');
    if (style) {
      const match = style.match(/width:\s*(\d+(?:\.\d+)?)/);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    // Try to get from text content
    const text = await this.progressText.textContent();
    if (text) {
      const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    return 0;
  }

  async waitForUploadComplete(timeout: number = 60000): Promise<void> {
    // Wait for 100% progress or success indicator
    await this.page.waitForFunction(
      async () => {
        const component = document.querySelector(`[data-key="${this.componentKey}"]`);
        if (!component) return false;

        // Check for success indicator
        const success = component.querySelector('.upload-success, .file-uploaded');
        if (success) return true;

        // Check for 100% progress
        const progressBar = component.querySelector('.progress-bar, [role="progressbar"]') as HTMLElement;
        if (progressBar) {
          const ariaValue = progressBar.getAttribute('aria-valuenow');
          if (ariaValue && parseFloat(ariaValue) >= 100) return true;

          const style = progressBar.style.width;
          if (style && parseFloat(style) >= 100) return true;
        }

        return false;
      },
      { timeout }
    );

    // Additional wait for any post-processing
    await this.page.waitForTimeout(500);
  }

  async getUploadedFiles(): Promise<Array<{
    name: string;
    size: string;
    url?: string;
    id?: string;
  }>> {
    const fileItems = this.fileList.locator('.file-item, .uploaded-file');
    const count = await fileItems.count();

    const files = [];
    for (let i = 0; i < count; i++) {
      const item = fileItems.nth(i);
      const name = await item.locator('.file-name').textContent() || '';
      const size = await item.locator('.file-size').textContent() || '';
      const url = await item.locator('.file-url').getAttribute('href').catch(() => undefined);
      const id = await item.getAttribute('data-file-id').catch(() => undefined);

      files.push({
        name: name.trim(),
        size: size.trim(),
        url,
        id
      });
    }

    return files;
  }

  async getChunkInfo(): Promise<{
    chunkSize: number;
    totalChunks: number;
    uploadedChunks: number;
  }> {
    // Extract chunk information from the component or network
    const chunkInfo = await this.page.evaluate(() => {
      const tusUpload = (window as any).activeTusUpload;
      if (!tusUpload) {
        return { chunkSize: 0, totalChunks: 0, uploadedChunks: 0 };
      }

      const chunkSize = tusUpload.options?.chunkSize || 8388608; // 8MB default
      const fileSize = tusUpload.file?.size || 0;
      const offset = tusUpload.offset || 0;

      return {
        chunkSize,
        totalChunks: Math.ceil(fileSize / chunkSize),
        uploadedChunks: Math.ceil(offset / chunkSize)
      };
    });

    return chunkInfo;
  }

  async simulateNetworkInterruption(): Promise<void> {
    // Set offline mode
    await this.page.context().setOffline(true);

    // Wait a moment
    await this.page.waitForTimeout(2000);

    // Restore connection
    await this.page.context().setOffline(false);
  }

  async verifyResumable(): Promise<boolean> {
    // After interruption, check if resume button appears
    await this.simulateNetworkInterruption();

    // Check if resume is available
    const resumeVisible = await this.resumeButton.isVisible().catch(() => false);

    if (resumeVisible) {
      // Try to resume
      await this.resumeUpload();
      const progress = await this.getProgress();
      return progress > 0;
    }

    return false;
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string | null> {
    if (await this.hasError()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  async clearFiles(): Promise<void> {
    const removeButtons = this.component.locator('.file-remove, .remove-file');
    const count = await removeButtons.count();

    for (let i = count - 1; i >= 0; i--) {
      await removeButtons.nth(i).click();
      await this.page.waitForTimeout(200);
    }
  }

  async getFileValidationError(): Promise<string | null> {
    const validation = this.component.locator('.help-block.error, .invalid-feedback');
    if (await validation.isVisible()) {
      return await validation.textContent();
    }
    return null;
  }

  async isUploadDisabled(): Promise<boolean> {
    if (await this.uploadButton.isVisible()) {
      return await this.uploadButton.isDisabled();
    }
    return false;
  }

  get componentKey(): string {
    return this.component.getAttribute('data-key') as unknown as string;
  }

  async getTusHeaders(): Promise<Record<string, string>> {
    // Intercept and return TUS headers from requests
    const headers: Record<string, string> = {};

    this.page.on('request', (request) => {
      if (request.url().includes('/files') && request.method() === 'POST') {
        const reqHeaders = request.headers();
        Object.keys(reqHeaders).forEach(key => {
          if (key.toLowerCase().startsWith('tus-')) {
            headers[key] = reqHeaders[key];
          }
        });
      }
    });

    // Wait a moment for requests to be captured
    await this.page.waitForTimeout(1000);

    return headers;
  }

  async getUploadMetadata(): Promise<any> {
    return await this.page.evaluate(() => {
      const component = document.querySelector(`[data-key]`) as any;
      if (component?._component) {
        return component._component.getValue();
      }
      return null;
    });
  }
}