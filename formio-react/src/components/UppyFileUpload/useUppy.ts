/**
 * useUppy Hook
 *
 * Custom React hook for managing Uppy instance lifecycle, plugin configuration,
 * and event subscription. Handles cleanup on component unmount.
 *
 * Features:
 * - Uppy instance creation and configuration
 * - Plugin lifecycle management
 * - Event subscription and cleanup
 * - State management for upload queue
 * - Form.io event emission compatibility
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Uppy from '@uppy/core';
import type { UppyFile, Meta, Body } from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import Webcam from '@uppy/webcam';
import ImageEditor from '@uppy/image-editor';
import GoogleDrive from '@uppy/google-drive';
import ScreenCapture from '@uppy/screen-capture';
import Audio from '@uppy/audio';
import Url from '@uppy/url';
import GoldenRetriever from '@uppy/golden-retriever';

import type {
  UppyFileUploadProps,
  UppyState,
  UseUppyReturn,
  UploadProgress,
  UploadFileResult,
  UploadError,
  FormioUploadEvent,
} from './UppyFileUpload.types';

/**
 * Custom hook for Uppy instance management
 *
 * @param props - Component props containing configuration
 * @returns Uppy instance and control methods
 */
export const useUppy = (props: UppyFileUploadProps): UseUppyReturn => {
  const {
    tusConfig,
    dashboardConfig,
    restrictions,
    plugins = [],
    pluginConfigs = {},
    metadata = {},
    autoProceed = false,
    allowMultipleUploads = true,
    locale = 'en_US',
    localeStrings,
    debug = false,
    disabled = false,
    id: instanceId,
    onFileAdded,
    onFileRemoved,
    onUploadStart,
    onProgress,
    onUploadSuccess,
    onUploadError,
    onComplete,
    onCancel,
    onPause,
    onResume,
    onFormioEvent,
  } = props;

  // Uppy instance ref (persists across renders)
  const uppyRef = useRef<Uppy | null>(null);

  // State for upload tracking
  const [state, setState] = useState<UppyState>({
    files: [],
    currentUploads: {},
    totalFileCount: 0,
    totalProgress: 0,
    uploadSpeed: 0,
    isUploading: false,
    error: null,
  });

  /**
   * Emit Form.io compatible event
   */
  const emitFormioEvent = useCallback((
    type: FormioUploadEvent['type'],
    file: UppyFile<Meta, Body>,
    additionalData?: Partial<FormioUploadEvent>
  ) => {
    if (!onFormioEvent) return;

    const event: FormioUploadEvent = {
      type,
      file: {
        id: file.id || 'unknown',
        name: file.name || 'unknown',
        size: file.size ?? 0, // Handle null file size
        type: file.type || 'application/octet-stream',
      },
      timestamp: Date.now(),
      ...additionalData,
    };

    onFormioEvent(event);
  }, [onFormioEvent]);

  /**
   * Initialize Uppy instance
   */
  useEffect(() => {
    // Create Uppy instance
    const uppy = new Uppy({
      id: instanceId || 'UppyFileUpload',
      debug,
      autoProceed,
      allowMultipleUploads,
      restrictions: {
        maxFileSize: restrictions?.maxFileSize || 50 * 1024 * 1024, // 50MB default
        minFileSize: restrictions?.minFileSize || null,
        maxNumberOfFiles: restrictions?.maxNumberOfFiles || 10,
        minNumberOfFiles: restrictions?.minNumberOfFiles || null,
        allowedFileTypes: restrictions?.allowedFileTypes || null,
        requiredMetaFields: restrictions?.requiredMetaFields || [],
      },
      meta: metadata,
      locale: localeStrings ? { strings: localeStrings } as any : undefined, // Uppy 5.x locale type compatibility
    });

    uppyRef.current = uppy;

    // Configure Dashboard
    uppy.use(Dashboard, {
      inline: dashboardConfig?.mode !== 'modal',
      target: dashboardConfig?.mode === 'modal' ? 'body' : undefined,
      height: dashboardConfig?.height || 400,
      width: dashboardConfig?.width,
      hideProgressDetails: dashboardConfig?.showProgressDetails === false, // Uppy 5.x changed to hideProgressDetails
      showSelectedFiles: dashboardConfig?.showSelectedFiles !== false,
      hideCancelButton: dashboardConfig?.hideCancelButton || false,
      hideRetryButton: dashboardConfig?.hideRetryButton || false,
      hideProgressAfterFinish: dashboardConfig?.hideProgressAfterFinish || false,
      note: dashboardConfig?.note,
      proudlyDisplayPoweredByUppy: dashboardConfig?.proudlyDisplayPoweredByUppy || false,
      hideUploadButton: dashboardConfig?.hideUploadButton || false,
      disableInformer: dashboardConfig?.disableInformer || false,
      theme: dashboardConfig?.theme || 'light',
      animateOpenClose: dashboardConfig?.animateOpenClose !== false,
      closeModalOnClickOutside: dashboardConfig?.closeModalOnClickOutside !== false,
      disableLocalFiles: dashboardConfig?.disableLocalFiles || false,
    });

    // Configure TUS resumable upload
    uppy.use(Tus, {
      endpoint: tusConfig.endpoint,
      chunkSize: tusConfig.chunkSize || 5 * 1024 * 1024, // 5MB default
      retryDelays: tusConfig.retryDelays || [0, 1000, 3000, 5000],
      removeFingerprintOnSuccess: tusConfig.removeFingerprintOnSuccess !== false,
      headers: tusConfig.headers,
      limit: tusConfig.parallelUploads || 3,
      // timeout removed in Uppy 5.x TUS plugin
    });

    // Golden Retriever for auto-resume on page refresh
    uppy.use(GoldenRetriever, {
      serviceWorker: false, // Use IndexedDB instead of ServiceWorker
    });

    // Load optional plugins
    if (plugins.includes('Webcam')) {
      uppy.use(Webcam, {
        target: Dashboard as any, // Type compatibility with Uppy 5.x
        countdown: pluginConfigs.Webcam?.countdown !== false ? 3 : false,
        modes: pluginConfigs.Webcam?.modes || ['picture', 'video-audio'],
        videoConstraints: pluginConfigs.Webcam?.videoConstraints,
        showVideoSourceDropdown: pluginConfigs.Webcam?.showVideoSourceDropdown !== false,
        preferredVideoMimeType: pluginConfigs.Webcam?.preferredVideoMimeType,
        preferredImageMimeType: pluginConfigs.Webcam?.preferredImageMimeType,
      });
    }

    if (plugins.includes('ImageEditor')) {
      uppy.use(ImageEditor, {
        target: Dashboard as any, // Type compatibility with Uppy 5.x
        quality: pluginConfigs.ImageEditor?.quality || 0.8,
        cropperOptions: pluginConfigs.ImageEditor?.cropperOptions as any, // Uppy 5.x type compatibility
        actions: pluginConfigs.ImageEditor?.actions as any,
      });
    }

    if (plugins.includes('GoogleDrive') && pluginConfigs.GoogleDrive) {
      uppy.use(GoogleDrive, {
        target: Dashboard as any, // Type compatibility with Uppy 5.x
        companionUrl: pluginConfigs.GoogleDrive.companionUrl,
        companionAllowedHosts: pluginConfigs.GoogleDrive.companionAllowedHosts,
        companionHeaders: pluginConfigs.GoogleDrive.companionHeaders,
      });
    }

    if (plugins.includes('ScreenCapture')) {
      uppy.use(ScreenCapture, {
        target: Dashboard as any, // Type compatibility with Uppy 5.x
        displayMediaConstraints: pluginConfigs.ScreenCapture?.displayMediaConstraints,
        preferredVideoMimeType: pluginConfigs.ScreenCapture?.preferredVideoMimeType,
      });
    }

    if (plugins.includes('Audio')) {
      uppy.use(Audio, {
        target: Dashboard as any, // Type compatibility with Uppy 5.x
        // Uppy 5.x Audio plugin may have different configuration options
      } as any);
    }

    if (plugins.includes('Url') && pluginConfigs.Url) {
      uppy.use(Url, {
        target: Dashboard as any, // Type compatibility with Uppy 5.x
        companionUrl: pluginConfigs.Url.companionUrl,
        companionAllowedHosts: pluginConfigs.Url.companionAllowedHosts,
      });
    }

    // Cleanup on unmount
    return () => {
      // Uppy 5.x doesn't have close() method, it auto-cleans on unmount
      // If we need explicit cleanup, we can clear all files and cancel uploads
      if (uppy) {
        uppy.cancelAll();
      }
    };
  }, [
    instanceId,
    tusConfig,
    dashboardConfig,
    restrictions,
    plugins,
    pluginConfigs,
    metadata,
    autoProceed,
    allowMultipleUploads,
    locale,
    localeStrings,
    debug,
  ]);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const uppy = uppyRef.current;
    if (!uppy) return;

    // File added
    const handleFileAdded = (file: UppyFile<Meta, Body>) => {
      onFileAdded?.(file);
      emitFormioEvent('uppyfile.upload.start', file);

      setState(prev => ({
        ...prev,
        files: [...prev.files, file],
        totalFileCount: prev.totalFileCount + 1,
      }));
    };

    // File removed
    const handleFileRemoved = (file: UppyFile<Meta, Body>) => {
      onFileRemoved?.(file);
      emitFormioEvent('uppyfile.upload.cancel', file);

      setState(prev => ({
        ...prev,
        files: prev.files.filter(f => f.id !== file.id),
        totalFileCount: Math.max(0, prev.totalFileCount - 1),
      }));
    };

    // Upload started - Uppy 5.x signature: (uploadID: string, files: UppyFile[]) => void
    const handleUpload = (uploadID: string, files: UppyFile<Meta, Body>[]) => {
      const data = { id: uploadID, fileIDs: files.map(f => f.id) };
      onUploadStart?.(data);
      setState(prev => ({ ...prev, isUploading: true }));
    };

    // Upload progress - Uppy 5.x signature has FileProgressStarted type
    const handleUploadProgress = (file: UppyFile<Meta, Body> | undefined, progress: { bytesUploaded: number; bytesTotal: number | null }) => {
      if (!file) return;

      const percentage = progress.bytesTotal ? Math.round((progress.bytesUploaded / progress.bytesTotal) * 100) : 0;

      const progressData: UploadProgress = {
        fileId: file.id || 'unknown',
        fileName: file.name || 'unknown',
        bytesUploaded: progress.bytesUploaded,
        bytesTotal: progress.bytesTotal ?? 0,
        percentage,
        status: 'uploading',
      };

      onProgress?.(progressData);
      emitFormioEvent('uppyfile.upload.progress', file, { progress: progressData });

      setState(prev => ({
        ...prev,
        currentUploads: {
          ...prev.currentUploads,
          [file.id]: progressData,
        },
      }));
    };

    // Upload success
    const handleUploadSuccess = (file: UppyFile<Meta, Body> | undefined, response: any) => {
      if (!file) return;

      const result: UploadFileResult = {
        id: file.id || 'unknown',
        name: file.name || 'unknown',
        size: file.size ?? 0,
        type: file.type || 'application/octet-stream',
        uploadURL: response.uploadURL || response.url,
        response: response.body,
        meta: file.meta,
      };

      onUploadSuccess?.(result);
      emitFormioEvent('uppyfile.upload.complete', file, { result });

      setState(prev => {
        const { [file.id]: removed, ...remainingUploads } = prev.currentUploads;
        return {
          ...prev,
          currentUploads: remainingUploads,
        };
      });
    };

    // Upload error
    const handleUploadError = (file: UppyFile<Meta, Body> | undefined, error: Error, response?: any) => {
      if (!file) return;

      const errorData: UploadError = {
        file,
        error,
        response,
      };

      onUploadError?.(errorData);
      emitFormioEvent('uppyfile.upload.error', file, { error: errorData });

      setState(prev => ({
        ...prev,
        error,
      }));
    };

    // Complete (all uploads finished)
    const handleComplete = (result: any) => {
      const successful: UploadFileResult[] = result.successful.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadURL: file.uploadURL || file.response?.uploadURL,
        response: file.response?.body,
        meta: file.meta,
      }));

      const failed: UploadError[] = result.failed.map((file: any) => ({
        file,
        error: file.error || new Error('Upload failed'),
        response: file.response,
      }));

      onComplete?.({ successful, failed });

      setState(prev => ({
        ...prev,
        isUploading: false,
        currentUploads: {},
      }));
    };

    // Attach event listeners
    uppy.on('file-added', handleFileAdded);
    uppy.on('file-removed', handleFileRemoved);
    uppy.on('upload', handleUpload);
    uppy.on('upload-progress', handleUploadProgress);
    uppy.on('upload-success', handleUploadSuccess);
    uppy.on('upload-error', handleUploadError);
    uppy.on('complete', handleComplete);

    // Cleanup listeners
    return () => {
      uppy.off('file-added', handleFileAdded);
      uppy.off('file-removed', handleFileRemoved);
      uppy.off('upload', handleUpload);
      uppy.off('upload-progress', handleUploadProgress);
      uppy.off('upload-success', handleUploadSuccess);
      uppy.off('upload-error', handleUploadError);
      uppy.off('complete', handleComplete);
    };
  }, [
    onFileAdded,
    onFileRemoved,
    onUploadStart,
    onProgress,
    onUploadSuccess,
    onUploadError,
    onComplete,
    onCancel,
    onPause,
    onResume,
    emitFormioEvent,
  ]);

  /**
   * Control methods
   */
  const upload = useCallback(() => {
    uppyRef.current?.upload();
  }, []);

  const cancelAll = useCallback(() => {
    uppyRef.current?.cancelAll();
  }, []);

  const pauseAll = useCallback(() => {
    uppyRef.current?.pauseAll();
  }, []);

  const resumeAll = useCallback(() => {
    uppyRef.current?.resumeAll();
  }, []);

  const reset = useCallback(() => {
    uppyRef.current?.cancelAll();
    setState({
      files: [],
      currentUploads: {},
      totalFileCount: 0,
      totalProgress: 0,
      uploadSpeed: 0,
      isUploading: false,
      error: null,
    });
  }, []);

  const addFiles = useCallback((files: File[]) => {
    files.forEach(file => {
      uppyRef.current?.addFile({
        name: file.name,
        type: file.type,
        data: file,
      });
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    uppyRef.current?.removeFile(fileId);
  }, []);

  const getFile = useCallback((fileId: string) => {
    return uppyRef.current?.getFile(fileId);
  }, []);

  const setFileMeta = useCallback((fileId: string, data: Record<string, unknown>) => {
    uppyRef.current?.setFileMeta(fileId, data);
  }, []);

  return {
    uppy: uppyRef.current,
    state,
    upload,
    cancelAll,
    pauseAll,
    resumeAll,
    reset,
    addFiles,
    removeFile,
    getFile,
    setFileMeta,
  };
};

export default useUppy;