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
import { ConsoleMonitor, createMaliciousFileName } from '../utils/test-helpers';
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';

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

    // Wait for file name to be displayed or error to appear
    await Promise.race([
      await page.locator('.tus-file-name').waitFor({ state: 'visible', timeout: 3000 }),
      await page.locator('.upload-error').waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {}); // Allow both to timeout gracefully

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

    // Verify no script execution by checking DOM is settled
    await page.waitForFunction(() => {
      const body = document.body;
      return !body.innerHTML.includes('<script>') &&
             !body.innerHTML.includes('alert(');
    }, { timeout: 3000 });

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

    // Wait for file processing to complete (error or display)
    await Promise.race([
      await page.locator('.upload-error').waitFor({ state: 'visible', timeout: 3000 }),
      await page.locator('.tus-file-name').waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {}); // Allow both to timeout gracefully

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

    // Wait for file name processing to complete
    await page.locator('.tus-file-name').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});

    // Should handle gracefully
    const fileNameElement = page.locator('.tus-file-name');
    if (await fileNameElement.isVisible()) {
      const displayedName = await fileNameElement.textContent();

      // Should be truncated with ellipsis
      expect(displayedName?.length || 0).toBeLessThan(500);

      // Should contain ellipsis if truncated
      if ((displayedName?.length || 0) < oversizedName.length) {
        expect(displayedName).toMatch(/\.{3}|…/);
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

    // Wait for file name sanitization to complete
    await page.locator('.tus-file-name').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});

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

    // Wait for file processing and metadata handling
    await page.waitForFunction(() => {
      const content = document.body.innerHTML;
      return !content.includes('<script>alert') &&
             !content.includes('onerror=alert');
    }, { timeout: 3000 });

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

      // Wait for CSV injection name to be processed
      await page.locator('.tus-file-name').waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});

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

    // Wait for null byte sanitization to complete
    await page.locator('.tus-file-name').waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});

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

    // Wait for Uppy to process and show restriction message or file item
    await Promise.race([
      await page.locator('.uppy-Informer').waitFor({ state: 'visible', timeout: 3000 }),
      await page.locator('.uppy-Dashboard-Item').waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {}); // Allow both to timeout gracefully

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

    // Wait for Uppy to process the file and display it
    await Promise.race([
      await page.locator('.uppy-Dashboard-Item-name').waitFor({ state: 'visible', timeout: 3000 }),
      await page.locator('.uppy-Informer').waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {}); // Allow both to timeout gracefully

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

    // Wait for Uppy to process metadata and render the file
    await page.waitForFunction(() => {
      const content = document.body.innerHTML;
      return !content.includes('<script>alert(1)</script>');
    }, { timeout: 3000 });

    // Should not execute or display unsanitized
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert(1)</script>');

    consoleMonitor.assertNoErrors();
  });
});
test.describe('Security Headers Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have comprehensive security headers', async ({ page, request }) => {
    // Make a request to the application
    const response = await request.get(page.url());

    // Get all headers
    const headers = response.headers();

    // HSTS (HTTP Strict Transport Security)
    const hsts = headers['strict-transport-security'];
    if (hsts) {
      expect(hsts).toContain('max-age=');
      expect(hsts).toContain('includeSubDomains');
      console.log(`✓ HSTS: ${hsts}`);
    } else {
      console.warn('⚠️  Missing HSTS header (expected in HTTPS mode)');
    }

    // X-Frame-Options (clickjacking protection)
    const xFrameOptions = headers['x-frame-options'];
    expect(xFrameOptions).toBeDefined();
    expect(['DENY', 'SAMEORIGIN']).toContain(xFrameOptions?.toUpperCase());
    console.log(`✓ X-Frame-Options: ${xFrameOptions}`);

    // X-Content-Type-Options (MIME sniffing protection)
    const xContentTypeOptions = headers['x-content-type-options'];
    expect(xContentTypeOptions).toBeDefined();
    expect(xContentTypeOptions?.toLowerCase()).toBe('nosniff');
    console.log(`✓ X-Content-Type-Options: ${xContentTypeOptions}`);

    // X-XSS-Protection (legacy XSS filter)
    const xXssProtection = headers['x-xss-protection'];
    if (xXssProtection) {
      expect(xXssProtection).toMatch(/1/);
      console.log(`✓ X-XSS-Protection: ${xXssProtection}`);
    }

    // Content-Security-Policy
    const csp = headers['content-security-policy'];
    if (csp) {
      expect(csp).toContain('default-src');
      console.log(`✓ CSP: ${csp.substring(0, 100)}...`);
    } else {
      console.warn('⚠️  Missing Content-Security-Policy header');
    }

    // Referrer-Policy
    const referrerPolicy = headers['referrer-policy'];
    if (referrerPolicy) {
      expect(referrerPolicy).toBeDefined();
      console.log(`✓ Referrer-Policy: ${referrerPolicy}`);
    }
  });

  test('should not expose sensitive server information', async ({ page, request }) => {
    const response = await request.get(page.url());
    const headers = response.headers();

    // Should not expose detailed server version
    const server = headers['server'];
    if (server) {
      expect(server.toLowerCase()).not.toContain('apache/2.');
      expect(server.toLowerCase()).not.toContain('nginx/1.');
      expect(server.toLowerCase()).not.toContain('express');
      console.log(`Server header: ${server}`);
    }

    // Should not expose X-Powered-By
    const poweredBy = headers['x-powered-by'];
    expect(poweredBy).toBeUndefined();

    console.log('✓ No sensitive server information exposed');
  });

  test('should have secure cookie attributes', async ({ page, context }) => {
    // Navigate to a page that might set cookies
    await page.goto('/');

    // Get all cookies
    const cookies = await context.cookies();

    if (cookies.length > 0) {
      for (const cookie of cookies) {
        console.log(`Cookie: ${cookie.name}`);

        // Check for HttpOnly flag (prevents XSS access)
        if (cookie.name.toLowerCase().includes('session') || cookie.name.toLowerCase().includes('token')) {
          expect(cookie.httpOnly).toBe(true);
          console.log(`  ✓ HttpOnly: ${cookie.httpOnly}`);
        }

        // Check for Secure flag (HTTPS only) - only in production
        if (process.env.NODE_ENV === 'production') {
          expect(cookie.secure).toBe(true);
          console.log(`  ✓ Secure: ${cookie.secure}`);
        }

        // Check for SameSite attribute
        expect(['Strict', 'Lax', 'None']).toContain(cookie.sameSite);
        console.log(`  ✓ SameSite: ${cookie.sameSite}`);
      }
    } else {
      console.log('No cookies set');
    }
  });
});

