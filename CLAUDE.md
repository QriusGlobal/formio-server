# Claude Code Configuration - Form.io Monorepo

**Version:** 2.1.0
**Last Updated:** October 3, 2025
**Repository:** Form.io Multi-Project Monorepo
**Tech Stack:** TypeScript, React 19, Node.js, Express, MongoDB, Vite, **Bun 1.2.23+**
**Package Manager:** **Bun** (NOT npm, yarn, or pnpm)

---

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently, not just MCP

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool (Claude Code)**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 🎯 CRITICAL: Claude Code Task Tool for Agent Execution

**Claude Code's Task tool is the PRIMARY way to spawn agents:**
```javascript
// ✅ CORRECT: Use Claude Code's Task tool for parallel agent execution
[Single Message]:
  Task("Research agent", "Analyze requirements and patterns...", "researcher")
  Task("Coder agent", "Implement core features...", "coder")
  Task("Tester agent", "Create comprehensive tests...", "tester")
  Task("Reviewer agent", "Review code quality...", "reviewer")
  Task("Architect agent", "Design system architecture...", "system-architect")
```

**MCP tools are ONLY for coordination setup:**
- `mcp__claude-flow__swarm_init` - Initialize coordination topology
- `mcp__claude-flow__agent_spawn` - Define agent types for coordination
- `mcp__claude-flow__task_orchestrate` - Orchestrate high-level workflows

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/formio/src` - Server source code
- `/formio-core/src` - Core library source
- `/formio-react/src` - React components
- `/packages/formio-file-upload/src` - File upload module
- `/test-app/src` - Test application code
- `/tests` - E2E test files
- `/docs` - Documentation and markdown files
- `/infrastructure` - Docker, CI/CD configs

---

## 🔧 Package Manager: Bun (MANDATORY)

**CRITICAL: This project exclusively uses Bun as the package manager and runtime**

### Why Bun?

- ⚡ **3-10x faster** than npm/yarn/pnpm for installs and script execution
- 🔒 **Built-in lockfile** (`bun.lockb`) - faster than package-lock.json
- 🎯 **Drop-in replacement** for npm/yarn with 100% compatibility
- 📦 **Native TypeScript** support - no ts-node needed
- 🧪 **Built-in test runner** (alternative to Vitest)
- 🚀 **Faster cold starts** and script execution
- 💾 **Lower memory usage** than Node.js

### Mandatory Command Reference

**ALWAYS use `bun` instead of `npm`, `yarn`, or `pnpm`:**

| Task | ❌ WRONG (npm/yarn) | ✅ CORRECT (Bun) |
|------|---------------------|------------------|
| Install dependencies | `npm install` | `bun install` |
| Install specific package | `npm install react` | `bun add react` |
| Remove package | `npm uninstall react` | `bun remove react` |
| Run script | `npm run dev` | `bun run dev` |
| Run tests | `npm test` | `bun test` |
| Execute TypeScript | `npx tsx script.ts` | `bun run script.ts` |
| Execute JavaScript | `node script.js` | `bun run script.js` |
| Run executable | `npx playwright test` | `bun playwright test` |
| Update dependencies | `npm update` | `bun update` |

### Test Execution with Bun

**Playwright E2E Tests:**
```bash
bun run test:e2e                    # All E2E tests
bun run test:e2e:ui                 # Playwright UI
bun playwright test                 # Direct Playwright execution
bun playwright test --grep "pattern" # Filtered tests
bun playwright test --debug         # Debug mode
bun playwright show-report          # View HTML report
```

**Vitest Unit/Integration Tests:**
```bash
bun test                            # All tests
bun test --watch                    # Watch mode
bun test --coverage                 # Coverage report
bun test path/to/test.ts           # Specific test file
```

**Bun Native Test Runner (Alternative to Vitest):**
```bash
bun test                            # Uses bun:test if configured
bun test --watch                    # Watch mode
bun test --bail                     # Stop on first failure
```

### Package Installation

**Initial Setup:**
```bash
# Install all dependencies
bun install

# Install specific package
bun add react@19.0.0

# Install dev dependency
bun add -d @types/node

