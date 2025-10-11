/**
 * Playwright Configuration for Edge Case Testing
 *
 * Includes network simulation, mobile viewports, and browser contexts
 * for comprehensive edge case and stress testing.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail build on CI if tests fail
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers for resource-intensive tests
  workers: process.env.CI ? 1 : 2,

  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Global timeout
  timeout: 120000, // 2 minutes for stress tests

  // Expect timeout
  expect: {
    timeout: 30000,
  },

  use: {
    // Base URL for testing
    baseURL: 'http://localhost:64849',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure projects for different browsers and scenarios
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable console logging
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Network condition projects
    {
      name: 'Slow 3G',
      use: {
        ...devices['Desktop Chrome'],
        offline: false,
        launchOptions: {
          slowMo: 100,
        },
      },
    },

    {
      name: 'Offline',
      use: {
        ...devices['Desktop Chrome'],
        offline: true,
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    port: 64849,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});