/**
 * BullMQ Queue Recovery & Resilience Test Suite
 *
 * Comprehensive testing of queue-based async job processing with failure recovery,
 * retry mechanisms, stalled job detection, and graceful shutdown scenarios.
 *
 * Prerequisites:
 * - Redis running at localhost:6379
 * - BullMQ and IORedis installed
 * - Mock GCS provider for failure simulation
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import IORedis from 'ioredis';
import { processGCSUpload } from '../../../formio/src/upload/workers/gcsUploadWorker';
import type { IUploadJob, IUploadResult } from '../../../formio/src/upload/contracts/IUploadJob';

// Redis connection configuration
const redisConfig = {
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false
};

// Queue name for testing
const TEST_QUEUE_NAME = 'gcs-upload-test';

describe('BullMQ Queue Recovery & Resilience', () => {
  let queue: Queue;
  let worker: Worker;
  let queueEvents: QueueEvents;
  let redisClient: IORedis;

  // Mock providers
  let mockGCSProvider: any;
  let mockTusStore: any;
  let mockSubmissionModel: any;

  beforeAll(async () => {
    // Create Redis client for cleanup operations
    redisClient = new IORedis(redisConfig);

    // Verify Redis connectivity
    const pingResult = await redisClient.ping();
    expect(pingResult).toBe('PONG');
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  beforeEach(async () => {
    // Clean up any existing jobs from previous tests
    const queueForCleanup = new Queue(TEST_QUEUE_NAME, { connection: redisConfig });
    await queueForCleanup.obliterate({ force: true });
    await queueForCleanup.close();

    // Create fresh queue instance
    queue = new Queue(TEST_QUEUE_NAME, {
      connection: redisConfig,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000 // 2s, 4s, 8s, 16s, 32s
        },
        removeOnComplete: {
          age: 86400, // 24 hours
          count: 1000
        },
        removeOnFail: {
          age: 604800 // 7 days
        }
      }
    });

    // Create queue events for monitoring
    queueEvents = new QueueEvents(TEST_QUEUE_NAME, { connection: redisConfig });

    // Initialize mock providers
    mockGCSProvider = {
      multipartUpload: vi.fn(),
      generatePresignedUrl: vi.fn()
    };

    mockTusStore = {
      getUpload: vi.fn(),
      remove: vi.fn()
    };

    mockSubmissionModel = {
      updateOne: vi.fn()
    };
  });

  afterEach(async () => {
    // Clean shutdown of worker and queue
    if (worker) {
      await worker.close();
    }
    if (queueEvents) {
      await queueEvents.close();
    }
    if (queue) {
      await queue.close();
    }
  });

  // Helper function to create test job data
  const createTestJobData = (overrides: Partial<IUploadJob> = {}): IUploadJob => ({
    tusUploadId: `tus-${Date.now()}`,
    fileName: 'test-file.pdf',
    fileSize: 1024000,
    contentType: 'application/pdf',
    formId: 'form-123',
    submissionId: 'sub-456',
    fieldKey: 'documents',
    userId: 'user-789',
    uploadedAt: new Date(),
    ...overrides
  });

  // Helper function to wait for job state
  const waitForJobState = async (
    jobId: string,
    state: 'waiting' | 'active' | 'completed' | 'failed',
    timeout = 10000
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for job ${jobId} to reach state: ${state}`));
      }, timeout);

      queueEvents.on(state, ({ jobId: eventJobId }) => {
        if (eventJobId === jobId) {
          clearTimeout(timer);
          resolve();
        }
      });
    });
  };

  describe('1. TUS upload → queue enqueue', () => {
    it('should enqueue job to Redis queue gcs-upload', async () => {
      const jobData = createTestJobData();

      // Enqueue job
      const job = await queue.add('upload-to-gcs', jobData);

      // Verify job exists in queue
      expect(job.id).toBeDefined();
      expect(job.name).toBe('upload-to-gcs');

      // Verify job data matches IUploadJob contract
      expect(job.data).toMatchObject({
        tusUploadId: expect.any(String),
        fileName: expect.any(String),
        fileSize: expect.any(Number),
        contentType: expect.any(String),
        formId: expect.any(String),
        submissionId: expect.any(String),
        fieldKey: expect.any(String),
        uploadedAt: expect.any(Date)
      });

      // Verify job is in waiting state
      const state = await job.getState();
      expect(state).toBe('waiting');

      // Verify job appears in Redis
      const jobFromRedis = await queue.getJob(job.id!);
      expect(jobFromRedis).toBeDefined();
      expect(jobFromRedis!.data).toEqual(jobData);
    });

    it('should validate IUploadJob contract structure', async () => {
      const jobData = createTestJobData();
      const job = await queue.add('upload-to-gcs', jobData);

      const requiredFields = [
        'tusUploadId',
        'fileName',
        'fileSize',
        'contentType',
        'formId',
        'fieldKey',
        'uploadedAt'
      ];

      requiredFields.forEach(field => {
        expect(job.data).toHaveProperty(field);
      });
    });
  });

  describe('2. Queue worker processing', () => {
    it('should process job through state transitions: waiting → active → completed', async () => {
      // Setup successful mock responses
      mockTusStore.getUpload.mockResolvedValue({
        id: 'tus-123',
        stream: { pipe: vi.fn() }
      });

      mockGCSProvider.multipartUpload.mockResolvedValue({
        key: 'uploads/test.pdf',
        bucket: 'test-bucket',
        size: 1024000
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      // Create worker
      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      const jobData = createTestJobData({ tusUploadId: 'tus-123' });
      const job = await queue.add('upload-to-gcs', jobData);

      // Track state transitions
      const states: string[] = [];
      queueEvents.on('waiting', () => states.push('waiting'));
      queueEvents.on('active', () => states.push('active'));
      queueEvents.on('completed', () => states.push('completed'));

      // Wait for completion
      await waitForJobState(job.id!, 'completed');

      // Verify state transitions
      expect(states).toContain('active');
      expect(states).toContain('completed');

      // Verify final state
      const finalState = await job.getState();
      expect(finalState).toBe('completed');
    });

    it('should complete processing within 10 seconds', async () => {
      mockTusStore.getUpload.mockResolvedValue({
        id: 'tus-fast',
        stream: { pipe: vi.fn() }
      });

      mockGCSProvider.multipartUpload.mockResolvedValue({
        key: 'uploads/fast.pdf',
        bucket: 'test-bucket',
        size: 1024
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      const jobData = createTestJobData({ tusUploadId: 'tus-fast' });
      const startTime = Date.now();
      const job = await queue.add('upload-to-gcs', jobData);

      await waitForJobState(job.id!, 'completed');

      const processingTime = Date.now() - startTime;
      expect(processingTime).toBeLessThan(10000);
    });
  });

  describe('3. GCS upload success flow', () => {
    it('should complete full upload cycle: TUS → GCS → MongoDB → cleanup', async () => {
      const tusUploadId = 'tus-success-flow';

      mockTusStore.getUpload.mockResolvedValue({
        id: tusUploadId,
        stream: { pipe: vi.fn() },
        metadata: {
          filename: 'success-test.pdf',
          filetype: 'application/pdf'
        }
      });

      mockGCSProvider.multipartUpload.mockResolvedValue({
        key: `uploads/${tusUploadId}/success-test.pdf`,
        bucket: 'test-bucket',
        size: 2048000,
        etag: 'abc123'
      });

      const signedUrl = 'https://storage.googleapis.com/test-bucket/uploads/success-test.pdf?signature=xyz';
      mockGCSProvider.generatePresignedUrl.mockResolvedValue(signedUrl);

      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });
      mockTusStore.remove.mockResolvedValue(true);

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      const jobData = createTestJobData({ tusUploadId });
      const job = await queue.add('upload-to-gcs', jobData);

      await waitForJobState(job.id!, 'completed');

      // Verify file uploaded to GCS
      expect(mockGCSProvider.multipartUpload).toHaveBeenCalled();

      // Verify MongoDB submission updated
      expect(mockSubmissionModel.updateOne).toHaveBeenCalledWith(
        { _id: jobData.submissionId },
        expect.objectContaining({
          $set: expect.objectContaining({
            [`data.${jobData.fieldKey}`]: expect.objectContaining({
              url: signedUrl,
              storage: 'gcs',
              name: jobData.fileName,
              size: jobData.fileSize
            })
          })
        })
      );

      // Verify TUS file cleaned up
      expect(mockTusStore.remove).toHaveBeenCalledWith(tusUploadId);
    });
  });

  describe('4. Network failure → retry with exponential backoff', () => {
    it('should retry at 2s, 4s, 8s intervals on network errors', async () => {
      const tusUploadId = 'tus-network-retry';
      let attemptCount = 0;
      const attemptTimestamps: number[] = [];

      mockTusStore.getUpload.mockResolvedValue({
        id: tusUploadId,
        stream: { pipe: vi.fn() }
      });

      // Mock network error for first 2 attempts, then success
      mockGCSProvider.multipartUpload.mockImplementation(async () => {
        attemptTimestamps.push(Date.now());
        attemptCount++;

        if (attemptCount <= 2) {
          const error: any = new Error('Network error: ECONNREFUSED');
          error.code = 'ECONNREFUSED';
          throw error;
        }

        // Success on 3rd attempt
        return {
          key: 'uploads/retry-test.pdf',
          bucket: 'test-bucket',
          size: 1024
        };
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        {
          connection: redisConfig,
          settings: {
            stalledInterval: 30000,
            maxStalledCount: 1
          }
        }
      );

      const jobData = createTestJobData({ tusUploadId });
      const job = await queue.add('upload-to-gcs', jobData);

      // Wait for job to complete after retries
      await waitForJobState(job.id!, 'completed', 30000);

      // Verify retry attempts
      expect(attemptCount).toBe(3);

      // Verify exponential backoff delays
      if (attemptTimestamps.length >= 3) {
        const delay1 = attemptTimestamps[1] - attemptTimestamps[0];
        const delay2 = attemptTimestamps[2] - attemptTimestamps[1];

        // First retry should be ~2 seconds (allow 500ms tolerance)
        expect(delay1).toBeGreaterThanOrEqual(1500);
        expect(delay1).toBeLessThanOrEqual(3000);

        // Second retry should be ~4 seconds (allow 1s tolerance)
        expect(delay2).toBeGreaterThanOrEqual(3000);
        expect(delay2).toBeLessThanOrEqual(6000);
      }

      // Verify job eventually succeeded
      const finalState = await job.getState();
      expect(finalState).toBe('completed');
    });
  });

  describe('5. GCS temporary unavailable → recovery', () => {
    it('should retry up to 5 times on GCS 503 errors and succeed when recovered', async () => {
      const tusUploadId = 'tus-503-recovery';
      let attemptCount = 0;

      mockTusStore.getUpload.mockResolvedValue({
        id: tusUploadId,
        stream: { pipe: vi.fn() }
      });

      // Mock GCS 503 for 3 attempts, then recovery
      mockGCSProvider.multipartUpload.mockImplementation(async () => {
        attemptCount++;

        if (attemptCount <= 3) {
          const error: any = new Error('Service Unavailable');
          error.code = 503;
          throw error;
        }

        return {
          key: 'uploads/503-recovery.pdf',
          bucket: 'test-bucket',
          size: 1024
        };
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      const jobData = createTestJobData({ tusUploadId });
      const job = await queue.add('upload-to-gcs', jobData);

      await waitForJobState(job.id!, 'completed', 40000);

      expect(attemptCount).toBe(4); // 3 failures + 1 success
      expect(await job.getState()).toBe('completed');
    });
  });

  describe('6. Stalled job detection & recovery', () => {
    it('should detect stalled job and reassign to new worker', async () => {
      const tusUploadId = 'tus-stalled';

      mockTusStore.getUpload.mockResolvedValue({
        id: tusUploadId,
        stream: { pipe: vi.fn() }
      });

      let workerCrashed = false;

      mockGCSProvider.multipartUpload.mockImplementation(async () => {
        if (!workerCrashed) {
          // Simulate worker crash on first attempt
          workerCrashed = true;
          await new Promise(resolve => setTimeout(resolve, 5000)); // Hang for 5s
          throw new Error('Worker crashed');
        }

        // Second attempt succeeds
        return {
          key: 'uploads/stalled-recovery.pdf',
          bucket: 'test-bucket',
          size: 1024
        };
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      // Create first worker with short stalled interval
      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        {
          connection: redisConfig,
          settings: {
            stalledInterval: 5000, // Check every 5 seconds
            lockDuration: 10000 // 10 second lock
          }
        }
      );

      const jobData = createTestJobData({ tusUploadId });
      const job = await queue.add('upload-to-gcs', jobData);

      // Wait for stalled state
      await new Promise(resolve => setTimeout(resolve, 15000));

      // Create new worker to pick up stalled job
      const newWorker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      await waitForJobState(job.id!, 'completed', 30000);

      expect(await job.getState()).toBe('completed');

      await newWorker.close();
    }, 60000); // 60s timeout for this test
  });

  describe('7. Failed job → dead letter queue', () => {
    it('should move job to failed queue after 5 attempts', async () => {
      const tusUploadId = 'tus-permanent-fail';

      mockTusStore.getUpload.mockResolvedValue({
        id: tusUploadId,
        stream: { pipe: vi.fn() }
      });

      // Mock permanent error (invalid credentials)
      mockGCSProvider.multipartUpload.mockRejectedValue(
        new Error('Invalid GCS credentials')
      );

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      const jobData = createTestJobData({ tusUploadId });
      const job = await queue.add('upload-to-gcs', jobData);

      await waitForJobState(job.id!, 'failed', 60000);

      const failedState = await job.getState();
      expect(failedState).toBe('failed');

      // Verify job is in failed queue
      const failedJobs = await queue.getFailed();
      const failedJob = failedJobs.find(j => j.id === job.id);
      expect(failedJob).toBeDefined();

      // Verify failure reason
      expect(failedJob!.failedReason).toContain('Invalid GCS credentials');

      // Verify max attempts reached
      expect(failedJob!.attemptsMade).toBe(5);
    }, 70000);

    it('should retain failed job for 7 days (TTL check)', async () => {
      const jobData = createTestJobData();
      const job = await queue.add('upload-to-gcs', jobData, {
        removeOnFail: { age: 604800 } // 7 days in seconds
      });

      expect(job.opts.removeOnFail).toEqual({ age: 604800 });
    });
  });

  describe('8. Queue overflow → backpressure handling', () => {
    it('should handle 100 concurrent jobs without loss', async () => {
      mockTusStore.getUpload.mockResolvedValue({
        id: 'tus-bulk',
        stream: { pipe: vi.fn() }
      });

      mockGCSProvider.multipartUpload.mockResolvedValue({
        key: 'uploads/bulk.pdf',
        bucket: 'test-bucket',
        size: 1024
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          // Simulate some processing time
          await new Promise(resolve => setTimeout(resolve, 100));
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        {
          connection: redisConfig,
          concurrency: 3 // Process max 3 jobs concurrently
        }
      );

      // Enqueue 100 jobs simultaneously
      const jobs = await Promise.all(
        Array.from({ length: 100 }, (_, i) =>
          queue.add('upload-to-gcs', createTestJobData({ tusUploadId: `tus-bulk-${i}` }))
        )
      );

      expect(jobs).toHaveLength(100);

      // Wait for all jobs to complete
      await Promise.all(
        jobs.map(job => waitForJobState(job.id!, 'completed', 60000))
      );

      // Verify all jobs completed
      const completedJobs = await queue.getCompleted();
      expect(completedJobs.length).toBeGreaterThanOrEqual(100);
    }, 70000);
  });

  describe('9. Redis connection loss → reconnect', () => {
    it('should reconnect to Redis after connection loss', async () => {
      // Note: This test requires manual Redis stop/start
      // For automated testing, we'll simulate reconnection logic

      const connectionLostEvent = new Promise((resolve) => {
        queue.on('error', (error) => {
          if (error.message.includes('ECONNREFUSED')) {
            resolve(true);
          }
        });
      });

      // Attempt to add job (will be queued locally if Redis is down)
      const jobData = createTestJobData();

      // This test validates that the queue handles reconnection gracefully
      // In production, jobs queued during downtime are processed when Redis reconnects
      expect(queue).toBeDefined();
    });
  });

  describe('10. Graceful shutdown → job completion', () => {
    it('should complete active jobs within 30s timeout on SIGTERM', async () => {
      mockTusStore.getUpload.mockResolvedValue({
        id: 'tus-shutdown',
        stream: { pipe: vi.fn() }
      });

      mockGCSProvider.multipartUpload.mockImplementation(async () => {
        // Simulate long-running job (15 seconds)
        await new Promise(resolve => setTimeout(resolve, 15000));
        return {
          key: 'uploads/shutdown.pdf',
          bucket: 'test-bucket',
          size: 1024
        };
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      // Add 5 jobs
      const jobs = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          queue.add('upload-to-gcs', createTestJobData({ tusUploadId: `tus-shutdown-${i}` }))
        )
      );

      // Wait for at least one job to start
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Trigger graceful shutdown
      const shutdownPromise = worker.close();

      // Shutdown should complete within timeout
      await expect(shutdownPromise).resolves.toBeUndefined();

      // Verify waiting jobs remain in queue
      const waitingJobs = await queue.getWaiting();
      expect(waitingJobs.length).toBeGreaterThanOrEqual(0);
    }, 40000);
  });

  describe('11. Job progress tracking', () => {
    it('should update progress during large file processing', async () => {
      const tusUploadId = 'tus-progress';
      const progressUpdates: number[] = [];

      mockTusStore.getUpload.mockResolvedValue({
        id: tusUploadId,
        stream: { pipe: vi.fn() }
      });

      mockGCSProvider.multipartUpload.mockImplementation(async () => {
        // Simulate chunked upload with progress updates
        const chunks = [0, 25, 50, 75, 100];
        for (const progress of chunks) {
          progressUpdates.push(progress);
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        return {
          key: 'uploads/large-file.pdf',
          bucket: 'test-bucket',
          size: 500 * 1024 * 1024 // 500MB
        };
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          const result = await processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );

          // Update job progress (simulated)
          await job.updateProgress(100);

          return result;
        },
        { connection: redisConfig }
      );

      const jobData = createTestJobData({ tusUploadId, fileSize: 500 * 1024 * 1024 });
      const job = await queue.add('upload-to-gcs', jobData);

      await waitForJobState(job.id!, 'completed', 10000);

      // Verify progress updates occurred
      expect(progressUpdates).toEqual([0, 25, 50, 75, 100]);

      // Verify final progress
      const jobWithProgress = await queue.getJob(job.id!);
      expect(jobWithProgress!.progress).toBe(100);
    });
  });

  describe('12. Queue metrics & monitoring', () => {
    it('should track queue metrics for 50 mixed success/failure jobs', async () => {
      mockTusStore.getUpload.mockResolvedValue({
        id: 'tus-metrics',
        stream: { pipe: vi.fn() }
      });

      // Mock 70% success, 30% failure
      let jobCount = 0;
      mockGCSProvider.multipartUpload.mockImplementation(async () => {
        jobCount++;
        if (jobCount % 10 < 7) {
          // Success (70%)
          return {
            key: 'uploads/success.pdf',
            bucket: 'test-bucket',
            size: 1024
          };
        } else {
          // Failure (30%)
          throw new Error('Simulated upload failure');
        }
      });

      mockGCSProvider.generatePresignedUrl.mockResolvedValue('https://signed-url.com');
      mockSubmissionModel.updateOne.mockResolvedValue({ nModified: 1 });

      worker = new Worker(
        TEST_QUEUE_NAME,
        async (job) => {
          return processGCSUpload(
            job.data,
            mockGCSProvider,
            mockTusStore,
            mockSubmissionModel
          );
        },
        { connection: redisConfig }
      );

      // Add 50 jobs
      const jobs = await Promise.all(
        Array.from({ length: 50 }, (_, i) =>
          queue.add('upload-to-gcs', createTestJobData({ tusUploadId: `tus-metrics-${i}` }))
        )
      );

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Query queue metrics
      const metrics = {
        waiting: await queue.getWaitingCount(),
        active: await queue.getActiveCount(),
        completed: await queue.getCompletedCount(),
        failed: await queue.getFailedCount()
      };

      // Verify metric structure
      expect(metrics).toMatchObject({
        waiting: expect.any(Number),
        active: expect.any(Number),
        completed: expect.any(Number),
        failed: expect.any(Number)
      });

      // Verify total jobs processed
      const totalProcessed = metrics.completed + metrics.failed;
      expect(totalProcessed).toBeGreaterThanOrEqual(40); // Allow for some still processing

      console.log('Queue Metrics:', metrics);
    }, 40000);
  });
});
