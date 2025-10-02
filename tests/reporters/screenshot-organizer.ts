/**
 * Failure Screenshot Organizer
 * Organizes and manages test failure screenshots
 */

import * as fs from 'fs';
import * as path from 'path';
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

export interface ScreenshotInfo {
  testName: string;
  projectName: string;
  timestamp: string;
  path: string;
  size: number;
}

export class ScreenshotOrganizer implements Reporter {
  private screenshots: ScreenshotInfo[] = [];
  private outputDir: string;
  private indexFile: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || 'reports/screenshots';
    this.indexFile = path.join(this.outputDir, 'index.json');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed' && result.attachments.length > 0) {
      this.organizeScreenshots(test, result);
    }
  }

  private organizeScreenshots(test: TestCase, result: TestResult) {
    const projectName = test.parent.project()?.name || 'default';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const testSlug = this.slugify(test.title);

    // Create organized directory structure
    const targetDir = path.join(this.outputDir, projectName, testSlug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    result.attachments.forEach((attachment, index) => {
      if (attachment.name === 'screenshot' && attachment.path) {
        const ext = path.extname(attachment.path);
        const fileName = `${timestamp}-${index}${ext}`;
        const targetPath = path.join(targetDir, fileName);

        // Copy screenshot to organized location
        if (fs.existsSync(attachment.path)) {
          fs.copyFileSync(attachment.path, targetPath);

          const stats = fs.statSync(targetPath);
          this.screenshots.push({
            testName: test.title,
            projectName,
            timestamp: new Date().toISOString(),
            path: path.relative(this.outputDir, targetPath),
            size: stats.size,
          });
        }
      }
    });
  }

  onEnd() {
    if (this.screenshots.length > 0) {
      // Save index file
      fs.writeFileSync(this.indexFile, JSON.stringify(this.screenshots, null, 2));

      // Generate HTML index
      this.generateHtmlIndex();

      console.log(`\n${this.screenshots.length} failure screenshots organized`);
      console.log(`Screenshot index: ${this.indexFile}`);
    }
  }

  private generateHtmlIndex() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Failure Screenshots</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
      margin: 0;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .screenshot-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .screenshot-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      cursor: pointer;
    }
    .screenshot-info {
      padding: 1rem;
    }
    .screenshot-name {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    .screenshot-meta {
      font-size: 0.875rem;
      color: #7f8c8d;
    }
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      padding: 2rem;
    }
    .lightbox.active {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Test Failure Screenshots</h1>
    <div class="gallery">
      ${this.screenshots
        .map(
          (screenshot) => `
        <div class="screenshot-card">
          <img src="${screenshot.path}" alt="${screenshot.testName}" onclick="showLightbox(this.src)">
          <div class="screenshot-info">
            <div class="screenshot-name">${screenshot.testName}</div>
            <div class="screenshot-meta">
              <div>Project: ${screenshot.projectName}</div>
              <div>Time: ${new Date(screenshot.timestamp).toLocaleString()}</div>
              <div>Size: ${(screenshot.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <div class="lightbox" id="lightbox" onclick="this.classList.remove('active')">
    <img src="" alt="" id="lightbox-img">
  </div>

  <script>
    function showLightbox(src) {
      document.getElementById('lightbox-img').src = src;
      document.getElementById('lightbox').classList.add('active');
    }
  </script>
</body>
</html>
    `;

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}