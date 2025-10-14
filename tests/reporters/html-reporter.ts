/**
 * Custom HTML Test Reporter
 * Generates comprehensive HTML reports with metrics
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

interface TestMetrics {
  duration: number;
  retries: number;
  attachments: number;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
}

interface SuiteMetrics {
  name: string;
  tests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  tests_details: Array<{
    name: string;
    status: string;
    duration: number;
    error?: string;
  }>;
}

export default class HtmlReporter implements Reporter {
  private startTime!: number;
  private suiteMetrics: Map<string, SuiteMetrics> = new Map();
  private testMetrics: Map<string, TestMetrics> = new Map();
  private outputFile: string;

  constructor(options: { outputFile?: string } = {}) {
    this.outputFile = options.outputFile || 'reports/test-report.html';
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    console.log(`Starting test run with ${suite.allTests().length} tests`);

    // Ensure output directory exists
    const dir = path.dirname(this.outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Store test metrics
    this.testMetrics.set(test.id, {
      duration: result.duration,
      retries: result.retry,
      attachments: result.attachments.length,
      status: result.status,
    });

    // Update suite metrics
    const suiteName = test.parent.title || 'Root';
    let suiteMetric = this.suiteMetrics.get(suiteName);

    if (!suiteMetric) {
      suiteMetric = {
        name: suiteName,
        tests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        tests_details: [],
      };
      this.suiteMetrics.set(suiteName, suiteMetric);
    }

    suiteMetric.tests++;
    suiteMetric.duration += result.duration;

    switch (result.status) {
      case 'passed':
        suiteMetric.passed++;
        break;
      case 'failed':
        suiteMetric.failed++;
        break;
      case 'skipped':
        suiteMetric.skipped++;
        break;
    }

    suiteMetric.tests_details.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
    });
  }

  onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const totalTests = Array.from(this.testMetrics.values()).length;
    const passed = Array.from(this.testMetrics.values()).filter((m) => m.status === 'passed')
      .length;
    const failed = Array.from(this.testMetrics.values()).filter((m) => m.status === 'failed')
      .length;
    const skipped = Array.from(this.testMetrics.values()).filter((m) => m.status === 'skipped')
      .length;

    console.log(`\nTest run completed in ${(duration / 1000).toFixed(2)}s`);
    console.log(`  Passed: ${passed}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Skipped: ${skipped}`);

    this.generateHtmlReport({
      status: result.status,
      duration,
      totalTests,
      passed,
      failed,
      skipped,
    });

    console.log(`\nHTML Report: ${this.outputFile}`);
  }

  private generateHtmlReport(summary: any) {
    const suites = Array.from(this.suiteMetrics.values());

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      color: #333;
      padding: 2rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .header .subtitle {
      opacity: 0.9;
      font-size: 1rem;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-left: 4px solid #667eea;
    }

    .summary-card.passed {
      border-left-color: #27ae60;
    }

    .summary-card.failed {
      border-left-color: #e74c3c;
    }

    .summary-card.skipped {
      border-left-color: #f39c12;
    }

    .summary-card h3 {
      color: #7f8c8d;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .summary-card .value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #2c3e50;
    }

    .suite {
      background: white;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .suite-header {
      background: #34495e;
      color: white;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
    }

    .suite-header:hover {
      background: #2c3e50;
    }

    .suite-title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .suite-stats {
      display: flex;
      gap: 1.5rem;
      font-size: 0.875rem;
    }

    .suite-stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .badge.passed {
      background: #27ae60;
      color: white;
    }

    .badge.failed {
      background: #e74c3c;
      color: white;
    }

    .badge.skipped {
      background: #f39c12;
      color: white;
    }

    .suite-tests {
      padding: 1rem;
      display: none;
    }

    .suite.expanded .suite-tests {
      display: block;
    }

    .test {
      padding: 1rem;
      border-left: 4px solid #3498db;
      margin-bottom: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .test.passed {
      border-left-color: #27ae60;
    }

    .test.failed {
      border-left-color: #e74c3c;
    }

    .test.skipped {
      border-left-color: #f39c12;
    }

    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .test-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .test-duration {
      color: #7f8c8d;
      font-size: 0.875rem;
    }

    .test-error {
      background: #fee;
      border: 1px solid #fcc;
      padding: 1rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      color: #c33;
      margin-top: 0.5rem;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .expand-icon {
      transition: transform 0.3s;
    }

    .suite.expanded .expand-icon {
      transform: rotate(90deg);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Test Report</h1>
      <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
    </div>

    <div class="summary">
      <div class="summary-card">
        <h3>Total Tests</h3>
        <div class="value">${summary.totalTests}</div>
      </div>
      <div class="summary-card passed">
        <h3>Passed</h3>
        <div class="value">${summary.passed}</div>
      </div>
      <div class="summary-card failed">
        <h3>Failed</h3>
        <div class="value">${summary.failed}</div>
      </div>
      <div class="summary-card skipped">
        <h3>Skipped</h3>
        <div class="value">${summary.skipped}</div>
      </div>
      <div class="summary-card">
        <h3>Duration</h3>
        <div class="value">${(summary.duration / 1000).toFixed(1)}s</div>
      </div>
    </div>

    ${suites
      .map(
        (suite) => `
      <div class="suite">
        <div class="suite-header" onclick="this.parentElement.classList.toggle('expanded')">
          <div class="suite-title">
            <span class="expand-icon">▶</span>
            ${suite.name}
          </div>
          <div class="suite-stats">
            <div class="suite-stat">
              <span class="badge passed">${suite.passed} Passed</span>
            </div>
            ${suite.failed > 0 ? `<div class="suite-stat"><span class="badge failed">${suite.failed} Failed</span></div>` : ''}
            ${suite.skipped > 0 ? `<div class="suite-stat"><span class="badge skipped">${suite.skipped} Skipped</span></div>` : ''}
            <div class="suite-stat">${(suite.duration / 1000).toFixed(1)}s</div>
          </div>
        </div>
        <div class="suite-tests">
          ${suite.tests_details
            .map(
              (test) => `
            <div class="test ${test.status}">
              <div class="test-header">
                <div class="test-name">${test.name}</div>
                <div class="test-duration">${test.duration.toFixed(0)}ms</div>
              </div>
              ${test.error ? `<div class="test-error">${this.escapeHtml(test.error)}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      )
      .join('')}
  </div>

  <script>
    // Auto-expand failed suites
    document.querySelectorAll('.suite').forEach(suite => {
      const failed = suite.querySelector('.badge.failed');
      if (failed) {
        suite.classList.add('expanded');
      }
    });
  </script>
</body>
</html>
    `;

    fs.writeFileSync(this.outputFile, html);
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/["&'<>]/g, (m) => map[m]);
  }
}