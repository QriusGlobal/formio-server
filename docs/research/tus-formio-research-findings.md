# Research Findings: Form.io TUS Component & Cloud Storage Integration

**Research Date**: 2025-09-30
**Agent**: Researcher (Hive Mind Swarm)
**Status**: Complete

## Executive Summary

This document provides comprehensive research findings on Form.io component schema patterns, TUS resumable upload protocol specifications, and cloud storage provider authentication patterns for implementing a production-ready chunked file upload system.

---

## 1. Form.io Component Schema Analysis

### 1.1 Existing Component Structure

**Base Component Properties** (from formio.js):
```typescript
interface ComponentSchema {
  type: string;
  key: string;
  label?: string;
  storage: string; // 'base64' | 's3' | 'azure' | 'url' | 'tus'

  // File-specific properties
  image?: boolean;           // Enable image handling mode
  imageSize?: string;        // Image preview size (default: "200px")
  filePattern?: string;      // Allowed file patterns
  fileMaxSize?: string;      // Maximum file size
  fileMinSize?: string;      // Minimum file size

  // Validation
  validate?: {
    required?: boolean;
    custom?: string;
  };

  // UI properties
  placeholder?: string;
  description?: string;
  tooltip?: string;
  disabled?: boolean;
}
```

### 1.2 Implemented TUS Component Schema

**Location**: `/formio-core/src/experimental/components/tusfile/TusFile.schema.ts`

```typescript
export interface TusFileSchema {
  type: 'tusfile';
  key: string;
  label?: string;

  // TUS Configuration
  storage: 'tus';
  tusEndpoint: string;         // TUS server endpoint URL
  chunkSize: number;            // Upload chunk size (default: 5MB)
  resumable: boolean;           // Enable resumable uploads

  // Upload State
  uploadId?: string;            // TUS upload identifier
  fileUrl?: string;             // Permanent file URL after completion
  uploadProgress?: number;      // Current progress (0-100)

  // File Validation
  maxFileSize: number;          // Maximum file size in bytes
  accept?: string[];            // Allowed MIME types
  multiple?: boolean;           // Allow multiple files

  // Metadata
  metadata?: {
    filename?: string;
    filetype?: string;
    filesize?: number;
    [key: string]: any;
  };
}
```

**Key Insights**:
- Component extends HTML base component for DOM manipulation
- Event-driven architecture with custom events: `tusfile.upload.start`, `tusfile.upload.progress`, `tusfile.upload.complete`, `tusfile.upload.cancel`, `tusfile.upload.error`
- Separates concerns: Core component (formio-core) defines schema and events, React wrapper (formio-react) implements TUS client integration
- Progress tracking built into component state for real-time UI updates

---

## 2. TUS Resumable Upload Protocol

### 2.1 Protocol Specification

**Version**: 1.0.0 (stable)
**Official Spec**: https://tus.io/protocols/resumable-upload
**IETF Standardization**: draft-ietf-httpbis-resumable-upload-09 (in progress)

### 2.2 Core Protocol Features

**Essential Headers**:
```http
# Client → Server (Upload Creation)
POST /files HTTP/1.1
Tus-Resumable: 1.0.0
Upload-Length: 1048576
Upload-Metadata: filename dGVzdC5wZGY=,filetype YXBwbGljYXRpb24vcGRm

# Server → Client (Session URI)
HTTP/1.1 201 Created
Location: https://tus.example.com/files/abc123
Tus-Resumable: 1.0.0

# Client → Server (Upload Chunks)
PATCH /files/abc123 HTTP/1.1
Tus-Resumable: 1.0.0
Upload-Offset: 0
Content-Type: application/offset+octet-stream
Content-Length: 524288

# Server → Client (Progress)
HTTP/1.1 204 No Content
Upload-Offset: 524288
Tus-Resumable: 1.0.0
```

