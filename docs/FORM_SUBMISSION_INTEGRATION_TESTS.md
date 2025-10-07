# Form Submission Integration E2E Tests

**File:** `/test-app/tests/e2e/form-submission-integration.spec.ts`
**Test Count:** 8 comprehensive scenarios
**Created:** October 6, 2025
**Status:** ✅ Ready for execution

---

## Overview

Comprehensive end-to-end test suite validating Form.io submission integration with TUS and Uppy file uploads. Tests cover single/multiple file uploads, validation, data structure, large files, and concurrent submissions.

## Test Infrastructure

| Service | URL | Purpose |
|---------|-----|---------|
| Form.io Server | `http://localhost:3001` | Backend API |
| TUS Upload Server | `http://localhost:1080` | File storage |
| Test Application | `http://localhost:64849` | React test app |

## Test Scenarios

### 1. Single File Upload → Submission

**Purpose:** Verify basic single file upload integration with Form.io submissions

**Steps:**
1. Navigate to submission test page
2. Fill required form fields (fullName, email)
3. Upload 100KB PDF file via TUS component
4. Wait for upload completion
5. Submit form
6. Verify submission success

**Assertions:**
- ✅ `submission.data.resume` object exists
- ✅ File metadata: `{ name, size, type, storage: 'tus', url }`
- ✅ File URL matches pattern: `http://localhost:1080/files/{id}`
- ✅ File URL returns HTTP 200
- ✅ Content-Length header is present and > 0

**Expected Output:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@test.com",
  "resume": {
    "name": "resume-single.pdf",
    "size": 102400,
    "type": "application/pdf",
    "storage": "tus",
    "url": "http://localhost:1080/files/abc123..."
  }
}
```

---

### 2. Multiple File Upload → Submission

**Purpose:** Verify array handling for multiple file uploads

**Steps:**
1. Upload single resume file (required)
2. Generate 10 portfolio files (20KB each)
3. Upload all 10 files simultaneously
4. Submit form
5. Verify array structure

**Assertions:**
- ✅ `submission.data.portfolio` is an array
- ✅ Array contains exactly 10 file objects
- ✅ Each file has unique URL
- ✅ All 10 URLs are accessible (HTTP 200)
- ✅ File names match uploaded files

**Expected Output:**
```json
{
  "resume": { ... },
  "portfolio": [
    {
      "name": "portfolio-0.pdf",
      "size": 20480,
      "storage": "tus",
      "url": "http://localhost:1080/files/..."
    },
    // ... 9 more files
  ]
}
```

---

### 3. Mixed Upload Types → Submission

**Purpose:** Verify different upload components work together

**Upload Types:**
- **TUS Single:** Resume file
- **TUS Multiple:** Portfolio files (2)
- **Uppy Dashboard:** Profile photo

**Assertions:**
- ✅ All 3 fields populated correctly
- ✅ TUS single file has correct structure
- ✅ TUS multiple is array with 2 files
- ✅ Uppy file has correct structure
- ✅ All 4 URLs are unique (no collision)
- ✅ Mixed file types (PDF + JPG)

**Expected Output:**
```json
{
  "resume": { "name": "resume-mixed.pdf", ... },
  "portfolio": [
    { "name": "project1.pdf", ... },
    { "name": "project2.pdf", ... }
  ],
  "profilePhoto": { "name": "profile.jpg", ... }
}
```

---

### 4. Form Validation Enforcement

**Purpose:** Verify required file validation prevents submission

**Steps:**
1. Fill text fields ONLY (no file upload)
2. Attempt to submit form
3. Verify validation error displayed
4. Verify submission does NOT succeed

**Assertions:**
- ✅ Validation error message contains "required"
- ✅ Form does NOT submit
- ✅ "Submission Successful" message NOT displayed
- ✅ User remains on form page

**Validation Messages:**
- "File is required"
- "Resume is required"
- "Must upload a file"

---

### 5. File URL Accessibility

**Purpose:** Verify all uploaded file URLs are accessible via HTTP

**Steps:**
1. Upload 3 files (1 resume + 2 portfolio)
2. Submit form
3. Extract all file URLs from submission
4. Test each URL with HEAD request
5. Verify HTTP 200 response

**Assertions:**
- ✅ All URLs return HTTP 200
- ✅ Content-Length header exists
- ✅ Content-Length > 0
- ✅ URLs follow TUS server pattern

**HTTP Request Example:**
```bash
HEAD http://localhost:1080/files/abc123def456
Response: 200 OK
Content-Length: 40960
Content-Type: application/pdf
```

---

### 6. Submission Data Structure Validation

**Purpose:** Verify submission data matches Form.io schema

**Assertions:**
- ✅ Top-level fields: `fullName`, `email`
- ✅ File object structure:
  ```typescript
  {
    name: string;
    size: number;
    type: string;
    storage: 'tus';
    url: string;
  }
  ```
- ✅ URL is valid (protocol, hostname, port, path)
- ✅ Size matches uploaded file size
- ✅ Type matches file MIME type

**URL Structure Validation:**
```typescript
const url = new URL(submission.resume.url);
expect(url.protocol).toBe('http:');
expect(url.hostname).toBe('localhost');
expect(url.port).toBe('1080');
expect(url.pathname).toMatch(/^\/files\/.+/);
```

---

### 7. Large File Submission (100MB+)

**Purpose:** Verify TUS resumable upload handles large files

**Configuration:**
- **File Size:** 100MB (104,857,600 bytes)
- **Upload Method:** TUS resumable upload
- **Timeout:** 5 minutes (300,000ms)
- **Chunk Size:** Configured in TUS client

**Steps:**
1. Generate or use existing 100MB test file
2. Upload via TUS component
3. Monitor upload progress
4. Wait for completion (up to 3 minutes)
5. Submit form
6. Verify file URL is accessible

**Assertions:**
- ✅ Upload completes without timeout
- ✅ File size in submission = 104,857,600 bytes
- ✅ File URL is accessible
- ✅ No upload errors or interruptions

**Performance Expectations:**
- Upload time: < 3 minutes (localhost)
- Chunk size: 5MB (default)
- Total chunks: 20 chunks

---

### 8. Concurrent Form Submissions

**Purpose:** Verify no race conditions with concurrent uploads

**Configuration:**
- **Concurrent Contexts:** 5 browser contexts
- **Total Submissions:** 5 simultaneous
- **File Size:** 50KB each
- **Timeout:** 3 minutes

**Steps:**
1. Create 5 browser contexts
2. Navigate each to submission form
3. Upload unique file in each context
4. Submit all 5 forms simultaneously
5. Wait for all completions
6. Verify unique data

**Assertions:**
- ✅ All 5 submissions succeed
- ✅ All 5 emails are unique
- ✅ All 5 file URLs are unique
- ✅ No URL collisions
- ✅ All URLs accessible
- ✅ No race conditions in file storage

**Concurrency Test Pattern:**
```typescript
const contexts = await Promise.all(
  Array.from({ length: 5 }, () => browser.newContext())
);