# Install global package
bun add -g typescript
```

**Speed Comparison:**
- `npm install`: ~45 seconds
- `yarn install`: ~35 seconds
- `bun install`: **~5 seconds** (9x faster!)

---

## 📊 Monorepo Overview

### Executive Summary

**Repository Type**: Multi-project monorepo combining Form.io server, core rendering library, React components, and file upload functionality
**Primary Language**: TypeScript/JavaScript (720 source files)
**Architecture**: Microservices-oriented with shared packages and independent deployments
**Status**: Active development with recent file upload integration ✅

### Monorepo Structure

```
formio-monorepo/
├── formio/                    # Form.io server (Express + MongoDB)
│   ├── src/                   # Server source code
│   │   ├── models/           # Data models (Form, Submission, Action, Role)
│   │   ├── resources/        # API endpoints (CRUD operations)
│   │   ├── actions/          # Workflow engine (Email, Webhook, Login)
│   │   ├── middleware/       # Request processing (39 middleware files)
│   │   ├── util/             # Utilities (email, validation, swagger)
│   │   └── db/               # Database & migrations (25 versions)
│   ├── test/                 # 11+ test files (13,000+ lines)
│   └── portal/               # Admin portal UI
│
├── formio-core/               # Core rendering framework
│   ├── src/                  # TypeScript source
│   ├── lib/                  # Compiled JavaScript output
│   └── dist/                 # Webpack browser bundles
│
├── formio-react/              # React component library
│   ├── src/                  # React TypeScript source
│   └── lib/                  # Built ES modules + CSS
│
├── packages/
│   └── formio-file-upload/   # TUS/Uppy file upload module
│       ├── src/
│       │   ├── components/   # TusFileUpload, UppyFileUpload
│       │   ├── providers/    # FileStorageProvider
│       │   ├── validators/   # File validation rules
│       │   └── templates/    # HTML templates
│       ├── lib/              # Compiled output
│       └── dist/             # Browser bundles
│
├── test-app/                  # Vite + React 19 testing app
│   ├── src/
│   │   ├── pages/            # FormioSubmissionTest
│   │   ├── components/       # Demo components
│   │   └── config/           # Uppy configuration
│   └── tests/                # Vitest + Playwright tests
│
├── tests/                     # Shared E2E test suite
│   ├── integration/          # Integration tests
│   ├── performance/          # Performance tests
│   └── visual/               # Visual regression tests
│
├── dss-formio-service/        # DSS integration service
└── infrastructure/            # Docker, CI/CD, deployment
```

---

## 📦 Core Packages Inventory

### 1. Form.io Server (`/formio`)

**Version:** 4.5.2
**Type:** Backend API server
**License:** OSL-3.0
**Node.js:** >=20.0.0 required

**Main Entry Points:**
- `/formio/index.js:31` - Core router factory
- `/formio/server.js:17` - Express app configuration
- `/formio/install.js` - Database setup & initialization
- `/formio/src/db/index.js:819` - MongoDB connection management

**Key Dependencies:**
```json
{
  "@formio/core": "2.5.1",
  "@formio/js": "5.2.1",
  "@formio/vm": "2.0.0",
  "express": "^4.20.0",
  "mongoose": "^8.11.0",
  "mongodb": "^6.13.1",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3"
}
```

**Bun Scripts:**
```bash
bun start              # Start server (production)
bun run start:dev      # Start with nodemon
bun test               # Run Mocha test suite
bun run build:vm       # Build VM bundle
```

**Core Models** (`/formio/src/models/`):
- `Form.js:264` - Form schema, validation, component keys
- `Submission.js:109` - Submission data model
- `Action.js:131` - Workflow action model
- `Role.js:79` - User roles and permissions
- `Token.js:69` - JWT token management

**Action System** (`/formio/src/actions/`):
- `actions.js:949` - Main action orchestrator
- `EmailAction.js:302` - Email notifications
- `LoginAction.js:324` - Authentication workflows
- `WebhookAction.js:263` - External webhook triggers
- `SaveSubmission.js:296` - Submission persistence

**Request Flow:**
```
Express Router (/index.js:31)
  ↓
Middleware Chain (/src/middleware/)
  ↓
Resource Handler (/src/resources/)
  ↓
