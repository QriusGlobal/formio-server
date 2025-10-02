/**
 * Form.io File Upload Module
 *
 * Provides enterprise-grade file upload capabilities for Form.io
 * using TUS resumable upload protocol and Uppy.js UI
 */
import TusFileUploadComponent from './components/TusFileUpload/Component';
import UppyFileUploadComponent from './components/UppyFileUpload/Component';
import FileStorageProvider from './providers/FileStorageProvider';
export { TusFileUploadComponent, UppyFileUploadComponent, FileStorageProvider };
declare const FormioFileUploadModule: {
    name: string;
    components: {
        tusupload: typeof TusFileUploadComponent;
        uppyupload: typeof UppyFileUploadComponent;
    };
    providers: {
        storage: {
            file: typeof FileStorageProvider;
        };
    };
    templates: {
        default: Record<string, any>;
    };
    validators: {
        fileSize: (context: any) => string | true;
        fileType: (context: any) => string | true;
        virusScan: (context: any) => Promise<boolean>;
        imageResolution: (context: any) => boolean;
    };
    init: (Formio: any) => Promise<void>;
};
export default FormioFileUploadModule;
export * from './types';
//# sourceMappingURL=index.d.ts.map