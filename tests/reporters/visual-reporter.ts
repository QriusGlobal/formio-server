/**
 * Custom Visual Regression Reporter
 * Generates detailed reports with diff images
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

interface VisualDiff {
  testName: string;
  projectName: string;
  expected: string;
  actual: string;
  diff: string;
  diffPixels: number;
  diffPercentage: number;
}

export default class VisualRegressionReporter implements Reporter {
  private config!: FullConfig;
  private suite!: Suite;
  private visualDiffs: VisualDiff[] = [];
  private outputDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || 'reports/visual-diffs';
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.suite = suite;

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    console.log(`Visual regression testing started with ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Check for screenshot comparison failures
    if (result.status === 'failed' && result.attachments.length > 0) {
      const screenshotAttachments = result.attachments.filter(
        (a) => a.name === 'screenshot' || a.name.includes('diff')
      );

      if (screenshotAttachments.length > 0) {
        this.processVisualDiff(test, result);
      }
    }
  }

  private processVisualDiff(test: TestCase, result: TestResult) {
    const diffAttachment = result.attachments.find((a) => a.name.includes('diff'));
    const actualAttachment = result.attachments.find((a) => a.name.includes('actual'));
    const expectedAttachment = result.attachments.find((a) => a.name.includes('expected'));

    if (diffAttachment && actualAttachment && expectedAttachment) {
      const diff: VisualDiff = {
        testName: test.title,
        projectName: test.parent.project()?.name || 'unknown',
        expected: this.copyAttachment(expectedAttachment.path, 'expected'),
        actual: this.copyAttachment(actualAttachment.path, 'actual'),
        diff: this.copyAttachment(diffAttachment.path, 'diff'),
        diffPixels: this.extractDiffPixels(result.error?.message),
        diffPercentage: 0,
      };

      diff.diffPercentage = this.calculateDiffPercentage(diff);
      this.visualDiffs.push(diff);
    }
  }

  private copyAttachment(sourcePath: string, type: string): string {
    const fileName = `${Date.now()}-${type}-${path.basename(sourcePath)}`;
    const destPath = path.join(this.outputDir, fileName);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }

    return fileName;
  }

  private extractDiffPixels(errorMessage?: string): number {
    if (!errorMessage) return 0;

    const match = errorMessage.match(/(\d+) pixels?/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  private calculateDiffPercentage(diff: VisualDiff): number {
    // Simplified calculation - would need image dimensions for accuracy
    return diff.diffPixels > 0 ? (diff.diffPixels / 100000) * 100 : 0;
  }

  onEnd(result: FullResult) {
    console.log(`\nVisual regression testing completed: ${result.status}`);
    console.log(`Found ${this.visualDiffs.length} visual differences`);

    if (this.visualDiffs.length > 0) {
      this.generateHtmlReport();
      this.generateJsonReport();
      console.log(`\nDetailed report: ${path.join(this.outputDir, 'report.html')}`);
    }
  }

  private generateHtmlReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Regression Report</title>
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
    }

    .header {
      background: #2c3e50;
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .header h1 {
      margin-bottom: 0.5rem;
    }

    .summary {
      background: white;
      margin: 2rem auto;
      max-width: 1200px;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .summary-card {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }

    .summary-card h3 {
      color: #7f8c8d;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .summary-card .value {
      font-size: 2rem;
      font-weight: bold;
      color: #2c3e50;
    }

    .diffs {
      max-width: 1200px;
      margin: 2rem auto;
    }

    .diff-card {
      background: white;
      margin-bottom: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .diff-header {
      background: #34495e;
      color: white;
      padding: 1rem;
    }

    .diff-header h2 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .diff-meta {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .diff-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: #e0e0e0;
    }

    .diff-image {
      background: white;
      padding: 1rem;
    }

    .diff-image h3 {
      font-size: 0.875rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }

    .diff-image img {
      width: 100%;
      height: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    .diff-stats {
      padding: 1rem;
      background: #f8f9fa;
      display: flex;
      gap: 2rem;
    }

    .stat {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #7f8c8d;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #e74c3c;
    }

    @media (max-width: 768px) {
      .diff-images {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Visual Regression Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <h2>Summary</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <h3>Total Differences</h3>
        <div class="value">${this.visualDiffs.length}</div>
      </div>
      <div class="summary-card">
        <h3>Projects Affected</h3>
        <div class="value">${new Set(this.visualDiffs.map((d) => d.projectName)).size}</div>
      </div>
      <div class="summary-card">
        <h3>Avg Diff Pixels</h3>
        <div class="value">${Math.round(
          this.visualDiffs.reduce((sum, d) => sum + d.diffPixels, 0) / this.visualDiffs.length
        )}</div>
      </div>
    </div>
  </div>

  <div class="diffs">
    ${this.visualDiffs
      .map(
        (diff) => `
      <div class="diff-card">
        <div class="diff-header">
          <h2>${diff.testName}</h2>
          <div class="diff-meta">Project: ${diff.projectName}</div>
        </div>
        <div class="diff-images">
          <div class="diff-image">
            <h3>Expected</h3>
            <img src="${diff.expected}" alt="Expected">
          </div>
          <div class="diff-image">
            <h3>Actual</h3>
            <img src="${diff.actual}" alt="Actual">
          </div>
          <div class="diff-image">
            <h3>Difference</h3>
            <img src="${diff.diff}" alt="Difference">
          </div>
        </div>
        <div class="diff-stats">
          <div class="stat">
            <div class="stat-label">Different Pixels</div>
            <div class="stat-value">${diff.diffPixels}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Difference %</div>
            <div class="stat-value">${diff.diffPercentage.toFixed(2)}%</div>
          </div>
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>
    `;

    fs.writeFileSync(path.join(this.outputDir, 'report.html'), html);
  }

  private generateJsonReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalDiffs: this.visualDiffs.length,
        projectsAffected: new Set(this.visualDiffs.map((d) => d.projectName)).size,
        avgDiffPixels:
          this.visualDiffs.reduce((sum, d) => sum + d.diffPixels, 0) / this.visualDiffs.length,
      },
      diffs: this.visualDiffs,
    };

    fs.writeFileSync(path.join(this.outputDir, 'report.json'), JSON.stringify(report, null, 2));
  }
}