/**
 * Page Object Model for Uppy Dashboard Component
 *
 * Encapsulates Uppy Dashboard interactions and plugin management
 */

import { Page, Locator, expect } from '@playwright/test';

export class UppyDashboard {
  readonly page: Page;
  readonly component: Locator;
  readonly dashboard: Locator;
  readonly browseButton: Locator;
  readonly dropzone: Locator;
  readonly fileList: Locator;
  readonly statusBar: Locator;
  readonly uploadButton: Locator;
  readonly pauseResumeButton: Locator;
  readonly cancelButton: Locator;
  readonly doneButton: Locator;
  readonly pluginTabs: Locator;

  // Plugin locators
  readonly webcamPlugin: Locator;
  readonly screenCapturePlugin: Locator;
  readonly imageEditorPlugin: Locator;
  readonly audioPlugin: Locator;
  readonly urlPlugin: Locator;

  constructor(page: Page, componentKey: string = 'portfolio') {
    this.page = page;
    this.component = page.locator(`[data-key="${componentKey}"]`);
    this.dashboard = page.locator('.uppy-Dashboard');
    this.browseButton = this.dashboard.locator('.uppy-Dashboard-browse');
    this.dropzone = this.dashboard.locator('.uppy-Dashboard-dropzone');
    this.fileList = this.dashboard.locator('.uppy-Dashboard-files');
    this.statusBar = this.dashboard.locator('.uppy-StatusBar');
    this.uploadButton = this.statusBar.locator('.uppy-StatusBar-actionBtn--upload');
    this.pauseResumeButton = this.statusBar.locator('.uppy-StatusBar-actionBtn--pause, .uppy-StatusBar-actionBtn--resume');
    this.cancelButton = this.statusBar.locator('.uppy-StatusBar-actionBtn--cancel');
    this.doneButton = this.statusBar.locator('.uppy-StatusBar-actionBtn--done');
    this.pluginTabs = this.dashboard.locator('.uppy-DashboardTab');

    // Initialize plugin locators
    this.webcamPlugin = this.dashboard.locator('[aria-label="Webcam"], [data-plugin="Webcam"]');
    this.screenCapturePlugin = this.dashboard.locator('[aria-label="Screen Capture"], [data-plugin="ScreenCapture"]');
    this.imageEditorPlugin = this.dashboard.locator('[aria-label="Image Editor"], [data-plugin="ImageEditor"]');
    this.audioPlugin = this.dashboard.locator('[aria-label="Audio"], [data-plugin="Audio"]');
    this.urlPlugin = this.dashboard.locator('[aria-label="Link"], [data-plugin="Url"]');
  }

  async open(): Promise<void> {
    // Click on the component to open dashboard
    await this.component.click();

    // Wait for dashboard to be visible
    await this.dashboard.waitFor({ state: 'visible', timeout: 5000 });
  }

  async close(): Promise<void> {
    // Click done or close button
    if (await this.doneButton.isVisible()) {
      await this.doneButton.click();
    } else {
      // Click outside or ESC key
      await this.page.keyboard.press('Escape');
    }

    await this.dashboard.waitFor({ state: 'hidden' });
  }

  async isOpen(): Promise<boolean> {
    return await this.dashboard.isVisible();
  }

  async browseFiles(filePaths: string | string[]): Promise<void> {
    const files = Array.isArray(filePaths) ? filePaths : [filePaths];
    const fileInput = this.dashboard.locator('input[type="file"]');
    await fileInput.setInputFiles(files);
  }

  async dragAndDropFiles(filePaths: string[]): Promise<void> {
    // Create data transfer with files
    await this.page.evaluate(async (paths) => {
      const dt = new DataTransfer();

      for (const path of paths) {
        const response = await fetch(path);
        const blob = await response.blob();
        const fileName = path.split('/').pop() || 'file';
        const file = new File([blob], fileName, { type: blob.type });
        dt.items.add(file);
      }

      const dropzone = document.querySelector('.uppy-Dashboard-dropzone') as HTMLElement;
      if (!dropzone) throw new Error('Dropzone not found');

      const dropEvent = new DragEvent('drop', {
        dataTransfer: dt,
        bubbles: true,
        cancelable: true
      });

      dropzone.dispatchEvent(new DragEvent('dragenter', { bubbles: true }));
      dropzone.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
      dropzone.dispatchEvent(dropEvent);
    }, filePaths);
  }

  async getFileCount(): Promise<number> {
    const files = this.fileList.locator('.uppy-Dashboard-file');
    return await files.count();
  }

