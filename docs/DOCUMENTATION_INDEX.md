# Form.io Monorepo - Documentation Index

## 📚 Complete Documentation Suite

### 🚀 Quick Start & Setup

#### **[Setup - Quick Start Guide](./setup/README.md)**
**Estimated Time**: 5 minutes
- Prerequisites and dependencies
- Bootstrap development environment
- Verify services and health checks
- Common tasks and workflows

#### **[Setup - Programmatic Setup](./setup/FORMIO_PROGRAMMATIC_SETUP.md)**
**Target Audience**: DevOps, Backend Engineers
**Comprehensive Guide** (25,000+ words):
- Complete REST API reference
- Authentication & security best practices
- Environment configuration
- CI/CD integration (GitHub Actions, GitLab, Jenkins)
- Production deployment strategies
- Troubleshooting guide

#### **[Setup - Bootstrap Scripts](./setup/BOOTSTRAP_SCRIPTS.md)**
**Target Audience**: DevOps, Automation Engineers
- `formio-bootstrap.sh` - Complete environment setup
- `get-fresh-token.sh` - JWT token management
- `create-form.sh` - Form creation from JSON
- `cleanup-test-data.sh` - Test data cleanup
- `health-check.sh` - Service health verification

---

### 🧪 Testing Documentation

#### **[E2E Testing Guide](../test-app/tests/README.md)**
**Target Audience**: QA Engineers, Developers
- Playwright test infrastructure (50+ files)
- 213+ test scenarios
- Page Object Models
- Test utilities and fixtures
- Visual regression testing
- Cross-browser testing (7 browsers)

#### **[Test Quick Start](../test-app/tests/QUICK-START.md)**
**Estimated Time**: 10 minutes
- Running tests locally
- Test categories and tags
- Debugging techniques
- CI/CD test execution

#### **[Edge Case Testing](../test-app/tests/EDGE-CASE-SUMMARY.md)**
**Target Audience**: QA Engineers
- Network failure scenarios (9 tests)
- Large file uploads (5 tests - 500MB/1GB/2GB)
- Browser state tests (7 tests)
- Race conditions (7 tests)
- Resource limits (7 tests)
- Security tests (8 tests - XSS, path traversal)

#### **[Test Execution Report](../test-app/EXECUTION_REPORT.md)**
- Test metrics and coverage
- Performance benchmarks
- Known issues and fixes
- Continuous improvement roadmap

---

### 🏗️ Architecture & Implementation

#### **[Phase 1 Completion Report](../PHASE_1_COMPLETE.md)**
**Status**: ✅ SUCCESSFULLY COMPLETED
- Executive summary
- Deliverables and metrics
- React app & Form.io setup
- CI/CD pipeline (8 parallel jobs)
- Known issues and next steps

#### **[CI/CD Pipeline Summary](../CICD_SUMMARY.md)**
**Target Audience**: DevOps Engineers
- GitHub Actions workflow (8 jobs)
- Docker test environment
- Makefile commands (10+)
- Pre-commit hooks
- Automated reporting

#### **[Playwright Setup Guide](../test-app/PLAYWRIGHT_SETUP.md)**
**Target Audience**: QA Engineers
- Installation and configuration
- Browser setup (7 browsers)
- Custom fixtures and matchers
- Debug tools and techniques

---

### 📖 Form.io Specific Guides

#### **REST API Quick Reference**

**Authentication**:
```bash
# Login and get JWT token
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"data":{"email":"admin@example.com","password":"password"}}'
```

**Project Management**:
```bash
# Create project
curl -X POST http://localhost:3001/project \
  -H "x-jwt-token: $TOKEN" \
  -d '{"title":"My Project","name":"myproject"}'
```

**Form Management**:
```bash
# Create form
curl -X POST http://localhost:3001/form \
  -H "x-jwt-token: $TOKEN" \
  -d @form-schema.json

# List forms
curl http://localhost:3001/form \
  -H "x-jwt-token: $TOKEN"
```

**Submissions**:
```bash
# Submit form data
curl -X POST http://localhost:3001/form/{formId}/submission \
  -H "x-jwt-token: $TOKEN" \
  -d '{"data":{...}}'

# List submissions
curl http://localhost:3001/form/{formId}/submission \
  -H "x-jwt-token: $TOKEN"
```

---

### 🔧 Configuration Files

#### Environment Configuration

**Development** (`.env.development`):
```bash
FORMIO_URL=http://localhost:3001
ROOT_EMAIL=admin@test.local
ROOT_PASSWORD=TestPass123!
NODE_ENV=development
```

**Test** (`.env.test`):
```bash
FORMIO_URL=http://localhost:3001
MONGO=mongodb://localhost:27017/formioapp_test
NODE_ENV=test
CI=false
```

**Production** (`.env.production`):
```bash
FORMIO_URL=https://api.myapp.com
JWT_SECRET=${JWT_SECRET}  # 256-bit random
DB_SECRET=${DB_SECRET}    # 256-bit random
NODE_ENV=production
SSL_ENABLED=true
```

#### Docker Compose Services

**Development**:
- Form.io Server: http://localhost:3001
- MongoDB: localhost:27017
- GCS Emulator: http://localhost:4443
- TUS Server: http://localhost:1080
- React App: http://localhost:64849

---

### 🛡️ Security Best Practices

#### Local Development

✅ **DO**:
- Store credentials in `.env.test` (gitignored)
- Use short-lived JWT tokens (1 hour max)
- Rotate tokens on each test run
- Use isolated test databases

