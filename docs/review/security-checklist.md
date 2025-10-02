# Security Validation Checklist
**Project**: Form.io Resumable File Upload System
**Date**: 2025-09-30
**Status**: Pre-Implementation Security Framework

---

## Executive Summary

This comprehensive security checklist covers all aspects of the resumable file upload system implementation. **ALL items marked with ⚠️ are CRITICAL** and must pass validation before production deployment.

---

## 1. Authentication & Authorization

### 1.1 User Authentication

#### ⚠️ CRITICAL: JWT Token Validation
```javascript
// ✅ REQUIRED Implementation
const jwt = require('jsonwebtoken');

function authenticateRequest(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No authentication token provided',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token with Form.io JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Explicitly specify algorithm
      issuer: 'formio', // Verify issuer
      maxAge: '1h' // Token must be <1 hour old
    });

    // Attach user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || []
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'AUTH_TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      error: 'Invalid token',
      code: 'AUTH_TOKEN_INVALID'
    });
  }
}

// ❌ FORBIDDEN: No authentication
app.post('/upload', uploadHandler); // NEVER do this
```

**Validation Checklist:**
- [ ] JWT tokens verified with proper algorithm (HS256/RS256)
- [ ] Token expiration checked (max 1 hour)
- [ ] Token issuer validated
- [ ] Blacklisted tokens rejected
- [ ] Token refresh mechanism implemented
- [ ] No JWT secrets in code (environment variables only)

### 1.2 Form.io Permission Integration

#### ⚠️ CRITICAL: Form Resource Access Control
```javascript
// ✅ REQUIRED: Validate form access before upload
async function validateFormAccess(req, res, next) {
  const { formId } = req.params;
  const { user } = req;

  try {
    // Load form from database
    const form = await req.formio.resources.form.model.findById(formId);

    if (!form) {
      return res.status(404).json({
        error: 'Form not found',
        code: 'FORM_NOT_FOUND'
      });
    }

    // Check if user has submit permission for this form
    const hasPermission = await req.formio.hasPermission(
      'submission.create',
      form,
      user
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions to upload files to this form',
        code: 'PERMISSION_DENIED'
      });
    }

    // Attach form to request for downstream use
    req.form = form;
    next();

  } catch (error) {
    console.error('Permission check failed:', error);
    return res.status(500).json({
      error: 'Permission validation failed',
      code: 'PERMISSION_CHECK_ERROR'
    });
  }
}

// Apply middleware to all upload endpoints
app.post('/form/:formId/upload/init',
  authenticateRequest,
  validateFormAccess,
  initUploadHandler
);
```

**Validation Checklist:**
- [ ] Form existence verified before upload
- [ ] User has `submission.create` permission
- [ ] Permission checked per-upload (not cached)
- [ ] Admin/owner overrides properly handled
- [ ] Anonymous submissions blocked or explicitly allowed
- [ ] Form settings (allowUploads) respected

### 1.3 Resource Access Control

#### ⚠️ CRITICAL: Submission File Access
```javascript
// ✅ REQUIRED: Validate file ownership before download
async function validateFileAccess(req, res, next) {
  const { submissionId, fileId } = req.params;
  const { user } = req;

  try {
    // Load submission
    const submission = await req.formio.resources.submission.model.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        error: 'Submission not found',
        code: 'SUBMISSION_NOT_FOUND'
      });
    }

    // Check if user can read this submission
    const canRead = await req.formio.hasPermission(
      'submission.read',
      submission.form,
      user,
      submission
    );

    if (!canRead) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'FILE_ACCESS_DENIED'
      });
    }

    // Verify file belongs to this submission
    const fileExists = submission.data.files?.some(f => f.id === fileId);

    if (!fileExists) {
      return res.status(404).json({
        error: 'File not found in submission',
        code: 'FILE_NOT_IN_SUBMISSION'
      });
    }

    req.submission = submission;
    next();

  } catch (error) {
    console.error('File access validation failed:', error);
    return res.status(500).json({
      error: 'Access validation failed',
      code: 'ACCESS_CHECK_ERROR'
    });
  }
}
```

**Validation Checklist:**
- [ ] File ownership verified (belongs to submission)
- [ ] Submission access permission checked
- [ ] User can only access own submissions (unless admin)
- [ ] Shared submissions have proper ACL
- [ ] Deleted submissions deny file access
- [ ] Anonymous access blocked

---

## 2. Input Validation

### 2.1 File Validation

