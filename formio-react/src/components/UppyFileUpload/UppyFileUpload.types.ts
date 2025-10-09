/**
 * TypeScript type definitions for UppyFileUpload component
 *
 * Provides comprehensive types for:
 * - Component props and configuration
 * - Uppy event types
 * - Plugin configurations
 * - Form.io integration types
 * - Upload state management
 */

import type Uppy from '@uppy/core';
import type { UppyFile, UploadResult } from '@uppy/core';
import type { DashboardOptions } from '@uppy/dashboard';
import type { TusOptions } from '@uppy/tus';
import type { WebcamOptions } from '@uppy/webcam';

// Define response types for Uppy 5.x compatibility
export interface SuccessResponse {
  body?: any;
  status?: number;
  uploadURL?: string;
}

export interface ErrorResponse {
  body?: any;
  status?: number;
}

/**
 * Supported Uppy plugins for file upload enhancement
 */
export type UppyPluginType =
  | 'Webcam'
  | 'ImageEditor'
  | 'GoogleDrive'
  | 'ScreenCapture'
  | 'Audio'
  | 'Url';

/**
 * Upload status enum matching Form.io patterns
 */
export type UploadStatus =
  | 'pending'
  | 'uploading'
  | 'paused'
  | 'completed'
  | 'error'
  | 'cancelled';

/**
 * Dashboard display mode
 */
export type DashboardMode = 'inline' | 'modal';

/**
 * Upload progress information
 */
export interface UploadProgress {
  /** File identifier */
  fileId: string;
  /** File name */
  fileName: string;
  /** Bytes uploaded so far */
  bytesUploaded: number;
  /** Total bytes to upload */
  bytesTotal: number;
  /** Upload percentage (0-100) */
  percentage: number;
  /** Upload speed in bytes per second */
  speed?: number;
  /** Estimated time remaining in seconds */
  timeRemaining?: number;
  /** Current upload status */
  status: UploadStatus;
}

/**
 * Upload result for completed files
 */
export interface UploadFileResult {
  /** File identifier */
  id: string;
  /** Original file name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload URL from server */
  uploadURL: string;
  /** Server response data */
  response?: SuccessResponse;
  /** File metadata */
  meta?: Record<string, unknown>;
}

/**
 * Error information for failed uploads
 */
export interface UploadError {
  /** File that failed */
  file: UppyFile<any, any>;
  /** Error object */
  error: Error;
  /** Error response from server */
  response?: ErrorResponse;
}

/**
 * TUS configuration options
 */
export interface TusConfig {
  /** TUS server endpoint */
  endpoint: string;
  /** Chunk size in bytes (default: 5MB) */
  chunkSize?: number;
  /** Retry delays in milliseconds */
  retryDelays?: number[];
  /** Remove fingerprint after successful upload */
  removeFingerprintOnSuccess?: boolean;
  /** Additional headers for requests */
  headers?: Record<string, string>;
  /** Metadata to send with upload */
  metadata?: Record<string, string>;
  /** Whether to use multiple parallel uploads */
  parallelUploads?: number;
  /** Upload timeout in milliseconds */
  timeout?: number;
}

/**
 * Dashboard UI configuration
 */
export interface DashboardConfig {
  /** Display mode: inline or modal */
  mode?: DashboardMode;
  /** Dashboard height in pixels (inline mode) */
  height?: number;
  /** Dashboard width in pixels or percentage (inline mode) */
  width?: string | number;
  /** Show detailed progress information */
  showProgressDetails?: boolean;
  /** Show file type and size restrictions */
  showSelectedFiles?: boolean;
  /** Hide cancel button */
  hideCancelButton?: boolean;
  /** Hide pause/resume button */
  hideRetryButton?: boolean;
  /** Hide progress after upload */
  hideProgressAfterFinish?: boolean;
  /** Note to display above file picker */
  note?: string;
  /** Show Uppy branding */
  proudlyDisplayPoweredByUppy?: boolean;
  /** Disable status bar */
  hideUploadButton?: boolean;
  /** Disable informer (notifications) */
  disableInformer?: boolean;
  /** Theme: light or dark */
  theme?: 'light' | 'dark';
  /** Enable animations */
  animateOpenClose?: boolean;
  /** Close modal on click outside */
  closeModalOnClickOutside?: boolean;
  /** Disable local files */
  disableLocalFiles?: boolean;
}

