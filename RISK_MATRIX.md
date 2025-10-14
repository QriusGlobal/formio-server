# ESLint Fix Risk Matrix

## Testing Requirements & Risk Assessment

**Purpose**: Identify which files need extra testing after ESLint fixes  
**Use**: Guide test planning and regression testing strategy

---

## Risk Level Definitions

| Level           | Description                               | Testing Required          |
| --------------- | ----------------------------------------- | ------------------------- |
| 🔴 **CRITICAL** | User-facing functionality, data integrity | Full E2E + manual testing |
| 🟠 **HIGH**     | Core business logic, API contracts        | Integration + unit tests  |
| 🟡 **MEDIUM**   | Internal utilities, non-critical features | Unit tests                |
| 🟢 **LOW**      | Configuration, types, comments            | Lint + type check only    |

---

## Critical Risk Files (🔴 Full Testing Required)

### 1. form-client-web-app/src/main.tsx

**Risk Level**: 🔴 CRITICAL  
**Why**: Application entry point, Formio initialization  
**Changes**: React Hook fix, import resolution, type assertions

**Failure Impact**:

- ❌ App won't load
- ❌ File upload module won't register
- ❌ Complete application failure

**Testing Requirements**:

1. **Manual Smoke Test**:
   - App loads without console errors
   - Formio components render
   - MultiImageUpload component visible
   - File upload widget appears

2. **E2E Tests**:
   - `tests/e2e/formio-submission.spec.ts`
   - `tests/e2e/tus-upload.spec.ts`
   - `form-client-web-app/tests/integration/formio-tus-integration.test.tsx`

3. **Browser Console Check**:
   ```javascript
   // Should exist:
   window.Formio;
   window.Formio.components.tusupload;
   window.Formio.components.multiimageupload;
   ```

**Rollback Trigger**: Any console error or component not registering

---

### 2. packages/formio-file-upload/src/components/UppyFileUpload/Component.ts

**Risk Level**: 🔴 CRITICAL  
**Why**: Core file upload functionality  
**Changes**: 150+ type assertions, nullish coalescing, promise handling

**Failure Impact**:

- ❌ File uploads fail
- ❌ Progress tracking broken
- ❌ Resume functionality broken
- ❌ Chunk uploads fail

**Testing Requirements**:

1. **Unit Tests**:

   ```bash
   cd packages/formio-file-upload
   pnpm test -- Component.test
   ```

2. **E2E Upload Tests**:
   - Small file upload (<1MB)
   - Large file upload (>10MB)
   - Multiple file upload
   - Upload cancellation
   - Upload resume after network interruption

3. **Edge Cases**:
   - 0-byte file
   - File > maxSize
   - Disallowed file type
   - Network timeout during upload
   - Server error response

**Rollback Trigger**: Any upload test fails

---

### 3. packages/formio-file-upload/src/components/TusFileUpload/Component.ts

**Risk Level**: 🔴 CRITICAL  
**Why**: TUS resumable upload protocol  
**Changes**: Type assertions for Formio integration

**Failure Impact**:

- ❌ Resumable uploads broken
- ❌ Large file uploads fail
- ❌ Chunk coordination issues

**Testing Requirements**:

1. **TUS Protocol Tests**:
   - Chunk upload sequence
   - Resume from interruption
   - Fingerprint generation
   - Metadata transmission

2. **Integration Tests**:
   ```bash
   cd form-client-web-app
   pnpm test -- tus-upload-flow.test
   ```

**Rollback Trigger**: TUS protocol errors or chunk upload failures

---

### 4. packages/formio-file-upload/src/validators/magicNumbers.ts

**Risk Level**: 🔴 CRITICAL  
**Why**: Security validation (file type verification)  
**Changes**: Type assertions

**Failure Impact**:

- ❌ Malicious files accepted
- ❌ Wrong file types accepted
- ❌ Security bypass

**Testing Requirements**:

1. **Security Tests**:

   ```bash
   cd packages/formio-file-upload
   pnpm test -- magicNumbers.test
   ```

2. **Manual Tests**:
   - Upload .exe renamed to .jpg (should reject)
   - Upload valid PDF (should accept)
   - Upload image with wrong extension (should validate)

**Rollback Trigger**: ANY security test failure

---

## High Risk Files (🟠 Integration Testing)

### 5. packages/formio-file-upload/src/components/FileUploadProgress.tsx