Model Layer (/src/models/)
  ↓
MongoDB Database (/src/db/)
```

---

### 2. Form.io Core (`/formio-core`)

**Version:** 2.5.1
**Type:** TypeScript rendering framework
**License:** MIT
**Build:** TypeScript → JavaScript (lib/) + Webpack bundles (dist/)

**Main Entry Points:**
- `/formio-core/src/index.ts` - Main entry point
- `/formio-core/lib/index.js` - Compiled output
- `/formio-core/dist/formio.core.min.js` - Browser bundle

**Package Exports:**
```json
{
  ".": "./lib/index.js",
  "./utils": "./lib/utils/index.js",
  "./sdk": "./lib/sdk/index.js",
  "./process": "./lib/process/index.js",
  "./types": "./lib/types/index.js",
  "./experimental": "./lib/experimental/index.js",
  "./error": "./lib/error/index.js"
}
```

**Core Dependencies:**
```json
{
  "browser-cookies": "^1.2.0",
  "dayjs": "^1.11.12",
  "dompurify": "^3.2.4",
  "eventemitter3": "^5.0.0",
  "inputmask": "5.0.9",
  "json-logic-js": "^2.0.5",
  "lodash": "^4.17.21"
}
```

**Build Process:**
```bash
bun run build
  ↓
bun run clean &&
gulp templates &&
bun run docs &&
bun run lib (tsc) &&
bun run alias (tsc-alias) &&
bun run build:dev (webpack) &&
bun run build:prod (webpack)
```

**Test Coverage:**
- Statements: 64%
- Branches: 55%
- Functions: 60%
- Lines: 63%

---

### 3. Form.io React (`/formio-react`)

**Version:** 6.1.0
**Type:** React component library (ESM)
**License:** MIT
**Module Type:** ES Module

**Main Entry Points:**
- `/formio-react/src/index.ts` - Main exports
- `/formio-react/lib/index.js` - Built output
- `/formio-react/lib/index.d.ts` - TypeScript definitions

**Core Features:**
- React renderer for Form.io forms
- Uppy file upload integration
- TUS resumable upload support
- CSS styling included

**Dependencies:**
```json
{
  "@uppy/core": "^5.0.2",
  "@uppy/dashboard": "^5.0.2",
  "@uppy/golden-retriever": "^5.1.0",
  "@uppy/tus": "^5.0.1",
  "tus-js-client": "^4.3.1"
}
```

**Peer Dependencies:**
```json
{
  "@formio/core": "^2.4.0",
  "@formio/js": "^5.1.1",
  "react": "^15.3.0 || ^16.0.0 || ^17.0.0 || ^18.1.0 || ^19.0.0",
  "react-dom": "^15.3.0 || ^16.0.0 || ^17.0.0 || ^18.1.0 || ^19.0.0"
}
```

**Build Scripts:**
```bash
bun run build
  ↓
rm -rf lib &&
tsc --module ESNext --outDir lib &&
copyfiles -u 1 "src/**/*.css" lib/
```

---

### 4. File Upload Module (`/packages/formio-file-upload`)

**Version:** 1.0.0
**Type:** TypeScript module with dual builds
**License:** MIT
**Status:** ✅ Production Ready (October 2025)

**Package Structure:**
```
packages/formio-file-upload/
├── src/
│   ├── components/
│   │   ├── TusFileUpload/
│   │   │   ├── Component.ts        # 11KB - TUS resumable upload
│   │   │   └── index.ts
│   │   └── UppyFileUpload/
│   │       ├── Component.ts        # 12KB - Uppy dashboard UI
│   │       └── index.ts
│   ├── providers/
│   │   └── FileStorageProvider.ts  # Storage abstraction
│   ├── validators/
│   │   └── index.ts                # File validation rules
│   ├── templates/
│   │   └── index.ts                # HTML templates
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   └── index.ts                    # Main entry point
├── lib/                            # TypeScript compiled output
├── dist/                           # Rollup browser bundles
└── package.json
```

**Module Exports:**
```typescript
// src/index.ts:19-24
const FormioFileUploadModule = {
  components: {
    tusupload: TusFileUploadComponent,
    uppyupload: UppyFileUploadComponent
  }
};
export default FormioFileUploadModule;
```

**Key Integration** (`Component.ts:275-305`):
```typescript
onSuccess: () => {
  const fileData = {
    name: uploadFile.name,
    size: uploadFile.size,
    type: uploadFile.type,
    url: uploadFile.url,
    storage: 'tus',
    uploadId: uploadFile.uploadId
  };

  if (this.component.multiple) {
    this.dataValue = [...(this.dataValue || []), fileData];
  } else {
    this.dataValue = fileData;
  }

  this.updateValue();
  this.triggerChange();
}
```

**Data Flow (✅ Working):**
```
File Upload Success
  ↓
