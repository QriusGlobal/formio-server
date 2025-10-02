export default class FileComponent extends Field {
    static get builderInfo(): {
        title: string;
        group: string;
        icon: string;
        documentation: string;
        weight: number;
        schema: any;
    };
    static get serverConditionSettings(): {
        operators: string[];
    };
    static get conditionOperatorsSettings(): {
        operators: string[];
    };
    static savedValueTypes(schema: any): string[];
    support: {
        filereader: boolean;
        formdata: boolean;
        hasWarning: boolean;
        progress: boolean;
    } | undefined;
    set cameraMode(value: any);
    get cameraMode(): any;
    set fileDropHidden(value: any);
    get fileDropHidden(): any;
    filesToSync: {
        filesToUpload: never[];
        filesToDelete: never[];
    } | undefined;
    isSyncing: boolean | undefined;
    abortUploads: any[] | undefined;
    get dataReady(): Promise<any>;
    loadImage(fileInfo: any): any;
    get emptyValue(): never[];
    getValueAsString(value: any, options: any): any;
    get defaultValue(): any[];
    get hasTypes(): any;
    _fileBrowseHidden: any;
    get shouldSyncFiles(): boolean;
    get autoSync(): boolean;
    get columnsSize(): {
        name: number;
        size: number;
        type: number;
        actions: number;
    };
    render(): string;
    getVideoStream(constraints: any): any;
    stopVideoStream(videoStream: any): void;
    getFrame(videoPlayer: any): Promise<any>;
    startVideo(): void;
    videoStream: any;
    stopVideo(): void;
    takePicture(): void;
    browseFiles(attrs?: {}): Promise<any>;
    _cameraMode: any;
    get useWebViewCamera(): any;
    get imageUpload(): boolean;
    get browseOptions(): {
        multiple: boolean;
        capture: any;
        accept: any;
    };
    get actions(): {
        abort: (id: any) => void;
    };
    attach(element: any): Promise<void>;
    filesReady: Promise<any> | undefined;
    filesReadyResolve: ((value: any) => void) | undefined;
    filesReadyReject: ((reason?: any) => void) | undefined;
    fileSize(a: any, b: any, c: any, d: any, e: any): string;
    globStringToRegex(str: any): any;
    translateScalars(str: any): any;
    validatePattern(file: any, val: any): boolean;
    validateMinSize(file: any, val: any): boolean;
    validateMaxSize(file: any, val: any): boolean;
    abortRequest(id: any): void;
    handleAction(event: any): void;
    getFileName(file: any): string;
    getInitFileToSync(file: any): {
        id: string;
        dir: any;
        name: string;
        originalName: any;
        fileKey: any;
        storage: any;
        options: any;
        file: any;
        size: any;
        status: string;
        message: string;
        hash: string;
    };
    handleSubmissionRevisions(file: any): Promise<any>;
    validateFileName(file: any): {
        status: string;
        message: string;
    } | {
        status?: undefined;
        message?: undefined;
    };
    validateFileSettings(file: any): {
        status: string;
        message: string;
    } | {
        status?: undefined;
        message?: undefined;
    };
    validateFileService(): {
        status: string;
        message: string;
    } | {
        status?: undefined;
        message?: undefined;
    };
    validateFile(file: any): {
        status: string;
        message: string;
    } | {
        status?: undefined;
        message?: undefined;
    };
    getGroupPermissions(): {
        groupKey: null;
        groupPermissions: null;
    };
    triggerFileProcessor(file: any): Promise<{
        status: string;
        message: string;
        file?: undefined;
    } | {
        file: FormData | null;
        status?: undefined;
        message?: undefined;
    }>;
    prepareFileToUpload(file: any): Promise<number | undefined>;
    prepareFilesToUpload(files: any): Promise<void | void[]>;
    handleFilesToUpload(files: any): Promise<void>;
    prepareFileToDelete(fileInfo: any): void;
    handleFileToRemove(fileInfo: any): void;
    deleteFile(fileInfo: any): Promise<any>;
    delete(): Promise<void | {
        fileToSync: never;
    }[]>;
    updateProgress(fileInfo: any, progressEvent: any): void;
    getMultipartOptions(fileToSync: any): any;
    uploadFile(fileToSync: any): Promise<any>;
    upload(): Promise<void | {
        fileToSync: never;
        fileInfo: any;
    }[]>;
    syncFiles(): Promise<void>;
    getFile(fileInfo: any): any;
    focus(): void;
    beforeSubmit(): Promise<void>;
    destroy(all: any): void;
}
import Field from '../_classes/field/Field';
