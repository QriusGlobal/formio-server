/**
 * Async File Processor
 *
 * Non-blocking file processing using BullMQ job queue
 * Replaces synchronous file validation and processing with async operations
 */

import { UploadFile, UploadStatus } from '../types';
import { logger } from '../utils/logger';

/**
 * Job status from BullMQ API
 */
export interface JobStatus {
  jobId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';
  progress: number;
  templateType?: string;
  result?: {
    filename: string;
    size: number;
    path: string;
    processingTime: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Async File Processor Class
 * Handles non-blocking file operations via BullMQ job queue
 */
export class AsyncFileProcessor {
  private apiBaseUrl: string;
  private pollingInterval: number;

  constructor(apiBaseUrl: string = '/api/file-generation', pollingInterval: number = 1000) {
    this.apiBaseUrl = apiBaseUrl;
    this.pollingInterval = pollingInterval;
  }

  /**
   * Submit file generation job to queue
   *
   * @param templateType - Type of file to generate (pdf, csv, json, html)
   * @param metadata - Data for file generation
   * @param formId - Form ID for context
   * @param submissionId - Submission ID for context
   * @returns Job ID for tracking
   */
  async submitFileGenerationJob(
    templateType: string,
    metadata: any,
    formId?: string,
    submissionId?: string
  ): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateType,
        metadata,
        formId: formId || '',
        submissionId: submissionId || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit file generation job');
    }

    const result = await response.json();
    return result.jobId;
  }

  /**
   * Get job status
   *
   * @param jobId - Job ID from submitFileGenerationJob
   * @returns Job status and progress
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Job not found');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to get job status');
    }

    return response.json();
  }

  /**
   * Poll job status until completion
   *
   * @param jobId - Job ID to poll
   * @param onProgress - Progress callback (optional)
   * @returns Final job result
   */
  async pollJobUntilComplete(
    jobId: string,
    onProgress?: (progress: number, status: string) => void
  ): Promise<JobStatus> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getJobStatus(jobId);

          // Call progress callback
          if (onProgress) {
            onProgress(status.progress, status.status);
          }

          // Check if job is complete
          if (status.status === 'completed') {
            resolve(status);
            return;
          }

          // Check if job failed
          if (status.status === 'failed') {
            reject(new Error(status.error?.message || 'Job failed'));
            return;
          }

          // Continue polling
          setTimeout(poll, this.pollingInterval);
        } catch (error) {
          reject(error);
        }
      };

      // Start polling
      poll();
    });
  }

  /**
   * Download generated file
   *
   * @param jobId - Job ID
   * @returns Blob containing file data
   */
  async downloadFile(jobId: string): Promise<Blob> {
    const response = await fetch(`${this.apiBaseUrl}/download/${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download file');
    }

    return response.blob();
  }

  /**
   * Cancel a job
   *
   * @param jobId - Job ID to cancel
   */
  async cancelJob(jobId: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/jobs/${jobId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel job');
    }
  }

  /**
   * Async file validation (non-blocking)
   * Uses Web Workers API if available, falls back to async/await
   *
   * @param file - File to validate
   * @param options - Validation options
   * @returns Validation result
   */
  async validateFileAsync(
    file: File,
    options: {
      maxSize?: number;
      minSize?: number;
      allowedTypes?: string[];
      verifyMagicNumber?: boolean;
    }
  ): Promise<{ valid: boolean; error?: string }> {
    // Size validation (synchronous, fast)
    if (options.maxSize && file.size > options.maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed (${this.formatFileSize(options.maxSize)})`,
      };
    }

    if (options.minSize && file.size < options.minSize) {
      return {
        valid: false,
        error: `File size is below minimum required (${this.formatFileSize(options.minSize)})`,
      };
    }

    // Type validation (synchronous, fast)
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isAllowed = options.allowedTypes.some((pattern) => {
        if (pattern.startsWith('.')) {
          return fileExt === pattern;
        }
        if (pattern.includes('/')) {
          return file.type.match(new RegExp(pattern.replace('*', '.*')));
        }
        return false;
      });

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type not allowed. Allowed: ${options.allowedTypes.join(', ')}`,
        };
      }
    }

    // Magic number verification (async, heavy)
    if (options.verifyMagicNumber) {
      try {
        const isValid = await this.verifyFileMagicNumber(file);
        if (!isValid) {
          return {
            valid: false,
            error: 'File content does not match declared type. This file may be dangerous.',
          };
        }
      } catch (error) {
        logger.warn('[AsyncFileProcessor] Magic number verification failed:', { error });
        // Don't fail validation if magic number check errors
      }
    }

    return { valid: true };
  }

  /**
   * Verify file magic number (async)
   * Reads first few bytes to verify file type matches extension
   *
   * @param file - File to verify
   * @returns True if file type is valid
   */
  private async verifyFileMagicNumber(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);

          // Check magic numbers for common file types
          const magicNumbers: Record<string, number[]> = {
            'image/png': [0x89, 0x50, 0x4e, 0x47],
            'image/jpeg': [0xff, 0xd8, 0xff],
            'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
            'application/zip': [0x50, 0x4b, 0x03, 0x04],
            'image/gif': [0x47, 0x49, 0x46, 0x38],
          };

          const expectedMagic = magicNumbers[file.type];

          if (!expectedMagic) {
            // No magic number check for this type
            resolve(true);
            return;
          }

          // Verify magic number matches
          const matches = expectedMagic.every((byte, index) => bytes[index] === byte);
          resolve(matches);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      // Read first 16 bytes
      reader.readAsArrayBuffer(file.slice(0, 16));
    });
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

/**
 * Singleton instance for convenience
 */
export const asyncFileProcessor = new AsyncFileProcessor();
