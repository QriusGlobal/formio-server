/**
 * Test Selectors - Centralized selectors for E2E tests
 *
 * USE THIS INSTEAD OF HARDCODED SELECTORS!
 * This file provides consistent, maintainable selectors across all tests.
 *
 * All selectors use data-testid attributes for maximum stability across UI changes.
 */

/**
 * Centralized Test IDs - Use these constants in your tests
 */
export const TEST_IDS = {
  // Navigation
  NAV_FILE_UPLOAD_DEMO: 'nav-file-upload-demo',
  NAV_MODULE_DEMO: 'nav-module-demo',
  NAV_COMPARISON: 'nav-comparison',
  NAV_FORMIO_TUS_DEMO: 'nav-formio-tus-demo',
  NAV_LOCAL_FORMIO: 'nav-local-formio',
  NAV_VALIDATION: 'nav-validation',
  NAV_TESTING: 'nav-testing',

  // UppyDemo Component
  UPPY_DEMO_CONTAINER: 'uppy-demo-container',
  UPPY_DEMO_HEADER: 'uppy-demo-header',
  PLUGIN_CATEGORIES: 'plugin-categories',
  PLUGIN_CATEGORY: (category: string) => `plugin-category-${category}`,
  PLUGIN_GRID: (category: string) => `plugin-grid-${category}`,
  PLUGIN_CARD: (pluginId: string) => `plugin-card-${pluginId}`,
  PLUGIN_TOGGLE: (pluginId: string) => `plugin-toggle-${pluginId}`,
  PLUGIN_DETAIL: 'plugin-detail',
  PLUGIN_DETAIL_HEADER: 'plugin-detail-header',
  PLUGIN_DETAIL_CONTENT: 'plugin-detail-content',
  PLUGIN_DETAIL_FEATURES: 'plugin-detail-features',
  PLUGIN_DETAIL_CODE: 'plugin-detail-code',
  PLUGIN_CODE_EXAMPLE: 'plugin-code-example',
  ENABLED_PLUGINS_SUMMARY: 'enabled-plugins-summary',
  PLUGIN_COUNT: 'plugin-count',
  CONFIG_CODE_PREVIEW: 'config-code-preview',

  // FileUploadDemo Component
  FILE_UPLOAD_DEMO: 'file-upload-demo',
  UPLOAD_TAB_BUTTONS: 'upload-tab-buttons',
  TAB_TUS_UPLOAD: 'tab-tus-upload',
  TAB_UPPY_UPLOAD: 'tab-uppy-upload',
  TUS_UPLOAD_CONTAINER: 'tus-upload-container',
  TUS_FILE_INPUT: 'tus-file-input',
  TUS_UPLOAD_STATUS: 'tus-upload-status',
  UPPY_UPLOAD_CONTAINER: 'uppy-upload-container',

  // FormioModuleDemo Component
  FORMIO_MODULE_DEMO: 'formio-module-demo',
  FORMIO_APPLICATION_FORM_CARD: 'formio-application-form-card',
  FORMIO_FORM_CONTAINER: 'formio-form-container',
  FORMIO_FEATURES_CARD: 'formio-features-card',
  FORMIO_FEATURES_LIST: 'formio-features-list',
  FORMIO_SUBMISSION_RESULT: 'formio-submission-result',
  FORMIO_SUBMISSION_DATA: 'formio-submission-data',

  // FormioTusDemo Component
  FORMIO_TUS_DEMO: 'formio-tus-demo',
  FORMIO_TUS_HEADER: 'formio-tus-header',
  FORMIO_TUS_STATUS_MESSAGE: 'formio-tus-status-message',
  FORMIO_TUS_FORM_WRAPPER: 'formio-tus-form-wrapper',
  FORMIO_TUS_SUBMISSION_RESULT: 'formio-tus-submission-result',
  FORMIO_TUS_RESET_BUTTON: 'formio-tus-reset-button',
  FORMIO_TUS_SUBMISSION_DATA: 'formio-tus-submission-data',
  FORMIO_TUS_UPLOADED_FILES: 'formio-tus-uploaded-files',
  FORMIO_TUS_FILE_LIST: 'formio-tus-file-list',

  // Uppy Dashboard (Generic)
  UPPY_DASHBOARD: 'uppy-dashboard',
  UPPY_FILE_INPUT: 'uppy-file-input',
  UPPY_UPLOAD_BUTTON: 'uppy-upload-button',
  UPPY_CANCEL_BUTTON: 'uppy-cancel-button',
  UPPY_PAUSE_BUTTON: 'uppy-pause-button',
  UPPY_RESUME_BUTTON: 'uppy-resume-button',
  UPPY_PROGRESS_BAR: 'uppy-progress-bar',
  UPPY_PROGRESS_TEXT: 'uppy-progress-text',
  UPPY_FILE_CARD: 'uppy-file-card',
  UPPY_REMOVE_FILE: 'uppy-remove-file',
  UPPY_CLEAR_ALL: 'uppy-clear-all',
  UPPY_DROP_ZONE: 'uppy-drop-zone',
  UPPY_STATUS_BAR: 'uppy-status-bar',
  UPPY_THUMBNAIL: 'uppy-thumbnail',
  UPPY_FILE_NAME: 'uppy-file-name',
  UPPY_FILE_SIZE: 'uppy-file-size',
  UPPY_EMPTY_STATE: 'uppy-empty-state',

  // Uppy Plugins
  UPPY_WEBCAM_BUTTON: 'uppy-webcam-button',
  UPPY_SCREEN_CAPTURE_BUTTON: 'uppy-screen-capture-button',
  UPPY_IMAGE_EDITOR_BUTTON: 'uppy-image-editor-button',
  UPPY_AUDIO_BUTTON: 'uppy-audio-button',
  UPPY_URL_IMPORT_BUTTON: 'uppy-url-import-button',

  // Form.io Generic
  FORMIO_FORM: 'formio-form',
  FORMIO_SUBMIT: 'formio-submit',
  FORMIO_RESET: 'formio-reset',
  FORMIO_FIELD: (name: string) => `formio-field-${name}`,
  FORMIO_ERROR: 'formio-error',
  FORMIO_VALIDATION_ERROR: 'formio-validation-error',
  FORMIO_TUS_COMPONENT: (fieldName: string) => `formio-tus-${fieldName}`,
  FORMIO_UPPY_COMPONENT: (fieldName: string) => `formio-uppy-${fieldName}`,

  // Status Indicators
  UPLOAD_STATUS: 'upload-status',
  UPLOAD_PROGRESS: 'upload-progress',
  UPLOAD_WARNING: 'upload-warning',
  UPLOAD_ERROR: 'upload-error',
  UPLOAD_SUCCESS: 'upload-success',
} as const;

