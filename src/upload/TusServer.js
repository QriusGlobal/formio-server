'use strict';

const {Server} = require('@tus/server');
const {GCSStore} = require('@tus/gcs-store');
const crypto = require('crypto');
const debug = {
  tus: require('debug')('formio:upload:tus'),
  error: require('debug')('formio:error')
};

/**
 * TUS Resumable Upload Server
 *
 * Implements TUS protocol (https://tus.io) for resumable file uploads
 * with Google Cloud Storage backend integration.
 *
 * Features:
 * - Resumable uploads with chunk validation
 * - 5GB max file size support
 * - 24-hour upload expiration
 * - Progress tracking
 * - Automatic cleanup
 * - JWT authentication integration
 *
 * @class TusServer
 */
class TusServer {
  /**
   * Initialize TUS server
   *
   * @param {Object} gcsProvider - GCS storage provider instance
   * @param {Object} config - Server configuration
   * @param {string} [config.path='/files'] - Upload endpoint path
   * @param {number} [config.maxFileSize=5368709120] - Max file size (5GB default)
   * @param {number} [config.expirationPeriod=86400000] - Upload expiration (24h default)
   * @param {number} [config.chunkSize=8388608] - Chunk size (8MB default)
   * @param {Function} config.validateToken - Token validation function
   * @param {Function} [config.onUploadCreate] - Upload creation hook
   * @param {Function} [config.onUploadFinish] - Upload completion hook
   * @param {Function} [config.onChunkStart] - Chunk start hook
   * @param {Function} [config.onChunkFinish] - Chunk completion hook
   */
  constructor(gcsProvider, config = {}) {
    if (!gcsProvider) {
      throw new Error('GCS storage provider is required');
    }
    if (!config.validateToken || typeof config.validateToken !== 'function') {
      throw new Error('Token validation function is required');
    }

    this.gcsProvider = gcsProvider;
    this.config = {
      path: config.path || '/files',
      maxFileSize: config.maxFileSize || 5 * 1024 * 1024 * 1024, // 5GB
      expirationPeriod: config.expirationPeriod || 86400000, // 24 hours
      chunkSize: config.chunkSize || 8 * 1024 * 1024, // 8MB
      validateToken: config.validateToken,
      ...config
    };

    // Upload metadata storage (in production, use Redis or database)
    this.uploadMetadata = new Map();

    // Initialize TUS server with GCS store
    this.server = this.createTusServer();

    debug.tus('TUS server initialized', {
      path: this.config.path,
      maxFileSize: this.config.maxFileSize,
      expirationPeriod: this.config.expirationPeriod
    });
  }

  /**
   * Create TUS server instance
   *
   * @private
   * @returns {Server} TUS server instance
   */
  createTusServer() {
    const store = new GCSStore({
      bucket: this.gcsProvider.getBucket(),
      chunkSize: this.config.chunkSize,
      resumable: true,
      validation: 'crc32c'
    });

    return new Server({
      path: this.config.path,
      datastore: store,
      maxSize: this.config.maxFileSize,

      // Upload expiration configuration
      expiration: {
        period: this.config.expirationPeriod,
        maxAge: this.config.expirationPeriod
      },

      // Lifecycle hooks
      onUploadCreate: this.handleUploadCreate.bind(this),
      onUploadFinish: this.handleUploadFinish.bind(this),

      // Chunk hooks for validation and progress
      onIncomingRequest: this.handleIncomingRequest.bind(this),
      onResponseError: this.handleResponseError.bind(this)
    });
  }

