const assert = require('assert');
const sinon = require('sinon');
const { Readable } = require('stream');
const { processUpload } = require('./processor'); // The function to be implemented

// Helper function to create mock job data, adhering to DRY
const createMockJob = (overrides = {}) => {
  const defaultFile = {
    name: 'safe-filename.png',
    checksum: 'VALID_XXHASH_CHECKSUM',
    gcsName: 'temp/upload-id/safe-filename.png',
    fieldKey: 'file'
  };
  const defaultData = {
    file: { ...defaultFile, ...(overrides.file || {}) },
    formId: 'form123',
    submissionId: 'sub123',
  };
  return {
    data: { ...defaultData, ...overrides },
    update: sinon.fake.resolves(),
    log: sinon.fake(),
  };
};

describe('File Upload Worker: processUpload', () => {
  let mockGcsFile, mockGcsBucket, mockStorage, mockSubmissionModel, formio;

  // Use beforeEach to set up all common mocks
  beforeEach(() => {
    mockGcsFile = {
      createReadStream: () => Readable.from(['file content']), // Mock stream
      move: sinon.fake.resolves(),
      getSignedUrl: sinon.fake.resolves(['https://signed.url/file.png']),
    };
    mockGcsBucket = {
      file: sinon.fake.returns(mockGcsFile),
    };
    mockStorage = {
      bucket: sinon.fake.returns(mockGcsBucket),
    };
    mockSubmissionModel = {
      findByIdAndUpdate: sinon.fake.resolves({ ok: 1 }),
    };
    formio = {
      models: { submission: mockSubmissionModel },
      config: { gcs: { bucket: 'temp-bucket', permanentBucket: 'permanent-bucket' } },
      google: mockStorage,
    };
  });

  // Use afterEach to restore all stubs, ensuring test isolation
  afterEach(() => {
    sinon.restore();
  });

  // Test 1: The "Happy Path"
  it('should validate, move, and update a successful upload', async () => {
    const job = createMockJob({ file: { checksum: 'c2e74f33b33c204a' } }); // Real xxhash of "file content"
    await processUpload(job, formio);

    assert(mockGcsFile.move.calledOnceWith('form123/sub123/safe-filename.png'), 'File should be moved to permanent storage');
    assert(mockSubmissionModel.findByIdAndUpdate.calledOnce, 'Submission should be updated');
    assert.deepStrictEqual(mockSubmissionModel.findByIdAndUpdate.firstCall.args[1], {
        $set: { 'data.file.url': 'https://signed.url/file.png', 'data.file.gcsName': 'form123/sub123/safe-filename.png' }
    });
  });

  // Test 2: Failing test for integrity check
  it('should throw an error if checksum validation fails', async () => {
    const job = createMockJob({ file: { checksum: 'INVALID_CHECKSUM' } }); // Use the factory for a specific case
    
    await assert.rejects(processUpload(job, formio), /Integrity check failed/);
    assert(mockGcsFile.move.notCalled, 'File should NOT be moved on validation failure');
    assert(mockSubmissionModel.findByIdAndUpdate.notCalled, 'Submission should NOT be updated on validation failure');
  });

  // Test 3: Failing test for GCS move error
  it('should throw an error if moving the file fails', async () => {
    mockGcsFile.move.rejects(new Error('GCS Move Error')); // Stub the GCS move to fail
    const job = createMockJob({ file: { checksum: 'c2e74f33b33c204a' } });

    await assert.rejects(processUpload(job, formio), /GCS Move Error/);
    assert(mockSubmissionModel.findByIdAndUpdate.notCalled, 'Submission should NOT be updated on GCS failure');
  });
});