❌ **DO NOT**:
- Commit tokens or API keys
- Use production credentials in dev
- Share JWT tokens between environments
- Disable authentication

#### Production Deployment

✅ **DO**:
- Use HTTPS for all API calls
- Generate 256-bit random secrets
- Implement rate limiting
- Monitor authentication failures
- Use permanent API keys for embedded apps
- Enable audit logging

❌ **DO NOT**:
- Expose admin credentials in client code
- Use HTTP in production
- Store tokens in localStorage
- Disable CORS protections
- Log sensitive data

---

### 🐛 Common Issues & Solutions

#### Login Returns No Token

**Symptoms**: Response has `user` but missing `token` field

**Root Cause**: LoginAction.js sends response twice

**Fix**:
```javascript
// File: /app/src/actions/LoginAction.js (line 267)
// Add before res.send():
if (res.headersSent) {
  return;
}
res.send(response);
```

#### Form Creation Fails

**Possible Causes**:
1. Expired JWT token → Re-authenticate
2. Missing admin permissions → Check user role
3. Invalid form schema → Validate JSON

**Debug**:
```bash
# Check token validity
curl http://localhost:3001/current \
  -H "x-jwt-token: $TOKEN" | jq '.role'

# Should output: "admin"
```

#### File Upload Not Working

**Solutions**:
1. Check TUS server is running: `curl http://localhost:1080/`
2. Verify TUS URL in form component
3. Check CORS configuration
4. Monitor TUS server logs

---

### 📊 Metrics & Statistics

| Metric | Value |
|--------|-------|
| **Total Documentation Files** | 15+ |
| **Lines of Documentation** | 30,000+ |
| **Test Scenarios** | 213+ |
| **Test Files** | 17 |
| **Bootstrap Scripts** | 5 |
| **Docker Services** | 5 |
| **Supported Browsers** | 7 |
| **CI/CD Jobs** | 8 |

---

### 🎯 Learning Paths

#### **Path 1: Quick Start (30 minutes)**
1. [Setup - Quick Start Guide](./setup/README.md) (5 min)
2. [Bootstrap environment](./setup/BOOTSTRAP_SCRIPTS.md) (10 min)
3. [Run E2E tests](../test-app/tests/QUICK-START.md) (10 min)
4. [View test results](../test-app/tests/README.md) (5 min)

#### **Path 2: DevOps Engineer (2 hours)**
1. [Programmatic Setup Guide](./setup/FORMIO_PROGRAMMATIC_SETUP.md) (45 min)
2. [CI/CD Pipeline Setup](../CICD_SUMMARY.md) (30 min)
3. [Production Deployment](./setup/FORMIO_PROGRAMMATIC_SETUP.md#production-deployment) (30 min)
4. [Security Best Practices](./setup/FORMIO_PROGRAMMATIC_SETUP.md#security-best-practices) (15 min)

#### **Path 3: QA Engineer (1.5 hours)**
1. [E2E Testing Guide](../test-app/tests/README.md) (30 min)
2. [Test Quick Start](../test-app/tests/QUICK-START.md) (20 min)
3. [Edge Case Testing](../test-app/tests/EDGE-CASE-SUMMARY.md) (20 min)
4. [Playwright Setup](../test-app/PLAYWRIGHT_SETUP.md) (20 min)

#### **Path 4: Backend Developer (1 hour)**
1. [REST API Reference](./setup/FORMIO_PROGRAMMATIC_SETUP.md#rest-api-reference) (20 min)
2. [Authentication Guide](./setup/FORMIO_PROGRAMMATIC_SETUP.md#authentication) (15 min)
3. [Form Management](./setup/FORMIO_PROGRAMMATIC_SETUP.md#form-management) (15 min)
4. [Troubleshooting](./setup/FORMIO_PROGRAMMATIC_SETUP.md#troubleshooting) (10 min)

---

### 🔗 External Resources

- **Form.io Official Docs**: https://help.form.io/
- **Form.io REST API**: https://help.form.io/developers/api
- **Form.io GitHub**: https://github.com/formio/formio
- **TUS Protocol**: https://tus.io/protocols/resumable-upload.html
- **Playwright Docs**: https://playwright.dev/
- **Docker Compose**: https://docs.docker.com/compose/

---

### 🆘 Getting Help

#### Documentation Issues
- Check troubleshooting sections
- Review common issues above
- Search documentation index

#### Service Issues
```bash
# Health check all services
cd test-app/tests/setup
./health-check.sh

# View service logs
docker-compose -f docker-compose.test.yml logs [service-name]
```

#### Test Issues
```bash
# Run in debug mode
npm run test:e2e:debug

# Run in UI mode (interactive)
npm run test:e2e:ui

# View HTML report
npm run test:e2e:report
```

---

### 📅 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| Documentation Index | 1.0.0 | 2025-10-02 |
| Programmatic Setup | 1.0.0 | 2025-10-02 |
| Bootstrap Scripts | 1.0.0 | 2025-10-02 |
| Quick Start Guide | 1.0.0 | 2025-10-02 |
| E2E Testing Guide | 1.0.0 | 2025-09-30 |
| Phase 1 Report | 1.0.0 | 2025-09-30 |

---

**Documentation Suite Status**: ✅ **COMPLETE**
**Total Pages**: 15+
**Total Lines**: 30,000+
**Maintenance**: Active
**Last Review**: 2025-10-02
