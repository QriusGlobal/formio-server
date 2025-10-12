/**
 * Custom validators for file upload components
 */
export * from './magicNumbers';
export * from './sanitizeFilename';
export * from './fileIntegrity';
export declare function registerValidators(): {
    fileSize: typeof fileSizeValidator;
    fileType: typeof fileTypeValidator;
    virusScan: typeof virusScanValidator;
    imageResolution: typeof imageResolutionValidator;
};
/**
 * Validate file size
 */
declare function fileSizeValidator(context: any): string | true;
/**
 * Validate file type
 */
declare function fileTypeValidator(context: any): string | true;
/**
 * Validate virus scan (placeholder - requires server-side implementation)
 */
declare function virusScanValidator(context: any): Promise<boolean>;
/**
 * Validate image resolution
 */
declare function imageResolutionValidator(context: any): boolean;
//# sourceMappingURL=index.d.ts.map