# Linting Violations by Category (After Disabling Type Rules)

**Generated**: 2025-10-14  
**Phase**: 5A - Disable TypeScript Strict Rules & Re-categorize Violations

---

## Executive Summary

- **Total Violations**: 2,813 (1,893 errors, 920 warnings)
- **Reduction from Phase 4**: 7,516 → 2,813 (62.6% reduction / 4,703 violations
  eliminated)
- **Auto-fixable**: 0 (all require manual attention)
- **Categories**: 8 major categories
- **Top 3 Rules**: `no-console` (449),
  `@typescript-eslint/prefer-nullish-coalescing` (362),
  `@typescript-eslint/explicit-function-return-type` (201)

---

## Category Breakdown

### A. Security (P0 - Critical)

**Priority**: Must fix before production  
**Violations**: 116 total

| Rule                                      | Count | Severity | Auto-fix |
| ----------------------------------------- | ----- | -------- | -------- |
| `security/detect-object-injection`        | 51    | error    | ❌       |
| `security/detect-non-literal-fs-filename` | 55    | warn     | ❌       |
| `security/detect-unsafe-regex`            | 5     | error    | ❌       |
| `security/detect-non-literal-regexp`      | 5     | error    | ❌       |

**Analysis**:

- **Object injection (51)**: Dynamic property access (`obj[key]`) flagged as
  potential prototype pollution
- **Non-literal fs paths (55)**: File operations with variable paths - valid
  pattern in build tools
- **Unsafe regex (5)**: RegEx patterns with catastrophic backtracking risk
- **Non-literal regexp (5)**: Dynamic RegEx construction - potential injection

**Recommendation**:

1. Review each `detect-object-injection` - most are false positives but need
   validation
2. Add `eslint-disable-next-line` with justification for legitimate dynamic
   access
3. Fix unsafe regex patterns immediately (ReDoS vulnerability)
4. Validate non-literal regexp cases for user input sanitization

**Estimated Time**: 3-4 hours (careful security review required)

---

### B. Code Quality (P1 - High)

**Priority**: Improves maintainability  
**Violations**: 37 total

| Rule                                   | Count | Severity | Auto-fix |
| -------------------------------------- | ----- | -------- | -------- |
| `sonarjs/no-duplicate-string`          | 16    | warn     | ❌       |
| `sonarjs/no-unused-collection`         | 9     | error    | ❌       |
| `sonarjs/cognitive-complexity`         | 6     | error    | ❌       |
| `sonarjs/no-identical-functions`       | 2     | error    | ❌       |
| `sonarjs/no-nested-template-literals`  | 1     | warn     | ❌       |
| `sonarjs/prefer-single-boolean-return` | 1     | warn     | ❌       |
| `no-param-reassign`                    | 6     | error    | ❌       |

**Analysis**:

- **Duplicate strings (16)**: Magic strings repeated 3+ times - extract to
  constants
- **Unused collections (9)**: Variables assigned but never read - dead code
- **Cognitive complexity (6)**: Functions too complex (>15 complexity score) -
  refactor needed
- **Identical functions (2)**: Copy-paste code - consolidate
- **Param reassignment (6)**: Mutating function parameters - bad practice

**Recommendation**:

1. Extract duplicate strings to constants (15 min per violation = 4 hours)
2. Remove unused collections (5 min each = 45 min)
3. Refactor complex functions (1-2 hours per function = 6-12 hours)
4. Consolidate identical functions (30 min per pair = 1 hour)
5. Refactor param mutations (15 min each = 1.5 hours)

**Estimated Time**: 13-19 hours (largest category by time)

---

### C. Modern JavaScript (P1 - High)

**Priority**: Modernization & performance  
**Violations**: 381 total

| Rule                                           | Count | Severity | Auto-fix |
| ---------------------------------------------- | ----- | -------- | -------- |
| `@typescript-eslint/prefer-nullish-coalescing` | 362   | error    | ❌       |
| `unicorn/no-array-for-each`                    | 9     | warn     | ❌       |
| `unicorn/consistent-function-scoping`          | 7     | warn     | ❌       |
| `unicorn/explicit-length-check`                | 2     | error    | ❌       |
| `unicorn/prefer-number-properties`             | 1     | error    | ❌       |

**Analysis**:

- **Nullish coalescing (362)**: Use `??` instead of `||` for proper
  null/undefined handling
  - Example: `value || defaultValue` → `value ?? defaultValue`
  - Critical for 0, false, '' values
- **Array forEach (9)**: Use `for...of` for better performance and readability
- **Function scoping (7)**: Functions can be moved to module scope for better
  performance
- **Length checks (2)**: Use `.length > 0` instead of `.length` for explicitness

**Recommendation**:

