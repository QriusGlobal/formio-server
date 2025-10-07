/**
 * File Integrity Validator Tests
 *
 * Tests cover:
 * - Basic checksum calculation
 * - Streaming large files
 * - Integrity validation (match/mismatch)
 * - Multiple file processing
 * - Form.io validator integration
 * - Performance benchmarks
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import {
  calculateFileChecksum,
  validateFileIntegrity,
  calculateMultipleChecksums,
  fileIntegrityValidator,
  addChecksumMetadata
} from './fileIntegrity';

// Mock File API for testing
class MockFile extends Blob {
  name: string;
  lastModified: number;

  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    super(bits, options);
    this.name = name;
    this.lastModified = options?.lastModified || Date.now();
  }
}

// @ts-ignore - Mock File for testing
global.File = MockFile as any;

describe('fileIntegrity - xxHash Checksum Validation', () => {
  describe('calculateFileChecksum', () => {
    it('should calculate checksum for small file', async () => {
      const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
      const result = await calculateFileChecksum(file);

      expect(result.valid).toBe(true);
      expect(result.checksum).toBeTruthy();
      expect(result.checksum.length).toBeGreaterThan(0);
      expect(result.size).toBe(11); // "Hello World" length
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });

    it('should generate same checksum for identical content', async () => {
      const file1 = new File(['Same Content'], 'file1.txt');
      const file2 = new File(['Same Content'], 'file2.txt');

      const result1 = await calculateFileChecksum(file1);
      const result2 = await calculateFileChecksum(file2);

      expect(result1.checksum).toBe(result2.checksum);
    });

    it('should generate different checksums for different content', async () => {
      const file1 = new File(['Content A'], 'file1.txt');
      const file2 = new File(['Content B'], 'file2.txt');

      const result1 = await calculateFileChecksum(file1);
      const result2 = await calculateFileChecksum(file2);

      expect(result1.checksum).not.toBe(result2.checksum);
    });

    it('should handle empty file', async () => {
      const file = new File([], 'empty.txt');
      const result = await calculateFileChecksum(file);

      expect(result.valid).toBe(true);
      expect(result.checksum).toBeTruthy();
      expect(result.size).toBe(0);
    });

    it('should handle large file with streaming', async () => {
      // Create 1MB file
      const largeData = new Uint8Array(1024 * 1024).fill(65); // 1MB of 'A'
      const file = new File([largeData], 'large.bin');

      const result = await calculateFileChecksum(file, {
        chunkSize: 64 * 1024, // 64KB chunks
        enableLogging: false
      });

      expect(result.valid).toBe(true);
      expect(result.size).toBe(1024 * 1024);
      expect(result.checksum).toBeTruthy();
    });

    it('should calculate checksum with custom chunk size', async () => {
      const file = new File(['0123456789'.repeat(1000)], 'test.txt');

      const result = await calculateFileChecksum(file, {
        chunkSize: 100 // Small chunks
      });

      expect(result.valid).toBe(true);
      expect(result.checksum).toBeTruthy();
    });
  });

  describe('validateFileIntegrity', () => {
    it('should validate file with correct checksum', async () => {
      const file = new File(['Test Content'], 'test.txt');

      // First calculate the checksum
      const checksumResult = await calculateFileChecksum(file);

      // Then validate against it
      const validationResult = await validateFileIntegrity(file, {
        expectedChecksum: checksumResult.checksum
      });

      expect(validationResult.valid).toBe(true);
      expect(validationResult.error).toBeUndefined();
    });

    it('should fail validation with incorrect checksum', async () => {
      const file = new File(['Test Content'], 'test.txt');

      const result = await validateFileIntegrity(file, {
        expectedChecksum: 'incorrect_checksum_12345'
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Checksum mismatch');
    });

    it('should be case-insensitive when comparing checksums', async () => {
      const file = new File(['Test Content'], 'test.txt');

      const checksumResult = await calculateFileChecksum(file);
      const uppercaseChecksum = checksumResult.checksum.toUpperCase();

      const validationResult = await validateFileIntegrity(file, {
        expectedChecksum: uppercaseChecksum
      });

      expect(validationResult.valid).toBe(true);
    });

    it('should throw error if expectedChecksum is missing', async () => {
      const file = new File(['Test'], 'test.txt');

      await expect(
        validateFileIntegrity(file, {})
      ).rejects.toThrow('expectedChecksum is required');
    });

    it('should detect file corruption', async () => {
      const originalFile = new File(['Original Content'], 'file.txt');
      const corruptedFile = new File(['Corrupted Content'], 'file.txt');

      const originalChecksum = await calculateFileChecksum(originalFile);
      const validationResult = await validateFileIntegrity(corruptedFile, {
        expectedChecksum: originalChecksum.checksum
      });

      expect(validationResult.valid).toBe(false);
      expect(validationResult.error).toContain('mismatch');
    });
  });

  describe('calculateMultipleChecksums', () => {
    it('should calculate checksums for multiple files in parallel', async () => {
      const files = [
        new File(['File 1'], 'file1.txt'),
        new File(['File 2'], 'file2.txt'),
        new File(['File 3'], 'file3.txt')
      ];

      const results = await calculateMultipleChecksums(files);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.valid).toBe(true);
        expect(result.checksum).toBeTruthy();
      });

      // All checksums should be different
      const checksums = results.map(r => r.checksum);
      const uniqueChecksums = new Set(checksums);
      expect(uniqueChecksums.size).toBe(3);
    });

    it('should handle empty file array', async () => {
      const results = await calculateMultipleChecksums([]);
      expect(results).toEqual([]);
    });

    it('should process large number of files efficiently', async () => {
      const files = Array.from({ length: 50 }, (_, i) =>
        new File([`File ${i}`], `file${i}.txt`)
      );

      const startTime = performance.now();
      const results = await calculateMultipleChecksums(files);
      const duration = performance.now() - startTime;

      expect(results).toHaveLength(50);
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  });

  describe('fileIntegrityValidator - Form.io integration', () => {
    it('should return true if validation is disabled', async () => {
      const context = {
        component: { validateChecksum: false },
        value: new File(['Test'], 'test.txt')
      };

      const result = await fileIntegrityValidator(context);
      expect(result).toBe(true);
    });

    it('should return true if no value provided', async () => {
      const context = {
        component: { validateChecksum: true },
        value: null
      };

      const result = await fileIntegrityValidator(context);
      expect(result).toBe(true);
    });

    it('should validate file with checksum metadata', async () => {
      const file = new File(['Test'], 'test.txt');
      const checksumResult = await calculateFileChecksum(file);

      const fileWithChecksum = Object.assign(file, {
        checksum: checksumResult.checksum
      });

      const context = {
        component: { validateChecksum: true },
        value: fileWithChecksum
      };

      const result = await fileIntegrityValidator(context);
      expect(result).toBe(true);
    });

    it('should return error if file missing checksum', async () => {
      const file = new File(['Test'], 'test.txt');

      const context = {
        component: { validateChecksum: true },
        value: file
      };

      const result = await fileIntegrityValidator(context);
      expect(typeof result).toBe('string');
      expect(result).toContain('missing checksum');
    });

    it('should validate array of files', async () => {
      const file1 = new File(['File 1'], 'file1.txt');
      const file2 = new File(['File 2'], 'file2.txt');

      const checksum1 = await calculateFileChecksum(file1);
      const checksum2 = await calculateFileChecksum(file2);

      const filesWithChecksums = [
        Object.assign(file1, { checksum: checksum1.checksum }),
        Object.assign(file2, { checksum: checksum2.checksum })
      ];

      const context = {
        component: { validateChecksum: true },
        value: filesWithChecksums
      };

      const result = await fileIntegrityValidator(context);
      expect(result).toBe(true);
    });

    it('should fail validation if any file has incorrect checksum', async () => {
      const file = new File(['Test'], 'test.txt');
      const fileWithBadChecksum = Object.assign(file, {
        checksum: 'wrong_checksum_12345'
      });

      const context = {
        component: { validateChecksum: true },
        value: fileWithBadChecksum
      };

      const result = await fileIntegrityValidator(context);
      expect(typeof result).toBe('string');
      expect(result).toContain('integrity check failed');
    });
  });

  describe('addChecksumMetadata', () => {
    it('should add checksum metadata to file', async () => {
      const file = new File(['Test Content'], 'test.txt');
      const fileWithChecksum = await addChecksumMetadata(file);

      expect(fileWithChecksum.checksum).toBeTruthy();
      expect(fileWithChecksum.checksumAlgorithm).toBe('xxh64');
      expect(fileWithChecksum.checksumProcessingTime).toBeGreaterThanOrEqual(0);
      expect(fileWithChecksum.name).toBe('test.txt');
      expect(fileWithChecksum.size).toBe(file.size);
    });

    it('should preserve original file properties', async () => {
      const file = new File(['Content'], 'original.pdf', { type: 'application/pdf' });
      const fileWithChecksum = await addChecksumMetadata(file);

      expect(fileWithChecksum.name).toBe('original.pdf');
      expect(fileWithChecksum.type).toBe('application/pdf');
      expect(fileWithChecksum.size).toBe(7);
    });
  });

  describe('Performance benchmarks', () => {
    it('should be fast for small files (< 1ms)', async () => {
      const file = new File(['Small file content'], 'small.txt');

      const startTime = performance.now();
      const result = await calculateFileChecksum(file);
      const duration = performance.now() - startTime;

      expect(result.valid).toBe(true);
      expect(duration).toBeLessThan(10); // Should be very fast
    });

    it('should process 10MB file efficiently', async () => {
      // Create 10MB file
      const largeData = new Uint8Array(10 * 1024 * 1024).fill(42);
      const file = new File([largeData], 'large.bin');

      const startTime = performance.now();
      const result = await calculateFileChecksum(file, {
        enableLogging: true
      });
      const duration = performance.now() - startTime;

      expect(result.valid).toBe(true);
      expect(result.size).toBe(10 * 1024 * 1024);

      // Should process at least 50 MB/s (conservative estimate)
      const throughputMBps = (result.size / 1024 / 1024) / (duration / 1000);
      expect(throughputMBps).toBeGreaterThan(50);
    });
  });

  describe('Edge cases', () => {
    it('should handle binary data', async () => {
      const binaryData = new Uint8Array([0x00, 0xFF, 0xAA, 0x55]);
      const file = new File([binaryData], 'binary.bin');

      const result = await calculateFileChecksum(file);
      expect(result.valid).toBe(true);
    });

    it('should handle Unicode content', async () => {
      const unicodeContent = '你好世界 🌍 Hello मस्ते';
      const file = new File([unicodeContent], 'unicode.txt');

      const result = await calculateFileChecksum(file);
      expect(result.valid).toBe(true);
    });

    it('should handle Blob instead of File', async () => {
      const blob = new Blob(['Blob content'], { type: 'text/plain' });
      const result = await calculateFileChecksum(blob);

      expect(result.valid).toBe(true);
    });
  });
});
