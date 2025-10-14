/**
 * Form.io File Upload Module
 *
 * Provides enterprise-grade file upload capabilities for Form.io
 * using TUS resumable upload protocol and Uppy.js UI
 */

import MultiImageUploadComponent from './components/MultiImageUpload/Component';
import TusFileUploadComponent from './components/TusFileUpload/Component';
import UppyFileUploadComponent from './components/UppyFileUpload/Component';
import FileStorageProvider from './providers/FileStorageProvider';
import { registerTemplates } from './templates';
import { registerValidators } from './validators';

// Export individual components for direct use
export {
  TusFileUploadComponent,
  UppyFileUploadComponent,
  MultiImageUploadComponent,
  FileStorageProvider,
};

// Export utility functions
export { registerTemplates, registerValidators };

// Export validators for use in React components
export {
  verifyFileType,
  detectFileType,
  hasSignatureSupport,
  FILE_SIGNATURES,
} from './validators/magicNumbers';
export { sanitizeFilename } from './validators/sanitizeFilename';

// Export logger utility
export { logger } from './utils/logger';
export type { LogMetadata } from './utils/logger';

// Export upload constants
export { UPLOAD_CONSTANTS } from './config/constants';
export type { UploadConstants } from './config/constants';

// Module definition following Form.io module specification
// Form.io only supports 'components' property in modules
const FormioFileUploadModule = {
  components: {
    tusupload: TusFileUploadComponent,
    uppyupload: UppyFileUploadComponent,
    multiimageupload: MultiImageUploadComponent,
  },
};

// Default export for Formio.use()
export default FormioFileUploadModule;

// Type definitions
export * from './types';
