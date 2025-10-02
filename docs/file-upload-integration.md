# Form.io File Upload Integration Guide

## 📋 Overview

This guide explains how to integrate TUS and Uppy file uploads with Form.io forms so that uploaded file URLs are properly included in form submission data.

## 🎯 Integration Requirements

For file uploads to work correctly with Form.io:

1. **Component must call `setValue()`** - Update Form.io's `dataValue` with uploaded file metadata
2. **Component must call `updateValue()`** - Propagate value changes to parent form
3. **Component must call `triggerChange()`** - Notify form listeners of value changes
4. **File data must include URL** - Uploaded files must contain accessible URL

## 🔄 Component Data Flow

### 1. File Upload Success Flow

```typescript
onSuccess: () => {
  // Step 1: Create Form.io compatible data structure
  const fileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    url: uploadUrl,          // ✅ REQUIRED: Accessible file URL
    storage: 'tus',          // Storage backend identifier
    originalName: file.name,
    uploadId: uploadId       // Optional: backend upload ID
  };

  // Step 2: Update component dataValue (handle single vs multiple)
  if (this.component.multiple) {
    this.dataValue = [...(this.dataValue || []), fileData];
  } else {
    this.dataValue = fileData;
  }

  // Step 3: Trigger Form.io updates
  this.updateValue();      // ✅ REQUIRED: Update form model
  this.triggerChange();    // ✅ REQUIRED: Notify form listeners
}
```

### 2. Form Submission Flow

```typescript
form.on('submit', (submission) => {
  console.log(submission.data);
  // Output includes file URLs:
  // {
  //   fullName: "John Doe",
  //   email: "john@example.com",
  //   resume: {
  //     name: "resume.pdf",
  //     url: "http://localhost:1080/files/abc123",
  //     size: 245632,
  //     type: "application/pdf",
  //     storage: "tus"
  //   }
  // }
});
```

## 🚀 TUS Component Usage

### Single File Upload

```typescript
{
  type: 'tusupload',
  key: 'document',
  label: 'Upload Document',
  storage: 'tus',
  url: 'http://localhost:1080/files',
  multiple: false,
  filePattern: '*.pdf,*.doc,*.docx',
  validate: { required: true }
}
```

**Submission Data Structure:**
```json
{
  "data": {
    "document": {
      "name": "resume.pdf",
      "size": 245632,
      "type": "application/pdf",
      "url": "http://localhost:1080/files/abc123",
      "storage": "tus",
      "uploadId": "abc123"
    }
  }
}
```

### Multiple File Upload

```typescript
{
  type: 'tusupload',
  key: 'attachments',
  label: 'Upload Attachments',
  storage: 'tus',
  url: 'http://localhost:1080/files',
  multiple: true,
  filePattern: '*',
  description: 'Upload multiple files'
}
```

**Submission Data Structure:**
```json
{
  "data": {
    "attachments": [
      {
        "name": "file1.pdf",
        "url": "http://localhost:1080/files/def456",
        "size": 123456,
        "type": "application/pdf",
        "storage": "tus"
      },
      {
        "name": "file2.pdf",
        "url": "http://localhost:1080/files/ghi789",
        "size": 654321,
        "type": "application/pdf",
        "storage": "tus"
      }
    ]
  }
}
```

## 🎨 Uppy Component Usage

### Rich Upload Interface

```typescript
{
  type: 'uppyupload',
  key: 'photos',
  label: 'Upload Photos',
  storage: 'url',
  url: 'http://localhost:1080/files',
  multiple: true,
  filePattern: '*.jpg,*.jpeg,*.png',
  uppyOptions: {
    inline: true,
    height: 450,
    showProgressDetails: true,
    plugins: ['Webcam', 'ImageEditor', 'Url', 'ScreenCapture']
  }
}
```

**Uppy Plugins:**
- `Webcam` - Capture photos from webcam
- `ImageEditor` - Crop and edit images
- `ScreenCapture` - Record screen
- `Audio` - Record audio
- `Url` - Import from URL

## 🔧 Component Implementation Reference

### TUS Component Integration (Fixed)

**File:** `packages/formio-file-upload/src/components/TusFileUpload/Component.ts`

**Critical Methods:**

```typescript
// 1. Upload success handler (lines 275-305)
onSuccess: () => {
  uploadFile.status = UploadStatus.COMPLETED;
  uploadFile.url = upload.url;

  const fileData = {
    name: uploadFile.name,
    size: uploadFile.size,
    type: uploadFile.type,
    url: uploadFile.url,
    storage: 'tus',
    originalName: file.name,
    uploadId: uploadFile.uploadId
  };

  if (this.component.multiple) {
    this.dataValue = [...(this.dataValue || []), fileData];
  } else {
    this.dataValue = fileData;
  }

  this.updateValue();
  this.triggerChange();
  resolve(uploadFile);
}

// 2. setValue method (lines 363-370)
setValue(value: any, flags: any = {}) {
  const changed = super.setValue(value, flags);
  if (changed) {
    this.redraw();
    this.triggerChange();
  }
  return changed;
}

// 3. Display method (lines 379-389)
getView(value: any): string {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.map(file =>
      `<a href="${file.url}" target="_blank">${file.name}</a>`
    ).join('<br>');
  }
  return `<a href="${value.url}" target="_blank">${value.name}</a>`;
}
```

### Uppy Component Integration (Already Working)

**File:** `packages/formio-file-upload/src/components/UppyFileUpload/Component.ts`

