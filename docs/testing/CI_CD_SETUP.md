# CI/CD Pipeline Setup Guide

## Overview

This document describes the CI/CD pipeline setup for automated E2E testing of the Form.io file upload feature.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Trigger                    │
│         (Push to branches or Pull Request created)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Parallel Job Execution                  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │ Full Suite    │  │  TUS Tests    │  │  Uppy Tests     │ │
│  │ (All Browsers)│  │  (Chromium)   │  │  (Chromium)     │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ │
│  │  Edge Cases   │  │ Visual Tests  │  │ Cross-Browser   │ │
│  │  (Chromium)   │  │  (Chromium)   │  │ (Ch/FF/WK)      │ │
│  └───────────────┘  └───────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Results Aggregation                       │
├─────────────────────────────────────────────────────────────┤
│  • Upload artifacts (reports, screenshots, videos)          │
│  • Comment PR with test results                             │
│  • Generate GitHub summary                                   │
│  • Fail build if critical tests fail                        │
└─────────────────────────────────────────────────────────────┘
```

## Workflow Files

### Main E2E Workflow
- **File**: `.github/workflows/e2e-tests.yml`
- **Triggers**: Push to main/master/develop, Pull Requests
- **Jobs**: 8 parallel jobs for comprehensive testing

### Complete File Upload Workflow
- **File**: `.github/workflows/file-upload-tests.yml`
- **Jobs**: Quality checks, unit tests, integration tests, E2E tests, security, performance

## Environment Setup

### Test Environment (docker-compose.test.yml)

Isolated test environment with:
- **MongoDB**: Ephemeral test database (tmpfs)
- **GCS Emulator**: In-memory storage
- **Form.io Server**: Test configuration
- **TUS Server**: Resumable upload server (1GB limit for tests)
- **Redis**: Test caching
- **Playwright Container**: For running tests in CI

Benefits:
- **Isolation**: No interference with local development
- **Performance**: tmpfs for fast I/O
- **Cleanup**: Automatic teardown after tests
- **Reproducibility**: Same environment everywhere

## Job Details

### 1. e2e-full-suite
- **Runtime**: ~30 minutes
- **Browsers**: Chromium, Firefox, WebKit
- **Purpose**: Complete test coverage
- **Artifacts**:
  - Test results
  - Playwright HTML report
  - Screenshots (on failure)
  - Videos (on failure)

### 2. e2e-tus-tests
- **Runtime**: ~15 minutes
- **Filter**: `@tus` tag
- **Purpose**: Test TUS resumable uploads
- **Focus**:
  - Chunked uploads
  - Resume interrupted uploads
  - Large file handling

### 3. e2e-uppy-tests
- **Runtime**: ~15 minutes
- **Filter**: `@uppy` tag
- **Purpose**: Test Uppy UI integration
- **Focus**:
  - UI component rendering
  - File selection
  - Progress display

### 4. e2e-edge-cases
- **Runtime**: ~15 minutes
- **Filter**: `@edge` tag
- **Purpose**: Test edge scenarios
- **Focus**:
  - Large files (>100MB)
  - Network failures
  - Concurrent uploads
  - Error handling

### 5. e2e-visual-regression
- **Runtime**: ~20 minutes
- **Filter**: `@visual` tag
- **Purpose**: Detect UI changes
- **Artifacts**:
  - Visual diff images
  - Baseline screenshots
- **Threshold**: 100 max diff pixels

### 6. e2e-cross-browser
- **Runtime**: ~20 minutes
- **Matrix**: Chromium, Firefox, WebKit
- **Purpose**: Browser compatibility
- **Strategy**: fail-fast: false

### 7. pr-comment
- **Condition**: Only on Pull Requests
- **Purpose**: Comment test results on PR
- **Permissions**: write to pull-requests

### 8. e2e-test-summary
- **Condition**: Always runs
- **Purpose**: Generate overall summary
- **Fails**: If any test job fails

## Service Health Checks

All services have health checks configured:

```yaml
mongodb:
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
    interval: 5s
    timeout: 3s
    retries: 10

gcs-emulator:
  healthcheck:
    test: ["CMD", "wget", "--spider", "-q", "http://localhost:4443/storage/v1/b"]
    interval: 5s
    timeout: 3s
    retries: 10

formio-server:
  healthcheck:
    test: ["CMD", "wget", "--spider", "-q", "http://localhost:3001/health"]
    interval: 5s
    timeout: 3s
    retries: 20
    start_period: 20s
```

## Caching Strategy

### Docker Layer Caching
```yaml
- name: Cache Docker layers
  uses: actions/cache@v4
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
```

### NPM Dependencies Caching
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
    cache-dependency-path: test-app/package-lock.json
```

## Artifacts

### Retention Policy
- **Test Results**: 30 days
- **Playwright Reports**: 30 days
- **Screenshots**: 7 days (only on failure)
- **Videos**: 7 days (only on failure)
- **Visual Baselines**: 30 days

