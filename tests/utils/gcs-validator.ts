/**
 * GCS Emulator Verification Helper
 * Validates file uploads and metadata in GCS emulator
 */

import { createHash } from 'node:crypto';

import axios, { type AxiosInstance } from 'axios';

export interface GCSFile {
  name: string;
  bucket: string;
  size: number;
  contentType: string;
  md5Hash: string;
  crc32c: string;
  timeCreated: string;
  updated: string;
  generation: string;
  metageneration: string;
}

export interface GCSListResponse {
  kind: string;
  items?: GCSFile[];
  prefixes?: string[];
}

export interface GCSValidationResult {
  exists: boolean;
  file?: GCSFile;
  contentValid?: boolean;
  metadataValid?: boolean;
  errors: string[];
}

export class GCSValidator {
  private client: AxiosInstance;
  private emulatorHost: string;
  private bucket: string;

  constructor(
    emulatorHost: string = process.env.GCS_EMULATOR_HOST || 'http://localhost:4443',
    bucket: string = process.env.GCS_BUCKET || 'formio-uploads'
  ) {
    this.emulatorHost = emulatorHost;
    this.bucket = bucket;

    this.client = axios.create({
      baseURL: emulatorHost,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Query GCS emulator API
   */
  async getFile(fileName: string): Promise<GCSFile | null> {
    try {
      const response = await this.client.get(
        `/storage/v1/b/${this.bucket}/o/${encodeURIComponent(fileName)}`
      );
      return response.data as GCSFile;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  /**
   * Verify file exists in bucket
   */
  async fileExists(fileName: string): Promise<boolean> {
    const file = await this.getFile(fileName);
    return file !== null;
  }

  /**
   * Check file metadata
   */
  async verifyMetadata(
    fileName: string,
    expectedMetadata: {
      size?: number;
      contentType?: string;
      minSize?: number;
      maxSize?: number;
    }
  ): Promise<{ valid: boolean; errors: string[] }> {
    const file = await this.getFile(fileName);
    const errors: string[] = [];

    if (!file) {
      return { valid: false, errors: ['File does not exist'] };
    }

    if (expectedMetadata.size !== undefined && file.size !== expectedMetadata.size) {
      errors.push(`Size mismatch: expected ${expectedMetadata.size}, got ${file.size}`);
    }

    if (expectedMetadata.minSize !== undefined && file.size < expectedMetadata.minSize) {
      errors.push(`Size too small: ${file.size} < ${expectedMetadata.minSize}`);
    }

    if (expectedMetadata.maxSize !== undefined && file.size > expectedMetadata.maxSize) {
      errors.push(`Size too large: ${file.size} > ${expectedMetadata.maxSize}`);
    }

    if (expectedMetadata.contentType && file.contentType !== expectedMetadata.contentType) {
      errors.push(
        `Content type mismatch: expected ${expectedMetadata.contentType}, got ${file.contentType}`
      );
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Download and validate file content
   */
  async downloadFile(fileName: string): Promise<Buffer> {
    try {
      const response = await this.client.get(
        `/storage/v1/b/${this.bucket}/o/${encodeURIComponent(fileName)}?alt=media`,
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data);
    } catch (error: any) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Validate file content checksum
   */
  async validateChecksum(
    fileName: string,
    expectedChecksum: string,
    algorithm: 'md5' | 'sha256' = 'md5'
  ): Promise<boolean> {
    const content = await this.downloadFile(fileName);
    const hash = createHash(algorithm);
    hash.update(content);
    const actualChecksum = hash.digest('base64');
    return actualChecksum === expectedChecksum;
  }

  /**
   * List all files in bucket
   */
  async listFiles(prefix?: string, maxResults: number = 1000): Promise<GCSFile[]> {
    try {
      const params: any = { maxResults };
      if (prefix) {
        params.prefix = prefix;
      }

      const response = await this.client.get<GCSListResponse>(
        `/storage/v1/b/${this.bucket}/o`,
        { params }
      );

      return response.data.items || [];
    } catch (error: any) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Clean up test files
   */
  async deleteFile(fileName: string): Promise<boolean> {
    try {
      await this.client.delete(
        `/storage/v1/b/${this.bucket}/o/${encodeURIComponent(fileName)}`
      );
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Clean up all test files matching pattern
   */
  async cleanupTestFiles(prefix: string = 'test-'): Promise<number> {
    const files = await this.listFiles(prefix);
    let deleted = 0;

    for (const file of files) {
      const success = await this.deleteFile(file.name);
      if (success) deleted++;
    }

    return deleted;
  }

  /**
   * Comprehensive file validation
   */
  async validateFile(
    fileName: string,
    options: {
      checkMetadata?: {
        size?: number;
        contentType?: string;
        minSize?: number;
        maxSize?: number;
      };
      checkContent?: boolean;
      expectedChecksum?: string;
      checksumAlgorithm?: 'md5' | 'sha256';
    } = {}
  ): Promise<GCSValidationResult> {
    const result: GCSValidationResult = {
      exists: false,
      errors: [],
    };

    // Check existence
    const file = await this.getFile(fileName);
    if (!file) {
      result.errors.push('File does not exist');
      return result;
    }

    result.exists = true;
    result.file = file;

    // Check metadata
    if (options.checkMetadata) {
      const metadataResult = await this.verifyMetadata(fileName, options.checkMetadata);
      result.metadataValid = metadataResult.valid;
      result.errors.push(...metadataResult.errors);
    }

    // Check content checksum
    if (options.checkContent && options.expectedChecksum) {
      try {
        const checksumValid = await this.validateChecksum(
          fileName,
          options.expectedChecksum,
          options.checksumAlgorithm
        );
        result.contentValid = checksumValid;
        if (!checksumValid) {
          result.errors.push('Content checksum validation failed');
        }
      } catch (error: any) {
        result.contentValid = false;
        result.errors.push(`Content validation error: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Wait for file to appear (useful for async operations)
   */
  async waitForFile(
    fileName: string,
    timeoutMs: number = 10000,
    pollIntervalMs: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (await this.fileExists(fileName)) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    return false;
  }

  /**
   * Get bucket statistics
   */
  async getBucketStats(): Promise<{
    fileCount: number;
    totalSize: number;
    contentTypes: Record<string, number>;
  }> {
    const files = await this.listFiles();

    return {
      fileCount: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      contentTypes: files.reduce((acc, file) => {
        acc[file.contentType] = (acc[file.contentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

/**
 * Create a singleton instance
 */
export const gcsValidator = new GCSValidator();

/**
 * Helper function for tests
 */
export async function setupGCSValidator(
  emulatorHost?: string,
  bucket?: string
): Promise<GCSValidator> {
  const validator = new GCSValidator(emulatorHost, bucket);

  // Verify connection
  try {
    await validator.listFiles();
  } catch (error: any) {
    throw new Error(`GCS Emulator connection failed: ${error.message}`);
  }

  return validator;
}