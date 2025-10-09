/**
 * Worker Initialization (Placeholder)
 *
 * File generation workers removed - YAGNI principle applied.
 * This file kept as placeholder for future needs.
 */

'use strict';

const {setupFileGenerationAPI} = require('../api/fileGenerationAPI');

/**
 * Initialize workers (placeholder)
 *
 * @param {Object} options - Worker configuration
 * @param {Express.Router} options.router - Express router for API routes
 * @returns {Object} Empty worker instances
 */
function initializeWorkers(options = {}) {
  const {router} = options;

  console.log('[Workers] No workers to initialize (removed for simplicity)');

  // Setup API routes if router provided (returns 501 Not Implemented)
  if (router) {
    setupFileGenerationAPI(router);
    console.log('[Workers] File generation API routes registered (returns 501)');
  }

  return {};
}

module.exports = {initializeWorkers};
