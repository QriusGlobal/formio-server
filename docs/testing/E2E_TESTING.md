# E2E Testing Guide for Form.io File Upload Feature

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Running Tests Locally](#running-tests-locally)
- [Writing E2E Tests](#writing-e2e-tests)
- [Debugging Tests](#debugging-tests)
- [Visual Regression Testing](#visual-regression-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

This project uses [Playwright](https://playwright.dev/) for end-to-end testing of the Form.io file upload feature. Our E2E test suite covers:

- **TUS resumable uploads**: Testing chunked file uploads and resume functionality
- **Uppy integration**: Testing the Uppy file uploader UI component
- **Edge cases**: Large files, network failures, concurrent uploads, etc.
- **Visual regression**: Screenshot comparison to detect UI changes
- **Cross-browser**: Testing on Chromium, Firefox, and WebKit

## Getting Started

### Prerequisites

1. **Docker & Docker Compose**: For running test services
2. **Node.js 18+**: For running Playwright tests
3. **Make**: For using convenience commands

### Initial Setup

```bash
# 1. Start all services
make upload-dev

# 2. Install test app dependencies
cd test-app
npm install

# 3. Install Playwright browsers
npm run playwright:install
# or
npx playwright install --with-deps
```

## Running Tests Locally

### Quick Start

```bash
# Run all E2E tests (headless)
make upload-test-e2e

# Run with UI (visual test runner)
make upload-test-e2e-ui

# Run in debug mode (headed browser)
make upload-test-e2e-debug
```

### Specific Test Suites

```bash
# TUS upload tests only
make upload-test-e2e-tus

# Uppy integration tests only
make upload-test-e2e-uppy

# Edge case tests
make upload-test-e2e-edge

# Visual regression tests
make upload-test-e2e-visual
```

### Browser-Specific Tests

```bash
# Test on specific browser
cd test-app
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### View Test Results

```bash
# Open HTML test report
make upload-test-e2e-report

# Or manually
cd test-app
npx playwright show-report playwright-report
```

## Writing E2E Tests

### Test File Structure

Create test files in `test-app/e2e/` directory:

```typescript
// test-app/e2e/file-upload.spec.ts
import { test, expect } from './fixtures';

test.describe('File Upload Feature', () => {
  test.beforeEach(async ({ page, formioUrl }) => {
    await page.goto(`${formioUrl}/`);
  });

  test('should upload a file via TUS @tus @critical', async ({ page }) => {
    // Test implementation
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('path/to/test/file.pdf');

    await expect(page.locator('.upload-success')).toBeVisible();
  });

  test('should show upload progress @uppy', async ({ page }) => {
    // Test implementation
  });
});
```

### Test Tags

Use tags to organize and filter tests:

- `@smoke` - Quick smoke tests (run on pre-commit)
- `@critical` - Critical functionality (run on pre-push)
- `@tus` - TUS upload specific tests
- `@uppy` - Uppy integration tests
- `@edge` - Edge case scenarios
- `@visual` - Visual regression tests

### Using Fixtures

Our custom fixtures provide common test utilities:

```typescript
test('uses custom fixtures', async ({ formioUrl, testUser }) => {
  // formioUrl - Base URL for Form.io server
  // testUser - Test user credentials
  console.log(`Testing against ${formioUrl}`);
  console.log(`User: ${testUser.email}`);
});
```

### Best Practices for Test Writing

1. **Use descriptive test names**: `test('should upload file via TUS and show progress', ...)`
2. **Tag tests appropriately**: Add `@tags` for filtering
3. **Use data-testid selectors**: Prefer `data-testid` over CSS selectors
4. **Test user flows, not implementations**: Focus on user behavior
5. **Keep tests independent**: Each test should run in isolation
6. **Use fixtures for common setup**: Don't repeat authentication, navigation, etc.

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode (headed browser with pause)
make upload-test-e2e-debug

# Or specific test
cd test-app
npx playwright test file-upload.spec.ts --debug
```

### UI Mode (Recommended)

```bash
# Interactive test runner with time-travel debugging
make upload-test-e2e-ui
```

Features:
- Watch mode - Auto-run on file changes
- Time-travel debugging - Step through test execution
- Pick locator - Generate selectors visually
- View traces - Detailed execution timeline

### Headed Mode

```bash
# See the browser while tests run
cd test-app
npm run test:e2e:headed
```

### Playwright Inspector

Add `await page.pause()` in your test:

```typescript
test('debug specific step', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Test will pause here
  // Continue manually or step through
});
```

### View Traces

Traces are automatically captured on failures:

```bash
# Open trace viewer
npx playwright show-trace test-results/path-to-trace.zip
```

## Visual Regression Testing

### Running Visual Tests

```bash
# Run visual regression tests
make upload-test-e2e-visual
```

### Writing Visual Tests

```typescript
test('form renders correctly @visual', async ({ page }) => {
  await page.goto('/upload-form');

  // Take and compare screenshot
  await expect(page).toHaveScreenshot('upload-form.png', {
    maxDiffPixels: 100, // Allow small differences
  });
});
```

### Updating Baselines

When UI changes are intentional:

```bash
# Update all visual baselines
make upload-test-e2e-update-snapshots

# Or specific test
cd test-app
npx playwright test --update-snapshots --grep @visual
```

### Visual Diff Review

1. Check the test report: `make upload-test-e2e-report`
2. Compare `expected` vs `actual` vs `diff` images
3. Update baselines if changes are correct

## CI/CD Pipeline

### GitHub Actions Workflow

Our CI/CD pipeline runs automatically on:
- Push to `main`, `master`, `develop`, or feature branches
- Pull requests to `main`, `master`, `develop`

### Pipeline Jobs

1. **e2e-full-suite**: Complete E2E test suite
2. **e2e-tus-tests**: TUS-specific tests
3. **e2e-uppy-tests**: Uppy integration tests
4. **e2e-edge-cases**: Edge case scenarios
5. **e2e-visual-regression**: Visual regression tests
6. **e2e-cross-browser**: Tests on Chromium, Firefox, WebKit
7. **pr-comment**: Comments test results on PR
8. **e2e-test-summary**: Overall test summary

### Viewing CI Results

1. Navigate to **Actions** tab in GitHub
2. Click on the workflow run
3. View job logs and artifacts
4. Download Playwright reports from artifacts

### Running CI Tests Locally

Simulate CI environment:

```bash
# Run tests in isolated Docker environment
make upload-test-e2e-ci
```

This will:
- Start services via `docker-compose.test.yml`
- Run full E2E test suite
- Clean up automatically

## Troubleshooting

### Services Not Running

**Problem**: Tests fail with connection errors

**Solution**:
```bash
# Check service status
make upload-verify

# Restart services
make upload-down
make upload-dev

# Verify health
curl http://localhost:3001/health
curl http://localhost:4443/storage/v1/b
curl http://localhost:1080/
```

### Playwright Browsers Not Installed

**Problem**: `Executable doesn't exist` error

**Solution**:
```bash
cd test-app
npx playwright install --with-deps
```

### Tests Timeout

**Problem**: Tests hang or timeout

**Solutions**:
1. **Increase timeout** in `playwright.config.ts`:
   ```typescript
   timeout: 60000, // 60 seconds
   ```

2. **Check service logs**:
   ```bash
   docker logs formio-server-local
   ```

3. **Verify service health**:
   ```bash
   make upload-verify
   ```

### Flaky Tests

**Problem**: Tests pass/fail inconsistently

**Solutions**:
1. **Add explicit waits**:
   ```typescript
   await page.waitForLoadState('networkidle');
   await expect(locator).toBeVisible({ timeout: 10000 });
   ```

2. **Increase retries** in `playwright.config.ts`:
   ```typescript
   retries: 2, // Retry failed tests
   ```

3. **Use test isolation**:
   ```typescript
   test.describe.configure({ mode: 'serial' });
   ```

### Visual Regression Failures

**Problem**: Screenshots don't match baselines

**Solutions**:
1. **Review diffs**:
   ```bash
   make upload-test-e2e-report
   ```

2. **Update baselines** if changes are correct:
   ```bash
   make upload-test-e2e-update-snapshots
   ```

3. **Adjust threshold**:
   ```typescript
   await expect(page).toHaveScreenshot({
     maxDiffPixels: 100, // Allow small differences
   });
   ```

### Port Conflicts

**Problem**: Port already in use errors

**Solution**:
```bash
# Find process using port
lsof -i :3001
lsof -i :4443
lsof -i :1080

# Kill process
kill -9 <PID>

# Or restart all services
docker-compose -f docker-compose.local.yml down
make upload-dev
```

### Docker Issues

**Problem**: Docker containers fail to start

**Solutions**:
```bash
# Clean up everything
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.upload.yml down -v
docker system prune -f

# Restart Docker Desktop

# Rebuild and start
make upload-dev
```

## Best Practices

### Test Organization

```
test-app/e2e/
├── fixtures.ts              # Custom fixtures
├── global-setup.ts          # Global setup (runs once)
├── global-teardown.ts       # Global teardown (runs once)
├── file-upload.spec.ts      # File upload tests
├── tus-upload.spec.ts       # TUS-specific tests
├── uppy-integration.spec.ts # Uppy tests
├── edge-cases.spec.ts       # Edge case scenarios
└── visual/                  # Visual regression tests
    ├── forms.spec.ts
    └── screenshots/         # Baseline screenshots
```

### Performance Optimization

1. **Use test isolation**: Run independent tests in parallel
2. **Share browser context**: Use `beforeAll` for setup
3. **Cache dependencies**: Cache `node_modules` in CI
4. **Use Docker layer caching**: Speed up image builds
5. **Run critical tests first**: Fail fast on important issues

### Maintenance

1. **Keep baselines updated**: Update visual baselines when UI changes
2. **Clean up old artifacts**: Remove old test results regularly
3. **Review flaky tests**: Fix or mark as flaky
4. **Update Playwright**: Keep Playwright version current
5. **Monitor test duration**: Optimize slow tests

### Security

1. **Never commit secrets**: Use environment variables
2. **Use test credentials**: Separate test accounts
3. **Isolate test environment**: Use `docker-compose.test.yml`
4. **Clean up test data**: Remove test files after tests
5. **Review test logs**: Don't log sensitive data

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Form.io Documentation](https://help.form.io/)

## Support

For questions or issues:
1. Check this documentation
2. Review [Troubleshooting](#troubleshooting) section
3. Check test logs and artifacts
4. Open an issue with reproduction steps