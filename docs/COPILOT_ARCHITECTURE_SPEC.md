# CopilotKit Architecture Specification

> **Production-ready technical specification for AI-powered form-filling
> integration with Form.io monorepo**

**Version**: 1.0.0  
**Status**: Architecture Design Complete  
**Decision Authority**: Gemini (Chief Architect)  
**Last Updated**: 2025-01-14

---

## 🎯 Executive Summary

This document provides a complete technical specification for integrating
CopilotKit into the Form.io monorepo to enable AI-powered form-filling
capabilities. A developer should be able to implement the entire system from
this specification without additional guidance.

### Quick Facts

- **Framework**: CopilotKit v1.x (MIT licensed)
- **LLM Backend**: Claude 3.5 Sonnet (primary), GPT-4o (fallback)
- **Expected Cost**: $0.015-0.025/form (optimized)
- **Bundle Impact**: +65-85 KB (headless mode)
- **Performance**: <2s AI response time, <500ms first token
- **Time to Production**: 8-12 weeks (phased rollout)

### Architecture at a Glance

```
┌──────────────────────────────────────────────────────────────┐
│                    User Interface Layer                       │
│  ┌─────────────────┐       ┌──────────────────────────────┐  │
│  │  CopilotSidebar │◄──────┤ Form.io FormBuilder (Admin)  │  │
│  │  (React UI)     │       │ Pure React Forms (Runtime)   │  │
│  └────────┬────────┘       └──────────────┬───────────────┘  │
│           │                               │                   │
└───────────┼───────────────────────────────┼──────────────────┘
            │                               │
            ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│              CopilotKit Integration Layer                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  CopilotKit Provider (React Context)                    │ │
│  │    - useCopilotReadable (Form State Exposure)           │ │
│  │    - useCopilotAction (AI Function Calling)             │ │
│  │    - WebSocket Connection Management                    │ │
│  └──────────┬──────────────────────────────────────────────┘ │
│             │                                                  │
└─────────────┼──────────────────────────────────────────────────┘
              │ WebSocket/SSE
              ▼
┌──────────────────────────────────────────────────────────────┐
│                  Backend Runtime Layer                        │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  FastAPI Server (Python 3.11+)                           ││
│  │    - /api/copilot/chat (streaming endpoint)              ││
│  │    - /api/copilot/action (function calling)              ││
│  │    - /api/copilot/vision (document analysis)             ││
│  │    - WebSocket handler for real-time streaming           ││
│  └──────────┬───────────────────────────────────────────────┘│
│             │                                                  │
│             ▼                                                  │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Agent Orchestration Layer                               ││
│  │    - ConversationalAgent (form filling)                  ││
│  │    - ValidationAgent (smart validation)                  ││
│  │    - ExtractionAgent (document data extraction)          ││
│  └──────────┬───────────────────────────────────────────────┘│
│             │                                                  │
└─────────────┼──────────────────────────────────────────────────┘
              │ HTTPS
              ▼
┌──────────────────────────────────────────────────────────────┐
│                     LLM Provider Layer                        │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Anthropic Claude API (Primary)                          ││
│  │    - Claude 3.5 Sonnet: Conversational + Extraction      ││
│  │    - Claude 3.5 Sonnet Vision: Document Analysis         ││
│  │    - Claude 3 Haiku: Simple Tasks (cost optimization)    ││
│  └──────────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────────┐│
│  │  OpenAI GPT API (Fallback)                               ││
│  │    - GPT-4o: High-complexity tasks                       ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

---

## 📐 Section 1: Integration Point Analysis

### 1.1 Current Architecture Integration Points

**Existing Monorepo Structure**:

```
formio-monorepo/
├── packages/formio-file-upload/    # Custom TUS upload module
├── formio-react/                   # Git-subrepo fork (@qrius/formio-react)
├── form-client-web-app/            # React 19 test application
├── formio/                         # Form.io server (git-subrepo)
└── formio-core/                    # Core framework (git-subrepo)
```

**CopilotKit Integration Points**:

```
formio-monorepo/
├── packages/
│   ├── formio-copilot/                    # ⭐ NEW: CopilotKit integration package
│   │   ├── src/
│   │   │   ├── components/                # React components
│   │   │   │   ├── CopilotSidebar.tsx     # Chat UI
│   │   │   │   ├── CopilotButton.tsx      # Trigger button
│   │   │   │   └── CopilotStatus.tsx      # Connection status
│   │   │   ├── hooks/                     # React hooks
│   │   │   │   ├── useFormioContext.ts    # Expose Form.io to AI
│   │   │   │   ├── useFormioActions.ts    # AI-callable actions
│   │   │   │   └── useCopilotForm.ts      # Unified hook
│   │   │   ├── adapters/                  # Form.io adapters
│   │   │   │   ├── FormioAdapter.ts       # Base adapter
│   │   │   │   └── FileUploadAdapter.ts   # File upload integration
│   │   │   ├── utils/                     # Utilities
│   │   │   │   ├── tokenOptimizer.ts      # Token reduction
│   │   │   │   ├── piiMasker.ts           # PII detection
│   │   │   │   └── conversationCache.ts   # Caching layer
│   │   │   └── index.ts                   # Public API
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── formio-file-upload/                # ✅ EXISTING: Integrate with CopilotKit
│       └── src/
│           └── integrations/
│               └── copilot/               # ⭐ NEW: AI guidance for uploads
│                   ├── uploadGuidance.ts
│                   └── imageAnalysis.ts
│
├── backend-copilot/                       # ⭐ NEW: Backend server
│   ├── src/
│   │   ├── main.py                        # FastAPI application
│   │   ├── agents/                        # AI agents
│   │   │   ├── conversational_agent.py    # Form filling
│   │   │   ├── validation_agent.py        # Smart validation
│   │   │   └── extraction_agent.py        # Document extraction
│   │   ├── tools/                         # Agent tools
│   │   │   ├── form_tools.py              # Form manipulation
│   │   │   ├── vision_tools.py            # Vision model integration
│   │   │   └── validation_tools.py        # Validation utilities
│   │   ├── streaming/                     # Streaming handlers
│   │   │   ├── websocket_handler.py       # WebSocket for real-time
│   │   │   └── sse_handler.py             # SSE fallback
│   │   ├── config.py                      # Configuration
│   │   └── middleware/                    # Middleware
│   │       ├── auth.py                    # Authentication
│   │       ├── rate_limiting.py           # Rate limiting
│   │       └── pii_protection.py          # PII masking
│   ├── tests/                             # Tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── form-client-web-app/                   # ✅ EXISTING: Add CopilotKit UI
│   └── src/
│       ├── pages/
│       │   ├── CopilotFormViewer.tsx      # ⭐ NEW: Form with AI
│       │   └── FormioSubmissionTest.tsx   # ✅ EXISTING: Enhance
│       └── components/
│           └── copilot/                   # ⭐ NEW: UI components
│               ├── FormCopilot.tsx
│               └── InlineAssistant.tsx
│
└── docs/                                  # Documentation
    ├── COPILOT_ARCHITECTURE_SPEC.md       # ⭐ THIS DOCUMENT
    ├── COPILOT_IMPLEMENTATION_PLAN.md     # Implementation guide
    ├── COPILOT_FEATURES_SPEC.md           # Feature specifications
    ├── COPILOT_DECISIONS.md               # TDRs
    └── COPILOT_COST_ANALYSIS.md           # Cost breakdown
