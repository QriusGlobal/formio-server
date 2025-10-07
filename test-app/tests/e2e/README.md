# E2E Test Suite - Form.io Integration

**Location:** `/test-app/tests/e2e/`
**Framework:** Playwright + TypeScript
**Package Manager:** Bun

---

## Available Test Suites

### 1. Form Submission Integration Tests
**File:** `form-submission-integration.spec.ts`
**Tests:** 8 comprehensive scenarios
**Duration:** ~3-5 minutes
**Documentation:** [FORM_SUBMISSION_INTEGRATION_TESTS.md](/docs/FORM_SUBMISSION_INTEGRATION_TESTS.md)

**Test Scenarios:**
1. ✅ Single file upload → submission
2. ✅ Multiple file upload → submission (10 files)
3. ✅ Mixed upload types (TUS + Uppy)
4. ✅ Form validation enforcement
5. ✅ File URL accessibility
6. ✅ Submission data structure validation
7. ✅ Large file submission (100MB+)
8. ✅ Concurrent form submissions (5x)

### 2. Form.io Integration Tests
**File:** `formio-integration.spec.ts`
**Tests:** 6 basic integration tests
**Duration:** ~2-3 minutes

---

## Quick Start

### Run All E2E Tests

```bash
cd test-app
bun run test:e2e
```

### Run Specific Test Suite

```bash
# Form submission integration
bun playwright test tests/e2e/form-submission-integration.spec.ts

# Basic Form.io integration
bun playwright test tests/e2e/formio-integration.spec.ts
```

### Run Single Test

```bash
# Run test by name pattern
bun playwright test -g "Single file upload"

# Run test by line number
bun playwright test tests/e2e/form-submission-integration.spec.ts:45
```

---

## Debug Mode

### Interactive Debug

```bash
bun playwright test --debug
```

**Features:**
- Step through tests
- Inspect elements
- View network requests
- Console logs

### UI Mode (Recommended)

```bash
bun run test:e2e:ui
```

**Features:**
- Visual test runner
- Watch mode
- Time travel debugging
- Trace viewer

### Headed Mode (Watch Browser)

```bash
bun playwright test --headed
```

---

## Prerequisites

### 1. Infrastructure Services

```bash
# Start all services
docker-compose -f docker-compose.test.yml up -d

# Verify services are running
docker ps  # Should show: mongodb, formio, tusd
```

**Required Services:**
- MongoDB: `localhost:27017`
- Form.io: `http://localhost:3001`
- TUS Server: `http://localhost:1080`

### 2. Test Application

```bash
cd test-app
bun install
bun run dev  # Starts on http://localhost:64849
```

### 3. Playwright Browsers

```bash
bun playwright install chromium
```

---

## Test Execution Options

### Filter by Browser

```bash
# Chromium only
bun playwright test --project=chromium

# Firefox only
bun playwright test --project=firefox

# All browsers
bun playwright test --project=chromium --project=firefox --project=webkit
```

### Retry Failed Tests

```bash
# Retry failed tests once
bun playwright test --retries=1

# CI mode (2 retries)
CI=true bun playwright test
```

### Parallel Execution

```bash
# Run tests in parallel (default: max workers)
bun playwright test

# Limit workers
bun playwright test --workers=2

# Sequential execution
bun playwright test --workers=1
```

### Show Browser

```bash
# Show browser during test
bun playwright test --headed

# Slow down execution (ms)
bun playwright test --headed --slowmo=1000
```

---

## Test Reports

### HTML Report

```bash
# Generate and open HTML report
bun playwright show-report
```

**Location:** `test-app/playwright-report/index.html`

### JSON Report

**Location:** `test-app/test-results/test-results.json`

```bash
# View JSON report
cat test-results/test-results.json | jq
```

### JUnit Report (CI/CD)

**Location:** `test-app/test-results/junit.xml`

---

## Test Artifacts

### Screenshots

Failed tests automatically capture screenshots:

```
test-app/test-results/
└── form-submission-integration-spec-ts-1-single-file/
    └── test-failed-1.png
```

### Videos

Failed tests record video (configurable):

```
test-app/test-results/
└── form-submission-integration-spec-ts-1-single-file/
    └── video.webm
```

### Traces

View execution trace with timeline:

```bash
bun playwright show-trace test-results/trace.zip
```

**Trace includes:**
- Screenshots at each step
- Network requests
- Console logs
- DOM snapshots
- Action timeline

---

## Environment Variables

Configure test execution with environment variables:

```bash
# Form.io API URL
export FORMIO_URL=http://localhost:3001

# TUS upload server
export TUS_URL=http://localhost:1080

# Test application URL
export TEST_APP_URL=http://localhost:64849

# Run tests
bun playwright test
```