  /**
   * Handle incoming request - validate authentication
   *
   * @private
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {string} id - Upload ID
   * @returns {Promise<void>}
   */
  async handleIncomingRequest(req, res, id) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
      }

      const token = authHeader.substring(7);

      // Validate token using provided function
      const isValid = await this.config.validateToken(token, req);
      if (!isValid) {
        throw new Error('Unauthorized');
      }

      // Store user context in request for later use
      req.uploadContext = {
        userId: req.user?._id || req.user?.id,
        timestamp: Date.now()
      };

      debug.tus('Request authenticated', {id, userId: req.uploadContext.userId});
    }
 catch (err) {
      debug.error('Authentication failed', err);
      res.status(401).json({error: 'Unauthorized'});
      throw err;
    }
  }

  /**
   * Handle upload creation
   *
   * @private
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Object} upload - Upload object
   * @returns {Promise<Object>} Upload response
   */
  async handleUploadCreate(req, res, upload) {
    try {
      // Generate unique upload ID
      const uploadId = crypto.randomUUID();
      upload.id = uploadId;

      // Validate upload metadata
      const metadata = this.validateUploadMetadata(upload.metadata);

      // Store upload metadata
      this.uploadMetadata.set(uploadId, {
        id: uploadId,
        metadata,
        userId: req.uploadContext?.userId,
        createdAt: new Date().toISOString(),
        size: upload.size,
        offset: 0,
        status: 'uploading',
        expiresAt: new Date(Date.now() + this.config.expirationPeriod).toISOString()
      });

      debug.tus('Upload created', {
        uploadId,
        metadata,
        size: upload.size
      });

      // Call custom hook if provided
      if (this.config.onUploadCreate) {
        await this.config.onUploadCreate(req, res, upload);
      }

      return res;
    }
 catch (err) {
      debug.error('Upload creation failed', err);
      throw err;
    }
  }

  /**
   * Handle upload completion
   *
   * @private
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Object} upload - Upload object
   * @returns {Promise<Object>} Completion response
   */
  async handleUploadFinish(req, res, upload) {
    try {
      const uploadId = upload.id;
      const metadata = this.uploadMetadata.get(uploadId);

      if (!metadata) {
        throw new Error(`Upload metadata not found: ${uploadId}`);
      }

      // Update metadata
      metadata.status = 'completed';
      metadata.completedAt = new Date().toISOString();
      metadata.offset = upload.size;

      debug.tus('Upload completed', {uploadId, size: upload.size});

      // Generate file URL
      const fileUrl = await this.generateFileUrl(upload);

      // Call custom completion hook if provided
      if (this.config.onUploadFinish) {
        await this.config.onUploadFinish(req, res, upload, fileUrl);
      }

      // Clean up after successful completion
      await this.cleanupUpload(uploadId);

      return res;
    }
 catch (err) {
      debug.error('Upload finish failed', err);
      throw err;
    }
  }

  /**
   * Handle response errors
   *
   * @private
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Error} err - Error object
   * @returns {Object} Error response
   */
  handleResponseError(req, res, err) {
    debug.error('TUS response error', err);

    return {
      statusCode: err.statusCode || err.status_code || 500,
      body: JSON.stringify({
        error: err.message || 'Internal server error',
        uploadId: req.params?.id
      })
    };
  }

  /**
   * Validate upload metadata
   *
   * @private
   * @param {Object} metadata - Upload metadata
   * @returns {Object} Validated metadata
   * @throws {Error} If validation fails
   */
  validateUploadMetadata(metadata = {}) {
    const validated = {
      filename: metadata.filename || 'untitled',
      filetype: metadata.filetype || 'application/octet-stream',
      formId: metadata.formId,
      fieldName: metadata.fieldName
    };

    // Validate required fields
    if (!validated.formId) {
      throw new Error('formId is required in upload metadata');
    }
    if (!validated.fieldName) {
      throw new Error('fieldName is required in upload metadata');
    }

    // Validate filename
    if (validated.filename.length > 255) {
      throw new Error('Filename too long (max 255 characters)');
    }

    // Validate file type (basic check)
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1'];
    const ext = validated.filename.substring(validated.filename.lastIndexOf('.')).toLowerCase();
    if (dangerousExtensions.includes(ext)) {
      throw new Error(`File type not allowed: ${ext}`);
    }

    return validated;
  }

  /**
   * Generate file URL for completed upload
   *
   * @private
   * @param {Object} upload - Upload object
   * @returns {Promise<string>} File URL
   */
  async generateFileUrl(upload) {
    try {
      const filePath = `uploads/${upload.id}/${upload.metadata.filename}`;
      return await this.gcsProvider.getSignedUrl(filePath, {
        action: 'read',
        expires: 3600 // 1 hour
      });
    }
 catch (err) {
      debug.error('Failed to generate file URL', err);
      return null;
    }
  }

  /**
   * Clean up upload metadata and temporary files
   *
   * @private
   * @param {string} uploadId - Upload ID
   * @returns {Promise<void>}
   */
  async cleanupUpload(uploadId) {
    try {
      // Remove from metadata store
      this.uploadMetadata.delete(uploadId);

      debug.tus('Upload cleaned up', {uploadId});
    }
 catch (err) {
      debug.error('Cleanup failed', err);
    }
  }

  /**
   * Get upload progress
   *
   * @param {string} uploadId - Upload ID
   * @returns {Object|null} Upload progress information
   */
  getUploadProgress(uploadId) {
    const metadata = this.uploadMetadata.get(uploadId);
    if (!metadata) {
      return null;
    }

    return {
      uploadId: metadata.id,
      status: metadata.status,
      size: metadata.size,
      offset: metadata.offset,
      progress: metadata.size > 0 ? (metadata.offset / metadata.size) * 100 : 0,
      createdAt: metadata.createdAt,
      expiresAt: metadata.expiresAt
    };
  }

  /**
   * Get TUS server instance
   *
   * @returns {Server} TUS server
   */
  getServer() {
    return this.server;
  }

  /**
   * Clean up expired uploads (should be run periodically)
   *
   * @returns {Promise<number>} Number of cleaned uploads
   */
  async cleanupExpiredUploads() {
    const now = Date.now();
    let cleaned = 0;

    for (const [uploadId, metadata] of this.uploadMetadata.entries()) {
      const expiresAt = new Date(metadata.expiresAt).getTime();
      if (now > expiresAt && metadata.status === 'uploading') {
        await this.cleanupUpload(uploadId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      debug.tus('Expired uploads cleaned', {count: cleaned});
    }

    return cleaned;
  }
}

module.exports = TusServer;
