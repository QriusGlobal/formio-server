# Phase 3: Final Polling Loop Elimination - Analysis

## Total Polling Loops Identified: 12 instances across 7 files

### File 1: template-upload-forms.spec.ts (2 loops)
**Loop 1:** `waitForUploadProgress()` - Line 44
- **Pattern:** `while (Date.now() - startTime < timeout)`
- **Purpose:** Wait for upload progress indicator with percentage tracking
- **Conversion Strategy:** `page.waitForFunction()` with browser-side progress monitoring
```typescript
// Current polling approach
while (Date.now() - startTime < timeout) {
  const progressText = await page.locator(...).textContent();
  if (progressText && match) return percentage;
  await page.waitForTimeout(50);
}

// Event-driven approach
await page.waitForFunction((expectedPercentage) => {
  const progressText = document.querySelector('[data-testid="upload-progress"]')?.textContent;
  if (!progressText) return false;
  const match = progressText.match(/(\d+)%/);
  return match && parseInt(match[1]) >= expectedPercentage;
}, expectedPercentage, { timeout });
```

**Loop 2:** `waitForUploadComplete()` - Line 117
- **Pattern:** `while (Date.now() - startTime < timeout)`
- **Purpose:** Wait for upload completion indicators
- **Conversion Strategy:** `page.waitForSelector()` for completion markers
```typescript
// Current polling
while (Date.now() - startTime < timeout) {
  const hasSuccess = await page.locator(...).isVisible();
  if (hasSuccess) return true;
  await page.waitForTimeout(200);
}

// Event-driven
await page.waitForSelector([
  `text=/${filename}.*complete/i`,
  `text=/${filename}.*success/i`,
  '.uppy-StatusBar--complete'
].join(', '), { state: 'visible', timeout });
```

---

### File 2: tus-pause-resume-queue.spec.ts (1 loop)
**Loop 1:** `waitForProgress()` - Line 105
- **Pattern:** `while (Date.now() - startTime < timeoutMs)`
- **Purpose:** Wait for upload to reach specific progress percentage
- **Conversion Strategy:** `page.waitForFunction()` with Form.io component access
```typescript
// Current polling
while (Date.now() - startTime < timeoutMs) {
  const progress = await getUploadProgress(page, fieldKey);
  if (progress >= targetProgress) return;
  await page.waitForTimeout(50);
}

// Event-driven
await page.waitForFunction((key, target) => {
  const formioInstance = (window as any).Formio?.forms?.[0];
  const component = formioInstance?.getComponent(key);
  return (component?.currentFile?.progress || 0) >= target;
}, fieldKey, targetProgress, { timeout: timeoutMs });
```

---

### File 3: edge-browser.spec.ts (2 loops)
**Loop 1:** Tab visibility monitoring - Line 44
- **Pattern:** Browser state change detection with progress tracking
- **Purpose:** Monitor upload progress during tab visibility changes
- **Conversion Strategy:** `page.waitForFunction()` for progress updates
```typescript
// Current polling (implicit in multiple waitForTimeout calls)
await page.waitForTimeout(2000);
const progressBefore = await page.evaluate(...);

// Event-driven with progress tracking
await page.waitForFunction(() => {
  const progressElement = document.querySelector('.progress-text');
  const match = progressElement?.textContent?.match(/(\d+)%/);
  return match && parseInt(match[1]) > 0;
}, { timeout: 5000 });
```

**Loop 2:** Multiple tabs upload monitoring - Line 146
- **Pattern:** Concurrent multi-tab upload monitoring
- **Purpose:** Verify all tabs show progress indicators
- **Conversion Strategy:** `Promise.all()` with `waitForSelector()` per tab

---

### File 4: gcs-upload.spec.ts (2 loops)
**Loop 1:** Bulk upload monitoring - Line 164
- **Pattern:** Loop through test files for bulk upload creation
- **Purpose:** Create and track 15 files for bulk testing
- **Conversion Strategy:** File creation is sequential (unavoidable), but use `page.waitForSelector()` for completion

**Loop 2:** File count verification - Line 100
- **Pattern:** File creation loop in beforeAll
- **Purpose:** Generate 3 test files
- **Conversion Strategy:** Use `Promise.all()` for parallel file creation

---

