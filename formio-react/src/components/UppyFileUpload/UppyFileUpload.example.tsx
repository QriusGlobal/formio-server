/**
 * UppyFileUpload Usage Examples
 *
 * Comprehensive examples demonstrating different configurations and use cases
 * for the UppyFileUpload component.
 *
 * Examples include:
 * 1. Basic upload with TUS
 * 2. With webcam capture
 * 3. With image editor
 * 4. With Google Drive integration
 * 5. Multiple files with restrictions
 * 6. Form.io integration pattern
 * 7. Modal mode
 * 8. Programmatic control
 */

import React, { useRef, useState } from 'react';
import UppyFileUpload from './UppyFileUpload';
import type { UppyFileUploadHandle, UploadFileResult, UploadError } from './UppyFileUpload.types';

/**
 * Example 1: Basic Upload
 * Simple configuration with TUS resumable uploads
 */
export function BasicUploadExample() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileResult[]>([]);

  return (
    <div className="example-container">
      <h2>Example 1: Basic Upload</h2>
      <p>Simple file upload with TUS resumable protocol</p>

      <UppyFileUpload
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
          chunkSize: 5 * 1024 * 1024, // 5MB chunks
        }}
        dashboardConfig={{
          mode: 'inline',
          height: 400,
          showProgressDetails: true,
          note: 'Upload files up to 50MB',
        }}
        restrictions={{
          maxFileSize: 50 * 1024 * 1024, // 50MB
          maxNumberOfFiles: 5,
          allowedFileTypes: ['image/*', '.pdf', '.docx'],
        }}
        onUploadSuccess={(file) => {
          console.log('Upload successful:', file);
          setUploadedFiles(prev => [...prev, file]);
        }}
        onUploadError={(error) => {
          console.error('Upload failed:', error);
        }}
      />

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-list">
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map(file => (
              <li key={file.id}>
                <strong>{file.name}</strong> - {(file.size / 1024 / 1024).toFixed(2)} MB
                <br />
                <a href={file.uploadURL} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: With Webcam Capture
 * Enables users to capture photos or videos from webcam
 */
export function WebcamUploadExample() {
  return (
    <div className="example-container">
      <h2>Example 2: With Webcam Capture</h2>
      <p>Take photos or record videos directly from webcam</p>

      <UppyFileUpload
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
        }}
        dashboardConfig={{
          mode: 'inline',
          height: 500,
          showProgressDetails: true,
        }}
        plugins={['Webcam']}
        pluginConfigs={{
          Webcam: {
            countdown: 3,
            modes: ['picture', 'video-audio'],
            showVideoSourceDropdown: true,
          },
        }}
        restrictions={{
          maxFileSize: 100 * 1024 * 1024, // 100MB for videos
          allowedFileTypes: ['image/*', 'video/*'],
        }}
        onUploadSuccess={(file) => {
          console.log('Webcam capture uploaded:', file);
        }}
      />
    </div>
  );
}

/**
 * Example 3: With Image Editor
 * Allows users to edit images before uploading
 */
export function ImageEditorExample() {
  return (
    <div className="example-container">
      <h2>Example 3: With Image Editor</h2>
      <p>Edit images (crop, rotate, apply filters) before uploading</p>

      <UppyFileUpload
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
        }}
        dashboardConfig={{
          mode: 'inline',
          height: 500,
        }}
        plugins={['ImageEditor']}
        pluginConfigs={{
          ImageEditor: {
            quality: 0.9,
            cropperOptions: {
              viewMode: 1,
              aspectRatio: 16 / 9,
              autoCropArea: 1,
            },
            actions: {
              revert: true,
              rotate: true,
              flip: true,
              zoomIn: true,
              zoomOut: true,
              cropSquare: true,
              cropWidescreen: true,
            },
          },
        }}
        restrictions={{
          allowedFileTypes: ['image/*'],
          maxFileSize: 10 * 1024 * 1024, // 10MB
        }}
        onUploadSuccess={(file) => {
          console.log('Edited image uploaded:', file);
        }}
      />
    </div>
  );
}

/**
 * Example 4: With Google Drive
 * Import files directly from Google Drive
 */
export function GoogleDriveExample() {
  return (
    <div className="example-container">
      <h2>Example 4: With Google Drive Integration</h2>
      <p>Import files directly from Google Drive</p>

      <UppyFileUpload
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
        }}
        dashboardConfig={{
          mode: 'inline',
          height: 450,
        }}
        plugins={['GoogleDrive']}
        pluginConfigs={{
          GoogleDrive: {
            companionUrl: 'https://companion.uppy.io', // Replace with your Companion server
            companionAllowedHosts: ['https://companion.uppy.io'],
          },
        }}
        restrictions={{
          maxFileSize: 100 * 1024 * 1024, // 100MB
        }}
        onUploadSuccess={(file) => {
          console.log('File from Google Drive uploaded:', file);
        }}
      />
    </div>
  );
}

