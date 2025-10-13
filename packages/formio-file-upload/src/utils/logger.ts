/**
 * Production-safe logger for Form.io file upload components
 *
 * Features:
 * - Environment-aware (only logs in development)
 * - Structured logging with metadata
 * - Prepares for production monitoring integration
 */

const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

export interface LogMetadata {
  [key: string]: any;
}

export const logger = {
  /**
   * Log error messages
   */
  error: (msg: string, meta?: LogMetadata): void => {
    if (isDevelopment) {
      console.error(`[ERROR] ${msg}`, meta);
    }
  },

  /**
   * Log warning messages
   */
  warn: (msg: string, meta?: LogMetadata): void => {
    if (isDevelopment) {
      console.warn(`[WARN] ${msg}`, meta);
    }
  },

  /**
   * Log informational messages
   */
  info: (msg: string, meta?: LogMetadata): void => {
    if (isDevelopment) {
      console.log(`[INFO] ${msg}`, meta);
    }
  },

  /**
   * Log debug messages
   */
  debug: (msg: string, meta?: LogMetadata): void => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${msg}`, meta);
    }
  },
};
