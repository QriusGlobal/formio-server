/**
 * Mock GCS Provider for Testing
 *
 * Provides configurable failure scenarios for testing upload resilience:
 * - Success mode (normal upload)
 * - Network error mode (ECONNREFUSED)
 * - Service unavailable mode (503 errors)
 * - Invalid credentials mode (401 errors)
 * - Timeout mode (slow responses)
 */

import type { Readable } from 'node:stream';

export type FailureMode = 'success' | 'network' | '503' | '401' | 'timeout';

export interface UploadMetadata {
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
}

export interface UploadOptions {
  partSize?: number;
  queueSize?: number;
  timeout?: number;
}

export interface UploadResult {
  key: string;
  location: string;
  etag: string;
  bucket: string;
  size: number;
}

export interface PresignedUrlOptions {
  expiresIn?: number;
  contentType?: string;
}

/**
 * Mock GCS Provider with configurable failure scenarios
 */
export class MockGCSProvider {
  private failureMode: FailureMode = 'success';
  private bucket: string;
  private region: string;
  private uploadedFiles: Map<string, UploadResult> = new Map();
  private uploadDelay: number = 0;

  constructor(bucket: string = 'formio-test-uploads', region: string = 'us-central1') {
    this.bucket = bucket;
    this.region = region;
  }

