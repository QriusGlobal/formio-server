# CI/CD and Deployment Guide

Complete guide for deploying the Form.io file upload feature using the automated CI/CD pipeline.

## Overview

This guide covers:
- GitHub Actions CI/CD pipeline
- Local development workflows
- Deployment processes
- Monitoring and troubleshooting

---

## Quick Start

### Local Development

```bash
# Start complete development environment
make upload-dev

# Verify all services are running
make upload-verify

# Run tests
make upload-test

# Watch for changes
make upload-watch
```

### Running Tests Locally

```bash
# All tests
make upload-test

# Unit tests only
make upload-test-unit

# Integration tests
make upload-test-integration

# E2E tests
make upload-test-e2e

# With coverage
make upload-test-coverage
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Located at: `.github/workflows/file-upload-tests.yml`

**Triggered by:**
- Pushes to `main`, `master`, `develop`, `feature/file-upload`
- Pull requests to `main`, `master`, `develop`
- Changes to relevant files

**Pipeline Jobs:**

1. **Quality Checks** (parallel)
   - ESLint
   - TypeScript type checking
   - Code formatting

2. **Unit Tests** (parallel matrix)
   - formio
   - formio-core
   - formio-react
   - Coverage reporting to Codecov

3. **Build Docker Images**
   - Form.io server
   - Upload processor
   - Webhook handler
   - Cached builds with GitHub Actions cache

4. **Integration Tests**
   - MongoDB service
   - GCS emulator service
   - TUS server
   - Full integration test suite

5. **E2E Tests**
   - Playwright tests
   - Test app scenarios
   - Upload workflows

6. **Security Scanning**
   - npm audit
   - Trivy vulnerability scanner
   - SARIF reports to GitHub Security

7. **Performance Tests**
   - k6 load testing
   - Upload performance benchmarks
   - Response time metrics

8. **Deployment Dry Run** (PR only)
   - Validate deployment script
   - Check configuration
   - Pre-deployment checks

9. **Build Summary**
   - Aggregate results
   - Generate summary report

### Viewing Pipeline Results

**In GitHub:**
1. Go to Actions tab
2. Select workflow run
3. View job details and logs

**Job Summary:**
- Automatically generated after each run
- Shows status of all checks
- Includes test results and coverage

---

## Deployment Process

### Staging Deployment

```bash
# Automated deployment to staging
./scripts/deploy-upload-feature.sh staging
```

**Steps performed:**
1. Validate environment
2. Check prerequisites
3. Run test suite
4. Build all packages
5. Build Docker images
6. Run database migrations
7. Start services
8. Health checks
9. Generate deployment report

**Post-deployment:**
- Services available at staging URLs
- Logs available via `make upload-logs`
- Metrics tracked automatically

### Production Deployment

```bash
# Production deployment (requires confirmation)
./scripts/deploy-upload-feature.sh production
```

**Additional production steps:**
1. Manual confirmation required
2. Image tagging with timestamp
3. Push to container registry
4. Blue-green deployment ready
5. Rollback capability enabled

**Production checklist:**
- [ ] All tests passing in staging
- [ ] Security scans clean
- [ ] Performance benchmarks acceptable
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Team notified

---

## Makefile Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `make upload-dev` | Start complete development environment |
| `make upload-up` | Start upload services only |
| `make upload-down` | Stop upload services |
| `make upload-build` | Build all packages |
| `make upload-test` | Run complete test suite |
| `make upload-clean` | Clean build artifacts |

### Development Workflow

```bash
# 1. Start development environment
make upload-dev

# 2. Verify services
make upload-verify

# 3. Make changes to code...

# 4. Run tests
make upload-test

