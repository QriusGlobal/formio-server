/**
 * File Upload Test Fixture
 *
 * Provides reusable file upload helpers for E2E tests
 */

import { test as base, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadFixture {
  files: TestFileGenerator;
  upload: UploadHelpers;
  tus: TusHelpers;
  uppy: UppyHelpers;
}

export interface TestFile {
  path: string;
  name: string;
  size: number;
  type: string;
  buffer?: Buffer;
  hash?: string;
}

export interface TestFileGenerator {
  generate(sizeInBytes: number, name?: string, type?: string): Promise<TestFile>;
  generateMultiple(count: number, sizeInBytes: number): Promise<TestFile[]>;
  fromString(content: string, name: string, type?: string): Promise<TestFile>;
  cleanup(): Promise<void>;
  getFixturesDir(): string;
}

export interface UploadHelpers {
  uploadFile(page: Page, selector: string, file: TestFile): Promise<void>;
  uploadMultiple(page: Page, selector: string, files: TestFile[]): Promise<void>;
  dragAndDrop(page: Page, selector: string, file: TestFile): Promise<void>;
  waitForUploadComplete(page: Page, timeout?: number): Promise<void>;
  getUploadProgress(page: Page): Promise<number>;
  cancelUpload(page: Page): Promise<void>;
}

export interface TusHelpers {
  pauseUpload(page: Page): Promise<void>;
  resumeUpload(page: Page): Promise<void>;
  getChunkProgress(page: Page): Promise<{ uploaded: number; total: number }>;
  simulateNetworkFailure(page: Page): Promise<void>;
  verifyResumable(page: Page, uploadId: string): Promise<boolean>;
}

export interface UppyHelpers {
  openDashboard(page: Page): Promise<void>;
  selectPlugin(page: Page, plugin: string): Promise<void>;
  useWebcam(page: Page): Promise<void>;
  captureScreen(page: Page): Promise<void>;
  editImage(page: Page): Promise<void>;
  importFromUrl(page: Page, url: string): Promise<void>;
  getDashboardFiles(page: Page): Promise<string[]>;
}

const testFiles: TestFile[] = [];
const fixturesDir = path.join(process.cwd(), 'test-app/tests/fixtures/generated');

export const test = base.extend<{ upload: UploadFixture }>({
  upload: async ({ page }, use) => {
    // Ensure fixtures directory exists
    await fs.promises.mkdir(fixturesDir, { recursive: true });

    const files: TestFileGenerator = {
      async generate(sizeInBytes: number, name?: string, type?: string): Promise<TestFile> {
        const fileName = name || `test-file-${Date.now()}.bin`;
        const filePath = path.join(fixturesDir, fileName);
        const fileType = type || 'application/octet-stream';

        // Generate random content
        const buffer = crypto.randomBytes(sizeInBytes);
        await fs.promises.writeFile(filePath, buffer);

        // Calculate hash for verification
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        const testFile: TestFile = {
          path: filePath,
          name: fileName,
          size: sizeInBytes,
          type: fileType,
          buffer,
          hash
        };

        testFiles.push(testFile);
        return testFile;
      },

      async generateMultiple(count: number, sizeInBytes: number): Promise<TestFile[]> {
        const files: TestFile[] = [];
        for (let i = 0; i < count; i++) {
          files.push(await this.generate(sizeInBytes, `test-file-${i}-${Date.now()}.bin`));
        }
        return files;
      },

      async fromString(content: string, name: string, type?: string): Promise<TestFile> {
        const filePath = path.join(fixturesDir, name);
        const buffer = Buffer.from(content, 'utf-8');
        await fs.promises.writeFile(filePath, buffer);

        const testFile: TestFile = {
          path: filePath,
          name,
          size: buffer.length,
          type: type || 'text/plain',
          buffer,
          hash: crypto.createHash('sha256').update(buffer).digest('hex')
        };

        testFiles.push(testFile);
        return testFile;
      },

      async cleanup(): Promise<void> {
        for (const file of testFiles) {
          try {
            await fs.promises.unlink(file.path);
          } catch (err) {
            // File might already be deleted
          }
        }
        testFiles.length = 0;
      },

      getFixturesDir(): string {
        return fixturesDir;
      }
    };

    const upload: UploadHelpers = {
      async uploadFile(page: Page, selector: string, file: TestFile): Promise<void> {
        const fileInput = page.locator(selector);
        await fileInput.setInputFiles(file.path);
      },

      async uploadMultiple(page: Page, selector: string, files: TestFile[]): Promise<void> {
        const fileInput = page.locator(selector);
        await fileInput.setInputFiles(files.map(f => f.path));
      },

      async dragAndDrop(page: Page, selector: string, file: TestFile): Promise<void> {
        const dropZone = page.locator(selector);

        // Create a DataTransfer object with the file
        await page.evaluate(async ({ selector, fileName, fileContent, fileType }) => {
          const dropArea = document.querySelector(selector);
          if (!dropArea) throw new Error('Drop zone not found');

          // Create file from content
          const file = new File([fileContent], fileName, { type: fileType });

          // Create drag events
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // Dispatch drag events
          const dragEnter = new DragEvent('dragenter', {
            bubbles: true,
            cancelable: true,
            dataTransfer
          });

          const dragOver = new DragEvent('dragover', {
            bubbles: true,
            cancelable: true,
            dataTransfer
          });

          const drop = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer
          });

          dropArea.dispatchEvent(dragEnter);
          dropArea.dispatchEvent(dragOver);
          dropArea.dispatchEvent(drop);
        }, {
          selector,
          fileName: file.name,
          fileContent: file.buffer?.toString('base64') || '',
          fileType: file.type
        });
      },

      async waitForUploadComplete(page: Page, timeout: number = 30000): Promise<void> {
        await page.waitForSelector('.upload-complete, .uppy-StatusBar-statusPrimary', {
          state: 'visible',
          timeout
        });

        // Additional wait for any post-upload processing
        await page.waitForTimeout(1000);
      },

      async getUploadProgress(page: Page): Promise<number> {
        const progressText = await page.locator('.upload-progress, .uppy-StatusBar-statusSecondary').textContent();
        const match = progressText?.match(/(\d+)%/);
        return match ? parseInt(match[1]) : 0;
      },

      async cancelUpload(page: Page): Promise<void> {
        await page.click('.upload-cancel, .uppy-StatusBar-actionBtn--upload');
      }
    };

    const tus: TusHelpers = {
      async pauseUpload(page: Page): Promise<void> {
        await page.click('[data-action="pause"], .tus-pause-btn');
      },

      async resumeUpload(page: Page): Promise<void> {
        await page.click('[data-action="resume"], .tus-resume-btn');
      },

      async getChunkProgress(page: Page): Promise<{ uploaded: number; total: number }> {
        const progressData = await page.evaluate(() => {
          // Access TUS upload instance if available
          const upload = (window as any).currentTusUpload;
          if (upload && upload.url) {
            return {
              uploaded: upload.offset || 0,
              total: upload.file?.size || 0
            };
          }
          return { uploaded: 0, total: 0 };
        });

        return progressData;
      },

      async simulateNetworkFailure(page: Page): Promise<void> {
        await page.context().setOffline(true);
        await page.waitForTimeout(1000);
        await page.context().setOffline(false);
      },

      async verifyResumable(page: Page, uploadId: string): Promise<boolean> {
        const response = await page.request.head(`http://localhost:1080/files/${uploadId}`);
        return response.ok();
      }
    };

    const uppy: UppyHelpers = {
      async openDashboard(page: Page): Promise<void> {
        await page.click('.uppy-Dashboard-browse, .uppy-trigger');
      },

      async selectPlugin(page: Page, plugin: string): Promise<void> {
        await page.click(`[aria-label="${plugin}"], [data-plugin="${plugin}"]`);
      },

      async useWebcam(page: Page): Promise<void> {
        await this.selectPlugin(page, 'Webcam');

        // Grant camera permissions
        await page.context().grantPermissions(['camera']);

        // Wait for camera to initialize
        await page.waitForSelector('.uppy-Webcam-video', { state: 'visible' });

        // Take picture
        await page.click('.uppy-Webcam-recordButton');
      },

      async captureScreen(page: Page): Promise<void> {
        await this.selectPlugin(page, 'Screen Capture');

        // Grant screen capture permissions
        await page.context().grantPermissions(['camera', 'microphone']);

        // Start recording
        await page.click('.uppy-ScreenCapture-recordButton');

        // Record for 2 seconds
        await page.waitForTimeout(2000);

        // Stop recording
        await page.click('.uppy-ScreenCapture-stopButton');
      },

      async editImage(page: Page): Promise<void> {
        await this.selectPlugin(page, 'Image Editor');

        // Wait for editor to load
        await page.waitForSelector('.uppy-ImageEditor', { state: 'visible' });

        // Apply a simple edit (e.g., rotate)
        await page.click('[data-action="rotate"]');

        // Save changes
        await page.click('.uppy-ImageEditor-save');
      },

      async importFromUrl(page: Page, url: string): Promise<void> {
        await this.selectPlugin(page, 'Link');

        // Enter URL
        await page.fill('.uppy-Url-input', url);

        // Import
        await page.click('.uppy-Url-importButton');
      },

      async getDashboardFiles(page: Page): Promise<string[]> {
        const files = await page.locator('.uppy-Dashboard-file').allTextContents();
        return files;
      }
    };

    const fixture: UploadFixture = {
      files,
      upload,
      tus,
      uppy
    };

    await use(fixture);

    // Cleanup test files
    await files.cleanup();
  }
});

export { expect } from '@playwright/test';

// Helper to monitor upload network requests
export async function monitorUploadRequests(page: Page, urlPattern: string): Promise<any[]> {
  const requests: any[] = [];

  page.on('request', (request) => {
    if (request.url().includes(urlPattern)) {
      requests.push({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        timestamp: Date.now()
      });
    }
  });

  return requests;
}

// Helper to verify file upload on server
export async function verifyServerFile(
  page: Page,
  fileId: string,
  expectedHash?: string
): Promise<boolean> {
  try {
    const response = await page.request.get(`http://localhost:3001/file/${fileId}`);

    if (!response.ok()) {
      return false;
    }

    if (expectedHash) {
      const buffer = await response.body();
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      return hash === expectedHash;
    }

    return true;
  } catch (error) {
    console.error('Failed to verify server file:', error);
    return false;
  }
}