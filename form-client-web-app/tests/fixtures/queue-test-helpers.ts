/**
 * BullMQ Queue Test Helpers
 *
 * Utilities for testing queue-based upload workflows:
 * - Job enqueueing and monitoring
 * - Queue metrics and health checks
 * - Job progress tracking
 * - Queue cleanup
 */

import { Queue, Worker, type Job, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';

export interface JobData {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadUrl: string;
  metadata?: Record<string, any>;
}

export interface JobProgress {
  percentage: number;
  bytesUploaded: number;
  totalBytes: number;
  status: string;
}

export interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export interface QueueTestConfig {
  redisUrl?: string;
  queueName?: string;
  defaultJobOptions?: any;
}

/**
 * Queue test helper class
 */
export class QueueTestHelper {
  private queue: Queue;
  private queueEvents: QueueEvents;
  private redis: Redis;
  private queueName: string;

  constructor(config: QueueTestConfig = {}) {
    const redisUrl = config.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379';
    this.queueName = config.queueName || 'file-uploads-test';

    // Create Redis connection
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    // Create queue instance
    this.queue = new Queue(this.queueName, {
      connection: this.redis,
      defaultJobOptions: config.defaultJobOptions || {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 100,
        },
        removeOnFail: {
          age: 86400, // Keep failed jobs for 24 hours
        },
      },
    });

    // Create queue events for monitoring
    this.queueEvents = new QueueEvents(this.queueName, {
      connection: this.redis,
    });
  }

  /**
   * Enqueue a test job
   */
  async enqueueTestJob(jobData: JobData, options?: any): Promise<string> {
    const job = await this.queue.add('upload', jobData, options);
    return job.id || '';
  }

  /**
   * Wait for job completion with timeout
   */
  async waitForJobCompletion(
    jobId: string,
    timeoutMs: number = 60000
  ): Promise<{ status: 'completed' | 'failed'; result?: any; error?: string }> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Job ${jobId} did not complete within ${timeoutMs}ms`));
      }, timeoutMs);

      const cleanup = () => {
        clearTimeout(timeout);
        this.queueEvents.off('completed', completedHandler);
        this.queueEvents.off('failed', failedHandler);
      };

      const completedHandler = async ({ jobId: completedId, returnvalue }: any) => {
        if (completedId === jobId) {
          cleanup();
          resolve({ status: 'completed', result: returnvalue });
        }
      };

      const failedHandler = async ({ jobId: failedId, failedReason }: any) => {
        if (failedId === jobId) {
          cleanup();
          resolve({ status: 'failed', error: failedReason });
        }
      };

      this.queueEvents.on('completed', completedHandler);
      this.queueEvents.on('failed', failedHandler);
    });
  }

  /**
   * Get queue metrics
   */
  async getQueueMetrics(): Promise<QueueMetrics> {
    const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
      this.queue.isPaused(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused: paused ? 1 : 0,
    };
  }

  /**
   * Monitor job progress with callback (event-driven)
   * Replaces polling interval with BullMQ progress events
   */
  async monitorJobProgress(
    jobId: string,
    callback: (progress: JobProgress) => void,
    intervalMs: number = 500
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.queueEvents.off('progress', progressHandler);
        this.queueEvents.off('completed', completionHandler);
        this.queueEvents.off('failed', failureHandler);
      };

      const progressHandler = async ({ jobId: progressJobId, data }: any) => {
        if (progressJobId === jobId && data) {
          callback(data as JobProgress);
        }
      };

      const completionHandler = async ({ jobId: completedId }: any) => {
        if (completedId === jobId) {
          cleanup();
          resolve();
        }
      };

      const failureHandler = async ({ jobId: failedId }: any) => {
        if (failedId === jobId) {
          cleanup();
          reject(new Error(`Job ${jobId} failed`));
        }
      };

      // Listen for progress events
      this.queueEvents.on('progress', progressHandler);
      this.queueEvents.on('completed', completionHandler);
      this.queueEvents.on('failed', failureHandler);

      // Verify job exists
      this.queue.getJob(jobId).then(job => {
        if (!job) {
          cleanup();
          reject(new Error(`Job ${jobId} not found`));
        }
      }).catch(error => {
        cleanup();
        reject(error);
      });
    });
  }

  /**
   * Get job details
   */
  async getJob(jobId: string): Promise<Job | undefined> {
    return this.queue.getJob(jobId);
  }

  /**
   * Get job state
   */
  async getJobState(jobId: string): Promise<string | 'unknown'> {
    const job = await this.queue.getJob(jobId);
    if (!job) return 'unknown';
    return job.getState();
  }

  /**
   * Clean queue - remove all jobs
   */
  async cleanQueue(): Promise<void> {
    await this.queue.drain();
    await this.queue.clean(0, 1000, 'completed');
    await this.queue.clean(0, 1000, 'failed');
  }

  /**
   * Pause queue
   */
  async pauseQueue(): Promise<void> {
    await this.queue.pause();
  }

  /**
   * Resume queue
   */
  async resumeQueue(): Promise<void> {
    await this.queue.resume();
  }

  /**
   * Get all jobs in specific state
   */
  async getJobsByState(state: 'waiting' | 'active' | 'completed' | 'failed'): Promise<Job[]> {
    switch (state) {
      case 'waiting':
        return this.queue.getWaiting();
      case 'active':
        return this.queue.getActive();
      case 'completed':
        return this.queue.getCompleted();
      case 'failed':
        return this.queue.getFailed();
      default:
        return [];
    }
  }

  /**
   * Retry failed job
   */
  async retryFailedJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    await job.retry();
  }

  /**
   * Remove job from queue
   */
  async removeJob(jobId: string): Promise<void> {
    const job = await this.queue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  /**
   * Get queue health status
   */
  async getQueueHealth(): Promise<{
    healthy: boolean;
    metrics: QueueMetrics;
    activeWorkers: number;
  }> {
    const metrics = await this.getQueueMetrics();

    // Check Redis connection
    const redisHealthy = this.redis.status === 'ready';

    return {
      healthy: redisHealthy,
      metrics,
      activeWorkers: 0, // Worker count would need separate tracking
    };
  }

  /**
   * Wait for queue to be empty (event-driven)
   * Replaces polling loop with BullMQ event listeners
   */
  async waitForQueueEmpty(timeoutMs: number = 30000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Queue not empty after ${timeoutMs}ms`));
      }, timeoutMs);

      const checkEmpty = async () => {
        const metrics = await this.getQueueMetrics();
        if (metrics.waiting === 0 && metrics.active === 0 && metrics.delayed === 0) {
          cleanup();
          resolve();
        }
      };

      const cleanup = () => {
        clearTimeout(timeout);
        this.queueEvents.off('completed', completedHandler);
        this.queueEvents.off('failed', failedHandler);
      };

      const completedHandler = async () => {
        await checkEmpty();
      };

      const failedHandler = async () => {
        await checkEmpty();
      };

      // Listen for queue state changes
      this.queueEvents.on('completed', completedHandler);
      this.queueEvents.on('failed', failedHandler);

      // Initial check in case queue is already empty
      checkEmpty();
    });
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    await this.queueEvents.close();
    await this.queue.close();
    await this.redis.quit();
  }
}

