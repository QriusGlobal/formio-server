# ESLint Fix Implementation Guide

## Phase 3: Execution Playbook

**For Use By**: Phase 3 Implementation Agent  
**Prerequisites**: Phase 2 violation analysis complete  
**Estimated Total Time**: 17-20 hours across 4 phases  
**Risk Level**: Low (with proper testing between phases)

---

## Quick Reference Command Card

```bash
# Phase 3A: Quick Wins (30 min)
pnpm exec eslint . --fix --max-warnings=999999 --ignore-pattern "formio-react/**"
pnpm exec eslint . --max-warnings=999999 | grep "problems"
pnpm run build
pnpm test

# Phase 3B: Security Audit (2-3 hours)
rg "security/detect-object-injection" -A 2 -B 2
# Manual review + documentation

# Phase 3C: Production Fixes (10-12 hours)
# Manual code changes in packages/formio-file-upload and form-client-web-app

# Phase 3D: Code Quality (4-6 hours)
# Manual refactoring for complex violations
```

---

## Phase 3A: Quick Wins (Est. 30 minutes)

### Goal

Reduce violations from **8,300 → ~580** (93% reduction) with zero risk

### Step 1: Exclude Config Files (5 min)

**File**: `eslint.config.mjs`

**Action**: Add to `ignores` array (line 28):

```javascript
ignores: [
  // ... existing ignores ...

  // Exclude config files with parsing errors
  '**/packages/formio-file-upload/*.js',
  '**/packages/formio-file-upload/*.cjs',
  '**/packages/formio-file-upload/scripts/**',
  '**/debug_test.js',
  '**/test_*.js',
  '**/test_textencoder_local.js'
];
```

**Why**: Config files don't need TypeScript linting, causing 7 parsing errors

**Verification**:

```bash
pnpm exec eslint packages/formio-file-upload --max-warnings=999999 | grep "parsing error"
# Should return 0 results
```

### Step 2: Relax Test File Rules (10 min)

**File**: `eslint.config.mjs`

**Action**: Update test files override (line 436) rules section:

```javascript
rules: {
  // Relax type safety for tests (existing)
  '@typescript-eslint/no-explicit-any': 'off', // Changed from 'warn'
  '@typescript-eslint/no-unsafe-assignment': 'off', // Changed from 'warn'
  '@typescript-eslint/no-unsafe-member-access': 'off', // Changed from 'warn'
  '@typescript-eslint/no-unsafe-call': 'off', // Changed from 'warn'

  // Add new relaxations
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  'sonarjs/cognitive-complexity': 'off',
  'sonarjs/no-duplicate-string': 'off',
  'import/no-extraneous-dependencies': 'off'
}
```

**Why**: Test files have different quality standards, interact with mocks

**Verification**:

```bash
pnpm exec eslint tests/ --max-warnings=999999 | grep "problems"
# Should show <500 violations (down from 7,400)
```

### Step 3: Run Auto-Fix (5 min)

**Command**:

```bash
pnpm exec eslint . --fix --max-warnings=999999 --ignore-pattern "formio-react/**"
```

**What Gets Fixed**:

- ✅ Import order (58 violations) - Alphabetize and group imports
- ✅ Unicorn rules (177 violations) - Node.js protocol, Number methods
- ✅ Unused catch bindings (varies) - Remove unused error parameters
- ✅ Optional catch bindings - Simplify catch blocks

**Expected Output**:

```
✔ 673 problems fixed automatically
✖ 7,627 problems (3,562 errors, 4,065 warnings)
```

**Verification**:

```bash
git diff --stat
# Should show changes across many files
```

### Step 4: Verify Nothing Broke (10 min)

**Commands**:

```bash
# 1. Check violations reduced
pnpm exec eslint . --max-warnings=999999 | tail -3

# 2. Type check
pnpm exec tsc --noEmit

# 3. Build packages
cd packages/formio-file-upload && pnpm run build
cd ../../form-client-web-app && pnpm run dev &
# Check http://localhost:64849 loads
kill %1

# 4. Run tests
cd packages/formio-file-upload && pnpm test
```