/**
 * Webcam plugin configuration
 */
export interface WebcamConfig {
  /** Countdown before capture (seconds) */
  countdown?: number | false;
  /** Capture mode: video or picture */
  modes?: ('video-audio' | 'video-only' | 'audio-only' | 'picture')[];
  /** Video constraints */
  videoConstraints?: MediaTrackConstraints;
  /** Show video source select */
  showVideoSourceDropdown?: boolean;
  /** Preferred video MIME type */
  preferredVideoMimeType?: string | null;
  /** Preferred image MIME type */
  preferredImageMimeType?: string | null;
}

/**
 * Image Editor plugin configuration
 */
export interface ImageEditorConfig {
  /** Quality for JPEG compression (0-1) */
  quality?: number;
  /** Enable crop tool */
  cropperOptions?: {
    viewMode?: number;
    aspectRatio?: number;
    autoCropArea?: number;
  };
  /** Available actions */
  actions?: {
    revert?: boolean;
    rotate?: boolean;
    granularRotate?: boolean;
    flip?: boolean;
    zoomIn?: boolean;
    zoomOut?: boolean;
    cropSquare?: boolean;
    cropWidescreen?: boolean;
    cropWidescreenVertical?: boolean;
  };
}

/**
 * Google Drive plugin configuration
 */
export interface GoogleDriveConfig {
  /** Companion server URL for OAuth */
  companionUrl: string;
  /** Allowed authentication providers */
  companionAllowedHosts?: string[];
  /** Custom headers for companion requests */
  companionHeaders?: Record<string, string>;
}

/**
 * Screen Capture plugin configuration
 */
export interface ScreenCaptureConfig {
  /** Display surface type */
  displayMediaConstraints?: {
    video?: MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
  };
  /** Preferred video MIME type */
  preferredVideoMimeType?: string;
  /** User-facing label */
  title?: string;
}

/**
 * Audio plugin configuration
 */
export interface AudioConfig {
  /** Show recording timer */
  showRecordingLength?: boolean;
  /** Audio constraints */
  audioConstraints?: MediaTrackConstraints;
  /** Show visualizer */
  showAudioSourceDropdown?: boolean;
}

/**
 * URL import plugin configuration
 */
export interface UrlConfig {
  /** Companion server URL */
  companionUrl: string;
  /** Allowed hosts for companion */
  companionAllowedHosts?: string[];
}

/**
 * Plugin configurations map
 */
export interface PluginConfigs {
  Webcam?: WebcamConfig;
  ImageEditor?: ImageEditorConfig;
  GoogleDrive?: GoogleDriveConfig;
  ScreenCapture?: ScreenCaptureConfig;
  Audio?: AudioConfig;
  Url?: UrlConfig;
}

/**
 * File restrictions configuration
 */
export interface FileRestrictions {
  /** Maximum file size in bytes */
  maxFileSize?: number | null;
  /** Minimum file size in bytes */
  minFileSize?: number | null;
  /** Maximum number of files */
  maxNumberOfFiles?: number | null;
  /** Minimum number of files */
  minNumberOfFiles?: number | null;
  /** Allowed file types (MIME types or extensions) */
  allowedFileTypes?: string[] | null;
  /** Required meta fields */
  requiredMetaFields?: string[];
}

/**
 * Form.io event payload for upload events
 */
export interface FormioUploadEvent {
  /** Event type */
  type: 'uppyfile.upload.start' | 'uppyfile.upload.progress' | 'uppyfile.upload.complete' | 'uppyfile.upload.error' | 'uppyfile.upload.cancel';
  /** File information */
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
  };
  /** Progress information (for progress events) */
  progress?: UploadProgress;
  /** Upload result (for complete events) */
  result?: UploadFileResult;
  /** Error information (for error events) */
  error?: UploadError;
  /** Timestamp */
  timestamp: number;
}

/**
 * Main component props for UppyFileUpload
 */
export interface UppyFileUploadProps {
  /**
   * TUS endpoint configuration (required)
   */
  tusConfig: TusConfig;

  /**
   * Dashboard UI configuration
   * @default { mode: 'inline', height: 400, showProgressDetails: true }
   */
  dashboardConfig?: DashboardConfig;

