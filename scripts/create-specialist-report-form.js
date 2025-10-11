#!/usr/bin/env node

/**
 * Script to create the Specialist Report form in Form.io
 *
 * Creates the 1.d. Specialist Report form with 38 fields including:
 * - 20 image upload fields (TUS/URL storage)
 * - Various field types (datetime, radio, textarea, etc.)
 *
 * Usage:
 *   node scripts/create-specialist-report-form.js
 *
 * Environment Variables:
 *   FORMIO_URL - Form.io server URL (default: http://localhost:3001)
 *   FORMIO_EMAIL - Admin email (default: admin@formio.local)
 *   FORMIO_PASSWORD - Admin password (default: admin123)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Configuration
const FORMIO_URL = process.env.FORMIO_URL || 'http://localhost:3001';
const FORMIO_EMAIL = process.env.FORMIO_EMAIL || 'admin@formio.local';
const FORMIO_PASSWORD = process.env.FORMIO_PASSWORD || 'admin123';

// Form JSON file path
const FORM_JSON_PATH = path.join(
  __dirname,
  '../form-client-web-app/src/forms/specialist-report.json'
);

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: null
        };

        // Parse JSON response if available
        if (data) {
          try {
            response.body = JSON.parse(data);
          } catch (error) {
            // If not JSON, store as text
            response.body = data;
          }
        }

        resolve(response);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Authenticate and get JWT token
 */
async function authenticate() {
  console.log(`🔐 Authenticating as ${FORMIO_EMAIL}...`);

  const response = await makeRequest(
    `${FORMIO_URL}/user/login`,
    {
      method: 'POST'
    },
    {
      data: {
        email: FORMIO_EMAIL,
        password: FORMIO_PASSWORD
      }
    }
  );

  if (response.statusCode !== 200) {
    throw new Error(
      `Authentication failed: ${response.statusCode} - ${JSON.stringify(response.body)}`
    );
  }

  // Extract token from x-jwt-token header
  const token = response.headers['x-jwt-token'];
  if (!token) {
    throw new Error('No JWT token in response headers');
  }

  console.log('✅ Authentication successful');
  return token;
}

/**
 * Fetch all roles from Form.io
 */
async function fetchRoles(token) {
  console.log('📋 Fetching roles from Form.io...');
  const response = await makeRequest(`${FORMIO_URL}/role`, {
    headers: {
      'x-jwt-token': token
    }
  });

  if (response.statusCode !== 200) {
    throw new Error(`Failed to fetch roles: ${response.statusCode}`);
  }

  const roles = response.body;
  const roleMap = {};

  roles.forEach(role => {
    // Use machineName or title.toLowerCase() as the key
    const key = role.machineName || role.title.toLowerCase();
    roleMap[key] = role._id;
  });

  console.log(`✅ Found ${roles.length} roles:`, Object.keys(roleMap));
  return roleMap;
}

/**
 * Read specialist report form JSON
 */
function readFormJson() {
  console.log('📖 Reading specialist report form JSON...');

  if (!fs.existsSync(FORM_JSON_PATH)) {
    throw new Error(`Form JSON not found at: ${FORM_JSON_PATH}`);
  }

  const formContent = fs.readFileSync(FORM_JSON_PATH, 'utf8');
  const formDef = JSON.parse(formContent);

  console.log('✅ Form JSON loaded successfully');
  console.log(`   Title: ${formDef.title}`);
  console.log(`   Name: ${formDef.name}`);
  console.log(`   Path: ${formDef.path}`);
  console.log(`   Components: ${formDef.components.length}`);

  // Count file upload fields
  const fileFields = formDef.components.filter(c => c.type === 'file');
  console.log(`   File upload fields: ${fileFields.length}`);

  return formDef;
}

/**
 * Prepare form definition for API submission
 */
function prepareFormDefinition(formDef, roleMap) {
  // Create base form structure with default access if not specified
  const prepared = {
    title: formDef.title,
    name: formDef.name,
    path: formDef.path,
    type: formDef.type || 'form',
    display: formDef.display || 'form',
    tags: formDef.tags || [],
    components: formDef.components
  };

  // Add default access control if roles available
  if (roleMap.administrator) {
    prepared.access = [
      {
        type: 'read_all',
        roles: [roleMap.administrator]
      }
    ];
    prepared.submissionAccess = [
      {
        type: 'create_all',
        roles: []
      },
      {
        type: 'read_all',
        roles: [roleMap.administrator]
      },
      {
        type: 'update_all',
        roles: [roleMap.administrator]
      },
      {
        type: 'delete_all',
        roles: [roleMap.administrator]
      }
    ];
  }

  return prepared;
}

/**
 * Create form via API
 */
