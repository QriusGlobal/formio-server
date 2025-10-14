/**
 * TUS File Upload Component for Form.io
 *
 * Extends Form.io's base File component to provide TUS resumable upload capabilities
 */
import { type ComponentSchema, type UploadFile } from '../../types';
declare const FileComponent: any;
export default class TusFileUploadComponent extends FileComponent {
    tusUpload: any;
    currentFile: UploadFile | null;
    private uploadQueue;
    private isUploading;
    private rafPending;
    private cachedTusConfig;
    static schema(...extend: any[]): ComponentSchema;
    static get builderInfo(): {
        title: string;
        icon: string;
        group: string;
        documentation: string;
        weight: number;
        schema: ComponentSchema;
    };
    static editForm(): any;
    constructor(component: any, options: any, data: any);
    init(): void;
    private initializeTusClient;
    private getHeaders;
    private getMetadata;
    attach(element: HTMLElement): any;
    upload(files: File[]): Promise<any[]>;
    private validateFile;
    private parseFileSize;
    private parseFilePattern;
    private uploadFile;
    private updateProgress;
    pauseUpload(): void;
    resumeUpload(): void;
    cancelUpload(): void;
    private generateFileId;
    getValue(): any;
    setValue(value: any, flags?: any): any;
    getValueAsString(value: any): string;
    getView(value: any): string;
}
export {};
//# sourceMappingURL=Component.d.ts.map