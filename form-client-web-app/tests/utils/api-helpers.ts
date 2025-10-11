/**
 * API Verification Helpers
 *
 * Utilities for verifying GCS storage and Form.io API interactions
 */

import { APIRequestContext } from '@playwright/test';

export interface GCSUploadVerification {
  exists: boolean;
  size?: number;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface FormioSubmission {
  _id: string;
  data: Record<string, any>;
  created: string;
  modified: string;
}

/**
 * GCS Emulator API Helper
 */
export class GCSApiHelper {
  private baseURL: string;
  private bucket: string;

  constructor(baseURL = 'http://localhost:4443', bucket = 'formio-uploads') {
    this.baseURL = baseURL;
    this.bucket = bucket;
  }

  /**
   * Verify file exists in GCS
   */
  async verifyFileExists(
    request: APIRequestContext,
    filename: string
  ): Promise<GCSUploadVerification> {
    try {
      const response = await request.head(
        `${this.baseURL}/storage/v1/b/${this.bucket}/o/${encodeURIComponent(filename)}`
      );

      if (response.status() === 404) {
        return { exists: false };
      }

      const metadata = await request.get(
        `${this.baseURL}/storage/v1/b/${this.bucket}/o/${encodeURIComponent(filename)}`
      );

      const data = await metadata.json();

      return {
        exists: true,
        size: parseInt(data.size),
        contentType: data.contentType,
        metadata: data.metadata || {}
      };
    } catch (error) {
      return { exists: false };
    }
  }

  /**
   * Download file from GCS
   */
  async downloadFile(
    request: APIRequestContext,
    filename: string
  ): Promise<Buffer | null> {
    try {
      const response = await request.get(
        `${this.baseURL}/storage/v1/b/${this.bucket}/o/${encodeURIComponent(filename)}?alt=media`
      );

      if (!response.ok()) return null;

      return await response.body();
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete file from GCS
   */
  async deleteFile(
    request: APIRequestContext,
    filename: string
  ): Promise<boolean> {
    try {
      const response = await request.delete(
        `${this.baseURL}/storage/v1/b/${this.bucket}/o/${encodeURIComponent(filename)}`
      );

      return response.ok();
    } catch (error) {
      return false;
    }
  }

  /**
   * List all files in bucket
   */
  async listFiles(
    request: APIRequestContext,
    prefix?: string
  ): Promise<string[]> {
    try {
      const url = new URL(`${this.baseURL}/storage/v1/b/${this.bucket}/o`);
      if (prefix) {
        url.searchParams.set('prefix', prefix);
      }

      const response = await request.get(url.toString());
      const data = await response.json();

      return (data.items || []).map((item: any) => item.name);
    } catch (error) {
      return [];
    }
  }

  /**
   * Clean up all test files
   */
  async cleanupTestFiles(
    request: APIRequestContext,
    prefix = 'test-'
  ): Promise<number> {
    const files = await this.listFiles(request, prefix);

    let deletedCount = 0;
    for (const file of files) {
      const deleted = await this.deleteFile(request, file);
      if (deleted) deletedCount++;
    }

    return deletedCount;
  }
}

/**
 * Form.io API Helper
 */
export class FormioApiHelper {
  private baseURL: string;
  private projectId?: string;
  private token?: string;

  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get headers with authentication
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['x-jwt-token'] = this.token;
    }

    return headers;
  }

  /**
   * Get form by path
   */
  async getForm(
    request: APIRequestContext,
    formPath: string
  ): Promise<any> {
    const response = await request.get(
      `${this.baseURL}/${formPath}`,
      { headers: this.getHeaders() }
    );

    return await response.json();
  }

  /**
   * Submit form data
   */
  async submitForm(
    request: APIRequestContext,
    formPath: string,
    data: Record<string, any>
  ): Promise<FormioSubmission> {
    const response = await request.post(
      `${this.baseURL}/${formPath}/submission`,
      {
        headers: this.getHeaders(),
        data: { data }
      }
    );

    return await response.json();
  }

  /**
   * Get submission by ID
   */
  async getSubmission(
    request: APIRequestContext,
    formPath: string,
    submissionId: string
  ): Promise<FormioSubmission> {
    const response = await request.get(
      `${this.baseURL}/${formPath}/submission/${submissionId}`,
      { headers: this.getHeaders() }
    );

    return await response.json();
  }

  /**
   * Delete submission
   */
  async deleteSubmission(
    request: APIRequestContext,
    formPath: string,
    submissionId: string
  ): Promise<boolean> {
    try {
      const response = await request.delete(
        `${this.baseURL}/${formPath}/submission/${submissionId}`,
        { headers: this.getHeaders() }
      );

      return response.ok();
    } catch (error) {
      return false;
    }
  }

  /**
   * Health check
   */
  async healthCheck(request: APIRequestContext): Promise<boolean> {
    try {
      const response = await request.get(`${this.baseURL}/health`);
      return response.ok();
    } catch (error) {
      return false;
    }
  }

  /**
   * Clean up all test submissions
   */
  async cleanupTestSubmissions(
    request: APIRequestContext,
    formPath: string
  ): Promise<number> {
    const response = await request.get(
      `${this.baseURL}/${formPath}/submission`,
      { headers: this.getHeaders() }
    );

    const submissions = await response.json();

    let deletedCount = 0;
    for (const submission of submissions) {
      const deleted = await this.deleteSubmission(request, formPath, submission._id);
      if (deleted) deletedCount++;
    }

    return deletedCount;
  }
}

/**
 * Wait for upload to complete in GCS (event-driven)
 * Replaces polling loop with exponential backoff retry pattern
 */
export async function waitForGCSUpload(
  request: APIRequestContext,
  filename: string,
  timeoutMs = 30000
): Promise<boolean> {
  const gcs = new GCSApiHelper();
  const startTime = Date.now();
  let retryDelay = 100; // Start with 100ms
  const maxDelay = 2000; // Max 2s between checks

  while (Date.now() - startTime < timeoutMs) {
    const verification = await gcs.verifyFileExists(request, filename);
    if (verification.exists) {
      return true;
    }

    // Exponential backoff with jitter
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    retryDelay = Math.min(retryDelay * 1.5, maxDelay);
  }

  return false;
}

/**
 * Verify upload matches original file
 */
export async function verifyUploadIntegrity(
  request: APIRequestContext,
  filename: string,
  originalHash: string
): Promise<boolean> {
  const gcs = new GCSApiHelper();
  const buffer = await gcs.downloadFile(request, filename);

  if (!buffer) return false;

  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  return hash === originalHash;
}