---

## Cleanup

### Remove Test Results

```bash
# Clean all test artifacts
rm -rf test-app/test-results
rm -rf test-app/playwright-report

# Or use Playwright CLI
bun playwright clean
```

### Remove Generated Files

```bash
# Clean generated test files
rm -rf test-app/tests/fixtures/generated/*
```

### Reset TUS Server

```bash
# Docker: Clean TUS uploads
docker exec tusd rm -rf /srv/tusd-data/data/*

# Local: Remove TUS files
rm -rf /path/to/tus-uploads/*
```

---

## Troubleshooting

### Test Failures

**1. Services Not Running**

```bash
# Check service health
curl http://localhost:3001/health  # Form.io
curl http://localhost:1080/files   # TUS
curl http://localhost:64849        # Test app

# Restart services
docker-compose -f docker-compose.test.yml restart
```

**2. Port Already in Use**

```bash
# Find process using port 64849
lsof -ti:64849

# Kill process
kill -9 $(lsof -ti:64849)
```

**3. Playwright Browser Issues**

```bash
# Reinstall browsers
bun playwright install --force chromium

# Clear Playwright cache
rm -rf ~/.cache/ms-playwright
```

**4. Timeout Errors**

```bash
# Increase timeout
bun playwright test --timeout=120000

# Or in test:
test.setTimeout(120000);
```

### Debug Logs

**Enable Playwright Debug Logs:**

```bash
DEBUG=pw:api bun playwright test
```

**Enable Browser Console:**

```bash
bun playwright test --headed
# Console logs appear in terminal
```

---

## Best Practices

### 1. Test Isolation

- ✅ Each test is independent
- ✅ Cleanup in `afterEach`
- ✅ No shared state between tests
- ✅ Generate unique test data

### 2. Selectors

```typescript
// ✅ Good: Use data attributes
page.locator('[data-testid="submit-button"]')
page.locator('[data-key="resume"]')

// ❌ Avoid: Brittle selectors
page.locator('button.btn-primary')
page.locator('div > div > button')
```

### 3. Waits

```typescript
// ✅ Good: Wait for specific conditions
await page.waitForSelector('.success-message')
await expect(page.locator('.result')).toBeVisible()

// ❌ Avoid: Arbitrary timeouts
await page.waitForTimeout(5000)
```

### 4. Error Handling

```typescript
// ✅ Good: Specific assertions
await expect(page.locator('.error')).toContainText('required')

// ❌ Avoid: Generic try/catch
try {
  await page.click('button')
} catch (e) {}
```

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run E2E Tests
  run: |
    cd test-app
    bun install
    bun playwright install --with-deps chromium
    bun run test:e2e
```

### GitLab CI

```yaml
e2e-tests:
  script:
    - cd test-app
    - bun install
    - bun playwright install chromium
    - bun run test:e2e
  artifacts:
    when: always
    paths:
      - test-app/test-results/
      - test-app/playwright-report/
```

---

## Performance Tips

### 1. Run Tests in Parallel

```bash
# Use all CPU cores
bun playwright test --workers=100%

# Use specific number of workers
bun playwright test --workers=4
```

### 2. Skip Heavy Tests Locally

```typescript
test.skip('Large file upload', async () => {
  // Skipped during development
});

// Or conditionally skip
test.skip(!process.env.CI, 'Large file upload', async () => {
  // Only runs in CI
});
```

### 3. Use Test Tags

```typescript
test('Single file upload @smoke', async () => {
  // Tagged as smoke test
});

// Run smoke tests only
// bun playwright test --grep @smoke
```

---

## Contributing

### Adding New Tests

1. **Create test file** in `/test-app/tests/e2e/`
2. **Import fixtures** from `../fixtures/formio.fixture`
3. **Follow naming convention**: `{feature}-{type}.spec.ts`
4. **Add documentation** in `/docs/`
5. **Update this README**

### Test Template

```typescript
import { test, expect } from '../fixtures/formio.fixture';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test.afterEach(async ({ page }) => {
    // Cleanup
  });

  test('should do something', async ({ page }) => {
    // Test steps
    await page.goto('/test-page');

    // Assertions
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

---

## Related Documentation

- [Form Submission Integration Tests](/docs/FORM_SUBMISSION_INTEGRATION_TESTS.md)
- [Integration Status](/docs/INTEGRATION_STATUS.md)
- [Local Development Guide](/docs/LOCAL_DEVELOPMENT.md)
- [Playwright Documentation](https://playwright.dev/)

---

**Last Updated:** October 6, 2025
**Maintained by:** Formio Integration Team
