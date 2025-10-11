import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Form.io File Upload Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to submission test page
    await page.goto('http://localhost:64849');
    await page.click('[data-testid="nav-submission-test"]');
    await page.waitForURL('**/submission-test');
  });

  test('TUS single file upload includes URL in submission', async ({ page }) => {
    // Fill required form fields
    await page.fill('[name="data[fullName]"]', 'John Doe');
    await page.fill('[name="data[email]"]', 'john@example.com');

    // Upload resume via TUS (single file)
    const resumePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    const fileInput = page.locator('[data-key="resume"] input[type="file"]');
    await fileInput.setInputFiles(resumePath);

    // Wait for upload completion indicator
    await page.waitForSelector('text=/Upload|✓|complete/i', { timeout: 30000 });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for submission success
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify resume URL appears in submission
    await expect(page.locator('text=/Resume.*TUS Single File/i')).toBeVisible();
    await expect(page.locator('a:has-text("sample-resume.pdf")')).toBeVisible();

    // Verify checkmark for successful integration
    const resumeSection = page.locator('text=/Resume.*TUS Single File/i').locator('..');
    await expect(resumeSection.locator('text=✅')).toBeVisible();
  });

  test('TUS multiple file upload includes all URLs in submission', async ({ page }) => {
    // Fill form fields
    await page.fill('[name="data[fullName]"]', 'Jane Smith');
    await page.fill('[name="data[email]"]', 'jane@example.com');

    // Upload single file for required field
    const resumePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(resumePath);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    // Upload multiple portfolio files
    const portfolioFiles = [
      path.join(__dirname, '../fixtures/project1.pdf'),
      path.join(__dirname, '../fixtures/project2.pdf')
    ];
    const portfolioInput = page.locator('[data-key="portfolio"] input[type="file"]');
    await portfolioInput.setInputFiles(portfolioFiles);

    // Wait for all uploads to complete
    await page.waitForTimeout(2000); // Allow time for multiple uploads
    await page.waitForSelector('text=/complete|✓/i', { timeout: 30000 });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for submission
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify both portfolio files appear
    await expect(page.locator('a:has-text("project1.pdf")')).toBeVisible();
    await expect(page.locator('a:has-text("project2.pdf")')).toBeVisible();

    // Verify multiple files success indicator
    await expect(page.locator('text=/2 file.*uploaded/i')).toBeVisible();
  });

  test('Uppy upload includes URL in submission', async ({ page }) => {
    // Fill form fields
    await page.fill('[name="data[fullName]"]', 'Bob Johnson');
    await page.fill('[name="data[email]"]', 'bob@example.com');

    // Upload resume (required)
    const resumePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(resumePath);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    // Upload profile photo via Uppy
    const photoPath = path.join(__dirname, '../fixtures/profile.jpg');
    const uppyInput = page.locator('[data-key="profilePhoto"] input[type="file"]');
    await uppyInput.setInputFiles(photoPath);

    // Wait for Uppy upload completion
    await page.waitForTimeout(2000);
    await page.waitForSelector('text=/complete|✓/i', { timeout: 30000 });

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for submission
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify Uppy uploaded file
    await expect(page.locator('text=/Profile Photo.*Uppy/i')).toBeVisible();
    await expect(page.locator('a:has-text("profile.jpg")')).toBeVisible();

    // Verify success checkmark
    const photoSection = page.locator('text=/Profile Photo.*Uppy/i').locator('..');
    await expect(photoSection.locator('text=✅')).toBeVisible();
  });

  test('Form validation prevents submission without required files', async ({ page }) => {
    // Fill text fields but don't upload required resume
    await page.fill('[name="data[fullName]"]', 'No Files User');
    await page.fill('[name="data[email]"]', 'nofiles@example.com');

    // Try to submit without uploading required resume
    await page.click('button[type="submit"]');

    // Should show validation error (Form.io shows error near field)
    await expect(page.locator('text=/required/i')).toBeVisible({ timeout: 5000 });

    // Should NOT show submission success
    await expect(page.locator('text=/Submission Successful/i')).not.toBeVisible();
  });

  test('Submission data structure is correct', async ({ page }) => {
    // Fill and submit complete form
    await page.fill('[name="data[fullName]"]', 'Test User');
    await page.fill('[name="data[email]"]', 'test@example.com');

    // Upload resume
    const resumePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    const fileInput = page.locator('[data-key="resume"] input[type="file"]');
    await fileInput.setInputFiles(resumePath);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    // Submit
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify JSON structure contains required fields
    const submissionJson = page.locator('pre').first();
    const jsonText = await submissionJson.textContent();
    const data = JSON.parse(jsonText || '{}');

    // Verify resume object structure
    expect(data.resume).toBeDefined();
    expect(data.resume.name).toBeDefined();
    expect(data.resume.url).toBeDefined();
    expect(data.resume.size).toBeGreaterThan(0);
    expect(data.resume.type).toBeDefined();
    expect(data.resume.storage).toBe('tus');

    // Verify URL is accessible
    expect(data.resume.url).toMatch(/^http:\/\/localhost:1080\/files\/.+/);
  });

  test('Multiple uploads maintain separate URLs', async ({ page }) => {
    // Fill form
    await page.fill('[name="data[fullName]"]', 'Multi Upload Test');
    await page.fill('[name="data[email]"]', 'multi@example.com');

    // Upload different files to different fields
    const resumePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    const resumeInput = page.locator('[data-key="resume"] input[type="file"]');
    await resumeInput.setInputFiles(resumePath);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    const photoPath = path.join(__dirname, '../fixtures/profile.jpg');
    const photoInput = page.locator('[data-key="profilePhoto"] input[type="file"]');
    await photoInput.setInputFiles(photoPath);
    await page.waitForTimeout(2000);

    // Submit
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Get submission data
    const jsonText = await page.locator('pre').first().textContent();
    const data = JSON.parse(jsonText || '{}');

    // Verify URLs are different
    expect(data.resume.url).toBeDefined();
    expect(data.profilePhoto.url).toBeDefined();
    expect(data.resume.url).not.toBe(data.profilePhoto.url);

    // Verify different file types
    expect(data.resume.type).toContain('pdf');
    expect(data.profilePhoto.type).toContain('image');
  });
});

test.describe('Form.io Integration Success Criteria', () => {
  test('displays integration criteria checklist', async ({ page }) => {
    await page.goto('http://localhost:64849');
    await page.click('[data-testid="nav-submission-test"]');

    // Fill and submit form
    await page.fill('[name="data[fullName]"]', 'Criteria Test');
    await page.fill('[name="data[email]"]', 'criteria@test.com');

    const resumePath = path.join(__dirname, '../fixtures/sample-resume.pdf');
    const fileInput = page.locator('[data-key="resume"] input[type="file"]');
    await fileInput.setInputFiles(resumePath);
    await page.waitForSelector('text=/✓|complete/i', { timeout: 30000 });

    await page.click('button[type="submit"]');
    await expect(page.locator('text=/Submission Successful/i')).toBeVisible({ timeout: 10000 });

    // Verify integration criteria section exists
    await expect(page.locator('text=/Integration Success Criteria/i')).toBeVisible();

    // Verify criteria checkboxes
    await expect(page.locator('text=/TUS Single Upload.*PASS/i')).toBeVisible();
    await expect(page.locator('text=/submission.data.resume/i')).toBeVisible();
  });
});
