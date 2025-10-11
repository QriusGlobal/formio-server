# Specialist Report Form Integration Guide

**Document Version**: 1.0  
**Last Updated**: 2025-10-11  
**Status**: ✅ Complete

---

## Overview

This guide documents the complete integration of the **1.d. Specialist Report**
form with the Form.io server, including storage configuration, form creation,
and submission workflows.

### Quick Facts

- **Form Title**: 1.d. Specialist Report
- **Form Path**: `specialist-report`
- **Form ID**: `68e9b1669eb3aa71f746c108`
- **Total Fields**: 38 fields
- **File Upload Fields**: 20 image upload fields
- **Storage Method**: TUS/URL (not base64)
- **API Endpoint**: `http://localhost:3001/form/68e9b1669eb3aa71f746c108`

---

## Problem Statement

The original specialist report form had a critical configuration issue:

**Issue**: All 20 file upload fields used `"storage": "base64"`, which embeds
images directly in MongoDB documents.

**Impact**:

- 20 images × 10MB max = 200MB potential size
- MongoDB document limit = 16MB
- Result: **Submissions would fail with large file uploads**

**Solution**: Changed all file upload fields to use `"storage": "url"` with TUS
resumable upload protocol.

---

## Changes Made

### 1. Storage Configuration Changes

**File Modified**: `form-client-web-app/src/forms/specialist-report.json`

**Before** (each of 20 file fields):

```json
{
  "label": "Site Image 1",
  "key": "site_image_1",
  "type": "file",
  "image": true,
  "storage": "base64",
  "filePattern": "image/*",
  "fileMaxSize": "10MB"
}
```

**After** (all 20 file fields):

```json
{
  "label": "Site Image 1",
  "key": "site_image_1",
  "type": "file",
  "image": true,
  "storage": "url",
  "url": "http://localhost:1080/files/",
  "filePattern": "image/*",
  "fileMaxSize": "10MB"
}
```

**Changes**:

- ✅ Changed `"storage": "base64"` → `"storage": "url"` (20 occurrences)
- ✅ Added `"url": "http://localhost:1080/files/"` to all file fields
- ✅ Changed `"name": "1d_specialist_report"` → `"name": "specialist-report"`
  (Form.io naming requirements)
- ✅ Changed `"path": "1d_specialist_report"` → `"path": "specialist-report"`

**Benefits**:

- Files stored separately in Google Cloud Storage (via GCS emulator locally)
- Only file URLs stored in MongoDB (small footprint)
- Supports resumable uploads via TUS protocol
- No 16MB document limit issues

---

## Form Creation Script

### Script Location

**File**: `scripts/create-specialist-report-form.js`

### Usage

**Basic Usage**:

```bash
node scripts/create-specialist-report-form.js
```

**With Custom Environment Variables**:

```bash
FORMIO_URL=http://localhost:3001 \
FORMIO_EMAIL=admin@formio.local \
FORMIO_PASSWORD=admin123 \
node scripts/create-specialist-report-form.js
```

### What the Script Does

1. **Authenticates** with Form.io server using admin credentials
2. **Fetches roles** from the server (administrator, anonymous, authenticated)
3. **Reads** the specialist report JSON from
   `form-client-web-app/src/forms/specialist-report.json`
4. **Creates** the form via POST to `/form` endpoint
5. **Creates** a default "Save Submission" action for the form
6. **Verifies** the form was created successfully
7. **Checks** for existing submissions (should be 0 initially)

### Script Output Example