```

### 1.2 Form.io Integration Strategy

**Challenge**: Form.io uses OOP class-based components, CopilotKit expects React
hooks.

**Solution**: Adapter pattern with hooks wrapping Form.io instances.

```typescript
// packages/formio-copilot/src/hooks/useCopilotForm.ts

import { useState, useEffect } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { Formio } from '@formio/js';

export function useCopilotForm(formInstance: any) {
  const [formData, setFormData] = useState({});
  const [formSchema, setFormSchema] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  // Extract schema on mount
  useEffect(() => {
    if (!formInstance) return;

    const schema = extractFieldsRecursive(
      formInstance.component.components || []
    );
    setFormSchema(schema);
  }, [formInstance]);

  // Listen to Form.io changes
  useEffect(() => {
    if (!formInstance) return;

    const handleChange = () => {
      setFormData({ ...formInstance.submission.data });
    };

    const handleError = () => {
      setValidationErrors(formInstance.errors || []);
    };

    formInstance.on('change', handleChange);
    formInstance.on('error', handleError);

    // Initial state
    handleChange();
    handleError();

    return () => {
      formInstance.off('change', handleChange);
      formInstance.off('error', handleError);
    };
  }, [formInstance]);

  // Expose form schema to AI
  useCopilotReadable({
    description:
      'Form schema with field definitions, types, and validation rules',
    value: formSchema.map(field => ({
      key: field.key,
      label: field.label,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder,
      description: field.description,
      options: field.options // For select/radio fields
    })),
    categories: ['form', 'schema']
  });

  // Expose current form data
  useCopilotReadable({
    description: 'Current form field values and completion status',
    value: {
      data: formData,
      completedFields: Object.keys(formData).filter(k => formData[k]),
      emptyFields: formSchema
        .filter(f => !formData[f.key])
        .map(f => ({ key: f.key, label: f.label, required: f.required })),
      progress: {
        completed: Object.keys(formData).filter(k => formData[k]).length,
        total: formSchema.length,
        percentage: Math.round(
          (Object.keys(formData).filter(k => formData[k]).length /
            formSchema.length) *
            100
        )
      }
    },
    categories: ['form', 'data']
  });

  // Expose validation errors
  useCopilotReadable({
    description: 'Form validation errors that need to be fixed',
    value: validationErrors.map(err => ({
      field: err.component.key,
      fieldLabel: err.component.label,
      message: err.message,
      currentValue: err.component.data
    })),
    categories: ['form', 'validation']
  });

  // Action: Fill multiple fields
  useCopilotAction({
    name: 'fillFormFields',
    description: `Update multiple form fields with new values.
                  Use this when the user provides information that maps to form fields.
                  Example: User says "My name is John, email john@example.com"
                  → Call fillFormFields({ name: "John", email: "john@example.com" })`,
    parameters: [
      {
        name: 'updates',
        type: 'object',
        description: 'Object with field keys as keys and new values as values',
        required: true
      }
    ],
    handler: async ({ updates }) => {
      const results = [];

      for (const [key, value] of Object.entries(updates)) {
        try {
          const field = formSchema.find(f => f.key === key);

          if (!field) {
            results.push({ key, success: false, error: 'Field not found' });
            continue;
          }

          const convertedValue = convertValueByType(value, field.type);
          Formio.setDataValue(
            formInstance.submission.data,
            key,
            convertedValue
          );

          results.push({ key, success: true, value: convertedValue });
        } catch (error) {
          results.push({ key, success: false, error: error.message });
        }
      }

      formInstance.triggerRedraw();

      return {
        totalFields: results.length,
        successCount: results.filter(r => r.success).length,
        failedCount: results.filter(r => !r.success).length,
        details: results
      };
    }
  });

  // Action: Validate form
  useCopilotAction({
    name: 'validateForm',
    description: 'Check if all form fields are valid and return any errors',
    parameters: [],
    handler: async () => {
      const isValid = await formInstance.checkValidity(
        formInstance.submission.data,
        true
      );
      const errors = formInstance.errors || [];

      return {
        isValid,
        errorCount: errors.length,
        errors: errors.map(err => ({
          field: err.component.key,
          label: err.component.label,
          message: err.message
        }))
      };
    }
  });

  // Action: Submit form
  useCopilotAction({
    name: 'submitForm',
    description: `Validate and submit the completed form. 
                  Only call this after the user explicitly requests submission 
                  and all validation errors are resolved.`,
    parameters: [],
    handler: async () => {
      // Validate first
      const isValid = await formInstance.checkValidity(
        formInstance.submission.data,
        true
      );

      if (!isValid) {
        const errors = formInstance.errors || [];
        throw new Error(
          `Form has ${errors.length} validation errors. Please fix them first.`
        );
      }

      // Submit
      const result = await formInstance.submit();

      return {
        success: true,
        submissionId: result._id,
        submittedAt: new Date().toISOString(),
        message: 'Form submitted successfully!'
      };
    }
  });

  return {
    formData,
    formSchema,
    validationErrors
  };
}

