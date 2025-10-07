# Server-Side Validation Guide

**Purpose:** Complete server-side implementation examples for secure file upload handling.

**⚠️ CRITICAL:** Client-side validation alone is NOT sufficient. All security checks MUST be re-implemented server-side.

---

## Table of Contents

1. [Node.js/Express Implementation](#nodejs-express-implementation)
2. [File Type Re-Verification](#file-type-re-verification)
3. [Malware Scanning Integration](#malware-scanning-integration)
4. [Rate Limiting](#rate-limiting)
5. [Storage Security](#storage-security)
6. [Authentication Examples](#authentication-examples)
7. [Complete Production Example](#complete-production-example)

---

## Node.js/Express Implementation

### Basic Upload Handler with Security

```javascript
const express = require('express');
const multer = require('multer');
const fileType = require('file-type');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();

// Configure multer for temporary uploads
const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    fileSize: 50 * 1024 * 1024,  // 50MB
    files: 10                     // Max 10 files
  }
});

// Filename sanitization (import from client package or re-implement)
function sanitizeFilename(filename) {
  // Remove path components
  let safe = path.basename(filename);

  // Remove null bytes
  safe = safe.replace(/\0/g, '');

  // Replace dangerous characters
  safe = safe.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');

  // Remove leading/trailing dots and spaces
  safe = safe.replace(/^[.\s]+|[.\s]+$/g, '');

  // Limit length
  if (safe.length > 200) {
    const ext = path.extname(safe);
    safe = safe.substring(0, 200 - ext.length) + ext;
  }

  return safe || 'unnamed_file';
}

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Verify file size (defense in depth)
    if (file.size > 50 * 1024 * 1024) {
      await fs.unlink(file.path);
      return res.status(413).json({
        error: 'File too large',
        maxSize: '50MB'
      });
    }

    // 2. Verify file type using magic numbers
    const buffer = await fs.readFile(file.path, { start: 0, end: 4100 });
    const type = await fileType.fromBuffer(buffer);

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];

    if (!type || !allowedTypes.includes(type.mime)) {
      await fs.unlink(file.path);
      return res.status(415).json({
        error: 'Invalid file type',
        allowed: allowedTypes
      });
    }

    // 3. Sanitize filename
    const safeName = sanitizeFilename(file.originalname);

    // 4. Generate random storage name
    const ext = path.extname(safeName);
    const storageName = `${uuid()}-${Date.now()}${ext}`;

    // 5. Move to secure location (outside webroot)
    const uploadDir = '/var/uploads';
    const securePath = path.join(uploadDir, storageName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.rename(file.path, securePath);

    // 6. Set restrictive permissions
    await fs.chmod(securePath, 0o640);  // rw-r-----

    // 7. TODO: Scan for malware (see below)

    res.json({
      success: true,
      filename: safeName,
      url: `/files/${storageName}`,
      size: file.size,
      type: type.mime
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Clean up on error
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        // File already deleted or doesn't exist
      }
    }

    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Secure file download
app.get('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    // Validate filename (prevent path traversal)
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join('/var/uploads', filename);

    // Check file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    // Verify file type before serving
    const buffer = await fs.readFile(filePath, { start: 0, end: 4100 });
    const type = await fileType.fromBuffer(buffer);

    // Set secure headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', type?.mime || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment');

    // Stream file
    const stream = require('fs').createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

app.listen(3000, () => {
  console.log('Upload server running on port 3000');
});
```

---

## File Type Re-Verification

### Using file-type Package

```javascript
const fileType = require('file-type');

async function verifyFileType(filePath, expectedTypes) {
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
}

// Usage
try {
  const type = await verifyFileType(
    '/tmp/upload.jpg',
    ['image/jpeg', 'image/png']
  );
  console.log('Valid file type:', type.mime);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### File Signature Database

```javascript
// Manual magic number verification
const FILE_SIGNATURES = {
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF]
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],  // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]   // GIF89a
  ],
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46]  // %PDF
  ],
  'application/zip': [
    [0x50, 0x4B, 0x03, 0x04],  // PK..
    [0x50, 0x4B, 0x05, 0x06]   // PK..
  ]
};

async function verifyMagicNumbers(filePath, expectedType) {
  const signatures = FILE_SIGNATURES[expectedType];

  if (!signatures) {
    throw new Error(`No signature defined for ${expectedType}`);
  }

  // Read first 12 bytes
  const buffer = await fs.readFile(filePath, { start: 0, end: 12 });
  const bytes = new Uint8Array(buffer);

  // Check if any signature matches
  const matches = signatures.some(signature =>
    signature.every((byte, index) => bytes[index] === byte)
  );

  if (!matches) {
    throw new Error(`File signature does not match ${expectedType}`);
  }

  return true;
}
```

---

## Malware Scanning Integration

### ClamAV Installation

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install clamav clamav-daemon

# macOS
brew install clamav

# Update virus definitions
sudo freshclam

# Start daemon
sudo systemctl start clamav-daemon
```

### Node.js Integration

```javascript
const NodeClam = require('clamscan');

// Initialize scanner
const clamscan = await new NodeClam().init({
  removeInfected: false,  // Don't auto-delete
  quarantineInfected: false,
  scanLog: '/var/log/clamav/scan.log',
  debugMode: false,
  clamdscan: {
    socket: '/var/run/clamav/clamd.ctl',  // Unix socket
    timeout: 120000,  // 2 minutes
    localFallback: true
  }
});

// Scan file
async function scanFile(filePath) {
  try {
    const { isInfected, viruses, file } = await clamscan.scanFile(filePath);

    if (isInfected) {
      console.error('Malware detected:', {
        file,
        viruses,
        timestamp: new Date().toISOString()
      });

      // Delete infected file
      await fs.unlink(filePath);

      return {
        safe: false,
        viruses,
        action: 'deleted'
      };
    }

    return {
      safe: true,
      scannedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Scan error:', error);

    // Fail secure: reject file if scanning fails
    throw new Error('Unable to scan file for malware');
  }
}

// Usage in upload handler
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    // ... validation checks ...

    // Scan for malware
    const scanResult = await scanFile(file.path);

    if (!scanResult.safe) {
      return res.status(400).json({
        error: 'Malware detected',
        details: 'File contains malicious content'
      });
    }

    // ... continue with storage ...

  } catch (error) {
    // Cleanup on error
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({ error: error.message });
  }
});
```

### Alternative: VirusTotal API

```javascript
const axios = require('axios');
const FormData = require('form-data');

async function scanWithVirusTotal(filePath) {
  const form = new FormData();
  form.append('file', require('fs').createReadStream(filePath));

  // Upload file
  const uploadRes = await axios.post(
    'https://www.virustotal.com/api/v3/files',
    form,
    {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY,
        ...form.getHeaders()
      }
    }
  );

  const analysisId = uploadRes.data.data.id;

  // Wait for analysis
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Get results
  const resultRes = await axios.get(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY }
    }
  );

  const stats = resultRes.data.data.attributes.stats;

  return {
    safe: stats.malicious === 0,
    malicious: stats.malicious,
    suspicious: stats.suspicious,
    undetected: stats.undetected,
    harmless: stats.harmless
  };
}
```

---

## Rate Limiting

### Express Rate Limiter

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Global upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50,                    // 50 requests per window
  message: 'Too many upload requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redis,
    prefix: 'rl:upload:'
  })
});

