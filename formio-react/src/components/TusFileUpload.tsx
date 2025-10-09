/**
 * TusFileUpload Component
 *
 * A production-ready React component for resumable file uploads using TUS protocol.
 *
 * Features:
 * - Drag-and-drop support
 * - Multiple file uploads
 * - Pause/resume/cancel controls
 * - Progress tracking with speed and ETA
 * - Preview thumbnails for images
 * - Dynamic chunk sizing (1MB-25MB)
 * - Automatic resume on network failure
 * - formio.js compatible events
 * - Full accessibility (ARIA)
 *
 * @example
 * ```tsx
 * <TusFileUpload
 *   endpoint="https://tusd.tusdemo.net/files/"
 *   onSuccess={(files) => console.log('Uploaded:', files)}
 *   onError={(error) => console.error('Error:', error)}
 *   maxFileSize={50 * 1024 * 1024}
 *   allowedTypes={['image/*', '.pdf']}
 * />
 * ```
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTusUpload } from './useTusUpload';
import type {
  TusFileUploadProps,
  UploadFile,
  UploadStatus,
  UploadProgress,
} from './TusFileUpload.types';
import './TusFileUpload.css';

export const TusFileUpload: React.FC<TusFileUploadProps> = ({
  endpoint,
  chunkSize,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 10,
  allowedTypes = [],
  metadata = {},
  onSuccess,
  onError,
  onProgress,
  disabled = false,
  multiple = true,
  showPreviews = true,
  autoStart = true,
  className = '',
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const {
    uploadFile,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    getUploadStatus,
  } = useTusUpload({
    endpoint,
    chunkSize,
    metadata,
    onProgress: (fileId, progress) => {
      updateFileProgress(fileId, progress);
      onProgress?.(fileId, progress);
    },
    onSuccess: (fileId, uploadUrl) => {
      updateFileStatus(fileId, 'completed', uploadUrl);
      const completedFile = files.find(f => f.id === fileId);
      if (completedFile) {
        onSuccess?.([{ ...completedFile, uploadUrl }]);
      }
    },
    onError: (fileId, error) => {
      updateFileStatus(fileId, 'error');
      const errorFile = files.find(f => f.id === fileId);
      if (errorFile) {
        onError?.(error, errorFile);
      }
    },
  });

  // File validation
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (maxFileSize && file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${(maxFileSize / 1024 / 1024).toFixed(0)}MB limit`,
      };
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const isAllowed = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
        };
      }
    }

    // Check total file count
    if (files.length >= maxFiles) {
      return {
        valid: false,
        error: `Maximum ${maxFiles} files allowed`,
      };
    }

    return { valid: true };
  }, [maxFileSize, allowedTypes, files.length, maxFiles]);

  // Generate file preview
  const generatePreview = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }, []);

  // Add files to upload queue
  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const newFiles: UploadFile[] = [];

    for (const file of filesArray) {
      const validation = validateFile(file);

      if (!validation.valid) {
        onError?.(new Error(validation.error), { name: file.name, size: file.size } as UploadFile);
        continue;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const preview = showPreviews ? await generatePreview(file) : null;

      const uploadFile: UploadFile = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0,
        preview,
      };

      newFiles.push(uploadFile);
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Auto-start uploads if enabled
    if (autoStart && !disabled) {
      newFiles.forEach(file => {
        uploadFile(file.id, file.file);
      });
    }
  }, [validateFile, generatePreview, showPreviews, autoStart, disabled, uploadFile, onError]);

  // Update file progress
  const updateFileProgress = useCallback((fileId: string, progress: UploadProgress) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId
          ? {
              ...f,
              status: 'uploading' as UploadStatus,
              progress: progress.percentage,
              bytesUploaded: progress.bytesUploaded,
              bytesTotal: progress.bytesTotal,
              speed: progress.speed,
              timeRemaining: progress.timeRemaining,
            }
          : f
      )
    );
  }, []);

  // Update file status
  const updateFileStatus = useCallback((fileId: string, status: UploadStatus, uploadUrl?: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId
          ? { ...f, status, uploadUrl, progress: status === 'completed' ? 100 : f.progress }
          : f
      )
    );
  }, []);

  // File input change handler
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
    // Reset input value to allow re-uploading same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFiles]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  }, [disabled, addFiles]);

  // Click handler for drop zone
  const handleDropZoneClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Control handlers
  const handlePause = useCallback((fileId: string) => {
    pauseUpload(fileId);
    updateFileStatus(fileId, 'paused');
  }, [pauseUpload, updateFileStatus]);

  const handleResume = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      resumeUpload(fileId);
      updateFileStatus(fileId, 'uploading');
    }
  }, [files, resumeUpload, updateFileStatus]);

  const handleCancel = useCallback((fileId: string) => {
    cancelUpload(fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, [cancelUpload]);

  const handleRetry = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      updateFileStatus(fileId, 'pending');
      uploadFile(fileId, file.file);
    }
  }, [files, uploadFile, updateFileStatus]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (!seconds || seconds === Infinity) return 'Calculating...';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className={`tus-file-upload ${className}`}>
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        className={`tus-dropzone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload drop zone"
        aria-disabled={disabled}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="tus-file-input"
          aria-hidden="true"
        />

        <div className="tus-dropzone-content">
          <svg className="tus-dropzone-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 18C5.17107 17.4117 3.58183 16.2641 2.41691 14.7113C1.25199 13.1585 0.565738 11.2749 0.446411 9.31274C0.327084 7.35059 0.779558 5.39546 1.74924 3.69125C2.71893 1.98704 4.16327 0.610705 5.89398 0.73081"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 2V14M12 2L9 5M12 2L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="tus-dropzone-text">
            Drag & drop files here, or <span className="tus-dropzone-link">browse</span>
          </p>
          {(maxFileSize || allowedTypes.length > 0) && (
            <p className="tus-dropzone-hint">
              {allowedTypes.length > 0 && `Allowed: ${allowedTypes.join(', ')} `}
              {maxFileSize && `• Max: ${formatFileSize(maxFileSize)}`}
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="tus-file-list" role="list">
          {files.map(file => (
            <div key={file.id} className={`tus-file-item status-${file.status}`} role="listitem">
              {/* Preview/Icon */}
              <div className="tus-file-preview">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="tus-file-thumbnail" />
                ) : (
                  <div className="tus-file-icon" aria-hidden="true">
                    📄
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="tus-file-info">
                <div className="tus-file-name" title={file.name}>
                  {file.name}
                </div>
                <div className="tus-file-meta">
                  <span>{formatFileSize(file.size)}</span>
                  {file.status === 'uploading' && file.speed && (
                    <>
                      <span className="tus-file-separator">•</span>
                      <span>{formatFileSize(file.speed)}/s</span>
                    </>
                  )}
                  {file.status === 'uploading' && file.timeRemaining && (
                    <>
                      <span className="tus-file-separator">•</span>
                      <span>{formatTimeRemaining(file.timeRemaining)} remaining</span>
                    </>
                  )}
                  {file.status === 'completed' && (
                    <>
                      <span className="tus-file-separator">•</span>
                      <span className="tus-file-status-text">✓ Completed</span>
                    </>
                  )}
                  {file.status === 'error' && (
                    <>
                      <span className="tus-file-separator">•</span>
                      <span className="tus-file-status-text">✗ Error</span>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'paused') && (
                  <div className="tus-progress-container">
                    <div
                      className="tus-progress-bar"
                      role="progressbar"
                      aria-valuenow={file.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Upload progress: ${file.progress}%`}
                    >
                      <div
                        className="tus-progress-fill"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="tus-progress-text">{file.progress}%</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="tus-file-controls">
                {file.status === 'uploading' && (
                  <button
                    onClick={() => handlePause(file.id)}
                    className="tus-control-btn"
                    aria-label="Pause upload"
                    title="Pause"
                  >
                    ⏸
                  </button>
                )}
                {file.status === 'paused' && (
                  <button
                    onClick={() => handleResume(file.id)}
                    className="tus-control-btn"
                    aria-label="Resume upload"
                    title="Resume"
                  >
                    ▶
                  </button>
                )}
                {file.status === 'error' && (
                  <button
                    onClick={() => handleRetry(file.id)}
                    className="tus-control-btn"
                    aria-label="Retry upload"
                    title="Retry"
                  >
                    ↻
                  </button>
                )}
                {file.status !== 'completed' && (
                  <button
                    onClick={() => handleCancel(file.id)}
                    className="tus-control-btn tus-control-cancel"
                    aria-label="Cancel upload"
                    title="Cancel"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TusFileUpload;