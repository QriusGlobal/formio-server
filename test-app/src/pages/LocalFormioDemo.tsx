/**
 * LocalFormioDemo - Showcase of local formio-react TUS/Uppy Components
 *
 * This demo uses the ACTUAL components from the local @formio/react package:
 * - TusFileUpload: Simple, lightweight TUS resumable upload component
 * - UppyFileUpload: Feature-rich upload with dashboard UI and plugins
 *
 * Both components support:
 * - Resumable uploads via TUS protocol
 * - Progress tracking
 * - File validation
 * - Multiple files
 * - Custom metadata
 */

import { useState } from 'react';
import { TusFileUpload, UppyFileUpload } from '@formio/react';
import type {
  UploadFile,
  UploadProgress,
  UploadFileResult,
  UploadError,
} from '@formio/react';

export function LocalFormioDemo() {
  const [activeTab, setActiveTab] = useState<'tus' | 'uppy'>('tus');

  // TUS component state
  const [tusFiles, setTusFiles] = useState<UploadFile[]>([]);
  const [tusProgress, setTusProgress] = useState<Record<string, number>>({});

  // Uppy component state
  const [uppyFiles, setUppyFiles] = useState<UploadFileResult[]>([]);
  const [uppyErrors, setUppyErrors] = useState<UploadError[]>([]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#1a202c',
          marginBottom: '8px'
        }}>
          📦 Local Form.io React Components Demo
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          marginBottom: '16px'
        }}>
          Using <code>TusFileUpload</code> and <code>UppyFileUpload</code> from local <code>@formio/react</code> package
        </p>

        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#0050b3'
        }}>
          💡 <strong>Note:</strong> Both components connect to public TUS demo server at tusd.tusdemo.net
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #e2e8f0'
      }}>
        <button
          onClick={() => setActiveTab('tus')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'tus' ? '#4299e1' : 'transparent',
            color: activeTab === 'tus' ? 'white' : '#4a5568',
            border: 'none',
            borderBottom: activeTab === 'tus' ? '2px solid #4299e1' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.2s',
            borderRadius: '6px 6px 0 0',
            marginBottom: '-2px'
          }}
        >
          🎯 TusFileUpload (Simple)
        </button>
        <button
          onClick={() => setActiveTab('uppy')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'uppy' ? '#9f7aea' : 'transparent',
            color: activeTab === 'uppy' ? 'white' : '#4a5568',
            border: 'none',
            borderBottom: activeTab === 'uppy' ? '2px solid #9f7aea' : 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.2s',
            borderRadius: '6px 6px 0 0',
            marginBottom: '-2px'
          }}
        >
          🚀 UppyFileUpload (Feature-Rich)
        </button>
      </div>

      {/* TUS File Upload Demo */}
      {activeTab === 'tus' && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#2d3748'
          }}>
            TusFileUpload Component
          </h2>
          <p style={{
            color: '#718096',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            Lightweight, production-ready TUS resumable upload with built-in progress tracking.
            Perfect for simple upload scenarios.
          </p>

          {/* Feature Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            background: '#f7fafc',
            borderRadius: '6px'
          }}>
            <div>✅ Resumable uploads</div>
            <div>✅ Progress tracking</div>
            <div>✅ File validation</div>
            <div>✅ Multiple files</div>
            <div>✅ Image previews</div>
            <div>✅ Custom metadata</div>
          </div>

          {/* TusFileUpload Component */}
          <TusFileUpload
            endpoint="https://tusd.tusdemo.net/files/"
            chunkSize={5 * 1024 * 1024} // 5MB chunks
            maxFileSize={100 * 1024 * 1024} // 100MB limit
            maxFiles={5}
            allowedTypes={['image/*', '.pdf', '.docx', '.txt']}
            metadata={{
              source: 'formio-demo',
              timestamp: new Date().toISOString(),
            }}
            onProgress={(fileId, progress: UploadProgress) => {
              setTusProgress(prev => ({ ...prev, [fileId]: progress.percentage }));
            }}
            onSuccess={(files: UploadFile[]) => {
              setTusFiles(prev => [...prev, ...files]);
              console.log('✅ TUS Upload successful:', files);
            }}
            onError={(error: Error, file?: UploadFile) => {
              console.error('❌ TUS Upload failed:', error, file);
              alert(`Upload failed: ${error.message}`);
            }}
            multiple={true}
            showPreviews={true}
            autoStart={true}
          />

          {/* Progress Display */}
          {Object.keys(tusProgress).length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f7fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#2d3748'
              }}>
                📊 Upload Progress:
              </h3>
              {Object.entries(tusProgress).map(([fileId, progress]) => (
                <div key={fileId} style={{ marginBottom: '8px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '14px'
                  }}>
                    <span>File {fileId.substring(0, 8)}...</span>
                    <span style={{ fontWeight: 600 }}>{progress}%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: progress === 100 ? '#48bb78' : '#4299e1',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded Files Display */}
          {tusFiles.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f0fff4',
              borderRadius: '6px',
              border: '1px solid #9ae6b4'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#22543d'
              }}>
                ✅ Successfully Uploaded Files:
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {tusFiles.map(file => (
                  <li key={file.id} style={{
                    padding: '12px',
                    background: 'white',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #c6f6d5',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {file.name}
                    </div>
                    <div style={{ color: '#718096', fontSize: '13px' }}>
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB | Type: {file.type}
                    </div>
                    {file.uploadUrl && (
                      <a
                        href={file.uploadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#4299e1',
                          textDecoration: 'none',
                          fontSize: '13px'
                        }}
                      >
                        🔗 View File
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Example */}
          <details style={{ marginTop: '24px' }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: 600,
              padding: '12px',
              background: '#f7fafc',
              borderRadius: '6px',
              marginBottom: '12px'
            }}>
              📝 View Code Example
            </summary>
            <pre style={{
              background: '#1a202c',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
{`import { TusFileUpload } from '@formio/react';
import type { UploadFile, UploadProgress } from '@formio/react';

<TusFileUpload
  endpoint="https://tusd.tusdemo.net/files/"
  chunkSize={5 * 1024 * 1024} // 5MB chunks
  maxFileSize={100 * 1024 * 1024} // 100MB
  maxFiles={5}
  allowedTypes={['image/*', '.pdf', '.docx']}
  metadata={{
    source: 'my-app',
    userId: '123',
  }}
  onProgress={(fileId, progress: UploadProgress) => {
    console.log(\`\${fileId}: \${progress.percentage}%\`);
  }}
  onSuccess={(files: UploadFile[]) => {
    console.log('Uploaded:', files);
  }}
  onError={(error: Error, file?: UploadFile) => {
    console.error('Upload failed:', error);
  }}
  multiple={true}
  showPreviews={true}
  autoStart={true}
/>`}
            </pre>
          </details>
        </div>
      )}

      {/* Uppy File Upload Demo */}
      {activeTab === 'uppy' && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#2d3748'
          }}>
            UppyFileUpload Component
          </h2>
          <p style={{
            color: '#718096',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            Feature-rich upload with Uppy Dashboard UI. Supports plugins for webcam, image editing,
            screen capture, and cloud storage integration.
          </p>

          {/* Feature Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            background: '#faf5ff',
            borderRadius: '6px'
          }}>
            <div>🎨 Rich Dashboard UI</div>
            <div>📸 Webcam support</div>
            <div>✂️ Image editor</div>
            <div>🖥️ Screen capture</div>
            <div>☁️ Cloud storage (optional)</div>
            <div>🔄 Drag & drop</div>
          </div>

          {/* UppyFileUpload Component */}
          <UppyFileUpload
            tusConfig={{
              endpoint: 'https://tusd.tusdemo.net/files/',
              chunkSize: 5 * 1024 * 1024,
              retryDelays: [0, 1000, 3000, 5000],
            }}
            dashboardConfig={{
              mode: 'inline',
              height: 450,
              showProgressDetails: true,
              note: 'Upload files up to 100MB. Supports images, PDFs, and documents.',
              theme: 'light',
              proudlyDisplayPoweredByUppy: false,
            }}
            restrictions={{
              maxFileSize: 100 * 1024 * 1024,
              maxNumberOfFiles: 10,
              allowedFileTypes: ['image/*', '.pdf', '.docx', '.txt', '.zip'],
            }}
            plugins={['Webcam']}
            pluginConfigs={{
              Webcam: {
                countdown: 3,
                modes: ['picture', 'video-audio'],
              },
            }}
            metadata={{
              source: 'formio-uppy-demo',
              timestamp: new Date().toISOString(),
            }}
            autoProceed={false}
            allowMultipleUploads={true}
            onUploadSuccess={(file: UploadFileResult) => {
              setUppyFiles(prev => [...prev, file]);
              console.log('✅ Uppy upload successful:', file);
            }}
            onUploadError={(error: UploadError) => {
              setUppyErrors(prev => [...prev, error]);
              console.error('❌ Uppy upload failed:', error);
            }}
            onComplete={(result) => {
              console.log('🎉 All uploads complete:', {
                successful: result.successful.length,
                failed: result.failed.length,
              });
            }}
          />

          {/* Success Display */}
          {uppyFiles.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#f0fff4',
              borderRadius: '6px',
              border: '1px solid #9ae6b4'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#22543d'
              }}>
                ✅ Successfully Uploaded ({uppyFiles.length}):
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {uppyFiles.map(file => (
                  <li key={file.id} style={{
                    padding: '12px',
                    background: 'white',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #c6f6d5',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {file.name}
                    </div>
                    <div style={{ color: '#718096', fontSize: '13px' }}>
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB | Type: {file.type}
                    </div>
                    <a
                      href={file.uploadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#4299e1',
                        textDecoration: 'none',
                        fontSize: '13px'
                      }}
                    >
                      🔗 View File
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Display */}
          {uppyErrors.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#fff5f5',
              borderRadius: '6px',
              border: '1px solid #feb2b2'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#742a2a'
              }}>
                ❌ Upload Errors ({uppyErrors.length}):
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {uppyErrors.map((error, idx) => (
                  <li key={idx} style={{
                    padding: '12px',
                    background: 'white',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #fc8181',
                    fontSize: '14px'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {error.file.name}
                    </div>
                    <div style={{ color: '#e53e3e', fontSize: '13px' }}>
                      {error.error.message}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Example */}
          <details style={{ marginTop: '24px' }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: 600,
              padding: '12px',
              background: '#faf5ff',
              borderRadius: '6px',
              marginBottom: '12px'
            }}>
              📝 View Code Example
            </summary>
            <pre style={{
              background: '#1a202c',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
{`import { UppyFileUpload } from '@formio/react';
import type { UploadFileResult, UploadError } from '@formio/react';

<UppyFileUpload
  tusConfig={{
    endpoint: 'https://tusd.tusdemo.net/files/',
    chunkSize: 5 * 1024 * 1024,
  }}
  dashboardConfig={{
    mode: 'inline',
    height: 450,
    showProgressDetails: true,
    note: 'Upload files up to 100MB',
  }}
  restrictions={{
    maxFileSize: 100 * 1024 * 1024,
    maxNumberOfFiles: 10,
    allowedFileTypes: ['image/*', '.pdf'],
  }}
  plugins={['Webcam']}
  pluginConfigs={{
    Webcam: {
      countdown: 3,
      modes: ['picture', 'video-audio'],
    },
  }}
  onUploadSuccess={(file: UploadFileResult) => {
    console.log('Uploaded:', file);
  }}
  onUploadError={(error: UploadError) => {
    console.error('Failed:', error);
  }}
  onComplete={(result) => {
    console.log('Complete:', result);
  }}
/>`}
            </pre>
          </details>
        </div>
      )}

      {/* Component Comparison */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        background: '#f7fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '16px',
          color: '#2d3748'
        }}>
          🔍 Component Comparison
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              TusFileUpload
            </h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#4a5568' }}>
              <li>✅ Lightweight (smaller bundle)</li>
              <li>✅ Simple API</li>
              <li>✅ Quick integration</li>
              <li>✅ Built-in UI</li>
              <li>⚠️ Basic features only</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              UppyFileUpload
            </h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#4a5568' }}>
              <li>✅ Rich dashboard UI</li>
              <li>✅ Plugin ecosystem</li>
              <li>✅ Advanced features</li>
              <li>✅ Highly customizable</li>
              <li>⚠️ Larger bundle size</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#e6f7ff',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#0050b3'
        }}>
          <strong>💡 Recommendation:</strong> Use TusFileUpload for simple uploads,
          UppyFileUpload when you need advanced features like webcam, image editing, or cloud storage.
        </div>
      </div>
    </div>
  );
}