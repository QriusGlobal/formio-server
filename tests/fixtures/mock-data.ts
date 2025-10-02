/**
 * Mock Data for Tests
 * Pre-defined test data and fixtures
 */

export const mockForms = {
  uploadForm: {
    _id: 'test-form-upload',
    title: 'File Upload Test Form',
    name: 'fileUploadTest',
    path: 'file-upload-test',
    components: [
      {
        type: 'file',
        key: 'document',
        label: 'Upload Document',
        storage: 'gcs',
        url: '/gcs/upload',
        options: {
          maxSize: 10485760, // 10MB
          fileTypes: ['image/*', 'application/pdf', 'text/*'],
        },
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit',
        theme: 'primary',
      },
    ],
  },

  multipleUploadForm: {
    _id: 'test-form-multiple',
    title: 'Multiple File Upload Form',
    name: 'multipleUploadTest',
    path: 'multiple-upload-test',
    components: [
      {
        type: 'file',
        key: 'documents',
        label: 'Upload Documents',
        storage: 'gcs',
        multiple: true,
        url: '/gcs/upload',
        options: {
          maxSize: 10485760,
          fileTypes: ['image/*', 'application/pdf'],
        },
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit',
      },
    ],
  },
};

export const mockSubmissions = {
  successful: {
    _id: 'test-submission-1',
    form: 'test-form-upload',
    data: {
      document: {
        name: 'uploads/test-file-123.pdf',
        originalName: 'test-document.pdf',
        size: 102400,
        type: 'application/pdf',
        url: 'http://localhost:4443/storage/v1/b/formio-uploads/o/uploads%2Ftest-file-123.pdf',
        storage: 'gcs',
        gcs: {
          bucket: 'formio-uploads',
          key: 'uploads/test-file-123.pdf',
        },
      },
    },
    created: '2024-01-15T10:30:00.000Z',
    modified: '2024-01-15T10:30:00.000Z',
  },

  withMultipleFiles: {
    _id: 'test-submission-2',
    form: 'test-form-multiple',
    data: {
      documents: [
        {
          name: 'uploads/file-1.png',
          originalName: 'image1.png',
          size: 204800,
          type: 'image/png',
          url: 'http://localhost:4443/storage/v1/b/formio-uploads/o/uploads%2Ffile-1.png',
          storage: 'gcs',
          gcs: {
            bucket: 'formio-uploads',
            key: 'uploads/file-1.png',
          },
        },
        {
          name: 'uploads/file-2.pdf',
          originalName: 'document.pdf',
          size: 512000,
          type: 'application/pdf',
          url: 'http://localhost:4443/storage/v1/b/formio-uploads/o/uploads%2Ffile-2.pdf',
          storage: 'gcs',
          gcs: {
            bucket: 'formio-uploads',
            key: 'uploads/file-2.pdf',
          },
        },
      ],
    },
    created: '2024-01-15T10:35:00.000Z',
    modified: '2024-01-15T10:35:00.000Z',
  },
};

export const mockGCSFiles = [
  {
    name: 'uploads/test-file-123.pdf',
    bucket: 'formio-uploads',
    size: 102400,
    contentType: 'application/pdf',
    md5Hash: 'abc123',
    timeCreated: '2024-01-15T10:30:00.000Z',
    updated: '2024-01-15T10:30:00.000Z',
  },
  {
    name: 'uploads/file-1.png',
    bucket: 'formio-uploads',
    size: 204800,
    contentType: 'image/png',
    md5Hash: 'def456',
    timeCreated: '2024-01-15T10:35:00.000Z',
    updated: '2024-01-15T10:35:00.000Z',
  },
];

export const mockUsers = {
  admin: {
    _id: 'test-user-admin',
    email: 'admin@test.com',
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
  },

  regular: {
    _id: 'test-user-regular',
    email: 'user@test.com',
    role: 'user',
    permissions: ['read', 'write'],
  },

  readonly: {
    _id: 'test-user-readonly',
    email: 'readonly@test.com',
    role: 'viewer',
    permissions: ['read'],
  },
};

export const mockEventLogs = [
  {
    _id: 'event-1',
    type: 'submission.created',
    resource: 'submission',
    resourceId: 'test-submission-1',
    timestamp: '2024-01-15T10:30:00.000Z',
    data: {
      formId: 'test-form-upload',
      userId: 'test-user-admin',
    },
  },
  {
    _id: 'event-2',
    type: 'file.uploaded',
    resource: 'file',
    resourceId: 'uploads/test-file-123.pdf',
    timestamp: '2024-01-15T10:30:05.000Z',
    data: {
      fileSize: 102400,
      contentType: 'application/pdf',
    },
  },
];

export const mockErrorScenarios = {
  fileTooLarge: {
    file: {
      name: 'large-file.pdf',
      size: 20 * 1024 * 1024, // 20MB
      type: 'application/pdf',
    },
    expectedError: 'File size exceeds maximum allowed size',
  },

  invalidFileType: {
    file: {
      name: 'malicious.exe',
      size: 1024,
      type: 'application/x-msdownload',
    },
    expectedError: 'File type not allowed',
  },

  uploadFailed: {
    file: {
      name: 'test.pdf',
      size: 1024,
      type: 'application/pdf',
    },
    expectedError: 'Upload failed',
    statusCode: 500,
  },

  networkTimeout: {
    file: {
      name: 'test.pdf',
      size: 1024,
      type: 'application/pdf',
    },
    expectedError: 'Network timeout',
    delay: 30000,
  },
};