```typescript
this.uppy.on('upload-success', (file: any, response: any) => {
  const uploadFile: UploadFile = {
    id: file.id,
    name: file.name,
    size: file.size,
    type: file.type,
    url: response.uploadURL,
    storage: this.component.storage,
    status: UploadStatus.COMPLETED,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add to component value
  const currentValue = this.getValue() || [];
  if (this.component.multiple) {
    this.setValue([...currentValue, uploadFile]);
  } else {
    this.setValue(uploadFile);
  }
});
```

## 🧪 Testing Integration

### Manual Testing

1. **Navigate to Test Page:**
   ```
   http://localhost:64849
   Click "🎯 Submission Integration Test"
   ```

2. **Fill Form:**
   - Enter full name
   - Enter email
   - Upload resume (required)
   - Upload portfolio files (optional)
   - Upload profile photo (optional)

3. **Submit and Verify:**
   - Click "Submit Application"
   - Check submission JSON contains file URLs
   - Verify all file links are clickable
   - Confirm success criteria checkmarks

### E2E Test Suite

**Run Integration Tests:**
```bash
cd test-app
npx playwright test tests/e2e/formio-integration.spec.ts
```

**Test Coverage:**
- ✅ TUS single file upload includes URL in submission
- ✅ TUS multiple file upload includes all URLs
- ✅ Uppy upload includes URL in submission
- ✅ Form validation prevents submission without required files
- ✅ Submission data structure is correct
- ✅ Multiple uploads maintain separate URLs
- ✅ Integration criteria checklist displays correctly

## 🐛 Troubleshooting

### Issue: Files upload but aren't in submission data

**Symptoms:**
- File uploads successfully to TUS server
- Form submission doesn't include file URL
- Submission data shows `null` or `undefined` for file field

**Root Cause:**
Component's `onSuccess` callback not calling `setValue()` and `updateValue()`

**Fix:**
```typescript
// ❌ WRONG - Only stores locally
onSuccess: () => {
  uploadFile.url = upload.url;
  this.updateProgress(uploadFile);
}

// ✅ CORRECT - Updates Form.io
onSuccess: () => {
  const fileData = { name, size, type, url: upload.url, storage: 'tus' };
  this.dataValue = this.component.multiple
    ? [...(this.dataValue || []), fileData]
    : fileData;
  this.updateValue();
  this.triggerChange();
}
```

### Issue: Multiple files only show last upload

**Symptoms:**
- Multiple file uploads work
- Only last uploaded file appears in submission

**Root Cause:**
Not handling array concatenation properly

**Fix:**
```typescript
// ❌ WRONG - Overwrites previous uploads
this.dataValue = fileData;

// ✅ CORRECT - Appends to array
if (this.component.multiple) {
  this.dataValue = [...(this.dataValue || []), fileData];
} else {
  this.dataValue = fileData;
}
```

### Issue: TUS server permission errors

**Error:** `open /data/uploads/xxx: permission denied`

**Fix:** Update `docker-compose.test.yml`:
```yaml
tus-server:
  user: "0:0"  # Run as root
  volumes:
    - tus-uploads:/data/uploads  # Use named volume
```

### Issue: Uppy CSS not loading

**Error:** `Missing "./dist/style.css" specifier in "@uppy/core" package`

**Fix:** Import CSS in consuming app, not library:
```typescript
// In test-app/src/main.tsx
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
```

## 📦 Build & Deploy

### Rebuild Packages After Changes

```bash
# Rebuild file upload package
cd packages/formio-file-upload
npm run build

# Rebuild React wrapper
cd ../formio-react
npm run build

# Restart dev server
cd ../../test-app
npm run dev
```

### Run Complete Validation

```bash
# 1. Start test infrastructure
docker-compose -f docker-compose.test.yml up -d

# 2. Wait for services to be healthy
docker-compose -f docker-compose.test.yml ps

# 3. Run E2E tests
cd test-app
npx playwright test tests/e2e/formio-integration.spec.ts --headed

# 4. Manual verification
open http://localhost:64849
# Click "🎯 Submission Integration Test"
```

## ✅ Success Criteria Checklist

Your integration is working correctly when:

- [ ] **TUS Single Upload**: `submission.data.resume = { url: '...', name: '...', size: ... }`
- [ ] **TUS Multiple Upload**: `submission.data.portfolio = [{ url: '...' }, ...]`
- [ ] **Uppy Upload**: `submission.data.profilePhoto = { url: '...', name: '...' }`
- [ ] **Form Validation**: Required file fields prevent submission when empty
- [ ] **File URLs**: All uploaded files have accessible URLs
- [ ] **E2E Tests**: All 7 integration tests pass
- [ ] **Manual Test**: Submission test page shows green checkmarks

## 📚 Additional Resources

- **TUS Protocol**: https://tus.io/protocols/resumable-upload
- **Uppy Documentation**: https://uppy.io/docs/
- **Form.io Custom Components**: https://help.form.io/developers/custom-components
- **Playwright Testing**: https://playwright.dev/docs/intro

## 🔗 Related Files

- **TUS Component**: `/packages/formio-file-upload/src/components/TusFileUpload/Component.ts`
- **Uppy Component**: `/packages/formio-file-upload/src/components/UppyFileUpload/Component.ts`
- **Module Registration**: `/packages/formio-file-upload/src/index.ts`
- **Test Page**: `/test-app/src/pages/FormioSubmissionTest.tsx`
- **E2E Tests**: `/test-app/tests/e2e/formio-integration.spec.ts`
- **Docker Setup**: `/docker-compose.test.yml`

---

**Last Updated:** October 2025
**Package Version:** formio-file-upload@1.0.0
