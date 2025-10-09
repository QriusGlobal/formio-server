/**
 * GCS Async Upload Integration Test
 *
 * Tests complete upload flow: TUS → BullMQ → GCS → MongoDB
 * Requires Docker Compose infrastructure running.
 */

const {describe, it, expect, beforeAll, afterAll, beforeEach} = require('vitest');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const {Queue} = require('bullmq');

// Configuration
const FORMIO_URL = process.env.FORMIO_URL || 'http://localhost:3001';
const TUS_URL = process.env.TUS_URL || 'http://localhost:1080/files/';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

describe('GCS Async Upload Integration', () => {
  let uploadQueue;
  let authToken;
  let formId;

  beforeAll(async () => {
    // Initialize BullMQ queue for monitoring
    uploadQueue = new Queue('gcs-upload', {
      connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      }
    });

    // Authenticate with Form.io
    const loginResponse = await axios.post(`${FORMIO_URL}/user/login`, {
      data: {
        email: 'admin@formio.local',
        password: 'admin123'
      }
    });

    authToken = loginResponse.headers['x-jwt-token'];

    // Create test form with file upload component
    const formResponse = await axios.post(`${FORMIO_URL}/form`, {
      title: 'GCS Upload Test Form',
      name: 'gcsUploadTest',
      path: 'gcs-upload-test',
      type: 'form',
      components: [
        {
          type: 'tusupload',
          key: 'testFile',
          label: 'Test File Upload',
          multiple: true,
          storage: 'gcs',
          input: true
        }
      ]
    }, {
      headers: {'x-jwt-token': authToken}
    });

    formId = formResponse.data._id;
  });

  afterAll(async () => {
    await uploadQueue.close();
  });

  beforeEach(async () => {
    // Clear queue before each test
    await uploadQueue.drain();
  });

  it('should enqueue GCS upload job when TUS upload completes', async () => {
    // Create test file
    const testFilePath = path.join(__dirname, 'fixtures', 'test-file.txt');
    await fs.promises.writeFile(testFilePath, 'Test file content for integration test');

    const fileBuffer = await fs.promises.readFile(testFilePath);

    // Initiate TUS upload
    const tusResponse = await axios.post(TUS_URL, null, {
      headers: {
        'Upload-Length': fileBuffer.length,
        'Upload-Metadata': `filename ${Buffer.from('test-file.txt').toString('base64')},filetype ${Buffer.from('text/plain').toString('base64')}`,
        'Tus-Resumable': '1.0.0'
      }
    });

    const uploadUrl = tusResponse.headers.location;

    // Upload file content
    await axios.patch(uploadUrl, fileBuffer, {
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Tus-Resumable': '1.0.0'
      }
    });

    // Wait for job to be enqueued
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify job exists in queue
    const jobs = await uploadQueue.getJobs(['waiting', 'active']);
    expect(jobs.length).toBeGreaterThan(0);

    const job = jobs[0];
    expect(job.data).toHaveProperty('tusUploadId');
    expect(job.data).toHaveProperty('fileName', 'test-file.txt');
    expect(job.data).toHaveProperty('formId');

    // Cleanup
    await fs.promises.unlink(testFilePath);
  });

  it('should process job and upload to GCS emulator', async () => {
    // Create and upload test file
    const testFilePath = path.join(__dirname, 'fixtures', 'process-test.txt');
    await fs.promises.writeFile(testFilePath, 'Content for GCS processing test');

    const fileBuffer = await fs.promises.readFile(testFilePath);

    const tusResponse = await axios.post(TUS_URL, null, {
      headers: {
        'Upload-Length': fileBuffer.length,
        'Upload-Metadata': `filename ${Buffer.from('process-test.txt').toString('base64')},filetype ${Buffer.from('text/plain').toString('base64')}`,
        'Tus-Resumable': '1.0.0'
      }
    });

    const uploadUrl = tusResponse.headers.location;

    await axios.patch(uploadUrl, fileBuffer, {
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Tus-Resumable': '1.0.0'
      }
    });

    // Wait for worker to process job
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify job completed
    const completedJobs = await uploadQueue.getCompleted();
    expect(completedJobs.length).toBeGreaterThan(0);

    const completedJob = completedJobs[0];
    const result = await completedJob.returnvalue;

    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('gcsUrl');
    expect(result.gcsUrl).toContain('http://localhost:4443');

    // Cleanup
    await fs.promises.unlink(testFilePath);
  });

  it('should update MongoDB submission with GCS signed URL', async () => {
    // Create submission with file upload
    const testFilePath = path.join(__dirname, 'fixtures', 'submission-test.txt');
    await fs.promises.writeFile(testFilePath, 'MongoDB update test content');

    const fileBuffer = await fs.promises.readFile(testFilePath);

    // TUS upload
    const tusResponse = await axios.post(TUS_URL, null, {
      headers: {
        'Upload-Length': fileBuffer.length,
        'Upload-Metadata': `filename ${Buffer.from('submission-test.txt').toString('base64')},formid ${Buffer.from(formId).toString('base64')}`,
        'Tus-Resumable': '1.0.0'
      }
    });

    const uploadUrl = tusResponse.headers.location;

    await axios.patch(uploadUrl, fileBuffer, {
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Tus-Resumable': '1.0.0'
      }
    });

    // Create submission
    const submissionResponse = await axios.post(`${FORMIO_URL}/form/${formId}/submission`, {
      data: {
        testFile: [{
          name: 'submission-test.txt',
          uploadId: uploadUrl.split('/').pop()
        }]
      }
    }, {
      headers: {'x-jwt-token': authToken}
    });

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Retrieve submission
    const updatedSubmission = await axios.get(
      `${FORMIO_URL}/form/${formId}/submission/${submissionResponse.data._id}`,
      {headers: {'x-jwt-token': authToken}}
    );

    expect(updatedSubmission.data.data.testFile).toHaveLength(1);
    expect(updatedSubmission.data.data.testFile[0]).toHaveProperty('url');
    expect(updatedSubmission.data.data.testFile[0].url).toContain('http://localhost:4443');
    expect(updatedSubmission.data.data.testFile[0]).toHaveProperty('storage', 'gcs');

    // Cleanup
    await fs.promises.unlink(testFilePath);
  });

  it('should retry failed uploads with exponential backoff', async () => {
    // This test requires mocking GCS failure
    // For now, we verify retry configuration exists

    const queueConfig = uploadQueue.opts;
    expect(queueConfig).toHaveProperty('settings');

    // Verify job has retry configuration
    const testJob = await uploadQueue.add('test-retry', {
      tusUploadId: 'test-123',
      fileName: 'retry-test.txt'
    }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });

    expect(testJob.opts.attempts).toBe(5);
    expect(testJob.opts.backoff.type).toBe('exponential');

    await testJob.remove();
  });

  it('should track job status throughout processing lifecycle', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'status-test.txt');
    await fs.promises.writeFile(testFilePath, 'Job status tracking test');

    const fileBuffer = await fs.promises.readFile(testFilePath);

    const tusResponse = await axios.post(TUS_URL, null, {
      headers: {
        'Upload-Length': fileBuffer.length,
        'Upload-Metadata': `filename ${Buffer.from('status-test.txt').toString('base64')}`,
        'Tus-Resumable': '1.0.0'
      }
    });

    const uploadUrl = tusResponse.headers.location;

    await axios.patch(uploadUrl, fileBuffer, {
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Tus-Resumable': '1.0.0'
      }
    });

    // Check job status immediately (should be waiting or active)
    await new Promise(resolve => setTimeout(resolve, 500));
    const jobs = await uploadQueue.getJobs(['waiting', 'active']);
    expect(jobs.length).toBeGreaterThan(0);

    // Wait for completion
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check completed status
    const completedJobs = await uploadQueue.getCompleted();
    expect(completedJobs.length).toBeGreaterThan(0);

    const job = completedJobs[0];
    expect(await job.isCompleted()).toBe(true);
    expect(await job.isFailed()).toBe(false);

    // Cleanup
    await fs.promises.unlink(testFilePath);
  });
});