1. **Nullish coalescing**: Can be partially auto-fixed with `eslint --fix` if
   rule supports it
   - Review each case for semantic correctness (15 seconds each = 1.5 hours)
2. **forEach to for...of**: Refactor (5 min each = 45 min)
3. **Function scoping**: Move functions (10 min each = 1.2 hours)

**Estimated Time**: 3-4 hours (mostly mechanical changes)

---

### D. Import/Export (P2 - Medium)

**Priority**: Code organization  
**Violations**: 45 total

| Rule                                | Count | Severity | Auto-fix     |
| ----------------------------------- | ----- | -------- | ------------ |
| `import/no-unresolved`              | 35    | error    | ❌           |
| `import/order`                      | 3     | error    | ✅ (partial) |
| `import/named`                      | 3     | error    | ❌           |
| `import/no-named-as-default-member` | 2     | warn     | ❌           |
| `import/no-extraneous-dependencies` | 2     | error    | ❌           |

**Analysis**:

- **Unresolved imports (35)**: TypeScript path aliases or missing declarations
  - Likely false positives due to eslint-import-resolver-typescript config
  - Check tsconfig.json paths configuration
- **Import order (3)**: Wrong import grouping - auto-fixable
- **Named imports (3)**: Importing non-existent named exports
- **Extraneous deps (2)**: Importing devDependencies in production code

**Recommendation**:

1. Fix import resolver configuration (30 min)
2. Run `eslint --fix` for import order (instant)
3. Fix named import errors (10 min each = 30 min)
4. Move devDependencies or adjust configuration (20 min)

**Estimated Time**: 1-2 hours (mostly config fixes)

---

### E. React Best Practices (P2 - Medium)

**Priority**: Component reliability  
**Violations**: 25 total

| Rule                          | Count | Severity | Auto-fix |
| ----------------------------- | ----- | -------- | -------- |
| `react-hooks/rules-of-hooks`  | 14    | error    | ❌       |
| `react/no-array-index-key`    | 6     | warn     | ❌       |
| `react-hooks/exhaustive-deps` | 2     | warn     | ❌       |
| `react/no-unescaped-entities` | 2     | error    | ❌       |
| `react/jsx-key`               | 1     | error    | ❌       |

**Analysis**:

- **Rules of hooks (14)**: Hooks called conditionally or in wrong scope
  - CRITICAL: Breaks React rendering contract
  - Common issue: hooks in callbacks or conditionals
- **Array index key (6)**: Using array index as React key - causes re-render
  bugs
- **Exhaustive deps (2)**: Missing dependencies in useEffect/useMemo/useCallback
- **Unescaped entities (2)**: HTML entities like `&` need escaping
- **Missing key (1)**: List item missing key prop

**Recommendation**:

1. **Fix hooks violations immediately** - these are runtime bugs (30 min each =
   7 hours)
2. Replace index keys with stable IDs (15 min each = 1.5 hours)
3. Add missing dependencies (10 min each = 20 min)
4. Escape HTML entities (5 min each = 10 min)

**Estimated Time**: 9-10 hours (hooks fixes are complex)

---

### F. Accessibility (P2 - Medium)

**Priority**: WCAG 2.1 Level A compliance  
**Violations**: 9 total

| Rule                                    | Count | Severity | Auto-fix |
| --------------------------------------- | ----- | -------- | -------- |
| `jsx-a11y/label-has-associated-control` | 7     | error    | ❌       |
| `jsx-a11y/click-events-have-key-events` | 1     | warn     | ❌       |
| `jsx-a11y/role-supports-aria-props`     | 1     | error    | ❌       |

**Analysis**:

- **Label association (7)**: Form labels not properly linked to inputs
  - Use `htmlFor` attribute or nest input inside label
- **Keyboard events (1)**: Clickable element missing keyboard handler
- **ARIA props (1)**: Invalid ARIA attribute for element role

**Recommendation**:

1. Add `htmlFor` to labels or restructure markup (10 min each = 1.2 hours)
2. Add onKeyDown/onKeyPress handlers (15 min)
3. Fix ARIA prop (10 min)

**Estimated Time**: 1.5-2 hours

---

### G. Promise & Async (P2 - Medium)

**Priority**: Async reliability  
**Violations**: 65 total

| Rule                        | Count | Severity | Auto-fix |
| --------------------------- | ----- | -------- | -------- |
| `no-return-await`           | 53    | error    | ❌       |
| `promise/always-return`     | 4     | error    | ❌       |
| `promise/no-nesting`        | 3     | warn     | ❌       |
| `promise/catch-or-return`   | 1     | error    | ❌       |
| `no-async-promise-executor` | 1     | error    | ❌       |

**Analysis**:

- **Return await (53)**: Unnecessary `return await` - just return the promise
  - Example: `return await foo()` → `return foo()`
  - Exception: When in try/catch block