/**
 * Example 5: Multiple Files with All Plugins
 * Full-featured upload with all available input sources
 */
export function FullFeaturedExample() {
  return (
    <div className="example-container">
      <h2>Example 5: Full-Featured Upload</h2>
      <p>All plugins enabled: Webcam, Image Editor, Screen Capture, Audio, URL import</p>

      <UppyFileUpload
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
          chunkSize: 5 * 1024 * 1024,
          retryDelays: [0, 1000, 3000, 5000],
        }}
        dashboardConfig={{
          mode: 'inline',
          height: 550,
          showProgressDetails: true,
          note: 'Upload from multiple sources',
          theme: 'light',
        }}
        plugins={['Webcam', 'ImageEditor', 'ScreenCapture', 'Audio', 'Url']}
        pluginConfigs={{
          Webcam: {
            countdown: 3,
            modes: ['picture', 'video-audio'],
          },
          ImageEditor: {
            quality: 0.85,
          },
          ScreenCapture: {
            displayMediaConstraints: {
              video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
              },
            },
          },
          Audio: {
            showRecordingLength: true,
          },
          Url: {
            companionUrl: 'https://companion.uppy.io',
          },
        }}
        restrictions={{
          maxFileSize: 200 * 1024 * 1024, // 200MB
          maxNumberOfFiles: 20,
          allowedFileTypes: ['image/*', 'video/*', 'audio/*', '.pdf', '.docx'],
        }}
        metadata={{
          userId: 'user-123',
          uploadedAt: new Date().toISOString(),
        }}
        onUploadSuccess={(file) => {
          console.log('File uploaded:', file);
        }}
        onComplete={(result) => {
          console.log('All uploads complete:', {
            successful: result.successful.length,
            failed: result.failed.length,
          });
        }}
      />
    </div>
  );
}

/**
 * Example 6: Form.io Integration Pattern
 * Shows how to integrate with Form.io submission workflow
 */
export function FormioIntegrationExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    files: [] as string[],
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission:', formData);
    // Submit to Form.io API
  };

  return (
    <div className="example-container">
      <h2>Example 6: Form.io Integration</h2>
      <p>Upload component integrated with form submission</p>

      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Attachments:</label>
          <UppyFileUpload
            tusConfig={{
              endpoint: 'https://tusd.tusdemo.net/files/',
            }}
            dashboardConfig={{
              mode: 'inline',
              height: 350,
            }}
            restrictions={{
              maxFileSize: 50 * 1024 * 1024,
              maxNumberOfFiles: 5,
            }}
            onComplete={(result) => {
              const urls = result.successful.map(file => file.uploadURL);
              setFormData({ ...formData, files: urls });
            }}
            onFormioEvent={(event) => {
              console.log('Form.io event:', event.type, event);
            }}
          />
        </div>

        <button type="submit" disabled={formData.files.length === 0}>
          Submit Form
        </button>
      </form>

      {formData.files.length > 0 && (
        <div className="form-data-preview">
          <h3>Form Data:</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 7: Modal Mode
 * Dashboard opens in modal overlay
 */
export function ModalModeExample() {
  const uppyRef = useRef<UppyFileUploadHandle>(null);

  const handleOpenModal = () => {
    uppyRef.current?.openModal();
  };

  const handleCloseModal = () => {
    uppyRef.current?.closeModal();
  };

  return (
    <div className="example-container">
      <h2>Example 7: Modal Mode</h2>
      <p>Upload dashboard opens in modal overlay</p>

      <div className="button-group">
        <button onClick={handleOpenModal} className="btn btn-primary">
          Open Upload Modal
        </button>
        <button onClick={handleCloseModal} className="btn btn-secondary">
          Close Modal
        </button>
      </div>

      <UppyFileUpload
        ref={uppyRef}
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
        }}
        dashboardConfig={{
          mode: 'modal',
          showProgressDetails: true,
          closeModalOnClickOutside: true,
        }}
        restrictions={{
          maxFileSize: 50 * 1024 * 1024,
        }}
        onUploadSuccess={(file) => {
          console.log('Modal upload successful:', file);
        }}
      />
    </div>
  );
}

/**
 * Example 8: Programmatic Control
 * Control upload programmatically using ref
 */
export function ProgrammaticControlExample() {
  const uppyRef = useRef<UppyFileUploadHandle>(null);
  const [status, setStatus] = useState<string>('Ready');

  const handleUpload = () => {
    uppyRef.current?.upload();
    setStatus('Uploading...');
  };

  const handleCancelAll = () => {
    uppyRef.current?.cancelAll();
    setStatus('Cancelled');
  };

  const handleReset = () => {
    uppyRef.current?.reset();
    setStatus('Reset');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && uppyRef.current?.uppy) {
      Array.from(files).forEach(file => {
        uppyRef.current?.uppy?.addFile({
          name: file.name,
          type: file.type,
          data: file,
        });
      });
    }
  };

  return (
    <div className="example-container">
      <h2>Example 8: Programmatic Control</h2>
      <p>Control uploads programmatically using component ref</p>

      <div className="control-panel">
        <div className="button-group">
          <label className="btn btn-secondary">
            Add Files
            <input
              type="file"
              multiple
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={handleUpload} className="btn btn-primary">
            Start Upload
          </button>
          <button onClick={handleCancelAll} className="btn btn-warning">
            Cancel All
          </button>
          <button onClick={handleReset} className="btn btn-danger">
            Reset
          </button>
        </div>

        <div className="status-display">
          Status: <strong>{status}</strong>
        </div>
      </div>

      <UppyFileUpload
        ref={uppyRef}
        tusConfig={{
          endpoint: 'https://tusd.tusdemo.net/files/',
        }}
        dashboardConfig={{
          mode: 'inline',
          height: 350,
          hideUploadButton: true, // Use external button
        }}
        autoProceed={false} // Manual upload control
        restrictions={{
          maxFileSize: 50 * 1024 * 1024,
        }}
        onUploadStart={() => setStatus('Uploading...')}
        onComplete={(result) => {
          setStatus(`Complete: ${result.successful.length} uploaded, ${result.failed.length} failed`);
        }}
        onUploadError={() => setStatus('Error occurred')}
      />
    </div>
  );
}