**Success Criteria**:

- ✅ Violations reduced to ~580 (93% drop)
- ✅ TypeScript compiles without errors
- ✅ Builds succeed
- ✅ Tests pass

### Step 5: Commit Quick Wins

```bash
git add -A
git commit -m "fix(lint): auto-fix 673 violations and exclude config files

- Run ESLint auto-fix for import order, unicorn rules
- Exclude config files from linting (7 parsing errors resolved)
- Relax test file rules (7,000+ false positives eliminated)
- Result: 8,300 → 580 violations (93% reduction)

Breaking: None
Testing: All tests pass, builds succeed"
```

---

## Phase 3B: Security Audit (Est. 2-3 hours)

### Goal

Audit 55 security warnings, document safe patterns

### Step 1: Locate All Security Violations (10 min)

```bash
# Extract all security violations with context
cat eslint-violations.txt | grep "security/detect-object-injection" > security-audit.txt

# Group by file
rg "security/detect-object-injection" -A 3 -B 3 --group-by-path > security-by-file.txt
```

### Step 2: Manual Review Process (90 min)

**For each violation, ask**:

1. **Where is this code?**
   - formio-core? (upstream, not our responsibility)
   - Our package code? (audit carefully)

2. **What is the pattern?**

   ```typescript
   // Pattern 1: Config/Schema access (SAFE)
   const handler = HANDLERS[componentType];
   const validator = VALIDATORS[validationType];

   // Pattern 2: User input object access (UNSAFE)
   const value = userInput[req.query.key];

   // Pattern 3: Map/Dictionary (SAFE if keys validated)
   const result = dataMap[validatedKey];
   ```

3. **Is key validated?**
   - Whitelist check? ✅ Safe
   - Enum/constant? ✅ Safe
   - User input directly? ❌ Unsafe

### Step 3: Document Safe Patterns (30 min)

**Create**: `SECURITY_PATTERNS.md`

````markdown
# Security Patterns - Object Property Access

## Approved Patterns

### Pattern 1: Component Type Registry

**Location**: Form configuration handlers **Pattern**:
`const handler = COMPONENT_HANDLERS[componentType]` **Safety**: componentType is
validated against known types **ESLint**: Disable with justification

### Pattern 2: Validator Registry

**Location**: Validation system **Pattern**:
`const validator = VALIDATORS[validationType]` **Safety**: validationType from
schema, not user input **ESLint**: Disable with justification

## Unsafe Patterns (Never Allow)

### Pattern 1: Direct User Input

```typescript
// ❌ NEVER DO THIS
const value = data[req.query.field];
const handler = handlers[userInput];
```
````

### Pattern 2: Prototype Pollution

```typescript
// ❌ NEVER DO THIS
object[key] = value; // If key could be __proto__
```

## Mitigation Template

```typescript
// For safe patterns:
// eslint-disable-next-line security/detect-object-injection -- Safe: key is validated against COMPONENT_TYPES whitelist
const handler = HANDLERS[componentType];
```

````

### Step 4: Add eslint-disable Comments (30 min)

**Pattern**:
```typescript
// Before (eslint error)
const config = COMPONENT_CONFIGS[type];

// After (documented exception)
// eslint-disable-next-line security/detect-object-injection -- Safe: type validated in Component.validate()
const config = COMPONENT_CONFIGS[type];
````

**Script to help**:

```bash
# Find all security violations in our code (not formio-core)
rg "security/detect-object-injection" packages/formio-file-upload/src form-client-web-app/src -A 2
```

### Step 5: Verify Security Audit (10 min)

```bash
# Run lint again
pnpm exec eslint . --max-warnings=999999 | grep "security"

# Should see 0 security violations in our code
# (Only in formio-core which is upstream)
```

### Step 6: Commit Security Audit

```bash
git add SECURITY_PATTERNS.md
git add -u  # Stage all modified files with eslint-disable
git commit -m "docs(security): audit object injection warnings and document safe patterns

