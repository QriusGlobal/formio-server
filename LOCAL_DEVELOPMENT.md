# Local Development Guide

Complete guide to running and testing Form.io file upload locally.

## Quick Start

```bash
# Start everything
make -f Makefile.local quick-start

# OR manual steps:
make -f Makefile.local local-up    # Start Docker services
make -f Makefile.local test-app    # Start test app
```

Open http://localhost:64849 in your browser.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│               LOCAL ENVIRONMENT                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Test App (React)                                   │
│  └─ http://localhost:64849                          │
│      ↓                                               │
│  Form.io Server (Node.js)                           │
│  └─ http://localhost:3001                           │
│      ↓                                               │
│  GCS Emulator (fake-gcs-server)                     │
│  └─ http://localhost:4443                           │
│      ↓                                               │
│  MongoDB                                             │
│  └─ mongodb://localhost:27017                       │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| **Test App** | 64849 | React app for testing uploads |
| **Form.io Server** | 3001 | API server with file upload |
| **GCS Emulator** | 4443 | Fake Google Cloud Storage |
| **MongoDB** | 27017 | Database |

## Development Workflow

### Option 1: Automated (tmux)

```bash
./scripts/dev-workflow.sh
```

This opens 5 terminal panes:
- Window 0: Docker services
- Window 1: formio-core watch mode
- Window 2: Server logs
- Window 3: Test app
- Window 4: Shell for commands

**tmux shortcuts:**
- `Ctrl+B` then `0-4`: Switch windows
- `Ctrl+B` then `D`: Detach (keeps running)
- `Ctrl+B` then `:kill-session`: Exit

### Option 2: Manual

```bash
# Terminal 1: Start services
make -f Makefile.local local-up

# Terminal 2: Watch formio-core
cd formio-core && yarn build:watch

# Terminal 3: Test app
cd test-app && npm run dev

# Terminal 4: View logs
make -f Makefile.local local-logs-formio
```

## Development Cycle

```bash
# 1. Make code changes
vim formio-core/src/experimental/components/fileupload/FileUpload.ts

# 2. formio-core auto-rebuilds (if using yarn build:watch)

# 3. Test in browser
# → Upload file at http://localhost:64849

# 4. Check logs
make -f Makefile.local local-logs-formio

# 5. Verify upload
make -f Makefile.local verify-upload

# 6. Iterate
```

## Useful Commands

### Service Management

```bash
make -f Makefile.local local-up           # Start all services
make -f Makefile.local local-down         # Stop services (keep data)
make -f Makefile.local local-reset        # Delete all data
make -f Makefile.local verify-services    # Check health
make -f Makefile.local status             # Show status
```

### Logs

```bash
make -f Makefile.local local-logs         # All services
make -f Makefile.local local-logs-formio  # Form.io only
make -f Makefile.local local-logs-gcs     # GCS only
make -f Makefile.local local-logs-mongo   # MongoDB only
```

### Testing

```bash
make -f Makefile.local test-app           # Start test app
make -f Makefile.local verify-upload      # List uploaded files
make -f Makefile.local inspect-gcs        # Detailed GCS info
make -f Makefile.local test-integration   # Run tests
```

### Debugging

```bash
make -f Makefile.local shell-formio       # Shell in container
make -f Makefile.local shell-mongo        # MongoDB shell
make -f Makefile.local ports              # Show all ports
```

## Testing Checklist

### Service Tests (in Test App UI)

1. Click "Test Form.io Server" → ✅
2. Click "Test GCS Emulator" → ✅
3. Click "Test MongoDB" → ✅

### File Upload Tests

Once you've built the components:

- [ ] Upload 5MB PDF → Success
- [ ] Upload 50MB video → Progress bar works
- [ ] Upload 5 files simultaneously → All complete
- [ ] Drag and drop file → Works
- [ ] Invalid file type → Error message
- [ ] Oversized file → Error message
- [ ] Pause upload → Works
- [ ] Resume upload → Continues from offset
- [ ] Kill server mid-upload → Auto-resumes
- [ ] Submit form → Includes file data

## Troubleshooting

### Services won't start

```bash
# Check ports are free
lsof -i :3001,27017,4443,64849

# Reset environment
make -f Makefile.local local-reset
make -f Makefile.local local-up
```

### Form.io server errors

```bash
# View logs
make -f Makefile.local local-logs-formio

# Restart server
docker-compose -f docker-compose.local.yml restart formio-server

# Rebuild server
make -f Makefile.local rebuild-formio-server
```

### GCS emulator not working

```bash
# Re-initialize
./scripts/init-gcs-local.sh

# Check bucket exists
curl http://localhost:4443/storage/v1/b/local-formio-uploads

# Check uploaded files
make -f Makefile.local verify-upload
```

### Test app won't start

```bash
# Clean install
cd test-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Environment Variables

The Docker Compose file configures:

```bash
# MongoDB
MONGO=mongodb://mongodb:27017/formioapp

# Storage (GCS Emulator)
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=http://gcs-emulator:4443
FORMIO_S3_BUCKET=local-formio-uploads
FORMIO_S3_REGION=auto
FORMIO_S3_KEY=local-access-key
FORMIO_S3_SECRET=local-secret-key

# Admin
ROOT_EMAIL=admin@local.test
ROOT_PASSWORD=admin123

# Debug
DEBUG=formio:*
```

## Data Persistence

Data is stored in Docker volumes:
- `formio_mongo_local` - MongoDB data
- `formio_gcs_local` - GCS emulator files

To preserve data between restarts:
```bash
make -f Makefile.local local-down  # Stops services, keeps data
```

To delete all data:
```bash
make -f Makefile.local local-reset  # Deletes volumes
```

## Next Steps

1. ✅ Verify services are running: `make -f Makefile.local verify-services`
2. ✅ Open test app: http://localhost:64849
3. 🔨 Build formio-core FileUpload component
4. 🔨 Build formio-react wrapper
5. 🧪 Test uploads end-to-end
6. 🚀 Deploy to cloud

## Tips

- Use `tmux` for better development experience
- Keep logs open in a separate window
- Use `make -f Makefile.local verify-upload` frequently
- Test in multiple browsers
- Check browser DevTools Network tab for API calls
- Monitor memory usage: `docker stats`

## Support

For issues:
1. Check logs: `make -f Makefile.local local-logs-formio`
2. Verify services: `make -f Makefile.local verify-services`
3. Reset if needed: `make -f Makefile.local local-reset`