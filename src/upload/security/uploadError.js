'use strict';

/**
 * UploadError - Structured error class for upload operations
 * Provides machine-readable error codes without exposing sensitive information
 */

class UploadError extends Error {
  constructor(code, details = {}) {
    // Map error codes to user-friendly messages
    const errorMessages = {
      // Path errors
      INVALID_PATH: 'Invalid file path',
      PATH_TRAVERSAL_ATTEMPT: 'Security violation: Path traversal detected',

      // Size errors
      FILE_TOO_LARGE: 'File exceeds maximum allowed size',
      QUOTA_EXCEEDED: 'Upload quota exceeded',
      SIZE_LIMIT_EXCEEDED: 'Stream size limit exceeded',

      // Security errors
      COMPRESSION_BOMB_DETECTED: 'Security violation: Compression bomb detected',
      HASH_MISMATCH: 'File integrity check failed',
      INVALID_FILE_TYPE: 'File type not allowed',
      RATE_LIMIT_EXCEEDED: 'Too many upload requests',

      // Stream errors
      STREAM_TIMEOUT: 'Upload timeout exceeded',
      CHUNK_TIMEOUT: 'No data received - connection timeout',
      STREAM_ABORTED: 'Upload was cancelled',

      // System errors
      NOT_A_FILE: 'Path does not point to a file',
      CONCURRENT_WRITE_CONFLICT: 'File is already being uploaded',
      GCS_UPLOAD_ERROR: 'Cloud storage upload failed',
      HASHER_INIT_FAILED: 'Hash validation initialization failed',
      HASH_TRANSFORM_ERROR: 'Hash calculation error',
      HASH_FINALIZATION_ERROR: 'Hash finalization failed',
      HASH_NOT_COMPUTED: 'Hash not available - stream not completed',
      UPLOAD_FAILED: 'Upload failed',
      STREAM_UPLOAD_FAILED: 'Stream upload failed',

      // Default
      UNKNOWN_ERROR: 'An unknown error occurred'
    };

    const message = errorMessages[code] || errorMessages.UNKNOWN_ERROR;
    super(message);

    this.name = 'UploadError';
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.details = this._sanitizeDetails(details);

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UploadError);
    }
  }

  /**
   * Sanitize error details to prevent information leakage
   * @private
   */
  _sanitizeDetails(details) {
    const sanitized = {};

    // Whitelist of safe detail fields
    const safeFields = [
      'destination',
      'size',
      'maxSize',
      'expected',
      'actual',
      'originalName',
      'contentType',
      'chunkCount',
      'duration'
    ];

    for (const field of safeFields) {
      if (details[field] !== undefined) {
        // Sanitize values
        if (typeof details[field] === 'string') {
          // Remove any potential path traversal patterns
          sanitized[field] = details[field]
            .replace(/\.\./g, '')
            .replace(/^\//, '');
        }
        else if (typeof details[field] === 'number') {
          sanitized[field] = details[field];
        }
        else {
          sanitized[field] = String(details[field]);
        }
      }
    }

    return sanitized;
  }

  /**
   * Convert error to JSON for logging
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      details: this.details
    };
  }

  /**
   * Check if error is retryable
   * @returns {boolean} True if operation can be retried
   */
  isRetryable() {
    const retryableCodes = [
      'STREAM_TIMEOUT',
      'CHUNK_TIMEOUT',
      'GCS_UPLOAD_ERROR',
      'STREAM_ABORTED',
      'CONCURRENT_WRITE_CONFLICT'
    ];

    return retryableCodes.includes(this.code);
  }

  /**
   * Check if error is a security violation
   * @returns {boolean} True if security-related
   */
  isSecurityViolation() {
    const securityCodes = [
      'PATH_TRAVERSAL_ATTEMPT',
      'COMPRESSION_BOMB_DETECTED',
      'INVALID_FILE_TYPE',
      'HASH_MISMATCH'
    ];

    return securityCodes.includes(this.code);
  }

  /**
   * Get HTTP status code for error
   * @returns {number} HTTP status code
   */
  getHttpStatus() {
    const statusMap = {
      // Client errors (4xx)
      INVALID_PATH: 400,
      PATH_TRAVERSAL_ATTEMPT: 403,
      FILE_TOO_LARGE: 413,
      QUOTA_EXCEEDED: 413,
      SIZE_LIMIT_EXCEEDED: 413,
      COMPRESSION_BOMB_DETECTED: 400,
      HASH_MISMATCH: 422,
      INVALID_FILE_TYPE: 415,
      RATE_LIMIT_EXCEEDED: 429,
      NOT_A_FILE: 400,

      // Server errors (5xx)
      STREAM_TIMEOUT: 504,
      CHUNK_TIMEOUT: 504,
      STREAM_ABORTED: 499, // Client closed request
      CONCURRENT_WRITE_CONFLICT: 409,
      GCS_UPLOAD_ERROR: 502,
      HASHER_INIT_FAILED: 500,
      HASH_TRANSFORM_ERROR: 500,
      HASH_FINALIZATION_ERROR: 500,
      HASH_NOT_COMPUTED: 500,
      UPLOAD_FAILED: 500,
      STREAM_UPLOAD_FAILED: 500,
      UNKNOWN_ERROR: 500
    };

    return statusMap[this.code] || 500;
  }
}

module.exports = UploadError;
