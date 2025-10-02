import FormioSubmissionTest from './pages/FormioSubmissionTest'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Form.io File Upload</h1>
        <p>Complete form with TUS file upload integration</p>
      </header>

      <main className="container">
        <FormioSubmissionTest />
      </main>
    </div>
  )
}

export default App
