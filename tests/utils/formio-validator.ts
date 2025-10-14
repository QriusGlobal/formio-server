/**
 * Form.io Verification Helper
 * Validates submissions and file references in Form.io
 */

import axios, { type AxiosInstance } from 'axios';

export interface FormioFileReference {
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  storage: string;
  gcs?: {
    bucket: string;
    key: string;
  };
}

export interface FormioSubmission {
  _id: string;
  data: Record<string, any>;
  form: string;
  owner: string;
  created: string;
  modified: string;
  metadata?: Record<string, any>;
}

export interface FormioEventLog {
  _id: string;
  type: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface FormioValidationResult {
  valid: boolean;
  submission?: FormioSubmission;
  fileReferences?: FormioFileReference[];
  downloadable?: boolean;
  permissionsValid?: boolean;
  errors: string[];
}

export class FormioValidator {
  private client: AxiosInstance;
  private apiUrl: string;
  private projectUrl: string;
  private apiKey?: string;

  constructor(
    apiUrl: string = process.env.FORMIO_API_URL || 'http://localhost:3001',
    projectUrl: string = process.env.FORMIO_PROJECT_URL || 'http://localhost:3001',
    apiKey?: string
  ) {
    this.apiUrl = apiUrl;
    this.projectUrl = projectUrl;
    this.apiKey = apiKey || process.env.FORMIO_API_KEY;

    this.client = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'x-token': this.apiKey }),
      },
    });
  }

  /**
   * Query Form.io API for submission by ID
   */
  async getSubmission(formId: string, submissionId: string): Promise<FormioSubmission | null> {
    try {
      const response = await this.client.get(`/${formId}/submission/${submissionId}`);
      return response.data as FormioSubmission;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get submission: ${error.message}`);
    }
  }

  /**
   * Query submissions by criteria
   */
  async querySubmissions(
    formId: string,
    query: Record<string, any> = {},
    options: {
      limit?: number;
      skip?: number;
      sort?: string;
      select?: string;
    } = {}
  ): Promise<FormioSubmission[]> {
    try {
      const params: any = { ...query, ...options };
      const response = await this.client.get(`/${formId}/submission`, { params });
      return response.data as FormioSubmission[];
    } catch (error: any) {
      throw new Error(`Failed to query submissions: ${error.message}`);
    }
  }

  /**
   * Extract file references from submission
   */
  extractFileReferences(submission: FormioSubmission): FormioFileReference[] {
    const files: FormioFileReference[] = [];

    const extractFromValue = (value: any) => {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (this.isFileReference(item)) {
            files.push(item);
          } else {
            extractFromValue(item);
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        if (this.isFileReference(value)) {
          files.push(value);
        } else {
          Object.values(value).forEach(extractFromValue);
        }
      }
    };

    extractFromValue(submission.data);
    return files;
  }

  /**
   * Check if object is a file reference
   */
  private isFileReference(obj: any): obj is FormioFileReference {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'name' in obj &&
      'size' in obj &&
      'type' in obj &&
      ('url' in obj || 'storage' in obj)
    );
  }

  /**
   * Verify submission contains file reference
   */
  async verifyFileReference(
    formId: string,
    submissionId: string,
    expectedFile: {
      name?: string;
      originalName?: string;
      minSize?: number;
      maxSize?: number;
      type?: string;
      storage?: string;
    }
  ): Promise<{ found: boolean; matches: FormioFileReference[]; errors: string[] }> {
    const submission = await this.getSubmission(formId, submissionId);
    const errors: string[] = [];

    if (!submission) {
      return { found: false, matches: [], errors: ['Submission not found'] };
    }

    const files = this.extractFileReferences(submission);

    if (files.length === 0) {
      return { found: false, matches: [], errors: ['No file references found in submission'] };
    }

    const matches = files.filter((file) => {
      if (expectedFile.name && file.name !== expectedFile.name) return false;
      if (expectedFile.originalName && file.originalName !== expectedFile.originalName)
        return false;
      if (expectedFile.minSize !== undefined && file.size < expectedFile.minSize) return false;
      if (expectedFile.maxSize !== undefined && file.size > expectedFile.maxSize) return false;
      if (expectedFile.type && file.type !== expectedFile.type) return false;
      if (expectedFile.storage && file.storage !== expectedFile.storage) return false;
      return true;
    });

    if (matches.length === 0) {
      errors.push('No file references match the expected criteria');
    }

    return { found: matches.length > 0, matches, errors };
  }

  /**
   * Check file metadata in submission
   */
  async validateFileMetadata(
    formId: string,
    submissionId: string,
    fileFieldName: string,
    expectedMetadata: {
      originalName?: string;
      size?: number;
      type?: string;
      gcsKey?: string;
      gcsBucket?: string;
    }
  ): Promise<{ valid: boolean; file?: FormioFileReference; errors: string[] }> {
    const submission = await this.getSubmission(formId, submissionId);
    const errors: string[] = [];

    if (!submission) {
      return { valid: false, errors: ['Submission not found'] };
    }

    const file = submission.data[fileFieldName] as FormioFileReference | undefined;

    if (!file) {
      return { valid: false, errors: [`Field '${fileFieldName}' not found in submission`] };
    }

    if (!this.isFileReference(file)) {
      return { valid: false, errors: [`Field '${fileFieldName}' is not a file reference`] };
    }

    if (expectedMetadata.originalName && file.originalName !== expectedMetadata.originalName) {
      errors.push(
        `Original name mismatch: expected ${expectedMetadata.originalName}, got ${file.originalName}`
      );
    }

    if (expectedMetadata.size !== undefined && file.size !== expectedMetadata.size) {
      errors.push(`Size mismatch: expected ${expectedMetadata.size}, got ${file.size}`);
    }

    if (expectedMetadata.type && file.type !== expectedMetadata.type) {
      errors.push(`Type mismatch: expected ${expectedMetadata.type}, got ${file.type}`);
    }

    if (expectedMetadata.gcsKey && file.gcs?.key !== expectedMetadata.gcsKey) {
      errors.push(`GCS key mismatch: expected ${expectedMetadata.gcsKey}, got ${file.gcs?.key}`);
    }

    if (expectedMetadata.gcsBucket && file.gcs?.bucket !== expectedMetadata.gcsBucket) {
      errors.push(
        `GCS bucket mismatch: expected ${expectedMetadata.gcsBucket}, got ${file.gcs?.bucket}`
      );
    }

    return { valid: errors.length === 0, file, errors };
  }

  /**
   * Validate file is downloadable
   */
  async validateDownloadable(fileUrl: string): Promise<boolean> {
    try {
      const response = await axios.head(fileUrl, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Download file content
   */
  async downloadFile(fileUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });
      return Buffer.from(response.data);
    } catch (error: any) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Verify access permissions
   */
  async verifyAccessPermissions(
    formId: string,
    submissionId: string,
    token?: string
  ): Promise<{ canRead: boolean; canWrite: boolean; canDelete: boolean; errors: string[] }> {
    const errors: string[] = [];
    const headers = token ? { 'x-token': token } : {};

    // Test read permission
    let canRead = false;
    try {
      await this.client.get(`/${formId}/submission/${submissionId}`, { headers });
      canRead = true;
    } catch (error: any) {
      if (error.response?.status === 403) {
        errors.push('Read permission denied');
      }
    }

    // Test write permission
    let canWrite = false;
    try {
      await this.client.put(
        `/${formId}/submission/${submissionId}`,
        { data: {} },
        { headers, validateStatus: (status) => status < 500 }
      );
      canWrite = true;
    } catch (error: any) {
      if (error.response?.status === 403) {
        errors.push('Write permission denied');
      }
    }

    // Test delete permission
    let canDelete = false;
    try {
      // Use HEAD request to avoid actually deleting
      await this.client.head(`/${formId}/submission/${submissionId}`, { headers });
      canDelete = true; // Approximate - would need actual delete test
    } catch (error: any) {
      if (error.response?.status === 403) {
        errors.push('Delete permission denied');
      }
    }

    return { canRead, canWrite, canDelete, errors };
  }

  /**
   * Check event logs
   */
  async getEventLogs(
    resourceType: string,
    resourceId: string,
    eventType?: string
  ): Promise<FormioEventLog[]> {
    try {
      const params: any = {
        resource: resourceType,
        resourceId,
      };
      if (eventType) {
        params.type = eventType;
      }

      const response = await this.client.get('/event', { params });
      return response.data as FormioEventLog[];
    } catch (error: any) {
      throw new Error(`Failed to get event logs: ${error.message}`);
    }
  }

  /**
   * Comprehensive submission validation
   */
  async validateSubmission(
    formId: string,
    submissionId: string,
    options: {
      checkFileReferences?: boolean;
      expectedFiles?: Array<{
        name?: string;
        originalName?: string;
        minSize?: number;
        maxSize?: number;
        type?: string;
      }>;
      checkDownloadable?: boolean;
      checkPermissions?: boolean;
      checkEvents?: boolean;
    } = {}
  ): Promise<FormioValidationResult> {
    const result: FormioValidationResult = {
      valid: false,
      errors: [],
    };

    // Get submission
    const submission = await this.getSubmission(formId, submissionId);
    if (!submission) {
      result.errors.push('Submission not found');
      return result;
    }

    result.submission = submission;

    // Check file references
    if (options.checkFileReferences) {
      const files = this.extractFileReferences(submission);
      result.fileReferences = files;

      if (files.length === 0) {
        result.errors.push('No file references found');
      }

      // Validate expected files
      if (options.expectedFiles) {
        for (const expectedFile of options.expectedFiles) {
          const matches = files.filter((file) => {
            if (expectedFile.name && file.name !== expectedFile.name) return false;
            if (expectedFile.originalName && file.originalName !== expectedFile.originalName)
              return false;
            if (expectedFile.minSize !== undefined && file.size < expectedFile.minSize)
              return false;
            if (expectedFile.maxSize !== undefined && file.size > expectedFile.maxSize)
              return false;
            if (expectedFile.type && file.type !== expectedFile.type) return false;
            return true;
          });

          if (matches.length === 0) {
            result.errors.push(`Expected file not found: ${JSON.stringify(expectedFile)}`);
          }
        }
      }
    }

    // Check downloadable
    if (options.checkDownloadable && result.fileReferences) {
      const downloadTests = await Promise.all(
        result.fileReferences.map((file) => this.validateDownloadable(file.url))
      );
      result.downloadable = downloadTests.every((test) => test);
      if (!result.downloadable) {
        result.errors.push('Some files are not downloadable');
      }
    }

    // Check permissions
    if (options.checkPermissions) {
      const permissions = await this.verifyAccessPermissions(formId, submissionId);
      result.permissionsValid = permissions.canRead;
      result.errors.push(...permissions.errors);
    }

    // Check events
    if (options.checkEvents) {
      try {
        const events = await this.getEventLogs('submission', submissionId);
        if (events.length === 0) {
          result.errors.push('No event logs found');
        }
      } catch (error: any) {
        result.errors.push(`Event log check failed: ${error.message}`);
      }
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  /**
   * Wait for submission to appear
   */
  async waitForSubmission(
    formId: string,
    submissionId: string,
    timeoutMs: number = 10000,
    pollIntervalMs: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const submission = await this.getSubmission(formId, submissionId);
      if (submission) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    return false;
  }
}

/**
 * Create a singleton instance
 */
export const formioValidator = new FormioValidator();

/**
 * Helper function for tests
 */
export async function setupFormioValidator(
  apiUrl?: string,
  projectUrl?: string,
  apiKey?: string
): Promise<FormioValidator> {
  const validator = new FormioValidator(apiUrl, projectUrl, apiKey);

  // Verify connection
  try {
    await validator.client.get('/health');
  } catch (error: any) {
    throw new Error(`Form.io connection failed: ${error.message}`);
  }

  return validator;
}