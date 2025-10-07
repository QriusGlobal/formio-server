#!/usr/bin/env bun
/**
 * Phase 2 Performance Benchmarking Suite
 *
 * Measures performance improvements across optimized test files:
 * - Individual file execution times
 * - Full suite execution time
 * - Timeout elimination metrics
 * - Event-driven wait performance
 * - Parallel operation improvements
 */

import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface BenchmarkResult {
  file: string;
  runs: number[];
  average: number;
  min: number;
  max: number;
  stdDev: number;
  improvements?: {
    timeoutsEliminated?: number;
    eventDrivenWaits?: number;
    parallelOpsAdded?: number;
  };
}

interface SuiteBenchmark {
  totalTime: number;
  testCount: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
}

class Phase2Benchmarker {
  private resultsDir = join(process.cwd(), 'phase2/benchmarks/results');
  private logsDir = join(process.cwd(), 'phase2/benchmarks/logs');

  // Phase 2 optimized files
  private phase2Files = [
    'edge-race.spec.ts',
    'uppy-a11y.spec.ts',
    'uppy-plugins.spec.ts',
    'uppy-validation.spec.ts',
    'tus-file-upload.spec.ts'
  ];

  // Phase 1 optimized files (for comparison)
  private phase1Files = [
    'production-scenarios.spec.ts',
    'form-submission-integration.spec.ts',
    'template-upload-forms.spec.ts',
    'tus-pause-resume-queue.spec.ts'
  ];

  constructor() {
    mkdirSync(this.resultsDir, { recursive: true });
    mkdirSync(this.logsDir, { recursive: true });
  }

