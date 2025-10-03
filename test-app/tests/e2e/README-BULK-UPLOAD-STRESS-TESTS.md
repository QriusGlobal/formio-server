# TUS Bulk Upload Stress Testing Guide

**Last Updated**: October 3, 2025
**Test Suite**: `/tests/e2e/tus-bulk-upload-stress.spec.ts`
**Page Object**: `/tests/pages/TusBulkUploadPage.ts`
**Utilities**: `/tests/utils/bulk-upload-helpers.ts`

---

## 📋 Overview

Comprehensive stress testing suite for validating TUS bulk upload capabilities with 10-30 files simultaneously. Tests performance, memory usage, queue management, and network resilience.

### Test Coverage

- ✅ File count stress tests (10, 15, 20, 30 files)
- ✅ Parallel upload configuration (1-10 concurrent)
- ✅ Mixed file sizes (1KB-50MB)
- ✅ Performance benchmarking
- ✅ Memory usage monitoring
- ✅ Upload queue management
- ✅ Validation and data integrity
- ✅ Visual regression testing
- ✅ Edge case handling

---

## 🚀 Quick Start

### Prerequisites

1. **TUS Server Running**:
   ```bash
   docker-compose up -d tusd
   # Verify: curl http://localhost:1080/files -I
   ```

2. **Test App Running**:
   ```bash
   cd test-app
   npm run dev
   # Opens at http://localhost:64849/tus-bulk-test
   ```

### Run All Stress Tests

```bash
cd test-app

# Run complete stress test suite
npm run test:e2e tests/e2e/tus-bulk-upload-stress.spec.ts

# Run with UI for debugging
npm run test:e2e:ui tests/e2e/tus-bulk-upload-stress.spec.ts

# Run specific test category
npx playwright test --grep "File Count Stress Tests"
npx playwright test --grep "Parallel Upload Configuration"
npx playwright test --grep "Performance Benchmarking"
```

---

## 📊 Test Scenarios

### 1. File Count Stress Tests

| Test Name | Files | Size Each | Total Size | Parallel | Expected Duration |
|-----------|-------|-----------|------------|----------|-------------------|
| Baseline | 10 | 5MB | 50MB | 3 | <30s |
| Standard | 15 | 5MB | 75MB | 3 | <45s |
| Heavy Load | 20 | 10MB | 200MB | 5 | <90s |
| Maximum Stress | 30 | 5MB | 150MB | 5 | <120s |

**Run:**
```bash
npx playwright test --grep "File Count Stress Tests"
```

**Expected Results:**
- All files upload successfully
- Submission data includes all file URLs
- Duration within performance threshold
- No memory leaks

---

### 2. Parallel Upload Configuration Tests

Tests different parallelization levels:

| Parallel Uploads | Expected Behavior |
|------------------|-------------------|
| 1 | Sequential (slowest) |
| 3 | Moderate parallelism (recommended) |
| 5 | High parallelism |
| 10 | Maximum parallelism |

**Run:**
```bash
npx playwright test --grep "Parallel Upload Configuration"
```

**Validation:**
- Queue never exceeds configured parallel limit
- Performance improves with higher parallelism
- No race conditions or file corruption

---

### 3. Mixed File Size Tests

Realistic scenario with varied file sizes (1KB-50MB).

**Run:**
```bash
npx playwright test --grep "Mixed File Size Tests"
```

**Test Data:**
- Small: 1KB, 10KB, 100KB
- Medium: 1MB, 5MB
- Large: 10MB, 20MB, 50MB

---

### 4. Performance Benchmarking

Generates comprehensive performance report comparing all scenarios.

**Run:**
```bash
npx playwright test --grep "Generate comprehensive performance report"
```

**Sample Output:**
```
| Scenario | Files | Size (MB) | Duration (s) | Throughput (MB/s) | Parallel | Chunk (MB) |
|----------|-------|-----------|--------------|-------------------|----------|------------|
| Baseline |    10 |     50.00 |        25.32 |              1.98 |        3 |          5 |
| Standard |    15 |     75.00 |        38.15 |              1.97 |        3 |          5 |
| Heavy    |    20 |    200.00 |        82.45 |              2.43 |        5 |          8 |
| Maximum  |    30 |    150.00 |       115.23 |              1.30 |        5 |          5 |
```

