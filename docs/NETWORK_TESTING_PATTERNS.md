# Network Testing Patterns - Event-Driven Approach

## Overview
Event-driven patterns for testing network edge cases without waitForTimeout. These patterns provide faster, more reliable tests that validate actual network behavior.

## Core Patterns

### 1. Progress Change Detection

**Use Case:** Monitor upload progress during slow network conditions

```typescript
// Wait for progress to change from last known value
await page.waitForFunction(
  (lastProgress) => {
    const progressEl = document.querySelector('.progress-text');
    const currentText = progressEl?.textContent || '';
    const match = currentText.match(/(\d+)%/);
    const currentProgress = match ? parseInt(match[1]) : 0;
    return currentProgress !== lastProgress;
  },
  previousProgressValue,
  { timeout: 5000 }
);
```

**Pattern:** Race between progress change and completion
```typescript
await Promise.race([
  page.waitForFunction(
    (lastProgress) => /* progress changed */,
    lastProgress,
    { timeout: 3000 }
  ),
  page.locator('.upload-complete').waitFor({
    state: 'visible',
    timeout: 3000
  })
]);
```

### 2. Network State Detection

**Use Case:** Verify offline/online state changes

```typescript
// Wait for offline state
await page.waitForFunction(
  () => !navigator.onLine,
  { timeout: 2000 }
);

// Wait for online state
await page.waitForFunction(
  () => navigator.onLine,
  { timeout: 2000 }
);
```

### 3. Network Request Events

**Use Case:** Detect upload initiation or network activity

```typescript
// Wait for upload request to start
await page.waitForEvent('request', {
  predicate: (req) => req.url().includes('upload'),
  timeout: 5000
});

// Wait for request failure
await page.waitForEvent('requestfailed', {
  predicate: (req) => req.url().includes('upload'),
  timeout: 5000
});

// Wait for successful response
await page.waitForEvent('response', {
  predicate: (res) => res.url().includes('upload') && res.ok(),
  timeout: 5000
});
```

### 4. Retry Detection

**Use Case:** Verify retry logic and auto-resume behavior

```typescript
// Wait for retry indicator in Uppy UI
await page.waitForFunction(
  () => {
    const statusBar = document.querySelector('.uppy-StatusBar-statusPrimary');
    return statusBar?.textContent?.includes('Retry') || false;
  },
  { timeout: 5000 }
);

// Wait for retry to disappear (auto-resume)
await page.waitForFunction(
  () => {
    const retryBtn = document.querySelector('.uppy-StatusBar-statusPrimary:has-text("Retry")');
    const uploadProgress = document.querySelector('.uppy-StatusBar-progress');
    return !retryBtn || uploadProgress !== null;
  },
  { timeout: 5000 }
);
```

### 5. Batch Upload Completion

**Use Case:** Wait for multiple file uploads to complete or fail

```typescript
// Wait for all uploads to finish (success or failure)
const uploadCount = files.length;
await page.waitForFunction(
  (expectedCount) => {
    const completed = document.querySelectorAll('.upload-complete').length;
    const failed = document.querySelectorAll('.upload-error').length;
    return (completed + failed) >= expectedCount;
  },
  uploadCount,
  { timeout: 30000 }
);
```

### 6. Active Upload Detection

**Use Case:** Verify upload has actually started before testing interruption

```typescript
// Wait for progress to be greater than 0%
await page.waitForFunction(
  () => {
    const progressEl = document.querySelector('.progress-text');
    const text = progressEl?.textContent || '';
    const match = text.match(/(\d+)%/);
    return match && parseInt(match[1]) > 0;
  },
  { timeout: 5000 }
);
```

### 7. Network Condition Impact

**Use Case:** Verify network throttling affects upload speed

```typescript
// Capture initial progress
const initialProgress = await page.evaluate(() => {
  const progressEl = document.querySelector('.progress-text');
  const match = progressEl?.textContent?.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 0;
});

// Apply network throttling
await applyNetworkCondition(page, NETWORK_PRESETS.SLOW_3G);

// Wait for progress to continue despite throttling
await page.waitForFunction(
  (prevProgress) => {
    const progressEl = document.querySelector('.progress-text');
    const match = progressEl?.textContent?.match(/(\d+)%/);
    const currentProgress = match ? parseInt(match[1]) : 0;
    return currentProgress > prevProgress;
  },
  initialProgress,
  { timeout: 5000 }
);
```

## Network Simulation Utilities

### Available Network Presets

```typescript
export const NETWORK_PRESETS = {
  OFFLINE: {
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
  SLOW_3G: {
    downloadThroughput: 50 * 1024,   // 50 KB/s
    uploadThroughput: 50 * 1024,
    latency: 2000,                   // 2 seconds
  },
  FAST_3G: {
    downloadThroughput: 100 * 1024,  // 100 KB/s
    uploadThroughput: 100 * 1024,
    latency: 1000,
  },
  SLOW_4G: {
    downloadThroughput: 500 * 1024,  // 500 KB/s
    uploadThroughput: 500 * 1024,
    latency: 500,
  },
  WIFI: {
    downloadThroughput: 10 * 1024 * 1024, // 10 MB/s
    uploadThroughput: 10 * 1024 * 1024,
    latency: 20,
  },
};
```

### Network Failure Simulators

