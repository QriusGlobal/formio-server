/**
 * UppyFile Component Schema
 *
 * Defines the schema properties for Uppy-powered file upload component.
 * This component provides a modern, plugin-based file upload experience with
 * support for multiple sources, image editing, and resumable uploads via TUS.
 */

/**
 * Webcam plugin configuration
 */
export interface WebcamOptions {
  modes?: ('picture' | 'video')[];
  videoConstraints?: {
    facingMode?: 'user' | 'environment';
    width?: { min?: number; ideal?: number; max?: number };
    height?: { min?: number; ideal?: number; max?: number };
  };
  showVideoSourceDropdown?: boolean;
  showRecordingLength?: boolean;
  preferredVideoMimeType?: string;
}

/**
 * Image Editor plugin configuration
 */
export interface ImageEditorOptions {
  quality?: number;
  cropperOptions?: {
    viewMode?: number;
    background?: boolean;
    autoCropArea?: number;
    responsive?: boolean;
    croppedCanvasOptions?: Record<string, any>;
  };
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
export interface GoogleDriveOptions {
  companionUrl: string;
  companionHeaders?: Record<string, string>;
  companionCookiesRule?: 'same-origin' | 'include';
  title?: string;
}

/**
 * Uppy plugin configuration object
 */
export interface UppyPlugins {
  webcam?: boolean | WebcamOptions;
  imageEditor?: boolean | ImageEditorOptions;
  googleDrive?: boolean | GoogleDriveOptions;
  screenCapture?: boolean;
  audio?: boolean;
  url?: boolean;
  goldenRetriever?: boolean; // Restore file state after browser crash
}

/**
 * File upload restrictions
 */
export interface UppyRestrictions {
  maxFileSize?: number;
  maxNumberOfFiles?: number;
  minNumberOfFiles?: number;
  allowedFileTypes?: string[];
  maxTotalFileSize?: number;
  requiredMetaFields?: string[];
}

/**
 * TUS protocol configuration for resumable uploads
 */
export interface TusConfig {
  endpoint?: string;
  chunkSize?: number;
  parallelUploads?: number;
  retryDelays?: number[];
  removeFingerprintOnSuccess?: boolean;
  overridePatchMethod?: boolean;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}

/**
 * Uppy Dashboard configuration
 */
export interface UppyDashboardConfig {
  inline?: boolean;
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark' | 'auto';
  note?: string;
  proudlyDisplayPoweredByUppy?: boolean;
  showProgressDetails?: boolean;
  showLinkToFileUploadResult?: boolean;
  showRemoveButtonAfterComplete?: boolean;
  hideUploadButton?: boolean;
  hideRetryButton?: boolean;
  hidePauseResumeButton?: boolean;
  hideCancelButton?: boolean;
  hideProgressAfterFinish?: boolean;
  doneButtonHandler?: string; // Function name for custom handler
  disableStatusBar?: boolean;
  disableInformer?: boolean;
  disableThumbnailGenerator?: boolean;
  disablePageScrollWhenModalOpen?: boolean;
  animateOpenClose?: boolean;
  closeModalOnClickOutside?: boolean;
  closeAfterFinish?: boolean;
  singleFileFullScreen?: boolean;
  autoOpenFileEditor?: boolean;
  disabled?: boolean;
}

/**
 * Complete UppyFile component schema extending Form.io BaseComponent
 */
export interface UppyFileSchema {
  type: 'uppyfile';
  key: string;
  label?: string;

  // Storage Configuration
  storage: 'uppy-tus' | 'uppy-xhr' | 'uppy-s3' | 'uppy-companion';

  // Uppy Core Configuration
  uppyConfig: {
    id?: string;
    autoProceed?: boolean;
    allowMultipleUploadBatches?: boolean;
    locale?: string;
    logger?: 'debug' | 'info' | 'warn' | 'error';
    restrictions?: UppyRestrictions;
    meta?: Record<string, any>;
    onBeforeFileAdded?: string; // Function name
    onBeforeUpload?: string; // Function name
    infoTimeout?: number;
  };

  // Dashboard Configuration
  dashboard?: UppyDashboardConfig;

  // Plugin Configuration
  plugins?: UppyPlugins;

  // TUS Configuration (when storage is 'uppy-tus')
  tusConfig?: TusConfig;

  // XHR Upload Configuration (when storage is 'uppy-xhr')
  xhrConfig?: {
    endpoint: string;
    method?: 'POST' | 'PUT';
    formData?: boolean;
    fieldName?: string;
    headers?: Record<string, string>;
    timeout?: number;
    limit?: number;
    withCredentials?: boolean;
    responseUrlFieldName?: string;
  };

