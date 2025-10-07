# Form.io Rendering Wait Logic Fix - Implementation Summary

## Overview
Fixed Form.io rendering wait logic across all page objects to prevent test execution blocking caused by attempting to interact with file inputs before Form.io completes rendering.

## Problem
Tests were blocked because they attempted to set files on input elements before Form.io had fully rendered the form, causing timeout failures.

## Solution
Added explicit wait logic for Form.io form rendering using `.formio-form` selector with proper timeouts:

```typescript
// Wait for Form.io to render the form
await this.page.waitForSelector('.formio-form', {
  state: 'visible',
  timeout: 15000
});

// Wait for file input specifically
await this.fileInput.waitFor({
  state: 'visible',
  timeout: 10000
});
```

## Files Modified (3 Page Objects)

### 1. TusBulkUploadPage.ts
**Location:** `/test-app/tests/pages/TusBulkUploadPage.ts`

**Method:** `uploadFiles(files: TestFile[])`
- Added `.formio-form` selector wait (15s timeout)
- Added file input visibility wait (10s timeout)
- Removed generic text-based selector
- Removed arbitrary timeout (1000ms)

### 2. FileUploadPage.ts
**Location:** `/test-app/tests/pages/FileUploadPage.ts`

**Methods Modified:**
1. `uploadFile(filePath: string)`
   - Added `.formio-form` selector wait (15s timeout)
   - Added file input visibility wait (10s timeout)

2. `uploadMultipleFiles(filePaths: string[])`
   - Added `.formio-form` selector wait (15s timeout)
   - Added file input visibility wait (10s timeout)

### 3. TusUploadPage.ts
**Location:** `/test-app/tests/pages/TusUploadPage.ts`

**Method:** `uploadFileWithTus(filePath: string, options?: TusUploadOptions)`
- Added `.formio-form` selector wait (15s timeout)
- Added file input visibility wait (10s timeout)
- Placed before calling parent class `uploadFile()` method

## Wait Logic Pattern

The pattern is applied consistently across all page objects:

```typescript
async uploadFiles(files: TestFile[]): Promise<void> {
  // 1. Wait for Form.io to render the form container
  await this.page.waitForSelector('.formio-form', {
    state: 'visible',
    timeout: 15000
  });

  // 2. Wait for the specific file input element
  await this.fileInput.waitFor({
    state: 'visible',
    timeout: 10000
  });

  // 3. Proceed with file operations
  const filePaths = files.map(f => f.path);
  await this.fileInput.setInputFiles(filePaths);
}
```

## Timeout Strategy

- **Form rendering wait:** 15 seconds (accommodates React lazy loading, Form.io initialization)
- **File input wait:** 10 seconds (ensures specific element is interactive)
- **Total max wait:** 25 seconds per upload operation

## Benefits

1. **Eliminates Race Conditions:** Ensures Form.io has fully rendered before interaction
2. **Consistent Pattern:** Same wait logic across all page objects
3. **Robust Timeouts:** Generous timeouts accommodate varying render speeds
4. **Clear Intent:** Code explicitly documents what it's waiting for

## Testing Verification

To verify the fix works:

```bash
# Run TUS bulk upload test
npm run test:e2e -- tests/e2e/tus-bulk-upload-stress.spec.ts

# Run all TUS tests
npm run test:e2e -- --grep @tus

# Run all Form.io module tests
npm run test:e2e:formio
```

## Integration with Components

The wait logic integrates with Form.io components that set `testPageReady`:

**TusBulkUploadTest.tsx:**
```typescript
useEffect(() => {
  window.testPageReady = true;
  window.dispatchEvent(new Event('test-page-loaded'));
}, []);
```

**FormioSubmissionTest.tsx:**
- Uses same Form.io rendering pattern
- Benefits from same wait logic in page objects

## Next Steps

1. Verify tests pass with new wait logic
2. Monitor for any remaining timeout issues
3. Consider extracting wait logic to shared helper function if more page objects are added

## Related Files

- `/test-app/src/pages/TusBulkUploadTest.tsx` - Test component
- `/test-app/src/pages/FormioSubmissionTest.tsx` - Test component
- `/test-app/tests/utils/formio-helpers.ts` - Form.io helper utilities

## Notes

- The `.formio-form` selector is Form.io's standard form container class
- File inputs in Form.io are often hidden, but must be in the DOM and visible state
- The pattern is defensive and prioritizes test reliability over speed
