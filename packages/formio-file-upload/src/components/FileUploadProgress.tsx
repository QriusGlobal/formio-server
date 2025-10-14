/**
 * File Upload Progress Component
 *
 * React component for displaying async file generation progress
 * Shows real-time progress from BullMQ job queue
 */

import React, { useEffect, useState, useCallback } from 'react';

import { AsyncFileProcessor, type JobStatus } from '../async/AsyncFileProcessor';

interface FileUploadProgressProps {
  jobId: string;
  onComplete?: (result: JobStatus) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  pollingInterval?: number;
}

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  jobId,
  onComplete,
  onError,
  onCancel,
  pollingInterval = 1000
}) => {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [processor] = useState(() => new AsyncFileProcessor('/api/file-generation', pollingInterval));

  // Poll job status
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const result = await processor.pollJobUntilComplete(
          jobId,
          (progress, status) => {
            if (!cancelled) {
              setStatus(prev => ({ ...prev!, progress, status: status as any }));
            }
          }
        );

        if (!cancelled) {
          setStatus(result);
          if (onComplete) {
            onComplete(result);
          }
        }
      } catch (error_) {
        if (!cancelled) {
          const error = error_ instanceof Error ? error_ : new Error('Unknown error');
          setError(error);
          if (onError) {
            onError(error);
          }
        }
      }
    };

    // Start polling
    poll();

    // Cleanup on unmount
    return () => {
      cancelled = true;
    };
  }, [jobId, processor, onComplete, onError]);

  // Handle cancel
  const handleCancel = useCallback(async () => {
    try {
      await processor.cancelJob(jobId);
      if (onCancel) {
        onCancel();
      }
    } catch (error_) {
      console.error('Failed to cancel job:', error_);
      setError(error_ instanceof Error ? error_ : new Error('Failed to cancel job'));
    }
  }, [jobId, processor, onCancel]);

  // Handle download
  const handleDownload = useCallback(async () => {
    if (status?.status !== 'completed') {
      return;
    }

    try {
      const blob = await processor.downloadFile(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = status.result?.filename || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error_) {
      console.error('Failed to download file:', error_);
      setError(error_ instanceof Error ? error_ : new Error('Failed to download file'));
    }
  }, [status, jobId, processor]);

  // Render error state
  if (error) {
    return (
      <div className="file-upload-progress error">
        <div className="progress-icon">❌</div>
        <div className="progress-message">
          <strong>Error:</strong> {error.message}
        </div>
        <button onClick={() => setError(null)} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  // Render loading state
  if (!status) {
    return (
      <div className="file-upload-progress loading">
        <div className="progress-spinner" />
        <div className="progress-message">Initializing...</div>
      </div>
    );
  }

  // Render completed state
  if (status.status === 'completed') {
    return (
      <div className="file-upload-progress completed">
        <div className="progress-icon">✅</div>
        <div className="progress-details">
          <div className="progress-message">
            <strong>Completed!</strong>
          </div>
          {status.result && (
            <div className="file-info">
              <div>File: {status.result.filename}</div>
              <div>Size: {formatFileSize(status.result.size)}</div>
              <div>Processing time: {status.result.processingTime}ms</div>
            </div>
          )}
        </div>
        <button onClick={handleDownload} className="btn-download">
          Download
        </button>
      </div>
    );
  }

  // Render failed state
  if (status.status === 'failed') {
    return (
      <div className="file-upload-progress failed">
        <div className="progress-icon">❌</div>
        <div className="progress-message">
          <strong>Failed:</strong> {status.error?.message || 'Unknown error'}
        </div>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  // Render in-progress state
  return (
    <div className="file-upload-progress active">
      <div className="progress-header">
        <div className="progress-title">
          {status.status === 'waiting' ? 'Waiting in queue...' : 'Processing...'}
        </div>
        <div className="progress-percentage">{status.progress}%</div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${status.progress}%` }}
         />
      </div>

      <div className="progress-actions">
        <button onClick={handleCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

/**
 * Format file size helper
 */
function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Export CSS for component (should be imported by consuming app)
export const FileUploadProgressCSS = `
.file-upload-progress {
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  margin: 10px 0;
}

.file-upload-progress.error,
.file-upload-progress.failed {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.file-upload-progress.completed {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-title {
  font-weight: 500;
  font-size: 14px;
}

.progress-percentage {
  font-weight: 600;
  font-size: 16px;
  color: #007bff;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
  transition: width 0.3s ease;
}

.progress-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.progress-message {
  margin-bottom: 10px;
}

.file-info {
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}

.file-info div {
  margin: 2px 0;
}

.progress-actions {
  margin-top: 10px;
}

.btn-cancel,
.btn-retry,
.btn-download {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-retry {
  background: #ffc107;
  color: #000;
}

.btn-retry:hover {
  background: #e0a800;
}

.btn-download {
  background: #28a745;
  color: white;
}

.btn-download:hover {
  background: #218838;
}

.progress-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
