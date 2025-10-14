# Claude Code Instructions - Form.io Monorepo

> **AI Assistant Guide**: Comprehensive codebase context and development
> patterns for effective assistance with the Form.io monorepo.

---

## 🚨 CRITICAL: Package Manager Requirement

**MANDATORY**: This project uses **pnpm ONLY**. Do not use npm.

**Why pnpm?**

- **3x faster** than npm for installs
- **Workspace protocol** support (workspace:\*)
- **Strict dependency resolution** prevents phantom dependencies
- **Disk space efficiency** with content-addressable storage
- **Monorepo-optimized** with proper hoisting

**Commands:**

```bash
# ✅ CORRECT - Always use pnpm
pnpm install
pnpm add -D package-name
pnpm add -w -D package-name  # Add to workspace root
pnpm run lint
pnpm test

# ❌ WRONG - Never use npm
npm install    # Will fail on workspace:* dependencies
npm add        # Slower and creates phantom deps
```

**Installation:**

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm@8.15.0

# Or use corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

**Verification:**

```bash
pnpm --version  # Should show 8.15.0
```

---

## 🎯 Project Identity

**Name**: Form.io Monorepo **Type**: Enterprise form building platform with file
upload capabilities **Primary Language**: TypeScript (ES2020+) **Architecture**:
Monorepo with microservices, React applications, and infrastructure-as-code
**Purpose**: Provide Form.io server, file upload module, React SDK, testing
apps, and cloud deployment tooling

---

## 📐 Monorepo Architecture

### Current Structure

```
formio-monorepo/
├── formio/                      # ✅ ACTIVE - Form.io server v4.5.2 (19MB)
├── formio-core/                 # ✅ ACTIVE - Core framework v2.5.1 (24MB)
├── formio-react/                # ✅ ACTIVE - React SDK v6.1.0 (2MB)
├── dss-formio-service/         # ✅ ACTIVE - GCP Terraform (1.4GB)
├── packages/
│   └── formio-file-upload/     # ✅ ACTIVE - File upload module v1.0.0
├── form-client-web-app/                    # ✅ ACTIVE - React testing app
├── tests/                       # ✅ ACTIVE - E2E test framework
├── docs/                        # ✅ ACTIVE - Documentation
├── scripts/                     # ✅ ACTIVE - Utility scripts
├── nginx/                       # ✅ ACTIVE - Nginx configs
├── .github/workflows/          # ✅ ACTIVE - CI/CD
├── docker-compose.yml          # ✅ ACTIVE - Service orchestration
├── pnpm-workspace.yaml          # ✅ NEW - Workspace configuration
├── turbo.json                   # ✅ NEW - Build orchestration
└── package.json                 # ✅ UPDATED - Root workspace

Total Size: 1.9GB (cleaned from 2.6GB)
```

### Package Boundaries

#### `packages/formio-file-upload/` - File Upload Module

**Status**: ✅ Production-ready **Entry Point**: `src/index.ts` **Exports**:

- `TusFileUploadComponent` - TUS resumable upload component
- `UppyFileUploadComponent` - Uppy.js UI component
- `FileStorageProvider` - Storage abstraction layer
- `registerTemplates()` - Template registration utility
- `registerValidators()` - Validator registration utility

**Key Directories**:

- `src/components/` - Form.io components (TUS, Uppy)
- `src/validators/` - File validation (magic numbers, integrity, sanitization)
- `src/providers/` - Storage provider abstractions
- `src/templates/` - Form.io template definitions
- `src/types/` - TypeScript type definitions
- `src/async/` - Async file processing with BullMQ

**Build Outputs**:

- `lib/index.esm.js` - ES Module (833 KB)
- `lib/index.cjs.js` - CommonJS (833 KB)
- `dist/formio-file-upload.min.js` - UMD (377 KB minified, 111 KB gzipped)

**Dependencies**:

- `@formio/js` (peer) - Form.io core
- `@uppy/core`, `@uppy/dashboard`, `@uppy/tus` - File upload UI
- `tus-js-client` - TUS protocol client
- `xxhash-wasm` - File integrity validation
- React 18/19 (peer) - UI components

**Development Commands**:

```bash
npm run dev        # Watch mode with auto-rebuild
npm run build      # Production build
npm test           # Run all tests
npm run benchmark  # Performance benchmarks
```

#### `form-client-web-app/` - React Testing Application

