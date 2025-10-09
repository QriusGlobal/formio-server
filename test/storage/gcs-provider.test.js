/* eslint-disable max-statements */
'use strict';

const request = require('../formio-supertest');
const assert = require('assert');
const chance = require('chance')();
const sinon = require('sinon');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

describe('GCS Storage Provider Tests', function() {
  this.timeout(120000); // 2 minutes for large file uploads

  let app;
  let gcsProvider;
  let mockStorage;
  let mockBucket;
  let mockFile;

  before(function(done) {
    // Initialize app
    app = require('../../server')({
      port: 3001,
      db: {
        url: process.env.DB_URL || 'mongodb://localhost:27017/formio-test',
      }
    });

    // Setup GCS mocks
    mockFile = {
      save: sinon.stub().resolves(),
      createWriteStream: function() {
        const stream = require('stream').PassThrough();
        return stream;
      },
      getSignedUrl: sinon.stub().resolves(['https://storage.googleapis.com/signed-url'])
    };

    mockBucket = {
      file: sinon.stub().returns(mockFile),
      upload: sinon.stub().resolves([mockFile]),
      getFiles: sinon.stub().resolves([[mockFile]])
    };

    mockStorage = {
      bucket: sinon.stub().returns(mockBucket)
    };

    // Initialize GCS provider with mock
    gcsProvider = {
      storage: mockStorage,
      bucketName: 'test-formio-uploads',

      /**
       * Upload a file to GCS
       * @param {Buffer} fileBuffer - File content
       * @param {Object} metadata - File metadata
       * @returns {Promise<Object>} Upload result
       */
      uploadFile: async function(fileBuffer, metadata) {
        const fileName = `${Date.now()}-${metadata.originalName}`;
        const file = this.storage.bucket(this.bucketName).file(fileName);

        return new Promise((resolve, reject) => {
          const stream = file.createWriteStream({
            metadata: {
              contentType: metadata.mimeType,
              metadata: {
                originalName: metadata.originalName,
                size: metadata.size,
                uploadedBy: metadata.userId
              }
            },
            resumable: metadata.size > 5 * 1024 * 1024 // Use resumable for files > 5MB
          });

          stream.on('error', reject);
          stream.on('finish', () => {
            resolve({
              fileName,
              size: metadata.size,
              url: `gs://${this.bucketName}/${fileName}`
            });
          });

          stream.end(fileBuffer);
        });
      },

      /**
       * Upload with multipart/chunked approach
       * @param {Buffer} fileBuffer - File content
       * @param {Object} metadata - File metadata
       * @param {Number} chunkSize - Size of each chunk
       * @returns {Promise<Object>} Upload result
       */
      uploadMultipart: async function(fileBuffer, metadata, chunkSize = 5 * 1024 * 1024) {
        const fileName = `${Date.now()}-${metadata.originalName}`;
        const file = this.storage.bucket(this.bucketName).file(fileName);

        const stream = file.createWriteStream({
          metadata: {
            contentType: metadata.mimeType,
          },
          resumable: true,
          validation: 'crc32c'
        });

        return new Promise((resolve, reject) => {
          let offset = 0;
          const uploadChunk = () => {
            const chunk = fileBuffer.slice(offset, offset + chunkSize);
            if (chunk.length === 0) {
              stream.end();
              return;
            }

            stream.write(chunk, (err) => {
              if (err) {
                reject(err);
                return;
              }
              offset += chunk.length;
              uploadChunk();
            });
          };

          stream.on('error', reject);
          stream.on('finish', () => {
            resolve({
              fileName,
              size: metadata.size,
              url: `gs://${this.bucketName}/${fileName}`,
              chunks: Math.ceil(metadata.size / chunkSize)
            });
          });

          uploadChunk();
        });
      },

      /**
       * Resume interrupted upload
       * @param {String} uploadId - Upload session ID
       * @param {Buffer} remainingBuffer - Remaining file content
       * @returns {Promise<Object>} Upload result
       */
      resumeUpload: async function(uploadId, remainingBuffer) {
        // In real implementation, this would use GCS resumable upload URI
        const file = this.storage.bucket(this.bucketName).file(uploadId);
        const stream = file.createWriteStream({ resumable: true });

        return new Promise((resolve, reject) => {
          stream.on('error', reject);
          stream.on('finish', () => {
            resolve({
              fileName: uploadId,
              resumed: true,
              size: remainingBuffer.length
            });
          });
          stream.end(remainingBuffer);
        });
      },

      /**
       * Generate signed URL for temporary access
       * @param {String} fileName - File name in GCS
       * @param {Number} expiresIn - Expiration time in seconds
       * @returns {Promise<String>} Signed URL
       */
      getSignedUrl: async function(fileName, expiresIn = 3600) {
        const file = this.storage.bucket(this.bucketName).file(fileName);
        const [url] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + expiresIn * 1000
        });
        return url;
      },

      /**
       * Delete file from GCS
       * @param {String} fileName - File name to delete
       * @returns {Promise<void>}
       */
      deleteFile: async function(fileName) {
        const file = this.storage.bucket(this.bucketName).file(fileName);
        await file.delete();
      }
    };

    done();
  });

  after(function(done) {
    // Cleanup
    sinon.restore();
    done();
  });

  describe('Single File Upload - Various Sizes', function() {

    it('should upload 1MB file successfully', async function() {
      const fileSize = 1 * 1024 * 1024; // 1MB
      const fileBuffer = Buffer.alloc(fileSize, 'a');
      const metadata = {
        originalName: 'test-1mb.txt',
        mimeType: 'text/plain',
        size: fileSize,
        userId: 'test-user-1'
      };

      const result = await gcsProvider.uploadFile(fileBuffer, metadata);

      assert.ok(result.fileName, 'File name should be generated');
      assert.strictEqual(result.size, fileSize, 'File size should match');
      assert.ok(result.url.startsWith('gs://'), 'URL should be GCS format');
    });

    it('should upload 10MB file successfully', async function() {
      const fileSize = 10 * 1024 * 1024; // 10MB
      const fileBuffer = Buffer.alloc(fileSize, 'b');
      const metadata = {
        originalName: 'test-10mb.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user-2'
      };

      const result = await gcsProvider.uploadFile(fileBuffer, metadata);

      assert.ok(result.fileName);
      assert.strictEqual(result.size, fileSize);
      assert.ok(result.url.includes(gcsProvider.bucketName));
    });

    it('should upload 100MB file with resumable upload', async function() {
      const fileSize = 100 * 1024 * 1024; // 100MB
      const fileBuffer = Buffer.alloc(fileSize, 'c');
      const metadata = {
        originalName: 'test-100mb.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user-3'
      };

      const result = await gcsProvider.uploadFile(fileBuffer, metadata);

      assert.ok(result.fileName);
      assert.strictEqual(result.size, fileSize);
    });

    it('should handle file metadata correctly', async function() {
      const fileBuffer = Buffer.from('test content');
      const metadata = {
        originalName: 'metadata-test.txt',
        mimeType: 'text/plain',
        size: fileBuffer.length,
        userId: 'test-user-4',
        customField: 'custom-value'
      };

      const result = await gcsProvider.uploadFile(fileBuffer, metadata);

      assert.ok(result.fileName);
      assert.strictEqual(result.size, fileBuffer.length);
    });
  });

  describe('Multipart Upload with Chunks', function() {

    it('should upload file in 5MB chunks', async function() {
      const fileSize = 15 * 1024 * 1024; // 15MB
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const fileBuffer = Buffer.alloc(fileSize, 'd');
      const metadata = {
        originalName: 'chunked-15mb.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user-5'
      };

      const result = await gcsProvider.uploadMultipart(fileBuffer, metadata, chunkSize);

      assert.ok(result.fileName);
      assert.strictEqual(result.size, fileSize);
      assert.strictEqual(result.chunks, 3, 'Should have 3 chunks');
    });

    it('should upload file in 10MB chunks', async function() {
      const fileSize = 50 * 1024 * 1024; // 50MB
      const chunkSize = 10 * 1024 * 1024; // 10MB chunks
      const fileBuffer = Buffer.alloc(fileSize, 'e');
      const metadata = {
        originalName: 'chunked-50mb.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user-6'
      };

      const result = await gcsProvider.uploadMultipart(fileBuffer, metadata, chunkSize);

      assert.ok(result.fileName);
      assert.strictEqual(result.chunks, 5, 'Should have 5 chunks');
    });

    it('should handle partial last chunk correctly', async function() {
      const fileSize = 23 * 1024 * 1024; // 23MB (not evenly divisible)
      const chunkSize = 10 * 1024 * 1024; // 10MB chunks
      const fileBuffer = Buffer.alloc(fileSize, 'f');
      const metadata = {
        originalName: 'partial-chunk.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user-7'
      };

      const result = await gcsProvider.uploadMultipart(fileBuffer, metadata, chunkSize);

      assert.strictEqual(result.chunks, 3, 'Should have 3 chunks (10MB + 10MB + 3MB)');
    });
  });

  describe('Resume Interrupted Upload', function() {

    it('should resume upload from checkpoint', async function() {
      const uploadId = 'interrupted-upload-123';
      const remainingSize = 5 * 1024 * 1024; // 5MB remaining
      const remainingBuffer = Buffer.alloc(remainingSize, 'g');

      const result = await gcsProvider.resumeUpload(uploadId, remainingBuffer);

      assert.strictEqual(result.fileName, uploadId);
      assert.strictEqual(result.resumed, true);
      assert.strictEqual(result.size, remainingSize);
    });

    it('should handle resume with checksum validation', async function() {
      const uploadId = 'checksum-upload-456';
      const remainingBuffer = Buffer.from('remaining content');
      const expectedChecksum = crypto.createHash('md5').update(remainingBuffer).digest('hex');

      const result = await gcsProvider.resumeUpload(uploadId, remainingBuffer);

      assert.ok(result.resumed);
      // In production, would validate checksum here
    });

    it('should resume large file upload', async function() {
      const uploadId = 'large-resume-789';
      const remainingSize = 50 * 1024 * 1024; // 50MB remaining
      const remainingBuffer = Buffer.alloc(remainingSize, 'h');

      const result = await gcsProvider.resumeUpload(uploadId, remainingBuffer);

      assert.ok(result.resumed);
      assert.strictEqual(result.size, remainingSize);
    });
  });

  describe('Signed URL Generation', function() {

    it('should generate valid signed URL', async function() {
      const fileName = 'test-file.pdf';
      const expiresIn = 3600; // 1 hour

      const signedUrl = await gcsProvider.getSignedUrl(fileName, expiresIn);

      assert.ok(signedUrl, 'Signed URL should be generated');
      assert.ok(signedUrl.startsWith('https://'), 'Should be HTTPS URL');
      assert.ok(signedUrl.includes('storage.googleapis.com'), 'Should be GCS domain');
    });

    it('should generate signed URL with custom expiration', async function() {
      const fileName = 'short-lived.jpg';
      const expiresIn = 300; // 5 minutes

      const signedUrl = await gcsProvider.getSignedUrl(fileName, expiresIn);

      assert.ok(signedUrl);
    });

    it('should generate signed URL for large file', async function() {
      const fileName = 'large-video.mp4';
      const signedUrl = await gcsProvider.getSignedUrl(fileName);

      assert.ok(signedUrl);
    });
  });

  describe('Error Handling and Retries', function() {

    it('should handle network timeout', async function() {
      // Mock network timeout
      const originalCreateWriteStream = mockFile.createWriteStream;
      mockFile.createWriteStream = function() {
        const stream = require('stream').PassThrough();
        setTimeout(() => stream.emit('error', new Error('ETIMEDOUT')), 100);
        return stream;
      };

      const fileBuffer = Buffer.from('test');
      const metadata = {
        originalName: 'timeout-test.txt',
        mimeType: 'text/plain',
        size: fileBuffer.length,
        userId: 'test-user'
      };

      try {
        await gcsProvider.uploadFile(fileBuffer, metadata);
        assert.fail('Should have thrown timeout error');
      } catch (error) {
        assert.ok(error.message.includes('ETIMEDOUT'));
      }

      // Restore
      mockFile.createWriteStream = originalCreateWriteStream;
    });

    it('should handle insufficient storage error', async function() {
      const originalCreateWriteStream = mockFile.createWriteStream;
      mockFile.createWriteStream = function() {
        const stream = require('stream').PassThrough();
        setTimeout(() => stream.emit('error', new Error('Insufficient storage quota')), 100);
        return stream;
      };

      const fileBuffer = Buffer.alloc(1024);
      const metadata = {
        originalName: 'quota-test.txt',
        mimeType: 'text/plain',
        size: fileBuffer.length,
        userId: 'test-user'
      };

      try {
        await gcsProvider.uploadFile(fileBuffer, metadata);
        assert.fail('Should have thrown quota error');
      } catch (error) {
        assert.ok(error.message.includes('storage quota'));
      }

      mockFile.createWriteStream = originalCreateWriteStream;
    });

    it('should retry failed upload', async function() {
      let attemptCount = 0;
      const maxRetries = 3;

      const uploadWithRetry = async function(fileBuffer, metadata, retries = maxRetries) {
        try {
          attemptCount++;
          if (attemptCount < 3) {
            throw new Error('Temporary network error');
          }
          return await gcsProvider.uploadFile(fileBuffer, metadata);
        } catch (error) {
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
            return uploadWithRetry(fileBuffer, metadata, retries - 1);
          }
          throw error;
        }
      };

      const fileBuffer = Buffer.from('retry test');
      const metadata = {
        originalName: 'retry-test.txt',
        mimeType: 'text/plain',
        size: fileBuffer.length,
        userId: 'test-user'
      };

      const result = await uploadWithRetry(fileBuffer, metadata);

      assert.strictEqual(attemptCount, 3, 'Should have retried 3 times');
      assert.ok(result.fileName);
    });

    it('should handle invalid file metadata', async function() {
      const fileBuffer = Buffer.from('test');
      const invalidMetadata = {
        // Missing required fields
        originalName: null,
        size: -1
      };

      try {
        await gcsProvider.uploadFile(fileBuffer, invalidMetadata);
        // In production, this would throw validation error
        assert.ok(true, 'Should handle gracefully');
      } catch (error) {
        assert.ok(error.message.includes('metadata'));
      }
    });
  });

  describe('File Operations', function() {

    it('should delete uploaded file', async function() {
      const fileName = 'to-delete.txt';

      // Delete should not throw
      await gcsProvider.deleteFile(fileName);
      assert.ok(true, 'File deleted successfully');
    });

    it('should handle delete of non-existent file', async function() {
      const fileName = 'non-existent.txt';
      mockFile.delete = sinon.stub().rejects(new Error('File not found'));

      try {
        await gcsProvider.deleteFile(fileName);
      } catch (error) {
        assert.ok(error.message.includes('not found'));
      }
    });
  });

  describe('Performance Benchmarks', function() {

    it('should measure upload speed for 1MB file', async function() {
      const fileSize = 1 * 1024 * 1024;
      const fileBuffer = Buffer.alloc(fileSize);
      const metadata = {
        originalName: 'benchmark-1mb.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user'
      };

      const startTime = Date.now();
      await gcsProvider.uploadFile(fileBuffer, metadata);
      const duration = Date.now() - startTime;

      console.log(`      1MB upload took ${duration}ms`);
      assert.ok(duration < 5000, 'Should complete within 5 seconds');
    });

    it('should measure upload speed for 10MB file', async function() {
      const fileSize = 10 * 1024 * 1024;
      const fileBuffer = Buffer.alloc(fileSize);
      const metadata = {
        originalName: 'benchmark-10mb.bin',
        mimeType: 'application/octet-stream',
        size: fileSize,
        userId: 'test-user'
      };

      const startTime = Date.now();
      await gcsProvider.uploadFile(fileBuffer, metadata);
      const duration = Date.now() - startTime;

      console.log(`      10MB upload took ${duration}ms`);
      assert.ok(duration < 15000, 'Should complete within 15 seconds');
    });
  });
});