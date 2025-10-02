# TUS File Upload E2E Tests

Comprehensive end-to-end test suite for TUS resumable file upload component.

## Quick Start

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui
```

## Test Suites

- **tus-basic.spec.ts** - Core upload functionality
- **tus-resume.spec.ts** - Resumable upload capabilities
- **tus-errors.spec.ts** - Error scenarios and recovery
- **tus-concurrent.spec.ts** - Multi-file upload scenarios
- **tus-integration.spec.ts** - End-to-end workflows

## Documentation

Full documentation: `.hive-mind/tests/tus-test-patterns.md`

**Version**: 1.0.0