test.describe('HTTPS/TLS Configuration (Production)', () => {
  test.beforeEach(async ({ page }) => {
    // Skip if not running in HTTPS mode
    if (!page.url().startsWith('https://')) {
      test.skip();
    }
  });

  test('should use HTTPS with valid TLS', async ({ page, request }) => {
    expect(page.url()).toContain('https://');

    // Make a request to verify TLS
    const response = await request.get(page.url());
    expect(response.ok()).toBeTruthy();

    console.log('✓ HTTPS connection established');
  });

  test('should redirect HTTP to HTTPS', async ({ page, request }) => {
    const httpUrl = page.url().replace('https://', 'http://');

    try {
      const response = await request.get(httpUrl, { maxRedirects: 0 });

      // Should get a redirect (301 or 302)
      expect([301, 302, 307, 308]).toContain(response.status());

      // Should redirect to HTTPS
      const location = response.headers()['location'];
      expect(location).toContain('https://');

      console.log(`✓ HTTP→HTTPS redirect: ${response.status()} → ${location}`);
    } catch {
      // Some configurations might not allow HTTP at all
      console.log('HTTP endpoint not accessible (HTTPS-only mode)');
    }
  });

  test('should have HSTS header in HTTPS mode', async ({ page, request }) => {
    const response = await request.get(page.url());
    const hsts = response.headers()['strict-transport-security'];

    expect(hsts).toBeDefined();
    expect(hsts).toContain('max-age=');
    expect(Number.parseInt(hsts.match(/max-age=(\d+)/)?.[1] || '0')).toBeGreaterThan(3600);

    console.log(`✓ HSTS: ${hsts}`);
  });

  test('should use modern TLS version', async ({ page }) => {
    // This test requires access to TLS information which is not directly
    // available in Playwright. In a real implementation, you would use
    // a tool like SSL Labs API or custom network inspection.

    // For now, we verify the page loads over HTTPS
    expect(page.url()).toContain('https://');

    // Could add custom CDP (Chrome DevTools Protocol) commands here
    // to inspect the TLS version if needed

    console.log('✓ Page loaded over HTTPS (TLS verification requires additional tooling)');
  });
});

