/**
 * FormioTusUploader - Form.io React Component with Uppy TUS Integration
 *
 * This component wraps Form.io's React renderer and integrates Uppy
 * for file uploads using the TUS (resumable upload) protocol.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Form } from '@formio/react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import { Dashboard } from '@uppy/react';

// Uppy styles
import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

// Error boundary for crash protection
import { ErrorBoundary } from './ErrorBoundary';

// Local imports
import {
  createUppyInstance,
  getTusOptions,
  getDashboardOptions,
  type UppyConfigOptions,
} from '../config/uppy-config';
import type {
  FormioSchema,
  FormioSubmission,
  FormioFile,
  UppyFile,
} from '../types/formio';

export interface FormioTusUploaderProps {
  /**
   * Form.io form schema definition (without file components)
   */
  form: FormioSchema;

  /**
   * Initial submission data
   */
  submission?: FormioSubmission;

  /**
   * Uppy configuration options
   */
  uppyConfig?: UppyConfigOptions;

  /**
   * Callback fired when form is submitted with file data
   */
  onSubmit?: (submission: FormioSubmission & { files: FormioFile[] }) => void;

  /**
   * Callback fired on form errors
   */
  onError?: (errors: unknown) => void;

  /**
   * Callback fired on form change
   */
  onChange?: (submission: Partial<FormioSubmission>) => void;

  /**
   * Callback fired when file upload starts
   */
  onUploadStart?: (files: UppyFile[]) => void;

  /**
   * Callback fired on upload progress
   */
  onUploadProgress?: (progress: number) => void;

  /**
   * Callback fired when upload completes
   */
  onUploadComplete?: (results: { successful: UppyFile[]; failed: UppyFile[] }) => void;

  /**
   * Form.io options
   */
  options?: Record<string, unknown>;

  /**
   * Custom class name for the wrapper
   */
  className?: string;

  /**
   * Field name for storing uploaded files in form submission
   * Default: 'files'
   */
  fileFieldName?: string;

  /**
   * Whether to disable form submit until uploads complete
   * Default: true
   */
  requireUploadComplete?: boolean;
}

/**
 * FormioTusUploader Component
 */
