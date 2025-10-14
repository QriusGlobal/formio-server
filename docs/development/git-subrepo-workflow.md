# Git-Subrepo Workflow Guide

> **Comprehensive guide for managing Form.io upstream dependencies using git-subrepo in the Qrius platform**

**Last Updated**: 2025-01-10
**Target Audience**: Developers working on Qrius platform
**Prerequisites**: git-subrepo installed, basic git knowledge

---

## 🎯 What is Git-Subrepo?

Git-subrepo is a tool that manages external repositories as **subdirectories** in your main repository, similar to git-submodules but without the complexity. Key advantages:

- **Preserves local changes** - No re-cloning required
- **Clean history** - Upstream changes on dedicated branches
- **Simple commands** - `pull`, `push`, `status`
- **Normal git workflow** - Works with standard git commands
- **No .gitmodules** - Uses `.gitrepo` files instead

---

## 🏗️ Repository Structure

Our repository uses git-subrepo to manage three Form.io packages:

```
formio-monorepo-private/
│
├── main branch
│   ├── formio/                    # Subrepo → github.com/formio/formio
│   │   └── .gitrepo              # Metadata: remote URL, branch, commit
│   │
│   ├── formio-core/               # Subrepo → github.com/formio/core
│   │   └── .gitrepo
│   │
│   ├── formio-react/              # Subrepo → github.com/formio/react
│   │   └── .gitrepo
│   │
│   └── packages/
│       └── qrius-*/               # Your proprietary code
│
├── formio-upstream                # Tracking branch (auto-created)
├── formio-core-upstream           # Tracking branch (auto-created)
└── formio-react-upstream          # Tracking branch (auto-created)
```

---

## 🚀 Initial Setup (One-Time)

### Step 1: Install Git-Subrepo

```bash
# macOS
brew install git-subrepo

# Linux
git clone https://github.com/ingydotnet/git-subrepo /path/to/git-subrepo
echo 'source /path/to/git-subrepo/.rc' >> ~/.bashrc

# Verify installation
git subrepo version
# Expected: git-subrepo Version 0.4.6
```

### Step 2: Initialize Subrepos (Preserves Local Changes!)

```bash
# 1. Backup current state
git checkout main
git branch backup-before-subrepo
git add .
git commit -m "feat: save all local changes before subrepo conversion"

# 2. Initialize each subrepo
# This command:
# - Does NOT delete existing files
# - Creates .gitrepo metadata file
# - Creates tracking branch (e.g., formio-upstream)
# - Grafts upstream history into your repo

git subrepo init formio \
  -r https://github.com/formio/formio.git \
  -b formio-upstream

git subrepo init formio-core \
  -r https://github.com/formio/core.git \
  -b formio-core-upstream

git subrepo init formio-react \
  -r https://github.com/formio/react.git \
  -b formio-react-upstream

# 3. Verify initialization
git subrepo status formio
git subrepo status formio-core
git subrepo status formio-react

# 4. Check created branches
git branch -a
# Should see:
# * main
#   formio-upstream
#   formio-core-upstream
#   formio-react-upstream
```

### Step 3: Set Up Private Repository

```bash
# Add your private remote
git remote add private git@github.com:your-org/formio-monorepo-private.git

# Push main branch with all changes
git push private main

# Push upstream tracking branches
git push private formio-upstream
git push private formio-core-upstream
git push private formio-react-upstream

# Set private as default push remote
git config remote.pushDefault private
```

---

## 📥 Pulling Upstream Changes

### Basic Pull Workflow

```bash
# 1. Switch to tracking branch
git checkout formio-react-upstream

# 2. Pull latest from upstream
# This fetches from github.com/formio/react and merges to tracking branch
git subrepo pull formio-react

# Example output:
# git subrepo pull formio-react
# Subrepo 'formio-react' pulled from 'https://github.com/formio/react.git' (main).

# 3. Review changes
git log --oneline HEAD~10..HEAD
# Shows last 10 commits from upstream

git diff HEAD~5..HEAD
# Shows diff of last 5 commits

# 4. Switch back to main
git checkout main

# 5. Merge upstream changes (controlled)
git merge formio-react-upstream

# 6. Resolve conflicts if any
# See "Conflict Resolution" section below

# 7. Test thoroughly
pnpm install
pnpm turbo run test
pnpm turbo run build

# 8. Push to private repo
git push private main
```

### Checking for Upstream Updates

```bash
# Check status of all subrepos
git subrepo status

# Example output:
# Subrepo: formio
#   Remote: https://github.com/formio/formio.git
#   Branch: main
#   Commit: abc123def456
#   Pull Branch: formio-upstream
#   Clean: yes

# Check if upstream has new commits
git subrepo fetch formio-react
git log formio-react-upstream..FETCH_HEAD

# If output shows commits, there are upstream changes available
```

