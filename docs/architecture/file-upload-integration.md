# File Upload Integration Architecture

**Version:** 1.0.0
**Last Updated:** September 30, 2025
**Status:** Design Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Component Interaction Diagrams](#component-interaction-diagrams)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [API Endpoint Specifications](#api-endpoint-specifications)
6. [Database Schema](#database-schema)
7. [Environment Configuration](#environment-configuration)
8. [Security Architecture](#security-architecture)
9. [Performance Optimization](#performance-optimization)
10. [Integration Points](#integration-points)
11. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

### Overview

This document describes the complete architecture for integrating resumable file upload functionality into the Form.io monorepo using Google Cloud Storage (GCS) as the storage backend and the tus protocol for chunked, resumable uploads.

### Key Features

- **Resumable Uploads**: tus protocol implementation for reliable large file transfers
- **Cloud Storage**: GCS integration with emulator support for local development
- **React Components**: Modern TypeScript-based UI components
- **Security**: Role-based access control, file type validation, virus scanning
- **Performance**: Chunked uploads, parallel processing, CDN integration
- **Monitoring**: Upload metrics, error tracking, performance analytics

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Backend** | Form.io Server | 4.5.2 | Core API server |
| **Runtime** | Node.js | ≥20.0.0 | Server runtime |
| **Database** | MongoDB | 6.0 | Metadata storage |
| **Storage** | Google Cloud Storage | latest | File storage |
| **Protocol** | tus | 1.0.0 | Resumable upload protocol |
| **Core Library** | formio-core | latest | Component definitions |
| **React UI** | formio-react | latest | React components |
| **UI Framework** | Uppy.js | 3.x | Upload UI widgets |
| **Test App** | React 19 + Vite | latest | Development testing |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐         ┌──────────────────┐                  │
│  │   React App      │         │   Test App       │                  │
│  │   (Production)   │         │   (Development)  │                  │
│  └────────┬─────────┘         └────────┬─────────┘                  │
│           │                             │                            │
│           └─────────────┬───────────────┘                            │
│                         │                                            │
│           ┌─────────────▼─────────────┐                              │
│           │  formio-react Components  │                              │
│           │  - TusFileUpload          │                              │
│           │  - FileUploadProgress     │                              │
│           │  - FileList               │                              │
│           └─────────────┬─────────────┘                              │
│                         │                                            │
└─────────────────────────┼────────────────────────────────────────────┘
                          │
                          │ HTTPS / tus Protocol
                          │
┌─────────────────────────▼────────────────────────────────────────────┐
│                      Application Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              Form.io Server (Express)                     │       │
│  │  ┌────────────────────────────────────────────────┐      │       │
│  │  │  API Endpoints                                  │      │       │
│  │  │  - POST   /form/:formId/submission/:id/upload  │      │       │
│  │  │  - PATCH  /upload/:uploadId                    │      │       │
│  │  │  - HEAD   /upload/:uploadId                    │      │       │
│  │  │  - DELETE /upload/:uploadId                    │      │       │
│  │  │  - GET    /file/:fileId                        │      │       │
│  │  └────────────────────────────────────────────────┘      │       │
│  │  ┌────────────────────────────────────────────────┐      │       │
│  │  │  Middleware Stack                               │      │       │
│  │  │  - Authentication (JWT)                         │      │       │
│  │  │  - Authorization (RBAC)                         │      │       │
│  │  │  - File Validation                              │      │       │
│  │  │  - Rate Limiting                                │      │       │
│  │  │  - Error Handling                               │      │       │
│  │  └────────────────────────────────────────────────┘      │       │
│  │  ┌────────────────────────────────────────────────┐      │       │
│  │  │  Business Logic                                 │      │       │
│  │  │  - TusUploadHandler                             │      │       │
│  │  │  - GCSStorageProvider                           │      │       │
│  │  │  - FileMetadataManager                          │      │       │
│  │  │  - SubmissionIntegration                        │      │       │
│  │  └────────────────────────────────────────────────┘      │       │
│  └──────────────────────────────────────────────────────────┘       │
│                         │                │                           │
└─────────────────────────┼────────────────┼───────────────────────────┘
                          │                │
                          │                │
┌─────────────────────────▼──────┐  ┌──────▼──────────────────────────┐
│      Data Layer                │  │      Storage Layer              │
├────────────────────────────────┤  ├─────────────────────────────────┤
│                                │  │                                 │
│  ┌──────────────────────────┐ │  │  ┌───────────────────────────┐ │
│  │  MongoDB                  │ │  │  │  Google Cloud Storage     │ │
│  │  - File metadata          │ │  │  │  - Actual file data       │ │
│  │  - Upload sessions        │ │  │  │  - Chunked storage        │ │
│  │  - Form submissions       │ │  │  │  - Signed URLs            │ │
│  │  - User permissions       │ │  │  │  - Lifecycle policies     │ │
│  └──────────────────────────┘ │  │  └───────────────────────────┘ │
│                                │  │                                 │
│  Collections:                  │  │  Buckets:                       │
│  - files                       │  │  - formio-uploads (prod)        │
│  - uploadSessions              │  │  - local-formio-uploads (dev)   │
│  - submissions                 │  │                                 │
└────────────────────────────────┘  └─────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     formio-core Library                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  /src/experimental/components/fileupload/                            │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  FileUpload.ts                                              │     │
│  │  - Component definition                                     │     │
│  │  - Validation schema                                        │     │
│  │  - Value normalization                                      │     │
│  │  - Event handlers                                           │     │
│  └────────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  FileUploadTypes.ts                                         │     │
│  │  - TypeScript interfaces                                    │     │
│  │  - Type guards                                              │     │
│  │  - Validation types                                         │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ imports
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                     formio-react Library                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  /src/components/TusFileUpload/                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  TusFileUpload.tsx                                          │     │
│  │  - React wrapper component                                  │     │
│  │  - Uppy.js integration                                      │     │
│  │  - Progress tracking                                        │     │
│  │  - Error handling                                           │     │
│  │  - Drag & drop UI                                           │     │
│  └────────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  useTusUpload.ts                                            │     │
│  │  - React hooks                                              │     │
│  │  - State management                                         │     │
│  │  - Upload lifecycle                                         │     │
│  └────────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  FilePreview.tsx                                            │     │
│  │  - Image/video preview                                      │     │
│  │  - File metadata display                                    │     │
│  │  - Download handling                                        │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagrams

### Upload Lifecycle Sequence

```
┌──────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌─────┐
│Client│  │ Form.io  │  │   Upload   │  │   GCS    │  │ DB  │
│  UI  │  │  Server  │  │  Handler   │  │ Provider │  │     │
└──┬───┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘  └──┬──┘
   │           │               │              │           │
   │ 1. POST   │               │              │           │
   │  /upload  │               │              │           │
   ├──────────>│               │              │           │
   │           │ 2. Validate   │              │           │
   │           │    JWT Token  │              │           │
   │           ├──────────────────────────────────────────>│
   │           │               │              │           │
   │           │ 3. Check      │              │           │
   │           │    Permissions│              │           │
   │           │<───────────────────────────────────────────│
   │           │               │              │           │
   │           │ 4. Create     │              │           │
   │           │    Upload     │              │           │
   │           │    Session    │              │           │
   │           ├──────────────>│              │           │
   │           │               │ 5. Initialize│           │
   │           │               │    GCS Upload│           │
   │           │               ├─────────────>│           │
   │           │               │              │ 6. Create │
   │           │               │              │    Resumable│
   │           │               │              │    Upload │
   │           │               │<─────────────┤           │
   │           │               │ 7. Store     │           │
   │           │               │    Session   │           │
   │           │               ├──────────────────────────>│
   │           │ 8. Return     │              │           │
   │           │    Upload URL │              │           │
   │           │<──────────────┤              │           │
   │ 9. Upload │               │              │           │
   │    URL +  │               │              │           │
   │    Offset │               │              │           │
   │<──────────┤               │              │           │
   │           │               │              │           │
   │ 10. PATCH │               │              │           │
   │  /upload/ │               │              │           │
   │  {chunk}  │               │              │           │
   ├──────────>│ 11. Process   │              │           │
   │           │     Chunk     │              │           │
   │           ├──────────────>│ 12. Upload   │           │
   │           │               │     to GCS   │           │
   │           │               ├─────────────>│           │
   │           │               │              │ 13. Store │
   │           │               │<─────────────┤    Chunk  │
   │           │               │ 14. Update   │           │
   │           │               │     Progress │           │
   │           │               ├──────────────────────────>│
   │           │ 15. Return    │              │           │
   │           │     Offset    │              │           │
   │           │<──────────────┤              │           │
   │ 16. New   │               │              │           │
   │    Offset │               │              │           │
   │<──────────┤               │              │           │
   │           │               │              │           │
   │  [Repeat 10-16 for remaining chunks]     │           │
   │           │               │              │           │
   │ 17. PATCH │               │              │           │
   │  (Final)  │               │              │           │
   ├──────────>│ 18. Finalize  │              │           │
   │           │     Upload    │              │           │
   │           ├──────────────>│ 19. Complete │           │
   │           │               │     GCS      │           │
   │           │               ├─────────────>│           │
   │           │               │              │ 20. Mark  │
   │           │               │<─────────────┤    Complete│
   │           │               │ 21. Create   │           │
   │           │               │     File     │           │
   │           │               │     Record   │           │
   │           │               ├──────────────────────────>│
   │           │ 22. Return    │              │           │
   │           │     File ID   │              │           │
   │           │<──────────────┤              │           │
   │ 23. File  │               │              │           │
   │    Data   │               │              │           │
   │<──────────┤               │              │           │
   │           │               │              │           │
```

### Authentication & Authorization Flow

```
┌──────┐  ┌──────────┐  ┌────────────┐  ┌─────┐
│Client│  │   Auth   │  │Permission  │  │ DB  │
│      │  │Middleware│  │  Handler   │  │     │
└──┬───┘  └────┬─────┘  └─────┬──────┘  └──┬──┘
   │           │               │            │
   │ 1. Upload │               │            │
   │    Request│               │            │
   │    + JWT  │               │            │
   ├──────────>│               │            │
   │           │ 2. Verify JWT │            │
   │           │    Signature  │            │
   │           ├───────────────────────────>│
   │           │ 3. User Data  │            │
   │           │<───────────────────────────┤
   │           │               │            │
   │           │ 4. Check User │            │
   │           │    Permissions│            │
   │           ├──────────────>│            │
   │           │               │ 5. Load    │
   │           │               │    Roles   │
   │           │               ├───────────>│
   │           │               │ 6. Roles   │
   │           │               │<───────────┤
   │           │               │            │
   │           │               │ 7. Check   │
   │           │               │    Form    │
   │           │               │    Access  │
   │           │               ├───────────>│
   │           │               │ 8. Access  │
   │           │               │    Rules   │
   │           │               │<───────────┤
   │           │               │            │
   │           │ 9. Authorized │            │
   │           │<──────────────┤            │
   │           │               │            │
   │ 10. Continue              │            │
   │    to Upload              │            │
   │    Handler                │            │
   │<──────────┤               │            │
```

---

## Data Flow Diagrams

### File Upload Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Flow                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐                                                   │
│  │  Client  │                                                   │
│  │  Browser │                                                   │
│  └────┬─────┘                                                   │
│       │                                                         │
│       │ File Metadata                                           │
│       │ {name, size, type, lastModified}                        │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────────┐                               │
│  │   React Component           │                               │
│  │   (TusFileUpload)           │                               │
│  │                             │                               │
│  │  - Validate file            │                               │
│  │  - Calculate chunks         │                               │
│  │  - Create upload session    │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ Upload Initialization                             │
│             │ {formId, fieldName, fileName, fileSize, fileType} │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   Form.io API               │                               │
│  │   POST /upload/init         │                               │
│  │                             │                               │
│  │  - Authenticate user        │                               │
│  │  - Validate permissions     │                               │
│  │  - Create upload session    │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ Upload Session                                    │
│             │ {uploadId, uploadUrl, offset: 0}                  │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   MongoDB                   │                               │
│  │   uploadSessions collection │                               │
│  │                             │                               │
│  │  {                          │                               │
│  │    _id: uploadId,           │                               │
│  │    userId: ObjectId,        │                               │
│  │    formId: ObjectId,        │                               │
│  │    fieldName: string,       │                               │
│  │    fileName: string,        │                               │
│  │    fileSize: number,        │                               │
│  │    fileType: string,        │                               │
│  │    offset: 0,               │                               │
│  │    gcsUploadUrl: string,    │                               │
│  │    status: 'active',        │                               │
│  │    createdAt: Date          │                               │
│  │  }                          │                               │
│  └─────────────────────────────┘                               │
│             │                                                   │
│             │ Session Created                                   │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   Client Chunks File        │                               │
│  │   (Uppy.js)                 │                               │
│  │                             │                               │
│  │  for chunk in chunks:       │                               │
│  │    PATCH /upload/{id}       │                               │
│  │      {chunk data}           │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ Chunk N (bytes)                                   │
│             │ Headers: {Upload-Offset, Content-Length}          │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   GCS Provider              │                               │
│  │   (GCSStorageProvider)      │                               │
│  │                             │                               │
│  │  - Verify offset            │                               │
│  │  - Write chunk to GCS       │                               │
│  │  - Update offset            │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ Store Chunk                                       │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   Google Cloud Storage      │                               │
│  │   Bucket: formio-uploads    │                               │
│  │                             │                               │
│  │   Path: uploads/{year}/     │                               │
│  │         {month}/{uploadId}  │                               │
│  │                             │                               │
│  │   - Resumable upload        │                               │
│  │   - Chunk appending         │                               │
│  │   - Eventual consistency    │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ Chunk Stored                                      │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   Update Session            │                               │
│  │   MongoDB                   │                               │
│  │                             │                               │
│  │   UPDATE uploadSessions     │                               │
│  │   SET offset = newOffset    │                               │
│  │   WHERE _id = uploadId      │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ [Repeat for all chunks]                           │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   Final Chunk Received      │                               │
│  │   (offset == fileSize)      │                               │
│  │                             │                               │
│  │  - Finalize GCS upload      │                               │
│  │  - Generate signed URL      │                               │
│  │  - Create file record       │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ File Complete                                     │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   MongoDB files collection  │                               │
│  │                             │                               │
│  │  {                          │                               │
│  │    _id: fileId,             │                               │
│  │    uploadId: uploadId,      │                               │
│  │    userId: ObjectId,        │                               │
│  │    formId: ObjectId,        │                               │
│  │    fieldName: string,       │                               │
│  │    fileName: string,        │                               │
│  │    fileSize: number,        │                               │
│  │    fileType: string,        │                               │
│  │    gcsPath: string,         │                               │
│  │    gcsUrl: string,          │                               │
│  │    md5Hash: string,         │                               │
│  │    status: 'completed',     │                               │
│  │    uploadedAt: Date         │                               │
│  │  }                          │                               │
│  └──────────┬──────────────────┘                               │
│             │                                                   │
│             │ File Metadata                                     │
│             │                                                   │
│             ▼                                                   │
│  ┌─────────────────────────────┐                               │
│  │   Submission Integration    │                               │
│  │                             │                               │
│  │  - Add fileId to submission │                               │
│  │  - Update form data         │                               │
│  │  - Trigger actions          │                               │
│  └─────────────────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoint Specifications

### 1. Initialize Upload

**Endpoint:** `POST /form/:formId/submission/:submissionId/upload`

**Purpose:** Create a new upload session

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

**Request Body:**
```json
{
  "fieldName": "documentUpload",
  "fileName": "annual-report-2025.pdf",
  "fileSize": 52428800,
  "fileType": "application/pdf",
  "metadata": {
    "description": "Annual financial report",
    "category": "financial"
  }
}
```

**Response (201 Created):**
```json
{
  "uploadId": "65abc123def4567890abcdef",
  "uploadUrl": "/upload/65abc123def4567890abcdef",
  "offset": 0,
  "expiresAt": "2025-09-30T18:15:00Z",
  "chunkSize": 5242880,
  "maxFileSize": 104857600
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file metadata
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: No permission to upload to this form
- `413 Payload Too Large`: File size exceeds limit
- `415 Unsupported Media Type`: File type not allowed

---

### 2. Upload Chunk

**Endpoint:** `PATCH /upload/:uploadId`

**Purpose:** Upload a file chunk

**Request Headers:**
```
Content-Type: application/offset+octet-stream
Upload-Offset: 0
Content-Length: 5242880
Tus-Resumable: 1.0.0
Authorization: Bearer {JWT_TOKEN}
```

**Request Body:** Binary chunk data

**Response (204 No Content):**
```
Upload-Offset: 5242880
Tus-Resumable: 1.0.0
```

**Error Responses:**
- `400 Bad Request`: Invalid offset
- `401 Unauthorized`: Missing or invalid JWT
- `404 Not Found`: Upload session not found
- `409 Conflict`: Offset mismatch
- `410 Gone`: Upload session expired

---

### 3. Check Upload Status

**Endpoint:** `HEAD /upload/:uploadId`

**Purpose:** Get current upload progress

**Request Headers:**
```
Tus-Resumable: 1.0.0
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```
Upload-Offset: 10485760
Upload-Length: 52428800
Tus-Resumable: 1.0.0
Cache-Control: no-store
```

---

### 4. Delete Upload

**Endpoint:** `DELETE /upload/:uploadId`

**Purpose:** Cancel and delete an upload session

**Request Headers:**
```
Tus-Resumable: 1.0.0
Authorization: Bearer {JWT_TOKEN}
```

**Response (204 No Content):**
```
Tus-Resumable: 1.0.0
```

---

### 5. Download File

**Endpoint:** `GET /file/:fileId`

**Purpose:** Download a completed file

**Request Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="annual-report-2025.pdf"
Content-Length: 52428800
Cache-Control: private, max-age=3600
ETag: "abc123def456"
```

**Response Body:** File data stream

---

### 6. Get File Metadata

**Endpoint:** `GET /file/:fileId/metadata`

**Purpose:** Get file information without downloading

**Request Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response (200 OK):**
```json
{
  "fileId": "65abc123def4567890abcdef",
  "fileName": "annual-report-2025.pdf",
  "fileSize": 52428800,
  "fileType": "application/pdf",
  "uploadedAt": "2025-09-30T17:15:00Z",
  "uploadedBy": {
    "userId": "65abc000def0000000abcdef",
    "email": "admin@local.test"
  },
  "formId": "65abc111def1111111abcdef",
  "submissionId": "65abc222def2222222abcdef",
  "fieldName": "documentUpload",
  "gcsUrl": "https://storage.googleapis.com/...",
  "md5Hash": "abc123...",
  "status": "completed",
  "metadata": {
    "description": "Annual financial report",
    "category": "financial"
  }
}
```

---

## Database Schema

### MongoDB Collections

#### 1. files Collection

Stores metadata for completed file uploads.

```javascript
{
  _id: ObjectId("65abc123def4567890abcdef"),

  // Upload Information
  uploadId: ObjectId("65abc456def7890123abcdef"),
  userId: ObjectId("65abc000def0000000abcdef"),

  // Form Context
  formId: ObjectId("65abc111def1111111abcdef"),
  submissionId: ObjectId("65abc222def2222222abcdef"),
  fieldName: "documentUpload",

  // File Metadata
  fileName: "annual-report-2025.pdf",
  originalName: "Annual Report 2025 (DRAFT).pdf",
  fileSize: 52428800,
  fileType: "application/pdf",
  mimeType: "application/pdf",

  // Storage Information
  storageProvider: "gcs",
  gcsPath: "uploads/2025/09/65abc123def4567890abcdef",
  gcsBucket: "formio-uploads",
  gcsUrl: "https://storage.googleapis.com/formio-uploads/...",

  // Security
  md5Hash: "abc123def456...",
  sha256Hash: "def789abc012...",
  virusScanStatus: "clean", // clean, infected, pending, error
  virusScanDate: ISODate("2025-09-30T17:15:00Z"),

  // Status
  status: "completed", // uploading, completed, failed, deleted

  // Access Control
  accessLevel: "private", // public, private, authenticated
  allowedRoles: [ObjectId("65abc333def3333333abcdef")],

  // Custom Metadata
  metadata: {
    description: "Annual financial report",
    category: "financial",
    tags: ["2025", "financial", "annual"]
  },

  // Timestamps
  createdAt: ISODate("2025-09-30T17:10:00Z"),
  uploadedAt: ISODate("2025-09-30T17:15:00Z"),
  updatedAt: ISODate("2025-09-30T17:15:00Z"),

  // Lifecycle
  expiresAt: null, // null = never expires
  deletedAt: null,

  // Analytics
  downloadCount: 0,
  lastAccessedAt: null
}
```

**Indexes:**
```javascript
db.files.createIndex({ uploadId: 1 }, { unique: true });
db.files.createIndex({ formId: 1, submissionId: 1 });
db.files.createIndex({ userId: 1 });
db.files.createIndex({ status: 1 });
db.files.createIndex({ createdAt: 1 });
db.files.createIndex({ expiresAt: 1 }, {
  partialFilterExpression: { expiresAt: { $ne: null } }
});
```

---

#### 2. uploadSessions Collection

Stores active upload sessions for resumability.

```javascript
{
  _id: ObjectId("65abc456def7890123abcdef"),

  // User Context
  userId: ObjectId("65abc000def0000000abcdef"),

  // Form Context
  formId: ObjectId("65abc111def1111111abcdef"),
  submissionId: ObjectId("65abc222def2222222abcdef"),
  fieldName: "documentUpload",

  // File Information
  fileName: "annual-report-2025.pdf",
  fileSize: 52428800,
  fileType: "application/pdf",

  // Upload Progress
  offset: 10485760, // bytes uploaded
  chunkSize: 5242880, // 5MB chunks

  // GCS Information
  gcsUploadUrl: "https://storage.googleapis.com/upload/...",
  gcsPath: "uploads/2025/09/65abc456def7890123abcdef",
  gcsBucket: "formio-uploads",

  // Status
  status: "active", // active, completed, failed, expired, cancelled

  // Session Management
  createdAt: ISODate("2025-09-30T17:10:00Z"),
  updatedAt: ISODate("2025-09-30T17:12:00Z"),
  expiresAt: ISODate("2025-09-30T18:10:00Z"), // 1 hour TTL
  lastChunkAt: ISODate("2025-09-30T17:12:00Z"),

  // Error Tracking
  errorCount: 0,
  lastError: null,

  // Metadata
  metadata: {
    clientIp: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    uploadSource: "web" // web, mobile, api
  }
}
```

**Indexes:**
```javascript
db.uploadSessions.createIndex({ userId: 1 });
db.uploadSessions.createIndex({ status: 1 });
db.uploadSessions.createIndex({ expiresAt: 1 }, {
  expireAfterSeconds: 0
}); // TTL index
db.uploadSessions.createIndex({ formId: 1, submissionId: 1 });
```

---

#### 3. submissions Collection (Extension)

Add file references to existing submissions.

```javascript
{
  _id: ObjectId("65abc222def2222222abcdef"),

  // Existing fields...
  form: ObjectId("65abc111def1111111abcdef"),
  owner: ObjectId("65abc000def0000000abcdef"),

  data: {
    // Other form fields...

    documentUpload: [
      {
        fileId: ObjectId("65abc123def4567890abcdef"),
        fileName: "annual-report-2025.pdf",
        fileSize: 52428800,
        fileType: "application/pdf",
        uploadedAt: ISODate("2025-09-30T17:15:00Z"),
        url: "/file/65abc123def4567890abcdef"
      }
    ]
  },

  // Existing timestamps...
  created: ISODate("2025-09-30T17:10:00Z"),
  modified: ISODate("2025-09-30T17:15:00Z")
}
```

---

## Environment Configuration

### Required Environment Variables

#### Production Configuration

```bash
# MongoDB Configuration
MONGO=mongodb://user:pass@prod-mongo.example.com:27017/formioapp?authSource=admin
MONGO_HIGH_AVAILABILITY=1
MONGO_REPLICA_SET=rs0

# JWT Secrets
JWT_SECRET=<strong-random-secret-256-bits>
DB_SECRET=<strong-random-secret-256-bits>

# Google Cloud Storage
FORMIO_FILES_SERVER=gcs
GCS_PROJECT_ID=my-formio-project
GCS_BUCKET=formio-uploads-prod
GCS_CREDENTIALS_PATH=/app/secrets/gcs-credentials.json

# File Upload Configuration
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif,mp4,mov
CHUNK_SIZE=5242880  # 5MB
UPLOAD_SESSION_TTL=3600  # 1 hour

# Security
ENABLE_VIRUS_SCAN=true
VIRUS_SCAN_PROVIDER=clamav
VIRUS_SCAN_URL=http://clamav:3310

# Performance
ENABLE_CDN=true
CDN_URL=https://cdn.example.com
ENABLE_FILE_CACHE=true
FILE_CACHE_TTL=3600

# Monitoring
ENABLE_UPLOAD_METRICS=true
SENTRY_DSN=https://...@sentry.io/...

# CORS Configuration
CORS_ORIGIN=https://app.example.com,https://admin.example.com

# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
```

---

#### Development Configuration

```bash
# MongoDB Configuration
MONGO=mongodb://mongodb:27017/formioapp

# JWT Secrets (DEVELOPMENT ONLY!)
JWT_SECRET=local-dev-secret-change-me-in-production
DB_SECRET=local-dev-db-secret-change-me

# GCS Emulator (local development)
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=http://gcs-emulator:4443
FORMIO_S3_BUCKET=local-formio-uploads
FORMIO_S3_REGION=auto
FORMIO_S3_KEY=local-access-key
FORMIO_S3_SECRET=local-secret-key

# File Upload Configuration
MAX_FILE_SIZE=52428800  # 50MB
ALLOWED_FILE_TYPES=*  # Allow all types in dev
CHUNK_SIZE=5242880  # 5MB
UPLOAD_SESSION_TTL=3600  # 1 hour

# Security (disabled for development)
ENABLE_VIRUS_SCAN=false

# Performance
ENABLE_CDN=false
ENABLE_FILE_CACHE=false

# Monitoring
ENABLE_UPLOAD_METRICS=true
DEBUG=formio:*

# CORS Configuration
CORS_ORIGIN=http://localhost:64849,http://localhost:3000

# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
```

---

### GCS Configuration Files

#### Production (gcs-credentials.json)

```json
{
  "type": "service_account",
  "project_id": "my-formio-project",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "formio-uploader@my-formio-project.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Required GCS Permissions:**
- `storage.objects.create`
- `storage.objects.get`
- `storage.objects.delete`
- `storage.objects.list`

---

## Security Architecture

### Authentication Flow

```
┌────────────┐
│   Client   │
└──────┬─────┘
       │
       │ 1. Login
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────────┐          ┌──────────────┐
│  Form.io Auth   │          │   MongoDB    │
│   /auth/login   │          │   (users)    │
└────────┬────────┘          └──────────────┘
         │
         │ 2. JWT Token
         │    {userId, roles, exp}
         │
         ▼
┌─────────────────┐
│   Client        │
│   Stores JWT    │
└────────┬────────┘
         │
         │ 3. Upload Request
         │    + JWT in Authorization header
         │
         ▼
┌─────────────────┐
│  Token          │
│  Middleware     │
│  - Verify JWT   │
│  - Extract user │
└────────┬────────┘
         │
         │ 4. Validated User Context
         │
         ▼
┌─────────────────┐
│  Permission     │
│  Handler        │
│  - Check roles  │
│  - Verify form  │
│    access       │
└────────┬────────┘
         │
         │ 5. Authorized
         │
         ▼
┌─────────────────┐
│  Upload         │
│  Handler        │
└─────────────────┘
```

### File Validation

```javascript
// Multi-layer validation
const fileValidation = {
  // 1. Client-side (pre-upload)
  client: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    validate: (file) => {
      if (file.size > maxFileSize) throw new Error('File too large');
      if (!allowedTypes.includes(getExtension(file.name))) {
        throw new Error('File type not allowed');
      }
    }
  },

  // 2. Server-side (during upload)
  server: {
    checkMimeType: (buffer) => {
      // Use magic bytes, not just extension
      const mimeType = getMimeTypeFromBuffer(buffer);
      return allowedMimeTypes.includes(mimeType);
    },
    checkFileSize: (size) => {
      return size <= MAX_FILE_SIZE;
    }
  },

  // 3. Virus scanning (post-upload)
  virusScan: {
    provider: 'clamav',
    url: process.env.VIRUS_SCAN_URL,
    scan: async (filePath) => {
      const result = await clamav.scan(filePath);
      return result.isClean;
    }
  }
};
```

### Access Control Matrix

| Role | Create Upload | Upload Chunk | View File | Download File | Delete File |
|------|---------------|--------------|-----------|---------------|-------------|
| **Anonymous** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Authenticated** | ✅* | ✅* | ✅* | ✅* | ❌ |
| **Form Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

*Only for their own uploads

### Data Encryption

```
┌─────────────────────────────────────────────────────────┐
│               Encryption Layers                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. HTTPS/TLS                                           │
│     └─ Transport encryption (Client ↔ Server)          │
│                                                         │
│  2. JWT Tokens                                          │
│     └─ Signed with HS256 (shared secret)               │
│                                                         │
│  3. Database Encryption                                 │
│     └─ MongoDB encryption at rest                      │
│                                                         │
│  4. GCS Server-Side Encryption                          │
│     └─ Google-managed encryption keys (default)        │
│     └─ Customer-managed keys (optional)                │
│                                                         │
│  5. Signed URLs                                         │
│     └─ Time-limited access tokens                      │
│     └─ Prevents unauthorized downloads                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Chunked Upload Strategy

```javascript
const chunkStrategy = {
  // Dynamic chunk sizing based on network speed
  calculateOptimalChunkSize: (networkSpeed) => {
    if (networkSpeed < 1) return 1 * MB;      // < 1 Mbps: 1MB chunks
    if (networkSpeed < 10) return 5 * MB;     // < 10 Mbps: 5MB chunks
    if (networkSpeed < 100) return 10 * MB;   // < 100 Mbps: 10MB chunks
    return 20 * MB;                           // >= 100 Mbps: 20MB chunks
  },

  // Parallel chunk uploads
  maxParallelChunks: 3,

  // Retry strategy
  maxRetries: 3,
  retryDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000),

  // Progress tracking
  reportProgressEvery: 1000 // ms
};
```

### Caching Strategy

```javascript
const cacheStrategy = {
  // File metadata caching
  metadata: {
    provider: 'redis',
    ttl: 3600, // 1 hour
    keyPattern: 'file:metadata:{fileId}'
  },

  // Upload session caching
  sessions: {
    provider: 'redis',
    ttl: 3600, // 1 hour
    keyPattern: 'upload:session:{uploadId}'
  },

  // CDN for file downloads
  cdn: {
    enabled: true,
    provider: 'cloudflare',
    ttl: 86400, // 24 hours
    purgeOnUpdate: true
  }
};
```

### Database Optimization

```javascript
// Compound indexes for common queries
db.files.createIndex({ formId: 1, submissionId: 1, status: 1 });
db.files.createIndex({ userId: 1, createdAt: -1 });

// Projection to reduce data transfer
const fileMetadata = await db.files.findOne(
  { _id: fileId },
  { projection: { fileName: 1, fileSize: 1, fileType: 1, gcsUrl: 1 } }
);

// Aggregation pipeline for analytics
const uploadStats = await db.files.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: {
    _id: '$formId',
    totalFiles: { $sum: 1 },
    totalSize: { $sum: '$fileSize' },
    avgSize: { $avg: '$fileSize' }
  }}
]);
```

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Upload Initiation** | < 200ms | Time to create session |
| **Chunk Upload** | < 500ms | Time per 5MB chunk |
| **Download Initiation** | < 100ms | Time to generate signed URL |
| **File Metadata Fetch** | < 50ms | MongoDB query time |
| **Concurrent Uploads** | 100+ | Per server instance |
| **Storage Throughput** | 1 GB/s | GCS write speed |

---

## Integration Points

### Form.io Core Integration

```typescript
// formio-core/src/experimental/components/fileupload/FileUpload.ts

import { Component } from '../../base/Component';
import type { FileUploadConfig, FileValue } from './FileUploadTypes';

export class FileUpload extends Component {
  static schema: ComponentSchema = {
    type: 'fileupload',
    label: 'File Upload',
    key: 'fileUpload',
    storage: 'gcs',
    url: '/upload',
    options: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['*'],
      multiple: true,
      resumable: true
    }
  };

  // Integration with form validation
  validate(value: FileValue[]): ValidationResult {
    // Validate file count
    if (this.component.multiple === false && value.length > 1) {
      return { valid: false, error: 'Only one file allowed' };
    }

    // Validate file sizes
    const totalSize = value.reduce((sum, f) => sum + f.fileSize, 0);
    if (totalSize > this.component.options.maxFileSize) {
      return { valid: false, error: 'Total file size exceeds limit' };
    }

    return { valid: true };
  }

  // Integration with form submission
  async normalize(value: any): Promise<FileValue[]> {
    // Ensure files are uploaded before form submission
    if (Array.isArray(value)) {
      return value.filter(f => f.status === 'completed');
    }
    return [];
  }
}
```

### React Component Integration

```typescript
// formio-react/src/components/TusFileUpload/TusFileUpload.tsx

import React from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import { Dashboard } from '@uppy/react';

export const TusFileUpload: React.FC<TusFileUploadProps> = ({
  formId,
  submissionId,
  fieldName,
  options,
  onComplete
}) => {
  const uppy = useUppy(() => {
    return new Uppy({
      restrictions: {
        maxFileSize: options.maxFileSize,
        allowedFileTypes: options.allowedTypes
      }
    }).use(Tus, {
      endpoint: `/form/${formId}/submission/${submissionId}/upload`,
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      },
      chunkSize: 5 * 1024 * 1024, // 5MB
      resume: true,
      retryDelays: [0, 1000, 3000, 5000]
    });
  });

  uppy.on('complete', (result) => {
    const files = result.successful.map(f => ({
      fileId: f.response.body.fileId,
      fileName: f.name,
      fileSize: f.size,
      fileType: f.type,
      url: f.response.body.url
    }));

    onComplete(files);
  });

  return <Dashboard uppy={uppy} />;
};
```

### Submission Integration

```javascript
// formio/src/middleware/submissionHandler.js

const processFileFields = async (submission, form) => {
  const fileFields = getFileUploadComponents(form);

  for (const field of fileFields) {
    const files = submission.data[field.key];

    if (files && Array.isArray(files)) {
      // Verify all files are uploaded and accessible
      for (const file of files) {
        const fileRecord = await db.files.findOne({ _id: file.fileId });

        if (!fileRecord || fileRecord.status !== 'completed') {
          throw new Error(`File ${file.fileName} not ready`);
        }

        // Update file metadata with submission reference
        await db.files.updateOne(
          { _id: file.fileId },
          { $set: { submissionId: submission._id } }
        );
      }
    }
  }
};
```

---

## Deployment Strategy

### Phase 1: Local Development (Current)

```
✅ Status: Complete
- Docker Compose setup
- GCS emulator
- MongoDB local
- Form.io server local
- Test app
```

### Phase 2: Component Development

```
📋 Status: Design Complete, Ready for Implementation
- formio-core FileUpload component
- formio-react TusFileUpload wrapper
- Server-side upload handlers
- GCS provider implementation
```

### Phase 3: Testing & Validation

```
🔜 Status: Pending
- Unit tests
- Integration tests
- E2E tests
- Performance tests
- Security audit
```

### Phase 4: Staging Deployment

```
🔜 Status: Planned
- GCS production bucket
- CloudSQL MongoDB
- Kubernetes deployment
- Load testing
```

### Phase 5: Production Release

```
🔜 Status: Planned
- Blue-green deployment
- Monitoring setup
- CDN configuration
- Backup procedures
- Rollback plan
```

---

## Appendices

### A. Glossary

- **tus**: Resumable upload protocol
- **GCS**: Google Cloud Storage
- **JWT**: JSON Web Token
- **RBAC**: Role-Based Access Control
- **CDN**: Content Delivery Network
- **TTL**: Time To Live

### B. References

- [tus Protocol Specification](https://tus.io/protocols/resumable-upload.html)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Form.io API Documentation](https://help.form.io/developers/)
- [Uppy.js Documentation](https://uppy.io/docs/)

### C. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-09-30 | Initial architecture design |

---

**Document Status:** ✅ Complete
**Next Review Date:** 2025-10-07
**Owner:** System Architecture Team