// Per-user upload limiter
async function perUserLimiter(req, res, next) {
  if (!req.user) {
    return next();
  }

  const userId = req.user.id;
  const key = `upload_count:${userId}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600);  // 1 hour window
  }

  if (count > 100) {  // 100 uploads per hour
    const ttl = await redis.ttl(key);
    return res.status(429).json({
      error: 'Upload quota exceeded',
      retryAfter: ttl,
      limit: 100,
      window: '1 hour'
    });
  }

  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', Math.max(0, 100 - count));

  next();
}

// Apply to routes
app.post('/upload',
  uploadLimiter,
  authenticate,
  perUserLimiter,
  upload.single('file'),
  uploadHandler
);
```

### Size-Based Rate Limiting

```javascript
// Track total bytes uploaded per user
async function bytesLimiter(req, res, next) {
  if (!req.user) {
    return next();
  }

  const userId = req.user.id;
  const fileSize = parseInt(req.headers['content-length'] || '0');

  const key = `upload_bytes:${userId}`;
  const totalBytes = await redis.incrby(key, fileSize);

  if (totalBytes === fileSize) {
    await redis.expire(key, 86400);  // 24 hours
  }

  const maxBytes = 5 * 1024 * 1024 * 1024;  // 5GB per day

  if (totalBytes > maxBytes) {
    return res.status(429).json({
      error: 'Daily upload quota exceeded',
      limit: '5GB per day',
      used: `${(totalBytes / 1024 / 1024 / 1024).toFixed(2)}GB`
    });
  }

  next();
}
```

---

## Storage Security

### Secure File Storage Pattern

```javascript
const path = require('path');
const { v4: uuid } = require('uuid');
const fs = require('fs').promises;

class SecureFileStorage {
  constructor(options = {}) {
    this.baseDir = options.baseDir || '/var/uploads';
    this.publicDir = path.join(this.baseDir, 'public');
    this.privateDir = path.join(this.baseDir, 'private');
  }

  async initialize() {
    // Create directories
    await fs.mkdir(this.publicDir, { recursive: true });
    await fs.mkdir(this.privateDir, { recursive: true });

    // Set permissions (owner only)
    await fs.chmod(this.privateDir, 0o700);
  }

  async storeFile(filePath, options = {}) {
    const {
      isPublic = false,
      userId,
      metadata = {}
    } = options;

    // Generate random filename
    const ext = path.extname(filePath);
    const filename = `${uuid()}-${Date.now()}${ext}`;

    // Determine storage location
    const targetDir = isPublic ? this.publicDir : this.privateDir;
    const targetPath = path.join(targetDir, filename);

    // Move file
    await fs.rename(filePath, targetPath);

    // Set restrictive permissions
    await fs.chmod(targetPath, isPublic ? 0o644 : 0o640);

    // Store metadata
    await this.storeMetadata(filename, {
      ...metadata,
      userId,
      uploadedAt: new Date().toISOString(),
      isPublic
    });

    return {
      filename,
      path: targetPath,
      url: isPublic ? `/files/${filename}` : null
    };
  }

  async storeMetadata(filename, metadata) {
    const metaPath = path.join(this.baseDir, 'metadata', `${filename}.json`);
    await fs.mkdir(path.dirname(metaPath), { recursive: true });
    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));
  }

  async getFile(filename, userId) {
    // Load metadata
    const metaPath = path.join(this.baseDir, 'metadata', `${filename}.json`);
    const metadata = JSON.parse(await fs.readFile(metaPath, 'utf8'));

    // Check authorization
    if (!metadata.isPublic && metadata.userId !== userId) {
      throw new Error('Unauthorized access');
    }

    // Determine file location
    const fileDir = metadata.isPublic ? this.publicDir : this.privateDir;
    const filePath = path.join(fileDir, filename);

    return {
      path: filePath,
      metadata
    };
  }

  async deleteFile(filename, userId) {
    const { path: filePath, metadata } = await this.getFile(filename, userId);

    // Delete file
    await fs.unlink(filePath);

    // Delete metadata
    const metaPath = path.join(this.baseDir, 'metadata', `${filename}.json`);
    await fs.unlink(metaPath);
  }
}

// Usage
const storage = new SecureFileStorage({
  baseDir: '/var/uploads'
});

await storage.initialize();

const result = await storage.storeFile('/tmp/upload.jpg', {
  isPublic: false,
  userId: req.user.id,
  metadata: {
    originalName: 'vacation.jpg',
    mimeType: 'image/jpeg',
    size: 2048576
  }
});
```

---

## Authentication Examples

### JWT Token Verification

```javascript
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      message: error.message
    });
  }
}

app.post('/upload', authenticate, uploadHandler);
```

### Form.io Permission Integration

```javascript
async function checkFormioPermission(req, res, next) {
  const { formId } = req.params;
  const { user } = req;

  try {
    // Load form from Form.io
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check submission.create permission
    const hasPermission = form.access.some(access => {
      if (access.type !== 'create_all' && access.type !== 'create_own') {
        return false;
      }

      return access.roles.some(roleId =>
        user.roles.includes(roleId)
      );
    });

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Permission denied',
        message: 'You do not have permission to upload files to this form'
      });
    }

    req.form = form;
    next();

  } catch (error) {
    console.error('Permission check failed:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
}

app.post('/form/:formId/upload',
  authenticate,
  checkFormioPermission,
  uploadHandler
);
```

---

## Complete Production Example

```javascript
const express = require('express');
const multer = require('multer');
const fileType = require('file-type');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const NodeClam = require('clamscan');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"]
    }
  }
}));

// Configure multer
const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 10
  }
});

// Initialize ClamAV
let clamscan;
(async () => {
  clamscan = await new NodeClam().init({
    clamdscan: {
      socket: '/var/run/clamav/clamd.ctl',
      timeout: 120000
    }
  });
})();

// Rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many uploads'
});

// Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function sanitizeFilename(filename) {
  let safe = path.basename(filename);
  safe = safe.replace(/\0/g, '');
  safe = safe.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
  safe = safe.replace(/^[.\s]+|[.\s]+$/g, '');

  if (safe.length > 200) {
    const ext = path.extname(safe);
    safe = safe.substring(0, 200 - ext.length) + ext;
  }

  return safe || 'unnamed_file';
}

// Upload endpoint
app.post('/upload',
  uploadLimiter,
  authenticate,
  upload.single('file'),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file' });
      }

      // Verify size
      if (file.size > 50 * 1024 * 1024) {
        await fs.unlink(file.path);
        return res.status(413).json({ error: 'File too large' });
      }

      // Verify type
      const buffer = await fs.readFile(file.path, { start: 0, end: 4100 });
      const type = await fileType.fromBuffer(buffer);

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!type || !allowedTypes.includes(type.mime)) {
        await fs.unlink(file.path);
        return res.status(415).json({ error: 'Invalid file type' });
      }

      // Scan for malware
      const { isInfected, viruses } = await clamscan.scanFile(file.path);
      if (isInfected) {
        await fs.unlink(file.path);
        console.error('Malware detected:', viruses);
        return res.status(400).json({ error: 'Malware detected' });
      }

      // Sanitize and store
      const safeName = sanitizeFilename(file.originalname);
      const ext = path.extname(safeName);
      const storageName = `${uuid()}-${Date.now()}${ext}`;
      const uploadDir = '/var/uploads/private';
      const securePath = path.join(uploadDir, storageName);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.rename(file.path, securePath);
      await fs.chmod(securePath, 0o640);

      // Store metadata
      const metaPath = path.join('/var/uploads/metadata', `${storageName}.json`);
      await fs.mkdir(path.dirname(metaPath), { recursive: true });
      await fs.writeFile(metaPath, JSON.stringify({
        originalName: safeName,
        storageName,
        mimeType: type.mime,
        size: file.size,
        userId: req.user.id,
        uploadedAt: new Date().toISOString()
      }, null, 2));

      res.json({
        success: true,
        filename: safeName,
        id: storageName,
        size: file.size,
        type: type.mime
      });

    } catch (error) {
      console.error('Upload error:', error);

      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

// Download endpoint
app.get('/files/:id',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID
      if (id.includes('..') || id.includes('/')) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      // Load metadata
      const metaPath = path.join('/var/uploads/metadata', `${id}.json`);
      const metadata = JSON.parse(await fs.readFile(metaPath, 'utf8'));

      // Check authorization
      if (metadata.userId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const filePath = path.join('/var/uploads/private', id);

      // Set secure headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Type', metadata.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${metadata.originalName}"`);

      // Stream file
      require('fs').createReadStream(filePath).pipe(res);

    } catch (error) {
      console.error('Download error:', error);
      res.status(404).json({ error: 'File not found' });
    }
  }
);

app.listen(3000, () => {
  console.log('Secure upload server running on port 3000');
});
```

---

## Testing

### Security Test Suite

```bash
# Test file type spoofing
echo "<?php system(\$_GET['cmd']); ?>" > malware.jpg
curl -F "file=@malware.jpg" http://localhost:3000/upload
# Expected: 415 Invalid file type

# Test path traversal
curl -F "file=@test.pdf" http://localhost:3000/upload?filename=../../../etc/passwd
# Expected: Filename sanitized

# Test double extension
cp test.pdf shell.php.pdf
curl -F "file=@shell.php.pdf" http://localhost:3000/upload
# Expected: Extension blocked

# Test rate limiting
for i in {1..60}; do
  curl -F "file=@test.jpg" http://localhost:3000/upload &
done
# Expected: 429 Too many requests after 50
```

---

**Last Updated:** 2025-10-06
**Maintained By:** Form.io Security Team
**Classification:** INTERNAL USE ONLY
