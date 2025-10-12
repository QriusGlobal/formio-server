/**
 * Uppy Configuration for TUS File Uploads
 *
 * This configuration file contains all settings for Uppy file uploads
 * with TUS protocol integration for resumable uploads.
 */

export interface UppyConfigOptions {
  /**
   * TUS server endpoint URL
   * Default: http://localhost:1080/files/
   */
  tusEndpoint?: string;

  /**
   * Maximum file size in bytes
   * Default: 100MB
   */
  maxFileSize?: number;

  /**
   * Maximum number of files
   * Default: 10
   */
  maxNumberOfFiles?: number;

  /**
   * Allowed file types (MIME types or extensions)
   * Default: null (all types allowed)
   */
  allowedFileTypes?: string[] | null;

  /**
   * Minimum number of files required
   * Default: null (no minimum)
   */
  minNumberOfFiles?: number | null;

  /**
   * Retry delays for failed uploads (in milliseconds)
   * Default: [0, 1000, 3000, 5000]
   */
  retryDelays?: number[];

  /**
   * Auto-proceed after file selection
   * Default: false
   */
  autoProceed?: boolean;

  /**
   * Allow multiple uploads
   * Default: true
   */
  allowMultipleUploads?: boolean;

  /**
   * Debug mode for Uppy
   * Default: false (true in development)
   */
  debug?: boolean;
}

/**
 * Default Uppy configuration for TUS uploads
 */
export const defaultUppyConfig: Required<UppyConfigOptions> = {
  tusEndpoint: 'http://localhost:1080/files/',
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxNumberOfFiles: 10,
  allowedFileTypes: null, // Allow all file types
  minNumberOfFiles: null,
  retryDelays: [0, 1000, 3000, 5000],
  autoProceed: false,
  allowMultipleUploads: true,
  debug: process.env.NODE_ENV === 'development'
};

/**
 * Uppy restrictions object
 */
export const getUppyRestrictions = (config: UppyConfigOptions = {}) => {
  const mergedConfig = { ...defaultUppyConfig, ...config };

  return {
    maxFileSize: mergedConfig.maxFileSize,
    maxNumberOfFiles: mergedConfig.maxNumberOfFiles,
    minNumberOfFiles: mergedConfig.minNumberOfFiles,
    allowedFileTypes: mergedConfig.allowedFileTypes
  };
};

/**
 * TUS plugin options
 */
export const getTusOptions = (config: UppyConfigOptions = {}) => {
  const mergedConfig = { ...defaultUppyConfig, ...config };

  return {
    endpoint: mergedConfig.tusEndpoint,
    retryDelays: mergedConfig.retryDelays,
    // Additional TUS-specific options
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
    removeFingerprintOnSuccess: true,
    withCredentials: false
  };
};

/**
 * Uppy Dashboard UI options
 */
export const getDashboardOptions = () => ({
  inline: true,
  height: 400,
  width: '100%',
  showProgressDetails: true,
  note: 'Upload files using resumable TUS protocol',
  proudlyDisplayPoweredByUppy: false,
  theme: 'light'
});

/**
 * Create Uppy instance with TUS configuration
 */
export const createUppyInstance = (
  Uppy: typeof import('@uppy/core').Uppy,
  config: UppyConfigOptions = {}
) => {
  const mergedConfig = { ...defaultUppyConfig, ...config };

  return new Uppy({
    debug: mergedConfig.debug,
    autoProceed: mergedConfig.autoProceed,
    allowMultipleUploads: mergedConfig.allowMultipleUploads,
    restrictions: getUppyRestrictions(config),
    meta: {
      source: 'formio-tus-uploader'
    }
  });
};

/**
 * File type presets for common use cases
 */
export const FILE_TYPE_PRESETS = {
  images: ['image/*'],
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  spreadsheets: ['.xls', '.xlsx', '.csv'],
  presentations: ['.ppt', '.pptx'],
  archives: ['.zip', '.rar', '.7z', '.tar', '.gz'],
  videos: ['video/*'],
  audio: ['audio/*'],
  all: null
} as const;

/**
 * Size presets for common use cases
 */
export const SIZE_PRESETS = {
  small: 10 * 1024 * 1024, // 10MB
  medium: 50 * 1024 * 1024, // 50MB
  large: 100 * 1024 * 1024, // 100MB
  xlarge: 500 * 1024 * 1024, // 500MB
  xxlarge: 1024 * 1024 * 1024 // 1GB
} as const;
