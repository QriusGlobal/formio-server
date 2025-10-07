#!/bin/bash
# Quick benchmark script for Phase 2 performance testing
# Runs individual Phase 2 optimized files and measures execution time

echo "═══════════════════════════════════════════════════════"
echo "   PHASE 2 QUICK BENCHMARK"
echo "═══════════════════════════════════════════════════════"
echo ""

RESULTS_DIR="phase2/benchmarks/results"
LOGS_DIR="phase2/benchmarks/logs"

mkdir -p "$RESULTS_DIR" "$LOGS_DIR"

# Phase 2 optimized files
PHASE2_FILES=(
  "edge-race.spec.ts"
  "uppy-a11y.spec.ts"
  "uppy-plugins.spec.ts"
  "uppy-validation.spec.ts"
  "tus-file-upload.spec.ts"
)

echo "📊 Benchmarking Phase 2 Optimized Files..."
echo ""

TOTAL_TIME=0

for file in "${PHASE2_FILES[@]}"; do
  echo "🔬 Testing: $file"

  START=$(date +%s.%N)

  if bun run test:e2e "test-app/tests/e2e/$file" > "$LOGS_DIR/${file%.spec.ts}.log" 2>&1; then
    END=$(date +%s.%N)
    DURATION=$(echo "$END - $START" | bc)
    TOTAL_TIME=$(echo "$TOTAL_TIME + $DURATION" | bc)

    echo "  ✅ Completed in ${DURATION}s"
    echo "$file,$DURATION" >> "$RESULTS_DIR/quick-results.csv"
  else
    echo "  ❌ Test failed (see logs)"
    echo "$file,FAILED" >> "$RESULTS_DIR/quick-results.csv"
  fi

  echo ""
done

echo "═══════════════════════════════════════════════════════"
echo "   BENCHMARK SUMMARY"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Total Phase 2 Execution Time: ${TOTAL_TIME}s"
echo ""
echo "Individual Results:"
cat "$RESULTS_DIR/quick-results.csv" | column -t -s ','
echo ""
echo "Results saved to: $RESULTS_DIR/quick-results.csv"
echo "Logs saved to: $LOGS_DIR/"
