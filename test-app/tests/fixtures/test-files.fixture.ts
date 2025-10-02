/**
 * Reusable Test Files Fixture
 *
 * Pre-generates common test files for E2E tests
 */

import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface TestFilesFixture {
  smallPDF: string;
  mediumImage: string;
  largeVideo: string;
  textDocument: string;
  zipArchive: string;
}

export const test = base.extend<{ testFiles: TestFilesFixture }>({
  testFiles: async ({}, use) => {
    const fixturesDir = path.join(process.cwd(), 'test-app/tests/fixtures/static');
    await fs.promises.mkdir(fixturesDir, { recursive: true });

    // Generate test files
    const files: TestFilesFixture = {
      smallPDF: await generatePDF(fixturesDir, 'test-document.pdf', 1024 * 100),
      mediumImage: await generateImage(fixturesDir, 'test-photo.jpg', 1024 * 500),
      largeVideo: await generateVideo(fixturesDir, 'test-video.mp4', 1024 * 1024 * 5),
      textDocument: await generateTextFile(fixturesDir, 'test-document.txt', 1024 * 50),
      zipArchive: await generateZip(fixturesDir, 'test-archive.zip', 1024 * 200)
    };

    await use(files);

    // Cleanup is handled by global teardown
  }
});

async function generatePDF(dir: string, name: string, size: number): Promise<string> {
  const filePath = path.join(dir, name);

  // Generate simple PDF content
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${size} >>
stream
BT
/F1 12 Tf
100 700 Td
(Test PDF Document - Generated for E2E Testing) Tj
ET
${Buffer.alloc(Math.max(0, size - 200), 'Test content repeated. ').toString()}
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
trailer
<< /Root 1 0 R >>
%%EOF`;

  await fs.promises.writeFile(filePath, pdfContent);
  return filePath;
}

async function generateImage(dir: string, name: string, size: number): Promise<string> {
  const filePath = path.join(dir, name);

  // Generate simple JPEG header (this is a minimal valid JPEG)
  const jpegHeader = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, // SOI + APP0 marker
    0x00, 0x10, // APP0 length
    0x4A, 0x46, 0x49, 0x46, 0x00, // JFIF identifier
    0x01, 0x01, // JFIF version
    0x00, // Aspect ratio units
    0x00, 0x01, 0x00, 0x01, // X and Y density
    0x00, 0x00 // Thumbnail dimensions
  ]);

  // Generate image data
  const imageData = Buffer.alloc(size - jpegHeader.length - 2, 0xFF);

  // JPEG footer
  const jpegFooter = Buffer.from([0xFF, 0xD9]);

  const fullImage = Buffer.concat([jpegHeader, imageData, jpegFooter]);
  await fs.promises.writeFile(filePath, fullImage);
  return filePath;
}

async function generateVideo(dir: string, name: string, size: number): Promise<string> {
  const filePath = path.join(dir, name);

  // Generate simple MP4 header (ftyp box)
  const mp4Header = Buffer.from([
    0x00, 0x00, 0x00, 0x20, // Box size (32 bytes)
    0x66, 0x74, 0x79, 0x70, // 'ftyp'
    0x69, 0x73, 0x6F, 0x6D, // Major brand: 'isom'
    0x00, 0x00, 0x00, 0x01, // Minor version
    0x69, 0x73, 0x6F, 0x6D, // Compatible brand: 'isom'
    0x6D, 0x70, 0x34, 0x32, // Compatible brand: 'mp42'
    0x6D, 0x70, 0x34, 0x31  // Compatible brand: 'mp41'
  ]);

  // Generate video data
  const videoData = crypto.randomBytes(Math.max(0, size - mp4Header.length));

  const fullVideo = Buffer.concat([mp4Header, videoData]);
  await fs.promises.writeFile(filePath, fullVideo);
  return filePath;
}

async function generateTextFile(dir: string, name: string, size: number): Promise<string> {
  const filePath = path.join(dir, name);

  const content = `Test Document
=============

This is a test document generated for E2E testing of the Form.io file upload module.

${Buffer.alloc(Math.max(0, size - 100), 'Lorem ipsum dolor sit amet. ').toString()}

End of document.`;

  await fs.promises.writeFile(filePath, content);
  return filePath;
}

async function generateZip(dir: string, name: string, size: number): Promise<string> {
  const filePath = path.join(dir, name);

  // Generate simple ZIP file structure
  // This creates a minimal valid ZIP with one file
  const fileName = 'test.txt';
  const fileContent = Buffer.alloc(Math.max(0, size - 100), 'Test content');

  // Local file header
  const localHeader = Buffer.concat([
    Buffer.from([0x50, 0x4B, 0x03, 0x04]), // Signature
    Buffer.from([0x14, 0x00]), // Version needed
    Buffer.from([0x00, 0x00]), // Flags
    Buffer.from([0x00, 0x00]), // Compression
    Buffer.from([0x00, 0x00]), // Mod time
    Buffer.from([0x00, 0x00]), // Mod date
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // CRC32 (simplified)
    Buffer.alloc(4), // Compressed size
    Buffer.alloc(4), // Uncompressed size
    Buffer.from([fileName.length, 0x00]), // Filename length
    Buffer.from([0x00, 0x00]), // Extra length
    Buffer.from(fileName), // Filename
  ]);

  // Central directory header
  const centralHeader = Buffer.concat([
    Buffer.from([0x50, 0x4B, 0x01, 0x02]), // Signature
    Buffer.from([0x14, 0x00]), // Version made by
    Buffer.from([0x14, 0x00]), // Version needed
    Buffer.from([0x00, 0x00]), // Flags
    Buffer.from([0x00, 0x00]), // Compression
    Buffer.from([0x00, 0x00]), // Mod time
    Buffer.from([0x00, 0x00]), // Mod date
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // CRC32
    Buffer.alloc(4), // Compressed size
    Buffer.alloc(4), // Uncompressed size
    Buffer.from([fileName.length, 0x00]), // Filename length
    Buffer.from([0x00, 0x00]), // Extra length
    Buffer.from([0x00, 0x00]), // Comment length
    Buffer.from([0x00, 0x00]), // Disk number
    Buffer.from([0x00, 0x00]), // Internal attributes
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // External attributes
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // Local header offset
    Buffer.from(fileName), // Filename
  ]);

  // End of central directory
  const endOfCentral = Buffer.concat([
    Buffer.from([0x50, 0x4B, 0x05, 0x06]), // Signature
    Buffer.from([0x00, 0x00]), // Disk number
    Buffer.from([0x00, 0x00]), // Start disk
    Buffer.from([0x01, 0x00]), // Number of entries on disk
    Buffer.from([0x01, 0x00]), // Total entries
    Buffer.alloc(4), // Central directory size
    Buffer.alloc(4), // Central directory offset
    Buffer.from([0x00, 0x00]), // Comment length
  ]);

  const zipFile = Buffer.concat([localHeader, fileContent, centralHeader, endOfCentral]);
  await fs.promises.writeFile(filePath, zipFile);
  return filePath;
}

export { expect } from '@playwright/test';