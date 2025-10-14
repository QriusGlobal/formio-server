/**
 * Magic Number (File Signature) Verification
 *
 * Validates file types by inspecting actual file content (magic numbers)
 * to prevent MIME type spoofing attacks.
 *
 * Security: Prevents attackers from uploading malicious files by changing
 * the MIME type or file extension.
 */

import { logger } from '../utils/logger';

export interface FileSignature {
  mime: string;
  signatures: (number | null)[][];
  description: string;
}

/**
 * File type signatures (magic numbers)
 * Each signature is an array of byte values at the start of the file
 */
export const FILE_SIGNATURES: Record<string, FileSignature> = {
  // Images
  'image/jpeg': {
    mime: 'image/jpeg',
    signatures: [
      [0xff, 0xd8, 0xff, 0xdb], // JPEG raw
      [0xff, 0xd8, 0xff, 0xe0], // JPEG JFIF
      [0xff, 0xd8, 0xff, 0xe1], // JPEG EXIF
      [0xff, 0xd8, 0xff, 0xe2], // JPEG still
      [0xff, 0xd8, 0xff, 0xe3], // JPEG Samsung
    ],
    description: 'JPEG Image',
  },
  'image/png': {
    mime: 'image/png',
    signatures: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    description: 'PNG Image',
  },
  'image/gif': {
    mime: 'image/gif',
    signatures: [
      [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
      [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
    ],
    description: 'GIF Image',
  },
  'image/webp': {
    mime: 'image/webp',
    signatures: [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50]],
    description: 'WebP Image',
  },
  'image/bmp': {
    mime: 'image/bmp',
    signatures: [[0x42, 0x4d]],
    description: 'BMP Image',
  },
  'image/tiff': {
    mime: 'image/tiff',
    signatures: [
      [0x49, 0x49, 0x2a, 0x00], // Little-endian
      [0x4d, 0x4d, 0x00, 0x2a], // Big-endian
    ],
    description: 'TIFF Image',
  },

  // Documents
  'application/pdf': {
    mime: 'application/pdf',
    signatures: [
      [0x25, 0x50, 0x44, 0x46, 0x2d], // %PDF-
    ],
    description: 'PDF Document',
  },

  // Archives
  'application/zip': {
    mime: 'application/zip',
    signatures: [
      [0x50, 0x4b, 0x03, 0x04], // ZIP local file header
      [0x50, 0x4b, 0x05, 0x06], // ZIP empty archive
      [0x50, 0x4b, 0x07, 0x08], // ZIP spanned archive
    ],
    description: 'ZIP Archive',
  },
  'application/x-rar-compressed': {
    mime: 'application/x-rar-compressed',
    signatures: [
      [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00], // RAR v1.5+
      [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00], // RAR v5.0+
    ],
    description: 'RAR Archive',
  },
  'application/x-7z-compressed': {
    mime: 'application/x-7z-compressed',
    signatures: [[0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]],
    description: '7-Zip Archive',
  },

  // Microsoft Office (ZIP-based)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    signatures: [
      [0x50, 0x4b, 0x03, 0x04], // ZIP (needs content inspection)
    ],
    description: 'Microsoft Word Document (DOCX)',
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    signatures: [
      [0x50, 0x4b, 0x03, 0x04], // ZIP (needs content inspection)
    ],
    description: 'Microsoft Excel Spreadsheet (XLSX)',
  },

  // Video
  'video/mp4': {
    mime: 'video/mp4',
    signatures: [
      [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70], // ftyp
    ],
    description: 'MP4 Video',
  },
  'video/webm': {
    mime: 'video/webm',
    signatures: [[0x1a, 0x45, 0xdf, 0xa3]],
    description: 'WebM Video',
  },

  // Audio
  'audio/mpeg': {
    mime: 'audio/mpeg',
    signatures: [
      [0xff, 0xfb], // MP3 with MPEG-1 Layer 3
      [0xff, 0xf3], // MP3 with MPEG-2 Layer 3
      [0xff, 0xf2], // MP3 with MPEG-2.5 Layer 3
      [0x49, 0x44, 0x33], // MP3 with ID3v2
    ],
    description: 'MP3 Audio',
  },
  'audio/wav': {
    mime: 'audio/wav',
    signatures: [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x41, 0x56, 0x45]],
    description: 'WAV Audio',
  },
};

