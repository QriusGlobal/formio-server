/**
 * UppyFileUpload Component
 *
 * A production-ready React component for file uploads using Uppy.js with TUS protocol.
 * Provides comprehensive upload functionality with resumable uploads, progress tracking,
 * and multiple input sources (webcam, screen capture, Google Drive, etc.).
 *
 * Features:
 * - TUS resumable uploads (pause/resume/auto-resume)
 * - Uppy Dashboard UI (inline or modal)
 * - Multiple file sources (local, webcam, screen, Google Drive, URL)
 * - Image editing capabilities
 * - Real-time progress tracking
 * - Form.io event compatibility
 * - WCAG 2.1 AA accessibility
 * - Internationalization support
 * - Golden Retriever auto-resume on page refresh
 *
 * @example
 * ```tsx
 * <UppyFileUpload
 *   tusConfig={{
 *     endpoint: 'https://tusd.tusdemo.net/files/',
 *     chunkSize: 5 * 1024 * 1024,
 *   }}
 *   dashboardConfig={{
 *     mode: 'inline',
 *     height: 450,
 *     showProgressDetails: true,
 *   }}
 *   plugins={['Webcam', 'ImageEditor']}
 *   onUploadSuccess={(file) => console.log('Uploaded:', file)}
 *   onUploadError={(error) => console.error('Error:', error)}
 * />
 * ```
 */

import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Dashboard } from '@uppy/react';
import type { UppyFileUploadProps, UppyFileUploadHandle } from './UppyFileUpload.types';
import { useUppy } from './useUppy';

// NOTE: Uppy CSS imports removed - consuming apps must import Uppy styles
// See documentation for required CSS imports
import './UppyFileUpload.css';

/**
 * UppyFileUpload Component
 *
 * Main component that wraps Uppy Dashboard and provides file upload functionality.
 * Uses the useUppy hook for Uppy instance management and event handling.
 *
 * @param props - Component configuration props
 * @param ref - Forward ref for imperative handle
 */
export const UppyFileUpload = forwardRef<UppyFileUploadHandle, UppyFileUploadProps>(
  (props, ref) => {
    const {
      className = '',
      style,
      disabled = false,
      dashboardConfig,
    } = props;

    // Use custom hook for Uppy management
    const { uppy, state, upload, cancelAll, reset } = useUppy(props);

    // Dashboard ref for modal control
    const dashboardRef = useRef<any>(null);

    /**
     * Expose methods via ref for parent component control
     */
    useImperativeHandle(ref, () => ({
      uppy,
      openModal: () => {
        if (dashboardConfig?.mode === 'modal' && uppy) {
          const dashboard = uppy.getPlugin('Dashboard') as any;
          dashboard?.openModal();
        }
      },
      closeModal: () => {
        if (dashboardConfig?.mode === 'modal' && uppy) {
          const dashboard = uppy.getPlugin('Dashboard') as any;
          dashboard?.closeModal();
        }
      },
      upload,
      cancelAll,
      reset,
    }), [uppy, upload, cancelAll, reset, dashboardConfig?.mode]);

    /**
     * Handle disabled state
     */
    useEffect(() => {
      if (uppy) {
        if (disabled) {
          uppy.getPlugin('Dashboard')?.setOptions({ disabled: true });
        } else {
          uppy.getPlugin('Dashboard')?.setOptions({ disabled: false });
        }
      }
    }, [uppy, disabled]);

    /**
     * Render nothing if Uppy instance is not ready
     */
    if (!uppy) {
      return (
        <div className={`uppy-file-upload uppy-loading ${className}`} style={style}>
          <div className="uppy-loading-spinner">
            <div className="uppy-spinner"></div>
            <p>Loading file uploader...</p>
          </div>
        </div>
      );
    }

    /**
     * Render Dashboard component
     */
    return (
      <div
        className={`uppy-file-upload ${disabled ? 'uppy-disabled' : ''} ${className}`}
        style={style}
        data-testid="uppy-file-upload"
      >
        <Dashboard
          uppy={uppy}
          ref={dashboardRef}
          plugins={[]}
        />

        {/* Upload state information (for accessibility and debugging) */}
        <div className="uppy-state-info" aria-live="polite" aria-atomic="true">
          {state.isUploading && (
            <span className="visually-hidden">
              Uploading {Object.keys(state.currentUploads).length} files...
            </span>
          )}
          {state.error && (
            <span className="visually-hidden" role="alert">
              Upload error: {state.error.message}
            </span>
          )}
        </div>

        {/* Upload statistics (optional, can be styled or hidden) */}
        {state.isUploading && (
          <div className="uppy-upload-stats" aria-live="polite">
            <div className="uppy-stats-item">
              <span className="uppy-stats-label">Files:</span>
              <span className="uppy-stats-value">
                {Object.keys(state.currentUploads).length} / {state.totalFileCount}
              </span>
            </div>
            {state.uploadSpeed > 0 && (
              <div className="uppy-stats-item">
                <span className="uppy-stats-label">Speed:</span>
                <span className="uppy-stats-value">
                  {formatBytes(state.uploadSpeed)}/s
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

UppyFileUpload.displayName = 'UppyFileUpload';

/**
 * Helper function to format bytes to human-readable format
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Default export
 */
export default UppyFileUpload;