---

### 5. Memory Usage Tests

Monitors heap size during uploads to detect memory leaks.

**Run:**
```bash
npx playwright test --grep "Monitor memory during 15-file upload"
```

**Thresholds:**
- Memory increase: <50MB
- Peak memory: <200MB

---

### 6. Upload Queue Management

Validates that concurrent uploads never exceed configured limit.

**Run:**
```bash
npx playwright test --grep "Verify parallel upload limit is respected"
```

**Validation:**
- Tracks active uploads every 100ms
- Verifies `maxConcurrent <= parallelUploads`
- Logs queue behavior for analysis

---

### 7. Validation Tests

Ensures uploaded files have correct metadata and structure.

**Run:**
```bash
npx playwright test --grep "Validation Tests"
```

**Checks:**
- ✅ Multiple files in array
- ✅ File data structure (name, size, type, url, storage)
- ✅ All URLs present
- ✅ Storage type is 'tus'
- ✅ Metadata complete

---

## 🔧 Test Utilities

### Bulk Upload Helpers

**File**: `/tests/utils/bulk-upload-helpers.ts`

**Key Functions:**

```typescript
// Generate test files
const files = await generateBulkTestFiles(15, 5*1024); // 15 files × 5MB

// Generate mixed sizes
const mixedFiles = await generateMixedSizeTestFiles();

// Upload with tracking
const metrics = await uploadWithProgressTracking(page, files);

// Monitor concurrent uploads
const concurrentCounts = await trackConcurrentUploads(page);

// Validate queue management
const isValid = await validateUploadQueue(page, maxConcurrent);

// Extract statistics
const stats = await extractUploadStatistics(page);
```

---

### Page Object Model

**File**: `/tests/pages/TusBulkUploadPage.ts`

**Usage:**

```typescript
import { TusBulkUploadPage } from '../pages/TusBulkUploadPage';

const uploadPage = new TusBulkUploadPage(page);

// Navigate
await uploadPage.goto();

// Configure test
await uploadPage.configureTest({
  chunkSizeMB: 5,
  parallelUploads: 3,
  maxFiles: 15
});

// Upload files
await uploadPage.uploadAndSubmit(files);

// Wait for completion
await uploadPage.waitForUploadComplete();

// Validate
const isValid = await uploadPage.validateSubmission(15);

// Get results
const stats = await uploadPage.getUploadStatistics();
const validation = await uploadPage.getValidationResults();
const uploadedFiles = await uploadPage.getUploadedFiles();
```

---

### Test Data Generators

**File**: `/tests/fixtures/bulk-test-data.ts`

**Predefined Scenarios:**

```typescript
import { BULK_TEST_SCENARIOS, PERFORMANCE_BENCHMARKS } from '../fixtures/bulk-test-data';

// Use predefined scenarios
const scenario = BULK_TEST_SCENARIOS[0]; // Baseline
const files = await generateBulkTestFiles(scenario.fileCount, scenario.fileSizeKB);

// Or create custom
const customFiles = await generateBulkTestFiles(
  20,           // file count
  10 * 1024,    // 10MB each
  'custom-test' // prefix
);
```

---

## 📈 Performance Thresholds

Defined in `/tests/fixtures/bulk-test-data.ts`:

```typescript
export const PERFORMANCE_THRESHOLDS = {
  // Upload duration (seconds)
  maxDuration10Files: 30,
  maxDuration15Files: 45,
  maxDuration20Files: 90,
  maxDuration30Files: 120,

  // Memory usage (MB)
  maxMemoryIncrease: 50,
  maxPeakMemory: 200,

  // Upload throughput (MB/s)
  minThroughput3G: 0.03,
  minThroughput4G: 0.3,
  minThroughputWiFi: 1.0,

  // UI responsiveness
  minFPS: 30,
  maxInteractionLatency: 100, // ms
};
```

---

## 🎯 Success Criteria

### ✅ Functional

- All selected files upload successfully
- Submission includes all file URLs with correct metadata
- Upload queue respects parallelization limit
- Files can be accessed via returned URLs

### ✅ Performance

- 10 files (5MB each): <30 seconds
- 15 files (5MB each): <45 seconds
- 20 files (10MB each): <90 seconds
- 30 files (5MB each): <120 seconds

### ✅ Resource Usage

