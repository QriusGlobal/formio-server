/**
 * Visual Regression Testing Configuration
 * Playwright configuration for screenshot comparisons
 */

import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  testMatch: '**/*.visual.spec.ts',

  // Timeout settings
  timeout: 30000,
  expect: {
    timeout: 5000,
    // Screenshot comparison settings
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
    },
  },

  // Output directories
  outputDir: path.join(__dirname, 'test-results'),
  snapshotDir: path.join(__dirname, 'snapshots'),

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Parallel execution
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: true,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: path.join(__dirname, '../reports/visual') }],
    ['json', { outputFile: path.join(__dirname, '../reports/visual/results.json') }],
    ['list'],
    [path.join(__dirname, '../reporters/visual-reporter.ts')],
  ],

  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // Screenshot settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Viewport
    viewport: { width: 1280, height: 720 },

    // Browser context options
    ignoreHTTPSErrors: true,
    bypassCSP: true,

    // Action settings
    actionTimeout: 10000,
  },

  // Projects for different browsers and viewports
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['iPhone 12'],
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Web server for development
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
};

export default config;