import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Form.io CSS
import '@formio/js/dist/formio.full.css'

// Import Form.io Dark Mode Override
import './formio-dark.css'

// Import Uppy CSS (required by @formio/react and formio-file-upload components)
// Import from node_modules directly using full paths
import '../node_modules/@uppy/core/dist/style.min.css';
import '../node_modules/@uppy/dashboard/dist/style.min.css';
import '../node_modules/@uppy/webcam/dist/style.min.css';
import '../node_modules/@uppy/image-editor/dist/style.min.css';
import '../node_modules/@uppy/audio/dist/style.min.css';
import '../node_modules/@uppy/screen-capture/dist/style.min.css';
import '../node_modules/@uppy/url/dist/style.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)