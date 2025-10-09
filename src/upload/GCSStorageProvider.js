'use strict';

const {Storage} = require('@google-cloud/storage');
const debug = {
  gcs: require('debug')('formio:upload:gcs'),
  error: require('debug')('formio:error')
};

/**
 * Google Cloud Storage Provider for Form.io
 *
 * Provides integration with Google Cloud Storage for file uploads
 * and seamless integration with TUS resumable upload protocol.
 *
 * @class GCSStorageProvider
 */
class GCSStorageProvider {
  /**
   * Initialize GCS Storage Provider
   *
   * @param {Object} config - Configuration options
   * @param {string} config.projectId - GCS project ID
   * @param {string} config.bucketName - GCS bucket name
   * @param {string} config.keyFilename - Path to service account key file
   * @param {Object} [config.credentials] - Service account credentials object
   * @param {number} [config.chunkSize=8388608] - Upload chunk size (default 8MB)
   * @param {boolean} [config.resumable=true] - Enable resumable uploads
   * @param {string} [config.validation='crc32c'] - Validation algorithm
   */
  constructor(config) {
    if (!config.projectId) {
      throw new Error('GCS projectId is required');
    }
    if (!config.bucketName) {
      throw new Error('GCS bucketName is required');
    }

    this.config = {
      projectId: config.projectId,
      bucketName: config.bucketName,
      chunkSize: config.chunkSize || 8 * 1024 * 1024, // 8MB default
      resumable: config.resumable !== false,
      validation: config.validation || 'crc32c',
      ...config
    };

    // Initialize GCS client
    const storageConfig = {
      projectId: this.config.projectId
    };

    if (config.keyFilename) {
      storageConfig.keyFilename = config.keyFilename;
    }
 else if (config.credentials) {
      storageConfig.credentials = config.credentials;
    }

    this.client = new Storage(storageConfig);
    this.bucket = this.client.bucket(this.config.bucketName);

    debug.gcs('GCS Storage Provider initialized', {
      projectId: this.config.projectId,
      bucket: this.config.bucketName,
      chunkSize: this.config.chunkSize
    });
  }

  /**
   * Get the GCS bucket instance
   *
   * @returns {Object} GCS bucket instance
   */
  getBucket() {
    return this.bucket;
  }

  /**
   * Get the GCS client instance
   *
   * @returns {Object} GCS Storage client
   */
  getClient() {
    return this.client;
  }

  /**
   * Upload a file to GCS
   *
   * @param {string} destination - Destination path in bucket
   * @param {Buffer|string} content - File content
   * @param {Object} [options={}] - Upload options
   * @param {Object} [options.metadata] - File metadata
   * @param {string} [options.contentType] - Content type
   * @returns {Promise<Object>} Upload result with file metadata
   */
  async uploadFile(destination, content, options = {}) {
    try {
      const file = this.bucket.file(destination);

      const uploadOptions = {
        resumable: this.config.resumable,
        validation: this.config.validation,
        metadata: {
          contentType: options.contentType || 'application/octet-stream',
          metadata: options.metadata || {}
        }
      };

      await file.save(content, uploadOptions);

      debug.gcs('File uploaded successfully', {destination});

      return {
        name: file.name,
        bucket: this.bucket.name,
        size: content.length,
        contentType: uploadOptions.metadata.contentType,
        url: `gs://${this.bucket.name}/${file.name}`
      };
    }
 catch (err) {
      debug.error('GCS upload error', err);
      throw err;
    }
  }

  /**
   * Download a file from GCS
   *
   * @param {string} filePath - Path to file in bucket
   * @returns {Promise<Buffer>} File content
   */
  async downloadFile(filePath) {
    try {
      const file = this.bucket.file(filePath);
      const [content] = await file.download();
      debug.gcs('File downloaded successfully', {filePath});
      return content;
    }
 catch (err) {
      debug.error('GCS download error', err);
      throw err;
    }
  }

  /**
   * Delete a file from GCS
   *
   * @param {string} filePath - Path to file in bucket
   * @returns {Promise<void>}
   */
  async deleteFile(filePath) {
    try {
      const file = this.bucket.file(filePath);
      await file.delete();
      debug.gcs('File deleted successfully', {filePath});
    }
 catch (err) {
      debug.error('GCS delete error', err);
      throw err;
    }
  }

  /**
   * Check if a file exists in GCS
   *
   * @param {string} filePath - Path to file in bucket
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filePath) {
    try {
      const file = this.bucket.file(filePath);
      const [exists] = await file.exists();
      return exists;
    }
 catch (err) {
      debug.error('GCS file exists check error', err);
      return false;
    }
  }

  /**
   * Get file metadata
   *
   * @param {string} filePath - Path to file in bucket
   * @returns {Promise<Object>} File metadata
   */
  async getFileMetadata(filePath) {
    try {
      const file = this.bucket.file(filePath);
      const [metadata] = await file.getMetadata();
      return metadata;
    }
 catch (err) {
      debug.error('GCS get metadata error', err);
      throw err;
    }
  }

  /**
   * Generate a signed URL for temporary file access
   *
   * @param {string} filePath - Path to file in bucket
   * @param {Object} [options={}] - URL options
   * @param {string} [options.action='read'] - Access action (read/write/delete)
   * @param {number} [options.expires=3600] - Expiration time in seconds
   * @returns {Promise<string>} Signed URL
   */
  async getSignedUrl(filePath, options = {}) {
    try {
      const file = this.bucket.file(filePath);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: options.action || 'read',
        expires: Date.now() + (options.expires || 3600) * 1000
      });
      return url;
    }
 catch (err) {
      debug.error('GCS signed URL error', err);
      throw err;
    }
  }
}

module.exports = GCSStorageProvider;
