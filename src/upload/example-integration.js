'use strict';

/**
 * Example: TUS Upload Server Integration with Form.io
 *
 * This example shows how to integrate the TUS upload server
 * into a Form.io application.
 */

const express = require('express');
const formio = require('formio');
const upload = require('./index');

/**
 * Example 1: Basic Integration
 *
 * Minimal setup with environment variables
 */
function basicIntegration() {
  const app = express();
  const router = formio(app);

  // Initialize upload system
  const uploadSystem = upload.initialize(router, {
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      keyFilename: process.env.GCS_KEY_FILENAME
    }
  });

  // Mount routes
  app.use('/api', uploadSystem.routes);

  return app;
}

/**
 * Example 2: Advanced Configuration
 *
 * Full configuration with custom settings
 */
function advancedIntegration() {
  const app = express();
  const router = formio(app);

  const uploadSystem = upload.initialize(router, {
    // GCS configuration
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      keyFilename: './config/gcs-key.json',
      chunkSize: 8 * 1024 * 1024 // 8MB chunks
    },

    // TUS server configuration
    tus: {
      path: '/files',
      maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
      expirationPeriod: 86400000, // 24 hours

      // Custom upload creation hook
      onUploadCreate: async (req, res, upload) => {
        console.log('Upload created:', {
          id: upload.id,
          size: upload.size,
          userId: req.user._id
        });

        // Store upload reference in database
        // await db.uploads.insert({...});
      },

      // Custom upload completion hook
      onUploadFinish: async (req, res, upload, fileUrl) => {
        console.log('Upload completed:', {
          id: upload.id,
          url: fileUrl
        });

        // Process completed file
        // await processFile(upload.id);
      }
    },

    // Validation configuration
    validation: {
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/zip'
      ],
      blockedExtensions: [
        '.exe', '.bat', '.cmd', '.sh', '.ps1'
      ]
    },

    // Rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    }
  });

  // Mount routes
  app.use('/api', uploadSystem.routes);

  return app;
}

/**
 * Example 3: Multiple Upload Endpoints
 *
 * Different configurations for different upload types
 */
function multipleEndpoints() {
  const app = express();
  const router = formio(app);

  // Public uploads (images only, smaller size)
  const publicUploads = upload.initialize(router, {
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: 'public-uploads'
    },
    tus: {
      path: '/public-files',
      maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    validation: {
      allowedTypes: ['image/jpeg', 'image/png']
    }
  });

  // Private uploads (all types, larger size)
  const privateUploads = upload.initialize(router, {
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: 'private-uploads'
    },
    tus: {
      path: '/private-files',
      maxFileSize: 5 * 1024 * 1024 * 1024 // 5GB
    }
  });

  // Mount routes
  app.use('/api', publicUploads.routes);
  app.use('/api', privateUploads.routes);

  return app;
}

/**
 * Example 4: Custom Storage Provider
 *
 * Using credentials object instead of key file
 */
function customStorageProvider() {
  const app = express();
  const router = formio(app);

  const uploadSystem = upload.initialize(router, {
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY
      }
    }
  });

  app.use('/api', uploadSystem.routes);

  return app;
}

/**
 * Example 5: Testing and Development
 *
 * Mock configuration for local testing
 */
function developmentSetup() {
  const app = express();
  const router = formio(app);

  // Use local storage for development
  const uploadSystem = upload.initialize(router, {
    gcs: {
      projectId: 'test-project',
      bucketName: 'test-bucket',
      keyFilename: './test/fixtures/gcs-test-key.json'
    },
    tus: {
      maxFileSize: 100 * 1024 * 1024, // 100MB for testing
      expirationPeriod: 3600000 // 1 hour for testing
    }
  });

  app.use('/api', uploadSystem.routes);

  return app;
}

/**
 * Example 6: With Form.io Form Integration
 *
 * Upload associated with specific form submission
 */
function formIntegration() {
  const app = express();
  const router = formio(app);

  const uploadSystem = upload.initialize(router, {
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      keyFilename: process.env.GCS_KEY_FILENAME
    },
    tus: {
      onUploadFinish: async (req, res, upload, fileUrl) => {
        // Link upload to form submission
        const {formId, fieldName} = upload.metadata;

        // Update submission with file URL
        if (req.submissionId) {
          await router.formio.resources.submission.model.findByIdAndUpdate(
            req.submissionId,
            {
              $set: {
                [`data.${fieldName}`]: [{
                  url: fileUrl,
                  name: upload.metadata.filename,
                  size: upload.size,
                  type: upload.metadata.filetype,
                  storage: 'gcs'
                }]
              }
            }
          );
        }
      }
    }
  });

  app.use('/api', uploadSystem.routes);

  return app;
}

/**
 * Example 7: Monitoring and Logging
 *
 * Enhanced logging and monitoring
 */
function monitoringIntegration() {
  const app = express();
  const router = formio(app);

  const uploadSystem = upload.initialize(router, {
    gcs: {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      keyFilename: process.env.GCS_KEY_FILENAME
    },
    tus: {
      onUploadCreate: async (req, res, upload) => {
        // Log upload start
        console.log('[UPLOAD_START]', {
          uploadId: upload.id,
          userId: req.user._id,
          size: upload.size,
          filename: upload.metadata.filename,
          timestamp: new Date().toISOString()
        });

        // Send to monitoring service
        // await monitoring.track('upload.started', {...});
      },

      onUploadFinish: async (req, res, upload, fileUrl) => {
        // Log upload completion
        console.log('[UPLOAD_COMPLETE]', {
          uploadId: upload.id,
          userId: req.user._id,
          size: upload.size,
          duration: Date.now() - upload.createdAt,
          timestamp: new Date().toISOString()
        });

        // Send to monitoring service
        // await monitoring.track('upload.completed', {...});
      }
    }
  });

  app.use('/api', uploadSystem.routes);

  // Add metrics endpoint
  app.get('/api/files/metrics', async (req, res) => {
    // Return upload metrics
    res.json({
      activeUploads: uploadSystem.tusServer.uploadMetadata.size,
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

/**
 * Client-Side Usage Example
 */
const clientExample = `
<!-- Include TUS client library -->
<script src="https://cdn.jsdelivr.net/npm/tus-js-client@latest/dist/tus.min.js"></script>

<script>
// File input element
const fileInput = document.getElementById('file-input');
const progressBar = document.getElementById('progress');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];

  // Get JWT token from Form.io
  const token = localStorage.getItem('formioToken');

  // Create upload
  const upload = new tus.Upload(file, {
    endpoint: 'http://localhost:3001/api/files',
    retryDelays: [0, 3000, 5000, 10000],
    metadata: {
      filename: file.name,
      filetype: file.type,
      formId: 'form-123',
      fieldName: 'fileUpload'
    },
    headers: {
      'Authorization': \`Bearer \${token}\`
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error);
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
      progressBar.value = percentage;
      console.log(\`Progress: \${percentage}%\`);
    },
    onSuccess: () => {
      console.log('Upload completed:', upload.url);
      alert('Upload successful!');
    }
  });

  // Start upload
  upload.start();
});
</script>
`;

module.exports = {
  basicIntegration,
  advancedIntegration,
  multipleEndpoints,
  customStorageProvider,
  developmentSetup,
  formIntegration,
  monitoringIntegration,
  clientExample
};
