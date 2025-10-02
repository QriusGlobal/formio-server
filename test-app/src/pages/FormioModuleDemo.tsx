/**
 * Form.io File Upload Module Demo
 *
 * Demonstrates the @formio/file-upload module integration
 */

import { useEffect, useRef, useState } from 'react';
import { Formio } from '@formio/js';
import FileUploadModule from '../../../packages/formio-file-upload/src';
import '@formio/js/dist/formio.full.css';

// Register the file upload module
Formio.use(FileUploadModule);

// Configure global file upload settings
Formio.config.fileUpload = {
  tusEndpoint: 'http://localhost:3001/files',
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
  chunkSize: 8 * 1024 * 1024, // 8MB
};

export function FormioModuleDemo() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formInstance, setFormInstance] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);

  // Form definition with file upload components
  const formDefinition = {
    display: 'form',
    components: [
      {
        type: 'textfield',
        key: 'name',
        label: 'Your Name',
        placeholder: 'Enter your name',
        validate: {
          required: true
        }
      },
      {
        type: 'email',
        key: 'email',
        label: 'Email Address',
        placeholder: 'your.email@example.com',
        validate: {
          required: true
        }
      },
      {
        type: 'tusupload',
        key: 'resume',
        label: 'Upload Resume',
        storage: 'tus',
        url: 'http://localhost:3001/files',
        filePattern: '*.pdf,*.doc,*.docx',
        fileMaxSize: '10MB',
        validate: {
          required: true,
          customMessage: 'Please upload your resume'
        }
      },
      {
        type: 'uppyupload',
        key: 'portfolio',
        label: 'Portfolio Files',
        multiple: true,
        storage: 'tus',
        url: 'http://localhost:3001/files',
        fileMaxSize: '100MB',
        uppyOptions: {
          inline: true,
          height: 400,
          showProgressDetails: true,
          plugins: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Url']
        },
        description: 'Upload images, videos, or documents showcasing your work'
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit Application',
        theme: 'primary',
        disableOnInvalid: true
      }
    ]
  };

  useEffect(() => {
    if (formRef.current && !formInstance) {
      // Create the form
      Formio.createForm(formRef.current, formDefinition, {
        readOnly: false,
        noAlerts: false
      }).then((form: any) => {
        setFormInstance(form);

        // Set up event listeners
        form.on('submit', (submission: any) => {
          console.log('Form submitted:', submission);
          setSubmission(submission);
        });

        form.on('fileUploadStart', (file: any) => {
          console.log('File upload started:', file);
        });

        form.on('fileUploadProgress', (data: any) => {
          console.log('Upload progress:', data);
        });

        form.on('fileUploadComplete', (file: any) => {
          console.log('File upload complete:', file);
        });

        form.on('fileUploadError', (error: any) => {
          console.error('Upload error:', error);
        });
      });
    }

    return () => {
      if (formInstance) {
        formInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="container mt-5" data-testid="formio-module-demo">
      <h1 className="mb-4">Form.io File Upload Module Demo</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="card" data-testid="formio-application-form-card">
            <div className="card-header">
              <h5 className="mb-0">Job Application Form</h5>
            </div>
            <div className="card-body">
              <div ref={formRef} data-testid="formio-form-container"></div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card" data-testid="formio-features-card">
            <div className="card-header">
              <h5 className="mb-0">Module Features</h5>
            </div>
            <div className="card-body" data-testid="formio-features-list">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  TUS Resumable Uploads
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Uppy.js Dashboard UI
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Drag & Drop Support
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Webcam Capture
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Screen Recording
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Image Editing
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Progress Tracking
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  Auto-Resume on Disconnect
                </li>
              </ul>
            </div>
          </div>

          {submission && (
            <div className="card mt-3" data-testid="formio-submission-result">
              <div className="card-header">
                <h5 className="mb-0">Submission Data</h5>
              </div>
              <div className="card-body">
                <pre className="bg-light p-2 rounded" data-testid="formio-submission-data">
                  {JSON.stringify(submission, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3>Usage Example</h3>
        <pre className="bg-dark text-light p-3 rounded">
{`import { Formio } from '@formio/js';
import FileUploadModule from '@formio/file-upload';

// Register the module
Formio.use(FileUploadModule);

// Use in form definition
const form = {
  components: [{
    type: 'tusupload',
    key: 'documents',
    label: 'Upload Documents',
    storage: 'tus',
    url: '/files',
    fileMaxSize: '10MB'
  }]
};`}
        </pre>
      </div>
    </div>
  );
}