/**
 * Create a test worker for processing jobs
 */
export function createTestWorker(
  queueName: string,
  processor: (job: Job) => Promise<any>,
  redisUrl?: string
): Worker {
  const connection = new Redis(redisUrl || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  return new Worker(queueName, processor, {
    connection,
    concurrency: 5,
  });
}

/**
 * Helper: Enqueue multiple test jobs
 */
export async function enqueueMultipleJobs(
  helper: QueueTestHelper,
  count: number,
  jobDataFactory: (index: number) => JobData
): Promise<string[]> {
  const jobIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const jobData = jobDataFactory(i);
    const jobId = await helper.enqueueTestJob(jobData);
    jobIds.push(jobId);
  }

  return jobIds;
}

/**
 * Helper: Wait for all jobs to complete
 */
export async function waitForAllJobs(
  helper: QueueTestHelper,
  jobIds: string[],
  timeoutMs: number = 120000
): Promise<Map<string, { status: 'completed' | 'failed'; result?: any; error?: string }>> {
  const results = new Map();

  await Promise.all(
    jobIds.map(async (jobId) => {
      const result = await helper.waitForJobCompletion(jobId, timeoutMs);
      results.set(jobId, result);
    })
  );

  return results;
}

/**
 * Helper: Assert queue is empty
 */
export async function assertQueueEmpty(helper: QueueTestHelper): Promise<void> {
  const metrics = await helper.getQueueMetrics();

  if (metrics.waiting > 0 || metrics.active > 0 || metrics.delayed > 0) {
    throw new Error(
      `Queue not empty: ${metrics.waiting} waiting, ${metrics.active} active, ${metrics.delayed} delayed`
    );
  }
}

/**
 * Helper: Get job completion rate
 */
export async function getJobCompletionRate(helper: QueueTestHelper): Promise<number> {
  const metrics = await helper.getQueueMetrics();
  const total = metrics.completed + metrics.failed;

  if (total === 0) return 0;

  return (metrics.completed / total) * 100;
}
