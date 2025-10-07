/**
 * Type definitions for Form.io File Upload Module
 */
export interface FileUploadConfig {
    tusEndpoint: string;
    maxFileSize: number;
    chunkSize: number;
    allowedTypes: string | string[];
    storage: 'tus' | 's3' | 'gcs' | 'azure' | 'local';
    privateDownload: boolean;
    imageProcessing?: ImageProcessingConfig;
}
export interface ImageProcessingConfig {
    resize?: {
        width?: number;
        height?: number;
        mode?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    };
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
}
export interface UploadFile {
    id: string;
    name: string;
    originalName?: string;
    size: number;
    type: string;
    uploadId?: string;
    url?: string;
    storage: string;
    metadata?: Record<string, any>;
    progress?: number;
    status: UploadStatus;
    error?: UploadError;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UploadStatus {
    PENDING = "pending",
    UPLOADING = "uploading",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export interface UploadError {
    code: string;
    message: string;
    details?: any;
}
export interface TusConfig {
    endpoint: string;
    retryDelays?: number[];
    parallelUploads?: number;
    chunkSize?: number;
    headers?: Record<string, string>;
    metadata?: Record<string, string>;
    onBeforeRequest?: (req: any) => void;
    onAfterResponse?: (req: any, res: any) => void;
}
export interface UppyConfig {
    autoProceed?: boolean;
    allowMultipleUploadBatches?: boolean;
    restrictions?: {
        maxFileSize?: number;
        minFileSize?: number;
        maxNumberOfFiles?: number;
        minNumberOfFiles?: number;
        allowedFileTypes?: string[];
    };
    meta?: Record<string, any>;
    locale?: string;
}
export interface ComponentSchema {
    type: string;
    key: string;
    label: string;
    storage: string;
    url?: string;
    options?: Record<string, any>;
    validate?: ValidationConfig;
    conditional?: ConditionalConfig;
    customConditional?: string;
    multiple?: boolean;
    filePattern?: string;
    fileMinSize?: string;
    fileMaxSize?: string;
    image?: boolean;
    privateDownload?: boolean;
    imageSize?: number;
    webcam?: boolean;
    fileTypes?: FileType[];
}
export interface ValidationConfig {
    required?: boolean;
    customMessage?: string;
    pattern?: string;
    custom?: string;
    customPrivate?: boolean;
    json?: string;
    minLength?: number;
    maxLength?: number;
    minWords?: number;
    maxWords?: number;
}
export interface ConditionalConfig {
    show?: boolean;
    when?: string;
    eq?: string;
    json?: string;
}
export interface FileType {
    label: string;
    value: string;
}
export interface FormioComponent {
    schema(): ComponentSchema;
    builderInfo: BuilderInfo;
    editForm(): any;
    attach(element: HTMLElement): Promise<any>;
    detach(): void;
    getValue(): any;
    setValue(value: any): void;
    checkValidity(): boolean;
    build(): void;
    destroy(): void;
}
export interface BuilderInfo {
    title: string;
    icon: string;
    group: string;
    documentation?: string;
    weight: number;
    schema: ComponentSchema;
}
export interface StorageProvider {
    name: string;
    title: string;
    uploadFile(file: File, config: any): Promise<UploadFile>;
    downloadFile(file: UploadFile): Promise<Blob>;
    deleteFile(file: UploadFile): Promise<void>;
    getFileUrl(file: UploadFile): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map