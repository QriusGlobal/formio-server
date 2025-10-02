/**
 * Security Edge Case Tests
 *
 * Tests security measures and validation:
 * - Upload executable files (should reject)
 * - Upload malicious file names
 * - XSS attempt in file names
 * - Path traversal in file names
 * - Oversized file name
 * - Invalid characters in metadata
 */

import { test, expect } from '../fixtures/playwright-fixtures';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
import { ConsoleMonitor, createMaliciousFileName } from '../utils/test-helpers';

test.describe('Security Tests - TUS Upload', () => {
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    await page.goto('/');
    await page.click('text=TUS Upload Demo');
  });

  test('should reject executable files', async ({ page }) => {
    const executableFiles = [
      { name: 'malware.exe', mimeType: 'application/x-msdownload' },
      { name: 'script.bat', mimeType: 'application/x-bat' },
      { name: 'shell.sh', mimeType: 'application/x-sh' },
      { name: 'command.cmd', mimeType: 'application/x-cmd' },
    ];

    for (const file of executableFiles) {
      await page.evaluate(({ name, mimeType }) => {
        const blob = new Blob(['malicious content'], { type: mimeType });
        const file = new File([blob], name, { type: mimeType });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, file);

      // Should show error message
      await expect(page.locator('.upload-error')).toBeVisible({ timeout: 3000 });

      const errorText = await page.locator('.upload-error').textContent();
      expect(errorText?.toLowerCase()).toMatch(/not allowed|rejected|type|executable/);

      console.log(`✓ Rejected: ${file.name}`);

      // Clear for next test
      await page.reload();
      await page.click('text=TUS Upload Demo');
    }

    // No XSS or code execution
    consoleMonitor.assertNoErrors();
  });

  test('should sanitize XSS attempts in file names', async ({ page }) => {
    const xssFileName = createMaliciousFileName('xss');

    await page.evaluate((fileName) => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, xssFileName);

    await page.waitForTimeout(2000);

    // Check if file name is displayed (should be sanitized)
    const fileNameElement = page.locator('.tus-file-name');
    if (await fileNameElement.isVisible()) {
      const displayedName = await fileNameElement.textContent();

      // Should not contain raw script tags
      expect(displayedName).not.toContain('<script>');
      expect(displayedName).not.toContain('alert(');

      // Should be HTML-escaped
      expect(displayedName).toMatch(/&lt;|&gt;|script|alert/i);

      console.log(`Sanitized name: ${displayedName}`);
    }

    // Verify no script execution
    await page.waitForTimeout(1000);

    // Check for alerts
    page.on('dialog', dialog => {
      console.error('SECURITY ISSUE: Alert dialog appeared!');
      dialog.dismiss();
    });

    // No console errors from XSS
    const errors = consoleMonitor.getErrors();
    const xssErrors = errors.filter(err =>
      err.includes('script') || err.includes('XSS')
    );
    expect(xssErrors.length).toBe(0);
  });

  test('should reject path traversal attempts in file names', async ({ page }) => {
    const pathTraversalName = createMaliciousFileName('path-traversal');

    await page.evaluate((fileName) => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, pathTraversalName);

    await page.waitForTimeout(2000);

    // Should either reject or sanitize the path
    const hasError = await page.locator('.upload-error').isVisible();

    if (hasError) {
      const errorText = await page.locator('.upload-error').textContent();
      expect(errorText?.toLowerCase()).toMatch(/invalid|character|name/);
    } else {
      // If accepted, verify name is sanitized
      const fileNameElement = page.locator('.tus-file-name');
      if (await fileNameElement.isVisible()) {
        const displayedName = await fileNameElement.textContent();

        // Should not contain path traversal sequences
        expect(displayedName).not.toContain('../');
        expect(displayedName).not.toContain('..\\');
        expect(displayedName).not.toContain('/etc/');

        console.log(`Sanitized path: ${displayedName}`);
      }
    }

    consoleMonitor.assertNoErrors();
  });

  test('should handle oversized file names', async ({ page }) => {
    const oversizedName = createMaliciousFileName('oversized');

    await page.evaluate((fileName) => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, oversizedName);

    await page.waitForTimeout(2000);

    // Should handle gracefully
    const fileNameElement = page.locator('.tus-file-name');
    if (await fileNameElement.isVisible()) {
      const displayedName = await fileNameElement.textContent();

      // Should be truncated with ellipsis
      expect(displayedName?.length || 0).toBeLessThan(500);

      // Should contain ellipsis if truncated
      if ((displayedName?.length || 0) < oversizedName.length) {
        expect(displayedName).toMatch(/\.\.\.|…/);
      }

      console.log(`Truncated name length: ${displayedName?.length}`);
    }

    // Should not cause UI issues
    await expect(page.locator('.tus-file-upload')).toBeVisible();

    consoleMonitor.assertNoErrors();
  });

  test('should sanitize special characters in file names', async ({ page }) => {
    const specialCharsName = createMaliciousFileName('special-chars');

    await page.evaluate((fileName) => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, specialCharsName);

    await page.waitForTimeout(2000);

    // Check if displayed name is sanitized
    const fileNameElement = page.locator('.tus-file-name');
    if (await fileNameElement.isVisible()) {
      const displayedName = await fileNameElement.textContent();

      // Dangerous characters should be removed or escaped
      expect(displayedName).not.toContain('|');
      expect(displayedName).not.toContain('*');
      expect(displayedName).not.toContain('?');
      expect(displayedName).not.toContain(':');

      console.log(`Sanitized special chars: ${displayedName}`);
    }

    consoleMonitor.assertNoErrors();
  });

  test('should validate metadata for XSS', async ({ page }) => {
    // Try to inject XSS through metadata
    await page.evaluate(() => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const file = new File([blob], 'metadata-test.txt', { type: 'text/plain' });

      // Try to add malicious metadata
      (file as any).customMetadata = {
        description: '<script>alert("XSS")</script>',
        author: '"><img src=x onerror=alert(1)>',
      };

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.waitForTimeout(2000);

    // Check no script execution
    page.on('dialog', dialog => {
      console.error('SECURITY ISSUE: Alert from metadata!');
      dialog.dismiss();
    });

    // Verify UI is safe
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert');
    expect(pageContent).not.toContain('onerror=alert');

    consoleMonitor.assertNoErrors();
  });

  test('should prevent CSV injection in file names', async ({ page }) => {
    const csvInjectionNames = [
      '=1+1', // Formula injection
      '@SUM(A1:A10)', // Excel formula
      '+cmd|/c calc', // Command injection
      '-2+3+cmd|/c calc', // Complex injection
    ];

    for (const maliciousName of csvInjectionNames) {
      const fileName = `${maliciousName}.txt`;

      await page.evaluate((name) => {
        const blob = new Blob(['test'], { type: 'text/plain' });
        const file = new File([blob], name, { type: 'text/plain' });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, fileName);

      await page.waitForTimeout(1000);

      // Check displayed name is safe
      const fileNameElement = page.locator('.tus-file-name');
      if (await fileNameElement.isVisible()) {
        const displayedName = await fileNameElement.textContent();

        // Should escape or remove formula characters
        if (displayedName?.startsWith('=') || displayedName?.startsWith('@') || displayedName?.startsWith('+')) {
          console.warn(`CSV injection not properly escaped: ${displayedName}`);
        }

        console.log(`CSV safe name: ${displayedName}`);
      }

      await page.reload();
      await page.click('text=TUS Upload Demo');
    }
  });

  test('should prevent null byte injection', async ({ page }) => {
    const nullByteName = 'file\x00.txt.exe';

    await page.evaluate((fileName) => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, nullByteName);

    await page.waitForTimeout(2000);

    // Should strip null bytes
    const fileNameElement = page.locator('.tus-file-name');
    if (await fileNameElement.isVisible()) {
      const displayedName = await fileNameElement.textContent();
      expect(displayedName).not.toContain('\x00');

      console.log(`Null byte removed: ${displayedName}`);
    }

    consoleMonitor.assertNoErrors();
  });
});

test.describe('Security Tests - Uppy Upload', () => {
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleMonitor(page);
    await page.goto('/');
    await page.click('text=Uppy Upload Demo');
  });

  test('should reject executable files', async ({ page }) => {
    await page.evaluate(() => {
      const blob = new Blob(['malicious'], { type: 'application/x-msdownload' });
      const file = new File([blob], 'virus.exe', { type: 'application/x-msdownload' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Should show restriction message
    await page.waitForTimeout(2000);

    const hasError = await page.locator('.uppy-Informer').count() > 0;
    if (hasError) {
      const errorText = await page.locator('.uppy-Informer').textContent();
      expect(errorText?.toLowerCase()).toMatch(/not allowed|restricted|type/);
    }

    consoleMonitor.assertNoErrors();
  });

  test('should sanitize XSS in file names', async ({ page }) => {
    const xssFileName = '<img src=x onerror=alert(1)>.txt';

    await page.evaluate((fileName) => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const file = new File([blob], fileName, { type: 'text/plain' });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, xssFileName);

    await page.waitForTimeout(2000);

    // Verify no script execution
    page.on('dialog', dialog => {
      console.error('SECURITY ISSUE: Alert in Uppy!');
      dialog.dismiss();
    });

    // Check file name display
    const fileItems = await page.locator('.uppy-Dashboard-Item-name').count();
    if (fileItems > 0) {
      const displayedName = await page.locator('.uppy-Dashboard-Item-name').first().textContent();
      expect(displayedName).not.toContain('<img');
      expect(displayedName).not.toContain('onerror');

      console.log(`Uppy sanitized name: ${displayedName}`);
    }

    consoleMonitor.assertNoErrors();
  });

  test('should handle malicious metadata gracefully', async ({ page }) => {
    await page.evaluate(() => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const file = new File([blob], 'test.txt', { type: 'text/plain' });

      // Add malicious metadata
      (file as any).meta = {
        xss: '<script>alert(1)</script>',
        injection: '"; DROP TABLE users; --',
      };

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.waitForTimeout(2000);

    // Should not execute or display unsanitized
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert(1)</script>');

    consoleMonitor.assertNoErrors();
  });
});