#### ⚠️ CRITICAL: File Type Validation (Allowlist)
```javascript
// ✅ REQUIRED: Strict allowlist-based validation
const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': { ext: ['.jpg', '.jpeg'], magic: ['ffd8ffe0', 'ffd8ffe1'] },
  'image/png': { ext: ['.png'], magic: ['89504e47'] },
  'image/gif': { ext: ['.gif'], magic: ['47494638'] },

  // Documents
  'application/pdf': { ext: ['.pdf'], magic: ['25504446'] },
  'application/msword': { ext: ['.doc'], magic: ['d0cf11e0'] },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    ext: ['.docx'],
    magic: ['504b0304'] // ZIP header (Office Open XML)
  },

  // Spreadsheets
  'application/vnd.ms-excel': { ext: ['.xls'], magic: ['d0cf11e0'] },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    ext: ['.xlsx'],
    magic: ['504b0304']
  }
};

async function validateFileType(file) {
  const errors = [];

  // 1. Check MIME type is allowed
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    errors.push({
      field: 'mimetype',
      message: `File type ${file.mimetype} not allowed`,
      code: 'INVALID_MIME_TYPE'
    });
    return errors; // Fail fast
  }

  // 2. Check extension matches MIME type
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ALLOWED_MIME_TYPES[file.mimetype].ext;

  if (!allowedExts.includes(ext)) {
    errors.push({
      field: 'extension',
      message: `Extension ${ext} does not match MIME type ${file.mimetype}`,
      code: 'EXTENSION_MISMATCH'
    });
  }

  // 3. Verify magic numbers (first 4 bytes)
  if (file.buffer) {
    const magicNumber = file.buffer.slice(0, 4).toString('hex');
    const allowedMagic = ALLOWED_MIME_TYPES[file.mimetype].magic;

    const magicValid = allowedMagic.some(magic =>
      magicNumber.startsWith(magic)
    );

    if (!magicValid) {
      errors.push({
        field: 'content',
        message: 'File content does not match declared type (magic number mismatch)',
        code: 'MAGIC_NUMBER_MISMATCH'
      });
    }
  }

  return errors;
}

// ❌ FORBIDDEN: Blocklist validation
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.sh'];
// This is insufficient - attackers can bypass with double extensions
```

**Validation Checklist:**
- [ ] Allowlist of MIME types defined (NOT blocklist)
- [ ] File extension validated against MIME type
- [ ] Magic numbers verified (first 4 bytes)
- [ ] No executable file types allowed (.exe, .sh, .bat)
- [ ] No archive files unless specifically needed (.zip, .tar, .gz)
- [ ] Double extension attack prevented (file.pdf.exe)
- [ ] Case-insensitive extension checking

#### ⚠️ CRITICAL: File Size Limits
```javascript
// ✅ REQUIRED: Enforce strict size limits
const FILE_SIZE_LIMITS = {
  global: 5 * 1024 * 1024 * 1024, // 5GB absolute max

  // Per MIME type limits
  'image/jpeg': 50 * 1024 * 1024, // 50MB for images
  'image/png': 50 * 1024 * 1024,
  'image/gif': 10 * 1024 * 1024, // 10MB for GIFs
  'application/pdf': 100 * 1024 * 1024, // 100MB for PDFs
  'video/mp4': 500 * 1024 * 1024, // 500MB for videos

  default: 100 * 1024 * 1024 // 100MB default
};

function validateFileSize(file) {
  const globalLimit = FILE_SIZE_LIMITS.global;
  const typeLimit = FILE_SIZE_LIMITS[file.mimetype] || FILE_SIZE_LIMITS.default;

  if (file.size > globalLimit) {
    throw new Error({
      message: `File exceeds maximum size of ${globalLimit} bytes`,
      code: 'FILE_TOO_LARGE_GLOBAL',
      statusCode: 413
    });
  }

  if (file.size > typeLimit) {
    throw new Error({
      message: `${file.mimetype} files cannot exceed ${typeLimit} bytes`,
      code: 'FILE_TOO_LARGE_TYPE',
      statusCode: 413
    });
  }

  if (file.size === 0) {
    throw new Error({
      message: 'File is empty',
      code: 'FILE_EMPTY',
      statusCode: 400
    });
  }

  return true;
}
```

**Validation Checklist:**
- [ ] Global file size limit enforced (5GB)
- [ ] Per-type size limits enforced
- [ ] Empty files rejected
- [ ] Size validated before processing begins
- [ ] Multer size limits configured
- [ ] TUS server max size configured
- [ ] Client-side validation implemented (UX)

### 2.2 Filename Sanitization

