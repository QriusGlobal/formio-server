/**
 * OpenTelemetry Configuration for Upload Subsystem
 *
 * Distributed tracing and metrics collection for file upload workflow:
 * - TUS upload tracking
 * - GCS upload performance
 * - Job queue processing
 * - Network latency metrics
 */

'use strict';

const {NodeSDK} = require('@opentelemetry/sdk-node');
const {getNodeAutoInstrumentations} = require('@opentelemetry/auto-instrumentations-node');
const {Resource} = require('@opentelemetry/resources');
const {SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION} = require('@opentelemetry/semantic-conventions');

/**
 * Initialize OpenTelemetry SDK
 *
 * @param {Object} config - Telemetry configuration
 * @param {string} config.serviceName - Service name for tracing
 * @param {string} config.serviceVersion - Service version
 * @param {string} [config.endpoint] - OTLP collector endpoint
 * @param {boolean} [config.enabled=true] - Enable/disable telemetry
 * @returns {NodeSDK|null} OpenTelemetry SDK instance or null if disabled
 */
function initializeTelemetry(config = {}) {
  const enabled = config.enabled !== undefined ? config.enabled : true;

  if (!enabled) {
    console.log('[Telemetry] OpenTelemetry disabled');
    return null;
  }

  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: config.serviceName || 'formio-upload-service',
    [SEMRESATTRS_SERVICE_VERSION]: config.serviceVersion || '1.0.0',
    'upload.subsystem': 'gcs-tus-integration',
    'environment': process.env.NODE_ENV || 'development'
  });

  const sdk = new NodeSDK({
    resource,

    // Automatic instrumentation for common libraries
    instrumentations: [
      getNodeAutoInstrumentations({
        // Auto-instrument HTTP/HTTPS requests
        '@opentelemetry/instrumentation-http': {
          enabled: true,
          ignoreIncomingPaths: ['/health', '/metrics'] // Don't trace health checks
        },

        // Auto-instrument Redis (for BullMQ)
        '@opentelemetry/instrumentation-ioredis': {
          enabled: true
        },

        // Auto-instrument Express
        '@opentelemetry/instrumentation-express': {
          enabled: true
        }
      })
    ],

    // Exporter configuration
    traceExporter: config.exporter || undefined, // Use default console exporter if not provided

    // Sampling strategy (100% in dev, configurable in prod)
    sampler: config.sampler || undefined // Use default ParentBasedSampler
  });

  // Start SDK
  sdk.start();

  console.log(`[Telemetry] OpenTelemetry initialized for ${config.serviceName || 'formio-upload-service'}`);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('[Telemetry] OpenTelemetry shut down successfully'))
      .catch((err) => console.error('[Telemetry] Error shutting down OpenTelemetry:', err))
      .finally(() => process.exit(0));
  });

  return sdk;
}

module.exports = {
  initializeTelemetry
};
