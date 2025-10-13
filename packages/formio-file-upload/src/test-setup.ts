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

// Polyfill TextEncoder/TextDecoder for JSDOM environment
// JSDOM doesn't provide these but Node.js does
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as any;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}

// Mock Blob class (base for File)
class MockBlob {
  constructor(
    public bits: BlobPart[],
    public options?: BlobPropertyBag
  ) {}

  get size(): number {
    return this.bits.reduce((acc, bit) => {
      if (typeof bit === 'string') return acc + bit.length;
      if (bit instanceof ArrayBuffer) return acc + bit.byteLength;
      if (bit instanceof Uint8Array) return acc + bit.byteLength;
      if ((bit as any).bits) return acc + (bit as any).size; // MockBlob/MockFile
      return acc;
    }, 0);
  }

  get type(): string {
    return this.options?.type || 'application/octet-stream';
  }

  private toUint8Array(): Uint8Array {
    // Calculate total size first
    let totalSize = 0;
    const arrays: Uint8Array[] = [];

    for (const bit of this.bits) {
      if (bit instanceof Uint8Array) {
        arrays.push(bit);
        totalSize += bit.byteLength;
      } else if (bit instanceof ArrayBuffer) {
        const arr = new Uint8Array(bit);
        arrays.push(arr);
        totalSize += arr.byteLength;
      } else if (typeof bit === 'string') {
        const arr = new TextEncoder().encode(bit);
        arrays.push(arr);
        totalSize += arr.byteLength;
      } else if ((bit as any).bits) {
        // MockBlob/MockFile
        const arr = (bit as any).toUint8Array() as Uint8Array;
        arrays.push(arr);
        totalSize += arr.byteLength;
      }
    }

    // Efficiently concatenate all arrays
    const result = new Uint8Array(totalSize);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.byteLength;
    }

    return result;
  }

  slice(start: number = 0, end?: number, contentType?: string): Blob {
    const fullArray = this.toUint8Array();
    const slicedArray = fullArray.slice(start, end);

    return new MockBlob([slicedArray.buffer], {
      type: contentType || this.type,
    }) as any;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const uint8 = this.toUint8Array();
    // Create a new ArrayBuffer copy
    const buffer = new ArrayBuffer(uint8.byteLength);
    const view = new Uint8Array(buffer);
    view.set(uint8);
    return buffer;
  }

  async text(): Promise<string> {
    const buffer = await this.arrayBuffer();
    return new TextDecoder().decode(buffer);
  }
}

// Mock File class (extends Blob)
class MockFile extends MockBlob {
  constructor(
    bits: BlobPart[],
    public name: string,
    options?: FilePropertyBag
  ) {
    super(bits, options);
  }
}

// Assign to global
global.Blob = MockBlob as any;
global.File = MockFile as any;

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
    if (duration > 1000) {
      // Tests taking >1s
      console.warn(`⚠️  Slow test detected: ${duration.toFixed(0)}ms`);
    }
  });
}
