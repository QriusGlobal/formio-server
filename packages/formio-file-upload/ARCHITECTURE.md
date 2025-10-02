# Architecture Documentation

## Module Structure

The @formio/file-upload module follows Form.io's standard module architecture:

```
@formio/file-upload/
├── src/
│   ├── index.ts                    # Module export & registration
│   ├── components/
│   │   ├── TusFileUpload/
│   │   │   └── Component.ts        # TUS upload component
│   │   └── UppyFileUpload/
│   │       └── Component.ts        # Uppy dashboard component
│   ├── providers/
│   │   └── FileStorageProvider.ts  # Storage abstraction layer
│   ├── templates/
│   │   └── index.ts                # UI framework templates
│   ├── validators/
│   │   └── index.ts                # File validation rules
│   └── types/
│       └── index.ts                # TypeScript definitions
└── lib/                            # Built output
```

## Component Architecture

### Base Component Extension

Both file upload components extend Form.io's base `FileComponent`:

```typescript
class TusFileUploadComponent extends Components.components.file {
  static schema() { /* Component schema */ }
  static builderInfo() { /* Form builder metadata */ }
  static editForm() { /* Component settings */ }

  attach(element) { /* DOM attachment */ }
  getValue() { /* Get component value */ }
  setValue(value) { /* Set component value */ }
}
```

### Component Registration

Components are registered through the module export:

```typescript
const FormioFileUploadModule = {
  components: {
    tusupload: TusFileUploadComponent,
    uppyupload: UppyFileUploadComponent
  }
};

// Usage
Formio.use(FormioFileUploadModule);
```

## Data Flow

### Upload Process

1. **User Selection**: File selected via UI (drag-drop, browse, camera)
2. **Validation**: Client-side validation (type, size)
3. **Upload Initiation**: TUS/Uppy creates upload session
4. **Chunked Transfer**: File sent in chunks to server
5. **Server Processing**: Server validates and stores chunks
6. **Completion**: Server returns file URL/ID
7. **Form Integration**: Component value updated with file metadata
8. **Submission**: File metadata included in form submission

### State Management

```typescript
interface UploadState {
  files: UploadFile[];      // Current files
  uploading: boolean;        // Upload in progress
  progress: number;          // Overall progress (0-100)
  errors: UploadError[];     // Any errors
}
```

## Server Integration

### TUS Protocol

The module uses TUS resumable upload protocol:

```
Client                          Server
  |                               |
  |--POST /files (create)-------->|
  |<-----201 Created (location)---|
  |                               |
  |--PATCH /files/:id (chunk)---->|
  |<-----204 No Content-----------|
  |                               |
  |--HEAD /files/:id (status)---->|
  |<-----200 OK (offset)----------|
```

### Authentication

JWT tokens are automatically included:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'x-jwt-token': token
}
```

## Storage Providers

### Provider Interface

```typescript
interface StorageProvider {
  uploadFile(file: File, config: any): Promise<UploadFile>;
  downloadFile(file: UploadFile): Promise<Blob>;
  deleteFile(file: UploadFile): Promise<void>;
  getFileUrl(file: UploadFile): Promise<string>;
}
```

### Supported Backends

- **Local**: File system storage
- **GCS**: Google Cloud Storage
- **S3**: Amazon S3
- **Azure**: Azure Blob Storage
- **GridFS**: MongoDB GridFS

## Template System

### Framework Support

Templates are provided for multiple UI frameworks:

- Bootstrap 5 (default)
- Semantic UI
- Material Design
- Custom templates

### Template Registration

```typescript
registerTemplates(framework: string) {
  return {
    tusupload: { form: templateString },
    uppyupload: { form: templateString }
  };
}
```

## Validation System

### Built-in Validators

1. **File Size**: Min/max size validation
2. **File Type**: Extension and MIME type
3. **Virus Scan**: Server-side scanning
4. **Image Resolution**: Dimension validation

### Custom Validation

```javascript
{
  validate: {
    custom: 'valid = value.size < 10485760',
    customMessage: 'File must be under 10MB'
  }
}
```

## Event System

### Component Events

```typescript
// Upload lifecycle
'fileUploadStart': (file: UploadFile) => void
'fileUploadProgress': ({ file, progress }) => void
'fileUploadComplete': (file: UploadFile) => void
'fileUploadError': ({ file, error }) => void
'fileUploadCancelled': (file: UploadFile) => void

// User actions
'fileAdded': (file: File) => void
'fileRemoved': (file: UploadFile) => void
```

## Security Considerations

### Client-Side

- File type validation
- Size restrictions
- Content Security Policy compliance
- XSS prevention in file names

### Server-Side

- JWT authentication
- Rate limiting
- File type verification
- Virus scanning
- Path traversal prevention

## Performance Optimizations

### Chunked Uploads

- Default chunk size: 8MB
- Parallel chunk uploads: 3
- Automatic retry on failure

### Caching

- Service Worker support (Golden Retriever)
- Local storage for metadata
- Resume incomplete uploads

### Lazy Loading

- Components loaded on-demand
- Styles bundled separately
- Tree-shaking support

## Browser Compatibility

### Required APIs

- File API
- FormData API
- Fetch API
- WebWorker API (optional)
- Service Worker API (optional)

### Polyfills

Required for older browsers:
- Promise
- Object.assign
- Array.from
- Symbol

## Testing Strategy

### Unit Tests

- Component logic
- Validators
- Storage providers
- Event handling

### Integration Tests

- Form.io integration
- Server communication
- File upload flow
- Error handling

### E2E Tests

- Complete upload flow
- Resume functionality
- Error recovery
- Form submission

## Future Enhancements

### Planned Features

1. **Advanced Processing**
   - Client-side image compression
   - Video thumbnail generation
   - Document preview

2. **Enhanced Security**
   - Client-side encryption
   - Signed URLs
   - Watermarking

3. **Performance**
   - WebAssembly acceleration
   - P2P transfers
   - CDN integration

4. **Accessibility**
   - Screen reader improvements
   - Keyboard navigation
   - Voice commands

5. **Integration**
   - Cloud provider SDKs
   - Third-party services
   - Workflow automation