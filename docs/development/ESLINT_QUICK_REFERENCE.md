# ESLint Quick Reference Guide

## 🚀 Common Commands

### Daily Development
```bash
# Run lint (will fail with violations)
pnpm lint

# Run lint and auto-fix what's safe
pnpm lint:fix

# Run lint with cache (faster subsequent runs)
pnpm lint:cache

# Check formatting
pnpm format:check

# Auto-format all code
pnpm format
```

### Package-Specific Linting
```bash
# Lint file upload module only
pnpm exec eslint "packages/formio-file-upload/**/*.ts"

# Lint test app only
pnpm exec eslint "form-client-web-app/src/**/*.{ts,tsx}"

# Lint with auto-fix
pnpm exec eslint "form-client-web-app/src/**/*.{ts,tsx}" --fix
```

### TypeScript Checking
```bash
# Check all TypeScript compilation
pnpm typecheck

# Check specific package
cd packages/formio-file-upload
pnpm exec tsc --noEmit
```

---

## 📊 Current Baseline (Phase 1 Complete)

### Total Violations
- **8,351 problems** (3,620 errors, 4,731 warnings)
- **673 auto-fixable** (8.1% of total)

### By Package
- **packages/formio-file-upload**: 750 (617 errors, 133 warnings)
- **form-client-web-app**: 192 (141 errors, 51 warnings)  
- **formio-react**: 14 (parsing errors)
- **E2E tests**: ~7,400 (mostly false positives)

---

## ⚙️ Configuration Files

### Primary Files (Created/Fixed)
- ✅ `eslint.config.mjs` - ESLint 9 flat config (22 KB)
- ✅ `tsconfig.json` - Root TypeScript config (770 bytes)
- ✅ `tests/tsconfig.json` - Test TypeScript config (276 bytes)
- ✅ `.husky/pre-commit` - Pre-commit hook with lint-staged (1.3 KB)
- ✅ `package.json` - lint-staged configuration added

### Plugin Ecosystem (All Loaded)
1. @eslint/js
2. @typescript-eslint/eslint-plugin
3. eslint-plugin-react
4. eslint-plugin-react-hooks
5. eslint-plugin-react-refresh
6. eslint-plugin-security
7. eslint-plugin-no-secrets
8. eslint-plugin-no-unsanitized
9. eslint-plugin-sonarjs
10. eslint-plugin-unicorn
11. eslint-plugin-promise
12. eslint-plugin-import
13. eslint-plugin-jsx-a11y
14. eslint-plugin-jest
15. eslint-plugin-jest-dom
16. eslint-plugin-testing-library
17. eslint-config-prettier

---

## 🐛 Known Issues & Workarounds

### Issue 1: formio-react Parsing Errors
**Error**: "File not found in provided project(s)"  
**Workaround**: 
```bash
# Exclude formio-react from root linting
pnpm exec eslint . --ignore-pattern "formio-react/**"
```

### Issue 2: E2E Test False Positives
**Error**: Too many warnings in test files  
**Temporary Fix**: Use `--max-warnings=999999` for tests
```bash
pnpm exec eslint "**/*.spec.ts" --max-warnings=999999
```

### Issue 3: Missing @types/node
**Error**: "Cannot find name 'process'"  
**Fix**: Add to package.json devDependencies
```bash
cd packages/formio-file-upload
pnpm add -D @types/node
```

---

## 🔥 Auto-Fix Strategy

### Step 1: Auto-fixable violations (~673)
```bash
# Fix import ordering
pnpm lint:fix

# Then check remaining violations
pnpm lint | grep "✖"
```

### Step 2: Manual fixes by priority
1. **Critical security issues** (0 found ✅)
2. **Type safety** (`no-explicit-any`, `no-unsafe-*`)
3. **Code quality** (`cognitive-complexity`, `no-duplicate-string`)
4. **Style** (`prefer-template`, `object-shorthand`)

---

## 🧪 Pre-Commit Hook Behavior

### What Gets Checked (Automatically)
- ESLint on staged `.ts`, `.tsx`, `.js`, `.jsx` files
- Prettier on staged `.json`, `.md` files
- No `.env` files committed
- No `.map` files committed
- Secret detection (basic patterns)

### How to Bypass (EMERGENCY ONLY)
```bash
git commit --no-verify -m "emergency fix"
```

### How to Test Hook
```bash
# Stage a file
git add some-file.ts

# Run hook manually
.husky/pre-commit

# Unstage if just testing
git reset HEAD some-file.ts
```

---

## 📈 Phase 2 Roadmap

### Week 1: Auto-Fix & Low-Hanging Fruit
- [ ] Run `pnpm lint:fix` (fixes 673 violations automatically)
- [ ] Fix `formio-react` tsconfig issues
- [ ] Add test-specific rule relaxations
- **Target**: Reduce violations to ~6,000

### Week 2: Type Safety (file-upload package)
- [ ] Replace `any` types with proper types (128 instances)
- [ ] Fix unsafe member access (94 instances)
- [ ] Add explicit function return types (warnings)
- **Target**: Reduce to ~500 violations in file-upload

### Week 3: Type Safety (test app)
- [ ] Fix import ordering (47 errors)
- [ ] Add type annotations (26 unsafe member access)
- [ ] Fix React best practices
- **Target**: Reduce to ~50 violations in test app

### Week 4: Final Cleanup
- [ ] Address remaining warnings
- [ ] Run full test suite
- [ ] Update documentation
- **Target**: < 100 total violations across monorepo

---

## 💡 Tips & Best Practices

### For Faster Linting
```bash
# Use cache for repeat runs
pnpm lint:cache

# Lint only changed files
git diff --name-only | grep '\\.tsx\\?$' | xargs pnpm exec eslint
```

### For Better DX
```bash
# Add to VS Code settings.json
{
  "eslint.experimental.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### For CI/CD
```bash
# Fail on errors, allow warnings
pnpm exec eslint . --max-warnings=9999

# Strict mode (fail on any violations)
pnpm exec eslint . --max-warnings=0
```

---

## 🆘 Troubleshooting

### ESLint not finding config
```bash
# Verify config syntax
node -c eslint.config.mjs

# Print resolved config
pnpm exec eslint --print-config eslint.config.mjs
```

### TypeScript parser errors
```bash
# Check tsconfig exists
ls -la tsconfig.json tests/tsconfig.json

# Validate tsconfig
pnpm exec tsc --noEmit
```

### Pre-commit hook not running
```bash
# Check executable bit
ls -la .husky/pre-commit

# Make executable
chmod +x .husky/pre-commit
```

---

**Last Updated**: 2025-10-14  
**ESLint Version**: 9.17.0  
**Configuration Format**: Flat Config (eslint.config.mjs)  