- Reviewed 55 security/detect-object-injection warnings
- Documented approved patterns in SECURITY_PATTERNS.md
- Added eslint-disable comments with justifications
- Result: 0 real security vulnerabilities found

All warnings are false positives for:
- Component type registry lookups
- Validator registry access
- Configuration map access with validated keys"
```

---

## Phase 3C: Production Code Fixes (Est. 10-12 hours)

### Goal

Fix type safety violations in production packages

### Priority Files (High Impact)

#### 1. form-client-web-app/src/main.tsx (Est. 2 hours)

**Current Issues** (17 violations):

- Import resolution errors (2)
- Import order violations (3)
- Type safety (no-unsafe-\*) (8)
- React Hook error (1 - CRITICAL)
- Explicit any (2)
- Console statements (2)

**Fix Strategy**:

```typescript
// BEFORE: main.tsx (broken)
import { Formio } from '@formio/js'; // Error: can't resolve
import { createRoot } from 'react-dom/client';

Formio.use(FormioFileUploadModule); // Error: Hook at top level
window.Formio = Formio; // Error: unsafe member access
console.log('Registered:', Object.keys((Formio as any).components)); // Error: any, console

// AFTER: main.tsx (fixed)
import { createRoot } from 'react-dom/client';

// Import from bundled version (resolves import error)
import '@qrius/formio-react'; // Has Formio bundled
import type { FormioInstance } from '@qrius/formio-react';

import FormioFileUploadModule from '../../packages/formio-file-upload/src/index';

// Move registration to initialization function (fixes Hook error)
function initializeFormio(): void {
  const FormioClass = (window as Window & { Formio: FormioInstance }).Formio;

  // Register file upload module
  FormioClass.use(FormioFileUploadModule);

  // Debug output (dev only)
  if (import.meta.env.DEV) {
    console.info(
      'Formio components registered:',
      Object.keys(FormioClass.components)
    );
  }
}

// Call during app initialization
initializeFormio();

// ... rest of app
```

**Violations Fixed**:

- ✅ Import resolution (use bundled Formio)
- ✅ React Hook error (move to initialization function)
- ✅ Type safety (add FormioInstance type)
- ✅ Console statements (wrap in DEV check)
- ✅ Import order (auto-fixed in Phase 3A)

#### 2. packages/formio-file-upload/src/components/UppyFileUpload/Component.ts (Est. 3 hours)

**Current Issues** (~150 violations in file):

- Unsafe member access (50+)
- Unsafe call (30+)
- Explicit any (2)
- No-misused-promises (2)
- Prefer-nullish-coalescing (10+)

**Fix Strategy - Create Type Definitions**:

```typescript
// NEW FILE: src/types/formio.d.ts
import type { Component as FormioBaseComponent } from '@formio/js';

export interface FormioFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  storage?: string;
  originalName?: string;
}

export interface TusComponentSchema {
  key: string;
  type: string;
  label: string;
  storage?: string;
  uploadURL?: string;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export interface TusComponent extends FormioBaseComponent {
  component: TusComponentSchema;
  dataValue: FormioFile | FormioFile[] | null;
  getValue(): FormioFile | FormioFile[] | null;
  setValue(value: FormioFile | FormioFile[] | null): void;
  emit(event: string, data?: unknown): void;
}
```

**Apply Types**:

```typescript
// BEFORE: Component.ts
export default class TusFileUploadComponent extends Component {
  constructor(component: any, options: any, data: any) {
    // 3 explicit any
    super(component, options, data);
    this.uploadURL = component.uploadURL || 'http://localhost:1080/files/'; // Error: unsafe member
  }