/**
 * Verify file type by checking magic numbers
 *
 * @param file - File to verify
 * @param expectedType - Expected MIME type
 * @returns Promise<boolean> - True if file matches expected type
 */
export async function verifyFileType(file: File, expectedType: string): Promise<boolean> {
  try {
    // Get file signature from database
    // eslint-disable-next-line security/detect-object-injection -- Safe: expectedType is MIME type from controlled source (file.type)
    const signature = FILE_SIGNATURES[expectedType];

    // If no signature defined, allow the file (fallback to MIME check only)
    if (!signature) {
      logger.warn(`[Security] No signature defined for MIME type: ${expectedType}`);
      return true;
    }

    // Read enough bytes to check signature (12 bytes covers most formats)
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check if file matches any of the valid signatures
    const isValid = signature.signatures.some((sig) => matchesSignature(bytes, sig));

    if (!isValid) {
      logger.warn(`[Security] File signature mismatch for ${file.name}`, {
        declaredType: expectedType,
        fileBytes: Array.from(bytes.slice(0, 8))
          .map((b) => `0x${b.toString(16).toUpperCase().padStart(2, '0')}`)
          .join(' '),
        expectedSignatures: signature.signatures.map((s) =>
          s
            .map((b) => (b === null ? 'XX' : `0x${b.toString(16).toUpperCase().padStart(2, '0')}`))
            .join(' ')
        ),
      });
    }

    return isValid;
  } catch (error) {
    logger.error('[Security] Error verifying file type:', { error });
    // Fail securely: reject file if verification fails
    return false;
  }
}

/**
 * Check if file bytes match a signature pattern
 *
 * @param bytes - File bytes to check
 * @param signature - Expected signature (null = any byte)
 * @returns boolean - True if matches
 */
function matchesSignature(bytes: Uint8Array, signature: (number | null)[]): boolean {
  return signature.every((expectedByte, index) => {
    // null means "any byte" (wildcard)
    if (expectedByte === null) {
      return true;
    }
    // Check if byte matches
    // eslint-disable-next-line security/detect-object-injection -- Safe: index is from Array.every(), bounded by signature length
    return bytes[index] === expectedByte;
  });
}

/**
 * Verify multiple file types (for files with ambiguous extensions)
 *
 * @param file - File to verify
 * @param allowedTypes - Array of allowed MIME types
 * @returns Promise<string | null> - Detected MIME type or null if no match
 */
export async function detectFileType(file: File, allowedTypes: string[]): Promise<string | null> {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check each allowed type
    for (const mimeType of allowedTypes) {
      // eslint-disable-next-line security/detect-object-injection -- Safe: mimeType from allowedTypes parameter, controlled by application
      const signature = FILE_SIGNATURES[mimeType];
      if (!signature) continue;

      const matches = signature.signatures.some((sig) => matchesSignature(bytes, sig));

      if (matches) {
        return mimeType;
      }
    }

    return null;
  } catch (error) {
    logger.error('[Security] Error detecting file type:', { error });
    return null;
  }
}

/**
 * Get human-readable file type description
 *
 * @param mimeType - MIME type
 * @returns string - Description or MIME type
 */
export function getFileTypeDescription(mimeType: string): string {
  // eslint-disable-next-line security/detect-object-injection -- Safe: mimeType parameter used for lookup in constant dictionary
  const signature = FILE_SIGNATURES[mimeType];
  return signature?.description || mimeType;
}

/**
 * Check if file type has magic number support
 *
 * @param mimeType - MIME type to check
 * @returns boolean - True if signatures are defined
 */
export function hasSignatureSupport(mimeType: string): boolean {
  return mimeType in FILE_SIGNATURES;
}
