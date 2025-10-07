# MongoDB Submission Persistence E2E Tests

## Overview

The `submission-persistence.spec.ts` test suite validates that Form.io submissions are correctly persisted to MongoDB with complete file metadata, proper timestamps, and data integrity.

## Test Scenarios

### 1. Immediate Persistence After Submission
**Validates:** Submissions are written to MongoDB within 1 second of form submission with all form data.

**Assertions:**
- Document exists in MongoDB with matching submission ID
- All form data fields are persisted (fullName, email)
- File data is included
- Created timestamp is within 1 second of submission

### 2. File Metadata Persistence
**Validates:** TUS upload file metadata is correctly stored with all required fields.

**Assertions:**
- File object contains: `url`, `name`, `size`, `type`, `storage`, `uploadId`
- URL matches TUS server pattern: `http://localhost:1080/files/...`
- File type is correct (`application/pdf`)
- File size is positive integer
- Storage type is `'tus'`

### 3. Submission Update Preserves Files
**Validates:** Updating a submission preserves file URLs and updates modified timestamp.

**Workflow:**
1. Create submission with file
2. Update submission (change text field only)
3. Verify file URL unchanged
4. Verify modified timestamp updated

**Assertions:**
- File URL remains identical after update
- File metadata unchanged (name, size, type)
- Modified timestamp is newer than original
- Text field updates are applied

### 4. Partial Submission (Draft Save)
**Validates:** Draft submissions persist files without requiring complete form validation.

**Assertions:**
- Files are persisted even in draft state
- Submission state is marked as `'draft'` (if supported)
- Incomplete form data is saved

**Note:** Falls back to complete submission if Form.io doesn't support draft state.

### 5. Multiple Submissions Same Form
**Validates:** Multiple submissions create separate MongoDB documents with unique IDs and file URLs.

**Workflow:**
1. Submit same form 3 times with different data
2. Query MongoDB for all submissions
3. Verify uniqueness

**Assertions:**
- 3 separate MongoDB documents created
- Each has unique `_id`
- Each file upload has unique URL
- User data is correctly separated

### 6. Submission Deletion Cleanup
**Validates:** Deleting a submission removes MongoDB document and doesn't leave orphaned references.

**Workflow:**
1. Create submission with files
2. Delete via API: `DELETE /submission/{id}`
3. Query MongoDB to verify removal

**Assertions:**
- Document is deleted from MongoDB
- No orphaned file references remain
- API returns success status

## Prerequisites

### Running Services
```bash
# Start MongoDB
docker-compose -f docker-compose.test.yml up -d mongodb

# Start Form.io server
cd formio && bun run start:dev

# Start TUS upload server
docker run -p 1080:1080 tusproject/tusd

# Start test app
cd test-app && bun run dev
```

### Environment Variables
```bash
# .env.test
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=formioapp
TEST_APP_URL=http://localhost:64849
FORMIO_URL=http://localhost:3001
```

## Running Tests

### All Persistence Tests
```bash
bun run test:e2e submission-persistence.spec.ts
```

### Specific Test
```bash
bun playwright test -g "should persist submission to MongoDB immediately"
```

### Debug Mode
```bash
bun run test:e2e:debug submission-persistence.spec.ts
```

### With UI
```bash
bun run test:e2e:ui
```

## Test Fixtures

### Required Files
- `/tests/fixtures/sample-resume.pdf` - Minimal valid PDF for uploads
- `/tests/fixtures/profile.jpg` - Minimal valid JPEG for multi-file tests
- `/tests/fixtures/test-files/project1.pdf` - Project file 1
- `/tests/fixtures/test-files/project2.pdf` - Project file 2

### Auto-Generated
These fixtures are automatically created if missing when tests run.

## MongoDB Queries Used

### Find Submission by ID
```javascript
const submissions = db.collection('submissions');
const submission = await submissions.findOne({
  _id: new ObjectId(submissionId)
});
```

### Find Multiple Submissions
```javascript
const submissions = await submissions.find({
  _id: { $in: submissionIds.map(id => new ObjectId(id)) }
}).toArray();
```

