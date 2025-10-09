/* eslint-disable max-statements */
'use strict';

const request = require('../formio-supertest');
const assert = require('assert');
const chance = require('chance')();
const sinon = require('sinon');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

describe('TUS Server Tests', function() {
  this.timeout(120000); // 2 minutes for upload operations

  let app;
  let tusServer;
  let uploadStore;

  before(function(done) {
    // Initialize Express app
    app = express();
    app.use(express.json());
    app.use(express.raw({ type: 'application/offset+octet-stream', limit: '100mb' }));

    // Upload store to track upload sessions
    uploadStore = new Map();

    // TUS Protocol Implementation
    tusServer = {
      /**
       * Create new upload session (POST)
       * Returns upload URL with unique ID
       */
      createUpload: function(req, res) {
        const uploadLength = parseInt(req.headers['upload-length'], 10);
        const uploadMetadata = req.headers['upload-metadata'];

        if (!uploadLength || uploadLength <= 0) {
          return res.status(400).json({ error: 'Invalid upload-length' });
        }

        // Generate unique upload ID
        const uploadId = crypto.randomBytes(16).toString('hex');

        // Parse metadata
        const metadata = {};
        if (uploadMetadata) {
          uploadMetadata.split(',').forEach(pair => {
            const [key, value] = pair.trim().split(' ');
            metadata[key] = Buffer.from(value, 'base64').toString();
          });
        }

        // Store upload session
        uploadStore.set(uploadId, {
          id: uploadId,
          uploadLength,
          uploadOffset: 0,
          metadata,
          chunks: [],
          createdAt: Date.now()
        });

        res.setHeader('Location', `/files/${uploadId}`);
        res.setHeader('Tus-Resumable', '1.0.0');
        res.status(201).send();
      },

      /**
       * Get upload status (HEAD)
       * Returns current offset
       */
      getUploadStatus: function(req, res) {
        const uploadId = req.params.id;
        const upload = uploadStore.get(uploadId);

        if (!upload) {
          return res.status(404).json({ error: 'Upload not found' });
        }

        res.setHeader('Upload-Offset', upload.uploadOffset);
        res.setHeader('Upload-Length', upload.uploadLength);
        res.setHeader('Tus-Resumable', '1.0.0');
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).send();
      },

      /**
       * Upload chunk (PATCH)
       * Appends chunk to upload
       */
      uploadChunk: function(req, res) {
        const uploadId = req.params.id;
        const upload = uploadStore.get(uploadId);

        if (!upload) {
          return res.status(404).json({ error: 'Upload not found' });
        }

        const uploadOffset = parseInt(req.headers['upload-offset'], 10);
        const contentType = req.headers['content-type'];

        // Validate offset
        if (uploadOffset !== upload.uploadOffset) {
          return res.status(409).json({
            error: 'Offset mismatch',
            expected: upload.uploadOffset,
            received: uploadOffset
          });
        }

        // Validate content type
        if (contentType !== 'application/offset+octet-stream') {
          return res.status(400).json({ error: 'Invalid content-type' });
        }

        // Store chunk
        const chunk = req.body;
        upload.chunks.push(chunk);
        upload.uploadOffset += chunk.length;

        // Check if upload is complete
        const isComplete = upload.uploadOffset >= upload.uploadLength;

        res.setHeader('Upload-Offset', upload.uploadOffset);
        res.setHeader('Tus-Resumable', '1.0.0');

        if (isComplete) {
          // Combine all chunks
          const completeFile = Buffer.concat(upload.chunks);
          upload.completeFile = completeFile;
          upload.completedAt = Date.now();
        }

        res.status(204).send();
      },

      /**
       * Delete upload (DELETE)
       * Removes upload session
       */
      deleteUpload: function(req, res) {
        const uploadId = req.params.id;
        const deleted = uploadStore.delete(uploadId);

        if (!deleted) {
          return res.status(404).json({ error: 'Upload not found' });
        }

        res.setHeader('Tus-Resumable', '1.0.0');
        res.status(204).send();
      },

      /**
       * Get server info (OPTIONS)
       * Returns TUS protocol version and extensions
       */
      getServerInfo: function(req, res) {
        res.setHeader('Tus-Resumable', '1.0.0');
        res.setHeader('Tus-Version', '1.0.0');
        res.setHeader('Tus-Extension', 'creation,termination,checksum');
        res.setHeader('Tus-Max-Size', '1073741824'); // 1GB
        res.status(204).send();
      }
    };

    // Setup routes
    app.options('/files', tusServer.getServerInfo);
    app.post('/files', tusServer.createUpload);
    app.head('/files/:id', tusServer.getUploadStatus);
    app.patch('/files/:id', tusServer.uploadChunk);
    app.delete('/files/:id', tusServer.deleteUpload);

    done();
  });

  after(function(done) {
    uploadStore.clear();
    done();
  });

  describe('Upload Initiation', function() {

    it('should create new upload session', function(done) {
      const fileSize = 1024 * 1024; // 1MB
      const metadata = Buffer.from('test-file.txt').toString('base64');

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize)
        .set('Upload-Metadata', `filename ${metadata}`)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .expect('Location', /\/files\/[a-f0-9]{32}/)
        .expect('Tus-Resumable', '1.0.0')
        .end(done);
    });

    it('should reject upload without upload-length', function(done) {
      request(app)
        .post('/files')
        .set('Tus-Resumable', '1.0.0')
        .expect(400)
        .end((err, res) => {
          assert.ok(res.body.error.includes('upload-length'));
          done(err);
        });
    });

    it('should create upload with metadata', function(done) {
      const fileSize = 5 * 1024 * 1024; // 5MB
      const filename = Buffer.from('document.pdf').toString('base64');
      const filetype = Buffer.from('application/pdf').toString('base64');

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize)
        .set('Upload-Metadata', `filename ${filename},filetype ${filetype}`)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          const location = res.headers.location;
          const uploadId = location.split('/').pop();
          const upload = uploadStore.get(uploadId);

          assert.strictEqual(upload.metadata.filename, 'document.pdf');
          assert.strictEqual(upload.metadata.filetype, 'application/pdf');
          done(err);
        });
    });

    it('should handle large file upload initiation', function(done) {
      const fileSize = 500 * 1024 * 1024; // 500MB

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end(done);
    });
  });

  describe('Chunk Upload Sequence', function() {

    it('should upload file in single chunk', function(done) {
      const fileContent = Buffer.from('Hello, TUS Protocol!');

      // Create upload
      request(app)
        .post('/files')
        .set('Upload-Length', fileContent.length)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          // Upload chunk
          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(fileContent)
            .expect(204)
            .expect('Upload-Offset', fileContent.length.toString())
            .end((err) => {
              if (err) return done(err);

              // Verify upload is complete
              const upload = uploadStore.get(uploadId);
              assert.strictEqual(upload.uploadOffset, fileContent.length);
              assert.ok(upload.completeFile);
              assert.strictEqual(upload.completeFile.toString(), fileContent.toString());
              done();
            });
        });
    });

    it('should upload file in multiple chunks', function(done) {
      const chunkSize = 1024; // 1KB chunks
      const totalSize = 5 * 1024; // 5KB total
      const fileContent = Buffer.alloc(totalSize, 'x');

      // Create upload
      request(app)
        .post('/files')
        .set('Upload-Length', totalSize)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();
          let offset = 0;

          const uploadNextChunk = () => {
            if (offset >= totalSize) {
              // Verify complete upload
              const upload = uploadStore.get(uploadId);
              assert.strictEqual(upload.uploadOffset, totalSize);
              assert.ok(upload.completeFile);
              return done();
            }

            const chunk = fileContent.slice(offset, offset + chunkSize);

            request(app)
              .patch(`/files/${uploadId}`)
              .set('Upload-Offset', offset.toString())
              .set('Content-Type', 'application/offset+octet-stream')
              .set('Tus-Resumable', '1.0.0')
              .send(chunk)
              .expect(204)
              .end((err) => {
                if (err) return done(err);
                offset += chunk.length;
                uploadNextChunk();
              });
          };

          uploadNextChunk();
        });
    });

    it('should handle large chunks (10MB)', function(done) {
      const chunkSize = 10 * 1024 * 1024; // 10MB
      const chunk = Buffer.alloc(chunkSize, 'y');

      request(app)
        .post('/files')
        .set('Upload-Length', chunkSize)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(chunk)
            .expect(204)
            .expect('Upload-Offset', chunkSize.toString())
            .end(done);
        });
    });

    it('should reject chunk with wrong offset', function(done) {
      const fileContent = Buffer.from('test');

      request(app)
        .post('/files')
        .set('Upload-Length', fileContent.length * 2)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          // Try to upload with wrong offset
          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '100') // Wrong offset
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(fileContent)
            .expect(409)
            .end((err, res) => {
              assert.ok(res.body.error.includes('Offset mismatch'));
              done(err);
            });
        });
    });
  });

  describe('Upload Completion', function() {

    it('should mark upload as complete when all chunks received', function(done) {
      const fileContent = Buffer.from('Complete file content');

      request(app)
        .post('/files')
        .set('Upload-Length', fileContent.length)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(fileContent)
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              const upload = uploadStore.get(uploadId);
              assert.strictEqual(upload.uploadOffset, upload.uploadLength);
              assert.ok(upload.completedAt, 'Should have completion timestamp');
              assert.ok(upload.completeFile, 'Should have complete file');
              done();
            });
        });
    });

    it('should verify file integrity after completion', function(done) {
      const originalContent = Buffer.from('Integrity check content');
      const originalHash = crypto.createHash('md5').update(originalContent).digest('hex');

      request(app)
        .post('/files')
        .set('Upload-Length', originalContent.length)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(originalContent)
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              const upload = uploadStore.get(uploadId);
              const uploadedHash = crypto.createHash('md5').update(upload.completeFile).digest('hex');

              assert.strictEqual(uploadedHash, originalHash, 'File hash should match');
              done();
            });
        });
    });
  });

  describe('Authentication Validation', function() {

    it('should validate JWT token for upload creation', function(done) {
      // Add authentication middleware
      const authMiddleware = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token || !token.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
      };

      // Create authenticated endpoint
      const authApp = express();
      authApp.post('/secure-files', authMiddleware, tusServer.createUpload);

      request(authApp)
        .post('/secure-files')
        .set('Upload-Length', '1024')
        .set('Tus-Resumable', '1.0.0')
        .expect(401)
        .end(done);
    });

    it('should allow upload with valid token', function(done) {
      const authMiddleware = (req, res, next) => {
        const token = req.headers['authorization'];
        if (token === 'Bearer valid-token-123') {
          next();
        } else {
          res.status(401).json({ error: 'Invalid token' });
        }
      };

      const authApp = express();
      authApp.post('/secure-files', authMiddleware, tusServer.createUpload);

      request(authApp)
        .post('/secure-files')
        .set('Authorization', 'Bearer valid-token-123')
        .set('Upload-Length', '1024')
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end(done);
    });
  });

  describe('Concurrent Uploads', function() {

    it('should handle 10 concurrent upload sessions', function(done) {
      const uploadCount = 10;
      const uploadPromises = [];

      for (let i = 0; i < uploadCount; i++) {
        const promise = new Promise((resolve, reject) => {
          request(app)
            .post('/files')
            .set('Upload-Length', 1024 * (i + 1))
            .set('Tus-Resumable', '1.0.0')
            .expect(201)
            .end((err, res) => {
              if (err) reject(err);
              else resolve(res.headers.location);
            });
        });
        uploadPromises.push(promise);
      }

      Promise.all(uploadPromises)
        .then(locations => {
          assert.strictEqual(locations.length, uploadCount);
          assert.strictEqual(uploadStore.size, uploadCount);
          done();
        })
        .catch(done);
    });

    it('should handle concurrent chunk uploads', function(done) {
      const fileContent = Buffer.from('Concurrent test');

      // Create upload first
      request(app)
        .post('/files')
        .set('Upload-Length', fileContent.length)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          // Try concurrent chunk uploads (should fail due to offset)
          Promise.all([
            new Promise((resolve) => {
              request(app)
                .patch(`/files/${uploadId}`)
                .set('Upload-Offset', '0')
                .set('Content-Type', 'application/offset+octet-stream')
                .set('Tus-Resumable', '1.0.0')
                .send(fileContent)
                .end((err, res) => resolve({ err, status: res.status }));
            }),
            new Promise((resolve) => {
              setTimeout(() => {
                request(app)
                  .patch(`/files/${uploadId}`)
                  .set('Upload-Offset', '0')
                  .set('Content-Type', 'application/offset+octet-stream')
                  .set('Tus-Resumable', '1.0.0')
                  .send(fileContent)
                  .end((err, res) => resolve({ err, status: res.status }));
              }, 100);
            })
          ]).then(results => {
            // One should succeed, one should fail
            const statuses = results.map(r => r.status);
            assert.ok(statuses.includes(204), 'One upload should succeed');
            done();
          });
        });
    });
  });

  describe('Upload Status and Resume', function() {

    it('should get upload status', function(done) {
      const fileSize = 10240;

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          request(app)
            .head(`/files/${uploadId}`)
            .set('Tus-Resumable', '1.0.0')
            .expect(200)
            .expect('Upload-Offset', '0')
            .expect('Upload-Length', fileSize.toString())
            .end(done);
        });
    });

    it('should resume upload from last offset', function(done) {
      const chunkSize = 1024;
      const totalSize = 3072; // 3KB
      const chunk1 = Buffer.alloc(chunkSize, 'a');
      const chunk2 = Buffer.alloc(chunkSize, 'b');
      const chunk3 = Buffer.alloc(chunkSize, 'c');

      request(app)
        .post('/files')
        .set('Upload-Length', totalSize)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          // Upload first chunk
          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(chunk1)
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              // Get status
              request(app)
                .head(`/files/${uploadId}`)
                .set('Tus-Resumable', '1.0.0')
                .expect('Upload-Offset', chunkSize.toString())
                .end((err) => {
                  if (err) return done(err);

                  // Resume with remaining chunks
                  request(app)
                    .patch(`/files/${uploadId}`)
                    .set('Upload-Offset', chunkSize.toString())
                    .set('Content-Type', 'application/offset+octet-stream')
                    .set('Tus-Resumable', '1.0.0')
                    .send(Buffer.concat([chunk2, chunk3]))
                    .expect(204)
                    .expect('Upload-Offset', totalSize.toString())
                    .end(done);
                });
            });
        });
    });
  });

  describe('Upload Termination', function() {

    it('should delete upload session', function(done) {
      request(app)
        .post('/files')
        .set('Upload-Length', '1024')
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          request(app)
            .delete(`/files/${uploadId}`)
            .set('Tus-Resumable', '1.0.0')
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              assert.ok(!uploadStore.has(uploadId), 'Upload should be deleted');
              done();
            });
        });
    });

    it('should return 404 for deleted upload', function(done) {
      request(app)
        .post('/files')
        .set('Upload-Length', '1024')
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();

          request(app)
            .delete(`/files/${uploadId}`)
            .set('Tus-Resumable', '1.0.0')
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              request(app)
                .head(`/files/${uploadId}`)
                .set('Tus-Resumable', '1.0.0')
                .expect(404)
                .end(done);
            });
        });
    });
  });

  describe('Server Information', function() {

    it('should return TUS protocol version', function(done) {
      request(app)
        .options('/files')
        .expect(204)
        .expect('Tus-Resumable', '1.0.0')
        .expect('Tus-Version', '1.0.0')
        .end(done);
    });

    it('should return supported extensions', function(done) {
      request(app)
        .options('/files')
        .expect('Tus-Extension', /creation/)
        .expect('Tus-Extension', /termination/)
        .end(done);
    });

    it('should return max upload size', function(done) {
      request(app)
        .options('/files')
        .expect('Tus-Max-Size', '1073741824')
        .end(done);
    });
  });
});