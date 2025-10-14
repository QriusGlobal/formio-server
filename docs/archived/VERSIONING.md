# Versioning Strategy

## Current Status: Pre-Stable (0.0.x)

All packages in this monorepo are currently in **pre-stable development**:

- `@qrius/formio-react`: 0.0.1
- `@formio/file-upload`: 0.0.1
- `form-client-web-app`: 0.0.1

## Stability Guarantees

**0.0.x versions**: No stability guarantees

- Breaking changes may occur in any release
- API surface may change without notice
- Not recommended for production use

**1.0.0 release criteria**:

- [ ] All packages successfully build in CI
- [ ] E2E tests pass consistently
- [ ] Production validation in live environment
- [ ] API surface finalized and documented
- [ ] Security audit completed

## Versioning Scheme

We follow semantic versioning with workspace protocol:

- `workspace:*` - Always use workspace version
- `workspace:^` - Compatible workspace versions
- `workspace:~` - Patch-level workspace versions

## Current Package Graph

```
@qrius/formio-react (0.0.1)
  └── bundles: @formio/js, @formio/core

@formio/file-upload (0.0.1)
  └── peerDeps: @formio/js (via @qrius/formio-react)

form-client-web-app (0.0.1)
  └── depends: @qrius/formio-react (workspace:*)
  └── depends: @formio/file-upload (workspace:*)
```

## Dependency Resolution

**Single Formio Instance Strategy**:

- `@formio/js` is bundled ONLY in `@qrius/formio-react`
- No other package should directly depend on `@formio/js`
- All packages get `@formio/js` transitively through `@qrius/formio-react`
- This ensures a single Formio instance across the application

**Workspace Protocol Benefits**:

- Symlinked packages in development (instant updates)
- Correct versioning in published packages
- Prevents accidental npm registry resolution

## Version Bump Guidelines

When to increment versions:

**0.0.x → 0.0.y** (Patch):

- Bug fixes
- Internal refactoring
- Documentation updates

**0.0.x → 0.1.0** (Minor - when more stable):

- New features
- API additions (backward compatible)
- Performance improvements

**0.x.x → 1.0.0** (Major - production ready):

- All release criteria met
- API surface frozen
- Production validation complete
- Security audit passed

## Migration Path to Stability

```
Current:     0.0.1 (active development)
             ↓
Alpha:       0.1.0 (feature complete, internal testing)
             ↓
Beta:        0.9.0 (external testing, API freeze)
             ↓
RC:          0.99.0 (release candidate)
             ↓
Stable:      1.0.0 (production ready)
```

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [formio-react/CHANGELOG.QRIUS.md](./formio-react/CHANGELOG.QRIUS.md) -
  Fork-specific changes
- [packages/formio-file-upload/README.md](./packages/formio-file-upload/README.md) -
  File upload module docs