### Download Artifacts
1. Go to Actions → Workflow run
2. Scroll to "Artifacts" section
3. Download desired artifact
4. Extract and view locally

## Git Hooks

### Pre-Commit Hook
- **File**: `.husky/pre-commit`
- **Checks**:
  - Services are running
  - Test file naming conventions
  - Test structure validation
  - Quick smoke tests (`@smoke` tag)
- **Runtime**: ~30 seconds

### Pre-Push Hook
- **File**: `.husky/pre-push`
- **Checks**:
  - Services are running
  - Critical E2E tests (`@critical` tag)
- **Runtime**: ~2 minutes

### Bypassing Hooks
```bash
# Skip pre-commit
git commit --no-verify -m "message"

# Skip pre-push
git push --no-verify
```

## Makefile Commands

### Test Execution
```bash
make upload-test-e2e              # All tests
make upload-test-e2e-tus          # TUS tests only
make upload-test-e2e-uppy         # Uppy tests only
make upload-test-e2e-edge         # Edge cases only
make upload-test-e2e-visual       # Visual tests only
```

### Development
```bash
make upload-test-e2e-debug        # Debug mode (headed)
make upload-test-e2e-ui           # UI mode (interactive)
make upload-test-e2e-report       # View HTML report
```

### CI Simulation
```bash
make upload-test-e2e-ci           # Run in CI mode locally
```

### Visual Regression
```bash
make upload-test-e2e-update-snapshots  # Update baselines
```

## Monitoring & Alerts

### Metrics Tracked
- Test execution time per job
- Pass/fail rates
- Flaky test frequency
- Browser-specific issues
- Visual regression changes

### Alert Conditions
- Failed critical tests (`@critical`)
- Visual regression failures
- Service health check failures
- Test timeout threshold exceeded (>30 min)

## Performance Optimization

### Current Optimizations
1. **Parallel job execution**: 6 jobs run simultaneously
2. **Docker layer caching**: Faster image builds
3. **NPM dependency caching**: Faster installs
4. **tmpfs for test data**: Faster I/O
5. **Service health checks**: Early failure detection
6. **Resource limits**: Prevent resource exhaustion

### Future Improvements
- [ ] Playwright container for faster browser installs
- [ ] Test sharding for large test suites
- [ ] Incremental test runs (only changed files)
- [ ] Test result caching

## Security Considerations

### Secrets Management
- Use GitHub Secrets for sensitive data
- Never commit credentials
- Use test-specific credentials
- Rotate secrets regularly

### Test Isolation
- Isolated network (Docker bridge)
- Ephemeral test data (tmpfs)
- Clean state between runs
- No shared state between tests

### Permissions
- Minimal permissions for workflows
- `pull-requests: write` only for PR comments
- Read-only for other resources

## Troubleshooting CI Issues

### Tests Pass Locally But Fail in CI

**Possible Causes**:
1. Different Node.js versions
2. Missing environment variables
3. Service startup timing
4. Resource constraints

**Solutions**:
1. Match Node.js version in CI
2. Check workflow env variables
3. Increase health check timeouts
4. Review resource limits

### Flaky Tests in CI

**Possible Causes**:
1. Race conditions
2. Network timeouts
3. Insufficient retries

**Solutions**:
1. Add explicit waits
2. Increase timeouts
3. Enable test retries (configured: 2)

### Artifacts Not Available

**Possible Causes**:
1. Job failed before artifact upload
2. Incorrect artifact path
3. Retention period expired

**Solutions**:
1. Use `if: always()` for artifact upload
2. Verify artifact paths
3. Download within retention period

### Visual Regression Failures

**Common Issues**:
1. Font rendering differences
2. Dynamic content (dates, timestamps)
3. Animation timing

**Solutions**:
1. Use web fonts, not system fonts
2. Mock dynamic content
3. Wait for animations to complete

## Best Practices

### Workflow Design
- ✅ Run critical tests first (fail fast)
- ✅ Use matrix for browser testing
- ✅ Enable artifact upload on failure
- ✅ Add descriptive job names
- ✅ Use health checks for services

### Test Organization
- ✅ Tag tests appropriately
- ✅ Keep tests independent
- ✅ Use fixtures for setup
- ✅ Avoid hard-coded waits
- ✅ Clean up test data

### Performance
- ✅ Run tests in parallel
- ✅ Cache dependencies
- ✅ Use Docker layer caching
- ✅ Set appropriate timeouts
- ✅ Use tmpfs for ephemeral data

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/)
- [Husky Git Hooks](https://typicode.github.io/husky/)

## Support

For CI/CD pipeline issues:
1. Check workflow logs in GitHub Actions
2. Review service logs (download from artifacts)
3. Test locally with `make upload-test-e2e-ci`
4. Open issue with workflow run link