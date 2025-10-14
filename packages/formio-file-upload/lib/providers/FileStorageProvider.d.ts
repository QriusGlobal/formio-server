/**
 * File Storage Provider for Form.io
 *
 * Abstract provider interface for different storage backends
 */
import type { StorageProvider, UploadFile } from '../types';
export default class FileStorageProvider implements StorageProvider {
    name: string;
    title: string;
    private config;
    constructor(config?: any);
    uploadFile(file: File, options?: any): Promise<UploadFile>;
    downloadFile(file: UploadFile): Promise<Blob>;
    deleteFile(file: UploadFile): Promise<void>;
    getFileUrl(file: UploadFile): Promise<string>;
    static register(Formio: any): void;
}
//# sourceMappingURL=FileStorageProvider.d.ts.map