**Status**: ✅ Active development **Purpose**: Local development and testing
environment **Entry Point**: `src/main.tsx`

**Tech Stack**:

- React 19 with TypeScript
- Vite (dev server + build tool)
- Vitest (unit testing)
- Playwright (E2E testing)
- React Router v7

**Key Files**:

- `src/App.tsx` - Main application with routing
- `src/pages/FormioSubmissionTest.tsx` - Form submission testing
- `src/pages/TusBulkUploadTest.tsx` - Bulk upload testing
- `playwright.config.ts` - E2E test configuration

**Module Integration**:

```typescript
import { Formio } from '@formio/js';
import FormioFileUploadModule from '@formio/file-upload';

// Register module globally
Formio.use(FormioFileUploadModule);
```

**Development Commands**:

```bash
npm run dev              # Start dev server (port 64849)
npm test                 # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Interactive test UI
```

#### `tests/` - E2E Test Framework

**Status**: ✅ Comprehensive test suite **Framework**: Playwright with
TypeScript

**Test Categories**:

- `e2e/` - End-to-end workflow tests
- `integration/` - Service integration tests
- `visual/` - Visual regression tests
- `fixtures/` - Test data and mocks
- `page-objects/` - Page object models
- `reporters/` - Custom test reporters

**Key Patterns**:

- Page Object Model for maintainability
- Fixtures for reusable test data
- Visual regression with baseline snapshots
- Performance metrics collection

---

## 🏗️ Microservices Architecture

### Docker Compose Services

**Core Services** (always running):

1. **MongoDB** (`mongodb:27017`)
   - Database for Form.io data
   - Health check: `mongosh --eval "db.adminCommand('ping')"`

2. **Redis** (`redis:6379`)
   - BullMQ job queue backend
   - LRU cache with 256MB limit

3. **GCS Emulator** (`localhost:4443`)
   - Google Cloud Storage emulator (fsouza/fake-gcs-server)
   - Local development file storage

4. **Form.io Server** (`localhost:3001`)
   - Form CRUD operations
   - Submission handling
   - BullMQ worker for async uploads
   - Environment: See `.env.example`

5. **TUS Server** (`localhost:1080`)
   - Resumable upload protocol server
   - Chunk management
   - Upload directory: `/data/uploads`

**Profile Services**:

- **`--profile dev`**: Adds form-client-web-app container
- **`--profile test`**: Adds Playwright container
- **`--profile full`**: Adds nginx, upload-processor, webhook-handler

### Service Dependencies

```
Test App → Form.io Server → MongoDB
       ↓                   ↓ Redis (BullMQ)
       ↓                   ↓ GCS Emulator
       → TUS Server ───────→ GCS Emulator
```

---

## 💻 Development Patterns

### TypeScript Conventions

**Module System**: ES2020+ with `"type": "module"` in package.json

**Import Patterns**:

```typescript
// ✅ CORRECT - Use module imports
import { Component } from './Component';
import type { Props } from './types';

// ❌ AVOID - CommonJS require
const Component = require('./Component');
```

**Type Exports**:

```typescript
// Always export types separately
export type { FileUploadConfig, ValidationOptions };
export { TusFileUploadComponent };
```

**File Naming**:

- Components: `PascalCase.ts` or `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `index.ts` or `types.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### React Patterns

**Component Structure**:

```typescript
// Functional components with TypeScript
interface Props {
  onUpload: (file: File) => void;
  maxSize?: number;
}

export function FileUpload({ onUpload, maxSize = 10485760 }: Props) {
  // Implementation
}
```

**Form.io Component Registration**:

```typescript
// Form.io only recognizes 'components' property
const FormioModule = {
  components: {
    tusupload: TusFileUploadComponent,
    uppyupload: UppyFileUploadComponent
  }
};

export default FormioModule;
```

### Testing Patterns

**Unit Tests** (Vitest/Jest):

```typescript
import { describe, it, expect } from 'vitest';
import { validateMagicNumbers } from './magicNumbers';

describe('validateMagicNumbers', () => {
  it('should validate PDF files', () => {
    const pdfBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    expect(validateMagicNumbers(pdfBuffer, 'application/pdf')).toBe(true);
  });
});
```

**E2E Tests** (Playwright):

```typescript
import { test, expect } from '@playwright/test';

test('should upload file via TUS', async ({ page }) => {
  await page.goto('/upload');
  await page.setInputFiles('input[type="file"]', 'test.pdf');
  await expect(page.locator('.upload-success')).toBeVisible();
});
```

