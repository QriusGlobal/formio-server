/**
 * FormioTusDemo - Demo page for Form.io TUS file upload component
 *
 * This page demonstrates the FormioTusUploader component with a
 * complete form schema and TUS server integration.
 */

import { useState } from 'react';
import { FormioTusUploader } from '../components/FormioTusUploader';
import formSchema from '../schemas/tus-file-upload-component.json';
import type { FormioSubmissionResult, UppyFile } from '../types/formio';

export function FormioTusDemo() {
  const [submissionResult, setSubmissionResult] = useState<FormioSubmissionResult | null>(
    null
  );
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (submission: FormioSubmissionResult) => {
    setIsSubmitting(true);
    setSubmissionResult(submission);
    setUploadStatus('✅ Form submitted successfully!');
    setIsSubmitting(false);

    console.log('📋 Final Submission:', submission);
  };

  const handleError = (errors: unknown) => {
    setUploadStatus('❌ Form validation errors occurred');
    console.error('Form errors:', errors);
  };

  const handleUploadStart = (files: UppyFile[]) => {
    setUploadStatus(`📤 Uploading ${files.length} file(s)...`);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadStatus(`📊 Upload progress: ${progress.toFixed(1)}%`);
  };

  const handleUploadComplete = (results: {
    successful: UppyFile[];
    failed: UppyFile[];
  }) => {
    const { successful, failed } = results;
    if (failed.length > 0) {
      setUploadStatus(
        `⚠️ Upload completed with ${failed.length} failure(s). ${successful.length} succeeded.`
      );
    } else {
      setUploadStatus(`✅ All ${successful.length} file(s) uploaded successfully!`);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setUploadStatus('');
    setIsSubmitting(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }} data-testid="formio-tus-demo">
      {/* Header */}
      <header style={{ marginBottom: '32px' }} data-testid="formio-tus-header">
        <h1>🚀 Form.io TUS File Upload Demo</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Complete integration of Form.io with Uppy Dashboard and TUS resumable uploads
        </p>
      </header>

      {/* Status Message */}
      {uploadStatus && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '24px',
            background: uploadStatus.includes('❌')
              ? '#ffebee'
              : uploadStatus.includes('⚠️')
              ? '#fff3e0'
              : '#e8f5e9',
            border: `1px solid ${
              uploadStatus.includes('❌')
                ? '#f44336'
                : uploadStatus.includes('⚠️')
                ? '#ff9800'
                : '#4caf50'
            }`,
            borderRadius: '4px',
            fontSize: '14px',
          }}
          data-testid="formio-tus-status-message"
        >
          {uploadStatus}
        </div>
      )}

      {/* Main Form Component */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        data-testid="formio-tus-form-wrapper"
      >
        <FormioTusUploader
          form={formSchema}
          onSubmit={handleSubmit}
          onError={handleError}
          onUploadStart={handleUploadStart}
          onUploadProgress={handleUploadProgress}
          onUploadComplete={handleUploadComplete}
          uppyConfig={{
            tusEndpoint: 'http://localhost:1080/files/',
            maxFileSize: 100 * 1024 * 1024, // 100MB
            maxNumberOfFiles: 10,
            debug: true,
          }}
          options={{
            noAlerts: false,
          }}
        />
      </div>

      {/* Submission Result Display */}
      {submissionResult && (
        <div
          style={{
            marginTop: '32px',
            padding: '24px',
            background: '#f5f5f5',
            borderRadius: '8px',
            border: '2px solid #4caf50',
          }}
          data-testid="formio-tus-submission-result"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>📋 Submission Result</h2>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              data-testid="formio-tus-reset-button"
            >
              Reset Form
            </button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Submitted Data:</h3>
            <pre
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '13px',
                fontFamily: 'Monaco, Consolas, monospace',
              }}
              data-testid="formio-tus-submission-data"
            >
              {JSON.stringify(submissionResult.data, null, 2)}
            </pre>
          </div>

          {submissionResult.data.fileUpload &&
            Array.isArray(submissionResult.data.fileUpload) &&
            submissionResult.data.fileUpload.length > 0 && (
              <div style={{ marginTop: '16px' }} data-testid="formio-tus-uploaded-files">
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                  Uploaded Files ({submissionResult.data.fileUpload.length}):
                </h3>
                <ul style={{ paddingLeft: '20px' }} data-testid="formio-tus-file-list">
                  {submissionResult.data.fileUpload.map((file: any, index: number) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <strong>{file.name || `File ${index + 1}`}</strong>
                      {file.size && (
                        <span style={{ color: '#666', marginLeft: '8px' }}>
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      )}
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginLeft: '12px',
                            color: '#2196f3',
                            textDecoration: 'none',
                          }}
                        >
                          View File
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* Info Section */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          background: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #2196f3',
        }}
      >
        <h3 style={{ marginTop: 0 }}>ℹ️ How it works:</h3>
        <ol style={{ marginBottom: 0 }}>
          <li>Select files using the Uppy Dashboard above</li>
          <li>Files are uploaded to TUS server at <code>http://localhost:1080/files/</code></li>
          <li>Upload progress is shown in real-time</li>
          <li>Once uploaded, fill in any additional form fields</li>
          <li>Click "Submit" to complete the form submission</li>
          <li>View the complete submission data below</li>
        </ol>
      </div>

      {/* Technical Details */}
      <details style={{ marginTop: '24px' }}>
        <summary
          style={{
            cursor: 'pointer',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          🔧 Technical Details
        </summary>
        <div style={{ padding: '16px', background: 'white', borderRadius: '4px', marginTop: '8px' }}>
          <h4>TUS Server Configuration:</h4>
          <ul>
            <li>
              <strong>Endpoint:</strong> <code>http://localhost:1080/files/</code>
            </li>
            <li>
              <strong>Chunk Size:</strong> 5MB
            </li>
            <li>
              <strong>Retry Delays:</strong> [0ms, 1s, 3s, 5s]
            </li>
            <li>
              <strong>Max File Size:</strong> 100MB
            </li>
            <li>
              <strong>Max Files:</strong> 10
            </li>
          </ul>

          <h4>Features:</h4>
          <ul>
            <li>✅ Resumable uploads (TUS protocol)</li>
            <li>✅ Real-time progress tracking</li>
            <li>✅ Multiple file uploads</li>
            <li>✅ Automatic retry on failure</li>
            <li>✅ File type validation</li>
            <li>✅ Size restrictions</li>
            <li>✅ Form.io integration</li>
            <li>✅ Complete submission handling</li>
          </ul>
        </div>
      </details>

      {isSubmitting && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div>Processing submission...</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormioTusDemo;