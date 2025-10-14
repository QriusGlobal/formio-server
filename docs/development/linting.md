# Brand Exposure & Security Linting System

Automated detection system to prevent accidental brand exposure and security
vulnerabilities in production code.

## Table of Contents

- [Overview](#overview)
- [System Components](#system-components)
- [Usage](#usage)
- [What Gets Flagged](#what-gets-flagged)
- [Fixing Violations](#fixing-violations)
- [Allowlist & Exceptions](#allowlist--exceptions)
- [CI/CD Integration](#cicd-integration)
- [Industry Best Practices](#industry-best-practices)

---

## Overview

This linting system prevents:

1. **Brand Exposure**: Accidental inclusion of "Form.io", "Uppy", or related
   brand names in production code
2. **Security Issues**: Hardcoded secrets, API keys, tokens, or credentials
3. **Debug Artifacts**: Console.log statements, debugger statements, source maps
4. **Bundle Vulnerabilities**: Oversized bundles, exposed source maps,
   unminified code

### Detection Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: ESLint Custom Rules (Real-time)          │
│  - IDE integration                                   │
│  - Pre-commit hooks                                  │
│  - Custom brand-security plugin                      │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 2: Pre-commit Hook (Git stage)              │
│  - Staged files only                                 │
│  - Fast detection                                    │
│  - Blocks commits                                    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 3: Shell Scripts (Codebase-wide)            │
│  - Full codebase scan                                │
│  - Detailed reports                                  │
│  - Bundle analysis                                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Layer 4: CI/CD Pipeline (PR review)                │
│  - GitHub Actions                                    │
│  - PR comments                                       │
│  - Merge blocking                                    │
└─────────────────────────────────────────────────────┘
```

---

## System Components

### 1. ESLint Custom Plugin

**Location**: `eslint-plugin-brand-security/index.js`

**Rules**:

- `brand-security/no-brand-references` - Detects brand keywords in strings
- `brand-security/no-production-secrets` - Detects hardcoded credentials
- `brand-security/no-source-map-references` - Flags source map comments
- `brand-security/no-debug-artifacts` - Detects debug code

**Configuration**: `.eslintrc.brand-check.js`

### 2. Git Pre-commit Hook

**Location**: `.husky/pre-commit`

**Checks**:

- Brand keywords in staged files
- Console statements in production code
- .env files in staging area
- Source map files
- Hardcoded secrets

### 3. Brand Exposure Script

**Location**: `scripts/check-brand-exposure.sh`

**Features**:

- Full codebase scanning
- Detailed violation reporting
- Configurable search paths
- Export to report file

### 4. Bundle Analysis Script

**Location**: `scripts/analyze-bundle.sh`

**Features**:

- Production bundle building
- Brand reference detection in bundles
- Source map detection
- Bundle size verification
- Secret exposure detection

### 5. GitHub Actions Workflow

**Location**: `.github/workflows/brand-check.yml`

**Features**:

- Automated PR checks
- Multi-layer verification
- Artifact uploads
- PR comment reporting
- Merge blocking

---

## Usage

### Development Workflow

#### Real-time Linting (IDE)

```bash
# Install ESLint extension in your IDE
# VSCode: ESLint by Microsoft
# WebStorm: Built-in ESLint support

# Violations will be highlighted as you type
```

#### Pre-commit Checks

```bash
# Automatic on git commit
git add .
git commit -m "feat: new feature"

# Manual pre-commit check
bash .husky/pre-commit
```

#### Manual Codebase Scan

```bash
# Run brand exposure check
npm run check:brand
# or
bash scripts/check-brand-exposure.sh

# Output: brand-exposure-report.txt
```

#### Bundle Analysis

```bash
# Analyze production bundles
npm run analyze:bundle
# or
bash scripts/analyze-bundle.sh

# Output: bundle-security-report.txt
```

#### ESLint with Brand Rules

```bash
# Lint with brand security rules
npx eslint . --config .eslintrc.brand-check.js

# Auto-fix (where possible)
npx eslint . --config .eslintrc.brand-check.js --fix
```

### Package.json Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "lint:brand": "eslint . --config .eslintrc.brand-check.js",
    "lint:brand:fix": "eslint . --config .eslintrc.brand-check.js --fix",
    "check:brand": "bash scripts/check-brand-exposure.sh",
    "analyze:bundle": "bash scripts/analyze-bundle.sh",
    "security:check": "npm run lint:brand && npm run check:brand && npm run analyze:bundle"
  }
}
```

---

## What Gets Flagged

### Brand Keywords

**Detected Patterns**:

- `formio`, `form.io`, `form-io`
- `uppy`, `uppyjs`, `uppy.io`
- Case-insensitive matching

**Examples**:

```javascript
// ❌ FLAGGED
const message = 'Powered by Form.io';
console.log('Using Uppy for uploads');
const url = 'https://form.io/api';

// ✅ ALLOWED (legitimate use)
import { Formio } from '@formio/js'; // Import statement
// This is a formio component           // Comment
const packageName = '@formio/react'; // Package reference
```

### Security Issues

**Hardcoded Secrets**:

```javascript
// ❌ FLAGGED
const apiKey = 'sk_live_abc123xyz789';
const password = 'mySecretPass123';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// ✅ ALLOWED
const apiKey = process.env.API_KEY;
const password = process.env.DB_PASSWORD;
const token = getAuthToken();
```

**Database Credentials**:

```javascript
// ❌ FLAGGED
const mongoUri = 'mongodb://user:password@localhost:27017/db';

// ✅ ALLOWED
const mongoUri = process.env.MONGO_URI;
```

### Debug Artifacts

**Console Statements**:

```javascript
// ❌ FLAGGED (in production code)
console.log('Debug: user data', user);
console.debug('API response:', response);

// ✅ ALLOWED (in scripts or test files)
// scripts/deploy.js
console.log('Deployment started');
```

**Debugger Statements**:

```javascript
// ❌ ALWAYS FLAGGED
debugger;

// ✅ Remove before commit
```

**TODO/FIXME with Brand**:

```javascript
// ❌ FLAGGED
// TODO: Replace Uppy with custom uploader
// FIXME: Formio branding visible in UI

// ✅ ALLOWED
// TODO: Improve upload performance
// FIXME: Button alignment issue
```

### Source Maps

**Commented References**:

```javascript
// ❌ FLAGGED
//# sourceMappingURL=app.js.map

// ✅ Remove source map comments in production
```

**Files**:

```bash
# ❌ FLAGGED
dist/app.js.map
build/bundle.js.map

# ✅ Exclude from git and production builds
```

---

## Fixing Violations

### Brand Reference Violations

#### Violation Type: String Literal

```javascript
// ❌ BEFORE
const provider = 'Powered by Form.io';

// ✅ AFTER - Option 1: Generic term
const provider = 'Form Management Platform';

// ✅ AFTER - Option 2: Environment variable
const provider = process.env.PLATFORM_NAME || 'Form Platform';
```

#### Violation Type: UI Text

```javascript
// ❌ BEFORE
<footer>Built with Uppy file uploader</footer>

// ✅ AFTER
<footer>Advanced file upload</footer>
```

#### Violation Type: Comment

```javascript
// ❌ BEFORE
// Initialize Formio renderer

// ✅ AFTER
// Initialize form renderer
```

### Secret Violations

#### Violation Type: API Key

```javascript
// ❌ BEFORE
const API_KEY = 'sk_live_abc123xyz';

// ✅ AFTER
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY environment variable not set');
}
```

#### Violation Type: Database URI

```javascript
// ❌ BEFORE
const dbUri = 'mongodb://admin:pass123@localhost/db';

// ✅ AFTER
const dbUri = process.env.DATABASE_URL;
```

### Console Statement Violations

#### Development Logging

```javascript
// ❌ BEFORE (in src/)
console.log('User authenticated:', user);

// ✅ AFTER - Option 1: Remove
// (remove the line)

// ✅ AFTER - Option 2: Use logger
import logger from './utils/logger';
logger.info('User authenticated', { userId: user.id });
```

#### Conditional Logging

```javascript
// ✅ ALLOWED
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### Source Map Violations

#### Build Configuration

```javascript
// vite.config.js or rollup.config.js

// ❌ BEFORE
export default {
  build: {
    sourcemap: true
  }
};

// ✅ AFTER
export default {
  build: {
    sourcemap: process.env.NODE_ENV === 'development'
  }
};
```

---

## Allowlist & Exceptions

### Automatic Exceptions

The linting system automatically excludes:

#### File Patterns

- `node_modules/**`
- `dist/**`, `build/**`
- `**/*.test.js`, `**/*.spec.js`
- `test/**`, `tests/**`
- `scripts/**`
- `*.config.js`, `webpack*.js`
- `package.json`, `package-lock.json`
- `.lock` files

#### Code Patterns

- Import statements: `import { Formio } from '@formio/js'`
- Package names: `"@formio/react"`
- Comments: `// Using formio components`

### Manual Exceptions

#### ESLint Disable Comments

```javascript
// Disable for single line
const name = 'formio'; // eslint-disable-line brand-security/no-brand-references

// Disable for block
/* eslint-disable brand-security/no-brand-references */
const config = {
  provider: 'form.io',
  uploader: 'uppy'
};
/* eslint-enable brand-security/no-brand-references */
```

#### Configuration Override

**`.eslintrc.brand-check.js`**:

```javascript
module.exports = {
  // ...
  overrides: [
    {
      files: ['src/legacy/**/*.js'],
      rules: {
        'brand-security/no-brand-references': 'off'
      }
    }
  ]
};
```

#### Script Exclusion

**`scripts/check-brand-exposure.sh`**:

```bash
# Add to EXCLUDE_PATTERNS array
EXCLUDE_PATTERNS=(
  # ... existing patterns
  "src/vendor"
  "legacy/"
)
```

---

## CI/CD Integration

### GitHub Actions Workflow

**Trigger**: Pull requests to `main` or `develop`

**Steps**:

1. **ESLint Brand Check** - Runs brand security rules
2. **Brand Exposure Scan** - Full codebase scan
3. **Bundle Analysis** - Production build security check
4. **Secret Detection** - TruffleHog scan
5. **PR Comment** - Post results to PR

### Workflow Outputs

#### Successful Check

```
✅ Brand Exposure & Security Check
- ESLint: 0 errors, 0 warnings
- Brand Scan: No violations
- Bundle Analysis: All checks passed
- Secret Detection: No secrets found
```

#### Failed Check

```
❌ Brand Exposure & Security Check
- ESLint: 3 errors, 5 warnings
- Brand Scan: 2 violations found
- Bundle Analysis: Source maps detected
- Secret Detection: 1 potential secret

📊 View full reports in workflow artifacts
```

### Merge Blocking

If violations are found:

1. ❌ PR check fails
2. 🚫 Merge is blocked
3. 📝 Comment posted with details
4. 🔧 Developer must fix issues

### Artifact Downloads

After workflow completion:

1. Go to Actions tab
2. Select workflow run
3. Download artifacts:
   - `brand-exposure-report.txt`
   - `eslint-brand-report.json`
   - `bundle-security-report.txt`

---

## Industry Best Practices

### White-labeling vs Obfuscation

#### White-labeling (Recommended)

**Definition**: Remove or replace third-party branding with your own or generic
terms.

**Approach**:

- Replace brand strings with environment variables
- Use generic terminology in UI/UX
- Configure build process to strip comments

**Advantages**:

- ✅ Clean, professional appearance
- ✅ Maintains debuggability
- ✅ Legal compliance
- ✅ No performance overhead

**Disadvantages**:

- ⚠️ Requires systematic approach
- ⚠️ Must maintain across updates

#### Obfuscation (Not Recommended)

**Definition**: Transform code to make it unreadable while preserving
functionality.

**Approach**:

- Minification (remove whitespace, shorten names)
- Mangling (rename variables)
- String encoding
- Control flow flattening

**Advantages**:

- ✅ Harder to reverse engineer
- ✅ Smaller bundle size (minification)

**Disadvantages**:

- ❌ Breaks debugging
- ❌ Performance overhead (heavy obfuscation)
- ❌ Maintenance difficulty
- ❌ Licensing concerns (some libraries prohibit)

### Industry Standards

#### SaaS Platforms

**Common Practice**: White-labeling with strategic brand removal

- Stripe: Allows custom branding via API/SDK configuration
- Twilio: White-label options in enterprise plans
- SendGrid: Brand removal in paid tiers

**What They Do**:

1. Environment-based configuration
2. UI customization APIs
3. Optional branding toggles
4. Clean, generic terminology

**What They Don't Do**:

- Heavy obfuscation (breaks debugging)
- Complete code transformation
- Removal of license headers

#### Open Source Forks

**Common Practice**: Fork maintenance with attribution

- Maintain upstream attribution in LICENSE
- Remove branding from UI/UX
- Use build-time brand replacement
- Document customizations

**Legal Requirements**:

- Preserve copyright notices
- Maintain LICENSE files
- Attribute original authors (if required by license)
- Follow fork-specific terms

### Recommended Approach for Qrius Platform

#### Strategy: Hybrid White-labeling

**Phase 1: Brand Removal** (Current)

- ✅ Automated detection (this system)
- ✅ Replace UI strings with environment variables
- ✅ Generic terminology in user-facing code
- ✅ Build-time comment stripping

**Phase 2: Strategic Minification**

- Minify production bundles (Terser, UglifyJS)
- Remove comments and whitespace
- Shorten variable names (where safe)
- **DO NOT** use heavy obfuscation

**Phase 3: Legal Compliance**

- Maintain LICENSE files
- Preserve copyright notices
- Document fork relationships
- Legal review of modifications

#### Build Configuration

```javascript
// vite.config.js (Production)
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log
        drop_debugger: true, // Remove debugger
        pure_funcs: ['console.log'] // Remove specific functions
      },
      format: {
        comments: false // Remove all comments
      }
    },
    sourcemap: false // No source maps in production
  },
  define: {
    'process.env.PLATFORM_NAME': JSON.stringify('Qrius Platform'),
    'process.env.ENABLE_BRANDING': 'false'
  }
};
```

### Security vs Debuggability Trade-offs

| Aspect            | White-labeling | Light Minification | Heavy Obfuscation |
| ----------------- | -------------- | ------------------ | ----------------- |
| **Debuggability** | ✅ Full        | ⚠️ Limited         | ❌ None           |
| **Performance**   | ✅ Native      | ✅ Optimized       | ⚠️ Overhead       |
| **Security**      | ⚠️ Basic       | ✅ Moderate        | ✅ High           |
| **Maintenance**   | ✅ Easy        | ✅ Easy            | ❌ Difficult      |
| **Legal Risk**    | ✅ Low         | ✅ Low             | ⚠️ Moderate       |
| **Bundle Size**   | ➖ No change   | ✅ Smaller         | ⚠️ Larger         |

**Recommendation**: White-labeling + Light Minification

---

## Troubleshooting

### False Positives

#### Issue: Legitimate import flagged

```javascript
// Flagged incorrectly
import { Formio } from '@formio/js';
```

**Solution**: Already excluded by default. If flagged, check
`.eslintrc.brand-check.js` overrides.

#### Issue: Package name in config

```json
{
  "dependencies": {
    "@formio/react": "^6.1.0"
  }
}
```

**Solution**: `package.json` files are automatically excluded.

### Pre-commit Hook Failures

#### Issue: Hook blocks commit despite no violations

**Check**:

```bash
# View git staged files
git diff --cached --name-only

# Check specific file
git diff --cached path/to/file.js | grep -i formio
```

**Solution**:

```bash
# Unstage problematic file
git reset path/to/file.js

# Fix violations
# Re-stage
git add path/to/file.js
```

#### Issue: Hook takes too long

**Solution**: Reduce scope in `.husky/pre-commit`

```bash
# Only check JavaScript/TypeScript files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$')
```

### CI/CD Pipeline Failures

#### Issue: Workflow fails with "command not found"

**Check**: Ensure dependencies installed

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

#### Issue: Reports not generated

**Check**: Scripts have execute permissions

```bash
chmod +x scripts/check-brand-exposure.sh
chmod +x scripts/analyze-bundle.sh
```

---

## Maintenance

### Updating Brand Keywords

**`eslint-plugin-brand-security/index.js`**:

```javascript
const brandKeywords = [
  'formio',
  'form.io',
  'uppy',
  // Add new keywords
  'newbrand',
  'another-brand'
];
```

**`scripts/check-brand-exposure.sh`**:

```bash
BRAND_KEYWORDS=(
  "formio"
  "form\.io"
  "uppy"
  # Add new keywords
  "newbrand"
)
```

### Adding New Secret Patterns

**`eslint-plugin-brand-security/index.js`**:

```javascript
const secretPatterns = [
  // Existing patterns...

  // Add new pattern
  {
    pattern: /new[_-]?pattern\s*[:=]\s*['"][^'"]{10,}['"]/gi,
    type: 'New Secret Type'
  }
];
```

### Adjusting Bundle Size Limits

**`scripts/analyze-bundle.sh`**:

```bash
SIZE_LIMITS=(
  "packages/formio-file-upload/dist:500000"    # 500KB
  "form-client-web-app/dist:2000000"           # 2MB
  # Adjust or add new limits
  "new-package/dist:1000000"                   # 1MB
)
```

---

## Support & Contribution

### Reporting Issues

If the linting system produces false positives or misses violations:

1. Document the case
2. Include code example
3. Specify which layer detected/missed it
4. Open issue with reproduction steps

### Contributing Rules

When adding new ESLint rules:

1. Test on real codebase samples
2. Document in this guide
3. Add tests in `eslint-plugin-brand-security/`
4. Update CI/CD workflow if needed

---

## References

- [ESLint Custom Rules](https://eslint.org/docs/developer-guide/working-with-rules)
- [TruffleHog Secret Detection](https://github.com/trufflesecurity/trufflehog)
- [Husky Git Hooks](https://typicode.github.io/husky/)
- [GitHub Actions Workflows](https://docs.github.com/en/actions)
- [SaaS White-labeling Best Practices](https://example.com/saas-whitelabeling)

---

**Last Updated**: 2025-10-13 **Version**: 1.0.0 **Maintainer**: Qrius Platform
Team
