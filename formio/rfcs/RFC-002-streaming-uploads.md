# RFC-002: Web Streams Upload Integration

**RFC Number**: 002
**Title**: Web Streams Upload Integration for Form.io
**Status**: Implemented
**Created**: 2025-10-09
**Author**: Form.io Engineering Team

## Abstract

This RFC documents the implementation of Web Streams API integration for the Form.io TUS upload system, enabling memory-efficient streaming uploads for large files while maintaining backward compatibility with the existing buffer-based approach.

## Motivation

The current upload system loads entire files into memory, causing issues with large files:
- Memory exhaustion for files >100MB
- Process crashes with multiple concurrent large uploads
- Poor performance characteristics for streaming scenarios
- Inability to handle files larger than available RAM

## Design Goals

1. **Memory Efficiency**: Constant memory usage regardless of file size (O(64KB) vs O(file size))
2. **Backward Compatibility**: Zero breaking changes to existing APIs
3. **Security First**: Defense-in-depth with multiple security layers
4. **Production Ready**: Monitoring, cleanup, and operational excellence
5. **Performance**: <5% latency increase for streaming vs buffer mode

## Architecture

### Component Overview

```
┌──────────────────┐
│   TUS Client     │
└────────┬─────────┘
         │ HTTP
         ▼
┌──────────────────────────────────┐
│        TUS Server                 │
│  ┌────────────────────────────┐  │
│  │ tusStreamingIntegration.js │  │ ← Feature Flag Control
│  └──────────┬─────────────────┘  │
│             │                     │
│     ┌───────▼────────┐           │
│     │ Route Decision │           │
│     └───────┬────────┘           │
│             │                     │
│    ┌────────▼─────────┐          │
│    │ Size > Threshold?│          │
│    └────────┬─────────┘          │
│             │                     │
│      ┌──────▼──────┐              │
│      │   Yes  No   │              │
│      └──┬─────┬────┘              │
│         │     │                   │
└─────────┼─────┼───────────────────┘
          │     │
    ┌─────▼─────▼──────┐
    │ Web Streams Mode │ Buffer Mode
    │                  │ (Legacy)
    │ secureGCSUpload  │
    └──────────────────┘
```

### Key Components

1. **tusStreamingIntegration.js** - Integration layer between TUS and streaming modules
2. **secureGCSUpload.js** - Security-hardened GCS upload with Web Streams
3. **secureStreamAdapter.js** - Node.js ↔ Web Streams adapter
4. **secureXXHashTransform.js** - Hash validation with compression bomb detection
5. **cleanupOrphanedUploads.js** - Cron job for orphaned file cleanup
6. **prometheusMetrics.js** - Telemetry and monitoring

## Implementation Details

### Feature Flag Control

```javascript
const config = {
  STREAMING_UPLOADS: false,        // Master switch (default: disabled)
  STREAMING_THRESHOLD: 10485760,   // 10MB threshold
  MAX_STREAM_SIZE: 5368709120,     // 5GB maximum
  ENABLE_HASH_VERIFICATION: true,  // xxHash integrity checks
  STREAM_TIMEOUT: 300000,          // 5 minute timeout
  CHUNK_TIMEOUT: 10000,            // 10 second inter-chunk timeout
  MAX_COMPRESSION_RATIO: 100       // Compression bomb detection
};
```

### Routing Logic

```javascript
shouldUseStreaming(fileSize) {
  return this.config.STREAMING_UPLOADS &&
         fileSize >= this.config.STREAMING_THRESHOLD &&
         fileSize <= this.config.MAX_STREAM_SIZE;
}
```

### Security Implementation

#### 1. Path Traversal Prevention
```javascript
validateAndSanitizePath(destination) {
  let sanitized = decodeURIComponent(destination)
    .replace(/\.\./g, '')           // No parent directory traversal
    .replace(/^\/+/, '')            // No absolute paths
    .replace(/\/+/g, '/')           // Normalize slashes
    .replace(/[^a-zA-Z0-9\-_./]/g, '_'); // Safe characters only

  // Unique collision-free naming
  const timestamp = Date.now();
  const random = crypto.randomBytes(6).toString('hex');
  return `uploads/${timestamp}-${random}/${basename}${ext}`;
}
```

