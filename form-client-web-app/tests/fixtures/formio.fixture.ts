/**
 * Form.io Test Fixture
 *
 * Provides reusable Form.io setup for E2E tests
 * Refactored to avoid browser-only imports at Node.js level
 */

import { test as base, expect, type Page } from '@playwright/test';

import { test as uploadTest, UploadFixture } from './upload.fixture';

export interface FormioFixture {
  formioAuth: FormioAuth;
  formioAPI: FormioAPI;
  configureFormio: (baseUrl: string) => Promise<void>;
}

export interface FormioAuth {
  login(email: string, password: string): Promise<string>;
  logout(): Promise<void>;
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
}

export interface FormioAPI {
  createForm(form: any): Promise<any>;
  submitForm(formId: string, data: any): Promise<any>;
  getSubmission(submissionId: string): Promise<any>;
  deleteSubmission(submissionId: string): Promise<void>;
  uploadFile(file: Buffer, metadata: any): Promise<any>;
}

// Combine formio and upload fixtures
const testWithFormio = base.extend<{ formio: FormioFixture }>({
  formio: async ({ page }, use) => {
    const formioBaseUrl = process.env.FORMIO_URL || 'http://localhost:3001';

    // Store current token in fixture scope
    let currentToken: string | null = null;

    // Configure Form.io in browser context
    const configureFormio = async (baseUrl: string) => {
      await page.evaluate((url) => {
        if (window.Formio) {
          window.Formio.setBaseUrl(url);
          window.Formio.setProjectUrl(url);
        }
      }, baseUrl);
    };

    // Authentication helpers
    const formioAuth: FormioAuth = {
      async login(email: string, password: string): Promise<string> {
        const response = await page.request.post(`${formioBaseUrl}/user/login`, {
          data: { data: { email, password } }
        });

        if (!response.ok()) {
          throw new Error(`Login failed: ${response.status()}`);
        }

        // Extract token from response header (Form.io sends it in x-jwt-token header)
        const token = response.headers()['x-jwt-token'];

        if (!token) {
          throw new Error('No token received from login (expected in x-jwt-token header)');
        }

        // Store token in fixture scope
        currentToken = token;

        // Set token in browser context
        await page.evaluate((token) => {
          if (window.Formio) {
            window.Formio.setToken(token);
          }
          localStorage.setItem('formioToken', token);
          localStorage.setItem('formioUser', JSON.stringify({ token }));
        }, token);

        return token;
      },

      async logout(): Promise<void> {
        currentToken = null;

        await page.evaluate(() => {
          if (window.Formio) {
            window.Formio.clearCache();
            window.Formio.setToken('');
          }
          localStorage.removeItem('formioToken');
          localStorage.removeItem('formioUser');
        });
      },

      async getToken(): Promise<string | null> {
        return currentToken;
      },

      async setToken(token: string): Promise<void> {
        currentToken = token;

        await page.evaluate((token) => {
          if (window.Formio) {
            window.Formio.setToken(token);
          }
          localStorage.setItem('formioToken', token);
        }, token);
      }
    };

    // API helpers
    const formioAPI: FormioAPI = {
      async createForm(form: any): Promise<any> {
        const token = await formioAuth.getToken();
        const response = await page.request.post(`${formioBaseUrl}/form`, {
          headers: {
            'x-jwt-token': token || '',
            'Content-Type': 'application/json'
          },
          data: form
        });

        if (!response.ok()) {
          throw new Error(`Failed to create form: ${response.status()}`);
        }

        return response.json();
      },

      async submitForm(formId: string, data: any): Promise<any> {
        const token = await formioAuth.getToken();
        const response = await page.request.post(`${formioBaseUrl}/form/${formId}/submission`, {
          headers: {
            'x-jwt-token': token || '',
            'Content-Type': 'application/json'
          },
          data: { data }
        });

        if (!response.ok()) {
          const error = await response.text();
          throw new Error(`Failed to submit form: ${response.status()} - ${error}`);
        }

        return response.json();
      },

      async getSubmission(submissionId: string): Promise<any> {
        const token = await formioAuth.getToken();
        const response = await page.request.get(`${formioBaseUrl}/submission/${submissionId}`, {
          headers: {
            'x-jwt-token': token || ''
          }
        });

        if (!response.ok()) {
          throw new Error(`Failed to get submission: ${response.status()}`);
        }

        return response.json();
      },

      async deleteSubmission(submissionId: string): Promise<void> {
        const token = await formioAuth.getToken();
        const response = await page.request.delete(`${formioBaseUrl}/submission/${submissionId}`, {
          headers: {
            'x-jwt-token': token || ''
          }
        });

        if (!response.ok()) {
          throw new Error(`Failed to delete submission: ${response.status()}`);
        }
      },

      async uploadFile(file: Buffer, metadata: any): Promise<any> {
        const token = await formioAuth.getToken();
        const formData = new FormData();
        const blob = new Blob([file], { type: metadata.type || 'application/octet-stream' });

        formData.append('file', blob, metadata.name || 'test-file');
        formData.append('name', metadata.name || 'test-file');
        formData.append('size', String(file.length));

        const response = await page.request.post(`${formioBaseUrl}/file`, {
          headers: {
            'x-jwt-token': token || ''
          },
          multipart: formData
        });

        if (!response.ok()) {
          throw new Error(`Failed to upload file: ${response.status()}`);
        }

        return response.json();
      }
    };

    const fixture: FormioFixture = {
      formioAuth,
      formioAPI,
      configureFormio
    };

    // Initialize Form.io in browser context on first use
    await configureFormio(formioBaseUrl);

    await use(fixture);

    // Cleanup
    await formioAuth.logout();
  }
});

