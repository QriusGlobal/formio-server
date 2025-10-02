/**
 * TypeScript type definitions for Form.io components and schemas
 */

export interface FormioComponent {
  type: string;
  key: string;
  label: string;
  input: boolean;
  [key: string]: unknown;
}

export interface FormioFileComponent extends FormioComponent {
  type: 'file';
  storage?: string;
  url?: string;
  options?: {
    withCredentials?: boolean;
  };
  fileKey?: string;
  dir?: string;
  fileNameTemplate?: string;
  image?: boolean;
  imageSize?: string;
  webcam?: boolean;
  filePattern?: string;
  fileMinSize?: string;
  fileMaxSize?: string;
}

/**
 * DEPRECATED: TUS is not a valid Form.io storage type.
 * Use FormioFileComponent with storage: 'url' instead.
 *
 * For TUS uploads, use the FormioTusUploader component which
 * separates Uppy file uploads from Form.io form fields.
 */
export interface FormioTusUploadComponent extends FormioFileComponent {
  /** @deprecated Use 'url' storage type with custom endpoint */
  storage: 'tus';
  /** @deprecated Configure via UppyConfig instead */
  tusEndpoint: string;
  /** @deprecated Configure via UppyConfig instead */
  tusChunkSize?: number;
  /** @deprecated Configure via UppyConfig instead */
  tusRetryDelays?: number[];
  uppyConfig?: {
    maxFileSize?: number;
    maxNumberOfFiles?: number;
    allowedFileTypes?: string[];
    autoProceed?: boolean;
    debug?: boolean;
  };
}

export interface FormioSchema {
  title?: string;
  display: 'form' | 'wizard' | 'pdf';
  components: FormioComponent[];
  type?: string;
  tags?: string[];
  owner?: string;
  access?: unknown[];
  submissionAccess?: unknown[];
  settings?: Record<string, unknown>;
}

export interface FormioSubmission {
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  state?: 'submitted' | 'draft';
}

export interface FormioSubmissionResult {
  _id: string;
  data: Record<string, unknown>;
  created: string;
  modified: string;
  state: string;
  [key: string]: unknown;
}

export interface FormioFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  storage?: string;
  originalName?: string;
}

export interface FormioError {
  message: string;
  path?: string;
  type?: string;
}

export interface FormioEvent {
  type: string;
  component?: FormioComponent;
  data?: unknown;
  error?: FormioError;
}

export interface FormioOptions {
  readOnly?: boolean;
  noAlerts?: boolean;
  i18n?: Record<string, unknown>;
  template?: string;
  saveDraft?: boolean;
  [key: string]: unknown;
}

export interface UppyFile {
  id: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  data: Blob | File;
  progress?: {
    uploadStarted: number;
    uploadComplete: boolean;
    percentage: number;
    bytesUploaded: number;
    bytesTotal: number;
  };
  uploadURL?: string;
  [key: string]: unknown;
}

export interface UppyUploadResult {
  successful: UppyFile[];
  failed: UppyFile[];
}