/**
 * TUS Bulk Upload Test Page Object
 *
 * Page object model for bulk upload test page interactions
 */

import { Page, Locator, expect } from '@playwright/test';
import { TestFile } from '../utils/file-helpers';
import { BulkUploadMetrics } from '../utils/bulk-upload-helpers';

export class TusBulkUploadPage {
  readonly page: Page;
  readonly configPanel: Locator;
  readonly chunkSizeSelect: Locator;
  readonly parallelUploadsSelect: Locator;
  readonly maxFilesSelect: Locator;
  readonly filePatternSelect: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successBanner: Locator;
  readonly statisticsPanel: Locator;
  readonly uploadedFilesList: Locator;
  readonly validationChecklist: Locator;

  constructor(page: Page) {
    this.page = page;
    this.configPanel = page.locator('div:has-text("Test Configuration")').first();

    // Use more reliable selectors based on page structure
    // The selects are in divs with labels, use nth-child or label association
    this.chunkSizeSelect = page.locator('label:has-text("Chunk Size")').locator('..').locator('select');
    this.parallelUploadsSelect = page.locator('label:has-text("Parallel Uploads")').locator('..').locator('select');
    this.maxFilesSelect = page.locator('label:has-text("Max Files")').locator('..').locator('select');
    this.filePatternSelect = page.locator('label:has-text("File Type Filter")').locator('..').locator('select');

    this.fileInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.successBanner = page.locator('text=/Bulk Upload Test Successful/i');
    this.statisticsPanel = page.locator('text=/Upload Statistics/i').locator('..');
    this.uploadedFilesList = page.locator('text=/Uploaded Files/i').locator('..');
    this.validationChecklist = page.locator('text=/Test Validation Checklist/i').locator('..');
  }

  /**
   * Navigate to TUS bulk upload test page with comprehensive wait strategy
   */
  async goto(): Promise<void> {
    // Navigate to page
    await this.page.goto('http://localhost:64849/tus-bulk-test', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for React lazy loading spinner to disappear (if present)
    try {
      await this.page.waitForSelector('[data-testid="loading-spinner"]', {
        state: 'hidden',
        timeout: 5000
      });
    } catch {
      // Spinner may not appear if route is already cached
      console.log('No loading spinner detected (route may be cached)');
    }

    // Wait for React hydration and component mount
    await this.page.waitForFunction(() => (window as any).testPageReady === true, {
      timeout: 10000
    });

    // Wait for critical UI elements to be visible and interactive
    await this.page.waitForSelector('h1:has-text("TUS Bulk Upload Test")', {
      state: 'visible',
      timeout: 10000
    });

    // Wait for configuration panel to be fully rendered
    await this.page.waitForSelector('text=/Test Configuration/i', {
      state: 'visible',
      timeout: 10000
    });

    // Ensure network idle (all lazy-loaded chunks loaded)
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });

    // Small delay to ensure all event listeners are attached
    await this.page.waitForTimeout(500);