async function createForm(formDef, roleMap, token) {
  const prepared = prepareFormDefinition(formDef, roleMap);

  console.log(`\n🔨 Creating form: ${prepared.title}`);
  console.log(`   Path: ${prepared.path}`);
  console.log(`   Type: ${prepared.type}`);
  console.log(`   Components: ${prepared.components.length}`);

  const response = await makeRequest(
    `${FORMIO_URL}/form`,
    {
      method: 'POST',
      headers: {
        'x-jwt-token': token
      }
    },
    prepared
  );

  if (response.statusCode === 201 || response.statusCode === 200) {
    console.log(`✅ Form created successfully: ${prepared.path}`);
    console.log(`   Form ID: ${response.body._id}`);
    return response.body;
  } else if (response.statusCode === 400 && response.body.message?.includes('duplicate')) {
    console.log(`⚠️  Form already exists: ${prepared.path}`);
    console.log('   Attempting to fetch existing form...');

    // Try to get existing form
    const existingResponse = await makeRequest(`${FORMIO_URL}/form?path=${prepared.path}`, {
      headers: { 'x-jwt-token': token }
    });

    if (existingResponse.statusCode === 200 && existingResponse.body.length > 0) {
      console.log(`   ✓ Found existing form ID: ${existingResponse.body[0]._id}`);
      return existingResponse.body[0];
    }

    return null;
  } else {
    console.error(`❌ Failed to create form: ${response.statusCode}`);
    console.error(JSON.stringify(response.body, null, 2));
    throw new Error(`Failed to create form: ${prepared.path}`);
  }
}

/**
 * Create default Save Submission action for a form
 */
async function createSaveAction(formId, formPath, token) {
  const actionDef = {
    title: 'Save Submission',
    name: 'save',
    handler: ['before'],
    method: ['create', 'update'],
    priority: 10,
    settings: {}
  };

  console.log(`   📌 Creating Save action for form...`);

  const response = await makeRequest(
    `${FORMIO_URL}/form/${formId}/action`,
    {
      method: 'POST',
      headers: {
        'x-jwt-token': token
      }
    },
    actionDef
  );

  if (response.statusCode === 201 || response.statusCode === 200) {
    console.log(`   ✅ Save action created`);
    return response.body;
  } else if (response.statusCode === 400 && response.body.message?.includes('duplicate')) {
    console.log(`   ⚠️  Save action already exists`);
    return null;
  } else {
    console.warn(`   ⚠️  Failed to create save action: ${response.statusCode}`);
    return null;
  }
}

/**
 * Verify form was created
 */
async function verifyForm(formPath, token) {
  console.log(`\n🔍 Verifying form creation...`);

  const response = await makeRequest(`${FORMIO_URL}/form?path=${formPath}`, {
    headers: { 'x-jwt-token': token }
  });

  if (response.statusCode === 200 && response.body.length > 0) {
    const form = response.body[0];
    console.log(`✅ Form verified successfully`);
    console.log(`   Path: ${form.path}`);
    console.log(`   ID: ${form._id}`);
    console.log(`   Components: ${form.components.length}`);

    // Count file upload components
    const fileComponents = form.components.filter(c => c.type === 'file');
    console.log(`   File upload fields: ${fileComponents.length}`);

    // Check storage configuration
    const urlStorage = fileComponents.filter(c => c.storage === 'url');
    console.log(`   URL storage fields: ${urlStorage.length}/${fileComponents.length}`);

    return true;
  }

  console.warn(`⚠️  Could not verify form: ${formPath}`);
  return false;
}

/**
 * Count submissions in MongoDB
 */
async function checkSubmissions(formId, token) {
  console.log(`\n📊 Checking submissions...`);

  const response = await makeRequest(`${FORMIO_URL}/form/${formId}/submission`, {
    headers: { 'x-jwt-token': token }
  });

  if (response.statusCode === 200) {
    const count = Array.isArray(response.body) ? response.body.length : 0;
    console.log(`   Submissions: ${count}`);
    return count;
  }

  console.warn(`   ⚠️  Could not fetch submissions`);
  return 0;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Specialist Report Form Creator - Starting...\n');
  console.log(`Form.io URL: ${FORMIO_URL}`);
  console.log(`Form JSON: ${FORM_JSON_PATH}\n`);

  try {
    // Step 1: Authenticate
    const token = await authenticate();

    // Step 2: Fetch roles
    const roleMap = await fetchRoles(token);

    // Step 3: Read form JSON
    const formDef = readFormJson();

    // Step 4: Create form
    console.log('\n' + '='.repeat(60));
    const createdForm = await createForm(formDef, roleMap, token);

    if (createdForm) {
      // Create default save action
      await createSaveAction(createdForm._id, createdForm.path, token);

      // Verify creation
      await verifyForm(createdForm.path, token);

      // Check existing submissions
      await checkSubmissions(createdForm._id, token);
    }

    // Step 5: Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n✨ Summary:');
    console.log(`   Form: ${formDef.title}`);
    console.log(`   Path: ${formDef.path}`);
    console.log(`   Status: ${createdForm ? 'Created/Verified' : 'Failed'}`);

    if (createdForm) {
      console.log('\n📋 Access form:');
      console.log(`   API: ${FORMIO_URL}/form/${createdForm._id}`);
      console.log(`   Submissions: ${FORMIO_URL}/form/${createdForm._id}/submission`);

      console.log('\n🔍 Verify with curl:');
      console.log(`   curl ${FORMIO_URL}/form?path=${formDef.path} | jq`);
      console.log(`   curl ${FORMIO_URL}/form/${createdForm._id} | jq`);
    }

    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, createForm, fetchRoles, authenticate };