  /**
   * File restrictions
   * @default { maxFileSize: 50MB, maxNumberOfFiles: 10 }
   */
  restrictions?: FileRestrictions;

  /**
   * Plugins to enable
   * @default []
   */
  plugins?: UppyPluginType[];

  /**
   * Plugin-specific configurations
   */
  pluginConfigs?: PluginConfigs;

  /**
   * File metadata to include with uploads
   */
  metadata?: Record<string, unknown>;

  /**
   * Auto-start uploads when files are added
   * @default false
   */
  autoProceed?: boolean;

  /**
   * Allow multiple file selection
   * @default true
   */
  allowMultipleUploads?: boolean;

  /**
   * Locale for internationalization
   * @default 'en_US'
   */
  locale?: string;

  /**
   * Custom locale strings
   */
  localeStrings?: Record<string, Record<string, string>>;

  /**
   * Enable debug mode
   * @default false
   */
  debug?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom CSS class for container
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;

  /**
   * ID for the Uppy instance (for multiple instances)
   */
  id?: string;

  /**
   * Event Handlers
   */

  /**
   * Called when a file is added
   */
  onFileAdded?: (file: UppyFile<any, any>) => void;

  /**
   * Called when a file is removed
   */
  onFileRemoved?: (file: UppyFile<any, any>) => void;

  /**
   * Called when upload starts
   */
  onUploadStart?: (data: { id: string; fileIDs: string[] }) => void;

  /**
   * Called on upload progress
   */
  onProgress?: (progress: UploadProgress) => void;

  /**
   * Called when a file upload succeeds
   */
  onUploadSuccess?: (file: UploadFileResult) => void;

  /**
   * Called when a file upload fails
   */
  onUploadError?: (error: UploadError) => void;

  /**
   * Called when all uploads complete
   */
  onComplete?: (result: { successful: UploadFileResult[]; failed: UploadError[] }) => void;

  /**
   * Called when upload is cancelled
   */
  onCancel?: (fileId: string) => void;

  /**
   * Called when upload is paused
   */
  onPause?: (fileId: string) => void;

  /**
   * Called when upload is resumed
   */
  onResume?: (fileId: string) => void;

  /**
   * Custom Form.io event handler
   * Receives all Form.io-compatible events
   */
  onFormioEvent?: (event: FormioUploadEvent) => void;
}

/**
 * Uppy instance state
 */
export interface UppyState {
  /** Files in the upload queue */
  files: Array<UppyFile<any, any>>;
  /** Current upload state */
  currentUploads: Record<string, UploadProgress>;
  /** Total files count */
  totalFileCount: number;
  /** Total progress percentage */
  totalProgress: number;
  /** Upload speed in bytes per second */
  uploadSpeed: number;
  /** Whether uploads are in progress */
  isUploading: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Hook return type for useUppy
 */
export interface UseUppyReturn {
  /** Uppy instance */
  uppy: Uppy | null;
  /** Current state */
  state: UppyState;
  /** Upload files programmatically */
  upload: () => void;
  /** Cancel all uploads */
  cancelAll: () => void;
  /** Pause all uploads */
  pauseAll: () => void;
  /** Resume all uploads */
  resumeAll: () => void;
  /** Reset Uppy (clear all files) */
  reset: () => void;
  /** Add files programmatically */
  addFiles: (files: File[]) => void;
  /** Remove file by ID */
  removeFile: (fileId: string) => void;
  /** Get file by ID */
  getFile: (fileId: string) => UppyFile<any, any> | undefined;
  /** Set file metadata */
  setFileMeta: (fileId: string, data: Record<string, unknown>) => void;
}

/**
 * Component method handles (for ref)
 */
export interface UppyFileUploadHandle {
  /** Uppy instance */
  uppy: Uppy | null;
  /** Open dashboard (modal mode) */
  openModal: () => void;
  /** Close dashboard (modal mode) */
  closeModal: () => void;
  /** Trigger file upload */
  upload: () => void;
  /** Cancel all uploads */
  cancelAll: () => void;
  /** Reset component state */
  reset: () => void;
}

/**
 * Export all types
 * Note: SuccessResponse and ErrorResponse are defined locally, not re-exported from @uppy/core
 */
export type {
  Uppy,
  UppyFile,
  UploadResult,
  DashboardOptions,
  TusOptions,
  WebcamOptions,
};