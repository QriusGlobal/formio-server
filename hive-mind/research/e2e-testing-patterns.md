# E2E Testing Patterns for Form.io File Upload Components

## Research Summary
**Date**: 2025-09-30
**Focus**: Playwright + React + Form.io file upload testing patterns
**Key Areas**: TUS resumable uploads, network mocking, edge case handling

---

## 1. Playwright Best Practices for File Upload Testing

### 1.1 Core File Upload Methods

#### Basic `setInputFiles()` Method
```typescript
// Single file upload
await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');

// Multiple files
await page.getByLabel('Upload files').setInputFiles([
  'path/to/file1.txt',
  'path/to/file2.txt'
]);

// Upload from buffer (memory)
await page.getByLabel('Upload file').setInputFiles({
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('file content')
});

// Clear file selection
await page.getByLabel('Upload file').setInputFiles([]);
```

#### FileChooser API (for non-standard inputs)
```typescript
// Wait for file chooser event before clicking
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByText('Upload file').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles('path/to/file.pdf');
```

**Source**: Microsoft Playwright Documentation
**Examples**: `tests/page/page-set-input-files.spec.ts`

### 1.2 Page Object Model (POM) Pattern

```typescript
// upload-page.ts
import type { Page, Locator } from '@playwright/test';

export class UploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly progressBar: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('input[type="file"]');
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.progressBar = page.locator('.upload-progress');
    this.successMessage = page.locator('.upload-success');
  }

  async uploadSingleFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }

  async uploadMultipleFiles(filePaths: string[]) {
    await this.fileInput.setInputFiles(filePaths);
    await this.uploadButton.click();
  }

  async waitForUploadComplete() {
    await this.successMessage.waitFor({ state: 'visible' });
  }
}
```

**Source**: Playwright Documentation - Page Object Model
**Examples**: PayloadCMS, SurveyJS screenshot tests

### 1.3 Fixture Management

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { UploadPage } from './upload-page';
import path from 'path';

type MyFixtures = {
  uploadPage: UploadPage;
  testFiles: {
    smallImage: string;
    largeVideo: string;
    multipleImages: string[];
  };
};

export const test = base.extend<MyFixtures>({
  uploadPage: async ({ page }, use) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await use(uploadPage);
  },

  testFiles: async ({}, use) => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    await use({
      smallImage: path.join(fixturesDir, 'test-image.jpg'),
      largeVideo: path.join(fixturesDir, 'large-video.mp4'),
      multipleImages: [
        path.join(fixturesDir, 'image1.png'),
        path.join(fixturesDir, 'image2.png')
      ]
    });
  }
});
```

**Best Practice**: Store test files in dedicated `fixtures/` directory
**Source**: Playwright fixtures documentation

---

## 2. Form.io Component Testing Strategies

### 2.1 Custom Component Testing Pattern

```typescript
import { Components } from '@formio/js';
const FieldComponent = Components.components.field;

class CustomFileUpload extends FieldComponent {
  static schema() {
    return FieldComponent.schema({
      type: 'customFileUpload',
      label: 'Custom File Upload',
      tusEnabled: true
    });
  }

  // Attach event listeners
  attach(element) {
    this.loadRefs(element, {
      fileInput: 'single',
      uploadBtn: 'single',
      progressBar: 'single'
    });

    this.addEventListener(this.refs.uploadBtn, 'click', () => {
      this.handleUpload();
    });

    return super.attach(element);
  }

  // Get current value
  getValue() {
    return this.dataValue || [];
  }

