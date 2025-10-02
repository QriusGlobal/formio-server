/**
 * Form.io API Usage Examples
 *
 * Demonstrates common patterns for programmatic Form.io interactions
 */

import { FormioAPI, createFileUploadForm, FormioForm, FormioComponent } from './formio-api';

/**
 * Example 1: Basic Authentication and Form Creation
 */
async function example1_BasicSetup() {
  console.log('\n📘 Example 1: Basic Setup\n');

  // Create API client
  const api = new FormioAPI({
    baseURL: 'http://localhost:3001',
    timeout: 30000
  });

  // Login
  const auth = await api.login('admin@example.com', 'CHANGEME');
  console.log('✅ Authenticated:', auth.token.substring(0, 30) + '...');

  // Create a simple form
  const form: FormioForm = {
    title: 'Contact Form',
    name: 'contactform',
    path: 'contactform',
    type: 'form',
    display: 'form',
    components: [
      {
        type: 'textfield',
        key: 'name',
        label: 'Name',
        input: true,
        validate: { required: true }
      },
      {
        type: 'email',
        key: 'email',
        label: 'Email',
        input: true,
        validate: { required: true }
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit'
      }
    ]
  };

  const created = await api.createForm(form);
  console.log('✅ Form created:', created._id);

  return { api, formId: created._id! };
}

/**
 * Example 2: File Upload Form with TUS
 */
async function example2_FileUploadForm() {
  console.log('\n📘 Example 2: File Upload Form\n');

  const api = new FormioAPI();
  await api.login('admin@example.com', 'CHANGEME');

  // Use helper to create file upload form
  const formDef = createFileUploadForm('http://localhost:1080/files/');
  formDef.name = 'fileupload-' + Date.now();
  formDef.path = formDef.name;

  const form = await api.createForm(formDef);
  console.log('✅ File upload form created:', form._id);
  console.log('   URL:', `http://localhost:3001/${form.path}`);

  return { api, formId: form._id! };
}

/**
 * Example 3: Form Submission
 */
async function example3_FormSubmission() {
  console.log('\n📘 Example 3: Form Submission\n');

  const { api, formId } = await example2_FileUploadForm();

  // Submit data to the form
  const submission = await api.submitForm(formId, {
    title: 'Test Upload',
    attachment: [
      {
        name: 'document.pdf',
        url: 'http://localhost:1080/files/abc123def',
        size: 256789,
        type: 'application/pdf'
      }
    ],
    description: 'This is a test file upload'
  });

  console.log('✅ Submission created:', submission._id);
  console.log('   Data:', JSON.stringify(submission.data, null, 2));

  return { api, formId, submissionId: submission._id! };
}

/**
 * Example 4: Listing and Filtering Submissions
 */
async function example4_ListSubmissions() {
  console.log('\n📘 Example 4: List Submissions\n');

  const { api, formId } = await example3_FormSubmission();

  // Get all submissions
  const allSubmissions = await api.listSubmissions(formId);
  console.log('✅ Total submissions:', allSubmissions.length);

  // Get with pagination
  const paged = await api.listSubmissions(formId, {
    limit: 5,
    skip: 0,
    sort: '-created'
  });
  console.log('✅ First 5 submissions:', paged.length);

  // Filter by data field
  const filtered = await api.listSubmissions(formId, {
    'data.title': 'Test Upload'
  });
  console.log('✅ Filtered submissions:', filtered.length);

  return { api, formId };
}

/**
 * Example 5: Advanced Form with Multiple Components
 */
async function example5_AdvancedForm() {
  console.log('\n📘 Example 5: Advanced Form\n');

  const api = new FormioAPI();
  await api.login('admin@example.com', 'CHANGEME');

  const advancedForm: FormioForm = {
    title: 'Survey Form',
    name: 'surveyform',
    path: 'surveyform',
    type: 'form',
    display: 'wizard',  // Multi-page wizard
    components: [
      // Page 1: Personal Info
      {
        type: 'panel',
        key: 'page1',
        title: 'Personal Information',
        components: [
          {
            type: 'textfield',
            key: 'firstName',
            label: 'First Name',
            input: true,
            validate: { required: true }
          },
          {
            type: 'textfield',
            key: 'lastName',
            label: 'Last Name',
            input: true,
            validate: { required: true }
          },
          {
            type: 'email',
            key: 'email',
            label: 'Email',
            input: true,
            validate: { required: true }
          }
        ]
      },
      // Page 2: Preferences
      {
        type: 'panel',
        key: 'page2',
        title: 'Preferences',
        components: [
          {
            type: 'select',
            key: 'favoriteColor',
            label: 'Favorite Color',
            data: {
              values: [
                { label: 'Red', value: 'red' },
                { label: 'Blue', value: 'blue' },
                { label: 'Green', value: 'green' }
              ]
            },
            input: true
          },
          {
            type: 'checkbox',
            key: 'newsletter',
            label: 'Subscribe to newsletter',
            input: true
          }
        ]
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit Survey'
      }
    ]
  };

  const form = await api.createForm(advancedForm);
  console.log('✅ Advanced form created:', form._id);

  return { api, formId: form._id! };
}

/**
 * Example 6: Cleanup - Delete Forms and Submissions
 */
async function example6_Cleanup() {
  console.log('\n📘 Example 6: Cleanup\n');

  const { api, formId, submissionId } = await example3_FormSubmission();

  // Delete submission
  await api.deleteSubmission(submissionId);
  console.log('✅ Submission deleted:', submissionId);

  // Delete form
  await api.deleteForm(formId);
  console.log('✅ Form deleted:', formId);

  // Logout
  api.logout();
  console.log('✅ Logged out');
}

/**
 * Example 7: Error Handling
 */
async function example7_ErrorHandling() {
  console.log('\n📘 Example 7: Error Handling\n');

  const api = new FormioAPI();

  try {
    // Attempt operation without authentication
    await api.createForm({
      title: 'Test',
      name: 'test',
      path: 'test',
      components: []
    });
  } catch (error) {
    console.log('✅ Caught expected error:', error instanceof Error ? error.message : error);
  }

  try {
    // Attempt login with wrong credentials
    await api.login('wrong@email.com', 'wrongpassword');
  } catch (error) {
    console.log('✅ Caught login error:', error instanceof Error ? error.message : error);
  }

  try {
    await api.login('admin@example.com', 'CHANGEME');

    // Attempt to get non-existent form
    await api.getForm('nonexistent-id');
  } catch (error) {
    console.log('✅ Caught not found error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 8: Health Check and Service Verification
 */
async function example8_HealthCheck() {
  console.log('\n📘 Example 8: Health Check\n');

  const api = new FormioAPI();

  const isHealthy = await api.healthCheck();
  console.log('✅ Form.io health:', isHealthy ? 'Healthy' : 'Unhealthy');

  if (isHealthy) {
    console.log('   Server is ready for requests');
  } else {
    console.log('   ⚠️  Server may be down or unreachable');
  }
}

/**
 * Main runner - executes all examples
 */
async function runAllExamples() {
  console.log('🚀 Form.io API Usage Examples\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    await example8_HealthCheck();
    await example1_BasicSetup();
    await example2_FileUploadForm();
    // await example3_FormSubmission();
    // await example4_ListSubmissions();
    // await example5_AdvancedForm();
    // await example6_Cleanup();
    await example7_ErrorHandling();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All examples completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Example failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export {
  example1_BasicSetup,
  example2_FileUploadForm,
  example3_FormSubmission,
  example4_ListSubmissions,
  example5_AdvancedForm,
  example6_Cleanup,
  example7_ErrorHandling,
  example8_HealthCheck
};
