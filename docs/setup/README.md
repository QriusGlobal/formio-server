# Form.io Programmatic Setup - Quick Start

## 📚 Documentation Suite

This directory contains comprehensive guides for programmatic Form.io setup without portal access.

### Available Guides

1. **[FORMIO_PROGRAMMATIC_SETUP.md](./FORMIO_PROGRAMMATIC_SETUP.md)** - Complete setup guide
   - REST API reference with examples
   - Security best practices
   - Environment configuration
   - CI/CD integration
   - Troubleshooting
   - Production deployment

2. **[BOOTSTRAP_SCRIPTS.md](./BOOTSTRAP_SCRIPTS.md)** - Automation scripts
   - Bootstrap script with health checks
   - Token refresh utilities
   - Form creation from JSON
   - Cleanup and maintenance
   - Health check tools

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

```bash
# Ensure Docker is running
docker --version

# Ensure jq is installed (for JSON parsing)
brew install jq  # macOS
# or
apt-get install jq  # Linux
```

### 1. Start Services

```bash
# From monorepo root
docker-compose -f docker-compose.test.yml up -d

# Wait for services (30-60 seconds)
docker-compose -f docker-compose.test.yml ps
```

### 2. Bootstrap Form.io

```bash
# Set environment variables
export FORMIO_URL=http://localhost:3001
export ROOT_EMAIL=admin@test.local
export ROOT_PASSWORD=TestPass123!

# Bootstrap (creates admin user, project, and form)
cd test-app/tests/setup
./formio-bootstrap.sh test
```

### 3. Verify Setup

```bash
# Health check all services
./health-check.sh

# Expected output:
# ✓ Form.io Server: HEALTHY
# ✓ MongoDB: HEALTHY
# ✓ GCS Emulator: HEALTHY
# ✓ TUS Server: HEALTHY
# ✓ React Test App: HEALTHY
```

### 4. Get JWT Token

```bash
# Authenticate and get token
TOKEN=$(./get-fresh-token.sh admin@test.local TestPass123!)
echo "Token: $TOKEN"

# Use token for API requests
curl http://localhost:3001/form \
  -H "x-jwt-token: $TOKEN" \
  | jq '.[] | {id: ._id, name: .name}'
```

---

## 📖 Common Tasks

### Create a Custom Form

```bash
# 1. Create form schema (form-schema.json)
cat > form-schema.json <<'EOF'
{
  "title": "Contact Form",
  "name": "contact",
  "path": "contact",
  "type": "form",
  "display": "form",
  "components": [
    {
      "type": "textfield",
      "key": "name",
      "label": "Name",
      "validate": { "required": true }
    },
    {
      "type": "email",
      "key": "email",
      "label": "Email",
      "validate": { "required": true }
    },
    {
      "type": "textarea",
      "key": "message",
      "label": "Message",
      "validate": { "required": true, "maxLength": 500 }
    },
    {
      "type": "button",
      "action": "submit",
      "label": "Submit"
    }
  ]
}
EOF

# 2. Create form using script
./create-form.sh form-schema.json "$TOKEN"
```

### Submit Form Data

```bash
# Get form ID
FORM_ID=$(curl -s http://localhost:3001/form \
  -H "x-jwt-token: $TOKEN" \
  | jq -r '.[] | select(.name=="contact") | ._id')

# Submit data
curl -X POST "http://localhost:3001/form/$FORM_ID/submission" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello from API!"
    }
  }'
```

### List Submissions

```bash
# Get all submissions for a form
curl "http://localhost:3001/form/$FORM_ID/submission" \
  -H "x-jwt-token: $TOKEN" \
  | jq '.[] | {id: ._id, name: .data.name, email: .data.email}'
```

### Cleanup Test Data

```bash
# Remove all test forms and submissions
./cleanup-test-data.sh "$TOKEN"
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.test` or `.env.development`:

```bash
# Form.io Server
FORMIO_URL=http://localhost:3001
FORMIO_PROJECT_URL=http://localhost:3001

# Admin Credentials (NEVER commit to git!)
ROOT_EMAIL=admin@test.local
ROOT_PASSWORD=TestPass123!

# Secrets (generate with: openssl rand -hex 32)
JWT_SECRET=your-256-bit-jwt-secret
DB_SECRET=your-256-bit-db-secret

# File Upload
TUS_UPLOAD_URL=http://localhost:1080/files/
TUS_CHUNK_SIZE=262144  # 256KB
TUS_MAX_FILE_SIZE=52428800  # 50MB

# Database
MONGO=mongodb://localhost:27017/formioapp_test

# Optional Project/Form Names
PROJECT_NAME=testproject
PROJECT_TITLE=Test Project
FORM_NAME=fileupload
```

### Docker Compose Services

