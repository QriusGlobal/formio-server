# TUS File Upload Forms - Programmatic Setup

**Created:** October 5, 2025
**Status:** ✅ Complete and Verified

## Overview

This document describes the automated setup of 3 TUS file upload test forms in Form.io using the programmatic API.

## Forms Created

### 1. TUS File Upload - Simple
- **Path:** `test/tus-upload-simple`
- **Form ID:** `68e23f06b0d7fa2fb7b27d20`
- **Purpose:** Single file upload testing with TUS resumable protocol
- **Components:**
  - Upload Title (textfield, required)
  - File Upload (file, TUS resumable, max 100MB)
  - Notes (textarea, optional)
  - Submit button

**Configuration:**
```json
{
  "type": "file",
  "key": "file",
  "storage": "url",
  "url": "http://localhost:1080/files/",
  "fileMaxSize": "100MB",
  "multiple": false
}
```

### 2. TUS File Upload - Multiple Files
- **Path:** `test/tus-upload-multi`
- **Form ID:** `68e23f06b0d7fa2fb7b27d36`
- **Purpose:** Multiple file upload testing with batch operations
- **Components:**
  - Batch Upload Title (textfield, required)
  - Multiple Files Upload (file, TUS resumable, max 10 files, 100MB each)
  - Batch Description (textarea, optional)
  - Submit button

**Configuration:**
```json
{
  "type": "file",
  "key": "files",
  "storage": "url",
  "url": "http://localhost:1080/files/",
  "fileMaxSize": "100MB",
  "multiple": true,
  "fileMaxCount": 10
}
```

### 3. GCS File Upload Test
- **Path:** `test/gcs-upload`
- **Form ID:** `68e23f06b0d7fa2fb7b27d4c`
- **Purpose:** GCS integration testing with TUS protocol
- **Components:**
  - Target Environment (select: emulator/production)
  - Test Case Name (textfield, required)
  - Test File Upload (file, GCS/TUS, max 100MB)
  - Verify File Integrity (checkbox, default true)
  - Test Notes (textarea, optional)
  - Submit button

**Configuration:**
```json
{
  "type": "file",
  "key": "testFile",
  "storage": "url",
  "url": "http://localhost:4443/upload/formio-test/",
  "fileMaxSize": "100MB",
  "multiple": false
}
```

## Script Usage

### Basic Usage

```bash
# Run with default configuration
node scripts/create-tus-forms.js
```

### Environment Variables

```bash
# Custom Form.io server
FORMIO_URL=http://localhost:3001 node scripts/create-tus-forms.js

# Custom authentication
FORMIO_EMAIL=admin@formio.local FORMIO_PASSWORD=admin123 node scripts/create-tus-forms.js

# Custom TUS endpoint
TUS_ENDPOINT=http://localhost:1080/files/ node scripts/create-tus-forms.js

# Custom GCS endpoint
GCS_UPLOAD_ENDPOINT=http://localhost:4443/upload/formio-test/ node scripts/create-tus-forms.js
```

### Complete Example

```bash
# Create forms with custom configuration
FORMIO_URL=http://localhost:3001 \
TUS_ENDPOINT=http://localhost:1080/files/ \
GCS_UPLOAD_ENDPOINT=http://localhost:4443/upload/formio-test/ \
FORMIO_EMAIL=admin@formio.local \
FORMIO_PASSWORD=admin123 \
node scripts/create-tus-forms.js
```

## Verification

### Check All Forms

```bash
curl -s http://localhost:3001/form | jq -r '.[] | .path' | sort
```

**Expected Output:**
```
admin
test/gcs-upload
test/tus-upload-multi
test/tus-upload-simple
user
user/login
user/register
```

### Check Form Details

```bash
# Simple upload form
curl -s http://localhost:3001/test/tus-upload-simple | jq '{title, path, tags}'

# Multi upload form
curl -s http://localhost:3001/test/tus-upload-multi | jq '{title, path, tags}'

# GCS upload form
curl -s http://localhost:3001/test/gcs-upload | jq '{title, path, tags}'
```

### Verify File Upload Configuration

```bash
# Check TUS endpoint configuration
curl -s http://localhost:3001/test/tus-upload-simple | \
  jq '.components[] | select(.type == "file") | {key, storage, url, fileMaxSize}'

# Check multiple file configuration
curl -s http://localhost:3001/test/tus-upload-multi | \
  jq '.components[] | select(.type == "file") | {key, multiple, fileMaxCount}'
```

