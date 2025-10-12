import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import Form.io CSS
import '@formio/js/dist/formio.full.css';

// Import Form.io Dark Mode Override
import './formio-dark.css';

// Register Form.io File Upload Module
import { Formio } from '@formio/js';
import FormioFileUploadModule from '../../packages/formio-file-upload/src/index';

Formio.use(FormioFileUploadModule);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