```yaml
# docker-compose.test.yml (excerpt)
services:
  formio-server:
    ports:
      - "3001:3001"
    environment:
      MONGO: mongodb://mongodb:27017/formioapp_test
      ROOT_EMAIL: admin@test.local
      ROOT_PASSWORD: TestPass123!

  mongodb:
    ports:
      - "27017:27017"

  gcs-emulator:
    ports:
      - "4443:4443"

  tus-server:
    ports:
      - "1080:1080"
```

---

## 🛡️ Security Notes

### Development Environment

✅ **DO**:
- Store credentials in `.env.test` (gitignored)
- Use short-lived JWT tokens (1 hour)
- Rotate tokens on each test run
- Use isolated test databases

❌ **DO NOT**:
- Commit tokens or passwords
- Use production credentials in dev
- Share JWT tokens between environments
- Disable authentication

### Production Environment

✅ **DO**:
- Use HTTPS for all API calls
- Generate 256-bit random secrets
- Implement rate limiting
- Monitor authentication failures
- Use permanent API keys for apps
- Enable audit logging

❌ **DO NOT**:
- Expose admin credentials in client code
- Use HTTP in production
- Store tokens in localStorage
- Disable CORS protections
- Log sensitive data

---

## 🐛 Troubleshooting

### Form.io Server Not Starting

```bash
# Check container logs
docker-compose -f docker-compose.test.yml logs formio-server

# Common issues:
# 1. MongoDB not ready -> Wait longer (increase healthcheck retries)
# 2. Port 3001 in use -> Stop other services
# 3. Missing environment variables -> Check .env.test
```

### Login Returns No Token

**Issue**: Response has `user` but no `token` field

**Fix**: Apply LoginAction.js patch:

```javascript
// File: /app/src/actions/LoginAction.js (line 267)
// Add before res.send():
if (res.headersSent) {
  return;
}
res.send(response);
```

### Form Creation Fails

```bash
# Check token is valid
curl http://localhost:3001/current \
  -H "x-jwt-token: $TOKEN" \
  | jq '.role'

# Should output: "admin"

# If token expired, get fresh token:
TOKEN=$(./get-fresh-token.sh admin@test.local TestPass123!)
```

### File Upload Not Working

```bash
# 1. Check TUS server is running
curl http://localhost:1080/
# Should return: 404 page not found (expected)

# 2. Verify TUS URL in form
curl http://localhost:3001/form/$FORM_ID \
  -H "x-jwt-token: $TOKEN" \
  | jq '.components[] | select(.type=="file") | .url'

# Should output: "http://localhost:1080/files/"

# 3. Check TUS server logs
docker-compose -f docker-compose.test.yml logs tus-server
```

---

## 📁 Directory Structure

```
docs/setup/
├── README.md                           # This file
├── FORMIO_PROGRAMMATIC_SETUP.md        # Complete setup guide
└── BOOTSTRAP_SCRIPTS.md                # Automation scripts

test-app/tests/setup/
├── formio-bootstrap.sh                 # Main bootstrap script
├── get-fresh-token.sh                  # Token refresh utility
├── create-form.sh                      # Form creation from JSON
├── cleanup-test-data.sh                # Test data cleanup
└── health-check.sh                     # Service health checks
```

---

## 🎯 Next Steps

### For Development

1. ✅ Complete quick start above
2. ✅ Run health check: `./health-check.sh`
3. ✅ Create custom forms: `./create-form.sh schema.json`
4. ✅ Run E2E tests: `cd test-app && npm run test:e2e`

### For Production

1. 📖 Read [FORMIO_PROGRAMMATIC_SETUP.md](./FORMIO_PROGRAMMATIC_SETUP.md)
2. 🔐 Review security best practices
3. 🚀 Set up CI/CD pipeline
4. 📊 Configure monitoring and alerts
5. 🔄 Implement automated backups

---

## 📚 Additional Resources

- **Form.io REST API**: https://help.form.io/developers/api
- **Form.io GitHub**: https://github.com/formio/formio
- **TUS Protocol**: https://tus.io/protocols/resumable-upload.html
- **Docker Documentation**: https://docs.docker.com/compose/

---

## 🆘 Support

### Getting Help

1. Check service health: `./health-check.sh`
2. Review troubleshooting section above
3. Check Docker logs: `docker-compose logs [service-name]`
4. Enable debug mode: `DEBUG=formio:* docker-compose up`

### Common Commands

```bash
# View all services
docker-compose -f docker-compose.test.yml ps

# View logs
docker-compose -f docker-compose.test.yml logs -f formio-server

# Restart services
docker-compose -f docker-compose.test.yml restart

# Stop all services
docker-compose -f docker-compose.test.yml down

# Clean up (remove volumes)
docker-compose -f docker-compose.test.yml down -v
```

---

**Quick Start Version**: 1.0.0
**Last Updated**: 2025-10-02
**Estimated Setup Time**: 5 minutes
