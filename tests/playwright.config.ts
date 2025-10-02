/**
 * Playwright E2E Test Configuration
 *
 * Comprehensive configuration for TUS file upload testing with:
 * - Multiple browsers (Chromium, Firefox, WebKit)
 * - Mobile device emulation
 * - Visual regression testing
 * - Video recording on failure
 * - GCS emulator integration
 */

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Timeout configuration
  timeout: 5 * 60 * 1000, // 5 minutes for large file uploads
  expect: {
    timeout: 30 * 1000, // 30 seconds for assertions
  },

  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Test output
  outputDir: 'test-results/artifacts',

  // Global setup/teardown
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'utils/global-teardown.ts'),

  // Shared configuration for all projects
  use: {
    // Base URL
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:64849',

    // Browser configuration
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },

    // Network configuration
    ignoreHTTPSErrors: true,

    // Screenshots
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Trace recording
    trace: 'retain-on-failure',

    // Test timeout
    actionTimeout: 30 * 1000,
    navigationTimeout: 30 * 1000,

    // Context options
    contextOptions: {
      recordVideo: {
        dir: 'test-results/videos',
        size: { width: 1280, height: 720 },
      },
    },
  },

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:64849',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      // GCS emulator configuration
      STORAGE_EMULATOR_HOST: 'localhost:9023',
      GCS_BUCKET: 'test-bucket',
      // Form.io test configuration
      FORMIO_URL: 'http://localhost:3001',
      FORMIO_PROJECT_URL: 'http://localhost:3001/project',
      // TUS configuration
      TUS_ENDPOINT: 'http://localhost:3001/files',
      TUS_CHUNK_SIZE: String(8 * 1024 * 1024), // 8MB
      TUS_MAX_FILE_SIZE: String(5 * 1024 * 1024 * 1024), // 5GB
    },
  },

  // Test projects (browsers and devices)
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Global test metadata
  metadata: {
    environment: process.env.CI ? 'CI' : 'Local',
    testSuite: 'TUS File Upload E2E Tests',
    version: '1.0.0',
  },
});