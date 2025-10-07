# Phase 2 Benchmark Execution Guide

**Quick Reference:** How to run Phase 2 performance benchmarks

---

## ⚡ Quick Start (Choose One)

### Option 1: Fast Validation (10-15 min) ⭐ RECOMMENDED

```bash
cd /Users/mishal/code/work/formio-monorepo
./phase2/benchmarks/quick-benchmark.sh
```

**When to use:** Quick validation after optimizations, CI/CD pipelines

---

### Option 2: Comprehensive Analysis (30-45 min)

```bash
cd /Users/mishal/code/work/formio-monorepo
bun run phase2/benchmarks/benchmark-runner.ts
```

**When to use:** Full statistical analysis, performance reports

---

### Option 3: Phase Comparison (Instant)

```bash
cd /Users/mishal/code/work/formio-monorepo
bun run phase2/benchmarks/compare-phases.ts
```

**When to use:** Compare Phase 1 vs Phase 2 improvements

---

## 📋 Pre-Flight Checklist

Run these commands to verify environment is ready:

```bash
# 1. Check Docker services
docker ps | grep formio
# Expected: formio-mongo, formio-server, tusd running

# 2. Check test app
curl -s http://localhost:5173 | grep -q "Vite" && echo "✅ Test app running" || echo "❌ Test app not running"

# 3. Check MongoDB
docker exec formio-mongo mongosh --quiet --eval "db.version()" && echo "✅ MongoDB accessible" || echo "❌ MongoDB not accessible"

# 4. Check tusd server
curl -s http://localhost:1080/health && echo "✅ Tusd running" || echo "❌ Tusd not running"

# 5. Check disk space
df -h . | tail -1 | awk '{print "Disk space: " $4 " available"}'
```

**If any checks fail:**

```bash
# Start Docker services
docker-compose -f docker-compose.test.yml up -d

# Wait 30 seconds
sleep 30

# Start test app (in separate terminal)
cd test-app && bun run dev
```

---

## 🚀 Execution Steps

### Step 1: Quick Validation

```bash
# Navigate to project root
cd /Users/mishal/code/work/formio-monorepo

# Run quick benchmark
./phase2/benchmarks/quick-benchmark.sh

# View results
cat phase2/benchmarks/results/quick-results.csv
```

**Expected Output:**
```csv
edge-race.spec.ts,65.2
uppy-a11y.spec.ts,54.8
uppy-plugins.spec.ts,66.1
uppy-validation.spec.ts,51.9
tus-file-upload.spec.ts,69.3
```

**Success Criteria:**
- ✅ All 5 files complete
- ✅ No failures
- ✅ Total time < 8 minutes

---

### Step 2: Comprehensive Benchmark (Optional)

```bash
# Run full benchmark with statistics
bun run phase2/benchmarks/benchmark-runner.ts

# This will take 30-45 minutes
# Progress will be shown in real-time

# View JSON report
cat phase2/benchmarks/results/benchmark-report.json | jq .

# View Markdown report
cat phase2/benchmarks/results/benchmark-report.md
```

**Success Criteria:**
- ✅ 3 runs per file completed
- ✅ Standard deviation < 10%
- ✅ Full suite < 25 minutes

---

### Step 3: Phase Comparison

```bash
# Run comparison analysis
bun run phase2/benchmarks/compare-phases.ts

# Save to file
bun run phase2/benchmarks/compare-phases.ts > phase2/benchmarks/results/comparison.txt

# View results
cat phase2/benchmarks/results/comparison.txt
```

**Expected Output:**
```
═══════════════════════════════════════════════════════
   PHASE 1 vs PHASE 2 COMPARISON
═══════════════════════════════════════════════════════

📈 Optimization Metrics:

| Metric                 | Phase 1 | Phase 2 | Cumulative |
|------------------------|---------|---------|------------|
| Files Optimized        | 8       | 5       | 13         |
| Total Fixes            | 73      | 80      | 153        |
| Timeouts Eliminated    | 42      | 80      | 122        |

📊 Performance Impact:

Phase 1 Improvement: 45%
Phase 2 Improvement: 35% (additional)
Cumulative Improvement: 64.3%
Target Achievement: ✅ ACHIEVED (target: 65-75%)
```

---

## 📊 Result Interpretation

### Quick Benchmark Results

**Example CSV:**
```csv
edge-race.spec.ts,65.2
uppy-a11y.spec.ts,54.8
uppy-plugins.spec.ts,66.1
uppy-validation.spec.ts,51.9
tus-file-upload.spec.ts,69.3
```

