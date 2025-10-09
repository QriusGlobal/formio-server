/**
 * Abstract Storage Provider base class for Form.io cloud file storage
 *
 * Provides interface for cloud storage operations including uploads,
 * downloads, and file management across different providers (S3, GCS, etc.)
 *
 * @abstract
 * @class StorageProvider
 */
const {EventEmitter} = require('events');

class StorageProvider extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.validateConfig(config);
  }

  /**
   * Validate provider configuration
   * @abstract
   * @param {Object} config - Provider configuration
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    throw new Error('validateConfig() must be implemented by subclass');
  }

  /**
   * Upload a single file to storage
   *
   * @abstract
   * @param {Stream} stream - Readable stream of file data
   * @param {Object} metadata - File metadata
   * @param {string} metadata.key - Storage key/path for the file
   * @param {string} metadata.contentType - MIME type of the file
   * @param {string} [metadata.formId] - Associated Form.io form ID
   * @param {string} [metadata.submissionId] - Associated submission ID
   * @param {Object} [options] - Upload options
   * @returns {Promise<Object>} Upload result with location and metadata
   */
  async upload(stream, metadata, options = {}) {
    throw new Error('upload() must be implemented by subclass');
  }

  /**
   * Upload file with multipart/chunked streaming for large files
   *
   * @abstract
   * @param {Stream} stream - Readable stream of file data
   * @param {Object} metadata - File metadata
   * @param {string} metadata.key - Storage key/path for the file
   * @param {string} metadata.contentType - MIME type of the file
   * @param {string} [metadata.formId] - Associated Form.io form ID
   * @param {string} [metadata.submissionId] - Associated submission ID
   * @param {string} [metadata.uploadId] - Unique upload identifier for resumption
   * @param {Object} [options] - Upload options
   * @param {number} [options.chunkSize] - Size of each chunk in bytes
   * @param {number} [options.concurrency] - Number of parallel uploads
   * @param {Function} [options.onProgress] - Progress callback
   * @returns {Promise<Object>} Upload result with location and metadata
   */
  async multipartUpload(stream, metadata, options = {}) {
    throw new Error('multipartUpload() must be implemented by subclass');
  }

  /**
   * Download a file from storage
   *
   * @abstract
   * @param {string} key - Storage key/path of the file
   * @param {Object} [options] - Download options
   * @returns {Promise<Stream>} Readable stream of file data
   */
  async download(key, options = {}) {
    throw new Error('download() must be implemented by subclass');
  }

  /**
   * Delete a file from storage
   *
   * @abstract
   * @param {string} key - Storage key/path of the file
   * @param {Object} [options] - Delete options
   * @returns {Promise<void>}
   */
  async delete(key, options = {}) {
    throw new Error('delete() must be implemented by subclass');
  }

  /**
   * Generate a presigned URL for file access
   *
   * @abstract
   * @param {string} key - Storage key/path of the file
   * @param {string} operation - Operation type ('read' or 'write')
   * @param {number} [expiry=900] - URL expiration in seconds (default 15 minutes)
   * @param {Object} [options] - Additional options
   * @returns {Promise<string>} Presigned URL
   */
  async generatePresignedUrl(key, operation, expiry = 900, options = {}) {
    throw new Error('generatePresignedUrl() must be implemented by subclass');
  }

  /**
   * List objects in storage with optional prefix filter
   *
   * @abstract
   * @param {string} [prefix] - Prefix to filter objects
   * @param {Object} [options] - List options
   * @param {number} [options.maxResults] - Maximum number of results
   * @param {string} [options.pageToken] - Token for pagination
   * @returns {Promise<Object>} List of objects and pagination info
   */
  async listObjects(prefix, options = {}) {
    throw new Error('listObjects() must be implemented by subclass');
  }

  /**
   * Get object metadata without downloading
   *
   * @abstract
   * @param {string} key - Storage key/path of the file
   * @param {Object} [options] - Options
   * @returns {Promise<Object>} Object metadata
   */
  async headObject(key, options = {}) {
    throw new Error('headObject() must be implemented by subclass');
  }

  /**
   * Copy an object to a new location
   *
   * @abstract
   * @param {string} sourceKey - Source storage key
   * @param {string} destinationKey - Destination storage key
   * @param {Object} [options] - Copy options
   * @returns {Promise<Object>} Copy result
   */
  async copyObject(sourceKey, destinationKey, options = {}) {
    throw new Error('copyObject() must be implemented by subclass');
  }

  /**
   * Test connection and configuration validity
   *
   * @returns {Promise<boolean>} True if connection is valid
   */
  async testConnection() {
    try {
      await this.listObjects('', {maxResults: 1});
      return true;
    }
    catch (error) {
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Emit progress event
   *
   * @protected
   * @param {Object} progress - Progress information
   * @param {number} progress.loaded - Bytes uploaded/downloaded
   * @param {number} progress.total - Total bytes
   * @param {number} progress.percentage - Progress percentage
   */
  _emitProgress(progress) {
    this.emit('progress', {
      loaded: progress.loaded,
      total: progress.total,
      percentage: Math.round((progress.loaded / progress.total) * 100)
    });
  }

  /**
   * Emit error event
   *
   * @protected
   * @param {Error} error - Error object
   */
  _emitError(error) {
    this.emit('error', error);
  }
}

module.exports = StorageProvider;
