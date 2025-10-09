/**
 * TusFile Component Schema
 *
 * Defines the schema properties for TUS protocol-enabled file upload component.
 * This component enables resumable, chunked file uploads using the TUS protocol.
 */

export interface TusFileSchema {
  type: 'tusfile';
  key: string;
  label?: string;

  // TUS Configuration
  storage: 'tus';
  tusEndpoint: string; // TUS server endpoint URL
  chunkSize: number; // Upload chunk size in bytes (default: 5MB)
  resumable: boolean; // Enable resumable uploads

  // Upload State
  uploadId?: string; // TUS upload identifier
  fileUrl?: string; // Permanent file URL after completion
  uploadProgress?: number; // Current upload progress (0-100)

  // File Validation
  maxFileSize: number; // Maximum file size in bytes
  accept?: string[]; // Allowed MIME types
  multiple?: boolean; // Allow multiple file uploads

  // Metadata
  metadata?: {
    filename?: string;
    filetype?: string;
    filesize?: number;
    [key: string]: any;
  };

  // UI Properties
  placeholder?: string;
  description?: string;
  tooltip?: string;
  disabled?: boolean;

  // Validation
  validate?: {
    required?: boolean;
    custom?: string;
  };

  // HTML attributes
  tag?: string;
  ref?: string;
  attrs?: Array<{ attr: string; value: string }>;
  className?: string;
}

export const TusFileSchemaDefaults = {
  type: 'tusfile',
  storage: 'tus',
  chunkSize: 5 * 1024 * 1024, // 5MB default chunk size
  resumable: true,
  maxFileSize: 100 * 1024 * 1024, // 100MB default max size
  multiple: false,
  tag: 'div',
  ref: 'tusfile',
  className: 'formio-component-tusfile',
  validate: {
    required: false,
  },
};