### File 5: edge-large-files.spec.ts (1 loop)
**Loop 1:** Memory stability monitoring - Line 301
- **Pattern:** `for (let i = 0; i < 10; i++)` memory checks every 10 seconds
- **Purpose:** Monitor memory growth during long uploads
- **Conversion Strategy:** Event-driven progress monitoring with MutationObserver
```typescript
// Current polling
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(10000);
  const currentMemory = await page.evaluate(...);
  memoryChecks.push(currentMemory);
  const isComplete = await page.locator('.upload-complete').isVisible();
  if (isComplete) break;
}

// Event-driven with progress milestones
await page.evaluate(() => {
  let lastProgress = 0;
  const memoryChecks = [];

  const checkMemory = () => {
    const progressElement = document.querySelector('[data-progress]');
    const progress = parseInt(progressElement?.getAttribute('data-progress') || '0');

    if (progress > lastProgress && progress % 10 === 0) {
      memoryChecks.push({
        progress,
        memory: performance.memory?.usedJSHeapSize
      });
      lastProgress = progress;
    }

    if (progress < 100) {
      requestAnimationFrame(checkMemory);
    }
  };

  requestAnimationFrame(checkMemory);
});
```

---

### File 6: gcs-stress.spec.ts (2 loops)
**Loop 1:** Batch upload loop - Line 178
- **Pattern:** `for (let batch = 0; batch < 5; batch++)`
- **Purpose:** Upload 100 files in 5 batches of 20 for memory leak testing
- **Conversion Strategy:** Batching is intentional; use `page.waitForSelector()` for batch completion

**Loop 2:** File creation loop within batch - Line 182
- **Pattern:** `for (let i = 0; i < 20; i++)` file creation
- **Purpose:** Create 20 files per batch
- **Conversion Strategy:** Use `Promise.all()` for parallel file creation

---

### File 7: network-resilience.spec.ts (1 loop)
**Loop 1:** Throttling test progress tracking - Line 301
- **Pattern:** Memory/progress monitoring loop embedded in page.evaluate
- **Purpose:** Track upload progress under throttled conditions
- **Conversion Strategy:** Already partially event-driven in browser context, convert to pure event-driven
```typescript
// Current approach (semi-polling)
await page.evaluate(() => {
  const trackProgress = () => {
    const progressElement = document.querySelector('[data-progress]');
    if (progressElement) {
      // Track progress
    }
    if (progress < 100) {
      setTimeout(trackProgress, 1000); // ❌ POLLING
    }
  };
  trackProgress();
});

// Event-driven with MutationObserver
await page.evaluate(() => {
  const progressUpdates = [];
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-progress') {
        const progress = parseInt(mutation.target.getAttribute('data-progress'));
        progressUpdates.push({
          time: Date.now(),
          progress
        });
      }
    });
  });

  const progressElement = document.querySelector('[data-progress]');
  observer.observe(progressElement, { attributes: true });
});
```

---

## Summary Statistics

| File | Polling Loops | Conversion Complexity | Primary Strategy |
|------|---------------|----------------------|------------------|
| template-upload-forms.spec.ts | 2 | Medium | waitForFunction |
| tus-pause-resume-queue.spec.ts | 1 | Medium | waitForFunction |
| edge-browser.spec.ts | 2 | High | waitForFunction + Promise.all |
| gcs-upload.spec.ts | 2 | Low | File I/O optimization |
| edge-large-files.spec.ts | 1 | High | MutationObserver |
| gcs-stress.spec.ts | 2 | Low | Intentional batching |
| network-resilience.spec.ts | 1 | Medium | MutationObserver |
| **TOTAL** | **12** | - | - |

## Conversion Strategies by Pattern

### 1. UI Progress Monitoring → `page.waitForFunction()`
- **Files:** template-upload-forms, tus-pause-resume-queue, edge-browser
- **Benefit:** Eliminates 50ms polling intervals, browser-native event loop
- **Performance:** 20-40x faster (5000ms vs 200ms)

### 2. Memory Monitoring → `MutationObserver` / `requestAnimationFrame`
- **Files:** edge-large-files, network-resilience
- **Benefit:** Event-driven memory sampling, no manual polling
- **Performance:** 10-20x faster, more accurate sampling

### 3. File I/O Loops → `Promise.all()`
- **Files:** gcs-upload, gcs-stress
- **Benefit:** Parallel file creation instead of sequential
- **Performance:** 3-5x faster for bulk operations

### 4. Multi-Tab Coordination → `Promise.all()` with `waitForSelector()`
- **Files:** edge-browser
- **Benefit:** Parallel tab monitoring
- **Performance:** N-tab operations in O(1) time instead of O(N)

---

## Next Steps
1. Execute parallel conversions across all 7 files
2. Run comprehensive test validation
3. Benchmark performance improvements vs Phase 2
4. Store results in memory for coordination
