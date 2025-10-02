/**
 * File Generation Utilities for Testing
 *
 * Provides helpers to generate test files of various sizes and types
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TestFileOptions {
  size: number;
  filename: string;
  mimeType?: string;
  content?: 'random' | 'zeros' | 'pattern';
}

export interface TestFile {
  path: string;
  size: number;
  filename: string;
  mimeType: string;
  hash: string;
}

/**
 * Generate a test file with specified size and content
 */
export async function generateTestFile(options: TestFileOptions): Promise<TestFile> {
  const {
    size,
    filename,
    mimeType = 'application/octet-stream',
    content = 'random'
  } = options;

  const fixturesDir = path.join(__dirname, '../fixtures/test-files');
  await fs.mkdir(fixturesDir, { recursive: true });

  const filePath = path.join(fixturesDir, filename);

  // Generate content based on type
  let buffer: Buffer;

  switch (content) {
    case 'zeros':
      buffer = Buffer.alloc(size, 0);
      break;
    case 'pattern':
      // Repeating pattern for better compression testing
      const pattern = Buffer.from('Form.io Test File Content - ');
      buffer = Buffer.alloc(size);
      for (let i = 0; i < size; i++) {
        buffer[i] = pattern[i % pattern.length];
      }
      break;
    case 'random':
    default:
      buffer = crypto.randomBytes(size);
      break;
  }

  await fs.writeFile(filePath, buffer);

  // Calculate hash for verification
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  return {
    path: filePath,
    size,
    filename,
    mimeType,
    hash
  };
}

/**
 * Generate standard test file suite
 */
export async function generateStandardTestFiles(): Promise<Record<string, TestFile>> {
  const files: Record<string, TestFile> = {};

  // 1KB file - basic upload test
  files['1kb'] = await generateTestFile({
    size: 1024,
    filename: 'test-1kb.txt',
    mimeType: 'text/plain',
    content: 'pattern'
  });

  // 1MB file - standard upload
  files['1mb'] = await generateTestFile({
    size: 1024 * 1024,
    filename: 'test-1mb.bin',
    mimeType: 'application/octet-stream',
    content: 'random'
  });

  // 10MB file - chunked upload test
  files['10mb'] = await generateTestFile({
    size: 10 * 1024 * 1024,
    filename: 'test-10mb.bin',
    mimeType: 'application/octet-stream',
    content: 'random'
  });

  // 100MB file - large file test
  files['100mb'] = await generateTestFile({
    size: 100 * 1024 * 1024,
    filename: 'test-100mb.bin',
    mimeType: 'application/octet-stream',
    content: 'zeros' // Use zeros for faster generation
  });

  return files;
}

/**
 * Generate a file with specific MIME type
 */
export async function generateTypedFile(
  sizeKB: number,
  type: 'image' | 'pdf' | 'video' | 'document'
): Promise<TestFile> {
  const typeMap = {
    image: { ext: 'jpg', mime: 'image/jpeg' },
    pdf: { ext: 'pdf', mime: 'application/pdf' },
    video: { ext: 'mp4', mime: 'video/mp4' },
    document: { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  };

  const { ext, mime } = typeMap[type];

  return generateTestFile({
    size: sizeKB * 1024,
    filename: `test-${type}-${sizeKB}kb.${ext}`,
    mimeType: mime,
    content: 'random'
  });
}

/**
 * Clean up generated test files
 */
export async function cleanupTestFiles(): Promise<void> {
  const fixturesDir = path.join(__dirname, '../fixtures/test-files');

  try {
    const files = await fs.readdir(fixturesDir);
    await Promise.all(
      files.map(file => fs.unlink(path.join(fixturesDir, file)))
    );
  } catch (error) {
    // Directory might not exist, ignore
  }
}

/**
 * Verify file integrity using hash
 */
export async function verifyFileHash(filePath: string, expectedHash: string): Promise<boolean> {
  const buffer = await fs.readFile(filePath);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return hash === expectedHash;
}

/**
 * Get file size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.size;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}