```
🚀 Specialist Report Form Creator - Starting...

Form.io URL: http://localhost:3001
Form JSON: /Users/.../specialist-report.json

🔐 Authenticating as admin@formio.local...
✅ Authentication successful
📋 Fetching roles from Form.io...
✅ Found 3 roles: [ 'administrator', 'anonymous', 'authenticated' ]
📖 Reading specialist report form JSON...
✅ Form JSON loaded successfully
   Title: 1.d. Specialist Report
   Name: specialist-report
   Path: specialist-report
   Components: 38
   File upload fields: 20

============================================================

🔨 Creating form: 1.d. Specialist Report
   Path: specialist-report
   Type: form
   Components: 38
✅ Form created successfully: specialist-report
   Form ID: 68e9b1669eb3aa71f746c108
   📌 Creating Save action for form...
   ✅ Save action created

🔍 Verifying form creation...
✅ Form verified successfully
   Path: specialist-report
   ID: 68e9b1669eb3aa71f746c108
   Components: 38
   File upload fields: 20
   URL storage fields: 20/20

📊 Checking submissions...
   Submissions: 0

============================================================

✨ Summary:
   Form: 1.d. Specialist Report
   Path: specialist-report
   Status: Created/Verified

📋 Access form:
   API: http://localhost:3001/form/68e9b1669eb3aa71f746c108
   Submissions: http://localhost:3001/form/68e9b1669eb3aa71f746c108/submission

🔍 Verify with curl:
   curl http://localhost:3001/form?path=specialist-report | jq
   curl http://localhost:3001/form/68e9b1669eb3aa71f746c108 | jq
```

---

## Form Submission Workflow

### Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  FormViewer     │─────→│  Form.io Server  │─────→│  MongoDB    │
│  (React App)    │      │  (Port 3001)     │      │             │
└─────────────────┘      └──────────────────┘      └─────────────┘
         │                        │
         │                        ↓
         │               ┌──────────────────┐      ┌─────────────┐
         └──────────────→│  TUS Server      │─────→│  GCS        │
                         │  (Port 1080)     │      │  Emulator   │
                         └──────────────────┘      └─────────────┘

```

### Client-Side Mode (Default)

**When to Use**: Testing form rendering and validation without server
persistence

**Configuration**:

- ✅ "Server Submission Mode" checkbox **unchecked**
- Form data only stored in browser memory
- No API calls to Form.io server
- No files uploaded to TUS server

**Workflow**:

1. User fills out form in browser
2. Clicks "Submit"
3. Form validates client-side
4. Submission data displayed on screen
5. No persistence (refresh = data lost)

### Server Submission Mode

**When to Use**: Production-like testing with full persistence

**Configuration**:

- ✅ "Server Submission Mode" checkbox **checked**
- Form.io Server URL: `http://localhost:3001` (default)

**Workflow**:

1. User fills out form in browser
2. Files are uploaded to TUS server (`http://localhost:1080/files/`)
   - Uploads are resumable (can pause/resume)
   - Files stored in GCS emulator
   - URLs returned (e.g., `http://localhost:1080/files/abc123.jpg`)
3. Clicks "Submit"
4. Form data (including file URLs) sent to Form.io server
5. Form.io server stores submission in MongoDB
6. Submission ID returned
7. Success message displayed

---

## FormViewer Updates

### Changes Made

**File**: `form-client-web-app/src/pages/FormViewer.tsx`

**New State Variables**:

```typescript
const [useServerMode, setUseServerMode] = useState<boolean>(false);
const [formioServerUrl, setFormioServerUrl] = useState<string>(
  'http://localhost:3001'
);
```

**New UI Controls**:

- **Checkbox**: "Server Submission Mode" toggle
- **Text Input**: Form.io Server URL (shown when server mode enabled)
- **Status Indicator**: Shows whether client-side or server-side mode is active

**Form Component Update**:

```typescript
<Form
  form={getCurrentForm()}
  url={useServerMode ? formioServerUrl : undefined}  // ← Added this line
  onSubmit={handleSubmit}
  onError={handleError}
  options={{
    noAlerts: false,
    readOnly: false
  }}
/>
```

**Key Behavior**:

- When `url` prop is **undefined** → Client-side mode
- When `url` prop is **set** → Server submission mode (POST to
  `{url}/form/{formId}/submission`)

---

## API Reference

### Get Form Definition

**Endpoint**: `GET /form?path=specialist-report`

**Example**:

```bash
curl http://localhost:3001/form?path=specialist-report | jq
```

**Response** (excerpt):

```json
[
  {
    "_id": "68e9b1669eb3aa71f746c108",
    "title": "1.d. Specialist Report",
    "name": "specialist-report",
    "path": "specialist-report",
    "type": "form",
    "display": "form",
    "components": [
      /* 38 components */
    ]
  }
]
```

