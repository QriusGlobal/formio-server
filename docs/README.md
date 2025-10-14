# Documentation Index

**Last Updated**: 2025-10-14  
**Repository**: formio-monorepo

---

## 📚 Documentation Organization

This directory contains all project documentation organized by purpose and
audience.

### [guides/](./guides/) - User Guides

User-facing guides, tutorials, and configuration documentation.

- **[Authentication Guide](./guides/authentication.md)** - Authentication setup
  and configuration
- **[Whitelabeling Guide](./guides/whitelabeling.md)** - Brand customization and
  whitelabeling
- **[UI/UX Improvements](./guides/ui-ux-improvements.md)** - UI/UX enhancement
  guide

### [architecture/](./architecture/) - Architecture & Design

System architecture, design decisions, and technical specifications.

- **[Agentic Form Architecture](./architecture/agentic-form-architecture.md)** -
  AI-powered form architecture
- **[CopilotKit Architecture Spec](./architecture/copilot-architecture-spec.md)** -
  CopilotKit integration architecture
- **[CopilotKit Integration Spec](./architecture/copilotkit-integration-spec.md)** -
  Integration specification
- **[CopilotKit Continuation](./architecture/copilotkit-integration-spec-continuation.md)** -
  Spec continuation
- **[Obfuscation Best Practices](./architecture/industry-best-practices-obfuscation.md)** -
  Industry obfuscation standards
- **[Specialist Report Integration](./architecture/specialist-report-integration.md)** -
  Report integration design
- **[TUS/Uppy Analysis](./architecture/tus-uppy-analysis.md)** - File upload
  architecture analysis

### [deployment/](./deployment/) - Deployment & Infrastructure

Deployment guides, cloud setup, and infrastructure configuration.

- **[GitHub Packages Setup](./deployment/github-packages-setup.md)** - GitHub
  Packages publishing guide
- **[Production Build Obfuscation](./deployment/production-build-obfuscation.md)** -
  Production build security

### [development/](./development/) - Developer Resources

Developer guides, workflows, and development processes.

- **[ESLint Configuration Report](./development/ESLINT_CONFIGURATION_REPORT.md)** -
  ESLint setup details
- **[ESLint Quick Reference](./development/ESLINT_QUICK_REFERENCE.md)** -
  Linting quick reference
- **[Fix Implementation Guide](./development/FIX_IMPLEMENTATION_GUIDE.md)** -
  Bug fix implementation guide
- **[Fork Maintenance Best Practices](./development/fork-maintenance-best-practices.md)** -
  Fork management guide
- **[Fork Maintenance Summary](./development/fork-maintenance-summary.md)** -
  Fork maintenance overview
- **[Git Subrepo - formio-react](./development/git-subrepo-formio-react.md)** -
  formio-react subrepo guide
- **[Git Subrepo Workflow](./development/git-subrepo-workflow.md)** - General
  subrepo workflow
- **[Linting Guide](./development/linting.md)** - Linting setup and standards
- **[Monorepo Cleanup](./development/monorepo-cleanup.md)** - Cleanup procedures
- **[Production Build Quick Start](./development/PRODUCTION_BUILD_QUICK_START.md)** -
  Quick production build guide

### [security/](./security/) - Security Documentation

Security hardening, best practices, and security configurations.

- **[Security Hardening](./security/security-hardening.md)** - Production
  security hardening guide

### [examples/](./examples/) - Code Examples

Working code examples and reference implementations.

- **[GCS Provider Example](./examples/gcs-provider-example.js)** - Google Cloud
  Storage provider usage
- **[Secure Upload Server](./examples/secure-upload.js)** - Production-ready
  secure upload server
- **[Bulk Upload Config](./examples/bulk-mobile-upload-config.json)** - Bulk
  upload configuration

### [archived/](./archived/) - Historical Documentation

Outdated documentation kept for historical reference and context.

#### Phase Completion Reports

- [Phase 4 Executive Summary](./archived/PHASE_4_EXECUTIVE_SUMMARY.md)
- [Phase 4 Review Report](./archived/PHASE_4_REVIEW_REPORT.md)
- [Phase 5D Summary](./archived/PHASE_5D_SUMMARY.md)
- [Monorepo Setup Complete](./archived/MONOREPO_SETUP_COMPLETE.md)
- [Fork Maintenance Complete](./archived/FORK_MAINTENANCE_COMPLETE.md)
- [Remediation Complete](./archived/REMEDIATION_COMPLETE.md)
- [Migration Guide](./archived/MIGRATION.md)