### Delete Submission
```javascript
await submissions.deleteOne({ _id: new ObjectId(submissionId) });
```

### Find by Form ID
```javascript
const submissions = await submissions.find({
  form: formId
}).toArray();
```

## Common Issues

### MongoDB Connection Failed
**Error:** `MongoServerError: connection refused`

**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose -f docker-compose.test.yml restart mongodb
```

### Submission ID Not Found
**Error:** `Submission ID is undefined`

**Cause:** Form submission may not be returning `_id` in response.

**Solution:** Check Form.io server logs and verify submission API response format.

### File Upload Timeout
**Error:** `Timeout waiting for upload completion`

**Solution:**
```bash
# Verify TUS server is running
curl http://localhost:1080/files/

# Check TUS server logs
docker logs <container-id>
```

### Fixture Files Missing
**Error:** `ENOENT: no such file or directory, open '.../sample-resume.pdf'`

**Solution:**
```bash
# Fixtures are created automatically, but you can verify:
ls -la test-app/tests/fixtures/
```

## Test Data Cleanup

### Automatic Cleanup
All test submissions are tracked and automatically cleaned up in `afterAll()`:

```typescript
test.afterAll(async () => {
  await submissions.deleteMany({
    _id: { $in: testSubmissionIds.map(id => new ObjectId(id)) }
  });
});
```

### Manual Cleanup
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/formioapp

# List test submissions
db.submissions.find({ 'data.email': /@test\.com$/ })

# Delete test submissions
db.submissions.deleteMany({ 'data.email': /@test\.com$/ })
```

## Performance Benchmarks

**Expected Test Duration:**
- Test 1 (Immediate Persistence): ~2-3 seconds
- Test 2 (File Metadata): ~2-3 seconds
- Test 3 (Update Preserves): ~4-5 seconds
- Test 4 (Draft Save): ~2-3 seconds
- Test 5 (Multiple Submissions): ~8-10 seconds
- Test 6 (Deletion): ~3-4 seconds

**Total Suite:** ~22-28 seconds

## TypeScript Types

### Submission Document
```typescript
interface SubmissionDocument {
  _id: ObjectId;
  form: string;
  data: {
    fullName: string;
    email: string;
    resume?: FileMetadata;
    profilePhoto?: FileMetadata;
    portfolio?: FileMetadata[];
  };
  created: Date;
  modified: Date;
  state?: 'draft' | 'submitted';
}
```

### File Metadata
```typescript
interface FileMetadata {
  url: string;
  name: string;
  size: number;
  type: string;
  storage: 'tus' | 'url' | 's3' | 'gcs';
  uploadId?: string;
  originalName?: string;
}
```

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Start MongoDB
  run: docker-compose -f docker-compose.test.yml up -d mongodb

- name: Run Persistence Tests
  run: bun run test:e2e submission-persistence.spec.ts
  env:
    MONGO_URL: mongodb://localhost:27017
    MONGO_DB_NAME: formioapp_test
```

### Local Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running persistence tests..."
bun playwright test submission-persistence.spec.ts

if [ $? -ne 0 ]; then
  echo "❌ Persistence tests failed. Commit aborted."
  exit 1
fi
```

## Troubleshooting Guide

### Test Hangs on Upload
1. Check TUS server: `curl -I http://localhost:1080/files/`
2. Verify network settings in `vite.config.ts`
3. Clear browser cache: `rm -rf test-app/node_modules/.vite`

### MongoDB Authentication Error
1. Check connection string format
2. Verify MongoDB container health: `docker logs <mongodb-container>`
3. Test connection: `mongosh mongodb://localhost:27017`

### Form Validation Preventing Submission
1. Check Form.io server logs
2. Verify all required fields are filled
3. Test form in UI manually first

## Related Documentation

- [Form.io Submission API](https://help.form.io/developers/submissions)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [TUS Protocol](https://tus.io/protocols/resumable-upload.html)

---

**Last Updated:** October 6, 2025
**Test Suite Version:** 1.0.0
**Maintainer:** Form.io Test Team
