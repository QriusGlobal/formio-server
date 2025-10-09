/**
 * Google Cloud Storage Provider for Form.io
 *
 * Implements cloud file storage using Google Cloud Storage with:
 * - Resumable uploads with 8MB chunks
 * - Streaming support for large files
 * - Progress tracking with EventEmitter
 * - Automatic retry logic with exponential backoff
 * - Support for GCS emulator (localhost:4443)
 *
 * @class GCSProvider
 * @extends StorageProvider
 */
const {Storage} = require('@google-cloud/storage');
const {Transform, pipeline} = require('stream');
const {promisify} = require('util');
const StorageProvider = require('../StorageProvider');

const pipelineAsync = promisify(pipeline);

class GCSProvider extends StorageProvider {
  /**
   * Create GCS storage provider instance
   *
   * @param {Object} config - GCS configuration
   * @param {string} config.projectId - GCP project ID
   * @param {string} [config.keyFilename] - Path to service account key file
   * @param {Object} [config.credentials] - Service account credentials object
   * @param {string} config.bucket - GCS bucket name
   * @param {string} [config.location='us-central1'] - Bucket location
   * @param {string} [config.apiEndpoint] - Custom API endpoint (for emulator)
   * @param {number} [config.maxRetries=3] - Maximum retry attempts
   * @param {number} [config.retryDelayMultiplier=2] - Retry delay multiplier
   * @throws {Error} If required configuration is missing
   */
  constructor(config) {
    super(config);

    // Initialize GCS client with retry options
    const storageConfig = {
      projectId: config.projectId,
      retryOptions: {
        autoRetry: true,
        maxRetries: config.maxRetries || 3,
        retryDelayMultiplier: config.retryDelayMultiplier || 2
      }
    };

    // Add authentication if not using emulator
    if (config.keyFilename) {
      storageConfig.keyFilename = config.keyFilename;
    }
    else if (config.credentials) {
      storageConfig.credentials = config.credentials;
    }

    // Support for GCS emulator
    if (config.apiEndpoint) {
      storageConfig.apiEndpoint = config.apiEndpoint;
    }

    this.storage = new Storage(storageConfig);
    this.bucketName = config.bucket;
    this.bucket = this.storage.bucket(config.bucket);
    this.location = config.location || 'us-central1';
    this.chunkSize = config.chunkSize || 8 * 1024 * 1024; // 8MB default for GCS
  }

  /**
   * Validate GCS provider configuration
   *
   * @param {Object} config - Provider configuration
   * @throws {Error} If required fields are missing
   */
  validateConfig(config) {
    if (!config.projectId) {
      throw new Error('GCS projectId is required');
    }
    if (!config.bucket) {
      throw new Error('GCS bucket name is required');
    }
    // Authentication is optional for emulator
    if (!config.apiEndpoint && !config.keyFilename && !config.credentials) {
      throw new Error('GCS authentication required: provide keyFilename or credentials');
    }
  }

