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
export { TusFileUploadComponent, UppyFileUploadComponent, MultiImageUploadComponent, FileStorageProvider, };
export { registerTemplates, registerValidators };
export { verifyFileType, detectFileType, hasSignatureSupport, FILE_SIGNATURES, } from './validators/magicNumbers';
export { sanitizeFilename } from './validators/sanitizeFilename';
export { logger } from './utils/logger';
export type { LogMetadata } from './utils/logger';
export { UPLOAD_CONSTANTS } from './config/constants';
export type { UploadConstants } from './config/constants';
declare const FormioFileUploadModule: {
    components: {
        tusupload: typeof TusFileUploadComponent;
        uppyupload: typeof UppyFileUploadComponent;
        multiimageupload: typeof MultiImageUploadComponent;
    };
};
export default FormioFileUploadModule;
export * from './types';
//# sourceMappingURL=index.d.ts.map