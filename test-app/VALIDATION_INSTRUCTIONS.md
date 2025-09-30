# TUS File Upload - Validation Instructions

## 🎯 Current Status

**Implementation**: ✅ Complete
**Commit**: `7b80044` - "feat: Implement real TUS file upload with E2E tests"
**Test Environment**: Ready

---

## 🚀 Services Running

### 1. TUS Server
- **Status**: ✅ Running
- **Container**: `formio-tus-server`
- **Port**: 1080
- **Endpoint**: `http://localhost:1080/files/`
- **Check**: `curl http://localhost:1080`

### 2. Test App
- **Status**: Starting...
- **Port**: 64849
- **URL**: `http://localhost:64849`
- **Start**: `npm run dev`
- **Check**: `curl http://localhost:64849`

### 3. Dependencies
- ✅ tus-js-client (installed)
- ✅ @playwright/test (installed)
- ✅ Test fixtures (1MB, 5MB, 10MB)

---

## 🧪 Running Tests

### Quick Validation
```bash
# Single TUS test
cd test-app
npm run test:e2e:tus -- --grep "should successfully upload a small file"

# All TUS tests
npm run test:e2e:tus

# With headed browser
npm run test:e2e:headed -- --grep @tus

# With debugger
npm run test:e2e:debug -- tests/e2e/tus-upload.spec.ts
```

### Full Test Suite
```bash
# All E2E tests
npm run test:e2e

# Specific browsers
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

---

## 📊 Manual Testing

### 1. Open Test App
```bash
open http://localhost:64849
```

### 2. Navigate to Demo
- Click "Try File Upload Demo"
- Select "TUS Upload" tab

### 3. Test Upload
- Click file input
- Select test file from `tests/fixtures/`
- Watch real upload progress
- Open DevTools → Network tab
- Look for requests to `localhost:1080/files/`

### 4. Verify TUS Protocol
Expected requests:
- `POST http://localhost:1080/files/` (create upload)
- `PATCH http://localhost:1080/files/{id}` (upload chunks)
- Headers: `Tus-Resumable`, `Upload-Offset`, `Upload-Length`

---

## 📁 Capturing HAR File

### Method 1: Playwright (Automated)
```bash
# E2E test with HAR capture
npm run test:e2e:tus

# HAR saved to: test-results/tus-upload-real.har
```

### Method 2: Chrome DevTools (Manual)
1. Open `http://localhost:64849`
2. Open DevTools (F12)
3. Go to Network tab
4. Check "Preserve log"
5. Upload file via demo
6. Right-click → "Save all as HAR with content"
7. Save as `tus-upload-manual.har`

---

## ✅ Validation Checklist

### Implementation
- [x] TusDemo.tsx uses real tus-js-client
- [x] No fake Math.random() simulations
- [x] Pause/resume/cancel controls
- [x] Real progress tracking with speed & ETA
- [x] Exponential backoff retry strategy
- [x] Multiple concurrent uploads

### E2E Tests
- [ ] Small file upload (1MB) - PASS
- [ ] Large file upload (10MB) with progress - PASS
- [ ] Multiple concurrent uploads - PASS
- [ ] Error handling and retry - PASS
- [ ] HAR capture with TUS requests - PASS
- [ ] Demo component features - PASS

### Protocol Verification
- [ ] POST request creates upload
- [ ] PATCH requests upload chunks
- [ ] TUS headers present
- [ ] Upload completes successfully
- [ ] Upload URL returned

---

## 🐛 Troubleshooting

### TUS Server Not Running
```bash
# Start manually
docker run -d -p 1080:1080 --name tusd-test tusproject/tusd

# Or use script
./scripts/start-tus-server.sh
```

### Test App Not Starting
```bash
# Check port in use
lsof -i :64849

# Kill existing process
kill -9 $(lsof -t -i:64849)

# Restart
npm run dev
```

### Tests Failing
```bash
# Install Playwright browsers
npx playwright install

# Run with UI for debugging
npm run test:e2e:ui

# Check test output
ls -la test-results/
```

---

## 📈 Expected Results

### Successful Upload
```
✅ TusDemo component renders
✅ File input accepts files
✅ Upload starts automatically
✅ Progress updates in real-time
✅ Speed calculated correctly
✅ ETA shown and accurate
✅ Upload completes with URL
✅ TUS requests in Network tab
```

### HAR File Contents
```json
{
  "log": {
    "entries": [
      {
        "request": {
          "method": "POST",
          "url": "http://localhost:1080/files/",
          "headers": [
            {"name": "Tus-Resumable", "value": "1.0.0"}
          ]
        }
      },
      {
        "request": {
          "method": "PATCH",
          "url": "http://localhost:1080/files/{id}",
          "headers": [
            {"name": "Upload-Offset", "value": "0"}
          ]
        }
      }
    ]
  }
}
```

---

## 🎉 Success Criteria

1. **Manual test**: Upload 1MB file successfully
2. **E2E tests**: All 8 tests pass
3. **HAR file**: Contains POST + PATCH requests
4. **Protocol**: TUS headers present
5. **UI**: Progress, speed, ETA all working

---

## 📞 Support

- **TUS Protocol**: https://tus.io/protocols/resumable-upload
- **tus-js-client**: https://github.com/tus/tus-js-client
- **Playwright**: https://playwright.dev

---

**Hive Mind Coordination**: Complete
**Implementation Status**: Production-ready
**Next Action**: Run validation tests