**Performance Benchmarks**:

```typescript
import Benchmark from 'benchmark';

const suite = new Benchmark.Suite();
suite
  .add('magic number validation', () => {
    validateMagicNumbers(buffer, mimeType);
  })
  .run();
```

### Build System

**Rollup Configuration** (`packages/formio-file-upload/rollup.config.js`):

- ES Module output: `lib/index.esm.js`
- CommonJS output: `lib/index.cjs.js`
- UMD bundle: `dist/formio-file-upload.min.js`
- TypeScript declarations: `lib/index.d.ts`

**Build Targets**:

- **ESM**: Modern bundlers (Vite, Webpack 5+)
- **CJS**: Legacy Node.js applications
- **UMD**: Browser `<script>` tags

---

## 🧪 Testing Strategy

### Test Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  ← Playwright (slow, comprehensive)
        │   (tests/)  │
        └──────┬──────┘
        ┌──────▼────────────┐
        │ Integration Tests │  ← API + DB integration
        └──────┬────────────┘
     ┌──────────▼──────────────┐
     │     Unit Tests          │  ← Vitest/Jest (fast, isolated)
     │ (*.test.ts, *.spec.ts) │
     └─────────────────────────┘
```

### Test Coverage Requirements

- **Unit Tests**: > 80% coverage for core logic
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user workflows
- **Visual Tests**: UI components
- **Performance Tests**: Validation < 5ms, Build < 30s

### Running Tests

**Parallel Execution** (recommended):

```bash
# Run all tests in parallel across packages
npm test

# Package-specific tests
cd packages/formio-file-upload && npm test &
cd form-client-web-app && npm run test:e2e &
wait
```

**Sequential Execution**:

```bash
npm test && cd form-client-web-app && npm run test:e2e
```

### Test Data

**Fixtures** (`tests/fixtures/`, `form-client-web-app/tests/fixtures/`):

- `test-files.ts` - Sample file generators
- `mock-data.ts` - Form definitions
- `test-data-generator.ts` - Dynamic test data

**Best Practice**: Use fixtures for consistent test data across suites.

---

## 🚀 Infrastructure & Deployment

### Local Development

**Makefile Commands** (`Makefile.local`):

```bash
make local-up        # Start all services
make local-down      # Stop services (keep data)
make local-reset     # Delete all data
make local-logs      # View all logs
make form-client-web-app        # Start test application
```

**Docker Compose Profiles**:

```bash
docker-compose up                    # Core services
docker-compose --profile dev up      # + Test app
docker-compose --profile test up     # + Playwright
docker-compose --profile full up     # Full production stack
```

### Environment Configuration

**Key Variables** (`.env`):

```bash
# Database
MONGO_DB_NAME=formioapp
MONGO=mongodb://mongodb:27017/formioapp

# Queue
REDIS_HOST=redis
REDIS_PORT=6379

# Storage
FORMIO_FILES_SERVER=gcs
GCS_BUCKET_NAME=formio-uploads
GCS_PROJECT_ID=formio-project

# Security (CHANGE IN PRODUCTION!)
JWT_SECRET=dev-jwt-secret-change-in-production
DB_SECRET=dev-db-secret-change-in-production

# Async Processing
ENABLE_ASYNC_GCS_UPLOAD=true
BULLMQ_WORKER_CONCURRENCY=3

# CORS
CORS_ORIGIN=http://localhost:64849,http://localhost:3000
```

### Cloud Deployment (Planned)

**GCP Cloud Run** (`dss-formio-service/` - TBD):

- Terraform modules for infrastructure-as-code
- Cloud SQL (PostgreSQL) for production database
- Cloud Storage for file uploads
- Secret Manager for credentials
- Cloud Load Balancing

**Current Status**: 📋 Directory exists but empty - awaiting implementation

---

## 🗺️ Codebase Navigation

### Entry Points

**File Upload Module**:

```
packages/formio-file-upload/src/index.ts
└── Exports: TusFileUploadComponent, UppyFileUploadComponent, FileStorageProvider
```

**Test Application**:

```
form-client-web-app/src/main.tsx
└── App.tsx (routing)
    ├── pages/FormioSubmissionTest.tsx
    └── pages/TusBulkUploadTest.tsx