  // S3 Configuration (when storage is 'uppy-s3')
  s3Config?: {
    companionUrl: string;
    companionHeaders?: Record<string, string>;
    limit?: number;
    timeout?: number;
    getUploadParameters?: string; // Function name
  };

  // Upload State (managed by component)
  uploadId?: string;
  fileUrls?: string[];
  uploadedFiles?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    uploadURL?: string;
    preview?: string;
    meta?: Record<string, any>;
    progress?: {
      uploadStarted: number | null;
      uploadComplete: boolean;
      percentage: number;
      bytesUploaded: number;
      bytesTotal: number;
    };
  }>;

  // Metadata
  metadata?: Record<string, any>;

  // UI Properties
  placeholder?: string;
  description?: string;
  tooltip?: string;
  disabled?: boolean;
  hidden?: boolean;

  // Validation
  validate?: {
    required?: boolean;
    custom?: string;
    customPrivate?: boolean;
    json?: any;
  };

  // Form.io Integration
  input?: boolean;
  persistent?: boolean;
  protected?: boolean;
  tableView?: boolean;

  // HTML attributes
  tag?: string;
  ref?: string;
  attrs?: Array<{ attr: string; value: string }>;
  className?: string;

  // Events Configuration
  events?: {
    fileAdded?: string;
    filesAdded?: string;
    fileRemoved?: string;
    uploadStart?: string;
    uploadProgress?: string;
    uploadSuccess?: string;
    uploadComplete?: string;
    uploadError?: string;
    uploadRetry?: string;
    uploadPause?: string;
    uploadResume?: string;
    cancel?: string;
    info?: string;
    error?: string;
  };
}

/**
 * Default schema values for UppyFile component
 */
export const UppyFileSchemaDefaults: Partial<UppyFileSchema> = {
  type: 'uppyfile',
  storage: 'uppy-tus',
  input: true,
  persistent: true,
  protected: false,
  tableView: false,

  uppyConfig: {
    autoProceed: false,
    allowMultipleUploadBatches: true,
    restrictions: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      maxNumberOfFiles: 10,
      minNumberOfFiles: 0,
      allowedFileTypes: undefined,
    },
    infoTimeout: 5000,
    meta: {},
  },

  dashboard: {
    inline: false,
    width: '100%',
    height: 400,
    theme: 'auto',
    proudlyDisplayPoweredByUppy: true,
    showProgressDetails: true,
    showLinkToFileUploadResult: true,
    showRemoveButtonAfterComplete: true,
    hideUploadButton: false,
    hideRetryButton: false,
    hidePauseResumeButton: false,
    hideCancelButton: false,
    hideProgressAfterFinish: false,
    disableStatusBar: false,
    disableInformer: false,
    disableThumbnailGenerator: false,
    disablePageScrollWhenModalOpen: true,
    animateOpenClose: true,
    closeModalOnClickOutside: false,
    closeAfterFinish: false,
    singleFileFullScreen: true,
    autoOpenFileEditor: false,
    disabled: false,
  },

  plugins: {
    webcam: false,
    imageEditor: false,
    googleDrive: false,
    screenCapture: false,
    audio: false,
    url: false,
    goldenRetriever: false,
  },

  tusConfig: {
    chunkSize: 5 * 1024 * 1024, // 5MB
    parallelUploads: 1,
    retryDelays: [0, 1000, 3000, 5000],
    removeFingerprintOnSuccess: false,
    overridePatchMethod: false,
  },

  validate: {
    required: false,
  },

  tag: 'div',
  ref: 'uppyfile',
  className: 'formio-component-uppyfile',

  uploadedFiles: [],
  fileUrls: [],
  metadata: {},
};

/**
 * Type guard to check if component is UppyFile
 */
export function isUppyFileComponent(component: any): component is UppyFileSchema {
  return component && component.type === 'uppyfile';
}

/**
 * Helper to merge user config with defaults
 */
export function createUppyFileSchema(overrides: Partial<UppyFileSchema>): UppyFileSchema {
  return {
    ...UppyFileSchemaDefaults,
    ...overrides,
    uppyConfig: {
      ...UppyFileSchemaDefaults.uppyConfig,
      ...overrides.uppyConfig,
      restrictions: {
        ...UppyFileSchemaDefaults.uppyConfig?.restrictions,
        ...overrides.uppyConfig?.restrictions,
      },
    },
    dashboard: {
      ...UppyFileSchemaDefaults.dashboard,
      ...overrides.dashboard,
    },
    plugins: {
      ...UppyFileSchemaDefaults.plugins,
      ...overrides.plugins,
    },
    tusConfig: {
      ...UppyFileSchemaDefaults.tusConfig,
      ...overrides.tusConfig,
    },
  } as UppyFileSchema;
}
