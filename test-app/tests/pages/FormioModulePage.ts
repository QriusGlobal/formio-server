/**
 * Page Object Model for Form.io Module Demo
 *
 * Encapsulates interactions with the FormioModuleDemo page
 */

import { Page, Locator, expect } from '@playwright/test';

export class FormioModulePage {
  readonly page: Page;
  readonly formContainer: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly resumeUpload: Locator;
  readonly portfolioUpload: Locator;
  readonly submitButton: Locator;
  readonly submissionData: Locator;
  readonly featuresList: Locator;
  readonly codeExample: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formContainer = page.locator('.formio-form, [ref="formRef"]');
    this.nameField = page.locator('[name="data[name]"], input[name="name"]');
    this.emailField = page.locator('[name="data[email]"], input[name="email"]');
    this.resumeUpload = page.locator('[data-key="resume"]');
    this.portfolioUpload = page.locator('[data-key="portfolio"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit Application")');
    this.submissionData = page.locator('pre:has-text("data")');
    this.featuresList = page.locator('.list-unstyled');
    this.codeExample = page.locator('pre.bg-dark');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.click('text=Module Demo');
    await this.waitForFormReady();
  }

  async waitForFormReady() {
    // Wait for Form.io to initialize
    await this.formContainer.waitFor({ state: 'visible', timeout: 10000 });

    // Wait for components to render
    await this.page.waitForSelector('[data-key="name"]', { state: 'visible' });

    // Small delay to ensure all JavaScript has executed
    await this.page.waitForTimeout(500);
  }

  async fillForm(data: {
    name: string;
    email: string;
    resumeFile?: string;
    portfolioFiles?: string[];
  }) {
    // Fill text fields
    await this.nameField.fill(data.name);
    await this.emailField.fill(data.email);

    // Upload resume if provided
    if (data.resumeFile) {
      await this.uploadResume(data.resumeFile);
    }

    // Upload portfolio files if provided
    if (data.portfolioFiles && data.portfolioFiles.length > 0) {
      await this.uploadPortfolio(data.portfolioFiles);
    }
  }

  async uploadResume(filePath: string) {
    const fileInput = this.resumeUpload.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for upload to complete
    await this.waitForUploadComplete('resume');
  }

  async uploadPortfolio(filePaths: string[]) {
    const fileInput = this.portfolioUpload.locator('input[type="file"]');
    await fileInput.setInputFiles(filePaths);

    // Wait for all uploads to complete
    await this.waitForUploadComplete('portfolio', filePaths.length);
  }

  async waitForUploadComplete(componentKey: string, expectedCount: number = 1) {
    // Wait for upload progress indicators
    const component = this.page.locator(`[data-key="${componentKey}"]`);

    // Wait for file preview or success indicator
    await component.locator('.file-preview, .upload-success').first().waitFor({
      state: 'visible',
      timeout: 30000
    });

    // Verify expected number of files
    if (expectedCount > 1) {
      const fileCount = await component.locator('.file-preview, .upload-success').count();
      expect(fileCount).toBe(expectedCount);
    }
  }

  async submitForm() {
    // Scroll to submit button
    await this.submitButton.scrollIntoViewIfNeeded();

    // Click submit
    await this.submitButton.click();

    // Wait for submission to complete
    await this.page.waitForLoadState('networkidle');

    // Check for success or error
    const hasError = await this.page.locator('.alert-danger, .formio-errors').count() > 0;

    if (hasError) {
      const errorText = await this.page.locator('.alert-danger, .formio-errors').first().textContent();
      throw new Error(`Form submission failed: ${errorText}`);
    }

    // Wait for submission data to appear
    await this.submissionData.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getSubmissionData(): Promise<any> {
    const jsonText = await this.submissionData.textContent();
    if (!jsonText) {
      throw new Error('No submission data found');
    }

    try {
      return JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`Failed to parse submission data: ${error}`);
    }
  }

  async verifyFeatures(expectedFeatures: string[]) {
    for (const feature of expectedFeatures) {
      await expect(this.featuresList).toContainText(feature);
    }
  }

  async getUploadedFileInfo(componentKey: string): Promise<{
    fileName: string;
    fileSize: string;
    uploadUrl?: string;
  }[]> {
    const component = this.page.locator(`[data-key="${componentKey}"]`);
    const fileItems = component.locator('.file-item, .file-preview');
    const count = await fileItems.count();

    const files = [];
    for (let i = 0; i < count; i++) {
      const item = fileItems.nth(i);
      const fileName = await item.locator('.file-name').textContent() || '';
      const fileSize = await item.locator('.file-size').textContent() || '';
      const uploadUrl = await item.locator('.file-url').textContent().catch(() => undefined);

      files.push({
        fileName: fileName.trim(),
        fileSize: fileSize.trim(),
        uploadUrl: uploadUrl?.trim()
      });
    }

    return files;
  }

  async getTusUploadProgress(): Promise<number> {
    const progressBar = this.resumeUpload.locator('.progress-bar, [role="progressbar"]');
    const progressText = await progressBar.getAttribute('aria-valuenow');

    if (progressText) {
      return parseInt(progressText);
    }

    // Try to get from text
    const text = await progressBar.textContent();
    const match = text?.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  }

  async getUppyDashboardStatus(): Promise<{
    isOpen: boolean;
    fileCount: number;
    totalSize: string;
  }> {
    const dashboard = this.portfolioUpload.locator('.uppy-Dashboard');
    const isOpen = await dashboard.isVisible();

    if (!isOpen) {
      return { isOpen: false, fileCount: 0, totalSize: '0' };
    }

    const fileCount = await dashboard.locator('.uppy-Dashboard-file').count();
    const totalSize = await dashboard.locator('.uppy-StatusBar-statusSecondary').textContent() || '0';

    return { isOpen, fileCount, totalSize };
  }

  async openUppyDashboard() {
    await this.portfolioUpload.locator('.uppy-Dashboard-browse, .uppy-trigger').click();
    await this.page.waitForSelector('.uppy-Dashboard', { state: 'visible' });
  }

  async selectUppyPlugin(pluginName: string) {
    await this.openUppyDashboard();
    await this.page.click(`[aria-label="${pluginName}"], [data-plugin="${pluginName}"]`);
  }

  async verifyValidationError(fieldKey: string, expectedError: string) {
    const fieldError = this.page.locator(`[data-key="${fieldKey}"] .help-block, [data-key="${fieldKey}"] .invalid-feedback`);
    await expect(fieldError).toContainText(expectedError);
  }

  async clearForm() {
    await this.nameField.clear();
    await this.emailField.clear();

    // Clear file uploads if they have clear buttons
    const clearButtons = this.page.locator('.file-remove, .remove-file-button');
    const count = await clearButtons.count();

    for (let i = count - 1; i >= 0; i--) {
      await clearButtons.nth(i).click();
      await this.page.waitForTimeout(200);
    }
  }

  async isFormValid(): Promise<boolean> {
    const isDisabled = await this.submitButton.isDisabled();
    return !isDisabled;
  }
}