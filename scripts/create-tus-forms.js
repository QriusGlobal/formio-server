#!/usr/bin/env node

/**
 * Script to create TUS File Upload forms from the default template
 *
 * Creates 3 forms:
 * 1. TUS File Upload - Simple (test/tus-upload-simple)
 * 2. TUS File Upload - Multiple Files (test/tus-upload-multi)
 * 3. GCS File Upload Test (test/gcs-upload)
 *
 * Usage:
 *   node scripts/create-tus-forms.js
 *
 * Environment Variables:
 *   FORMIO_URL - Form.io server URL (default: http://localhost:3001)
 *   TUS_ENDPOINT - TUS upload endpoint (default: http://localhost:1080/files/)
 *   GCS_UPLOAD_ENDPOINT - GCS upload endpoint (default: http://localhost:4443/upload/formio-test/)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Configuration
const FORMIO_URL = process.env.FORMIO_URL || 'http://localhost:3001';
const TUS_ENDPOINT = process.env.TUS_ENDPOINT || 'http://localhost:1080/files/';
const GCS_UPLOAD_ENDPOINT = process.env.GCS_UPLOAD_ENDPOINT || 'http://localhost:4443/upload/formio-test/';

// Template file path
const TEMPLATE_PATH = path.join(__dirname, '../formio/src/templates/default.json');

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

    const req = client.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
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

    req.on('error', (error) => {
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
  const email = process.env.FORMIO_EMAIL || 'admin@formio.local';
  const password = process.env.FORMIO_PASSWORD || 'admin123';

  console.log(`🔐 Authenticating as ${email}...`);

  const response = await makeRequest(`${FORMIO_URL}/user/login`, {
    method: 'POST'
  }, {
    data: {
      email,
      password
    }
  });

  if (response.statusCode !== 200) {
    throw new Error(`Authentication failed: ${response.statusCode} - ${JSON.stringify(response.body)}`);
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
 * Read and parse template file
 */
function readTemplate() {
  console.log('📖 Reading template file...');
  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const template = JSON.parse(templateContent);

  if (!template.forms) {
    throw new Error('Template does not contain "forms" section');
  }

  console.log('✅ Template loaded successfully');
  return template;
}

/**
 * Replace role names with role IDs in access arrays
 */
function mapRolesToIds(accessArray, roleMap) {
  if (!Array.isArray(accessArray)) {
    return accessArray;
  }

  return accessArray.map(access => {
    const mappedAccess = { ...access };

    if (Array.isArray(access.roles)) {
      mappedAccess.roles = access.roles.map(roleName => {
        const roleId = roleMap[roleName.toLowerCase()];
        if (!roleId) {
          console.warn(`⚠️  Warning: Role "${roleName}" not found in role map`);
          return roleName; // Keep original if not found
        }
        return roleId;
      });
    }

    return mappedAccess;
  });
}

/**
 * Replace environment variable placeholders in URL
 */
function replaceEnvVars(url) {
  // Replace ${VAR_NAME:-default_value} pattern
  return url.replace(/\$\{([^:]+):-([^}]+)\}/g, (match, varName, defaultValue) => {
    return process.env[varName] || defaultValue;
  });
}

/**
 * Prepare form definition for API submission
 */
function prepareFormDefinition(formDef, roleMap) {
  const prepared = {
    title: formDef.title,
    name: formDef.name,
    path: formDef.path,
    type: formDef.type,
    display: formDef.display || 'form',
    tags: formDef.tags || [],
    access: mapRolesToIds(formDef.access, roleMap),
    submissionAccess: mapRolesToIds(formDef.submissionAccess, roleMap),
    components: JSON.parse(JSON.stringify(formDef.components)) // Deep clone
  };

  // Replace environment variable placeholders in file upload URLs
  prepared.components = prepared.components.map(component => {
    if (component.type === 'file' && component.url) {
      component.url = replaceEnvVars(component.url);
    }
    return component;
  });

  return prepared;
}

/**
 * Create a form via API
 */
async function createForm(formDef, roleMap, token) {
  const prepared = prepareFormDefinition(formDef, roleMap);

  console.log(`\n🔨 Creating form: ${prepared.title}`);
  console.log(`   Path: ${prepared.path}`);
  console.log(`   Type: ${prepared.type}`);

  const response = await makeRequest(`${FORMIO_URL}/form`, {
    method: 'POST',
    headers: {
      'x-jwt-token': token
    }
  }, prepared);

  if (response.statusCode === 201 || response.statusCode === 200) {
    console.log(`✅ Form created successfully: ${prepared.path}`);
    console.log(`   Form ID: ${response.body._id}`);
    return response.body;
  } else if (response.statusCode === 400 && response.body.message?.includes('duplicate')) {
    console.log(`⚠️  Form already exists: ${prepared.path}`);
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

  const response = await makeRequest(`${FORMIO_URL}/form/${formId}/action`, {
    method: 'POST',
    headers: {
      'x-jwt-token': token
    }
  }, actionDef);

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
async function verifyForm(formPath) {
  const response = await makeRequest(`${FORMIO_URL}/form?path=${formPath}`);

  if (response.statusCode === 200 && response.body.length > 0) {
    console.log(`   ✓ Verified form exists at: ${formPath}`);
    return true;
  }

  console.warn(`   ⚠️  Could not verify form: ${formPath}`);
  return false;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 TUS Form Creator - Starting...\n');
  console.log(`Form.io URL: ${FORMIO_URL}`);
  console.log(`TUS Endpoint: ${TUS_ENDPOINT}`);
  console.log(`GCS Endpoint: ${GCS_UPLOAD_ENDPOINT}\n`);

  try {
    // Step 1: Authenticate
    const token = await authenticate();

    // Step 2: Fetch roles
    const roleMap = await fetchRoles(token);

    // Step 3: Read template
    const template = readTemplate();

    // Step 4: Extract the 3 TUS forms
    const formsToCreate = [
      'tusFileUploadSimple',
      'tusFileUploadMulti',
      'gcsFileUploadTest'
    ];

    const forms = formsToCreate
      .map(key => template.forms[key])
      .filter(Boolean);

    if (forms.length !== 3) {
      throw new Error(`Expected 3 forms, found ${forms.length} in template`);
    }

    console.log(`\n📦 Found ${forms.length} forms to create:`);
    forms.forEach(form => console.log(`   - ${form.title} (${form.path})`));

    // Step 5: Create forms
    console.log('\n' + '='.repeat(60));
    const createdForms = [];

    for (const formDef of forms) {
      const created = await createForm(formDef, roleMap, token);

      if (created) {
        createdForms.push(created);

        // Create default save action
        await createSaveAction(created._id, created.path, token);

        // Verify creation
        await verifyForm(created.path);
      }
    }

    // Step 5: Summary
    console.log('\n' + '='.repeat(60));
    console.log(`\n✨ Summary:`);
    console.log(`   Forms processed: ${forms.length}`);
    console.log(`   Forms created: ${createdForms.length}`);
    console.log(`   Forms skipped (already exist): ${forms.length - createdForms.length}`);

    if (createdForms.length > 0) {
      console.log('\n📋 Created forms:');
      createdForms.forEach(form => {
        console.log(`   ✓ ${form.path} (ID: ${form._id})`);
      });
    }

    // Step 6: Verification command
    console.log('\n🔍 Verify all forms with:');
    console.log(`   curl ${FORMIO_URL}/form | jq -r '.[] | .path'\n`);

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