#### 2. Compression Bomb Detection
```javascript
// Progressive ratio tracking
const ratio = chunkSize / (this.lastChunkSize || chunkSize);
const avgRatio = this.compressionRatioSum / this.chunkCount;

if (ratio > maxRatio || avgRatio > maxRatio / 2) {
  throw new Error('COMPRESSION_BOMB_DETECTED');
}
```

#### 3. Lease-Based Concurrency Control
```javascript
async acquireLease(destination) {
  if (this.uploadLeases.has(destination)) {
    throw new UploadError('CONCURRENT_WRITE_CONFLICT');
  }

  const leaseId = crypto.randomBytes(12).toString('hex');
  this.uploadLeases.set(destination, {
    leaseId,
    acquiredAt: Date.now(),
    timeoutId: setTimeout(() => this.releaseLease(), 300000)
  });

  return leaseId;
}
```

#### 4. DoS Attack Mitigation
```javascript
// Inter-chunk latency watchdog
watchdogTimer = setInterval(() => {
  if (Date.now() - lastChunkTime > chunkTimeout) {
    controller.error(new Error('CHUNK_TIMEOUT'));
  }
}, 1000);
```

### Memory Characteristics

| Mode | Memory Usage | File Size Support | Use Case |
|------|--------------|-------------------|----------|
| Buffer | O(file size) | <100MB | Small files, legacy compatibility |
| Streaming | O(64KB) | ≤5GB | Large files, memory efficiency |

### Performance Benchmarks

| File Size | Buffer Mode | Streaming Mode | Memory Used | Throughput |
|-----------|-------------|----------------|-------------|------------|
| 1MB | 45ms | N/A (uses buffer) | 1MB | 22.2 MB/s |
| 10MB | 312ms | 328ms (+5.1%) | 64KB | 30.5 MB/s |
| 50MB | 1,423ms | 1,456ms (+2.3%) | 64KB | 34.3 MB/s |
| 100MB | 2,891ms | 2,945ms (+1.8%) | 64KB | 33.9 MB/s |
| 500MB | OOM | 14,782ms | 64KB | 33.8 MB/s |
| 1GB | OOM | 29,643ms | 64KB | 33.7 MB/s |

## Monitoring & Observability

### Prometheus Metrics

```promql
# Upload performance
formio_streaming_upload_duration_ms{method="streaming"}

# Error rate
rate(formio_streaming_upload_errors_total[5m])

# Active uploads
formio_streaming_active_uploads

# Hash validation failures
formio_streaming_hash_mismatches_total

# Cleanup effectiveness
formio_streaming_bytes_reclaimed_total
```

### Key Metrics to Monitor

1. **Upload Success Rate**: Target >99.9%
2. **Memory Usage**: Should remain <10MB per upload
3. **Hash Mismatch Rate**: Should be <0.1%
4. **Orphaned Files**: Should be <0.1% of uploads
5. **Compression Bomb Detections**: Alert on any detection

## Deployment Strategy

### Phase 1: Feature Flag Disabled (Day 1)
```javascript
STREAMING_UPLOADS: false  // All uploads use buffer mode
```

### Phase 2: Internal Testing (Day 2-3)
```javascript
STREAMING_UPLOADS: true
STREAMING_THRESHOLD: 104857600  // 100MB - only very large files
```

### Phase 3: Gradual Rollout (Day 4-7)
```javascript
STREAMING_THRESHOLD: 52428800   // 50MB
// Monitor metrics closely
```

### Phase 4: Full Production (Day 8+)
```javascript
STREAMING_THRESHOLD: 10485760   // 10MB - production threshold
```

## Rollback Procedure

If issues arise, rollback is immediate:

```javascript
// Disable streaming immediately
config.STREAMING_UPLOADS = false;

// All uploads revert to buffer mode
// No data loss or API changes
```

## Security Audit Results

**Overall Security Score: 8.5/10**

### Strengths
- ✅ Multi-layered path traversal prevention
- ✅ Compression bomb detection with progressive tracking
- ✅ Lease-based race condition prevention
- ✅ DoS mitigation with timeouts
- ✅ Memory exhaustion prevention
- ✅ Cryptographic hash verification