- Memory increase: <50MB during upload
- Peak memory: <200MB
- No memory leaks after upload completion
- UI remains responsive (>30 FPS)

### ✅ Reliability

- Auto-resume after network interruption
- Graceful handling of upload errors
- Proper cleanup on page navigation
- No race conditions or data corruption

---

## 🐛 Debugging

### Enable Debug Mode

```bash
# Run with headed browser
npm run test:e2e:headed tests/e2e/tus-bulk-upload-stress.spec.ts

# Run with Playwright Inspector
npx playwright test --debug tests/e2e/tus-bulk-upload-stress.spec.ts

# Run specific test
npx playwright test --grep "Upload 15 files" --debug
```

### View Screenshots

Screenshots saved to `test-results/screenshots/`:
- `bulk-upload-progress-*.png` - During upload
- `bulk-upload-complete-*.png` - After completion

### View Performance Logs

Console output includes:
- Upload duration
- Throughput (MB/s)
- Memory usage
- Concurrent upload counts
- Validation results

### Common Issues

**Issue**: Test timeout
**Solution**: Increase timeout in test or check TUS server is running

**Issue**: Files not uploading
**Solution**: Verify TUS endpoint is accessible (`curl http://localhost:1080/files`)

**Issue**: Memory leak detected
**Solution**: Check browser console for errors, verify cleanup in component

**Issue**: Queue limit exceeded
**Solution**: Check TUS component implementation, verify parallelUploads config

---

## 📝 Adding New Tests

### 1. Add Test Scenario

Edit `/tests/fixtures/bulk-test-data.ts`:

```typescript
export const BULK_TEST_SCENARIOS: BulkTestScenario[] = [
  // ... existing scenarios
  {
    name: 'Custom Scenario',
    description: 'My custom test scenario',
    fileCount: 25,
    fileSizeKB: 8 * 1024,
    chunkSizeMB: 8,
    parallelUploads: 5,
    expectedDurationSec: 100,
    category: 'custom'
  }
];
```

### 2. Add Test Case

Edit `/tests/e2e/tus-bulk-upload-stress.spec.ts`:

```typescript
test('My custom stress test', async ({ page }) => {
  const files = await generateBulkTestFiles(25, 8 * 1024);

  await uploadPage.configureTest({
    chunkSizeMB: 8,
    parallelUploads: 5,
    maxFiles: 25
  });

  await uploadPage.uploadAndSubmit(files);
  await uploadPage.waitForUploadComplete();

  const isValid = await uploadPage.validateSubmission(25);
  expect(isValid).toBe(true);
});
```

### 3. Run New Test

```bash
npx playwright test --grep "My custom stress test"
```

---

## 📊 CI/CD Integration

### GitHub Actions

```yaml
- name: Run Bulk Upload Stress Tests
  run: |
    docker-compose up -d tusd
    npm run test:e2e tests/e2e/tus-bulk-upload-stress.spec.ts
  env:
    CI: true
```

### Test Reports

Playwright generates HTML reports:

```bash
# After test run
npx playwright show-report
```

View at: `playwright-report/index.html`

---

## 🔗 Related Documentation

- **Bulk Upload Guide**: `/docs/TUS_BULK_MOBILE_UPLOAD_GUIDE.md`
- **Component README**: `/packages/formio-file-upload/README.md`
- **Integration Status**: `/docs/INTEGRATION_STATUS.md`
- **TUS Server Docs**: `/formio/src/upload/README.md`

---

## 🎓 Best Practices

1. **Always run TUS server before tests**
2. **Clean up test files after completion**
3. **Use realistic file sizes (5-10MB)**
4. **Monitor performance trends over time**
5. **Test on different network conditions**
6. **Validate data structure thoroughly**
7. **Screenshot critical stages**
8. **Log performance metrics**

---

## 📞 Troubleshooting

**Need Help?**

1. Check TUS server logs: `docker-compose logs tusd`
2. Check browser console for errors
3. Review test output for failure details
4. Check screenshots in `test-results/`
5. Run with `--debug` flag for step-by-step execution

**Still Stuck?**

- GitHub Issues: https://github.com/formio/formio/issues
- Documentation: https://help.form.io
- Test Suite Location: `/test-app/tests/e2e/`

---

**Happy Stress Testing!** 🚀
