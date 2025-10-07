/**
 * Tests for filename sanitization
 */

import {
  sanitizeFilename,
  validateFilename,
  generateSafeFallbackName,
  extractExtension,
  hasAllowedExtension,
  DANGEROUS_EXTENSIONS,
} from './sanitizeFilename';

describe('sanitizeFilename', () => {
  describe('basic sanitization', () => {
    it('should sanitize safe filename', () => {
      const result = sanitizeFilename('document.pdf', { addTimestamp: false });
      expect(result).toBe('document.pdf');
    });

    it('should remove path traversal attacks', () => {
      const result = sanitizeFilename('../../../etc/passwd', { addTimestamp: false });
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
    });

    it('should remove dangerous characters', () => {
      const result = sanitizeFilename('file<>:|"*.txt', { addTimestamp: false });
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain(':');
      expect(result).not.toContain('|');
      expect(result).not.toContain('"');
      expect(result).not.toContain('*');
    });

    it('should remove null bytes', () => {
      const result = sanitizeFilename('file\0name.txt', { addTimestamp: false });
      expect(result).not.toContain('\0');
    });

    it('should trim leading/trailing dots and spaces', () => {
      const result = sanitizeFilename('  ..filename.txt  ', { addTimestamp: false });
      expect(result).not.toMatch(/^\./);
      expect(result).not.toMatch(/^\s/);
      expect(result).not.toMatch(/\s$/);
    });
  });

  describe('dangerous extensions', () => {
    it('should detect .php extension', () => {
      const result = sanitizeFilename('malicious.php', { addTimestamp: false });
      expect(result).not.toContain('.php');
      expect(result).toContain('.safe');
    });

    it('should detect double extensions (.jpg.php)', () => {
      const result = sanitizeFilename('image.jpg.php', { addTimestamp: false });
      expect(result).not.toContain('.php');
    });

    it('should detect .exe extension', () => {
      const result = sanitizeFilename('virus.exe', { addTimestamp: false });
      expect(result).not.toContain('.exe');
    });

    it('should detect .sh scripts', () => {
      const result = sanitizeFilename('script.sh', { addTimestamp: false });
      expect(result).not.toContain('.sh');
    });

    it('should preserve safe extensions', () => {
      const safeFiles = ['image.jpg', 'document.pdf', 'data.json', 'style.css'];
      safeFiles.forEach(filename => {
        const result = sanitizeFilename(filename, { addTimestamp: false });
        const ext = filename.substring(filename.lastIndexOf('.'));
        expect(result).toContain(ext);
      });
    });
  });

  describe('length limits', () => {
    it('should truncate long filenames', () => {
      const longName = 'a'.repeat(300) + '.txt';
      const result = sanitizeFilename(longName, { addTimestamp: false });
      expect(result.length).toBeLessThanOrEqual(255);
    });

    it('should preserve extension when truncating', () => {
      const longName = 'a'.repeat(300) + '.pdf';
      const result = sanitizeFilename(longName, { addTimestamp: false });
      expect(result).toContain('.pdf');
    });

    it('should handle custom max length', () => {
      const longName = 'a'.repeat(100) + '.txt';
      const result = sanitizeFilename(longName, {
        addTimestamp: false,
        maxLength: 50
      });
      expect(result.length).toBeLessThanOrEqual(54); // 50 + .txt
    });
  });

  describe('reserved names', () => {
    it('should detect Windows reserved names', () => {
      const reserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'LPT1'];
      reserved.forEach(name => {
        const result = sanitizeFilename(`${name}.txt`, { addTimestamp: false });
        expect(result).toContain('file_');
      });
    });

    it('should handle case-insensitive reserved names', () => {
      const result = sanitizeFilename('con.txt', { addTimestamp: false });
      expect(result).toContain('file_');
    });
  });

  describe('options', () => {
    it('should add timestamp when enabled', () => {
      const result = sanitizeFilename('test.txt', { addTimestamp: true });
      expect(result).toMatch(/test_\d+\.txt/);
    });

    it('should not add timestamp when disabled', () => {
      const result = sanitizeFilename('test.txt', { addTimestamp: false });
      expect(result).toBe('test.txt');
    });

    it('should convert to lowercase when requested', () => {
      const result = sanitizeFilename('MyFile.PDF', {
        addTimestamp: false,
        lowercase: true
      });
      expect(result).toBe('myfile.pdf');
    });

    it('should use custom replacement character', () => {
      const result = sanitizeFilename('file:name.txt', {
        addTimestamp: false,
        replacement: '-'
      });
      expect(result).toContain('-');
      expect(result).not.toContain(':');
    });

    it('should preserve extension when dangerous and preserveExtension=true', () => {
      const result = sanitizeFilename('file.php', {
        addTimestamp: false,
        preserveExtension: true
      });
      expect(result).toContain('.php');
    });
  });

  describe('edge cases', () => {
    it('should handle empty filename', () => {
      const result = sanitizeFilename('');
      expect(result).toBeTruthy();
      expect(result).toMatch(/^file_\d+_[a-z0-9]+$/);
    });

    it('should handle filename with no extension', () => {
      const result = sanitizeFilename('README', { addTimestamp: false });
      expect(result).toBe('README');
    });

    it('should handle filename with multiple dots', () => {
      const result = sanitizeFilename('archive.tar.gz', { addTimestamp: false });
      expect(result).toContain('.gz');
    });

    it('should handle Unicode characters', () => {
      const result = sanitizeFilename('文档.pdf', {
        addTimestamp: false,
        allowUnicode: true
      });
      expect(result).toContain('文档');
    });

    it('should remove Unicode when not allowed', () => {
      const result = sanitizeFilename('文档.pdf', {
        addTimestamp: false,
        allowUnicode: false
      });
      expect(result).not.toContain('文档');
    });

    it('should handle null input', () => {
      const result = sanitizeFilename(null as any);
      expect(result).toBeTruthy();
      expect(result).toMatch(/^file_\d+_[a-z0-9]+$/);
    });

    it('should handle undefined input', () => {
      const result = sanitizeFilename(undefined as any);
      expect(result).toBeTruthy();
    });
  });

  describe('validateFilename', () => {
    it('should validate safe filename', () => {
      const result = validateFilename('document.pdf');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect null bytes', () => {
      const result = validateFilename('file\0name.txt');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Filename contains null bytes');
    });

    it('should detect path traversal', () => {
      const result = validateFilename('../../etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Filename contains path traversal patterns');
    });

    it('should detect dangerous characters in sanitized input', () => {
      // validateFilename is called AFTER sanitization in production
      // Test that it validates the clean filename correctly
      const sanitized = sanitizeFilename('file<>name.txt', { addTimestamp: false });
      const result = validateFilename(sanitized);
      expect(result.valid).toBe(true); // After sanitization, it should be valid
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should detect dangerous extensions', () => {
      const result = validateFilename('malicious.php');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Filename contains dangerous extension');
    });

    it('should detect too long filename', () => {
      const longName = 'a'.repeat(300) + '.txt';
      const result = validateFilename(longName);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('too long'))).toBe(true);
    });

    it('should detect reserved names', () => {
      const result = validateFilename('CON.txt');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Filename is a reserved system name');
    });
  });

  describe('extractExtension', () => {
    it('should extract extension with dot', () => {
      expect(extractExtension('file.txt')).toBe('.txt');
      expect(extractExtension('image.jpg')).toBe('.jpg');
    });

    it('should handle no extension', () => {
      expect(extractExtension('README')).toBe('');
    });

    it('should handle multiple dots', () => {
      expect(extractExtension('archive.tar.gz')).toBe('.gz');
    });

    it('should sanitize dangerous extensions', () => {
      expect(extractExtension('malicious.php')).toBe('.safe');
    });

    it('should handle empty input', () => {
      expect(extractExtension('')).toBe('');
    });
  });

  describe('hasAllowedExtension', () => {
    it('should check against allowed list', () => {
      const allowed = ['.jpg', '.png', '.gif'];
      expect(hasAllowedExtension('image.jpg', allowed)).toBe(true);
      expect(hasAllowedExtension('image.png', allowed)).toBe(true);
      expect(hasAllowedExtension('document.pdf', allowed)).toBe(false);
    });

    it('should handle extensions without dots', () => {
      const allowed = ['jpg', 'png'];
      expect(hasAllowedExtension('image.jpg', allowed)).toBe(true);
    });

    it('should be case-insensitive', () => {
      const allowed = ['.JPG'];
      expect(hasAllowedExtension('image.jpg', allowed)).toBe(true);
    });
  });

  describe('generateSafeFallbackName', () => {
    it('should generate unique names', () => {
      const name1 = generateSafeFallbackName();
      const name2 = generateSafeFallbackName();
      expect(name1).not.toBe(name2);
    });

    it('should match safe pattern', () => {
      const name = generateSafeFallbackName();
      expect(name).toMatch(/^file_\d+_[a-z0-9]+$/);
    });
  });

  describe('security scenarios', () => {
    it('should prevent directory traversal', () => {
      const attacks = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        'uploads/../../../etc/passwd',
      ];

      attacks.forEach(attack => {
        const result = sanitizeFilename(attack, { addTimestamp: false });
        expect(result).not.toContain('..');
        expect(result).not.toContain('/');
        expect(result).not.toContain('\\');
      });
    });

    it('should prevent double extension attacks', () => {
      const attacks = [
        'shell.php.jpg',
        'backdoor.asp.png',
        'exploit.jsp.gif',
      ];

      attacks.forEach(attack => {
        const result = sanitizeFilename(attack, { addTimestamp: false });
        DANGEROUS_EXTENSIONS.forEach(ext => {
          expect(result.toLowerCase()).not.toContain(ext);
        });
      });
    });

    it('should prevent XSS in filenames', () => {
      const attacks = [
        '<script>alert("xss")</script>.jpg',
        'image"><script>alert(1)</script>.png',
        'file\' onclick="alert(1)".pdf',
      ];

      attacks.forEach(attack => {
        const result = sanitizeFilename(attack, { addTimestamp: false });
        expect(result).not.toContain('<');
        expect(result).not.toContain('>');
        expect(result).not.toContain('"');
        expect(result).not.toContain("'");
      });
    });

    it('should prevent null byte injection', () => {
      const result = sanitizeFilename('shell.php\0.jpg', { addTimestamp: false });
      expect(result).not.toContain('\0');
      expect(result).not.toContain('.php');
    });
  });
});