// Helper functions
function extractFieldsRecursive(components: any[]): any[] {
  return components.flatMap(comp => {
    if (comp.input && comp.key) {
      return [
        {
          key: comp.key,
          type: comp.type,
          label: comp.label || comp.key,
          required: comp.validate?.required || false,
          description: comp.description,
          placeholder: comp.placeholder,
          options: comp.data?.values || [] // For select/radio
        }
      ];
    }
    if (comp.components) {
      return extractFieldsRecursive(comp.components);
    }
    return [];
  });
}

function convertValueByType(value: any, fieldType: string): any {
  switch (fieldType) {
    case 'number':
      return parseFloat(value);
    case 'checkbox':
      return value === 'true' || value === true;
    case 'datetime':
      return new Date(value).toISOString();
    case 'select':
    case 'radio':
      return value;
    case 'textfield':
    case 'textarea':
    case 'email':
    case 'phoneNumber':
    default:
      return String(value);
  }
}
```

### 1.3 Dual-Track Architecture Compatibility

**Admin Path** (FormBuilder):

- Full Form.io FormBuilder UI with drag-and-drop
- CopilotKit sidebar provides AI assistance during form creation
- AI suggests field types, validation rules, and conditional logic

**Runtime Path** (Pure React Forms):

- Lightweight React components render forms
- CopilotKit integrated for end-user form filling assistance
- No Form.io overhead, just field rendering + AI chat

```typescript
// form-client-web-app/src/components/FormRouter.tsx

