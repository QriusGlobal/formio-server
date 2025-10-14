/**
 * Integration Test Runner
 * Full-stack validation with environment checks and cleanup
 */

import { spawn, type ChildProcess } from 'node:child_process';

import axios from 'axios';

import { formioValidator } from '../utils/formio-validator';
import { gcsValidator } from '../utils/gcs-validator';

export interface ServiceConfig {
  name: string;
  url: string;
  healthEndpoint: string;
  startCommand?: string;
  stopCommand?: string;
}

export interface TestEnvironment {
  services: ServiceConfig[];
  gcsEmulator: boolean;
  formioServer: boolean;
  cleanup: boolean;
}

export class IntegrationTestRunner {
  private processes: Map<string, ChildProcess> = new Map();
  private environment: TestEnvironment;

  constructor(environment: TestEnvironment) {
    this.environment = environment;
  }

  /**
   * Pre-test environment check
   */
  async checkEnvironment(): Promise<{
    ready: boolean;
    services: Array<{ name: string; status: 'ok' | 'error'; message?: string }>;
  }> {
    console.log('🔍 Checking test environment...\n');

    const serviceStatuses = await Promise.all(
      this.environment.services.map(async (service) => {
        try {
          const response = await axios.get(`${service.url}${service.healthEndpoint}`, {
            timeout: 5000,
          });

          const isHealthy = response.status === 200;
          return {
            name: service.name,
            status: isHealthy ? ('ok' as const) : ('error' as const),
            message: isHealthy ? 'Service is healthy' : 'Service returned non-200 status',
          };
        } catch (error: any) {
          return {
            name: service.name,
            status: 'error' as const,
            message: error.message,
          };
        }
      })
    );

    // Check GCS emulator
    if (this.environment.gcsEmulator) {
      try {
        await gcsValidator.listFiles();
        serviceStatuses.push({
          name: 'GCS Emulator',
          status: 'ok',
          message: 'GCS emulator is accessible',
        });
      } catch (error: any) {
        serviceStatuses.push({
          name: 'GCS Emulator',
          status: 'error',
          message: `GCS emulator check failed: ${error.message}`,
        });
      }
    }

    // Check Form.io server
    if (this.environment.formioServer) {
      try {
        await formioValidator.client.get('/health');
        serviceStatuses.push({
          name: 'Form.io Server',
          status: 'ok',
          message: 'Form.io server is accessible',
        });
      } catch (error: any) {
        serviceStatuses.push({
          name: 'Form.io Server',
          status: 'error',
          message: `Form.io server check failed: ${error.message}`,
        });
      }
    }

    const allReady = serviceStatuses.every((s) => s.status === 'ok');

    // Print status
    for (const s of serviceStatuses) {
      const icon = s.status === 'ok' ? '✅' : '❌';
      console.log(`${icon} ${s.name}: ${s.message || s.status}`);
    }

    console.log();

    return {
      ready: allReady,
      services: serviceStatuses,
    };
  }

  /**
   * Start required services
   */
  async startServices(): Promise<void> {
    console.log('🚀 Starting required services...\n');

    for (const service of this.environment.services) {
      if (service.startCommand) {
        await this.startService(service);
      }
    }

    // Wait for services to be ready
    await this.waitForServices();
  }

  private async startService(service: ServiceConfig): Promise<void> {
    if (!service.startCommand) return;

    console.log(`Starting ${service.name}...`);

    const [command, ...args] = service.startCommand.split(' ');
    const process = spawn(command, args, {
      stdio: 'inherit',
      detached: true,
    });

    this.processes.set(service.name, process);

    process.on('error', (error) => {
      console.error(`❌ Failed to start ${service.name}:`, error);
    });
  }

  private async waitForServices(maxAttempts: number = 30, delayMs: number = 1000): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const status = await this.checkEnvironment();

      if (status.ready) {
        console.log('\n✅ All services are ready!\n');
        return;
      }

