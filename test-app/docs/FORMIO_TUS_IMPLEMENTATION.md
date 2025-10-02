# Form.io TUS File Upload - Implementation Documentation

## Overview

This document describes the implementation of Form.io file upload component with TUS (Tus Resumable Upload Protocol) integration using Uppy Dashboard for the React test application.

## Architecture

### Components

1. **FormioTusUploader** (`src/components/FormioTusUploader.tsx`)
   - Main React component wrapping Form.io with Uppy integration
   - Manages file upload state and coordinates between Uppy and Form.io
   - Provides real-time progress tracking and error handling

2. **Uppy Configuration** (`src/config/uppy-config.ts`)
   - Centralized configuration for TUS uploads
   - Configurable restrictions (file size, type, count)
   - Presets for common use cases

3. **TypeScript Types** (`src/types/formio.d.ts`)
   - Complete type definitions for Form.io components
   - Uppy file types and upload results
   - Strong typing for component props and events

4. **Form Schema** (`src/schemas/tus-file-upload-component.json`)
   - JSON schema for Form.io file component
   - TUS-specific configuration
   - Uppy dashboard settings

5. **Demo Page** (`src/pages/FormioTusDemo.tsx`)
   - Complete demo implementation
   - Shows upload status and submission results
   - Interactive UI for testing

## Features

### Core Features
- ✅ Resumable uploads using TUS protocol
- ✅ Real-time upload progress tracking
- ✅ Multiple file uploads support
- ✅ Automatic retry on network failures
- ✅ File type and size validation
- ✅ Complete Form.io form integration
- ✅ Submission data handling

### Technical Features
- TypeScript strict mode compliance
- Proper error boundaries and handling
- Loading states and user feedback
- Clean component architecture
- Comprehensive documentation
- Modular configuration system

## Configuration

### TUS Server Endpoint

Default endpoint: `http://localhost:1080/files/`

Configure in `uppy-config.ts`:
```typescript
export const defaultUppyConfig = {
  tusEndpoint: 'http://localhost:1080/files/',
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxNumberOfFiles: 10,
  // ...
};
```

### File Restrictions

Set in component props:
```typescript
<FormioTusUploader
  uppyConfig={{
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxNumberOfFiles: 5,
    allowedFileTypes: ['image/*', '.pdf'],
  }}
/>
```

### Retry Configuration

Configure retry delays for failed uploads:
```typescript
retryDelays: [0, 1000, 3000, 5000] // milliseconds
```

## Usage

### Basic Usage

```typescript
import { FormioTusUploader } from './components/FormioTusUploader';
import formSchema from './schemas/tus-file-upload-component.json';

function MyComponent() {
  const handleSubmit = (submission) => {
    console.log('Form submitted:', submission);
  };

  return (
    <FormioTusUploader
      form={formSchema}
      onSubmit={handleSubmit}
    />
  );
}
```

### Advanced Usage with All Callbacks

```typescript
<FormioTusUploader
  form={formSchema}
  submission={initialData}
  uppyConfig={{
    tusEndpoint: 'http://localhost:1080/files/',
    maxFileSize: 100 * 1024 * 1024,
    debug: true,
  }}
  onSubmit={(submission) => {
    console.log('Submitted:', submission);
  }}
  onError={(errors) => {
    console.error('Errors:', errors);
  }}
  onChange={(changed) => {
    console.log('Changed:', changed);
  }}
  onUploadStart={(files) => {
    console.log('Upload started:', files);
  }}
  onUploadProgress={(progress) => {
    console.log(`Progress: ${progress}%`);
  }}
  onUploadComplete={(results) => {
    console.log('Upload complete:', results);
  }}
/>
```

## Data Flow

1. **File Selection**
   - User selects files via Uppy Dashboard
   - Uppy validates file size and type
   - Files queued for upload

2. **Upload Process**
   - Uppy uploads to TUS server in chunks
   - Progress events fire during upload
   - Upload can be paused/resumed
   - Automatic retry on failure

3. **Upload Completion**
   - TUS server returns file URL
   - URLs stored in component state
   - Files list displayed to user

4. **Form Submission**
   - User fills remaining form fields
   - Clicks submit button
   - File URLs merged into submission data
   - onSubmit callback fired with complete data

## Event Handling

### Upload Events

- `onUploadStart(files)` - Fires when upload begins
- `onUploadProgress(progress)` - Fires on progress update (0-100)
- `onUploadComplete(results)` - Fires when all uploads finish

### Form Events

- `onSubmit(submission)` - Fires on form submission
- `onChange(changed)` - Fires on any form field change
- `onError(errors)` - Fires on validation errors

## Error Handling

The component implements comprehensive error handling:

1. **Network Errors**
   - Automatic retry with exponential backoff
   - User notification of retry attempts
   - Graceful failure after max retries