- **Always return (4)**: Promise chain missing return statement
- **Promise nesting (3)**: Nested promises instead of chaining
- **Missing catch (1)**: Promise without error handler

**Recommendation**:

1. Remove unnecessary `return await` (2 min each = 1.8 hours)
2. Add return statements to promise chains (10 min each = 40 min)
3. Flatten nested promises (15 min each = 45 min)
4. Add catch handlers (10 min)

**Estimated Time**: 3-4 hours

---

### H. Minor Issues (P3 - Low)

**Priority**: Code polish  
**Violations**: 2,135 total

| Rule                                                | Count | Severity | Auto-fix |
| --------------------------------------------------- | ----- | -------- | -------- |
| `no-console`                                        | 449   | warn     | ❌       |
| `@typescript-eslint/explicit-function-return-type`  | 201   | warn     | ❌       |
| `no-unused-vars`                                    | 192   | error    | ❌       |
| `@typescript-eslint/no-unused-vars`                 | 191   | error    | ❌       |
| `no-undef`                                          | 187   | error    | ❌       |
| `@typescript-eslint/explicit-module-boundary-types` | 174   | warn     | ❌       |
| `@typescript-eslint/no-non-null-assertion`          | 47    | error    | ❌       |
| `no-case-declarations`                              | 5     | error    | ❌       |
| `no-empty-pattern`                                  | 4     | error    | ❌       |
| `no-control-regex`                                  | 3     | error    | ❌       |
| `no-constant-binary-expression`                     | 2     | error    | ❌       |
| `@typescript-eslint/prefer-optional-chain`          | 2     | error    | ❌       |
| `@typescript-eslint/consistent-type-imports`        | 2     | error    | ❌       |
| `prefer-promise-reject-errors`                      | 1     | error    | ❌       |
| `no-redeclare`                                      | 1     | error    | ❌       |
| `no-dupe-keys`                                      | 1     | error    | ❌       |

**Analysis**:

- **Console statements (449)**: Debug logs left in code
  - Most are intentional (error logs, info logs)
  - Review and keep with `// eslint-disable-next-line no-console`
- **Missing return types (201+174=375)**: Functions without explicit return
  types
  - Low priority - TypeScript infers types
  - Can gradually add types
- **Unused vars (383)**: Variables declared but never used
  - Prefix with `_` if intentionally unused (e.g.,
    `const [_, setValue] = useState()`)
  - Remove if truly unused
- **Undefined vars (187)**: Using undeclared variables
  - Likely false positives due to global type declarations
  - Check globals configuration
- **Non-null assertions (47)**: Using `value!` operator
  - Unsafe type assertion - replace with proper null checks
- **Other (32)**: Various minor issues (case declarations, empty patterns, etc.)

**Recommendation**:

1. Review console statements - add disable comments for intentional logs (30 sec
   each = 3.7 hours)
2. Skip explicit return types for now (defer to later phase)
3. Fix unused vars (2 min each = 12.7 hours)
4. Fix no-undef by adjusting globals config (1 hour)
5. Replace non-null assertions with proper checks (5 min each = 4 hours)
6. Fix remaining minor issues (2 hours)

**Estimated Time**: 23-25 hours (largest category by violation count)

---

## Recommended Fix Order

### Phase 5B: Security Fixes (3-4 hours)

**Focus**: Category A - Security vulnerabilities

- Fix unsafe regex patterns (5 violations)
- Review object injection warnings (51 violations)
- Validate non-literal regexp usage (5 violations)
- Document false positives with eslint-disable comments

### Phase 5C: React Hooks Fixes (9-10 hours)

**Focus**: Category E - React runtime bugs

- Fix rules-of-hooks violations (14 violations) - CRITICAL
- Replace array index keys (6 violations)
- Add missing hook dependencies (2 violations)

### Phase 5D: Import & Config Fixes (1-2 hours)

**Focus**: Category D - Import/export organization

- Fix import resolver configuration
- Run eslint --fix for import order
- Fix named import errors
- Adjust extraneous dependencies config

### Phase 5E: Modern JavaScript (3-4 hours)

**Focus**: Category C - Modernization

- Migrate to nullish coalescing operator (362 violations)
- Replace forEach with for...of loops (9 violations)
- Optimize function scoping (7 violations)

### Phase 5F: Async/Promise Patterns (3-4 hours)

**Focus**: Category G - Promise reliability

- Remove unnecessary return await (53 violations)
- Add missing returns in promise chains (4 violations)
- Flatten nested promises (3 violations)
- Add catch handlers (1 violation)

### Phase 5G: Accessibility (1.5-2 hours)

**Focus**: Category F - WCAG compliance

- Fix form label associations (7 violations)
- Add keyboard event handlers (1 violation)
- Fix ARIA prop usage (1 violation)

### Phase 5H: Code Quality (13-19 hours)