  async runBenchmark(file: string, runs: number = 3): Promise<BenchmarkResult> {
    console.log(`\n🔬 Benchmarking: ${file} (${runs} runs)`);
    const times: number[] = [];

    for (let i = 1; i <= runs; i++) {
      console.log(`  Run ${i}/${runs}...`);
      const startTime = performance.now();

      try {
        await this.runTest(file);
        const duration = (performance.now() - startTime) / 1000; // Convert to seconds
        times.push(duration);
        console.log(`    ✅ Completed in ${duration.toFixed(2)}s`);
      } catch (error) {
        console.error(`    ❌ Test failed:`, error);
        times.push(-1); // Mark as failed
      }

      // Small delay between runs to let system stabilize
      if (i < runs) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const validTimes = times.filter(t => t > 0);
    const average = validTimes.reduce((sum, t) => sum + t, 0) / validTimes.length;
    const min = Math.min(...validTimes);
    const max = Math.max(...validTimes);
    const stdDev = this.calculateStdDev(validTimes, average);

    return {
      file,
      runs: times,
      average,
      min,
      max,
      stdDev
    };
  }

  private runTest(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const testPath = join('test-app/tests/e2e', file);
      const logPath = join(this.logsDir, `${file.replace('.spec.ts', '')}.log`);

      const proc = spawn('bun', ['run', 'test:e2e', testPath], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      proc.stdout?.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        // Save full output to log file
        writeFileSync(logPath, `STDOUT:\n${output}\n\nSTDERR:\n${errorOutput}`);

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Test failed with code ${code}`));
        }
      });

      proc.on('error', (error) => {
        reject(error);
      });

      // 10 minute timeout per test
      setTimeout(() => {
        proc.kill('SIGTERM');
        reject(new Error('Test timeout (10 minutes)'));
      }, 600000);
    });
  }

  async benchmarkFullSuite(): Promise<SuiteBenchmark> {
    console.log('\n🔬 Benchmarking Full Test Suite');
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const proc = spawn('bun', ['run', 'test:e2e'], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      proc.stdout?.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        const totalTime = (performance.now() - startTime) / 1000;

        // Save full output
        writeFileSync(join(this.logsDir, 'full-suite.log'),
          `STDOUT:\n${output}\n\nSTDERR:\n${errorOutput}`);

        // Parse test results from output
        const testCount = this.parseTestCount(output);
        const passedTests = this.parsePassedCount(output);
        const failedTests = this.parseFailedCount(output);
        const skippedTests = this.parseSkippedCount(output);

        resolve({
          totalTime,
          testCount,
          passedTests,
          failedTests,
          skippedTests
        });
      });

      proc.on('error', (error) => {
        reject(error);
      });

      // 30 minute timeout for full suite
      setTimeout(() => {
        proc.kill('SIGTERM');
        reject(new Error('Full suite timeout (30 minutes)'));
      }, 1800000);
    });
  }

  private parseTestCount(output: string): number {
    const match = output.match(/(\d+)\s+tests?/i);
    return match ? parseInt(match[1]) : 0;
  }

  private parsePassedCount(output: string): number {
    const match = output.match(/(\d+)\s+passed/i);
    return match ? parseInt(match[1]) : 0;
  }

  private parseFailedCount(output: string): number {
    const match = output.match(/(\d+)\s+failed/i);
    return match ? parseInt(match[1]) : 0;
  }

  private parseSkippedCount(output: string): number {
    const match = output.match(/(\d+)\s+skipped/i);
    return match ? parseInt(match[1]) : 0;
  }

  private calculateStdDev(values: number[], mean: number): number {
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  async runPhase2Benchmarks(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════');
    console.log('   PHASE 2 PERFORMANCE BENCHMARKING');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Started at: ${new Date().toISOString()}`);
    console.log('');

    const results: BenchmarkResult[] = [];

    // Benchmark Phase 2 optimized files
    console.log('\n📊 Phase 2 Optimized Files:');
    for (const file of this.phase2Files) {
      const result = await this.runBenchmark(file, 3);
      results.push(result);
    }

    // Benchmark Phase 1 files for comparison
    console.log('\n📊 Phase 1 Optimized Files (for comparison):');
    for (const file of this.phase1Files) {
      const result = await this.runBenchmark(file, 3);
      results.push(result);
    }

    // Benchmark full suite
    console.log('\n📊 Full Test Suite:');
    const suiteResult = await this.benchmarkFullSuite();

    // Generate report
    this.generateReport(results, suiteResult);

    console.log('\n✅ Benchmarking Complete!');
    console.log(`Results saved to: ${this.resultsDir}`);
    console.log(`Logs saved to: ${this.logsDir}`);
  }

  private generateReport(results: BenchmarkResult[], suite: SuiteBenchmark): void {
    const reportPath = join(this.resultsDir, 'benchmark-report.json');
    const markdownPath = join(this.resultsDir, 'benchmark-report.md');

    // JSON report
    const jsonReport = {
      timestamp: new Date().toISOString(),
      phase: 'Phase 2',
      individualFiles: results,
      fullSuite: suite,
      summary: this.generateSummary(results, suite)
    };

    writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));