#### ⚠️ CRITICAL: Secure Filename Generation
```javascript
// ✅ REQUIRED: Never trust user-provided filenames
const crypto = require('crypto');
const path = require('path');

function generateSecureFilename(originalFilename) {
  // Extract extension
  const ext = path.extname(originalFilename).toLowerCase();

  // Validate extension is allowed
  if (!isAllowedExtension(ext)) {
    throw new Error('File extension not allowed');
  }

  // Generate cryptographically secure random name
  const randomBytes = crypto.randomBytes(32);
  const filename = randomBytes.toString('hex');

  return `${filename}${ext}`;
}

function generateStoragePath(formId, submissionId, filename) {
  // Organized by form and submission
  // Example: forms/abc123/submissions/def456/1a2b3c4d5e...f0.pdf
  return path.join(
    'forms',
    formId,
    'submissions',
    submissionId,
    filename
  );
}

// ❌ FORBIDDEN: Using original filename
function unsafeFilename(originalFilename) {
  // NEVER do this - allows path traversal
  return originalFilename; // Could be ../../../etc/passwd
}

// ❌ FORBIDDEN: Simple sanitization
function insufficientSanitization(filename) {
  // Insufficient - many attack vectors remain
  return filename.replace(/[^a-zA-Z0-9.]/g, '_');
}
```

**Validation Checklist:**
- [ ] Original filenames NEVER used in storage paths
- [ ] Cryptographically secure random names generated
- [ ] Path traversal attacks prevented (../, ..\)
- [ ] Null byte injection prevented (%00)
- [ ] Unicode normalization performed (prevent homograph attacks)
- [ ] Filename length limited (255 chars max)
- [ ] Special characters stripped
- [ ] Original filename stored in metadata only

### 2.3 Metadata Validation

#### ⚠️ CRITICAL: Upload Metadata Sanitization
```javascript
// ✅ REQUIRED: Validate all upload metadata
function validateUploadMetadata(metadata) {
  const errors = [];

  // Filename validation
  if (!metadata.filename || typeof metadata.filename !== 'string') {
    errors.push('filename is required and must be a string');
  } else if (metadata.filename.length > 255) {
    errors.push('filename exceeds maximum length of 255 characters');
  }

  // File size validation
  if (!metadata.filesize || typeof metadata.filesize !== 'number') {
    errors.push('filesize is required and must be a number');
  } else if (metadata.filesize < 0) {
    errors.push('filesize must be positive');
  } else if (metadata.filesize > FILE_SIZE_LIMITS.global) {
    errors.push(`filesize exceeds maximum of ${FILE_SIZE_LIMITS.global} bytes`);
  }

  // MIME type validation
  if (!metadata.mimetype || typeof metadata.mimetype !== 'string') {
    errors.push('mimetype is required and must be a string');
  } else if (!ALLOWED_MIME_TYPES[metadata.mimetype]) {
    errors.push(`mimetype ${metadata.mimetype} not allowed`);
  }

  // Sanitize custom metadata
  if (metadata.custom) {
    // Remove any dangerous properties
    delete metadata.custom.__proto__;
    delete metadata.custom.constructor;
    delete metadata.custom.prototype;

    // Ensure values are primitives
    for (const [key, value] of Object.entries(metadata.custom)) {
      if (typeof value === 'object' || typeof value === 'function') {
        errors.push(`custom.${key} must be a primitive value`);
      }
    }
  }

  return errors;
}
```

**Validation Checklist:**
- [ ] All metadata fields type-checked
- [ ] String length limits enforced
- [ ] Numeric range validation
- [ ] Prototype pollution prevented
- [ ] XSS payloads in metadata sanitized
- [ ] Custom metadata restricted to primitives
- [ ] Injection attacks (SQL, NoSQL, command) prevented

---

## 3. Data Protection

### 3.1 Encryption

#### ⚠️ CRITICAL: Encryption at Rest
```javascript
// ✅ REQUIRED: Enable encryption for GCS/S3
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('formio-uploads');

// Enable default encryption on bucket
async function enableBucketEncryption() {
  await bucket.setMetadata({
    encryption: {
      defaultKmsKeyName: process.env.GCS_KMS_KEY // Cloud KMS key
    }
  });
}

// Upload with encryption
async function uploadWithEncryption(file, destination) {
  const blob = bucket.file(destination);

  await blob.save(file.buffer, {
    metadata: {
      // Enable encryption
      encryption: {
        defaultKmsKeyName: process.env.GCS_KMS_KEY
      }
    }
  });
}

// AWS S3 encryption
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'us-east-1' });

await s3Client.send(new PutObjectCommand({
  Bucket: 'formio-uploads',
  Key: 'file.pdf',
  Body: fileBuffer,
  ServerSideEncryption: 'aws:kms', // Use KMS encryption
  SSEKMSKeyId: process.env.AWS_KMS_KEY_ID
}));
```