2. **Validation Errors**
   - File size validation
   - File type validation
   - Form field validation
   - Clear error messages to user

3. **Server Errors**
   - TUS server connection issues
   - Upload failure handling
   - Error callback invocation

## Styling

The component uses inline styles for maximum portability. Key style features:

- Responsive Uppy Dashboard
- Progress bar visualization
- Status message styling (success/error/warning)
- File list display
- Submission result formatting

Custom styling can be applied via the `className` prop:
```typescript
<FormioTusUploader
  className="my-custom-uploader"
  {...props}
/>
```

## Testing

### Running the Demo

1. Start TUS server:
   ```bash
   tusd -port 1080 -dir ./uploads
   ```

2. Start test app:
   ```bash
   cd test-app
   npm run dev
   ```

3. Navigate to Form.io + TUS Integration page
4. Upload files and test the complete flow

### Test Scenarios

1. **Single File Upload**
   - Select one file
   - Wait for upload completion
   - Submit form
   - Verify submission data

2. **Multiple File Upload**
   - Select multiple files
   - Monitor progress for each
   - Verify all files complete
   - Check submission data

3. **Large File Upload**
   - Upload file near max size
   - Verify chunked upload
   - Test pause/resume (if enabled)
   - Confirm successful completion

4. **Error Handling**
   - Stop TUS server mid-upload
   - Verify retry mechanism
   - Restart server
   - Confirm upload resumes

5. **Validation**
   - Attempt oversized file
   - Try invalid file type
   - Verify error messages
   - Confirm validation prevents upload

## Performance Considerations

### Chunk Size
- Default: 5MB chunks
- Adjustable based on network conditions
- Larger chunks = fewer requests
- Smaller chunks = more granular progress

### Memory Usage
- Files stored in browser memory during upload
- Consider file size limits
- Multiple large files = high memory usage

### Network Optimization
- Parallel uploads supported
- Automatic retry reduces failed uploads
- Resumable uploads save bandwidth

## Security Considerations

1. **File Type Validation**
   - Client-side validation (UX)
   - Server-side validation required
   - MIME type checking

2. **File Size Limits**
   - Prevents DoS via large uploads
   - Configurable per use case
   - Server-side enforcement critical

3. **Authentication**
   - TUS endpoint should require auth
   - Configure `withCredentials` if needed
   - Token-based auth recommended

4. **CORS Configuration**
   - TUS server must allow cross-origin
   - Configure appropriate origins
   - Restrict in production

## Troubleshooting

### Upload Fails Immediately
- Check TUS server is running
- Verify endpoint URL is correct
- Check CORS configuration
- Inspect browser console for errors

### Progress Stalls
- Network interruption
- TUS server issue
- Check retry configuration
- Monitor server logs

### Files Not in Submission
- Ensure upload completes before submit
- Check onUploadComplete callback
- Verify file URLs are stored
- Inspect submission data

### Type Errors
- Ensure TypeScript definitions imported
- Check formio.d.ts is included
- Verify form schema structure
- Update @formio/react version

## Future Enhancements

### Potential Improvements
- [ ] Image preview before upload
- [ ] Webcam capture integration
- [ ] Drag-and-drop file selection
- [ ] Upload cancellation
- [ ] Pause/resume UI controls
- [ ] Custom file validation rules
- [ ] Server-side processing status
- [ ] File metadata editing
- [ ] Upload queue management
- [ ] Bandwidth throttling

### Integration Opportunities
- [ ] AWS S3 direct upload
- [ ] Google Cloud Storage
- [ ] Azure Blob Storage
- [ ] CDN integration
- [ ] Image optimization service
- [ ] Virus scanning integration
- [ ] File conversion service

## Resources

### Documentation
- [Form.io Documentation](https://help.form.io/)
- [Uppy Documentation](https://uppy.io/docs/)
- [TUS Protocol Specification](https://tus.io/protocols/resumable-upload.html)

### Repositories
- [Form.io React](https://github.com/formio/react)
- [Uppy](https://github.com/transloadit/uppy)
- [TUS JS Client](https://github.com/tus/tus-js-client)

### Related Files
- `/test-app/src/components/FormioTusUploader.tsx` - Main component
- `/test-app/src/config/uppy-config.ts` - Configuration
- `/test-app/src/types/formio.d.ts` - Type definitions
- `/test-app/src/schemas/tus-file-upload-component.json` - Form schema
- `/test-app/src/pages/FormioTusDemo.tsx` - Demo implementation

## Support

For issues or questions:
1. Check this documentation
2. Review browser console errors
3. Verify TUS server logs
4. Test with minimal configuration
5. Check component props and callbacks

## License

This implementation is part of the Form.io monorepo project. Refer to the project root for license information.