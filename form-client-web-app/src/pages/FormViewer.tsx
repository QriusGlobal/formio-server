import { useState } from 'react';
import { Form } from '@qrius/formio-react';
import type { Submission } from '@qrius/formio-react';
import specialistReportForm from '../forms/specialist-report.json';

// Sample form definitions
const SAMPLE_FORMS = {
  specialistReport: specialistReportForm,
  simple: {
    display: 'form',
    components: [
      {
        type: 'textfield',
        key: 'firstName',
        label: 'First Name',
        placeholder: 'Enter your first name',
        validate: { required: true }
      },
      {
        type: 'textfield',
        key: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        validate: { required: true }
      },
      {
        type: 'email',
        key: 'email',
        label: 'Email',
        placeholder: 'your.email@example.com',
        validate: { required: true }
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit',
        theme: 'primary'
      }
    ]
  },
  contact: {
    display: 'form',
    components: [
      {
        type: 'panel',
        title: 'Contact Information',
        key: 'contactPanel',
        components: [
          {
            type: 'textfield',
            key: 'fullName',
            label: 'Full Name',
            placeholder: 'John Doe',
            validate: { required: true }
          },
          {
            type: 'email',
            key: 'email',
            label: 'Email Address',
            placeholder: 'john@example.com',
            validate: { required: true }
          },
          {
            type: 'phoneNumber',
            key: 'phone',
            label: 'Phone Number',
            placeholder: '(555) 123-4567',
            validate: { required: false }
          },
          {
            type: 'textarea',
            key: 'message',
            label: 'Message',
            placeholder: 'Your message here...',
            rows: 5,
            validate: { required: true, minLength: 10 }
          }
        ]
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Send Message',
        theme: 'primary',
        block: true
      }
    ]
  },
  survey: {
    display: 'form',
    components: [
      {
        type: 'panel',
        title: 'Customer Satisfaction Survey',
        key: 'surveyPanel',
        components: [
          {
            type: 'radio',
            key: 'satisfaction',
            label: 'How satisfied are you with our service?',
            values: [
              { label: 'Very Satisfied', value: '5' },
              { label: 'Satisfied', value: '4' },
              { label: 'Neutral', value: '3' },
              { label: 'Dissatisfied', value: '2' },
              { label: 'Very Dissatisfied', value: '1' }
            ],
            validate: { required: true }
          },
          {
            type: 'selectboxes',
            key: 'features',
            label: 'Which features do you use most? (Select all that apply)',
            values: [
              { label: 'Forms', value: 'forms' },
              { label: 'File Upload', value: 'upload' },
              { label: 'Validation', value: 'validation' },
              { label: 'API Integration', value: 'api' }
            ]
          },
          {
            type: 'select',
            key: 'frequency',
            label: 'How often do you use our service?',
            data: {
              values: [
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Rarely', value: 'rarely' }
              ]
            },
            validate: { required: true }
          },
          {
            type: 'checkbox',
            key: 'recommend',
            label: 'Would you recommend us to others?',
            validate: { required: true }
          }
        ]
      },
      {
        type: 'button',
        action: 'submit',
        label: 'Submit Survey',
        theme: 'primary',
        block: true
      }
    ]
  }
};

