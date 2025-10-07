/**
 * Jest Configuration for Parallel Test Execution
 *
 * Optimized configuration for BUG-CRIT-001:
 * - Parallel test workers (maxWorkers)
 * - Optimized test environment setup
 * - Test isolation strategies
 * - Performance monitoring
 *
 * Target: 65-75% speedup from baseline
 */

import os from 'os';

// Calculate optimal worker count based on CPU cores
const cpuCount = os.cpus().length;
// Use 75% of cores, leave some for system operations
const optimalWorkers = Math.max(1, Math.floor(cpuCount * 0.75));

export default {
  // Base configuration from jest.config.js
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  // ==========================================
  // PARALLEL EXECUTION OPTIMIZATIONS
  // ==========================================

  // Enable parallel test execution
  maxWorkers: optimalWorkers,

  // Run tests in parallel across worker threads
  // This is the key to the 65-75% speedup
  workerIdleMemoryLimit: '512MB',

  // Cache configuration for faster subsequent runs
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // Bail after first test failure in CI (optional, can speed up failing builds)
  // bail: process.env.CI ? 1 : 0,

  // Faster test discovery
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/lib/',
    '/.jest-cache/'
  ],

  // Optimize module resolution
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/lib/'
  ],

  // Faster transformer options (updated for ts-jest v29+)
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        // Skip type checking for faster compilation
        skipLibCheck: true,
        skipDefaultLibCheck: true
      }
    }]
  },

  // Clear mocks between tests for isolation
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Faster timeout for quick test detection
  testTimeout: 10000,

  // Detect slow tests
  slowTestThreshold: 1000,

  // Optimize watch mode (for development)
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/lib/',
    '/.jest-cache/'
  ],

  // Performance monitoring
  verbose: false, // Reduces console output overhead
  silent: false,

  // Notify on completion (optional, for development)
  notify: false,
  notifyMode: 'failure-change',

  // Error handling
  errorOnDeprecated: false, // Don't slow down tests with deprecation warnings

  // Coverage collection optimizations (when needed)
  collectCoverage: false, // Disabled by default for speed, enable with --coverage flag
  coverageProvider: 'v8', // Faster than 'babel'

  // Reporters (minimal for performance)
  reporters: [
    'default',
    // Add custom reporter for performance metrics if needed
    // ['<rootDir>/scripts/performance-reporter.js', {}]
  ],

  // Test sequencer for optimal ordering (optional)
  // testSequencer: '<rootDir>/scripts/test-sequencer.js',
};

// Log configuration on startup
if (process.env.VERBOSE_CONFIG) {
  console.log('\n🚀 Jest Parallel Configuration');
  console.log('================================');
  console.log(`CPU Cores: ${cpuCount}`);
  console.log(`Max Workers: ${optimalWorkers}`);
  console.log(`Cache: Enabled`);
  console.log(`Isolated Modules: Enabled`);
  console.log('================================\n');
}
