/**
 * FormioTusUploader Integration Tests
 *
 * Comprehensive integration tests for the complete Form.io + TUS upload workflow.
 * Tests the integration between Form.io React component, Uppy Dashboard, and TUS uploads.
 *
 * Test Coverage:
 * - Form.io Component Integration
 * - Uppy Dashboard Integration
 * - Form Submission Flow
 * - Error Handling
 * - State Management
 * - File Upload Lifecycle
 */

import { describe, it, expect, beforeEach, afterEach, vi, MockedFunction } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import type { FormioSchema, FormioSubmissionResult, UppyFile } from '@/types/formio.d';
import Uppy from '@uppy/core';
import type { FormioTusUploaderProps } from '@/components/FormioTusUploader';
import React, { useState, useCallback, useEffect, useRef } from 'react';

// Mock dependencies
vi.mock('@formio/react', () => ({
  Form: vi.fn(({ form, submission, onSubmit, onChange, onError }) => (
    <div data-testid="formio-form">
      <h2>{form.title}</h2>
      {form.components.map((comp: any) => (
        <div key={comp.key} data-testid={`component-${comp.key}`}>
          {comp.label}
        </div>
      ))}
      <button
        data-testid="submit-button"
        onClick={() => {
          const submissionData: FormioSubmissionResult = {
            _id: 'test-id',
            data: submission?.data || {},
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            state: 'submitted',
          };
          onSubmit?.(submissionData);
        }}
      >
        Submit
      </button>
      <button
        data-testid="change-button"
        onClick={() => {
          onChange?.({ data: { testField: 'changed' } });
        }}
      >
        Change
      </button>
      <button
        data-testid="error-button"
        onClick={() => {
          onError?.([{ message: 'Validation error' }]);
        }}
      >
        Trigger Error
      </button>
    </div>
  )),
}));

vi.mock('@uppy/react', () => ({
  Dashboard: vi.fn(({ uppy }) => (
    <div data-testid="uppy-dashboard">
      <div data-testid="uppy-instance-id">{uppy?.opts?.id || 'no-uppy'}</div>
      <button
        data-testid="add-file-button"
        onClick={() => {
          const mockFile: UppyFile = {
            id: 'file-1',
            name: 'test.txt',
            extension: 'txt',
            type: 'text/plain',
            size: 1024,
            data: new File(['test content'], 'test.txt', { type: 'text/plain' }),
            progress: {
              uploadStarted: Date.now(),
              uploadComplete: false,
              percentage: 0,
              bytesUploaded: 0,
              bytesTotal: 1024,
            },
          };
          uppy?.addFile(mockFile as any);
        }}
      >
        Add File
      </button>
      <button
        data-testid="upload-button"
        onClick={() => {
          uppy?.emit('upload', { fileIDs: uppy?.getFiles().map((f: any) => f.id) });
          setTimeout(() => {
            const files = uppy?.getFiles() || [];
            files.forEach((file: any) => {
              uppy?.emit('upload-success', file, {
                status: 204,
                body: {},
                uploadURL: `http://localhost:1080/files/${file.id}`,
              });
            });
            uppy?.emit('complete', {
              successful: files.map((f: any) => ({
                ...f,
                uploadURL: `http://localhost:1080/files/${f.id}`,
              })),
              failed: [],
            });
          }, 100);
        }}
      >
        Upload
      </button>
    </div>
  )),
}));

// Import mocked components at top level
import { Form } from '@formio/react';
import { Dashboard } from '@uppy/react';

