'use strict';

const express = require('express');
const debug = {
  routes: require('debug')('formio:upload:routes'),
  error: require('debug')('formio:error')
};

/**
 * Create TUS upload routes
 *
 * Sets up Express routes for TUS resumable upload protocol.
 * All routes follow TUS specification: https://tus.io/protocols/resumable-upload
 *
 * Routes:
 * - OPTIONS /files - Get server capabilities
 * - POST /files - Create new upload
 * - HEAD /files/:id - Get upload progress
 * - PATCH /files/:id - Upload file chunk
 * - DELETE /files/:id - Cancel upload
 *
 * @param {Object} tusServer - TUS server instance
 * @param {Object} router - Form.io router instance
 * @param {Object} middleware - Middleware functions
 * @returns {express.Router} Express router with upload routes
 */
function createUploadRoutes(tusServer, router, middleware) {
  const uploadRouter = express.Router();

  // Apply middleware to all routes
  uploadRouter.use(middleware.uploadAuthMiddleware(router));
  uploadRouter.use(middleware.rateLimitMiddleware());

  /**
   * OPTIONS /files
   *
   * Returns TUS server capabilities and configuration.
   * Required by TUS protocol for client discovery.
   */
  uploadRouter.options('/files', (req, res) => {
    try {
      res.set({
        'Tus-Resumable': '1.0.0',
        'Tus-Version': '1.0.0',
        'Tus-Extension': 'creation,expiration,termination',
        'Tus-Max-Size': '5368709120', // 5GB
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,HEAD,PATCH,OPTIONS,DELETE',
        'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Upload-Length,Upload-Offset,Tus-Resumable,Upload-Metadata,Authorization',
        'Access-Control-Expose-Headers': 'Upload-Offset,Location,Upload-Length,Tus-Version,Tus-Resumable,Tus-Max-Size,Tus-Extension,Upload-Expires'
      });

      debug.routes('OPTIONS /files - Server capabilities sent');
      res.status(204).end();
    }
 catch (err) {
      debug.error('OPTIONS error', err);
      res.status(500).json({error: err.message});
    }
  });

  /**
   * OPTIONS /files/:id
   *
   * Returns capabilities for specific upload.
   */
  uploadRouter.options('/files/:id', (req, res) => {
    try {
      res.set({
        'Tus-Resumable': '1.0.0',
        'Tus-Version': '1.0.0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD,PATCH,DELETE',
        'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Upload-Offset,Tus-Resumable,Authorization',
        'Access-Control-Expose-Headers': 'Upload-Offset,Upload-Length,Tus-Resumable,Upload-Expires'
      });

      debug.routes('OPTIONS /files/:id - Upload capabilities sent');
      res.status(204).end();
    }
 catch (err) {
      debug.error('OPTIONS :id error', err);
      res.status(500).json({error: err.message});
    }
  });

  /**
   * POST /files
   *
   * Create new upload session.
   * Client sends Upload-Length and Upload-Metadata headers.
   * Server responds with Location header containing upload URL.
   */
  uploadRouter.post('/files',
    middleware.uploadValidationMiddleware(),
    middleware.formPermissionMiddleware(router),
    async (req, res, next) => {
      try {
        debug.routes('POST /files - Creating new upload');

        // Forward to TUS server
        tusServer.getServer().handle(req, res);
      }
 catch (err) {
        debug.error('POST /files error', err);
        next(err);
      }
    }
  );

  /**
   * HEAD /files/:id
   *
   * Get upload progress.
   * Returns Upload-Offset header with current byte position.
   */
  uploadRouter.head('/files/:id', async (req, res, next) => {
    try {
      const uploadId = req.params.id;
      debug.routes('HEAD /files/:id - Getting upload progress', {uploadId});

      // Get progress from TUS server
      const progress = tusServer.getUploadProgress(uploadId);

      if (!progress) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Upload not found: ${uploadId}`
        });
      }

      res.set({
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': progress.offset.toString(),
        'Upload-Length': progress.size.toString(),
        'Upload-Expires': progress.expiresAt,
        'Cache-Control': 'no-store'
      });

      res.status(200).end();
    }
 catch (err) {
      debug.error('HEAD /files/:id error', err);
      next(err);
    }
  });

  /**
   * PATCH /files/:id
   *
   * Upload file chunk.
   * Client sends chunk data with Upload-Offset header.
   * Server validates offset and appends chunk to file.
   */
  uploadRouter.patch('/files/:id', async (req, res, next) => {
    try {
      const uploadId = req.params.id;
      debug.routes('PATCH /files/:id - Uploading chunk', {uploadId});

      // Forward to TUS server for chunk processing
      tusServer.getServer().handle(req, res);
    }
 catch (err) {
      debug.error('PATCH /files/:id error', err);
      next(err);
    }
  });

  /**
   * DELETE /files/:id
   *
   * Cancel/terminate upload.
   * Removes upload data and temporary files.
   */
  uploadRouter.delete('/files/:id', async (req, res, next) => {
    try {
      const uploadId = req.params.id;
      debug.routes('DELETE /files/:id - Terminating upload', {uploadId});

      // Forward to TUS server for termination
      tusServer.getServer().handle(req, res);
    }
 catch (err) {
      debug.error('DELETE /files/:id error', err);
      next(err);
    }
  });

  /**
   * GET /files/:id/status
   *
   * Extended endpoint: Get detailed upload status (not part of TUS spec).
   * Useful for monitoring and debugging.
   */
  uploadRouter.get('/files/:id/status', async (req, res, next) => {
    try {
      const uploadId = req.params.id;
      debug.routes('GET /files/:id/status - Getting status', {uploadId});

      const progress = tusServer.getUploadProgress(uploadId);

      if (!progress) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Upload not found: ${uploadId}`
        });
      }

      res.json({
        uploadId: progress.uploadId,
        status: progress.status,
        size: progress.size,
        offset: progress.offset,
        progress: progress.progress,
        createdAt: progress.createdAt,
        expiresAt: progress.expiresAt
      });
    }
 catch (err) {
      debug.error('GET /files/:id/status error', err);
      next(err);
    }
  });

  /**
   * POST /files/cleanup
   *
   * Administrative endpoint: Clean up expired uploads.
   * Should be protected by admin-only permissions in production.
   */
  uploadRouter.post('/files/cleanup', async (req, res, next) => {
    try {
      debug.routes('POST /files/cleanup - Cleaning expired uploads');

      // Check if user has admin permissions
      // Note: Implement proper admin check based on your permission system
      if (!req.user?.roles?.includes('administrator')) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin permissions required'
        });
      }

      const cleaned = await tusServer.cleanupExpiredUploads();

      res.json({
        message: 'Cleanup completed',
        cleaned
      });
    }
 catch (err) {
      debug.error('POST /files/cleanup error', err);
      next(err);
    }
  });

  /**
   * GET /files/health
   *
   * Health check endpoint for upload service.
   */
  uploadRouter.get('/files/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'tus-upload-server',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Apply error handler middleware
  uploadRouter.use(middleware.errorHandlerMiddleware());

  return uploadRouter;
}

