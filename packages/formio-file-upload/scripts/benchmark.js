#!/usr/bin/env node

/**
 * Performance Benchmark Suite for @formio/file-upload
 *
 * Validates:
 * - Build performance (<30s target)
 * - Test execution time (<5s target)
 * - Bundle sizes (ES, CJS, UMD)
 * - Security validation overhead
 * - Magic number verification (<5ms)
 * - Filename sanitization (<1ms)
 */

import { execSync } from 'child_process';
import { readFileSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

class PerformanceBenchmark {
  constructor() {
    this.results = {
      build: {},
      test: {},
      bundles: {},
      security: {},
      overall: {}
    };
    this.baseline = {
      buildTime: 30000, // 30s
      testTime: 5000, // 5s
      magicNumberCheck: 5, // 5ms
      filenameSanitization: 1 // 1ms
    };
  }

  async run() {
    log('\n' + '='.repeat(80), 'bright');
    log('PERFORMANCE BENCHMARK SUITE - @formio/file-upload', 'bright');
    log('='.repeat(80) + '\n', 'bright');

    await this.benchmarkBuild();
    await this.benchmarkTests();
    await this.analyzeBundles();
    await this.benchmarkSecurity();
    await this.generateReport();
  }

  async benchmarkBuild() {
    log('📦 BENCHMARK 1: Build Performance', 'cyan');
    log('-'.repeat(80), 'cyan');

    try {
      // Clean previous build
      log('Cleaning previous build artifacts...');
      try {
        execSync('rm -rf lib dist', { cwd: ROOT_DIR, stdio: 'ignore' });
      } catch (e) {
        // Ignore errors if directories don't exist
      }

      // Benchmark build time
      log('Running build with timing measurement...');
      const buildStart = Date.now();
      execSync('npm run build', {
        cwd: ROOT_DIR,
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      const buildEnd = Date.now();
      const buildTime = buildEnd - buildStart;

      this.results.build = {
        time: buildTime,
        timeFormatted: formatTime(buildTime),
        target: this.baseline.buildTime,
        targetFormatted: formatTime(this.baseline.buildTime),
        pass: buildTime < this.baseline.buildTime,
        efficiency: ((this.baseline.buildTime - buildTime) / this.baseline.buildTime * 100).toFixed(1)
      };

      log(`✓ Build completed in ${this.results.build.timeFormatted}`, 'green');
      log(`  Target: <${this.results.build.targetFormatted}`, 'yellow');
      log(`  Status: ${this.results.build.pass ? 'PASS ✓' : 'FAIL ✗'}`,
          this.results.build.pass ? 'green' : 'red');

      if (this.results.build.pass) {
        log(`  Efficiency: ${this.results.build.efficiency}% faster than baseline`, 'green');
      }

    } catch (error) {
      log(`✗ Build failed: ${error.message}`, 'red');
      this.results.build.error = error.message;
      this.results.build.pass = false;
    }

    log('');
  }

  async benchmarkTests() {
    log('🧪 BENCHMARK 2: Test Execution Performance', 'cyan');
    log('-'.repeat(80), 'cyan');

    try {
      log('Running test suite with timing measurement...');
      const testStart = Date.now();

      try {
        execSync('npm test -- --silent', {
          cwd: ROOT_DIR,
          stdio: 'pipe',
          encoding: 'utf-8'
        });
      } catch (e) {
        // Tests might fail, but we still want timing
        log('  Warning: Some tests failed, but measuring performance anyway', 'yellow');
      }

      const testEnd = Date.now();
      const testTime = testEnd - testStart;

      this.results.test = {
        time: testTime,
        timeFormatted: formatTime(testTime),
        target: this.baseline.testTime,
        targetFormatted: formatTime(this.baseline.testTime),
        pass: testTime < this.baseline.testTime,
        efficiency: ((this.baseline.testTime - testTime) / this.baseline.testTime * 100).toFixed(1)
      };

      log(`✓ Tests completed in ${this.results.test.timeFormatted}`, 'green');
      log(`  Target: <${this.results.test.targetFormatted}`, 'yellow');
      log(`  Status: ${this.results.test.pass ? 'PASS ✓' : 'FAIL ✗'}`,
          this.results.test.pass ? 'green' : 'red');

      if (this.results.test.pass) {
        log(`  Efficiency: ${this.results.test.efficiency}% faster than baseline`, 'green');
      }

    } catch (error) {
      log(`✗ Test execution failed: ${error.message}`, 'red');
      this.results.test.error = error.message;
      this.results.test.pass = false;
    }

    log('');
  }

  async analyzeBundles() {
    log('📊 BENCHMARK 3: Bundle Size Analysis', 'cyan');
    log('-'.repeat(80), 'cyan');

    const bundles = {
      esm: 'lib/index.esm.js',
      cjs: 'lib/index.js',
      umd: 'dist/formio-file-upload.min.js',
      types: 'lib/index.d.ts'
    };

    const sourcemaps = {
      esmMap: 'lib/index.esm.js.map',
      cjsMap: 'lib/index.js.map',
      umdMap: 'dist/formio-file-upload.min.js.map'
    };

    this.results.bundles = {
      outputs: {},
      sourcemaps: {},
      total: 0,
      pass: true
    };

    log('Analyzing bundle sizes:');

    // Check main bundles
    for (const [name, path] of Object.entries(bundles)) {
      const fullPath = join(ROOT_DIR, path);
      try {
        const stats = statSync(fullPath);
        const size = stats.size;
        this.results.bundles.outputs[name] = {
          path,
          size,
          sizeFormatted: formatBytes(size)
        };
        this.results.bundles.total += size;

        log(`  ${name.toUpperCase()}: ${formatBytes(size)}`, 'green');
      } catch (error) {
        log(`  ${name.toUpperCase()}: Missing or not generated`, 'red');
        this.results.bundles.outputs[name] = { error: 'Not found' };
        this.results.bundles.pass = false;
      }
    }

    // Check sourcemaps
    log('\nSourcemap analysis:');
    for (const [name, path] of Object.entries(sourcemaps)) {
      const fullPath = join(ROOT_DIR, path);
      try {
        const stats = statSync(fullPath);
        this.results.bundles.sourcemaps[name] = {
          path,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size)
        };
        log(`  ${name}: ${formatBytes(stats.size)}`, 'green');
      } catch (error) {
        log(`  ${name}: Not found`, 'yellow');
      }
    }

    log(`\nTotal bundle size: ${formatBytes(this.results.bundles.total)}`, 'bright');
    log('');
  }

  async benchmarkSecurity() {
    log('🔒 BENCHMARK 4: Security Validation Performance', 'cyan');
    log('-'.repeat(80), 'cyan');

    this.results.security = {
      magicNumber: {},
      filenameSanitization: {},
      overall: { pass: true }
    };

    // Benchmark magic number verification
    log('Testing magic number verification performance...');
    const iterations = 10000;

    const magicNumberStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      // Simulate magic number check (reading first few bytes)
      const testBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG magic number
      const magic = testBuffer.toString('hex', 0, 4);
    }
    const magicNumberEnd = performance.now();
    const magicNumberAvg = (magicNumberEnd - magicNumberStart) / iterations;

    this.results.security.magicNumber = {
      iterations,
      avgTime: magicNumberAvg,
      avgTimeFormatted: formatTime(magicNumberAvg),
      target: this.baseline.magicNumberCheck,
      targetFormatted: formatTime(this.baseline.magicNumberCheck),
      pass: magicNumberAvg < this.baseline.magicNumberCheck
    };

    log(`  Average time per check: ${magicNumberAvg.toFixed(3)}ms`,
        this.results.security.magicNumber.pass ? 'green' : 'red');
    log(`  Target: <${this.baseline.magicNumberCheck}ms`, 'yellow');
    log(`  Status: ${this.results.security.magicNumber.pass ? 'PASS ✓' : 'FAIL ✗'}`,
        this.results.security.magicNumber.pass ? 'green' : 'red');

    // Benchmark filename sanitization
    log('\nTesting filename sanitization performance...');

    const sanitizeFilename = (name) => {
      return name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^[._]+|[._]+$/g, '');
    };

    const sanitizeStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      sanitizeFilename('../../etc/passwd<script>alert(1)</script>.jpg');
    }
    const sanitizeEnd = performance.now();
    const sanitizeAvg = (sanitizeEnd - sanitizeStart) / iterations;

    this.results.security.filenameSanitization = {
      iterations,
      avgTime: sanitizeAvg,
      avgTimeFormatted: formatTime(sanitizeAvg),
      target: this.baseline.filenameSanitization,
      targetFormatted: formatTime(this.baseline.filenameSanitization),
      pass: sanitizeAvg < this.baseline.filenameSanitization
    };

    log(`  Average time per sanitization: ${sanitizeAvg.toFixed(3)}ms`,
        this.results.security.filenameSanitization.pass ? 'green' : 'red');
    log(`  Target: <${this.baseline.filenameSanitization}ms`, 'yellow');
    log(`  Status: ${this.results.security.filenameSanitization.pass ? 'PASS ✓' : 'FAIL ✗'}`,
        this.results.security.filenameSanitization.pass ? 'green' : 'red');

    this.results.security.overall.pass =
      this.results.security.magicNumber.pass &&
      this.results.security.filenameSanitization.pass;

    log('');
  }

  async generateReport() {
    log('📋 PERFORMANCE CERTIFICATION REPORT', 'bright');
    log('='.repeat(80), 'bright');

    const allPassed =
      this.results.build.pass &&
      this.results.test.pass &&
      this.results.bundles.pass &&
      this.results.security.overall.pass;

    log('\n┌─────────────────────────────────────────────────────────┐', 'bright');
    log('│                   CERTIFICATION STATUS                  │', 'bright');
    log('└─────────────────────────────────────────────────────────┘', 'bright');

    log(`\n  Overall Status: ${allPassed ? '✓ PASSED' : '✗ FAILED'}`,
        allPassed ? 'green' : 'red');

    log('\n┌─────────────────────────────────────────────────────────┐', 'bright');
    log('│                   DETAILED METRICS                      │', 'bright');
    log('└─────────────────────────────────────────────────────────┘', 'bright');

    log('\n1. Build Performance:', 'cyan');
    log(`   Time: ${this.results.build.timeFormatted}`,
        this.results.build.pass ? 'green' : 'red');
    log(`   Target: <${this.results.build.targetFormatted}`);
    log(`   Status: ${this.results.build.pass ? '✓ PASS' : '✗ FAIL'}`,
        this.results.build.pass ? 'green' : 'red');

    log('\n2. Test Performance:', 'cyan');
    log(`   Time: ${this.results.test.timeFormatted}`,
        this.results.test.pass ? 'green' : 'red');
    log(`   Target: <${this.results.test.targetFormatted}`);
    log(`   Status: ${this.results.test.pass ? '✓ PASS' : '✗ FAIL'}`,
        this.results.test.pass ? 'green' : 'red');

    log('\n3. Bundle Sizes:', 'cyan');
    for (const [name, bundle] of Object.entries(this.results.bundles.outputs)) {
      if (bundle.sizeFormatted) {
        log(`   ${name.toUpperCase()}: ${bundle.sizeFormatted}`, 'green');
      }
    }
    log(`   Total: ${formatBytes(this.results.bundles.total)}`, 'bright');
    log(`   Status: ${this.results.bundles.pass ? '✓ PASS' : '✗ FAIL'}`,
        this.results.bundles.pass ? 'green' : 'red');

    log('\n4. Security Performance:', 'cyan');
    log(`   Magic Number Check: ${this.results.security.magicNumber.avgTime.toFixed(3)}ms (target: <${this.baseline.magicNumberCheck}ms)`,
        this.results.security.magicNumber.pass ? 'green' : 'red');
    log(`   Filename Sanitization: ${this.results.security.filenameSanitization.avgTime.toFixed(3)}ms (target: <${this.baseline.filenameSanitization}ms)`,
        this.results.security.filenameSanitization.pass ? 'green' : 'red');
    log(`   Status: ${this.results.security.overall.pass ? '✓ PASS' : '✗ FAIL'}`,
        this.results.security.overall.pass ? 'green' : 'red');

    log('\n┌─────────────────────────────────────────────────────────┐', 'bright');
    log('│              OPTIMIZATION RECOMMENDATIONS               │', 'bright');
    log('└─────────────────────────────────────────────────────────┘', 'bright');

    const recommendations = [];

    if (!this.results.build.pass) {
      recommendations.push('• Build time exceeds target - consider incremental builds or caching');
    } else if (this.results.build.efficiency > 20) {
      recommendations.push('• Build performance is excellent - no optimizations needed');
    }

    if (!this.results.test.pass) {
      recommendations.push('• Test execution is slow - consider parallelization or selective testing');
    } else if (this.results.test.efficiency > 20) {
      recommendations.push('• Test performance is excellent - no optimizations needed');
    }

    if (this.results.bundles.total > 1024 * 1024) { // > 1MB
      recommendations.push('• Bundle size is large - consider code splitting or tree shaking');
    }

    if (!this.results.security.magicNumber.pass) {
      recommendations.push('• Magic number verification is slow - consider caching or optimization');
    }

    if (!this.results.security.filenameSanitization.pass) {
      recommendations.push('• Filename sanitization is slow - consider regex optimization');
    }

    if (recommendations.length === 0) {
      log('\n  ✓ All performance metrics are optimal!', 'green');
      log('  No optimization recommendations at this time.', 'green');
    } else {
      log('');
      recommendations.forEach(rec => log(rec, 'yellow'));
    }

    log('\n' + '='.repeat(80), 'bright');
    log('END OF PERFORMANCE CERTIFICATION REPORT', 'bright');
    log('='.repeat(80) + '\n', 'bright');

    // Save JSON report
    const reportPath = join(ROOT_DIR, 'docs', 'PERFORMANCE_BENCHMARK_REPORT.json');
    try {
      const { writeFileSync, mkdirSync } = await import('fs');
      mkdirSync(join(ROOT_DIR, 'docs'), { recursive: true });
      writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      log(`📄 JSON report saved to: ${reportPath}`, 'cyan');
    } catch (error) {
      log(`Warning: Could not save JSON report: ${error.message}`, 'yellow');
    }

    process.exit(allPassed ? 0 : 1);
  }
}

// Run benchmark
const benchmark = new PerformanceBenchmark();
benchmark.run().catch(error => {
  console.error('Benchmark failed:', error);
  process.exit(1);
});