### Get Form by ID

**Endpoint**: `GET /form/{formId}`

**Example**:

```bash
curl http://localhost:3001/form/68e9b1669eb3aa71f746c108 | jq
```

### List Submissions (Requires Authentication)

**Endpoint**: `GET /form/{formId}/submission`

**Example**:

```bash
# First authenticate to get JWT token
TOKEN=$(curl -s -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"data":{"email":"admin@formio.local","password":"admin123"}}' \
  | jq -r '.headers["x-jwt-token"]')

# Then fetch submissions
curl -s http://localhost:3001/form/68e9b1669eb3aa71f746c108/submission \
  -H "x-jwt-token: $TOKEN" | jq
```

### Create Submission

**Endpoint**: `POST /form/{formId}/submission`

**Example** (manual creation):

```bash
curl -X POST http://localhost:3001/form/68e9b1669eb3aa71f746c108/submission \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "date_of_inspection": "2025-10-11",
      "client_present": "Yes",
      "onsite_inspection_completed_by": "John Doe",
      "site_image_1": "http://localhost:1080/files/test-image-1.jpg"
    }
  }'
```

---

## MongoDB Query Examples

### Connect to MongoDB

**Docker Exec**:

```bash
docker-compose exec mongodb mongosh formioapp
```

**Direct Connection** (if MongoDB exposed):

```bash
mongosh mongodb://localhost:27017/formioapp
```

### Count Specialist Report Forms

```javascript
db.forms.count({ path: 'specialist-report' });
```

**Expected**: `1`

### Get Form Document

```javascript
db.forms.findOne({ path: 'specialist-report' });
```

### Count Submissions

```javascript
db.submissions.count({ form: ObjectId('68e9b1669eb3aa71f746c108') });
```

### Get All Submissions

```javascript
db.submissions.find({ form: ObjectId('68e9b1669eb3aa71f746c108') });
```

### Get Latest Submission

```javascript
db.submissions
  .find({ form: ObjectId('68e9b1669eb3aa71f746c108') })
  .sort({ created: -1 })
  .limit(1)
  .pretty();
```

### Find Submissions with Images

```javascript
db.submissions.find({
  form: ObjectId('68e9b1669eb3aa71f746c108'),
  'data.site_image_1': { $exists: true, $ne: '' }
});
```

### Aggregation: Count Submissions by Date

```javascript
db.submissions.aggregate([
  { $match: { form: ObjectId('68e9b1669eb3aa71f746c108') } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$created' } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } }
]);
```

---

## Testing Checklist

### ✅ Pre-Deployment Checks

1. **Infrastructure Running**

   ```bash
   docker-compose ps
   # Verify: mongodb, redis, gcs-emulator, formio-server, tus-server all "Up"
   ```

2. **Form.io Server Healthy**

   ```bash
   curl http://localhost:3001/health
   # Expected: {"status":"ok","database":"connected"}
   ```

3. **TUS Server Running**

   ```bash
   curl -I http://localhost:1080/files/
   # Expected: HTTP/1.1 405 Method Not Allowed (normal for GET on TUS endpoint)
   ```

4. **Form Exists**
   ```bash
   curl -s http://localhost:3001/form?path=specialist-report | jq -r '.[0].title'
   # Expected: "1.d. Specialist Report"
   ```

### ✅ Form Rendering Tests

1. **Start Dev Server**

   ```bash
   cd form-client-web-app
   npm run dev
   # Navigate to http://localhost:64849
   ```

2. **Verify Form Loads**
   - Select "Specialist Report" from dropdown
   - Verify all 38 fields render correctly
   - Check file upload fields show upload interface

3. **Test Client-Side Mode**
   - Uncheck "Server Submission Mode"
   - Fill out some fields (not required to fill all)
   - Submit form
   - Verify submission data displays on screen
   - Refresh page → data should be gone (client-side only)

### ✅ Server Submission Tests

1. **Enable Server Mode**
   - Check "Server Submission Mode" checkbox
   - Verify URL shows `http://localhost:3001`