/**
 * File input selector for Uppy Dashboard
 * Uses data-testid attribute for reliable test automation
 */
export const UPPY_FILE_INPUT_SELECTOR = `[data-testid="${TEST_IDS.UPPY_FILE_INPUT}"]`;

/**
 * Alternative: Use native file input selector (deprecated, use UPPY_FILE_INPUT_SELECTOR instead)
 * @deprecated Use UPPY_FILE_INPUT_SELECTOR for better reliability
 */
export const LEGACY_FILE_INPUT_SELECTOR = 'input[type="file"]';

/**
 * Centralized test selectors using reliable data-testid attributes
 *
 * These selectors are designed to be stable across UI changes and provide
 * better test reliability than CSS class selectors.
 */
export const SELECTORS = {
  // Navigation
  navigation: {
    fileUploadDemo: `[data-testid="${TEST_IDS.NAV_FILE_UPLOAD_DEMO}"]`,
    moduleDemo: `[data-testid="${TEST_IDS.NAV_MODULE_DEMO}"]`,
    comparison: `[data-testid="${TEST_IDS.NAV_COMPARISON}"]`,
    formioTusDemo: `[data-testid="${TEST_IDS.NAV_FORMIO_TUS_DEMO}"]`,
    localFormio: `[data-testid="${TEST_IDS.NAV_LOCAL_FORMIO}"]`,
    validation: `[data-testid="${TEST_IDS.NAV_VALIDATION}"]`,
    testing: `[data-testid="${TEST_IDS.NAV_TESTING}"]`,
  },

  // UppyDemo Component
  uppyDemo: {
    container: `[data-testid="${TEST_IDS.UPPY_DEMO_CONTAINER}"]`,
    header: `[data-testid="${TEST_IDS.UPPY_DEMO_HEADER}"]`,
    categories: `[data-testid="${TEST_IDS.PLUGIN_CATEGORIES}"]`,
    category: (id: string) => `[data-testid="${TEST_IDS.PLUGIN_CATEGORY(id)}"]`,
    pluginGrid: (category: string) => `[data-testid="${TEST_IDS.PLUGIN_GRID(category)}"]`,
    pluginCard: (id: string) => `[data-testid="${TEST_IDS.PLUGIN_CARD(id)}"]`,
    pluginToggle: (id: string) => `[data-testid="${TEST_IDS.PLUGIN_TOGGLE(id)}"]`,
    detail: `[data-testid="${TEST_IDS.PLUGIN_DETAIL}"]`,
    detailHeader: `[data-testid="${TEST_IDS.PLUGIN_DETAIL_HEADER}"]`,
    detailContent: `[data-testid="${TEST_IDS.PLUGIN_DETAIL_CONTENT}"]`,
    detailFeatures: `[data-testid="${TEST_IDS.PLUGIN_DETAIL_FEATURES}"]`,
    detailCode: `[data-testid="${TEST_IDS.PLUGIN_DETAIL_CODE}"]`,
    codeExample: `[data-testid="${TEST_IDS.PLUGIN_CODE_EXAMPLE}"]`,
    summary: `[data-testid="${TEST_IDS.ENABLED_PLUGINS_SUMMARY}"]`,
    pluginCount: `[data-testid="${TEST_IDS.PLUGIN_COUNT}"]`,
    configPreview: `[data-testid="${TEST_IDS.CONFIG_CODE_PREVIEW}"]`,
  },

  // FileUploadDemo Component
  fileUploadDemo: {
    container: `[data-testid="${TEST_IDS.FILE_UPLOAD_DEMO}"]`,
    tabButtons: `[data-testid="${TEST_IDS.UPLOAD_TAB_BUTTONS}"]`,
    tusTab: `[data-testid="${TEST_IDS.TAB_TUS_UPLOAD}"]`,
    uppyTab: `[data-testid="${TEST_IDS.TAB_UPPY_UPLOAD}"]`,
    tusContainer: `[data-testid="${TEST_IDS.TUS_UPLOAD_CONTAINER}"]`,
    tusFileInput: `[data-testid="${TEST_IDS.TUS_FILE_INPUT}"]`,
    tusStatus: `[data-testid="${TEST_IDS.TUS_UPLOAD_STATUS}"]`,
    uppyContainer: `[data-testid="${TEST_IDS.UPPY_UPLOAD_CONTAINER}"]`,
  },

  // FormioModuleDemo Component
  formioModuleDemo: {
    container: `[data-testid="${TEST_IDS.FORMIO_MODULE_DEMO}"]`,
    formCard: `[data-testid="${TEST_IDS.FORMIO_APPLICATION_FORM_CARD}"]`,
    formContainer: `[data-testid="${TEST_IDS.FORMIO_FORM_CONTAINER}"]`,
    featuresCard: `[data-testid="${TEST_IDS.FORMIO_FEATURES_CARD}"]`,
    featuresList: `[data-testid="${TEST_IDS.FORMIO_FEATURES_LIST}"]`,
    submissionResult: `[data-testid="${TEST_IDS.FORMIO_SUBMISSION_RESULT}"]`,
    submissionData: `[data-testid="${TEST_IDS.FORMIO_SUBMISSION_DATA}"]`,
  },

  // FormioTusDemo Component
  formioTusDemo: {
    container: `[data-testid="${TEST_IDS.FORMIO_TUS_DEMO}"]`,
    header: `[data-testid="${TEST_IDS.FORMIO_TUS_HEADER}"]`,
    statusMessage: `[data-testid="${TEST_IDS.FORMIO_TUS_STATUS_MESSAGE}"]`,
    formWrapper: `[data-testid="${TEST_IDS.FORMIO_TUS_FORM_WRAPPER}"]`,
    submissionResult: `[data-testid="${TEST_IDS.FORMIO_TUS_SUBMISSION_RESULT}"]`,
    resetButton: `[data-testid="${TEST_IDS.FORMIO_TUS_RESET_BUTTON}"]`,
    submissionData: `[data-testid="${TEST_IDS.FORMIO_TUS_SUBMISSION_DATA}"]`,
    uploadedFiles: `[data-testid="${TEST_IDS.FORMIO_TUS_UPLOADED_FILES}"]`,
    fileList: `[data-testid="${TEST_IDS.FORMIO_TUS_FILE_LIST}"]`,
  },

  // Uppy Dashboard (Generic)
  uppy: {
    dashboard: `[data-testid="${TEST_IDS.UPPY_DASHBOARD}"]`,
    fileInput: UPPY_FILE_INPUT_SELECTOR,
    uploadButton: `[data-testid="${TEST_IDS.UPPY_UPLOAD_BUTTON}"]`,
    cancelButton: `[data-testid="${TEST_IDS.UPPY_CANCEL_BUTTON}"]`,
    pauseButton: `[data-testid="${TEST_IDS.UPPY_PAUSE_BUTTON}"]`,
    resumeButton: `[data-testid="${TEST_IDS.UPPY_RESUME_BUTTON}"]`,
    progressBar: `[data-testid="${TEST_IDS.UPPY_PROGRESS_BAR}"]`,
    progressText: `[data-testid="${TEST_IDS.UPPY_PROGRESS_TEXT}"]`,
    fileCard: `[data-testid="${TEST_IDS.UPPY_FILE_CARD}"]`,
    removeFileButton: `[data-testid="${TEST_IDS.UPPY_REMOVE_FILE}"]`,
    clearAllButton: `[data-testid="${TEST_IDS.UPPY_CLEAR_ALL}"]`,
    dropZone: `[data-testid="${TEST_IDS.UPPY_DROP_ZONE}"]`,
    statusBar: `[data-testid="${TEST_IDS.UPPY_STATUS_BAR}"]`,
    thumbnail: `[data-testid="${TEST_IDS.UPPY_THUMBNAIL}"]`,
    fileName: `[data-testid="${TEST_IDS.UPPY_FILE_NAME}"]`,
    fileSize: `[data-testid="${TEST_IDS.UPPY_FILE_SIZE}"]`,
    emptyState: `[data-testid="${TEST_IDS.UPPY_EMPTY_STATE}"]`,

    // Plugins
    webcamButton: `[data-testid="${TEST_IDS.UPPY_WEBCAM_BUTTON}"]`,
    screenCaptureButton: `[data-testid="${TEST_IDS.UPPY_SCREEN_CAPTURE_BUTTON}"]`,
    imageEditorButton: `[data-testid="${TEST_IDS.UPPY_IMAGE_EDITOR_BUTTON}"]`,
    audioButton: `[data-testid="${TEST_IDS.UPPY_AUDIO_BUTTON}"]`,
    urlImportButton: `[data-testid="${TEST_IDS.UPPY_URL_IMPORT_BUTTON}"]`,
  },

  // Form.io Components (Generic)
  formio: {
    form: `[data-testid="${TEST_IDS.FORMIO_FORM}"]`,
    submitButton: `[data-testid="${TEST_IDS.FORMIO_SUBMIT}"]`,
    resetButton: `[data-testid="${TEST_IDS.FORMIO_RESET}"]`,
    field: (name: string) => `[data-testid="${TEST_IDS.FORMIO_FIELD(name)}"]`,
    error: `[data-testid="${TEST_IDS.FORMIO_ERROR}"]`,
    validationError: `[data-testid="${TEST_IDS.FORMIO_VALIDATION_ERROR}"]`,
    tusComponent: (fieldName: string) => `[data-testid="${TEST_IDS.FORMIO_TUS_COMPONENT(fieldName)}"]`,
    uppyComponent: (fieldName: string) => `[data-testid="${TEST_IDS.FORMIO_UPPY_COMPONENT(fieldName)}"]`,
  },

  // Status indicators
  status: {
    uploadStatus: `[data-testid="${TEST_IDS.UPLOAD_STATUS}"]`,
    uploadProgress: `[data-testid="${TEST_IDS.UPLOAD_PROGRESS}"]`,
    uploadWarning: `[data-testid="${TEST_IDS.UPLOAD_WARNING}"]`,
    uploadError: `[data-testid="${TEST_IDS.UPLOAD_ERROR}"]`,
    uploadSuccess: `[data-testid="${TEST_IDS.UPLOAD_SUCCESS}"]`,
  },

  // Legacy CSS selectors (fallback for components not yet updated)
  legacy: {
    uppyDashboard: '.uppy-Dashboard',
    uppyProgressBar: '.uppy-ProgressBar',
    uppyFileCard: '.uppy-Dashboard-Item',
    formioForm: '.formio-form',
    formioSubmit: '.formio-button-submit',
    tusUploadButton: 'button:has-text("TUS Upload")',
  },
} as const;

/**
 * Helper to get selector with fallback to legacy
 */
export function getSelector(primary: string, fallback?: string): string {
  return primary;
}

/**
 * Wait for element by test ID
 */
export async function waitForTestId(page: any, testId: string, timeout = 5000) {
  await page.waitForSelector(`[data-testid="${testId}"]`, { timeout });
}

/**
 * Check if element with test ID exists
 */
export async function hasTestId(page: any, testId: string): Promise<boolean> {
  const element = page.locator(`[data-testid="${testId}"]`);
  return element.count() > 0;
}

/**
 * Helper function to get file input locator
 * @param page - Playwright page object
 * @returns Locator for file input
 */
export function getFileInputLocator(page: any) {
  return page.locator(UPPY_FILE_INPUT_SELECTOR);
}
