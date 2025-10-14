/**
 * GCS Provider Usage Example
 *
 * Demonstrates how to use the GCS storage provider with Form.io
 * for local development (GCS emulator) and production.
 *
 * Prerequisites:
 * 1. GCS emulator running at http://localhost:4443
 * 2. Bucket 'local-formio-uploads' created
 * 3. npm install @google-cloud/storage
 */

const { createProvider } = require('../formio/src/storage');
const fs = require('fs');
const path = require('path');

/**
 * Example 1: Basic Upload to GCS Emulator
 */
async function basicUploadExample() {
  console.log('\n=== Example 1: Basic Upload ===\n');

  // Create provider for local emulator
  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  // Test connection
  const isConnected = await provider.testConnection();
  console.log('✅ Connected to GCS emulator:', isConnected);

  // Create test file
  const testFile = path.join(__dirname, 'test-upload.txt');
  fs.writeFileSync(testFile, 'Hello from Form.io GCS Provider!');

  // Upload file
  const stream = fs.createReadStream(testFile);
  const result = await provider.upload(stream, {
    key: 'examples/basic-upload.txt',
    contentType: 'text/plain',
    formId: 'form-123',
    submissionId: 'sub-456'
  });

  console.log('✅ Upload successful:');
  console.log('   Location:', result.location);
  console.log('   Key:', result.key);
  console.log('   Bucket:', result.bucket);

  // Cleanup
  fs.unlinkSync(testFile);

  return result;
}

/**
 * Example 2: Multipart Upload with Progress Tracking
 */
async function multipartUploadExample() {
  console.log('\n=== Example 2: Multipart Upload with Progress ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  // Listen for progress events
  provider.on('progress', (progress) => {
    console.log(`   Progress: ${progress.percentage}% (${progress.loaded}/${progress.total} bytes)`);
  });

  provider.on('complete', (result) => {
    console.log('✅ Upload complete:', result.key);
  });

  // Create larger test file (1MB)
  const testFile = path.join(__dirname, 'large-test.bin');
  const buffer = Buffer.alloc(1024 * 1024, 'A'); // 1MB of 'A'
  fs.writeFileSync(testFile, buffer);

  // Upload with multipart
  const stream = fs.createReadStream(testFile);
  const result = await provider.multipartUpload(stream, {
    key: 'examples/large-file.bin',
    contentType: 'application/octet-stream',
    formId: 'form-789',
    submissionId: 'sub-012',
    uploadId: 'upload-abc123'
  }, {
    chunkSize: 256 * 1024, // 256KB chunks
    onProgress: (progress) => {
      // Custom progress handler
      if (progress.percentage % 25 === 0) {
        console.log(`   Custom handler: ${progress.percentage}% complete`);
      }
    }
  });

  console.log('✅ Multipart upload successful:');
  console.log('   Location:', result.location);
  console.log('   Size:', result.size, 'bytes');
  console.log('   ETag:', result.etag);
  console.log('   CRC32C:', result.crc32c);

  // Cleanup
  fs.unlinkSync(testFile);

  return result;
}

/**
 * Example 3: Download File
 */
async function downloadExample(fileKey) {
  console.log('\n=== Example 3: Download File ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  // Download file
  const downloadStream = await provider.download(fileKey);
  const outputPath = path.join(__dirname, 'downloaded-file.txt');
  const writeStream = fs.createWriteStream(outputPath);

  downloadStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      const content = fs.readFileSync(outputPath, 'utf8');
      console.log('✅ Download successful:');
      console.log('   Content:', content);
      fs.unlinkSync(outputPath);
      resolve(content);
    });

    writeStream.on('error', reject);
  });
}

/**
 * Example 4: Generate Presigned URL
 */
