import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './test-results/coverage',
      include: [
        'src/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        'src/pages/**/*.{ts,tsx}'
      ],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.d.ts',
        'src/main.tsx',
        'src/**/*.stories.tsx'
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90
      }
    },
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/integration/**/*.test.{ts,tsx}',
      'tests/performance/**/*.test.{ts,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'tests/e2e/**', // E2E tests run with Playwright
      'tests/pages/**',
      'tests/fixtures/**',
      'tests/utils/**'
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    isolate: true,
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/vitest-results.json',
      html: './test-results/vitest-report.html'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './tests/utils'),
      '@fixtures': path.resolve(__dirname, './tests/fixtures')
    }
  }
});