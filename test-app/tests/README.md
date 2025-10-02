# Playwright Tests for Form.io File Upload

Comprehensive end-to-end testing infrastructure for Form.io file upload functionality.

## 🏗️ Architecture

```
tests/
├── e2e/                    # E2E test specifications
│   └── example.spec.ts     # Example tests
├── fixtures/               # Test fixtures and setup
│   ├── playwright-fixtures.ts
│   └── test-files/         # Generated test files
├── pages/                  # Page Object Models
│   ├── FileUploadPage.ts   # Base page object
│   ├── TusUploadPage.ts    # TUS-specific interactions
│   └── UppyUploadPage.ts   # Uppy-specific interactions
├── utils/                  # Test utilities
│   ├── file-helpers.ts     # File generation
│   ├── api-helpers.ts      # API verification
│   ├── formio-helpers.ts   # Form.io event monitoring
│   ├── global-setup.ts     # Pre-test setup
│   └── global-teardown.ts  # Post-test cleanup
└── types/                  # TypeScript definitions
    └── test-types.ts
```

## 🚀 Quick Start

### Prerequisites

1. **Start services:**
   ```bash
   make local-up  # From monorepo root
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run playwright:install
   ```

3. **Start test app:**
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run tests by tag
npm run test:e2e:tus      # TUS resumable upload tests
npm run test:e2e:uppy     # Uppy dashboard tests
npm run test:e2e:edge     # Edge case tests

# Debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## 📋 Test Categories

### Basic Upload Tests
- Small file upload (1KB)
- Medium file upload (1MB)
- Multiple file upload
- Progress tracking
- Error handling

### TUS Resumable Upload Tests (`@tus`)
- Chunked upload with configurable chunk size
- Pause and resume functionality
- Network interruption recovery
- Fingerprint-based resumption
- Upload statistics and metrics

### Uppy Dashboard Tests (`@uppy`)
- Dashboard UI interactions
- File restrictions validation
- Multiple file management
- Drag and drop
- Error states

### Edge Case Tests (`@edge`)

Comprehensive edge case testing covering 51 scenarios across 6 categories:

#### Network Failure Scenarios (`edge-network.spec.ts`)
- Offline mode during upload
- Slow 3G network simulation (50KB/s, 2s latency)
- Packet loss simulation (30%)
- DNS resolution failure
- Connection timeout
- Server unreachable
- Intermittent failures
- Pause/resume on network interruption
- Network switching (WiFi → 3G → WiFi)

#### Large File Tests (`edge-large-files.spec.ts`)
- 500MB file upload with progress tracking (< 200MB memory)
- 1GB file upload efficiently (< 300MB memory)
- 2GB file upload (browser-dependent, < 400MB memory)
- Resume large file after pause
- Memory stability during long upload

#### Browser State Tests (`edge-browser.spec.ts`)
- Tab hidden during upload
- Browser minimize during upload
- Page refresh during upload
- Multiple tabs uploading simultaneously
- Incognito mode testing
- localStorage/sessionStorage persistence

#### Race Condition Tests (`edge-race.spec.ts`)
- Multiple uploads with random cancellations
- Rapid pause/resume cycles (10x)
- Component unmount during upload
- Form submission during upload
- Concurrent uploads with different states
- Rapid file additions
- Authentication token refresh

#### Resource Exhaustion Tests (`edge-limits.spec.ts`)
- 100 simultaneous file uploads (< 500MB memory)
- Exceed maximum file size (50MB limit)
- Exceed maximum file count (10 file limit)
- Storage quota exceeded
- Memory pressure (200MB test)
- Concurrent upload limits (3-10)
- Network request limits

#### Security Tests (`edge-security.spec.ts`)
- Reject executable files (.exe, .bat, .sh, .cmd)
- Sanitize XSS in file names
- Prevent path traversal attacks
- Handle oversized file names
- Sanitize special characters
- Validate metadata for XSS
- Prevent CSV injection
- Prevent null byte injection