  /**
   * Upload a single file to GCS
   *
   * @param {Stream} stream - Readable stream of file data
   * @param {Object} metadata - File metadata
   * @param {string} metadata.key - Storage key/path for the file
   * @param {string} metadata.contentType - MIME type of the file
   * @param {string} [metadata.formId] - Associated Form.io form ID
   * @param {string} [metadata.submissionId] - Associated submission ID
   * @param {Object} [options] - Upload options
   * @param {string} [options.acl='projectPrivate'] - Predefined ACL
   * @param {string} [options.cacheControl='public, max-age=31536000'] - Cache control header
   * @returns {Promise<Object>} Upload result with location and metadata
   */
  async upload(stream, metadata, options = {}) {
    const file = this.bucket.file(metadata.key);

    const uploadOptions = {
      metadata: {
        contentType: metadata.contentType,
        cacheControl: options.cacheControl || 'public, max-age=31536000',
        metadata: {
          formId: metadata.formId || '',
          submissionId: metadata.submissionId || ''
        }
      },
      resumable: false, // Simple upload for small files
      predefinedAcl: options.acl || 'projectPrivate'
    };

    try {
      const uploadStream = file.createWriteStream(uploadOptions);

      await pipelineAsync(stream, uploadStream);

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${metadata.key}`;

      return {
        key: metadata.key,
        location: publicUrl,
        bucket: this.bucketName,
        etag: file.metadata.etag,
        size: file.metadata.size
      };
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS upload failed: ${error.message}`);
    }
  }

  /**
   * Upload file with resumable multipart streaming for large files
   *
   * Implements GCS resumable upload protocol with:
   * - 8MB chunk size (optimized for GCS)
   * - CRC32C validation
   * - Progress tracking via EventEmitter
   * - Automatic retry on failure
   *
   * @param {Stream} stream - Readable stream of file data
   * @param {Object} metadata - File metadata
   * @param {string} metadata.key - Storage key/path for the file
   * @param {string} metadata.contentType - MIME type of the file
   * @param {string} [metadata.formId] - Associated Form.io form ID
   * @param {string} [metadata.submissionId] - Associated submission ID
   * @param {string} [metadata.uploadId] - Unique upload identifier
   * @param {Object} [options] - Upload options
   * @param {number} [options.chunkSize] - Size of each chunk (default 8MB)
   * @param {string} [options.validation='crc32c'] - Validation method
   * @param {string} [options.acl='projectPrivate'] - Predefined ACL
   * @param {Function} [options.onProgress] - Progress callback
   * @returns {Promise<Object>} Upload result with location and metadata
   */
  async multipartUpload(stream, metadata, options = {}) {
    const file = this.bucket.file(metadata.key);
    let bytesUploaded = 0;
    let totalBytes = 0;

    // Resumable upload configuration for large files
    const uploadOptions = {
      metadata: {
        contentType: metadata.contentType,
        cacheControl: 'public, max-age=31536000',
        metadata: {
          formId: metadata.formId || '',
          submissionId: metadata.submissionId || '',
          uploadId: metadata.uploadId || ''
        }
      },

      // Resumable upload configuration
      resumable: true,
      chunkSize: options.chunkSize || this.chunkSize, // 8MB for GCS

      // Validation
      validation: options.validation || 'crc32c',

      // Predefined ACL
      predefinedAcl: options.acl || 'projectPrivate'
    };

    try {
      // Create upload stream
      const uploadStream = file.createWriteStream(uploadOptions);

      // Create progress tracking transform stream
      const progressStream = new Transform({
        transform: (chunk, encoding, callback) => {
          bytesUploaded += chunk.length;
          totalBytes = bytesUploaded; // Approximate total

          // Emit progress event
          const progress = {
            loaded: bytesUploaded,
            total: totalBytes,
            percentage: totalBytes > 0 ? Math.round((bytesUploaded / totalBytes) * 100) : 0
          };

          this._emitProgress(progress);

          // Call user progress callback if provided
          if (options.onProgress) {
            options.onProgress(progress);
          }

          callback(null, chunk);
        }
      });

      // Handle upload stream events
      uploadStream.on('error', (error) => {
        this._emitError(error);
      });

      uploadStream.on('finish', () => {
        this.emit('complete', {
          key: metadata.key,
          bytesUploaded: bytesUploaded
        });
      });

      // Pipeline streams together
      await pipelineAsync(stream, progressStream, uploadStream);

      // Get file metadata after upload
      const [fileMetadata] = await file.getMetadata();

      // Generate public URL
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${metadata.key}`;

      return {
        key: metadata.key,
        location: publicUrl,
        bucket: this.bucketName,
        etag: fileMetadata.etag,
        size: fileMetadata.size,
        contentType: fileMetadata.contentType,
        crc32c: fileMetadata.crc32c,
        timeCreated: fileMetadata.timeCreated,
        updated: fileMetadata.updated
      };
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS multipart upload failed: ${error.message}`);
    }
  }

  /**
   * Download a file from GCS
   *
   * @param {string} key - Storage key/path of the file
   * @param {Object} [options] - Download options
   * @param {number} [options.start] - Byte offset to start download
   * @param {number} [options.end] - Byte offset to end download
   * @returns {Promise<Stream>} Readable stream of file data
   */
  async download(key, options = {}) {
    try {
      const file = this.bucket.file(key);

      const downloadOptions = {};
      if (options.start !== undefined) {
        downloadOptions.start = options.start;
      }
      if (options.end !== undefined) {
        downloadOptions.end = options.end;
      }

      const readStream = file.createReadStream(downloadOptions);

      return readStream;
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS download failed: ${error.message}`);
    }
  }

  /**
   * Delete a file from GCS
   *
   * @param {string} key - Storage key/path of the file
   * @param {Object} [options] - Delete options
   * @returns {Promise<void>}
   */
  async delete(key, options = {}) {
    try {
      const file = this.bucket.file(key);
      await file.delete();

      this.emit('deleted', {key});
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS delete failed: ${error.message}`);
    }
  }

  /**
   * Generate a signed URL for file access
   *
   * Signed URLs provide time-limited access to private files
   *
   * @param {string} key - Storage key/path of the file
   * @param {string} operation - Operation type ('read' or 'write')
   * @param {number} [expiry=900] - URL expiration in seconds (default 15 minutes)
   * @param {Object} [options] - Additional options
   * @param {string} [options.contentType] - Content type for write operations
   * @returns {Promise<string>} Signed URL
   */
  async generatePresignedUrl(key, operation, expiry = 900, options = {}) {
    try {
      const file = this.bucket.file(key);

      const action = operation === 'read' ? 'read' : 'write';

      const signOptions = {
        version: 'v4',
        action: action,
        expires: Date.now() + (expiry * 1000) // Convert to milliseconds
      };

      // Add content type for write operations
      if (operation === 'write' && options.contentType) {
        signOptions.contentType = options.contentType;
      }

      const [signedUrl] = await file.getSignedUrl(signOptions);

      return signedUrl;
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS presigned URL generation failed: ${error.message}`);
    }
  }

  /**
   * List objects in GCS bucket with optional prefix filter
   *
   * @param {string} [prefix] - Prefix to filter objects
   * @param {Object} [options] - List options
   * @param {number} [options.maxResults=1000] - Maximum number of results
   * @param {string} [options.pageToken] - Token for pagination
   * @param {string} [options.delimiter='/'] - Delimiter for grouping
   * @returns {Promise<Object>} List of objects and pagination info
   */
  async listObjects(prefix = '', options = {}) {
    try {
      const listOptions = {
        prefix: prefix,
        maxResults: options.maxResults || 1000
      };

      if (options.pageToken) {
        listOptions.pageToken = options.pageToken;
      }

      if (options.delimiter) {
        listOptions.delimiter = options.delimiter;
      }

      const [files, , metadata] = await this.bucket.getFiles(listOptions);

      return {
        objects: files.map(file => ({
          key: file.name,
          size: file.metadata.size,
          etag: file.metadata.etag,
          lastModified: file.metadata.updated,
          contentType: file.metadata.contentType
        })),
        nextPageToken: metadata.nextPageToken,
        prefixes: metadata.prefixes || []
      };
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS list objects failed: ${error.message}`);
    }
  }

  /**
   * Get object metadata without downloading
   *
   * @param {string} key - Storage key/path of the file
   * @param {Object} [options] - Options
   * @returns {Promise<Object>} Object metadata
   */
  async headObject(key, options = {}) {
    try {
      const file = this.bucket.file(key);
      const [metadata] = await file.getMetadata();

      return {
        key: key,
        size: metadata.size,
        etag: metadata.etag,
        contentType: metadata.contentType,
        lastModified: metadata.updated,
        metadata: metadata.metadata || {},
        crc32c: metadata.crc32c,
        md5Hash: metadata.md5Hash
      };
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS head object failed: ${error.message}`);
    }
  }

  /**
   * Copy an object to a new location within GCS
   *
   * @param {string} sourceKey - Source storage key
   * @param {string} destinationKey - Destination storage key
   * @param {Object} [options] - Copy options
   * @param {Object} [options.metadata] - Metadata overrides for destination
   * @returns {Promise<Object>} Copy result
   */
  async copyObject(sourceKey, destinationKey, options = {}) {
    try {
      const sourceFile = this.bucket.file(sourceKey);
      const destinationFile = this.bucket.file(destinationKey);

      const copyOptions = {};
      if (options.metadata) {
        copyOptions.metadata = options.metadata;
      }

      await sourceFile.copy(destinationFile, copyOptions);

      const [metadata] = await destinationFile.getMetadata();

      return {
        key: destinationKey,
        size: metadata.size,
        etag: metadata.etag,
        contentType: metadata.contentType
      };
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS copy object failed: ${error.message}`);
    }
  }

  /**
   * Ensure bucket exists, create if it doesn't
   *
   * @returns {Promise<void>}
   */
  async ensureBucket() {
    try {
      const [exists] = await this.bucket.exists();

      if (!exists) {
        await this.storage.createBucket(this.bucketName, {
          location: this.location,
          storageClass: 'STANDARD'
        });

        this.emit('bucket-created', {bucket: this.bucketName});
      }
    }
    catch (error) {
      this._emitError(error);
      throw new Error(`GCS ensure bucket failed: ${error.message}`);
    }
  }

  /**
   * Test connection and bucket access
   *
   * @returns {Promise<boolean>} True if connection is valid
   */
  async testConnection() {
    try {
      const [exists] = await this.bucket.exists();
      if (!exists) {
        throw new Error(`Bucket ${this.bucketName} does not exist`);
      }

      // Try to list objects to verify permissions
      await this.bucket.getFiles({maxResults: 1});

      return true;
    }
    catch (error) {
      this._emitError(error);
      return false;
    }
  }
}

module.exports = GCSProvider;
