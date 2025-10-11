/**
 * Global Teardown for E2E Tests
 * Runs once after all tests
 */

async function globalTeardown() {
  console.log('🧹 Running global teardown...');

  // Optional: Clean up test data
  // await cleanupTestData();

  // Optional: Stop services
  // await stopTestServices();

  console.log('✅ Global teardown complete');
}

export default globalTeardown;