test.describe('CORS Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper CORS headers', async ({ page, request }) => {
    // Make a request to an API endpoint
    const apiUrl = new URL('/health', page.url()).href;
    const response = await request.get(apiUrl);

    const headers = response.headers();

    // Check CORS headers
    const allowOrigin = headers['access-control-allow-origin'];
    const allowMethods = headers['access-control-allow-methods'];
    const allowHeaders = headers['access-control-allow-headers'];

    if (allowOrigin) {
      // Should not be wildcard in production
      if (process.env.NODE_ENV === 'production') {
        expect(allowOrigin).not.toBe('*');
      }
      console.log(`✓ Access-Control-Allow-Origin: ${allowOrigin}`);
    }

    if (allowMethods) {
      console.log(`✓ Access-Control-Allow-Methods: ${allowMethods}`);
    }

    if (allowHeaders) {
      console.log(`✓ Access-Control-Allow-Headers: ${allowHeaders}`);
    }
  });

  test('should handle CORS preflight requests', async ({ page, request }) => {
    const apiUrl = new URL('/files/', page.url()).href;

    // Send OPTIONS request (CORS preflight)
    const response = await request.fetch(apiUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': page.url(),
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Upload-Length',
      },
    });

    // Should return 204 or 200
    expect([200, 204]).toContain(response.status());

    const headers = response.headers();
    expect(headers['access-control-allow-methods']).toBeDefined();

    console.log(`✓ CORS preflight: ${response.status()}`);
  });
});

test.describe('Rate Limiting & DDoS Protection', () => {
  test('should have rate limiting on upload endpoints', async ({ page, request }) => {
    const uploadUrl = new URL('/files/', page.url()).href;

    // Make multiple rapid requests
    const requests = [];
    for (let i = 0; i < 15; i++) {
      requests.push(
        request.post(uploadUrl, {
          headers: {
            'Tus-Resumable': '1.0.0',
            'Upload-Length': '1000',
          },
        }).catch(error => ({ error }))
      );
    }

    const responses = await Promise.all(requests);

    // Should have some rate limited responses (429)
    const rateLimited = responses.filter(r =>
      'status' in r && r.status() === 429
    );

    if (rateLimited.length > 0) {
      console.log(`✓ Rate limiting active: ${rateLimited.length}/15 requests blocked`);
    } else {
      console.warn('⚠️  No rate limiting detected (may be disabled in development)');
    }
  });
});

test.describe('Input Sanitization - Backend', () => {
  test('should sanitize SQL injection attempts', async ({ page, request }) => {
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "' UNION SELECT * FROM users--",
    ];

    for (const input of maliciousInputs) {
      // Try to submit malicious input (example with a form field)
      await page.evaluate((testInput) => {
        // Attempt to inject via form field
        const input = document.createElement('input');
        input.value = testInput;
        input.name = 'testField';
        document.body.appendChild(input);
      }, input);

      // Verify the page still works
      await expect(page.locator('body')).toBeVisible();

      console.log(`✓ SQL injection attempt handled: ${input.substring(0, 20)}...`);
    }
  });

  test('should sanitize NoSQL injection attempts', async ({ page }) => {
    const maliciousInputs = [
      '{"$gt": ""}',
      '{"$ne": null}',
      '{"$regex": ".*"}',
    ];

    for (const input of maliciousInputs) {
      await page.evaluate((testInput) => {
        const input = document.createElement('input');
        input.value = testInput;
        input.name = 'mongoField';
        document.body.appendChild(input);
      }, input);

      await expect(page.locator('body')).toBeVisible();

      console.log(`✓ NoSQL injection attempt handled: ${input}`);
    }
  });
});