import { CopilotKit } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'
import { FormBuilder } from '@formio/react'
import { PureReactForm } from './PureReactForm'

export function FormRouter({ formId }: { formId: string }) {
  const { isAdmin } = useAuth()
  const { schema } = useFormSchema(formId)

  return (
    <CopilotKit runtimeUrl="/api/copilot">
      {isAdmin ? (
        // Admin path: FormBuilder with AI
        <>
          <FormBuilder
            form={schema}
            onChange={handleSchemaChange}
          />
          <CopilotSidebar
            instructions="You are assisting an admin creating a form.
                          Suggest field types, validation rules, and best practices."
            labels={{ title: "Form Design Assistant" }}
          />
        </>
      ) : (
        // Runtime path: Pure React with AI
        <>
          <PureReactForm schema={schema} onSubmit={handleSubmit} />
          <CopilotSidebar
            instructions="You are helping a user fill out a form.
                          Extract data from their natural language,
                          validate inputs, and guide them through completion."
            labels={{ title: "Form Assistant" }}
          />
        </>
      )}
    </CopilotKit>
  )
}
```

---

## 📊 Section 2: Backend Architecture

### 2.1 Backend Technology Decision

**TDR-001: CopilotKit Runtime vs Custom Backend**

| Aspect                 | CopilotKit Runtime | Custom FastAPI Backend  |
| ---------------------- | ------------------ | ----------------------- |
| **Setup Time**         | 1 hour             | 1-2 days                |
| **Complexity**         | Low                | Medium                  |
| **Flexibility**        | Limited            | High                    |
| **Cost**               | Same (LLM API)     | Same (LLM API)          |
| **Streaming**          | Built-in           | Manual                  |
| **Multi-Agent**        | No                 | Yes                     |
| **Token Optimization** | Automatic          | Manual                  |
| **Local LLMs**         | Possible           | Easy                    |
| **Recommendation**     | ✅ **START HERE**  | Migrate later if needed |

**Decision**: Start with **CopilotKit Runtime** for fastest POC, migrate to
custom backend in Phase 2 if advanced features required.

### 2.2 CopilotKit Runtime Architecture (Phase 1)

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (form-client-web-app)                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  CopilotKit Provider                                    ││
│  │    - WebSocket connection to runtime                    ││
│  │    - Auto-retry on disconnect                           ││
│  └──────────────────────────┬──────────────────────────────┘│
└─────────────────────────────┼────────────────────────────────┘
                              │ ws://localhost:4000
                              ▼
┌─────────────────────────────────────────────────────────────┐
│        CopilotKit Runtime (Node.js/Next.js API Route)       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  /api/copilot/runtime                                   ││
│  │    - WebSocket handler                                  ││
│  │    - LLM API client (Anthropic/OpenAI)                  ││
│  │    - Token usage tracking                               ││
│  │    - Streaming response handler                         ││
│  └──────────────────────────┬──────────────────────────────┘│
└─────────────────────────────┼────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             Anthropic Claude API                             │
│  - Claude 3.5 Sonnet (primary)                              │
│  - Claude 3 Haiku (cost optimization)                       │
└─────────────────────────────────────────────────────────────┘
```

