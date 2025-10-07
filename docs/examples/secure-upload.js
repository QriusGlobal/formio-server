/**
 * Secure File Upload Server - Production Example
 *
 * This is a complete, production-ready implementation of a secure file upload
 * server that integrates with @formio/file-upload client components.
 *
 * Features:
 * - Magic number verification
 * - Filename sanitization
 * - Malware scanning (ClamAV)
 * - Rate limiting (per-IP and per-user)
 * - JWT authentication
 * - Secure file storage
 * - Comprehensive error handling
 *
 * Installation:
 *   npm install express multer file-type express-rate-limit
 *   npm install jsonwebtoken helmet ioredis rate-limit-redis
 *   npm install clamscan uuid
 *
 *   # Install ClamAV
 *   sudo apt-get install clamav clamav-daemon
 *   sudo freshclam
 *   sudo systemctl start clamav-daemon
 *
 * Usage:
 *   node secure-upload.js
 */

const express = require('express');
const multer = require('multer');
const fileType = require('file-type');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const NodeClam = require('clamscan');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  uploadDir: process.env.UPLOAD_DIR || '/var/uploads',
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 10,
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ],
  clamav: {
    socket: process.env.CLAMAV_SOCKET || '/var/run/clamav/clamd.ctl',
    timeout: 120000
  }
};

// ============================================================================
// Security Headers
// ============================================================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS (configure for your domain)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ============================================================================
// File Upload Configuration
// ============================================================================

const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    fileSize: CONFIG.maxFileSize,
    files: CONFIG.maxFiles
  },
  fileFilter: (req, file, cb) => {
    // Early size check (multer also enforces this)
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > CONFIG.maxFileSize) {
      return cb(new Error('File too large'));
    }
    cb(null, true);
  }
});

// ============================================================================
// ClamAV Initialization
// ============================================================================

let clamscan;
(async () => {
  try {
    clamscan = await new NodeClam().init({
      removeInfected: false,
      quarantineInfected: false,
      scanLog: null,
      debugMode: false,
      clamdscan: {
        socket: CONFIG.clamav.socket,
        timeout: CONFIG.clamav.timeout,
        localFallback: true
      }
    });
    console.log('✅ ClamAV initialized successfully');
  } catch (error) {
    console.error('⚠️  ClamAV initialization failed:', error.message);
    console.error('⚠️  Malware scanning will be DISABLED (NOT RECOMMENDED for production)');
  }
})();

// ============================================================================
// Rate Limiting
// ============================================================================

// Global upload rate limiter (per IP)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // 50 requests per window
  message: {
    error: 'Too many upload requests from this IP',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' // Skip health checks
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sanitize filename to prevent security issues
 *
 * Protections:
 * - Path traversal (../)
 * - Dangerous extensions (.php, .exe)
 * - Special characters
 * - Null bytes
 * - Windows reserved names
 * - Length limits
 */
function sanitizeFilename(filename) {
  // Remove any path components
  let safe = path.basename(filename);

  // Remove null bytes
  safe = safe.replace(/\0/g, '');

  // Replace dangerous characters
  safe = safe.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');

  // Remove leading/trailing dots and spaces
  safe = safe.replace(/^[.\s]+|[.\s]+$/g, '');

  // Check for dangerous extensions
  const dangerousExtensions = [
    '.exe', '.com', '.bat', '.cmd', '.sh', '.bash',
    '.js', '.vbs', '.ps1',
    '.php', '.asp', '.jsp', '.cgi', '.py', '.rb', '.pl',
    '.htaccess', '.ini', '.conf'
  ];

  const lowerFilename = safe.toLowerCase();
  for (const ext of dangerousExtensions) {
    if (lowerFilename.includes(ext)) {
      safe = safe.replace(new RegExp(ext.replace('.', '\\.'), 'gi'), '_');
    }
  }

  // Check Windows reserved names
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'LPT1'];
  const baseName = path.basename(safe, path.extname(safe));
  if (reservedNames.includes(baseName.toUpperCase())) {
    safe = `file_${safe}`;
  }

  // Limit length
  if (safe.length > 200) {
    const ext = path.extname(safe);
    const base = safe.substring(0, 200 - ext.length);
    safe = base + ext;
  }

  // Ensure not empty
  if (!safe || safe === '_') {
    safe = 'unnamed_file';
  }

  return safe;
}

/**
 * Verify file type using magic numbers
 */
async function verifyFileType(filePath, expectedTypes) {
  try {
    // Read file header
    const buffer = await fs.readFile(filePath, { start: 0, end: 4100 });

    // Detect actual file type
    const type = await fileType.fromBuffer(buffer);

    if (!type) {
      throw new Error('Could not determine file type');
    }

    // Verify against allowed types
    if (!expectedTypes.includes(type.mime)) {
      throw new Error(`Invalid file type: ${type.mime}`);
    }

    return type;
  } catch (error) {
    throw new Error(`File type verification failed: ${error.message}`);
  }
}

/**
 * Scan file for malware using ClamAV
 */
