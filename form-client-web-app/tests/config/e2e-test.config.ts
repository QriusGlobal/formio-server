/**
 * E2E Test Configuration
 *
 * Centralized configuration for end-to-end test suite including:
 * - Service URLs and endpoints
 * - Timeout values
 * - Retry policies
 * - File size limits
 * - Feature flags
 */

export interface ServiceConfig {
  /** Form.io server URL */
  formio: string;
  /** TUS upload server URL */
  tus: string;
  /** GCS storage URL (emulator or real) */
  gcs: string;
  /** MongoDB connection string */
  mongo: string;
  /** Redis connection string */
  redis: string;
  /** Test app base URL */
  testApp: string;
}

export interface TimeoutConfig {
  /** Form submission timeout (ms) */
  formSubmission: number;
  /** File upload timeout (ms) */
  fileUpload: number;
  /** Queue job processing timeout (ms) */
  queueJob: number;
  /** API request timeout (ms) */
  apiRequest: number;
  /** Large file upload timeout (ms) */
  largeFileUpload: number;
  /** Network recovery timeout (ms) */
  networkRecovery: number;
}

export interface RetryConfig {
  /** Retries for network errors */
  networkError: number;
  /** Retries for timeout errors */
  timeout: number;
  /** Retries for 5xx server errors */
  serverError: number;
  /** Retry delay multiplier */
  delayMultiplier: number;
  /** Maximum retry delay (ms) */
  maxDelay: number;
}

export interface LimitConfig {
  /** Maximum file size (bytes) */
  maxFileSize: number;
  /** Maximum concurrent uploads */
  maxConcurrentUploads: number;
  /** Chunk size for multipart uploads (bytes) */
  chunkSize: number;
  /** Maximum retries per chunk */
  maxChunkRetries: number;
}

export interface FeatureFlags {
  /** Enable visual regression testing */
  visualTesting: boolean;
  /** Enable performance profiling */
  performanceProfiling: boolean;
  /** Enable queue-based uploads */
  queueUploads: boolean;
  /** Enable real GCS (vs emulator) */
  realGCS: boolean;
  /** Enable accessibility testing */
  a11yTesting: boolean;
  /** Enable mobile testing */
  mobileTesting: boolean;
}

export interface E2ETestConfig {
  services: ServiceConfig;
  timeouts: TimeoutConfig;
  retries: RetryConfig;
  limits: LimitConfig;
  features: FeatureFlags;
}

/**
 * Default E2E test configuration
 */
export const E2E_CONFIG: E2ETestConfig = {
  services: {
    formio: process.env.FORMIO_BASE_URL || 'http://localhost:3001',
    tus: process.env.TUS_ENDPOINT || 'http://localhost:1080',
    gcs: process.env.GCS_BASE_URL || 'http://localhost:4443',
    mongo: process.env.MONGODB_URL || 'mongodb://localhost:27017/formioapp',
    redis: process.env.REDIS_URL || 'redis://localhost:6379',
    testApp: process.env.TEST_BASE_URL || 'http://localhost:64849',
  },

  timeouts: {
    formSubmission: 10000, // 10 seconds
    fileUpload: 120000, // 2 minutes
    queueJob: 60000, // 1 minute
    apiRequest: 5000, // 5 seconds
    largeFileUpload: 300000, // 5 minutes (for 500MB files)
    networkRecovery: 30000, // 30 seconds
  },

  retries: {
    networkError: 3,
    timeout: 2,
    serverError: 3,
    delayMultiplier: 2,
    maxDelay: 10000, // 10 seconds max delay between retries
  },

  limits: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxConcurrentUploads: 10,
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
    maxChunkRetries: 3,
  },

  features: {
    visualTesting: process.env.ENABLE_VISUAL_TESTING === 'true',
    performanceProfiling: process.env.ENABLE_PERFORMANCE === 'true',
    queueUploads: process.env.ENABLE_QUEUE_UPLOADS === 'true',
    realGCS: process.env.USE_REAL_GCS === 'true',
    a11yTesting: process.env.ENABLE_A11Y === 'true',
    mobileTesting: process.env.ENABLE_MOBILE === 'true',
  },
};