**Protocol Extensions** (supported by @tus/server):
- **Creation**: Initiate uploads with POST
- **Termination**: Delete incomplete uploads with DELETE
- **Checksum**: Verify chunk integrity with SHA1/MD5/CRC32
- **Expiration**: Auto-cleanup of abandoned uploads
- **Concatenation**: Merge parallel chunks

### 2.3 Implementation Analysis

**Client Implementation** (tus-js-client v4.3.1):
```typescript
import * as tus from 'tus-js-client';

const upload = new tus.Upload(file, {
  endpoint: 'https://tusd.example.com/files/',
  chunkSize: 5 * 1024 * 1024,           // 5MB chunks
  retryDelays: [0, 1000, 3000, 5000],   // Exponential backoff
  parallelUploads: 3,                    // Parallel chunk uploads
  storeFingerprintForResuming: true,     // Browser localStorage for resume
  removeFingerprintOnSuccess: true,      // Cleanup after completion

  metadata: {
    filename: file.name,
    filetype: file.type,
    filesize: file.size.toString()
  },

  onProgress: (bytesUploaded, bytesTotal) => {
    const percentage = (bytesUploaded / bytesTotal) * 100;
    console.log(`Progress: ${percentage}%`);
  },

  onSuccess: () => {
    console.log(`Upload URL: ${upload.url}`);
  },

  onError: (error) => {
    console.error('Upload failed:', error);
  }
});

upload.start();
```

**Server Implementation** (@tus/server v1.5.0):
```javascript
const { Server } = require('@tus/server');
const { GCSStore } = require('@tus/gcs-store');

const server = new Server({
  path: '/files',
  datastore: new GCSStore({
    bucket: 'my-bucket',
    chunkSize: 8 * 1024 * 1024,  // 8MB for GCS
    resumable: true,
    validation: 'crc32c'
  }),
  maxSize: 5 * 1024 * 1024 * 1024, // 5GB max

  // Lifecycle hooks
  onUploadCreate: async (req, upload) => {
    // Validate metadata, authentication
    const { formId, fieldName } = upload.metadata;
    if (!formId || !fieldName) {
      throw { status_code: 400, body: 'Missing required metadata' };
    }
  },

  onUploadFinish: async (req, upload) => {
    // Generate permanent URL, update database
    const fileUrl = await generateSignedUrl(upload);
    await saveToDatabase(upload, fileUrl);
  },

  onIncomingRequest: async (req) => {
    // JWT authentication
    const token = req.headers.authorization?.substring(7);
    if (!await validateToken(token)) {
      throw { status_code: 401, body: 'Unauthorized' };
    }
  }
});
```

**Key Implementation Findings**:
- **Dynamic chunk sizing**: Adjust based on file size (1MB for <10MB, 25MB for >1GB)
- **Fingerprinting**: Uses file size + modification time + relative path for resume detection
- **Network error handling**: Automatic retry with exponential backoff
- **Browser storage**: localStorage stores upload URLs for cross-session resume
- **Speed calculation**: Real-time upload speed and ETA tracking

---

## 3. Storage Provider Authentication

### 3.1 Google Cloud Storage (GCS)

**Current Implementation**: `/formio/src/storage/providers/GCSProvider.js`

**Authentication Methods**:

1. **Service Account Key File** (Development):
```javascript
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'my-project',
  keyFilename: '/path/to/service-account-key.json'
});
```

2. **Service Account Credentials Object** (Production):
```javascript
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
});
```

3. **Application Default Credentials** (GCP Environment):
```javascript
// Auto-discovers credentials from:
// - GOOGLE_APPLICATION_CREDENTIALS env var
// - GCE/GKE instance metadata
// - Cloud Run/Cloud Functions environment
const storage = new Storage({
  projectId: 'my-project'
});
```

