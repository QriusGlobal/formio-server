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
export const DANGEROUS_EXTENSIONS = [
  // Executables
  '.exe',
  '.com',
  '.bat',
  '.cmd',
  '.sh',
  '.bash',
  '.zsh',

  // Scripts
  '.js',
  '.mjs',
  '.cjs',
  '.vbs',
  '.vbe',
  '.ps1',
  '.psm1',

  // Server-side code
  '.php',
  '.php3',
  '.php4',
  '.php5',
  '.phtml',
  '.phps',
  '.asp',
  '.aspx',
  '.jsp',
  '.jspx',
  '.cgi',
  '.pl',
  '.py',
  '.rb',

  // Configuration files
  '.htaccess',
  '.htpasswd',
  '.ini',
  '.conf',

  // Compressed executables
  '.scr',
  '.pif',
  '.application',
  '.gadget',
  '.msi',
  '.msp',
  '.jar',
  '.war',
  '.ear',

  // Links and shortcuts
  '.lnk',
  '.url',
  '.desktop',

  // Web archives that can execute
  '.hta',
  '.htr',
];

/**
 * Characters that are dangerous in filenames
 */
export const DANGEROUS_CHARS = /[<>:"/\\|?*'\x00-\x1f\x7f]/g;

/**
 * Path traversal patterns
 */
export const PATH_TRAVERSAL = /\.\.[/\\]/g;

/**
 * Maximum safe filename length (POSIX standard is 255 bytes)
 */
export const MAX_FILENAME_LENGTH = 255;

/**
 * Reserved Windows filenames
 */
export const RESERVED_NAMES = [
  'CON',
  'PRN',
  'AUX',
  'NUL',
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'LPT1',
  'LPT2',
  'LPT3',
  'LPT4',
  'LPT5',
  'LPT6',
  'LPT7',
  'LPT8',
  'LPT9',
];

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
export function sanitizeFilename(filename: string, options: SanitizeOptions = {}): string {
  const {
    replacement = '_',
    maxLength = 200,
    preserveExtension = false,
    addTimestamp = true,
    lowercase = false,
    allowUnicode = true,
  } = options;

  if (!filename || typeof filename !== 'string') {
    return generateSafeFallbackName();
  }

  let safe = filename;

  // Remove null bytes (security risk)
  safe = safe.replace(/\0/g, '');

  // Remove any path components (path traversal prevention)
  safe = safe.replace(/^.*[/\\]/, '');

  // Remove path traversal patterns
  safe = safe.replace(PATH_TRAVERSAL, replacement);

  // Split into name and extension
  const lastDotIndex = safe.lastIndexOf('.');
  let name = lastDotIndex > 0 ? safe.substring(0, lastDotIndex) : safe;
  let ext = lastDotIndex > 0 ? safe.substring(lastDotIndex) : '';

  // Convert to lowercase if requested
  if (lowercase) {
    name = name.toLowerCase();
    ext = ext.toLowerCase();
  }

  // Check for dangerous double extensions
  if (!preserveExtension) {
    const dangerousExtFound = DANGEROUS_EXTENSIONS.some((dangerousExt) => {
      const extLower = ext.toLowerCase();
      const nameLower = name.toLowerCase();

      // Check if extension is dangerous
      if (extLower === dangerousExt) {
        return true;
      }

      // Check for double extension (.jpg.php)
      if (nameLower.endsWith(dangerousExt)) {
        return true;
      }

      return false;
    });

    if (dangerousExtFound) {
      console.warn(`[Security] Dangerous extension detected in: ${filename}`);
      // Replace dangerous extension with safe marker
      ext = ext.replace(/\./g, '_') + '.safe';
      name = name.replace(/\./g, '_');
    }
  }

  // Replace dangerous characters in name
  name = name.replace(DANGEROUS_CHARS, replacement);

  // Replace dangerous characters in extension
  ext = ext.replace(DANGEROUS_CHARS, replacement);

  // Remove non-ASCII characters if not allowed
  if (!allowUnicode) {
    name = name.replace(/[^\x00-\x7F]/g, replacement);
    ext = ext.replace(/[^\x00-\x7F]/g, replacement);
  }

  // Remove leading/trailing dots and spaces (Windows compatibility)
  name = name.replace(/^[.\s]+|[.\s]+$/g, '');
  ext = ext.replace(/^[.\s]+|[.\s]+$/g, '');

  // Check for reserved Windows names
  const nameUpper = name.toUpperCase();
  if (RESERVED_NAMES.includes(nameUpper)) {
    console.warn(`[Security] Reserved Windows filename detected: ${name}`);
    name = `file_${name}`;
  }

  // Collapse multiple replacements
  const multipleReplacement = new RegExp(`${escapeRegex(replacement)}{2,}`, 'g');
  name = name.replace(multipleReplacement, replacement);

  // Ensure name is not empty
  if (!name || name === replacement) {
    name = 'unnamed';
  }

  // Add timestamp to prevent collisions
  if (addTimestamp) {
    const timestamp = Date.now();
    name = `${name}_${timestamp}`;
  }

  // Enforce length limit (leave room for extension)
  const maxNameLength = Math.min(maxLength, MAX_FILENAME_LENGTH - ext.length - 1);
  if (name.length > maxNameLength) {
    name = name.substring(0, maxNameLength);
    // Remove trailing replacement character
    name = name.replace(new RegExp(`${escapeRegex(replacement)}+$`), '');
  }

  // Ensure extension starts with dot
  if (ext && !ext.startsWith('.')) {
    ext = '.' + ext;
  }

  // Combine name and extension
  const sanitized = name + ext;

  // Final validation
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    console.warn(`[Security] Filename too long after sanitization: ${sanitized.length} bytes`);
    return generateSafeFallbackName();
  }

  // Log if filename was changed significantly
  if (sanitized !== filename) {
    console.info(`[Security] Filename sanitized: "${filename}" -> "${sanitized}"`);
  }

  return sanitized;
}

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
export function validateFilename(
  filename: string,
  _options: ValidationOptions = {}
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!filename || typeof filename !== 'string') {
    errors.push('Filename is empty or invalid');
    return { valid: false, errors };
  }

  // Check for null bytes
  if (filename.includes('\0')) {
    errors.push('Filename contains null bytes');
  }

  // Check for path traversal
  if (PATH_TRAVERSAL.test(filename)) {
    errors.push('Filename contains path traversal patterns');
  }

  // Check for dangerous characters
  if (DANGEROUS_CHARS.test(filename)) {
    errors.push('Filename contains dangerous characters');
  }

  // Check for dangerous extensions
  const filenameLower = filename.toLowerCase();
  const hasDangerousExt = DANGEROUS_EXTENSIONS.some(
    (ext) => filenameLower.endsWith(ext) || filenameLower.includes(ext + '.')
  );

  if (hasDangerousExt) {
    errors.push('Filename contains dangerous extension');
  }

  // Check length
  if (filename.length > MAX_FILENAME_LENGTH) {
    errors.push(`Filename too long (${filename.length} > ${MAX_FILENAME_LENGTH})`);
  }

  // Check for reserved names
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  if (RESERVED_NAMES.includes(nameWithoutExt.toUpperCase())) {
    errors.push('Filename is a reserved system name');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a safe fallback filename
 *
 * @returns Safe filename with timestamp
 */
export function generateSafeFallbackName(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `file_${timestamp}_${random}`;
}

/**
 * Escape special regex characters
 *
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract safe extension from filename
 *
 * @param filename - Filename
 * @returns Extension (with dot) or empty string
 */
export function extractExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) {
    return '';
  }

  let ext = filename.substring(lastDot);

  // Sanitize extension
  ext = ext.replace(DANGEROUS_CHARS, '_');
  ext = ext.toLowerCase();

  // Check if dangerous
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return '.safe';
  }

  return ext;
}

/**
 * Check if extension is in allowed list
 *
 * @param filename - Filename
 * @param allowedExtensions - Array of allowed extensions (with or without dot)
 * @returns boolean
 */
export function hasAllowedExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = extractExtension(filename);
  if (!ext) return false;

  const normalizedAllowed = allowedExtensions.map((e) =>
    e.startsWith('.') ? e.toLowerCase() : '.' + e.toLowerCase()
  );

  return normalizedAllowed.includes(ext);
}
