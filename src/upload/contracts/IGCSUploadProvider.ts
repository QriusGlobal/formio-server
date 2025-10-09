/**
 * GCS Upload Provider Contract
 *
 * Defines the interface for GCS upload operations with dependency injection support.
 * Enables testing with mocked providers and ensures contract compliance.
 */

import { Readable } from 'stream';

export interface IGCSUploadOptions {
  /** Chunk size for multipart upload (default 8MB) */
  chunkSize?: number;

  /** Validation method (default 'crc32c') */
  validation?: 'crc32c' | 'md5';

  /** Predefined ACL for uploaded file */
  acl?: 'projectPrivate' | 'publicRead' | 'authenticatedRead';

  /** Cache control header */
  cacheControl?: string;

  /** Progress callback function */
  onProgress?: (progress: IGCSUploadProgress) => void;
}

export interface IGCSUploadProgress {
  /** Bytes uploaded so far */
  loaded: number;

  /** Total bytes to upload */
  total: number;

  /** Upload percentage (0-100) */
  percentage: number;
}

export interface IGCSUploadResult {
  /** GCS file key/path */
  key: string;

  /** Public/signed URL to access file */
  location: string;

  /** GCS bucket name */
  bucket: string;

  /** File ETag for caching */
  etag?: string;

  /** File size in bytes */
  size: number;

  /** Content type */
  contentType?: string;

  /** CRC32C checksum */
  crc32c?: string;

  /** Creation timestamp */
  timeCreated?: string;

  /** Last update timestamp */
  updated?: string;
}

export interface IGCSFileMetadata {
  /** Storage key/path for the file */
  key: string;

  /** MIME type */
  contentType: string;

  /** Form.io form ID */
  formId?: string;

  /** Form.io submission ID */
  submissionId?: string;

  /** TUS upload ID reference */
  uploadId?: string;

  /** Original filename */
  originalName?: string;
}

export interface IGCSUploadProvider {
  /**
   * Upload file to GCS with resumable multipart streaming
   *
   * @param stream Readable stream of file data
   * @param metadata File metadata
   * @param options Upload options
   * @returns Upload result with location and metadata
   */
  multipartUpload(
    stream: Readable,
    metadata: IGCSFileMetadata,
    options?: IGCSUploadOptions
  ): Promise<IGCSUploadResult>;

  /**
   * Generate signed URL for file access
   *
   * @param key GCS file key/path
   * @param operation Operation type ('read' or 'write')
   * @param expiry URL expiration in seconds
   * @param options Additional options
   * @returns Signed URL
   */
  generatePresignedUrl(
    key: string,
    operation: 'read' | 'write',
    expiry?: number,
    options?: { contentType?: string }
  ): Promise<string>;

  /**
   * Delete file from GCS
   *
   * @param key GCS file key/path
   * @returns Deletion confirmation
   */
  delete(key: string): Promise<void>;

  /**
   * Get file metadata without downloading
   *
   * @param key GCS file key/path
   * @returns File metadata
   */
  headObject(key: string): Promise<{
    key: string;
    size: number;
    etag: string;
    contentType: string;
    lastModified: string;
  }>;
}
