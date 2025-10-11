/**
 * E2E Tests for Local Form.io Components Integration
 * Tests TusFileUpload and UppyFileUpload components from local @formio/react package
 */

import { test, expect } from '@playwright/test';

test.describe('Local Form.io Components Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Click the "Local Form.io Components" button
    await page.click('text=📦 Local Form.io Components');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the Local Form.io Components page', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Local Form.io Components');

    // Verify tabs are present
    await expect(page.locator('text=🎯 TusFileUpload (Simple)')).toBeVisible();
    await expect(page.locator('text=🚀 UppyFileUpload (Feature-Rich)')).toBeVisible();
  });

  test('should display TusFileUpload component in Tab 1', async ({ page }) => {
    // Click on TusFileUpload tab (should be active by default)
    await page.click('text=🎯 TusFileUpload (Simple)');

    // Verify TusFileUpload component is visible
    await expect(page.locator('text=Drag and drop files here or click to browse')).toBeVisible({ timeout: 10000 });

    // Verify endpoint configuration is displayed
    await expect(page.locator('text=Endpoint: https://tusd.tusdemo.net/files/')).toBeVisible();
  });

  test('should display UppyFileUpload component in Tab 2', async ({ page }) => {
    // Click on UppyFileUpload tab
    await page.click('text=🚀 UppyFileUpload (Feature-Rich)');

    // Wait a moment for component to render
    await page.waitForTimeout(1000);

    // Verify Uppy Dashboard is present
    // Uppy Dashboard has specific class names we can check for
    const uppyDashboard = page.locator('.uppy-Dashboard, [data-uppy-drag-drop-supported]').first();
    await expect(uppyDashboard).toBeVisible({ timeout: 10000 });
  });

  test('should show component comparison information', async ({ page }) => {
    // Scroll to comparison section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify comparison table exists
    await expect(page.locator('text=Component Comparison')).toBeVisible();
    await expect(page.locator('text=Bundle Size')).toBeVisible();
    await expect(page.locator('text=UI Framework')).toBeVisible();
  });

  test('should display code examples', async ({ page }) => {
    // Verify code examples are present
    await expect(page.locator('text=Usage Example')).toBeVisible();
    await expect(page.locator('code')).toBeVisible();
  });
});

test.describe('Form.io Validation Test Page', () => {
  test('should load Form.io validation test page', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Click the "Form.io Validation Test" button
    await page.click('text=🧪 Form.io Validation Test');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Form.io Validation Test');

    // Verify test scenarios are visible
    await expect(page.locator('text=Import @formio/react')).toBeVisible();
    await expect(page.locator('text=Render Form Component')).toBeVisible();
  });

  test('should run validation tests automatically', async ({ page }) => {
    await page.goto('/');
    await page.click('text=🧪 Form.io Validation Test');
    await page.waitForLoadState('networkidle');

    // Wait for tests to run (they run automatically)
    await page.waitForTimeout(2000);

    // Check for test results (at least some tests should pass)
    const passedTests = page.locator('text=✅ Pass');
    await expect(passedTests.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('App Navigation', () => {
  test('should have all navigation buttons visible', async ({ page }) => {
    await page.goto('/');

    // Verify all main buttons are present
    await expect(page.locator('text=🎯 File Upload Demo')).toBeVisible();
    await expect(page.locator('text=📊 TUS vs Uppy Comparison')).toBeVisible();
    await expect(page.locator('text=📋 Form.io + TUS Integration')).toBeVisible();
    await expect(page.locator('text=🧪 Form.io Validation Test')).toBeVisible();
    await expect(page.locator('text=📦 Local Form.io Components')).toBeVisible();
  });

  test('should navigate between different views', async ({ page }) => {
    await page.goto('/');

    // Test navigation to each view
    await page.click('text=🎯 File Upload Demo');
    await expect(page.locator('h1')).toContainText('File Upload', { timeout: 5000 });

    await page.click('text=Back');
    await page.click('text=📦 Local Form.io Components');
    await expect(page.locator('h1')).toContainText('Local Form.io Components', { timeout: 5000 });
  });
});
