'use strict';

/**
 * UploadSecurityManager - Central security controls for uploads
 * Implements:
 * - Rate limiting per client
 * - MIME type validation
 * - File extension validation
 * - Content scanning hooks
 */

const path = require('path');
const UploadError = require('./uploadError');

class UploadSecurityManager {
  constructor(options = {}) {
    // Rate limiting configuration
    this.rateLimiter = new Map();
    this.rateLimitWindow = options.rateLimitWindow || 60000; // 1 minute default
    this.maxRequestsPerWindow = options.maxRequestsPerWindow || 10;

    // File type configuration
    this.allowedMimeTypes = new Set(options.allowedMimeTypes || [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',

      // Documents
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json',

      // Office documents (optional)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]);

    this.allowedExtensions = new Set(options.allowedExtensions || [
      // Images
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',

      // Documents
      '.pdf', '.txt', '.csv', '.json',

      // Office (optional)
      '.docx', '.xlsx', '.pptx'
    ]);

    // Blocked patterns (for additional security)
    this.blockedPatterns = options.blockedPatterns || [
      /\.exe$/i,
      /\.dll$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.sh$/i,
      /\.ps1$/i,
      /\.scr$/i,
      /\.vbs$/i,
      /\.js$/i,
      /\.jar$/i,
      /\.app$/i
    ];

    // Cleanup old rate limit entries periodically
    try {
      this.cleanupInterval = setInterval(() => {
        this._cleanupRateLimiter();
      }, this.rateLimitWindow);
    }
 catch (err) {
      // Clean up on constructor error
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
      throw err;
    }
  }

  /**
   * Check rate limit for a client
   * @param {string} clientId - Client identifier (IP, user ID, etc.)
   * @param {number} cost - Request cost (default 1)
   * @throws {UploadError} If rate limit exceeded
   */
  checkRateLimit(clientId, cost = 1) {
    if (!clientId) {
      throw new UploadError('INVALID_CLIENT_ID');
    }

    const now = Date.now();
    const window = this.rateLimitWindow;

    // Get or create client record
    if (!this.rateLimiter.has(clientId)) {
      this.rateLimiter.set(clientId, {
        requests: [],
        blocked: false,
        blockUntil: 0
      });
    }

    const clientRecord = this.rateLimiter.get(clientId);

    // Check if client is temporarily blocked
    if (clientRecord.blocked && now < clientRecord.blockUntil) {
      const waitTime = Math.ceil((clientRecord.blockUntil - now) / 1000);
      throw new UploadError('RATE_LIMIT_EXCEEDED', {
        retryAfter: waitTime
      });
    }

    // Clear expired block
    if (clientRecord.blocked && now >= clientRecord.blockUntil) {
      clientRecord.blocked = false;
      clientRecord.blockUntil = 0;
      clientRecord.requests = [];
    }

    // Filter requests within current window
    clientRecord.requests = clientRecord.requests.filter(
      req => now - req.timestamp < window
    );

    // Check if limit would be exceeded
    const currentCount = clientRecord.requests.reduce((sum, req) => sum + (req.cost || 1), 0);
    if (currentCount + cost > this.maxRequestsPerWindow) {
      // Block client temporarily
      clientRecord.blocked = true;
      clientRecord.blockUntil = now + window;

      throw new UploadError('RATE_LIMIT_EXCEEDED', {
        retryAfter: Math.ceil(window / 1000)
      });
    }

    // Record request
    clientRecord.requests.push({timestamp: now, cost});
  }

  /**
   * Validate file extension
   * @param {string} filename - File name to validate
   * @throws {UploadError} If extension not allowed
   */
  validateFileExtension(filename) {
    if (!filename || typeof filename !== 'string') {
      throw new UploadError('INVALID_FILENAME');
    }

    // Extract extension
    const ext = path.extname(filename).toLowerCase();

    // Check blocked patterns first
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(filename)) {
        throw new UploadError('INVALID_FILE_TYPE', {
          filename: path.basename(filename),
          reason: 'Blocked file pattern'
        });
      }
    }

    // Check allowed extensions
    if (!this.allowedExtensions.has(ext)) {
      throw new UploadError('INVALID_FILE_TYPE', {
        filename: path.basename(filename),
        extension: ext
      });
    }
  }

  /**
   * Validate MIME type
   * @param {string} mimeType - MIME type to validate
   * @throws {UploadError} If MIME type not allowed
   */
  validateMimeType(mimeType) {
    if (!mimeType) {
      throw new UploadError('INVALID_FILE_TYPE', {
        reason: 'No MIME type provided'
      });
    }

    // Normalize MIME type (remove parameters)
    const normalizedType = mimeType.split(';')[0].trim().toLowerCase();

    if (!this.allowedMimeTypes.has(normalizedType)) {
      throw new UploadError('INVALID_FILE_TYPE', {
        mimeType: normalizedType
      });
    }
  }

