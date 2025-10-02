# Test Execution Plan

## Pre-Test Setup Required

### 1. Build Module
```bash
cd /Users/mishal/code/work/formio-monorepo/packages/formio-file-upload
npm install
npm run build
```

### 2. Link Module to Test App
```bash
cd /Users/mishal/code/work/formio-monorepo/test-app
npm link ../packages/formio-file-upload
```

### 3. Install Test Dependencies
```bash
cd /Users/mishal/code/work/formio-monorepo/test-app
npm install
npx playwright install chromium firefox webkit
```

### 4. Fix Port Conflicts
```bash
# Stop existing TUS server on 1080
docker stop formio-tus-server

# Update docker-compose.test.yml to use port 1081
# Or use the existing TUS server
```

## Test Suites to Execute

### Suite 1: TUS Upload Tests
- Single file upload (PDF, <10MB)
- Large file upload (>50MB)
- Pause/Resume functionality
- Network interruption recovery
- Concurrent uploads
- File validation

### Suite 2: Uppy Dashboard Tests
- Drag & drop upload
- Webcam capture
- Screen recording
- Image editing
- URL import
- Multiple file selection

### Suite 3: Form Submission Tests
- Complete form with files
- Required field validation
- Draft saving
- Edit existing submission
- Delete submission with files

### Suite 4: Server Storage Tests
- GCS bucket storage
- MongoDB metadata
- File permissions
- Integrity verification
- Cleanup on deletion

### Suite 5: Network Resilience Tests
- Complete network loss
- Intermittent failures
- Slow network (3G simulation)
- Bandwidth throttling
- Connection reset

## Expected Failures & Fixes

### Critical Failures
1. **Module not found**: Build and link module first
2. **Port in use**: Stop conflicting service or change port
3. **Auth failure**: Check JWT token generation

### Common Issues
1. **Timeout errors**: Increase test timeout to 120s
2. **File not found**: Create test fixtures directory
3. **Permission denied**: Check Docker volume permissions

## Test Execution Commands

```bash
# Run all tests
npm run test:e2e:formio

# Run specific suite
npm run test:e2e:formio -- tests/e2e/formio-module/formio-tus-upload.spec.ts

# Debug mode
npm run test:e2e:formio -- --debug --headed

# Generate report
npm run test:e2e:formio -- --reporter=html
```

## Success Metrics

- [ ] All component tests pass (TUS & Uppy)
- [ ] File uploads complete in <5s for 10MB
- [ ] Network recovery works 100% of time
- [ ] No memory leaks after 100 uploads
- [ ] Cross-browser compatibility verified
- [ ] Accessibility standards met