2. **Test Text Fields Only (No Files)**
   - Fill out basic text fields
   - Submit form
   - Verify success message
   - Check MongoDB:
     ```javascript
     db.submissions.count({ form: ObjectId('68e9b1669eb3aa71f746c108') });
     ```

3. **Test with File Upload**
   - Fill out form
   - Upload a test image to "Site Image 1"
   - Watch TUS upload progress
   - Submit form
   - Verify submission in MongoDB contains URL like:
     ```json
     {
       "data": {
         "site_image_1": "http://localhost:1080/files/abc123def456.jpg"
       }
     }
     ```

4. **Test Multiple Files**
   - Upload images to multiple file fields (e.g., Site Image 1-5)
   - Submit form
   - Verify all file URLs stored correctly
   - Check GCS emulator has the files:
     ```bash
     docker-compose exec gcs-emulator ls -la /data/formio-uploads/
     ```

### ✅ Error Handling Tests

1. **Invalid File Type**
   - Try uploading a PDF to an image field
   - Verify error message shows

2. **File Too Large**
   - Try uploading file > 10MB
   - Verify rejection

3. **Server Offline**
   - Stop Form.io server: `docker-compose stop formio-server`
   - Try to submit form in server mode
   - Verify error message
   - Restart: `docker-compose start formio-server`

---

## Troubleshooting

### Issue: Form not found in dropdown

**Symptom**: "Specialist Report" doesn't appear in form selector

**Solution**:

1. Verify form JSON exists:
   ```bash
   ls -lh form-client-web-app/src/forms/specialist-report.json
   ```
2. Check import in `FormViewer.tsx`:
   ```typescript
   import specialistReportForm from '../forms/specialist-report.json';
   ```
3. Verify it's in `SAMPLE_FORMS` object:
   ```typescript
   const SAMPLE_FORMS = {
     specialistReport: specialistReportForm
     // ...
   };
   ```

### Issue: "storage": "base64" still present

**Symptom**: Large submissions fail with MongoDB 16MB error

**Diagnosis**:

```bash
grep -c '"storage": "base64"' form-client-web-app/src/forms/specialist-report.json
# Should output: 0
```

**Solution**:

```bash
# Re-run the fix script (or manually edit)
grep -c '"storage": "url"' form-client-web-app/src/forms/specialist-report.json
# Should output: 20
```

### Issue: Form creation fails with "name validation failed"

**Symptom**: Script error about invalid characters in name/path

**Cause**: Form.io only allows `a-z`, `0-9`, `-`, `/` in name/path (no
underscores!)

**Solution**: Ensure `specialist-report.json` has:

```json
{
  "name": "specialist-report",
  "path": "specialist-report"
}
```

NOT: `1d_specialist_report` or `specialist_report`

### Issue: Submissions require authentication

**Symptom**: `curl http://localhost:3001/form/{id}/submission` returns
"Unauthorized"

**Cause**: Form.io requires JWT token for submission endpoints

**Solution**:

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"data":{"email":"admin@formio.local","password":"admin123"}}' \
  | jq -r '.headers["x-jwt-token"]')

# Use token
curl -s http://localhost:3001/form/{id}/submission \
  -H "x-jwt-token: $TOKEN" | jq
```

### Issue: TUS server refuses connections

**Symptom**: File uploads fail immediately

**Diagnosis**:

```bash
docker-compose ps | grep tus-server
# Should show "Up"

curl -I http://localhost:1080/files/
# Should return 405 Method Not Allowed (expected for GET)
```

**Solution**:

```bash
# Restart TUS server
docker-compose restart tus-server