/**
 * Get service URL with fallback
 */
export function getServiceUrl(service: keyof ServiceConfig): string {
  return E2E_CONFIG.services[service];
}

/**
 * Get timeout value with fallback
 */
export function getTimeout(timeout: keyof TimeoutConfig): number {
  return E2E_CONFIG.timeouts[timeout];
}

/**
 * Get retry configuration for error type
 */
export function getRetryConfig(errorType: keyof RetryConfig): number {
  return E2E_CONFIG.retries[errorType];
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return E2E_CONFIG.features[feature];
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS;
}

/**
 * Get test data directory
 */
export function getTestDataDir(): string {
  return process.env.TEST_DATA_DIR || './tests/fixtures';
}

/**
 * Get screenshot directory
 */
export function getScreenshotDir(): string {
  return process.env.SCREENSHOT_DIR || './test-results/screenshots';
}

/**
 * Get log level
 */
export function getLogLevel(): string {
  return process.env.LOG_LEVEL || 'info';
}

/**
 * Upload configuration for different file sizes
 */
export const UPLOAD_CONFIGS = {
  small: {
    // Files < 1MB
    timeout: 10000,
    chunkSize: 256 * 1024, // 256KB
    retries: 2,
  },
  medium: {
    // Files 1-10MB
    timeout: 30000,
    chunkSize: 1024 * 1024, // 1MB
    retries: 3,
  },
  large: {
    // Files 10-100MB
    timeout: 120000,
    chunkSize: 5 * 1024 * 1024, // 5MB
    retries: 5,
  },
  xlarge: {
    // Files > 100MB
    timeout: 300000,
    chunkSize: 10 * 1024 * 1024, // 10MB
    retries: 5,
  },
};

/**
 * Get upload config for file size
 */
export function getUploadConfigForSize(sizeBytes: number) {
  if (sizeBytes < 1024 * 1024) {
    return UPLOAD_CONFIGS.small;
  } else if (sizeBytes < 10 * 1024 * 1024) {
    return UPLOAD_CONFIGS.medium;
  } else if (sizeBytes < 100 * 1024 * 1024) {
    return UPLOAD_CONFIGS.large;
  } else {
    return UPLOAD_CONFIGS.xlarge;
  }
}

/**
 * Browser configurations for cross-browser testing
 */
export const BROWSER_CONFIGS = {
  chromium: {
    name: 'chromium',
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: ['--disable-web-security', '--disable-dev-shm-usage'],
    },
  },
  firefox: {
    name: 'firefox',
    viewport: { width: 1280, height: 720 },
  },
  webkit: {
    name: 'webkit',
    viewport: { width: 1280, height: 720 },
  },
  mobile: {
    name: 'mobile-chromium',
    viewport: { width: 375, height: 667 },
    isMobile: true,
    hasTouch: true,
  },
};

/**
 * Network condition presets for testing
 */
export const NETWORK_CONDITIONS = {
  fast: {
    downloadThroughput: 50 * 1024 * 1024 / 8, // 50 Mbps
    uploadThroughput: 10 * 1024 * 1024 / 8, // 10 Mbps
    latency: 10,
  },
  slow3G: {
    downloadThroughput: 400 * 1024 / 8, // 400 Kbps
    uploadThroughput: 400 * 1024 / 8, // 400 Kbps
    latency: 400,
  },
  offline: {
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
};

/**
 * Test user credentials
 */
export const TEST_USERS = {
  admin: {
    email: process.env.FORMIO_ROOT_EMAIL || 'admin@example.com',
    password: process.env.FORMIO_ROOT_PASSWORD || 'CHANGEME',
  },
  testUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
  },
};

/**
 * Export default configuration
 */
export default E2E_CONFIG;
