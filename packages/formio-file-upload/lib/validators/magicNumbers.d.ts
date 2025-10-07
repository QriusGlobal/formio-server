/**
 * Magic Number (File Signature) Verification
 *
 * Validates file types by inspecting actual file content (magic numbers)
 * to prevent MIME type spoofing attacks.
 *
 * Security: Prevents attackers from uploading malicious files by changing
 * the MIME type or file extension.
 */
export interface FileSignature {
    mime: string;
    signatures: (number | null)[][];
    description: string;
}
/**
 * File type signatures (magic numbers)
 * Each signature is an array of byte values at the start of the file
 */
export declare const FILE_SIGNATURES: Record<string, FileSignature>;
/**
 * Verify file type by checking magic numbers
 *
 * @param file - File to verify
 * @param expectedType - Expected MIME type
 * @returns Promise<boolean> - True if file matches expected type
 */
export declare function verifyFileType(file: File, expectedType: string): Promise<boolean>;
/**
 * Verify multiple file types (for files with ambiguous extensions)
 *
 * @param file - File to verify
 * @param allowedTypes - Array of allowed MIME types
 * @returns Promise<string | null> - Detected MIME type or null if no match
 */
export declare function detectFileType(file: File, allowedTypes: string[]): Promise<string | null>;
/**
 * Get human-readable file type description
 *
 * @param mimeType - MIME type
 * @returns string - Description or MIME type
 */
export declare function getFileTypeDescription(mimeType: string): string;
/**
 * Check if file type has magic number support
 *
 * @param mimeType - MIME type to check
 * @returns boolean - True if signatures are defined
 */
export declare function hasSignatureSupport(mimeType: string): boolean;
//# sourceMappingURL=magicNumbers.d.ts.map