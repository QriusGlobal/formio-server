/**
 * Custom Playwright Fixtures
 *
 * Provides test-specific setup and teardown
 */

import { test as base } from '@playwright/test';

import { FileUploadPage } from '../pages/FileUploadPage';
import { TusUploadPage } from '../pages/TusUploadPage';
import { UppyUploadPage } from '../pages/UppyUploadPage';
import { GCSApiHelper, FormioApiHelper } from '../utils/api-helpers';
import { FormioEventMonitor } from '../utils/formio-helpers';

/**
 * Extended test fixtures
 */
type CustomFixtures = {
  fileUploadPage: FileUploadPage;
  tusUploadPage: TusUploadPage;
  uppyUploadPage: UppyUploadPage;
  gcsApi: GCSApiHelper;
  formioApi: FormioApiHelper;
  eventMonitor: FormioEventMonitor;
};

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  // File Upload Page fixture
  fileUploadPage: async ({ page }, use) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
    await uploadPage.waitForReady();
    await use(uploadPage);
  },

  // TUS Upload Page fixture
  tusUploadPage: async ({ page }, use) => {
    const tusPage = new TusUploadPage(page);
    await tusPage.goto();
    await tusPage.waitForReady();
    await use(tusPage);
  },

  // Uppy Upload Page fixture
  uppyUploadPage: async ({ page }, use) => {
    const uppyPage = new UppyUploadPage(page);
    await uppyPage.goto();
    await uppyPage.waitForReady();
    await use(uppyPage);
  },

  // GCS API Helper fixture
  gcsApi: async ({ request }, use) => {
    const gcsHelper = new GCSApiHelper(
      process.env.GCS_BASE_URL || 'http://localhost:4443',
      process.env.GCS_BUCKET || 'formio-uploads'
    );

    await use(gcsHelper);

    // Cleanup after test
    await gcsHelper.cleanupTestFiles(request, 'test-');
  },

  // Form.io API Helper fixture
  formioApi: async ({ request }, use) => {
    const formioHelper = new FormioApiHelper(
      process.env.FORMIO_BASE_URL || 'http://localhost:3001'
    );

    await use(formioHelper);

    // Cleanup after test (if form path is set)
    const formPath = process.env.TEST_FORM_PATH;
    if (formPath) {
      await formioHelper.cleanupTestSubmissions(request, formPath);
    }
  },

  // Event Monitor fixture
  eventMonitor: async ({ page }, use) => {
    const monitor = new FormioEventMonitor(page);
    await monitor.startMonitoring();
    await use(monitor);
    await monitor.clearEvents();
  },
});

export { expect } from '@playwright/test';