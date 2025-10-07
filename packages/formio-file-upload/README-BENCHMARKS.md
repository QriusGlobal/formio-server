# Performance Benchmarks

## Quick Start

Run the comprehensive performance benchmark:

```bash
npm run benchmark
# or
node scripts/benchmark.js
```

## What Gets Measured

1. **Build Performance** - Measures rollup build time
2. **Test Execution** - Measures test suite runtime
3. **Bundle Sizes** - Analyzes all output formats (ES, CJS, UMD)
4. **Security Overhead** - Benchmarks magic number checks and filename sanitization

## Results

See detailed results in:
- `docs/PERFORMANCE_CERTIFICATION_REPORT.md` - Full analysis
- `docs/PERFORMANCE_SUMMARY.md` - Quick reference
- `docs/PERFORMANCE_BENCHMARK_REPORT.json` - Raw data

## Targets

- Build time: <30 seconds ✅ (actual: 4.71s)
- Test time: <5 seconds ✅ (actual: 1.53s)
- Magic number check: <5ms ✅ (actual: 0.0002ms)
- Filename sanitization: <1ms ✅ (actual: 0.0004ms)

## Package Script

Add to `package.json`:

```json
{
  "scripts": {
    "benchmark": "node scripts/benchmark.js"
  }
}
```
