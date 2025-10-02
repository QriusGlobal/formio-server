/**
 * Baseline Image Generator
 * Creates reference screenshots for visual regression testing
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';

export interface VisualTestCase {
  name: string;
  url: string;
  selector: string;
  setup?: (page: Page) => Promise<void>;
  variants?: Array<{
    name: string;
    setup: (page: Page) => Promise<void>;
  }>;
}

export class BaselineGenerator {
  private outputDir: string;

  constructor(outputDir: string = './snapshots/baseline') {
    this.outputDir = outputDir;
  }

  /**
   * Generate baseline screenshots for a component
   */
  async generateBaseline(page: Page, testCase: VisualTestCase): Promise<void> {
    await page.goto(testCase.url);

    // Run custom setup if provided
    if (testCase.setup) {
      await testCase.setup(page);
    }

    // Wait for component to be stable
    const component = page.locator(testCase.selector);
    await component.waitFor({ state: 'visible' });
    await page.waitForLoadState('networkidle');

    // Take baseline screenshot
    await expect(component).toHaveScreenshot(`${testCase.name}-baseline.png`);

    // Generate variant screenshots
    if (testCase.variants) {
      for (const variant of testCase.variants) {
        await variant.setup(page);
        await page.waitForLoadState('networkidle');
        await expect(component).toHaveScreenshot(`${testCase.name}-${variant.name}.png`);
      }
    }
  }

  /**
   * Generate baselines for all component states
   */
  async generateStateBaselines(
    page: Page,
    componentName: string,
    selector: string,
    states: Record<string, (page: Page) => Promise<void>>
  ): Promise<void> {
    for (const [stateName, setupState] of Object.entries(states)) {
      await setupState(page);
      await page.waitForLoadState('networkidle');

      const component = page.locator(selector);
      await expect(component).toHaveScreenshot(`${componentName}-${stateName}.png`);
    }
  }
}

/**
 * Upload Component States
 */
export const uploadComponentStates = {
  idle: async (page: Page) => {
    // Component in initial state
    await page.reload();
    await page.waitForSelector('[data-testid="upload-component"]');
  },

  uploading: async (page: Page) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content'),
    });
    // Wait for upload to start
    await page.waitForSelector('[data-upload-status="uploading"]', { timeout: 1000 });
  },

  complete: async (page: Page) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content'),
    });
    // Wait for upload to complete
    await page.waitForSelector('[data-upload-status="complete"]', { timeout: 5000 });
  },

  error: async (page: Page) => {
    // Trigger error by uploading invalid file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'invalid.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('invalid'),
    });
    await page.waitForSelector('[role="alert"]', { timeout: 2000 });
  },

  multiple: async (page: Page) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      {
        name: 'test1.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('test 1'),
      },
      {
        name: 'test2.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('test 2'),
      },
    ]);
    await page.waitForSelector('[data-upload-status="complete"]', { timeout: 5000 });
  },
};

/**
 * Theme Variants
 */
export const themeVariants = {
  light: async (page: Page) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
  },

  dark: async (page: Page) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
  },

  highContrast: async (page: Page) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    });
  },
};

/**
 * Responsive Layouts
 */
export const responsiveLayouts = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

/**
 * Generate all baselines
 */
export async function generateAllBaselines(page: Page): Promise<void> {
  const generator = new BaselineGenerator();

  // Upload Component baselines
  await test.step('Generate Upload Component baselines', async () => {
    await generator.generateStateBaselines(
      page,
      'upload-component',
      '[data-testid="upload-component"]',
      uploadComponentStates
    );
  });

  // File Preview Component baselines
  await test.step('Generate File Preview baselines', async () => {
    await generator.generateStateBaselines(
      page,
      'file-preview',
      '[data-testid="file-preview"]',
      {
        image: async (page: Page) => {
          const input = page.locator('input[type="file"]');
          await input.setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer: Buffer.from('fake-png-data'),
          });
          await page.waitForSelector('[data-testid="file-preview"]');
        },
        document: async (page: Page) => {
          const input = page.locator('input[type="file"]');
          await input.setInputFiles({
            name: 'test.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('fake-pdf-data'),
          });
          await page.waitForSelector('[data-testid="file-preview"]');
        },
      }
    );
  });

  // Theme variants
  for (const [themeName, setupTheme] of Object.entries(themeVariants)) {
    await test.step(`Generate ${themeName} theme baselines`, async () => {
      await setupTheme(page);
      await generator.generateStateBaselines(
        page,
        `upload-component-${themeName}`,
        '[data-testid="upload-component"]',
        { idle: uploadComponentStates.idle }
      );
    });
  }

  // Responsive layouts
  for (const [layoutName, viewport] of Object.entries(responsiveLayouts)) {
    await test.step(`Generate ${layoutName} layout baselines`, async () => {
      await page.setViewportSize(viewport);
      await generator.generateStateBaselines(
        page,
        `upload-component-${layoutName}`,
        '[data-testid="upload-component"]',
        { idle: uploadComponentStates.idle }
      );
    });
  }
}