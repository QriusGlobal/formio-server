/**
 * Bulk Upload Test Data Generators
 *
 * Provides test data configurations for various bulk upload scenarios
 */

export interface BulkTestScenario {
  name: string;
  description: string;
  fileCount: number;
  fileSizeKB: number;
  chunkSizeMB: number;
  parallelUploads: number;
  expectedDurationSec: number;
  category: 'baseline' | 'standard' | 'heavy' | 'extreme' | 'realistic';
}

/**
 * Standard test scenarios for bulk upload testing
 */
export const BULK_TEST_SCENARIOS: BulkTestScenario[] = [
  {
    name: 'Baseline',
    description: '10 files × 5MB each - Baseline bulk upload test',
    fileCount: 10,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 3,
    expectedDurationSec: 30,
    category: 'baseline'
  },
  {
    name: 'Standard',
    description: '15 files × 5MB each - Recommended bulk upload configuration',
    fileCount: 15,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 3,
    expectedDurationSec: 45,
    category: 'standard'
  },
  {
    name: 'Heavy Load',
    description: '20 files × 10MB each - Heavy load test',
    fileCount: 20,
    fileSizeKB: 10 * 1024,
    chunkSizeMB: 8,
    parallelUploads: 5,
    expectedDurationSec: 90,
    category: 'heavy'
  },
  {
    name: 'Maximum Stress',
    description: '30 files × 5MB each - Maximum stress test',
    fileCount: 30,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 5,
    expectedDurationSec: 120,
    category: 'extreme'
  },
  {
    name: 'Mobile Optimized',
    description: '15 files × 3MB each - Mobile network optimized (3G/4G)',
    fileCount: 15,
    fileSizeKB: 3 * 1024,
    chunkSizeMB: 3,
    parallelUploads: 2,
    expectedDurationSec: 60,
    category: 'realistic'
  },
  {
    name: 'WiFi Optimized',
    description: '20 files × 8MB each - WiFi/5G optimized',
    fileCount: 20,
    fileSizeKB: 8 * 1024,
    chunkSizeMB: 8,
    parallelUploads: 5,
    expectedDurationSec: 60,
    category: 'realistic'
  }
];

/**
 * Performance benchmark scenarios
 */
export const PERFORMANCE_BENCHMARKS: BulkTestScenario[] = [
  {
    name: 'Sequential',
    description: 'Sequential upload (1 file at a time)',
    fileCount: 10,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 1,
    expectedDurationSec: 60,
    category: 'baseline'
  },
  {
    name: 'Moderate Parallel',
    description: 'Moderate parallelism (3 concurrent)',
    fileCount: 10,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 3,
    expectedDurationSec: 30,
    category: 'standard'
  },
  {
    name: 'High Parallel',
    description: 'High parallelism (5 concurrent)',
    fileCount: 10,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 5,
    expectedDurationSec: 20,
    category: 'heavy'
  },
  {
    name: 'Maximum Parallel',
    description: 'Maximum parallelism (10 concurrent)',
    fileCount: 10,
    fileSizeKB: 5 * 1024,
    chunkSizeMB: 5,
    parallelUploads: 10,
    expectedDurationSec: 15,
    category: 'extreme'
  }
];

/**
 * Mixed file size scenarios for realistic testing
 */
export const MIXED_SIZE_SCENARIOS = [
  {
    name: 'Small Files',
    description: 'Multiple small files (1KB-100KB)',
    sizes: [1, 5, 10, 25, 50, 100, 1, 5, 10, 25, 50, 100, 1, 5, 10] // KB
  },
  {
    name: 'Medium Files',
    description: 'Medium files (100KB-5MB)',
    sizes: [100, 500, 1024, 2048, 5120, 100, 500, 1024, 2048, 5120, 1024, 2048, 3072, 4096, 5120] // KB
  },
  {
    name: 'Large Files',
    description: 'Large files (5MB-50MB)',
    sizes: [5120, 10240, 20480, 30720, 51200, 5120, 10240, 20480, 30720, 51200] // KB
  },
  {
    name: 'Realistic Mix',
    description: 'Realistic mix of file sizes',
    sizes: [10, 50, 500, 1024, 2048, 5120, 10240, 500, 1024, 5120, 1024, 2048, 1024, 5120, 10240] // KB
  }
];