/**
 * Main Examples Component
 * Renders all examples in tabs
 */
export function UppyFileUploadExamples() {
  const [activeExample, setActiveExample] = useState<string>('basic');

  const examples = [
    { id: 'basic', label: 'Basic Upload', component: BasicUploadExample },
    { id: 'webcam', label: 'Webcam', component: WebcamUploadExample },
    { id: 'editor', label: 'Image Editor', component: ImageEditorExample },
    { id: 'drive', label: 'Google Drive', component: GoogleDriveExample },
    { id: 'full', label: 'Full Featured', component: FullFeaturedExample },
    { id: 'formio', label: 'Form.io Integration', component: FormioIntegrationExample },
    { id: 'modal', label: 'Modal Mode', component: ModalModeExample },
    { id: 'control', label: 'Programmatic Control', component: ProgrammaticControlExample },
  ];

  const ActiveComponent = examples.find(ex => ex.id === activeExample)?.component || BasicUploadExample;

  return (
    <div className="examples-container">
      <h1>UppyFileUpload Component Examples</h1>

      <div className="tabs">
        {examples.map(example => (
          <button
            key={example.id}
            className={`tab ${activeExample === example.id ? 'active' : ''}`}
            onClick={() => setActiveExample(example.id)}
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className="example-content">
        <ActiveComponent />
      </div>

      <style>{`
        .examples-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        h1 {
          margin-bottom: 24px;
          color: #333;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 10px 20px;
          border: 2px solid #d4d7dc;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .tab:hover {
          border-color: #1c7bc4;
          color: #1c7bc4;
        }

        .tab.active {
          background: #1c7bc4;
          color: white;
          border-color: #1c7bc4;
        }

        .example-container {
          background: white;
          border: 2px solid #d4d7dc;
          border-radius: 8px;
          padding: 24px;
        }

        .example-container h2 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #333;
        }

        .example-container > p {
          margin-bottom: 24px;
          color: #525965;
        }

        .uploaded-files-list,
        .form-data-preview {
          margin-top: 24px;
          padding: 16px;
          background: #f7f8fa;
          border-radius: 6px;
        }

        .uploaded-files-list h3,
        .form-data-preview h3 {
          margin-top: 0;
          margin-bottom: 12px;
        }

        .uploaded-files-list ul {
          list-style: none;
          padding: 0;
        }

        .uploaded-files-list li {
          padding: 8px 0;
          border-bottom: 1px solid #d4d7dc;
        }

        .uploaded-files-list li:last-child {
          border-bottom: none;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input[type="text"],
        .form-group input[type="email"] {
          width: 100%;
          padding: 10px;
          border: 2px solid #d4d7dc;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #1c7bc4;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #1c7bc4;
          color: white;
        }

        .btn-primary:hover {
          background: #165a91;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-warning {
          background: #f6a623;
          color: white;
        }

        .btn-warning:hover {
          background: #d48a0c;
        }

        .btn-danger {
          background: #d9534f;
          color: white;
        }

        .btn-danger:hover {
          background: #c9302c;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-display {
          padding: 12px;
          background: #f7f8fa;
          border-radius: 6px;
          font-size: 14px;
        }

        pre {
          background: #282c34;
          color: #abb2bf;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .examples-container {
            padding: 16px;
          }

          .tabs {
            gap: 4px;
          }

          .tab {
            padding: 8px 12px;
            font-size: 12px;
          }

          .example-container {
            padding: 16px;
          }

          .button-group {
            gap: 8px;
          }

          .btn {
            padding: 8px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default UppyFileUploadExamples;