export default function FormViewer() {
  const [selectedForm, setSelectedForm] = useState<string>('specialistReport');
  const [customJson, setCustomJson] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useServerMode, setUseServerMode] = useState<boolean>(false);
  const [formioServerUrl, setFormioServerUrl] = useState<string>('http://localhost:3001');

  const getCurrentForm = () => {
    if (useCustom && customJson) {
      try {
        return JSON.parse(customJson);
      } catch (e) {
        setError('Invalid JSON format');
        return SAMPLE_FORMS[selectedForm as keyof typeof SAMPLE_FORMS];
      }
    }
    return SAMPLE_FORMS[selectedForm as keyof typeof SAMPLE_FORMS];
  };

  const handleSubmit = (sub: Submission) => {
    setSubmission(sub);
    setError(null);
  };

  const handleError = (errors: any) => {
    console.error('Form errors:', errors);
    setError('Form validation failed. Please check all required fields.');
  };

  const resetForm = () => {
    setSubmission(null);
    setError(null);
  };

  const loadCustomJson = () => {
    const form = SAMPLE_FORMS[selectedForm as keyof typeof SAMPLE_FORMS];
    setCustomJson(JSON.stringify(form, null, 2));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>📋 Form.io Client Viewer</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Simple web client for viewing and interacting with Form.io forms (no backend required)
        </p>
      </div>

      {/* Form Selector */}
      {!submission && (
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <h2 style={{ marginTop: 0 }}>Configuration</h2>

          {/* Server Mode Toggle */}
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '6px'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={useServerMode}
                onChange={e => setUseServerMode(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <strong>Server Submission Mode</strong>
            </label>
            <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: '#666' }}>
              {useServerMode
                ? '✅ Forms will be submitted to Form.io server'
                : '⚠️ Client-side only (no server submission)'}
            </p>
            {useServerMode && (
              <div style={{ marginTop: '0.75rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  Form.io Server URL:
                </label>
                <input
                  type="text"
                  value={formioServerUrl}
                  onChange={e => setFormioServerUrl(e.target.value)}
                  placeholder="http://localhost:3001"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            )}
          </div>

          <h3 style={{ marginTop: 0 }}>Select Form</h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="radio"
                name="formType"
                checked={!useCustom}
                onChange={() => setUseCustom(false)}
                style={{ marginRight: '0.5rem' }}
              />
              <strong>Use Sample Form</strong>
            </label>

            {!useCustom && (
              <select
                value={selectedForm}
                onChange={e => setSelectedForm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  marginLeft: '1.5rem'
                }}
              >
                <option value="specialistReport">
                  Specialist Report (38 fields with image uploads)
                </option>
                <option value="simple">Simple Form (Name & Email)</option>
                <option value="contact">Contact Form (Panel with Phone & Message)</option>
                <option value="survey">Survey Form (Radio, Checkbox, Select)</option>
              </select>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="radio"
                name="formType"
                checked={useCustom}
                onChange={() => setUseCustom(true)}
                style={{ marginRight: '0.5rem' }}
              />
              <strong>Use Custom JSON</strong>
            </label>

            {useCustom && (
              <>
                <button
                  onClick={loadCustomJson}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#667eea',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    marginLeft: '1.5rem'
                  }}
                >
                  Load Selected Sample as Template
                </button>
                <textarea
                  value={customJson}
                  onChange={e => setCustomJson(e.target.value)}
                  placeholder='Paste your Form.io JSON here...\n\nExample:\n{\n  "display": "form",\n  "components": [\n    { "type": "textfield", "key": "name", "label": "Name" }\n  ]\n}'
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    marginLeft: '1.5rem'
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            border: '2px solid #ef5350'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Form Renderer */}
      {!submission && (
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Form
            form={getCurrentForm()}
            src=""
            url={useServerMode ? formioServerUrl : undefined}
            onSubmit={handleSubmit}
            onError={handleError}
            options={{
              noAlerts: false,
              readOnly: false
            }}
          />
        </div>
      )}

      {/* Submission Display */}
      {submission && (
        <div>
          <div
            style={{
              background: '#e8f5e9',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '2px solid #4caf50'
            }}
          >
            <h2 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>
              ✅ Form Submitted Successfully!
            </h2>
            <button
              onClick={resetForm}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Submit Another Form
            </button>
          </div>

          <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginTop: 0 }}>📄 Submission Data:</h3>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}
            >
              {JSON.stringify(submission.data, null, 2)}
            </pre>
          </div>

          <div
            style={{
              background: useServerMode ? '#e3f2fd' : '#fff3e0',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '1rem',
              border: useServerMode ? '1px solid #2196f3' : '1px solid #ffb74d'
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: useServerMode ? '#1565c0' : '#e65100' }}>
              💡 Note:
            </h4>
            <p style={{ margin: 0, color: '#666' }}>
              {useServerMode ? (
                <>
                  This submission was sent to the Form.io server at <code>{formioServerUrl}</code>.
                  The data is now stored in MongoDB and can be retrieved via the API.
                </>
              ) : (
                <>
                  This is a <strong>client-side only</strong> form viewer. No data is sent to any
                  server. All validation and rendering happens in your browser using
                  @qrius/formio-react.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
