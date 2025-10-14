/**
 * Visual Regression Tests - Upload Component
 */

import { test, expect } from '@playwright/test';

import {
  uploadComponentStates,
  themeVariants,
  responsiveLayouts,
  generateAllBaselines,
} from './baseline-generator';

test.describe('Upload Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/upload');
    await page.waitForSelector('[data-testid="upload-component"]');
  });

  test('should match baseline in idle state', async ({ page }) => {
    await uploadComponentStates.idle(page);
    const component = page.locator('[data-testid="upload-component"]');
    await expect(component).toHaveScreenshot('upload-component-idle.png');
  });

  test('should match baseline in uploading state', async ({ page }) => {
    await uploadComponentStates.uploading(page);
    const component = page.locator('[data-testid="upload-component"]');
    await expect(component).toHaveScreenshot('upload-component-uploading.png');
  });

  test('should match baseline in complete state', async ({ page }) => {
    await uploadComponentStates.complete(page);
    const component = page.locator('[data-testid="upload-component"]');
    await expect(component).toHaveScreenshot('upload-component-complete.png');
  });

  test('should match baseline in error state', async ({ page }) => {
    await uploadComponentStates.error(page);
    const component = page.locator('[data-testid="upload-component"]');
    await expect(component).toHaveScreenshot('upload-component-error.png');
  });

  test('should match baseline with multiple files', async ({ page }) => {
    await uploadComponentStates.multiple(page);
    const component = page.locator('[data-testid="upload-component"]');
    await expect(component).toHaveScreenshot('upload-component-multiple.png');
  });

  test.describe('Theme Variants', () => {
    for (const [themeName, setupTheme] of Object.entries(themeVariants)) {
      test(`should match baseline in ${themeName} theme`, async ({ page }) => {
        await setupTheme(page);
        await uploadComponentStates.idle(page);
        const component = page.locator('[data-testid="upload-component"]');
        await expect(component).toHaveScreenshot(`upload-component-${themeName}.png`);
      });
    }
  });

  test.describe('Responsive Layouts', () => {
    for (const [layoutName, viewport] of Object.entries(responsiveLayouts)) {
      test(`should match baseline on ${layoutName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await uploadComponentStates.idle(page);
        const component = page.locator('[data-testid="upload-component"]');
        await expect(component).toHaveScreenshot(`upload-component-${layoutName}.png`);
      });
    }
  });

  test.describe('Interaction States', () => {
    test('should match baseline on hover', async ({ page }) => {
      const component = page.locator('[data-testid="upload-component"]');
      await component.hover();
      await expect(component).toHaveScreenshot('upload-component-hover.png');
    });

    test('should match baseline on focus', async ({ page }) => {
      const fileInput = page.locator('input[type="file"]');
      await fileInput.focus();
      const component = page.locator('[data-testid="upload-component"]');
      await expect(component).toHaveScreenshot('upload-component-focus.png');
    });

    test('should match baseline on drag over', async ({ page }) => {
      const component = page.locator('[data-testid="upload-component"]');

      await component.evaluate((el) => {
        const event = new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
        });
        el.dispatchEvent(event);
      });

      await page.waitForTimeout(100);
      await expect(component).toHaveScreenshot('upload-component-dragover.png');
    });
  });

  test.describe('Progress Indicators', () => {
    test('should match baseline at 25% progress', async ({ page }) => {
      await page.evaluate(() => {
        const component = document.querySelector('[data-testid="upload-component"]');
        component?.setAttribute('data-upload-progress', '25');
      });
      const component = page.locator('[data-testid="upload-component"]');
      await expect(component).toHaveScreenshot('upload-component-progress-25.png');
    });

    test('should match baseline at 50% progress', async ({ page }) => {
      await page.evaluate(() => {
        const component = document.querySelector('[data-testid="upload-component"]');
        component?.setAttribute('data-upload-progress', '50');
      });
      const component = page.locator('[data-testid="upload-component"]');
      await expect(component).toHaveScreenshot('upload-component-progress-50.png');
    });

    test('should match baseline at 75% progress', async ({ page }) => {
      await page.evaluate(() => {
        const component = document.querySelector('[data-testid="upload-component"]');
        component?.setAttribute('data-upload-progress', '75');
      });
      const component = page.locator('[data-testid="upload-component"]');
      await expect(component).toHaveScreenshot('upload-component-progress-75.png');
    });
  });
});

test.describe('File Preview Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/file-preview');
    await page.waitForSelector('[data-testid="file-preview"]');
  });

  test('should match baseline for image preview', async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-png-data'),
    });

    const preview = page.locator('[data-testid="file-preview"]');
    await expect(preview).toHaveScreenshot('file-preview-image.png');
  });

  test('should match baseline for document preview', async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-data'),
    });

    const preview = page.locator('[data-testid="file-preview"]');
    await expect(preview).toHaveScreenshot('file-preview-document.png');
  });

  test('should match baseline for video preview', async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 'test.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake-video-data'),
    });

    const preview = page.locator('[data-testid="file-preview"]');
    await expect(preview).toHaveScreenshot('file-preview-video.png');
  });
});

/**
 * Baseline generation test
 * Run with: npm run test:visual:baseline
 */
test.describe('Generate Baselines', () => {
  test.skip(({ }, testInfo) => !process.env.GENERATE_BASELINES);

  test('generate all baseline images', async ({ page }) => {
    await generateAllBaselines(page);
  });
});