// Now extend with upload fixture
export const test = uploadTest.extend<{ formio: FormioFixture }>({
  formio: async ({ page }, use) => {
    const formioBaseUrl = process.env.FORMIO_URL || 'http://localhost:3001';

    // Store current token in fixture scope
    let currentToken: string | null = null;

    // Configure Form.io in browser context
    const configureFormio = async (baseUrl: string) => {
      await page.evaluate((url) => {
        if (window.Formio) {
          window.Formio.setBaseUrl(url);
          window.Formio.setProjectUrl(url);
        }
      }, baseUrl);
    };

    // Authentication helpers
    const formioAuth: FormioAuth = {
      async login(email: string, password: string): Promise<string> {
        const response = await page.request.post(`${formioBaseUrl}/user/login`, {
          data: { data: { email, password } }
        });

        if (!response.ok()) {
          throw new Error(`Login failed: ${response.status()}`);
        }

        // Extract token from response header (Form.io sends it in x-jwt-token header)
        const token = response.headers()['x-jwt-token'];

        if (!token) {
          throw new Error('No token received from login (expected in x-jwt-token header)');
        }

        // Store token in fixture scope
        currentToken = token;

        // Set token in browser context
        await page.evaluate((token) => {
          if (window.Formio) {
            window.Formio.setToken(token);
          }
          localStorage.setItem('formioToken', token);
          localStorage.setItem('formioUser', JSON.stringify({ token }));
        }, token);

        return token;
      },

      async logout(): Promise<void> {
        currentToken = null;

        await page.evaluate(() => {
          if (window.Formio) {
            window.Formio.clearCache();
            window.Formio.setToken('');
          }
          localStorage.removeItem('formioToken');
          localStorage.removeItem('formioUser');
        });
      },

      async getToken(): Promise<string | null> {
        return currentToken;
      },

      async setToken(token: string): Promise<void> {
        currentToken = token;

        await page.evaluate((token) => {
          if (window.Formio) {
            window.Formio.setToken(token);
          }
          localStorage.setItem('formioToken', token);
        }, token);
      }
    };

    // API helpers
    const formioAPI: FormioAPI = {
      async createForm(form: any): Promise<any> {
        const token = await formioAuth.getToken();
        const response = await page.request.post(`${formioBaseUrl}/form`, {
          headers: {
            'x-jwt-token': token || '',
            'Content-Type': 'application/json'
          },
          data: form
        });

        if (!response.ok()) {
          throw new Error(`Failed to create form: ${response.status()}`);
        }

        return response.json();
      },

      async submitForm(formId: string, data: any): Promise<any> {
        const token = await formioAuth.getToken();
        const response = await page.request.post(`${formioBaseUrl}/form/${formId}/submission`, {
          headers: {
            'x-jwt-token': token || '',
            'Content-Type': 'application/json'
          },
          data: { data }
        });

        if (!response.ok()) {
          const error = await response.text();
          throw new Error(`Failed to submit form: ${response.status()} - ${error}`);
        }

        return response.json();
      },

      async getSubmission(submissionId: string): Promise<any> {
        const token = await formioAuth.getToken();
        const response = await page.request.get(`${formioBaseUrl}/submission/${submissionId}`, {
          headers: {
            'x-jwt-token': token || ''
          }
        });

        if (!response.ok()) {
          throw new Error(`Failed to get submission: ${response.status()}`);
        }

        return response.json();
      },

      async deleteSubmission(submissionId: string): Promise<void> {
        const token = await formioAuth.getToken();
        const response = await page.request.delete(`${formioBaseUrl}/submission/${submissionId}`, {
          headers: {
            'x-jwt-token': token || ''
          }
        });

        if (!response.ok()) {
          throw new Error(`Failed to delete submission: ${response.status()}`);
        }
      },

      async uploadFile(file: Buffer, metadata: any): Promise<any> {
        const token = await formioAuth.getToken();
        const formData = new FormData();
        const blob = new Blob([file], { type: metadata.type || 'application/octet-stream' });

        formData.append('file', blob, metadata.name || 'test-file');
        formData.append('name', metadata.name || 'test-file');
        formData.append('size', String(file.length));

        const response = await page.request.post(`${formioBaseUrl}/file`, {
          headers: {
            'x-jwt-token': token || ''
          },
          multipart: formData
        });

        if (!response.ok()) {
          throw new Error(`Failed to upload file: ${response.status()}`);
        }

        return response.json();
      }
    };

    const fixture: FormioFixture = {
      formioAuth,
      formioAPI,
      configureFormio
    };

    // Initialize Form.io in browser context on first use
    await configureFormio(formioBaseUrl);

    await use(fixture);

    // Cleanup
    await formioAuth.logout();
  }
});

