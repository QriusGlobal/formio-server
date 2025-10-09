'use strict';

const debug = {
  middleware: require('debug')('formio:upload:middleware'),
  error: require('debug')('formio:error')
};

/**
 * Upload Authorization Middleware
 *
 * Validates JWT tokens and checks user permissions for upload operations.
 * Integrates with Form.io's existing authentication system.
 *
 * @param {Object} router - Form.io router instance
 * @returns {Function} Express middleware
 */
function uploadAuthMiddleware(router) {
  return async function(req, res, next) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        debug.middleware('Missing authorization header');
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authorization header required'
        });
      }

      const token = authHeader.substring(7);

      // Validate token using Form.io's auth system
      try {
        const decoded = router.formio.auth.verifyToken(token);
        req.user = decoded.user || decoded;
        req.token = token;

        debug.middleware('Token validated', {userId: req.user._id || req.user.id});
      }
 catch (err) {
        debug.error('Token verification failed', err);
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired token'
        });
      }

      next();
    }
 catch (err) {
      debug.error('Auth middleware error', err);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
      });
    }
  };
}

/**
 * Upload Validation Middleware
 *
 * Validates upload request metadata and enforces file size limits.
 *
 * @param {Object} config - Validation configuration
 * @param {number} [config.maxFileSize=5368709120] - Max file size (5GB default)
 * @param {Array<string>} [config.allowedTypes] - Allowed MIME types
 * @param {Array<string>} [config.blockedExtensions] - Blocked file extensions
 * @returns {Function} Express middleware
 */
function uploadValidationMiddleware(config = {}) {
  const maxFileSize = config.maxFileSize || 5 * 1024 * 1024 * 1024; // 5GB
  const allowedTypes = config.allowedTypes || null;
  const blockedExtensions = config.blockedExtensions || [
    '.exe', '.bat', '.cmd', '.sh', '.ps1', '.dll', '.com', '.scr'
  ];

  return function(req, res, next) {
    try {
      // Validate file size from Upload-Length header
      const uploadLength = parseInt(req.headers['upload-length']);
      if (uploadLength && uploadLength > maxFileSize) {
        debug.middleware('File size exceeds limit', {
          uploadLength,
          maxFileSize
        });
        return res.status(413).json({
          error: 'Payload Too Large',
          message: `File size exceeds maximum allowed size of ${maxFileSize} bytes`,
          maxFileSize
        });
      }

      // Validate metadata from Upload-Metadata header
      const metadata = parseUploadMetadata(req.headers['upload-metadata']);

      if (metadata.filename) {
        // Check file extension
        const ext = metadata.filename.substring(
          metadata.filename.lastIndexOf('.')
        ).toLowerCase();

        if (blockedExtensions.includes(ext)) {
          debug.middleware('Blocked file extension', {ext});
          return res.status(400).json({
            error: 'Bad Request',
            message: `File extension ${ext} is not allowed`,
            blockedExtensions
          });
        }

        // Check filename length
        if (metadata.filename.length > 255) {
          return res.status(400).json({
            error: 'Bad Request',
            message: 'Filename too long (max 255 characters)'
          });
        }
      }

      // Validate MIME type if specified
      if (allowedTypes && metadata.filetype) {
        if (!allowedTypes.includes(metadata.filetype)) {
          debug.middleware('Invalid MIME type', {
            filetype: metadata.filetype
          });
          return res.status(400).json({
            error: 'Bad Request',
            message: 'File type not allowed',
            allowedTypes
          });
        }
      }

      // Validate required metadata fields
      if (!metadata.formId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'formId is required in upload metadata'
        });
      }

      if (!metadata.fieldName) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'fieldName is required in upload metadata'
        });
      }

      // Attach validated metadata to request
      req.uploadMetadata = metadata;

      debug.middleware('Upload validation passed', metadata);
      next();
    }
 catch (err) {
      debug.error('Validation middleware error', err);
      return res.status(400).json({
        error: 'Bad Request',
        message: err.message
      });
    }
  };
}

/**
 * Form Permission Middleware
 *
 * Checks if user has permission to upload to the specified form.
 *
 * @param {Object} router - Form.io router instance
 * @returns {Function} Express middleware
 */
