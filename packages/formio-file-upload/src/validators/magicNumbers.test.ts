/**
 * Tests for magic number verification
 */

import { verifyFileType, detectFileType, FILE_SIGNATURES, hasSignatureSupport } from './magicNumbers';

describe('magicNumbers', () => {
  describe('verifyFileType', () => {
    it('should verify JPEG file signature', async () => {
      const jpegBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
      const file = new File([jpegBytes], 'test.jpg', { type: 'image/jpeg' });

      const result = await verifyFileType(file, 'image/jpeg');
      expect(result).toBe(true);
    });

    it('should verify PNG file signature', async () => {
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const file = new File([pngBytes], 'test.png', { type: 'image/png' });

      const result = await verifyFileType(file, 'image/png');
      expect(result).toBe(true);
    });

    it('should verify GIF file signature', async () => {
      const gifBytes = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      const file = new File([gifBytes], 'test.gif', { type: 'image/gif' });

      const result = await verifyFileType(file, 'image/gif');
      expect(result).toBe(true);
    });

    it('should verify PDF file signature', async () => {
      const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]);
      const file = new File([pdfBytes], 'test.pdf', { type: 'application/pdf' });

      const result = await verifyFileType(file, 'application/pdf');
      expect(result).toBe(true);
    });

    it('should reject file with wrong signature', async () => {
      // PHP file with JPEG extension
      const phpBytes = new Uint8Array([0x3C, 0x3F, 0x70, 0x68, 0x70]); // <?php
      const file = new File([phpBytes], 'malicious.jpg', { type: 'image/jpeg' });

      const result = await verifyFileType(file, 'image/jpeg');
      expect(result).toBe(false);
    });

    it('should handle files without signature definition', async () => {
      const unknownBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const file = new File([unknownBytes], 'test.txt', { type: 'text/plain' });

      // Should return true (allow) when no signature defined
      const result = await verifyFileType(file, 'text/plain');
      expect(result).toBe(true);
    });

    it('should verify ZIP file signature', async () => {
      const zipBytes = new Uint8Array([0x50, 0x4B, 0x03, 0x04]);
      const file = new File([zipBytes], 'test.zip', { type: 'application/zip' });

      const result = await verifyFileType(file, 'application/zip');
      expect(result).toBe(true);
    });

    it('should handle wildcard bytes in signatures', async () => {
      // WebP has null bytes in signature
      const webpBytes = new Uint8Array([
        0x52, 0x49, 0x46, 0x46,  // RIFF
        0x00, 0x00, 0x00, 0x00,  // File size (wildcard)
        0x57, 0x45, 0x42, 0x50   // WEBP
      ]);
      const file = new File([webpBytes], 'test.webp', { type: 'image/webp' });

      const result = await verifyFileType(file, 'image/webp');
      expect(result).toBe(true);
    });

    it('should fail securely on error', async () => {
      // Simulate error by passing invalid file
      const result = await verifyFileType(null as any, 'image/jpeg');
      expect(result).toBe(false);
    });
  });

  describe('detectFileType', () => {
    it('should detect correct MIME type from multiple options', async () => {
      const jpegBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
      const file = new File([jpegBytes], 'unknown.dat', { type: 'application/octet-stream' });

      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      const detected = await detectFileType(file, allowedTypes);

      expect(detected).toBe('image/jpeg');
    });

    it('should return null if no type matches', async () => {
      const randomBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const file = new File([randomBytes], 'unknown.dat', { type: 'application/octet-stream' });

      const allowedTypes = ['image/png', 'image/jpeg'];
      const detected = await detectFileType(file, allowedTypes);

      expect(detected).toBeNull();
    });

    it('should handle empty allowed types', async () => {
      const jpegBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
      const file = new File([jpegBytes], 'test.jpg', { type: 'image/jpeg' });

      const detected = await detectFileType(file, []);
      expect(detected).toBeNull();
    });
  });

  describe('FILE_SIGNATURES', () => {
    it('should have signatures for common image types', () => {
      expect(FILE_SIGNATURES['image/jpeg']).toBeDefined();
      expect(FILE_SIGNATURES['image/png']).toBeDefined();
      expect(FILE_SIGNATURES['image/gif']).toBeDefined();
      expect(FILE_SIGNATURES['image/webp']).toBeDefined();
    });

    it('should have signatures for document types', () => {
      expect(FILE_SIGNATURES['application/pdf']).toBeDefined();
    });

    it('should have signatures for archive types', () => {
      expect(FILE_SIGNATURES['application/zip']).toBeDefined();
      expect(FILE_SIGNATURES['application/x-rar-compressed']).toBeDefined();
    });

    it('should have proper signature structure', () => {
      const jpeg = FILE_SIGNATURES['image/jpeg'];
      expect(jpeg.mime).toBe('image/jpeg');
      expect(jpeg.description).toBeTruthy();
      expect(Array.isArray(jpeg.signatures)).toBe(true);
      expect(jpeg.signatures.length).toBeGreaterThan(0);
    });
  });

  describe('hasSignatureSupport', () => {
    it('should return true for supported types', () => {
      expect(hasSignatureSupport('image/jpeg')).toBe(true);
      expect(hasSignatureSupport('image/png')).toBe(true);
      expect(hasSignatureSupport('application/pdf')).toBe(true);
    });

    it('should return false for unsupported types', () => {
      expect(hasSignatureSupport('text/plain')).toBe(false);
      expect(hasSignatureSupport('application/json')).toBe(false);
    });
  });

  describe('Security scenarios', () => {
    it('should detect MIME type spoofing', async () => {
      // Executable masquerading as image
      const exeBytes = new Uint8Array([0x4D, 0x5A]); // MZ header (EXE)
      const file = new File([exeBytes], 'virus.jpg', { type: 'image/jpeg' });

      const result = await verifyFileType(file, 'image/jpeg');
      expect(result).toBe(false);
    });

    it('should detect PHP file with image extension', async () => {
      const phpBytes = new Uint8Array([0x3C, 0x3F, 0x70, 0x68, 0x70]); // <?php
      const file = new File([phpBytes], 'shell.gif', { type: 'image/gif' });

      const result = await verifyFileType(file, 'image/gif');
      expect(result).toBe(false);
    });

    it('should accept valid image despite suspicious name', async () => {
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const file = new File([pngBytes], 'suspicious.php.png', { type: 'image/png' });

      // Signature should pass (filename sanitization is separate)
      const result = await verifyFileType(file, 'image/png');
      expect(result).toBe(true);
    });
  });
});
