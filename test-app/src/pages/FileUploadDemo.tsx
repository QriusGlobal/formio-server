import { useState } from 'react';

export function FileUploadDemo() {
  const [activeTab, setActiveTab] = useState<'tus' | 'uppy'>('tus');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleTusUpload = async (file: File) => {
    setUploadStatus('Uploading with TUS...');

    // Direct TUS upload using tus-js-client
    const tus = await import('tus-js-client');

    const upload = new tus.Upload(file, {
      endpoint: 'http://localhost:1080/files/',
      retryDelays: [0, 3000, 5000],
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      onError: (error) => {
        console.error('TUS Error:', error);
        setUploadStatus(`Error: ${error.message}`);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setUploadStatus(`Uploading: ${percentage}%`);
      },
      onSuccess: () => {
        setUploadStatus(`Success! File uploaded to ${upload.url}`);
        console.log('Upload URL:', upload.url);
      }
    });

    upload.start();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }} data-testid="file-upload-demo">
      <h1>🚀 File Upload Demo - ACTUALLY WORKING</h1>

      <div style={{ marginBottom: '20px' }} data-testid="upload-tab-buttons">
        <button
          onClick={() => setActiveTab('tus')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: activeTab === 'tus' ? '#4a90e2' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          data-testid="tab-tus-upload"
        >
          TUS Upload
        </button>
        <button
          onClick={() => setActiveTab('uppy')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'uppy' ? '#4a90e2' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          data-testid="tab-uppy-upload"
        >
          Uppy Upload
        </button>
      </div>

      {activeTab === 'tus' && (
        <div style={{ border: '2px solid #4a90e2', padding: '20px', borderRadius: '8px' }} data-testid="tus-upload-container">
          <h2>TUS Resumable Upload</h2>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleTusUpload(file);
            }}
            data-testid="tus-file-input"
          />
          {uploadStatus && (
            <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }} data-testid="tus-upload-status">
              {uploadStatus}
            </div>
          )}
          <p style={{ marginTop: '10px', color: '#666' }}>
            Open DevTools → Network tab to see XHR calls to http://localhost:1080/files/
          </p>
        </div>
      )}

      {activeTab === 'uppy' && (
        <div style={{ border: '2px solid #e24a4a', padding: '20px', borderRadius: '8px' }} data-testid="uppy-upload-container">
          <h2>Uppy Upload (Coming soon)</h2>
          <p>Building Uppy integration...</p>
        </div>
      )}
    </div>
  );
}