function formPermissionMiddleware(router) {
  return async function(req, res, next) {
    try {
      const formId = req.uploadMetadata?.formId || req.query.formId;

      if (!formId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'formId is required'
        });
      }

      // Load form from cache or database
      const form = await router.formio.cache.loadForm(req, null, formId);

      if (!form) {
        debug.middleware('Form not found', {formId});
        return res.status(404).json({
          error: 'Not Found',
          message: `Form not found: ${formId}`
        });
      }

      // Check form permissions
      // Note: This is a simplified check. In production, implement full permission logic
      // based on your Form.io permission system
      if (form.deleted) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Form has been deleted'
        });
      }

      // Attach form to request for later use
      req.form = form;

      debug.middleware('Form permission granted', {
        formId,
        userId: req.user._id || req.user.id
      });

      next();
    }
 catch (err) {
      debug.error('Form permission middleware error', err);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
      });
    }
  };
}

/**
 * Rate Limiting Middleware
 *
 * Implements basic rate limiting for upload endpoints.
 *
 * @param {Object} config - Rate limit configuration
 * @param {number} [config.windowMs=900000] - Time window in ms (15 min default)
 * @param {number} [config.maxRequests=100] - Max requests per window
 * @returns {Function} Express middleware
 */
function rateLimitMiddleware(config = {}) {
  const windowMs = config.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = config.maxRequests || 100;

  // Simple in-memory store (use Redis in production)
  const requests = new Map();

  // Cleanup old entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requests.entries()) {
      if (now - data.resetTime > windowMs) {
        requests.delete(key);
      }
    }
  }, windowMs);

  return function(req, res, next) {
    try {
      const identifier = req.user?._id || req.user?.id || req.ip;
      const now = Date.now();

      let requestData = requests.get(identifier);

      if (!requestData || now - requestData.resetTime > windowMs) {
        // New window
        requestData = {
          count: 1,
          resetTime: now
        };
        requests.set(identifier, requestData);
      }
 else {
        // Existing window
        requestData.count++;

        if (requestData.count > maxRequests) {
          debug.middleware('Rate limit exceeded', {
            identifier,
            count: requestData.count
          });

          const retryAfter = Math.ceil((windowMs - (now - requestData.resetTime)) / 1000);

          return res.status(429)
            .set('Retry-After', retryAfter)
            .json({
              error: 'Too Many Requests',
              message: 'Rate limit exceeded',
              retryAfter
            });
        }
      }

      // Set rate limit headers
      res.set('X-RateLimit-Limit', maxRequests);
      res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - requestData.count));
      res.set('X-RateLimit-Reset', new Date(requestData.resetTime + windowMs).toISOString());

      next();
    }
 catch (err) {
      debug.error('Rate limit middleware error', err);
      next(); // Don't block on rate limit errors
    }
  };
}

/**
 * Parse TUS Upload-Metadata header
 *
 * @private
 * @param {string} metadataHeader - Upload-Metadata header value
 * @returns {Object} Parsed metadata
 */
function parseUploadMetadata(metadataHeader) {
  const metadata = {};

  if (!metadataHeader) {
    return metadata;
  }

  // Parse TUS metadata format: key1 base64value1,key2 base64value2,...
  const pairs = metadataHeader.split(',');
  for (const pair of pairs) {
    const [key, value] = pair.trim().split(' ');
    if (key && value) {
      try {
        metadata[key] = Buffer.from(value, 'base64').toString('utf-8');
      }
 catch (err) {
        debug.error('Failed to parse metadata', {key, value});
      }
    }
  }

  return metadata;
}

/**
 * Error Handler Middleware
 *
 * Catches and formats errors from upload operations.
 *
 * @returns {Function} Express error middleware
 */
function errorHandlerMiddleware() {
  return function(err, req, res, next) {
    debug.error('Upload error', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method
    });

    // Don't respond if headers already sent
    if (res.headersSent) {
      return next(err);
    }

    // Format error response
    const status = err.status || err.statusCode || 500;
    const response = {
      error: err.name || 'Upload Error',
      message: err.message || 'An error occurred during upload',
      uploadId: req.params?.id
    };

    // Add additional details in development
    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(status).json(response);
  };
}

module.exports = {
  uploadAuthMiddleware,
  uploadValidationMiddleware,
  formPermissionMiddleware,
  rateLimitMiddleware,
  errorHandlerMiddleware,
  parseUploadMetadata
};
