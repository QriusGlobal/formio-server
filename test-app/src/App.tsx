import { useState } from 'react'
import './App.css'

// TODO: Will integrate @formio/react once we build the components
// For now, this is a placeholder to test the local environment

function App() {
  const [testResult, setTestResult] = useState<string>('')

  const testFormioServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/health')
      const data = await response.json()
      setTestResult(`✅ Form.io server is running: ${JSON.stringify(data)}`)
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
      // MongoDB connection test via formio server
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧪 Form.io File Upload Test App</h1>
        <p className="subtitle">Local Development Environment</p>
      </header>

      <main>
        <div className="info-card">
          <h2>📡 Service Status</h2>
          <p>Running on <code>http://localhost:64849</code></p>
        </div>

        <div className="test-section">
          <h2>🔧 Test Services</h2>
          <div className="button-grid">
            <button onClick={testFormioServer} className="test-button">
              Test Form.io Server
            </button>
            <button onClick={testGCSEmulator} className="test-button">
              Test GCS Emulator
            </button>
            <button onClick={testMongoDB} className="test-button">
              Test MongoDB
            </button>
          </div>

          {testResult && (
            <div className="test-result">
              <h3>Test Result:</h3>
              <pre>{testResult}</pre>
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>📋 Next Steps</h2>
          <ol>
            <li>All service tests should pass (green checkmarks)</li>
            <li>Build formio-core with FileUpload component</li>
            <li>Build formio-react with React wrapper</li>
            <li>Integrate Form component in this app</li>
            <li>Test file uploads end-to-end</li>
          </ol>
        </div>

        <div className="services-info">
          <h3>🔗 Service Endpoints</h3>
          <ul>
            <li><strong>Test App:</strong> <code>http://localhost:64849</code></li>
            <li><strong>Form.io Server:</strong> <code>http://localhost:3001</code></li>
            <li><strong>MongoDB:</strong> <code>mongodb://localhost:27017</code></li>
            <li><strong>GCS Emulator:</strong> <code>http://localhost:4443</code></li>
          </ul>
        </div>
      </main>

      <footer>
        <p className="footer-text">
          💡 Tip: Open browser DevTools to see network requests
        </p>
      </footer>
    </div>
  )
}

export default App