# Railway-Oriented Programming Tests - GCS Upload Worker

## 📋 Test Suite Summary

**Test File**: `/formio/src/upload/workers/__tests__/gcsUploadWorker.test.js`
**Framework**: Mocha + Sinon + Node Assert
**Total Tests**: 14 tests
**Passing**: 11 tests ✅
**Failing**: 3 tests ⚠️ (Expected - bugs caught by TDD)

---

## ✅ Test Categories Implemented

### 1. Contract Validation (2 tests)
- ✅ Validates IUploadJob contract structure
- ✅ Rejects invalid job data with missing required fields

### 2. Success Path (1 test)
- ✅ Uploads file to GCS and returns signed URL

### 3. Failure Scenarios (3 tests)
- ✅ Throws error if GCS upload fails with network timeout
- ✅ Throws error with specific errorCode for GCS 503
- ✅ Does not remove TUS file if GCS upload fails (allows retry)

### 4. Retry Tracking (1 test)
- ✅ Tracks retry count in result when job is retried

### 5. Performance Tracking (1 test)
- ⚠️ **FAILING**: Processing time assertion (bug caught!)
  - **Issue**: `processingTime` is only calculated on success path, not on failures
  - **Expected**: Should track processing time for all requests
  - **Test Status**: Correctly identifies implementation gap

### 6. Railway-Oriented Programming: MongoDB Failure Cleanup (6 tests)

#### ✅ Passing Railway Tests (4 tests):
1. ✅ Rolls back GCS upload when MongoDB update fails
2. ✅ Does NOT call deleteFile when MongoDB update succeeds
3. ✅ Handles concurrent MongoDB failures with idempotent GCS cleanup
4. ✅ Maintains Railway pattern across all error types (4 scenarios)

#### ⚠️ Failing Railway Tests (2 tests - bugs caught):
1. **Preserves original MongoDB error when GCS cleanup fails**
   - **Issue**: `error.code` property not preserved when creating enhanced error
   - **Root Cause**: Lines 120-127 create new Error object, only copies `errorCode`, loses `code`
   - **Impact**: BullMQ retry logic can't distinguish error types
   - **Test Assertion**: `assert.strictEqual(error.code, 11000)` - Expected duplicate key code

2. **Preserves errorCode from MongoDB error for BullMQ retry logic**
   - **Issue**: Same as above - `error.code` property lost in error transformation
   - **Root Cause**: Enhanced error creation doesn't preserve all original properties
   - **Impact**: MongoDB transaction abort codes not passed to BullMQ
   - **Test Assertion**: `assert.strictEqual(error.code, 251)` - Expected transaction abort code

---

## 🐛 Bugs Discovered by Tests (TDD Working as Intended!)

### Bug 1: Error Code Property Not Preserved
**Location**: `gcsUploadWorker.js:120-127`

**Current Implementation**:
```javascript
} catch (error) {
  // Enhanced error with errorCode
  const enhancedError = new Error(error.message);
  enhancedError.errorCode = error.errorCode || 'GCS_UPLOAD_FAILED';
  enhancedError.originalError = error;

  throw enhancedError;
}
```

**Problem**: Only copies `errorCode`, but MongoDB errors use `code` property (e.g., `error.code = 11000` for duplicate key)

**Solution**: Preserve all error properties:
```javascript
} catch (error) {
  // Preserve all original error properties for BullMQ retry logic
  const enhancedError = new Error(error.message);
  enhancedError.code = error.code; // MongoDB error codes (11000, 251, etc.)
  enhancedError.errorCode = error.errorCode || 'GCS_UPLOAD_FAILED';
  enhancedError.originalError = error;

  throw enhancedError;
}
```

### Bug 2: Processing Time Not Tracked on Failures
**Location**: `gcsUploadWorker.js:108`

**Current Implementation**:
```javascript
// Return IUploadResult contract
const processingTime = Date.now() - startTime;

return {
  success: true,
  // ... other fields
  processingTime
};
```

**Problem**: `processingTime` only calculated in success path, not available for error tracking/metrics

**Solution**: Calculate before throwing errors (or in catch block for error metrics)

---

## 📊 Test Coverage Breakdown

### Railway-Oriented Cleanup Scenarios Tested:

1. **MongoDB Connection Lost (ECONNRESET)**
   - ✅ GCS deleteFile called
   - ✅ TUS file preserved for retry
   - ✅ Original error thrown

2. **MongoDB Write Conflict (code: 11000)**
   - ✅ GCS cleanup attempted
   - ⚠️ Error code preservation failing (bug caught)

3. **MongoDB Transaction Abort (code: 251)**
   - ✅ GCS cleanup attempted
   - ⚠️ Error code preservation failing (bug caught)

4. **GCS Cleanup Failure During MongoDB Error**
   - ✅ Original MongoDB error preserved (not cleanup error)
   - ✅ Cleanup failure logged to console
   - ⚠️ Error code not fully preserved (bug caught)