async function presignedUrlExample(fileKey) {
  console.log('\n=== Example 4: Generate Presigned URL ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  // Generate read URL (expires in 15 minutes)
  const readUrl = await provider.generatePresignedUrl(fileKey, 'read', 900);
  console.log('✅ Read URL generated (expires in 15 min):');
  console.log('   URL:', readUrl);

  // Generate write URL for client upload
  const writeUrl = await provider.generatePresignedUrl(
    'examples/client-upload.pdf',
    'write',
    3600, // 1 hour
    { contentType: 'application/pdf' }
  );
  console.log('✅ Write URL generated (expires in 1 hour):');
  console.log('   URL:', writeUrl);

  return { readUrl, writeUrl };
}

/**
 * Example 5: List Files
 */
async function listFilesExample() {
  console.log('\n=== Example 5: List Files ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  // List all files with 'examples/' prefix
  const result = await provider.listObjects('examples/', {
    maxResults: 10
  });

  console.log('✅ Files found:', result.objects.length);
  result.objects.forEach(file => {
    console.log(`   - ${file.key}: ${file.size} bytes (${file.contentType})`);
  });

  if (result.nextPageToken) {
    console.log('   More results available (nextPageToken)');
  }

  return result;
}

/**
 * Example 6: File Metadata
 */
async function metadataExample(fileKey) {
  console.log('\n=== Example 6: Get File Metadata ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  const metadata = await provider.headObject(fileKey);

  console.log('✅ File metadata:');
  console.log('   Key:', metadata.key);
  console.log('   Size:', metadata.size, 'bytes');
  console.log('   Content-Type:', metadata.contentType);
  console.log('   ETag:', metadata.etag);
  console.log('   Last Modified:', metadata.lastModified);
  console.log('   CRC32C:', metadata.crc32c);
  console.log('   MD5 Hash:', metadata.md5Hash);

  return metadata;
}

/**
 * Example 7: Copy File
 */
async function copyFileExample(sourceKey) {
  console.log('\n=== Example 7: Copy File ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  const destKey = `backups/${path.basename(sourceKey)}`;

  const result = await provider.copyObject(sourceKey, destKey);

  console.log('✅ File copied:');
  console.log('   Source:', sourceKey);
  console.log('   Destination:', destKey);
  console.log('   Size:', result.size, 'bytes');

  return result;
}

/**
 * Example 8: Delete File
 */
async function deleteFileExample(fileKey) {
  console.log('\n=== Example 8: Delete File ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  provider.on('deleted', (result) => {
    console.log('✅ File deleted event:', result.key);
  });

  await provider.delete(fileKey);
  console.log('✅ File deleted:', fileKey);
}

/**
 * Example 9: Production Configuration
 */
async function productionExample() {
  console.log('\n=== Example 9: Production Configuration ===\n');

  // Using service account key file
  const provider1 = createProvider('gcs', {
    projectId: 'my-production-project',
    keyFilename: '/path/to/service-account-key.json',
    bucket: 'production-formio-uploads',
    location: 'us-central1'
  });

  console.log('✅ Production provider created (keyFilename)');

  // Using credentials object
  const provider2 = createProvider('gcs', {
    projectId: 'my-production-project',
    credentials: {
      client_email: 'service@project.iam.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n'
    },
    bucket: 'production-formio-uploads',
    location: 'us-central1'
  });

  console.log('✅ Production provider created (credentials object)');

  return { provider1, provider2 };
}

/**
 * Example 10: Environment Variables
 */
async function envVariablesExample() {
  console.log('\n=== Example 10: Environment Variables ===\n');

  // Set environment variables
  process.env.STORAGE_PROVIDER = 'gcs';
  process.env.STORAGE_BUCKET = 'local-formio-uploads';
  process.env.GCS_PROJECT_ID = 'local-project';
  process.env.GCS_API_ENDPOINT = 'http://localhost:4443';

  const { createProviderFromEnv } = require('../formio/src/storage');
  const provider = createProviderFromEnv();

  console.log('✅ Provider created from environment variables');

  // Test connection
  const isConnected = await provider.testConnection();
  console.log('✅ Connection test:', isConnected);

  return provider;
}

/**
 * Example 11: Error Handling
 */
async function errorHandlingExample() {
  console.log('\n=== Example 11: Error Handling ===\n');

  const provider = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'non-existent-bucket',
    apiEndpoint: 'http://localhost:4443'
  });

  // Listen for errors
  provider.on('error', (error) => {
    console.log('❌ Error event caught:', error.message);
  });

  try {
    await provider.testConnection();
  }
  catch (error) {
    console.log('✅ Error caught in try-catch:', error.message);
  }

  // Ensure bucket exists
  const provider2 = createProvider('gcs', {
    projectId: 'local-project',
    bucket: 'local-formio-uploads',
    apiEndpoint: 'http://localhost:4443'
  });

  await provider2.ensureBucket();
  console.log('✅ Bucket ensured (created if not exists)');
}

/**
 * Run All Examples
 */
async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   Form.io GCS Storage Provider - Examples         ║');
  console.log('╚════════════════════════════════════════════════════╝');

  try {
    // Example 1: Basic Upload
    const uploadResult = await basicUploadExample();

    // Example 2: Multipart Upload
    const multipartResult = await multipartUploadExample();

    // Example 3: Download
    await downloadExample(uploadResult.key);

    // Example 4: Presigned URLs
    await presignedUrlExample(uploadResult.key);

    // Example 5: List Files
    await listFilesExample();

    // Example 6: Metadata
    await metadataExample(uploadResult.key);

    // Example 7: Copy File
    const copyResult = await copyFileExample(uploadResult.key);

    // Example 8: Delete Files
    await deleteFileExample(multipartResult.key);
    await deleteFileExample(copyResult.key);
    await deleteFileExample(uploadResult.key);

    // Example 9: Production Config (dry run)
    // await productionExample(); // Commented out - requires real GCP credentials

    // Example 10: Environment Variables
    await envVariablesExample();

    // Example 11: Error Handling
    await errorHandlingExample();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║   ✅ All Examples Completed Successfully!          ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
  }
  catch (error) {
    console.error('\n❌ Example failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  basicUploadExample,
  multipartUploadExample,
  downloadExample,
  presignedUrlExample,
  listFilesExample,
  metadataExample,
  copyFileExample,
  deleteFileExample,
  productionExample,
  envVariablesExample,
  errorHandlingExample
};