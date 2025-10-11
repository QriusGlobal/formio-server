/**
 * TypeScript Type Definitions for Playwright Tests
 */

import { Page, Locator, APIRequestContext } from '@playwright/test';

/**
 * Test File Information
 */
export interface TestFile {
  path: string;
  size: number;
  filename: string;
  mimeType: string;
  hash: string;
}

/**
 * Upload Result
 */
export interface UploadResult {
  success: boolean;
  filename?: string;
  url?: string;
  size?: number;
  error?: string;
  uploadTime?: number;
}

/**
 * GCS Verification Result
 */
export interface GCSVerification {
  exists: boolean;
  size?: number;
  contentType?: string;
  metadata?: Record<string, string>;
  etag?: string;
}

/**
 * Upload Progress Information
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  bytesPerSecond?: number;
  estimatedTimeRemaining?: number;
}

/**
 * Form.io Event Data
 */
export interface FormioEvent {
  type: string;
  timestamp: number;
  data: any;
}

/**
 * Form.io Submission
 */
export interface FormioSubmission {
  _id: string;
  data: Record<string, any>;
  created: string;
  modified: string;
  form?: string;
  owner?: string;
}

/**
 * TUS Upload Options
 */
export interface TusUploadOptions {
  chunkSize?: number;
  retryDelays?: number[];
  parallelUploads?: number;
  removeFingerprintOnSuccess?: boolean;
  endpoint?: string;
  metadata?: Record<string, string>;
}

/**
 * TUS Upload Statistics
 */
export interface TusUploadStats {
  totalBytes: number;
  uploadedBytes: number;
  chunkSize: number;
  chunksUploaded: number;
  totalChunks: number;
  percentage: number;
  uploadSpeed?: number;
}

/**
 * Uppy Configuration Options
 */
export interface UppyOptions {
  autoProceed?: boolean;
  allowMultipleUploads?: boolean;
  debug?: boolean;
  restrictions?: UppyRestrictions;
  meta?: Record<string, string>;
}

/**
 * Uppy File Restrictions
 */
export interface UppyRestrictions {
  maxFileSize?: number;
  maxNumberOfFiles?: number;
  minNumberOfFiles?: number;
  allowedFileTypes?: string[];
  maxTotalFileSize?: number;
}

/**
 * Uppy File Information
 */
export interface UppyFile {
  id: string;
  name: string;
  size: number;
  type: string;
  extension?: string;
  progress?: {
    uploadStarted: number;
    uploadComplete: boolean;
    percentage: number;
    bytesUploaded: number;
    bytesTotal: number;
  };
  error?: string;
  preview?: string;
}

/**
 * Uppy State
 */
export interface UppyState {
  files: Record<string, UppyFile>;
  currentUploads: Record<string, any>;
  totalProgress: number;
  error?: string;
  info?: {
    isHidden: boolean;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
  };
}

/**
 * Test Environment Configuration
 */
export interface TestEnvironment {
  baseURL: string;
  formioURL: string;
  gcsURL: string;
  gcsBucket: string;
  formPath?: string;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  uploadTime: number;
  firstByteTime: number;
  throughput: number;
  chunkCount?: number;
  retryCount?: number;
  networkErrors?: number;
}

/**
 * Test Configuration
 */
export interface TestConfig {
  timeout: number;
  retries: number;
  parallel: boolean;
  browsers: string[];
  headless: boolean;
}

/**
 * Cleanup Options
 */
export interface CleanupOptions {
  cleanGCS?: boolean;
  cleanSubmissions?: boolean;
  cleanLocalFiles?: boolean;
  prefix?: string;
}

/**
 * API Helper Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * File Upload Component Props (for Form.io)
 */
export interface FileUploadComponentProps {
  key: string;
  type: 'file';
  label?: string;
  multiple?: boolean;
  storage?: 'base64' | 'url' | 's3' | 'gcs';
  url?: string;
  fileMaxSize?: string;
  fileMinSize?: string;
  filePattern?: string;
  uploadOnly?: boolean;
}

/**
 * Extended Window Interface for Form.io
 */
export interface FormioWindow extends Window {
  Formio?: {
    currentForm?: any;
    registerPlugin?: (plugin: any, name: string) => void;
  };
  __formioEvents?: FormioEvent[];
  __tusUpload?: any;
  __tusOptions?: TusUploadOptions;
  __uppy?: any;
}

/**
 * Test Assertion Helpers
 */
export interface AssertionHelpers {
  expectUploadSuccess: (result: UploadResult) => void;
  expectFileInGCS: (verification: GCSVerification, filename: string) => void;
  expectProgressIncreasing: (progress: UploadProgress[]) => void;
  expectNoErrors: (errors: Record<string, string[]>) => void;
}

/**
 * Browser Context with Custom Properties
 */
export interface TestContext {
  page: Page;
  request: APIRequestContext;
  testFiles: Record<string, TestFile>;
  environment: TestEnvironment;
}

/**
 * Visual Regression Test Options
 */
export interface VisualTestOptions {
  fullPage?: boolean;
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  maxDiffPixels?: number;
  threshold?: number;
  animations?: 'disabled' | 'allow';
}

/**
 * Network Simulation Options
 */
export interface NetworkSimulation {
  offline?: boolean;
  downloadThroughput?: number;
  uploadThroughput?: number;
  latency?: number;
}

/**
 * Test Scenario Configuration
 */
export interface TestScenario {
  name: string;
  description: string;
  tags: string[];
  files: TestFile[];
  options?: TusUploadOptions | UppyOptions;
  expectedResult: 'success' | 'failure';
  timeout?: number;
}

/**
 * Memory Storage Interface
 */
export interface MemoryStorage {
  key: string;
  value: any;
  namespace: string;
  timestamp: number;
  ttl?: number;
}