# File Upload Developer Guide

**Version:** 1.0.0
**Last Updated:** September 30, 2025
**Audience:** Developers implementing file upload functionality

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development Setup](#local-development-setup)
3. [Component Usage](#component-usage)
4. [Configuration](#configuration)
5. [Testing Locally](#testing-locally)
6. [API Integration](#api-integration)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Examples](#examples)

---

## Quick Start

### Prerequisites

- Node.js ≥20.0.0
- Docker & Docker Compose
- Git
- pnpm (recommended) or npm

### 5-Minute Setup

```bash
# 1. Clone and enter the monorepo
cd formio-monorepo

# 2. Start all services
make -f Makefile.local local-up

# 3. Verify services are running
make -f Makefile.local verify-services

# 4. Start test app
cd test-app && npm run dev

# 5. Open browser
open http://localhost:64849
```

Your development environment is ready! 🎉

---

## Local Development Setup

### Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Test App (React + Vite)                    │
│  http://localhost:64849                     │
│  - File upload UI                           │
│  - Form rendering                           │
│  - Service connectivity tests               │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  Form.io Server (Express)                   │
│  http://localhost:3001                      │
│  - API endpoints                            │
│  - File upload handlers                     │
│  - Authentication                           │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  GCS Emulator (fake-gcs-server)             │
│  http://localhost:4443                      │
│  - S3-compatible API                        │
│  - Local file storage                       │
│  - Bucket: local-formio-uploads             │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│  MongoDB (v6.0)                             │
│  mongodb://localhost:27017/formioapp        │
│  - Form definitions                         │
│  - Submissions                              │
│  - File metadata                            │
└─────────────────────────────────────────────┘
```

### Start Services

```bash
# Start all services in background
make -f Makefile.local local-up

# Check service health
make -f Makefile.local verify-services

# View logs (all services)
make -f Makefile.local local-logs

# View Form.io server logs only
make -f Makefile.local local-logs-formio

# Stop services (keeps data)
make -f Makefile.local local-down

# Reset everything (deletes data)
make -f Makefile.local local-reset
```

### Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Test App** | http://localhost:64849 | N/A |
| **Form.io Portal** | http://localhost:3001 | admin@local.test / admin123 |
| **Form.io API** | http://localhost:3001/health | JWT required |
| **GCS Emulator** | http://localhost:4443 | N/A (local access) |
| **MongoDB** | mongodb://localhost:27017 | N/A (no auth in dev) |

---

## Component Usage

### Using TusFileUpload in React

#### Basic Usage

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const MyForm: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <form>
      <h2>Upload Documents</h2>

      <TusFileUpload
        formId="65abc111def1111111abcdef"
        submissionId="65abc222def2222222abcdef"
        fieldName="documentUpload"
        options={{
          maxFileSize: 50 * 1024 * 1024, // 50MB
          allowedTypes: ['pdf', 'doc', 'docx'],
          multiple: true,
          resumable: true
        }}
        onComplete={(files) => {
          console.log('Upload complete:', files);
          setUploadedFiles(files);
        }}
        onProgress={(progress) => {
          console.log('Upload progress:', progress);
        }}
        onError={(error) => {
          console.error('Upload error:', error);
        }}
      />

      <button type="submit">Submit Form</button>
    </form>
  );
};
```

#### With Custom Configuration

```tsx
<TusFileUpload
  formId={formId}
  submissionId={submissionId}
  fieldName="photos"
  options={{
    // File restrictions
    maxFileSize: 10 * 1024 * 1024,       // 10MB per file
    maxTotalSize: 50 * 1024 * 1024,      // 50MB total
    maxFiles: 5,                          // Max 5 files
    allowedTypes: ['image/*'],            // Only images

    // Upload behavior
    multiple: true,                       // Allow multiple files
    resumable: true,                      // Enable resumable uploads
    chunkSize: 5 * 1024 * 1024,          // 5MB chunks

    // UI customization
    showProgressBar: true,
    showPreview: true,
    theme: 'dark',

    // Advanced options
    retryDelays: [0, 1000, 3000, 5000],  // Retry delays
    removeFingerprintOnSuccess: false,    // Keep fingerprint for resume
  }}
  onComplete={(files) => {
    // Handle completed uploads
    console.log('Uploaded files:', files);
  }}
  onProgress={(progress) => {
    // Update progress UI
    console.log(`${progress.percentage}% complete`);
  }}
  onError={(error) => {
    // Handle errors
    console.error('Upload failed:', error);
  }}
/>
```

#### Handling Upload State

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const UploadWithState: React.FC = () => {
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    progress: number;
    files: any[];
    error: string | null;
  }>({
    isUploading: false,
    progress: 0,
    files: [],
    error: null
  });

  return (
    <div>
      <TusFileUpload
        formId={formId}
        submissionId={submissionId}
        fieldName="documents"
        options={{
          maxFileSize: 50 * 1024 * 1024,
          multiple: true
        }}
        onUploadStart={() => {
          setUploadState(prev => ({
            ...prev,
            isUploading: true,
            error: null
          }));
        }}
        onProgress={(progress) => {
          setUploadState(prev => ({
            ...prev,
            progress: progress.percentage
          }));
        }}
        onComplete={(files) => {
          setUploadState({
            isUploading: false,
            progress: 100,
            files: files,
            error: null
          });
        }}
        onError={(error) => {
          setUploadState(prev => ({
            ...prev,
            isUploading: false,
            error: error.message
          }));
        }}
      />

      {/* Status Display */}
      {uploadState.isUploading && (
        <div className="upload-status">
          <progress value={uploadState.progress} max={100} />
          <span>{uploadState.progress}% uploaded</span>
        </div>
      )}

      {uploadState.error && (
        <div className="error">
          Error: {uploadState.error}
        </div>
      )}

      {uploadState.files.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadState.files.map(file => (
              <li key={file.fileId}>
                {file.fileName} ({formatBytes(file.fileSize)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper function
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### Using FileUpload in formio-core

```typescript
// formio-core component definition
import { Component } from '../../base/Component';

const fileUploadComponent = {
  type: 'fileupload',
  label: 'Upload Documents',
  key: 'documents',
  storage: 'gcs',
  url: '/upload',
  options: {
    maxFileSize: 50 * 1024 * 1024,
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    multiple: true,
    resumable: true
  },
  validate: {
    required: true,
    custom: 'valid = (data.documents && data.documents.length > 0)'
  }
};

// Add to form schema
const formSchema = {
  components: [
    fileUploadComponent,
    // ... other components
  ]
};
```

---

## Configuration

### Environment Variables

#### Required Variables

```bash
# MongoDB Connection
MONGO=mongodb://mongodb:27017/formioapp

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-secret-key-here
DB_SECRET=your-db-secret-here

# Storage Configuration
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=http://gcs-emulator:4443  # or GCS production URL
FORMIO_S3_BUCKET=local-formio-uploads       # or production bucket name
FORMIO_S3_REGION=auto
FORMIO_S3_KEY=local-access-key              # or GCS service account key
FORMIO_S3_SECRET=local-secret-key           # or GCS secret

# File Upload Limits
MAX_FILE_SIZE=104857600                     # 100MB in bytes
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,png     # Comma-separated
CHUNK_SIZE=5242880                          # 5MB chunk size
UPLOAD_SESSION_TTL=3600                     # 1 hour in seconds
```

#### Optional Variables

```bash
# Security
ENABLE_VIRUS_SCAN=false                     # Enable ClamAV scanning
VIRUS_SCAN_URL=http://clamav:3310

# Performance
ENABLE_CDN=false                            # Enable CDN for downloads
CDN_URL=https://cdn.example.com
ENABLE_FILE_CACHE=true                      # Cache file metadata
FILE_CACHE_TTL=3600                         # 1 hour

# Monitoring
ENABLE_UPLOAD_METRICS=true                  # Track upload metrics
SENTRY_DSN=https://...@sentry.io/...       # Error tracking

# CORS
CORS_ORIGIN=http://localhost:64849,http://localhost:3000

# Debug
DEBUG=formio:*                              # Enable debug logging
```

### GCS Configuration

#### Local Development (Emulator)

No configuration needed! The emulator is pre-configured in `docker-compose.local.yml`.

**Bucket Name:** `local-formio-uploads`
**Endpoint:** `http://localhost:4443`

#### Production Setup

1. **Create GCS Bucket:**

```bash
# Using gcloud CLI
gcloud storage buckets create gs://formio-uploads-prod \
  --location=us-central1 \
  --uniform-bucket-level-access

# Set lifecycle policy (optional)
gcloud storage buckets update gs://formio-uploads-prod \
  --lifecycle-file=lifecycle.json
```

2. **Create Service Account:**

```bash
# Create service account
gcloud iam service-accounts create formio-uploader \
  --display-name="Form.io File Uploader"

# Grant storage permissions
gcloud projects add-iam-policy-binding my-project \
  --member="serviceAccount:formio-uploader@my-project.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Create key file
gcloud iam service-accounts keys create gcs-credentials.json \
  --iam-account=formio-uploader@my-project.iam.gserviceaccount.com
```

3. **Configure Form.io:**

```bash
# Set environment variables
export GCS_PROJECT_ID=my-project
export GCS_BUCKET=formio-uploads-prod
export GCS_CREDENTIALS_PATH=/app/secrets/gcs-credentials.json

# Or in docker-compose.yml
environment:
  GCS_PROJECT_ID: my-project
  GCS_BUCKET: formio-uploads-prod
volumes:
  - ./gcs-credentials.json:/app/secrets/gcs-credentials.json:ro
```

### Form Component Configuration

```typescript
// In your form definition
{
  type: 'fileupload',
  label: 'Upload Files',
  key: 'myFiles',

  // Storage settings
  storage: 'gcs',
  url: '/upload',  // API endpoint

  // File restrictions
  options: {
    maxFileSize: 50 * 1024 * 1024,  // 50MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    multiple: true,

    // Upload behavior
    resumable: true,
    chunkSize: 5 * 1024 * 1024,  // 5MB chunks

    // Validation
    required: true,
    minFiles: 1,
    maxFiles: 5
  },

  // Validation rules
  validate: {
    required: true,
    custom: 'valid = (data.myFiles && data.myFiles.length >= 1 && data.myFiles.length <= 5)'
  }
}
```

---

## Testing Locally

### 1. Start Development Environment

```bash
# Option A: Automated (tmux)
./scripts/dev-workflow.sh

# Option B: Manual
make -f Makefile.local local-up
cd test-app && npm run dev
```

### 2. Verify Services

```bash
# Check all services
make -f Makefile.local verify-services

# Expected output:
# ✅ MongoDB is healthy
# ✅ GCS Emulator is healthy
# ✅ Form.io Server is running
```

### 3. Access Test App

Open http://localhost:64849 in your browser.

You should see:
- Service connectivity tests (all green ✅)
- File upload component
- Form rendering

### 4. Test File Upload

#### Single File Upload

1. Click "Choose File" or drag-and-drop a file
2. Select a file (< 50MB recommended for testing)
3. Watch the progress bar
4. Verify upload completes successfully

#### Multiple File Upload

1. Enable "multiple" option in component config
2. Select multiple files (or drag-and-drop)
3. Watch individual progress for each file
4. Verify all files complete

#### Large File Upload (Resumable)

1. Select a file > 50MB
2. Watch chunked upload progress (5MB chunks)
3. Refresh page mid-upload
4. Verify upload resumes from last chunk

#### Simulating Network Failure

```bash
# Terminal 1: Start upload
# (Upload a large file in browser)

# Terminal 2: Kill Form.io server
docker-compose -f docker-compose.local.yml stop formio-server

# Wait 10 seconds...

# Terminal 2: Restart server
docker-compose -f docker-compose.local.yml start formio-server

# Browser: Upload should auto-resume!
```

### 5. Verify Upload in Storage

```bash
# List uploaded files in GCS emulator
make -f Makefile.local verify-upload

# Expected output:
# Files in local-formio-uploads:
# - uploads/2025/09/65abc123def4567890abcdef
# - uploads/2025/09/65abc456def7890123abcdef
```

### 6. Verify Database Records

```bash
# Open MongoDB shell
make -f Makefile.local shell-mongo

# In mongo shell:
use formioapp;

// View upload sessions
db.uploadSessions.find().pretty();

// View file records
db.files.find().pretty();

// View submissions with files
db.submissions.find({ "data.documents": { $exists: true } }).pretty();
```

---

## API Integration

### Authentication

All API requests require a JWT token in the `Authorization` header.

#### Get JWT Token

```bash
# Login
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "email": "admin@local.test",
      "password": "admin123"
    }
  }'

# Response includes JWT token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Use JWT Token

```bash
# Store token
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use in requests
curl -X POST http://localhost:3001/form/ABC123/submission/DEF456/upload \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

### Initialize Upload

```bash
curl -X POST \
  http://localhost:3001/form/65abc111/submission/65abc222/upload \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fieldName": "documents",
    "fileName": "report.pdf",
    "fileSize": 52428800,
    "fileType": "application/pdf"
  }'

# Response:
{
  "uploadId": "65abc456def7890123abcdef",
  "uploadUrl": "/upload/65abc456def7890123abcdef",
  "offset": 0,
  "expiresAt": "2025-09-30T18:15:00Z",
  "chunkSize": 5242880
}
```

### Upload Chunk

```bash
# Upload first chunk
curl -X PATCH \
  http://localhost:3001/upload/65abc456def7890123abcdef \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/offset+octet-stream" \
  -H "Upload-Offset: 0" \
  -H "Tus-Resumable: 1.0.0" \
  --data-binary "@chunk1.bin"

# Response headers:
# Upload-Offset: 5242880
# Tus-Resumable: 1.0.0
```

### Check Upload Status

```bash
curl -X HEAD \
  http://localhost:3001/upload/65abc456def7890123abcdef \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Tus-Resumable: 1.0.0"

# Response headers:
# Upload-Offset: 10485760
# Upload-Length: 52428800
# Tus-Resumable: 1.0.0
```

### Download File

```bash
curl -X GET \
  http://localhost:3001/file/65abc123def4567890abcdef \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -o downloaded-file.pdf

# Or get metadata only
curl -X GET \
  http://localhost:3001/file/65abc123def4567890abcdef/metadata \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## Common Patterns

### Pattern 1: Single File Upload with Validation

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const InvoiceUpload: React.FC = () => {
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  const validateInvoice = (file: File): boolean => {
    // Check file type
    if (!file.type.includes('pdf')) {
      setError('Only PDF invoices are accepted');
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Invoice must be less than 10MB');
      return false;
    }

    // Check filename pattern
    const filenamePattern = /^INV-\d{4}-\d{4}\.pdf$/;
    if (!filenamePattern.test(file.name)) {
      setError('Invoice filename must match pattern: INV-YYYY-NNNN.pdf');
      return false;
    }

    setError(null);
    return true;
  };

  return (
    <div>
      <h3>Upload Invoice</h3>
      <p>Format: INV-YYYY-NNNN.pdf, max 10MB</p>

      <TusFileUpload
        formId={formId}
        submissionId={submissionId}
        fieldName="invoice"
        options={{
          maxFileSize: 10 * 1024 * 1024,
          allowedTypes: ['application/pdf'],
          multiple: false
        }}
        beforeUpload={validateInvoice}
        onComplete={(files) => {
          setInvoice(files[0]);
        }}
        onError={(err) => {
          setError(err.message);
        }}
      />

      {error && <div className="error">{error}</div>}
      {invoice && (
        <div className="success">
          Invoice uploaded: {invoice.fileName}
        </div>
      )}
    </div>
  );
};
```

### Pattern 2: Multiple File Upload with Preview

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);

  return (
    <div>
      <h3>Upload Photos</h3>

      <TusFileUpload
        formId={formId}
        submissionId={submissionId}
        fieldName="photos"
        options={{
          maxFileSize: 5 * 1024 * 1024,  // 5MB per photo
          allowedTypes: ['image/*'],
          multiple: true,
          maxFiles: 10,
          showPreview: true
        }}
        onComplete={(files) => {
          setPhotos(files);
        }}
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <div key={photo.fileId} className="photo-item">
              <img
                src={photo.url}
                alt={photo.fileName}
                style={{ maxWidth: '200px' }}
              />
              <p>{photo.fileName}</p>
              <button onClick={() => deletePhoto(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Pattern 3: Large File Upload with Progress

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const VideoUpload: React.FC = () => {
  const [progress, setProgress] = useState({
    percentage: 0,
    bytesUploaded: 0,
    bytesTotal: 0,
    uploadSpeed: 0
  });

  return (
    <div>
      <h3>Upload Video</h3>

      <TusFileUpload
        formId={formId}
        submissionId={submissionId}
        fieldName="video"
        options={{
          maxFileSize: 500 * 1024 * 1024,  // 500MB
          allowedTypes: ['video/*'],
          multiple: false,
          chunkSize: 10 * 1024 * 1024  // 10MB chunks
        }}
        onProgress={(prog) => {
          setProgress(prog);
        }}
        onComplete={(files) => {
          console.log('Video uploaded:', files[0]);
        }}
      />

      {/* Progress Display */}
      {progress.percentage > 0 && progress.percentage < 100 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="progress-stats">
            <span>{progress.percentage.toFixed(1)}% complete</span>
            <span>
              {formatBytes(progress.bytesUploaded)} / {formatBytes(progress.bytesTotal)}
            </span>
            <span>
              {formatBytes(progress.uploadSpeed)}/s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### Pattern 4: Drag and Drop Zone

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const DragDropUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div>
      <h3>Upload Documents</h3>

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <TusFileUpload
          formId={formId}
          submissionId={submissionId}
          fieldName="documents"
          options={{
            maxFileSize: 50 * 1024 * 1024,
            multiple: true,
            showPreview: true
          }}
          onComplete={(files) => {
            console.log('Files uploaded:', files);
          }}
        />

        {isDragging ? (
          <div className="drop-message">
            📄 Drop files here to upload
          </div>
        ) : (
          <div className="drop-message">
            📁 Drag files here or click to browse
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## Troubleshooting

### Issue: Services won't start

**Symptoms:**
- Docker containers fail to start
- Port conflicts
- Health checks failing

**Solutions:**

```bash
# Check if ports are already in use
lsof -i :3001,27017,4443,64849

# Kill processes using those ports
kill -9 <PID>

# Reset Docker environment
make -f Makefile.local local-reset
make -f Makefile.local local-up

# Check Docker logs
docker-compose -f docker-compose.local.yml logs
```

---

### Issue: Upload fails immediately

**Symptoms:**
- Upload starts but fails within seconds
- No chunks uploaded
- Error: "Unauthorized" or "Forbidden"

**Solutions:**

```bash
# 1. Check JWT token is valid
curl -X GET http://localhost:3001/current \
  -H "Authorization: Bearer $JWT_TOKEN"

# 2. Verify form permissions
# In MongoDB:
use formioapp;
db.forms.findOne({ _id: ObjectId("your-form-id") });
# Check "access" field

# 3. Check Form.io logs
make -f Makefile.local local-logs-formio | grep -i error

# 4. Verify GCS emulator is running
curl http://localhost:4443/storage/v1/b/local-formio-uploads
```

---

### Issue: Upload stalls mid-transfer

**Symptoms:**
- Upload stops at random percentage
- No error messages
- Progress doesn't update

**Solutions:**

```bash
# 1. Check network connectivity
curl http://localhost:3001/health

# 2. Verify GCS emulator is healthy
docker-compose -f docker-compose.local.yml ps gcs-emulator

# 3. Check Form.io server logs
make -f Makefile.local local-logs-formio | grep -i upload

# 4. Increase chunk timeout (in client)
options: {
  chunkSize: 5 * 1024 * 1024,
  chunkTimeout: 60000  // 60 seconds
}

# 5. Check disk space
df -h
docker system df
```

---

### Issue: Upload completes but file not accessible

**Symptoms:**
- Upload shows 100% complete
- File not in database
- Download fails with 404

**Solutions:**

```bash
# 1. Check MongoDB for file record
use formioapp;
db.files.find({ fileName: "your-file-name" }).pretty();

# 2. Check upload session status
db.uploadSessions.find({ status: "active" }).pretty();

# 3. Verify GCS storage
make -f Makefile.local verify-upload

# 4. Check Form.io logs for finalization errors
make -f Makefile.local local-logs-formio | grep -i "finalize\|complete"

# 5. Manually finalize stuck uploads
# (This would require a cleanup script - TBD)
```

---

### Issue: Resume doesn't work after page refresh

**Symptoms:**
- Upload starts from 0% after refresh
- Previous chunks lost

**Solutions:**

```javascript
// Ensure fingerprint storage is enabled
options: {
  resumable: true,
  removeFingerprintOnSuccess: false,

  // Use localStorage for persistence
  storage: window.localStorage
}

// Check browser console for fingerprint
console.log(localStorage.getItem('tus::fingerprint::...'));
```

---

### Issue: File size limit errors

**Symptoms:**
- "File too large" error
- Upload rejected before starting

**Solutions:**

```bash
# 1. Check environment variable
echo $MAX_FILE_SIZE  # Should be in bytes

# 2. Verify nginx/proxy limits (if applicable)
# In nginx.conf:
client_max_body_size 100M;

# 3. Check component configuration
options: {
  maxFileSize: 100 * 1024 * 1024  // Must match server limit
}

# 4. For GCS emulator, no limit
# For production GCS, check bucket settings
```

---

### Issue: File type validation fails

**Symptoms:**
- "File type not allowed" error
- Valid files rejected

**Solutions:**

```javascript
// Use MIME types instead of extensions
options: {
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ]
}

// Or use wildcards
options: {
  allowedTypes: ['image/*', 'application/*']
}

// Check MIME type detection
const fileType = await getMimeType(file);
console.log('Detected MIME type:', fileType);
```

---

### Issue: MongoDB connection errors

**Symptoms:**
- "MongoNetworkError"
- Form.io server can't connect to MongoDB

**Solutions:**

```bash
# 1. Verify MongoDB is running
docker-compose -f docker-compose.local.yml ps mongodb

# 2. Test connection
docker exec -it formio-mongo-local mongosh

# 3. Check network
docker network ls
docker network inspect formio_local_network

# 4. Verify environment variable
docker exec formio-server-local env | grep MONGO

# 5. Check MongoDB logs
make -f Makefile.local local-logs-mongo
```

---

## Best Practices

### 1. Security

```typescript
// ✅ Always validate files server-side
const validateFile = (file: File) => {
  // Check actual MIME type, not just extension
  const mimeType = getMimeTypeFromBuffer(file.buffer);

  // Validate against whitelist
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error('File type not allowed');
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  // Scan for viruses (production)
  if (process.env.ENABLE_VIRUS_SCAN === 'true') {
    await scanFile(file);
  }
};

// ✅ Use signed URLs with expiration
const downloadUrl = await gcsProvider.getSignedUrl(fileId, {
  expiresIn: 3600 // 1 hour
});

// ✅ Verify user permissions before upload
const canUpload = await checkPermission(userId, formId, 'create');
if (!canUpload) {
  throw new ForbiddenError('No permission to upload');
}
```

### 2. Performance

```typescript
// ✅ Use optimal chunk size
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB for most cases

// ✅ Enable parallel chunk uploads
options: {
  parallelUploads: 3,
  parallelChunkUploads: true
}

// ✅ Use CDN for downloads
const fileUrl = process.env.ENABLE_CDN === 'true'
  ? `${CDN_URL}/files/${fileId}`
  : `/file/${fileId}`;

// ✅ Implement caching
const cachedMetadata = await cache.get(`file:${fileId}`);
if (cachedMetadata) return cachedMetadata;

const metadata = await db.files.findOne({ _id: fileId });
await cache.set(`file:${fileId}`, metadata, { ttl: 3600 });
```

### 3. Error Handling

```typescript
// ✅ Implement retry logic
const retryUpload = async (chunk, attempt = 0) => {
  try {
    return await uploadChunk(chunk);
  } catch (error) {
    if (attempt < MAX_RETRIES && isRetryableError(error)) {
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await sleep(delay);
      return retryUpload(chunk, attempt + 1);
    }
    throw error;
  }
};

// ✅ Provide user-friendly error messages
const getErrorMessage = (error: Error): string => {
  if (error.message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (error.message.includes('size')) {
    return 'File is too large. Maximum size is 100MB.';
  }
  return 'Upload failed. Please try again later.';
};

// ✅ Log errors for debugging
onError: (error) => {
  console.error('Upload error:', {
    message: error.message,
    code: error.code,
    fileId: fileId,
    offset: currentOffset,
    timestamp: new Date().toISOString()
  });

  // Send to monitoring service
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error);
  }
}
```

### 4. Testing

```typescript
// ✅ Test file upload in E2E tests
test('should upload file successfully', async () => {
  const file = new File(['test content'], 'test.pdf', {
    type: 'application/pdf'
  });

  render(<TusFileUpload {...props} />);

  const input = screen.getByLabelText('Upload file');
  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(screen.getByText('Upload complete')).toBeInTheDocument();
  });

  // Verify file in database
  const fileRecord = await db.files.findOne({ fileName: 'test.pdf' });
  expect(fileRecord).toBeTruthy();
  expect(fileRecord.status).toBe('completed');
});

// ✅ Test resumable upload
test('should resume upload after interruption', async () => {
  // Start upload
  const uploadPromise = startUpload(largeFile);

  // Wait for first chunk
  await waitForChunk(1);

  // Simulate network failure
  server.close();

  // Wait and restart
  await sleep(1000);
  server.listen();

  // Upload should resume
  await uploadPromise;

  expect(uploadMetrics.chunksUploaded).toBeGreaterThan(1);
  expect(uploadMetrics.bytesResumed).toBeGreaterThan(0);
});
```

### 5. User Experience

```tsx
// ✅ Show clear progress indication
<div className="upload-progress">
  <ProgressBar percentage={progress.percentage} />
  <span>{progress.percentage}% uploaded</span>
  <span>{formatBytes(progress.bytesUploaded)} / {formatBytes(progress.bytesTotal)}</span>
  <span>Time remaining: {formatDuration(progress.timeRemaining)}</span>
</div>

// ✅ Provide file preview
{showPreview && fileType.startsWith('image/') && (
  <img src={URL.createObjectURL(file)} alt={file.name} />
)}

// ✅ Allow cancellation
<button onClick={() => uppy.cancelAll()}>
  Cancel Upload
</button>

// ✅ Show validation errors clearly
{validationError && (
  <div className="error-message" role="alert">
    <strong>Error:</strong> {validationError}
  </div>
)}
```

---

## Examples

### Complete Form with File Upload

```tsx
import React, { useState } from 'react';
import { TusFileUpload } from 'formio-react';

export const DocumentSubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    documents: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.applicantName || !formData.email) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.documents.length === 0) {
      alert('Please upload at least one document');
      return;
    }

    // Submit to Form.io
    try {
      const response = await fetch('/form/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ data: formData })
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        // Reset form
        setFormData({
          applicantName: '',
          email: '',
          documents: []
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="document-form">
      <h2>Document Submission</h2>

      {/* Text Fields */}
      <div className="form-group">
        <label htmlFor="applicantName">
          Applicant Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="applicantName"
          value={formData.applicantName}
          onChange={(e) => setFormData({
            ...formData,
            applicantName: e.target.value
          })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({
            ...formData,
            email: e.target.value
          })}
          required
        />
      </div>

      {/* File Upload */}
      <div className="form-group">
        <label>
          Upload Documents <span className="required">*</span>
        </label>
        <p className="help-text">
          Accepted formats: PDF, DOC, DOCX. Maximum 50MB per file.
        </p>

        <TusFileUpload
          formId="65abc111def1111111abcdef"
          submissionId="new" // Use 'new' for new submissions
          fieldName="documents"
          options={{
            maxFileSize: 50 * 1024 * 1024,
            allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            multiple: true,
            maxFiles: 5,
            resumable: true,
            showPreview: true
          }}
          onComplete={(files) => {
            setFormData({
              ...formData,
              documents: files
            });
          }}
          onError={(error) => {
            console.error('Upload error:', error);
            alert(`Upload failed: ${error.message}`);
          }}
        />
      </div>

      {/* Uploaded Files List */}
      {formData.documents.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Documents ({formData.documents.length})</h3>
          <ul>
            {formData.documents.map((file, index) => (
              <li key={file.fileId}>
                <span>{file.fileName}</span>
                <span className="file-size">
                  ({formatBytes(file.fileSize)})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newDocs = [...formData.documents];
                    newDocs.splice(index, 1);
                    setFormData({ ...formData, documents: newDocs });
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" className="btn-primary">
        Submit Application
      </button>
    </form>
  );
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getAuthToken(): string {
  return localStorage.getItem('formio.token') || '';
}
```

---

## Support & Resources

### Documentation
- [Architecture Documentation](../architecture/file-upload-integration.md)
- [Local Development Guide](../../LOCAL_DEVELOPMENT.md)
- [Phase 0 Status](../../PHASE_0_COMPLETE.md)

### External Resources
- [tus Protocol Specification](https://tus.io/protocols/resumable-upload.html)
- [Uppy.js Documentation](https://uppy.io/docs/)
- [Form.io Documentation](https://help.form.io/)
- [Google Cloud Storage Docs](https://cloud.google.com/storage/docs)

### Getting Help

1. **Check logs:**
   ```bash
   make -f Makefile.local local-logs-formio
   ```

2. **Reset environment:**
   ```bash
   make -f Makefile.local local-reset
   make -f Makefile.local local-up
   ```

3. **Verify services:**
   ```bash
   make -f Makefile.local verify-services
   ```

---

**Last Updated:** September 30, 2025
**Version:** 1.0.0
**Status:** ✅ Complete and Ready for Use