### Selective Upstream Pull

```bash
# Pull only specific commits from upstream
git checkout formio-react-upstream
git subrepo pull formio-react

# Cherry-pick specific commits
git cherry-pick abc123  # upstream commit hash

# Merge to main
git checkout main
git merge formio-react-upstream
```

---

## 📤 Pushing Changes to Upstream

### When to Push to Upstream

Only push changes that are **generic improvements** suitable for the open-source community:

✅ **Good candidates**:
- Bug fixes
- Performance improvements
- Documentation improvements
- Security fixes
- General feature enhancements

❌ **Don't push**:
- Qrius-specific customizations
- Proprietary business logic
- Internal configuration
- Branding/theming

### Push Workflow

```bash
# 1. Create feature branch for upstream contribution
git checkout -b feature/upstream-bug-fix

# 2. Make changes ONLY in the subrepo directory
cd formio-react
# Edit files...
cd ..

# 3. Commit changes
git add formio-react/
git commit -m "fix: resolve upload bug in FileComponent"

# 4. Push to upstream
git subrepo push formio-react

# Example output:
# git subrepo push formio-react
# Subrepo 'formio-react' pushed to 'https://github.com/formio/react.git' (main).

# 5. Create PR on GitHub
# Visit https://github.com/formio/react/pulls
# Your pushed commits will appear as a new branch
# Create PR from that branch to main
```

### Testing Before Push

```bash
# Always test in isolation before pushing
cd formio-react
npm install
npm test
npm run build

# If tests pass, proceed with push
cd ..
git subrepo push formio-react
```

---

## 🔄 Common Workflows

### Workflow 1: Daily Development (No Upstream Changes)

```bash
# Normal development - work on main branch
git checkout main

# Make changes to Qrius packages
vim packages/qrius-components/src/NewComponent.ts

# Commit and push
git add packages/
git commit -m "feat: add NewComponent"
git push private main

# Subrepos are unaffected - no special handling needed
```

### Workflow 2: Monthly Upstream Sync

```bash
# 1. Fetch all upstream changes
git subrepo fetch formio
git subrepo fetch formio-core
git subrepo fetch formio-react

# 2. Review available updates
git log formio-upstream..FETCH_HEAD --oneline
git log formio-core-upstream..FETCH_HEAD --oneline
git log formio-react-upstream..FETCH_HEAD --oneline

# 3. Pull each subrepo to its tracking branch
git checkout formio-upstream
git subrepo pull formio

git checkout formio-core-upstream
git subrepo pull formio-core

git checkout formio-react-upstream
git subrepo pull formio-react

# 4. Merge to main one at a time
git checkout main
git merge formio-upstream
# Test...

git merge formio-core-upstream
# Test...

git merge formio-react-upstream
# Test...

# 5. Run full test suite
pnpm install
pnpm turbo run test
pnpm turbo run build

# 6. Push to private
git push private main
```

### Workflow 3: Handling Major Upstream Breaking Changes

```bash
# 1. Pull upstream to tracking branch
git checkout formio-react-upstream
git subrepo pull formio-react

# 2. Create experimental branch from main
git checkout main
git checkout -b experiment/merge-upstream-breaking-change

# 3. Attempt merge
git merge formio-react-upstream

# 4. Resolve conflicts carefully
# See "Conflict Resolution Strategy" below

# 5. Test extensively
pnpm turbo run test
pnpm turbo run test:e2e
pnpm turbo run benchmark

# 6. If tests pass, merge to main
git checkout main
git merge experiment/merge-upstream-breaking-change

# 7. If tests fail, revert and document
git checkout main
git branch -D experiment/merge-upstream-breaking-change
# Document incompatibility in docs/UPSTREAM_COMPATIBILITY.md
```

### Workflow 4: Contributing Bug Fix Upstream

```bash
# 1. Reproduce bug in formio-react
cd formio-react
# Reproduce bug...

# 2. Fix in place
vim lib/components/FileComponent.js
# Apply fix...

# 3. Test locally
npm test

# 4. Commit with clear message
git add formio-react/
git commit -m "fix(FileComponent): handle null uploadProgress\n\nResolves crash when uploadProgress is null during initialization.\nAdds null check before accessing progress.percentage."

# 5. Push to upstream
git subrepo push formio-react

# 6. Create PR on GitHub
# Document fix, add tests, reference issue number
```

---

## ⚔️ Conflict Resolution Strategy

### Understanding Conflicts

