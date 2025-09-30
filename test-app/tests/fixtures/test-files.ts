/**
 * Test File Fixtures
 *
 * Generate test files for upload testing
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface TestFile {
  path: string;
  name: string;
  size: number;
  mimeType: string;
}

/**
 * Setup test files directory
 */
export function setupTestFilesDir(): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uppy-test-'));
  return tmpDir;
}

/**
 * Cleanup test files directory
 */
export function cleanupTestFilesDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Create a valid PNG image (1x1 pixel)
 */
export function createPNGFile(dir: string, filename: string = 'test.png'): TestFile {
  const filepath = path.join(dir, filename);

  // Valid 1x1 PNG file
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
  ]);

  fs.writeFileSync(filepath, pngData);

  return {
    path: filepath,
    name: filename,
    size: pngData.length,
    mimeType: 'image/png',
  };
}

/**
 * Create a valid JPEG image
 */
export function createJPEGFile(dir: string, filename: string = 'test.jpg'): TestFile {
  const filepath = path.join(dir, filename);

  // Minimal valid JPEG file
  const jpegData = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
    0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C,
    0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D,
    0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20,
    0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
    0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34,
    0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4,
    0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x03, 0xFF, 0xC4, 0x00, 0x14,
    0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
    0x00, 0x00, 0x3F, 0x00, 0x37, 0xFF, 0xD9
  ]);

  fs.writeFileSync(filepath, jpegData);

  return {
    path: filepath,
    name: filename,
    size: jpegData.length,
    mimeType: 'image/jpeg',
  };
}

/**
 * Create an invalid file (wrong extension)
 */
export function createInvalidFile(dir: string, filename: string = 'test.txt'): TestFile {
  const filepath = path.join(dir, filename);
  const data = Buffer.from('This is a text file, not an image');

  fs.writeFileSync(filepath, data);

  return {
    path: filepath,
    name: filename,
    size: data.length,
    mimeType: 'text/plain',
  };
}

/**
 * Create a large file exceeding size limit
 */
export function createLargeFile(dir: string, sizeInMB: number, filename: string = 'large.png'): TestFile {
  const filepath = path.join(dir, filename);

  // Create PNG header
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  ]);

  // Fill with random data to reach desired size
  const dataSize = sizeInMB * 1024 * 1024 - header.length;
  const data = Buffer.alloc(dataSize, 0xFF);

  const fullData = Buffer.concat([header, data]);
  fs.writeFileSync(filepath, fullData);

  return {
    path: filepath,
    name: filename,
    size: fullData.length,
    mimeType: 'image/png',
  };
}

/**
 * Create a GIF file
 */
export function createGIFFile(dir: string, filename: string = 'test.gif'): TestFile {
  const filepath = path.join(dir, filename);

  // Minimal valid GIF (1x1 pixel)
  const gifData = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a header
    0x01, 0x00, 0x01, 0x00, // 1x1 dimensions
    0x80, 0x00, 0x00, // Global color table
    0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, // Colors
    0x21, 0xF9, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, // Graphic control
    0x2C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, // Image descriptor
    0x02, 0x02, 0x44, 0x01, 0x00, // Image data
    0x3B // Trailer
  ]);

  fs.writeFileSync(filepath, gifData);

  return {
    path: filepath,
    name: filename,
    size: gifData.length,
    mimeType: 'image/gif',
  };
}

/**
 * Create multiple test images
 */
export function createMultipleImages(dir: string, count: number): TestFile[] {
  const files: TestFile[] = [];

  for (let i = 0; i < count; i++) {
    const type = i % 3;
    let file: TestFile;

    switch (type) {
      case 0:
        file = createPNGFile(dir, `image-${i + 1}.png`);
        break;
      case 1:
        file = createJPEGFile(dir, `image-${i + 1}.jpg`);
        break;
      case 2:
        file = createGIFFile(dir, `image-${i + 1}.gif`);
        break;
      default:
        file = createPNGFile(dir, `image-${i + 1}.png`);
    }

    files.push(file);
  }

  return files;
}

/**
 * Create a WebP file
 */
export function createWebPFile(dir: string, filename: string = 'test.webp'): TestFile {
  const filepath = path.join(dir, filename);

  // Minimal valid WebP file
  const webpData = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x26, 0x00, 0x00, 0x00, // File size
    0x57, 0x45, 0x42, 0x50, // WEBP
    0x56, 0x50, 0x38, 0x20, // VP8
    0x1A, 0x00, 0x00, 0x00, // Chunk size
    0x30, 0x01, 0x00, 0x9D, 0x01, 0x2A, // Frame header
    0x01, 0x00, 0x01, 0x00, // 1x1 dimensions
    0x00, 0xFE, 0xFB, 0x94, 0x00, 0x00, // Image data
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00
  ]);

  fs.writeFileSync(filepath, webpData);

  return {
    path: filepath,
    name: filename,
    size: webpData.length,
    mimeType: 'image/webp',
  };
}

/**
 * Create file with specific size
 */
export function createFileWithSize(
  dir: string,
  sizeInBytes: number,
  filename: string = 'sized-file.png'
): TestFile {
  const filepath = path.join(dir, filename);

  // PNG header (8 bytes)
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  ]);

  // Fill remaining with zeros
  const remaining = sizeInBytes - header.length;
  const padding = Buffer.alloc(Math.max(0, remaining), 0);

  const fileData = Buffer.concat([header, padding]);
  fs.writeFileSync(filepath, fileData);

  return {
    path: filepath,
    name: filename,
    size: fileData.length,
    mimeType: 'image/png',
  };
}