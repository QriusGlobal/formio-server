# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial CHANGELOG.md creation
- Documentation of Form.io server authentication credentials

### Fixed

- Discovered and documented default admin credentials for Form.io server
  (`admin@formio.local:admin123`)

### Changed

- Updated `.env.example` to include default ROOT_PASSWORD for development
  consistency

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