Conflicts occur when:
- **Both modified**: Upstream and Qrius changed the same code
- **Upstream deleted**: Upstream removed code you customized
- **Qrius deleted**: You removed code upstream modified

### Resolution Priority

When conflicts occur, follow this priority:

1. **Preserve Qrius functionality** - Always keep working features
2. **Accept upstream fixes** - Merge bug fixes and security patches
3. **Integrate new features** - Adapt upstream features to Qrius
4. **Document decisions** - Record why conflicts were resolved certain ways

### Example Conflict Resolution

```bash
# After merge, git reports conflicts
git merge formio-react-upstream
# Auto-merging formio-react/lib/components/FileComponent.js
# CONFLICT (content): Merge conflict in formio-react/lib/components/FileComponent.js

# 1. View conflict
vim formio-react/lib/components/FileComponent.js

# Conflict markers:
<<<<<<< HEAD (Qrius changes)
if (this.qriusConfig.customUpload) {
  return this.qriusUploadHandler()
}
=======
if (this.options.uploadUrl) {
  return this.defaultUpload()
}
>>>>>>> formio-react-upstream (Upstream changes)

# 2. Resolution strategy: Keep both paths
# Resolve to:
if (this.qriusConfig?.customUpload) {
  return this.qriusUploadHandler()
} else if (this.options.uploadUrl) {
  return this.defaultUpload()
}

# 3. Mark resolved
git add formio-react/lib/components/FileComponent.js

# 4. Complete merge
git commit -m "chore: merge upstream Form.io React changes

Conflicts resolved in FileComponent.js:
- Preserved Qrius custom upload handler
- Integrated upstream default upload path
- Both paths now coexist"

# 5. Test thoroughly
cd formio-react
npm test
cd ..
pnpm turbo run test:e2e
```

### Conflict Resolution Matrix

| Conflict Type | Resolution Strategy |
|--------------|---------------------|
| **Qrius feature vs Upstream refactor** | Keep Qrius feature, adapt to new structure |
| **Qrius customization vs Upstream fix** | Keep fix, reapply customization on top |
| **Qrius deletion vs Upstream modification** | Keep deletion if intentional, merge if accidental |
| **Both added same feature differently** | Compare implementations, choose best or merge both |

---

## 🔍 Inspecting Subrepo State

### Check Subrepo Status

```bash
# Status of single subrepo
git subrepo status formio-react

# Output:
# Subrepo 'formio-react':
#   Remote:   https://github.com/formio/react.git
#   Branch:   main
#   Commit:   abc123def456 (on branch main)
#   Tracking: formio-react-upstream
#   Files:    Clean

# Status of all subrepos
git subrepo status

# Check if local changes exist
git subrepo clean formio-react
# Output: Subrepo formio-react is clean (if no changes)
```

### View Subrepo History

```bash
# Show commits specific to subrepo
git log -- formio-react/

# Show upstream commits on tracking branch
git checkout formio-react-upstream
git log --oneline -20

# Compare upstream branch to main
git log main..formio-react-upstream --oneline
# Shows commits in upstream not yet merged to main

git log formio-react-upstream..main --oneline
# Shows Qrius-specific commits not in upstream
```

### Inspect .gitrepo Metadata

```bash
# View subrepo metadata
cat formio-react/.gitrepo

# Example output:
; DO NOT EDIT (unless you know what you are doing)
;
; This subdirectory is a git "subrepo", and this file is maintained by the
; git-subrepo command. See https://github.com/ingydotnet/git-subrepo#readme
;
[subrepo]
	remote = https://github.com/formio/react.git
	branch = main
	commit = abc123def456789
	parent = xyz789abc123456
	method = merge
	cmdver = 0.4.6
```

---

## 🛠️ Troubleshooting

### Problem: "Subrepo is not clean"

```bash
# Check status
git subrepo status formio-react
# Output: Files: Dirty

# Solution 1: Commit changes
git add formio-react/
git commit -m "chore: update Form.io React"

# Solution 2: Stash changes
git stash push -m "WIP: formio-react changes" -- formio-react/

# Solution 3: Reset to clean state (DESTRUCTIVE!)
git checkout HEAD -- formio-react/
```

### Problem: "Cannot pull, local changes would be overwritten"

```bash
# This means upstream changes conflict with local changes

# Solution: Commit local changes first
git add formio-react/
git commit -m "chore: local Form.io React customizations"

# Then pull and handle conflicts
git subrepo pull formio-react
```

### Problem: "Push failed - permission denied"

