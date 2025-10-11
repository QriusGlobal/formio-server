# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Specialist Report Form Integration** - Complete end-to-end implementation
  - Server submission mode toggle in FormViewer component
  - Form upload script (`scripts/create-specialist-report-form.js`)
  - Comprehensive integration documentation
    (docs/SPECIALIST_REPORT_INTEGRATION.md)
- **Monorepo Cleanup & Optimization** - Phase 1 execution complete
  - Recovered ~600MB disk space (16.7% size reduction: 3.6GB → 3.0GB)
  - Removed nested node_modules, Bun cache pollution, build artifacts
  - Enhanced .gitignore from 55 to 532 lines (prevents future pollution)
  - Created safety checkpoint and dry-run script
  - Comprehensive cleanup documentation (docs/MONOREPO_CLEANUP.md)
- Initial CHANGELOG.md creation
- Documentation of Form.io server authentication credentials

### Fixed

- **Docker Compose Configuration** - GCS emulator and formio-server startup
  issues
  - Added `-filesystem-root=/data` flag to GCS emulator to fix EACCES errors
  - Removed user restriction from formio-server to allow client download during
    initialization
  - All services now start correctly after cleanup
- **Storage Configuration** - Changed from base64 to URL/TUS for 20 file upload
  fields
  - Prevents MongoDB 16MB document limit issues
  - 99.97% size reduction for submissions with files
- Discovered and documented default admin credentials for Form.io server
  (`admin@formio.local:admin123`)

### Changed

- Updated `.env.example` to include default ROOT_PASSWORD for development
  consistency
- FormViewer now supports both client-side and server-side submission modes

### Deprecated

- `test-app/` directory - Superseded by `form-client-web-app/` (pending removal
  in next release)

## [0.1.0] - 2025-10-11

### Added

- Comprehensive PR validation and remediation infrastructure
- Docker service orchestration with health checks
- BullMQ worker implementations for async file processing
- Security hardening with CORS whitelist and credential validation
- Form.io server with TUS file upload support
- GCS emulator for local development
- React testing application (`form-client-web-app`) with specialist report form
- E2E test framework with Playwright
- Complete monorepo migration from git submodules
- Anti-Corruption Layer architecture documentation for Qrius platform
- Git-subrepo workflow documentation

### Fixed

- Docker healthcheck duplication issues
- nginx-upload-module directive removal (6 instances)
- Makefile references (test-app → form-client-web-app)
- Missing worker implementation files (processor.js, webhook-handler.js)
- Security vulnerabilities in SSL certificate handling

### Security

- Implemented strong credential generation for JWT and DB secrets
- Added .gitignore rules for SSL certificates
- Created credential validation script
- Added security headers to nginx configuration
- Configured CORS origin whitelist

### Infrastructure

- Multi-stage Dockerfiles for Form.io services
- Non-root user configuration for all containers
- Health check endpoints for all critical services
- Redis LRU cache configuration for BullMQ
- MongoDB with proper backup and restore procedures

## [0.0.1] - 2025-10-05

### Added

- Initial monorepo structure
- Form.io server v4.5.2 integration
- Form.io Core v2.5.1
- Form.io React v6.1.0
- TUS file upload module v1.0.0
- Basic Docker Compose setup
- Environment configuration templates
