# @formio/file-upload

Enterprise-grade file upload module for Form.io with TUS resumable uploads and Uppy.js integration.

## Features

- ✅ **Resumable Uploads**: TUS protocol support for reliable file transfers
- 🎨 **Rich UI**: Uppy.js dashboard with drag-and-drop, webcam, and screen capture
- 📦 **Multiple Storage Backends**: GCS, S3, Azure, Local filesystem
- 🔒 **Security**: JWT authentication, file validation, virus scanning ready
- 🏗️ **Form Builder Integration**: Drag-and-drop components in Form.io builder
- 💾 **Auto-Resume**: Automatic upload recovery after connection loss
- 📱 **Mobile Ready**: Responsive design with touch support
- ♿ **Accessible**: WCAG 2.1 AA compliant

## Installation

```bash
npm install @formio/file-upload
# or
yarn add @formio/file-upload
```

## Quick Start

### 1. Register the Module

```javascript
import { Formio } from '@formio/js';
import FileUploadModule from '@formio/file-upload';

// Register the module
Formio.use(FileUploadModule);
```

### 2. Use in Form Definition

```javascript
const form = {
  components: [
    {
      type: 'tusupload',
      key: 'documents',
      label: 'Upload Documents',
      storage: 'tus',
      url: '/files',
      multiple: true,
      filePattern: '*.pdf,*.doc,*.docx',
      fileMaxSize: '10MB',
      validate: {
        required: true
      }
    }
  ]
};

// Create form
Formio.createForm(document.getElementById('formio'), form);
```

### 3. Use with Form Builder

The components automatically appear in the Form Builder under the "Premium" group:
- **TUS File Upload**: Basic resumable upload with progress
- **Uppy File Upload**: Rich dashboard with multiple input sources

## Component Types

### TUS File Upload (`tusupload`)

Basic TUS protocol upload with progress tracking:

```javascript
{
  type: 'tusupload',
  key: 'files',
  label: 'Upload Files',
  tusEndpoint: 'https://api.example.com/files',
  chunkSize: 8, // MB
  resumable: true,
  filePattern: '*.pdf',
  fileMaxSize: '100MB'
}
```

### Uppy File Upload (`uppyupload`)

Rich upload interface with Uppy Dashboard:

```javascript
{
  type: 'uppyupload',
  key: 'media',
  label: 'Upload Media',
  uppyOptions: {
    inline: true,
    height: 450,
    showProgressDetails: true,
    plugins: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url']
  }
}
```

## Server Configuration

### With Form.io Server

The module works seamlessly with Form.io server's built-in TUS infrastructure:

```javascript
// server.js
const formio = require('./index')(config);
const upload = require('./src/upload');

// Initialize upload module
upload.initialize(formio.router, {
  gcs: {
    projectId: 'your-project',
    bucketName: 'formio-uploads'
  },
  tus: {
    path: '/files',
    maxFileSize: 5 * 1024 * 1024 * 1024 // 5GB
  }
});
```

### Custom Express Server

```javascript
const express = require('express');
const { Server } = require('@tus/server');
const { FileStore } = require('@tus/file-store');

const app = express();

const tusServer = new Server({
  path: '/files',
  datastore: new FileStore({ directory: './uploads' })
});

app.all('/files/*', tusServer.handle.bind(tusServer));
```

## Configuration Options

### Global Configuration

```javascript
Formio.config.fileUpload = {
  tusEndpoint: '/files',
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
  chunkSize: 8 * 1024 * 1024, // 8MB
  allowedTypes: ['application/pdf', 'image/*'],
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
};
```

### Component Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storage` | string | 'tus' | Storage type (tus, url, base64) |
| `url` | string | '/files' | Upload endpoint URL |
| `multiple` | boolean | false | Allow multiple files |
| `filePattern` | string | '*' | Allowed file patterns |
| `fileMinSize` | string | '0KB' | Minimum file size |
| `fileMaxSize` | string | '1GB' | Maximum file size |
| `image` | boolean | false | Images only |
| `privateDownload` | boolean | false | Require auth for download |

### Uppy-Specific Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `uppyOptions.inline` | boolean | true | Show inline vs modal |
| `uppyOptions.height` | number | 450 | Dashboard height (px) |
| `uppyOptions.showProgressDetails` | boolean | true | Show upload progress |
| `uppyOptions.autoProceed` | boolean | false | Auto-start uploads |
| `uppyOptions.plugins` | array | [...] | Enabled Uppy plugins |

## Events

```javascript
// Component events
formio.on('fileUploadStart', (file) => {
  console.log('Upload started:', file);
});

formio.on('fileUploadProgress', ({ file, progress }) => {
  console.log('Progress:', progress);
});

formio.on('fileUploadComplete', (file) => {
  console.log('Upload complete:', file);
});

formio.on('fileUploadError', ({ file, error }) => {
  console.error('Upload error:', error);
});
```

## Validation

### Built-in Validators

- **File Size**: Min/max file size validation
- **File Type**: MIME type and extension validation
- **Virus Scan**: Server-side virus scanning (when configured)
- **Image Resolution**: Min/max image dimensions

### Custom Validation

```javascript
{
  type: 'tusupload',
  key: 'documents',
  validate: {
    custom: 'valid = value.every(file => file.size < 10485760)',
    customMessage: 'All files must be under 10MB'
  }
}
```

## Storage Providers

### Local Storage

```javascript
{
  storage: 'file',
  dir: './uploads'
}
```

### Google Cloud Storage

```javascript
{
  storage: 'gcs',
  projectId: 'your-project',
  bucketName: 'your-bucket',
  keyFilename: './service-account.json'
}
```

### Amazon S3

```javascript
{
  storage: 's3',
  bucket: 'your-bucket',
  region: 'us-east-1',
  accessKeyId: 'YOUR_KEY',
  secretAccessKey: 'YOUR_SECRET'
}
```

## Security

### Authentication

The module uses JWT tokens from Form.io's authentication system:

```javascript
// Tokens are automatically included in upload requests
headers: {
  'x-jwt-token': formio.getToken()
}
```

### File Validation

- Extension whitelist/blacklist
- MIME type verification
- Magic number validation
- File size limits
- Virus scanning integration

### Permissions

Integrates with Form.io's role-based permissions:

```javascript
{
  type: 'tusupload',
  key: 'documents',
  permissions: {
    create: ['authenticated'],
    read: ['authenticated'],
    update: ['admin'],
    delete: ['admin']
  }
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © Form.io

## Support

- [Documentation](https://help.form.io)
- [GitHub Issues](https://github.com/formio/file-upload/issues)
- [Community Forum](https://community.form.io)
- [Discord](https://discord.gg/formio)