  // Set value programmatically
  setValue(value) {
    this.dataValue = value;
    this.updateValue();
  }
}
```

**Source**: Form.io Custom Component Documentation
**Example**: `examples.form.io/customcomponent.md`

### 2.2 Event Testing Strategies

```typescript
// Test Form.io component events
test('should emit upload events', async ({ page }) => {
  await page.goto('/form');

  // Capture custom events
  const uploadStarted = page.evaluate(() => {
    return new Promise((resolve) => {
      document.addEventListener('formio.uploadStart', (e) => {
        resolve(e.detail);
      });
    });
  });

  await page.setInputFiles('input[type="file"]', 'test-file.pdf');

  const eventData = await uploadStarted;
  expect(eventData).toHaveProperty('filename', 'test-file.pdf');
});
```

### 2.3 Form Submission Validation

```typescript
test('should submit form with uploaded files', async ({ page }) => {
  await page.goto('/form');

  // Create form instance
  await page.evaluate(() => {
    Formio.createForm(document.getElementById('formio'), formSchema)
      .then((form) => {
        form.nosubmit = true; // Prevent actual submission
        window.formInstance = form;
      });
  });

  // Upload file
  await page.setInputFiles('input[type="file"]', 'test.pdf');

  // Submit and capture data
  const submissionData = await page.evaluate(() => {
    return new Promise((resolve) => {
      window.formInstance.on('submit', (submission) => {
        resolve(submission);
      });
      window.formInstance.submit();
    });
  });

  expect(submissionData.data).toHaveProperty('fileUpload');
  expect(submissionData.data.fileUpload[0]).toHaveProperty('name', 'test.pdf');
});
```

**Source**: Form.io Examples - Custom Endpoint
**Pattern**: Intercept submission, validate structure

---

## 3. TUS Resumable Upload Testing

### 3.1 TUS Protocol Overview

- **Purpose**: Resumable file uploads over HTTP
- **Key Feature**: Upload can be interrupted and resumed without re-uploading
- **Use Case**: Large files (100MB+), unreliable networks

**Source**: tus.io - Resumable Upload Protocol 1.0.x

### 3.2 Testing Resumable Uploads

```typescript
test('should resume upload after network disconnection', async ({ page, context }) => {
  // Navigate to upload page
  await page.goto('/upload');

  // Start upload
  const uploadPromise = page.setInputFiles('input[type="file"]', 'large-file.zip');

  // Simulate network disconnect after 2 seconds
  await page.waitForTimeout(2000);
  await context.setOffline(true);

  // Wait 1 second
  await page.waitForTimeout(1000);

  // Reconnect
  await context.setOffline(false);

  // Upload should resume and complete
  await uploadPromise;
  await page.waitForSelector('.upload-complete');
});
```

### 3.3 Network Throttling for Upload Testing

```typescript
test('should handle slow network during upload', async ({ page, context }) => {
  // Set network to slow 3G
  await context.route('**/upload', async (route) => {
    // Simulate slow upload
    await new Promise(resolve => setTimeout(resolve, 5000));
    await route.continue();
  });

  await page.setInputFiles('input[type="file"]', 'test-file.pdf');

  // Should show progress indicator
  await expect(page.locator('.upload-progress')).toBeVisible();

  // Wait for completion with extended timeout
  await page.waitForSelector('.upload-complete', { timeout: 30000 });
});
```

**Challenge**: Browser offline mode via Chrome DevTools doesn't work as expected for TUS
**Source**: "Resumable Large File Uploads With Tus" - buildo.com

### 3.4 TUS Client Testing Pattern

```typescript
import * as tus from 'tus-js-client';

