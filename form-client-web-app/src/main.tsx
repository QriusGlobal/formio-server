import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import Form.io CSS
import '@formio/js/dist/formio.full.css';

// Import Form.io Dark Mode Override
import './formio-dark.css';

// Register Form.io File Upload Module
import { Formio, Components } from '@formio/js';
import FormioFileUploadModule, {
  MultiImageUploadComponent
} from '../../packages/formio-file-upload/src/index';
import { MultiImageUpload } from './components/MultiImageUpload';

// CRITICAL: Register React component factory BEFORE Formio.use()
// This enables the Form.io adapter to load the React component at runtime
MultiImageUploadComponent.registerReactComponent(() => ({
  React,
  ReactDOM,
  MultiImageUpload
}));

// Register module with Form.io
Formio.use(FormioFileUploadModule);

// REQUIRED: Explicit component registration for Form.io's component loader
// Module registration alone doesn't make custom components discoverable
(Components as any).setComponent('multiimageupload', MultiImageUploadComponent);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