Create fileData { name, size, type, url, storage }
  ↓
Update this.dataValue (single or array)
  ↓
Call this.updateValue()
  ↓
Call this.triggerChange()
  ↓
Form receives data ✅
  ↓
Form submission includes file URLs ✅
```

**Build Output:**
```
dist/formio-file-upload.min.js       # Browser bundle
lib/index.js                         # CommonJS
lib/index.esm.js                     # ES Module
lib/index.d.ts                       # TypeScript definitions
```

**Dependencies:**
```json
{
  "@uppy/audio": "^3.0.1",
  "@uppy/core": "^5.0.2",
  "@uppy/dashboard": "^5.0.2",
  "@uppy/screen-capture": "^5.0.1",
  "@uppy/tus": "^5.0.1",
  "@uppy/webcam": "^5.0.1",
  "tus-js-client": "^4.3.1"
}
```

**Status Reference:** See `/docs/INTEGRATION_STATUS.md` for complete integration details

---

### 5. Test App (`/test-app`)

**Version:** 0.0.1
**Type:** Vite + React 19 development app
**Purpose:** Local testing and development
**Port:** 64849

**Vite Configuration:**
```typescript
// vite.config.ts
{
  server: {
    port: 64849,
    strictPort: true,
    proxy: {
      '/form': 'http://localhost:3001',
      '/project': 'http://localhost:3001'
    }
  }
}
```

**Source Files:**
```
test-app/src/
├── App.tsx                          # Main application
├── main.tsx                         # Entry point
├── pages/
│   └── FormioSubmissionTest.tsx    # ✅ Integration test page
├── components/
│   ├── ErrorBoundary.tsx
│   └── FeatureComparison.tsx
└── config/
    └── uppy-config.ts
