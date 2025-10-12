/**
 * Production-safe logger utility
 * Prevents sensitive data leakage via console in production
 */

const isDevelopment = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV === true;

export const logger = {
  error: (msg: string, meta?: Record<string, any>) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${msg}`, meta);
    }
    // TODO: Send to error tracking service in production (Sentry, etc.)
  },

  warn: (msg: string, meta?: Record<string, any>) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${msg}`, meta);
    }
  },

  info: (msg: string, meta?: Record<string, any>) => {
    if (isDevelopment) {
      console.log(`[INFO] ${msg}`, meta);
    }
  }
};
