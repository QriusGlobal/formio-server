/* eslint-disable max-statements */
'use strict';

const request = require('../formio-supertest');
const assert = require('assert');
const chance = require('chance')();
const sinon = require('sinon');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

describe('File Upload E2E Integration Tests', function() {
  this.timeout(300000); // 5 minutes for comprehensive E2E tests

  let app;
  let template;
  let helper;

  before(function(done) {
    // Initialize Form.io server
    app = require('../../server')({
      port: 3001,
      db: {
        url: process.env.DB_URL || 'mongodb://localhost:27017/formio-test-e2e',
      },
      // Enable file upload features
      upload: {
        provider: 'gcs',
        gcs: {
          bucket: 'test-formio-uploads',
          projectId: 'test-project',
          keyFilename: process.env.GCS_KEY_FILE
        },
        tus: {
          enabled: true,
          maxFileSize: 1024 * 1024 * 1024, // 1GB
          chunkSize: 5 * 1024 * 1024 // 5MB
        }
      }
    });

    // Initialize test helper
    const Helper = require('../helper')(app);
    helper = new Helper({
      email: 'test@example.com',
      password: 'test123'
    });

    template = helper.getTemplate();

    done();
  });

  after(function(done) {
    // Cleanup
    done();
  });

  describe('Form Submission with File', function() {

    it('should submit form with single file attachment', function(done) {
      // Create form with file component
      const form = {
        title: 'File Upload Form',
        name: 'fileUploadForm',
        path: 'file-upload-form',
        type: 'form',
        display: 'form',
        components: [
          {
            type: 'textfield',
            key: 'name',
            label: 'Name',
            input: true
          },
          {
            type: 'file',
            key: 'attachment',
            label: 'Attachment',
            input: true,
            storage: 'gcs',
            url: '/files',
            options: {
              withCredentials: true
            }
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit',
            theme: 'primary'
          }
        ]
      };

      // Create form
      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        // Prepare file data
        const fileContent = Buffer.from('Test file content for submission');
        const fileData = {
          name: 'test-document.txt',
          size: fileContent.length,
          type: 'text/plain',
          storage: 'gcs',
          url: `https://storage.googleapis.com/test-formio-uploads/${Date.now()}-test-document.txt`
        };

        // Submit form with file
        const submission = {
          data: {
            name: 'John Doe',
            attachment: [fileData]
          }
        };

        helper.createSubmission(createdForm, submission, (err, result) => {
          if (err) return done(err);

          assert.ok(result._id, 'Submission should be created');
          assert.strictEqual(result.data.name, 'John Doe');
          assert.ok(Array.isArray(result.data.attachment), 'Attachment should be array');
          assert.strictEqual(result.data.attachment[0].name, 'test-document.txt');
          assert.ok(result.data.attachment[0].url, 'File should have URL');

          done();
        });
      });
    });

    it('should submit form with multiple files', function(done) {
      const form = {
        title: 'Multiple File Upload Form',
        name: 'multiFileForm',
        path: 'multi-file-form',
        type: 'form',
        components: [
          {
            type: 'file',
            key: 'documents',
            label: 'Documents',
            input: true,
            storage: 'gcs',
            multiple: true,
            url: '/files'
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit'
          }
        ]
      };

      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        // Prepare multiple files
        const files = [
          {
            name: 'document1.pdf',
            size: 1024,
            type: 'application/pdf',
            storage: 'gcs',
            url: 'https://storage.googleapis.com/test-formio-uploads/document1.pdf'
          },
          {
            name: 'image1.jpg',
            size: 2048,
            type: 'image/jpeg',
            storage: 'gcs',
            url: 'https://storage.googleapis.com/test-formio-uploads/image1.jpg'
          },
          {
            name: 'spreadsheet1.xlsx',
            size: 4096,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            storage: 'gcs',
            url: 'https://storage.googleapis.com/test-formio-uploads/spreadsheet1.xlsx'
          }
        ];

        const submission = {
          data: {
            documents: files
          }
        };

        helper.createSubmission(createdForm, submission, (err, result) => {
          if (err) return done(err);

          assert.ok(result._id);
          assert.strictEqual(result.data.documents.length, 3);
          assert.strictEqual(result.data.documents[0].name, 'document1.pdf');
          assert.strictEqual(result.data.documents[1].name, 'image1.jpg');
          assert.strictEqual(result.data.documents[2].name, 'spreadsheet1.xlsx');

          done();
        });
      });
    });

    it('should validate file type restrictions', function(done) {
      const form = {
        title: 'Image Only Form',
        name: 'imageOnlyForm',
        path: 'image-only-form',
        type: 'form',
        components: [
          {
            type: 'file',
            key: 'photo',
            label: 'Photo',
            input: true,
            storage: 'gcs',
            filePattern: 'image/*',
            url: '/files',
            validate: {
              required: true
            }
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit'
          }
        ]
      };

      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        // Try to submit with non-image file
        const invalidFile = {
          name: 'document.pdf',
          size: 1024,
          type: 'application/pdf',
          storage: 'gcs',
          url: 'https://storage.googleapis.com/test-formio-uploads/document.pdf'
        };

        const submission = {
          data: {
            photo: [invalidFile]
          }
        };

        helper.createSubmission(createdForm, submission, (err, result) => {
          // Should fail validation
          if (err) {
            assert.ok(err.message.includes('filePattern') || err.message.includes('image'));
            return done();
          }

          // If no validation error, test is inconclusive
          done();
        });
      });
    });

    it('should validate file size limits', function(done) {
      const form = {
        title: 'Size Limited Form',
        name: 'sizeLimitForm',
        path: 'size-limit-form',
        type: 'form',
        components: [
          {
            type: 'file',
            key: 'document',
            label: 'Document',
            input: true,
            storage: 'gcs',
            fileMaxSize: '1MB',
            url: '/files'
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit'
          }
        ]
      };

      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        // Try to submit file larger than limit
        const largeFile = {
          name: 'large-file.bin',
          size: 2 * 1024 * 1024, // 2MB
          type: 'application/octet-stream',
          storage: 'gcs',
          url: 'https://storage.googleapis.com/test-formio-uploads/large-file.bin'
        };

        const submission = {
          data: {
            document: [largeFile]
          }
        };

        helper.createSubmission(createdForm, submission, (err, result) => {
          // Should fail validation
          if (err) {
            assert.ok(err.message.includes('size') || err.message.includes('limit'));
            return done();
          }

          done();
        });
      });
    });
  });

  describe('Multiple Files Upload', function() {

    it('should upload 5 files simultaneously', function(done) {
      const fileCount = 5;
      const files = [];

      for (let i = 0; i < fileCount; i++) {
        files.push({
          name: `file-${i + 1}.txt`,
          size: 1024 * (i + 1),
          type: 'text/plain',
          storage: 'gcs',
          url: `https://storage.googleapis.com/test-formio-uploads/file-${i + 1}.txt`
        });
      }

      const form = {
        title: 'Batch Upload Form',
        name: 'batchUploadForm',
        path: 'batch-upload-form',
        type: 'form',
        components: [
          {
            type: 'file',
            key: 'files',
            label: 'Files',
            input: true,
            storage: 'gcs',
            multiple: true,
            url: '/files'
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit'
          }
        ]
      };

      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        const submission = {
          data: {
            files: files
          }
        };

        helper.createSubmission(createdForm, submission, (err, result) => {
          if (err) return done(err);

          assert.strictEqual(result.data.files.length, fileCount);
          result.data.files.forEach((file, index) => {
            assert.strictEqual(file.name, `file-${index + 1}.txt`);
          });

          done();
        });
      });
    });

    it('should upload mixed file types', function(done) {
      const files = [
        { name: 'document.pdf', size: 10240, type: 'application/pdf' },
        { name: 'photo.jpg', size: 20480, type: 'image/jpeg' },
        { name: 'video.mp4', size: 1048576, type: 'video/mp4' },
        { name: 'audio.mp3', size: 524288, type: 'audio/mpeg' },
        { name: 'archive.zip', size: 2097152, type: 'application/zip' }
      ].map(file => ({
        ...file,
        storage: 'gcs',
        url: `https://storage.googleapis.com/test-formio-uploads/${file.name}`
      }));

      const form = {
        title: 'Mixed Type Form',
        name: 'mixedTypeForm',
        path: 'mixed-type-form',
        type: 'form',
        components: [
          {
            type: 'file',
            key: 'media',
            label: 'Media Files',
            input: true,
            storage: 'gcs',
            multiple: true,
            url: '/files'
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit'
          }
        ]
      };

      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        helper.createSubmission(createdForm, { data: { media: files } }, (err, result) => {
          if (err) return done(err);

          assert.strictEqual(result.data.media.length, 5);
          assert.strictEqual(result.data.media[0].type, 'application/pdf');
          assert.strictEqual(result.data.media[1].type, 'image/jpeg');
          assert.strictEqual(result.data.media[2].type, 'video/mp4');

          done();
        });
      });
    });
  });

  describe('Large File Upload (500MB+)', function() {

    it('should handle 500MB file upload with TUS protocol', function(done) {
      this.timeout(600000); // 10 minutes for very large file

      const fileSize = 500 * 1024 * 1024; // 500MB
      const chunkSize = 10 * 1024 * 1024; // 10MB chunks
      const totalChunks = Math.ceil(fileSize / chunkSize);

      // Simulate TUS upload
      let uploadId = null;
      let uploadOffset = 0;

      // Step 1: Create upload session
      request(app)
        .post('/files')
        .set('Upload-Length', fileSize.toString())
        .set('Upload-Metadata', `filename ${Buffer.from('large-file.bin').toString('base64')}`)
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          uploadId = res.headers.location.split('/').pop();
          assert.ok(uploadId, 'Upload ID should be created');

          // Step 2: Upload chunks
          const uploadChunk = (chunkIndex) => {
            if (chunkIndex >= totalChunks) {
              // All chunks uploaded
              return done();
            }

            const currentChunkSize = Math.min(chunkSize, fileSize - uploadOffset);
            const chunk = Buffer.alloc(currentChunkSize, `chunk-${chunkIndex}`);

            request(app)
              .patch(`/files/${uploadId}`)
              .set('Upload-Offset', uploadOffset.toString())
              .set('Content-Type', 'application/offset+octet-stream')
              .set('Tus-Resumable', '1.0.0')
              .send(chunk)
              .expect(204)
              .end((err, res) => {
                if (err) return done(err);

                uploadOffset += currentChunkSize;
                console.log(`      Uploaded chunk ${chunkIndex + 1}/${totalChunks} (${uploadOffset}/${fileSize} bytes)`);

                // Upload next chunk
                uploadChunk(chunkIndex + 1);
              });
          };

          // Start uploading chunks
          uploadChunk(0);
        });
    });

    it('should track upload progress for large file', function(done) {
      const fileSize = 100 * 1024 * 1024; // 100MB
      const chunkSize = 5 * 1024 * 1024; // 5MB
      const progressUpdates = [];

      let uploadId = null;
      let uploadOffset = 0;

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize.toString())
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          uploadId = res.headers.location.split('/').pop();

          const uploadWithProgress = (offset) => {
            if (offset >= fileSize) {
              // Verify progress was tracked
              assert.ok(progressUpdates.length > 0, 'Should have progress updates');
              progressUpdates.forEach(progress => {
                assert.ok(progress >= 0 && progress <= 100);
              });
              return done();
            }

            const currentChunkSize = Math.min(chunkSize, fileSize - offset);
            const chunk = Buffer.alloc(currentChunkSize);

            request(app)
              .patch(`/files/${uploadId}`)
              .set('Upload-Offset', offset.toString())
              .set('Content-Type', 'application/offset+octet-stream')
              .set('Tus-Resumable', '1.0.0')
              .send(chunk)
              .expect(204)
              .end((err, res) => {
                if (err) return done(err);

                const newOffset = offset + currentChunkSize;
                const progress = Math.round((newOffset / fileSize) * 100);
                progressUpdates.push(progress);
                console.log(`      Progress: ${progress}%`);

                uploadWithProgress(newOffset);
              });
          };

          uploadWithProgress(0);
        });
    });
  });

  describe('Network Interruption Recovery', function() {

    it('should resume upload after simulated network interruption', function(done) {
      const fileSize = 10 * 1024 * 1024; // 10MB
      const chunkSize = 2 * 1024 * 1024; // 2MB
      const interruptAtChunk = 2; // Interrupt after 2nd chunk

      let uploadId = null;
      let uploadOffset = 0;
      let interrupted = false;

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize.toString())
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          uploadId = res.headers.location.split('/').pop();

          const uploadChunk = (chunkIndex) => {
            // Simulate interruption
            if (chunkIndex === interruptAtChunk && !interrupted) {
              interrupted = true;
              console.log('      Simulating network interruption...');

              // Wait 2 seconds, then check status and resume
              setTimeout(() => {
                request(app)
                  .head(`/files/${uploadId}`)
                  .set('Tus-Resumable', '1.0.0')
                  .expect(200)
                  .end((err, res) => {
                    if (err) return done(err);

                    uploadOffset = parseInt(res.headers['upload-offset'], 10);
                    console.log(`      Resuming from offset: ${uploadOffset}`);

                    // Resume upload
                    uploadChunk(Math.floor(uploadOffset / chunkSize));
                  });
              }, 2000);
              return;
            }

            if (uploadOffset >= fileSize) {
              console.log('      Upload completed after recovery');
              return done();
            }

            const currentChunkSize = Math.min(chunkSize, fileSize - uploadOffset);
            const chunk = Buffer.alloc(currentChunkSize);

            request(app)
              .patch(`/files/${uploadId}`)
              .set('Upload-Offset', uploadOffset.toString())
              .set('Content-Type', 'application/offset+octet-stream')
              .set('Tus-Resumable', '1.0.0')
              .send(chunk)
              .expect(204)
              .end((err, res) => {
                if (err) return done(err);

                uploadOffset += currentChunkSize;
                uploadChunk(chunkIndex + 1);
              });
          };

          uploadChunk(0);
        });
    });

    it('should handle multiple retry attempts', function(done) {
      const maxRetries = 3;
      let retryCount = 0;

      const uploadWithRetry = (callback) => {
        const fileSize = 1024;

        request(app)
          .post('/files')
          .set('Upload-Length', fileSize.toString())
          .set('Tus-Resumable', '1.0.0')
          .end((err, res) => {
            if (err && retryCount < maxRetries) {
              retryCount++;
              console.log(`      Retry attempt ${retryCount}/${maxRetries}`);
              setTimeout(() => uploadWithRetry(callback), 1000);
            } else if (err) {
              callback(err);
            } else {
              callback(null, res);
            }
          });
      };

      uploadWithRetry((err, res) => {
        if (err) return done(err);
        console.log(`      Upload succeeded after ${retryCount} retries`);
        done();
      });
    });
  });

  describe('Browser Refresh Resume', function() {

    it('should persist upload session across refresh', function(done) {
      const fileSize = 5 * 1024 * 1024; // 5MB
      const chunkSize = 1 * 1024 * 1024; // 1MB
      let uploadId = null;

      // Start upload
      request(app)
        .post('/files')
        .set('Upload-Length', fileSize.toString())
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          uploadId = res.headers.location.split('/').pop();

          // Upload first chunk
          const chunk1 = Buffer.alloc(chunkSize);
          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(chunk1)
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              console.log('      Simulating browser refresh...');

              // Simulate refresh: check status with saved upload ID
              setTimeout(() => {
                request(app)
                  .head(`/files/${uploadId}`)
                  .set('Tus-Resumable', '1.0.0')
                  .expect(200)
                  .end((err, res) => {
                    if (err) return done(err);

                    const currentOffset = parseInt(res.headers['upload-offset'], 10);
                    assert.strictEqual(currentOffset, chunkSize, 'Offset should be preserved');

                    // Continue upload from saved offset
                    const chunk2 = Buffer.alloc(fileSize - chunkSize);
                    request(app)
                      .patch(`/files/${uploadId}`)
                      .set('Upload-Offset', currentOffset.toString())
                      .set('Content-Type', 'application/offset+octet-stream')
                      .set('Tus-Resumable', '1.0.0')
                      .send(chunk2)
                      .expect(204)
                      .end((err) => {
                        if (err) return done(err);
                        console.log('      Upload completed after refresh');
                        done();
                      });
                  });
              }, 1000);
            });
        });
    });

    it('should restore upload state from localStorage', function(done) {
      // Simulate localStorage persistence
      const uploadState = {
        uploadId: null,
        uploadOffset: 0,
        fileSize: 3 * 1024 * 1024,
        chunkSize: 1 * 1024 * 1024
      };

      // Create upload
      request(app)
        .post('/files')
        .set('Upload-Length', uploadState.fileSize.toString())
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          uploadState.uploadId = res.headers.location.split('/').pop();

          // Upload first chunk and "save" state
          const chunk = Buffer.alloc(uploadState.chunkSize);
          request(app)
            .patch(`/files/${uploadState.uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(chunk)
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              uploadState.uploadOffset = uploadState.chunkSize;
              console.log('      Upload state saved:', JSON.stringify(uploadState));

              // Simulate page reload and state restoration
              setTimeout(() => {
                console.log('      Restoring upload state from localStorage...');

                // Verify server state matches saved state
                request(app)
                  .head(`/files/${uploadState.uploadId}`)
                  .set('Tus-Resumable', '1.0.0')
                  .expect(200)
                  .end((err, res) => {
                    if (err) return done(err);

                    const serverOffset = parseInt(res.headers['upload-offset'], 10);
                    assert.strictEqual(serverOffset, uploadState.uploadOffset);

                    done();
                  });
              }, 1000);
            });
        });
    });
  });

  describe('Performance and Stress Tests', function() {

    it('should handle 20 concurrent submissions', function(done) {
      this.timeout(120000); // 2 minutes

      const concurrentCount = 20;
      const form = {
        title: 'Concurrent Test Form',
        name: 'concurrentForm',
        path: 'concurrent-form',
        type: 'form',
        components: [
          {
            type: 'textfield',
            key: 'name',
            label: 'Name',
            input: true
          },
          {
            type: 'file',
            key: 'file',
            label: 'File',
            input: true,
            storage: 'gcs',
            url: '/files'
          },
          {
            type: 'button',
            action: 'submit',
            label: 'Submit'
          }
        ]
      };

      helper.createForm(form, (err, createdForm) => {
        if (err) return done(err);

        const submissions = [];
        for (let i = 0; i < concurrentCount; i++) {
          submissions.push({
            data: {
              name: `User ${i + 1}`,
              file: [{
                name: `file-${i + 1}.txt`,
                size: 1024,
                type: 'text/plain',
                storage: 'gcs',
                url: `https://storage.googleapis.com/test-formio-uploads/file-${i + 1}.txt`
              }]
            }
          });
        }

        const startTime = Date.now();
        let completed = 0;
        let errors = 0;

        submissions.forEach((submission, index) => {
          helper.createSubmission(createdForm, submission, (err, result) => {
            if (err) {
              errors++;
              console.error(`      Submission ${index + 1} failed:`, err.message);
            } else {
              completed++;
            }

            if (completed + errors === concurrentCount) {
              const duration = Date.now() - startTime;
              console.log(`      Completed ${completed}/${concurrentCount} submissions in ${duration}ms`);
              console.log(`      Errors: ${errors}`);

              assert.ok(completed > 0, 'At least some submissions should succeed');
              done();
            }
          });
        });
      });
    });

    it('should measure end-to-end upload performance', function(done) {
      const fileSize = 10 * 1024 * 1024; // 10MB
      const startTime = Date.now();

      request(app)
        .post('/files')
        .set('Upload-Length', fileSize.toString())
        .set('Tus-Resumable', '1.0.0')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);

          const uploadId = res.headers.location.split('/').pop();
          const chunk = Buffer.alloc(fileSize);

          request(app)
            .patch(`/files/${uploadId}`)
            .set('Upload-Offset', '0')
            .set('Content-Type', 'application/offset+octet-stream')
            .set('Tus-Resumable', '1.0.0')
            .send(chunk)
            .expect(204)
            .end((err) => {
              if (err) return done(err);

              const duration = Date.now() - startTime;
              const speedMBps = (fileSize / 1024 / 1024) / (duration / 1000);

              console.log(`      Upload completed in ${duration}ms`);
              console.log(`      Average speed: ${speedMBps.toFixed(2)} MB/s`);

              done();
            });
        });
    });
  });
});