import FormioFileUploadModule from '@formio/file-upload';
import { Formio } from '@formio/js';
import { lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Register Form.io file upload module globally before lazy loading
// This ensures the module is available when lazy-loaded components render
// eslint-disable-next-line react-hooks/rules-of-hooks -- Formio.use() is NOT a React Hook, it's Form.io plugin registration
Formio.use(FormioFileUploadModule);

// Lazy load route components for better performance
const FormioSubmissionTest = lazy(() => import('./pages/FormioSubmissionTest'));
const TusBulkUploadTest = lazy(() => import('./pages/TusBulkUploadTest'));

// Loading component with GPU acceleration
function LoadingSpinner() {
  return (
    <div
      data-testid="loading-spinner"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        minHeight: '200px',
        transform: 'translateZ(0)', // GPU acceleration
        willChange: 'opacity'
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          transform: 'translateZ(0)' // GPU acceleration
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: translateZ(0) rotate(0deg); }
          100% { transform: translateZ(0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="App" style={{ transform: 'translateZ(0)' }}>
      <header className="App-header">
        <h1>Form.io File Upload Test Suite</h1>
        <p>Complete testing environment for TUS and Uppy file upload integration</p>

        {/* Navigation */}
        <nav
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Link
            to="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              background: location.pathname === '/' ? '#667eea' : '#f8f9fa',
              color: location.pathname === '/' ? 'white' : '#333',
              border: location.pathname === '/' ? 'none' : '2px solid #dee2e6',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
          >
            📋 Integration Test
          </Link>
          <Link
            to="/tus-bulk-test"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              background: location.pathname === '/tus-bulk-test' ? '#667eea' : '#f8f9fa',
              color: location.pathname === '/tus-bulk-test' ? 'white' : '#333',
              border: location.pathname === '/tus-bulk-test' ? 'none' : '2px solid #dee2e6',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
          >
            🚀 TUS Bulk Upload Test
          </Link>
        </nav>
      </header>

      <main className="container">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<FormioSubmissionTest />} />
            <Route path="/tus-bulk-test" element={<TusBulkUploadTest />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