  /**
   * Multipart upload simulation
   */
  async multipartUpload(
    stream: Readable | Buffer | string,
    metadata: UploadMetadata,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    // Check failure mode before proceeding
    await this.checkFailureMode();

    // Simulate upload delay
    if (this.uploadDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.uploadDelay));
    }

    // Convert input to buffer
    const buffer = await this.streamToBuffer(stream);

    // Generate result
    const key = this.generateKey(metadata);
    const result: UploadResult = {
      key,
      location: `https://storage.googleapis.com/${this.bucket}/${key}`,
      etag: this.generateETag(buffer),
      bucket: this.bucket,
      size: buffer.length
    };

    // Store for verification
    this.uploadedFiles.set(key, result);

    return result;
  }

  /**
   * Generate presigned URL for upload/download
   */
  async generatePresignedUrl(
    key: string,
    action: 'read' | 'write',
    options: PresignedUrlOptions = {}
  ): Promise<string> {
    await this.checkFailureMode();

    const expiresIn = options.expiresIn || 3600;
    const expires = Math.floor(Date.now() / 1000) + expiresIn;

    // Simulate GCS signed URL format
    const signature = this.generateSignature(key, action, expires);

    return `https://storage.googleapis.com/${this.bucket}/${key}?` +
           `X-Goog-Algorithm=GOOG4-RSA-SHA256&` +
           `X-Goog-Credential=test-service-account&` +
           `X-Goog-Date=${new Date().toISOString()}&` +
           `X-Goog-Expires=${expiresIn}&` +
           `X-Goog-SignedHeaders=host&` +
           `X-Goog-Signature=${signature}`;
  }

  /**
   * Set failure mode for testing
   */
  setFailureMode(mode: FailureMode): void {
    this.failureMode = mode;
  }

  /**
   * Set upload delay in milliseconds
   */
  setUploadDelay(delayMs: number): void {
    this.uploadDelay = delayMs;
  }

  /**
   * Reset to success mode and clear state
   */
  reset(): void {
    this.failureMode = 'success';
    this.uploadDelay = 0;
    this.uploadedFiles.clear();
  }

  /**
   * Get uploaded file result
   */
  getUploadedFile(key: string): UploadResult | undefined {
    return this.uploadedFiles.get(key);
  }

  /**
   * Get all uploaded files
   */
  getAllUploadedFiles(): UploadResult[] {
    return Array.from(this.uploadedFiles.values());
  }

  /**
   * Verify file was uploaded
   */
  hasFile(key: string): boolean {
    return this.uploadedFiles.has(key);
  }

  /**
   * Get upload count
   */
  getUploadCount(): number {
    return this.uploadedFiles.size;
  }

  /**
   * Clear all uploaded files
   */
  clearUploads(): void {
    this.uploadedFiles.clear();
  }

  /**
   * Check failure mode and throw appropriate error
   */
  private async checkFailureMode(): Promise<void> {
    switch (this.failureMode) {
      case 'network':
        const networkError = new Error('connect ECONNREFUSED 127.0.0.1:4443');
        (networkError as any).code = 'ECONNREFUSED';
        (networkError as any).errno = -61;
        (networkError as any).syscall = 'connect';
        throw networkError;

      case '503':
        const serviceError = new Error('Service Unavailable');
        (serviceError as any).statusCode = 503;
        (serviceError as any).code = 'ServiceUnavailable';
        throw serviceError;

      case '401':
        const authError = new Error('Unauthorized');
        (authError as any).statusCode = 401;
        (authError as any).code = 'Unauthorized';
        throw authError;

      case 'timeout':
        // Simulate timeout by waiting longer than typical timeout
        await new Promise(resolve => setTimeout(resolve, 65000));
        const timeoutError = new Error('Request timeout');
        (timeoutError as any).code = 'ETIMEDOUT';
        throw timeoutError;

      case 'success':
      default:
        // No error
        break;
    }
  }

  /**
   * Convert stream/buffer/string to buffer
   */
  private async streamToBuffer(stream: Readable | Buffer | string): Promise<Buffer> {
    if (Buffer.isBuffer(stream)) {
      return stream;
    }

    if (typeof stream === 'string') {
      return Buffer.from(stream);
    }

    // Handle readable stream
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Generate unique key for file
   */
  private generateKey(metadata: UploadMetadata): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = this.getExtensionFromContentType(metadata.contentType);

    return `test-uploads/${timestamp}-${random}${ext}`;
  }

  /**
   * Get file extension from content type
   */
  private getExtensionFromContentType(contentType?: string): string {
    if (!contentType) return '.bin';

    const typeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
      'video/mp4': '.mp4',
      'text/plain': '.txt',
      'application/json': '.json',
    };

    return typeMap[contentType] || '.bin';
  }

  /**
   * Generate ETag for file
   */
  private generateETag(buffer: Buffer): string {
    const crypto = require('node:crypto');
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  /**
   * Generate signature for presigned URL
   */
  private generateSignature(key: string, action: string, expires: number): string {
    const crypto = require('node:crypto');
    const data = `${action}:${key}:${expires}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

/**
 * Create mock GCS provider instance
 */
export function createMockGCSProvider(
  bucket?: string,
  region?: string
): MockGCSProvider {
  return new MockGCSProvider(bucket, region);
}

/**
 * Test helper: Simulate network failure scenario
 */
export async function testNetworkFailureScenario(
  provider: MockGCSProvider,
  uploadFn: () => Promise<any>
): Promise<{ error: Error; retries: number }> {
  provider.setFailureMode('network');

  let retries = 0;
  let lastError: Error | null = null;

  // Try up to 3 times
  for (let i = 0; i < 3; i++) {
    try {
      await uploadFn();
      break; // Success
    } catch (error) {
      lastError = error as Error;
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000 * i)); // Exponential backoff
    }
  }

  if (!lastError) {
    throw new Error('Expected network error but upload succeeded');
  }

  return { error: lastError, retries };
}

/**
 * Test helper: Simulate service unavailable with automatic retry
 */
export async function testServiceUnavailableWithRetry(
  provider: MockGCSProvider,
  uploadFn: () => Promise<any>
): Promise<{ succeededOnRetry: number }> {
  let attemptCount = 0;

  // First two attempts fail, third succeeds
  const wrappedUpload = async () => {
    attemptCount++;
    if (attemptCount <= 2) {
      provider.setFailureMode('503');
    } else {
      provider.setFailureMode('success');
    }
    return uploadFn();
  };

  // Retry logic
  for (let i = 0; i < 3; i++) {
    try {
      await wrappedUpload();
      return { succeededOnRetry: i + 1 };
    } catch (error) {
      if (i === 2) throw error; // Max retries exceeded
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Upload failed after all retries');
}