**Resumable Upload Configuration**:
```javascript
const file = bucket.file('path/to/file.ext');

const uploadStream = file.createWriteStream({
  resumable: true,
  chunkSize: 8 * 1024 * 1024,      // 8MB (GCS recommendation)
  validation: 'crc32c',             // Checksum validation
  metadata: {
    contentType: 'application/pdf',
    cacheControl: 'public, max-age=31536000',
    metadata: { formId: 'abc123' }
  },
  predefinedAcl: 'projectPrivate'  // Access control
});
```

**Signed URLs** (Time-limited access):
```javascript
const [signedUrl] = await file.getSignedUrl({
  version: 'v4',
  action: 'read',                   // or 'write'
  expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  contentType: 'application/pdf'    // For write operations
});

// For resumable uploads: Only POST needs signed URL
// Session URI acts as authentication token for subsequent PUTs
```

**Best Practices**:
- Use service account with minimum required permissions
- Rotate service account keys regularly
- Enable CRC32C validation for data integrity
- Set appropriate bucket lifecycle policies for incomplete uploads
- Use signed URLs for client-side uploads to avoid exposing credentials

### 3.2 AWS S3

**Authentication Methods** (for future implementation):

1. **IAM Credentials**:
```javascript
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
```

2. **IAM Role** (EC2/ECS):
```javascript
// Automatic credential discovery from instance metadata
const s3 = new S3Client({ region: 'us-east-1' });
```

3. **Presigned URLs** (Client-side):
```javascript
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const command = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'path/to/file.ext'
});

const signedUrl = await getSignedUrl(s3, command, {
  expiresIn: 3600  // 1 hour
});
```

**Multipart Upload Process**:
```javascript
// 1. Initiate multipart upload
const { UploadId } = await s3.createMultipartUpload({
  Bucket: 'my-bucket',
  Key: 'large-file.zip',
  ContentType: 'application/zip'
});

// 2. Upload parts (5MB - 5GB each)
const uploadPartPromises = chunks.map((chunk, index) =>
  s3.uploadPart({
    Bucket: 'my-bucket',
    Key: 'large-file.zip',
    PartNumber: index + 1,
    UploadId,
    Body: chunk
  })
);

const parts = await Promise.all(uploadPartPromises);

// 3. Complete multipart upload
await s3.completeMultipartUpload({
  Bucket: 'my-bucket',
  Key: 'large-file.zip',
  UploadId,
  MultipartUpload: {
    Parts: parts.map((part, i) => ({
      ETag: part.ETag,
      PartNumber: i + 1
    }))
  }
});
```

**Security Best Practices** (2025):
- Use AWS Signature Version 4 for all requests
- Enable SSL/TLS for KMS-encrypted objects
- Use session-based authorization for directory buckets (CreateSession API)
- Grant minimum KMS permissions: `kms:Decrypt` and `kms:GenerateDataKey`
- Implement bucket policies and IAM roles over access keys
- Use API Gateway for rate limiting and caching
- Set S3 lifecycle policies to clean up incomplete multipart uploads

### 3.3 Azure Blob Storage

**Authentication Methods** (for future implementation):

1. **Connection String**:
```javascript
const { BlobServiceClient } = require('@azure/storage-blob');

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
```

2. **Microsoft Entra ID (Recommended)**:
```javascript
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential
);
```

3. **Shared Access Signature (SAS)**:
```javascript
const { generateBlobSASQueryParameters } = require('@azure/storage-blob');

const sasToken = generateBlobSASQueryParameters({
  containerName: 'my-container',
  blobName: 'file.ext',
  permissions: 'racwd',     // Read, Add, Create, Write, Delete
  startsOn: new Date(),
  expiresOn: new Date(new Date().getTime() + 3600 * 1000)
}, sharedKeyCredential).toString();
```

