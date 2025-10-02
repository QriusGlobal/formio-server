# Quick Start Guide - Form.io TUS File Upload

## Prerequisites

1. **TUS Server Running**
   ```bash
   tusd -port 1080 -dir ./uploads
   ```

2. **Test App Running**
   ```bash
   cd test-app
   npm run dev
   ```

## Testing the Implementation

### Step 1: Access the Demo
1. Open browser to `http://localhost:64849`
2. Click "📋 Form.io + TUS Integration" button

### Step 2: Upload Files
1. Click "Browse files" or drag-and-drop files
2. Select one or more files (up to 100MB each)
3. Watch real-time upload progress
4. Wait for "Upload complete" message

### Step 3: Submit Form
1. Once files are uploaded, click the "Submit" button
2. View submission result with file data
3. Check uploaded files list with download links

## What You'll See

### Upload Progress
- Real-time progress bar (0-100%)
- Individual file status
- Total upload percentage

### Uploaded Files
- File names and sizes
- View/download links
- Upload completion status

### Submission Result
- Complete JSON submission data
- All uploaded file information
- File URLs from TUS server

## File Structure Created

```
test-app/
├── src/
│   ├── components/
│   │   └── FormioTusUploader.tsx     (338 lines) - Main component
│   ├── config/
│   │   └── uppy-config.ts            (166 lines) - Configuration
│   ├── types/
│   │   └── formio.d.ts               (103 lines) - TypeScript types
│   ├── schemas/
│   │   └── tus-file-upload-component.json - Form schema
│   └── pages/
│       └── FormioTusDemo.tsx          (307 lines) - Demo page
└── docs/
    ├── FORMIO_TUS_IMPLEMENTATION.md   (389 lines) - Full documentation
    └── QUICK_START.md                 (This file)
```

## Total Implementation

- **1,200+ lines of code**
- **5 new TypeScript/JSON files**
- **Comprehensive documentation**
- **Full error handling**
- **Real-time progress tracking**

## Key Features Implemented

✅ Resumable TUS uploads
✅ Uppy Dashboard UI
✅ Multiple file support
✅ Progress tracking
✅ Error handling with retry
✅ Form.io integration
✅ TypeScript strict mode
✅ Complete documentation
✅ Demo page with examples
✅ Submission data handling

## Dependencies Added

- `@formio/react` (v6.1.0)
- `@uppy/core` (v5.0.2)
- `@uppy/dashboard` (v5.0.2)
- `@uppy/react` (v5.1.0)
- `@uppy/tus` (v5.0.1)
- `@uppy/xhr-upload` (v5.0.1)

## Troubleshooting

### Upload Fails
1. Check TUS server is running on port 1080
2. Verify endpoint: `http://localhost:1080/files/`
3. Check browser console for errors

### Types Errors
1. Restart TypeScript server in IDE
2. Check `formio.d.ts` is included
3. Run `npm run typecheck`

### Files Not Showing
1. Wait for upload to complete (100%)
2. Check "Upload complete" message appears
3. Verify file URLs in submission data

## Next Steps

1. Test with different file types and sizes
2. Try multiple file uploads
3. Test error scenarios (stop TUS server)
4. Review implementation documentation
5. Customize configuration as needed

## Need Help?

See full documentation: `docs/FORMIO_TUS_IMPLEMENTATION.md`