```

**Local Dependencies:**
```json
{
  "@formio/react": "file:../formio-react",
  "@formio/file-upload": "file:../packages/formio-file-upload",
  "@formio/js": "^5.2.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

**Development Scripts:**
```bash
bun run dev                # Start dev server (port 64849)
bun run build              # Production build
bun test                   # Vitest unit tests
bun run test:e2e           # Playwright E2E tests
bun run test:coverage      # Coverage report
```

---

### 6. E2E Test Suite (`/tests`)

**Version:** 1.0.0
**Type:** Playwright test framework
**Purpose:** Comprehensive E2E testing with GCS integration

**Test Scripts:**
```json
{
  "test:e2e": "playwright test",
  "test:visual": "playwright test --config visual/playwright.config.ts",
  "test:integration": "node integration/test-runner.ts",
  "test:debug": "playwright test --debug",
  "test:ui": "playwright test --ui"
}
```

**Dependencies:**
```json
{
  "@playwright/test": "^1.40.0",
  "@faker-js/faker": "^8.4.0",
  "axios": "^1.6.0",
  "typescript": "^5.3.0"
}
```

**GCS Emulator:**
```bash
docker run -d -p 4443:4443 --name gcs-emulator fsouza/fake-gcs-server
```

---

## 🔧 Development Workflows

### Local Development Setup

**1. Infrastructure Setup:**
```bash
# Start MongoDB and Form.io server
docker-compose -f docker-compose.test.yml up -d

# Or start services individually
docker-compose -f docker-compose.test.yml up -d mongodb
cd formio && bun run start:dev
```

**2. Start Test App:**
```bash
cd test-app
bun install
bun run dev
# Opens at http://localhost:64849
```

**3. Build Packages (when making changes):**
```bash
# Build file upload module
cd packages/formio-file-upload
bun run build

# Build React library
cd formio-react
bun run build

# Build core library
cd formio-core
bun run build
```

**4. Clear Vite Cache (if stale):**
```bash
rm -rf test-app/node_modules/.vite
```

### Monorepo Package Linking

**Local file linking for fast development:**
```json
// test-app/package.json
{
  "@formio/react": "file:../formio-react",
  "@formio/file-upload": "file:../packages/formio-file-upload"
}
```

**Advantages:**
- Changes immediately reflected with rebuilds
- No need for npm publish during development
- Faster iteration cycles

---

## 🧪 Testing Strategy

### Test Distribution

**Form.io Server Tests** (`/formio/test/`):
- `form.js` - 5,657 lines (Form API tests)
- `submission.js` - 5,772 lines (Submission tests)
- `actions.js` - 5,998 lines (Workflow tests)
- `submission-access.js` - 11,155 lines (Access control tests)
- `auth.js` - 1,958 lines (Authentication tests)
- **Total:** 11+ major test files, 13,000+ lines

**Test App E2E** (`/test-app/tests/e2e/`):
- `formio-integration.spec.ts` - 7 comprehensive tests
- Tags: `@tus`, `@uppy`, `@edge`, `@visual`

**E2E Infrastructure** (`/tests/`):
- Playwright configuration
- Faker.js for test data
- GCS emulator integration
- Visual regression testing

### Test Commands

```bash
# Form.io Server
cd formio
bun test                           # Full Mocha suite

# Test App
cd test-app
bun test                           # Vitest unit tests
bun run test:e2e                   # Playwright E2E
bun run test:e2e:formio            # Form.io integration tests
bun run test:coverage              # Coverage report

# E2E Suite
cd tests
bun run test:all                   # All tests
bun run test:debug                 # Debug mode
bun run test:ui                    # Playwright UI
```

---

## 🚀 Deployment Strategy

### Recommended Platform: Cloudflare Pages

**Reference:** `/docs/DEPLOYMENT_OPTIMIZATION_SPEC.md` (1,430 lines)

**Key Advantages:**
- ✅ Free unlimited bandwidth (vs Vercel's 100GB/mo)
- ✅ 300+ global edge locations (vs Vercel's 100+)
- ✅ No bundle size limits for Pages
- ✅ Superior DDoS protection included
- ✅ Automatic Brotli compression
- ✅ $0/month cost (vs Vercel's $20/mo minimum)

**Compression Strategy:**
```
Web Delivery: Brotli (auto-enabled)
CI/CD Artifacts: zstd (GitHub Actions)
Docker Layers: zstd (Docker 20+)
Never: zstd for HTTP (0% browser support)
```

**Code-Splitting Configuration** (`vite.config.ts`):
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('node_modules/react')) return 'vendor-react';
        if (id.includes('node_modules/@formio')) return 'vendor-formio';
        if (id.includes('node_modules/@uppy')) return 'vendor-uppy';
        if (id.includes('node_modules')) return 'vendor-libs';
      }
    }
  }
}
```

**Expected Bundle Sizes (Brotli compressed):**
- vendor-react: 130KB (React + ReactDOM)
- vendor-formio: 250KB (Form.io libraries)
- vendor-uppy: 150KB (Uppy + TUS)
- vendor-libs: 100KB (misc dependencies)
- app code: 50KB (application logic)
- **Total:** ~680KB initial load

**Cache Efficiency:**
- Code update: Only 50KB downloaded (93.75% cached)
- React update: Only 130KB downloaded (83.75% cached)

---

## 🎯 Quick Navigation Guide

### For New Developers

**Understanding the Codebase:**
1. Start with `/formio/index.js:31` - Main router entry point
2. Review `/formio/src/models/Form.js:264` - Form schema
3. Explore `/formio/src/resources/Validator.js:380` - Validation engine
4. Check `/formio/src/actions/actions.js:949` - Workflow orchestrator

**Working with File Uploads:**
1. Component: `/packages/formio-file-upload/src/components/TusFileUpload/Component.ts`
2. Integration: `/docs/INTEGRATION_STATUS.md`
3. Test Page: `/test-app/src/pages/FormioSubmissionTest.tsx`
4. E2E Tests: `/test-app/tests/e2e/formio-integration.spec.ts`

**Making Changes:**
1. Edit source in `/packages/formio-file-upload/src/`
2. Build: `cd packages/formio-file-upload && bun run build`
3. Clear cache: `rm -rf test-app/node_modules/.vite`
4. Test: `cd test-app && bun run dev`

---

## 🛠️ SPARC Development Methodology

### SPARC Commands

**Core Commands:**
```bash
npx claude-flow sparc modes                    # List available modes
npx claude-flow sparc run <mode> "<task>"      # Execute specific mode
npx claude-flow sparc tdd "<feature>"          # Run complete TDD workflow
npx claude-flow sparc info <mode>              # Get mode details
```

**Batchtools Commands:**
```bash
npx claude-flow sparc batch <modes> "<task>"                # Parallel execution
npx claude-flow sparc pipeline "<task>"                     # Full pipeline
npx claude-flow sparc concurrent <mode> "<tasks-file>"      # Multi-task
```

### SPARC Workflow Phases

1. **Specification** - Requirements analysis (`sparc run spec-pseudocode`)
2. **Pseudocode** - Algorithm design (`sparc run spec-pseudocode`)
3. **Architecture** - System design (`sparc run architect`)
4. **Refinement** - TDD implementation (`sparc tdd`)
5. **Completion** - Integration (`sparc run integration`)

---

## 🚀 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`, `analyst`, `code-analyzer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`, `queen-coordinator`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`, `Performance Monitor`, `Topology Optimizer`, `Resource Allocator`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`, `release-swarm`, `sync-coordinator`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `base-template-generator`, `production-validator`