**Implementation**:

```typescript
// form-client-web-app/app/api/copilot/runtime/route.ts

import { CopilotRuntime, AnthropicAdapter } from '@copilotkit/runtime';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const copilotRuntime = new CopilotRuntime({
  actions: [], // Actions registered on frontend
  llm: new AnthropicAdapter({
    anthropic,
    model: 'claude-3-5-sonnet-20241022'
  })
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  return copilotRuntime.response(req, { messages });
}
```

### 2.3 Custom FastAPI Backend (Phase 2 - If Needed)

**When to Migrate**:

- Need multi-agent workflows (form filler + validator + analyzer)
- Require advanced token optimization (>60% reduction)
- Want local LLM support (Ollama)
- Need custom streaming protocols
- Require complex business logic

**Architecture**:

```python
# backend-copilot/src/main.py

from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from anthropic import AsyncAnthropic
import asyncio

app = FastAPI(title="CopilotKit Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:64849"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

anthropic = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@app.websocket("/ws/copilot")
async def copilot_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            # Receive message from frontend
            data = await websocket.receive_json()

            # Stream response from Claude
            async with anthropic.messages.stream(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=data["messages"]
            ) as stream:
                async for text in stream.text_stream:
                    await websocket.send_json({
                        "type": "text_delta",
                        "delta": text
                    })

            # Send completion
            await websocket.send_json({
                "type": "message_complete"
            })
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "error": str(e)
        })
    finally:
        await websocket.close()

@app.post("/api/copilot/chat")
async def chat(request: ChatRequest):
    """Non-streaming chat endpoint"""
    response = await anthropic.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=request.messages
    )

    return {
        "content": response.content[0].text,
        "usage": {
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens
        }
    }

@app.post("/api/copilot/vision")
async def vision_analysis(request: VisionRequest):
    """Document data extraction with vision model"""
    response = await anthropic.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "url",
                            "url": request.image_url
                        }
                    },
                    {
                        "type": "text",
                        "text": f"Extract structured data from this document: {request.schema}"
                    }
                ]
            }
        ]
    )

    return {
        "extracted_data": response.content[0].text,
        "usage": response.usage
    }
```

### 2.4 WebSocket vs Server-Sent Events

**TDR-002: Streaming Protocol**

| Aspect              | WebSocket        | Server-Sent Events  |
| ------------------- | ---------------- | ------------------- |
| **Bidirectional**   | Yes              | No (unidirectional) |
| **Connection**      | Persistent       | Persistent          |
| **Browser Support** | 98%              | 97%                 |
| **Fallback**        | Manual           | Automatic           |
| **Complexity**      | Medium           | Low                 |
| **Use Case**        | Real-time chat   | Streaming responses |
| **Recommendation**  | ✅ **WebSocket** | SSE as fallback     |

**Decision**: Use **WebSocket** for real-time bidirectional communication, with
SSE fallback for older browsers.

**Implementation**:

```typescript
// packages/formio-copilot/src/utils/websocketClient.ts

export class CopilotWebSocket {
  private ws: WebSocket | null = null;
  private messageQueue: any[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('CopilotKit WebSocket connected');
        this.reconnectAttempts = 0;

        // Send queued messages
        while (this.messageQueue.length > 0) {
          const msg = this.messageQueue.shift();
          this.send(msg);
        }

        resolve();
      };

      this.ws.onerror = error => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.reconnect();
      };
    });
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      // Queue for later
      this.messageQueue.push(data);
    }
  }

  onMessage(callback: (data: any) => void) {
    if (this.ws) {
      this.ws.onmessage = event => {
        const data = JSON.parse(event.data);
        callback(data);
      };
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

    console.log(
      `Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`
    );

    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  close() {
    this.ws?.close();
    this.ws = null;
  }
}
```

---

