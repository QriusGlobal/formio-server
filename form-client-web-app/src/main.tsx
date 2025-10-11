import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Form.io CSS
import '@formio/js/dist/formio.full.css'

// Import Form.io Dark Mode Override
import './formio-dark.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)