## Access Controls

All forms have the following access configuration:

**Form Access (read):**
- Administrator (full access)
- Authenticated users (read access)
- Anonymous users (read access)

**Submission Access:**
- **Create:** Administrator, Authenticated users
- **Read:** Administrator only

## Actions

Each form has a **Save Submission** action configured:
- **Handler:** `before`
- **Method:** `create`, `update`
- **Priority:** 10

## Template Source

Forms are defined in `/formio/src/templates/default.json` at lines 420-678:
- `tusFileUploadSimple` (lines 420-494)
- `tusFileUploadMulti` (lines 495-571)
- `gcsFileUploadTest` (lines 572-678)

## Script Features

### Authentication
- Automatic JWT token retrieval
- Support for custom credentials via environment variables
- Token-based API requests

### Role Mapping
- Fetches roles from Form.io API
- Maps role names (`administrator`, `authenticated`, `anonymous`) to role IDs
- Preserves access control configuration from template

### Environment Variable Substitution
- Replaces `${TUS_ENDPOINT:-default}` patterns
- Supports custom endpoints via environment variables
- Falls back to defaults if not provided

### Error Handling
- Detects duplicate forms (skips creation)
- Validates form creation
- Verifies forms are accessible after creation
- Comprehensive error messages

### Output
- Colored terminal output
- Progress indicators
- Detailed summary
- Verification commands

## Testing Forms

### Test Simple Upload

```bash
# Access form
open http://localhost:64849/#/test/tus-upload-simple

# Or via test app
curl -X POST http://localhost:3001/test/tus-upload-simple/submission \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Test Upload",
      "file": {
        "name": "test.txt",
        "url": "http://localhost:1080/files/abc123",
        "size": 1024,
        "type": "text/plain"
      },
      "notes": "Test notes"
    }
  }'
```

### Test Multiple Upload

```bash
# Submit multiple files
curl -X POST http://localhost:3001/test/tus-upload-multi/submission \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "batchTitle": "Batch Test",
      "files": [
        {"name": "file1.txt", "url": "http://localhost:1080/files/abc123"},
        {"name": "file2.txt", "url": "http://localhost:1080/files/def456"}
      ],
      "description": "Test batch upload"
    }
  }'
```

## Troubleshooting

### Authentication Failed

**Problem:** `Authentication failed: 401`

**Solution:**
```bash
# Verify credentials
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"data":{"email":"admin@formio.local","password":"admin123"}}'

# Check docker-compose.yml for ROOT_EMAIL and ROOT_PASSWORD
```

### Form Already Exists

**Problem:** `Form already exists: test/tus-upload-simple`

**Solution:**
The script safely skips existing forms. To recreate:
```bash
# Delete form via API
curl -X DELETE http://localhost:3001/form/68e23f06b0d7fa2fb7b27d20 \
  -H "x-jwt-token: YOUR_TOKEN"

# Or delete all test forms
curl -s http://localhost:3001/form | \
  jq -r '.[] | select(.path | startswith("test/")) | ._id' | \
  xargs -I {} curl -X DELETE http://localhost:3001/form/{}
```

### Server Not Running

**Problem:** `ECONNREFUSED localhost:3001`

**Solution:**
```bash
# Start Form.io server
docker-compose up -d formio-server

# Or start all services
docker-compose up -d

# Check server health
curl http://localhost:3001/health
```

### Template Not Found

**Problem:** `Template does not contain "forms" section`

**Solution:**
```bash
# Verify template exists
ls -la formio/src/templates/default.json

# Check template structure
jq 'keys' formio/src/templates/default.json
# Expected: ["title", "name", "version", "roles", "resources", "forms", ...]
```

## Related Documentation

- **Integration Status:** `/docs/INTEGRATION_STATUS.md`
- **TUS Bulk Upload Guide:** `/docs/TUS_BULK_MOBILE_UPLOAD_GUIDE.md`
- **Test Execution Report:** `/docs/TEST_EXECUTION_REPORT.md`
- **Main Configuration:** `/CLAUDE.md`

## Script Location

```
/Users/mishal/code/work/formio-monorepo/scripts/create-tus-forms.js
```

**Lines of Code:** 398
**Dependencies:** Node.js built-in modules only (`fs`, `path`, `http`, `https`)
**No external packages required**

---

**Last Updated:** October 5, 2025
**Verified:** All 3 forms created and accessible via API ✅
