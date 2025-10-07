/**
 * Test setup file for Jest
 *
 * Optimized for parallel test execution:
 * - Minimal global setup
 * - Fast mock initialization
 * - Test isolation support
 */

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

// Use faster mock implementations
// Avoid complex logic in global scope

// Mock DOM APIs (optimized)
global.File = class File {
  constructor(
    public bits: BlobPart[],
    public name: string,
    public options?: FilePropertyBag
  ) {}

  get size() {
    return this.bits.reduce((acc, bit) => {
      if (typeof bit === 'string') return acc + bit.length;
      if (bit instanceof ArrayBuffer) return acc + bit.byteLength;
      return acc;
    }, 0);
  }

  get type() {
    return this.options?.type || 'application/octet-stream';
  }
} as any;

global.FormData = class FormData {
  private data = new Map();

  append(key: string, value: any) {
    this.data.set(key, value);
  }

  get(key: string) {
    return this.data.get(key);
  }
} as any;

// Mock fetch for testing (create fresh mock per test via beforeEach)
global.fetch = jest.fn();

// Mock localStorage (optimized with Map for faster access)
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;

// ==========================================
// TEST ISOLATION
// ==========================================

// Clear all mocks before each test
// This is now handled by jest.config.parallel.js:
// - clearMocks: true
// - resetMocks: true
// - restoreMocks: true

// ==========================================
// PERFORMANCE MONITORING (Optional)
// ==========================================

// Track slow tests in development
if (process.env.TRACK_PERF) {
  let testStartTime: number;

  beforeEach(() => {
    testStartTime = performance.now();
  });

  afterEach(() => {
    const duration = performance.now() - testStartTime;
    if (duration > 1000) { // Tests taking >1s
      console.warn(`⚠️  Slow test detected: ${duration.toFixed(0)}ms`);
    }
  });
}