test('should track TUS upload progress', async ({ page }) => {
  // Mock TUS server responses
  await page.route('**/files', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        headers: {
          'Location': 'https://example.com/files/abc123',
          'Upload-Offset': '0'
        }
      });
    }
  });

  await page.route('**/files/abc123', (route) => {
    if (route.request().method() === 'PATCH') {
      route.fulfill({
        status: 204,
        headers: {
          'Upload-Offset': '1048576' // 1MB uploaded
        }
      });
    }
  });

  // Trigger upload
  await page.setInputFiles('input[type="file"]', 'test-file.pdf');

  // Verify progress updates
  await expect(page.locator('.upload-progress')).toContainText('50%');
});
```

**Source**: tus-js-client GitHub repository

---

## 4. Network Interception and Mocking

### 4.1 Mocking Upload Responses

```typescript
test('should handle successful upload response', async ({ page }) => {
  // Mock successful upload
  await page.route('**/api/upload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        fileId: 'abc123',
        url: 'https://cdn.example.com/files/abc123.pdf'
      })
    });
  });

  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await page.click('button[type="submit"]');

  await expect(page.locator('.upload-success')).toBeVisible();
  await expect(page.locator('.file-url')).toContainText('abc123.pdf');
});
```

### 4.2 Simulating Upload Errors

```typescript
test('should display error for failed upload', async ({ page }) => {
  // Mock upload failure
  await page.route('**/api/upload', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Storage quota exceeded'
      })
    });
  });

  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await page.click('button[type="submit"]');

  await expect(page.locator('.upload-error')).toBeVisible();
  await expect(page.locator('.upload-error')).toContainText('Storage quota exceeded');
});
```

### 4.3 Intercepting Request/Response Data

```typescript
test('should send correct multipart form data', async ({ page }) => {
  let uploadRequest;

  await page.route('**/api/upload', async (route) => {
    uploadRequest = route.request();
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true })
    });
  });

  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await page.click('button[type="submit"]');

  // Verify request
  expect(uploadRequest.method()).toBe('POST');
  expect(uploadRequest.headers()['content-type']).toContain('multipart/form-data');

  const postData = uploadRequest.postData();
  expect(postData).toContain('filename="test.pdf"');
});
```

**Source**: Playwright Network Documentation
**Method**: `page.route(url, handler)` + `route.fulfill(options)`

---

## 5. Edge Cases and Error Scenarios

### 5.1 Network Disconnection During Upload

```typescript
test('should handle network disconnection gracefully', async ({ page, context }) => {
  await page.goto('/upload');

  // Start upload
  const uploadTask = page.setInputFiles('input[type="file"]', 'large-file.zip');

  // Simulate disconnect mid-upload
  await page.waitForTimeout(1000);
  await context.setOffline(true);

  // Should show offline indicator
  await expect(page.locator('.network-status')).toContainText('Offline');

  // Reconnect
  await page.waitForTimeout(2000);
  await context.setOffline(false);

  // Should resume automatically
  await expect(page.locator('.upload-resumed')).toBeVisible();
  await uploadTask;
});
```

### 5.2 Browser Refresh During Upload

```typescript
test('should restore upload state after refresh', async ({ page }) => {
  await page.goto('/upload');

  // Start upload
  await page.setInputFiles('input[type="file"]', 'large-file.zip');

  // Wait for partial upload
  await expect(page.locator('.upload-progress')).toContainText('30%');

  // Refresh page
  await page.reload();

  // Check if upload state is restored
  await expect(page.locator('.upload-progress')).toBeVisible();
  await expect(page.locator('.resume-upload')).toBeVisible();
});
```

### 5.3 Invalid File Types

```typescript
test('should reject invalid file types', async ({ page }) => {
  await page.goto('/upload');

  // Try to upload executable
  await page.setInputFiles('input[type="file"]', 'malicious.exe');

  await expect(page.locator('.file-error')).toBeVisible();
  await expect(page.locator('.file-error')).toContainText('File type not allowed');

  // Upload button should remain disabled
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
});
```

### 5.4 File Size Limits

```typescript
test('should reject files exceeding size limit', async ({ page }) => {
  // Mock large file in memory (10MB)
  const largeBuffer = Buffer.alloc(10 * 1024 * 1024);

  await page.goto('/upload');

  await page.setInputFiles('input[type="file"]', {
    name: 'huge-file.pdf',
    mimeType: 'application/pdf',
    buffer: largeBuffer
  });

  await expect(page.locator('.file-error')).toBeVisible();
  await expect(page.locator('.file-error')).toContainText('File size exceeds limit');
});
```

### 5.5 Concurrent Uploads

```typescript
test('should handle multiple concurrent uploads', async ({ page }) => {
  await page.goto('/upload');

  // Upload multiple files simultaneously
  const upload1 = page.locator('#upload-1').setInputFiles('file1.pdf');
  const upload2 = page.locator('#upload-2').setInputFiles('file2.pdf');
  const upload3 = page.locator('#upload-3').setInputFiles('file3.pdf');

  await Promise.all([upload1, upload2, upload3]);

  // All uploads should complete
  await expect(page.locator('.upload-complete')).toHaveCount(3);

  // Verify no errors
  await expect(page.locator('.upload-error')).toHaveCount(0);
});
```

### 5.6 Authentication Token Expiration

```typescript
test('should handle expired auth token during upload', async ({ page, context }) => {
  await page.goto('/upload');

  let requestCount = 0;

  // Mock auth token expiration
  await page.route('**/api/upload', async (route) => {
    requestCount++;

    if (requestCount === 1) {
      // First attempt - token expired
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Token expired' })
      });
    } else {
      // After token refresh - success
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    }
  });

  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await page.click('button[type="submit"]');

  // Should automatically refresh token and retry
  await expect(page.locator('.upload-success')).toBeVisible();
  expect(requestCount).toBe(2);
});
```

### 5.7 Storage Quota Exceeded

```typescript
test('should handle storage quota exceeded error', async ({ page }) => {
  await page.route('**/api/upload', async (route) => {
    await route.fulfill({
      status: 507, // Insufficient Storage
      body: JSON.stringify({
        error: 'Storage quota exceeded',
        availableSpace: 0
      })
    });
  });

  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await page.click('button[type="submit"]');

  await expect(page.locator('.storage-error')).toBeVisible();
  await expect(page.locator('.storage-error')).toContainText('quota exceeded');
});
```

---

## 6. Large File Upload Testing (1GB+)

### 6.1 Known Limitations

**Issue**: Playwright Python has OverflowError when uploading files >1GB
**Impact**: Cannot test large file uploads directly via UI
**Source**: GitHub Issue #20157

### 6.2 Workarounds

#### API-Level Testing
```typescript
test('should upload large file via API', async ({ request }) => {
  const filePath = 'path/to/1gb-file.zip';
  const fileBuffer = fs.readFileSync(filePath);

  const response = await request.post('/api/upload', {
    multipart: {
      file: {
        name: '1gb-file.zip',
        mimeType: 'application/zip',
        buffer: fileBuffer
      }
    }
  });

  expect(response.ok()).toBeTruthy();
});
```

#### Chunked Upload Testing
```typescript
test('should upload large file in chunks', async ({ page }) => {
  // Mock chunked upload endpoint
  let uploadedChunks = 0;
  const totalChunks = 10;

  await page.route('**/api/upload/chunk', async (route) => {
    uploadedChunks++;
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        chunkNumber: uploadedChunks,
        totalChunks: totalChunks,
        complete: uploadedChunks === totalChunks
      })
    });
  });

  await page.setInputFiles('input[type="file"]', 'large-file.zip');

  // Wait for all chunks to upload
  await page.waitForFunction(() => {
    return document.querySelector('.upload-progress')?.textContent === '100%';
  });

  expect(uploadedChunks).toBe(totalChunks);
});
```

### 6.3 Trace File Size Concerns

**Issue**: Large uploaded files get included in Playwright traces multiple times
**Impact**: Trace files become gigabytes in size, causing performance issues
**Solution**: Disable tracing for large file upload tests

```typescript
test.describe('Large file uploads', () => {
  test.use({ trace: 'off' }); // Disable tracing

  test('should upload 1GB file', async ({ page }) => {
    // Test implementation
  });
});
```

**Source**: GitHub Issue #20157

---

## 7. Best Practices Summary

### 7.1 File Path Management
- ✅ Use `path.join(__dirname, 'fixtures', 'file.pdf')` for cross-platform compatibility
- ✅ Store test files in dedicated `fixtures/` directory
- ✅ Use `testInfo.outputPath()` for temporary files
- ❌ Avoid hardcoded absolute paths

### 7.2 Assertions and Verification
```typescript
// Verify file name displayed
await expect(page.locator('.file-name')).toHaveText('test.pdf');