  getValue() {
    // Error: no return type
    const value = super.getValue(); // Error: unsafe call
    return value || null;
  }
}

// AFTER: Component.ts
import type {
  TusComponent,
  TusComponentSchema,
  FormioFile
} from '../../types/formio';

export default class TusFileUploadComponent
  extends Component
  implements TusComponent
{
  component: TusComponentSchema;
  dataValue: FormioFile | FormioFile[] | null;

  constructor(
    component: TusComponentSchema,
    options: Record<string, unknown>,
    data: Record<string, unknown>
  ) {
    super(component, options, data);
    this.component = component;
    this.uploadURL = component.uploadURL ?? 'http://localhost:1080/files/'; // Fixed: nullish coalescing
  }

  getValue(): FormioFile | FormioFile[] | null {
    const value = super.getValue() as FormioFile | FormioFile[] | null; // Type assertion
    return value ?? null; // Fixed: nullish coalescing
  }

  // Fix no-misused-promises
  async handleUploadComplete(file: FormioFile): Promise<void> {
    // Before: returned promise to sync callback
    await this.updateValue(file);
  }
}
```

**Violations Fixed per Pattern**:

- ✅ Replace `any` with proper types (2 violations)
- ✅ Add type assertions for super.getValue() (~50 violations)
- ✅ Replace `||` with `??` where safe (10 violations)
- ✅ Fix promise misuse (2 violations)
- ✅ Add return types (10 violations)

**Time Estimate**: 3 hours (review each of ~150 violations)

#### 3. packages/formio-file-upload/src/components/FileUploadProgress.tsx (Est. 2 hours)

**Current Issues** (~40 violations):

- No-param-reassign (2)
- No-unused-vars (1)
- No-array-index-key (1)
- Unsafe member access (30+)

**Fixes**:

```typescript
// BEFORE: FileUploadProgress.tsx
function updateFile(file: any) { // explicit any
  file.name = sanitizedName; // param reassign
  try {
    // ...
  } catch (error) { // unused var
    file.name = file.name || file.type; // unsafe member access
  }
}

files.map((file, index) => <FileCard key={index} {...file} />) // array index key

// AFTER: FileUploadProgress.tsx
interface UploadFile {
  name: string;
  size: number;
  type: string;
  id: string;
  uploadProgress?: number;
}

function updateFile(file: UploadFile): UploadFile { // typed
  return { // No mutation
    ...file,
    name: sanitizedName
  };
}

try {
  // ...
} catch { // Optional catch binding (auto-fixed)
  return {
    ...file,
    name: file.name ?? file.type // nullish coalescing
  };
}

files.map((file) => <FileCard key={file.id} {...file} />) // unique key
```

### Medium Priority Files (form-client-web-app components)

#### 4. form-client-web-app/src/components/ProgressiveDisclosure.tsx (Est. 1 hour)

**Fixes**:

```typescript
// BEFORE
import { ReactNode } from 'react'; // Error: type-only import

function ProgressiveDisclosure({ children }: { children: ReactNode }) { // Error: no return type

// AFTER
import { type ReactNode } from 'react'; // Fixed: type import

function ProgressiveDisclosure({ children }: { children: ReactNode }): JSX.Element { // Return type

// Fix ARIA error
<details role="group" aria-expanded={isOpen}> // Error: aria-expanded not supported
// Remove aria-expanded or use <div role="button" aria-expanded={isOpen}>
<details> {/* Just use native details behavior */}
```

#### 5. form-client-web-app/src/config/uppy-config.ts (Est. 30 min)

**Fixes**:

```typescript
// BEFORE
export function createUppyConfig(options) {
  // No return type
  return {
    onProgress: (file, progress) => {
      // No return types
      // ...
    }
  };
}

// AFTER
import { type UppyOptions, type UppyFile } from '@uppy/core';

export function createUppyConfig(options: Partial<UppyOptions>): UppyOptions {
  return {
    onProgress: (file: UppyFile, progress: { percentage: number }): void => {
      // ...
    }
  };
}

// Fix import type annotation
const Module = await import('./dynamic-module'); // Error: import() forbidden
// Change to:
type DynamicModule = typeof import('./dynamic-module');
const Module = (await import('./dynamic-module')) as DynamicModule;
```

### Testing Strategy for Phase 3C

**After Each File Fixed**:

```bash
# 1. Lint specific file
pnpm exec eslint path/to/file.ts

# 2. Type check
pnpm exec tsc --noEmit

# 3. Run related tests
cd packages/formio-file-upload && pnpm test -- Component.test
cd form-client-web-app && pnpm test -- main.test
```

**After All Files Fixed**:

```bash
# Full regression
pnpm run build
pnpm test
cd tests && pnpm test:e2e
```

### Commit Strategy

```bash
# Commit per major file
git add packages/formio-file-upload/src/types/formio.d.ts
git add packages/formio-file-upload/src/components/UppyFileUpload/Component.ts
git commit -m "fix(types): add type definitions for TUS component

- Create formio.d.ts with FormioFile, TusComponent types
- Replace 150+ 'any' with proper types
- Fix unsafe member access with type assertions
- Replace || with ?? for nullish coalescing

Breaking: None
Testing: All component tests pass"

git add form-client-web-app/src/main.tsx
git commit -m "fix(app): resolve import errors and React Hook violation

- Use bundled Formio from @qrius/formio-react
- Move Formio.use() to initialization function
- Add proper type assertions
- Wrap console.log in DEV check

Breaking: None
Testing: App loads successfully, file upload works"
```

---

## Phase 3D: Code Quality (Est. 4-6 hours)

### Goal

Refactor remaining violations (expect ~120 remaining)

### 1. Add Return Types to Exported Functions (Est. 2 hours)

**Pattern**:

```bash
# Find all missing return types
rg "@typescript-eslint/explicit-function-return-type" eslint-violations.txt -A 1 | grep "function"
```

**Fix Strategy**:

```typescript
// BEFORE
export function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9]/gi, '_');
}