## 🎨 Section 3: Frontend Integration Strategy

### 3.1 CopilotKit Component Placement

**TDR-003: UI Component Strategy**

| Component          | Placement               | Use Case                 |
| ------------------ | ----------------------- | ------------------------ |
| **CopilotSidebar** | Right side, collapsible | Primary UI (recommended) |
| **CopilotPopup**   | Bottom-right corner     | Minimal intrusion        |
| **Inline Chat**    | Within form container   | Contextual assistance    |
| **Headless**       | No UI, programmatic     | Custom UI implementation |

**Decision**: Use **CopilotSidebar** as primary UI, with **headless mode** for
custom implementations.

```typescript
// form-client-web-app/src/pages/CopilotFormViewer.tsx

import { CopilotKit } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'
import '@copilotkit/react-ui/styles.css'
import { FormioForm } from '@formio/react'
import { useCopilotForm } from '@formio/copilot'

export function CopilotFormViewer({ formId }: { formId: string }) {
  const { schema, onSubmit } = useFormConfig(formId)
  const [formInstance, setFormInstance] = useState(null)

  // Register CopilotKit hooks
  useCopilotForm(formInstance)

  return (
    <CopilotKit
      runtimeUrl="/api/copilot/runtime"
      showDevConsole={process.env.NODE_ENV === 'development'}
    >
      <div className="flex h-screen">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-6">{schema.title}</h1>

          <FormioForm
            form={schema}
            onSubmit={onSubmit}
            onFormReady={(instance) => setFormInstance(instance)}
          />
        </div>

        {/* AI Assistant Sidebar */}
        <CopilotSidebar
          instructions={`You are an AI assistant helping users fill out forms.

Guidelines:
- Extract structured data from user's natural language
- Ask clarifying questions when needed
- Validate inputs and suggest corrections
- Guide users through multi-step forms
- Be concise and helpful

Available actions:
- fillFormFields: Update form fields with extracted data
- validateForm: Check form validity
- submitForm: Submit completed form (only when user requests)`}

          labels={{
            title: "Form Assistant",
            initial: "Hi! I can help you fill out this form. Just tell me the information and I'll fill it in for you.",
            placeholder: "Tell me about your information..."
          }}

          defaultOpen={true}
          clickOutsideToClose={false}
        />
      </div>
    </CopilotKit>
  )
}
```

### 3.2 Form.io Lifecycle Integration

```typescript
// packages/formio-copilot/src/adapters/FormioAdapter.ts

export class FormioLifecycleAdapter {
  private formInstance: any;
  private changeUnsubscribe: (() => void) | null = null;

  constructor(formInstance: any) {
    this.formInstance = formInstance;
    this.attachLifecycle();
  }

  private attachLifecycle() {
    // Listen to form changes
    const handleChange = (event: any) => {
      // Notify CopilotKit of state change
      this.notifyStateChange({
        changed: event.changed,
        data: event.data
      });
    };

    this.formInstance.on('change', handleChange);

    this.changeUnsubscribe = () => {
      this.formInstance.off('change', handleChange);
    };
  }

  private notifyStateChange(change: any) {
    // Dispatch custom event for CopilotKit hooks to listen
    window.dispatchEvent(
      new CustomEvent('formio:change', {
        detail: change
      })
    );
  }

  destroy() {
    this.changeUnsubscribe?.();
  }
}

// In useCopilotForm hook
useEffect(() => {
  const handleStateChange = (event: CustomEvent) => {
    // Update CopilotKit readable context
    setFormData(event.detail.data);
  };

  window.addEventListener('formio:change', handleStateChange);
  return () => window.removeEventListener('formio:change', handleStateChange);
}, []);
```

---

## 🚀 Section 4: Feature Specifications

(To be continued in COPILOT_FEATURES_SPEC.md - this document is already
extensive)

### Feature Summary

1. **Conversational Form Filling** - Extract data from natural language
2. **Document Data Extraction** - Vision model for invoices/receipts
3. **Smart Validation** - AI-powered error correction
4. **Multi-Step Wizard** - Guided navigation
5. **File Upload Assistance** - Geolocation prompts, image analysis
6. **Historical Data** - Prefill from previous submissions
7. **Voice Input/Output** - Accessibility
8. **Batch Operations** - Test data generation

