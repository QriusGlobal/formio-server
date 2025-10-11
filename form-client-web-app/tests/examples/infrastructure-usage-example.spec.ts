/**
 * Infrastructure Usage Examples
 *
 * Demonstrates how to use the test infrastructure files
 */

import { test, expect } from '@playwright/test';
import { MockGCSProvider } from '../fixtures/mock-gcs-provider';
import { QueueTestHelper } from '../fixtures/queue-test-helpers';
import { E2E_CONFIG, getTimeout, getServiceUrl } from '../config/e2e-test.config';

test.describe('Infrastructure Usage Examples', () => {
  test('Mock GCS Provider - Success scenario', async () => {
    const provider = new MockGCSProvider('test-bucket');

    // Upload file
    const result = await provider.multipartUpload(
      Buffer.from('test content'),
      { contentType: 'text/plain' }
    );

    expect(result.key).toBeDefined();
    expect(result.location).toContain('storage.googleapis.com');
    expect(result.size).toBeGreaterThan(0);
    expect(provider.hasFile(result.key)).toBe(true);

    // Cleanup
    provider.reset();
  });

  test('Mock GCS Provider - Network failure', async () => {
    const provider = new MockGCSProvider('test-bucket');

    // Set failure mode
    provider.setFailureMode('network');

    // Should throw network error
    await expect(
      provider.multipartUpload(Buffer.from('test'), {})
    ).rejects.toThrow(/ECONNREFUSED/);

    // Reset for next test
    provider.reset();
  });

  test('Mock GCS Provider - Presigned URL', async () => {
    const provider = new MockGCSProvider('test-bucket');

    const url = await provider.generatePresignedUrl(
      'test-file.pdf',
      'read',
      { expiresIn: 3600 }
    );

    expect(url).toContain('X-Goog-Algorithm');
    expect(url).toContain('X-Goog-Signature');

    provider.reset();
  });

  test('Queue Helper - Enqueue and wait for completion', async () => {
    const helper = new QueueTestHelper({
      queueName: 'test-uploads',
    });

    try {
      // Enqueue job
      const jobId = await helper.enqueueTestJob({
        fileId: 'test-file-1',
        fileName: 'test.pdf',
        fileSize: 1024,
        uploadUrl: 'http://localhost:1080/files/test-1',
      });

      expect(jobId).toBeDefined();

      // Get job
      const job = await helper.getJob(jobId);
      expect(job).toBeDefined();

      // Get metrics
      const metrics = await helper.getQueueMetrics();
      expect(metrics.waiting).toBeGreaterThanOrEqual(0);
    } finally {
      await helper.cleanQueue();
      await helper.close();
    }
  });

  test('E2E Config - Service URLs', async () => {
    const formioUrl = getServiceUrl('formio');
    const tusUrl = getServiceUrl('tus');

    expect(formioUrl).toBe('http://localhost:3001');
    expect(tusUrl).toContain('localhost:1080');
  });

  test('E2E Config - Timeouts', async () => {
    const uploadTimeout = getTimeout('fileUpload');
    const apiTimeout = getTimeout('apiRequest');

    expect(uploadTimeout).toBe(120000); // 2 minutes
    expect(apiTimeout).toBe(5000); // 5 seconds
  });

  test('E2E Config - Environment detection', async () => {
    // These should work without errors
    const services = E2E_CONFIG.services;
    expect(services.formio).toBeDefined();
    expect(services.tus).toBeDefined();
    expect(services.gcs).toBeDefined();
  });
});

test.describe('Integration Example', () => {
  test('Upload with queue monitoring', async () => {
    const provider = new MockGCSProvider('integration-test');
    const queueHelper = new QueueTestHelper({
      queueName: 'integration-test-queue',
    });

    try {
      // Enqueue upload job
      const jobId = await queueHelper.enqueueTestJob({
        fileId: 'integration-1',
        fileName: 'integration-test.bin',
        fileSize: 1024 * 1024, // 1MB
        uploadUrl: 'http://localhost:1080/files/integration-1',
      });

      // Monitor progress (in real scenario, worker would update this)
      const metrics = await queueHelper.getQueueMetrics();
      expect(metrics.waiting + metrics.active).toBeGreaterThan(0);

      // Simulate upload to GCS
      const uploadResult = await provider.multipartUpload(
        Buffer.alloc(1024 * 1024),
        { contentType: 'application/octet-stream' }
      );

      expect(uploadResult.size).toBe(1024 * 1024);
      expect(provider.getUploadCount()).toBe(1);
    } finally {
      await queueHelper.cleanQueue();
      await queueHelper.close();
      provider.reset();
    }
  });

  test('Retry logic with failure recovery', async () => {
    const provider = new MockGCSProvider('retry-test');

    // Start with network failure
    provider.setFailureMode('network');

    let attemptCount = 0;
    const maxAttempts = 3;

    // Retry loop
    while (attemptCount < maxAttempts) {
      try {
        // After 2 failures, succeed
        if (attemptCount >= 2) {
          provider.setFailureMode('success');
        }

        const result = await provider.multipartUpload(
          Buffer.from('test retry'),
          { contentType: 'text/plain' }
        );

        // Success on 3rd attempt
        expect(attemptCount).toBe(2);
        expect(result.key).toBeDefined();
        break;
      } catch (error) {
        attemptCount++;
        if (attemptCount === maxAttempts) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    provider.reset();
  });
});