```

**E2E Tests**:

```
tests/playwright.config.ts
└── tests/e2e/*.spec.ts
```

**Docker Services**:

```
docker-compose.yml
├── Core: mongodb, redis, gcs-emulator, formio-server, tus-server
├── Dev: form-client-web-app
├── Test: playwright
└── Full: nginx, upload-processor, webhook-handler
```

### Configuration Files

| File                       | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `tsconfig.json`            | TypeScript configuration (ES2020, strict mode)        |
| `playwright.config.ts`     | E2E test configuration (form-client-web-app/, tests/) |
| `rollup.config.js`         | Module bundling (file-upload package)                 |
| `docker-compose.yml`       | Service orchestration                                 |
| `.codecontext/config.yaml` | CodeContext MCP settings                              |
| `.env.example`             | Environment variable template                         |
| `.eslintrc.js`             | Linting rules                                         |
| `.prettierrc`              | Code formatting                                       |

### Module Exports

**File Upload Package** (`packages/formio-file-upload/package.json`):

```json
{
  "name": "@formio/file-upload",
  "type": "module",
  "main": "lib/index.cjs.js",
  "module": "lib/index.esm.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "import": "./lib/index.esm.js",
      "types": "./lib/index.d.ts"
    }
  }
}
```

---

## 🔧 Common Development Tasks

### Adding a New File Validator

1. **Create validator** in `packages/formio-file-upload/src/validators/`:

```typescript
// newValidator.ts
export function validateNewCheck(file: File): Promise<boolean> {
  // Implementation
}
```

2. **Add tests**:

```typescript
// newValidator.test.ts
import { describe, it, expect } from 'vitest';
import { validateNewCheck } from './newValidator';

describe('validateNewCheck', () => {
  it('should validate correctly', async () => {
    const file = new File(['test'], 'test.txt');
    expect(await validateNewCheck(file)).toBe(true);
  });
});
```

3. **Export** from `src/validators/index.ts`:

```typescript
export { validateNewCheck } from './newValidator';
```

4. **Register** in validators registry:

```typescript
// src/validators/index.ts
export function registerValidators() {
  Formio.registerValidator('newCheck', validateNewCheck);
}
```

5. **Build and test**:

```bash
npm run build
npm test
```

### Adding a New E2E Test

1. **Create test** in `form-client-web-app/tests/e2e/`:

```typescript
// new-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/new-feature');
    await expect(page.locator('.success')).toBeVisible();
  });
});
```

2. **Run test**:

```bash
npm run test:e2e -- new-feature.spec.ts
```

3. **Debug if needed**:

```bash
npm run test:e2e:debug -- new-feature.spec.ts
```

### Updating Docker Services

1. **Edit** `docker-compose.yml`
2. **Validate**:

```bash
docker-compose config
```

3. **Restart specific service**:

```bash
docker-compose restart formio-server
```

4. **View logs**:

```bash
docker-compose logs -f formio-server
```

### Performance Optimization

**Before optimizing**:

```bash
cd packages/formio-file-upload
npm run benchmark
```

**After changes**:

```bash
npm run benchmark
# Compare results with baseline
```

**Performance Targets**:

- Magic number validation: < 5ms (current: 0.0002ms ✅)
- Filename sanitization: < 1ms (current: 0.0004ms ✅)
- Build time: < 30s (current: 4.71s ✅)
- Test execution: < 5s (current: 1.53s ✅)

---

## ✅ Package Status

### All Packages Active

All packages have been successfully migrated from git submodules to monorepo
packages:

- ✅ `formio/` - **Form.io Server v4.5.2** (19MB, Node.js >=20.0.0)
- ✅ `formio-core/` - **Core Framework v2.5.1** (24MB, TypeScript)
- ✅ `formio-react/` - **React SDK v6.1.0** (2MB, React 18+)
- ✅ `dss-formio-service/` - **GCP Terraform** (1.4GB, production-ready)
- ✅ `packages/formio-file-upload/` - **File Upload Module v1.0.0** (production)

### Migration Complete

**Status**: All git submodules converted to regular packages **Commit**:
`6ae1fb60` - "feat: convert submodules to monorepo packages" **Changes**: 799
files, 217,184 lines of code added **Cleanup**: Removed 1,119 node_modules
directories (saved 1.2GB)

### No Workspace Configuration

**Current**: Each package manages dependencies independently **Issue**: No
shared dependencies, duplicate node_modules **Future**: Add
`pnpm-workspace.yaml` for proper monorepo management

```yaml
# Proposed pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tests'
```

---

## 🎯 AI Assistant Best Practices

### When Working with This Codebase

1. **Always check empty directories** before suggesting code changes
   - `formio/`, `formio-core/`, `formio-react/`, `dss-formio-service/` are EMPTY
   - Suggest using `@formio/js` package instead of `formio-core/`

2. **Respect package boundaries**
   - File upload module is self-contained in `packages/formio-file-upload/`
   - Test app imports from `@formio/file-upload` via local file reference

3. **Use parallel tool execution**
   - Batch Read() calls for multiple files
   - Run independent bash commands in parallel
   - See `batch-mode` slash command for patterns

4. **Follow existing patterns**
   - ES modules with `import/export`
   - TypeScript strict mode
   - Functional React components
   - Form.io module structure (components property)

5. **Test before suggesting**
   - Run `npm test` in affected packages
   - Validate TypeScript with `npm run typecheck`
   - Check build output with `npm run build`

6. **Document changes**
   - Update package README if changing exports
   - Add JSDoc comments for new functions
   - Include usage examples in PRs

### Code Review Checklist

When reviewing or suggesting code:

- [ ] TypeScript types are properly defined
- [ ] Tests added for new functionality
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Performance benchmarks meet targets
- [ ] Documentation updated
- [ ] No new dependencies without justification
- [ ] Follows existing code style

### Security Considerations

1. **File Upload Validation**
   - Always validate magic numbers (file headers)
   - Sanitize filenames before storage
   - Check file integrity with xxHash
   - Enforce size limits

2. **Environment Variables**
   - Never commit `.env` files
   - Always use `.env.example` as template
   - Rotate secrets in production

3. **Dependencies**
   - Audit with `npm audit`
   - Keep dependencies up to date
   - Review new dependencies carefully

---

## 📚 Additional Resources

### Form.io Documentation

- **Official Docs**: https://help.form.io/
- **API Reference**: https://help.form.io/api/
- **Component Guide**: https://help.form.io/userguide/forms/components/

### Libraries

- **TUS Protocol**: https://tus.io/protocols/resumable-upload.html
- **Uppy.js**: https://uppy.io/docs/
- **BullMQ**: https://docs.bullmq.io/
- **Playwright**: https://playwright.dev/

### Tooling

- **Vite**: https://vitejs.dev/
- **Vitest**: https://vitest.dev/
- **Rollup**: https://rollupjs.org/

---

## 🔄 Workflow Examples

### Complete Development Workflow

```bash
# 1. Start infrastructure
make local-up

# 2. Develop file upload module
cd packages/formio-file-upload
npm run dev  # Watch mode

# 3. Test in application (separate terminal)
cd form-client-web-app
npm run dev  # http://localhost:64849

# 4. Run tests
npm run test:e2e

# 5. Benchmark performance
cd packages/formio-file-upload
npm run benchmark

# 6. Build for production
npm run build

# 7. Stop services
make local-down
```

### CI/CD Pipeline Flow

```
Git Push
    ↓
GitHub Actions
    ├── Lint & Type Check
    ├── Unit Tests (Vitest)
    ├── Build Packages
    ├── E2E Tests (Playwright)
    ├── Performance Benchmarks
    └── Visual Regression Tests
    ↓
Deploy (if main branch)
```

---

## 🏛️ Qrius Platform Architecture

### Strategic Direction

This monorepo is evolving into the **Qrius Platform** - a proprietary
form-building platform built on Form.io with:

- Custom components (LLM-powered, WebGPU, WASM)
- Clean separation via Anti-Corruption Layer (ACL)
- Controlled upstream dependency management via git-subrepo
- Dual-track architecture (Pure React + FormBuilder)

### Architecture Documentation

**Primary Documents**:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete Qrius platform
  architecture
  - Repository strategy with git-subrepo
  - Dual-track architecture (Runtime vs Admin paths)
  - Anti-Corruption Layer pattern
  - 5-week phased implementation plan
  - Risk mitigation and success metrics

- **[docs/GIT_SUBREPO_WORKFLOW.md](./docs/GIT_SUBREPO_WORKFLOW.md)** -
  Git-subrepo workflow guide
  - Upstream synchronization workflows
  - Conflict resolution strategies
  - Contributing back to upstream
  - Troubleshooting and best practices

### Key Architectural Principles

1. **Git-Subrepo for Dependency Management**
   - `formio/`, `formio-core/`, `formio-react/` managed as subrepos
   - Upstream tracking branches for controlled merging
   - Preserves local changes, no re-cloning required
   - Private repository for proprietary Qrius code

2. **Anti-Corruption Layer (ACL)**
   - Protocol-based `IQriusComponent` interface
   - `FormioAdapter` bridges Qrius components to Form.io
   - Zero Form.io dependencies in Qrius components
   - Testable in isolation

3. **Dual-Track Architecture**
   - **Runtime Path**: Pure React forms (no Form.io overhead)
   - **Admin Path**: FormBuilder drag-and-drop interface
   - Same components work in both paths

### Package Structure (Future)

```
packages/
├── qrius-formio-react/        # Minimal fork (cloud deps removed)
├── qrius-components/          # Pure Qrius components
├── qrius-formio-adapter/      # Anti-Corruption Layer
└── qrius-react-forms/         # Pure React form renderer
```

### Implementation Status

**Current Phase**: Phase 0 - Planning Complete ✅ **Next Phase**: Git-Subrepo
Setup (Awaiting approval)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete implementation plan with
phase gates and success criteria.

### AI Assistant Instructions for Qrius Development

When working on Qrius-related tasks:

1. **Respect the ACL boundary**: Qrius components should never import Form.io
   directly
2. **Use git-subrepo commands**: See
   [docs/GIT_SUBREPO_WORKFLOW.md](./docs/GIT_SUBREPO_WORKFLOW.md)
3. **Test in isolation**: Qrius components must be testable without Form.io
4. **Follow implementation phases**: Do not skip phase gates
5. **Document architectural decisions**: Update ARCHITECTURE.md as needed

---

## 🔧 Fork Maintenance System

### @qrius/formio-react Fork

The `formio-react/` directory is a **git-subrepo** linked to our private fork at
`QriusGlobal/formio-react`.

**Key Customizations**:

1. **Dependency Bundling**: `@formio/js` bundled as regular dependency (not peer
   dependency)
2. **Formio Export**: Exports `Formio` instance for component registration
3. **GitHub Packages**: Auto-publishes to `@qrius/formio-react` on GitHub
   Packages

**Documentation**:

- **Quick Reference**:
  [docs/FORK_MAINTENANCE_SUMMARY.md](./docs/FORK_MAINTENANCE_SUMMARY.md)
- **Complete Guide**:
  [docs/FORK_MAINTENANCE_BEST_PRACTICES.md](./docs/FORK_MAINTENANCE_BEST_PRACTICES.md)
- **Fork README**: [formio-react/README.FORK.md](./formio-react/README.FORK.md)
- **AI Instructions**: [formio-react/CLAUDE.md](./formio-react/CLAUDE.md)
- **Patch Documentation**:
  [formio-react/patches/README.md](./formio-react/patches/README.md)

**Patch Management**:

```bash
# Generate patches from customizations
cd formio-react/
./scripts/manage-patches.sh generate

# Apply patches after upstream merge
./scripts/manage-patches.sh apply

# Check patch status
./scripts/manage-patches.sh check

# List all patches
./scripts/manage-patches.sh list
```

**Dual CHANGELOG Strategy**:

- `Changelog.md` - Upstream history (never modify, always accept theirs)
- `CHANGELOG.QRIUS.md` - Qrius-specific changes (our customizations only)

**Upstream Sync Workflow**:

```bash
# 1. Save current state
./scripts/manage-patches.sh generate

# 2. Merge upstream
git fetch upstream
git merge upstream/main

# 3. Resolve conflicts (auto-resolve Changelog.md)
git checkout upstream/main -- Changelog.md

# 4. Reapply customizations if needed
./scripts/manage-patches.sh apply

# 5. Regenerate patches
./scripts/manage-patches.sh generate

# 6. Update CHANGELOG.QRIUS.md
# Document upstream sync

# 7. Push to fork
git push origin main
```

**AI Assistant Guidelines**:

- Always use `CHANGELOG.QRIUS.md` for our changes
- Never modify upstream's `Changelog.md`
- Generate patches after making customizations
- Document all customizations in `patches/README.md`
- Use structured commit messages with "Qrius-Specific" tag

---

**Last Updated**: 2025-10-13 **Codebase Version**: formio-monorepo main branch
(evolving to Qrius Platform) **AI Assistant**: Optimized for Claude Code with
batch-mode execution patterns