async function scanFile(filePath) {
  if (!clamscan) {
    console.warn('⚠️  Skipping malware scan (ClamAV not available)');
    return { safe: true, warning: 'Malware scanning disabled' };
  }

  try {
    const { isInfected, viruses, file } = await clamscan.scanFile(filePath);

    if (isInfected) {
      console.error('🦠 Malware detected:', {
        file,
        viruses,
        timestamp: new Date().toISOString()
      });

      return {
        safe: false,
        infected: true,
        viruses
      };
    }

    return {
      safe: true,
      scannedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Malware scan error:', error);
    // Fail secure: reject file if scanning fails
    throw new Error('Unable to scan file for malware');
  }
}

// ============================================================================
// Middleware
// ============================================================================

/**
 * JWT Authentication Middleware
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'No token provided'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, CONFIG.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    });
  }
}

/**
 * Per-User Upload Quota Middleware
 * Limits: 100 uploads per hour per user
 */
const uploadQuotas = new Map(); // In production, use Redis

async function perUserLimiter(req, res, next) {
  if (!req.user) {
    return next();
  }

  const userId = req.user.id;
  const now = Date.now();
  const hourAgo = now - 3600000;

  // Clean old entries
  for (const [key, uploads] of uploadQuotas.entries()) {
    uploadQuotas.set(key, uploads.filter(time => time > hourAgo));
    if (uploadQuotas.get(key).length === 0) {
      uploadQuotas.delete(key);
    }
  }

  // Check user quota
  const userUploads = uploadQuotas.get(userId) || [];
  const recentUploads = userUploads.filter(time => time > hourAgo);

  if (recentUploads.length >= 100) {
    return res.status(429).json({
      error: 'Upload quota exceeded',
      limit: 100,
      window: '1 hour',
      message: 'You have exceeded your upload quota. Please try again later.'
    });
  }

  // Add current upload
  recentUploads.push(now);
  uploadQuotas.set(userId, recentUploads);

  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', Math.max(0, 100 - recentUploads.length));

  next();
}

// ============================================================================
// Routes
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    clamav: clamscan ? 'enabled' : 'disabled'
  });
});

/**
 * File Upload Endpoint
 *
 * Security Features:
 * - Rate limiting (per-IP and per-user)
 * - JWT authentication
 * - File size validation
 * - File type verification (magic numbers)
 * - Filename sanitization
 * - Malware scanning
 * - Secure storage (random filenames, outside webroot)
 */
app.post('/upload',
  uploadLimiter,
  authenticate,
  perUserLimiter,
  upload.single('file'),
  async (req, res) => {
    let uploadedFilePath = null;

    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          error: 'No file provided',
          message: 'Please select a file to upload'
        });
      }

      uploadedFilePath = file.path;

      console.log('📤 Upload started:', {
        user: req.user.id,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });

      // 1. Verify file size (defense in depth)
      if (file.size > CONFIG.maxFileSize) {
        await fs.unlink(uploadedFilePath);
        return res.status(413).json({
          error: 'File too large',
          maxSize: `${(CONFIG.maxFileSize / 1024 / 1024).toFixed(0)}MB`,
          receivedSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        });
      }

      // 2. Verify file type using magic numbers
      console.log('🔍 Verifying file type...');
      const type = await verifyFileType(uploadedFilePath, CONFIG.allowedTypes);

      // 3. Scan for malware
      console.log('🦠 Scanning for malware...');
      const scanResult = await scanFile(uploadedFilePath);

      if (!scanResult.safe) {
        await fs.unlink(uploadedFilePath);
        console.error('🚫 Upload rejected: Malware detected');
        return res.status(400).json({
          error: 'Security threat detected',
          message: 'The uploaded file contains malicious content'
        });
      }

      // 4. Sanitize filename
      const safeName = sanitizeFilename(file.originalname);
      console.log('🔒 Sanitized filename:', {
        original: file.originalname,
        sanitized: safeName
      });

      // 5. Generate random storage name
      const ext = path.extname(safeName);
      const storageName = `${uuid()}-${Date.now()}${ext}`;

      // 6. Create storage directory structure
      const privateDir = path.join(CONFIG.uploadDir, 'private');
      const metadataDir = path.join(CONFIG.uploadDir, 'metadata');

      await fs.mkdir(privateDir, { recursive: true });
      await fs.mkdir(metadataDir, { recursive: true });

      // 7. Move file to secure location
      const securePath = path.join(privateDir, storageName);
      await fs.rename(uploadedFilePath, securePath);
      uploadedFilePath = null; // File moved successfully

      // 8. Set restrictive permissions
      await fs.chmod(securePath, 0o640); // rw-r-----

      // 9. Store metadata
      const metadata = {
        id: storageName,
        originalName: safeName,
        storageName,
        mimeType: type.mime,
        size: file.size,
        userId: req.user.id,
        uploadedAt: new Date().toISOString(),
        scannedAt: scanResult.scannedAt
      };

      const metadataPath = path.join(metadataDir, `${storageName}.json`);
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      console.log('✅ Upload completed:', {
        id: storageName,
        user: req.user.id
      });

      // 10. Return success response
      res.status(201).json({
        success: true,
        file: {
          id: storageName,
          name: safeName,
          size: file.size,
          type: type.mime,
          uploadedAt: metadata.uploadedAt
        }
      });

    } catch (error) {
      console.error('❌ Upload error:', error);

      // Clean up temporary file on error
      if (uploadedFilePath) {
        try {
          await fs.unlink(uploadedFilePath);
        } catch (unlinkError) {
          // File already deleted or doesn't exist
        }
      }

      res.status(500).json({
        error: 'Upload failed',
        message: 'An error occurred while processing your upload'
      });
    }
  }
);