### Testing & Validation
`tdd-london-swarm`, `production-validator`

---

## 🎯 Claude Code vs MCP Tools

### Claude Code Handles ALL EXECUTION:
- **Task tool**: Spawn and run agents concurrently for actual work
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation and programming
- Bash commands and system operations
- Implementation work
- Project navigation and analysis
- TodoWrite and task management
- Git operations
- Package management
- Testing and debugging

### MCP Tools ONLY COORDINATE:
- Swarm initialization (topology setup)
- Agent type definitions (coordination patterns)
- Task orchestration (high-level planning)
- Memory management
- Neural features
- Performance tracking
- GitHub integration

**KEY**: MCP coordinates the strategy, Claude Code's Task tool executes with real agents.

---

## 📋 Agent Coordination Protocol

### Every Agent Spawned via Task Tool MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

---

## 🎯 Concurrent Execution Examples

### ✅ CORRECT WORKFLOW: MCP Coordinates, Claude Code Executes

```javascript
// Step 1: MCP tools set up coordination (optional, for complex tasks)
[Single Message - Coordination Setup]:
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }

// Step 2: Claude Code Task tool spawns ACTUAL agents that do the work
[Single Message - Parallel Agent Execution]:
  Task("Research agent", "Analyze API requirements...", "researcher")
  Task("Coder agent", "Implement REST endpoints...", "coder")
  Task("Database agent", "Design database schema...", "code-analyzer")
  Task("Tester agent", "Create comprehensive tests...", "tester")
  Task("Reviewer agent", "Review code quality...", "reviewer")

  // Batch ALL todos in ONE call
  TodoWrite { todos: [
    {content: "Research API patterns", activeForm: "Researching API patterns", status: "in_progress"},
    {content: "Design database schema", activeForm: "Designing database schema", status: "in_progress"},
    {content: "Implement authentication", activeForm: "Implementing authentication", status: "pending"},
    {content: "Build REST endpoints", activeForm: "Building REST endpoints", status: "pending"},
    {content: "Write unit tests", activeForm: "Writing unit tests", status: "pending"},
    {content: "Integration tests", activeForm: "Running integration tests", status: "pending"},
    {content: "API documentation", activeForm: "Creating API documentation", status: "pending"},
    {content: "Performance optimization", activeForm: "Optimizing performance", status: "pending"}
  ]}

  // Parallel file operations
  Read("formio/src/models/Form.js")
  Read("formio/src/resources/Validator.js")
  Grep("authentication", path="formio/src")
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination and is 6x slower!
```