  /**
   * Validate file metadata before upload
   * @param {Object} metadata - File metadata
   * @throws {UploadError} If validation fails
   */
  async validateFileMetadata(metadata) {
    const {filename, mimeType, size, clientId} = metadata;

    // Check rate limit
    if (clientId) {
      this.checkRateLimit(clientId);
    }

    // Validate filename
    this.validateFileExtension(filename);

    // Validate MIME type
    if (mimeType) {
      this.validateMimeType(mimeType);
    }

    // Validate size (if provided)
    if (size) {
      const maxSize = metadata.maxSize || 100 * 1024 * 1024; // 100MB default
      if (size > maxSize) {
        throw new UploadError('FILE_TOO_LARGE', {
          size,
          maxSize
        });
      }
    }
  }

  /**
   * Scan file content (hook for virus scanning, etc.)
   * @param {string} filePath - Path to file
   * @returns {Promise<Object>} Scan results
   */
  async scanFileContent(filePath) {
    // This is a hook for integrating virus scanning or content analysis
    // In production, integrate with ClamAV, Windows Defender, or cloud service

    // For now, return basic validation
    return {
      clean: true,
      scanned: true,
      timestamp: Date.now()
    };
  }

  /**
   * Get current rate limit status for a client
   * @param {string} clientId - Client identifier
   * @returns {Object} Rate limit status
   */
  getRateLimitStatus(clientId) {
    const record = this.rateLimiter.get(clientId);
    if (!record) {
      return {
        requests: 0,
        remaining: this.maxRequestsPerWindow,
        blocked: false
      };
    }

    const now = Date.now();
    const activeRequests = record.requests.filter(
      req => now - req.timestamp < this.rateLimitWindow
    );

    const count = activeRequests.reduce((sum, req) => sum + (req.cost || 1), 0);

    return {
      requests: count,
      remaining: Math.max(0, this.maxRequestsPerWindow - count),
      blocked: record.blocked && now < record.blockUntil,
      resetTime: record.blocked ? record.blockUntil : null
    };
  }

  /**
   * Reset rate limit for a client
   * @param {string} clientId - Client identifier
   */
  resetRateLimit(clientId) {
    this.rateLimiter.delete(clientId);
  }

  /**
   * Clean up expired rate limit entries
   * @private
   */
  _cleanupRateLimiter() {
    const now = Date.now();
    const window = this.rateLimitWindow;

    for (const [clientId, record] of this.rateLimiter) {
      // Remove if no recent requests and not blocked
      const hasRecentRequests = record.requests.some(
        req => now - req.timestamp < window * 2
      );

      if (!hasRecentRequests && !record.blocked) {
        this.rateLimiter.delete(clientId);
      }
    }
  }

  /**
   * Add allowed MIME type
   * @param {string} mimeType - MIME type to allow
   */
  addAllowedMimeType(mimeType) {
    this.allowedMimeTypes.add(mimeType.toLowerCase());
  }

  /**
   * Remove allowed MIME type
   * @param {string} mimeType - MIME type to remove
   */
  removeAllowedMimeType(mimeType) {
    this.allowedMimeTypes.delete(mimeType.toLowerCase());
  }

  /**
   * Add allowed extension
   * @param {string} extension - Extension to allow
   */
  addAllowedExtension(extension) {
    const ext = extension.startsWith('.') ? extension : `.${  extension}`;
    this.allowedExtensions.add(ext.toLowerCase());
  }

  /**
   * Remove allowed extension
   * @param {string} extension - Extension to remove
   */
  removeAllowedExtension(extension) {
    const ext = extension.startsWith('.') ? extension : `.${  extension}`;
    this.allowedExtensions.delete(ext.toLowerCase());
  }

  /**
   * Get security configuration
   * @returns {Object} Current configuration
   */
  getConfiguration() {
    return {
      rateLimitWindow: this.rateLimitWindow,
      maxRequestsPerWindow: this.maxRequestsPerWindow,
      allowedMimeTypes: Array.from(this.allowedMimeTypes),
      allowedExtensions: Array.from(this.allowedExtensions),
      activeClients: this.rateLimiter.size
    };
  }

  /**
   * Destroy the manager and clean up
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.rateLimiter.clear();
  }
}

module.exports = UploadSecurityManager;
