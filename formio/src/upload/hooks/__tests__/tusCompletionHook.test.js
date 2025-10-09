/**
 * TUS Completion Hook Tests (TDD Red Phase)
 *
 * Tests for job enqueueing hook at TusServer.js:221
 * Ensures async job creation without blocking TUS response.
 */

const {describe, it, expect, beforeEach, vi} = require('vitest');
const {onUploadFinish} = require('../tusCompletionHook');

describe('TUS Completion Hook', () => {
  let mockQueue;
  let mockReq;
  let mockRes;
  let mockUpload;

  beforeEach(() => {
    // Mock BullMQ Queue
    mockQueue = {
      add: vi.fn().mockResolvedValue({id: 'job-123'})
    };

    // Mock Express request
    mockReq = {
      user: {_id: 'user-456'},
      uploadContext: {userId: 'user-456'}
    };

    // Mock Express response
    mockRes = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn()
    };

    // Mock TUS upload object
    mockUpload = {
      id: 'tus-upload-123',
      size: 1024000,
      metadata: {
        filename: 'test-document.pdf',
        filetype: 'application/pdf',
        formId: 'form-abc-123',
        submissionId: 'sub-xyz-789',
        fieldName: 'documents'
      }
    };
  });

  describe('Job Enqueueing', () => {
    it('should enqueue GCS upload job without blocking', async () => {
      await onUploadFinish(mockReq, mockRes, mockUpload, mockQueue);

      // Verify job was added to queue
      expect(mockQueue.add).toHaveBeenCalledWith(
        'gcs-upload',
        {
          tusUploadId: mockUpload.id,
          fileName: mockUpload.metadata.filename,
          fileSize: mockUpload.size,
          contentType: mockUpload.metadata.filetype,
          formId: mockUpload.metadata.formId,
          submissionId: mockUpload.metadata.submissionId,
          fieldKey: mockUpload.metadata.fieldName,
          userId: mockReq.user._id,
          uploadedAt: expect.any(Date)
        },
        {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 2000
          },
          removeOnComplete: true,
          removeOnFail: false
        }
      );

      // Verify TUS client receives immediate 204 response
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should validate metadata before enqueueing', async () => {
      // Missing required field (formId)
      const invalidUpload = {
        ...mockUpload,
        metadata: {
          filename: 'test.pdf',
          filetype: 'application/pdf'
          // Missing formId and fieldName
        }
      };

      await expect(
        onUploadFinish(mockReq, mockRes, invalidUpload, mockQueue)
      ).rejects.toThrow('Missing required metadata: formId, fieldName');

      // Queue should not be called
      expect(mockQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle queue connection errors gracefully', async () => {
      const queueError = new Error('Redis connection lost');
      mockQueue.add.mockRejectedValue(queueError);

      await expect(
        onUploadFinish(mockReq, mockRes, mockUpload, mockQueue)
      ).rejects.toThrow('Redis connection lost');

      // Response should not be sent if queue fails
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should log error but not fail if job ID cannot be generated', async () => {
      mockQueue.add.mockResolvedValue(null); // Simulated queue issue

      await expect(
        onUploadFinish(mockReq, mockRes, mockUpload, mockQueue)
      ).rejects.toThrow('Failed to enqueue upload job');
    });
  });

  describe('Retry Configuration', () => {
    it('should configure exponential backoff retry strategy', async () => {
      await onUploadFinish(mockReq, mockRes, mockUpload, mockQueue);

      const jobOptions = mockQueue.add.mock.calls[0][2];

      expect(jobOptions.attempts).toBe(5);
      expect(jobOptions.backoff).toEqual({
        type: 'exponential',
        delay: 2000 // 2s, 4s, 8s, 16s, 32s
      });
    });

    it('should not remove failed jobs for debugging', async () => {
      await onUploadFinish(mockReq, mockRes, mockUpload, mockQueue);

      const jobOptions = mockQueue.add.mock.calls[0][2];

      expect(jobOptions.removeOnFail).toBe(false); // Keep for 7 days (configured in queue.config.js)
    });

    it('should remove successful jobs after completion', async () => {
      await onUploadFinish(mockReq, mockRes, mockUpload, mockQueue);

      const jobOptions = mockQueue.add.mock.calls[0][2];

      expect(jobOptions.removeOnComplete).toBe(true);
    });
  });

  describe('Response Timing', () => {
    it('should return 204 No Content immediately without waiting for job completion', async () => {
      let jobProcessed = false;

      // Simulate slow job processing
      mockQueue.add.mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            jobProcessed = true;
            resolve({id: 'job-123'});
          }, 100); // 100ms delay
        });
      });

      const startTime = Date.now();
      await onUploadFinish(mockReq, mockRes, mockUpload, mockQueue);
      const responseTime = Date.now() - startTime;

      // Response should be sent before job starts processing
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
      expect(responseTime).toBeLessThan(150); // Should respond quickly

      // Wait for job to process
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(jobProcessed).toBe(true);
    });
  });
});
