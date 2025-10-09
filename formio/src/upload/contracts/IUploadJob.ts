/**
 * Upload Job Contract for BullMQ Job Queue
 *
 * Defines the structure of job data passed from TUS completion hook to GCS upload worker.
 * Ensures type safety and contract adherence across async job processing.
 */

export interface IUploadJob {
  /** Unique TUS upload ID from completed upload */
  tusUploadId: string;

  /** Original filename from client */
  fileName: string;

  /** File size in bytes */
  fileSize: number;

  /** MIME type of the uploaded file */
  contentType: string;

  /** Form.io form ID this upload belongs to */
  formId: string;

  /** Form.io submission ID (if available at upload time) */
  submissionId?: string;

  /** Form field key where file should be stored */
  fieldKey: string;

  /** User ID who initiated the upload */
  userId?: string;

  /** Additional custom metadata */
  metadata?: Record<string, any>;

  /** Timestamp when upload was completed */
  uploadedAt: Date;
}

export interface IUploadResult {
  /** Success status of the GCS upload */
  success: boolean;

  /** GCS signed URL for file access (7-day expiry) */
  gcsUrl?: string;

  /** GCS file path/key for storage reference */
  gcspath?: string;

  /** GCS bucket name */
  bucket?: string;

  /** File size (verification) */
  size?: number;

  /** Error message if upload failed */
  error?: string;

  /** Error code for programmatic handling */
  errorCode?: 'GCS_UPLOAD_FAILED' | 'NETWORK_TIMEOUT' | 'INVALID_FILE' | 'PERMISSION_DENIED';

  /** Number of retry attempts made */
  retryCount?: number;

  /** Total processing time in milliseconds */
  processingTime?: number;
}

export interface IUploadMetadata {
  /** TUS upload ID reference */
  tusUploadId: string;

  /** Form.io form ID */
  formId: string;

  /** Form.io submission ID */
  submissionId: string;

  /** Form field key */
  fieldKey: string;

  /** Original filename */
  fileName: string;

  /** File MIME type */
  contentType: string;

  /** File size in bytes */
  fileSize: number;

  /** Upload timestamp */
  uploadedAt: Date;

  /** GCS upload result (set after job completion) */
  gcsResult?: IUploadResult;

  /** Job status tracking */
  jobStatus: 'pending' | 'processing' | 'completed' | 'failed';

  /** Error details if job failed */
  error?: {
    message: string;
    code: string;
    stack?: string;
  };
}