/**
 * Initialize upload routes with Form.io router
 *
 * Main entry point for integrating TUS upload routes into Form.io server.
 *
 * @param {Object} router - Form.io router instance
 * @param {Object} config - Upload configuration
 * @param {Object} config.gcs - GCS configuration
 * @param {string} config.gcs.projectId - GCS project ID
 * @param {string} config.gcs.bucketName - GCS bucket name
 * @param {string} [config.gcs.keyFilename] - Path to service account key
 * @param {Object} [config.tus] - TUS server configuration
 * @returns {express.Router} Configured upload router
 */
function initializeUploadRoutes(router, config) {
  try {
    // Validate configuration
    if (!config.gcs) {
      throw new Error('GCS configuration is required');
    }

    // Import required modules
    const GCSStorageProvider = require('./GCSStorageProvider');
    const TusServer = require('./TusServer');
    const middleware = require('./middleware');

    // Initialize GCS provider
    const gcsProvider = new GCSStorageProvider(config.gcs);
    debug.routes('GCS provider initialized');

    // Token validation function
    const validateToken = async (token, req) => {
      try {
        const decoded = router.formio.auth.verifyToken(token);
        req.user = decoded.user || decoded;
        return true;
      }
 catch (err) {
        debug.error('Token validation failed', err);
        return false;
      }
    };

    // Initialize TUS server
    const tusConfig = {
      ...config.tus,
      validateToken
    };
    const tusServer = new TusServer(gcsProvider, tusConfig);
    debug.routes('TUS server initialized');

    // Create and return routes
    const uploadRoutes = createUploadRoutes(tusServer, router, middleware);
    debug.routes('Upload routes created');

    // Schedule periodic cleanup
    setInterval(() => {
      tusServer.cleanupExpiredUploads().catch(err => {
        debug.error('Scheduled cleanup failed', err);
      });
    }, 3600000); // Run every hour

    return uploadRoutes;
  }
 catch (err) {
    debug.error('Failed to initialize upload routes', err);
    throw err;
  }
}

module.exports = {
  createUploadRoutes,
  initializeUploadRoutes
};