    console.log('✅ TUS Bulk Upload page fully loaded and ready for interaction');
  }

  /**
   * Configure test settings
   */
  async configureTest(config: {
    chunkSizeMB?: number;
    parallelUploads?: number;
    maxFiles?: number;
    filePattern?: 'images' | 'documents' | 'all';
  }): Promise<void> {
    if (config.chunkSizeMB !== undefined) {
      await this.chunkSizeSelect.selectOption(String(config.chunkSizeMB));
      await this.page.waitForTimeout(200); // Allow re-render
    }

    if (config.parallelUploads !== undefined) {
      await this.parallelUploadsSelect.selectOption(String(config.parallelUploads));
      await this.page.waitForTimeout(200);
    }

    if (config.maxFiles !== undefined) {
      await this.maxFilesSelect.selectOption(String(config.maxFiles));
      await this.page.waitForTimeout(200);
    }

    if (config.filePattern) {
      await this.filePatternSelect.selectOption(config.filePattern);
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: TestFile[]): Promise<void> {
    const filePaths = files.map(f => f.path);
    await this.fileInput.setInputFiles(filePaths);
  }

  /**
   * Submit form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Upload files and submit in one action
   */
  async uploadAndSubmit(files: TestFile[]): Promise<void> {
    await this.uploadFiles(files);
    await this.page.waitForTimeout(500); // Wait for file selection UI update
    await this.submit();
  }

  /**
   * Wait for all uploads to complete
   */
  async waitForUploadComplete(timeoutMs = 300000): Promise<void> {
    await expect(this.successBanner).toBeVisible({ timeout: timeoutMs });
  }

  /**
   * Get upload statistics from the page
   */
  async getUploadStatistics(): Promise<{
    filesUploaded: number;
    totalSizeMB: number;
    chunkSizeMB: number;
    parallelUploads: number;
  }> {
    await expect(this.statisticsPanel).toBeVisible();

    return this.page.evaluate(() => {
      const stats = {
        filesUploaded: 0,
        totalSizeMB: 0,
        chunkSizeMB: 0,
        parallelUploads: 0
      };

      const cards = document.querySelectorAll('[style*="grid"] > div');
      cards.forEach((card) => {
        const text = card.textContent || '';
        const valueElement = card.querySelector('div:first-child');
        const value = valueElement?.textContent || '0';

        if (text.includes('Files Uploaded')) {
          stats.filesUploaded = parseInt(value, 10);
        } else if (text.includes('Total Size')) {
          stats.totalSizeMB = parseFloat(value);
        } else if (text.includes('Chunk Size')) {
          stats.chunkSizeMB = parseFloat(value);
        } else if (text.includes('Parallel Uploads')) {
          stats.parallelUploads = parseInt(value, 10);
        }
      });

      return stats;
    });
  }

  /**
   * Validate submission data
   */
  async validateSubmission(expectedFileCount: number): Promise<boolean> {
    await expect(this.successBanner).toBeVisible();

    const stats = await this.getUploadStatistics();
    return stats.filesUploaded === expectedFileCount;
  }

  /**
   * Get validation checklist results
   */
  async getValidationResults(): Promise<{
    multipleFiles: boolean;
    fileDataStructure: boolean;
    fileUrlsPresent: boolean;
    tusStorage: boolean;
    fileMetadata: boolean;
  }> {
    await expect(this.validationChecklist).toBeVisible();

    return this.page.evaluate(() => {
      const checklist = document.querySelector('ul');
      if (!checklist) {
        return {
          multipleFiles: false,
          fileDataStructure: false,
          fileUrlsPresent: false,
          tusStorage: false,
          fileMetadata: false
        };
      }

      const items = Array.from(checklist.querySelectorAll('li'));

      return {
        multipleFiles: items[0]?.textContent?.includes('✅ PASS') || false,
        fileDataStructure: items[1]?.textContent?.includes('✅ PASS') || false,
        fileUrlsPresent: items[2]?.textContent?.includes('✅ PASS') || false,
        tusStorage: items[3]?.textContent?.includes('✅ PASS') || false,
        fileMetadata: items[4]?.textContent?.includes('✅ PASS') || false
      };
    });
  }

  /**
   * Get list of uploaded files
   */
  async getUploadedFiles(): Promise<Array<{
    name: string;
    size: number;
    type: string;
    url: string;
  }>> {
    await expect(this.uploadedFilesList).toBeVisible();

    return this.page.evaluate(() => {
      const files: Array<{ name: string; size: number; type: string; url: string }> = [];

      const fileElements = document.querySelectorAll('[href*="http"]');
      fileElements.forEach((element) => {
        const text = element.textContent || '';
        const url = (element as HTMLAnchorElement).href;

        // Extract file info from text
        const match = text.match(/(.+?)\s*\((.+?)\s*KB\)/);
        if (match) {
          files.push({
            name: match[1].trim(),
            size: parseFloat(match[2]) * 1024, // Convert KB to bytes
            type: 'unknown',
            url
          });
        }
      });

      return files;
    });
  }

  /**
   * Get raw submission data
   */
  async getSubmissionData(): Promise<any> {
    const preElement = this.page.locator('pre').first();
    await expect(preElement).toBeVisible();

    const jsonText = await preElement.textContent();
    if (!jsonText) throw new Error('No submission data found');

    return JSON.parse(jsonText);
  }

  /**
   * Reset test (run another test)
   */
  async resetTest(): Promise<void> {
    const resetButton = this.page.locator('button:has-text("Run Another Test")');
    await resetButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true
    });
  }

  /**
   * Monitor upload progress
   */
  async monitorUploadProgress(intervalMs = 500): Promise<number[]> {
    const progressValues: number[] = [];

    const monitor = async () => {
      const isComplete = await this.successBanner.isVisible();
      if (isComplete) return;

      const progress = await this.page.evaluate(() => {
        // Try to extract progress from UI
        const progressText = document.body.textContent || '';
        const match = progressText.match(/(\d+)%/);
        return match ? parseInt(match[1], 10) : 0;
      });

      progressValues.push(progress);

      if (progress < 100) {
        await this.page.waitForTimeout(intervalMs);
        await monitor();
      }
    };

    await monitor();
    return progressValues;
  }

  /**
   * Verify configuration is applied
   */
  async verifyConfiguration(expectedConfig: {
    chunkSizeMB: number;
    parallelUploads: number;
    maxFiles: number;
  }): Promise<boolean> {
    const configText = await this.configPanel.textContent();
    if (!configText) return false;

    const chunkMatch = configText.includes(`Chunk Size: ${expectedConfig.chunkSizeMB} MB`);
    const parallelMatch = configText.includes(`Parallel Uploads: ${expectedConfig.parallelUploads}`);
    const maxFilesMatch = configText.includes(`Max Files: ${expectedConfig.maxFiles}`);

    return chunkMatch && parallelMatch && maxFilesMatch;
  }
}
