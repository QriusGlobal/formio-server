/**
 * E2E Tests for Form.io Form Submission with Files
 *
 * Tests complete form submission flow with file uploads
 */

import { test, expect } from '../../fixtures/formio.fixture';
import { FormioModulePage } from '../../pages/FormioModulePage';
import { TusUploadComponent } from '../../pages/TusUploadComponent';
import { UppyDashboard } from '../../pages/UppyDashboard';

test.describe('Form.io Form Submission with Files', () => {
  let formPage: FormioModulePage;
  let tusComponent: TusUploadComponent;
  let uppyDashboard: UppyDashboard;

  test.beforeEach(async ({ page, formio }) => {
    // Initialize page objects
    formPage = new FormioModulePage(page);
    tusComponent = new TusUploadComponent(page, 'resume');
    uppyDashboard = new UppyDashboard(page, 'portfolio');

    // Login to Form.io
    await formio.formioAuth.login('test-admin@test.local', 'TestPass123!');

    // Navigate to module demo
    await formPage.goto();
  });

  test('should submit form with both TUS and Uppy uploads', async ({ page, upload, formio }) => {
    // Fill text fields
    await formPage.fillForm({
      name: 'John Developer',
      email: 'john.dev@example.com'
    });

    // Upload resume via TUS
    const resumeFile = await upload.files.fromString(
      'John Developer - Senior Full Stack Engineer',
      'john-developer-resume.pdf',
      'application/pdf'
    );
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Upload portfolio via Uppy
    await uppyDashboard.open();
    const portfolioFiles = await upload.files.generateMultiple(3, 512 * 1024);
    await uppyDashboard.browseFiles(portfolioFiles.map(f => f.path));
    await uppyDashboard.startUpload();
    await uppyDashboard.waitForUploadComplete();
    await uppyDashboard.close();

    // Submit form
    await formPage.submitForm();

    // Get submission data
    const submission = await formPage.getSubmissionData();

    // Verify complete submission structure
    expect(submission).toMatchObject({
      _id: expect.any(String),
      data: {
        name: 'John Developer',
        email: 'john.dev@example.com',
        resume: expect.arrayContaining([
          expect.objectContaining({
            originalName: 'john-developer-resume.pdf',
            type: 'application/pdf',
            storage: 'tus'
          })
        ]),
        portfolio: expect.arrayContaining([
          expect.objectContaining({
            storage: 'tus'
          })
        ])
      },
      created: expect.any(String),
      modified: expect.any(String)
    });

    // Verify all files have URLs
    submission.data.resume.forEach((file: any) => {
      expect(file.url).toBeTruthy();
      expect(file.url).toContain('/file/');
    });

    submission.data.portfolio.forEach((file: any) => {
      expect(file.url).toBeTruthy();
      expect(file.url).toContain('/file/');
    });
  });

  test('should validate required fields before submission', async ({ page, upload }) => {
    // Try to submit without required fields
    await formPage.submitForm();

    // Should show validation errors
    await formPage.verifyValidationError('name', 'required');
    await formPage.verifyValidationError('email', 'required');
    await formPage.verifyValidationError('resume', 'Please upload your resume');

    // Form should not be valid
    const isValid = await formPage.isFormValid();
    expect(isValid).toBe(false);

    // Fill required fields
    await formPage.fillForm({
      name: 'Test User',
      email: 'test@example.com'
    });

    // Upload required resume
    const resumeFile = await upload.files.generate(1024, 'resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Form should now be valid
    const isNowValid = await formPage.isFormValid();
    expect(isNowValid).toBe(true);

    // Submit should succeed
    await formPage.submitForm();
    const submission = await formPage.getSubmissionData();
    expect(submission._id).toBeTruthy();
  });

  test('should handle form submission with large files', async ({ page, upload, formio }) => {
    // Fill form
    await formPage.fillForm({
      name: 'Large File Test',
      email: 'large@test.com'
    });

    // Upload large resume (50MB)
    const largeResume = await upload.files.generate(
      50 * 1024 * 1024,
      'large-resume.pdf',
      'application/pdf'
    );
    await tusComponent.uploadFile(largeResume.path);
    await tusComponent.waitForUploadComplete(120000); // 2 minute timeout

    // Upload large portfolio files
    await uppyDashboard.open();
    const largePortfolio = [
      await upload.files.generate(30 * 1024 * 1024, 'video1.mp4', 'video/mp4'),
      await upload.files.generate(20 * 1024 * 1024, 'video2.mp4', 'video/mp4')
    ];
    await uppyDashboard.browseFiles(largePortfolio.map(f => f.path));
    await uppyDashboard.startUpload();
    await uppyDashboard.waitForUploadComplete(180000); // 3 minute timeout
    await uppyDashboard.close();

    // Submit form
    await formPage.submitForm();

    // Verify submission
    const submission = await formPage.getSubmissionData();
    expect(submission.data.resume[0].size).toBe(50 * 1024 * 1024);
    expect(submission.data.portfolio).toHaveLength(2);
  });

  test('should preserve file uploads when editing submission', async ({ page, upload, formio }) => {
    // Create initial submission
    await formPage.fillForm({
      name: 'Initial Name',
      email: 'initial@example.com'
    });

    const resumeFile = await upload.files.generate(1024, 'initial-resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    await formPage.submitForm();

    const initialSubmission = await formPage.getSubmissionData();
    const submissionId = initialSubmission._id;
    const initialFileUrl = initialSubmission.data.resume[0].url;

    // Reload page to edit submission
    await page.reload();
    await formPage.waitForFormReady();

    // Load existing submission (would normally be done via URL param)
    await page.evaluate((submissionId) => {
      (window as any).formioInstance.submission = { _id: submissionId };
    }, submissionId);

    // Edit only text fields
    await formPage.fillForm({
      name: 'Updated Name',
      email: 'updated@example.com'
    });

    // Submit updated form
    await formPage.submitForm();

    // Get updated submission
    const updatedSubmission = await formio.formioAPI.getSubmission(submissionId);

    // Verify files are preserved
    expect(updatedSubmission.data.resume[0].url).toBe(initialFileUrl);
    expect(updatedSubmission.data.name).toBe('Updated Name');
    expect(updatedSubmission.data.email).toBe('updated@example.com');
  });

  test('should handle form submission errors gracefully', async ({ page, upload }) => {
    // Fill form
    await formPage.fillForm({
      name: 'Error Test',
      email: 'error@test.com'
    });

    // Upload file
    const resumeFile = await upload.files.generate(1024, 'resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Mock submission endpoint to return error
    await page.route('**/submission', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            name: 'ValidationError',
            details: [
              {
                message: 'Email already exists',
                path: ['email']
              }
            ]
          })
        });
      } else {
        await route.continue();
      }
    });

    // Attempt submission
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.alert-danger')).toBeVisible();
    await expect(page.locator('.alert-danger')).toContainText('Email already exists');

    // Form should still have data
    const nameValue = await formPage.nameField.inputValue();
    expect(nameValue).toBe('Error Test');

    // Files should still be present
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
  });

  test('should calculate and display form progress', async ({ page, upload }) => {
    // Initially form should be incomplete
    let isValid = await formPage.isFormValid();
    expect(isValid).toBe(false);

    // Fill name field (33% complete)
    await formPage.nameField.fill('Test User');

    // Fill email field (66% complete)
    await formPage.emailField.fill('test@example.com');

    // Upload resume (100% complete)
    const resumeFile = await upload.files.generate(1024, 'resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Form should now be valid
    isValid = await formPage.isFormValid();
    expect(isValid).toBe(true);

    // Submit button should be enabled
    const isSubmitEnabled = await formPage.submitButton.isEnabled();
    expect(isSubmitEnabled).toBe(true);
  });

  test('should support draft saving with files', async ({ page, upload, formio }) => {
    // Fill partial form
    await formPage.fillForm({
      name: 'Draft User',
      email: 'draft@example.com'
    });

    // Upload resume
    const resumeFile = await upload.files.generate(1024, 'draft-resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Save as draft (not submitting)
    const draftData = await page.evaluate(() => {
      const form = (window as any).formioInstance;
      return form.submission.data;
    });

    // Store draft in localStorage
    await page.evaluate((draft) => {
      localStorage.setItem('formio-draft', JSON.stringify(draft));
    }, draftData);

    // Reload page
    await page.reload();
    await formPage.waitForFormReady();

    // Load draft from localStorage
    await page.evaluate(() => {
      const draft = localStorage.getItem('formio-draft');
      if (draft) {
        const form = (window as any).formioInstance;
        form.submission = { data: JSON.parse(draft) };
      }
    });

    // Verify draft loaded correctly
    const nameValue = await formPage.nameField.inputValue();
    expect(nameValue).toBe('Draft User');

    const emailValue = await formPage.emailField.inputValue();
    expect(emailValue).toBe('draft@example.com');

    // Verify file references are preserved
    const uploadedFiles = await tusComponent.getUploadedFiles();
    expect(uploadedFiles).toHaveLength(1);
  });

  test('should handle conditional file fields', async ({ page, upload }) => {
    // This test assumes conditional logic on portfolio field
    // (e.g., portfolio only shown if certain option selected)

    // Fill required fields
    await formPage.fillForm({
      name: 'Conditional Test',
      email: 'conditional@test.com'
    });

    // Upload required resume
    const resumeFile = await upload.files.generate(1024, 'resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();

    // Check if portfolio is conditionally visible
    const isPortfolioVisible = await uppyDashboard.component.isVisible();

    if (isPortfolioVisible) {
      // Upload portfolio if visible
      await uppyDashboard.open();
      const portfolioFile = await upload.files.generate(1024, 'portfolio.jpg', 'image/jpeg');
      await uppyDashboard.browseFiles(portfolioFile.path);
      await uppyDashboard.startUpload();
      await uppyDashboard.waitForUploadComplete();
      await uppyDashboard.close();
    }

    // Submit form
    await formPage.submitForm();

    // Verify submission
    const submission = await formPage.getSubmissionData();
    expect(submission.data.resume).toBeDefined();

    if (isPortfolioVisible) {
      expect(submission.data.portfolio).toBeDefined();
    } else {
      expect(submission.data.portfolio).toBeUndefined();
    }
  });

  test('should track form analytics with file uploads', async ({ page, upload, formio }) => {
    const startTime = Date.now();

    // Track field interaction times
    const fieldTimes: Record<string, number> = {};

    // Fill name field
    const nameStart = Date.now();
    await formPage.nameField.fill('Analytics User');
    fieldTimes.name = Date.now() - nameStart;

    // Fill email field
    const emailStart = Date.now();
    await formPage.emailField.fill('analytics@test.com');
    fieldTimes.email = Date.now() - emailStart;

    // Upload resume
    const uploadStart = Date.now();
    const resumeFile = await upload.files.generate(2 * 1024 * 1024, 'resume.pdf', 'application/pdf');
    await tusComponent.uploadFile(resumeFile.path);
    await tusComponent.waitForUploadComplete();
    fieldTimes.resume = Date.now() - uploadStart;

    // Submit form
    await formPage.submitForm();

    const totalTime = Date.now() - startTime;

    // Log analytics
    console.log(`Form Completion Analytics:
      Total Time: ${totalTime}ms
      Name Field: ${fieldTimes.name}ms
      Email Field: ${fieldTimes.email}ms
      Resume Upload: ${fieldTimes.resume}ms
      Upload Size: 2MB
      Upload Speed: ${(2 * 1024 * 1024 / (fieldTimes.resume / 1000) / (1024 * 1024)).toFixed(2)}MB/s
    `);

    // Verify reasonable completion time
    expect(totalTime).toBeLessThan(60000); // Under 1 minute
  });
});