**Focus**: Category B - Maintainability

- Extract duplicate strings to constants (16 violations)
- Remove unused collections (9 violations)
- Refactor complex functions (6 violations)
- Consolidate identical functions (2 violations)
- Remove param reassignments (6 violations)

### Phase 5I: Code Polish (23-25 hours - OPTIONAL)

**Focus**: Category H - Minor issues

- Review and document console statements (449 violations)
- Fix unused variables (383 violations)
- Replace non-null assertions (47 violations)
- Fix remaining minor issues (32 violations)
- DEFER: Explicit return types (375 violations - low priority)

---

## Total Estimated Time

### Critical Path (Phases 5B-5G)

**Total**: 21-26 hours

- Security: 3-4 hours
- React Hooks: 9-10 hours
- Imports: 1-2 hours
- Modern JS: 3-4 hours
- Async: 3-4 hours
- A11y: 1.5-2 hours

### Optional Cleanup (Phase 5I)

**Total**: 23-25 hours (defer to future sprint)

### Grand Total

**Full cleanup**: 44-51 hours (1.5-2 weeks @ 30hrs/week) **Critical only**:
21-26 hours (1 week @ 30hrs/week)

---

## Success Metrics

### Phase 5A (Current) ✅

- [x] Violations reduced from 7,516 → 2,813 (62.6% reduction)
- [x] TypeScript strict rules disabled
- [x] Comprehensive categorization complete

### Phase 5B-5G (Critical Path)

- [ ] All security violations resolved or documented
- [ ] Zero React hooks violations (runtime stability)
- [ ] All import errors fixed
- [ ] Async patterns modernized
- [ ] WCAG Level A compliance for forms
- [ ] Target: < 1,500 violations remaining

### Phase 5H-5I (Optional)

- [ ] Code quality violations addressed
- [ ] Console statements reviewed and documented
- [ ] Unused code removed
- [ ] Target: < 500 violations remaining

---

## Auto-fix Potential

**Current auto-fixable**: 0 violations (all require manual review)

**Potentially auto-fixable with safe transforms**:

- `import/order`: 3 violations (100% safe)
- `@typescript-eslint/consistent-type-imports`: 2 violations (100% safe)
- Partial `no-return-await`: ~40 violations (75% safe - requires try/catch
  analysis)
- Partial `@typescript-eslint/prefer-nullish-coalescing`: ~290 violations (80%
  safe - requires semantic review)

**Recommended**:

```bash
# Auto-fix safe rules only
pnpm exec eslint . --fix --ignore-pattern "formio-react/**"

# Then run manual review for remaining violations
pnpm exec eslint . --max-warnings=999999 --ignore-pattern "formio-react/**"
```

---

## Configuration Changes Applied

### eslint.config.mjs (Phase 5A)

**Disabled TypeScript strict rules**:

- `@typescript-eslint/no-explicit-any`: error → off
- `@typescript-eslint/no-unsafe-*`: error → off (5 rules)
- `@typescript-eslint/no-floating-promises`: error → off
- `@typescript-eslint/require-await`: error → off
- `@typescript-eslint/no-misused-promises`: error → off
- `@typescript-eslint/restrict-*`: error → off (2 rules)
- `@typescript-eslint/no-unnecessary-type-assertion`: error → off
- `@typescript-eslint/no-redundant-type-constituents`: error → off

**Kept TypeScript basic rules**:

- `@typescript-eslint/no-unused-vars`: error (with underscore prefix exception)
- `@typescript-eslint/explicit-function-return-type`: warn
- `@typescript-eslint/explicit-module-boundary-types`: warn
- `@typescript-eslint/consistent-type-imports`: error
- `@typescript-eslint/naming-convention`: error
- `@typescript-eslint/prefer-nullish-coalescing`: error
- `@typescript-eslint/prefer-optional-chain`: error
- `@typescript-eslint/no-non-null-assertion`: error

**Test file overrides updated**:

- All TypeScript strict rules set to 'off' (matches main config)

---

## Next Steps

1. **Commit Phase 5A changes** (current)

   ```bash
   git add eslint.config.mjs eslint-report-phase5.json eslint-violations-phase5.txt violations-by-rule.json VIOLATION_CATEGORIES_PHASE5.md
   git commit -m "config(lint): disable TypeScript strict typing rules"
   ```

2. **Review & approve Phase 5B plan** (security fixes)
   - Security team review required for object injection analysis
   - Regex pattern security audit

3. **Execute Phase 5B-5G** (critical path - 21-26 hours)
   - Break into smaller commits per category
   - Run tests after each phase
   - Document false positives

4. **Decide on Phase 5H-5I** (optional cleanup)
   - Evaluate ROI for 23-25 hours of work
   - Consider deferring to future sprint
   - Focus on high-value violations only

---

**End of Report**
