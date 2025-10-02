# Uppy.js Examples

**Version:** 1.0.0
**Last Updated:** September 30, 2025

Comprehensive examples for common Uppy.js use cases.

---

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Plugin Examples](#plugin-examples)
3. [Form.io Integration](#formio-integration)
4. [Advanced Patterns](#advanced-patterns)
5. [Custom Styling](#custom-styling)
6. [Event Handling](#event-handling)
7. [Error Handling](#error-handling)
8. [Production Configurations](#production-configurations)

---

## Basic Usage

### Minimal Setup

```typescript
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Tus from '@uppy/tus'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

const uppy = new Uppy()
  .use(Dashboard, {
    target: '#uppy',
    inline: true
  })
  .use(Tus, {
    endpoint: 'https://tusd.tusdemo.net/files/'
  })

uppy.on('complete', (result) => {
  console.log('Upload complete:', result.successful)
})
```

### React Component

```typescript
import { useEffect, useRef } from 'react'
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Tus from '@uppy/tus'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

function FileUpload({ onComplete }) {
  const uppyRef = useRef<Uppy>()

  useEffect(() => {
    uppyRef.current = new Uppy({
      restrictions: {
        maxFileSize: 50 * 1024 * 1024,
        allowedFileTypes: ['image/*', '.pdf']
      }
    })
      .use(Dashboard, {
        target: '#uppy-dashboard',
        inline: true,
        height: 400
      })
      .use(Tus, {
        endpoint: 'https://tusd.tusdemo.net/files/'
      })

    uppyRef.current.on('complete', (result) => {
      onComplete(result.successful)
    })

    return () => {
      uppyRef.current?.close()
    }
  }, [onComplete])

  return <div id="uppy-dashboard" />
}
```

---

## Plugin Examples

### Webcam Capture

```typescript
import Webcam from '@uppy/webcam'

uppy.use(Webcam, {
  target: Dashboard,
  modes: ['picture', 'video'],
  mirror: true,
  videoConstraints: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 }
  },
  preferredVideoMimeType: 'video/webm'
})

// Use picture mode only
uppy.use(Webcam, {
  modes: ['picture'],
  mirror: true
})
```

### Image Editor

```typescript
import ImageEditor from '@uppy/image-editor'
import '@uppy/image-editor/dist/style.css'

uppy.use(ImageEditor, {
  target: Dashboard,
  quality: 0.8,
  cropperOptions: {
    aspectRatio: 16 / 9,
    viewMode: 1,
    responsive: true
  },
  actions: {
    revert: true,
    rotate: true,
    flip: true,
    zoomIn: true,
    zoomOut: true,
    cropSquare: true,
    cropWidescreen: true
  }
})
```

### Image Compression

```typescript
import Compressor from '@uppy/compressor'

uppy.use(Compressor, {
  quality: 0.7,
  maxWidth: 1920,
  maxHeight: 1080,
  mimeType: 'image/jpeg'
})
```

### Google Drive Integration

```typescript
import GoogleDrive from '@uppy/google-drive'

uppy.use(GoogleDrive, {
  target: Dashboard,
  companionUrl: 'https://companion.uppy.io'
})
```

### AWS S3 Direct Upload

```typescript
import AwsS3 from '@uppy/aws-s3'

uppy.use(AwsS3, {
  shouldUseMultipart: true,
  getUploadParameters: async (file) => {
    const response = await fetch('/s3/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type
      })
    })

    const { url, fields } = await response.json()

    return {
      method: 'POST',
      url,
      fields,
      headers: {
        'Content-Type': file.type
      }
    }
  }
})
```

---

## Form.io Integration

### Simple Integration

```typescript
import { UppyFileUpload } from 'formio-react'

function MyForm() {
  const [fileUrls, setFileUrls] = useState([])

  return (
    <form onSubmit={handleSubmit}>
      <UppyFileUpload
        endpoint="https://tusd.example.com/files/"
        protocol="tus"
        restrictions={{
          maxFileSize: 100 * 1024 * 1024,
          allowedFileTypes: ['image/*', '.pdf']
        }}
        onComplete={(result) => {
          const urls = result.successful.map(f => f.uploadURL)
          setFileUrls(urls)
        }}
      />

      <button type="submit" disabled={fileUrls.length === 0}>
        Submit
      </button>
    </form>
  )
}
```

### With Form.io Renderer

```typescript
import { Form } from '@formio/react'

const formSchema = {
  components: [
    {
      type: 'textfield',
      key: 'name',
      label: 'Name',
      validate: { required: true }
    },
    {
      type: 'uppyfileupload',
      key: 'documents',
      label: 'Upload Documents',
      storage: 'tus',
      url: 'https://tusd.example.com/files/',
      options: {
        restrictions: {
          maxFileSize: 50 * 1024 * 1024,
          allowedFileTypes: ['.pdf', '.docx']
        },
        plugins: ['webcam', 'compressor']
      }
    }
  ]
}

function FormioUploadForm() {
  return (
    <Form
      form={formSchema}
      onSubmit={(submission) => {
        console.log('Submission:', submission)
      }}
    />
  )
}
```

### Custom Component Wrapper

```typescript
import { Components } from '@formio/react'
import { UppyFileUpload } from './UppyFileUpload'

class UppyFileUploadComponent extends Components.components.base {
  static schema(...extend) {
    return Components.components.base.schema({
      type: 'uppyfileupload',
      label: 'File Upload',
      key: 'fileUpload',
      storage: 'tus',
      url: '',
      options: {}
    }, ...extend)
  }

  render() {
    return (
      <UppyFileUpload
        endpoint={this.component.url}
        protocol={this.component.storage}
        restrictions={this.component.options.restrictions}
        plugins={this.component.options.plugins}
        onComplete={(result) => {
          const files = result.successful.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.uploadURL
          }))
          this.updateValue(files)
        }}
      />
    )
  }
}

// Register component
Components.setComponent('uppyfileupload', UppyFileUploadComponent)
```

---

## Advanced Patterns

### Dynamic Restrictions

```typescript
function DynamicUpload({ userTier }) {
  const restrictions = useMemo(() => {
    switch (userTier) {
      case 'free':
        return {
          maxFileSize: 10 * 1024 * 1024, // 10MB
          maxNumberOfFiles: 3
        }
      case 'pro':
        return {
          maxFileSize: 100 * 1024 * 1024, // 100MB
          maxNumberOfFiles: 20
        }
      case 'enterprise':
        return {
          maxFileSize: 500 * 1024 * 1024, // 500MB
          maxNumberOfFiles: null // Unlimited
        }
    }
  }, [userTier])

  return (
    <UppyFileUpload
      endpoint="https://tusd.example.com/files/"
      restrictions={restrictions}
    />
  )
}
```

### Conditional Plugin Loading

```typescript
function ConditionalPlugins({ enableWebcam, enableImageEditor }) {
  const plugins = useMemo(() => {
    const list = []
    if (enableWebcam) list.push('webcam')
    if (enableImageEditor) list.push('image-editor')
    return list
  }, [enableWebcam, enableImageEditor])

  return (
    <UppyFileUpload
      endpoint="https://tusd.example.com/files/"
      plugins={plugins}
    />
  )
}
```

### Metadata Collection

```typescript
const uppy = new Uppy()
  .use(Dashboard, {
    metaFields: [
      {
        id: 'title',
        name: 'Title',
        placeholder: 'Enter file title',
        required: true
      },
      {
        id: 'description',
        name: 'Description',
        placeholder: 'Describe this file'
      },
      {
        id: 'category',
        name: 'Category',
        render: ({ value, onChange }) => (
          <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select category...</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        )
      }
    ]
  })
```

### Multi-destination Upload

```typescript
// Upload to multiple services simultaneously
const uppy = new Uppy()
  .use(Dashboard, {
    target: '#uppy',
    inline: true
  })
  .use(Tus, {
    id: 'TusPrimary',
    endpoint: 'https://primary.example.com/files/'
  })
  .use(XHRUpload, {
    id: 'XHRBackup',
    endpoint: 'https://backup.example.com/upload'
  })

uppy.on('complete', (result) => {
  console.log('Primary uploads:', result.successful.filter(f => f.uploader === 'TusPrimary'))
  console.log('Backup uploads:', result.successful.filter(f => f.uploader === 'XHRBackup'))
})
```

---

## Custom Styling

### Dark Theme

```typescript
const uppy = new Uppy()
  .use(Dashboard, {
    theme: 'dark',
    proudlyDisplayPoweredByUppy: false
  })
```

### CSS Variables

```css
:root {
  --uppy-color-primary: #007bff;
  --uppy-color-secondary: #6c757d;
  --uppy-border-radius: 8px;
  --uppy-font-family: 'Inter', sans-serif;
}

.uppy-Dashboard {
  --uppy-color-primary: #007bff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.uppy-Dashboard-AddFiles {
  border: 2px dashed var(--uppy-color-primary);
}

.uppy-Dashboard-AddFiles:hover {
  background-color: rgba(0, 123, 255, 0.05);
}
```

### Custom Branding

```typescript
uppy.use(Dashboard, {
  proudlyDisplayPoweredByUppy: false,
  locale: {
    strings: {
      dropPasteImportBoth: 'Drop files here, %{browseFiles} or import from:',
      browseFiles: 'browse your files',
      uploadXFiles: {
        0: 'Upload %{smart_count} file',
        1: 'Upload %{smart_count} files'
      }
    }
  }
})
```

---

## Event Handling

### Comprehensive Event Logging

```typescript
const events = [
  'file-added',
  'file-removed',
  'upload',
  'upload-start',
  'upload-progress',
  'upload-success',
  'upload-error',
  'complete',
  'error',
  'restriction-failed'
]

events.forEach(event => {
  uppy.on(event, (...args) => {
    console.log(`[Uppy ${event}]`, ...args)
  })
})
```

### Progress Tracking

```typescript
let totalBytes = 0
let uploadedBytes = 0

uppy.on('upload-start', (files) => {
  totalBytes = files.reduce((sum, file) => sum + file.size, 0)
  uploadedBytes = 0
  updateProgressBar(0)
})

uppy.on('upload-progress', (file, progress) => {
  uploadedBytes += (progress.bytesUploaded - (file.progress?.bytesUploaded || 0))
  const overallProgress = (uploadedBytes / totalBytes) * 100
  updateProgressBar(overallProgress)
})
```

### Analytics Integration

```typescript
uppy.on('file-added', (file) => {
  analytics.track('file_added', {
    fileType: file.type,
    fileSize: file.size,
    extension: file.extension
  })
})

uppy.on('upload-success', (file, response) => {
  const uploadTime = Date.now() - file.progress.uploadStarted

  analytics.track('upload_success', {
    fileType: file.type,
    fileSize: file.size,
    uploadTime: uploadTime,
    uploadSpeed: file.size / (uploadTime / 1000)
  })
})

uppy.on('upload-error', (file, error) => {
  analytics.track('upload_error', {
    fileType: file.type,
    fileSize: file.size,
    errorType: error.name,
    errorMessage: error.message
  })
})
```

---

## Error Handling

### User-Friendly Error Messages

```typescript
uppy.on('upload-error', (file, error) => {
  let userMessage

  if (error.message.includes('network')) {
    userMessage = 'Connection lost. Please check your internet.'
  } else if (error.message.includes('size')) {
    userMessage = `File "${file.name}" is too large.`
  } else if (error.message.includes('type')) {
    userMessage = `File type "${file.type}" is not allowed.`
  } else {
    userMessage = `Upload failed for "${file.name}". Please try again.`
  }

  uppy.info(userMessage, 'error', 5000)

  // Log to error tracking
  Sentry.captureException(error, {
    extra: {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }
  })
})
```

### Automatic Retry

```typescript
uppy.use(Tus, {
  endpoint: 'https://tusd.example.com/files/',
  retryDelays: [0, 1000, 3000, 5000, 10000],

  onBeforeRetry: (file, error, retryCount) => {
    console.log(`Retrying ${file.name}, attempt ${retryCount}`)
  }
})
```

### Network Monitoring

```typescript
window.addEventListener('offline', () => {
  uppy.pauseAll()
  uppy.info('Connection lost. Uploads paused.', 'warning')
})

window.addEventListener('online', () => {
  uppy.resumeAll()
  uppy.info('Connection restored. Resuming uploads.', 'success')
})
```

---

## Production Configurations

### High-Performance Setup

```typescript
const uppy = new Uppy({
  debug: false,
  autoProceed: false,
  restrictions: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxNumberOfFiles: 50,
    allowedFileTypes: ['image/*', 'video/*', '.pdf']
  },
  meta: {
    userId: user.id,
    uploadSource: 'web-app'
  }
})

uppy.use(Dashboard, {
  inline: true,
  height: 500,
  showProgressDetails: true,
  proudlyDisplayPoweredByUppy: false,
  theme: 'auto'
})

uppy.use(Tus, {
  endpoint: process.env.TUS_ENDPOINT,
  chunkSize: 10 * 1024 * 1024, // 10MB
  retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
  limit: 3,

  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    'X-User-ID': user.id
  },

  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: true,
  useFastRemoteRetry: true
})

uppy.use(GoldenRetriever, {
  expires: 24 * 60 * 60 * 1000 // 24 hours
})
```

### Enterprise Configuration

```typescript
const uppy = new Uppy({
  debug: process.env.NODE_ENV === 'development',
  autoProceed: false,

  restrictions: {
    maxFileSize: 1024 * 1024 * 1024, // 1GB
    maxNumberOfFiles: 100,
    allowedFileTypes: null, // Allow all types
    requiredMetaFields: ['project', 'category']
  },

  meta: {
    userId: user.id,
    organizationId: org.id,
    environment: process.env.NODE_ENV
  },

  onBeforeFileAdded: (currentFile, files) => {
    // Custom validation
    if (!validateFileSignature(currentFile)) {
      uppy.info(`Invalid file: ${currentFile.name}`, 'error', 5000)
      return false
    }

    return {
      ...currentFile,
      meta: {
        ...currentFile.meta,
        addedAt: new Date().toISOString(),
        clientIp: getClientIp()
      }
    }
  }
})

uppy.use(Dashboard, {
  inline: true,
  height: 600,
  showProgressDetails: true,
  proudlyDisplayPoweredByUppy: false,

  metaFields: [
    {
      id: 'project',
      name: 'Project',
      placeholder: 'Select project...',
      required: true
    },
    {
      id: 'category',
      name: 'Category',
      placeholder: 'Select category...',
      required: true
    },
    {
      id: 'description',
      name: 'Description',
      placeholder: 'Optional description'
    }
  ]
})

uppy.use(Tus, {
  endpoint: process.env.TUS_ENDPOINT,
  chunkSize: 20 * 1024 * 1024,
  retryDelays: [0, 1000, 3000, 5000, 10000, 20000, 30000],
  limit: 5,

  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    'X-User-ID': user.id,
    'X-Organization-ID': org.id,
    'X-Request-ID': generateRequestId()
  },

  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: true,
  useFastRemoteRetry: true,
  withCredentials: true
})

// Golden Retriever for crash recovery
uppy.use(GoldenRetriever, {
  expires: 48 * 60 * 60 * 1000, // 48 hours
  serviceWorker: true
})

// Comprehensive event logging
uppy.on('complete', (result) => {
  // Log success
  result.successful.forEach(file => {
    auditLog({
      action: 'file_upload_success',
      userId: user.id,
      fileName: file.name,
      fileSize: file.size,
      uploadUrl: file.uploadURL
    })
  })

  // Log failures
  result.failed.forEach(file => {
    auditLog({
      action: 'file_upload_failed',
      userId: user.id,
      fileName: file.name,
      error: file.error
    })

    Sentry.captureException(new Error(file.error), {
      extra: {
        fileName: file.name,
        fileSize: file.size,
        userId: user.id
      }
    })
  })
})
```

---

**Document Version:** 1.0.0
**Last Updated:** September 30, 2025
**Maintainer:** Form.io Team