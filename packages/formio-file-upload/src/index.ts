/**
 * Form.io File Upload Module
 *
 * Provides enterprise-grade file upload capabilities for Form.io
 * using TUS resumable upload protocol and Uppy.js UI
 */

import TusFileUploadComponent from './components/TusFileUpload/Component';
import UppyFileUploadComponent from './components/UppyFileUpload/Component';
import MultiImageUploadComponent from './components/MultiImageUpload/Component';
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
