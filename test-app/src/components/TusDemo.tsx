/**
 * TusDemo Component - REAL TUS Implementation
 *
 * Interactive demonstration of TUS file upload capabilities using actual tus-js-client.
 * NO SIMULATIONS - all uploads are real TUS protocol requests.
 */

import React, { useState, useRef } from 'react';
import * as tus from 'tus-js-client';

interface UploadFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
  upload?: tus.Upload;
  url?: string;
  error?: string;
  speed?: number;
  timeRemaining?: number;
}

export const TusDemo: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const features = [
    { id: 'basic', name: 'Basic Upload', icon: '📤' },
    { id: 'pause-resume', name: 'Pause/Resume', icon: '⏯️' },
    { id: 'multiple', name: 'Multiple Files', icon: '📁' },
    { id: 'validation', name: 'Validation', icon: '✓' },
    { id: 'progress', name: 'Progress Tracking', icon: '📊' },
    { id: 'error', name: 'Error Handling', icon: '⚠️' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadFile[] = Array.from(selectedFiles).map(file => ({
      id: `tus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Auto-start uploads
    newFiles.forEach((fileData, index) => {
      const actualFile = selectedFiles[index];
      startTusUpload(fileData.id, actualFile);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startTusUpload = (fileId: string, file: File) => {
    const upload = new tus.Upload(file, {
      // Use TUS test server or local Form.io server
      endpoint: 'http://localhost:1080/files/',
      retryDelays: [0, 1000, 3000, 5000, 10000],
      chunkSize: 1024 * 1024, // 1MB chunks
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: (error) => {
        console.error('TUS Upload Error:', error);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, status: 'error' as const, error: error.message }
              : f
          )
        );
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = (bytesUploaded / bytesTotal) * 100;

        setFiles(prev =>
          prev.map(f => {
            if (f.id !== fileId) return f;

            // Calculate upload speed (bytes per second)
            const speed = bytesUploaded / ((Date.now() - parseInt(fileId.split('-')[1])) / 1000);
            const timeRemaining = (bytesTotal - bytesUploaded) / speed;

            return {
              ...f,
              progress: percentage,
              status: 'uploading' as const,
              speed: Math.round(speed / 1024), // KB/s
              timeRemaining: Math.round(timeRemaining),
            };
          })
        );
      },
      onSuccess: () => {
        console.log('TUS Upload Complete:', upload.url);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, status: 'completed' as const, progress: 100, url: upload.url }
              : f
          )
        );
      },
    });

    // Store upload instance for pause/resume
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId ? { ...f, upload, status: 'uploading' as const } : f
      )
    );

    upload.start();
  };

  const pauseUpload = (fileId: string) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id === fileId && f.upload) {
          f.upload.abort();
          return { ...f, status: 'paused' as const };
        }
        return f;
      })
    );
  };

  const resumeUpload = (fileId: string) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id === fileId && f.upload) {
          f.upload.start();
          return { ...f, status: 'uploading' as const };
        }
        return f;
      })
    );
  };

  const cancelUpload = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.upload) {
        file.upload.abort();
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return '--';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const codeExamples: Record<string, string> = {
    basic: `import * as tus from 'tus-js-client';

const upload = new tus.Upload(file, {
  endpoint: 'http://localhost:1080/files/',
  metadata: {
    filename: file.name,
    filetype: file.type
  },
  onSuccess: () => {
    console.log('Upload complete:', upload.url);
  },
  onError: (error) => {
    console.error('Upload failed:', error);
  }
});

upload.start();`,
    'pause-resume': `const upload = new tus.Upload(file, {
  endpoint: 'http://localhost:1080/files/',
  onProgress: (bytesUploaded, bytesTotal) => {
    const percentage = (bytesUploaded / bytesTotal) * 100;
    console.log(\`Progress: \${percentage}%\`);
  }
});

upload.start();

// Pause upload
upload.abort();

// Resume upload (from exact byte position)
upload.start();`,
    multiple: `const files = Array.from(fileInput.files);

files.forEach(file => {
  const upload = new tus.Upload(file, {
    endpoint: 'http://localhost:1080/files/',
    retryDelays: [0, 1000, 3000, 5000],
    onSuccess: () => {
      console.log(\`File \${file.name} uploaded\`);
    }
  });

  upload.start();
});`,
    validation: `// Client-side validation
if (file.size > 50 * 1024 * 1024) {
  throw new Error('File too large (max 50MB)');
}

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

const upload = new tus.Upload(file, {
  endpoint: 'http://localhost:1080/files/',
  // ... rest of config
});`,
    progress: `const upload = new tus.Upload(file, {
  endpoint: 'http://localhost:1080/files/',
  onProgress: (bytesUploaded, bytesTotal) => {
    const percentage = (bytesUploaded / bytesTotal) * 100;

    // Calculate speed (bytes/second)
    const elapsed = Date.now() - startTime;
    const speed = bytesUploaded / (elapsed / 1000);

    // Estimate time remaining
    const remaining = (bytesTotal - bytesUploaded) / speed;

    console.log(\`\${percentage.toFixed(1)}% at \${(speed / 1024).toFixed(0)} KB/s\`);
    console.log(\`ETA: \${Math.round(remaining)}s\`);
  }
});`,
    error: `const upload = new tus.Upload(file, {
  endpoint: 'http://localhost:1080/files/',

  // Exponential backoff retry strategy
  retryDelays: [0, 1000, 3000, 5000, 10000],

  onError: (error) => {
    console.error('Upload error:', error.message);

    // TUS automatically retries on:
    // - Network failures (ECONNREFUSED, timeout)
    // - Server errors (500, 503)
    // - Temporary failures
  },

  onSuccess: () => {
    console.log('Upload succeeded after retries');
  }
});`,
  };

  return (
    <div className="tus-demo-container">
      <div className="demo-header">
        <h2>🚀 TUS File Upload - REAL Implementation</h2>
        <p>Actual TUS protocol uploads to http://localhost:1080 (no simulations)</p>
      </div>

      <div className="demo-features">
        {features.map(feature => (
          <button
            key={feature.id}
            className={`feature-button ${selectedFeature === feature.id ? 'active' : ''}`}
            onClick={() => setSelectedFeature(feature.id)}
          >
            <span className="feature-icon">{feature.icon}</span>
            <span className="feature-name">{feature.name}</span>
          </button>
        ))}
      </div>

      <div className="demo-content">
        <div className="demo-interactive">
          <h3>Try Real TUS Upload</h3>

          <div className="demo-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              id="tus-file-input"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="add-file-button"
            >
              + Select Files to Upload
            </button>

            {files.length === 0 ? (
              <div className="empty-state">
                <p>Click "Select Files" to start a real TUS upload</p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Open DevTools Network tab to see TUS requests
                </p>
              </div>
            ) : (
              <div className="demo-file-list">
                {files.map(file => (
                  <div key={file.id} className={`demo-file-item status-${file.status}`}>
                    <div className="file-icon">📄</div>

                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        {formatFileSize(file.size)}
                        {file.status === 'uploading' &&
                          ` • ${Math.round(file.progress)}% • ${file.speed} KB/s • ETA: ${formatTime(file.timeRemaining || 0)}`}
                        {file.status === 'completed' && file.url && (
                          <div style={{ fontSize: '11px', color: '#2ecc71', marginTop: '4px' }}>
                            ✓ Uploaded to: {file.url}
                          </div>
                        )}
                        {file.status === 'error' && file.error && (
                          <div style={{ fontSize: '11px', color: '#e74c3c', marginTop: '4px' }}>
                            ✗ Error: {file.error}
                          </div>
                        )}
                      </div>

                      {(file.status === 'uploading' || file.status === 'paused') && (
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="file-controls">
                      {file.status === 'uploading' && (
                        <button onClick={() => pauseUpload(file.id)}>
                          ⏸ Pause
                        </button>
                      )}
                      {file.status === 'paused' && (
                        <button onClick={() => resumeUpload(file.id)}>
                          ▶ Resume
                        </button>
                      )}
                      {file.status !== 'completed' && (
                        <button
                          onClick={() => cancelUpload(file.id)}
                          className="cancel-button"
                        >
                          ✕ Cancel
                        </button>
                      )}
                      {file.status === 'completed' && (
                        <span className="completed-badge">✓ Complete</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="demo-stats">
            <div className="stat">
              <div className="stat-label">Total Files</div>
              <div className="stat-value">{files.length}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Completed</div>
              <div className="stat-value">
                {files.filter(f => f.status === 'completed').length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">In Progress</div>
              <div className="stat-value">
                {files.filter(f => f.status === 'uploading').length}
              </div>
            </div>
          </div>
        </div>

        <div className="demo-code">
          <h3>Code Example</h3>
          <pre className="code-block">
            <code>{codeExamples[selectedFeature]}</code>
          </pre>

          <div className="code-notes">
            <h4>Key Features</h4>
            {selectedFeature === 'basic' && (
              <ul>
                <li>Simple, battle-tested tus-js-client</li>
                <li>Works with any TUS-compatible server</li>
                <li>Automatic retry on network failure</li>
                <li>Only 45KB minified + gzipped</li>
              </ul>
            )}
            {selectedFeature === 'pause-resume' && (
              <ul>
                <li>Pause at any time with upload.abort()</li>
                <li>Resume from exact byte position</li>
                <li>Survives browser crashes (with fingerprinting)</li>
                <li>No server-side session required</li>
              </ul>
            )}
            {selectedFeature === 'multiple' && (
              <ul>
                <li>Upload multiple files in parallel</li>
                <li>Each file has independent progress</li>
                <li>Configurable retry per file</li>
                <li>No batch size limits</li>
              </ul>
            )}
            {selectedFeature === 'validation' && (
              <ul>
                <li>Validate before upload starts</li>
                <li>Check file size, type, extension</li>
                <li>Custom validation logic</li>
                <li>Save bandwidth on invalid files</li>
              </ul>
            )}
            {selectedFeature === 'progress' && (
              <ul>
                <li>Real-time byte-level progress</li>
                <li>Calculate upload speed dynamically</li>
                <li>Estimate time remaining accurately</li>
                <li>Progress persists across resume</li>
              </ul>
            )}
            {selectedFeature === 'error' && (
              <ul>
                <li>Exponential backoff: 0, 1s, 3s, 5s, 10s</li>
                <li>Automatic retry on network/server errors</li>
                <li>Detailed error messages</li>
                <li>Graceful degradation</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="demo-benefits">
        <h3>Why TUS Protocol?</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h4>Lightweight</h4>
            <p>45KB total - minimal bundle impact</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h4>Reliable</h4>
            <p>Resume from exact byte on failure</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h4>Focused</h4>
            <p>Does one thing exceptionally well</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌐</div>
            <h4>Standard</h4>
            <p>Open protocol with wide server support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TusDemo;