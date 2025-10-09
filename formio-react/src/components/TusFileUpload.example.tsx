/**
 * TusFileUpload Usage Examples
 * 
 * This file demonstrates various usage patterns for the TUS file upload component
 */

import React, { useState } from 'react';
import { TusFileUpload, useTusUpload } from './TusFileUpload.index';
import type { UploadFile, UploadProgress } from './TusFileUpload.types';

/**
 * Example 1: Basic Usage
 */
export function BasicExample() {
  return (
    <TusFileUpload
      endpoint="https://tusd.tusdemo.net/files/"
      onSuccess={(files) => console.log('Uploaded:', files)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}

/**
 * Example 2: Advanced Configuration with Progress Tracking
 */
export function AdvancedExample() {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  return (
    <div>
      <h2>File Upload with Progress Tracking</h2>
      
      <TusFileUpload
        endpoint="https://tusd.tusdemo.net/files/"
        chunkSize={5 * 1024 * 1024} // 5MB chunks
        maxFileSize={100 * 1024 * 1024} // 100MB limit
        maxFiles={5}
        allowedTypes={['image/*', '.pdf', '.docx']}
        metadata={{
          userId: '123',
          projectId: 'abc',
        }}
        onProgress={(fileId, progress) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress.percentage }));
        }}
        onSuccess={(files) => {
          setUploadedFiles(prev => [...prev, ...files]);
          console.log('Upload complete:', files);
        }}
        onError={(error, file) => {
          console.error(`Upload failed for ${file?.name}:`, error);
        }}
        multiple={true}
        showPreviews={true}
        autoStart={true}
      />

      {/* Display overall progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Upload Progress:</h3>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId}>
              File {fileId}: {progress}%
            </div>
          ))}
        </div>
      )}

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map(file => (
              <li key={file.id}>
                {file.name} - <a href={file.uploadUrl} target="_blank" rel="noopener noreferrer">Download</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Custom UI with useTusUpload Hook
 */
export function CustomUIExample() {
  const [files, setFiles] = useState<Map<string, { name: string; progress: number }>>(new Map());

  const { uploadFile, pauseUpload, resumeUpload, cancelUpload } = useTusUpload({
    endpoint: 'https://tusd.tusdemo.net/files/',
    onProgress: (fileId, progress) => {
      setFiles(prev => {
        const updated = new Map(prev);
        const file = updated.get(fileId);
        if (file) {
          updated.set(fileId, { ...file, progress: progress.percentage });
        }
        return updated;
      });
    },
    onSuccess: (fileId, url) => {
      console.log(`File ${fileId} uploaded to ${url}`);
    },
    onError: (fileId, error) => {
      console.error(`Upload failed for ${fileId}:`, error);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      const fileId = `${Date.now()}-${Math.random()}`;
      setFiles(prev => new Map(prev).set(fileId, { name: file.name, progress: 0 }));
      uploadFile(fileId, file);
    });
  };

  return (
    <div>
      <h2>Custom File Upload UI</h2>
      
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ marginBottom: '20px' }}
      />

      <div>
        {Array.from(files.entries()).map(([fileId, file]) => (
          <div key={fileId} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <div>{file.name}</div>
            <div>Progress: {file.progress}%</div>
            <div>
              <button onClick={() => pauseUpload(fileId)}>Pause</button>
              <button onClick={() => resumeUpload(fileId)}>Resume</button>
              <button onClick={() => cancelUpload(fileId)}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Integration with Form.io
 */
export function FormioIntegrationExample({ component, onChange }: any) {
  return (
    <TusFileUpload
      endpoint={component.storage?.url || 'https://tusd.tusdemo.net/files/'}
      maxFileSize={component.fileMaxSize || 50 * 1024 * 1024}
      allowedTypes={component.filePattern ? [component.filePattern] : []}
      multiple={component.multiple !== false}
      onSuccess={(files) => {
        // Update Form.io component value
        const formioValue = files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          url: f.uploadUrl,
          storage: 'url',
        }));
        onChange(formioValue);
      }}
      onError={(error, file) => {
        console.error('Upload failed:', error);
        // Optionally trigger Form.io validation error
      }}
      metadata={{
        formId: component._form,
        componentKey: component.key,
      }}
    />
  );
}

/**
 * Example 5: Large File Uploads with Detailed Progress
 */
export function LargeFileExample() {
  const [stats, setStats] = useState<{
    speed?: number;
    timeRemaining?: number;
    bytesUploaded?: number;
    bytesTotal?: number;
  }>({});

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds === Infinity) return 'Calculating...';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div>
      <h2>Large File Upload</h2>
      
      <TusFileUpload
        endpoint="https://tusd.tusdemo.net/files/"
        chunkSize={25 * 1024 * 1024} // 25MB chunks
        maxFileSize={5 * 1024 * 1024 * 1024} // 5GB limit
        onProgress={(fileId, progress) => {
          setStats({
            speed: progress.speed,
            timeRemaining: progress.timeRemaining,
            bytesUploaded: progress.bytesUploaded,
            bytesTotal: progress.bytesTotal,
          });
        }}
        onSuccess={(files) => {
          console.log('Large file uploaded:', files);
          setStats({});
        }}
      />

      {/* Display detailed stats */}
      {stats.speed && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Upload Statistics:</h3>
          <p>Speed: {formatBytes(stats.speed || 0)}/s</p>
          <p>Uploaded: {formatBytes(stats.bytesUploaded || 0)} / {formatBytes(stats.bytesTotal || 0)}</p>
          <p>Time Remaining: {formatTime(stats.timeRemaining || 0)}</p>
        </div>
      )}
    </div>
  );
}

export default {
  BasicExample,
  AdvancedExample,
  CustomUIExample,
  FormioIntegrationExample,
  LargeFileExample,
};
