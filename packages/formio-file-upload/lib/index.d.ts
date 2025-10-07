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
export { TusFileUploadComponent, UppyFileUploadComponent, FileStorageProvider };
export { registerTemplates, registerValidators };
declare const FormioFileUploadModule: {
    components: {
        tusupload: typeof TusFileUploadComponent;
        uppyupload: typeof UppyFileUploadComponent;
    };
};
export default FormioFileUploadModule;
export * from './types';
//# sourceMappingURL=index.d.ts.map