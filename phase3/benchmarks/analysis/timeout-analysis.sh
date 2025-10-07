#!/bin/bash
# Comprehensive timeout analysis script

echo "=== E2E Test Suite Timeout Analysis ==="
echo ""
echo "## Files by Timeout Count (Descending)"
grep -r "waitForTimeout" test-app/tests/e2e/*.spec.ts | cut -d: -f1 | sort | uniq -c | sort -rn

echo ""
echo "## Total Timeouts: $(grep -r 'waitForTimeout' test-app/tests/e2e/*.spec.ts | wc -l | tr -d ' ')"

echo ""
echo "## Phase 1 Files (Already Optimized)"
for file in production-scenarios form-submission-integration template-upload-forms tus-pause-resume-queue; do
  count=$(grep -c "waitForTimeout" test-app/tests/e2e/${file}.spec.ts 2>/dev/null || echo "0")
  echo "  - ${file}.spec.ts: ${count} timeouts"
done

echo ""
echo "## Phase 3 Top Priority Files (13-10 timeouts)"
for file in uppy-multifile uppy-integration edge-browser edge-security edge-network edge-limits; do
  count=$(grep -c "waitForTimeout" test-app/tests/e2e/${file}.spec.ts 2>/dev/null || echo "0")
  echo "  - ${file}.spec.ts: ${count} timeouts"
done

echo ""
echo "## Medium Priority Files (9-7 timeouts)"
for file in uppy-comprehensive edge-large-files formio-integration; do
  count=$(grep -c "waitForTimeout" test-app/tests/e2e/${file}.spec.ts 2>/dev/null || echo "0")
  echo "  - ${file}.spec.ts: ${count} timeouts"
done

echo ""
echo "## Low Priority Files (<5 timeouts)"
for file in test-app/tests/e2e/*.spec.ts; do
  count=$(grep -c "waitForTimeout" "$file" 2>/dev/null || echo "0")
  filename=$(basename "$file")
  if [ "$count" -lt 5 ] && [ "$count" -gt 0 ]; then
    echo "  - ${filename}: ${count} timeouts"
  fi
done