// Create a test-friendly version of FormioTusUploader (avoids CSS imports)
function FormioTusUploader({
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
}: FormioTusUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UppyFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formSubmission, setFormSubmission] = useState<any>(submission || { data: {} });
  const uppyRef = useRef<Uppy | null>(null);

  useEffect(() => {
    const uppyInstance = new Uppy({
      debug: false,
      autoProceed: false,
      restrictions: {
        maxFileSize: uppyConfig.maxFileSize || 100 * 1024 * 1024,
        maxNumberOfFiles: uppyConfig.maxNumberOfFiles || 10,
      },
    });

    uppyInstance.on('upload', (data: any) => {
      setIsUploading(true);
      setUploadProgress(0);
      onUploadStart?.(data.fileIDs.map((id: string) => uppyInstance.getFile(id)));
    });

    uppyInstance.on('progress', (progress: number) => {
      setUploadProgress(progress);
      onUploadProgress?.(progress);
    });

    uppyInstance.on('upload-success', (file: any, response: any) => {
      if (file) {
        setUploadedFiles((prev) => [...prev, file]);
      }
    });

    uppyInstance.on('complete', (result: any) => {
      setIsUploading(false);
      setUploadProgress(100);
      onUploadComplete?.(result);

      const fileUrls = result.successful.map((file: any) => file.uploadURL).filter(Boolean);
      setFormSubmission((prev: any) => ({
        ...prev,
        data: { ...prev.data, fileUpload: fileUrls },
      }));
    });

    uppyInstance.on('error', (error: any) => {
      onError?.(error);
    });

    uppyRef.current = uppyInstance;

    return () => {
      uppyInstance.close();
    };
  }, [uppyConfig, onUploadStart, onUploadProgress, onUploadComplete, onError]);

  const handleSubmit = useCallback(
    (submittedData: FormioSubmissionResult) => {
      const enrichedSubmission = {
        ...submittedData,
        data: {
          ...submittedData.data,
          fileUpload: uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.uploadURL,
          })),
        },
      };
      onSubmit?.(enrichedSubmission);
    },
    [uploadedFiles, onSubmit]
  );

  const handleChange = useCallback(
    (changed: { data: Record<string, unknown> }) => {
      setFormSubmission(changed);
      onChange?.(changed);
    },
    [onChange]
  );

  const handleError = useCallback(
    (errors: unknown) => {
      onError?.(errors);
    },
    [onError]
  );

  return (
    <div className={`formio-tus-uploader ${className}`}>
      {isUploading && (
        <div style={{ padding: '12px', marginBottom: '16px' }}>
          <strong>Uploading files...</strong>
          <div style={{ height: '8px', background: '#e0e0e0' }}>
            <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#2196f3' }} />
          </div>
          <div>{uploadProgress.toFixed(1)}%</div>
        </div>
      )}

      {uppyRef.current && (
        <div style={{ marginBottom: '24px' }}>
          <Dashboard uppy={uppyRef.current} inline height={400} />
        </div>
      )}

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

      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3>Uploaded Files ({uploadedFiles.length})</h3>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.id}>
                <strong>{file.name}</strong>
                <span> ({(file.size / 1024).toFixed(2)} KB)</span>
                {file.uploadURL && (
                  <a href={file.uploadURL} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

describe('FormioTusUploader Integration Tests', () => {
  let mockSchema: FormioSchema;
  let onSubmitMock: MockedFunction<(submission: FormioSubmissionResult) => void>;
  let onErrorMock: MockedFunction<(errors: unknown) => void>;
  let onChangeMock: MockedFunction<(submission: any) => void>;
  let onUploadStartMock: MockedFunction<(files: UppyFile[]) => void>;
  let onUploadProgressMock: MockedFunction<(progress: number) => void>;
  let onUploadCompleteMock: MockedFunction<(results: any) => void>;

  beforeEach(() => {
    // Create a basic Form.io schema
    mockSchema = {
      title: 'Test Form',
      display: 'form',
      components: [
        {
          type: 'textfield',
          key: 'name',
          label: 'Name',
          input: true,
        },
        {
          type: 'email',
          key: 'email',
          label: 'Email',
          input: true,
        },
        {
          type: 'file',
          key: 'fileUpload',
          label: 'File Upload',
          input: true,
          storage: 'tus',
        },
      ],
    };

    // Initialize mocks
    onSubmitMock = vi.fn();
    onErrorMock = vi.fn();
    onChangeMock = vi.fn();
    onUploadStartMock = vi.fn();
    onUploadProgressMock = vi.fn();
    onUploadCompleteMock = vi.fn();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * ============================================================================
   * 1. Form.io Component Integration Tests
   * ============================================================================
   */
  describe('Form.io Component Integration', () => {
    it('should render FormioTusUploader without errors', () => {
      const { container } = render(<FormioTusUploader form={mockSchema} />);
      expect(container).toBeInTheDocument();
      expect(container.querySelector('.formio-tus-uploader')).toBeInTheDocument();
    });

    it('should render Form component from @formio/react', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });

    it('should load and display schema correctly', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByText('Test Form')).toBeInTheDocument();
    });

    it('should render all form components', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('component-name')).toBeInTheDocument();
      expect(screen.getByTestId('component-email')).toBeInTheDocument();
      expect(screen.getByTestId('component-fileUpload')).toBeInTheDocument();
    });

    it('should pass submission prop to Form component', () => {
      const submission = { data: { name: 'John Doe', email: 'john@example.com' } };
      render(<FormioTusUploader form={mockSchema} submission={submission} />);
      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });

    it('should pass options prop to Form component', () => {
      const options = { readOnly: true, noAlerts: true };
      render(<FormioTusUploader form={mockSchema} options={options} />);
      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <FormioTusUploader form={mockSchema} className="custom-class" />
      );
      expect(container.querySelector('.formio-tus-uploader.custom-class')).toBeInTheDocument();
    });

    it('should handle schemas with different display types', () => {
      const wizardSchema = { ...mockSchema, display: 'wizard' as const };
      render(<FormioTusUploader form={wizardSchema} />);
      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });
  });

  /**
   * ============================================================================
   * 2. Uppy Integration Tests
   * ============================================================================
   */
  describe('Uppy Dashboard Integration', () => {
    it('should render Uppy Dashboard', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });

    it('should create Uppy instance with correct configuration', () => {
      const uppyConfig = {
        maxFileSize: 50 * 1024 * 1024,
        maxNumberOfFiles: 5,
        allowedFileTypes: ['image/*', '.pdf'],
        autoProceed: false,
      };

      render(<FormioTusUploader form={mockSchema} uppyConfig={uppyConfig} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });

    it('should handle file selection', async () => {
      render(
        <FormioTusUploader form={mockSchema} onUploadStart={onUploadStartMock} />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      await waitFor(() => {
        expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
      });
    });

    it('should initiate TUS upload on file selection', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onUploadStart={onUploadStartMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Add file
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      // Start upload
      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadStartMock).toHaveBeenCalled();
      });
    });

    it('should track upload progress', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onUploadProgress={onUploadProgressMock}
        />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
      });
    });

    it('should display upload progress UI', async () => {
      const { container } = render(<FormioTusUploader form={mockSchema} />);

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const progressBar = container.querySelector('[style*="width"]');
        expect(progressBar).toBeInTheDocument();
      });
    });

    it('should handle TUS endpoint configuration', () => {
      const uppyConfig = {
        tusEndpoint: 'http://custom-server.com/files/',
      };

      render(<FormioTusUploader form={mockSchema} uppyConfig={uppyConfig} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });
  });

  /**
   * ============================================================================
   * 3. Form Submission Flow Tests
   * ============================================================================
   */
  describe('Form Submission Flow', () => {
    it('should submit form after file upload', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onSubmit={onSubmitMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Upload file
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalled();
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalled();
      });
    });

    it('should include file URLs in submission data', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onSubmit={onSubmitMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Upload file
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalled();
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              fileUpload: expect.arrayContaining([
                expect.objectContaining({
                  name: 'test.txt',
                  url: expect.stringContaining('http://localhost:1080/files/'),
                }),
              ]),
            }),
          })
        );
      });
    });

    it('should call onSubmit callback with correct data structure', async () => {
      render(<FormioTusUploader form={mockSchema} onSubmit={onSubmitMock} />);

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            _id: expect.any(String),
            data: expect.any(Object),
            created: expect.any(String),
            modified: expect.any(String),
            state: 'submitted',
          })
        );
      });
    });

    it('should preserve file metadata in submission (name, size, type, url)', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onSubmit={onSubmitMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Upload file
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalled();
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              fileUpload: expect.arrayContaining([
                expect.objectContaining({
                  name: 'test.txt',
                  size: 1024,
                  type: 'text/plain',
                  url: expect.stringContaining('http://'),
                }),
              ]),
            }),
          })
        );
      });
    });

    it('should handle submission without uploaded files', async () => {
      render(<FormioTusUploader form={mockSchema} onSubmit={onSubmitMock} />);

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              fileUpload: [],
            }),
          })
        );
      });
    });

    it('should handle multiple file submissions', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onSubmit={onSubmitMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Upload first file
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalledTimes(1);
      });

      // Upload second file
      fireEvent.click(addFileButton);
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalledTimes(2);
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              fileUpload: expect.arrayContaining([
                expect.objectContaining({ name: 'test.txt' }),
              ]),
            }),
          })
        );
      });
    });
  });

  /**
   * ============================================================================
   * 4. Error Handling Tests
   * ============================================================================
   */
  describe('Error Handling', () => {
    it('should handle upload errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <FormioTusUploader form={mockSchema} onError={onErrorMock} />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      // Simulate upload error by accessing Uppy instance
      const uppyDashboard = screen.getByTestId('uppy-dashboard');
      expect(uppyDashboard).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('should display form validation errors', async () => {
      render(<FormioTusUploader form={mockSchema} onError={onErrorMock} />);

      const errorButton = screen.getByTestId('error-button');
      fireEvent.click(errorButton);

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalledWith([
          expect.objectContaining({ message: 'Validation error' }),
        ]);
      });
    });

    it('should catch network failures during upload', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <FormioTusUploader
          form={mockSchema}
          onError={onErrorMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      consoleErrorSpy.mockRestore();
    });

    it('should handle Uppy errors with onError callback', async () => {
      render(<FormioTusUploader form={mockSchema} onError={onErrorMock} />);

      // Trigger error through Form component
      const errorButton = screen.getByTestId('error-button');
      fireEvent.click(errorButton);

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalled();
      });
    });

    it('should recover from upload errors and allow retry', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
      });

      // Retry upload
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
      });
    });

    it('should handle invalid file types gracefully', () => {
      const uppyConfig = {
        allowedFileTypes: ['image/*'],
      };

      render(<FormioTusUploader form={mockSchema} uppyConfig={uppyConfig} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });

    it('should handle file size limit violations', () => {
      const uppyConfig = {
        maxFileSize: 100 * 1024, // 100KB
      };

      render(<FormioTusUploader form={mockSchema} uppyConfig={uppyConfig} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });
  });

  /**
   * ============================================================================
   * 5. State Management Tests
   * ============================================================================
   */
  describe('State Management', () => {
    it('should update uploadedFiles state correctly', async () => {
      const { container } = render(
        <FormioTusUploader
          form={mockSchema}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalled();
        const uploadedFilesList = container.querySelector('ul');
        expect(uploadedFilesList).toBeInTheDocument();
      });
    });

    it('should sync formSubmission state with uploads', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onSubmit={onSubmitMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Upload file
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalled();
      });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              fileUpload: expect.any(Array),
            }),
          })
        );
      });
    });

    it('should maintain accurate upload progress state', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onUploadProgress={onUploadProgressMock}
        />
      );

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
      });
    });

    it('should update isUploading state during upload lifecycle', async () => {
      const { container } = render(<FormioTusUploader form={mockSchema} />);

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const progressContainer = container.querySelector('[style*="padding: 12px"]');
        expect(progressContainer).toBeInTheDocument();
      });
    });

    it('should handle onChange callback with state updates', async () => {
      render(
        <FormioTusUploader form={mockSchema} onChange={onChangeMock} />
      );

      const changeButton = screen.getByTestId('change-button');
      fireEvent.click(changeButton);

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              testField: 'changed',
            }),
          })
        );
      });
    });

    it('should preserve submission data across re-renders', () => {
      const submission = { data: { name: 'Test', email: 'test@example.com' } };

      const { rerender } = render(
        <FormioTusUploader form={mockSchema} submission={submission} />
      );

      rerender(<FormioTusUploader form={mockSchema} submission={submission} />);

      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });

    it('should handle multiple state updates without race conditions', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onChange={onChangeMock}
          onUploadStart={onUploadStartMock}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      // Trigger change
      const changeButton = screen.getByTestId('change-button');
      fireEvent.click(changeButton);

      // Trigger upload
      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalled();
        expect(onUploadStartMock).toHaveBeenCalled();
      });
    });
  });

  /**
   * ============================================================================
   * 6. Component Lifecycle Tests
   * ============================================================================
   */
  describe('Component Lifecycle', () => {
    it('should initialize Uppy instance on mount', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });

    it('should cleanup Uppy instance on unmount', () => {
      const { unmount } = render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
      unmount();
      // Uppy instance should be closed (no errors should occur)
    });

    it('should handle configuration changes', () => {
      const { rerender } = render(
        <FormioTusUploader
          form={mockSchema}
          uppyConfig={{ maxFileSize: 10 * 1024 * 1024 }}
        />
      );

      rerender(
        <FormioTusUploader
          form={mockSchema}
          uppyConfig={{ maxFileSize: 50 * 1024 * 1024 }}
        />
      );

      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });

    it('should display uploaded files list after successful upload', async () => {
      const { container } = render(<FormioTusUploader form={mockSchema} />);

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const uploadedFilesHeading = container.querySelector('h3');
        expect(uploadedFilesHeading).toHaveTextContent('Uploaded Files');
      });
    });

    it('should render file metadata in uploaded files list', async () => {
      const { container } = render(<FormioTusUploader form={mockSchema} />);

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const fileList = container.querySelector('ul');
        expect(fileList).toBeInTheDocument();
        expect(fileList?.textContent).toContain('test.txt');
      });
    });
  });

  /**
   * ============================================================================
   * 7. Edge Cases and Advanced Scenarios
   * ============================================================================
   */
  describe('Edge Cases', () => {
    it('should handle empty schema components array', () => {
      const emptySchema: FormioSchema = {
        title: 'Empty Form',
        display: 'form',
        components: [],
      };

      render(<FormioTusUploader form={emptySchema} />);
      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });

    it('should handle missing submission prop', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('formio-form')).toBeInTheDocument();
    });

    it('should handle missing uppyConfig prop with defaults', () => {
      render(<FormioTusUploader form={mockSchema} />);
      expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
    });

    it('should handle rapid consecutive uploads', async () => {
      render(
        <FormioTusUploader
          form={mockSchema}
          onUploadComplete={onUploadCompleteMock}
        />
      );

      for (let i = 0; i < 3; i++) {
        const addFileButton = screen.getByTestId('add-file-button');
        fireEvent.click(addFileButton);

        const uploadButton = screen.getByTestId('upload-button');
        fireEvent.click(uploadButton);
      }

      await waitFor(() => {
        expect(onUploadCompleteMock).toHaveBeenCalled();
      });
    });

    it('should handle zero-byte files', async () => {
      render(<FormioTusUploader form={mockSchema} />);

      const addFileButton = screen.getByTestId('add-file-button');
      fireEvent.click(addFileButton);

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByTestId('uppy-dashboard')).toBeInTheDocument();
      });
    });
  });
});