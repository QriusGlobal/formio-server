/**
 * Test Data Generator
 * Generates realistic test data for E2E tests
 */

import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

export interface TestFile {
  name: string;
  content: Buffer;
  mimeType: string;
  size: number;
}

export interface TestSubmission {
  formId: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export class TestDataGenerator {
  /**
   * Generate test file
   */
  generateFile(options: {
    type?: 'image' | 'document' | 'video' | 'text';
    size?: number;
    name?: string;
  } = {}): TestFile {
    const type = options.type || 'text';
    const size = options.size || 1024;

    switch (type) {
      case 'image':
        return this.generateImageFile(size, options.name);
      case 'document':
        return this.generateDocumentFile(size, options.name);
      case 'video':
        return this.generateVideoFile(size, options.name);
      case 'text':
      default:
        return this.generateTextFile(size, options.name);
    }
  }

  private generateTextFile(size: number, name?: string): TestFile {
    const content = Buffer.from(faker.lorem.paragraphs(Math.ceil(size / 100)));

    return {
      name: name || `${faker.system.fileName()}.txt`,
      content,
      mimeType: 'text/plain',
      size: content.length,
    };
  }

  private generateImageFile(size: number, name?: string): TestFile {
    // Generate fake PNG data (simplified)
    const content = Buffer.alloc(size);
    content.write('\x89PNG\r\n\x1a\n', 0, 'binary');

    return {
      name: name || `${faker.system.fileName()}.png`,
      content,
      mimeType: 'image/png',
      size: content.length,
    };
  }

  private generateDocumentFile(size: number, name?: string): TestFile {
    const content = Buffer.alloc(size);
    content.write('%PDF-1.4', 0);

    return {
      name: name || `${faker.system.fileName()}.pdf`,
      content,
      mimeType: 'application/pdf',
      size: content.length,
    };
  }

  private generateVideoFile(size: number, name?: string): TestFile {
    const content = Buffer.alloc(size);

    return {
      name: name || `${faker.system.fileName()}.mp4`,
      content,
      mimeType: 'video/mp4',
      size: content.length,
    };
  }

  /**
   * Generate multiple test files
   */
  generateFiles(count: number, options: Parameters<typeof this.generateFile>[0] = {}): TestFile[] {
    return Array.from({ length: count }, () => this.generateFile(options));
  }

  /**
   * Generate test submission data
   */
  generateSubmission(formId: string, includeFiles: boolean = true): TestSubmission {
    const data: Record<string, any> = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      message: faker.lorem.paragraph(),
    };

    if (includeFiles) {
      data.attachment = this.generateFile({ type: 'document' });
    }

    return {
      formId,
      data,
      metadata: {
        submittedAt: new Date().toISOString(),
        userAgent: faker.internet.userAgent(),
      },
    };
  }

  /**
   * Generate batch of submissions
   */
  generateSubmissions(formId: string, count: number, includeFiles: boolean = true): TestSubmission[] {
    return Array.from({ length: count }, () => this.generateSubmission(formId, includeFiles));
  }

  /**
   * Generate realistic file set
   */
  generateRealisticFileSet(): TestFile[] {
    return [
      this.generateFile({ type: 'image', size: 2 * 1024 * 1024, name: 'profile-photo.png' }),
      this.generateFile({ type: 'document', size: 500 * 1024, name: 'resume.pdf' }),
      this.generateFile({ type: 'text', size: 10 * 1024, name: 'cover-letter.txt' }),
    ];
  }

  /**
   * Generate edge case files
   */
  generateEdgeCases(): {
    empty: TestFile;
    tiny: TestFile;
    large: TestFile;
    specialChars: TestFile;
    longName: TestFile;
  } {
    return {
      empty: {
        name: 'empty.txt',
        content: Buffer.alloc(0),
        mimeType: 'text/plain',
        size: 0,
      },
      tiny: this.generateFile({ size: 1 }),
      large: this.generateFile({ size: 10 * 1024 * 1024 }),
      specialChars: {
        name: 'file with spaces & special-chars!@#.txt',
        content: Buffer.from('test'),
        mimeType: 'text/plain',
        size: 4,
      },
      longName: {
        name: 'a'.repeat(200) + '.txt',
        content: Buffer.from('test'),
        mimeType: 'text/plain',
        size: 4,
      },
    };
  }

  /**
   * Save test data to disk
   */
  saveTestData(files: TestFile[], outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    files.forEach((file) => {
      const filePath = path.join(outputDir, file.name);
      fs.writeFileSync(filePath, file.content);
    });
  }

  /**
   * Generate test data manifest
   */
  generateManifest(files: TestFile[]): string {
    const manifest = {
      generatedAt: new Date().toISOString(),
      files: files.map((file) => ({
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
      })),
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    };

    return JSON.stringify(manifest, null, 2);
  }
}

/**
 * Pre-generated test fixtures
 */
export const testFixtures = {
  smallText: {
    name: 'small.txt',
    content: Buffer.from('Hello, World!'),
    mimeType: 'text/plain',
    size: 13,
  },

  mediumImage: {
    name: 'test-image.png',
    content: Buffer.from('fake-png-data'),
    mimeType: 'image/png',
    size: 1024 * 100,
  },

  largeDocument: {
    name: 'large-doc.pdf',
    content: Buffer.alloc(5 * 1024 * 1024),
    mimeType: 'application/pdf',
    size: 5 * 1024 * 1024,
  },

  invalidFile: {
    name: 'malicious.exe',
    content: Buffer.from('MZ\x90\x00'),
    mimeType: 'application/x-msdownload',
    size: 4,
  },
};

/**
 * Export singleton instance
 */
export const testDataGenerator = new TestDataGenerator();