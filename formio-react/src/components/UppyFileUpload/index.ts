/**
 * UppyFileUpload Component Exports
 *
 * Main entry point for the UppyFileUpload component.
 * Exports component, types, hook, and examples.
 */

// Main component
export { UppyFileUpload, UppyFileUpload as default } from './UppyFileUpload';

// Custom hook
export { useUppy } from './useUppy';

// TypeScript types
export type {
  UppyFileUploadProps,
  UppyFileUploadHandle,
  UppyPluginType,
  UploadStatus,
  DashboardMode,
  UploadProgress,
  UploadFileResult,
  UploadError,
  TusConfig,
  DashboardConfig,
  WebcamConfig,
  ImageEditorConfig,
  GoogleDriveConfig,
  ScreenCaptureConfig,
  AudioConfig,
  UrlConfig,
  PluginConfigs,
  FileRestrictions,
  FormioUploadEvent,
  UppyState,
  UseUppyReturn,
} from './UppyFileUpload.types';

// Examples (for documentation and testing)
export {
  UppyFileUploadExamples,
  BasicUploadExample,
  WebcamUploadExample,
  ImageEditorExample,
  GoogleDriveExample,
  FullFeaturedExample,
  FormioIntegrationExample,
  ModalModeExample,
  ProgrammaticControlExample,
} from './UppyFileUpload.example';

/**
 * Re-export Uppy types for convenience
 */
export type { Uppy, UppyFile, UploadResult } from '@uppy/core';