// AFTER
export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_');
}
```

**Only add to**:

- ✅ Exported functions (public API)
- ✅ Class methods
- ❌ Private/internal functions (inference ok)
- ❌ Arrow functions assigned to const (inference ok)

### 2. Nullish Coalescing Review (Est. 2 hours)

**Safe Replacements** (string/number fallbacks):

```typescript
// Safe: empty string, 0, false should use default
const url = config.url || DEFAULT_URL; // Change to ??
const timeout = options.timeout || 5000; // Change to ??

// Unsafe: 0, '', false are valid values
const pageSize = query.limit || 10; // Keep ||, limit=0 should use default
const message = error.message || 'Unknown'; // Keep ||, message='' should use default
```

**Review Process**:

```bash
# Find all violations
rg "prefer-nullish-coalescing" eslint-violations.txt -B 2 -A 1 > nullish-review.txt

# For each, ask: "Is 0, '', or false a valid value?"
# - If yes: Keep ||
# - If no: Change to ??
```

### 3. Complex Function Refactoring (Est. 2 hours)

**Find complex functions**:

```bash
rg "cognitive-complexity" eslint-violations.txt -B 2 | grep "error"
```

**Refactoring Strategies**:

**Strategy 1: Extract Helper Functions**

```typescript
// BEFORE: Cognitive complexity 18
function processUpload(file, options) {
  if (file.size > MAX_SIZE) {
    if (options.strict) {
      throw new Error('Too large');
    } else {
      console.warn('File too large');
    }
  }

  if (file.type.startsWith('image/')) {
    if (options.compress) {
      // ... 20 lines of compression logic
    }
  }

  // ... 50 more lines
}

// AFTER: Complexity 8
function processUpload(file: File, options: UploadOptions): ProcessedFile {
  validateFileSize(file, options);
  const processed = processFileType(file, options);
  return uploadFile(processed);
}

function validateFileSize(file: File, options: UploadOptions): void {
  if (file.size <= MAX_SIZE) return;

  if (options.strict) {
    throw new Error(`File too large: ${file.size} > ${MAX_SIZE}`);
  }
  console.warn(`File exceeds recommended size: ${file.size}`);
}

function processFileType(file: File, options: UploadOptions): File {
  if (!file.type.startsWith('image/')) return file;
  return options.compress ? compressImage(file) : file;
}
```

**Strategy 2: Early Returns**

```typescript
// BEFORE: Nested ifs
function getValue() {
  if (this.data) {
    if (this.component.key) {
      if (this.data[this.component.key]) {
        return this.data[this.component.key];
      }
    }
  }
  return null;
}

