/**
 * Type Definitions for TUS File Upload Component
 */

import * as tus from 'tus-js-client';

/**
 * Upload status enum
 */
export type UploadStatus = 'pending' | 'uploading' | 'paused' | 'completed' | 'error';

/**
 * Upload progress information
 */
export interface UploadProgress {
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
}

/**
 * File in upload queue
 */
export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress: number;
  bytesUploaded?: number;
  bytesTotal?: number;
  speed?: number;
  timeRemaining?: number;
  uploadUrl?: string;
  preview?: string | null;
  error?: Error;
}

/**
 * TUS upload instance wrapper
 */
export interface TusUploadInstance {
  upload: tus.Upload;
  file: File;
  fileId: string;
}

/**
 * Hook options
 */
export interface UseTusUploadOptions {
  /**
   * TUS server endpoint URL
   */
  endpoint: string;

  /**
   * Chunk size in bytes (optional, auto-calculated if not provided)
   * Recommended: 1MB-25MB based on file size
   */
  chunkSize?: number;

  /**
   * Retry delay sequence in milliseconds
   * @default [0, 1000, 3000, 5000, 10000]
   */
  retryDelays?: number[];

  /**
   * Maximum number of parallel uploads
   * @default 3
   */
  parallelUploads?: number;

  /**
   * Additional metadata to send with upload
   */
  metadata?: Record<string, string>;

  /**
   * Progress callback
   */
  onProgress?: (fileId: string, progress: UploadProgress) => void;

  /**
   * Success callback
   */
  onSuccess?: (fileId: string, uploadUrl: string) => void;

  /**
   * Error callback
   */
  onError?: (fileId: string, error: Error) => void;
}

/**
 * Component props
 */
export interface TusFileUploadProps {
  /**
   * TUS server endpoint URL
   */
  endpoint: string;

  /**
   * Chunk size in bytes (optional)
   */
  chunkSize?: number;

  /**
   * Maximum file size in bytes
   * @default 50 * 1024 * 1024 (50MB)
   */
  maxFileSize?: number;

  /**
   * Maximum number of files
   * @default 10
   */
  maxFiles?: number;

  /**
   * Allowed file types (MIME types or extensions)
   * @example ['image/*', '.pdf', 'application/json']
   */
  allowedTypes?: string[];

  /**
   * Additional metadata to send with uploads
   */
  metadata?: Record<string, string>;

  /**
   * Success callback
   */
  onSuccess?: (files: UploadFile[]) => void;

  /**
   * Error callback
   */
  onError?: (error: Error, file?: UploadFile) => void;

  /**
   * Progress callback
   */
  onProgress?: (fileId: string, progress: UploadProgress) => void;

  /**
   * Disable upload functionality
   * @default false
   */
  disabled?: boolean;

  /**
   * Allow multiple file selection
   * @default true
   */
  multiple?: boolean;

  /**
   * Show image previews
   * @default true
   */
  showPreviews?: boolean;

  /**
   * Auto-start uploads after file selection
   * @default true
   */
  autoStart?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Form.io compatible event data
 */
export interface FormioFileEvent {
  type: 'fileUploadStart' | 'fileUploadProgress' | 'fileUploadComplete' | 'fileUploadError';
  fileId: string;
  fileName: string;
  fileSize: number;
  progress?: UploadProgress;
  uploadUrl?: string;
  error?: Error;
}