**Performance Thresholds:**
- 500MB: < 200MB peak memory, < 4 minutes
- 1GB: < 300MB peak memory, < 5 minutes
- 2GB: < 400MB peak memory (Safari skipped)

**Security Validations:**
- HTML escaping for display
- Path traversal sequence removal
- Formula character escaping
- No script execution
- User-friendly error messages

See [Edge Case Catalog](../../hive-mind/tests/edge-case-catalog.json) for complete details.

### Visual Regression Tests (`@visual`)
- UI component rendering
- Progress indicators
- Error messages
- Mobile responsiveness

## 🎯 Page Objects

### FileUploadPage (Base)
Common functionality for all upload implementations:

```typescript
const page = new FileUploadPage(page);

// Navigation
await page.goto();
await page.waitForReady();

// Upload operations
await page.uploadFile(filePath);
await page.uploadMultipleFiles([file1, file2]);
await page.waitForUploadComplete();

// Verification
const success = await page.isUploadSuccessful();
const files = await page.getUploadedFiles();
const error = await page.getErrorMessage();

// Form operations
await page.submitForm();
const data = await page.getFormData();
```

### TusUploadPage
TUS-specific resumable upload features:

```typescript
const tusPage = new TusUploadPage(page);

// Configure TUS options
await tusPage.configureTusOptions({
  chunkSize: 256 * 1024,
  retryDelays: [0, 1000, 3000],
  parallelUploads: 3
});

// Upload with TUS
await tusPage.uploadFileWithTus(filePath);

// Control upload
await tusPage.pauseUpload();
await tusPage.resumeUpload();

// Get statistics
const stats = await tusPage.getUploadStats();
const chunks = await tusPage.getChunksUploaded();

// Test resumability
await tusPage.simulateNetworkInterruption(5000);
const resumed = await tusPage.testResumability(filePath);
```

### UppyUploadPage
Uppy dashboard interactions:

```typescript
const uppyPage = new UppyUploadPage(page);

// Dashboard operations
await uppyPage.openDashboard();
await uppyPage.uploadFileWithUppy(filePath);

// File management
await uppyPage.removeFileFromQueue(filename);
const files = await uppyPage.getUppyFiles();

// Restrictions testing
const result = await uppyPage.testFileRestrictions({
  maxFileSize: 1024 * 1024,
  allowedFileTypes: ['.jpg', '.png']
});

// Control
await uppyPage.pauseUppyUpload();
await uppyPage.resumeUppyUpload();
await uppyPage.cancelAllUppyUploads();
```

## 🛠️ Utilities

### File Helpers
Generate test files of various sizes:

```typescript
import { generateTestFile, generateStandardTestFiles } from './utils/file-helpers';

// Generate single file
const file = await generateTestFile({
  size: 1024 * 1024,  // 1MB
  filename: 'test.bin',
  content: 'random'
});

// Generate standard test suite (1KB, 1MB, 10MB, 100MB)
const files = await generateStandardTestFiles();
```

### API Helpers
Verify GCS and Form.io API interactions:

```typescript
import { GCSApiHelper, FormioApiHelper } from './utils/api-helpers';

// GCS verification
const gcs = new GCSApiHelper();
const exists = await gcs.verifyFileExists(request, 'test-file.txt');
const buffer = await gcs.downloadFile(request, 'test-file.txt');
await gcs.cleanupTestFiles(request);

// Form.io operations
const formio = new FormioApiHelper();
const submission = await formio.submitForm(request, 'testform', data);
await formio.cleanupTestSubmissions(request, 'testform');
```

### Form.io Event Monitoring
Track Form.io component events:

```typescript
import { FormioEventMonitor } from './utils/formio-helpers';

const monitor = new FormioEventMonitor(page);
await monitor.startMonitoring();

// Get events
const events = await monitor.getEvents();
const uploadEvents = await monitor.getEventsByType('fileUpload.complete');

// Wait for specific event
const event = await monitor.waitForEvent('formio.submit', 30000);

// Monitor progress
const progress = await monitor.monitorUploadProgress();
```

