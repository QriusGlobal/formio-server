# Test Infrastructure Files

This directory contains comprehensive test infrastructure files for E2E testing.

## Files Created

### 1. Mock GCS Provider (`mock-gcs-provider.ts`)

Mock GCS provider with configurable failure scenarios for testing upload resilience.

**Usage:**
```typescript
import { MockGCSProvider } from './fixtures/mock-gcs-provider';

const provider = new MockGCSProvider('test-bucket', 'us-central1');

// Test success
await provider.multipartUpload(buffer, { contentType: 'image/jpeg' });

// Test network failure
provider.setFailureMode('network');
await provider.multipartUpload(buffer, {}); // Throws ECONNREFUSED

// Test 503 service unavailable
provider.setFailureMode('503');

// Test timeout
provider.setFailureMode('timeout');

// Reset to success
provider.reset();
```

**Failure Modes:**
- `success` - Normal upload
- `network` - ECONNREFUSED error
- `503` - Service unavailable
- `401` - Unauthorized
- `timeout` - Request timeout

### 2. Queue Test Helpers (`queue-test-helpers.ts`)

BullMQ test utilities for queue-based upload workflows.

**Usage:**
```typescript
import { QueueTestHelper } from './fixtures/queue-test-helpers';

const helper = new QueueTestHelper({
  redisUrl: 'redis://localhost:6379',
  queueName: 'file-uploads-test'
});

// Enqueue job
const jobId = await helper.enqueueTestJob({
  fileId: 'test-file-1',
  fileName: 'test.pdf',
  fileSize: 1024000,
  uploadUrl: 'http://localhost:1080/files/abc123'
});

// Wait for completion
const result = await helper.waitForJobCompletion(jobId, 60000);

// Get metrics
const metrics = await helper.getQueueMetrics();
console.log(`Waiting: ${metrics.waiting}, Active: ${metrics.active}`);

// Clean up
await helper.cleanQueue();
await helper.close();
```

### 3. Large Files Generator (`large-files/generate-files.sh`)

Bash script to generate test files of various sizes.

**Usage:**
```bash
cd test-app/tests/fixtures/large-files

# Generate quick test files (10MB, 50MB)
bash generate-files.sh --quick

# Generate all test files (10MB, 50MB, 100MB, 500MB)
bash generate-files.sh --all

# Generate specific size
bash generate-files.sh --specific 25  # Creates 25mb.bin

# Clean up generated files
bash generate-files.sh --clean
```

**Generated Files:**
- `10mb.bin` - Random binary data
- `50mb.bin` - Random binary data
- `100mb.bin` - Zero-filled (faster)
- `500mb.bin` - Zero-filled (faster)
- `sample-resume.pdf` - Realistic PDF
- `project1.pdf`, `project2.pdf` - Additional PDFs
- `profile-photo.jpg` - JPEG image

### 4. E2E Test Configuration (`config/e2e-test.config.ts`)

Centralized configuration for E2E tests.

**Usage:**
```typescript
import { E2E_CONFIG, getServiceUrl, getTimeout } from '../config/e2e-test.config';

// Get service URLs
const formioUrl = getServiceUrl('formio'); // http://localhost:3001
const tusUrl = getServiceUrl('tus');       // http://localhost:1080

// Get timeouts
const uploadTimeout = getTimeout('fileUpload'); // 120000ms

// Check features
if (isFeatureEnabled('visualTesting')) {
  // Run visual regression tests
}

// Get upload config for file size
const config = getUploadConfigForSize(50 * 1024 * 1024); // 50MB
console.log(`Timeout: ${config.timeout}, Chunk: ${config.chunkSize}`);
```

**Configuration Sections:**
- `services` - Service URLs (Form.io, TUS, GCS, MongoDB, Redis)
- `timeouts` - Timeout values (upload, submission, API)
- `retries` - Retry policies (network, timeout, server errors)
- `limits` - File size limits and concurrent uploads
- `features` - Feature flags (visual testing, profiling, mobile)

### 5. Comprehensive Setup (`setup/comprehensive-setup.ts`)

Playwright global setup for complete environment initialization.

**Usage:**
```typescript
// In playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./tests/setup/comprehensive-setup'),
  // ... other config
});
```

**Setup Steps:**
1. ✅ Verify Docker services running (MongoDB, GCS, Redis)
2. ✅ Wait for Form.io server ready
3. ✅ Create admin user if not exists
4. ✅ Seed test forms
5. ✅ Clean MongoDB test data
6. ✅ Clean Redis queue
7. ✅ Generate large test files if needed

## Integration Example

Complete example using all infrastructure files:

```typescript
import { test, expect } from '@playwright/test';
import { MockGCSProvider } from './fixtures/mock-gcs-provider';
import { QueueTestHelper } from './fixtures/queue-test-helpers';
import { E2E_CONFIG, getTimeout } from './config/e2e-test.config';

test('upload with queue and failure recovery', async ({ page }) => {
  // Setup
  const gcsProvider = new MockGCSProvider();
  const queueHelper = new QueueTestHelper();

  // Test network failure with retry
  gcsProvider.setFailureMode('network');

  const jobId = await queueHelper.enqueueTestJob({
    fileId: 'test-1',
    fileName: 'large-file.bin',
    fileSize: 10 * 1024 * 1024,
    uploadUrl: 'http://localhost:1080/files/test-1'
  });

  // Simulate recovery after 2 attempts
  setTimeout(() => gcsProvider.setFailureMode('success'), 2000);

  // Wait for job completion
  const result = await queueHelper.waitForJobCompletion(
    jobId,
    getTimeout('queueJob')
  );

  expect(result.status).toBe('completed');

  // Cleanup
  await queueHelper.close();
  gcsProvider.reset();
});
```

## Environment Variables

Configure via `.env.test`:

```bash
# Service URLs
FORMIO_BASE_URL=http://localhost:3001
TUS_ENDPOINT=http://localhost:1080
GCS_BASE_URL=http://localhost:4443
MONGODB_URL=mongodb://localhost:27017/formioapp
REDIS_URL=redis://localhost:6379

# Feature Flags
ENABLE_VISUAL_TESTING=false
ENABLE_PERFORMANCE=false
ENABLE_QUEUE_UPLOADS=true
USE_REAL_GCS=false
ENABLE_A11Y=true
ENABLE_MOBILE=false

# Credentials
FORMIO_ROOT_EMAIL=admin@example.com
FORMIO_ROOT_PASSWORD=CHANGEME
```

## Best Practices

1. **Always clean up** - Call `close()` on helpers in test teardown
2. **Use realistic file sizes** - Test with 10MB+ files for meaningful results
3. **Configure timeouts** - Use `getTimeout()` for consistent timeout values
4. **Test failure scenarios** - Use MockGCSProvider failure modes
5. **Monitor queue metrics** - Check queue health before/after tests
6. **Generate files once** - Run `generate-files.sh --quick` before test suite

## Troubleshooting

**Mock GCS Provider:**
- If upload hangs, check `uploadDelay` setting
- If tests fail randomly, verify failure mode is reset

**Queue Helper:**
- If jobs don't complete, check Redis connection
- If jobs fail immediately, verify BullMQ worker is running

**File Generator:**
- If files not created, check disk space
- If script fails, ensure bash is available

**Comprehensive Setup:**
- If setup fails, check Docker services running
- If Form.io not ready, increase wait timeout
- If MongoDB cleanup fails, verify connection string