```bash
# You don't have write access to upstream

# Solution 1: Fork upstream repo
# 1. Fork https://github.com/formio/react on GitHub
# 2. Update subrepo remote:
git subrepo config formio-react remote https://github.com/your-username/react.git

# 3. Push to your fork
git subrepo push formio-react

# 4. Create PR from your fork to upstream

# Solution 2: Contact upstream maintainers for write access
```

### Problem: "Tracking branch diverged"

```bash
# Upstream and tracking branch have diverged

# Check divergence
git log formio-react-upstream..origin/formio-react-upstream --oneline
git log origin/formio-react-upstream..formio-react-upstream --oneline

# Solution: Reset tracking branch to origin
git checkout formio-react-upstream
git reset --hard origin/formio-react-upstream

# Re-pull from upstream
git subrepo pull formio-react
```

---

## 📋 Cheat Sheet

### Essential Commands

```bash
# Initialize subrepo
git subrepo init <dir> -r <remote> -b <tracking-branch>

# Pull upstream changes
git subrepo pull <dir>

# Push changes to upstream
git subrepo push <dir>

# Check status
git subrepo status [<dir>]

# Fetch without merging
git subrepo fetch <dir>

# Clone repository with subrepos
git subrepo clone <remote> [<dir>]

# Show subrepo configuration
git subrepo config <dir> [<option>]
```

### Daily Commands

```bash
# Morning: Check for upstream updates
git subrepo fetch formio formio-core formio-react

# Work: Normal git workflow on main
git add . && git commit -m "..." && git push private main

# Weekly: Sync upstream
git subrepo pull formio-react
git checkout main
git merge formio-react-upstream
git push private main
```

### Emergency Commands

```bash
# Undo last subrepo operation
git revert HEAD

# Reset subrepo to specific commit
git checkout <commit-hash> -- formio-react/

# Remove subrepo (keep files)
rm formio-react/.gitrepo
git add formio-react/.gitrepo
git commit -m "chore: remove formio-react subrepo"

# Re-initialize subrepo
git subrepo init formio-react -r <remote> -b formio-react-upstream
```

---

## 🎓 Best Practices

### DO ✅

- **Commit before pull**: Always commit local changes before pulling upstream
- **Test after merge**: Run full test suite after merging upstream changes
- **Document conflicts**: Record conflict resolution decisions
- **Review changes**: Always review upstream commits before merging
- **Use tracking branches**: Work on tracking branches for upstream sync
- **Keep subrepos clean**: Avoid mixing Qrius and upstream code in same commit

### DON'T ❌

- **Don't edit .gitrepo**: Manually editing can corrupt subrepo state
- **Don't force push tracking branches**: This breaks upstream sync
- **Don't commit sensitive data**: Subrepos can be pushed to public upstream
- **Don't ignore conflicts**: Unresolved conflicts will compound over time
- **Don't skip testing**: Upstream changes can break Qrius functionality
- **Don't push Qrius secrets**: Never push proprietary code to upstream

---

## 📚 Additional Resources

### Official Documentation
- **Git-Subrepo GitHub**: https://github.com/ingydotnet/git-subrepo
- **Git-Subrepo Wiki**: https://github.com/ingydotnet/git-subrepo/wiki

### Qrius Documentation
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall Qrius platform architecture
- [CLAUDE.md](../CLAUDE.md) - AI assistant development guide
- [MIGRATION.md](../MIGRATION.md) - Monorepo migration guide

### Form.io Resources
- **Form.io GitHub**: https://github.com/formio
- **Form.io Docs**: https://help.form.io/

---

## 🆘 Getting Help

### Debugging Commands

```bash
# Verbose output
GIT_SUBREPO_DEBUG=1 git subrepo pull formio-react

# Show subrepo internals
git subrepo version --verbose

# Check git-subrepo installation
which git-subrepo
git subrepo --help
```

### Common Issues

| Issue | Command | Solution |
|-------|---------|----------|
| Subrepo not found | `git subrepo status <dir>` | Check `.gitrepo` exists |
| Pull fails | `git subrepo clean <dir>` | Commit or stash changes |
| Push rejected | `git log origin/main..HEAD` | Pull before push |
| Tracking branch missing | `git branch -a \| grep upstream` | Re-init subrepo |

### Support Channels

- **Internal**: Ask in #qrius-development Slack channel
- **Git-Subrepo**: Open issue at https://github.com/ingydotnet/git-subrepo/issues
- **Form.io**: Community forum at https://help.form.io/

---

**Document prepared by**: Claude Code (AI Assistant)
**Last updated**: 2025-01-10
**Next review**: After Phase 0 completion

**Questions?**: See [ARCHITECTURE.md](../ARCHITECTURE.md) for overall context or ask in #qrius-development.