// Verify file uploaded
await expect(page.locator('.upload-success')).toBeVisible();

// Verify file in submission data
const submission = await page.evaluate(() => window.formInstance.submission);
expect(submission.data.fileUpload[0]).toHaveProperty('name', 'test.pdf');
```

### 7.3 Timeout Configuration
```typescript
test('should upload large file', async ({ page }) => {
  // Increase timeout for large uploads
  await page.setInputFiles('input[type="file"]', 'large-file.zip');
  await page.waitForSelector('.upload-complete', {
    timeout: 60000 // 60 seconds
  });
});
```

### 7.4 Error Handling
```typescript
test('should retry failed uploads', async ({ page }) => {
  let attemptCount = 0;

  await page.route('**/api/upload', async (route) => {
    attemptCount++;

    if (attemptCount < 3) {
      // Simulate network error
      await route.abort('failed');
    } else {
      // Success on 3rd attempt
      await route.fulfill({ status: 200, body: '{"success":true}' });
    }
  });

  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await expect(page.locator('.upload-success')).toBeVisible();
  expect(attemptCount).toBe(3);
});
```

### 7.5 Parallel Testing Considerations
- Tests within the same file run sequentially by default
- Enable `fullyParallel: true` for independent tests
- Use sharding for large test suites across multiple machines
- Each worker gets isolated browser instance

**Source**: Playwright Parallelism Documentation

---

## 8. Recommended Test Structure

```
tests/
├── fixtures/
│   ├── test-image.jpg (100KB)
│   ├── test-pdf.pdf (1MB)
│   ├── large-video.mp4 (50MB)
│   └── invalid-file.exe
├── page-objects/
│   └── upload-page.ts
├── helpers/
│   ├── mock-api.ts
│   └── file-utils.ts
└── e2e/
    ├── file-upload.spec.ts
    ├── resumable-upload.spec.ts
    ├── concurrent-upload.spec.ts
    └── edge-cases.spec.ts
