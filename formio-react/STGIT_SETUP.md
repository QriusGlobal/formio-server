# StGit Setup Guide - Quick Start

This guide walks you through setting up StGit for the first time in this fork.

## Prerequisites

- Git repository cloned
- Upstream remote configured
- StGit installed

## Step 1: Install StGit

```bash
# macOS
brew install stgit

# Debian/Ubuntu
sudo apt install stgit

# Fedora/RHEL
sudo dnf install stgit

# Verify installation
stg --version
```

**Expected Output**: `stg 2.x.x` or similar

## Step 2: Initialize StGit

```bash
# Must be in formio-react directory
cd /Users/mishal/code/worktrees/formio-monorepo-20251009/formio-react

# Initialize StGit stack
stg init
```

**What this does:**

- Creates `.git/patches/` directory for StGit metadata
- Sets up patch management infrastructure
- Does NOT modify your code or commits

## Step 3: Convert Existing Commits to Patches

Find how many commits are ahead of upstream:

```bash
# Fetch upstream
git fetch upstream

# Count commits ahead
git rev-list --count upstream/main..HEAD
```

**Expected Output**: `3` (or similar number)

Convert those commits to StGit patches:

```bash
# If 3 commits ahead:
stg uncommit --number 3

# Verify patches created
stg series
```

**Expected Output:**

```
+ bundle-dependencies
+ export-formio-instance
+ github-packages-workflow
```

The `+` indicates patches are currently applied.

## Step 4: Verify Setup

Check patch stack status:

```bash
# View all patches
stg series --description

# View specific patch
stg show bundle-dependencies

# Check git log (patches are commits)
git log --oneline -5
```

**What you should see:**

- All patches listed in `stg series`
- Same commits visible in `git log`
- Patches ARE commits (no export needed)

## Step 5: Test Basic Operations

Create a test patch:

```bash
# Create new patch
stg new test-patch -m "Test StGit workflow"

# Make a test change
echo "# StGit Test" >> README.FORK.md

# Capture change
stg refresh

# View the patch
stg show

# Delete test patch
stg delete test-patch
```

## Verification Checklist

- [ ] `stg --version` shows version 2.x or higher
- [ ] `stg init` completed without errors
- [ ] `stg series` shows 3 patches (bundle-dependencies, export-formio-instance, github-packages-workflow)
- [ ] `stg show bundle-dependencies` displays patch diff
- [ ] Test patch creation/deletion worked

## Next Steps

You're now ready to use StGit! Common workflows:

### Create New Customization

```bash
stg new feature-name -m "feat(qrius): short description"
# ... make changes ...
stg refresh
```

### Modify Existing Customization

```bash
stg goto bundle-dependencies
# ... make changes ...
stg refresh
stg top  # return to top of stack
```

### Sync with Upstream

```bash
git fetch upstream
stg rebase upstream/main
# ... resolve conflicts if any ...
```

## Documentation Links

- **Full Workflow Guide**: [README.FORK.md](./README.FORK.md)
- **Patch Documentation**: [patches/README.md](./patches/README.md)
- **StGit Manual**: https://stacked-git.github.io/
- **AI Assistant Guide**: [CLAUDE.md](./CLAUDE.md)

## Troubleshooting

### "stg: command not found"

StGit not installed. Run installation command for your OS (Step 1).

### "Not a git repository"

Must be in the formio-react directory. Run: `cd /Users/mishal/code/worktrees/formio-monorepo-20251009/formio-react`

### "No patches applied"

Expected after first `stg init`. Run `stg uncommit --number 3` to create patches.

### "Already initialized"

StGit already set up. Skip Step 2, verify with `stg series`.

---

**Last Updated**: 2025-10-13  
**Target Repository**: QriusGlobal/formio-react  
**Maintained By**: Qrius Global