**Validation Checklist:**
- [ ] Encryption at rest enabled (GCS/S3)
- [ ] Cloud KMS keys configured
- [ ] Key rotation policy defined
- [ ] Encryption keys stored securely (not in code)
- [ ] Backup encryption configured
- [ ] Database encryption enabled (for metadata)

#### ⚠️ CRITICAL: Encryption in Transit
```javascript
// ✅ REQUIRED: HTTPS/TLS enforcement
const express = require('express');
const helmet = require('helmet');

const app = express();

// Enforce HTTPS
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Security headers
app.use(helmet({
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Minimize unsafe-inline
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://storage.googleapis.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  }
}));

// ❌ FORBIDDEN: Allowing HTTP in production
if (process.env.NODE_ENV === 'production') {
  // NEVER serve over HTTP
  app.listen(80); // WRONG
}
```

**Validation Checklist:**
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] TLS 1.2+ only (disable TLS 1.0/1.1)
- [ ] Strong cipher suites configured
- [ ] HSTS header enabled (1 year)
- [ ] Certificate valid and not expired
- [ ] No mixed content warnings

### 3.2 Secure Storage

#### ⚠️ CRITICAL: File Storage Permissions
```javascript
// ✅ REQUIRED: Proper GCS IAM configuration
async function configureBucketPermissions() {
  const bucket = storage.bucket('formio-uploads');

  // Make bucket private (no public access)
  await bucket.makePrivate();

  // Set lifecycle policy to delete old incomplete uploads
  await bucket.setLifecycleRules([
    {
      action: { type: 'Delete' },
      condition: {
        age: 1, // Delete after 1 day
        matchesPrefix: ['temp/']
      }
    }
  ]);

  // Configure CORS for browser uploads
  await bucket.setCorsConfiguration([
    {
      origin: [process.env.ALLOWED_ORIGIN],
      method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
      responseHeader: [
        'Content-Type',
        'x-goog-resumable',
        'Authorization'
      ],
      maxAgeSeconds: 3600
    }
  ]);
}

// ❌ FORBIDDEN: Public bucket access
await bucket.makePublic(); // NEVER do this
```

**Validation Checklist:**
- [ ] Bucket/container set to private
- [ ] No public read/write access
- [ ] IAM roles with least privilege
- [ ] Service account keys secured
- [ ] Signed URLs for temporary access only
- [ ] URL expiration set (max 15 minutes)
- [ ] CORS configured correctly

#### ⚠️ CRITICAL: Signed URL Security
```javascript
// ✅ REQUIRED: Secure signed URL generation
async function generateSignedDownloadUrl(fileKey, userId) {
  // Verify user has access to this file
  const hasAccess = await verifyFileAccess(fileKey, userId);
  if (!hasAccess) {
    throw new Error('Access denied');
  }

  const file = bucket.file(fileKey);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes max

    // Optional: Restrict to specific IP
    responseDisposition: 'attachment', // Force download, not display

    // Optional: Content type override
    responseType: 'application/pdf'
  });

  return url;
}

// ❌ FORBIDDEN: Long-lived or unrestricted URLs
const [url] = await file.getSignedUrl({
  version: 'v4',
  action: 'read',
  expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year - TOO LONG
});
```

**Validation Checklist:**
- [ ] Signed URLs expire in ≤15 minutes
- [ ] URL generation requires authentication
- [ ] File access verified before URL generation
- [ ] URLs are single-use (if possible)
- [ ] Content-Disposition header set to attachment
- [ ] No sensitive data in URL parameters

---

## 4. Attack Prevention

### 4.1 Injection Attacks

#### ⚠️ CRITICAL: SQL/NoSQL Injection Prevention
```javascript
// ✅ REQUIRED: Use parameterized queries
const mongoose = require('mongoose');

async function getSubmission(submissionId, userId) {
  // Safe: Uses Mongoose query builder
  const submission = await Submission.findOne({
    _id: submissionId,
    'owner': userId
  });

  return submission;
}

// ❌ FORBIDDEN: String concatenation
async function unsafeQuery(submissionId) {
  // VULNERABLE to injection
  const query = `{ _id: "${submissionId}" }`;
  const submission = await Submission.findOne(eval(query));
}

// ✅ REQUIRED: Sanitize user input
const validator = require('validator');

function validateSubmissionId(id) {
  // Must be valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid submission ID');
  }
  return id;
}
```

**Validation Checklist:**
- [ ] Parameterized queries used (no string concatenation)
- [ ] ORM/ODM used (Mongoose, Sequelize)
- [ ] User input sanitized before database operations
- [ ] No `eval()` or `Function()` calls on user input
- [ ] Input validation on all database queries
- [ ] Proper escaping of special characters

