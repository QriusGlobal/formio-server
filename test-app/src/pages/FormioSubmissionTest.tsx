import { useState } from 'react';
import { Form } from '@formio/react';
import Formio from '@formio/js';
import FormioFileUploadModule from 'formio-file-upload';

// Register file upload module
Formio.use(FormioFileUploadModule);

export default function FormioSubmissionTest() {
  const [submission, setSubmission] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formDefinition = {
    display: 'form',
    components: [
      {
        type: 'panel',
        title: 'Personal Information',
        key: 'personalInfo',
        components: [
          {
            type: 'textfield',
            key: 'fullName',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            validate: { required: true }
          },
          {
            type: 'email',
            key: 'email',
            label: 'Email Address',
            placeholder: 'your.email@example.com',
            validate: { required: true }
          }
        ]
      },
      {
        type: 'panel',
        title: 'File Uploads',
        key: 'fileUploads',
        components: [
          {
            type: 'tusupload',
            key: 'resume',
            label: 'Upload Resume (TUS Single File)',
            storage: 'tus',
            url: 'http://localhost:1080/files',
            multiple: false,
            filePattern: '*.pdf,*.doc,*.docx',
            description: 'Upload your resume in PDF or Word format',
            validate: { required: true }
          },
          {
            type: 'tusupload',
            key: 'portfolio',
            label: 'Portfolio Files (TUS Multiple Files)',
            storage: 'tus',
            url: 'http://localhost:1080/files',
            multiple: true,
            filePattern: '*',
            description: 'Upload multiple portfolio files (optional)'
          },
          {
            type: 'uppyupload',
            key: 'profilePhoto',
            label: 'Profile Photo (Uppy Upload)',
            storage: 'url',
            url: 'http://localhost:1080/files',
            multiple: false,
            filePattern: '*.jpg,*.jpeg,*.png,*.gif',
            description: 'Upload a profile photo (optional)',
            uppyOptions: {
              inline: true,
              height: 350,
              showProgressDetails: true,
              plugins: ['Webcam', 'ImageEditor']
            }
          }
        ]
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit Application',
        theme: 'primary',
        block: true
      }
    ]
  };

  const handleSubmit = (submission: any) => {
    console.log('=== FORM SUBMISSION ===');
    console.log('Full submission:', JSON.stringify(submission, null, 2));
    console.log('Resume:', submission.data.resume);
    console.log('Portfolio:', submission.data.portfolio);
    console.log('Profile Photo:', submission.data.profilePhoto);
    setSubmission(submission);
    setError(null);
  };

  const handleError = (errors: any) => {
    console.error('Form submission errors:', errors);
    setError('Form validation failed. Please check all required fields.');
  };

  const resetForm = () => {
    setSubmission(null);
    setError(null);
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{
        background: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>
          Form.io File Upload Integration Test
        </h1>
        <p style={{ margin: 0, color: '#666' }}>
          This page validates that uploaded files are properly included in form submission data.
          Upload files using TUS (single and multiple) and Uppy components, then submit to see the results.
        </p>
      </div>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #ef5350'
        }}>
          ⚠️ {error}
        </div>
      )}

      {!submission ? (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Form
            form={formDefinition}
            onSubmit={handleSubmit}
            onError={handleError}
            options={{
              noAlerts: false,
              readOnly: false
            }}
          />
        </div>
      ) : (
        <div>
          <div style={{
            background: '#e8f5e9',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '2px solid #4caf50'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>
              ✅ Submission Successful!
            </h2>
            <button
              onClick={resetForm}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Submit Another Form
            </button>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📋 Submitted Data:</h3>
            <pre style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {JSON.stringify(submission.data, null, 2)}
            </pre>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🔍 File Upload Validation:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                borderLeft: `4px solid ${submission.data.resume?.url ? '#4caf50' : '#f44336'}`
              }}>
                <strong>Resume (TUS Single File):</strong>
                {submission.data.resume?.url ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href={submission.data.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>📄 {submission.data.resume.name}</span>
                      <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✅</span>
                    </a>
                    <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                      Size: {(submission.data.resume.size / 1024).toFixed(2)} KB |
                      Type: {submission.data.resume.type} |
                      Storage: {submission.data.resume.storage}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.5rem', color: '#c62828' }}>
                    ❌ No resume uploaded
                  </div>
                )}
              </div>

              <div style={{
                padding: '1rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                borderLeft: `4px solid ${
                  Array.isArray(submission.data.portfolio) && submission.data.portfolio.length > 0
                    ? '#4caf50'
                    : '#ff9800'
                }`
              }}>
                <strong>Portfolio (TUS Multiple Files):</strong>
                {Array.isArray(submission.data.portfolio) && submission.data.portfolio.length > 0 ? (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {submission.data.portfolio.map((file: any, idx: number) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span>📎 {file.name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </a>
                    ))}
                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                      ✅ {submission.data.portfolio.length} file(s) uploaded
                    </span>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.5rem', color: '#f57c00' }}>
                    ⚠️ No portfolio files uploaded (optional)
                  </div>
                )}
              </div>

              <div style={{
                padding: '1rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                borderLeft: `4px solid ${submission.data.profilePhoto?.url ? '#4caf50' : '#ff9800'}`
              }}>
                <strong>Profile Photo (Uppy Upload):</strong>
                {submission.data.profilePhoto?.url ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href={submission.data.profilePhoto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>🖼️ {submission.data.profilePhoto.name}</span>
                      <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✅</span>
                    </a>
                    <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                      Size: {(submission.data.profilePhoto.size / 1024).toFixed(2)} KB |
                      Type: {submission.data.profilePhoto.type}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.5rem', color: '#f57c00' }}>
                    ⚠️ No profile photo uploaded (optional)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '1rem',
            border: '1px solid #ffb74d'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#e65100' }}>💡 Integration Success Criteria:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666' }}>
              <li>
                <strong>TUS Single Upload:</strong> {submission.data.resume?.url ? '✅ PASS' : '❌ FAIL'} -
                File URL in <code>submission.data.resume</code>
              </li>
              <li>
                <strong>TUS Multiple Upload:</strong>{' '}
                {Array.isArray(submission.data.portfolio) && submission.data.portfolio.length > 0
                  ? `✅ PASS (${submission.data.portfolio.length} files)`
                  : '⚠️ OPTIONAL'}{' '}
                - Array of file URLs in <code>submission.data.portfolio</code>
              </li>
              <li>
                <strong>Uppy Upload:</strong> {submission.data.profilePhoto?.url ? '✅ PASS' : '⚠️ OPTIONAL'} -
                File URL in <code>submission.data.profilePhoto</code>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