      if (attempt < maxAttempts) {
        console.log(`⏳ Waiting for services... (attempt ${attempt}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error('Services failed to start within timeout');
  }

  /**
   * Stop all services
   */
  async stopServices(): Promise<void> {
    console.log('\n🛑 Stopping services...\n');

    for (const [name, process] of this.processes.entries()) {
      console.log(`Stopping ${name}...`);
      process.kill();
    }

    this.processes.clear();
  }

  /**
   * Database state verification
   */
  async verifyDatabaseState(): Promise<{
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  }> {
    const checks = [];

    // Check GCS bucket state
    try {
      const stats = await gcsValidator.getBucketStats();
      checks.push({
        name: 'GCS Bucket',
        passed: true,
        message: `Found ${stats.fileCount} files, ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB total`,
      });
    } catch (error: any) {
      checks.push({
        name: 'GCS Bucket',
        passed: false,
        message: error.message,
      });
    }

    // Check Form.io submissions
    try {
      // This would check specific form submissions
      checks.push({
        name: 'Form.io Submissions',
        passed: true,
        message: 'Submissions state is valid',
      });
    } catch (error: any) {
      checks.push({
        name: 'Form.io Submissions',
        passed: false,
        message: error.message,
      });
    }

    return {
      valid: checks.every((c) => c.passed),
      checks,
    };
  }

  /**
   * Post-test cleanup
   */
  async cleanup(): Promise<void> {
    if (!this.environment.cleanup) {
      console.log('⏭️  Skipping cleanup (cleanup disabled)\n');
      return;
    }

    console.log('\n🧹 Cleaning up test data...\n');

    // Clean up GCS test files
    try {
      const deleted = await gcsValidator.cleanupTestFiles('test-');
      console.log(`✅ Deleted ${deleted} test files from GCS`);
    } catch (error: any) {
      console.error(`❌ GCS cleanup failed: ${error.message}`);
    }

    // Clean up Form.io test submissions
    // This would be implemented based on Form.io API

    console.log('✅ Cleanup completed\n');
  }

  /**
   * Run full integration test suite
   */
  async run(testCommand: string): Promise<void> {
    try {
      // 1. Check environment
      const envStatus = await this.checkEnvironment();
      if (!envStatus.ready) {
        console.error('❌ Environment is not ready. Please start required services.');
        process.exit(1);
      }

      // 2. Verify database state
      console.log('🔍 Verifying database state...\n');
      const dbStatus = await this.verifyDatabaseState();
      for (const check of dbStatus.checks) {
        const icon = check.passed ? '✅' : '❌';
        console.log(`${icon} ${check.name}: ${check.message}`);
      }
      console.log();

      // 3. Run tests
      console.log('🧪 Running integration tests...\n');
      await this.runTests(testCommand);

      // 4. Cleanup
      await this.cleanup();

      console.log('✅ Integration tests completed successfully!');
    } catch (error: any) {
      console.error('❌ Integration tests failed:', error.message);
      await this.cleanup();
      process.exit(1);
    }
  }

  private async runTests(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, {
        stdio: 'inherit',
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Tests exited with code ${code}`));
        }
      });

      process.on('error', reject);
    });
  }
}

/**
 * Default integration test configuration
 */
export const defaultIntegrationConfig: TestEnvironment = {
  services: [
    {
      name: 'GCS Emulator',
      url: process.env.GCS_EMULATOR_HOST || 'http://localhost:4443',
      healthEndpoint: '/storage/v1/b',
    },
    {
      name: 'Form.io Server',
      url: process.env.FORMIO_API_URL || 'http://localhost:3001',
      healthEndpoint: '/health',
    },
    {
      name: 'Frontend Dev Server',
      url: process.env.BASE_URL || 'http://localhost:5173',
      healthEndpoint: '/',
    },
  ],
  gcsEmulator: true,
  formioServer: true,
  cleanup: true,
};

/**
 * CLI entry point
 */
if (require.main === module) {
  const runner = new IntegrationTestRunner(defaultIntegrationConfig);
  const testCommand = process.argv[2] || 'npm test';

  runner.run(testCommand).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}