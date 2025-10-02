# TUS+Uppy File Component Architecture Design

**Version:** 1.0.0
**Date:** 2025-09-30
**Architect:** Hive Mind Architect Agent
**Status:** Design Phase Complete

---

## 1. Executive Summary

This document defines the comprehensive architecture for integrating TUS resumable upload protocol with Uppy file upload UI into Form.io's file component system. The design enables:

- **Resumable uploads** via TUS protocol with byte-level precision
- **Rich UI** via Uppy Dashboard with plugin ecosystem
- **Seamless integration** with Form.io React renderer
- **GCS storage backend** for scalable file persistence
- **Form.io submission data model** compatibility

---

## 2. System Architecture Overview

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Form.io Form Definition (JSON)               │
│  { components: [{ type: "file", storage: "url", ... }] }       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              @formio/react Renderer                              │
│  - Parses JSON form definition                                   │
│  - Renders React components                                      │
│  - Manages form state                                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│         Custom File Component Wrapper (React)                    │
│  - Receives Form.io component config                             │
│  - Initializes Uppy instance                                     │
│  - Configures TUS plugin                                         │
│  - Manages upload state                                          │
└─────────────┬──────────────────────────┬────────────────────────┘
              │                          │
              ▼                          ▼
   ┌──────────────────┐      ┌──────────────────────┐
   │  Uppy Dashboard  │      │  Uppy Core + Plugins │
   │  - File selection│      │  - TUS Plugin        │
   │  - Progress UI   │      │  - File validation   │
   │  - Multi-file    │      │  - State management  │
   └──────────────────┘      └──────────┬───────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │  TUS Upload Protocol      │
                          │  - Chunked upload         │
                          │  - Resume capability      │
                          │  - Progress tracking      │
                          └──────────┬────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Form.io Server (Express + Node.js)                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  TUS Server (/files endpoint)                          │    │
│  │  - POST /files - Create upload                         │    │
│  │  - PATCH /files/:id - Upload chunks                    │    │
│  │  - HEAD /files/:id - Get progress                      │    │
│  │  - DELETE /files/:id - Cancel upload                   │    │
│  └───────────────────────┬────────────────────────────────┘    │
│                          │                                       │
│  ┌───────────────────────▼────────────────────────────────┐    │
│  │  GCS Storage Provider                                   │    │
│  │  - Google Cloud Storage integration                     │    │
│  │  - 8MB chunk uploads                                    │    │
│  │  - CRC32C validation                                    │    │
│  └───────────────────────┬────────────────────────────────┘    │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │  Google Cloud       │
                  │  Storage (GCS)      │
                  │  - Final file store │
                  │  - CDN-ready URLs   │
                  └─────────────────────┘