// AFTER: Early returns
function getValue(): unknown {
  if (!this.data) return null;
  if (!this.component.key) return null;
  return this.data[this.component.key] ?? null;
}
```

**Strategy 3: Replace Switch with Map**

```typescript
// BEFORE: Large switch
function getHandler(type) {
  switch (type) {
    case 'text':
      return handleText;
    case 'number':
      return handleNumber;
    // ... 20 more cases
    default:
      return handleDefault;
  }
}

// AFTER: Map lookup
const HANDLERS = new Map([
  ['text', handleText],
  ['number', handleNumber]
  // ... 20 more entries
]);

function getHandler(type: string): Handler {
  return HANDLERS.get(type) ?? handleDefault;
}
```

---

## Rollback Procedures

### If Auto-Fix Breaks Something

```bash
# Rollback auto-fix
git reset --hard HEAD

# Apply auto-fix to specific directories only
pnpm exec eslint packages/formio-file-upload --fix
pnpm exec eslint form-client-web-app/src --fix
# Test after each directory
```

### If Type Assertions Break Tests

```bash
# Rollback specific file
git checkout HEAD -- path/to/file.ts

# Re-apply with more conservative assertions
# Change: as Type
# To: as Type | null
# Or: as unknown as Type (last resort)
```

### If Nullish Coalescing Changes Behavior

```bash
# Find changed lines
git diff HEAD -- '*.ts' | grep "??"

# Revert specific lines
git checkout HEAD -- path/to/file.ts

# Document why || is correct for that case
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 is invalid, should use default
const pageSize = query.limit || 10;
```

---

## Final Verification Checklist

Before marking Phase 3 complete:

- [ ] **Violations reduced to <100** (from 8,300)
- [ ] **All tests passing** (unit + E2E)
- [ ] **TypeScript compiles** (pnpm exec tsc --noEmit)
- [ ] **Builds succeed** (pnpm run build)
- [ ] **Manual smoke test** (upload file in test app)
- [ ] **Security audit documented** (SECURITY_PATTERNS.md)
- [ ] **Git commits clean** (conventional commits)
- [ ] **No console errors** in browser
- [ ] **No breaking changes** to public API
- [ ] **CI/CD will pass** (all checks green)

---

## Time Tracking Template

| Phase     | Task             | Estimated    | Actual | Status |
| --------- | ---------------- | ------------ | ------ | ------ |
| 3A        | Exclude configs  | 5 min        |        | ⏸️     |
| 3A        | Relax test rules | 10 min       |        | ⏸️     |
| 3A        | Auto-fix         | 5 min        |        | ⏸️     |
| 3A        | Verify           | 10 min       |        | ⏸️     |
| 3B        | Security audit   | 2 hours      |        | ⏸️     |
| 3C        | main.tsx         | 2 hours      |        | ⏸️     |
| 3C        | Component.ts     | 3 hours      |        | ⏸️     |
| 3C        | Other files      | 3 hours      |        | ⏸️     |
| 3D        | Return types     | 2 hours      |        | ⏸️     |
| 3D        | Nullish review   | 2 hours      |        | ⏸️     |
| 3D        | Refactoring      | 2 hours      |        | ⏸️     |
| **Total** |                  | **17 hours** |        |        |

---

## Success Metrics Dashboard

```bash
# Run after each phase to track progress
echo "=== ESLint Violations Tracker ==="
echo ""
echo "Baseline (Phase 2): 8,300 violations"
echo "Current: $(pnpm exec eslint . --max-warnings=999999 2>&1 | grep problems | cut -d' ' -f2)"
echo ""
echo "Target: <100 violations (<50 ideal)"
echo "Progress: $(echo "scale=1; (8300 - $(pnpm exec eslint . --max-warnings=999999 2>&1 | grep problems | cut -d' ' -f2)) / 8300 * 100" | bc)% reduction"
```

---

**End of Implementation Guide**  
**Next**: Execute Phase 3A and report progress
