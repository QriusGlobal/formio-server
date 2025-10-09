/**
 * GCS Upload Integration
 *
 * Simple integration of TUS protocol with Google Cloud Storage.
 * No queues, no workers, no complexity - just direct uploads.
 */

'use strict';

const {onUploadFinish} = require('./hooks/tusCompletionHook');
const {initializeTelemetry} = require('./telemetry/otel.config');

/**
 * Initialize GCS upload system
 *
 * @param {Object} uploadSystem - Existing upload system from upload/index.js
 * @param {Object} uploadSystem.gcsProvider - GCS storage provider
 * @param {Object} uploadSystem.tusServer - TUS server instance
 * @param {Object} config - Configuration
 * @param {boolean} [config.telemetry.enabled=true] - Enable OpenTelemetry
 * @returns {Object} Integrated system components
 */
function initializeGCSUpload(uploadSystem, config = {}) {
  console.log('[GCS] Initializing upload system...');

  // Initialize OpenTelemetry (if enabled)
  const telemetrySDK = initializeTelemetry({
    serviceName: 'formio-gcs-upload',
    serviceVersion: '1.0.0',
    enabled: config.telemetry?.enabled !== false,
    ...config.telemetry
  });

  // Wire TUS completion hook
  const originalOnUploadFinish = uploadSystem.tusServer.config.onUploadFinish;
  uploadSystem.tusServer.config.onUploadFinish = async (req, res, upload, fileUrl) => {
    // Call custom hook first
    if (originalOnUploadFinish) {
      await originalOnUploadFinish(req, res, upload, fileUrl);
    }
    // Then call integrated hook
    return await onUploadFinish(req, res, upload, fileUrl);
  };

  console.log('[GCS] TUS completion hook wired');

  // Graceful shutdown handler
  const shutdown = async () => {
    console.log('[GCS] Shutting down gracefully...');

    try {
      if (telemetrySDK) {
        await telemetrySDK.shutdown();
      }

      console.log('[GCS] Shutdown complete');
    }
 catch (err) {
      console.error('[GCS] Shutdown error:', err);
      throw err;
    }
  };

  // Register shutdown handlers
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  console.log('[GCS] Upload system initialized');

  return {
    telemetrySDK,
    shutdown
  };
}

module.exports = {
  initializeGCSUpload
};