```

### 2.2 Data Flow Sequence

```
User                 React Component       Uppy          TUS Client      Form.io Server      GCS
│                           │               │                │                 │              │
│  1. Select file(s)        │               │                │                 │              │
├─────────────────────────►│               │                │                 │              │
│                           │               │                │                 │              │
│                           │ 2. Initialize Uppy             │                 │              │
│                           ├──────────────►│                │                 │              │
│                           │               │                │                 │              │
│                           │               │ 3. Create TUS upload (POST)     │              │
│                           │               │                ├────────────────►│              │
│                           │               │                │    4. Validate  │              │
│                           │               │                │    JWT token    │              │
│                           │               │                │                 │              │
│                           │               │                │   5. Return     │              │
│                           │               │                │      uploadId   │              │
│                           │               │                ◄─────────────────┤              │
│                           │               │                │                 │              │
│                           │               │ 6. Upload chunks (PATCH * N)    │              │
│                           │               │                ├────────────────►│              │
│                           │               │                │                 │ 7. Stream    │
│                           │               │                │                 │    to GCS    │
│                           │               │                │                 ├─────────────►│
│                           │               │                │                 │              │
│                           │  8. Progress events            │                 │              │
│                           ◄───────────────┤                │                 │              │
│  9. Update UI             │               │                │                 │              │
◄───────────────────────────┤               │                │                 │              │
│                           │               │                │                 │              │
│                           │               │ 10. Final chunk                 │              │
│                           │               │                ├────────────────►│              │
│                           │               │                │                 │ 11. Finalize │
│                           │               │                │                 ├─────────────►│
│                           │               │                │                 │              │
│                           │               │                │  12. Return     │  13. Return  │
│                           │               │                │      signed URL │      file URL│
│                           │               │                ◄─────────────────┤◄─────────────┤
│                           │               │                │                 │              │
│                           │  14. Upload complete (file URL)│                 │              │
│                           ◄───────────────┤                │                 │              │
│                           │               │                │                 │              │
│  15. Form submission      │               │                │                 │              │
│      (includes file URLs) │               │                │                 │              │
├─────────────────────────►│               │                │                 │              │
│                           │ 16. Submit to Form.io API      │                 │              │
│                           │               │                │                 │              │
│                           │ 17. Save submission (MongoDB)  │                 │              │
│                           │               │                │                 │              │
```

---

## 3. JSON Schema Design

### 3.1 Form.io File Component Schema

```json
{
  "type": "file",
  "key": "profilePhoto",
  "label": "Profile Photo",

  "storage": "url",
  "url": "http://localhost:3001/files",
  "uploadProtocol": "tus",

  "uploadOptions": {
    "endpoint": "http://localhost:3001/files",
    "chunkSize": 1048576,
    "retryDelays": [0, 1000, 3000, 5000],
    "metadata": {
      "formId": "{{formId}}",
      "fieldName": "{{key}}"
    },
    "headers": {
      "Authorization": "Bearer {{token}}"
    }
  },

  "uppyOptions": {
    "restrictions": {
      "maxFileSize": 10485760,
      "maxNumberOfFiles": 5,
      "minNumberOfFiles": 1,
      "allowedFileTypes": ["image/*", "application/pdf"]
    },
    "autoProceed": false,
    "allowMultipleUploads": true,
    "debug": false
  },

  "uppyPlugins": {
    "Dashboard": {
      "inline": true,
      "height": 350,
      "showProgressDetails": true,
      "hideUploadButton": false,
      "note": "Images up to 10MB, max 5 files"
    },
    "Tus": {
      "limit": 3,
      "withCredentials": false,
      "overridePatchMethod": false
    },
    "Webcam": {
      "enabled": false,
      "modes": ["picture"]
    },
    "ImageEditor": {
      "enabled": false,
      "quality": 0.8
    },
    "GoldenRetriever": {
      "enabled": true,
      "serviceWorker": false
    }
  },

  "validation": {
    "required": true,
    "custom": "valid = (input && input.length > 0) ? true : 'At least one file required';"
  },

  "multiple": true,
  "webcam": false,
  "imagePreview": true,

  "conditional": {
    "show": null,
    "when": null,
    "eq": ""
  }
}
```

### 3.2 Component Configuration Breakdown

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `storage` | string | Storage type (must be "url" for TUS) | "url" |
| `url` | string | TUS server endpoint | Required |
| `uploadProtocol` | string | Upload protocol identifier | "tus" |
| `uploadOptions` | object | TUS-specific configuration | See below |
| `uppyOptions` | object | Uppy core configuration | See below |
| `uppyPlugins` | object | Enabled Uppy plugins | See below |
| `multiple` | boolean | Allow multiple files | false |
| `webcam` | boolean | Enable webcam capture | false |
| `imagePreview` | boolean | Show image previews | true |

#### 3.2.1 uploadOptions Schema

```typescript
interface UploadOptions {
  endpoint: string;                    // TUS server URL
  chunkSize?: number;                  // Default: 1MB (1048576 bytes)
  retryDelays?: number[];              // Default: [0, 1000, 3000, 5000]
  metadata?: {                         // Metadata sent with upload
    formId: string;                    // Form.io form ID
    fieldName: string;                 // Component key
    [key: string]: any;                // Additional metadata
  };
  headers?: {                          // HTTP headers
    Authorization?: string;            // JWT bearer token
    [key: string]: string;
  };
}
```

#### 3.2.2 uppyOptions Schema

```typescript
interface UppyOptions {
  restrictions?: {
    maxFileSize?: number;              // Bytes (default: null = unlimited)
    maxNumberOfFiles?: number;         // Max files in upload (default: null)
    minNumberOfFiles?: number;         // Min files required (default: null)
    allowedFileTypes?: string[];       // MIME types or extensions
  };
  autoProceed?: boolean;               // Auto-start upload (default: false)
  allowMultipleUploads?: boolean;      // Allow batch uploads (default: true)
  debug?: boolean;                     // Enable debug logging (default: false)
}
```

#### 3.2.3 uppyPlugins Schema

```typescript
interface UppyPlugins {
  Dashboard?: {
    inline?: boolean;                  // Inline vs modal (default: true)
    height?: number;                   // Dashboard height in pixels
    showProgressDetails?: boolean;     // Show detailed progress (default: true)
    hideUploadButton?: boolean;        // Hide upload button (default: false)
    note?: string;                     // User-facing note/instructions
  };
  Tus?: {
    limit?: number;                    // Concurrent uploads (default: 5)
    withCredentials?: boolean;         // Send cookies (default: false)
    overridePatchMethod?: boolean;     // Use POST for PATCH (default: false)
  };
  Webcam?: {
    enabled?: boolean;                 // Enable plugin (default: false)
    modes?: ('picture' | 'video')[];   // Capture modes
  };
  ImageEditor?: {
    enabled?: boolean;                 // Enable plugin (default: false)
    quality?: number;                  // JPEG quality 0-1 (default: 0.8)
  };
  GoldenRetriever?: {
    enabled?: boolean;                 // Enable auto-resume (default: true)
    serviceWorker?: boolean;           // Use service worker (default: false)
  };
}
```

### 3.3 Submission Data Model

After successful upload, the submission data contains:

```json
{
  "data": {
    "profilePhoto": [
      {
        "name": "avatar.jpg",
        "originalName": "my-photo.jpg",
        "size": 245678,
        "type": "image/jpeg",
        "url": "https://storage.googleapis.com/formio-bucket/uploads/abc123/avatar.jpg?X-Goog-Signature=...",
        "storage": "url",
        "uploadId": "abc-123-def-456",
        "uploadedAt": "2025-09-30T12:34:56.789Z"
      }
    ]
  },
  "metadata": {
    "browser": "Chrome 118.0.0.0",
    "referrer": "",
    "offset": 0,
    "headers": { ... }
  }
}
```

---

## 4. React Component Architecture

### 4.1 Component Hierarchy

```
<Form>                              // @formio/react Form component
  └─ <Components>                   // Renderer for all components
       └─ <FileComponent>           // Custom file component wrapper
            ├─ <UppyDashboard />    // Uppy Dashboard UI
            ├─ <FileList />         // Uploaded files list
            └─ <ValidationErrors /> // Error display
