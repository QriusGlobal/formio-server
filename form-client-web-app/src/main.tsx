import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';

// Import Form.io CSS
import '@qrius/formio-react/css';

// Import Form.io Dark Mode Override
import './formio-dark.css';

// Import Whitelabel CSS (hides Form.io branding)
import './whitelabel.css';

// Register Form.io File Upload Module
// CRITICAL: Import from @qrius/formio-react to use the SAME Components registry!
import { Formio, Components } from '@qrius/formio-react';

import { MultiImageUpload } from './components/MultiImageUpload';
import FormioFileUploadModule, {
  MultiImageUploadComponent
} from '../../packages/formio-file-upload/src/index';

// CRITICAL: Register React component factory BEFORE Formio.use()
// This enables the Form.io adapter to load the React component at runtime
MultiImageUploadComponent.registerReactComponent(() => ({
  React,
  ReactDOM,
  MultiImageUpload
}));

// Register module with Form.io
// eslint-disable-next-line react-hooks/rules-of-hooks -- Formio.use() is NOT a React Hook, it's Form.io plugin registration
Formio.use(FormioFileUploadModule);

// REQUIRED: Explicit component registration for Form.io's component loader
// Module registration alone doesn't make custom components discoverable
(Components as any).setComponent('multiimageupload', MultiImageUploadComponent);

// Debug: Verify component registration
console.log('✅ MultiImageUpload component registered');
console.log('Available components:', Object.keys((Components as any).components));
console.log('multiimageupload registered?', (Components as any).components.multiimageupload);
console.log('React factory registered?', MultiImageUploadComponent.reactComponentFactory !== null);

// CRITICAL: Hook into Components.create to see if multiimageupload is being instantiated
const originalCreate = (Components as any).create;
(Components as any).create = function (component: any, options: any, data: any) {
  console.log('🔍 Components.create() called for type:', component?.type, 'key:', component?.key);
  if (component?.type === 'multiimageupload') {
    console.log('🎯 CREATING multiimageupload component!', component);
  }
  return originalCreate.call(this, component, options, data);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