---

## 📚 Documentation Reference

### Core Documentation
- **CLAUDE.md** - This file (project configuration)
- **LOCAL_DEVELOPMENT.md** - Local setup guide
- **CICD_SUMMARY.md** - CI/CD pipeline documentation
- **DEPLOYMENT_OPTIMIZATION_SPEC.md** - Vercel vs Cloudflare Pages analysis (1,430 lines)
- **INTEGRATION_STATUS.md** - File upload integration status (255 lines)

### Phase Documentation
- **PHASE_0_COMPLETE.md** - Initial setup completion
- **PHASE_0_FINAL.md** - Phase 0 final report
- **PHASE_1_COMPLETE.md** - Phase 1 completion

### Subproject READMEs
- `/formio/README.md` - Server documentation
- `/test-app/README.md` - Test app guide
- `/tests/README.md` - E2E test documentation
- `/formio/test/README-FILE-UPLOAD-TESTS.md` - File upload test guide

---

## 🎉 Recent Achievements

✅ **Production-Ready File Upload** - Complete TUS/Uppy integration with Form.io
✅ **Comprehensive Documentation** - 1,430+ lines of deployment specs
✅ **E2E Test Suite** - 7 integration tests with Playwright
✅ **Optimized Build** - Code-splitting strategy for 93% cache efficiency
✅ **Dark Mode UI** - Mobile-responsive dark theme
✅ **Monorepo Structure** - Clear separation of concerns with local linking

---

## 📈 Performance Benefits

- **84.8% SWE-Bench solve rate** with SPARC + Claude Flow
- **32.3% token reduction** via parallel operations
- **2.8-4.4x speed improvement** with concurrent execution
- **27+ neural models** for pattern recognition
- **80% reduction** in analysis time using batched tool calls

---

## 🔗 MCP Server Setup

### Quick Setup

```bash
# Required: Claude Flow for SPARC and coordination
claude mcp add claude-flow npx claude-flow@alpha mcp start

# Optional: Enhanced coordination features
claude mcp add ruv-swarm npx ruv-swarm mcp start

# Optional: Cloud features (requires registration)
claude mcp add flow-nexus npx flow-nexus@latest mcp start
```

### MCP Tool Categories

**Coordination:**
`swarm_init`, `agent_spawn`, `task_orchestrate`

**Monitoring:**
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

**Memory & Neural:**
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

**GitHub Integration:**
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

**System:**
`benchmark_run`, `features_detect`, `swarm_monitor`

---

## 🏗️ Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated with changes
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow project configurations
- **Prettier**: Auto-format on save

---

## 📞 Support Resources

**Primary Documentation:**
- GitHub: https://github.com/formio/formio
- Form.io Docs: https://help.form.io
- React Library: https://github.com/formio/react

**Community:**
- Issues: https://github.com/formio/formio/issues
- Discussions: GitHub Discussions
- Stack Overflow: #formio tag

**Claude Flow:**
- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Flow-Nexus Platform: https://flow-nexus.ruv.io

---

## 📝 Important Instruction Reminders

**Do what has been asked; nothing more, nothing less.**

1. NEVER create files unless absolutely necessary for achieving the goal
2. ALWAYS prefer editing an existing file to creating a new one
3. NEVER proactively create documentation files (*.md) unless explicitly requested
4. NEVER save working files, text/mds, and tests to the root folder
5. ALWAYS batch operations in a single message for maximum efficiency
6. USE TodoWrite with 5-10+ todos minimum for task tracking
7. USE Task tool (Claude Code) for ALL agent execution
8. MCP tools are ONLY for coordination setup, NOT execution
9. **ALWAYS use Bun** for package management and script execution (NOT npm/yarn/pnpm)

---

**Remember: Claude Flow coordinates, Claude Code creates, Bun executes!**

**Last Updated:** October 3, 2025
**Version:** 2.1.0
**Package Manager:** Bun 1.2.23+
**Codebase Maturity:** Production-ready with active development
**Total Source Files:** 720 TypeScript/JavaScript files
**Primary Focus:** Form.io ecosystem with file upload integration
