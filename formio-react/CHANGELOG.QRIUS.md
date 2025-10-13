# Qrius Changelog - @qrius/formio-react

All Qrius-specific changes to this fork are documented here.

For upstream changes, see [Changelog.md](./Changelog.md).

## Format

This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
- **Qrius**: Qrius-specific customizations and rationale

---

## [Unreleased]

### Qrius

- Planning next iteration of improvements

---

## [6.1.0-qrius.1] - 2025-10-13

### Changed

- **BREAKING**: Moved `@formio/js` and `@formio/core` from `peerDependencies` to regular `dependencies`
- Consuming apps now only need to install `@qrius/formio-react`, not `@formio/js` separately
- Package name changed from `@formio/react` to `@qrius/formio-react`
- Repository URL updated to `https://github.com/QriusGlobal/formio-react.git`

### Added

- Exported `Formio` instance from main entry point (`src/index.ts`)
- GitHub Packages publishing workflow (`.github/workflows/publish.yml`)
- Fork-specific documentation:
    - `README.FORK.md` - Fork structure and usage guide
    - `CLAUDE.md` - AI assistant instructions for fork development
    - `CHANGELOG.QRIUS.md` - This file
- Patch management system:
    - `patches/` directory for tracking customizations
    - `scripts/manage-patches.sh` - Patch management utility
    - `patches/README.md` - Patch documentation
- Development workflow documentation:
    - `docs/FORK_MAINTENANCE_BEST_PRACTICES.md` - Complete maintenance guide

### Qrius

- **Rationale**: Private package should bundle all dependencies for zero-config consumption by consuming applications
- **Benefit**: Developers installing `@qrius/formio-react` get everything they need without managing peer dependencies
- **Patches**:
    - `0001-bundle-dependencies.patch` - Dependency bundling changes
    - `0002-export-formio-instance.patch` - Formio export for component registration
    - `0003-github-packages-workflow.patch` - CI/CD pipeline
- **Upstream Status**: Cannot contribute (Qrius-specific business requirement)
- **Integration**: Works with `@formio/file-upload` package in monorepo

---

## [6.1.0] - 2024-XX-XX

### Changed

- Synced with upstream @formio/react v6.1.0
- See [Changelog.md](./Changelog.md) for full upstream release notes

### Qrius

- Initial fork created from upstream v6.1.0
- No customizations in this version (baseline)

---

## Versioning

This fork follows **upstream version + Qrius pre-release tag**:

```
<upstream-version>-qrius.<increment>

Examples:
  6.1.0-qrius.1  (First Qrius release based on upstream 6.1.0)
  6.1.0-qrius.2  (Second Qrius release, hotfix or enhancement)
  6.2.0-qrius.1  (First Qrius release after upstream 6.2.0 sync)
```

### Version Compatibility

| @qrius/formio-react | Upstream @formio/react | React | @formio/js |
| ------------------- | ---------------------- | ----- | ---------- |
| 6.1.0-qrius.1       | 6.1.0                  | 19    | 5.x        |

---

## Contributing

When making Qrius-specific changes:

1. **Make changes** in your feature branch
2. **Update this CHANGELOG** under `[Unreleased]` section
3. **Generate patch files**:
    ```bash
    ./scripts/manage-patches.sh generate
    ```
4. **Document patches** in `patches/README.md`
5. **Commit** with structured message:

    ```
    feat(qrius): short description

    Detailed explanation of changes and motivation.

    Qrius-Specific: Business/technical reason
    Upstream Status: Cannot contribute / Contributed (PR link)
    Patch: patches/NNNN-description.patch
    ```

### Commit Message Format

```
<type>(qrius): <subject>

<body>

Qrius-Specific: <reason>
Upstream Status: <status>
Patch: <patch-file>
```

**Types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

---

## Maintenance

### Upstream Sync Process

When syncing with upstream:

1. **Save patches**: `./scripts/manage-patches.sh generate`
2. **Merge upstream**: `git merge upstream/main`
3. **Resolve conflicts**:
    - Accept upstream's `Changelog.md`
    - Preserve Qrius changes in `package.json`
    - Keep Formio export in `src/index.ts`
4. **Test**: `npm test && npm run build`
5. **Regenerate patches**: `./scripts/manage-patches.sh generate`
6. **Update this file** with new entry documenting upstream sync

### Release Process

1. **Update version**: `npm version <version> --no-git-tag-version`
2. **Move `[Unreleased]` to `[<version>]` with date** in this file
3. **Commit**: `git commit -m "chore: release <version>"`
4. **Tag**: `git tag -a v<version> -m "Release <version>"`
5. **Push**: `git push origin main --tags` (triggers CI/CD)

---

## Links

- **Upstream Repository**: https://github.com/formio/react
- **Upstream CHANGELOG**: [Changelog.md](./Changelog.md)
- **Qrius Fork**: https://github.com/QriusGlobal/formio-react
- **Package Registry**: GitHub Packages (`@qrius` scope)
- **Monorepo**: https://github.com/mishaal79/formio-monorepo-private
- **Patch Documentation**: [patches/README.md](./patches/README.md)
- **Maintenance Guide**: [docs/FORK_MAINTENANCE_BEST_PRACTICES.md](../docs/FORK_MAINTENANCE_BEST_PRACTICES.md)

---

**Maintained By**: Qrius Global  
**License**: MIT (same as upstream)  
**Support**: Internal use only - no public support
