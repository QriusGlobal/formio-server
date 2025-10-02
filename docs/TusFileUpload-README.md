# TusFileUpload Component

A production-ready React component for resumable file uploads using the TUS protocol. Built for Form.io with modern web standards, TypeScript support, and full accessibility.

## 🚀 Features

- ✅ **Resumable Uploads** - Continue interrupted uploads from where they left off
- ✅ **Drag & Drop** - Intuitive drag-and-drop interface with visual feedback
- ✅ **Multiple Files** - Upload multiple files simultaneously with queue management
- ✅ **Progress Tracking** - Real-time progress bars with speed and ETA
- ✅ **Pause/Resume/Cancel** - Full control over upload lifecycle
- ✅ **Preview Thumbnails** - Automatic image preview generation
- ✅ **Dynamic Chunking** - Intelligent chunk sizing (1MB-25MB) based on file size
- ✅ **Error Recovery** - Automatic retry with exponential backoff
- ✅ **Type Safety** - Full TypeScript support with comprehensive types
- ✅ **Accessibility** - WCAG 2.1 compliant with ARIA labels
- ✅ **Form.io Compatible** - Emits events compatible with formio.js
- ✅ **Responsive Design** - Mobile-friendly with touch support
- ✅ **Dark Mode** - Automatic dark mode support

## 📦 Installation

```bash
npm install tus-js-client
# or
yarn add tus-js-client
```

## 🎯 Quick Start

### Basic Usage

```tsx
import { TusFileUpload } from './components/TusFileUpload';

function App() {
  return (
    <TusFileUpload
      endpoint="https://tusd.tusdemo.net/files/"
      onSuccess={(files) => console.log('Uploaded:', files)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Advanced Configuration

```tsx
<TusFileUpload
  endpoint="https://your-tus-server.com/files/"
  chunkSize={5 * 1024 * 1024} // 5MB chunks
  maxFileSize={100 * 1024 * 1024} // 100MB limit
  maxFiles={5}
  allowedTypes={['image/*', '.pdf', '.docx']}
  metadata={{
    userId: '123',
    projectId: 'abc',
  }}
  onProgress={(fileId, progress) => {
    console.log(`File ${fileId}: ${progress.percentage}%`);
  }}
  onSuccess={(files) => {
    console.log('All files uploaded:', files);
  }}
  onError={(error, file) => {
    console.error(`Upload failed for ${file?.name}:`, error);
  }}
  multiple={true}
  showPreviews={true}
  autoStart={true}
  disabled={false}
/>
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | **required** | TUS server endpoint URL |
| `chunkSize` | `number` | auto | Chunk size in bytes (auto-calculated if not provided) |
| `maxFileSize` | `number` | `50MB` | Maximum file size in bytes |
| `maxFiles` | `number` | `10` | Maximum number of files allowed |
| `allowedTypes` | `string[]` | `[]` | Allowed file types (MIME types or extensions) |
| `metadata` | `Record<string, string>` | `{}` | Additional metadata to send with upload |
| `onSuccess` | `(files: UploadFile[]) => void` | - | Called when files are uploaded successfully |
| `onError` | `(error: Error, file?: UploadFile) => void` | - | Called when upload fails |
| `onProgress` | `(fileId: string, progress: UploadProgress) => void` | - | Called during upload progress |
| `disabled` | `boolean` | `false` | Disable upload functionality |
| `multiple` | `boolean` | `true` | Allow multiple file selection |
| `showPreviews` | `boolean` | `true` | Show image preview thumbnails |
| `autoStart` | `boolean` | `true` | Auto-start uploads after file selection |
| `className` | `string` | `''` | Additional CSS class name |

### Types

#### UploadFile

```typescript
interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
  progress: number;
  bytesUploaded?: number;
  bytesTotal?: number;
  speed?: number;
  timeRemaining?: number;
  uploadUrl?: string;
  preview?: string | null;
  error?: Error;
}
```

#### UploadProgress

```typescript
interface UploadProgress {
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
}
```

## 🎨 Customization

### Custom Styling

The component uses CSS classes that can be overridden:

```css
/* Override drop zone style */
.tus-dropzone {
  border: 2px dashed #your-color;
  background-color: #your-background;
}

/* Customize progress bar */
.tus-progress-fill {
  background: linear-gradient(90deg, #your-start-color, #your-end-color);
}

/* Style file items */
.tus-file-item.status-uploading {
  border-color: #your-color;
}
```

### Using the Hook Directly

For custom UI implementations, use the `useTusUpload` hook:

```tsx
import { useTusUpload } from './components/useTusUpload';

function CustomUpload() {
  const { uploadFile, pauseUpload, resumeUpload, cancelUpload } = useTusUpload({
    endpoint: 'https://tusd.tusdemo.net/files/',
    onProgress: (fileId, progress) => {
      console.log(`Progress: ${progress.percentage}%`);
    },
    onSuccess: (fileId, url) => {
      console.log(`Uploaded: ${url}`);
    },
    onError: (fileId, error) => {
      console.error(`Error: ${error.message}`);
    },
  });

  const handleFileSelect = (file: File) => {
    const fileId = `${Date.now()}`;
    uploadFile(fileId, file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => {
        if (e.target.files?.[0]) {
          handleFileSelect(e.target.files[0]);
        }
      }} />
    </div>
  );
}
```

## 🔧 Server Setup

### Using tusd (Go)

```bash
# Install tusd
brew install tusd

# Run with S3 backend
tusd -s3-bucket your-bucket \
     -s3-endpoint https://s3.amazonaws.com \
     -hooks-http https://your-api.com/hooks/tus
```

### Using tus-node-server

```javascript
const { Server } = require('@tus/server');
const { FileStore } = require('@tus/file-store');

const server = new Server({
  path: '/files',
  datastore: new FileStore({ directory: './uploads' }),
});

app.all('/files/*', (req, res) => server.handle(req, res));
```

## 🧪 Testing

### Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TusFileUpload } from './TusFileUpload';

test('renders upload component', () => {
  render(<TusFileUpload endpoint="https://test.com" />);
  expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
});

test('handles file selection', () => {
  const onSuccess = jest.fn();
  render(<TusFileUpload endpoint="https://test.com" onSuccess={onSuccess} />);

  const file = new File(['content'], 'test.txt', { type: 'text/plain' });
  const input = screen.getByRole('button', { name: /file upload drop zone/i });

  fireEvent.change(input, { target: { files: [file] } });

  expect(screen.getByText('test.txt')).toBeInTheDocument();
});
```

## 📖 Examples

### Integration with Form.io

```tsx
import { TusFileUpload } from './components/TusFileUpload';

function FormioFileComponent({ component, onChange }) {
  return (
    <TusFileUpload
      endpoint={component.storage?.url || 'https://tusd.tusdemo.net/files/'}
      maxFileSize={component.fileMaxSize}
      allowedTypes={component.filePattern ? [component.filePattern] : []}
      onSuccess={(files) => {
        // Update Form.io component value
        onChange(files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          url: f.uploadUrl,
        })));
      }}
      onError={(error, file) => {
        console.error('Upload failed:', error);
      }}
    />
  );
}
```

### With Authentication

```tsx
<TusFileUpload
  endpoint="https://your-server.com/files/"
  metadata={{
    authorization: `Bearer ${authToken}`,
    userId: currentUser.id,
  }}
  onSuccess={(files) => {
    // Handle success
  }}
/>
```

### Large File Uploads

```tsx
<TusFileUpload
  endpoint="https://your-server.com/files/"
  chunkSize={25 * 1024 * 1024} // 25MB chunks for large files
  maxFileSize={5 * 1024 * 1024 * 1024} // 5GB limit
  onProgress={(fileId, progress) => {
    console.log(`Speed: ${(progress.speed / 1024 / 1024).toFixed(2)} MB/s`);
    console.log(`ETA: ${progress.timeRemaining}s`);
  }}
/>
```

## 🔒 Security Considerations

1. **Server-side Validation**: Always validate file types and sizes on the server
2. **Authentication**: Use metadata to pass authentication tokens
3. **Virus Scanning**: Implement virus scanning on upload completion
4. **Rate Limiting**: Implement rate limiting on your TUS server
5. **CORS Configuration**: Configure CORS properly for your TUS endpoint

```javascript
// Example server-side validation
app.post('/upload/init', authenticate, (req, res) => {
  const { filename, size, type } = req.body;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  // Validate file size
  if (size > 50 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large' });
  }

  // Continue with upload...
});
```

## 🐛 Troubleshooting

### CORS Issues

Ensure your TUS server has proper CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, PATCH, POST, DELETE
Access-Control-Allow-Headers: *
Access-Control-Expose-Headers: Upload-Offset, Location, Upload-Length
```

### Resume Not Working

Check that `storeFingerprintForResuming` is enabled and localStorage is available:

```typescript
// The hook automatically enables this
storeFingerprintForResuming: true
```

### Slow Uploads

- Increase chunk size for faster connections
- Enable parallel uploads (up to 3 recommended)
- Check network conditions

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📚 Resources

- [TUS Protocol Specification](https://tus.io/protocols/resumable-upload)
- [tus-js-client Documentation](https://github.com/tus/tus-js-client)
- [Form.io Documentation](https://help.form.io/)
- [React Documentation](https://react.dev/)

## 🙏 Credits

Built with:
- [tus-js-client](https://github.com/tus/tus-js-client) - TUS protocol implementation
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Version:** 1.0.0
**Last Updated:** 2025-09-30
**Maintained by:** Form.io Team