const submissions = await Promise.all(
  contexts.map(async (ctx, i) => {
    // Submit form with unique data
  })
);

// Verify uniqueness
expect(new Set(submissions.map(s => s.resume.url)).size).toBe(5);
```

---

## Running the Tests

### Full Test Suite

```bash
cd test-app
bun run test:e2e tests/e2e/form-submission-integration.spec.ts
```

### Individual Test

```bash
bun playwright test tests/e2e/form-submission-integration.spec.ts -g "Single file upload"
```

### Debug Mode

```bash
bun playwright test tests/e2e/form-submission-integration.spec.ts --debug
```

### UI Mode

```bash
bun playwright test tests/e2e/form-submission-integration.spec.ts --ui
```

### Headed Mode (Watch Execution)

```bash
bun playwright test tests/e2e/form-submission-integration.spec.ts --headed
```

---

## Prerequisites

### 1. Infrastructure Running

```bash
# Start Form.io server
docker-compose -f docker-compose.test.yml up -d

# Verify services
curl http://localhost:3001/health  # Form.io
curl http://localhost:1080/files   # TUS server
curl http://localhost:64849        # Test app
```

### 2. Test App Running

```bash
cd test-app
bun install
bun run dev  # Starts on port 64849
```

### 3. Dependencies Installed

```bash
cd test-app
bun install @playwright/test
bun playwright install chromium
```

---

## Test Data Management

### Fixture Files

The test suite uses the following fixtures:

| Fixture | Purpose | Location |
|---------|---------|----------|
| `formio.fixture.ts` | Form.io API helpers | `/test-app/tests/fixtures/` |
| `upload.fixture.ts` | File upload helpers | `/test-app/tests/fixtures/` |
| `generated/` | Temporary test files | `/test-app/tests/fixtures/generated/` |

### Generated Files

Tests automatically generate files in `/test-app/tests/fixtures/generated/`:

- `resume-single.pdf` - 100KB
- `portfolio-0.pdf` to `portfolio-9.pdf` - 20KB each
- `large-file-100mb.bin` - 100MB
- `concurrent-file-{0-4}.pdf` - 50KB each

**Cleanup:** All generated files are automatically deleted in `afterEach` hooks.

---

## Cleanup Procedures

### After Each Test

```typescript
test.afterEach(async ({ formio }) => {
  // 1. Delete Form.io submissions
  for (const submissionId of testSubmissionIds) {
    await formio.formioAPI.deleteSubmission(submissionId);
  }

  // 2. Delete generated test files
  for (const file of testFiles) {
    await fs.promises.unlink(file.path);
  }
});
```

### Manual Cleanup

```bash
# Remove generated files
rm -rf test-app/tests/fixtures/generated/*

# Clean Playwright cache
bun playwright clean

# Remove test results
rm -rf test-app/test-results
rm -rf test-app/playwright-report
```

---

## Debugging Failed Tests

### 1. Check Services

```bash
# Form.io API
curl -v http://localhost:3001/health

# TUS Server
curl -v http://localhost:1080/files

# Test App
curl -v http://localhost:64849
```

### 2. View Browser Logs

```bash
# Run with console output
bun playwright test --headed --debug
```

### 3. Check Screenshots

Failed tests automatically capture screenshots:

```
test-results/
└── form-submission-integration-spec-ts-1-single-file-upload/
    ├── test-failed-1.png
    └── trace.zip
```

### 4. Inspect Trace

```bash
bun playwright show-trace test-results/trace.zip
```

---

## Expected Test Execution Time

| Test | Expected Duration | Max Timeout |
|------|------------------|-------------|
| Test 1: Single file | 10-15 seconds | 60 seconds |
| Test 2: Multiple files | 20-30 seconds | 90 seconds |
| Test 3: Mixed uploads | 15-25 seconds | 90 seconds |
| Test 4: Validation | 5-10 seconds | 30 seconds |
| Test 5: URL accessibility | 10-15 seconds | 60 seconds |
| Test 6: Data structure | 10-15 seconds | 60 seconds |
| Test 7: Large file (100MB) | 60-180 seconds | 300 seconds |
| Test 8: Concurrent (5x) | 30-60 seconds | 180 seconds |
| **Total Suite** | **~3-5 minutes** | **15 minutes** |

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests - Form Submission Integration

on:
  push:
    paths:
      - 'test-app/tests/e2e/form-submission-integration.spec.ts'
      - 'packages/formio-file-upload/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: cd test-app && bun install
      - name: Start services
        run: docker-compose -f docker-compose.test.yml up -d
      - name: Wait for services
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:3001/health; do sleep 2; done'
      - name: Run E2E tests
        run: cd test-app && bun run test:e2e tests/e2e/form-submission-integration.spec.ts
      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-app/test-results/
```

---

## Known Issues & Limitations

### 1. Large File Test (Test 7)

**Issue:** 100MB file generation can be slow
**Workaround:** Pre-generate file once and reuse
**Location:** `/test-app/tests/fixtures/test-file-100mb.bin`

### 2. Concurrent Test (Test 8)

**Issue:** May occasionally timeout on slow machines
**Workaround:** Reduce concurrent contexts from 5 to 3
**Configuration:**
```typescript
const contexts = await Promise.all(
  Array.from({ length: 3 }, () => browser.newContext()) // Was 5
);
```

### 3. TUS Server Cleanup

**Issue:** TUS server may accumulate uploaded files
**Workaround:** Periodic cleanup of TUS storage
**Script:**
```bash
# Clean TUS uploads (Docker)
docker exec tusd rm -rf /srv/tusd-data/data/*
```

---

## Success Criteria

All tests MUST pass with the following criteria:

- ✅ 8/8 tests passing
- ✅ No flaky tests (3 consecutive runs)
- ✅ Total execution time < 10 minutes
- ✅ All file URLs accessible
- ✅ No memory leaks
- ✅ No race conditions
- ✅ Clean teardown (no orphaned data)

---

## Related Documentation

- [Integration Status](/docs/INTEGRATION_STATUS.md) - File upload integration details
- [E2E Test Execution Summary](/docs/E2E_TEST_EXECUTION_SUMMARY.md) - Previous test results
- [TUS Upload Forms Setup](/docs/TUS_FORMS_SETUP.md) - Form configuration
- [Local Development Guide](/docs/LOCAL_DEVELOPMENT.md) - Setup instructions

---

## Maintenance

### Updating Tests

When updating tests, ensure:

1. **Fixtures:** Update fixture imports if structure changes
2. **Selectors:** Verify DOM selectors still match
3. **Timeouts:** Adjust timeouts for slower environments
4. **Cleanup:** Add cleanup for new resources

### Adding New Tests

To add new test scenarios:

1. Follow existing test structure
2. Add cleanup logic in `afterEach`
3. Update this documentation
4. Update success criteria
5. Test locally 3x before committing

---

**Last Updated:** October 6, 2025
**Test Suite Version:** 1.0.0
**Maintainer:** Formio Integration Team
