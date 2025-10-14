/**
 * Vitest Test Setup
 *
 * Global test configuration and mocks
 */

import { cleanup } from '@testing-library/react';
import { expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock CSS imports globally
vi.mock('*.css', () => ({ default: {} }));
vi.mock('*.min.css', () => ({ default: {} }));

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock global objects
global.File = class File {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor(parts: BlobPart[], name: string, options?: FilePropertyBag) {
    this.name = name;
    this.type = options?.type || '';
    this.lastModified = options?.lastModified || Date.now();

    // Calculate size
    this.size = parts.reduce((total, part) => {
      if (part instanceof ArrayBuffer) {
        return total + part.byteLength;
      } else if (typeof part === 'string') {
        return total + part.length;
      }
      return total;
    }, 0);
  }
} as any;

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

// Mock performance.now() for consistent timing tests
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now(),
  } as any;
}