**Block Blob Upload** (Chunked):
```javascript
const { BlockBlobClient } = require('@azure/storage-blob');

const blockBlobClient = containerClient.getBlockBlobClient('file.ext');

// 1. Upload blocks (max 4MB each by default)
const blockIds = [];
for (let i = 0; i < chunks.length; i++) {
  const blockId = btoa(`block-${i.toString().padStart(6, '0')}`);
  await blockBlobClient.stageBlock(blockId, chunks[i], chunks[i].length);
  blockIds.push(blockId);
}

// 2. Commit blocks
await blockBlobClient.commitBlockList(blockIds);
```

**Best Practices**:
- Use Microsoft Entra ID with managed identities over Shared Key
- Implement Azure RBAC for fine-grained permissions
- Use SAS tokens with minimal permissions and short expiration
- Enable blob versioning and soft delete for data protection
- Set appropriate lifecycle management policies
- Use Premium block blobs for high-performance scenarios

---

## 4. Implementation Patterns from Real-World Usage

### 4.1 GitHub Code Analysis (tus-js-client usage)

**Common Patterns**:

1. **Supabase Integration**:
```typescript
const upload = new tus.Upload(file, {
  endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
  headers: {
    authorization: `Bearer ${session.access_token}`,
    'x-upsert': 'true'  // Overwrite existing files
  },
  metadata: {
    bucketName: 'avatars',
    objectName: file.name,
    contentType: file.type
  }
});
```

2. **Progress Tracking with Speed**:
```typescript
let lastProgressTime = Date.now();
let lastProgressBytes = 0;

upload.options.onProgress = (bytesUploaded, bytesTotal) => {
  const now = Date.now();
  const timeDiff = (now - lastProgressTime) / 1000; // seconds
  const bytesDiff = bytesUploaded - lastProgressBytes;

  const speed = bytesDiff / timeDiff; // bytes per second
  const remaining = bytesTotal - bytesUploaded;
  const eta = remaining / speed; // seconds

  lastProgressTime = now;
  lastProgressBytes = bytesUploaded;

  updateUI({ bytesUploaded, bytesTotal, speed, eta });
};
```

3. **Parallel Chunk Uploads**:
```typescript
const upload = new tus.Upload(file, {
  endpoint: '/upload/resumable',
  chunkSize: 2 * 1024 * 1024,    // 2MB chunks
  parallelUploads: 3,              // Upload 3 chunks simultaneously
  parallelUploadBoundaries: [
    0,                              // Start of file
    file.size * 0.33,              // 33% mark
    file.size * 0.66               // 66% mark
  ]
});
```

4. **Error Recovery**:
```typescript
upload.options.onShouldRetry = (err, retryAttempt, options) => {
  const status = err.originalResponse?.getStatus();

  // Retry on network errors or 5xx responses
  if (!status || status >= 500) {
    return retryAttempt < options.retryDelays.length;
  }

  // Don't retry on client errors (4xx)
  if (status >= 400 && status < 500) {
    return false;
  }

  return true;
};
```

### 4.2 TUS Server Implementation Patterns

**Custom Validation**:
```javascript
server.on(EVENTS.POST_CREATE, async (req, res, upload) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const fileType = upload.metadata.filetype;

  if (!allowedTypes.includes(fileType)) {
    throw {
      status_code: 400,
      body: `File type ${fileType} not allowed`
    };
  }

  // Validate file size
  if (upload.size > 50 * 1024 * 1024) {
    throw {
      status_code: 413,
      body: 'File size exceeds 50MB limit'
    };
  }
});
```

**Progress Tracking**:
```javascript
server.on(EVENTS.POST_RECEIVE, (req, upload) => {
  const progress = (upload.offset / upload.size) * 100;

  // Update database or notify via WebSocket
  updateUploadProgress(upload.id, {
    bytesUploaded: upload.offset,
    bytesTotal: upload.size,
    percentage: Math.round(progress)
  });
});
```