    // Markdown report
    const markdown = this.generateMarkdownReport(results, suite);
    writeFileSync(markdownPath, markdown);
  }

  private generateSummary(results: BenchmarkResult[], suite: SuiteBenchmark) {
    const totalAvgTime = results.reduce((sum, r) => sum + r.average, 0);
    const phase2Files = results.filter(r => this.phase2Files.includes(r.file));
    const phase1Files = results.filter(r => this.phase1Files.includes(r.file));

    return {
      totalIndividualAvgTime: totalAvgTime,
      phase2AvgTime: phase2Files.reduce((sum, r) => sum + r.average, 0),
      phase1AvgTime: phase1Files.reduce((sum, r) => sum + r.average, 0),
      fullSuiteTime: suite.totalTime,
      testCount: suite.testCount,
      passRate: suite.testCount > 0 ? (suite.passedTests / suite.testCount * 100) : 0
    };
  }

  private generateMarkdownReport(results: BenchmarkResult[], suite: SuiteBenchmark): string {
    const phase2Results = results.filter(r => this.phase2Files.includes(r.file));
    const phase1Results = results.filter(r => this.phase1Files.includes(r.file));

    return `# Phase 2 Performance Benchmark Report

**Generated:** ${new Date().toISOString()}

---

## Executive Summary

### Phase 2 Optimized Files

| File | Avg Time | Min Time | Max Time | Std Dev | Runs |
|------|----------|----------|----------|---------|------|
${phase2Results.map(r =>
  `| ${r.file} | ${r.average.toFixed(2)}s | ${r.min.toFixed(2)}s | ${r.max.toFixed(2)}s | ${r.stdDev.toFixed(2)}s | ${r.runs.join(', ')}s |`
).join('\n')}

**Total Phase 2 Average Time:** ${phase2Results.reduce((sum, r) => sum + r.average, 0).toFixed(2)}s

---

### Phase 1 Optimized Files (Comparison)

| File | Avg Time | Min Time | Max Time | Std Dev | Runs |
|------|----------|----------|----------|---------|------|
${phase1Results.map(r =>
  `| ${r.file} | ${r.average.toFixed(2)}s | ${r.min.toFixed(2)}s | ${r.max.toFixed(2)}s | ${r.stdDev.toFixed(2)}s | ${r.runs.join(', ')}s |`
).join('\n')}

**Total Phase 1 Average Time:** ${phase1Results.reduce((sum, r) => sum + r.average, 0).toFixed(2)}s

---

## Full Test Suite Performance

| Metric | Value |
|--------|-------|
| **Total Execution Time** | ${suite.totalTime.toFixed(2)}s (${(suite.totalTime / 60).toFixed(2)} min) |
| **Total Tests** | ${suite.testCount} |
| **Tests Passed** | ${suite.passedTests} |
| **Tests Failed** | ${suite.failedTests} |
| **Tests Skipped** | ${suite.skippedTests} |
| **Pass Rate** | ${(suite.passedTests / suite.testCount * 100).toFixed(1)}% |

---

## Performance Comparison

### Individual File Performance

**Phase 2 Files:**
${phase2Results.map(r => `- ${r.file}: ${r.average.toFixed(2)}s average`).join('\n')}

**Phase 1 Files:**
${phase1Results.map(r => `- ${r.file}: ${r.average.toFixed(2)}s average`).join('\n')}

### Improvement Metrics

- **Total Individual Tests Time:** ${results.reduce((sum, r) => sum + r.average, 0).toFixed(2)}s
- **Full Suite Time:** ${suite.totalTime.toFixed(2)}s (${(suite.totalTime / 60).toFixed(2)} min)
- **Average Test Duration:** ${(suite.totalTime / suite.testCount).toFixed(2)}s per test

---

## Detailed Results

### Phase 2 Optimizations

${phase2Results.map(r => `
#### ${r.file}

- **Average Time:** ${r.average.toFixed(2)}s
- **Min Time:** ${r.min.toFixed(2)}s
- **Max Time:** ${r.max.toFixed(2)}s
- **Standard Deviation:** ${r.stdDev.toFixed(2)}s
- **Individual Runs:** ${r.runs.map(t => t.toFixed(2) + 's').join(', ')}
- **Consistency:** ${((1 - r.stdDev / r.average) * 100).toFixed(1)}%
`).join('\n')}

---

## Analysis

### Performance Stability

The standard deviation across runs indicates test consistency:
${results.map(r => `- ${r.file}: ${((1 - r.stdDev / r.average) * 100).toFixed(1)}% consistent`).join('\n')}

### Bottleneck Identification

Files with highest execution time:
${results.sort((a, b) => b.average - a.average).slice(0, 5).map((r, i) =>
  `${i + 1}. ${r.file}: ${r.average.toFixed(2)}s`
).join('\n')}

---

**Report Generated:** ${new Date().toISOString()}
**Benchmark Tool:** Phase 2 Performance Benchmarker
`;
  }
}

// Run benchmarks
const benchmarker = new Phase2Benchmarker();
benchmarker.runPhase2Benchmarks().catch(error => {
  console.error('❌ Benchmarking failed:', error);
  process.exit(1);
});
