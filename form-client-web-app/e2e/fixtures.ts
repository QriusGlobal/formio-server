/**
 * Custom Playwright Fixtures for Form.io E2E Tests
 */

import { test as base, expect } from '@playwright/test';

export interface FormioTestFixtures {
  formioUrl: string;
  testUser: {
    email: string;
    password: string;
  };
}

export const test = base.extend<FormioTestFixtures>({
  formioUrl: async ({}, use) => {
    const url = process.env.FORMIO_URL || 'http://localhost:3001';
    await use(url);
  },

  testUser: async ({}, use) => {
    const user = {
      email: process.env.TEST_USER_EMAIL || 'test-admin@test.local',
      password: process.env.TEST_USER_PASSWORD || 'TestPass123!',
    };
    await use(user);
  },
});

export { expect };