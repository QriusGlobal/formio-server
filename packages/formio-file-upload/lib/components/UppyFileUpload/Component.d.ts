/**
 * Uppy File Upload Component for Form.io
 *
 * Provides a rich file upload experience using Uppy.js Dashboard
 */
import Uppy from '@uppy/core';
import { ComponentSchema } from '../../types';
declare const FileComponent: any;
export default class UppyFileUploadComponent extends FileComponent {
    uppy: Uppy | null;
    private dashboardElement;
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
    attach(element: HTMLElement): any;
    private initializeUppy;
    private setupUppyEventHandlers;
    private getHeaders;
    private parseFileSize;
    private parseFilePattern;
    getValue(): any;
    setValue(value: any): void;
    detach(): any;
    destroy(): void;
}
export {};
//# sourceMappingURL=Component.d.ts.map