# 5. Check logs if issues
make upload-logs
```

### Testing Commands

| Command | Description |
|---------|-------------|
| `make upload-test-unit` | Unit tests only |
| `make upload-test-integration` | Integration tests |
| `make upload-test-e2e` | E2E tests with Playwright |
| `make upload-test-coverage` | Generate coverage report |
| `make upload-perf` | Performance tests |

### Verification Commands

| Command | Description |
|---------|-------------|
| `make upload-verify` | Check all service health |
| `make upload-verify-files` | List uploaded files |
| `make upload-verify-config` | Show configuration |
| `make upload-status` | Complete system status |

### Database Commands

| Command | Description |
|---------|-------------|
| `make upload-db-backup` | Backup MongoDB |
| `make upload-db-restore` | Restore from backup |
| `make upload-db-reset` | Reset to clean state |

### Deployment Commands

| Command | Description |
|---------|-------------|
| `make upload-deploy-local` | Full local deployment |
| `make upload-deploy-staging` | Deploy to staging |
| `make upload-deploy-prod` | Deploy to production |

---

## Docker Services

### Service Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Nginx (Port 8080)                 │
│              Upload Routing & Load Balancing         │
└─────────────────┬───────────────────────────────────┘
                  │
     ┌────────────┼────────────────────┐
     │            │                    │
┌────▼─────┐ ┌───▼──────┐ ┌──────────▼────┐
│Form.io   │ │TUS Server│ │Webhook Handler│
│Server    │ │(Port 1080)│ │(Port 3002)    │
│(Port 3001)│ └──────────┘ └───────────────┘
└────┬─────┘
     │
┌────▼─────────┬──────────────┬──────────────┐
│MongoDB       │GCS Emulator  │Redis         │
│(Port 27017)  │(Port 4443)   │(Port 6379)   │
└──────────────┴──────────────┴──────────────┘
```

### Service Details

**Form.io Server** (`formio-server`)
- Main application server
- Handles API requests
- Integrates with all storage backends

**TUS Server** (`tus-server`)
- Resumable upload protocol
- 5GB max upload size
- Chunked upload support

**Upload Processor** (`upload-processor`)
- Processes completed uploads
- Transfers to GCS/S3
- Batch processing with queue

**Webhook Handler** (`webhook-handler`)
- TUS lifecycle events
- Upload notifications
- Status updates

**GCS Emulator** (`gcs-emulator`)
- Local S3-compatible storage
- Development and testing
- No cloud costs

**MongoDB** (`mongodb`)
- Form definitions
- Submission data
- User accounts

**Redis** (`redis`)
- Job queues
- Caching
- Session storage

**Nginx** (`nginx-upload`)
- Request routing
- Load balancing
- Rate limiting
- CORS handling

### Health Checks

All services include health checks:

```bash
# Check individual services
curl http://localhost:3001/health  # Form.io
curl http://localhost:1080/        # TUS
curl http://localhost:3002/health  # Webhooks
curl http://localhost:4443/storage/v1/b  # GCS

# Check all at once
make upload-verify
```

---

## Environment Configuration

### Service Ports

| Service | Port | URL |
|---------|------|-----|
| Test App | 64849 | http://localhost:64849 |
| Form.io Server | 3001 | http://localhost:3001 |
| TUS Server | 1080 | http://localhost:1080 |
| Webhook Handler | 3002 | http://localhost:3002 |
| Nginx | 8080 | http://localhost:8080 |
| GCS Emulator | 4443 | http://localhost:4443 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Redis | 6379 | redis://localhost:6379 |

### Required Environment Variables

See full documentation in `docs/ENVIRONMENT_VARIABLES.md`

**Minimum required:**
```bash
MONGO=mongodb://localhost:27017/formioapp
JWT_SECRET=your-secret-key
DB_SECRET=your-db-secret
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=http://gcs-emulator:4443
FORMIO_S3_BUCKET=local-formio-uploads
```

### Docker Compose Files

**Base Services** (`docker-compose.local.yml`)
- MongoDB
- GCS Emulator
- Form.io Server

**Upload Services** (`docker-compose.upload.yml`)
- TUS Server
- Upload Processor
- Webhook Handler
- Redis
- Nginx

**Usage:**
```bash
# Start all services
docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml up -d

# Or use Makefile
make upload-dev
```

---

## Monitoring and Troubleshooting

### Viewing Logs

```bash
# All services
make upload-logs

# Specific service
make upload-logs-tus
make local-logs-formio
make local-logs-gcs

# Docker commands
docker-compose -f docker-compose.local.yml logs -f formio-server
docker logs formio-tus-server --tail 100 -f
```

### Common Issues

**Service won't start**
```bash
# Check service status
make upload-verify

# Check Docker
docker ps -a
docker logs <container-name>

# Restart services
make upload-down
make upload-up
```

**Database connection failed**
```bash
# Check MongoDB
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Verify connection string
docker-compose exec formio-server env | grep MONGO
```

