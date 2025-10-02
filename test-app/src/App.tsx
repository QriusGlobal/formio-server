import { useState } from 'react'
import { FileUploadComparison } from './pages/FileUploadComparison'
import { FileUploadDemo } from './pages/FileUploadDemo'
import { FormioTusDemo } from './pages/FormioTusDemo'
import FormioValidationTest from './pages/FormioValidationTest'
import { LocalFormioDemo } from './pages/LocalFormioDemo'
import { FormioModuleDemo } from './pages/FormioModuleDemo'
import FormioSubmissionTest from './pages/FormioSubmissionTest'
import './App.css'

type ViewMode = 'landing' | 'testing' | 'comparison' | 'demo' | 'formio-tus' | 'validation' | 'local-formio' | 'module-demo' | 'submission-test';

function App() {
  const [testResult, setTestResult] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('landing')

  const testFormioServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/health')
      const data = await response.json()
      setTestResult(`✅ Form.io server is running!\n\nStatus: ${data.status}\nDatabase: ${data.database}\nTimestamp: ${data.timestamp}`)
    } catch (error) {
      setTestResult(`❌ Form.io server error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testGCSEmulator = async () => {
    try {
      const response = await fetch('http://localhost:4443/storage/v1/b')
      const data = await response.json()
      setTestResult(`✅ GCS Emulator is running. Buckets: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setTestResult(`❌ GCS Emulator error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testMongoDB = async () => {
    try {
      const response = await fetch('http://localhost:3001/')
      if (response.ok) {
        setTestResult(`✅ MongoDB is accessible via Form.io server`)
      } else {
        setTestResult(`⚠️ Form.io server response: ${response.status}`)
      }
    } catch (error) {
      setTestResult(`❌ MongoDB test error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Landing page with navigation buttons
  if (viewMode === 'landing') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Form.io File Upload Extension</h1>
          <p>Test Infrastructure & Demo Components</p>
        </header>

        <main className="container">
          <div className="demo-links">
            <h2>Available Demos</h2>
            <div className="demo-grid">
              <button
                className="demo-button primary"
                onClick={() => setViewMode('demo')}
                data-testid="nav-file-upload-demo"
              >
                📤 Try File Upload Demo
              </button>
              <button
                className="demo-button"
                onClick={() => setViewMode('comparison')}
                data-testid="nav-comparison"
              >
                🔍 View TUS vs Uppy Comparison
              </button>
              <button
                className="demo-button"
                onClick={() => setViewMode('module-demo')}
                data-testid="nav-module-demo"
              >
                📦 Form.io Module Demo
              </button>
              <button
                className="demo-button"
                onClick={() => setViewMode('formio-tus')}
                data-testid="nav-formio-tus-demo"
              >
                🚀 TUS Integration
              </button>
              <button
                className="demo-button"
                onClick={() => setViewMode('local-formio')}
                data-testid="nav-local-formio"
              >
                🏠 Local Form.io
              </button>
              <button
                className="demo-button"
                onClick={() => setViewMode('validation')}
                data-testid="nav-validation"
              >
                ✅ Validation Testing
              </button>
              <button
                className="demo-button primary"
                onClick={() => setViewMode('submission-test')}
                data-testid="nav-submission-test"
              >
                🎯 Submission Integration Test
              </button>
              <button
                className="demo-button"
                onClick={() => setViewMode('testing')}
                data-testid="nav-testing"
              >
                🔧 Infrastructure Testing
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render submission test
  if (viewMode === 'submission-test') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
        <FormioSubmissionTest />
      </div>
    );
  }

  // Render module demo
  if (viewMode === 'module-demo') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Form.io File Upload Module</h3>
            <div>
              <button
                onClick={() => setViewMode('landing')}
                style={{
                  padding: '8px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginRight: '8px',
                }}
              >
                ← Home
              </button>
              <select
                className="form-select w-auto"
                style={{ display: 'inline-block' }}
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as ViewMode)}
              >
                <option value="module-demo">Module Demo</option>
                <option value="testing">Infrastructure Testing</option>
                <option value="comparison">Component Comparison</option>
                <option value="demo">File Upload Demo</option>
                <option value="formio-tus">Form.io TUS Demo</option>
                <option value="validation">Validation Test</option>
                <option value="local-formio">Local Form.io</option>
              </select>
            </div>
          </div>
        </div>
        <FormioModuleDemo />
      </div>
    );
  }

  // Other view modes...
  if (viewMode === 'comparison') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
        <FileUploadComparison />
      </div>
    );
  }

  if (viewMode === 'demo') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
        <FileUploadDemo />
      </div>
    );
  }

  if (viewMode === 'formio-tus') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
        <FormioTusDemo />
      </div>
    );
  }

  if (viewMode === 'validation') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
        <FormioValidationTest />
      </div>
    );
  }

  if (viewMode === 'local-formio') {
    return (
      <div className="App">
        <div style={{ padding: '16px', background: '#f5f7fa', borderBottom: '1px solid #dee2e6' }}>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
        <LocalFormioDemo />
      </div>
    );
  }

  // Infrastructure testing view (default fallback for 'testing' mode)
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
          <div>
            <h1>Form.io File Upload Extension</h1>
            <p>Test Infrastructure Components</p>
          </div>
          <button
            onClick={() => setViewMode('landing')}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Home
          </button>
        </div>
      </header>

      <main className="container">
        <div className="test-grid">
          <div className="test-card">
            <h2>Form.io Server</h2>
            <p>Community Edition with TUS upload support</p>
            <button onClick={testFormioServer}>Test Connection</button>
          </div>

          <div className="test-card">
            <h2>GCS Emulator</h2>
            <p>Local Google Cloud Storage emulation</p>
            <button onClick={testGCSEmulator}>Test GCS</button>
          </div>

          <div className="test-card">
            <h2>MongoDB</h2>
            <p>Database for Form.io persistence</p>
            <button onClick={testMongoDB}>Test Database</button>
          </div>
        </div>

        {testResult && (
          <div className="result-box">
            <h3>Test Result:</h3>
            <pre>{testResult}</pre>
          </div>
        )}

        <div className="demo-links">
          <h2>Available Demos</h2>
          <div className="demo-grid">
            <button
              className="demo-button primary"
              onClick={() => setViewMode('module-demo')}
            >
              📦 Form.io Module Demo
            </button>
            <button
              className="demo-button"
              onClick={() => setViewMode('comparison')}
            >
              🔍 Component Comparison
            </button>
            <button
              className="demo-button"
              onClick={() => setViewMode('demo')}
            >
              📤 File Upload Demo
            </button>
            <button
              className="demo-button"
              onClick={() => setViewMode('formio-tus')}
            >
              🚀 TUS Integration
            </button>
            <button
              className="demo-button"
              onClick={() => setViewMode('validation')}
            >
              ✅ Validation Testing
            </button>
            <button
              className="demo-button"
              onClick={() => setViewMode('local-formio')}
            >
              🏠 Local Form.io
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App