```

### Example Test File
```typescript
// tests/e2e/file-upload.spec.ts
import { test, expect } from '@playwright/test';
import { UploadPage } from '../page-objects/upload-page';
import path from 'path';

test.describe('File Upload', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ page }) => {
    uploadPage = new UploadPage(page);
    await uploadPage.goto();
  });

  test('should upload single file successfully', async ({ page }) => {
    const testFile = path.join(__dirname, '../fixtures/test-pdf.pdf');
    await uploadPage.uploadSingleFile(testFile);
    await expect(uploadPage.successMessage).toBeVisible();
  });

  test('should handle network error', async ({ page }) => {
    await page.route('**/api/upload', route => route.abort('failed'));

    const testFile = path.join(__dirname, '../fixtures/test-pdf.pdf');
    await uploadPage.uploadSingleFile(testFile);

    await expect(uploadPage.errorMessage).toBeVisible();
    await expect(uploadPage.errorMessage).toContainText('Network error');
  });
});
```

---

## 9. Key Takeaways

1. **Use `setInputFiles()` as primary method** - Simple and reliable
2. **Use FileChooser API for non-standard inputs** - Custom upload buttons
3. **Implement Page Object Model** - Better maintainability
4. **Mock API responses for isolation** - Test edge cases independently
5. **Test TUS resumable uploads** - Critical for large files
6. **Handle all edge cases** - Network errors, invalid files, size limits
7. **Be aware of large file limitations** - Use API testing for 1GB+
8. **Disable tracing for large uploads** - Prevents performance issues
9. **Use fixtures for test data** - Organized and reusable
10. **Verify both UI and submission data** - Complete validation

---

## 10. References

### Documentation
- [Playwright File Upload Documentation](https://playwright.dev/docs/input#upload-files)
- [Playwright Network Interception](https://playwright.dev/docs/network)
- [Form.io Custom Components](https://help.form.io/developers/form-development/custom-components)
- [TUS Resumable Upload Protocol](https://tus.io/protocols/resumable-upload)

### Real-World Examples
- PayloadCMS: `test/uploads/e2e.spec.ts`
- SurveyJS: `screenshots/file.spec.ts`
- Element Web: `playwright/e2e/file-upload/image-upload.spec.ts`
- Microsoft Playwright: `tests/page/page-set-input-files.spec.ts`

### Issues and Limitations
- [GitHub Issue #20157 - Large file upload performance](https://github.com/microsoft/playwright/issues/20157)
- [StackOverflow - Uploading files over 1GB](https://stackoverflow.com/questions/68389903/)
- [TUS Testing Challenges](https://www.buildo.com/blog-posts/resumable-large-file-uploads-with-tus)

---

**Research Completed**: 2025-09-30
**Next Steps**: Implement test suite based on these patterns