/**
 * Network condition configurations
 */
export const NETWORK_CONDITIONS = {
  '3G': {
    name: '3G Mobile Network',
    downloadMbps: 0.75,
    uploadMbps: 0.25,
    latencyMs: 100,
    packetLoss: 0.01
  },
  '4G': {
    name: '4G LTE Network',
    downloadMbps: 4,
    uploadMbps: 3,
    latencyMs: 50,
    packetLoss: 0.005
  },
  'slow-wifi': {
    name: 'Slow WiFi',
    downloadMbps: 2,
    uploadMbps: 1,
    latencyMs: 30,
    packetLoss: 0.01
  },
  'fast-wifi': {
    name: 'Fast WiFi',
    downloadMbps: 50,
    uploadMbps: 20,
    latencyMs: 10,
    packetLoss: 0.001
  },
  '5G': {
    name: '5G Network',
    downloadMbps: 100,
    uploadMbps: 50,
    latencyMs: 20,
    packetLoss: 0.001
  }
};

/**
 * Chunk size optimization scenarios
 */
export const CHUNK_SIZE_SCENARIOS = [
  { chunkSizeMB: 1, name: 'Small Chunks', optimal: 'Very slow networks (2G/3G)' },
  { chunkSizeMB: 3, name: 'Mobile Chunks', optimal: '3G/4G networks' },
  { chunkSizeMB: 5, name: 'Balanced Chunks', optimal: 'Most scenarios (recommended)' },
  { chunkSizeMB: 8, name: 'Large Chunks', optimal: 'WiFi/5G networks' },
  { chunkSizeMB: 10, name: 'Extra Large', optimal: 'High-speed connections only' }
];

/**
 * Expected performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  // Upload duration (seconds)
  maxDuration10Files: 30,
  maxDuration15Files: 45,
  maxDuration20Files: 90,
  maxDuration30Files: 120,

  // Memory usage (MB)
  maxMemoryIncrease: 50,
  maxPeakMemory: 200,

  // Upload throughput (MB/s)
  minThroughput3G: 0.03,
  minThroughput4G: 0.3,
  minThroughputWiFi: 1.0,

  // UI responsiveness
  minFPS: 30,
  maxInteractionLatency: 100, // ms

  // Queue management
  maxConcurrentDeviation: 0, // Should match configured parallel uploads exactly
};

/**
 * Browser compatibility test matrix
 */
export const BROWSER_TEST_MATRIX = [
  {
    browser: 'chromium',
    platform: 'desktop',
    features: ['webcam', 'file-api', 'tus', 'parallel-uploads']
  },
  {
    browser: 'firefox',
    platform: 'desktop',
    features: ['webcam', 'file-api', 'tus', 'parallel-uploads']
  },
  {
    browser: 'webkit',
    platform: 'desktop',
    features: ['webcam', 'file-api', 'tus', 'parallel-uploads']
  },
  {
    browser: 'chromium',
    platform: 'mobile',
    features: ['camera', 'file-api', 'tus', 'parallel-uploads']
  }
];

/**
 * Accessibility test scenarios
 */
export const A11Y_SCENARIOS = [
  {
    name: 'Keyboard Navigation',
    description: 'Upload files using only keyboard',
    interactions: ['Tab', 'Enter', 'Space', 'Escape']
  },
  {
    name: 'Screen Reader',
    description: 'Upload with screen reader announcements',
    attributes: ['aria-label', 'aria-live', 'aria-describedby', 'role']
  },
  {
    name: 'High Contrast',
    description: 'Upload in high contrast mode',
    settings: { forcedColors: 'active' }
  },
  {
    name: 'Reduced Motion',
    description: 'Upload with reduced motion preference',
    settings: { prefersReducedMotion: 'reduce' }
  }
];
