/**
 * TUS Upload Completion Hook
 *
 * Invoked when TUS upload completes.
 * Logs upload completion for tracking.
 */

'use strict';

/**
 * Handle TUS upload completion
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} upload - TUS upload object
 * @param {string} fileUrl - File URL from GCS
 * @returns {Promise<void>}
 */
async function onUploadFinish(req, res, upload, fileUrl) {
  // Validate required metadata
  const requiredMetadata = ['formId', 'fieldName'];
  const missingMetadata = requiredMetadata.filter(field => !upload.metadata[field]);

  if (missingMetadata.length > 0) {
    throw new Error(`Missing required metadata: ${missingMetadata.join(', ')}`);
  }

  // Log upload completion
  console.log(`[TUS Hook] Upload completed: ${upload.id}`, {
    fileName: upload.metadata.filename,
    fileSize: upload.size,
    formId: upload.metadata.formId,
    fieldName: upload.metadata.fieldName,
    userId: req.user?._id || req.uploadContext?.userId,
    fileUrl
  });
}

module.exports = {
  onUploadFinish
};