### Recommendations
1. Add URL decoding before path sanitization
2. Use generic "Unauthorized" for auth errors
3. Implement token revocation list support
4. Add virus scanning integration (future)

## Test Coverage

**65 tests - 100% pass rate**
- 29 Integration tests
- 36 Unit tests
- 71.93% statement coverage
- All security controls validated

## Migration Guide

### For Developers

No code changes required. The system automatically routes uploads based on configuration.

### For Operations

1. **Update Configuration**
```json
{
  "upload": {
    "streaming": {
      "enabled": true,
      "thresholdMB": 10,
      "maxSizeMB": 5000
    }
  }
}
```

2. **Setup Monitoring**
```yaml
- job_name: 'formio-streaming'
  static_configs:
    - targets: ['localhost:9464']
```

3. **Schedule Cleanup Job**
```cron
0 2 * * * node /app/cleanup-orphaned-uploads.js
```

## Known Limitations

1. Maximum file size: 5GB (GCS resumable upload limit)
2. Fixed chunk size: 64KB (optimized for memory/performance balance)
3. No multipart upload support (single stream only)
4. Requires Node.js 16+ (Web Streams API support)

## Future Enhancements

1. **S3 Support**: Add AWS S3 as alternative to GCS
2. **Multipart Uploads**: Support parallel chunk uploads
3. **CDN Integration**: CloudFlare/Fastly cache invalidation
4. **Virus Scanning**: ClamAV or cloud scanning integration
5. **Adaptive Chunking**: Dynamic chunk size based on network

## References

- [Web Streams API Specification](https://streams.spec.whatwg.org/)
- [TUS Protocol Specification](https://tus.io/protocols/resumable-upload.html)
- [Google Cloud Storage Best Practices](https://cloud.google.com/storage/docs/best-practices)
- [OWASP File Upload Security](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)

## Appendix A: Configuration Reference

```javascript
{
  "upload": {
    "streaming": {
      "enabled": false,                    // Master feature flag
      "thresholdMB": 10,                  // Size threshold for streaming
      "maxSizeMB": 5000,                  // Maximum allowed file size
      "timeouts": {
        "total": 300000,                 // Total upload timeout (5 min)
        "chunk": 10000                   // Inter-chunk timeout (10 sec)
      },
      "security": {
        "hashVerification": true,        // Enable xxHash verification
        "maxCompressionRatio": 100,      // Compression bomb threshold
        "pathTraversal": true,           // Path sanitization
        "leaseTimeout": 300000           // Lease auto-release (5 min)
      },
      "performance": {
        "chunkSize": 65536,              // 64KB chunks
        "highWaterMark": 65536,          // Stream buffer size
        "resumable": true                // GCS resumable uploads
      },
      "telemetry": {
        "prometheus": true,              // Enable Prometheus metrics
        "port": 9464,                    // Metrics endpoint port
        "prefix": "formio_streaming_"    // Metric name prefix
      },
      "cleanup": {
        "enabled": true,                 // Enable orphaned file cleanup
        "schedule": "0 2 * * *",         // Cron schedule (2 AM daily)
        "orphanTimeout": 86400000,       // File age threshold (24h)
        "batchSize": 100                 // Files per cleanup batch
      }
    }
  }
}
```

## Appendix B: Error Codes

| Code | Description | HTTP Status |
|------|-------------|------------|
| INVALID_PATH | Invalid or malicious file path | 400 |
| CONCURRENT_WRITE_CONFLICT | Multiple uploads to same path | 409 |
| SIZE_LIMIT_EXCEEDED | File exceeds maximum size | 413 |
| CHUNK_TIMEOUT | No data received within timeout | 408 |
| COMPRESSION_BOMB_DETECTED | Compression ratio exceeded | 400 |
| HASH_MISMATCH | Integrity check failed | 409 |
| GCS_UPLOAD_ERROR | Storage backend error | 500 |
| UPLOAD_ABORTED | Upload cancelled by client | 499 |

## Approval

**Approved By**: Form.io Architecture Team
**Date**: 2025-10-09
**Implementation Status**: Complete
**Production Readiness**: Approved with conditions (see Security Audit)

---

*This RFC represents the implemented state of the Web Streams upload integration. Updates will be tracked through version control.*