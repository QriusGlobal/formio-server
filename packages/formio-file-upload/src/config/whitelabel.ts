/**
 * Whitelabeling Configuration
 * 
 * Centralizes all branding-related strings and class names
 * to enable easy rebranding without Form.io exposure
 */

export const WHITELABEL_CONFIG = {
  /**
   * CSS class prefix for all components
   * Change this to rebrand the entire application
   */
  CLASS_PREFIX: 'qrius',

  /**
   * Component container classes (replaces .formio-component-*)
   */
  CLASSES: {
    FORM_CONTAINER: 'qrius-form',
    FIELD_CONTAINER: 'form-field',
    UPLOAD_FIELD: 'form-field-upload',
    UPLOAD_WIDGET: 'qrius-upload-container',
    INPUT_FIELD: 'form-field-input',
    LABEL: 'form-field-label',
  },

  /**
   * Selectors for finding Form.io containers
   * Includes both generic and Form.io-specific for compatibility
   */
  SELECTORS: {
    UPLOAD_AREA: '.form-field-upload, .formio-component-file',
    FILE_COMPONENT: '[data-upload-field], .formio-component-file',
  },

  /**
   * ID patterns (avoid exposing "formio" in element IDs)
   */
  ID_PATTERNS: {
    UPLOAD_CONTAINER: (key: string) => `${key}-upload-widget`,
    REACT_ROOT: (key: string) => `${key}-root`,
  },

  /**
   * Feature flags for whitelabeling
   */
  FEATURES: {
    HIDE_FORMIO_BRANDING: true,
    HIDE_UPPY_BRANDING: true,
    STRIP_DATA_ATTRIBUTES: true,
    USE_GENERIC_CLASS_NAMES: true,
  },

  /**
   * Brand name for user-facing messages
   */
  BRAND_NAME: 'Qrius Platform',

  /**
   * Support/documentation URLs (replaces Form.io links)
   */
  URLS: {
    DOCS: '/docs',
    SUPPORT: '/support',
    API_REFERENCE: '/api',
  },
} as const;

export type WhitelabelConfig = typeof WHITELABEL_CONFIG;
