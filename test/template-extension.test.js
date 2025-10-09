'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

/**
 * Template Extension Tests - TUS Upload Forms
 *
 * Validates the addition of three new forms to the default template:
 * 1. tusFileUploadSimple - Single file upload with basic validation
 * 2. tusFileUploadMultiple - Multiple file upload with advanced validation
 * 3. tusFileUploadBulk - Bulk upload for mobile with offline support
 *
 * Test Categories:
 * - JSON Syntax Validation
 * - Schema Structure Validation
 * - Form Completeness Validation
 * - Action Validation
 * - Access Control Validation
 */
describe('Default Template Extension - TUS Upload Forms', function() {
  let template;
  let templatePath;

  before(function() {
    templatePath = path.join(__dirname, '../src/templates/default.json');

    // Verify template file exists
    assert.ok(fs.existsSync(templatePath), 'Template file should exist at ' + templatePath);

    // Load template
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    template = JSON.parse(templateContent);
  });

  /**
   * Category 1: JSON Syntax Validation
   * Ensures the template is valid JSON and has the correct top-level structure
   */
  describe('1. JSON Syntax Validation', function() {
    it('should be valid JSON', function() {
      assert.ok(template, 'Template should parse as valid JSON');
      assert.equal(typeof template, 'object', 'Template should be an object');
    });

    it('should have required top-level properties', function() {
      const requiredProps = ['title', 'name', 'version', 'description', 'roles', 'resources', 'forms', 'actions', 'access'];

      requiredProps.forEach(prop => {
        assert.ok(template.hasOwnProperty(prop), `Template should have '${prop}' property`);
      });
    });

    it('should have valid version format', function() {
      assert.ok(template.version, 'Template should have version');
      assert.ok(/^\d+\.\d+\.\d+$/.test(template.version), 'Version should follow semver format (x.y.z)');
    });

    it('should have forms section as object', function() {
      assert.ok(template.forms, 'Template should have forms section');
      assert.equal(typeof template.forms, 'object', 'Forms section should be an object');
      assert.equal(Array.isArray(template.forms), false, 'Forms section should not be an array');
    });

    it('should have actions section as object', function() {
      assert.ok(template.actions, 'Template should have actions section');
      assert.equal(typeof template.actions, 'object', 'Actions section should be an object');
      assert.equal(Array.isArray(template.actions), false, 'Actions section should not be an array');
    });
  });

  /**
   * Category 2: Schema Structure Validation
   * Verifies the new forms exist and have proper structure
   */
  describe('2. Schema Structure Validation', function() {
    const expectedForms = {
      tusFileUploadSimple: {
        title: 'TUS File Upload - Simple',
        path: 'test/tus-upload-simple',
        type: 'form'
      },
      tusFileUploadMultiple: {
        title: 'TUS File Upload - Multiple Files',
        path: 'test/tus-upload-multiple',
        type: 'form'
      },
      tusFileUploadBulk: {
        title: 'TUS File Upload - Bulk Mobile',
        path: 'test/tus-upload-bulk',
        type: 'form'
      }
    };

    Object.keys(expectedForms).forEach(formName => {
      const expectedData = expectedForms[formName];

      describe(`Form: ${formName}`, function() {
        it(`should exist in template.forms`, function() {
          assert.ok(template.forms[formName], `Form '${formName}' should exist in template.forms`);
        });

        it(`should have correct title`, function() {
          const form = template.forms[formName];
          assert.ok(form, `Form '${formName}' should exist`);
          assert.equal(form.title, expectedData.title, `Form '${formName}' should have title '${expectedData.title}'`);
        });

        it(`should have correct path`, function() {
          const form = template.forms[formName];
          assert.ok(form, `Form '${formName}' should exist`);
          assert.equal(form.path, expectedData.path, `Form '${formName}' should have path '${expectedData.path}'`);
        });

        it(`should have correct type`, function() {
          const form = template.forms[formName];
          assert.ok(form, `Form '${formName}' should exist`);
          assert.equal(form.type, expectedData.type, `Form '${formName}' should have type '${expectedData.type}'`);
        });

        it(`should have name property matching key`, function() {
          const form = template.forms[formName];
          assert.ok(form, `Form '${formName}' should exist`);
          assert.equal(form.name, formName, `Form '${formName}' should have name property matching its key`);
        });
      });
    });
  });

  /**
   * Category 3: Form Completeness Validation
   * Ensures each form has all required fields and components
   */
  describe('3. Form Completeness Validation', function() {
    const requiredFormProps = ['title', 'type', 'name', 'path', 'components', 'access', 'submissionAccess'];

    describe('tusFileUploadSimple - Single File Upload', function() {
      let form;

      before(function() {
        form = template.forms.tusFileUploadSimple;
      });

      it('should have all required properties', function() {
        requiredFormProps.forEach(prop => {
          assert.ok(form.hasOwnProperty(prop), `tusFileUploadSimple should have '${prop}' property`);
        });
      });

      it('should have components array', function() {
        assert.ok(Array.isArray(form.components), 'components should be an array');
        assert.ok(form.components.length > 0, 'components array should not be empty');
      });

      it('should have tusupload component', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'file');
        assert.ok(tusComponent, 'Form should have a TUS upload component');
      });

      it('tusupload component should have required properties', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'file');
        assert.ok(tusComponent, 'TUS upload component should exist');

        const requiredComponentProps = ['type', 'key', 'label', 'input'];
        requiredComponentProps.forEach(prop => {
          assert.ok(tusComponent.hasOwnProperty(prop), `TUS component should have '${prop}' property`);
        });
      });

      it('tusupload component should not allow multiple files', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'file');
        assert.ok(tusComponent, 'TUS upload component should exist');
        assert.notEqual(tusComponent.multiple, true, 'Simple upload should not allow multiple files');
      });

      it('should have file size validation', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'file');
        assert.ok(tusComponent, 'TUS upload component should exist');
        assert.ok(tusComponent.fileMaxSize || tusComponent.validate?.fileMaxSize, 'Should have file size limit');
      });

      it('should have file type validation', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'file');
        assert.ok(tusComponent, 'TUS upload component should exist');
        assert.ok(
          tusComponent.filePattern || tusComponent.validate?.filePattern || tusComponent.fileTypes,
          'Should have file type validation'
        );
      });

      it('should have submit button', function() {
        const submitButton = form.components.find(c => c.type === 'button' && c.action === 'submit');
        assert.ok(submitButton, 'Form should have a submit button');
      });
    });

    describe('tusFileUploadMultiple - Multiple Files Upload', function() {
      let form;

      before(function() {
        form = template.forms.tusFileUploadMultiple;
      });

      it('should have all required properties', function() {
        requiredFormProps.forEach(prop => {
          assert.ok(form.hasOwnProperty(prop), `tusFileUploadMultiple should have '${prop}' property`);
        });
      });

      it('should have components array', function() {
        assert.ok(Array.isArray(form.components), 'components should be an array');
        assert.ok(form.components.length > 0, 'components array should not be empty');
      });

      it('should have tusupload component', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'files');
        assert.ok(tusComponent, 'Form should have a TUS upload component');
      });

      it('tusupload component should allow multiple files', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'files');
        assert.ok(tusComponent, 'TUS upload component should exist');
        assert.equal(tusComponent.multiple, true, 'Multiple upload should allow multiple files');
      });

      it('should have file count validation', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'files');
        assert.ok(tusComponent, 'TUS upload component should exist');

        // Check for min/max file count validation
        const hasCountValidation = tusComponent.validate?.maxFiles ||
                                   tusComponent.validate?.minFiles ||
                                   tusComponent.maxFiles ||
                                   tusComponent.minFiles;
        assert.ok(hasCountValidation, 'Should have file count validation');
      });

      it('should have stricter file size validation', function() {
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'files');
        assert.ok(tusComponent, 'TUS upload component should exist');

        const fileMaxSize = tusComponent.fileMaxSize || tusComponent.validate?.fileMaxSize;
        assert.ok(fileMaxSize, 'Should have file size limit');
        assert.ok(fileMaxSize <= 10 * 1024 * 1024, 'File size should be reasonable (<=10MB)');
      });

      it('should have submit button', function() {
        const submitButton = form.components.find(c => c.type === 'button' && c.action === 'submit');
        assert.ok(submitButton, 'Form should have a submit button');
      });
    });

    describe('tusFileUploadBulk - Bulk Mobile Upload', function() {
      let form;

      before(function() {
        form = template.forms.tusFileUploadBulk;
      });

      it('should have all required properties', function() {
        requiredFormProps.forEach(prop => {
          assert.ok(form.hasOwnProperty(prop), `tusFileUploadBulk should have '${prop}' property`);
        });
      });

      it('should have components array', function() {
        assert.ok(Array.isArray(form.components), 'components should be an array');
        assert.ok(form.components.length > 0, 'components array should not be empty');
      });

      it('should have uppyupload component with webcam/audio support', function() {
        const uppyComponent = form.components.find(c => c.type === 'uppyupload' || c.key === 'mediaFiles');
        assert.ok(uppyComponent, 'Form should have an Uppy upload component');
      });

      it('uppyupload component should allow multiple files', function() {
        const uppyComponent = form.components.find(c => c.type === 'uppyupload' || c.key === 'mediaFiles');
        assert.ok(uppyComponent, 'Uppy upload component should exist');
        assert.equal(uppyComponent.multiple, true, 'Bulk upload should allow multiple files');
      });

      it('should have Golden Retriever (offline support) enabled', function() {
        const uppyComponent = form.components.find(c => c.type === 'uppyupload' || c.key === 'mediaFiles');
        assert.ok(uppyComponent, 'Uppy upload component should exist');

        // Check for Golden Retriever plugin configuration
        const hasOfflineSupport = uppyComponent.goldenRetriever === true ||
                                 uppyComponent.plugins?.goldenRetriever === true ||
                                 (uppyComponent.plugins?.includes && uppyComponent.plugins.includes('GoldenRetriever'));
        assert.ok(hasOfflineSupport, 'Should have Golden Retriever offline support enabled');
      });

      it('should have webcam/audio plugins enabled', function() {
        const uppyComponent = form.components.find(c => c.type === 'uppyupload' || c.key === 'mediaFiles');
        assert.ok(uppyComponent, 'Uppy upload component should exist');

        // Check for webcam or audio plugins
        const hasMediaPlugins = uppyComponent.webcam === true ||
                               uppyComponent.audio === true ||
                               uppyComponent.plugins?.webcam === true ||
                               uppyComponent.plugins?.audio === true ||
                               (uppyComponent.plugins?.includes &&
                                (uppyComponent.plugins.includes('Webcam') || uppyComponent.plugins.includes('Audio')));
        assert.ok(hasMediaPlugins, 'Should have webcam or audio plugins enabled for mobile capture');
      });

      it('should have submit button', function() {
        const submitButton = form.components.find(c => c.type === 'button' && c.action === 'submit');
        assert.ok(submitButton, 'Form should have a submit button');
      });
    });
  });

  /**
   * Category 4: Action Validation
   * Verifies that save actions exist for each form
   */
  describe('4. Action Validation', function() {
    const expectedActions = {
      'tusFileUploadSimple:save': {
        form: 'tusFileUploadSimple',
        name: 'save',
        title: 'Save Submission'
      },
      'tusFileUploadMultiple:save': {
        form: 'tusFileUploadMultiple',
        name: 'save',
        title: 'Save Submission'
      },
      'tusFileUploadBulk:save': {
        form: 'tusFileUploadBulk',
        name: 'save',
        title: 'Save Submission'
      }
    };

    Object.keys(expectedActions).forEach(actionKey => {
      const expectedAction = expectedActions[actionKey];

      describe(`Action: ${actionKey}`, function() {
        it('should exist in template.actions', function() {
          assert.ok(template.actions[actionKey], `Action '${actionKey}' should exist in template.actions`);
        });

        it('should have correct form reference', function() {
          const action = template.actions[actionKey];
          assert.ok(action, `Action '${actionKey}' should exist`);
          assert.equal(action.form, expectedAction.form, `Action should reference form '${expectedAction.form}'`);
        });

        it('should have correct action name', function() {
          const action = template.actions[actionKey];
          assert.ok(action, `Action '${actionKey}' should exist`);
          assert.equal(action.name, expectedAction.name, `Action should have name '${expectedAction.name}'`);
        });

        it('should have correct title', function() {
          const action = template.actions[actionKey];
          assert.ok(action, `Action '${actionKey}' should exist`);
          assert.equal(action.title, expectedAction.title, `Action should have title '${expectedAction.title}'`);
        });

        it('should have handler configuration', function() {
          const action = template.actions[actionKey];
          assert.ok(action, `Action '${actionKey}' should exist`);
          assert.ok(action.handler, 'Action should have handler configuration');
          assert.ok(Array.isArray(action.handler), 'Handler should be an array');
        });

        it('should have method configuration', function() {
          const action = template.actions[actionKey];
          assert.ok(action, `Action '${actionKey}' should exist`);
          assert.ok(action.method, 'Action should have method configuration');
          assert.ok(Array.isArray(action.method), 'Method should be an array');
        });

        it('should have priority', function() {
          const action = template.actions[actionKey];
          assert.ok(action, `Action '${actionKey}' should exist`);
          assert.ok(typeof action.priority === 'number', 'Action should have numeric priority');
        });
      });
    });

    it('should have all three save actions', function() {
      const saveActionKeys = Object.keys(template.actions).filter(key =>
        key.startsWith('tusFileUpload') && key.endsWith(':save')
      );

      assert.equal(saveActionKeys.length, 3, 'Should have exactly 3 TUS upload save actions');
    });
  });

  /**
   * Category 5: Access Control Validation
   * Verifies proper roles are assigned to forms
   */
  describe('5. Access Control Validation', function() {
    const expectedRoles = ['administrator', 'authenticated', 'anonymous'];

    before(function() {
      // Verify roles exist in template
      expectedRoles.forEach(role => {
        assert.ok(template.roles[role], `Role '${role}' should exist in template.roles`);
      });
    });

    const testForms = ['tusFileUploadSimple', 'tusFileUploadMultiple', 'tusFileUploadBulk'];

    testForms.forEach(formName => {
      describe(`Access Control: ${formName}`, function() {
        let form;

        before(function() {
          form = template.forms[formName];
          assert.ok(form, `Form '${formName}' should exist`);
        });

        it('should have access array', function() {
          assert.ok(form.access, 'Form should have access property');
          assert.ok(Array.isArray(form.access), 'Access should be an array');
        });

        it('should have submissionAccess array', function() {
          assert.ok(form.submissionAccess, 'Form should have submissionAccess property');
          assert.ok(Array.isArray(form.submissionAccess), 'SubmissionAccess should be an array');
        });

        it('should allow anonymous read access', function() {
          const readAccess = form.access.find(a => a.type === 'read_all');
          assert.ok(readAccess, 'Form should have read_all access');
          assert.ok(Array.isArray(readAccess.roles), 'Read access roles should be an array');
          assert.ok(readAccess.roles.includes('anonymous'), 'Anonymous users should have read access');
        });

        it('should allow authenticated users to create submissions', function() {
          const createAccess = form.submissionAccess.find(a =>
            a.type === 'create_own' || a.type === 'create_all'
          );
          assert.ok(createAccess, 'Form should have create submission access');
          assert.ok(Array.isArray(createAccess.roles), 'Create access roles should be an array');

          const allowsAuthenticated = createAccess.roles.includes('authenticated') ||
                                     createAccess.roles.includes('anonymous');
          assert.ok(allowsAuthenticated, 'Authenticated or anonymous users should be able to create submissions');
        });

        it('should allow users to read their own submissions', function() {
          const readOwnAccess = form.submissionAccess.find(a => a.type === 'read_own');
          assert.ok(readOwnAccess, 'Form should have read_own submission access');
        });

        it('should have proper administrator permissions', function() {
          const adminReadAll = form.submissionAccess.find(a => a.type === 'read_all');
          const adminUpdateAll = form.submissionAccess.find(a => a.type === 'update_all');
          const adminDeleteAll = form.submissionAccess.find(a => a.type === 'delete_all');

          assert.ok(adminReadAll, 'Should have read_all permission');
          assert.ok(adminUpdateAll, 'Should have update_all permission');
          assert.ok(adminDeleteAll, 'Should have delete_all permission');

          assert.ok(adminReadAll.roles.includes('administrator'), 'Administrator should have read_all');
          assert.ok(adminUpdateAll.roles.includes('administrator'), 'Administrator should have update_all');
          assert.ok(adminDeleteAll.roles.includes('administrator'), 'Administrator should have delete_all');
        });
      });
    });
  });

  /**
   * Category 6: Integration Tests
   * Verifies forms work together properly
   */
  describe('6. Integration and Consistency Tests', function() {
    it('should not break existing forms', function() {
      const existingForms = ['userLogin', 'userRegister', 'adminLogin'];

      existingForms.forEach(formName => {
        assert.ok(template.forms[formName], `Existing form '${formName}' should still exist`);
      });
    });

    it('should not break existing resources', function() {
      const existingResources = ['user', 'admin'];

      existingResources.forEach(resourceName => {
        assert.ok(template.resources[resourceName], `Existing resource '${resourceName}' should still exist`);
      });
    });

    it('should have unique form paths', function() {
      const paths = Object.values(template.forms).map(f => f.path);
      const uniquePaths = [...new Set(paths)];

      assert.equal(paths.length, uniquePaths.length, 'All form paths should be unique');
    });

    it('should have unique form names', function() {
      const names = Object.values(template.forms).map(f => f.name);
      const uniqueNames = [...new Set(names)];

      assert.equal(names.length, uniqueNames.length, 'All form names should be unique');
    });

    it('all actions should reference existing forms', function() {
      Object.entries(template.actions).forEach(([actionKey, action]) => {
        if (action.form) {
          const formExists = template.forms[action.form] || template.resources[action.form];
          assert.ok(formExists, `Action '${actionKey}' references form/resource '${action.form}' which should exist`);
        }
      });
    });

    it('should maintain consistent component structure across forms', function() {
      const tusUploadForms = ['tusFileUploadSimple', 'tusFileUploadMultiple', 'tusFileUploadBulk'];

      tusUploadForms.forEach(formName => {
        const form = template.forms[formName];
        assert.ok(form, `Form '${formName}' should exist`);

        // All should have components array
        assert.ok(Array.isArray(form.components), `${formName} should have components array`);

        // All should have a submit button
        const hasSubmit = form.components.some(c => c.type === 'button' && c.action === 'submit');
        assert.ok(hasSubmit, `${formName} should have a submit button`);

        // All should have a file upload component (tusupload or uppyupload)
        const hasUpload = form.components.some(c => c.type === 'tusupload' || c.type === 'uppyupload');
        assert.ok(hasUpload, `${formName} should have an upload component`);
      });
    });

    it('should have consistent naming conventions', function() {
      const tusUploadForms = ['tusFileUploadSimple', 'tusFileUploadMultiple', 'tusFileUploadBulk'];

      tusUploadForms.forEach(formName => {
        const form = template.forms[formName];

        // Form name should match key
        assert.equal(form.name, formName, `Form name should match template key for ${formName}`);

        // Title should start with "TUS File Upload"
        assert.ok(form.title.startsWith('TUS File Upload'), `${formName} title should start with "TUS File Upload"`);

        // Path should start with "test/tus-upload"
        assert.ok(form.path.startsWith('test/tus-upload'), `${formName} path should start with "test/tus-upload"`);
      });
    });
  });

  /**
   * Category 7: Component Configuration Validation
   * Validates specific component configurations
   */
  describe('7. Component Configuration Validation', function() {
    describe('TUS Component Configuration', function() {
      it('tusFileUploadSimple should have proper TUS configuration', function() {
        const form = template.forms.tusFileUploadSimple;
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'file');

        assert.ok(tusComponent, 'Should have TUS component');
        assert.equal(tusComponent.storage, 'tus', 'Should use TUS storage');
        assert.ok(tusComponent.url || tusComponent.uploadUrl, 'Should have upload URL configured');
      });

      it('tusFileUploadMultiple should have proper TUS configuration', function() {
        const form = template.forms.tusFileUploadMultiple;
        const tusComponent = form.components.find(c => c.type === 'tusupload' || c.key === 'files');

        assert.ok(tusComponent, 'Should have TUS component');
        assert.equal(tusComponent.storage, 'tus', 'Should use TUS storage');
        assert.equal(tusComponent.multiple, true, 'Should allow multiple files');
        assert.ok(tusComponent.url || tusComponent.uploadUrl, 'Should have upload URL configured');
      });
    });

    describe('Uppy Component Configuration', function() {
      it('tusFileUploadBulk should have proper Uppy configuration', function() {
        const form = template.forms.tusFileUploadBulk;
        const uppyComponent = form.components.find(c => c.type === 'uppyupload' || c.key === 'mediaFiles');

        assert.ok(uppyComponent, 'Should have Uppy component');
        assert.equal(uppyComponent.storage, 'tus', 'Should use TUS storage');
        assert.equal(uppyComponent.multiple, true, 'Should allow multiple files');
        assert.ok(uppyComponent.url || uppyComponent.uploadUrl, 'Should have upload URL configured');
      });
    });
  });

  /**
   * Summary Report
   */
  after(function() {
    if (this.currentTest && this.currentTest.parent) {
      console.log('\n=== Template Extension Test Summary ===');
      console.log('Template Path:', templatePath);
      console.log('Template Version:', template.version);
      console.log('Total Forms:', Object.keys(template.forms).length);
      console.log('Total Actions:', Object.keys(template.actions).length);
      console.log('TUS Upload Forms Added: 3');
      console.log('  - tusFileUploadSimple');
      console.log('  - tusFileUploadMultiple');
      console.log('  - tusFileUploadBulk');
      console.log('=====================================\n');
    }
  });
});
