# Migration Guide: TusFileUpload to UppyFileUpload

**Version:** 1.0.0
**Last Updated:** September 30, 2025

Complete guide for migrating from TusFileUpload to UppyFileUpload component.

---

## Table of Contents

1. [Should You Migrate?](#should-you-migrate)
2. [Breaking Changes](#breaking-changes)
3. [Migration Steps](#migration-steps)
4. [Code Comparison](#code-comparison)
5. [Feature Mapping](#feature-mapping)
6. [Migration Checklist](#migration-checklist)
7. [Rollback Strategy](#rollback-strategy)

---

## Should You Migrate?

### Reasons to Migrate

✅ **Migrate if you need:**
- Cloud provider integrations (Google Drive, Dropbox, etc.)
- Webcam/audio/screen capture
- Image editing (crop, rotate, filters)
- Image compression
- Multiple language support
- Rich, accessible UI out-of-the-box
- Plugin ecosystem for rapid feature addition
- Import files from URLs
- Companion server features

✅ **Migrate if you experience:**
- Spending significant time on custom UI development
- User requests for features Uppy provides
- Need for internationalization
- Accessibility compliance requirements

### Reasons NOT to Migrate

❌ **Don't migrate if:**
- Bundle size is critical (mobile-first, slow networks)
- Simple uploads are sufficient
- Custom UI is already built and working
- TUS protocol is all you need
- Team lacks familiarity with Uppy
- Short-term project with no feature expansion plans

### Migration Complexity

| Scenario | Complexity | Time Estimate |
|----------|-----------|---------------|
| Basic TUS upload only | Low | 2-4 hours |
| Custom UI with events | Medium | 1-2 days |
| Complex validation logic | Medium-High | 2-3 days |
| Integrated with Form.io | High | 3-5 days |
| Custom authentication | Medium | 1-2 days |
| Multiple forms/components | High | 1 week+ |

---

## Breaking Changes

### 1. Component Props

**TusFileUpload:**
```typescript
<TusFileUpload
  endpoint={string}
  chunkSize={number}
  maxFileSize={number}
  maxFiles={number}
  allowedTypes={string[]}
  metadata={Record<string, string>}
  onSuccess={(files) => {}}
  onError={(error, file) => {}}
  onProgress={(fileId, progress) => {}}
  disabled={boolean}
  multiple={boolean}
  showPreviews={boolean}
  autoStart={boolean}
  className={string}
/>
```

**UppyFileUpload:**
```typescript
<UppyFileUpload
  endpoint={string}
  protocol="tus" // NEW: specify protocol
  plugins={string[]} // NEW: plugin list
  restrictions={{ // CHANGED: nested restrictions
    maxFileSize: number,
    maxNumberOfFiles: number,
    allowedFileTypes: string[]
  }}
  meta={Record<string, any>} // CHANGED: renamed from metadata
  onComplete={(result) => {}} // CHANGED: different signature
  onError={(error) => {}} // CHANGED: no file parameter
  onFileAdded={(file) => {}} // NEW: additional events
  onProgress={(file, progress) => {}} // CHANGED: includes file
  autoProceed={boolean} // CHANGED: renamed from autoStart
  inline={boolean} // NEW: inline vs modal
  theme="light" | "dark" | "auto" // NEW: theming
  locale={string} // NEW: internationalization
  height={number} // NEW: height control
  proudlyDisplayPoweredByUppy={boolean} // NEW: branding
/>
```

### 2. Event Signatures

**TusFileUpload Events:**
```typescript
onSuccess: (files: UploadFile[]) => void
onError: (error: Error, file?: UploadFile) => void
onProgress: (fileId: string, progress: UploadProgress) => void
```

**UppyFileUpload Events:**
```typescript
onComplete: (result: { successful: UppyFile[], failed: UppyFile[] }) => void
onError: (error: Error) => void
onFileAdded: (file: UppyFile) => void
onProgress: (file: UppyFile, progress: ProgressData) => void
onUploadStart: (files: UppyFile[]) => void
onUploadSuccess: (file: UppyFile, response: Response) => void
```

### 3. File Structure

**TusFileUpload File:**
```typescript
interface UploadFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error'
  progress: number
  uploadUrl?: string
  preview?: string | null
}
```

**Uppy File:**
```typescript
interface UppyFile {
  id: string
  name: string
  extension: string
  meta: Record<string, any>
  type: string
  data: Blob | File
  preview?: string
  size: number
  isRemote: boolean
  progress: {
    uploadStarted: number | null
    uploadComplete: boolean
    percentage: number
    bytesUploaded: number
    bytesTotal: number
  }
  response?: {
    status: number
    body: any
    uploadURL?: string
  }
}
```

### 4. CSS Classes

**TusFileUpload CSS:**
```css
.tus-file-upload
.tus-dropzone
.tus-file-list
.tus-file-item
.tus-progress-bar
```

**UppyFileUpload CSS:**
```css
.uppy-Root
.uppy-Dashboard
.uppy-Dashboard-inner
.uppy-Dashboard-AddFiles
.uppy-DashboardContent-bar
.uppy-ProgressBar
```

---

## Migration Steps

### Step 1: Install Dependencies

```bash
# Install Uppy packages
npm install @uppy/core @uppy/react @uppy/dashboard @uppy/tus

# Keep tus-js-client if you want gradual migration
npm install tus-js-client
```

### Step 2: Update Imports

**Before:**
```typescript
import { TusFileUpload } from './components/TusFileUpload'
import './components/TusFileUpload.css'
```

**After:**
```typescript
import { UppyFileUpload } from './components/UppyFileUpload'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
```

### Step 3: Convert Component Props

**Before:**
```typescript
<TusFileUpload
  endpoint="https://tusd.example.com/files/"
  maxFileSize={50 * 1024 * 1024}
  maxFiles={10}
  allowedTypes={['image/*', '.pdf']}
  metadata={{
    userId: user.id,
    formId: form.id
  }}
  onSuccess={(files) => {
    console.log('Uploaded:', files)
    handleUploadComplete(files)
  }}
  onError={(error, file) => {
    console.error('Error:', error, file)
    handleUploadError(error)
  }}
  onProgress={(fileId, progress) => {
    console.log(`Progress: ${progress.percentage}%`)
  }}
  autoStart={true}
  showPreviews={true}
/>
```

**After:**
```typescript
<UppyFileUpload
  endpoint="https://tusd.example.com/files/"
  protocol="tus"
  restrictions={{
    maxFileSize: 50 * 1024 * 1024,
    maxNumberOfFiles: 10,
    allowedFileTypes: ['image/*', '.pdf']
  }}
  meta={{
    userId: user.id,
    formId: form.id
  }}
  onComplete={(result) => {
    console.log('Uploaded:', result.successful)
    // Convert to TusFileUpload format if needed
    const files = result.successful.map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.uploadURL,
      status: 'completed'
    }))
    handleUploadComplete(files)
  }}
  onError={(error) => {
    console.error('Error:', error)
    handleUploadError(error)
  }}
  onProgress={(file, progress) => {
    console.log(`Progress: ${progress.percentage}%`)
  }}
  autoProceed={true}
  inline={true}
  showProgressDetails={true}
/>
```

### Step 4: Update Event Handlers

**Before:**
```typescript
const handleSuccess = (files: UploadFile[]) => {
  files.forEach(file => {
    saveFile({
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.uploadUrl
    })
  })
}
```

**After:**
```typescript
const handleComplete = (result: UploadResult) => {
  result.successful.forEach(file => {
    saveFile({
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.uploadURL || file.response?.uploadURL
    })
  })

  // Handle failures
  if (result.failed.length > 0) {
    result.failed.forEach(file => {
      console.error(`Failed: ${file.name}`, file.error)
    })
  }
}
```

### Step 5: Migrate Custom Validation

**Before:**
```typescript
const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.name.includes('temp')) {
    return { valid: false, error: 'Temporary files not allowed' }
  }

  if (file.size > maxFileSize) {
    return { valid: false, error: 'File too large' }
  }

  return { valid: true }
}
```

**After:**
```typescript
const uppy = new Uppy({
  onBeforeFileAdded: (currentFile, files) => {
    if (currentFile.name.includes('temp')) {
      uppy.info('Temporary files not allowed', 'error', 5000)
      return false
    }

    if (currentFile.size > maxFileSize) {
      uppy.info('File too large', 'error', 5000)
      return false
    }

    return true
  }
})
```

### Step 6: Update CSS Styling

**Before:**
```css
.tus-dropzone {
  border: 2px dashed #ccc;
  padding: 40px;
  text-align: center;
}

.tus-dropzone.dragging {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.tus-progress-bar {
  height: 20px;
  background-color: #007bff;
}
```

**After:**
```css
/* Uppy provides default styling, but you can override */
.uppy-Dashboard {
  --uppy-color-primary: #007bff;
  --uppy-border-radius: 8px;
}

.uppy-Dashboard-AddFiles {
  border: 2px dashed #ccc;
}

.uppy-Dashboard-AddFiles:hover {
  border-color: #007bff;
}

.uppy-ProgressBar {
  background-color: #007bff;
}
```

---

## Code Comparison

### Example 1: Basic Upload

**TusFileUpload:**
```typescript
import { TusFileUpload } from './components/TusFileUpload'

function FileUploadForm() {
  const [files, setFiles] = useState([])

  return (
    <div>
      <TusFileUpload
        endpoint="https://tusd.example.com/files/"
        onSuccess={(uploadedFiles) => setFiles(uploadedFiles)}
      />

      <ul>
        {files.map(file => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

**UppyFileUpload:**
```typescript
import { UppyFileUpload } from './components/UppyFileUpload'

function FileUploadForm() {
  const [files, setFiles] = useState([])

  return (
    <div>
      <UppyFileUpload
        endpoint="https://tusd.example.com/files/"
        protocol="tus"
        onComplete={(result) => {
          const uploadedFiles = result.successful.map(file => ({
            id: file.id,
            name: file.name,
            url: file.uploadURL
          }))
          setFiles(uploadedFiles)
        }}
      />

      <ul>
        {files.map(file => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Example 2: Progress Tracking

**TusFileUpload:**
```typescript
function ProgressTracker() {
  const [progress, setProgress] = useState({})

  return (
    <TusFileUpload
      endpoint="https://tusd.example.com/files/"
      onProgress={(fileId, progressData) => {
        setProgress(prev => ({
          ...prev,
          [fileId]: progressData.percentage
        }))
      }}
    />
  )
}
```

**UppyFileUpload:**
```typescript
function ProgressTracker() {
  const [progress, setProgress] = useState({})

  return (
    <UppyFileUpload
      endpoint="https://tusd.example.com/files/"
      protocol="tus"
      onProgress={(file, progressData) => {
        setProgress(prev => ({
          ...prev,
          [file.id]: progressData.percentage
        }))
      }}
      showProgressDetails={true}
    />
  )
}
```

### Example 3: Form Integration

**TusFileUpload:**
```typescript
function SubmissionForm() {
  const [fileUrls, setFileUrls] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = {
      name: e.target.name.value,
      files: fileUrls
    }

    submitForm(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" required />

      <TusFileUpload
        endpoint="https://tusd.example.com/files/"
        onSuccess={(files) => {
          const urls = files.map(f => f.uploadUrl)
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

**UppyFileUpload:**
```typescript
function SubmissionForm() {
  const [fileUrls, setFileUrls] = useState([])
  const [uploadsInProgress, setUploadsInProgress] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (uploadsInProgress) {
      alert('Please wait for uploads to complete')
      return
    }

    const formData = {
      name: e.target.name.value,
      files: fileUrls
    }

    submitForm(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" required />

      <UppyFileUpload
        endpoint="https://tusd.example.com/files/"
        protocol="tus"
        onUploadStart={() => setUploadsInProgress(true)}
        onComplete={(result) => {
          const urls = result.successful.map(f => f.uploadURL)
          setFileUrls(urls)
          setUploadsInProgress(false)
        }}
      />

      <button
        type="submit"
        disabled={fileUrls.length === 0 || uploadsInProgress}
      >
        {uploadsInProgress ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## Feature Mapping

| TusFileUpload Feature | UppyFileUpload Equivalent |
|----------------------|---------------------------|
| `endpoint` | `endpoint` (same) |
| `chunkSize` | Configure in TUS plugin options |
| `maxFileSize` | `restrictions.maxFileSize` |
| `maxFiles` | `restrictions.maxNumberOfFiles` |
| `allowedTypes` | `restrictions.allowedFileTypes` |
| `metadata` | `meta` |
| `onSuccess` | `onComplete` + filter `result.successful` |
| `onError` | `onError` + `onUploadError` for per-file |
| `onProgress` | `onProgress` (includes file object) |
| `disabled` | `disabled` or conditional rendering |
| `multiple` | `restrictions.maxNumberOfFiles > 1` |
| `showPreviews` | Built-in via Dashboard |
| `autoStart` | `autoProceed` |
| `className` | CSS targeting `.uppy-Root` |
| Custom validation | `onBeforeFileAdded` |
| Pause/resume | Built-in via Dashboard UI |
| Retry | Built-in via Dashboard UI |
| Webcam capture | N/A (TusFileUpload doesn't support) |
| Image editing | N/A (TusFileUpload doesn't support) |
| Cloud import | N/A (TusFileUpload doesn't support) |

---

## Migration Checklist

### Pre-Migration

- [ ] Audit current TusFileUpload usage
- [ ] Identify custom features/validations
- [ ] List all event handlers
- [ ] Document CSS customizations
- [ ] Check bundle size constraints
- [ ] Review team familiarity with Uppy
- [ ] Plan for feature additions (if any)
- [ ] Set up development environment

### During Migration

- [ ] Install Uppy dependencies
- [ ] Create UppyFileUpload wrapper component
- [ ] Migrate props to Uppy format
- [ ] Convert event handlers
- [ ] Migrate validation logic
- [ ] Update CSS styling
- [ ] Add new features (if planned)
- [ ] Update tests
- [ ] Test on all supported browsers
- [ ] Performance test (bundle size, upload speed)

### Post-Migration

- [ ] Remove TusFileUpload code (if no longer needed)
- [ ] Remove tus-js-client dependency (if fully migrated)
- [ ] Update documentation
- [ ] Train team on Uppy usage
- [ ] Monitor error logs
- [ ] Collect user feedback
- [ ] Measure performance metrics
- [ ] Plan for future enhancements

---

## Rollback Strategy

### Quick Rollback

If you need to quickly revert:

1. **Git Revert:**
   ```bash
   git revert <migration-commit-hash>
   ```

2. **Feature Flag:**
   ```typescript
   const useUppy = featureFlags.uppyEnabled

   return useUppy ? (
     <UppyFileUpload {...props} />
   ) : (
     <TusFileUpload {...props} />
   )
   ```

3. **Gradual Rollout:**
   ```typescript
   const useUppy = user.tier === 'premium' || Math.random() < 0.1 // 10% rollout
   ```

### Keeping Both Components

**Adapter Pattern:**
```typescript
interface FileUploadProps {
  endpoint: string
  onSuccess: (files: any[]) => void
  // ...common props
}

function FileUpload(props: FileUploadProps) {
  const useUppy = shouldUseUppy() // Your logic here

  if (useUppy) {
    return (
      <UppyFileUpload
        {...props}
        protocol="tus"
        restrictions={{
          maxFileSize: props.maxFileSize,
          maxNumberOfFiles: props.maxFiles,
          allowedFileTypes: props.allowedTypes
        }}
        onComplete={(result) => {
          const files = result.successful.map(normalizeUppyFile)
          props.onSuccess(files)
        }}
      />
    )
  }

  return <TusFileUpload {...props} />
}
```

### Monitoring Migration Success

```typescript
// Track migration metrics
const trackUploadSuccess = (component: 'tus' | 'uppy', metrics) => {
  analytics.track('upload_success', {
    component,
    uploadTime: metrics.duration,
    fileSize: metrics.totalSize,
    fileCount: metrics.fileCount
  })
}

// Track errors
const trackUploadError = (component: 'tus' | 'uppy', error) => {
  analytics.track('upload_error', {
    component,
    errorType: error.name,
    errorMessage: error.message
  })
}

// Compare metrics after migration
```

---

**Document Version:** 1.0.0
**Last Updated:** September 30, 2025
**Maintainer:** Form.io Team