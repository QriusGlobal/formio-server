# E2E Testing Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd test-app
npm install
npm run playwright:install
```

### Step 2: Start Services
```bash
# From project root
make upload-dev

# Verify services are running
make upload-verify
```

### Step 3: Run Your First Test
```bash
cd test-app
npm run test:e2e
```

## 📋 Common Commands

### Running Tests
```bash
# All tests
make upload-test-e2e

# Specific test suite
make upload-test-e2e-tus      # TUS uploads
make upload-test-e2e-uppy     # Uppy UI
make upload-test-e2e-edge     # Edge cases
make upload-test-e2e-visual   # Visual regression
```

### Debugging
```bash
# Interactive UI mode (recommended)
make upload-test-e2e-ui

# Debug mode (step-by-step)
make upload-test-e2e-debug

# View test report
make upload-test-e2e-report
```

### CI Simulation
```bash
# Run in isolated environment (like CI)
make upload-test-e2e-ci
```

## 📝 Writing Your First Test

Create `test-app/e2e/my-test.spec.ts`:

```typescript
import { test, expect } from './fixtures';

test.describe('My Feature', () => {
  test('should do something @smoke', async ({ page, formioUrl }) => {
    await page.goto(`${formioUrl}/`);

    // Your test code here
    await expect(page).toHaveTitle(/Form\.io/);
  });
});
```

### Test Tags
- `@smoke` - Quick tests (run on commit)
- `@critical` - Important tests (run on push)
- `@tus` - TUS upload tests
- `@uppy` - Uppy UI tests
- `@edge` - Edge cases
- `@visual` - Visual regression

## 🔍 Debugging Tips

### 1. Use UI Mode (Best for Development)
```bash
cd test-app
npm run test:e2e:ui
```
Features: Time-travel debugging, watch mode, pick locators

### 2. Use Debug Mode
```bash
npm run test:e2e:debug
```
Pauses on each action, allows inspection

### 3. Run Specific Test
```bash
npx playwright test my-test.spec.ts
```

### 4. Add Breakpoint in Code
```typescript
test('my test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Execution pauses here
});
```

## 🎨 Visual Regression Testing

### Run Visual Tests
```bash
make upload-test-e2e-visual
```

### Update Baselines (when UI changes are correct)
```bash
make upload-test-e2e-update-snapshots
```

### View Diffs
```bash
make upload-test-e2e-report
```

## 🔧 Troubleshooting

### Services Not Running
```bash
# Check status
make upload-verify

# Restart
make upload-down && make upload-dev
```

### Port Conflicts
```bash
# Find process on port
lsof -i :3001

# Kill it
kill -9 <PID>
```

### Playwright Not Installed
```bash
cd test-app
npx playwright install --with-deps
```

### Tests Timeout
1. Check services: `make upload-verify`
2. View logs: `docker logs formio-server-local`
3. Increase timeout in test: `test.setTimeout(120000)`

## 📊 CI/CD Pipeline

### Automatic Triggers
- Push to main/master/develop
- Pull requests

### View Results
1. Go to GitHub → Actions
2. Click workflow run
3. Download artifacts (reports, screenshots)

### Local CI Simulation
```bash
make upload-test-e2e-ci
```

## 🎯 Best Practices

1. **Tag your tests**: Use `@smoke`, `@critical`, etc.
2. **Use data-testid**: `page.locator('[data-testid="button"]')`
3. **Wait for elements**: `await expect(locator).toBeVisible()`
4. **Keep tests independent**: Each test should work alone
5. **Use fixtures**: `async ({ formioUrl, testUser })`

## 📚 More Information

- **Full Guide**: `docs/testing/E2E_TESTING.md`
- **CI/CD Setup**: `docs/testing/CI_CD_SETUP.md`
- **Example Tests**: `test-app/e2e/example.spec.ts`
- **Playwright Docs**: https://playwright.dev/

## 🆘 Need Help?

1. Check documentation above
2. Review example tests
3. Use `--help` flag: `npx playwright test --help`
4. Check test logs and artifacts

---

**Happy Testing! 🎭**