#### Analysis Reports ([archived/reports/](./archived/reports/))

Historical analysis reports, security scans, and validation results.

**ESLint Reports:**

- eslint-report.json - Full ESLint report
- eslint-report-phase5.json - Phase 5 report
- full-eslint-report.json - Comprehensive report
- eslint-violations.txt - Violation summary
- violations-by-rule.json - Categorized violations

**Security Reports:**

- security-violations.json - Security scan results
- security-scan-fileupload.json - File upload security
- security-scan-webapp.json - Web app security
- brand-exposure-report.txt - Brand exposure analysis

**Analysis Summaries:**

- BRAND_SECURITY_SYSTEM_SUMMARY.md
- OBFUSCATION_IMPLEMENTATION_SUMMARY.md
- VIOLATION_ANALYSIS.md
- RISK_MATRIX.md
- performance-validation-summary.txt
- post-cleanup-verification.md

#### Research Documents ([archived/research/](./archived/research/))

Research documents and technical deep dives.

- [CopilotKit Deep Dive](./archived/research/COPILOTKIT_DEEP_DIVE.md)
- [CopilotKit Index](./archived/research/COPILOTKIT_INDEX.md)
- [CopilotKit Research Summary](./archived/research/COPILOTKIT_RESEARCH_SUMMARY.md)

---

## 🔍 Quick Reference

### Getting Started

1. **Installation**: See root [README.md](../README.md)
2. **Setup**: See root [SETUP_INSTRUCTIONS.md](../SETUP_INSTRUCTIONS.md) (if
   exists)
3. **Architecture**: [ARCHITECTURE.md](../ARCHITECTURE.md) (root level)

### Common Tasks

- **Development Setup**: [development/](./development/)
- **Deployment**: [deployment/](./deployment/)
- **Security Configuration**:
  [security/security-hardening.md](./security/security-hardening.md)
- **Fork Management**:
  [development/fork-maintenance-best-practices.md](./development/fork-maintenance-best-practices.md)

### Key Root-Level Documentation

- **[../README.md](../README.md)** - Main project documentation
- **[../CLAUDE.md](../CLAUDE.md)** - AI assistant instructions
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - High-level system architecture
- **[../CHANGELOG.md](../CHANGELOG.md)** - Version history
- **[../REMAINING_LINTING_ISSUES.md](../REMAINING_LINTING_ISSUES.md)** - Current
  linting status
- **[../DSS_FORMIO_DEPLOYMENT_GUIDE.md](../DSS_FORMIO_DEPLOYMENT_GUIDE.md)** -
  Critical deployment guide
- **[../TEST_INFRASTRUCTURE.md](../TEST_INFRASTRUCTURE.md)** - Test
  infrastructure guide

---

## 📝 Document Naming Conventions

### File Naming Patterns

- **SCREAMING_SNAKE_CASE.md**: Technical reports, configuration docs
- **kebab-case.md**: User guides, tutorials, how-to documentation
- **PascalCase.md**: Historical convention (being phased out)

### Directory Structure

- **guides/**: User-facing documentation
- **architecture/**: Technical architecture and design
- **deployment/**: Infrastructure and deployment
- **development/**: Developer workflows and tools
- **security/**: Security documentation
- **examples/**: Code examples and reference implementations
- **archived/**: Historical documentation and reports

---

## 🔄 Documentation Maintenance

### Adding New Documentation

1. Determine the appropriate category (guides, architecture, deployment, etc.)
2. Follow naming conventions for the category
3. Add entry to this README.md index
4. Link from root README.md if user-facing

### Archiving Documentation

When documentation becomes outdated but should be preserved:

1. Move to `archived/` (general) or `archived/reports/` (reports/analysis)
2. Update references in other documents
3. Update this README.md index
4. Add note in original location if referenced elsewhere

### Document Review Schedule

- **Quarterly**: Review archived/ for candidates to delete
- **Per Release**: Update guides/ and deployment/ docs
- **As Needed**: Update development/ docs with process changes

---

**Last Cleanup**: 2025-10-14 (Monorepo production cleanup - Opus 4.1)