# Check logs
docker-compose logs -f tus-server
```

### Issue: Files not appearing in GCS emulator

**Symptom**: Uploads succeed but files not in storage

**Diagnosis**:

```bash
docker-compose exec gcs-emulator ls -la /data/formio-uploads/
```

**Solution**:

- Verify bucket exists in GCS emulator configuration
- Check TUS server environment variables point to GCS emulator
- Restart both services:
  ```bash
  docker-compose restart gcs-emulator tus-server
  ```

---

## Performance Considerations

### File Upload Limits

- **Max file size**: 10MB per image (configurable in form JSON)
- **Max concurrent uploads**: Limited by browser (typically 6)
- **Total form size**: No limit (files stored separately from MongoDB)

### Recommended Limits for Production

```json
{
  "fileMaxSize": "5MB", // Reduce from 10MB for faster uploads
  "fileMinSize": "1KB", // Prevent empty files
  "filePattern": "image/jpeg,image/png,image/webp" // Limit formats
}
```

### MongoDB Considerations

With URL storage:

- **Form definition**: ~15KB (38 fields)
- **Submission without files**: ~2KB
- **Submission with 20 file URLs**: ~4KB (only URLs, not file data!)

**Safe for thousands of submissions** without hitting MongoDB limits.

---

## Security Hardening (Production)

### Authentication

**Current** (Development):

- Default admin credentials: `admin@formio.local` / `admin123`
- No HTTPS
- No CORS restrictions

**Production Recommendations**:

1. Change default admin password immediately
2. Enable HTTPS/TLS for all endpoints
3. Configure CORS to whitelist only trusted domains
4. Rotate JWT secrets regularly
5. Use environment variables for all secrets (never commit)

### File Upload Security

**Current** (Development):

- Accepts all image types
- 10MB max file size
- No virus scanning
- No content validation

**Production Recommendations**:

1. Validate file magic numbers (not just MIME type)
2. Implement virus scanning (ClamAV integration)
3. Use signed URLs for file access (time-limited)
4. Sanitize filenames
5. Store files in isolated storage bucket
6. Implement rate limiting on uploads

### Access Control

**Current**:

- Administrator role has full access
- Anonymous users can submit (if configured)

**Production**:

- Implement role-based access control (RBAC)
- Require authentication for all submissions
- Audit log for all form modifications
- Encrypt sensitive fields at rest

---

## Next Steps

### Immediate Actions

1. ✅ **Test the complete workflow** with real data
2. ✅ **Verify file uploads work** with various image types
3. ✅ **Check MongoDB** for submission storage
4. ✅ **Monitor logs** for errors during submission

### Future Enhancements

1. **Add validation** for required fields (currently all optional)
2. **Implement conditional logic** (e.g., show certain fields based on
   "Specialist Report Type")
3. **Add file preview** before upload
4. **Progress bar** for multi-file uploads
5. **Offline support** with service workers
6. **PDF export** of submissions
7. **Email notifications** on form submission

### Deployment Preparation

1. **Create production environment variables**

   ```bash
   FORMIO_URL=https://formio.yourcompany.com
   JWT_SECRET=$(openssl rand -hex 32)
   DB_SECRET=$(openssl rand -hex 32)
   ```

2. **Update file upload URLs** to production GCS bucket

   ```json
   {
     "url": "https://storage.googleapis.com/your-bucket/uploads/"
   }
   ```

3. **Configure CORS** in Form.io server
4. **Set up monitoring** (health checks, error tracking)
5. **Create backup strategy** for MongoDB and GCS

---

## Appendix: Form Field Inventory

### Text Input Fields (16)

- Date of Inspection (datetime)
- Onsite Inspection Completed By (textarea)
- Please describe how damage occurred (textarea)
- Event Related Damages (textarea)
- What are the maintenance issues (textarea)
- Model/brand/style/serial numbers (textarea)
- Test results (textarea)
- Repair Estimate (textfield)
- Site Findings (textarea)
- Conclusion (textarea)
- Approximate Age of Home (number)

### Radio/Select Fields (5)

- Client Present? (Yes/No)
- House Type (Single/Double/Multi/Split)
- Has product been installed properly? (Yes/No)
- Was safety harness required? (Yes/No)

### Checkbox/Multi-Select Fields (3)

- Specialist Report Type (10 options)
- Roof Type (10 options)
- Cause/Circumstances (10 options)

### File Upload Fields (20)

- Site Image 1-20 (all configured for URL/TUS storage)

**Total**: 38 fields

---

## Support & Maintenance

**Documentation**: This file  
**Script**: `scripts/create-specialist-report-form.js`  
**Form JSON**: `form-client-web-app/src/forms/specialist-report.json`  
**UI Component**: `form-client-web-app/src/pages/FormViewer.tsx`

For issues or questions, refer to the main repository README or Form.io
documentation.