**Risk Level**: 🟠 HIGH  
**Why**: UI feedback, user experience  
**Changes**: No-param-reassign fix, array key fix

**Failure Impact**:

- ⚠️ Progress bars don't update
- ⚠️ File list doesn't render
- ⚠️ Cancel button broken

**Testing Requirements**:

1. **Visual Tests**:
   - Progress bar animates
   - File names display correctly
   - Cancel button works
   - Error messages show

2. **Unit Tests**:
   ```bash
   pnpm test -- FileUploadProgress.test
   ```

**Rollback Trigger**: Progress tracking broken

---

### 6. packages/formio-file-upload/src/validators/sanitizeFilename.ts

**Risk Level**: 🟠 HIGH  
**Why**: Security (path traversal prevention)  
**Changes**: Type safety improvements

**Failure Impact**:

- ⚠️ Path traversal vulnerability
- ⚠️ Filename injection

**Testing Requirements**:

1. **Security Tests**:

   ```bash
   pnpm test -- sanitizeFilename.test
   ```

2. **Test Cases**:
   - `../../etc/passwd` → sanitized
   - `<script>alert(1)</script>.jpg` → sanitized
   - `valid-filename.pdf` → unchanged

**Rollback Trigger**: Security test failure

---

### 7. packages/formio-file-upload/src/validators/fileIntegrity.ts

**Risk Level**: 🟠 HIGH  
**Why**: Data integrity validation  
**Changes**: Type assertions

**Failure Impact**:

- ⚠️ Corrupted files accepted
- ⚠️ Tampered files not detected

**Testing Requirements**:

1. **Integrity Tests**:

   ```bash
   pnpm test -- fileIntegrity.test
   ```

2. **Test Cases**:
   - Valid file → checksum passes
   - Modified file → checksum fails
   - Empty file → handled gracefully

**Rollback Trigger**: Checksum validation broken

---

## Medium Risk Files (🟡 Unit Testing)

### 8. form-client-web-app/src/components/ProgressiveDisclosure.tsx

**Risk Level**: 🟡 MEDIUM  
**Why**: UI component, non-critical  
**Changes**: Type imports, return types, ARIA fix

**Failure Impact**:

- ⚠️ Disclosure widget doesn't work
- ⚠️ Accessibility issue

**Testing Requirements**:

- Visual check: Disclosure expands/collapses
- No accessibility errors in console

---

### 9. form-client-web-app/src/config/uppy-config.ts

**Risk Level**: 🟡 MEDIUM  
**Why**: Configuration file  
**Changes**: Return types, import type fixes

**Failure Impact**:

- ⚠️ Uppy widget configuration broken
- ⚠️ Upload options wrong

**Testing Requirements**:

- Upload test with configured options
- Verify restrictions apply (file size, types)

---

## Low Risk Files (🟢 Lint + Type Check Only)

### 10-50. Test Files

**Risk Level**: 🟢 LOW  
**Why**: Test code, not production  
**Changes**: Relaxed rules, auto-fixes

**Failure Impact**: Tests might need updates

**Testing Requirements**:

```bash
pnpm test  # Run all tests
```

---

### Config Files

**Risk Level**: 🟢 LOW  
**Why**: Excluded from linting  
**Changes**: None (excluded)

**Testing Requirements**: Build succeeds

---

## Dependency Testing Matrix

| Component      | Depends On                     | Must Test Together           |
| -------------- | ------------------------------ | ---------------------------- |
| main.tsx       | FormioFileUploadModule         | ✅ Yes - E2E test            |
| UppyFileUpload | FileUploadProgress             | ✅ Yes - Upload + UI         |
| TusFileUpload  | magicNumbers, sanitizeFilename | ✅ Yes - Security chain      |
| FileIntegrity  | magicNumbers                   | ✅ Yes - Validation pipeline |

---

## Test Execution Order

### Phase 3A (After Auto-Fix + Config Changes)

```bash
# 1. Quick sanity
pnpm exec tsc --noEmit

# 2. Build test
pnpm run build

# 3. Run tests
pnpm test

# 4. Smoke test
cd form-client-web-app && pnpm run dev
# Manually: Upload one file, verify success
```

**Pass Criteria**: All pass ✅  
**Fail Action**: Rollback entire Phase 3A

---

### Phase 3B (After Security Audit)

