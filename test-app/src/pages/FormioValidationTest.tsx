import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Minimal test schema
const TEST_SCHEMA = {
  components: [
    {
      type: 'textfield',
      key: 'testField',
      label: 'Test Field',
      input: true,
      placeholder: 'Enter test data',
      validate: {
        required: true
      }
    },
    {
      type: 'button',
      action: 'submit',
      label: 'Submit',
      key: 'submit',
      theme: 'primary'
    }
  ]
};

interface TestResult {
  test: string;
  status: 'pending' | 'pass' | 'fail';
  message: string;
  timestamp?: string;
}

interface SubmissionData {
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #ef4444',
      borderRadius: '8px',
      backgroundColor: '#fee',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>❌ Form.io Render Error</h3>
      <p style={{ margin: '10px 0' }}>
        <strong>Error:</strong> {error.message}
      </p>
      <pre style={{
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '12px'
      }}>
        {error.stack}
      </pre>
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  );
}

// Test Status Component
function TestStatus({ results }: { results: TestResult[] }) {
  const allPassed = results.every(r => r.status === 'pass');
  const anyFailed = results.some(r => r.status === 'fail');
  const allPending = results.every(r => r.status === 'pending');

  return (
    <div style={{
      padding: '20px',
      border: `2px solid ${allPassed ? '#22c55e' : anyFailed ? '#ef4444' : '#94a3b8'}`,
      borderRadius: '8px',
      backgroundColor: allPassed ? '#f0fdf4' : anyFailed ? '#fee' : '#f8fafc',
      marginBottom: '20px'
    }}>
      <h2 style={{ margin: '0 0 15px 0' }}>
        {allPassed ? '✅ All Tests Passed' : anyFailed ? '❌ Some Tests Failed' : '⏳ Tests Running'}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {results.map((result, idx) => (
          <div key={idx} style={{
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>
              {result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏳'}
            </span>
            <div style={{ flex: 1 }}>
              <strong>{result.test}</strong>
              <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                {result.message}
              </p>
              {result.timestamp && (
                <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
                  {result.timestamp}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Validation Test Component
export default function FormioValidationTest() {
  const [Form, setForm] = useState<any>(null);
  const [importError, setImportError] = useState<Error | null>(null);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { test: 'Import @formio/react', status: 'pending', message: 'Attempting to import Form component...' },
    { test: 'Render Form Component', status: 'pending', message: 'Waiting for import to complete...' },
    { test: 'Handle onSubmit Event', status: 'pending', message: 'Waiting for form submission...' },
    { test: 'Receive Submission Data', status: 'pending', message: 'Waiting for data validation...' }
  ]);

  // Helper to update test result
  const updateTestResult = (testIndex: number, status: 'pass' | 'fail', message: string) => {
    setTestResults(prev => prev.map((result, idx) =>
      idx === testIndex
        ? { ...result, status, message, timestamp: new Date().toLocaleTimeString() }
        : result
    ));
  };

  // Helper to log events
  const logEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${event}`;
    console.log(logEntry);
    setEventLog(prev => [...prev, logEntry]);
  };

  // Test 1: Import Form component
  useEffect(() => {
    let mounted = true;

    async function loadForm() {
      try {
        logEvent('Starting Form.io import...');
        const { Form: FormComponent } = await import('@formio/react');

        if (!mounted) return;

        if (FormComponent) {
          setForm(() => FormComponent);
          updateTestResult(0, 'pass', 'Successfully imported Form from @formio/react');
          updateTestResult(1, 'pending', 'Attempting to render Form component...');
          logEvent('✅ Form component imported successfully');
        } else {
          throw new Error('Form component is undefined after import');
        }
      } catch (error) {
        if (!mounted) return;

        const err = error as Error;
        setImportError(err);
        updateTestResult(0, 'fail', `Import failed: ${err.message}`);
        logEvent(`❌ Import failed: ${err.message}`);
      }
    }

    loadForm();

    return () => {
      mounted = false;
    };
  }, []);

  // Test 2: Render monitoring (handled by Error Boundary)
  useEffect(() => {
    if (Form) {
      // If we get here, rendering succeeded
      const timer = setTimeout(() => {
        updateTestResult(1, 'pass', 'Form component rendered without errors');
        logEvent('✅ Form rendered successfully');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [Form]);

  // Test 3 & 4: Handle form submission
  const handleSubmit = (submission: SubmissionData) => {
    logEvent('📤 Form submission received');
    logEvent(`Data: ${JSON.stringify(submission.data, null, 2)}`);

    setSubmissionData(submission);
    updateTestResult(2, 'pass', 'onSubmit callback fired successfully');

    // Test 4: Validate submission data
    if (submission.data && typeof submission.data === 'object') {
      const hasTestField = 'testField' in submission.data;
      if (hasTestField) {
        updateTestResult(3, 'pass', `Received valid data: testField="${submission.data.testField}"`);
        logEvent(`✅ Valid submission data received`);
      } else {
        updateTestResult(3, 'fail', 'Submission data missing expected "testField" key');
        logEvent(`❌ Invalid submission data structure`);
      }
    } else {
      updateTestResult(3, 'fail', 'Submission data is not a valid object');
      logEvent(`❌ Invalid submission data type`);
    }
  };

  // Form event handlers with logging
  const handleChange = (changed: any) => {
    logEvent(`🔄 Form changed: ${JSON.stringify(changed)}`);
  };

  const handleError = (errors: any) => {
    logEvent(`⚠️ Form validation errors: ${JSON.stringify(errors)}`);
  };

  const handleRender = () => {
    logEvent('🎨 Form render event');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>Form.io Runtime Validation Test</h1>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>
        This page validates that Form.io can be imported, rendered, and interacted with successfully.
      </p>

      {/* Test Results Summary */}
      <TestStatus results={testResults} />

      {/* Import Error Display */}
      {importError && (
        <div style={{
          padding: '20px',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          backgroundColor: '#fee',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>❌ Import Error</h3>
          <p><strong>Message:</strong> {importError.message}</p>
          <pre style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            {importError.stack}
          </pre>
        </div>
      )}

      {/* Form Rendering Area */}
      <div style={{
        padding: '20px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Form.io Test Form</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Fill in the field below and submit to test Form.io functionality
        </p>

        {!Form && !importError && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Loading Form component...
          </div>
        )}

        {Form && (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error) => {
              updateTestResult(1, 'fail', `Render error: ${error.message}`);
              logEvent(`❌ Render error: ${error.message}`);
            }}
            onReset={() => {
              logEvent('🔄 Error boundary reset, attempting re-render');
              updateTestResult(1, 'pending', 'Retrying render...');
            }}
          >
            <Form
              form={TEST_SCHEMA}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onError={handleError}
              onRender={handleRender}
            />
          </ErrorBoundary>
        )}
      </div>

      {/* Submission Data Display */}
      {submissionData && (
        <div style={{
          padding: '20px',
          border: '2px solid #22c55e',
          borderRadius: '8px',
          backgroundColor: '#f0fdf4',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#16a34a', margin: '0 0 10px 0' }}>✅ Submission Received</h3>
          <pre style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px'
          }}>
            {JSON.stringify(submissionData, null, 2)}
          </pre>
        </div>
      )}

      {/* Event Log */}
      <div style={{
        padding: '20px',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <h3 style={{ marginTop: 0 }}>Event Log (Console Mirror)</h3>
        <div style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {eventLog.length === 0 ? (
            <div style={{ color: '#94a3b8' }}>Waiting for events...</div>
          ) : (
            eventLog.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test Schema Display */}
      <details style={{ marginTop: '20px' }}>
        <summary style={{
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px'
        }}>
          View Test Schema
        </summary>
        <pre style={{
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '12px',
          marginTop: '10px'
        }}>
          {JSON.stringify(TEST_SCHEMA, null, 2)}
        </pre>
      </details>
    </div>
  );
}