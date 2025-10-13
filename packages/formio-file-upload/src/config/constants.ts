/**
 * Shared constants for file upload components
 * Single source of truth for configuration values
 */

export const UPLOAD_CONSTANTS = {
  // TUS Configuration
  DEFAULT_TUS_ENDPOINT: 'http://localhost:1080/files/',
  DEFAULT_CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
  RETRY_DELAYS: [0, 1000, 3000, 5000] as const,

  // File Restrictions
  DEFAULT_MAX_FILES: 20,
  DEFAULT_MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  DEFAULT_ALLOWED_TYPES: ['image/*', 'video/*'] as const,

  // Image Compression
  DEFAULT_COMPRESSION_QUALITY: 0.8,
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
  COMPRESSION_CONVERT_SIZE: 1000000,
  COMPRESSION_MIME_TYPE: 'image/jpeg' as const,

  // Features
  DEFAULT_PERSISTENCE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  GEOLOCATION_TIMEOUT: 10000, // 10 seconds
  GEOLOCATION_MAX_AGE: 0,
} as const;

export type UploadConstants = typeof UPLOAD_CONSTANTS;