#### ⚠️ CRITICAL: Path Traversal Prevention
```javascript
// ✅ REQUIRED: Validate file paths
const path = require('path');

function validateFilePath(userPath, baseDir) {
  // Resolve absolute path
  const absolutePath = path.resolve(baseDir, userPath);

  // Ensure path is within base directory
  if (!absolutePath.startsWith(baseDir)) {
    throw new Error('Path traversal detected');
  }

  return absolutePath;
}

// Example usage
const BASE_UPLOAD_DIR = '/var/uploads';
const userProvidedPath = req.query.path;

try {
  const safePath = validateFilePath(userProvidedPath, BASE_UPLOAD_DIR);
  // Use safePath for file operations
} catch (error) {
  return res.status(400).json({ error: 'Invalid file path' });
}

// ❌ FORBIDDEN: Direct path concatenation
const unsafePath = BASE_UPLOAD_DIR + '/' + req.query.path; // VULNERABLE
```

**Validation Checklist:**
- [ ] All file paths resolved and validated
- [ ] Path traversal sequences blocked (../, ..\)
- [ ] Symbolic links handled securely
- [ ] Null bytes rejected (%00)
- [ ] Absolute paths validated against base directory
- [ ] No direct use of user-provided paths

### 4.2 Denial of Service (DoS) Prevention

#### ⚠️ CRITICAL: Rate Limiting
```javascript
// ✅ REQUIRED: Comprehensive rate limiting
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// Global API rate limit
const globalLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please slow down'
});

// Upload-specific rate limit (stricter)
const uploadLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 upload initiations per 15 minutes
  keyGenerator: (req) => req.user.id, // Per-user limit
  skip: (req) => req.user.role === 'admin', // Skip for admins
  message: 'Upload limit exceeded'
});

// Chunk upload rate limit (very permissive)
const chunkLimiter = rateLimit({
  store: new RedisStore({ client: redis }),
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 chunks per minute
  skipSuccessfulRequests: true // Don't count successful uploads
});

app.use('/api', globalLimiter);
app.post('/upload/init', uploadLimiter, initHandler);
app.patch('/files/:id', chunkLimiter, chunkHandler);
```

**Validation Checklist:**
- [ ] Global rate limit configured (100 req/15min)
- [ ] Upload-specific rate limit (10 uploads/15min per user)
- [ ] Chunk upload rate limit (60 chunks/min)
- [ ] Rate limits use Redis for distributed systems
- [ ] Rate limits configurable per user role
- [ ] Rate limit headers returned (X-RateLimit-*)
- [ ] Graceful degradation when rate limit hit

#### ⚠️ CRITICAL: Resource Limits
```javascript
// ✅ REQUIRED: Enforce connection limits
const express = require('express');

const app = express();

// Limit concurrent connections
const MAX_CONCURRENT_UPLOADS = 50;
let activeUploads = 0;

function checkUploadCapacity(req, res, next) {
  if (activeUploads >= MAX_CONCURRENT_UPLOADS) {
    return res.status(503).json({
      error: 'Server at capacity, please try again later',
      code: 'SERVER_BUSY'
    });
  }

  activeUploads++;

  res.on('finish', () => {
    activeUploads--;
  });

  next();
}

app.post('/upload', checkUploadCapacity, uploadHandler);

// Request timeout
app.use((req, res, next) => {
  req.setTimeout(60000); // 60 seconds
  res.setTimeout(60000);
  next();
});

// Body size limit
app.use(express.json({ limit: '10mb' }));
```

**Validation Checklist:**
- [ ] Maximum concurrent uploads enforced
- [ ] Request timeouts configured (60s)
- [ ] Request body size limited
- [ ] File size limits enforced
- [ ] Memory limits per request
- [ ] CPU usage monitoring
- [ ] Graceful handling when limits exceeded

### 4.3 Malware Protection

#### ⚠️ CRITICAL: Virus Scanning
```javascript
// ✅ REQUIRED: Integrate antivirus scanning
const clamscan = require('clamscan');

async function initializeScanner() {
  return await new clamscan().init({
    clamdscan: {
      socket: '/var/run/clamav/clamd.ctl',
      timeout: 60000 // 60 second timeout
    },
    preference: 'clamdscan'
  });
}

async function scanFile(filePath) {
  const scanner = await initializeScanner();

  const { isInfected, viruses } = await scanner.scanFile(filePath);

  if (isInfected) {
    // Delete infected file immediately
    await fs.unlink(filePath);

    // Log security incident
    logger.error('Virus detected', {
      file: path.basename(filePath),
      viruses: viruses,
      timestamp: new Date().toISOString()
    });

    throw new Error({
      message: 'File contains malicious content',
      code: 'VIRUS_DETECTED',
      statusCode: 422,
      viruses: viruses
    });
  }

  return true;
}

// Hook into upload completion
tusServer.on(EVENTS.POST_FINISH, async (req, upload) => {
  try {
    await scanFile(upload.path);
  } catch (error) {
    if (error.code === 'VIRUS_DETECTED') {
      // Notify user and admin
      await notifyVirusDetection(upload, error.viruses);
    }
    throw error;
  }
});
```

