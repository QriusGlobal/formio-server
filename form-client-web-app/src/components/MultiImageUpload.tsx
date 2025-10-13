import { useState, useEffect, useCallback, useRef } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import Compressor from '@uppy/compressor';
import Webcam from '@uppy/webcam';
import GoldenRetriever from '@uppy/golden-retriever';
import { Dashboard } from '@uppy/react';
import '@uppy/core/css/style.css';
import '@uppy/dashboard/css/style.css';
import { verifyFileType, sanitizeFilename, UPLOAD_CONSTANTS } from '@formio/file-upload';
import { logger } from '../utils/logger';

export interface MultiImageUploadProps {
  formKey?: string;
  maxFiles?: number;
  compressionQuality?: number;
  autoNumbering?: boolean;
  extractMetadata?: boolean;
  onChange?: (files: UploadedFile[]) => void;
  value?: UploadedFile[];
}

export interface UploadedFile {
  url: string;
  name: string;
  number: number;
  timestamp: number;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  size: number;
  type: string;
}

export function MultiImageUpload({
  formKey = 'site_images',
  maxFiles = UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
  compressionQuality = UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
  autoNumbering = true,
  extractMetadata = true,
  onChange,
  value = []
}: MultiImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(value);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      id: formKey,
      restrictions: {
        maxNumberOfFiles: maxFiles,
        allowedFileTypes: ['image/*', 'video/*'],
        maxFileSize: 10 * 1024 * 1024
      },
      autoProceed: false,
      meta: {
        formKey
      }
    })
      .use(Tus, {
        endpoint: UPLOAD_CONSTANTS.DEFAULT_TUS_ENDPOINT,
        chunkSize: UPLOAD_CONSTANTS.DEFAULT_CHUNK_SIZE,
        retryDelays: [...UPLOAD_CONSTANTS.RETRY_DELAYS],
        removeFingerprintOnSuccess: true,
        withCredentials: false
      })
      .use(Compressor, {
        quality: compressionQuality,
        maxWidth: UPLOAD_CONSTANTS.MAX_IMAGE_WIDTH,
        maxHeight: UPLOAD_CONSTANTS.MAX_IMAGE_HEIGHT,
        convertSize: UPLOAD_CONSTANTS.COMPRESSION_CONVERT_SIZE,
        mimeType: UPLOAD_CONSTANTS.COMPRESSION_MIME_TYPE
      })
      .use(Webcam, {
        modes: ['picture'],
        mirror: false
      })
      .use(GoldenRetriever, {
        expires: 24 * 60 * 60 * 1000,
        serviceWorker: true
      });

    return uppyInstance;
  });

  // ✅ Cache geolocation once
  const geoLocationRef = useRef<{ latitude: number; longitude: number; accuracy: number } | null>(
    null
  );
  const geoLocationFetchedRef = useRef(false);

  // ✅ Fetch geolocation once on mount
  useEffect(() => {
    if (extractMetadata && 'geolocation' in navigator && !geoLocationFetchedRef.current) {
      geoLocationFetchedRef.current = true;
      navigator.geolocation.getCurrentPosition(
        position => {
          geoLocationRef.current = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          logger.info('Geolocation fetched', geoLocationRef.current);
        },
        error => {
          logger.warn('Geolocation unavailable', { code: error.code });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, [extractMetadata]);

  const handleFileAdded = useCallback(
    async (file: any) => {
      const files = uppy.getFiles();
      const index = files.length;

      if (autoNumbering) {
        file.meta = {
          ...file.meta,
          displayName: `Site Image ${index}`,
          number: index,
          timestamp: Date.now()
        };
      }

      try {
        const isValid = await verifyFileType(file.data, file.type);
        if (!isValid) {
          uppy.removeFile(file.id);
          uppy.info(`Invalid file type for ${file.name}`, 'error', 5000);
          return;
        }

        const safeName = sanitizeFilename(file.name, {
          addTimestamp: true,
          lowercase: false
        });
        file.name = safeName;
      } catch (error) {
        logger.error('File validation failed', { filename: file.name, type: file.type });
        uppy.removeFile(file.id);
        uppy.info('File validation failed', 'error', 5000);
        return;
      }

      // ✅ Use cached geolocation
      if (geoLocationRef.current) {
        file.meta = {
          ...file.meta,
          ...geoLocationRef.current
        };
      }
    },
    [uppy, autoNumbering]
  );

  const handleUploadSuccess = useCallback(
    (file: any, response: any) => {
      const uploadedFile: UploadedFile = {
        url: response.uploadURL || '',
        name: file.meta.displayName || file.name,
        number: file.meta.number || uploadedFiles.length + 1,
        timestamp: file.meta.timestamp || Date.now(),
        latitude: file.meta.latitude,
        longitude: file.meta.longitude,
        accuracy: file.meta.accuracy,
        size: file.size,
        type: file.type
      };

      setUploadedFiles(prev => {
        const updated = [...prev, uploadedFile];
        onChange?.(updated);
        return updated;
      });

      // Announce to screen readers
      setUploadStatus(`Successfully uploaded ${file.name}`);
      setTimeout(() => setUploadStatus(''), 3000);
    },
    [uploadedFiles.length, onChange]
  );

  const handleComplete = useCallback(
    (result: any) => {
      logger.info('Upload complete', {
        successCount: result.successful?.length || 0,
        failedCount: result.failed?.length || 0
      });

      if (result.successful && result.successful.length > 0) {
        uppy.info(`Successfully uploaded ${result.successful.length} file(s)`, 'success', 3000);
      }

      if (result.failed && result.failed.length > 0) {
        uppy.info(`Failed to upload ${result.failed.length} file(s)`, 'error', 5000);
      }
    },
    [uppy]
  );

  useEffect(() => {
    uppy.on('file-added', handleFileAdded);
    uppy.on('upload-success', handleUploadSuccess);
    uppy.on('complete', handleComplete);

    return () => {
      uppy.off('file-added', handleFileAdded);
      uppy.off('upload-success', handleUploadSuccess);
      uppy.off('complete', handleComplete);
      // CRITICAL FIX: Cleanup Uppy instance to prevent memory leaks
      if ('close' in uppy && typeof uppy.close === 'function') {
        uppy.close();
      }
    };
  }, [uppy, handleFileAdded, handleUploadSuccess, handleComplete]);

  useEffect(() => {
    setUploadedFiles(value);
  }, [value]);

  return (
    <div
      className="multi-image-upload space-y-4"
      role="region"
      aria-label="Image and video file upload"
    >
      {/* Live region for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {uploadStatus}
      </div>

      <Dashboard
        uppy={uppy}
        plugins={['Webcam']}
        proudlyDisplayPoweredByUppy={false}
        hideProgressDetails={false}
        note={`Upload up to ${maxFiles} images/videos (max 10MB each)`}
        height={450}
        theme="dark"
      />

      {uploadedFiles.length > 0 && (
        <div className="mt-6" role="list" aria-label="Uploaded files">
          <h3 className="text-lg font-semibold text-gray-200 mb-4" id="uploaded-files-heading">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            aria-labelledby="uploaded-files-heading"
          >
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                role="listitem"
                tabIndex={0}
                aria-label={`${file.name}, ${(file.size / 1024).toFixed(1)} kilobytes`}
                className="bg-gray-800 rounded-lg p-3 space-y-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                <div className="text-sm font-medium text-white truncate">{file.name}</div>
                <div className="text-xs text-gray-300">
                  #{file.number} • {(file.size / 1024).toFixed(1)} KB
                </div>
                {file.latitude && file.longitude && (
                  <div className="text-xs text-gray-300">
                    📍 {file.latitude.toFixed(6)}, {file.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