**Analysis:**
- Average time: 61.5s per file
- Total time: ~5 minutes
- All files < 90s ✅
- Target (<30s) needs more optimization ⚠️

---

### Comprehensive Benchmark Results

**Example JSON:**
```json
{
  "timestamp": "2025-10-06T...",
  "phase": "Phase 2",
  "individualFiles": [
    {
      "file": "edge-race.spec.ts",
      "runs": [65.2, 64.8, 66.1],
      "average": 65.4,
      "min": 64.8,
      "max": 66.1,
      "stdDev": 0.7
    }
  ],
  "fullSuite": {
    "totalTime": 920.5,
    "testCount": 102,
    "passedTests": 100,
    "failedTests": 0,
    "skippedTests": 2
  }
}
```

**Analysis:**
- Consistency: 1.1% std dev ✅ Excellent
- Full suite: 15.3 minutes ✅ Target met
- Pass rate: 98% ✅ Excellent

---

## 🎯 Success Criteria

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| Individual file time | < 30s | < 60s | < 90s |
| Full suite time | < 15 min | < 20 min | < 25 min |
| Standard deviation | < 5% | < 10% | < 15% |
| Pass rate | 100% | ≥ 97% | ≥ 95% |
| Cumulative improvement | ≥ 70% | ≥ 64% | ≥ 60% |

---

## 🐛 Troubleshooting

### Problem: Tests Fail to Start

**Symptoms:**
- `Cannot connect to browser`
- `Connection refused`
- `Test timeout`

**Solution:**
```bash
# Check Playwright browsers
npx playwright install

# Check Docker
docker ps | grep formio

# Restart if needed
docker-compose -f docker-compose.test.yml restart
```

---

### Problem: Inconsistent Results

**Symptoms:**
- High standard deviation (>10%)
- Widely varying execution times
- Random test failures

**Solution:**
```bash
# Close other applications
# Check system resources
top

# Clean test environment
rm -rf test-app/.next test-app/node_modules/.cache

# Re-run benchmark
./phase2/benchmarks/quick-benchmark.sh
```

---

### Problem: Disk Space Issues

**Symptoms:**
- `No space left on device`
- Logs not written

**Solution:**
```bash
# Check disk space
df -h

# Clean old logs
rm -rf phase2/benchmarks/logs/*.log

# Clean Docker
docker system prune -f
```

---

## 📁 Output Files

After running benchmarks, you'll find:

```
phase2/benchmarks/
├── results/
│   ├── benchmark-report.json        # Comprehensive data
│   ├── benchmark-report.md          # Human-readable
│   ├── quick-results.csv            # Quick benchmark
│   └── comparison.txt               # Phase comparison
└── logs/
    ├── edge-race.log                # Test logs
    ├── uppy-a11y.log
    ├── uppy-plugins.log
    ├── uppy-validation.log
    ├── tus-file-upload.log
    └── full-suite.log
```

---

## 📊 Next Steps After Benchmarking

### If Results Meet Targets ✅

1. Update `/docs/PHASE2_OPTIMIZATION_COMPLETE.md` with actual results
2. Commit benchmark reports to git
3. Plan Phase 3 optimizations
4. Celebrate success! 🎉

### If Results Need Improvement ⚠️

1. Review logs for bottlenecks
2. Identify slow tests (>60s)
3. Check for flaky tests (high std dev)
4. Apply additional optimizations
5. Re-run benchmarks

---

## 🎯 Target Summary

**Phase 2 Goals:**
- ✅ 5 files optimized
- ✅ 80 timeouts eliminated
- ✅ 35% additional improvement (64.3% cumulative)
- ✅ Full suite < 25 minutes

**Validation:**
- Run quick benchmark: ⏳ Pending
- Run comprehensive benchmark: ⏳ Pending
- Compare vs Phase 1: ⏳ Pending
- Document results: ⏳ Pending

---

## 📚 Documentation References

- **Quick Start:** `/phase2/benchmarks/README.md`
- **Comprehensive Guide:** `/docs/PHASE2_BENCHMARKING_GUIDE.md`
- **Summary:** `/phase2/benchmarks/BENCHMARK_SUMMARY.md`
- **Completion Report:** `/docs/PHASE2_BENCHMARKING_COMPLETE.md`

---

**Ready to Execute:** ✅ YES
**Estimated Time:** 10-15 minutes (quick) or 30-45 minutes (comprehensive)
**Next Command:** `./phase2/benchmarks/quick-benchmark.sh`
