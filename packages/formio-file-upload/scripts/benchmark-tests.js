#!/usr/bin/env node
/**
 * Benchmark script for comparing test execution performance
 *
 * Measures test execution time before and after optimizations
 * to validate 65-75% speedup target for BUG-CRIT-001
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const RUNS = 5; // Number of test runs for averaging
const TARGET_SPEEDUP = 0.65; // 65% minimum speedup target

/**
 * Run tests and measure execution time
 */
function runTestBenchmark(label, jestConfig = null) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏃 Running benchmark: ${label}`);
  console.log('='.repeat(60));

  const times = [];

  for (let i = 1; i <= RUNS; i++) {
    console.log(`\n📊 Run ${i}/${RUNS}...`);

    const startTime = Date.now();

    try {
      const cmd = jestConfig
        ? `jest --config=${jestConfig} --silent --no-coverage`
        : 'jest --silent --no-coverage';

      execSync(cmd, {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      const duration = Date.now() - startTime;
      times.push(duration);
      console.log(`   ✅ Completed in ${(duration / 1000).toFixed(2)}s`);

    } catch (error) {
      console.error(`   ❌ Test run failed:`, error.message);
      times.push(null);
    }
  }

  const validTimes = times.filter(t => t !== null);
  const avgTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
  const minTime = Math.min(...validTimes);
  const maxTime = Math.max(...validTimes);

  console.log(`\n📈 Results for ${label}:`);
  console.log(`   Average: ${(avgTime / 1000).toFixed(2)}s`);
  console.log(`   Min:     ${(minTime / 1000).toFixed(2)}s`);
  console.log(`   Max:     ${(maxTime / 1000).toFixed(2)}s`);
  console.log(`   Std Dev: ${(calculateStdDev(validTimes) / 1000).toFixed(2)}s`);

  return {
    label,
    avgTime,
    minTime,
    maxTime,
    times: validTimes,
    stdDev: calculateStdDev(validTimes)
  };
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
}

/**
 * Compare benchmarks and calculate improvement
 */
function compareBenchmarks(baseline, optimized) {
  const speedup = (baseline.avgTime - optimized.avgTime) / baseline.avgTime;
  const speedupPercent = speedup * 100;

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 BENCHMARK COMPARISON');
  console.log('='.repeat(60));
  console.log(`\nBaseline:  ${(baseline.avgTime / 1000).toFixed(2)}s`);
  console.log(`Optimized: ${(optimized.avgTime / 1000).toFixed(2)}s`);
  console.log(`\nSpeedup:   ${speedupPercent.toFixed(1)}% faster`);
  console.log(`Time saved: ${((baseline.avgTime - optimized.avgTime) / 1000).toFixed(2)}s`);

  if (speedup >= TARGET_SPEEDUP) {
    console.log(`\n✅ SUCCESS: Exceeded ${(TARGET_SPEEDUP * 100).toFixed(0)}% speedup target!`);
  } else {
    console.log(`\n⚠️  WARNING: Did not meet ${(TARGET_SPEEDUP * 100).toFixed(0)}% speedup target.`);
    console.log(`   Need ${((TARGET_SPEEDUP - speedup) * 100).toFixed(1)}% more improvement.`);
  }

  return {
    baseline,
    optimized,
    speedup,
    speedupPercent,
    targetMet: speedup >= TARGET_SPEEDUP
  };
}

/**
 * Save benchmark results to file
 */
function saveBenchmarkResults(results) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    results,
    metadata: {
      runs: RUNS,
      targetSpeedup: TARGET_SPEEDUP,
      platform: process.platform,
      nodeVersion: process.version
    }
  };

  const filename = `benchmark-results-${Date.now()}.json`;
  writeFileSync(filename, JSON.stringify(report, null, 2));
  console.log(`\n💾 Results saved to: ${filename}`);

  return filename;
}

/**
 * Main benchmark execution
 */
async function main() {
  console.log('🎯 Test Performance Benchmark');
  console.log('================================\n');
  console.log(`Target: ${(TARGET_SPEEDUP * 100).toFixed(0)}% speedup`);
  console.log(`Runs per configuration: ${RUNS}\n`);

  // Run baseline tests (current configuration)
  const baseline = runTestBenchmark('Baseline (Current Config)', 'jest.config.js');

  // Run optimized tests (parallel configuration)
  const optimized = runTestBenchmark('Optimized (Parallel Config)', 'jest.config.parallel.js');

  // Compare results
  const comparison = compareBenchmarks(baseline, optimized);

  // Save results
  saveBenchmarkResults(comparison);

  // Exit with appropriate code
  process.exit(comparison.targetMet ? 0 : 1);
}

// Run benchmark
main().catch(error => {
  console.error('❌ Benchmark failed:', error);
  process.exit(1);
});