export function FormioTusUploader({
  form,
  submission,
  uppyConfig = {},
  onSubmit,
  onError,
  onChange,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  options = {},
  className = '',
  fileFieldName = 'files',
  requireUploadComplete = true,
}: FormioTusUploaderProps) {
  // State management
  const [uploadedFiles, setUploadedFiles] = useState<FormioFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formSubmission, setFormSubmission] = useState<Partial<FormioSubmission>>(
    submission || { data: {} }
  );

  // Uppy instance ref (persists across renders)
  const uppyRef = useRef<Uppy | null>(null);

  // Refs for callbacks to prevent memory leaks
  const onUploadStartRef = useRef(onUploadStart);
  const onUploadProgressRef = useRef(onUploadProgress);
  const onUploadCompleteRef = useRef(onUploadComplete);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onUploadStartRef.current = onUploadStart;
    onUploadProgressRef.current = onUploadProgress;
    onUploadCompleteRef.current = onUploadComplete;
    onErrorRef.current = onError;
  }, [onUploadStart, onUploadProgress, onUploadComplete, onError]);

  /**
   * Initialize Uppy instance (only once)
   */
  useEffect(() => {
    // Create Uppy instance with TUS plugin
    const uppyInstance = createUppyInstance(Uppy, uppyConfig);

    // Add TUS plugin for resumable uploads
    uppyInstance.use(Tus, getTusOptions(uppyConfig));

    // Event: Upload started
    uppyInstance.on('upload', (data) => {
      setIsUploading(true);
      setUploadProgress(0);
      const files = data.fileIDs.map((id) => uppyInstance.getFile(id));
      onUploadStartRef.current?.(files);
      console.log('📤 Upload started:', data);
    });

    // Event: Upload progress
    uppyInstance.on('progress', (progress) => {
      setUploadProgress(progress);
      onUploadProgressRef.current?.(progress);
      console.log(`📊 Upload progress: ${progress}%`);
    });

    // Event: Upload success for individual file
    uppyInstance.on('upload-success', (file, response) => {
      console.log('✅ File uploaded successfully:', file?.name, response);
      if (file) {
        // Convert Uppy file to Form.io file format
        const formioFile: FormioFile = {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: file.uploadURL || '',
          storage: 'url',
          originalName: file.name,
        };

        setUploadedFiles((prev) => [...prev, formioFile]);
      }
    });

    // Event: Upload complete (all files)
    uppyInstance.on('complete', (result) => {
      setIsUploading(false);
      setUploadProgress(100);
      onUploadCompleteRef.current?.(result);
      console.log('🎉 All uploads complete:', result);
    });

    // Event: Upload error
    uppyInstance.on('upload-error', (file, error, response) => {
      console.error('❌ Upload error:', file?.name, error, response);
      setIsUploading(false);
    });

    // Event: Error
    uppyInstance.on('error', (error) => {
      console.error('❌ Uppy error:', error);
      onErrorRef.current?.(error);
    });

    uppyRef.current = uppyInstance;

    // Cleanup on unmount
    return () => {
      uppyInstance.close();
    };
  }, []); // Empty dependency array - only initialize once

  /**
   * Handle form submission
   * Prevents submission if uploads are in progress (when requireUploadComplete is true)
   */
  const handleSubmit = useCallback(
    (submittedData: FormioSubmission) => {
      console.log('📝 Form submitted:', submittedData);

      // Check if uploads are still in progress
      if (requireUploadComplete && isUploading) {
        const error = new Error('Please wait for file uploads to complete before submitting');
        console.error('❌ Submission blocked:', error.message);
        onError?.(error);
        return;
      }

      // Merge uploaded files into submission using configurable field name
      const enrichedSubmission = {
        ...submittedData,
        data: {
          ...submittedData.data,
        },
        files: uploadedFiles, // Separate files array for clarity
      };

      onSubmit?.(enrichedSubmission);
    },
    [uploadedFiles, isUploading, requireUploadComplete, fileFieldName, onSubmit, onError]
  );

  /**
   * Handle form changes
   */
  const handleChange = useCallback(
    (changed: { data: Record<string, unknown> }) => {
      setFormSubmission(changed);
      onChange?.(changed);
    },
    [onChange]
  );

  /**
   * Handle form errors
   */
  const handleError = useCallback(
    (errors: unknown) => {
      console.error('❌ Form validation errors:', errors);
      onError?.(errors);
    },
    [onError]
  );

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('FormioTusUploader error:', error, errorInfo);
        onError?.(error);
      }}
    >
      <div className={`formio-tus-uploader ${className}`}>
      {/* Upload Status with Warning */}
      {isUploading && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            background: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffc107',
          }}
          role="alert"
          aria-live="polite"
        >
          <strong>⚠️ Upload in progress...</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#856404' }}>
            {requireUploadComplete && 'Please wait for uploads to complete before submitting the form.'}
          </p>
          <div
            style={{
              marginTop: '8px',
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
            role="progressbar"
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: '#ffc107',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px', color: '#856404' }}>
            {uploadProgress.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Uppy Dashboard */}
      {uppyRef.current && (
        <div style={{ marginBottom: '24px' }}>
          <Dashboard
            uppy={uppyRef.current}
            {...getDashboardOptions()}
            proudlyDisplayPoweredByUppy={false}
          />

          {/* Hidden file input for E2E test automation */}
          <input
            type="file"
            data-testid="uppy-file-input"
            multiple
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
              width: 0,
              height: 0
            }}
            onChange={(e) => {
              if (e.target.files && uppyRef.current) {
                const filesArray = Array.from(e.target.files);
                filesArray.forEach(file => {
                  try {
                    uppyRef.current?.addFile({
                      name: file.name,
                      type: file.type,
                      data: file,
                    });
                  } catch (err) {
                    console.error('Error adding file to Uppy:', err);
                  }
                });
              }
            }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Form.io Form */}
      <div style={{ marginTop: '24px' }}>
        <Form
          form={form}
          submission={formSubmission}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onError={handleError}
          options={options}
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {uploadedFiles.map((file) => (
              <li key={file.id} style={{ marginBottom: '8px' }}>
                <strong>{file.name}</strong>
                <span style={{ color: '#666', fontSize: '14px', marginLeft: '8px' }}>
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
                {file.uploadURL && (
                  <a
                    href={file.uploadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: '12px',
                      color: '#2196f3',
                      textDecoration: 'none',
                    }}
                  >
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}

export default FormioTusUploader;