  async getFileNames(): Promise<string[]> {
    const files = this.fileList.locator('.uppy-Dashboard-fileName');
    return await files.allTextContents();
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.fileList.locator(`.uppy-Dashboard-file:has-text("${fileName}")`);
    const removeButton = file.locator('.uppy-Dashboard-file-remove');
    await removeButton.click();
  }

  async removeAllFiles(): Promise<void> {
    const removeButtons = this.fileList.locator('.uppy-Dashboard-file-remove');
    const count = await removeButtons.count();

    for (let i = count - 1; i >= 0; i--) {
      await removeButtons.nth(i).click();
      await this.page.waitForTimeout(100);
    }
  }

  async startUpload(): Promise<void> {
    await this.uploadButton.click();
  }

  async pauseUpload(): Promise<void> {
    const pauseBtn = this.statusBar.locator('.uppy-StatusBar-actionBtn--pause');
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
    }
  }

  async resumeUpload(): Promise<void> {
    const resumeBtn = this.statusBar.locator('.uppy-StatusBar-actionBtn--resume');
    if (await resumeBtn.isVisible()) {
      await resumeBtn.click();
    }
  }

  async cancelUpload(): Promise<void> {
    await this.cancelButton.click();
  }

  async waitForUploadComplete(timeout: number = 60000): Promise<void> {
    // Wait for "Complete" status
    await this.statusBar.locator('text=/Complete|Upload complete/i').waitFor({
      state: 'visible',
      timeout
    });
  }

  async getUploadProgress(): Promise<{
    percentage: number;
    uploadedFiles: number;
    totalFiles: number;
    speed?: string;
    timeRemaining?: string;
  }> {
    const statusPrimary = await this.statusBar.locator('.uppy-StatusBar-statusPrimary').textContent() || '';
    const statusSecondary = await this.statusBar.locator('.uppy-StatusBar-statusSecondary').textContent() || '';

    // Parse percentage
    const percentMatch = statusPrimary.match(/(\d+)%/);
    const percentage = percentMatch ? parseInt(percentMatch[1]) : 0;

    // Parse file counts
    const fileMatch = statusPrimary.match(/(\d+)\s*of\s*(\d+)/);
    const uploadedFiles = fileMatch ? parseInt(fileMatch[1]) : 0;
    const totalFiles = fileMatch ? parseInt(fileMatch[2]) : 0;

    // Parse speed and time
    const speedMatch = statusSecondary.match(/([\d.]+\s*[KMGT]?B\/s)/);
    const speed = speedMatch ? speedMatch[1] : undefined;

    const timeMatch = statusSecondary.match(/(\d+:\d+)/);
    const timeRemaining = timeMatch ? timeMatch[1] : undefined;

    return {
      percentage,
      uploadedFiles,
      totalFiles,
      speed,
      timeRemaining
    };
  }

  async hasErrors(): Promise<boolean> {
    return await this.statusBar.locator('.uppy-StatusBar-error').isVisible();
  }

  async getErrorMessage(): Promise<string | null> {
    const error = this.statusBar.locator('.uppy-StatusBar-error');
    if (await error.isVisible()) {
      return await error.textContent();
    }
    return null;
  }

  // Plugin interactions
  async useWebcam(): Promise<void> {
    await this.webcamPlugin.click();

    // Wait for webcam view
    await this.dashboard.locator('.uppy-Webcam').waitFor({ state: 'visible' });

    // Grant permissions if needed
    await this.page.context().grantPermissions(['camera']);

    // Wait for video stream
    await this.dashboard.locator('.uppy-Webcam-video').waitFor({ state: 'visible' });
  }

  async capturePhoto(): Promise<void> {
    const captureButton = this.dashboard.locator('.uppy-Webcam-button--picture');
    await captureButton.click();

    // Wait for preview
    await this.dashboard.locator('.uppy-Webcam-preview').waitFor({ state: 'visible' });

    // Accept photo
    const saveButton = this.dashboard.locator('.uppy-Webcam-button--save');
    await saveButton.click();
  }

  async startScreenRecording(): Promise<void> {
    await this.screenCapturePlugin.click();

    // Grant permissions
    await this.page.context().grantPermissions(['camera', 'microphone']);

    // Start recording
    const startButton = this.dashboard.locator('.uppy-ScreenCapture-button--start');
    await startButton.click();
  }

  async stopScreenRecording(): Promise<void> {
    const stopButton = this.dashboard.locator('.uppy-ScreenCapture-button--stop');
    await stopButton.click();

    // Save recording
    const saveButton = this.dashboard.locator('.uppy-ScreenCapture-button--save');
    await saveButton.click();
  }

  async openImageEditor(fileIndex: number = 0): Promise<void> {
    // Select file to edit
    const file = this.fileList.locator('.uppy-Dashboard-file').nth(fileIndex);
    await file.click();

    // Open editor
    await this.imageEditorPlugin.click();

    // Wait for editor
    await this.dashboard.locator('.uppy-ImageEditor').waitFor({ state: 'visible' });
  }

  async editImage(action: 'rotate' | 'crop' | 'flip' | 'saturate'): Promise<void> {
    const actionButton = this.dashboard.locator(`[data-action="${action}"]`);
    await actionButton.click();

    if (action === 'crop') {
      // Perform crop action
      const cropArea = this.dashboard.locator('.uppy-ImageEditor-cropArea');
      await cropArea.dragTo(cropArea, {
        sourcePosition: { x: 10, y: 10 },
        targetPosition: { x: 100, y: 100 }
      });
    }
  }

  async saveImageEdits(): Promise<void> {
    const saveButton = this.dashboard.locator('.uppy-ImageEditor-save');
    await saveButton.click();
  }

  async recordAudio(): Promise<void> {
    await this.audioPlugin.click();

    // Grant microphone permission
    await this.page.context().grantPermissions(['microphone']);

    // Start recording
    const recordButton = this.dashboard.locator('.uppy-Audio-recordButton');
    await recordButton.click();

    // Record for 2 seconds
    await this.page.waitForTimeout(2000);

    // Stop recording
    await recordButton.click();

    // Save audio
    const saveButton = this.dashboard.locator('.uppy-Audio-saveButton');
    await saveButton.click();
  }

  async importFromUrl(url: string): Promise<void> {
    await this.urlPlugin.click();

    // Enter URL
    const urlInput = this.dashboard.locator('.uppy-Url-input');
    await urlInput.fill(url);

    // Import
    const importButton = this.dashboard.locator('.uppy-Url-importButton');
    await importButton.click();

    // Wait for file to be added
    await this.page.waitForTimeout(1000);
  }

  async getPluginTabs(): Promise<string[]> {
    const tabs = await this.pluginTabs.allTextContents();
    return tabs.map(t => t.trim()).filter(t => t);
  }

  async isPluginAvailable(pluginName: string): Promise<boolean> {
    const plugin = this.dashboard.locator(`[aria-label="${pluginName}"], [data-plugin="${pluginName}"]`);
    return await plugin.isVisible();
  }

  async getFileMetadata(fileName: string): Promise<any> {
    const file = this.fileList.locator(`.uppy-Dashboard-file:has-text("${fileName}")`);
    const metadataButton = file.locator('.uppy-Dashboard-file-info');

    if (await metadataButton.isVisible()) {
      await metadataButton.click();

      // Get metadata from modal or tooltip
      const metadata = await this.page.evaluate(() => {
        const modal = document.querySelector('.uppy-Dashboard-file-metadata');
        if (!modal) return null;

        const data: any = {};
        modal.querySelectorAll('[data-metadata-key]').forEach((el: any) => {
          const key = el.getAttribute('data-metadata-key');
          const value = el.textContent;
          if (key) data[key] = value;
        });

        return data;
      });

      // Close modal
      await this.page.keyboard.press('Escape');

      return metadata;
    }

    return null;
  }

  async getThumbnail(fileName: string): Promise<string | null> {
    const file = this.fileList.locator(`.uppy-Dashboard-file:has-text("${fileName}")`);
    const thumbnail = file.locator('.uppy-Dashboard-file-preview img');

    if (await thumbnail.isVisible()) {
      return await thumbnail.getAttribute('src');
    }

    return null;
  }

  async retryFailedUpload(fileName: string): Promise<void> {
    const file = this.fileList.locator(`.uppy-Dashboard-file:has-text("${fileName}")`);
    const retryButton = file.locator('.uppy-Dashboard-file-retry');

    if (await retryButton.isVisible()) {
      await retryButton.click();
    }
  }

  async getRestrictions(): Promise<{
    maxFileSize?: number;
    minFileSize?: number;
    maxNumberOfFiles?: number;
    allowedFileTypes?: string[];
  }> {
    return await this.page.evaluate(() => {
      const uppy = (window as any).uppyInstance;
      if (!uppy) return {};

      const restrictions = uppy.opts.restrictions || {};
      return {
        maxFileSize: restrictions.maxFileSize,
        minFileSize: restrictions.minFileSize,
        maxNumberOfFiles: restrictions.maxNumberOfFiles,
        allowedFileTypes: restrictions.allowedFileTypes
      };
    });
  }
}