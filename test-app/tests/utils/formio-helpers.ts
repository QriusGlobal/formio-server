/**
 * Form.io Event Listener Helpers
 *
 * Utilities for monitoring Form.io component events during testing
 */

import { Page } from '@playwright/test';

export interface FormioEvent {
  type: string;
  timestamp: number;
  data: any;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Form.io Event Monitor
 * Captures and tracks Form.io component events
 */
export class FormioEventMonitor {
  private page: Page;
  private events: FormioEvent[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Start monitoring Form.io events
   */
  async startMonitoring(): Promise<void> {
    await this.page.evaluate(() => {
      // Store events in window for retrieval
      (window as any).__formioEvents = [];

      // Listen for all Form.io events
      const eventTypes = [
        'formio.render',
        'formio.ready',
        'formio.change',
        'formio.submit',
        'formio.error',
        'fileUpload.start',
        'fileUpload.progress',
        'fileUpload.complete',
        'fileUpload.error',
        'componentChange',
        'submitDone',
        'submitError'
      ];

      eventTypes.forEach(eventType => {
        document.addEventListener(eventType, (e: any) => {
          (window as any).__formioEvents.push({
            type: eventType,
            timestamp: Date.now(),
            data: e.detail || e.data || {}
          });
        });
      });
    });
  }

  /**
   * Get all captured events
   */
  async getEvents(): Promise<FormioEvent[]> {
    return await this.page.evaluate(() => {
      return (window as any).__formioEvents || [];
    });
  }

  /**
   * Get events by type
   */
  async getEventsByType(type: string): Promise<FormioEvent[]> {
    const allEvents = await this.getEvents();
    return allEvents.filter(event => event.type === type);
  }

  /**
   * Wait for specific event
   */
  async waitForEvent(
    eventType: string,
    timeoutMs = 30000
  ): Promise<FormioEvent | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const events = await this.getEventsByType(eventType);
      if (events.length > 0) {
        return events[events.length - 1]; // Return latest
      }

      await this.page.waitForTimeout(100);
    }

    return null;
  }

  /**
   * Clear captured events
   */
  async clearEvents(): Promise<void> {
    await this.page.evaluate(() => {
      (window as any).__formioEvents = [];
    });
  }

  /**
   * Monitor upload progress
   */
  async monitorUploadProgress(): Promise<UploadProgress[]> {
    const progressEvents = await this.getEventsByType('fileUpload.progress');

    return progressEvents.map(event => ({
      loaded: event.data.loaded || 0,
      total: event.data.total || 0,
      percentage: event.data.percentage || 0
    }));
  }
}

/**
 * Form.io Component Helpers
 */
export class FormioComponentHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for Form.io to be ready
   */
  async waitForFormReady(timeoutMs = 30000): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        () => {
          return (window as any).Formio !== undefined;
        },
        { timeout: timeoutMs }
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get form component by key
   */
  async getComponentByKey(key: string): Promise<any> {
    return await this.page.evaluate((componentKey) => {
      const formio = (window as any).Formio?.currentForm;
      if (!formio) return null;

      return formio.getComponent(componentKey);
    }, key);
  }

  /**
   * Set component value
   */
  async setComponentValue(key: string, value: any): Promise<void> {
    await this.page.evaluate(
      ({ componentKey, componentValue }) => {
        const formio = (window as any).Formio?.currentForm;
        if (formio) {
          const component = formio.getComponent(componentKey);
          if (component) {
            component.setValue(componentValue);
          }
        }
      },
      { componentKey: key, componentValue: value }
    );
  }

  /**
   * Get component value
   */
  async getComponentValue(key: string): Promise<any> {
    return await this.page.evaluate((componentKey) => {
      const formio = (window as any).Formio?.currentForm;
      if (!formio) return null;

      const component = formio.getComponent(componentKey);
      return component ? component.getValue() : null;
    }, key);
  }

  /**
   * Trigger component validation
   */
  async validateComponent(key: string): Promise<boolean> {
    return await this.page.evaluate((componentKey) => {
      const formio = (window as any).Formio?.currentForm;
      if (!formio) return false;

      const component = formio.getComponent(componentKey);
      if (!component) return false;

      return component.checkValidity();
    }, key);
  }

  /**
   * Get form errors
   */
  async getFormErrors(): Promise<Record<string, string[]>> {
    return await this.page.evaluate(() => {
      const formio = (window as any).Formio?.currentForm;
      if (!formio) return {};

      const errors: Record<string, string[]> = {};

      formio.components.forEach((component: any) => {
        if (component.error) {
          errors[component.key] = [component.error.message];
        }
      });

      return errors;
    });
  }

  /**
   * Submit form programmatically
   */
  async submitForm(): Promise<void> {
    await this.page.evaluate(() => {
      const formio = (window as any).Formio?.currentForm;
      if (formio) {
        formio.submit();
      }
    });
  }

  /**
   * Get form submission data
   */
  async getFormData(): Promise<Record<string, any>> {
    return await this.page.evaluate(() => {
      const formio = (window as any).Formio?.currentForm;
      return formio ? formio.submission.data : {};
    });
  }
}

/**
 * Wait for file upload to complete
 */
export async function waitForUploadComplete(
  page: Page,
  timeoutMs = 60000
): Promise<boolean> {
  const monitor = new FormioEventMonitor(page);
  const event = await monitor.waitForEvent('fileUpload.complete', timeoutMs);
  return event !== null;
}

/**
 * Get upload error if any
 */
export async function getUploadError(page: Page): Promise<string | null> {
  const monitor = new FormioEventMonitor(page);
  const errorEvents = await monitor.getEventsByType('fileUpload.error');

  if (errorEvents.length === 0) return null;

  const lastError = errorEvents[errorEvents.length - 1];
  return lastError.data.message || 'Unknown upload error';
}

/**
 * Simulate drag and drop file upload
 */
export async function dragAndDropFile(
  page: Page,
  selector: string,
  filePath: string
): Promise<void> {
  // Read file as buffer
  const fs = require('fs');
  const buffer = fs.readFileSync(filePath);
  const filename = filePath.split('/').pop();

  // Create DataTransfer with file
  await page.evaluate(
    ({ selectorPath, fileContent, fileName }) => {
      const element = document.querySelector(selectorPath);
      if (!element) throw new Error(`Element not found: ${selectorPath}`);

      // Convert base64 to Uint8Array
      const byteCharacters = atob(fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create file
      const file = new File([byteArray], fileName, { type: 'application/octet-stream' });

      // Create DataTransfer
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Dispatch drop event
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      });

      element.dispatchEvent(dropEvent);
    },
    {
      selectorPath: selector,
      fileContent: buffer.toString('base64'),
      fileName: filename
    }
  );
}