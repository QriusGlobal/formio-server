/**
 * Test Utilities and Helper Functions
 *
 * Shared utilities for E2E tests including:
 * - File generation
 * - GCS verification
 * - Form.io API interaction
 * - Network simulation
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { Storage } from '@google-cloud/storage';
import axios from 'axios';

import type { Page } from '@playwright/test';

export class TestHelpers {
  /**
   * Generate test file with specific size
   */
  static async generateTestFile(
    fileName: string,
    sizeInBytes: number,
    directory = '/tmp'
  ): Promise<string> {
    const filePath = path.join(directory, fileName);

    // Generate random data
    const buffer = crypto.randomBytes(Math.min(sizeInBytes, 1024 * 1024)); // 1MB chunks
    const chunks = Math.ceil(sizeInBytes / buffer.length);

    const writeStream = await fs.open(filePath, 'w');

    for (let i = 0; i < chunks; i++) {
      const chunkSize = Math.min(buffer.length, sizeInBytes - (i * buffer.length));
      await writeStream.write(buffer.slice(0, chunkSize));
    }

    await writeStream.close();

    return filePath;
  }

  /**
   * Generate image test file
   */
  static async generateImageFile(
    fileName: string,
    width = 1920,
    height = 1080,
    directory = '/tmp'
  ): Promise<string> {
    const filePath = path.join(directory, fileName);

    // Generate simple PNG (minimal valid PNG structure)
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = this.createPNGChunk('IHDR', Buffer.concat([
      Buffer.from([
        (width >> 24) & 0xff, (width >> 16) & 0xff, (width >> 8) & 0xff, width & 0xff,
        (height >> 24) & 0xff, (height >> 16) & 0xff, (height >> 8) & 0xff, height & 0xff,
        8, 2, 0, 0, 0 // bit depth, color type, compression, filter, interlace
      ])
    ]));
    const idat = this.createPNGChunk('IDAT', crypto.randomBytes(1024));
    const iend = this.createPNGChunk('IEND', Buffer.alloc(0));

    const pngData = Buffer.concat([pngSignature, ihdr, idat, iend]);
    await fs.writeFile(filePath, pngData);

    return filePath;
  }

  /**
   * Create PNG chunk
   */
  private static createPNGChunk(type: string, data: Buffer): Buffer {
    const typeBuffer = Buffer.from(type, 'ascii');
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(data.length, 0);

    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = this.crc32(crcData);
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);

    return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
  }

  /**
   * Calculate CRC32 checksum
   */
  private static crc32(buffer: Buffer): number {
    let crc = 0xffffffff;

    for (const element of buffer) {
      crc ^= element;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
      }
    }

    return (crc ^ 0xffffffff) >>> 0;
  }

  /**
   * Verify file exists in GCS emulator
   */
  static async verifyFileInGCS(
    bucket: string,
    fileName: string,
    expectedSize?: number
  ): Promise<boolean> {
    try {
      const storage = new Storage({
        apiEndpoint: 'http://localhost:9023',
        projectId: 'test-project',
      });

      const file = storage.bucket(bucket).file(fileName);
      const [exists] = await file.exists();

      if (!exists) {
        return false;
      }

      if (expectedSize !== undefined) {
        const [metadata] = await file.getMetadata();
        return Number.parseInt(metadata.size as string, 10) === expectedSize;
      }

      return true;
    } catch (error) {
      console.error('GCS verification error:', error);
      return false;
    }
  }

  /**
   * Get file from GCS emulator
   */
  static async getFileFromGCS(
    bucket: string,
    fileName: string
  ): Promise<Buffer | null> {
    try {
      const storage = new Storage({
        apiEndpoint: 'http://localhost:9023',
        projectId: 'test-project',
      });

      const file = storage.bucket(bucket).file(fileName);
      const [contents] = await file.download();

      return contents;
    } catch (error) {
      console.error('GCS download error:', error);
      return null;
    }
  }

  /**
   * Delete file from GCS emulator
   */
  static async deleteFileFromGCS(bucket: string, fileName: string): Promise<void> {
    try {
      const storage = new Storage({
        apiEndpoint: 'http://localhost:9023',
        projectId: 'test-project',
      });

      const file = storage.bucket(bucket).file(fileName);
      await file.delete();
    } catch (error) {
      console.error('GCS deletion error:', error);
    }
  }

  /**
   * Create Form.io submission with file
   */
  static async createFormSubmission(
    formId: string,
    fileUrl: string,
    additionalData: Record<string, any> = {}
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.FORMIO_PROJECT_URL}/form/${formId}/submission`,
        {
          data: {
            file: fileUrl,
            ...additionalData,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Form.io submission error:', error);
      throw error;
    }
  }

  /**
   * Get Form.io submission
   */
  static async getFormSubmission(
    formId: string,
    submissionId: string
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${process.env.FORMIO_PROJECT_URL}/form/${formId}/submission/${submissionId}`
      );

      return response.data;
    } catch (error) {
      console.error('Form.io get submission error:', error);
      throw error;
    }
  }

  /**
   * Wait for condition with timeout
   */
  static async waitFor(
    condition: () => Promise<boolean>,
    timeout = 30000,
    interval = 1000
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    return false;
  }

  /**
   * Simulate network conditions
   */
  static async simulateNetworkConditions(
    page: Page,
    conditions: {
      offline?: boolean;
      latency?: number;
      downloadSpeed?: number;
      uploadSpeed?: number;
    }
  ): Promise<void> {
    const client = await page.context().newCDPSession(page);

    await client.send('Network.emulateNetworkConditions', {
      offline: conditions.offline || false,
      downloadThroughput: conditions.downloadSpeed || -1,
      uploadThroughput: conditions.uploadSpeed || -1,
      latency: conditions.latency || 0,
    });
  }

  /**
   * Clean up test files
   */
  static async cleanupTestFiles(directory = '/tmp'): Promise<void> {
    try {
      const files = await fs.readdir(directory);
      const testFiles = files.filter(f => f.startsWith('test-file-') || f.startsWith('test-image-'));

      for (const file of testFiles) {
        await fs.unlink(path.join(directory, file));
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Format bytes to human readable
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Generate random string
   */
  static randomString(length = 10): string {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}