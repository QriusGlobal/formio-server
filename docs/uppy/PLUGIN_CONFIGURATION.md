# Uppy.js Plugin Configuration Reference

**Version:** 1.0.0
**Last Updated:** September 30, 2025

Complete reference for configuring all Uppy plugins.

---

## Table of Contents

1. [Upload Plugins](#upload-plugins)
2. [UI Plugins](#ui-plugins)
3. [Acquirer Plugins](#acquirer-plugins)
4. [Processing Plugins](#processing-plugins)
5. [Helper Plugins](#helper-plugins)
6. [Security Configuration](#security-configuration)
7. [Provider Setup](#provider-setup)
8. [Custom Plugin Development](#custom-plugin-development)

---

## Upload Plugins

### TUS Plugin

**Purpose:** Resumable uploads via TUS protocol

**Installation:**
```bash
npm install @uppy/tus
```

**Configuration:**
```typescript
uppy.use(Tus, {
  // Required
  endpoint: 'https://tusd.example.com/files/',

  // Chunk configuration
  chunkSize: 5 * 1024 * 1024,                    // 5MB (default: Infinity)

  // Retry strategy
  retryDelays: [0, 1000, 3000, 5000, 10000],     // Exponential backoff

  // Parallel uploads
  limit: 3,                                       // Max concurrent uploads

  // Headers
  headers: {
    Authorization: 'Bearer token123',
    'X-Custom-Header': 'value'
  },

  // TUS options
  removeFingerprintOnSuccess: true,              // Clear resume data after success
  storeFingerprintForResuming: true,             // Enable resuming (requires localStorage)
  uploadDataDuringCreation: false,               // Include data in POST request
  useFastRemoteRetry: true,                      // Skip HEAD request on retry
  overridePatchMethod: false,                    // Use POST instead of PATCH

  // Callbacks
  onProgress: (bytesUploaded, bytesTotal) => {},
  onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {},
  onSuccess: () => {},
  onError: (error) => {},

  // Advanced
  withCredentials: true,                         // Send cookies
  allowedMetaFields: ['name', 'type', 'size']   // Metadata fields to include
})
```

**Use Cases:**
- Large file uploads (> 50MB)
- Unreliable network conditions
- Mobile uploads
- Video/media files
- Medical imaging
- Backup systems

**Example: Production TUS:**
```typescript
uppy.use(Tus, {
  endpoint: process.env.TUS_ENDPOINT,
  chunkSize: 10 * 1024 * 1024, // 10MB for large files
  retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
  limit: 2, // Limit for large files

  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    'X-Upload-Source': 'web-app',
    'X-User-ID': user.id
  },

  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: true,
  useFastRemoteRetry: true,

  onError: (error) => {
    Sentry.captureException(error)
    console.error('TUS upload failed:', error)
  }
})
```

### XHR Upload Plugin

**Purpose:** Traditional HTTP multipart uploads

**Installation:**
```bash
npm install @uppy/xhr-upload
```

**Configuration:**
```typescript
uppy.use(XHRUpload, {
  // Required
  endpoint: 'https://api.example.com/upload',

  // HTTP method
  method: 'POST',                                // POST or PUT

  // Form configuration
  formData: true,                                // Use FormData API
  fieldName: 'files',                            // Field name for files

  // Multiple files
  bundle: false,                                 // Send files individually

  // Headers
  headers: {
    Authorization: 'Bearer token123'
  },

  // Parallel uploads
  limit: 5,

  // Timeout
  timeout: 30000,                                // 30 seconds

  // Response handling
  getResponseData: (responseText, response) => {
    return JSON.parse(responseText)
  },

  getResponseError: (responseText, response) => {
    const error = JSON.parse(responseText)
    return new Error(error.message)
  },

  // Callbacks
  onBeforeRequest: (xhr, retryCount) => {},
  onAfterResponse: (xhr, retryCount) => {},

  // Retry configuration
  shouldRetry: (xhr) => {
    const status = xhr.status
    return status === 0 || (status >= 500 && status < 600)
  },

  retryDelays: [0, 1000, 3000, 5000],

  // Advanced
  withCredentials: true,
  responseType: 'json'
})
```

**Use Cases:**
- Small to medium files (< 50MB)
- Simple upload requirements
- Legacy server support
- Quick prototyping
- No resumable upload needed

**Example: Multi-file Bundle Upload:**
```typescript
uppy.use(XHRUpload, {
  endpoint: '/api/upload',
  method: 'POST',
  formData: true,
  fieldName: 'files',
  bundle: true, // Send all files in one request

  headers: {
    'X-CSRF-Token': csrfToken
  },

  getResponseData: (responseText) => {
    const response = JSON.parse(responseText)
    return response.files // Array of uploaded file info
  }
})
```

### AWS S3 Plugin

**Purpose:** Direct uploads to Amazon S3

**Installation:**
```bash
npm install @uppy/aws-s3
```

**Configuration:**
```typescript
uppy.use(AwsS3, {
  // Multipart uploads for large files
  shouldUseMultipart: (file) => file.size > 100 * 1024 * 1024, // > 100MB

  // Option 1: Use Companion server
  companionUrl: 'https://companion.uppy.io',
  companionHeaders: {
    Authorization: 'Bearer token123'
  },

  // Option 2: Generate presigned URLs directly
  getUploadParameters: async (file) => {
    const response = await fetch('/s3/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type
      })
    })

    const { url, fields } = await response.json()

    return {
      method: 'POST',
      url: url,
      fields: fields,
      headers: {
        'Content-Type': file.type
      }
    }
  },

  // Parallel uploads
  limit: 4,

  // Multipart configuration
  getChunkSize: (file) => {
    return Math.max(5 * 1024 * 1024, Math.ceil(file.size / 10000))
  },

  // Callbacks
  onBeforeUploadStart: (file) => {},
  onProgress: (bytesUploaded, bytesTotal) => {},
  onSuccess: (result) => {},
  onError: (error) => {}
})
```

**Server-side Presigned URL Generation (Node.js):**
```javascript
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

app.post('/s3/sign', async (req, res) => {
  const { filename, contentType } = req.body
  const key = `uploads/${Date.now()}-${filename}`

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    Expires: 3600, // 1 hour
    ACL: 'private'
  }

  const url = await s3.getSignedUrlPromise('putObject', params)

  res.json({
    url: url,
    method: 'PUT',
    fields: {},
    headers: {
      'Content-Type': contentType
    }
  })
})
```

**Use Cases:**
- Direct client-to-S3 uploads
- Reduce server bandwidth
- Leverage AWS infrastructure
- Large file storage
- Video/media platforms

---

## UI Plugins

### Dashboard Plugin

**Purpose:** Full-featured UI with all controls

**Configuration:**
```typescript
uppy.use(Dashboard, {
  // Target
  target: '#uppy-dashboard',
  inline: true,

  // Dimensions
  width: 750,
  height: 550,

  // Theme
  theme: 'auto', // 'light', 'dark', 'auto'

  // Animation
  animateOpenClose: true,

  // Modal configuration (if inline: false)
  trigger: '#select-files',
  closeModalOnClickOutside: true,
  disablePageScrollWhenModalOpen: true,

  // Features
  proudlyDisplayPoweredByUppy: false,
  showProgressDetails: true,
  showSelectedFiles: true,
  note: 'Images and videos only, up to 100 MB',

  // Behavior
  hideUploadButton: false,
  hideCancelButton: false,
  hideRetryButton: false,
  hidePauseResumeButton: false,
  showRemoveButtonAfterComplete: false,

  // Metadata
  metaFields: [
    {
      id: 'name',
      name: 'Title',
      placeholder: 'Enter file title',
      render: ({ value, onChange, required, form }) => (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    },
    {
      id: 'description',
      name: 'Description',
      placeholder: 'Describe this file'
    }
  ],

  // Plugins to show in dashboard
  plugins: ['Webcam', 'ImageEditor', 'GoogleDrive'],

  // File sources
  disableLocalFiles: false,

  // Callbacks
  onRequestCloseModal: () => {},
  doneButtonHandler: () => {
    uppy.reset()
    window.location = '/success'
  },

  // Internationalization
  locale: {
    strings: {
      dropPasteImportBoth: 'Drop files, paste, %{browseFiles} or import from:',
      browseFiles: 'browse files',
      uploadXFiles: {
        0: 'Upload %{smart_count} file',
        1: 'Upload %{smart_count} files'
      }
    }
  },

  // Browser back button behavior
  browserBackButtonClose: false
})
```

### Drag Drop Plugin

**Purpose:** Simple drag-and-drop zone

**Configuration:**
```typescript
uppy.use(DragDrop, {
  target: '#drag-drop',
  width: '100%',
  height: '300px',
  note: 'Drag and drop files here or click to browse',

  locale: {
    strings: {
      dropHereOr: 'Drop here or %{browse}',
      browse: 'browse'
    }
  }
})
```

### Status Bar Plugin

**Purpose:** Compact progress display

**Configuration:**
```typescript
uppy.use(StatusBar, {
  target: '#status-bar',
  hideUploadButton: false,
  hideRetryButton: false,
  hidePauseResumeButton: false,
  hideCancelButton: false,
  showProgressDetails: true,
  hideAfterFinish: false,

  doneButtonHandler: () => {
    uppy.reset()
  },

  locale: {
    strings: {
      uploading: 'Uploading',
      complete: 'Complete',
      uploadFailed: 'Upload failed',
      paused: 'Paused',
      retry: 'Retry',
      cancel: 'Cancel',
      filesUploadedOfTotal: {
        0: '%{complete} of %{smart_count} file uploaded',
        1: '%{complete} of %{smart_count} files uploaded'
      }
    }
  }
})
```

---

## Acquirer Plugins

### Webcam Plugin

**Purpose:** Capture photos/videos from camera

**Configuration:**
```typescript
uppy.use(Webcam, {
  target: Dashboard,

  // Modes
  modes: ['picture', 'video'], // or ['picture'] or ['video']

  // Video constraints
  videoConstraints: {
    facingMode: 'user', // 'user' or 'environment'
    width: { min: 720, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 }
  },

  // Display
  mirror: true,
  showVideoSourceDropdown: true,
  showRecordingLength: true,

  // Video recording
  preferredVideoMimeType: 'video/webm',

  // Callbacks
  onBeforeSnapshot: () => Promise.resolve(),

  locale: {
    strings: {
      smile: 'Smile!',
      takePicture: 'Take a picture',
      startRecording: 'Begin video recording',
      stopRecording: 'Stop video recording',
      allowAccessTitle: 'Please allow access to your camera',
      allowAccessDescription: 'In order to take pictures or record video with your camera, please allow camera access for this site.'
    }
  }
})
```

**Advanced Example: Portrait Mode:**
```typescript
uppy.use(Webcam, {
  modes: ['picture'],
  videoConstraints: {
    facingMode: 'user',
    width: { ideal: 1080 },
    height: { ideal: 1920 }, // Portrait
    aspectRatio: 9/16
  },
  mirror: true,

  onBeforeSnapshot: async () => {
    // Add delay for selfie countdown
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
})
```

### Google Drive Plugin

**Purpose:** Import files from Google Drive

**Configuration:**
```typescript
uppy.use(GoogleDrive, {
  target: Dashboard,
  companionUrl: 'https://companion.uppy.io',

  companionHeaders: {
    Authorization: `Bearer ${token}`
  },

  companionCookiesRule: 'same-origin',

  locale: {
    strings: {
      pluginNameGoogleDrive: 'Google Drive',
      authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
      authenticateWith: 'Connect to %{pluginName}'
    }
  }
})
```

**Companion Server Setup:** See [Provider Setup](#provider-setup)

### Dropbox Plugin

**Configuration:**
```typescript
uppy.use(Dropbox, {
  target: Dashboard,
  companionUrl: 'https://companion.uppy.io',
  companionHeaders: {
    Authorization: `Bearer ${token}`
  }
})
```

### Instagram Plugin

**Configuration:**
```typescript
uppy.use(Instagram, {
  target: Dashboard,
  companionUrl: 'https://companion.uppy.io',
  companionHeaders: {
    Authorization: `Bearer ${token}`
  }
})
```

---

## Processing Plugins

### Image Editor Plugin

**Purpose:** Edit images before upload

**Installation:**
```bash
npm install @uppy/image-editor
```

**Configuration:**
```typescript
uppy.use(ImageEditor, {
  target: Dashboard,
  quality: 0.8, // JPEG quality (0-1)

  cropperOptions: {
    viewMode: 1,
    background: false,
    autoCropArea: 1,
    responsive: true,
    aspectRatio: null, // Free aspect ratio
    // Or fixed: aspectRatio: 16/9

    // Cropping restrictions
    minCropBoxWidth: 100,
    minCropBoxHeight: 100
  },

  actions: {
    revert: true,
    rotate: true,
    granularRotate: true,
    flip: true,
    zoomIn: true,
    zoomOut: true,
    cropSquare: true,
    cropWidescreen: true,
    cropWidescreenVertical: true
  },

  locale: {
    strings: {
      revert: 'Revert',
      rotate: 'Rotate',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      flipHorizontal: 'Flip horizontal',
      aspectRatioSquare: 'Crop square',
      aspectRatioLandscape: 'Crop landscape (16:9)',
      aspectRatioPortrait: 'Crop portrait (9:16)'
    }
  }
})
```

**Use Cases:**
- Profile photo cropping
- Document scanning adjustments
- Image rotation/flip
- Aspect ratio enforcement
- Pre-upload editing

### Compressor Plugin

**Purpose:** Compress images before upload

**Configuration:**
```typescript
uppy.use(Compressor, {
  quality: 0.8, // Compression quality (0-1)
  limit: 10, // Max parallel compressions

  // Target format
  mimeType: 'image/jpeg', // or 'image/webp'

  // Resize dimensions
  maxWidth: 1920,
  maxHeight: 1080,

  // Only compress if larger than threshold
  minSizeThreshold: 100 * 1024, // 100KB

  locale: {
    strings: {
      compressingImages: 'Compressing images...'
    }
  }
})
```

**Example: Aggressive Compression:**
```typescript
uppy.use(Compressor, {
  quality: 0.6, // Lower quality
  mimeType: 'image/webp', // More efficient format
  maxWidth: 1280,
  maxHeight: 720,
  minSizeThreshold: 50 * 1024 // Compress files > 50KB
})
```

### Audio Plugin

**Purpose:** Record audio from microphone

**Configuration:**
```typescript
uppy.use(Audio, {
  target: Dashboard,
  showRecordingLength: true,
  showAudioSourceDropdown: true,

  locale: {
    strings: {
      startRecording: 'Begin recording',
      stopRecording: 'Stop recording',
      recordingLength: 'Recording length %{recording_length}',
      allowAccessTitle: 'Please allow access to your microphone'
    }
  }
})
```

---

## Helper Plugins

### Golden Retriever Plugin

**Purpose:** Restore upload state after browser crash/refresh

**Configuration:**
```typescript
uppy.use(GoldenRetriever, {
  expires: 24 * 60 * 60 * 1000, // 24 hours
  serviceWorker: true,

  // IndexedDB configuration
  indexedDB: {
    name: 'uppy',
    version: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB max per file
    maxTotalSize: 100 * 1024 * 1024 // 100MB total
  }
})
```

**Use Cases:**
- Long-running uploads
- Unreliable browser environments
- Mobile uploads
- User accidentally closes tab

### Thumbnail Generator Plugin

**Configuration:**
```typescript
uppy.use(ThumbnailGenerator, {
  thumbnailWidth: 200,
  thumbnailHeight: 200,
  thumbnailType: 'image/jpeg',
  waitForThumbnailsBeforeUpload: false,

  lazy: false // Generate immediately vs on-demand
})

uppy.on('thumbnail:generated', (file, preview) => {
  const img = document.createElement('img')
  img.src = preview
  img.alt = file.name
  document.getElementById('preview').appendChild(img)
})
```

---

## Security Configuration

### File Validation

**Client-side Restrictions:**
```typescript
const uppy = new Uppy({
  restrictions: {
    // Size limits
    maxFileSize: 100 * 1024 * 1024, // 100MB
    minFileSize: 1024, // 1KB
    maxTotalFileSize: 500 * 1024 * 1024, // 500MB total

    // Count limits
    maxNumberOfFiles: 10,
    minNumberOfFiles: 1,

    // File types (MIME types or extensions)
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      '.docx'
    ],

    // Required metadata
    requiredMetaFields: ['name', 'description']
  },

  // Custom validation
  onBeforeFileAdded: (currentFile, files) => {
    // Example: Block files with specific names
    if (currentFile.name.includes('temp')) {
      uppy.info('Temporary files not allowed', 'error', 5000)
      return false
    }

    // Example: Validate file signature (magic bytes)
    const reader = new FileReader()
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4)
      const header = Array.from(arr).map(b => b.toString(16)).join('')

      // Check JPEG signature (FFD8FFE0 or FFD8FFE1)
      if (currentFile.type === 'image/jpeg' && !header.startsWith('ffd8ff')) {
        uppy.info('Invalid JPEG file', 'error', 5000)
        uppy.removeFile(currentFile.id)
      }
    }
    reader.readAsArrayBuffer(currentFile.data.slice(0, 4))

    return true
  }
})
```

### Authentication & Authorization

**Bearer Token Authentication:**
```typescript
uppy.use(Tus, {
  endpoint: 'https://secure.example.com/files/',

  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    'X-User-ID': user.id,
    'X-Request-ID': generateRequestId()
  },

  withCredentials: true, // Send cookies

  onBeforeRequest: (xhr, retryCount) => {
    // Refresh token if expired
    if (isTokenExpired()) {
      const newToken = await refreshAuthToken()
      xhr.setRequestHeader('Authorization', `Bearer ${newToken}`)
    }
  }
})
```

**CSRF Protection:**
```typescript
uppy.use(XHRUpload, {
  endpoint: '/api/upload',

  headers: {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
  },

  withCredentials: true
})
```

### Content Security

**Virus Scanning Integration:**
```typescript
uppy.on('upload-success', async (file, response) => {
  // Trigger server-side virus scan
  const scanResult = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileId: response.body.fileId,
      uploadUrl: response.uploadURL
    })
  })

  const { isClean } = await scanResult.json()

  if (!isClean) {
    // Delete infected file
    await fetch(`/api/files/${response.body.fileId}`, {
      method: 'DELETE'
    })

    uppy.info(`File "${file.name}" contained malware and was deleted`, 'error', 10000)
  }
})
```

---

## Provider Setup

### Companion Server

**Purpose:** OAuth proxy for cloud providers (Google Drive, Dropbox, etc.)

**Installation:**
```bash
npm install @uppy/companion
```

**Configuration (Node.js/Express):**
```javascript
const companion = require('@uppy/companion')
const express = require('express')

const app = express()

const options = {
  providerOptions: {
    drive: {
      key: process.env.GOOGLE_DRIVE_CLIENT_ID,
      secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET
    },
    dropbox: {
      key: process.env.DROPBOX_APP_KEY,
      secret: process.env.DROPBOX_APP_SECRET
    },
    instagram: {
      key: process.env.INSTAGRAM_CLIENT_ID,
      secret: process.env.INSTAGRAM_CLIENT_SECRET
    },
    s3: {
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET,
      region: process.env.AWS_REGION
    }
  },

  server: {
    host: 'localhost:3020',
    protocol: 'http'
  },

  secret: process.env.COMPANION_SECRET,

  uploadUrls: [
    'https://tusd.example.com/files/'
  ],

  debug: process.env.NODE_ENV === 'development'
}

app.use(companion.app(options))

app.listen(3020, () => {
  console.log('Companion server running on port 3020')
})
```

**Environment Variables:**
```bash
# Google Drive
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret

# Dropbox
DROPBOX_APP_KEY=your-app-key
DROPBOX_APP_SECRET=your-app-secret

# Instagram
INSTAGRAM_CLIENT_ID=your-client-id
INSTAGRAM_CLIENT_SECRET=your-client-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-bucket
AWS_REGION=us-east-1

# Companion
COMPANION_SECRET=your-random-secret
```

**Docker Deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3020
CMD ["node", "companion-server.js"]
```

---

## Custom Plugin Development

### Creating a Custom Plugin

**Basic Plugin Structure:**
```typescript
import { BasePlugin } from '@uppy/core'

class MyCustomPlugin extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts)
    this.id = opts.id || 'MyCustomPlugin'
    this.type = 'modifier' // or 'acquirer' or 'uploader'

    this.defaultOptions = {
      customOption: 'default value'
    }

    this.opts = { ...this.defaultOptions, ...opts }
  }

  install() {
    // Setup logic - called when plugin is added to Uppy
    this.uppy.on('file-added', this.handleFileAdded)
  }

  uninstall() {
    // Cleanup logic - called when plugin is removed
    this.uppy.off('file-added', this.handleFileAdded)
  }

  handleFileAdded = (file) => {
    // Custom logic
    console.log('File added:', file.name)

    // Modify file
    this.uppy.setFileState(file.id, {
      meta: {
        ...file.meta,
        processedBy: this.id
      }
    })
  }
}

// Usage
uppy.use(MyCustomPlugin, {
  customOption: 'my value'
})
```

**Example: Watermark Plugin:**
```typescript
import { BasePlugin } from '@uppy/core'

class WatermarkPlugin extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts)
    this.id = 'WatermarkPlugin'
    this.type = 'modifier'

    this.defaultOptions = {
      watermarkText: '© Company Name',
      position: 'bottom-right',
      fontSize: 20,
      color: 'white',
      opacity: 0.7
    }

    this.opts = { ...this.defaultOptions, ...opts }
  }

  install() {
    this.uppy.addPreProcessor(this.addWatermark)
  }

  uninstall() {
    this.uppy.removePreProcessor(this.addWatermark)
  }

  addWatermark = async (fileIDs) => {
    const promises = fileIDs.map(async (fileID) => {
      const file = this.uppy.getFile(fileID)

      // Only process images
      if (!file.type.startsWith('image/')) {
        return
      }

      try {
        const watermarkedBlob = await this.processImage(file.data)

        this.uppy.setFileState(fileID, {
          data: watermarkedBlob,
          size: watermarkedBlob.size
        })
      } catch (error) {
        this.uppy.log(`Failed to add watermark: ${error.message}`, 'error')
      }
    })

    await Promise.all(promises)
  }

  async processImage(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        // Add watermark
        ctx.font = `${this.opts.fontSize}px Arial`
        ctx.fillStyle = this.opts.color
        ctx.globalAlpha = this.opts.opacity

        const textWidth = ctx.measureText(this.opts.watermarkText).width

        let x, y
        switch (this.opts.position) {
          case 'top-left':
            x = 10
            y = 30
            break
          case 'top-right':
            x = canvas.width - textWidth - 10
            y = 30
            break
          case 'bottom-left':
            x = 10
            y = canvas.height - 10
            break
          case 'bottom-right':
          default:
            x = canvas.width - textWidth - 10
            y = canvas.height - 10
        }

        ctx.fillText(this.opts.watermarkText, x, y)

        canvas.toBlob((watermarkedBlob) => {
          resolve(watermarkedBlob)
        }, blob.type)
      }

      img.onerror = reject
      img.src = URL.createObjectURL(blob)
    })
  }
}

// Usage
uppy.use(WatermarkPlugin, {
  watermarkText: '© 2025 My Company',
  position: 'bottom-right',
  fontSize: 24,
  color: 'white',
  opacity: 0.8
})
```

---

**Document Version:** 1.0.0
**Last Updated:** September 30, 2025
**Maintainer:** Form.io Team