## 🧪 Custom Fixtures

Use custom fixtures for automatic setup/cleanup:

```typescript
import { test, expect } from '../fixtures/playwright-fixtures';

test('should upload file', async ({ fileUploadPage, gcsApi, request }) => {
  // fileUploadPage is ready to use
  await fileUploadPage.uploadFile(testFile);

  // gcsApi provides API helpers
  const verification = await gcsApi.verifyFileExists(request, 'test.txt');
  expect(verification.exists).toBe(true);

  // Automatic cleanup after test
});
```

## 📊 Test Results

Test results are stored in:
- `test-results/` - Raw test output
- `playwright-report/` - HTML report
- `test-results/screenshots/` - Failure screenshots
- `test-results/videos/` - Failure videos

View reports:
```bash
npm run test:e2e:report
```

## 🔧 Configuration

### Environment Variables

Create `.env.test.local` for custom configuration:

```bash
TEST_BASE_URL=http://localhost:64849
FORMIO_BASE_URL=http://localhost:3001
GCS_BASE_URL=http://localhost:4443
GCS_BUCKET=formio-uploads
TEST_FORM_PATH=testupload
```

### Playwright Config

Customize `playwright.config.ts`:
- Test timeout
- Retries
- Parallel execution
- Browser selection
- Screenshot/video settings

## 🐛 Debugging

### Debug Mode
```bash
npm run test:e2e:debug
```

### UI Mode (Recommended)
```bash
npm run test:e2e:ui
```

### Headed Mode
```bash
npm run test:e2e:headed
```

### View Trace
```bash
npx playwright show-trace test-results/trace.zip
```

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../fixtures/playwright-fixtures';

test.describe('Feature Name', () => {
  test('should do something', async ({ fileUploadPage, gcsApi, request }) => {
    // Arrange
    const testFile = path.join(__dirname, '../fixtures/test-files/test.txt');

    // Act
    await fileUploadPage.uploadFile(testFile);
    await fileUploadPage.waitForUploadComplete();

    // Assert
    const success = await fileUploadPage.isUploadSuccessful();
    expect(success).toBe(true);

    const verification = await gcsApi.verifyFileExists(request, 'test.txt');
    expect(verification.exists).toBe(true);
  });
});
```

### Tags

Use tags to organize tests:
```typescript
test('@tus should resume after interruption', async () => {
  // Test implementation
});

test('@edge @slow should handle 100MB file', async () => {
  test.setTimeout(300000); // 5 minutes
  // Test implementation
});
```

## 🚦 CI/CD Integration

Tests are configured for CI environments:
- Single worker in CI
- Retry on failure (2x)
- JSON output for reporting
- Screenshot/video on failure only

Set `CI=true` in your CI environment.

## 📚 Best Practices

1. **Use Page Objects**: Encapsulate UI interactions
2. **Use Fixtures**: Automatic setup/cleanup
3. **Tag Tests**: Organize by feature/performance
4. **Set Timeouts**: Especially for large files
5. **Verify in GCS**: Don't just trust UI
6. **Clean Up**: Fixtures handle cleanup automatically
7. **Monitor Events**: Use FormioEventMonitor for insights

## 🆘 Troubleshooting

### Services Not Running
```bash
# Check all services are up
make local-up
make local-status
```

### Browsers Not Installed
```bash
npm run playwright:install
```

### Tests Timing Out
- Increase timeout in test: `test.setTimeout(180000)`
- Check network connectivity
- Verify services are running

### Files Not Uploading
- Check GCS emulator logs: `make local-logs-gcs`
- Check Form.io logs: `make local-logs-formio`
- Verify file permissions

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Form.io Documentation](https://help.form.io/)
- [TUS Protocol](https://tus.io/)
- [Uppy Documentation](https://uppy.io/)

---

For questions or issues, please refer to the main project documentation.