```bash
# 1. Security-specific tests
cd packages/formio-file-upload
pnpm test -- magicNumbers.test
pnpm test -- sanitizeFilename.test
pnpm test -- fileIntegrity.test

# 2. Upload with malicious files
# Manual: Try uploading suspicious files
```

**Pass Criteria**: All security tests pass ✅  
**Fail Action**: Rollback security changes, re-audit

---

### Phase 3C (After Type Fixes)

```bash
# 1. Type check
pnpm exec tsc --noEmit

# 2. Component tests
cd packages/formio-file-upload
pnpm test -- Component.test

# 3. App integration
cd form-client-web-app
pnpm test -- formio-tus-integration.test

# 4. E2E full workflow
cd tests
pnpm test:e2e -- formio-submission.spec
pnpm test:e2e -- tus-upload.spec
```

**Pass Criteria**: All tests pass + manual upload works ✅  
**Fail Action**: Rollback specific file, re-fix more conservatively

---

### Phase 3D (Final Verification)

```bash
# Full regression suite
pnpm exec eslint . --max-warnings=999999  # <100 violations
pnpm exec tsc --noEmit                     # No type errors
pnpm run build                              # Build succeeds
pnpm test                                   # All unit tests
cd tests && pnpm test:e2e                  # All E2E tests

# Manual smoke test
cd form-client-web-app && pnpm run dev
# Test all upload scenarios:
# - Single file
# - Multiple files
# - Large file (>10MB)
# - Cancel upload
# - Resume upload
```

**Pass Criteria**: Everything passes + no console errors ✅  
**Fail Action**: Targeted rollback + fix

---

## Regression Test Suite

### Must-Pass Before Merge

**Unit Tests**:

```bash
✅ packages/formio-file-upload: pnpm test
✅ form-client-web-app: pnpm test
✅ tests: pnpm test (if any)
```

**Integration Tests**:

```bash
✅ form-client-web-app/tests/integration/formio-tus-integration.test.tsx
✅ form-client-web-app/tests/integration/tus-upload-flow.test.ts
```

**E2E Tests**:

```bash
✅ tests/e2e/formio-submission.spec.ts
✅ tests/e2e/tus-upload.spec.ts
✅ tests/e2e/bulk-upload.spec.ts (if exists)
```

**Manual Tests**:

1. ✅ App loads without errors
2. ✅ File upload component renders
3. ✅ Upload single file succeeds
4. ✅ Upload multiple files succeeds
5. ✅ Progress tracking works
6. ✅ Cancel upload works
7. ✅ Validation rejects bad files
8. ✅ No console errors or warnings

---

## Emergency Rollback Procedures

### Rollback Everything

```bash
git reset --hard <baseline-commit>
git clean -fd
pnpm install
```

### Rollback Specific Phase

```bash
# Rollback Phase 3C only
git revert <phase-3c-commit-hash>

# Or cherry-pick good commits
git checkout <baseline-commit> -- path/to/file.ts
```

### Partial Rollback

```bash
# Keep config changes, rollback code changes
git checkout HEAD~1 -- packages/formio-file-upload/src/**/*.ts
# But keep:
git checkout HEAD -- packages/formio-file-upload/src/types/formio.d.ts
```

---

## Risk-Benefit Analysis

| Phase        | Risk        | Benefit        | Worth It?            |
| ------------ | ----------- | -------------- | -------------------- |
| 3A: Auto-fix | 🟢 Very Low | 93% reduction  | ✅ Absolutely        |
| 3B: Security | 🟢 Low      | Audit complete | ✅ Yes               |
| 3C: Types    | 🟡 Medium   | Type safety    | ✅ Yes, with testing |
| 3D: Quality  | 🟡 Medium   | Cleaner code   | ⚠️ Case-by-case      |

**Recommendation**: Proceed with 3A-3C, evaluate 3D violations individually

---

## Success Criteria Summary

**Quantitative**:

- ✅ Violations: 8,300 → <100 (>98% reduction)
- ✅ Test Pass Rate: 100%
- ✅ Build Success: All packages build
- ✅ Type Errors: 0

**Qualitative**:

- ✅ No breaking changes to public API
- ✅ No regression in file upload functionality
- ✅ No new security vulnerabilities
- ✅ No performance degradation
- ✅ Documentation complete

---

**End of Risk Matrix**  
**Use**: Reference during Phase 3 execution for test planning