```typescript
// Packet loss (randomly fail 30% of requests)
const cleanup = await simulatePacketLoss(page, 0.3);
// ... test code ...
await cleanup();

// DNS failure
const cleanup = await simulateDNSFailure(page, /upload/);

// Connection timeout
const cleanup = await simulateTimeout(page, /upload/, 5000);

// Server unreachable
const cleanup = await simulateServerUnreachable(page, /upload/);

// Intermittent failures
const cleanup = await simulateIntermittentFailures(page, /upload/, 0.4);
```

## Complete Test Example

```typescript
test('should handle network interruption with retry', async ({ page }) => {
  // Setup network monitor
  const networkMonitor = new NetworkMonitor(page);

  // Start upload
  const fileInput = page.locator(UPPY_FILE_INPUT_SELECTOR);
  await fileInput.setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Test content'),
  });

  // Wait for upload to initiate (network event)
  await page.waitForEvent('request', {
    predicate: (req) => req.url().includes('upload'),
    timeout: 5000
  });

  // Go offline mid-upload
  await page.context().setOffline(true);

  // Wait for offline state detection
  await page.waitForFunction(
    () => !navigator.onLine,
    { timeout: 3000 }
  );

  // Should show retry indicator
  await expect(
    page.locator('.uppy-StatusBar-statusPrimary:has-text("Retry")')
  ).toBeVisible();

  // Go back online
  await page.context().setOffline(false);

  // Wait for auto-resume
  await page.waitForFunction(
    () => {
      const retryBtn = document.querySelector(
        '.uppy-StatusBar-statusPrimary:has-text("Retry")'
      );
      const uploadProgress = document.querySelector('.uppy-StatusBar-progress');
      return !retryBtn || uploadProgress !== null;
    },
    { timeout: 5000 }
  );

  // Should complete successfully
  const result = await waitForUploadCompletion(page, 30000);
  expect(result).toBe('success');

  // Verify retry attempts occurred
  const failedRequests = networkMonitor.getFailedRequests();
  expect(failedRequests.length).toBeGreaterThan(0);
});
```

## Anti-Patterns to Avoid

### ❌ Arbitrary Timeouts
```typescript
// BAD: No guarantee operation completed
await page.waitForTimeout(2000);
```

### ❌ Polling Without Exit Condition
```typescript
// BAD: Fixed iteration count, might miss completion
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(1000);
  if (condition) break;
}
```

### ❌ Hardcoded Delays
```typescript
// BAD: Network speed varies by environment
await page.waitForTimeout(5000); // "should be enough time"
```

## Best Practices

### ✅ Use Event-Driven Waits
```typescript
// GOOD: Wait for specific event
await page.waitForEvent('request', {
  predicate: (req) => req.url().includes('upload')
});
```

### ✅ Monitor Actual State Changes
```typescript
// GOOD: Wait for observable state change
await page.waitForFunction(
  () => !navigator.onLine
);
```

### ✅ Provide Reasonable Timeouts
```typescript
// GOOD: Safety timeout for event-driven wait
await page.waitForFunction(
  () => condition,
  { timeout: 5000 } // Fail if takes longer than expected
);
```

### ✅ Use Promise.race for Multiple Conditions
```typescript
// GOOD: Complete as soon as any condition is met
await Promise.race([
  page.waitForFunction(() => progressChanged),
  page.locator('.upload-complete').waitFor({ state: 'visible' })
]);
```

## Performance Benefits

### Traditional Approach
```typescript
// Total: 30 seconds minimum
await page.waitForTimeout(2000);  // 2s
await page.waitForTimeout(1000);  // 1s
await page.waitForTimeout(5000);  // 5s
await page.waitForTimeout(10000); // 10s
await page.waitForTimeout(3000);  // 3s
// ... more timeouts
```

### Event-Driven Approach
```typescript
// Total: Completes as soon as conditions are met
await page.waitForFunction(() => progressChanged);     // ~100ms
await page.waitForEvent('request', { predicate });     // ~50ms
await page.waitForFunction(() => !navigator.onLine);   // ~20ms
await page.waitForFunction(() => retryState);          // ~200ms
// ... faster overall
```

**Time Savings:** 60-80% reduction in test execution time

## Debugging Tips

### Enable Verbose Logging
```typescript
await page.waitForFunction(
  () => {
    const state = getCurrentState();
    console.log('Current state:', state); // Visible in browser console
    return state === 'expected';
  },
  { timeout: 5000 }
);
```

### Add Descriptive Error Messages
```typescript
try {
  await page.waitForFunction(() => condition, { timeout: 5000 });
} catch (error) {
  throw new Error(`Failed to detect network state change: ${error.message}`);
}
```

### Use NetworkMonitor for Request Tracking
```typescript
const networkMonitor = new NetworkMonitor(page);
// ... perform test actions ...
const uploadRequests = networkMonitor.getRequests(/upload/);
console.log('Upload requests:', uploadRequests.length);
console.log('Failed requests:', networkMonitor.getFailedRequests().length);
```

## Summary

Event-driven network testing provides:
- **Faster execution:** No arbitrary waits
- **Better reliability:** Validates actual behavior
- **Clearer intent:** Tests document what they're waiting for
- **Easier debugging:** Failures indicate what condition wasn't met

Always prefer event-driven waits over timeouts for network edge case testing.
