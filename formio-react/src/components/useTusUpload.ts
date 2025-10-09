/**
 * useTusUpload Hook
 *
 * Custom React hook for managing TUS resumable file uploads.
 * Handles upload lifecycle, progress tracking, and error recovery.
 *
 * @example
 * ```tsx
 * const { uploadFile, pauseUpload, resumeUpload } = useTusUpload({
 *   endpoint: 'https://tusd.tusdemo.net/files/',
 *   onProgress: (fileId, progress) => console.log(progress),
 *   onSuccess: (fileId, url) => console.log('Uploaded:', url),
 * });
 * ```
 */

import { useCallback, useRef, useEffect } from 'react';
import * as tus from 'tus-js-client';
import type {
  UseTusUploadOptions,
  UploadProgress,
  TusUploadInstance,
} from './TusFileUpload.types';

export const useTusUpload = ({
  endpoint,
  chunkSize,
  retryDelays = [0, 1000, 3000, 5000, 10000],
  parallelUploads = 3,
  metadata = {},
  onProgress,
  onSuccess,
  onError,
}: UseTusUploadOptions) => {
  // Store active uploads
  const uploadsRef = useRef<Map<string, TusUploadInstance>>(new Map());
  const progressTrackingRef = useRef<Map<string, { startTime: number; startBytes: number }>>(new Map());

  /**
   * Calculate optimal chunk size based on file size
   */
  const calculateChunkSize = useCallback((fileSize: number): number => {
    if (chunkSize) return chunkSize;

    // Dynamic chunk sizing for optimal performance
    if (fileSize < 10 * 1024 * 1024) {
      // < 10MB: 1MB chunks
      return 1024 * 1024;
    } else if (fileSize < 100 * 1024 * 1024) {
      // < 100MB: 5MB chunks
      return 5 * 1024 * 1024;
    } else if (fileSize < 1024 * 1024 * 1024) {
      // < 1GB: 10MB chunks
      return 10 * 1024 * 1024;
    } else {
      // >= 1GB: 25MB chunks
      return 25 * 1024 * 1024;
    }
  }, [chunkSize]);

  /**
   * Calculate upload speed and time remaining
   */
  const calculateSpeed = useCallback((fileId: string, bytesUploaded: number): { speed: number; timeRemaining: number } => {
    const tracking = progressTrackingRef.current.get(fileId);

    if (!tracking) {
      // Initialize tracking
      progressTrackingRef.current.set(fileId, {
        startTime: Date.now(),
        startBytes: bytesUploaded,
      });
      return { speed: 0, timeRemaining: Infinity };
    }

    const elapsedTime = (Date.now() - tracking.startTime) / 1000; // seconds
    const uploadedBytes = bytesUploaded - tracking.startBytes;

    if (elapsedTime < 1) {
      return { speed: 0, timeRemaining: Infinity };
    }

    const speed = uploadedBytes / elapsedTime; // bytes per second
    const upload = uploadsRef.current.get(fileId);
    const totalBytes = upload?.file.size || 0;
    const remainingBytes = totalBytes - bytesUploaded;
    const timeRemaining = speed > 0 ? remainingBytes / speed : Infinity;

    return { speed, timeRemaining };
  }, []);

  /**
   * Start or resume file upload
   */
  const uploadFile = useCallback((fileId: string, file: File) => {
    const existingUpload = uploadsRef.current.get(fileId);

    if (existingUpload) {
      // Resume existing upload
      existingUpload.upload.start();
      return;
    }

    const optimalChunkSize = calculateChunkSize(file.size);

    // Create TUS upload instance
    const upload = new tus.Upload(file, {
      endpoint,
      chunkSize: optimalChunkSize,
      retryDelays,
      parallelUploads,
      storeFingerprintForResuming: true,
      removeFingerprintOnSuccess: true,

      // Metadata
      metadata: {
        filename: file.name,
        filetype: file.type,
        filesize: file.size.toString(),
        lastmodified: file.lastModified.toString(),
        ...metadata,
      },

      // Resume logic
      onShouldRetry: (err, retryAttempt, options) => {
        const status = err.originalResponse?.getStatus();

        // Retry on network errors or 5xx responses
        if (!status || status >= 500) {
          const retryDelays = options.retryDelays;
          return retryDelays ? retryAttempt < retryDelays.length : false;
        }

        // Don't retry on client errors (4xx)
        if (status >= 400 && status < 500) {
          return false;
        }

        return true;
      },

      // Progress tracking
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        const { speed, timeRemaining } = calculateSpeed(fileId, bytesUploaded);

        const progress: UploadProgress = {
          bytesUploaded,
          bytesTotal,
          percentage,
          speed,
          timeRemaining,
        };

        onProgress?.(fileId, progress);
      },

      // Success handler
      onSuccess: () => {
        const uploadUrl = upload.url || '';
        uploadsRef.current.delete(fileId);
        progressTrackingRef.current.delete(fileId);
        onSuccess?.(fileId, uploadUrl);
      },

      // Error handler
      onError: (error: Error) => {
        console.error(`Upload failed for ${fileId}:`, error);
        onError?.(fileId, error);

        // Attempt auto-resume on network errors
        if (isNetworkError(error)) {
          console.log(`Network error detected, will auto-retry for ${fileId}`);
          // TUS client handles retry automatically via retryDelays
        }
      },

      // Chunk completion (for debugging/monitoring)
      onChunkComplete: (chunkSize: number, bytesAccepted: number, bytesTotal: number) => {
        console.debug(`Chunk uploaded: ${chunkSize} bytes (${bytesAccepted}/${bytesTotal})`);
      },
    });

    // Store upload instance
    uploadsRef.current.set(fileId, {
      upload,
      file,
      fileId,
    });

    // Check for previous uploads to resume
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        console.log(`Resuming previous upload for ${fileId}`);
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start upload
      upload.start();
    });
  }, [endpoint, calculateChunkSize, retryDelays, parallelUploads, metadata, calculateSpeed, onProgress, onSuccess, onError]);

  /**
   * Pause upload
   */
  const pauseUpload = useCallback((fileId: string) => {
    const uploadInstance = uploadsRef.current.get(fileId);
    if (uploadInstance) {
      uploadInstance.upload.abort();
      console.log(`Upload paused: ${fileId}`);
    }
  }, []);

  /**
   * Resume upload
   */
  const resumeUpload = useCallback((fileId: string) => {
    const uploadInstance = uploadsRef.current.get(fileId);
    if (uploadInstance) {
      uploadInstance.upload.start();
      console.log(`Upload resumed: ${fileId}`);
    }
  }, []);

  /**
   * Cancel upload (abort and remove fingerprint)
   */
  const cancelUpload = useCallback((fileId: string) => {
    const uploadInstance = uploadsRef.current.get(fileId);
    if (uploadInstance) {
      uploadInstance.upload.abort(true); // true = delete upload from server
      uploadsRef.current.delete(fileId);
      progressTrackingRef.current.delete(fileId);
      console.log(`Upload cancelled: ${fileId}`);
    }
  }, []);

  /**
   * Get upload status
   */
  const getUploadStatus = useCallback((fileId: string) => {
    const uploadInstance = uploadsRef.current.get(fileId);
    if (!uploadInstance) return null;

    return {
      fileId,
      fileName: uploadInstance.file.name,
      fileSize: uploadInstance.file.size,
      url: uploadInstance.upload.url || null,
    };
  }, []);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      // Abort all active uploads on unmount
      uploadsRef.current.forEach((instance) => {
        instance.upload.abort();
      });
      uploadsRef.current.clear();
      progressTrackingRef.current.clear();
    };
  }, []);

  return {
    uploadFile,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    getUploadStatus,
  };
};

/**
 * Check if error is a network error
 */
function isNetworkError(error: Error): boolean {
  const networkErrorPatterns = [
    'network',
    'timeout',
    'connection',
    'disconnected',
    'offline',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
  ];

  const errorMessage = error.message.toLowerCase();
  return networkErrorPatterns.some(pattern => errorMessage.includes(pattern));
}

export default useTusUpload;