**Validation Checklist:**
- [ ] Antivirus scanning integrated (ClamAV or cloud service)
- [ ] All uploaded files scanned before storage
- [ ] Infected files immediately deleted
- [ ] Virus detection logged and monitored
- [ ] Users notified of rejected files
- [ ] Admins notified of virus attempts
- [ ] Virus signature database updated regularly

---

## 5. Logging & Monitoring

### 5.1 Security Logging

#### ⚠️ CRITICAL: Comprehensive Audit Trail
```javascript
// ✅ REQUIRED: Log all security-relevant events
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'formio-upload-security' },
  transports: [
    new winston.transports.File({
      filename: 'security.log',
      level: 'warn'
    }),
    new winston.transports.File({
      filename: 'audit.log'
    })
  ]
});

// Log authentication events
function logAuthEvent(event, req, success, details = {}) {
  securityLogger.info('Authentication event', {
    event: event,
    success: success,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
    ...details
  });
}

// Log upload events
function logUploadEvent(event, req, upload, details = {}) {
  securityLogger.info('Upload event', {
    event: event,
    uploadId: upload.id,
    userId: req.user?.id,
    formId: req.params.formId,
    fileName: upload.metadata?.filename,
    fileSize: upload.size,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    ...details
  });
}

// Log security violations
function logSecurityViolation(violation, req, details = {}) {
  securityLogger.warn('Security violation', {
    violation: violation,
    userId: req.user?.id,
    ip: req.ip,
    url: req.url,
    method: req.method,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
    ...details
  });
}

// Usage examples
logAuthEvent('login', req, true);
logAuthEvent('token_expired', req, false);
logUploadEvent('upload_started', req, upload);
logUploadEvent('upload_completed', req, upload);
logSecurityViolation('invalid_file_type', req, { mimetype: 'application/x-msdownload' });
logSecurityViolation('file_too_large', req, { size: 10737418240 });
```

**Validation Checklist:**
- [ ] All authentication attempts logged
- [ ] All file uploads logged (start, progress, complete)
- [ ] All access denials logged
- [ ] Security violations logged with details
- [ ] Failed validations logged
- [ ] User IP addresses logged
- [ ] Timestamps in ISO 8601 format
- [ ] Logs include correlation IDs
- [ ] Logs forwarded to SIEM (if available)
- [ ] No sensitive data in logs (passwords, tokens)

### 5.2 Monitoring & Alerting

#### ⚠️ CRITICAL: Real-Time Security Monitoring
```javascript
// ✅ REQUIRED: Alert on suspicious activity
const alerting = {
  // Alert on repeated failed authentication
  async checkFailedAuth(userId, ip) {
    const failedAttempts = await redis.incr(`auth:failed:${ip}`);
    await redis.expire(`auth:failed:${ip}`, 3600); // 1 hour window

    if (failedAttempts >= 5) {
      await sendAlert({
        level: 'warning',
        title: 'Multiple failed authentication attempts',
        message: `IP ${ip} has ${failedAttempts} failed auth attempts`,
        ip: ip,
        userId: userId
      });

      // Block IP temporarily
      await redis.set(`ip:blocked:${ip}`, '1', 'EX', 3600);
    }
  },

  // Alert on abnormal upload patterns
  async checkUploadAnomaly(userId, fileSize) {
    const recentUploads = await redis.llen(`uploads:${userId}`);

    if (recentUploads > 100) {
      await sendAlert({
        level: 'warning',
        title: 'Abnormal upload activity',
        message: `User ${userId} has ${recentUploads} uploads in short period`
      });
    }

    // Check for extremely large file
    if (fileSize > 1024 * 1024 * 1024) { // 1GB
      await sendAlert({
        level: 'info',
        title: 'Large file upload',
        message: `User ${userId} uploading ${fileSize} byte file`
      });
    }
  },

  // Alert on virus detection
  async alertVirusDetection(upload, viruses) {
    await sendAlert({
      level: 'critical',
      title: 'VIRUS DETECTED',
      message: `File upload contained virus: ${viruses.join(', ')}`,
      userId: upload.userId,
      fileName: upload.metadata?.filename,
      viruses: viruses
    });
  }
};
```