```

### 4.2 FileComponent Implementation (Pseudo-code)

```typescript
import React, { useEffect, useState, useRef } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import Dashboard from '@uppy/dashboard';
import Webcam from '@uppy/webcam';
import ImageEditor from '@uppy/image-editor';
import GoldenRetriever from '@uppy/golden-retriever';

interface FileComponentProps {
  component: FormioFileComponent;
  value?: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  formio: FormioInstance;
}

export const FileComponent: React.FC<FileComponentProps> = ({
  component,
  value = [],
  onChange,
  formio
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(value);
  const [errors, setErrors] = useState<string[]>([]);
  const uppyRef = useRef<Uppy | null>(null);
  const dashboardTargetRef = useRef<HTMLDivElement>(null);

  // Initialize Uppy instance
  useEffect(() => {
    const uppy = new Uppy({
      id: `uppy-${component.key}`,
      restrictions: component.uppyOptions?.restrictions || {},
      autoProceed: component.uppyOptions?.autoProceed || false,
      allowMultipleUploads: component.uppyOptions?.allowMultipleUploads ?? true,
      debug: component.uppyOptions?.debug || false,
    });

    // Configure TUS plugin
    uppy.use(Tus, {
      endpoint: component.uploadOptions.endpoint,
      chunkSize: component.uploadOptions.chunkSize || 1024 * 1024, // 1MB
      retryDelays: component.uploadOptions.retryDelays || [0, 1000, 3000, 5000],
      limit: component.uppyPlugins?.Tus?.limit || 5,
      withCredentials: component.uppyPlugins?.Tus?.withCredentials || false,
      headers: {
        ...component.uploadOptions.headers,
        Authorization: `Bearer ${formio.getToken()}`,
      },
      metadata: {
        formId: formio.formId,
        fieldName: component.key,
        ...component.uploadOptions.metadata,
      },
      onBeforeRequest: (req) => {
        // Refresh token if needed
        const token = formio.getToken();
        req.setHeader('Authorization', `Bearer ${token}`);
      },
    });

    // Configure Dashboard plugin
    if (component.uppyPlugins?.Dashboard) {
      uppy.use(Dashboard, {
        target: dashboardTargetRef.current!,
        inline: component.uppyPlugins.Dashboard.inline ?? true,
        height: component.uppyPlugins.Dashboard.height || 350,
        showProgressDetails: component.uppyPlugins.Dashboard.showProgressDetails ?? true,
        hideUploadButton: component.uppyPlugins.Dashboard.hideUploadButton || false,
        note: component.uppyPlugins.Dashboard.note,
      });
    }

    // Configure optional plugins
    if (component.uppyPlugins?.Webcam?.enabled) {
      uppy.use(Webcam, {
        target: Dashboard,
        modes: component.uppyPlugins.Webcam.modes || ['picture'],
      });
    }

    if (component.uppyPlugins?.ImageEditor?.enabled) {
      uppy.use(ImageEditor, {
        target: Dashboard,
        quality: component.uppyPlugins.ImageEditor.quality || 0.8,
      });
    }

    if (component.uppyPlugins?.GoldenRetriever?.enabled !== false) {
      uppy.use(GoldenRetriever, {
        serviceWorker: component.uppyPlugins?.GoldenRetriever?.serviceWorker || false,
      });
    }

    // Event listeners
    uppy.on('upload-success', (file, response) => {
      const uploadedFile: UploadedFile = {
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: response.uploadURL || '',
        storage: 'url',
        uploadId: file.meta.uploadId || '',
        uploadedAt: new Date().toISOString(),
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      onChange([...uploadedFiles, uploadedFile]);
    });

    uppy.on('upload-error', (file, error) => {
      setErrors(prev => [...prev, `${file.name}: ${error.message}`]);
    });

    uppy.on('restriction-failed', (file, error) => {
      setErrors(prev => [...prev, `${file.name}: ${error.message}`]);
    });

    uppyRef.current = uppy;

    return () => {
      uppy.close();
    };
  }, [component, formio]);

  // Handle file removal
  const handleRemoveFile = (fileIndex: number) => {
    const newFiles = uploadedFiles.filter((_, idx) => idx !== fileIndex);
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  return (
    <div className="formio-component-file">
      <label htmlFor={component.key}>
        {component.label}
        {component.validation?.required && <span className="required">*</span>}
      </label>

      {/* Uppy Dashboard */}
      <div ref={dashboardTargetRef} />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files</h4>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
                <span> ({formatFileSize(file.size)})</span>
                <button onClick={() => handleRemoveFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="formio-errors">
          {errors.map((error, index) => (
            <p key={index} className="error">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
```

### 4.3 Integration with @formio/react

```typescript
// Register custom file component
import { Components } from '@formio/react';
import { FileComponent } from './components/FileComponent';

// Override default file component
Components.setComponent('file', FileComponent);

// Usage in application
import { Form } from '@formio/react';

function App() {
  const [formDefinition, setFormDefinition] = useState(null);
  const [submission, setSubmission] = useState({});

  useEffect(() => {
    // Fetch form definition from Form.io server
    fetch('http://localhost:3001/form/myform')
      .then(res => res.json())
      .then(data => setFormDefinition(data));
  }, []);

  const handleSubmit = (submission) => {
    console.log('Form submitted:', submission);
    setSubmission(submission);
  };

  return (
    <div>
      {formDefinition && (
        <Form
          form={formDefinition}
          submission={submission}
          onSubmit={handleSubmit}
          url="http://localhost:3001"
        />
      )}
    </div>
  );
}
```

---

## 5. API Contract

### 5.1 TUS Upload Endpoints

#### POST /files
**Create new upload session**

**Request:**
```http
POST /files HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Upload-Length: 1048576
Upload-Metadata: filename bXktZmlsZS5qcGc=,filetype aW1hZ2UvanBlZw==,formId Zm9ybTEyMw==,fieldName cHJvZmlsZVBob3Rv
Tus-Resumable: 1.0.0
Content-Length: 0
```

**Response:**
```http
HTTP/1.1 201 Created
Location: http://localhost:3001/files/abc-123-def-456
Tus-Resumable: 1.0.0
Upload-Expires: Wed, 01 Oct 2025 12:34:56 GMT
```

#### PATCH /files/:id
**Upload file chunk**

**Request:**
```http
PATCH /files/abc-123-def-456 HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Upload-Offset: 0
Content-Type: application/offset+octet-stream
Content-Length: 1048576
Tus-Resumable: 1.0.0

[binary file data chunk]
```

**Response:**
```http
HTTP/1.1 204 No Content
Upload-Offset: 1048576
Upload-Expires: Wed, 01 Oct 2025 12:34:56 GMT
Tus-Resumable: 1.0.0
```

#### HEAD /files/:id
**Get upload progress**

**Request:**
```http
HEAD /files/abc-123-def-456 HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Tus-Resumable: 1.0.0
```

**Response:**
```http
HTTP/1.1 200 OK
Upload-Offset: 1048576
Upload-Length: 5242880
Upload-Expires: Wed, 01 Oct 2025 12:34:56 GMT
Tus-Resumable: 1.0.0
Cache-Control: no-store
```

#### DELETE /files/:id
**Cancel upload**

**Request:**
```http
DELETE /files/abc-123-def-456 HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Tus-Resumable: 1.0.0
```

**Response:**
```http
HTTP/1.1 204 No Content
Tus-Resumable: 1.0.0
```

### 5.2 Extended Status Endpoint (Non-TUS)

#### GET /files/:id/status
**Get detailed upload status**

**Request:**
```http
GET /files/abc-123-def-456/status HTTP/1.1
Host: localhost:3001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "uploadId": "abc-123-def-456",
  "status": "uploading",
  "size": 5242880,
  "offset": 1048576,
  "progress": 20.0,
  "createdAt": "2025-09-30T12:00:00.000Z",
  "expiresAt": "2025-10-01T12:00:00.000Z"
}
```

### 5.3 Authentication

All TUS endpoints require JWT authentication:

```http
Authorization: Bearer <jwt_token>
```

Token validation flow:
1. Extract token from `Authorization` header
2. Verify token using `router.formio.auth.verifyToken(token)`
3. Attach `req.user` with decoded user information
4. Validate user has permission to upload to specified form/field

---

## 6. Configuration Requirements

### 6.1 Environment Variables

```bash
# GCS Configuration
GCS_PROJECT_ID=my-formio-project
GCS_BUCKET_NAME=formio-uploads
GCS_KEY_FILE=/path/to/service-account-key.json

# TUS Server Configuration
TUS_ENDPOINT=/files
TUS_MAX_FILE_SIZE=5368709120      # 5GB
TUS_CHUNK_SIZE=8388608            # 8MB
TUS_EXPIRATION_PERIOD=86400000    # 24 hours

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:64849
```

### 6.2 Form.io Server Integration

```javascript
// server.js
const express = require('express');
const { initializeUploadRoutes } = require('./src/upload/routes');

const app = express();
const router = require('./index')(app);

// Initialize TUS upload routes
const uploadRoutes = initializeUploadRoutes(router, {
  gcs: {
    projectId: process.env.GCS_PROJECT_ID,
    bucketName: process.env.GCS_BUCKET_NAME,
    keyFilename: process.env.GCS_KEY_FILE,
  },
  tus: {
    path: '/files',
    maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
    expirationPeriod: 24 * 60 * 60 * 1000, // 24 hours
    chunkSize: 8 * 1024 * 1024, // 8MB
  }
});

// Mount upload routes
app.use(uploadRoutes);

app.listen(3001, () => {
  console.log('Form.io server running on port 3001');
});
```

### 6.3 Frontend Configuration

```typescript
// config.ts
export const FORMIO_CONFIG = {
  apiUrl: process.env.REACT_APP_FORMIO_API_URL || 'http://localhost:3001',
  tusEndpoint: process.env.REACT_APP_TUS_ENDPOINT || 'http://localhost:3001/files',
  defaultChunkSize: 1024 * 1024, // 1MB
  defaultRetryDelays: [0, 1000, 3000, 5000],
  maxFileSize: 10 * 1024 * 1024, // 10MB default
};
```

---

## 7. State Management

### 7.1 Component State Flow

```
Initial State:
  uploadedFiles: []
  errors: []
  uppyInstance: null

User selects files:
  ↓
Uppy validates restrictions:
  ↓ (if valid)
TUS creates upload session:
  ↓
Chunks uploaded incrementally:
  ↓ (on each chunk)
Progress events emitted:
  ↓
Component state updated:
  uploadedFiles: [...prev, { progress: X% }]
  ↓
UI re-renders with progress
  ↓ (on completion)
Upload success event:
  ↓
Component state updated:
  uploadedFiles: [...prev, { url, uploadId, ... }]
  ↓
onChange() callback invoked:
  ↓
Form.io submission data updated
```

### 7.2 State Persistence (Golden Retriever)

Uppy's Golden Retriever plugin persists upload state to `localStorage`:

```typescript
interface PersistedState {
  files: {
    [fileId: string]: {
      name: string;
      type: string;
      data: ArrayBuffer;  // File data chunks
      progress: {
        uploadStarted: number;
        uploadComplete: boolean;
        percentage: number;
        bytesUploaded: number;
        bytesTotal: number;
      };
      tus: {
        uploadUrl: string;    // TUS upload URL
        offset: number;        // Resume from byte offset
      };
    };
  };
}
```

**Recovery on page load:**
1. Golden Retriever checks `localStorage` for persisted state
2. If found, recreates Uppy file objects
3. TUS plugin resumes from `offset` position
4. User sees uploads continue automatically

---

## 8. Error Handling & Edge Cases

### 8.1 Network Errors

**Scenario:** Network connection drops during upload

**Handling:**
1. TUS detects failed chunk upload
2. Retry with exponential backoff (0s, 1s, 3s, 5s)
3. If all retries fail, upload paused
4. User sees "Paused - Connection Lost" status
5. Golden Retriever persists state
6. On reconnection, TUS resumes from last successful offset

**Code:**
```typescript
uppy.on('upload-error', (file, error, response) => {
  if (error.message.includes('network') || response?.status === 0) {
    setErrors(prev => [...prev, `${file.name}: Network error - upload paused`]);
    // TUS will auto-retry
  }
});
```

### 8.2 Authentication Expiry

**Scenario:** JWT token expires during long upload

**Handling:**
1. TUS receives 401 Unauthorized response
2. Component detects auth error
3. Pauses upload
4. Triggers token refresh flow
5. Updates TUS headers with new token
6. Resumes upload

**Code:**
```typescript
uppy.use(Tus, {
  onBeforeRequest: (req) => {
    const token = formio.getToken();
    if (isTokenExpired(token)) {
      formio.refreshToken().then(newToken => {
        req.setHeader('Authorization', `Bearer ${newToken}`);
      });
    } else {
      req.setHeader('Authorization', `Bearer ${token}`);
    }
  },
});
```

### 8.3 File Validation Failures

**Scenario:** User selects invalid file (wrong type, too large)

**Handling:**
1. Uppy `restriction-failed` event fires
2. File rejected before upload starts
3. User sees immediate validation error
4. File not added to Uppy state

**Code:**
```typescript
uppy.on('restriction-failed', (file, error) => {
  setErrors(prev => [...prev, `${file.name}: ${error.message}`]);
  // Example errors:
  // - "File is too large (max 10MB)"
  // - "File type not allowed"
  // - "Maximum 5 files allowed"
});
```

### 8.4 Upload Expiration

**Scenario:** Upload not completed within 24 hours

**Handling:**
1. TUS server returns 410 Gone on next PATCH request
2. Upload cannot be resumed
3. User must restart upload
4. Cleanup job removes expired upload data

**Code:**
```typescript
uppy.on('upload-error', (file, error, response) => {
  if (response?.status === 410) {
    setErrors(prev => [...prev, `${file.name}: Upload expired - please restart`]);
    uppy.removeFile(file.id);
  }
});
```

### 8.5 Browser Tab Closure

**Scenario:** User closes tab with active uploads

**Handling:**
1. Golden Retriever saves state to localStorage
2. On tab reopen:
   - Component checks for persisted uploads
   - Offers to resume interrupted uploads
   - User can resume or cancel

**Code:**
```typescript
useEffect(() => {
  if (component.uppyPlugins?.GoldenRetriever?.enabled) {
    const persistedState = localStorage.getItem(`uppy-${component.key}`);
    if (persistedState) {
      // Show resume modal
      setShowResumeModal(true);
    }
  }
}, []);
```

---

## 9. Performance Considerations

### 9.1 Chunk Size Optimization

| File Size | Recommended Chunk Size | Rationale |
|-----------|------------------------|-----------|
| < 1MB | 256KB | Minimize overhead for small files |
| 1-10MB | 1MB (default) | Balance between resumability and throughput |
| 10-100MB | 2MB | Reduce number of requests |
| 100MB+ | 8MB | Maximize throughput for large files |

**Dynamic chunk sizing:**
```typescript
const optimalChunkSize = (fileSize: number): number => {
  if (fileSize < 1024 * 1024) return 256 * 1024;        // 256KB
  if (fileSize < 10 * 1024 * 1024) return 1024 * 1024;  // 1MB
  if (fileSize < 100 * 1024 * 1024) return 2 * 1024 * 1024; // 2MB
  return 8 * 1024 * 1024; // 8MB
};
```

### 9.2 Concurrent Upload Limits

**Default:** 5 concurrent uploads (TUS plugin `limit`)

**Tuning:**
- **Low bandwidth:** Reduce to 2-3 concurrent uploads
- **High bandwidth:** Increase to 10 concurrent uploads
- **Mobile networks:** Limit to 1-2 concurrent uploads

```json
{
  "uppyPlugins": {
    "Tus": {
      "limit": 3  // Mobile-optimized
    }
  }
}
```

### 9.3 Memory Management

**Issue:** Large files loaded entirely into memory can crash browser

**Solution:** TUS streams file chunks without loading entire file

**Uppy Configuration:**
```typescript
uppy.use(Tus, {
  chunkSize: 1024 * 1024,  // Read file in 1MB chunks
  // File never fully loaded into memory
});
```

### 9.4 Bundle Size Impact

| Library | Size (minified + gzipped) | Notes |
|---------|---------------------------|-------|
| @uppy/core | 45 KB | Required |
| @uppy/tus | 28 KB | Required for TUS |
| @uppy/dashboard | 62 KB | UI (can use alternatives) |
| @uppy/webcam | 35 KB | Optional |
| @uppy/image-editor | 120 KB | Optional (large!) |
| @uppy/golden-retriever | 8 KB | Highly recommended |
| **Total (basic)** | **135 KB** | Core + TUS + Dashboard |
| **Total (full featured)** | **298 KB** | All plugins enabled |

**Optimization:**
- Use code splitting to lazy-load optional plugins
- Only include plugins enabled in form definition
- Consider alternatives to Dashboard for smaller bundle

---

## 10. Security Considerations

### 10.1 Authentication

**JWT Token Validation:**
- Every TUS request requires `Authorization: Bearer <token>` header
- Token validated using `router.formio.auth.verifyToken(token)`
- User identity attached to upload metadata
- Token refresh handled automatically

### 10.2 Authorization

**Permission Checks:**
1. User must have `create` permission on target form
2. Validate `formId` in upload metadata matches allowed forms
3. Check field-level permissions if configured
4. Enforce file type restrictions per form configuration

**Implementation:**
```javascript
// middleware.js
exports.formPermissionMiddleware = (router) => async (req, res, next) => {
  const { formId } = extractMetadata(req.headers['upload-metadata']);

  const form = await router.formio.cache.loadForm(req, formId);
  const hasPermission = await router.formio.hasPermission(req, form, 'create');

  if (!hasPermission) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  next();
};
```

### 10.3 File Type Validation

**Server-side validation:**
```javascript
// TusServer.js
validateUploadMetadata(metadata) {
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1'];
  const ext = path.extname(metadata.filename).toLowerCase();

  if (dangerousExtensions.includes(ext)) {
    throw new Error(`File type not allowed: ${ext}`);
  }

  // Validate MIME type matches extension
  const expectedMime = mime.lookup(metadata.filename);
  if (expectedMime && expectedMime !== metadata.filetype) {
    throw new Error('File type mismatch');
  }
}
```

### 10.4 Rate Limiting

**Implementation:**
```javascript
// middleware.js
const rateLimit = require('express-rate-limit');

exports.rateLimitMiddleware = () => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many upload requests, please try again later',
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

### 10.5 File Size Limits

**Multi-layer enforcement:**
1. **Client-side:** Uppy restrictions (immediate feedback)
2. **TUS server:** `maxSize` configuration (5GB default)
3. **GCS:** Bucket quotas and lifecycle policies

### 10.6 CORS Configuration

**Required headers:**
```javascript
app.use('/files', cors({
  origin: process.env.CORS_ALLOWED_ORIGINS.split(','),
  methods: ['POST', 'HEAD', 'PATCH', 'OPTIONS', 'DELETE'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Upload-Length',
    'Upload-Offset',
    'Tus-Resumable',
    'Upload-Metadata',
    'Authorization'
  ],
  exposedHeaders: [
    'Upload-Offset',
    'Location',
    'Upload-Length',
    'Tus-Version',
    'Tus-Resumable',
    'Tus-Max-Size',
    'Tus-Extension',
    'Upload-Expires'
  ],
  credentials: true,
}));
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

**File Component:**
```typescript
describe('FileComponent', () => {
  it('initializes Uppy with correct configuration', () => {
    const component = { /* ... */ };
    const { container } = render(<FileComponent component={component} />);

    // Assert Uppy instance created
    // Assert TUS plugin configured
  });

  it('validates file restrictions', () => {
    // Test maxFileSize
    // Test allowedFileTypes
    // Test maxNumberOfFiles
  });

  it('handles upload success', async () => {
    // Mock TUS upload
    // Trigger success event
    // Assert onChange called with file data
  });

  it('handles upload errors', async () => {
    // Mock TUS error
    // Assert error displayed to user
  });
});
```

**TUS Server:**
```javascript
describe('TusServer', () => {
  it('creates upload with valid metadata', async () => {
    // POST /files with valid metadata
    // Assert 201 response with Location header
  });

  it('rejects upload without authentication', async () => {
    // POST /files without Authorization header
    // Assert 401 response
  });

  it('validates file type restrictions', async () => {
    // POST /files with .exe file
    // Assert 400 response
  });

  it('resumes upload from offset', async () => {
    // Create upload
    // Upload first chunk
    // Simulate disconnect
    // HEAD /files/:id to get offset
    // Resume from offset
    // Assert upload completes
  });
});
```

### 11.2 Integration Tests

**End-to-End Upload Flow:**
```typescript
describe('File Upload Integration', () => {
  it('completes full upload workflow', async () => {
    // 1. Render form with file component
    // 2. Select file
    // 3. Verify TUS session created (POST /files)
    // 4. Verify chunks uploaded (PATCH /files/:id)
    // 5. Verify upload completed
    // 6. Verify file URL added to submission data
    // 7. Submit form
    // 8. Verify submission saved with file reference
  });

  it('resumes interrupted upload', async () => {
    // 1. Start upload
    // 2. Upload 50%
    // 3. Simulate page refresh
    // 4. Verify Golden Retriever restores state
    // 5. Verify upload resumes from 50%
    // 6. Verify upload completes
  });
});
```

### 11.3 E2E Tests (Playwright)

```typescript
// tests/e2e/tus-upload.spec.ts
import { test, expect } from '@playwright/test';

test('upload file via TUS', async ({ page }) => {
  await page.goto('http://localhost:64849');

  // Wait for form to load
  await page.waitForSelector('.formio-component-file');

  // Select file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-files/sample.pdf');

  // Wait for upload to complete
  await page.waitForSelector('.uploaded-files li', { timeout: 30000 });

  // Verify file URL in submission data
  const fileUrl = await page.locator('.uploaded-files li a').getAttribute('href');
  expect(fileUrl).toContain('storage.googleapis.com');

  // Submit form
  await page.click('button[type="submit"]');

  // Verify submission success
  await page.waitForSelector('.submission-success');
});

test('resume upload after refresh', async ({ page, context }) => {
  await page.goto('http://localhost:64849');

  // Start large file upload (will take time)
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-files/large-file.mp4');

  // Wait for upload to reach 30%
  await page.waitForFunction(() => {
    const progress = document.querySelector('.uppy-ProgressBar-percentage');
    return progress && parseInt(progress.textContent) >= 30;
  });

  // Refresh page (simulating browser crash)
  await page.reload();

  // Verify resume modal appears
  await page.waitForSelector('.resume-upload-modal');
  await page.click('button[data-action="resume"]');

  // Verify upload continues from ~30%
  await page.waitForSelector('.uploaded-files li', { timeout: 60000 });

  const fileUrl = await page.locator('.uploaded-files li a').getAttribute('href');
  expect(fileUrl).toBeTruthy();
});
```

---

## 12. Deployment Checklist

### 12.1 Backend (Form.io Server)

- [ ] GCS bucket created and configured
- [ ] Service account key generated with Storage Object Creator role
- [ ] Environment variables configured (`GCS_PROJECT_ID`, `GCS_BUCKET_NAME`, etc.)
- [ ] TUS routes registered in Express app
- [ ] CORS headers configured for frontend origin
- [ ] JWT authentication integrated
- [ ] Rate limiting middleware enabled
- [ ] Upload expiration cleanup job scheduled
- [ ] Monitoring/logging configured for upload errors
- [ ] Health check endpoint tested (`GET /files/health`)

### 12.2 Frontend (React App)

- [ ] `@uppy/core`, `@uppy/tus`, `@uppy/dashboard` installed
- [ ] Custom FileComponent registered with `@formio/react`
- [ ] Form.io API URL configured
- [ ] TUS endpoint URL configured
- [ ] Token management implemented (refresh on expiry)
- [ ] Golden Retriever enabled for upload persistence
- [ ] Error handling UI implemented
- [ ] Progress indicators styled
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Bundle size optimized (code splitting for optional plugins)

### 12.3 Infrastructure

- [ ] GCS bucket lifecycle policies configured (auto-delete expired uploads)
- [ ] CDN configured for file downloads (optional)
- [ ] Load balancer configured with WebSocket support (if using long-polling)
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules allow TUS traffic
- [ ] Monitoring alerts configured (upload failures, 4xx/5xx errors)
- [ ] Backup strategy for GCS bucket
- [ ] Disaster recovery plan documented

---

## 13. Migration Path

### 13.1 Existing Form.io Deployments

**Phase 1: Parallel Deployment**
1. Deploy TUS server alongside existing file upload system
2. Add feature flag to enable TUS for specific forms
3. Test with non-critical forms first
4. Monitor performance and error rates

**Phase 2: Gradual Migration**
1. Enable TUS for 10% of forms
2. Monitor for 2 weeks
3. Increase to 50% of forms
4. Monitor for 1 week
5. Enable for all new forms

**Phase 3: Full Cutover**
1. Migrate all forms to TUS
2. Deprecate old upload system
3. Remove feature flags
4. Clean up old code

### 13.2 Data Migration

**Existing file references:**
- No migration needed - old URLs remain valid
- New uploads use TUS + GCS
- Both systems coexist indefinitely

**Submission data structure:**
```json
{
  "data": {
    "oldFileField": [
      { "url": "https://old-cdn.com/file.pdf", "storage": "s3" }
    ],
    "newFileField": [
      { "url": "https://storage.googleapis.com/...", "storage": "url" }
    ]
  }
}
```

---

## 14. Future Enhancements

### 14.1 Phase 2 Features

- **Multipart upload optimization:** Switch to GCS multipart upload API for files > 100MB
- **Image processing pipeline:** Automatic thumbnail generation, format conversion
- **Virus scanning:** Integrate with ClamAV or cloud antivirus service
- **Advanced plugins:** Enable Uppy plugins like Dropbox, Google Drive, Instagram
- **Real-time collaboration:** Multiple users uploading to same form simultaneously
- **Upload analytics:** Track upload success rates, average speeds, failure reasons

### 14.2 Phase 3 Features

- **Client-side encryption:** Encrypt files before upload for enhanced security
- **Peer-to-peer transfer:** Use WebRTC for direct browser-to-browser file sharing
- **Progressive Web App:** Service worker for offline upload queueing
- **Smart retry:** ML-based retry strategy based on network conditions
- **Adaptive bitrate:** Adjust chunk size dynamically based on connection speed

---

## 15. Appendix

### 15.1 TypeScript Type Definitions

```typescript
// formio-types.ts

export interface FormioFileComponent {
  type: 'file';
  key: string;
  label: string;
  storage: 'url' | 's3' | 'azure' | 'base64';
  url?: string;
  uploadProtocol?: 'tus' | 'multipart';
  uploadOptions?: TusUploadOptions;
  uppyOptions?: UppyOptions;
  uppyPlugins?: UppyPluginConfig;
  multiple?: boolean;
  webcam?: boolean;
  imagePreview?: boolean;
  validation?: FormioValidation;
  conditional?: FormioConditional;
}

export interface TusUploadOptions {
  endpoint: string;
  chunkSize?: number;
  retryDelays?: number[];
  metadata?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface UppyOptions {
  restrictions?: {
    maxFileSize?: number;
    maxNumberOfFiles?: number;
    minNumberOfFiles?: number;
    allowedFileTypes?: string[];
  };
  autoProceed?: boolean;
  allowMultipleUploads?: boolean;
  debug?: boolean;
}

export interface UppyPluginConfig {
  Dashboard?: UppyDashboardConfig;
  Tus?: UppyTusConfig;
  Webcam?: UppyWebcamConfig;
  ImageEditor?: UppyImageEditorConfig;
  GoldenRetriever?: UppyGoldenRetrieverConfig;
}

export interface UppyDashboardConfig {
  inline?: boolean;
  height?: number;
  showProgressDetails?: boolean;
  hideUploadButton?: boolean;
  note?: string;
}

export interface UppyTusConfig {
  limit?: number;
  withCredentials?: boolean;
  overridePatchMethod?: boolean;
}

export interface UppyWebcamConfig {
  enabled?: boolean;
  modes?: ('picture' | 'video')[];
}

export interface UppyImageEditorConfig {
  enabled?: boolean;
  quality?: number;
}

export interface UppyGoldenRetrieverConfig {
  enabled?: boolean;
  serviceWorker?: boolean;
}

export interface UploadedFile {
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  storage: string;
  uploadId: string;
  uploadedAt: string;
}

export interface FormioValidation {
  required?: boolean;
  custom?: string;
  customPrivate?: string;
}

export interface FormioConditional {
  show?: boolean | null;
  when?: string | null;
  eq?: string;
}
```

### 15.2 Example Form Definitions

**Simple Single Image Upload:**
```json
{
  "components": [
    {
      "type": "file",
      "key": "avatar",
      "label": "Profile Picture",
      "storage": "url",
      "url": "http://localhost:3001/files",
      "uploadOptions": {
        "endpoint": "http://localhost:3001/files"
      },
      "uppyOptions": {
        "restrictions": {
          "maxFileSize": 2097152,
          "allowedFileTypes": ["image/*"]
        }
      },
      "validation": {
        "required": true
      }
    }
  ]
}
```

**Multiple Document Upload with Webcam:**
```json
{
  "components": [
    {
      "type": "file",
      "key": "documents",
      "label": "Supporting Documents",
      "storage": "url",
      "url": "http://localhost:3001/files",
      "multiple": true,
      "uploadOptions": {
        "endpoint": "http://localhost:3001/files"
      },
      "uppyOptions": {
        "restrictions": {
          "maxFileSize": 10485760,
          "maxNumberOfFiles": 10,
          "allowedFileTypes": ["image/*", "application/pdf"]
        }
      },
      "uppyPlugins": {
        "Dashboard": {
          "inline": true,
          "height": 450
        },
        "Webcam": {
          "enabled": true,
          "modes": ["picture"]
        },
        "GoldenRetriever": {
          "enabled": true
        }
      }
    }
  ]
}
```

### 15.3 References

**TUS Protocol:**
- Specification: https://tus.io/protocols/resumable-upload
- JS Client: https://github.com/tus/tus-js-client
- Node Server: https://github.com/tus/tus-node-server

**Uppy:**
- Documentation: https://uppy.io/docs/
- TUS Plugin: https://uppy.io/docs/tus/
- Dashboard Plugin: https://uppy.io/docs/dashboard/
- React Integration: https://uppy.io/docs/react/

**Form.io:**
- Form Renderer: https://github.com/formio/react
- Component Guide: https://help.form.io/developers/form-components
- File Component: https://help.form.io/userguide/forms/form-components#file

**Google Cloud Storage:**
- Node.js Client: https://cloud.google.com/nodejs/docs/reference/storage/latest
- TUS Store: https://github.com/tus/tus-node-server/tree/main/packages/gcs-store

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-09-30 | Hive Mind Architect | Initial architecture design |

---

**END OF ARCHITECTURE DESIGN DOCUMENT**