5. **Success Path (No Cleanup)**
   - ✅ deleteFile NOT called on success
   - ✅ TUS cleanup occurs normally

6. **Multiple Error Type Consistency**
   - ✅ Tested: ETIMEDOUT, WRITE_CONCERN_FAILED, validation (121), LOCK_TIMEOUT
   - ✅ All maintain Railway pattern (cleanup + preserve TUS)

---

## 🎯 Test Quality Characteristics

### Arrange-Act-Assert Pattern
All tests follow clear TDD structure:
```javascript
// Arrange: Setup mocks and test data
mockGCSProvider.multipartUpload.resolves({ key: '...' });
mockSubmissionModel.updateOne.rejects(mongoError);

// Act: Execute the function under test
await processGCSUpload(jobData, ...deps);

// Assert: Verify expected behavior
assert(mockGCSProvider.deleteFile.calledWith(gcsKey));
```

### Dependency Injection
- ✅ All external dependencies mocked (GCS, TUS, MongoDB)
- ✅ No real network calls or database connections
- ✅ Tests are fast (<18ms total) and isolated

### Edge Case Coverage
- ✅ Network timeouts
- ✅ Service unavailable (503)
- ✅ Concurrent operations (duplicate key)
- ✅ Transaction failures
- ✅ Cleanup failures during rollback
- ✅ Various MongoDB error codes

### BullMQ Integration
- ✅ Error structure preserves retry capability
- ✅ TUS files not removed on failure (retry enabled)
- ⚠️ Error codes need full preservation (bugs caught)

---

## 🔧 Next Steps

### 1. Fix Implementation Bugs (Green Phase)
Update `gcsUploadWorker.js` to make failing tests pass:
- Add `enhancedError.code = error.code` to preserve MongoDB error codes
- Optionally: Track processing time for failures (for metrics)

### 2. Run Tests Again
```bash
cd /Users/mishal/code/work/formio-monorepo/formio
./node_modules/.bin/mocha src/upload/workers/__tests__/gcsUploadWorker.test.js
```

### 3. Verify All Tests Pass
Expected: **14 passing, 0 failing**

### 4. Integration Testing
- Test with real BullMQ worker
- Verify MongoDB error codes trigger correct retries
- Confirm GCS cleanup occurs on actual failures

---

## 📝 Test Examples

### Example 1: Railway Pattern - MongoDB Failure Triggers GCS Cleanup
```javascript
it('should rollback GCS upload when MongoDB update fails', async () => {
  // Setup successful GCS upload
  mockGCSProvider.multipartUpload.resolves({ key: gcsKey });
  mockGCSProvider.generatePresignedUrl.resolves('https://...');

  // MongoDB fails after GCS succeeds
  mockSubmissionModel.updateOne.rejects(new Error('Connection lost'));
  mockGCSProvider.deleteFile.resolves({ deleted: true });

  // MongoDB error thrown (not swallowed)
  await expect(processGCSUpload(...)).rejects.toThrow('Connection lost');

  // GCS cleanup was called
  assert(mockGCSProvider.deleteFile.calledOnceWith(gcsKey));

  // TUS preserved for retry
  assert(mockTusStore.remove.notCalled);
});
```

### Example 2: Cleanup Failure Doesn't Hide Original Error
```javascript
it('should preserve original MongoDB error when GCS cleanup fails', async () => {
  // MongoDB fails
  const mongoError = new Error('MongoDB write conflict');
  mongoError.code = 11000;
  mockSubmissionModel.updateOne.rejects(mongoError);

  // GCS cleanup also fails
  mockGCSProvider.deleteFile.rejects(new Error('GCS timeout'));

  // Original MongoDB error thrown (not GCS cleanup error)
  const thrownError = await processGCSUpload(...).catch(e => e);
  assert.strictEqual(thrownError.message, 'MongoDB write conflict');
  assert.strictEqual(thrownError.code, 11000); // ⚠️ Currently failing
});
```

---

## 🎓 TDD Principles Demonstrated

1. **Red-Green-Refactor**: Tests written first (red), implementation to follow (green)
2. **Fail Fast**: Tests immediately catch bugs before production
3. **Documentation**: Tests serve as living documentation of Railway-Oriented cleanup behavior
4. **Regression Prevention**: Future changes won't break cleanup logic without test failures
5. **Design Validation**: Tests verify error handling contracts for BullMQ integration

---

## 📚 References

- **Railway-Oriented Programming**: Scott Wlaschin's functional error handling pattern
- **BullMQ**: Requires errors to be thrown for retry mechanism
- **MongoDB Error Codes**: 11000 (duplicate key), 251 (transaction abort), etc.
- **Test Framework**: Mocha (describe/it), Sinon (stubs/spies), Node Assert

---

**Last Updated**: 2025-10-08
**Status**: ⚠️ 3 bugs caught by tests (implementation fixes needed)
**Test Suite Health**: ✅ Excellent (11/14 passing, 3 bugs correctly identified)