**Completion Handling**:
```javascript
server.on(EVENTS.POST_FINISH, async (req, res, upload) => {
  // Generate permanent file URL
  const fileUrl = await gcsProvider.getSignedUrl(upload.storage.path, {
    action: 'read',
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000  // 1 year
  });

  // Update Form.io submission
  await updateSubmission(upload.metadata.submissionId, {
    [upload.metadata.fieldName]: {
      name: upload.metadata.filename,
      size: upload.size,
      type: upload.metadata.filetype,
      url: fileUrl,
      storage: 'gcs',
      uploadId: upload.id
    }
  });

  // Send notification
  await notifyUploadComplete(upload);
});
```

---

## 5. Recommendations for Implementation

### 5.1 Component Architecture

**Separation of Concerns**:
```
formio-core (Schema + Events)
    ↓
formio-react (TUS Client Integration)
    ↓
Backend Server (TUS Protocol + Storage Provider)
```

### 5.2 Configuration Strategy

```typescript
interface TusComponentConfig {
  // TUS Protocol
  tusEndpoint: string;
  chunkSize?: number;              // Default: dynamic (1MB - 25MB)
  retryDelays?: number[];          // Default: [0, 1000, 3000, 5000, 10000]
  parallelUploads?: number;        // Default: 3

  // Storage Provider
  storageProvider: 'gcs' | 's3' | 'azure';
  storageConfig: {
    bucket: string;
    region?: string;
    credentials?: any;
  };

  // Validation
  maxFileSize: number;             // In bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];

  // Security
  authentication: 'jwt' | 'signed-url' | 'api-key';
  tokenExpiration?: number;        // In seconds

  // Features
  enablePauseResume: boolean;
  enableCancellation: boolean;
  enableRetry: boolean;
  showSpeedAndEta: boolean;
  showProgressBar: boolean;
}
```

### 5.3 Error Handling Strategy

**Client-Side**:
```typescript
enum UploadErrorType {
  NETWORK_ERROR = 'network_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  VALIDATION_ERROR = 'validation_error',
  SERVER_ERROR = 'server_error',
  TIMEOUT_ERROR = 'timeout_error',
  QUOTA_EXCEEDED = 'quota_exceeded',
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_FILE_TYPE = 'invalid_file_type'
}

interface UploadError {
  type: UploadErrorType;
  message: string;
  originalError: Error;
  retryable: boolean;
  retryAfter?: number;  // Seconds
}
```

**Server-Side**:
```javascript
class TusUploadError extends Error {
  constructor(statusCode, message, retryable = false) {
    super(message);
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}

// Usage
if (!isAuthenticated) {
  throw new TusUploadError(401, 'Invalid authentication token', false);
}

if (upload.size > MAX_FILE_SIZE) {
  throw new TusUploadError(413, 'File size exceeds maximum allowed', false);
}

if (storageQuotaExceeded) {
  throw new TusUploadError(507, 'Storage quota exceeded', false);
}
```

### 5.4 Performance Optimization

**Dynamic Chunk Sizing**:
```javascript
function calculateOptimalChunkSize(fileSize) {
  if (fileSize < 10 * MB) return 1 * MB;
  if (fileSize < 100 * MB) return 5 * MB;
  if (fileSize < 1 * GB) return 10 * MB;
  return 25 * MB;
}
```

**Network Condition Adaptation**:
```javascript
let consecutiveFailures = 0;

upload.options.onError = (error) => {
  if (isNetworkError(error)) {
    consecutiveFailures++;

    if (consecutiveFailures >= 3) {
      // Reduce chunk size on persistent network issues
      const currentChunkSize = upload.options.chunkSize;
      upload.options.chunkSize = Math.max(
        1 * MB,
        currentChunkSize * 0.5
      );
    }
  }
};

upload.options.onProgress = () => {
  // Reset on successful progress
  consecutiveFailures = 0;
};
```

**Connection Pooling** (Server-side):
```javascript
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'my-project',
  // Connection pooling for high-concurrency scenarios
  retryOptions: {
    autoRetry: true,
    maxRetries: 3,
    retryDelayMultiplier: 2
  }
});
```