/**
 * File Download Endpoint
 *
 * Security Features:
 * - JWT authentication
 * - Authorization check (user can only download own files)
 * - Filename validation (prevent path traversal)
 * - Secure headers
 */
app.get('/files/:id',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID (prevent path traversal)
      if (id.includes('..') || id.includes('/') || id.includes('\\')) {
        return res.status(400).json({
          error: 'Invalid file ID',
          message: 'The file ID contains invalid characters'
        });
      }

      // Load metadata
      const metadataPath = path.join(CONFIG.uploadDir, 'metadata', `${id}.json`);

      let metadata;
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        return res.status(404).json({
          error: 'File not found',
          message: 'The requested file does not exist'
        });
      }

      // Check authorization
      if (metadata.userId !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You do not have permission to access this file'
        });
      }

      // Get file path
      const filePath = path.join(CONFIG.uploadDir, 'private', id);

      // Check file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({
          error: 'File not found',
          message: 'The file has been deleted or moved'
        });
      }

      console.log('📥 Download started:', {
        id,
        user: req.user.id,
        filename: metadata.originalName
      });

      // Set secure headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Type', metadata.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${metadata.originalName}"`);
      res.setHeader('Content-Length', metadata.size);

      // Stream file
      const stream = require('fs').createReadStream(filePath);

      stream.on('error', (error) => {
        console.error('Download stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
      });

      stream.pipe(res);

    } catch (error) {
      console.error('Download error:', error);

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Download failed',
          message: 'An error occurred while downloading the file'
        });
      }
    }
  }
);

/**
 * File Deletion Endpoint
 *
 * Security Features:
 * - JWT authentication
 * - Authorization check
 */
app.delete('/files/:id',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID
      if (id.includes('..') || id.includes('/') || id.includes('\\')) {
        return res.status(400).json({ error: 'Invalid file ID' });
      }

      // Load metadata
      const metadataPath = path.join(CONFIG.uploadDir, 'metadata', `${id}.json`);
      const metadataContent = await fs.readFile(metadataPath, 'utf8');
      const metadata = JSON.parse(metadataContent);

      // Check authorization
      if (metadata.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Delete file
      const filePath = path.join(CONFIG.uploadDir, 'private', id);
      await fs.unlink(filePath);

      // Delete metadata
      await fs.unlink(metadataPath);

      console.log('🗑️  File deleted:', { id, user: req.user.id });

      res.json({
        success: true,
        message: 'File deleted successfully'
      });

    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Delete failed' });
    }
  }
);

// ============================================================================
// Start Server
// ============================================================================

app.listen(CONFIG.port, async () => {
  // Create upload directories
  await fs.mkdir(path.join(CONFIG.uploadDir, 'private'), { recursive: true });
  await fs.mkdir(path.join(CONFIG.uploadDir, 'metadata'), { recursive: true });

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Secure File Upload Server - Production Ready        ║
╠══════════════════════════════════════════════════════════════╣
║  Server:      http://localhost:${CONFIG.port}                        ║
║  Upload Dir:  ${CONFIG.uploadDir}                    ║
║  Max Size:    ${(CONFIG.maxFileSize / 1024 / 1024).toFixed(0)}MB                                        ║
║  ClamAV:      ${clamscan ? 'Enabled ✅' : 'Disabled ⚠️'}                              ║
╠══════════════════════════════════════════════════════════════╣
║  Endpoints:                                                  ║
║    GET  /health          Health check                       ║
║    POST /upload          Upload file (authenticated)        ║
║    GET  /files/:id       Download file (authenticated)      ║
║    DELETE /files/:id     Delete file (authenticated)        ║
╠══════════════════════════════════════════════════════════════╣
║  Security Features:                                          ║
║    ✅ Magic number verification                              ║
║    ✅ Filename sanitization                                  ║
║    ${clamscan ? '✅' : '⚠️'}  Malware scanning                                    ║
║    ✅ Rate limiting (per-IP and per-user)                    ║
║    ✅ JWT authentication                                     ║
║    ✅ Secure storage (random filenames)                      ║
║    ✅ Security headers (CSP, HSTS, etc.)                     ║
╚══════════════════════════════════════════════════════════════╝
  `);

  if (!clamscan) {
    console.warn(`
⚠️  WARNING: ClamAV is not enabled!
⚠️  Malware scanning is DISABLED.
⚠️  This is NOT recommended for production use.
⚠️
⚠️  To enable malware scanning:
⚠️    sudo apt-get install clamav clamav-daemon
⚠️    sudo freshclam
⚠️    sudo systemctl start clamav-daemon
    `);
  }
});
