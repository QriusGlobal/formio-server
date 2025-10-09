/**
 * Storage Provider Factory and Registration
 *
 * Provides centralized provider management for Form.io cloud storage.
 * Supports multiple storage providers (GCS, S3, etc.) with runtime selection.
 *
 * @module storage
 */

const StorageProvider = require('./StorageProvider');
const GCSProvider = require('./providers/GCSProvider');

/**
 * Registered storage providers
 * @type {Map<string, Class>}
 */
const providers = new Map();

/**
 * Active provider instances (singleton per configuration)
 * @type {Map<string, StorageProvider>}
 */
const instances = new Map();

/**
 * Register built-in providers
 */
providers.set('gcs', GCSProvider);
providers.set('google', GCSProvider); // Alias

/**
 * Register a storage provider
 *
 * @param {string} name - Provider name (e.g., 'gcs', 's3')
 * @param {Class} ProviderClass - Provider class (must extend StorageProvider)
 * @throws {Error} If provider doesn't extend StorageProvider
 *
 * @example
 * const { registerProvider } = require('./storage');
 * const S3Provider = require('./providers/S3Provider');
 *
 * registerProvider('s3', S3Provider);
 */
function registerProvider(name, ProviderClass) {
  if (!(ProviderClass.prototype instanceof StorageProvider)) {
    throw new Error(`Provider ${name} must extend StorageProvider`);
  }

  providers.set(name.toLowerCase(), ProviderClass);
}

/**
 * Get registered provider class
 *
 * @param {string} name - Provider name
 * @returns {Class|null} Provider class or null if not found
 */
function getProvider(name) {
  return providers.get(name.toLowerCase());
}

/**
 * List all registered provider names
 *
 * @returns {string[]} Array of provider names
 */
function listProviders() {
  return Array.from(providers.keys());
}

/**
 * Create storage provider instance with caching
 *
 * Returns cached instance if one exists with matching configuration.
 * Creates new instance if configuration differs.
 *
 * @param {string} name - Provider name (e.g., 'gcs', 's3')
 * @param {Object} config - Provider configuration
 * @returns {StorageProvider} Provider instance
 * @throws {Error} If provider not found or configuration invalid
 *
 * @example
 * const { createProvider } = require('./storage');
 *
 * // GCS provider for local emulator
 * const provider = createProvider('gcs', {
 *   projectId: 'local-project',
 *   bucket: 'local-formio-uploads',
 *   apiEndpoint: 'http://localhost:4443'
 * });
 *
 * // Upload file
 * const stream = fs.createReadStream('file.pdf');
 * await provider.multipartUpload(stream, {
 *   key: 'uploads/file.pdf',
 *   contentType: 'application/pdf',
 *   formId: 'form123',
 *   submissionId: 'sub456'
 * });
 */
function createProvider(name, config) {
  const ProviderClass = getProvider(name);

  if (!ProviderClass) {
    throw new Error(`Storage provider '${name}' not found. Available: ${listProviders().join(', ')}`);
  }

  // Create cache key from config
  const cacheKey = `${name}:${JSON.stringify(config)}`;

  // Return cached instance if exists
  if (instances.has(cacheKey)) {
    return instances.get(cacheKey);
  }

  // Create new instance
  const instance = new ProviderClass(config);

  // Cache instance
  instances.set(cacheKey, instance);

  return instance;
}

/**
 * Create provider from environment variables
 *
 * Reads configuration from environment variables:
 * - STORAGE_PROVIDER: Provider name (gcs, s3)
 * - STORAGE_BUCKET: Bucket name
 * - GCS_PROJECT_ID: GCP project ID
 * - GCS_KEY_FILE: Path to service account key
 * - GCS_API_ENDPOINT: Custom endpoint (for emulator)
 *
 * @returns {StorageProvider} Configured provider instance
 * @throws {Error} If required environment variables missing
 *
 * @example
 * // Set environment variables
 * process.env.STORAGE_PROVIDER = 'gcs';
 * process.env.STORAGE_BUCKET = 'local-formio-uploads';
 * process.env.GCS_PROJECT_ID = 'local-project';
 * process.env.GCS_API_ENDPOINT = 'http://localhost:4443';
 *
 * // Create provider from env
 * const provider = createProviderFromEnv();
 */
function createProviderFromEnv() {
  const providerName = process.env.STORAGE_PROVIDER;

  if (!providerName) {
    throw new Error('STORAGE_PROVIDER environment variable is required');
  }

  // Build configuration based on provider
  const config = {
    bucket: process.env.STORAGE_BUCKET
  };

  if (!config.bucket) {
    throw new Error('STORAGE_BUCKET environment variable is required');
  }

  // GCS-specific configuration
  if (providerName === 'gcs' || providerName === 'google') {
    config.projectId = process.env.GCS_PROJECT_ID;
    config.keyFilename = process.env.GCS_KEY_FILE;
    config.location = process.env.GCS_LOCATION || 'us-central1';

    if (process.env.GCS_API_ENDPOINT) {
      config.apiEndpoint = process.env.GCS_API_ENDPOINT;
    }

    if (!config.projectId) {
      throw new Error('GCS_PROJECT_ID environment variable is required for GCS provider');
    }
  }

  // S3-specific configuration (for future S3Provider)
  if (providerName === 's3' || providerName === 'aws') {
    config.region = process.env.AWS_REGION || process.env.S3_REGION || 'us-east-1';
    config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (process.env.S3_ENDPOINT) {
      config.endpoint = process.env.S3_ENDPOINT;
    }
  }

  return createProvider(providerName, config);
}

/**
 * Clear provider instance cache
 *
 * Useful for testing or when reconfiguring providers
 */
function clearCache() {
  instances.clear();
}

/**
 * Get provider instance from cache
 *
 * @param {string} name - Provider name
 * @param {Object} config - Provider configuration
 * @returns {StorageProvider|null} Cached instance or null
 */
function getCachedInstance(name, config) {
  const cacheKey = `${name}:${JSON.stringify(config)}`;
  return instances.get(cacheKey);
}

module.exports = {
  // Base class
  StorageProvider,

  // Providers
  GCSProvider,

  // Factory functions
  createProvider,
  createProviderFromEnv,

  // Registry functions
  registerProvider,
  getProvider,
  listProviders,

  // Cache management
  clearCache,
  getCachedInstance
};
