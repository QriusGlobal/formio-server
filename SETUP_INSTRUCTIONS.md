# Brand Exposure & Security Linting System - Setup Instructions

## System Overview

Automated detection system to prevent brand exposure and security
vulnerabilities in production code.

**Created**: 2025-10-13 **Status**: ✅ Fully Implemented and Tested

---

## Components Installed

### 1. ESLint Custom Plugin

**Location**: `eslint-plugin-brand-security/`

**Rules**:

- `no-brand-references` - Detects "formio", "uppy", "form.io" in strings
- `no-production-secrets` - Detects hardcoded API keys, passwords, tokens
- `no-source-map-references` - Flags source map comments
- `no-debug-artifacts` - Detects TODO/FIXME with brands, console.debug

### 2. Configuration Files

- `.eslintrc.brand-check.js` - Brand security ESLint configuration
- Package rules override for legitimate uses

### 3. Shell Scripts

- `scripts/check-brand-exposure.sh` - Full codebase brand scanner
- `scripts/analyze-bundle.sh` - Production bundle security analyzer

### 4. Git Hooks

- `.husky/pre-commit` - Enhanced with brand/security checks

### 5. GitHub Actions

- `.github/workflows/brand-check.yml` - CI/CD brand exposure workflow

### 6. Documentation

- `docs/LINTING.md` - Complete usage guide
- `docs/INDUSTRY_BEST_PRACTICES_OBFUSCATION.md` - Industry research
- `SETUP_INSTRUCTIONS.md` - This file

---

## Quick Start

### 1. Install Dependencies (if needed)

```bash
cd /Users/mishal/code/worktrees/formio-monorepo-20251009
pnpm install
```

### 2. Run Brand Exposure Check

```bash
# Full codebase scan
npm run check:brand

# View report
cat brand-exposure-report.txt
```

### 3. Run ESLint Brand Check

```bash
# Lint with brand security rules
npm run lint:brand

# Auto-fix (where possible)
npm run lint:brand:fix
```

### 4. Run Bundle Security Analysis

```bash
# Build and analyze production bundles
npm run analyze:bundle

# View report
cat bundle-security-report.txt
```

### 5. Run All Security Checks

```bash
npm run security:check
```

---

## NPM Scripts Added

Added to root `package.json`:

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

## Pre-commit Hook Changes

**File**: `.husky/pre-commit`

**Added Checks**:

1. Brand keyword detection in staged files
2. Console.log statement detection
3. .env file commit prevention
4. Source map file commit prevention
5. Hardcoded secret detection

**Behavior**:

- ✅ Blocks commits with violations
- ⚠️ Shows warnings for console statements
- 📝 Provides actionable fix instructions

---

## Current Violations Found

### Initial Scan Results

**Location**: `form-client-web-app/src/`

**Total Violations**: ~45 brand references detected

**Types**:

1. Import statements (legitimate use)
2. CSS class names (`.formio-form`, `.formio-component`)
3. TypeScript type names (`FormioComponent`, `FormioFile`)
4. Variable names (`formioServerUrl`)
5. Comments mentioning Form.io
6. Package import paths

**Status**:

- ✅ Most are legitimate (imports, types, CSS classes)
- ⚠️ Some need whitelabeling (UI text, variable names)
- 📋 Detailed report in `brand-exposure-report.txt`

---

## Configuring Exceptions

### Automatic Exceptions

Already configured for:

- `node_modules/`
- `dist/`, `build/`
- Test files (`*.test.js`, `*.spec.js`)
- Config files (`*.config.js`)
- Documentation (`docs/`, `README.md`, `CLAUDE.md`)
- Source packages (`formio/`, `formio-core/`, `formio-react/`)

### Manual Exceptions

#### Option 1: ESLint Disable Comment

```javascript
// Disable for single line
const name = 'formio'; // eslint-disable-line brand-security/no-brand-references

// Disable for block
/* eslint-disable brand-security/no-brand-references */
const config = { provider: 'formio' };
/* eslint-enable brand-security/no-brand-references */
```

#### Option 2: Configuration Override

Edit `.eslintrc.brand-check.js`:

```javascript
overrides: [
  {
    files: ['src/specific-file.js'],
    rules: {
      'brand-security/no-brand-references': 'off'
    }
  }
];
```

#### Option 3: Script Exclusion

Edit `scripts/check-brand-exposure.sh`:

```bash
EXCLUDE_PATTERNS=(
  # ... existing patterns
  "src/legacy"
  "specific-directory/"
)
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/brand-check.yml`

**Triggers**:

- Pull requests to `main` or `develop`
- Direct pushes to `main` or `develop`

**Steps**:

1. ✅ ESLint brand security check
2. ✅ Full codebase brand scan
3. ✅ Production bundle analysis
4. ✅ TruffleHog secret detection
5. ✅ PR comment with results
6. ❌ Blocks merge if violations found

**Artifacts**:

- `brand-exposure-report.txt`
- `eslint-brand-report.json`
- `bundle-security-report.txt`

### Testing the Workflow

**Locally**:

```bash
# Simulate CI checks
npm run lint:brand
npm run check:brand
npm run analyze:bundle
```

**On GitHub**:

1. Create a feature branch
2. Make changes with brand references
3. Push and create PR
4. Workflow runs automatically
5. Check PR comments for results

---

## Troubleshooting

### Issue: Pre-commit Hook Blocks Legitimate Code

**Symptom**: Can't commit imports or type definitions

**Solution**:

- Pre-commit hook excludes imports automatically
- If still blocked, check file path matches exclusion patterns
- Temporarily bypass: `git commit --no-verify` (not recommended)

### Issue: Too Many False Positives

**Solution**:

1. Review `.eslintrc.brand-check.js` overrides
2. Add specific file patterns to exclusions
3. Use ESLint disable comments for specific lines

### Issue: Bundle Analysis Fails

**Symptom**: `analyze-bundle.sh` exits with errors

**Check**:

```bash
# Ensure build scripts exist
cd packages/formio-file-upload
npm run build

cd ../../form-client-web-app
npm run build
```

**Solution**:

- Verify build scripts in `package.json`
- Check for build errors first
- Run bundle analysis after successful build

### Issue: GitHub Action Fails

**Common Causes**:

1. Missing pnpm installation
2. Build failures
3. Permissions issues

**Debug**:

```bash
# Check workflow syntax
gh workflow view brand-check.yml

# View workflow runs
gh run list --workflow=brand-check.yml

# View specific run logs
gh run view [run-id] --log
```

---

## Next Steps

### Phase 1: Fix Current Violations (Recommended)

**Priority**: High

**Task**: Review and fix brand references in `form-client-web-app/src/`

**Approach**:

1. Review `brand-exposure-report.txt`
2. Categorize violations:
   - ✅ Legitimate (imports, types) → Already excluded
   - ⚠️ UI text → Replace with environment variables
   - ⚠️ Variable names → Rename to generic terms
3. Fix violations systematically
4. Re-run checks

**Example Fix**:

```javascript
// Before
const formioServerUrl = 'http://localhost:3001';

// After
const formServerUrl = process.env.FORM_SERVER_URL || 'http://localhost:3001';
```

### Phase 2: Production Build Configuration

**Priority**: High

**Task**: Configure production builds to strip brands

**Files to Modify**:

- `form-client-web-app/vite.config.ts`
- `packages/formio-file-upload/rollup.config.js`

**Changes**:

```javascript
// vite.config.ts
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    sourcemap: false
  },
  define: {
    'process.env.PLATFORM_NAME': JSON.stringify('Qrius Platform')
  }
};
```

### Phase 3: IDE Integration

**Priority**: Medium

**Task**: Enable real-time linting in IDEs

**VSCode**:

1. Install ESLint extension
2. Add to `.vscode/settings.json`:

```json
{
  "eslint.options": {
    "configFile": ".eslintrc.brand-check.js"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

**WebStorm/IntelliJ**:

1. Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Configuration file: `.eslintrc.brand-check.js`
3. Enable automatic ESLint configuration

### Phase 4: Team Onboarding

**Priority**: Medium

**Task**: Train team on brand security practices

**Materials**:

- Share `docs/LINTING.md`
- Review `docs/INDUSTRY_BEST_PRACTICES_OBFUSCATION.md`
- Conduct code review guidelines training

**Best Practices**:

1. Always use environment variables for brand names
2. Review pre-commit warnings
3. Run `npm run security:check` before PR
4. Address CI/CD failures immediately

---

## Maintenance

### Weekly Tasks

- [ ] Review `brand-exposure-report.txt` for new violations
- [ ] Check CI/CD workflow success rate
- [ ] Update ESLint rules if false positives found

### Monthly Tasks

- [ ] Review and update brand keyword list
- [ ] Audit bundle sizes and source map leaks
- [ ] Update documentation with new patterns

### Quarterly Tasks

- [ ] Review industry best practices
- [ ] Audit legal compliance (LICENSE files)
- [ ] Security review of detection rules

---

## Metrics to Track

### Code Quality Metrics

1. **Brand Violation Count**: Track over time
   - Current: ~45 violations
   - Target: < 5 violations in production code

2. **Pre-commit Block Rate**:
   - Measure: Commits blocked / Total commits
   - Target: < 5% (most violations caught during development)

3. **CI/CD Success Rate**:
   - Measure: Passed checks / Total PR checks
   - Target: > 95%

4. **Bundle Size**:
   - Measure: Production bundle size
   - Target: < 2MB compressed

5. **False Positive Rate**:
   - Measure: Incorrectly flagged code / Total flags
   - Target: < 10%

### Business Impact Metrics

1. **Support Ticket Reduction**: Fewer brand confusion issues
2. **Enterprise Deal Success**: Professional appearance
3. **Legal Compliance**: Zero license violations
4. **Developer Productivity**: Time spent fixing violations

---

## Resources

### Documentation

- **Complete Guide**: `docs/LINTING.md`
- **Industry Research**: `docs/INDUSTRY_BEST_PRACTICES_OBFUSCATION.md`
- **Setup Instructions**: `SETUP_INSTRUCTIONS.md` (this file)

### Reports

- **Brand Exposure**: `brand-exposure-report.txt` (generated by
  `npm run check:brand`)
- **Bundle Security**: `bundle-security-report.txt` (generated by
  `npm run analyze:bundle`)

### Tools

- **ESLint Plugin**: `eslint-plugin-brand-security/`
- **Shell Scripts**: `scripts/check-brand-exposure.sh`,
  `scripts/analyze-bundle.sh`
- **GitHub Workflow**: `.github/workflows/brand-check.yml`

---

## Support

### Getting Help

**Internal**:

1. Review documentation in `docs/`
2. Check troubleshooting section above
3. Review GitHub workflow logs

**External Resources**:

- [ESLint Documentation](https://eslint.org/docs/)
- [Husky Git Hooks](https://typicode.github.io/husky/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## Changelog

### v1.0.0 (2025-10-13)

**Initial Release**

- ✅ ESLint custom plugin with 4 rules
- ✅ Brand exposure detection script
- ✅ Bundle security analysis script
- ✅ Pre-commit hook enhancements
- ✅ GitHub Actions workflow
- ✅ Comprehensive documentation
- ✅ Industry best practices research
- ✅ NPM scripts integration

**Components**:

- `eslint-plugin-brand-security/` - Custom ESLint plugin
- `.eslintrc.brand-check.js` - Brand security configuration
- `scripts/check-brand-exposure.sh` - Codebase scanner
- `scripts/analyze-bundle.sh` - Bundle analyzer
- `.husky/pre-commit` - Enhanced git hook
- `.github/workflows/brand-check.yml` - CI/CD workflow
- `docs/LINTING.md` - Usage guide
- `docs/INDUSTRY_BEST_PRACTICES_OBFUSCATION.md` - Research document

**Testing**:

- ✅ Script execution verified
- ✅ Violations detected and reported
- ✅ Pre-commit hook tested
- ✅ NPM scripts functional

---

**Last Updated**: 2025-10-13 **Version**: 1.0.0 **Author**: Qrius Platform Team
**Status**: Production Ready