**See COPILOT_FEATURES_SPEC.md for detailed specifications.**

---

## 💰 Section 5: Cost Analysis & Optimization

### 5.1 Token Usage Breakdown

**Average Form (15 fields)**:

| Component     | Input Tokens | Output Tokens | Cost (Claude 3.5) |
| ------------- | ------------ | ------------- | ----------------- |
| System Prompt | 150          | -             | $0.00045          |
| Form Schema   | 600          | -             | $0.0018           |
| Current Data  | 300          | -             | $0.0009           |
| User Message  | 100          | -             | $0.0003           |
| AI Response   | -            | 200           | $0.003            |
| **Total**     | **1,150**    | **200**       | **$0.00525**      |

**Optimization Strategies**:

1. **Schema Compression** (40% reduction)
   - Send only field keys, not full labels
   - Remove redundant metadata
   - **Savings**: $0.0007/request

2. **Context Pruning** (30% reduction)
   - Only send current wizard step, not all steps
   - **Savings**: $0.0005/request

3. **Model Selection** (70% cost reduction)
   - Use Claude 3 Haiku for simple tasks
   - **Savings**: $0.0035/request

**Optimized Cost**: **$0.0015-0.0025/request**

### 5.2 Monthly Cost Projections

| Volume        | Unoptimized | Optimized  | Annual Cost  |
| ------------- | ----------- | ---------- | ------------ |
| 1,000 forms   | $5.25       | $1.50-2.50 | $18-30       |
| 10,000 forms  | $52.50      | $15-25     | $180-300     |
| 100,000 forms | $525        | $150-250   | $1,800-3,000 |

**See COPILOT_COST_ANALYSIS.md for detailed cost modeling.**

---

## 🔒 Section 6: Security & Compliance

### 6.1 PII Protection

**PII Detection Strategy**:

```typescript
// packages/formio-copilot/src/utils/piiMasker.ts

const PII_PATTERNS = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g
};

export function maskPII(text: string): {
  masked: string;
  detectedTypes: string[];
} {
  let masked = text;
  const detected = [];

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    if (pattern.test(text)) {
      masked = masked.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
      detected.push(type);
    }
  }

  return { masked, detectedTypes: detected };
}
```

**Field-Level PII Configuration**:

```typescript
// Mark sensitive fields in form schema
const schema = {
  components: [
    {
      key: 'ssn',
      type: 'textfield',
      label: 'Social Security Number',
      sensitive: true, // ← Flag for PII masking
      excludeFromAI: true // ← Never send to LLM
    }
  ]
};
```

### 6.2 Rate Limiting

```python
# backend-copilot/src/middleware/rate_limiting.py

from fastapi import HTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/copilot/chat")
@limiter.limit("50/minute")  # 50 requests per minute per IP
async def chat(request: Request, chat_request: ChatRequest):
    # ... implementation
    pass
```

---

## 📈 Section 7: Performance Targets

| Metric              | Target  | Measurement       |
| ------------------- | ------- | ----------------- |
| Bundle Size         | < 85 KB | Webpack analysis  |
| Page Load Impact    | < 500ms | Lighthouse        |
| First Token Latency | < 500ms | Custom timer      |
| Full Response Time  | < 2s    | E2E test          |
| Memory Overhead     | < 15 MB | Chrome DevTools   |
| Error Rate          | < 1%    | Sentry monitoring |

---

## 📝 Section 8: Implementation Phases

**Phase 1: POC (Weeks 1-4)** - CopilotKit Runtime + Basic Features  
**Phase 2: Production (Weeks 5-8)** - Security + Testing + Deployment  
**Phase 3: Advanced (Weeks 9-12)** - Vision + Voice + Multi-Agent

**See COPILOT_IMPLEMENTATION_PLAN.md for week-by-week tasks.**

---

## ✅ Next Steps

1. **Review**: Gemini reviews architecture
2. **Approve**: Get stakeholder approval for Phase 1
3. **Setup**: Install dependencies, configure environment
4. **Implement**: Follow COPILOT_IMPLEMENTATION_PLAN.md

**Questions?**: See COPILOT_DECISIONS.md for Technical Decision Records.