### 5.5 Security Considerations

**Input Validation**:
```javascript
// Filename sanitization
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')  // Replace special chars
    .replace(/\.{2,}/g, '.')           // Remove consecutive dots
    .substring(0, 255);                // Limit length
}

// File type validation (content-based, not extension)
const { fileTypeFromBuffer } = require('file-type');

async function validateFileType(buffer, allowedTypes) {
  const detectedType = await fileTypeFromBuffer(buffer);

  if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
    throw new Error('Invalid file type');
  }

  return detectedType;
}
```

**Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // 10 uploads per window
  message: 'Too many uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/upload', uploadLimiter);
```

**Content Security**:
```javascript
// Virus scanning integration (example with ClamAV)
const NodeClam = require('clamscan');

const scanner = new NodeClam().init({
  clamdscan: {
    socket: '/var/run/clamav/clamd.sock',
    timeout: 300000  // 5 minutes
  }
});

server.on(EVENTS.POST_FINISH, async (req, res, upload) => {
  const { file, isInfected, viruses } = await scanner.scanFile(upload.storage.path);

  if (isInfected) {
    await deleteFile(upload.storage.path);
    throw new TusUploadError(400, `Virus detected: ${viruses.join(', ')}`, false);
  }
});
```

---

## 6. Testing Recommendations

### 6.1 Unit Tests

**Component Tests**:
```typescript
describe('TusFile Component', () => {
  it('should validate file size', () => {
    const component = new TusFile({
      maxFileSize: 10 * 1024 * 1024  // 10MB
    });

    const largeFile = new File([], 'large.pdf', {
      type: 'application/pdf',
      size: 20 * 1024 * 1024  // 20MB
    });

    expect(() => component.validateFile(largeFile))
      .toThrow('File size exceeds maximum allowed');
  });

  it('should emit progress events', (done) => {
    const component = new TusFile();

    component.on('tusfile.upload.progress', (data) => {
      expect(data).toHaveProperty('percentage');
      expect(data.percentage).toBeGreaterThan(0);
      done();
    });

    component.startUpload(mockFile);
  });
});
```

### 6.2 Integration Tests

**TUS Protocol Tests**:
```javascript
describe('TUS Server Integration', () => {
  it('should handle resumable upload', async () => {
    // 1. Create upload
    const createRes = await request(app)
      .post('/files')
      .set('Tus-Resumable', '1.0.0')
      .set('Upload-Length', '1048576')
      .set('Upload-Metadata', 'filename dGVzdC5wZGY=')
      .expect(201);

    const uploadUrl = createRes.headers.location;

    // 2. Upload first chunk
    await request(app)
      .patch(uploadUrl)
      .set('Tus-Resumable', '1.0.0')
      .set('Upload-Offset', '0')
      .set('Content-Type', 'application/offset+octet-stream')
      .send(chunk1)
      .expect(204);

    // 3. Simulate disconnection and resume
    await request(app)
      .patch(uploadUrl)
      .set('Tus-Resumable', '1.0.0')
      .set('Upload-Offset', '524288')  // Resume from 512KB
      .set('Content-Type', 'application/offset+octet-stream')
      .send(chunk2)
      .expect(204);
  });
});
```

### 6.3 E2E Tests (Playwright)

**Upload Flow Tests**:
```typescript
test('should upload file with progress tracking', async ({ page }) => {
  await page.goto('/form');

  // Select file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-file.pdf');

  // Wait for upload to start
  await page.waitForSelector('.tus-progress-bar');

  // Verify progress updates
  const progressBar = page.locator('.tus-progress-fill');
  await expect(progressBar).toHaveCSS('width', /\d+px/);

  // Wait for completion
  await page.waitForSelector('.tus-file-status-text:has-text("Completed")');

  // Verify file URL is stored
  const hiddenInput = page.locator('input[type="hidden"]');
  const fileUrl = await hiddenInput.inputValue();
  expect(fileUrl).toMatch(/^https:\/\//);
});
```

---

## 7. Monitoring and Observability

### 7.1 Metrics to Track

**Client-Side**:
- Upload success rate
- Average upload time by file size
- Retry count per upload
- Network error frequency
- Browser/device distribution

**Server-Side**:
- Active uploads count
- Upload completion rate
- Average chunk size
- Storage provider response times
- Error rate by error type
- Expired uploads cleaned up
- Storage quota usage

### 7.2 Logging Strategy

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    service: 'tus-upload-server'
  },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Structured logging
logger.info('Upload created', {
  uploadId: upload.id,
  fileSize: upload.size,
  fileName: upload.metadata.filename,
  userId: req.user.id,
  formId: upload.metadata.formId
});

logger.error('Upload failed', {
  uploadId: upload.id,
  error: error.message,
  stack: error.stack,
  retryable: error.retryable
});
```

---

## 8. Migration Path from Existing File Component

### 8.1 Backward Compatibility

**Support Multiple Storage Types**:
```typescript
interface FileComponentSchema {
  type: 'file';
  storage: 'base64' | 's3' | 'azure' | 'tus';

  // Storage-specific configs
  tusConfig?: TusComponentConfig;
  s3Config?: S3ComponentConfig;
  azureConfig?: AzureComponentConfig;
}
```

### 8.2 Data Migration

**Submission Data Structure**:
```json
{
  "fileField": [
    {
      "name": "document.pdf",
      "size": 1048576,
      "type": "application/pdf",
      "storage": "tus",
      "url": "https://storage.googleapis.com/bucket/path/to/file.pdf",
      "uploadId": "tus-abc123",
      "completedAt": "2025-09-30T12:00:00Z"
    }
  ]
}
```

---

## 9. Documentation Requirements

### 9.1 User Documentation

1. **Component Configuration Guide**
   - How to add TUS file component to forms
   - Configuration options and defaults
   - Validation rules setup

2. **Storage Provider Setup**
   - GCS bucket creation and configuration
   - Service account setup and permissions
   - S3/Azure alternative setup (future)

3. **Troubleshooting Guide**
   - Common error messages and solutions
   - Network connectivity issues
   - Permission problems

### 9.2 Developer Documentation

1. **API Reference**
   - Component schema specification
   - Event handlers and callbacks
   - Server-side hooks

2. **Integration Guide**
   - Backend server setup
   - TUS server configuration
   - Storage provider integration

3. **Security Guide**
   - Authentication setup
   - Authorization patterns
   - Input validation

---

## 10. References

### Official Documentation
- **TUS Protocol**: https://tus.io/protocols/resumable-upload
- **tus-js-client**: https://github.com/tus/tus-js-client
- **@tus/server**: https://github.com/tus/tus-node-server
- **Form.io JS**: https://github.com/formio/formio.js
- **GCS Documentation**: https://cloud.google.com/storage/docs
- **AWS S3 API**: https://docs.aws.amazon.com/AmazonS3/latest/API/
- **Azure Blob Storage**: https://learn.microsoft.com/en-us/azure/storage/blobs/

### Code Examples
- **Supabase Storage**: https://github.com/supabase/storage (TUS integration)
- **FileBrowser**: https://github.com/filebrowser/filebrowser (TUS client)
- **Papermark**: https://github.com/mfts/papermark (TUS + Next.js)
- **Midday**: https://github.com/midday-ai/midday (TUS + Supabase)

### Related Projects
- **Uppy**: https://uppy.io/ (Alternative file uploader with TUS)
- **tusd**: https://github.com/tus/tusd (Reference TUS server in Go)
- **tus-php-server**: https://github.com/ankitpokhrel/tus-php (PHP implementation)

---

**End of Research Report**

**Status**: Research phase complete. Ready for planner to create implementation plan.
**Coordination Memory Key**: `swarm/researcher/findings`