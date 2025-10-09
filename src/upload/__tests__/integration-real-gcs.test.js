/**
 * Real GCS Integration Test
 *
 * Tests async upload flow with actual Google Cloud Storage
 * Bucket: formio-test-uploads-erlich in erlich-dev project
 */

const {describe, it, expect, beforeAll, afterAll, beforeEach} = require('vitest');
const axios = require('axios');
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Configuration
const FORMIO_URL = process.env.FORMIO_URL || 'http://localhost:3001';
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || 'erlich-dev';
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'formio-test-uploads-erlich';
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  `${process.env.HOME}/.config/gcloud/keys/dev-mish-key.json`;

describe('Real GCS Integration', () => {
  let storage;
  let bucket;
  let authToken;
  let formId;
  let testFiles = [];

  beforeAll(async () => {
    // Initialize GCS client
    storage = new Storage({
      projectId: GCS_PROJECT_ID,
      keyFilename: GOOGLE_APPLICATION_CREDENTIALS
    });
    bucket = storage.bucket(GCS_BUCKET_NAME);

    // Authenticate with Form.io
    const loginResponse = await axios.post(`${FORMIO_URL}/user/login`, {
      data: {
        email: 'admin@gcs-test.local',
        password: 'admin123'
      }
    });

    authToken = loginResponse.headers['x-jwt-token'];

    // Create test form with file upload component
    const formResponse = await axios.post(`${FORMIO_URL}/form`, {
      title: 'Real GCS Upload Test',
      name: 'realGcsUploadTest',
      path: 'real-gcs-upload',
      type: 'form',
      components: [
        {
          type: 'tusupload',
          key: 'testFile',
          label: 'Real GCS Upload',
          multiple: false,
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
    // Cleanup: Delete all test files from GCS
    console.log(`Cleaning up ${testFiles.length} test files from GCS...`);
    await Promise.all(
      testFiles.map(fileName =>
        bucket.file(fileName).delete().catch(err => {
          console.warn(`Failed to delete ${fileName}:`, err.message);
        })
      )
    );
  });

  beforeEach(() => {
    testFiles = []; // Reset test files for each test
  });

  it('should upload file to actual GCS bucket', async () => {
    // Create test file
    const testFilePath = path.join(__dirname, 'fixtures', 'real-gcs-test.txt');
    const testContent = `Real GCS test - ${new Date().toISOString()}`;
    await fs.promises.writeFile(testFilePath, testContent);

    // Upload via Form.io (triggers async GCS upload)
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));

    const uploadResponse = await axios.post(
      `${FORMIO_URL}/form/${formId}/submission`,
      {
        data: {
          testFile: {
            name: 'real-gcs-test.txt',
            size: testContent.length,
            type: 'text/plain'
          }
        }
      },
      {headers: {'x-jwt-token': authToken}}
    );

    // Wait for async upload to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verify file exists in GCS
    const gcsFileName = uploadResponse.data.data.testFile.storage.key ||
                        uploadResponse.data.data.testFile.name;

    testFiles.push(gcsFileName);

    const [exists] = await bucket.file(gcsFileName).exists();
    expect(exists).toBe(true);

    // Cleanup
    await fs.promises.unlink(testFilePath);
  });

  it('should generate valid signed URL for uploaded file', async () => {
    // Create and upload test file
    const testFilePath = path.join(__dirname, 'fixtures', 'signed-url-test.txt');
    const testContent = 'Signed URL test content';
    await fs.promises.writeFile(testFilePath, testContent);

    const submissionResponse = await axios.post(
      `${FORMIO_URL}/form/${formId}/submission`,
      {
        data: {
          testFile: {
            name: 'signed-url-test.txt',
            size: testContent.length,
            type: 'text/plain'
          }
        }
      },
      {headers: {'x-jwt-token': authToken}}
    );

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get updated submission with GCS URL
    const updatedSubmission = await axios.get(
      `${FORMIO_URL}/form/${formId}/submission/${submissionResponse.data._id}`,
      {headers: {'x-jwt-token': authToken}}
    );

    const fileUrl = updatedSubmission.data.data.testFile.url;

    expect(fileUrl).toBeDefined();
    expect(fileUrl).toContain('storage.googleapis.com');
    expect(fileUrl).toContain(GCS_BUCKET_NAME);

    // Verify signed URL works
    const fileResponse = await axios.get(fileUrl);
    expect(fileResponse.status).toBe(200);
    expect(fileResponse.data).toBe(testContent);

    // Track for cleanup
    testFiles.push(updatedSubmission.data.data.testFile.storage.key);

    // Cleanup
    await fs.promises.unlink(testFilePath);
  });

  it('should make file accessible via signed URL', async () => {
    // Upload a test file directly to GCS
    const testFileName = `test-access-${Date.now()}.txt`;
    const testContent = 'Direct GCS upload test';

    const file = bucket.file(testFileName);
    await file.save(testContent, {
      metadata: {
        contentType: 'text/plain'
      }
    });

    testFiles.push(testFileName);

    // Generate signed URL (7 days expiry - same as Form.io)
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    expect(signedUrl).toBeDefined();
    expect(signedUrl).toContain('storage.googleapis.com');

    // Verify file is accessible
    const accessResponse = await axios.get(signedUrl);
    expect(accessResponse.status).toBe(200);
    expect(accessResponse.data).toBe(testContent);
  });

  it('should cleanup test files from GCS bucket', async () => {
    // Create multiple test files
    const fileCount = 3;
    const createdFiles = [];

    for (let i = 0; i < fileCount; i++) {
      const fileName = `cleanup-test-${i}-${Date.now()}.txt`;
      const file = bucket.file(fileName);
      await file.save(`Cleanup test ${i}`);
      createdFiles.push(fileName);
      testFiles.push(fileName);
    }

    // Verify files exist
    for (const fileName of createdFiles) {
      const [exists] = await bucket.file(fileName).exists();
      expect(exists).toBe(true);
    }

    // Delete files
    await Promise.all(
      createdFiles.map(fileName => bucket.file(fileName).delete())
    );

    // Verify files deleted
    for (const fileName of createdFiles) {
      const [exists] = await bucket.file(fileName).exists();
      expect(exists).toBe(false);
    }

    // Remove from cleanup list (already deleted)
    testFiles = testFiles.filter(f => !createdFiles.includes(f));
  });
});
