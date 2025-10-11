/**
 * Network Simulation Utilities
 *
 * Provides utilities for simulating various network conditions,
 * including offline mode, slow connections, packet loss, and timeouts.
 */

import { Page, Route } from '@playwright/test';

export interface NetworkCondition {
  downloadThroughput: number; // bytes per second
  uploadThroughput: number;   // bytes per second
  latency: number;            // milliseconds
  packetLoss?: number;        // percentage (0-1)
}

export const NETWORK_PRESETS = {
  OFFLINE: {
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
  SLOW_3G: {
    downloadThroughput: 50 * 1024,   // 50 KB/s
    uploadThroughput: 50 * 1024,     // 50 KB/s
    latency: 2000,                   // 2 seconds
  },
  FAST_3G: {
    downloadThroughput: 100 * 1024,  // 100 KB/s
    uploadThroughput: 100 * 1024,    // 100 KB/s
    latency: 1000,                   // 1 second
  },
  SLOW_4G: {
    downloadThroughput: 500 * 1024,  // 500 KB/s
    uploadThroughput: 500 * 1024,    // 500 KB/s
    latency: 500,                    // 500ms
  },
  WIFI: {
    downloadThroughput: 10 * 1024 * 1024, // 10 MB/s
    uploadThroughput: 10 * 1024 * 1024,   // 10 MB/s
    latency: 20,                          // 20ms
  },
} as const;

/**
 * Apply network condition to page
 */
export async function applyNetworkCondition(
  page: Page,
  condition: NetworkCondition
): Promise<void> {
  const client = await page.context().newCDPSession(page);

  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: condition.downloadThroughput === 0,
    downloadThroughput: condition.downloadThroughput,
    uploadThroughput: condition.uploadThroughput,
    latency: condition.latency,
  });
}

/**
 * Simulate packet loss by randomly failing requests
 */
export async function simulatePacketLoss(
  page: Page,
  lossRate: number = 0.1
): Promise<() => void> {
  const handler = async (route: Route) => {
    if (Math.random() < lossRate) {
      // Simulate packet loss by aborting request
      await route.abort('failed');
    } else {
      await route.continue();
    }
  };

  await page.route('**/*', handler);

  // Return cleanup function
  return async () => {
    await page.unroute('**/*', handler);
  };
}

/**
 * Simulate DNS resolution failure
 */
export async function simulateDNSFailure(
  page: Page,
  pattern: string | RegExp
): Promise<() => void> {
  const handler = async (route: Route) => {
    await route.abort('namenotresolved');
  };

  await page.route(pattern, handler);

  return async () => {
    await page.unroute(pattern, handler);
  };
}

/**
 * Simulate connection timeout
 */
export async function simulateTimeout(
  page: Page,
  pattern: string | RegExp,
  delay: number = 60000
): Promise<() => void> {
  const handler = async (route: Route) => {
    // Delay response until timeout
    await new Promise(resolve => setTimeout(resolve, delay));
    await route.abort('timedout');
  };

  await page.route(pattern, handler);

  return async () => {
    await page.unroute(pattern, handler);
  };
}

/**
 * Simulate server unreachable (connection refused)
 */
export async function simulateServerUnreachable(
  page: Page,
  pattern: string | RegExp
): Promise<() => void> {
  const handler = async (route: Route) => {
    await route.abort('connectionrefused');
  };

  await page.route(pattern, handler);

  return async () => {
    await page.unroute(pattern, handler);
  };
}

/**
 * Simulate intermittent network failures
 */
export async function simulateIntermittentFailures(
  page: Page,
  pattern: string | RegExp,
  failureRate: number = 0.3,
  errorType: 'failed' | 'timedout' | 'connectionrefused' = 'failed'
): Promise<() => void> {
  const handler = async (route: Route) => {
    if (Math.random() < failureRate) {
      await route.abort(errorType);
    } else {
      await route.continue();
    }
  };

  await page.route(pattern, handler);

  return async () => {
    await page.unroute(pattern, handler);
  };
}

/**
 * Monitor network requests
 */
export class NetworkMonitor {
  private requests: Map<string, any> = new Map();
  private responses: Map<string, any> = new Map();

  constructor(private page: Page) {
    this.setupListeners();
  }

  private setupListeners() {
    this.page.on('request', request => {
      this.requests.set(request.url(), {
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: Date.now(),
      });
    });

    this.page.on('response', response => {
      this.responses.set(response.url(), {
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        url: response.url(),
        timestamp: Date.now(),
      });
    });

    this.page.on('requestfailed', request => {
      this.requests.set(request.url(), {
        ...this.requests.get(request.url()),
        failed: true,
        failure: request.failure(),
      });
    });
  }

  getRequests(pattern?: RegExp): any[] {
    const allRequests = Array.from(this.requests.values());
    if (!pattern) return allRequests;
    return allRequests.filter(req => pattern.test(req.url));
  }

  getResponses(pattern?: RegExp): any[] {
    const allResponses = Array.from(this.responses.values());
    if (!pattern) return allResponses;
    return allResponses.filter(res => pattern.test(res.url));
  }

  getFailedRequests(): any[] {
    return Array.from(this.requests.values()).filter(req => req.failed);
  }

  clear() {
    this.requests.clear();
    this.responses.clear();
  }
}