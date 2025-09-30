# Form.io File Upload Test App

Local development testing application for Form.io file upload functionality.

## Purpose

This app provides a simple interface to test file upload features during development:
- Test uploads to local GCS emulator
- Verify form submissions with file attachments
- Debug upload progress and error handling
- Validate integration between formio-core, formio-react, and formio server

## Quick Start

```bash
# Start from monorepo root
make local-up          # Start all services (MongoDB, GCS, Form.io)

# In another terminal
cd test-app
npm install
npm run dev

# Open browser
open http://localhost:64849
```

## Architecture

```
Test App (port 64849)
    ↓
Form.io Server (port 3001)
    ↓
GCS Emulator (port 4443)
    ↓
MongoDB (port 27017)
```

## Development Workflow

1. Make changes to formio-core or formio-react
2. Rebuild packages: `yarn build`
3. Test app auto-reloads
4. Upload files and verify behavior
5. Check logs: `make local-logs-formio`

## Features to Test

- [ ] File selection (click + drag-and-drop)
- [ ] Upload progress tracking
- [ ] Chunked/resumable uploads
- [ ] Multiple file uploads
- [ ] File validation (size, type)
- [ ] Error handling
- [ ] Download uploaded files
- [ ] Form submission with files

## Tech Stack

- **Vite** - Fast development server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **@formio/react** - Form.io React components (added after building)
- **@formio/core** - Form.io core engine (added after building)