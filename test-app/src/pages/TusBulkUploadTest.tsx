import { Form } from '@formio/react';
import { useState, useEffect, useMemo, useCallback } from 'react';

// Note: Form.io file upload module is registered globally in App.tsx
// No need to register here since this component is lazy-loaded

// Extend Window interface for test ready flag
declare global {
  interface Window {
    testPageReady?: boolean;
  }
}

export default function TusBulkUploadTest() {
  const [submission, setSubmission] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [chunkSize, setChunkSize] = useState(5);
  const [parallelUploads, setParallelUploads] = useState(3);
  const [maxFiles, setMaxFiles] = useState(15);
  const [filePattern, setFilePattern] = useState<'images' | 'documents' | 'all'>('images');

  // Performance monitoring: Mark page as ready for Playwright tests
  useEffect(() => {
    // Mark performance milestone
    performance.mark('tus-bulk-test-component-mounted');

    // Set flag for Playwright to detect page ready state
    window.testPageReady = true;

    // Dispatch custom event for alternative detection
    window.dispatchEvent(new Event('test-page-loaded'));

    // Measure time from navigation to component mount
    if (performance.getEntriesByName('navigation-start').length > 0) {
      performance.measure(
        'tus-bulk-test-load-time',
        'navigation-start',
        'tus-bulk-test-component-mounted'
      );
    }

    console.log('✅ TUS Bulk Upload Test page ready for testing');

    return () => {
      // Cleanup on unmount
      window.testPageReady = false;
    };
  }, []);

  // Memoize file pattern computation
  const filePatternValue = useMemo(() => {
    switch (filePattern) {
      case 'images':
        return 'image/*';
      case 'documents':
        return '*.pdf,*.doc,*.docx,*.txt';
      case 'all':
        return '*';
      default:
        return 'image/*';
    }
  }, [filePattern]);

  // Memoize form definition to prevent unnecessary re-renders
  const formDefinition = useMemo(() => ({
    display: 'form',
    components: [
      {
        type: 'htmlelement',
        tag: 'div',
        className: 'alert alert-info',
        content: `
          <h4>📋 TUS Bulk Upload Test Configuration</h4>
          <ul>
            <li><strong>Chunk Size:</strong> ${chunkSize} MB (mobile-optimized for network resilience)</li>
            <li><strong>Parallel Uploads:</strong> ${parallelUploads} files simultaneously</li>
            <li><strong>Max Files:</strong> ${maxFiles} files total</li>
            <li><strong>File Pattern:</strong> ${filePattern} (${filePatternValue})</li>
            <li><strong>TUS Server:</strong> http://localhost:1080/files</li>
          </ul>
          <p><strong>Test Objective:</strong> Upload 10-15 files to validate bulk upload, parallel processing, and mobile compatibility.</p>
        `
      },
      {
        type: 'panel',
        title: 'Bulk File Upload Test',
        key: 'bulkUploadPanel',
        components: [
          {
            type: 'tusupload',
            key: 'bulkPhotos',
            label: `📸 Upload Multiple Files (Max: ${maxFiles})`,
            storage: 'tus',
            url: 'http://localhost:1080/files',
            multiple: true,
            filePattern: filePatternValue,
            fileMaxSize: '50MB',
            fileMinSize: '1KB',
            chunkSize,
            resumable: true,
            parallelUploads,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            description: `Select ${maxFiles} ${filePattern} from your device. Supports: Mobile camera 📷, Photo library 🖼️, File browser 📁, Webcam 💻`,
            placeholder: `Tap/Click to select up to ${maxFiles} ${filePattern}`,
            validate: {
              required: true,
              minFiles: 1,
              maxFiles,
              maxTotalSize: maxFiles * 50 * 1024 * 1024 // maxFiles × 50MB
            },
            conditional: {
              show: null,
              when: null,
              eq: ''
            }
          }
        ]
      },
      {
        type: 'button',
        action: 'submit',
        label: '🚀 Submit Upload Test',
        theme: 'primary',
        block: true,
        size: 'lg'
      }
    ]
  }), [chunkSize, parallelUploads, maxFiles, filePattern, filePatternValue]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSubmit = useCallback((submission: any) => {
    console.log('=== TUS BULK UPLOAD TEST SUBMISSION ===');
    console.log('Full submission:', JSON.stringify(submission, null, 2));
    console.log('Bulk photos array:', submission.data.bulkPhotos);
    console.log('Number of files uploaded:', submission.data.bulkPhotos?.length || 0);

    if (Array.isArray(submission.data.bulkPhotos)) {
      submission.data.bulkPhotos.forEach((file: any, index: number) => {
        console.log(`File ${index + 1}:`, {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type,
          url: file.url,
          storage: file.storage
        });
      });
    }

    setSubmission(submission);
    setError(null);
  }, []);

  const handleError = useCallback((errors: any) => {
    console.error('Form submission errors:', errors);
    setError('Form validation failed. Please check all required fields and file limits.');
  }, []);

  const resetTest = useCallback(() => {
    setSubmission(null);
    setError(null);
    window.location.reload();
  }, []);

  const calculateTotalSize = useCallback((files: any[]) => {
    const totalBytes = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    return { totalBytes, totalMB };
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
          🚀 TUS Bulk Upload Test
        </h1>
        <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.95 }}>
          Test TUS resumable uploads with multiple files (10-15+). Validates parallel processing,
          mobile camera access, and network resilience.
        </p>
      </div>

      {/* Configuration Controls */}
      {!submission && (
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '2px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>⚙️ Test Configuration</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>
                Chunk Size (MB):
              </label>
              <select
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '1rem'
                }}
              >
                <option value={3}>3 MB (3G/4G networks)</option>
                <option value={5}>5 MB (Balanced - Recommended)</option>
                <option value={8}>8 MB (WiFi/5G)</option>
                <option value={10}>10 MB (High-speed only)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>
                Parallel Uploads:
              </label>
              <select
                value={parallelUploads}
                onChange={(e) => setParallelUploads(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '1rem'
                }}
              >
                <option value={1}>1 (Sequential)</option>
                <option value={2}>2 (Mobile networks)</option>
                <option value={3}>3 (Recommended)</option>
                <option value={5}>5 (High-speed)</option>
                <option value={10}>10 (Maximum)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>
                Max Files:
              </label>
              <select
                value={maxFiles}
                onChange={(e) => setMaxFiles(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '1rem'
                }}
              >
                <option value={5}>5 files</option>
                <option value={10}>10 files</option>
                <option value={15}>15 files (Recommended)</option>
                <option value={20}>20 files</option>
                <option value={30}>30 files</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>
                File Type Filter:
              </label>
              <select
                value={filePattern}
                onChange={(e) => setFilePattern(e.target.value as 'images' | 'documents' | 'all')}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '1rem'
                }}
              >
                <option value="images">📷 Images only</option>
                <option value="documents">📄 Documents only</option>
                <option value="all">📦 All file types</option>
              </select>
            </div>
          </div>

          <div style={{
            background: '#e7f3ff',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #b3d9ff',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#004085' }}>
              <strong>💡 Tip:</strong> After changing settings, the form will use the new configuration.
              Test with 10-15 files to validate bulk upload capabilities.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form or Results */}
      {!submission ? (
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
          {/* Success Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>
              ✅ Bulk Upload Test Successful!
            </h2>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', opacity: 0.95 }}>
              {Array.isArray(submission.data.bulkPhotos) && submission.data.bulkPhotos.length} files uploaded successfully
            </p>
            <button
              onClick={resetTest}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              🔄 Run Another Test
            </button>
          </div>

          {/* Upload Statistics */}
          {Array.isArray(submission.data.bulkPhotos) && submission.data.bulkPhotos.length > 0 && (
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>📊 Upload Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                    {submission.data.bulkPhotos.length}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Files Uploaded
                  </div>
                </div>

                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                    {calculateTotalSize(submission.data.bulkPhotos).totalMB}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Total Size (MB)
                  </div>
                </div>

                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1' }}>
                    {chunkSize}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Chunk Size (MB)
                  </div>
                </div>

                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fd7e14' }}>
                    {parallelUploads}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Parallel Uploads
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Uploaded Files List */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>📁 Uploaded Files</h3>
            {Array.isArray(submission.data.bulkPhotos) && submission.data.bulkPhotos.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {submission.data.bulkPhotos.map((file: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8f9fa',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '2px solid #28a745',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>
                        {idx + 1}. {file.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                        Size: {(file.size / 1024).toFixed(2)} KB | Type: {file.type} | Storage: {file.storage}
                      </div>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#007bff',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      View File →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
                No files uploaded
              </div>
            )}
          </div>

          {/* Raw Submission Data */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>🔍 Raw Submission Data</h3>
            <pre style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              border: '1px solid #dee2e6'
            }}>
              {JSON.stringify(submission.data, null, 2)}
            </pre>
          </div>

          {/* Test Validation */}
          <div style={{
            background: '#d1ecf1',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '2rem',
            border: '2px solid #bee5eb'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0c5460' }}>✅ Test Validation Checklist</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#0c5460' }}>
              <li>
                <strong>Multiple Files:</strong>{' '}
                {Array.isArray(submission.data.bulkPhotos) && submission.data.bulkPhotos.length >= 10
                  ? `✅ PASS (${submission.data.bulkPhotos.length} files)`
                  : `⚠️ Upload 10+ files for full test`}
              </li>
              <li>
                <strong>File Data Structure:</strong>{' '}
                {Array.isArray(submission.data.bulkPhotos) ? '✅ PASS' : '❌ FAIL'} - Array of file objects
              </li>
              <li>
                <strong>File URLs Present:</strong>{' '}
                {Array.isArray(submission.data.bulkPhotos) &&
                submission.data.bulkPhotos.every((f: any) => f.url)
                  ? '✅ PASS'
                  : '❌ FAIL'}{' '}
                - All files have URLs
              </li>
              <li>
                <strong>TUS Storage:</strong>{' '}
                {Array.isArray(submission.data.bulkPhotos) &&
                submission.data.bulkPhotos.every((f: any) => f.storage === 'tus')
                  ? '✅ PASS'
                  : '⚠️ CHECK'}{' '}
                - All files use TUS protocol
              </li>
              <li>
                <strong>File Metadata:</strong>{' '}
                {Array.isArray(submission.data.bulkPhotos) &&
                submission.data.bulkPhotos.every((f: any) => f.name && f.size && f.type)
                  ? '✅ PASS'
                  : '❌ FAIL'}{' '}
                - Name, size, type present
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Documentation Link */}
      <div style={{
        background: '#fff3cd',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '2rem',
        border: '1px solid #ffc107'
      }}>
        <strong>📚 Documentation:</strong> See{' '}
        <code>/docs/TUS_BULK_MOBILE_UPLOAD_GUIDE.md</code> for complete TUS bulk upload guide
      </div>
    </div>
  );
}