**Validation Checklist:**
- [ ] Failed authentication monitoring
- [ ] Repeated access denial monitoring
- [ ] Abnormal upload volume monitoring
- [ ] Large file upload monitoring
- [ ] Virus detection alerts (critical)
- [ ] Permission violation alerts
- [ ] Rate limit violation monitoring
- [ ] System resource alerts (CPU, memory, disk)
- [ ] Alert thresholds configured
- [ ] Alert notifications configured (email, Slack, PagerDuty)

---

## 6. Compliance & Privacy

### 6.1 GDPR Compliance

#### ⚠️ CRITICAL: Right to Erasure (Right to be Forgotten)
```javascript
// ✅ REQUIRED: Implement data deletion
async function deleteUserData(userId) {
  // 1. Delete all user files from storage
  const userFiles = await Submission.find({
    owner: userId
  }).select('data.files');

  for (const submission of userFiles) {
    for (const file of submission.data.files || []) {
      // Delete from GCS/S3
      await storage.bucket('formio-uploads').file(file.key).delete();
    }
  }

  // 2. Delete submissions
  await Submission.deleteMany({ owner: userId });

  // 3. Anonymize audit logs (retain for legal purposes)
  await AuditLog.updateMany(
    { userId: userId },
    { $set: { userId: 'DELETED_USER', email: 'deleted@example.com' } }
  );

  // 4. Delete user account
  await User.findByIdAndDelete(userId);

  // Log deletion
  logger.info('User data deleted (GDPR)', {
    userId: userId,
    timestamp: new Date().toISOString()
  });
}
```

**Validation Checklist:**
- [ ] Data deletion API implemented
- [ ] All user files deleted from storage
- [ ] Database records deleted/anonymized
- [ ] Backups include deletion mechanism
- [ ] Audit logs anonymized (not deleted)
- [ ] 30-day deletion grace period
- [ ] User notified before deletion
- [ ] Deletion logged for compliance

#### ⚠️ CRITICAL: Data Portability
```javascript
// ✅ REQUIRED: Export user data
async function exportUserData(userId) {
  // Gather all user data
  const user = await User.findById(userId);
  const submissions = await Submission.find({ owner: userId });

  const exportData = {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.created
    },
    submissions: submissions.map(s => ({
      formId: s.form,
      submissionId: s._id,
      data: s.data,
      files: s.data.files?.map(f => ({
        name: f.name,
        size: f.size,
        url: f.url // Generate download URL
      })),
      submittedAt: s.created
    }))
  };

  return exportData;
}

// API endpoint
app.get('/api/user/:userId/export', async (req, res) => {
  // Verify user is requesting own data
  if (req.user.id !== req.params.userId) {
    return res.status(403).send('Can only export own data');
  }

  const data = await exportUserData(req.params.userId);

  res.setHeader('Content-Disposition', 'attachment; filename=user-data.json');
  res.json(data);
});
```

**Validation Checklist:**
- [ ] Data export API implemented
- [ ] All user data included in export
- [ ] Export in machine-readable format (JSON)
- [ ] Files included or downloadable
- [ ] Export available within 30 days of request
- [ ] Export authenticated and authorized
- [ ] Export logged for audit

### 6.2 Data Residency

#### ⚠️ CRITICAL: Geographic Data Storage
```javascript
// ✅ REQUIRED: Region-specific storage
const STORAGE_REGIONS = {
  'EU': {
    bucket: 'formio-uploads-eu',
    region: 'europe-west1'
  },
  'US': {
    bucket: 'formio-uploads-us',
    region: 'us-central1'
  },
  'ASIA': {
    bucket: 'formio-uploads-asia',
    region: 'asia-northeast1'
  }
};

function getStorageBucket(userRegion) {
  const region = STORAGE_REGIONS[userRegion] || STORAGE_REGIONS['US'];
  return storage.bucket(region.bucket);
}

// Enforce data residency
async function uploadWithResidency(file, user) {
  const bucket = getStorageBucket(user.region);

  // Ensure bucket is in correct region
  const [metadata] = await bucket.getMetadata();
  if (!metadata.location.startsWith(user.region)) {
    throw new Error('Data residency violation');
  }

  // Upload to region-specific bucket
  await bucket.file(file.name).save(file.buffer);
}
```

**Validation Checklist:**
- [ ] Region-specific storage configured
- [ ] EU data stays in EU
- [ ] User region stored and enforced
- [ ] Data transfer logs maintained
- [ ] Cross-region transfers blocked (or logged)
- [ ] Compliance with local data laws

