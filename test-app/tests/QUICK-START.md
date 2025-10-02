# Uppy E2E Tests - Quick Start Guide

## ⚡ Quick Commands

```bash
# 1. Install Playwright browsers (first time only)
npm run playwright:install

# 2. Run all tests
npm run test:e2e

# 3. View test report
npm run test:e2e:report
```

## 🎯 Common Use Cases

### Run Specific Test Suite
```bash
# Dashboard tests only
npx playwright test uppy-dashboard

# Accessibility tests only
npx playwright test uppy-a11y

# Plugin tests only
npx playwright test uppy-plugins
```

### Debug a Failing Test
```bash
# Open Playwright Inspector
npm run test:e2e:debug

# Or debug specific test
npx playwright test uppy-dashboard --debug
```

### Run in Different Browsers
```bash
npm run test:e2e:chromium   # Chrome only
npm run test:e2e:firefox    # Firefox only
npm run test:e2e:webkit     # Safari only
```

### See Tests Running
```bash
# Headed mode (see browser)
npm run test:e2e:headed

# Interactive UI mode
npm run test:e2e:ui
```

### Run Tests by Tag
```bash
# All Uppy tests
npm run test:e2e -- --grep @uppy

# Only accessibility tests
npm run test:e2e -- --grep @a11y

# Dashboard and validation tests
npm run test:e2e -- --grep "@dashboard|@validation"
```

## 📁 Test Files

| File | Tests | Coverage |
|------|-------|----------|
| `uppy-dashboard.spec.ts` | 15 | UI interactions, file selection, upload |
| `uppy-plugins.spec.ts` | 20 | Webcam, editor, screen, audio, storage |
| `uppy-validation.spec.ts` | 25 | File types, sizes, MIME validation |
| `uppy-multifile.spec.ts` | 20 | Batch uploads, parallel/sequential |
| `uppy-integration.spec.ts` | 15 | Form.io, GCS, end-to-end workflows |
| `uppy-a11y.spec.ts` | 30 | WCAG 2.1 AA, keyboard, ARIA |

## 🔍 Troubleshooting

### Tests Fail with "Timeout"
```bash
# Increase timeout
npx playwright test --timeout=120000

# Or check if dev server is running
npm run dev
```

### "Browser not installed" Error
```bash
# Reinstall browsers
npm run playwright:install
```

### Want to See What's Happening
```bash
# Run in headed mode
npm run test:e2e:headed
```

### Need to Debug Specific Line
```bash
# Use Inspector
npx playwright test uppy-dashboard --debug
```

## 📊 Test Output

After running tests, you'll find:
- **HTML Report:** `playwright-report/index.html`
- **Screenshots:** `test-results/**/*-screenshot.png`
- **Videos:** `test-results/**/*.webm`
- **Traces:** `test-results/**/*.zip`

View HTML report:
```bash
npm run test:e2e:report
```

View trace file:
```bash
npx playwright show-trace test-results/trace.zip
```

## 🎨 Update Visual Snapshots

```bash
npm run test:e2e:update-snapshots
```

## 🚀 CI/CD

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npm run playwright:install

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 More Information

- **Full Guide:** [README.md](./README.md)
- **Test Summary:** [TEST-SUMMARY.md](./TEST-SUMMARY.md)
- **Test Patterns:** `/.hive-mind/tests/uppy-test-patterns.json`

## 💡 Pro Tips

1. **Run tests in parallel by default** - Playwright handles this automatically
2. **Use `--grep` to filter tests** - Save time running only what you need
3. **Debug mode is your friend** - Use `--debug` when tests fail
4. **Check the HTML report** - Visual test results with screenshots
5. **Use headed mode** - See tests run in real browser with `--headed`

## 🎯 Test Tags

| Tag | Description |
|-----|-------------|
| `@uppy` | All Uppy tests |
| `@dashboard` | Dashboard UI tests |
| `@plugins` | Plugin tests |
| `@validation` | File validation tests |
| `@multifile` | Multi-file upload tests |
| `@integration` | Integration tests |
| `@a11y` | Accessibility tests |

Example: `npm run test:e2e -- --grep @a11y`

## ✅ Success Indicators

Tests are passing when you see:
- ✅ Green checkmarks in console
- ✅ "passed" status in HTML report
- ✅ No red failures
- ✅ Screenshots only on failure (optional)

Happy Testing! 🎉