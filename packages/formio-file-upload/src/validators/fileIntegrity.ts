/**
 * File Integrity Validator using xxHash (xxh64)
 *
 * WHY xxHash instead of SHA-256:
 * - Speed: 50x faster than SHA-256 (0.5s vs 27s for 6.6GB file)
 * - Performance: ~400 MB/s throughput with WebAssembly
 * - Use Case: Detects accidental corruption (not cryptographic security)
 * - Platform: Works in both browser (WASM) and Node.js
 *
 * Research Sources:
 * - https://xxhash.com/
 * - https://github.com/jungomi/xxhash-wasm
 * - Production usage: Cloudflare Workers, Astro, RSSHub, grpc-node
 */

import xxhash from 'xxhash-wasm';

/**
 * Singleton xxHash API instance for performance
 * Lazy-loaded on first use to avoid blocking app startup
 */
let hashAPI: Awaited<ReturnType<typeof xxhash>> | null = null;

/**
 * Initialize xxHash WASM module
 * Automatically caches for subsequent calls
 */
async function getHashAPI() {
  if (!hashAPI) {
    hashAPI = await xxhash();
  }
  return hashAPI;
}

/**
 * File integrity result
 */
export interface FileIntegrityResult {
  /** Whether the file passed integrity validation */
  valid: boolean;
  /** xxHash checksum (hex string) */
  checksum: string;
  /** File size in bytes */
  size: number;
  /** Processing time in milliseconds */
  processingTime: number;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Options for file integrity checking
 */
export interface FileIntegrityOptions {
  /** Expected checksum (if validating against known value) */
  expectedChecksum?: string;
  /** Chunk size for streaming large files (default: 64KB) */
  chunkSize?: number;
  /** Enable performance logging */
  enableLogging?: boolean;
}

/**
 * Calculate xxHash checksum for a File or Blob
 *
 * Uses streaming API for memory efficiency with large files
 *
 * @example
 * ```typescript
 * const result = await calculateFileChecksum(file);
 * console.log(`Checksum: ${result.checksum}`);
 * console.log(`Time: ${result.processingTime}ms for ${result.size} bytes`);
 * ```
 */
export async function calculateFileChecksum(
  file: File | Blob,
  options: FileIntegrityOptions = {}
): Promise<FileIntegrityResult> {
  const startTime = performance.now();
  const { chunkSize = 64 * 1024, enableLogging = false } = options;

  try {
    const api = await getHashAPI();
    const hasher = api.create64();

    // Stream file in chunks for memory efficiency
    let offset = 0;
    const fileSize = file.size;

    while (offset < fileSize) {
      const chunk = file.slice(offset, Math.min(offset + chunkSize, fileSize));
      const arrayBuffer = await chunk.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      hasher.update(uint8Array);
      offset += chunkSize;
    }

    // digest() returns bigint, convert to hex string manually
    const checksumBigInt = hasher.digest();
    const checksum = checksumBigInt.toString(16).padStart(16, '0');
    const processingTime = performance.now() - startTime;

    if (enableLogging && process.env.NODE_ENV !== 'production') {
      const throughput = fileSize / 1024 / 1024 / (processingTime / 1000);
      console.log(
        `[xxHash] Processed ${(fileSize / 1024 / 1024).toFixed(2)} MB in ${processingTime.toFixed(2)}ms (~${throughput.toFixed(2)} MB/s)`
      );
    }

    return {
      valid: true,
      checksum,
      size: fileSize,
      processingTime,
    };
  } catch (error) {
    return {
      valid: false,
      checksum: '',
      size: file.size,
      processingTime: performance.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate file integrity against expected checksum
 *
 * @example
 * ```typescript
 * const result = await validateFileIntegrity(file, {
 *   expectedChecksum: 'abc123...'
 * });
 *
 * if (result.valid) {
 *   console.log('File integrity verified!');
 * } else {
 *   console.error('Integrity check failed:', result.error);
 * }
 * ```
 */
export async function validateFileIntegrity(
  file: File | Blob,
  options: FileIntegrityOptions
): Promise<FileIntegrityResult> {
  const { expectedChecksum } = options;

  if (!expectedChecksum) {
    throw new Error('expectedChecksum is required for validation');
  }

  const result = await calculateFileChecksum(file, options);

  if (!result.valid) {
    return result; // Return error from checksum calculation
  }

  // Compare checksums (case-insensitive)
  const checksumMatch = result.checksum.toLowerCase() === expectedChecksum.toLowerCase();

  if (!checksumMatch) {
    return {
      ...result,
      valid: false,
      error: `Checksum mismatch: expected ${expectedChecksum}, got ${result.checksum}`,
    };
  }

  return result;
}

/**
 * Calculate checksums for multiple files in parallel
 *
 * @example
 * ```typescript
 * const results = await calculateMultipleChecksums(files);
 * results.forEach((result, index) => {
 *   console.log(`File ${index}: ${result.checksum}`);
 * });
 * ```
 */
export async function calculateMultipleChecksums(
  files: (File | Blob)[],
  options: FileIntegrityOptions = {}
): Promise<FileIntegrityResult[]> {
  // Process files in parallel for maximum performance
  return Promise.all(files.map((file) => calculateFileChecksum(file, options)));
}

/**
 * Form.io validator integration
 *
 * Validates file integrity as part of form submission
 *
 * @example
 * ```typescript
 * // In Form.io component configuration
 * {
 *   validate: {
 *     custom: 'valid = await fileIntegrityValidator(input)'
 *   }
 * }
 * ```
 */
export async function fileIntegrityValidator(context: any): Promise<boolean | string> {
  const { component, value } = context;

  if (!value || !component.validateChecksum) {
    return true; // Skip validation if not enabled
  }

  const files = Array.isArray(value) ? value : [value];

  for (const file of files) {
    if (!file.checksum) {
      return `File ${file.name || 'unknown'} is missing checksum metadata`;
    }

    const result = await validateFileIntegrity(file, {
      expectedChecksum: file.checksum,
    });

    if (!result.valid) {
      return `File ${file.name || 'unknown'} integrity check failed: ${result.error}`;
    }
  }

  return true;
}

/**
 * Generate checksum metadata for file upload
 *
 * Adds checksum to file object for later validation
 *
 * @example
 * ```typescript
 * const fileWithChecksum = await addChecksumMetadata(file);
 * // fileWithChecksum now has .checksum property
 * ```
 */
export async function addChecksumMetadata(
  file: File,
  options: FileIntegrityOptions = {}
): Promise<File & { checksum: string; checksumAlgorithm: string }> {
  const result = await calculateFileChecksum(file, options);

  if (!result.valid) {
    throw new Error(`Failed to calculate checksum: ${result.error}`);
  }

  // Attach checksum metadata to file object
  return Object.assign(file, {
    checksum: result.checksum,
    checksumAlgorithm: 'xxh64',
    checksumProcessingTime: result.processingTime,
  });
}