export { expect } from '@playwright/test';

// Helper to wait for Form.io to render
export async function waitForFormio(page: Page, selector = '.formio-component') {
  await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });

  // Wait for any loading indicators to disappear
  await page.waitForSelector('.formio-loading', { state: 'hidden' }).catch(() => {});

  // Small delay to ensure rendering is complete
  await page.waitForTimeout(500);
}

// Helper to fill Form.io component
export async function fillFormioComponent(page: Page, key: string, value: any) {
  const selector = `[data-key="${key}"]`;
  await page.waitForSelector(selector);

  const componentType = await page.getAttribute(selector, 'data-type');

  switch (componentType) {
    case 'textfield':
    case 'email':
    case 'password':
    case 'textarea':
      await page.fill(`${selector} input, ${selector} textarea`, String(value));
      break;

    case 'select':
      await page.selectOption(`${selector} select`, value);
      break;

    case 'checkbox':
      if (value) {
        await page.check(`${selector} input[type="checkbox"]`);
      } else {
        await page.uncheck(`${selector} input[type="checkbox"]`);
      }
      break;

    case 'radio':
      await page.click(`${selector} input[value="${value}"]`);
      break;

    case 'file':
    case 'tusupload':
    case 'uppyupload':
      // File uploads handled separately
      break;

    default:
      await page.fill(`${selector} input`, String(value));
  }
}

// Helper to submit Form.io form
export async function submitFormioForm(page: Page) {
  await page.click('button[type="submit"], button[name="data[submit]"]');

  // Wait for submission to complete
  await page.waitForLoadState('networkidle');

  // Check for errors
  const hasError = await page.locator('.formio-errors, .alert-danger').count() > 0;
  if (hasError) {
    const errorText = await page.locator('.formio-errors, .alert-danger').first().textContent();
    throw new Error(`Form submission failed: ${errorText}`);
  }
}