---

## 7. Incident Response

### 7.1 Security Incident Procedures

#### ⚠️ CRITICAL: Incident Detection & Response
```javascript
// ✅ REQUIRED: Automated incident response
const incidentResponse = {
  // Detect security incident
  async detectIncident(type, details) {
    const incident = {
      id: crypto.randomUUID(),
      type: type,
      severity: this.calculateSeverity(type),
      timestamp: new Date().toISOString(),
      details: details,
      status: 'open'
    };

    // Log incident
    securityLogger.error('Security incident detected', incident);

    // Store in database
    await SecurityIncident.create(incident);

    // Alert team
    await this.alertSecurityTeam(incident);

    // Take automated action
    await this.respondToIncident(incident);

    return incident;
  },

  // Calculate incident severity
  calculateSeverity(type) {
    const severityMap = {
      'virus_detected': 'critical',
      'brute_force': 'high',
      'data_breach_attempt': 'critical',
      'dos_attack': 'high',
      'injection_attempt': 'high',
      'privilege_escalation': 'critical',
      'unauthorized_access': 'high',
      'suspicious_upload': 'medium'
    };

    return severityMap[type] || 'low';
  },

  // Automated response actions
  async respondToIncident(incident) {
    switch (incident.type) {
      case 'virus_detected':
        // Delete file, block user temporarily
        await this.blockUser(incident.details.userId, '1h');
        break;

      case 'brute_force':
        // Block IP
        await this.blockIP(incident.details.ip, '24h');
        break;

      case 'dos_attack':
        // Enable DDoS protection, rate limit aggressively
        await this.enableDDoSProtection();
        break;

      case 'data_breach_attempt':
        // Lock down system, alert immediately
        await this.lockdown();
        await this.alertCritical(incident);
        break;
    }
  }
};
```

**Validation Checklist:**
- [ ] Incident detection automated
- [ ] Incident response procedures documented
- [ ] Security team contacts configured
- [ ] Automated blocking of malicious IPs
- [ ] Incident logging to SIEM
- [ ] Post-incident review process
- [ ] Incident recovery procedures
- [ ] Communication plan for breaches

---

## 8. Pre-Deployment Security Checklist

### 8.1 Critical Security Gates

Before production deployment, ALL items MUST be ✅:

#### Authentication & Authorization
- [ ] JWT token validation implemented
- [ ] Form.io permission integration complete
- [ ] File access control validated
- [ ] Token expiration enforced
- [ ] Admin override controls in place

#### Input Validation
- [ ] File type allowlist enforced
- [ ] File size limits configured
- [ ] Magic number validation implemented
- [ ] Filename sanitization complete
- [ ] Metadata validation implemented

#### Encryption
- [ ] HTTPS/TLS enforced
- [ ] Encryption at rest enabled
- [ ] KMS keys configured
- [ ] Signed URLs short-lived (<15 min)
- [ ] Certificate valid

#### Attack Prevention
- [ ] Rate limiting configured
- [ ] SQL/NoSQL injection protected
- [ ] Path traversal blocked
- [ ] XSS sanitization implemented
- [ ] CSRF protection enabled
- [ ] Virus scanning integrated

#### Logging & Monitoring
- [ ] Security logging implemented
- [ ] Audit trail complete
- [ ] Monitoring alerts configured
- [ ] Incident response procedures documented
- [ ] No sensitive data in logs

#### Compliance
- [ ] GDPR data deletion implemented
- [ ] Data export functionality complete
- [ ] Data residency enforced
- [ ] Privacy policy updated
- [ ] Terms of service updated

---

## 9. Continuous Security

### 9.1 Ongoing Security Tasks

**Weekly:**
- [ ] Review security logs for anomalies
- [ ] Check failed authentication patterns
- [ ] Review virus detection incidents
- [ ] Update rate limit thresholds

**Monthly:**
- [ ] Update antivirus signatures
- [ ] Review and update allowlists
- [ ] Penetration testing
- [ ] Dependency security audit
- [ ] Review access permissions

**Quarterly:**
- [ ] Security training for team
- [ ] Third-party security audit
- [ ] Disaster recovery drill
- [ ] Incident response drill
- [ ] Update security documentation

---

## 10. Conclusion

This security checklist is comprehensive and MUST be followed for production deployment. Any deviations require explicit approval from security team.

### Security Contact
- **Security Lead**: TBD
- **Incident Email**: security@example.com
- **Emergency Hotline**: TBD

---

**Document Status**: READY FOR IMPLEMENTATION
**Last Updated**: 2025-09-30
**Review Required**: Before each deployment