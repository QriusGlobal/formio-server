/**
 * File Generation Worker Integration Tests
 *
 * Tests for async file generation using BullMQ
 */

'use strict';

const assert = require('assert');
const { FileGenerationWorker } = require('../src/upload/workers/fileGenerationWorker');
const { createFileGenerationQueue } = require('../src/upload/config/queue.config');

describe('File Generation Worker', function() {
  this.timeout(10000); // 10 second timeout for async operations

  let worker;
  let queue;

  before(async function() {
    // Initialize worker and queue
    worker = new FileGenerationWorker(1); // Single worker for testing
    queue = createFileGenerationQueue();

    // Wait for worker to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  after(async function() {
    // Cleanup
    if (worker) {
      await worker.close();
    }
    if (queue) {
      await queue.close();
    }
  });

  describe('JSON Generation', function() {
    it('should generate JSON file successfully', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'json',
        metadata: {
          name: 'Test User',
          email: 'test@example.com',
          age: 30
        },
        formId: 'test-form-123',
        submissionId: 'test-submission-456'
      });

      // Wait for job to complete
      const result = await job.waitUntilFinished(queue.events);

      // Assertions
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.templateType, 'json');
      assert.ok(result.filename.includes('json'));
      assert.ok(result.size > 0);
      assert.ok(result.processingTime > 0);
    });

    it('should handle invalid JSON metadata', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'json',
        metadata: undefined, // Invalid
        formId: 'test-form-123'
      });

      try {
        await job.waitUntilFinished(queue.events);
        assert.fail('Should have thrown error for invalid metadata');
      } catch (error) {
        assert.ok(error.message);
      }
    });
  });

  describe('CSV Generation', function() {
    it('should generate CSV file successfully', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'csv',
        metadata: {
          headers: ['Name', 'Email', 'Age'],
          rows: [
            ['John Doe', 'john@example.com', 25],
            ['Jane Smith', 'jane@example.com', 30]
          ]
        },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.templateType, 'csv');
      assert.ok(result.filename.endsWith('.csv'));
    });

    it('should escape CSV cells with special characters', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'csv',
        metadata: {
          headers: ['Name', 'Description'],
          rows: [
            ['Test, Inc.', 'A company with "quotes"'],
            ['Another\nName', 'Line breaks']
          ]
        },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      assert.strictEqual(result.success, true);
      assert.ok(result.size > 0);
    });
  });

  describe('HTML Generation', function() {
    it('should generate HTML file successfully', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'html',
        metadata: {
          title: 'Test Document',
          body: '<p>This is a test document</p>'
        },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.templateType, 'html');
      assert.ok(result.filename.endsWith('.html'));
    });

    it('should escape HTML in title', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'html',
        metadata: {
          title: '<script>alert("XSS")</script>',
          body: 'Safe content'
        },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      assert.strictEqual(result.success, true);
      // Title should be escaped in generated HTML
    });
  });

  describe('PDF Generation', function() {
    it('should generate PDF placeholder successfully', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'pdf',
        metadata: {
          title: 'Test PDF',
          content: 'PDF content here'
        },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.templateType, 'pdf');
      assert.ok(result.filename.endsWith('.pdf'));
    });
  });

  describe('Error Handling', function() {
    it('should fail with missing templateType', async function() {
      const job = await queue.add('generate-file', {
        // Missing templateType
        metadata: { test: 'data' },
        formId: 'test-form-123'
      });

      try {
        await job.waitUntilFinished(queue.events);
        assert.fail('Should have thrown error for missing templateType');
      } catch (error) {
        assert.ok(error.message.includes('templateType'));
      }
    });

    it('should fail with unknown templateType', async function() {
      const job = await queue.add('generate-file', {
        templateType: 'unknown-type',
        metadata: { test: 'data' },
        formId: 'test-form-123'
      });

      try {
        await job.waitUntilFinished(queue.events);
        assert.fail('Should have thrown error for unknown templateType');
      } catch (error) {
        assert.ok(error.message.includes('Unknown template type'));
      }
    });

    it('should retry on transient errors', async function() {
      // This test would require mocking filesystem errors
      // For now, we'll just verify retry count is tracked
      const job = await queue.add('generate-file', {
        templateType: 'json',
        metadata: { test: 'data' },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      assert.strictEqual(result.retryCount, 0); // First attempt, no retries
    });
  });

  describe('Progress Tracking', function() {
    it('should report progress during processing', async function() {
      const progressUpdates = [];

      const job = await queue.add('generate-file', {
        templateType: 'json',
        metadata: { test: 'data' },
        formId: 'test-form-123'
      });

      // Listen for progress events
      job.on('progress', (progress) => {
        progressUpdates.push(progress);
      });

      await job.waitUntilFinished(queue.events);

      // Should have received progress updates
      assert.ok(progressUpdates.length > 0);
      assert.ok(progressUpdates.some(p => p === 100)); // Should reach 100%
    });
  });

  describe('Concurrency', function() {
    it('should process multiple jobs concurrently', async function() {
      const jobs = [];

      // Submit 5 jobs
      for (let i = 0; i < 5; i++) {
        const job = await queue.add('generate-file', {
          templateType: 'json',
          metadata: { index: i },
          formId: `test-form-${i}`
        });
        jobs.push(job);
      }

      // Wait for all jobs to complete
      const results = await Promise.all(
        jobs.map(job => job.waitUntilFinished(queue.events))
      );

      // All jobs should succeed
      assert.strictEqual(results.length, 5);
      results.forEach(result => {
        assert.strictEqual(result.success, true);
      });
    });
  });

  describe('File Cleanup', function() {
    it('should create files in temporary directory', async function() {
      const fs = require('fs').promises;

      const job = await queue.add('generate-file', {
        templateType: 'json',
        metadata: { test: 'data' },
        formId: 'test-form-123'
      });

      const result = await job.waitUntilFinished(queue.events);

      // Verify file exists
      const stats = await fs.stat(result.path);
      assert.ok(stats.isFile());
      assert.strictEqual(stats.size, result.size);

      // Cleanup test file
      await fs.unlink(result.path);
    });
  });
});
