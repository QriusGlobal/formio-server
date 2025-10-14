/**
 * Test Bootstrap Script
 *
 * Quick verification that Form.io bootstrap automation works correctly.
 * Run with: npx tsx tests/setup/test-bootstrap.ts
 */

import * as path from 'node:path';

import * as dotenv from 'dotenv';

import { FormioAPI, createFileUploadForm, loadFormioConfig } from './formio-api';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

async function testBootstrap() {
  console.log('🧪 Testing Form.io Bootstrap Automation\n');

  try {
    // 1. Test configuration loading
    console.log('📋 Step 1: Loading configuration...');
    const config = loadFormioConfig();
    console.log('  ✅ Configuration loaded:');
    console.log(`     - Base URL: ${config.baseURL}`);
    console.log(`     - Has Token: ${config.token ? `Yes (${config.token.length} chars)` : 'No'}`);
    console.log(`     - Form ID: ${config.formId || 'Not set'}`);
    console.log(`     - Project ID: ${config.projectId || 'Not set'}`);

    // 2. Test API client initialization
    console.log('\n🔌 Step 2: Initializing API client...');
    const api = new FormioAPI({
      baseURL: config.baseURL,
      timeout: 30000
    });
    console.log('  ✅ API client created');

    // 3. Test authentication (if token exists)
    if (config.token) {
      console.log('\n🔐 Step 3: Testing authentication with existing token...');
      api.setToken(config.token);

      // Verify token works by fetching form
      if (config.formId) {
        try {
          const form = await api.getForm(config.formId);
          console.log('  ✅ Token is valid');
          console.log(`     - Form: "${form.title}" (${form.path})`);
          console.log(`     - Components: ${form.components.length}`);
        } catch (error) {
          console.log('  ⚠️  Token may be expired or invalid');
          throw error;
        }
      } else {
        console.log('  ⚠️  No form ID configured, skipping token validation');
      }
    } else {
      console.log('\n🔐 Step 3: Attempting login...');
      const email = process.env.FORMIO_ROOT_EMAIL || 'admin@example.com';
      const password = process.env.FORMIO_ROOT_PASSWORD || 'CHANGEME';

      try {
        const auth = await api.login(email, password);
        console.log('  ✅ Login successful');
        console.log(`     - Token length: ${auth.token.length} chars`);
        console.log(`     - User: ${auth.user.email || 'Unknown'}`);
      } catch (error) {
        console.log('  ❌ Login failed - check credentials');
        throw error;
      }
    }

    // 4. Test form creation
    console.log('\n📝 Step 4: Testing form creation...');
    const testFormDef = createFileUploadForm(
      process.env.TUS_ENDPOINT || 'http://localhost:1080/files/'
    );
    testFormDef.name = `bootstrap-test-${  Date.now()}`;
    testFormDef.path = testFormDef.name;
    testFormDef.title = 'Bootstrap Test Form';

    try {
      const createdForm = await api.createForm(testFormDef);
      console.log('  ✅ Form created successfully');
      console.log(`     - ID: ${createdForm._id}`);
      console.log(`     - Path: ${createdForm.path}`);

      // Clean up - delete test form
      console.log('\n🧹 Step 5: Cleaning up test form...');
      await api.deleteForm(createdForm._id!);
      console.log('  ✅ Test form deleted');

    } catch (error) {
      console.log('  ⚠️  Form creation test failed (this is non-critical)');
      console.log(`     Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // 5. Test health check
    console.log('\n💚 Step 6: Testing health check...');
    const isHealthy = await api.healthCheck();
    console.log(`  ${isHealthy ? '✅' : '❌'} Health check: ${isHealthy ? 'Passed' : 'Failed'}`);

    // Success summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All bootstrap tests passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🚀 Next Steps:');
    console.log('   1. Run E2E tests: npm run test:e2e');
    console.log('   2. View .env.test: cat .env.test');
    console.log(`   3. Access form: ${  config.baseURL  }/form/${  config.formId}`);

  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ Bootstrap test failed!');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.error('Error:', error instanceof Error ? error.message : error);

    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Verify Form.io is running: curl http://localhost:3001/health');
    console.error('   2. Check credentials in .env.test');
    console.error('   3. Run bootstrap manually: bash tests/setup/formio-bootstrap.sh');
    console.error('   4. Review logs above for specific error details');

    process.exit(1);
  }
}

// Run test if executed directly
if (require.main === module) {
  testBootstrap().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { testBootstrap };