**Upload fails**
```bash
# Check TUS server
curl http://localhost:1080/

# Check GCS emulator
curl http://localhost:4443/storage/v1/b/local-formio-uploads

# Verify credentials
docker-compose exec formio-server env | grep FORMIO_S3
```

**Tests failing**
```bash
# Run with verbose output
cd formio && npm test -- --verbose

# Check test environment
make verify-services

# Clean and rebuild
make upload-clean
make upload-build
make upload-test
```

### Performance Monitoring

```bash
# Run performance tests
make upload-perf

# Generate performance report
make upload-perf-report

# Check resource usage
docker stats
```

### Database Management

```bash
# Backup database
make upload-db-backup

# Restore database
make upload-db-restore BACKUP_FILE=backups/formio-20250930.dump

# Reset database
make upload-db-reset
```

---

## Continuous Integration Best Practices

### Branch Protection Rules

Configure in GitHub repository settings:

- [ ] Require status checks before merging
- [ ] Require branches to be up to date
- [ ] Required checks:
  - Quality Checks
  - Unit Tests
  - Integration Tests
  - Security Scan
- [ ] Require review from code owners
- [ ] Dismiss stale reviews
- [ ] Require linear history

### Pull Request Workflow

1. Create feature branch
2. Make changes
3. Run tests locally: `make upload-test`
4. Push to GitHub
5. CI pipeline runs automatically
6. Address any failures
7. Request review
8. Merge after approval and passing checks

### Secrets Management

**GitHub Secrets required:**

```yaml
# Production deployment
PROD_MONGO_PASSWORD
PROD_JWT_SECRET
PROD_DB_SECRET
PROD_GCS_KEY
PROD_GCS_SECRET
PROD_ADMIN_PASSWORD

# Container registry
DOCKER_REGISTRY
DOCKER_USERNAME
DOCKER_PASSWORD

# Monitoring
CODECOV_TOKEN
```

**Add secrets:**
1. Go to repository Settings
2. Secrets and variables > Actions
3. New repository secret

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing locally
- [ ] CI pipeline green
- [ ] Code review approved
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Secrets rotated if needed
- [ ] Documentation updated
- [ ] Changelog updated

### Deployment

- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Monitor logs for errors
- [ ] Verify file uploads work
- [ ] Check performance metrics
- [ ] Test rollback procedure

### Post-Deployment

- [ ] Verify all services healthy
- [ ] Run integration tests
- [ ] Check error rates
- [ ] Monitor performance
- [ ] Update team
- [ ] Document any issues

---

## Rollback Procedure

### Automatic Rollback

The deployment script includes automatic rollback on failure:

```bash
# Deployment fails → automatic rollback
./scripts/deploy-upload-feature.sh staging
```

### Manual Rollback

```bash
# 1. Stop current services
docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml down

# 2. Restore previous images
docker tag formio-server:previous formio-server:latest

# 3. Restore database (if needed)
make upload-db-restore BACKUP_FILE=backups/pre-deployment.dump

# 4. Restart services
docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml up -d

# 5. Verify health
make upload-verify
```

---

## Performance Optimization

### Build Performance

```bash
# Use Docker BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Cache npm dependencies
npm ci --prefer-offline --no-audit

# Parallel builds
make upload-build
```

### Test Performance

```bash
# Run tests in parallel
npm test -- --maxWorkers=4

# Skip slow tests during development
npm test -- --testPathIgnorePatterns=e2e

# Use watch mode
npm test -- --watch
```

### Runtime Performance

```bash
# Increase processor concurrency
PROCESSOR_CONCURRENCY=20

# Enable Redis caching
CACHE_ENABLED=true
REDIS_URL=redis://localhost:6379

# Tune connection pool
MAX_CONNECTIONS=500
```

---

## Additional Resources

### Documentation

- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [GitHub Actions Workflow](./.github/workflows/file-upload-tests.yml)
- [Deployment Script](../scripts/deploy-upload-feature.sh)
- [Makefile Commands](../Makefile.upload)

### External References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose](https://docs.docker.com/compose/)
- [TUS Protocol](https://tus.io/protocols/resumable-upload.html)
- [k6 Load Testing](https://k6.io/docs/)

### Support

- GitHub Issues: Report bugs and request features
- Documentation: Check docs/ directory
- Logs: Use `make upload-logs` for debugging

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0