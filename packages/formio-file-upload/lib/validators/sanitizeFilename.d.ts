/**
 * Filename Sanitization Utilities
 *
 * Prevents security vulnerabilities related to malicious filenames:
 * - Path traversal attacks (../../etc/passwd)
 * - Double extension attacks (.jpg.php)
 * - Special character exploits
 * - Null byte injection
 * - XSS in filenames
 */
/**
 * Dangerous file extensions that should never be allowed
 */
export declare const DANGEROUS_EXTENSIONS: string[];
/**
 * Characters that are dangerous in filenames
 */
export declare const DANGEROUS_CHARS: RegExp;
/**
 * Path traversal patterns
 */
export declare const PATH_TRAVERSAL: RegExp;
/**
 * Maximum safe filename length (POSIX standard is 255 bytes)
 */
export declare const MAX_FILENAME_LENGTH = 255;
/**
 * Reserved Windows filenames
 */
export declare const RESERVED_NAMES: string[];
export interface SanitizeOptions {
    /**
     * Replace dangerous characters with this string
     * @default '_'
     */
    replacement?: string;
    /**
     * Maximum filename length (without extension)
     * @default 200
     */
    maxLength?: number;
    /**
     * Preserve original extension even if dangerous
     * @default false
     */
    preserveExtension?: boolean;
    /**
     * Add timestamp to prevent collisions
     * @default true
     */
    addTimestamp?: boolean;
    /**
     * Convert to lowercase
     * @default false
     */
    lowercase?: boolean;
    /**
     * Allow Unicode characters
     * @default true
     */
    allowUnicode?: boolean;
}
/**
 * Sanitize filename to prevent security vulnerabilities
 *
 * @param filename - Original filename
 * @param options - Sanitization options
 * @returns Sanitized filename
 */
export declare function sanitizeFilename(filename: string, options?: SanitizeOptions): string;
export interface ValidationOptions {
    /**
     * Validate raw filename without sanitization
     * @default false
     */
    raw?: boolean;
}
/**
 * Check if filename contains dangerous patterns
 *
 * @param filename - Filename to check
 * @param options - Validation options
 * @returns Object with validation result
 */
export declare function validateFilename(filename: string, _options?: ValidationOptions): {
    valid: boolean;
    errors: string[];
};
/**
 * Generate a safe fallback filename
 *
 * @returns Safe filename with timestamp
 */
export declare function generateSafeFallbackName(): string;
/**
 * Extract safe extension from filename
 *
 * @param filename - Filename
 * @returns Extension (with dot) or empty string
 */
export declare function extractExtension(filename: string): string;
/**
 * Check if extension is in allowed list
 *
 * @param filename - Filename
 * @param allowedExtensions - Array of allowed extensions (with or without dot)
 * @returns boolean
 */
export declare function hasAllowedExtension(filename: string, allowedExtensions: string[]): boolean;
//# sourceMappingURL=sanitizeFilename.d.ts.map