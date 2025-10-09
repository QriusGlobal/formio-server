'use strict';

/**
 * TUS Resumable Upload Server Integration for Form.io
 *
 * This module provides resumable file upload capabilities using the TUS protocol
 * (https://tus.io) with Google Cloud Storage backend.
 *
 * Features:
 * - Resumable uploads with automatic retry
 * - Support for files up to 5GB
 * - 24-hour upload expiration
 * - Chunk validation and integrity checks
 * - Progress tracking
 * - JWT authentication integration
 * - Rate limiting
 * - Automatic cleanup of expired uploads
 *
 * @module upload
 */

const GCSStorageProvider = require('./GCSStorageProvider');
const TusServer = require('./TusServer');
const middleware = require('./middleware');
const routes = require('./routes');

/**
 * Initialize upload subsystem
 *
 * @param {Object} router - Form.io router instance
 * @param {Object} config - Upload configuration
 * @param {Object} config.gcs - GCS configuration
 * @param {string} config.gcs.projectId - GCS project ID
 * @param {string} config.gcs.bucketName - GCS bucket name
 * @param {string} [config.gcs.keyFilename] - Path to service account key file
 * @param {Object} [config.gcs.credentials] - Service account credentials object
 * @param {Object} [config.tus] - TUS server configuration
 * @param {string} [config.tus.path='/files'] - Upload endpoint path
 * @param {number} [config.tus.maxFileSize=5368709120] - Max file size (5GB)
 * @param {number} [config.tus.expirationPeriod=86400000] - Upload expiration (24h)
 * @param {Object} [config.validation] - Validation configuration
 * @param {Array<string>} [config.validation.allowedTypes] - Allowed MIME types
 * @param {Array<string>} [config.validation.blockedExtensions] - Blocked extensions
 * @param {Object} [config.rateLimit] - Rate limiting configuration
 * @param {number} [config.rateLimit.windowMs=900000] - Rate limit window (15 min)
 * @param {number} [config.rateLimit.maxRequests=100] - Max requests per window
 * @returns {Object} Upload subsystem with routes and utilities
 *
 * @example
 * const upload = require('./src/upload');
 *
 * // Initialize in your server
 * const uploadSystem = upload.initialize(router, {
 *   gcs: {
 *     projectId: 'my-project',
 *     bucketName: 'my-uploads',
 *     keyFilename: './service-account.json'
 *   },
 *   tus: {
 *     maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
 *     expirationPeriod: 86400000 // 24 hours
 *   }
 * });
 *
 * // Mount routes
 * app.use('/api', uploadSystem.routes);
 */
function initialize(router, config) {
  if (!router) {
    throw new Error('Form.io router is required');
  }
  if (!config || !config.gcs) {
    throw new Error('GCS configuration is required');
  }

  // Initialize GCS provider
  const gcsProvider = new GCSStorageProvider(config.gcs);

  // Create token validation function
  const validateToken = async (token, req) => {
    try {
      const decoded = router.formio.auth.verifyToken(token);
      req.user = decoded.user || decoded;
      return true;
    }
 catch (err) {
      return false;
    }
  };

  // Initialize TUS server
  const tusServer = new TusServer(gcsProvider, {
    ...config.tus,
    validateToken
  });

  // Create upload routes
  const uploadRoutes = routes.createUploadRoutes(
    tusServer,
    router,
    middleware
  );

  // Schedule periodic cleanup of expired uploads
  const cleanupInterval = setInterval(() => {
    tusServer.cleanupExpiredUploads().catch(err => {
      console.error('Upload cleanup failed:', err);
    });
  }, 3600000); // Run every hour

  return {
    gcsProvider,
    tusServer,
    routes: uploadRoutes,
    middleware,
    cleanup: () => {
      clearInterval(cleanupInterval);
    }
  };
}

module.exports = {
  initialize,
  GCSStorageProvider,
  TusServer,
  middleware,
  routes
};
