/**
 * Form.io File Upload Module
 *
 * Provides enterprise-grade file upload capabilities for Form.io
 * using TUS resumable upload protocol and Uppy.js UI
 */

import TusFileUploadComponent from './components/TusFileUpload/Component';
import UppyFileUploadComponent from './components/UppyFileUpload/Component';
import FileStorageProvider from './providers/FileStorageProvider';
import { registerTemplates } from './templates';
import { registerValidators } from './validators';

// Export individual components for direct use
export { TusFileUploadComponent, UppyFileUploadComponent, FileStorageProvider };

// Module definition following Form.io module specification
const FormioFileUploadModule = {
  // Module name for identification
  name: 'file-upload',

  // Custom components registration
  components: {
    tusupload: TusFileUploadComponent,
    uppyupload: UppyFileUploadComponent
  },

  // Storage providers
  providers: {
    storage: {
      file: FileStorageProvider
    }
  },

  // Template registration hook
  templates: {
    default: registerTemplates('default')
  },

  // Validation rules
  validators: registerValidators(),

  // Module initialization
  init: (Formio: any) => {
    console.log('[FormioFileUpload] Module initialized');

    // Register global configuration if needed
    if (Formio.config) {
      Formio.config.fileUpload = {
        tusEndpoint: '/files',
        maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
        chunkSize: 8 * 1024 * 1024, // 8MB
        allowedTypes: '*',
        ...Formio.config.fileUpload
      };
    }

    // Add global event handlers
    Formio.events.on('fileUploadStart', (data: any) => {
      console.log('[FormioFileUpload] Upload started:', data);
    });

    Formio.events.on('fileUploadComplete', (data: any) => {
      console.log('[FormioFileUpload] Upload completed:', data);
    });

    return Promise.resolve();
  }
};

// Default export for Formio.use()
export default FormioFileUploadModule;

// Type definitions
export * from './types';