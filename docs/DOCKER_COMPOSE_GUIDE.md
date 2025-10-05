# Docker Compose Guide - Form.io Monorepo

**Status:** ✅ Production Ready
**Version:** 2.0.0
**Last Updated:** October 5, 2025

---

## 📋 Overview

This guide covers the consolidated Docker Compose infrastructure that replaced 3 separate compose files with **ONE unified configuration** following DRY and KISS principles.

### What Changed

**Before (3 files):**
- ❌ `docker-compose.test.yml` - Testing environment
- ❌ `docker-compose.local.yml` - Local development
- ❌ `docker-compose.upload.yml` - Upload services (extension)

**After (1 file):**
- ✅ `docker-compose.yml` - Single source of truth with profiles

---

## 🏗️ Architecture

### Core Services (Always Run)

1. **MongoDB** - Database storage
2. **Redis** - BullMQ job queue + caching
3. **GCS Emulator** - Fake Google Cloud Storage
4. **Form.io Server** - Main API server with async GCS upload
5. **TUS Server** - Resumable upload protocol

### Profile-Based Services

| Profile | Additional Services | Use Case |
|---------|-------------------|----------|
| `dev` | test-app | Local development with React UI |
| `test` | playwright | E2E testing with Playwright |
| `full` | nginx, upload-processor, webhook-handler | Complete production-like stack |

---

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Start Services

```bash
# Core services only (recommended for most development)
docker-compose up -d

# Development with React test app
docker-compose --profile dev up -d

# Testing with Playwright
docker-compose --profile test up -d

# Full stack (all services)
docker-compose --profile full up -d
```

### 3. Verify Health

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f formio-server

# Check health status
curl http://localhost:3001/health
```

---

## 📊 Service Details

### MongoDB

```yaml
Image: mongo:6
Port: 27017
Volume: mongo-data (persistent)
Healthcheck: mongosh ping every 5s
Resources: 1GB RAM, 1 CPU
```

**Access:**
```bash
# Connect via CLI
docker exec -it formio-mongo mongosh formioapp

# Connection string
mongodb://localhost:27017/formioapp
```

### Redis

```yaml
Image: redis:7-alpine
Port: 6379
Volume: redis-data (persistent)
Healthcheck: redis-cli ping every 5s
Resources: 512MB RAM, 0.5 CPU
```

**Access:**
```bash
# Monitor queue
docker exec -it formio-redis redis-cli

# View BullMQ jobs
redis-cli KEYS "bull:gcs-upload:*"
```

### GCS Emulator

```yaml
Image: fsouza/fake-gcs-server
Port: 4443
Volume: gcs-data
API: http://localhost:4443
```

**Access:**
```bash
# List buckets
curl http://localhost:4443/storage/v1/b

# Create bucket
curl -X POST http://localhost:4443/storage/v1/b?project=formio-project \
  -d '{"name":"formio-uploads"}'
```

### Form.io Server

```yaml
Image: Custom build (./formio/Dockerfile)
Port: 3001
Dependencies: mongodb, redis, gcs-emulator
Features:
  - Async GCS upload (BullMQ)
  - TUS protocol support
  - OpenTelemetry ready
Resources: 1GB RAM, 1 CPU
```

**Key Environment Variables:**
```bash
ENABLE_ASYNC_GCS_UPLOAD=true
BULLMQ_WORKER_CONCURRENCY=3
REDIS_HOST=redis
GCS_PROJECT_ID=formio-project
GCS_BUCKET_NAME=formio-uploads
```

### TUS Server

```yaml
Image: tusproject/tusd:latest
Port: 1080
Volume: tus-uploads
Max Size: 5GB (configurable)
```

**Upload endpoint:**
```
POST http://localhost:1080/files/
```

---

## 🧪 Testing

### Backend Integration Tests

```bash
# Start test infrastructure
docker-compose up -d

# Run integration tests
cd formio
bun test src/upload/__tests__/integration.test.js
```

**Tests:**
- ✅ Job enqueueing on TUS upload complete
- ✅ BullMQ worker processes jobs
- ✅ GCS emulator receives uploads
- ✅ MongoDB updated with signed URLs
- ✅ Retry logic with exponential backoff

### E2E React Tests

```bash
# Start with test profile
docker-compose --profile test up -d

# Run E2E tests
cd test-app
bun run test:e2e tests/e2e/gcs-upload.spec.ts
```

**Tests:**
- ✅ React form renders file upload component
- ✅ Multiple file upload (3 files)
- ✅ Submission displays uploaded files
- ✅ Bulk upload (15+ files)
- ✅ Error handling validation

---

## 🔧 Configuration

### Environment Variables

See `.env.example` for complete list. Key variables:

```bash
# Development
NODE_ENV=development
DEBUG=formio:*
DISABLE_RATE_LIMIT=true

# Production
NODE_ENV=production
DEBUG=formio:error,formio:warn
ENABLE_ASYNC_GCS_UPLOAD=true
BULLMQ_WORKER_CONCURRENCY=10
```

### Resource Limits

Adjust in `docker-compose.yml`:

```yaml
formio-server:
  mem_limit: 2g        # Increase for production
  cpus: 2.0            # More CPUs for concurrency
```

### BullMQ Concurrency

Control parallel upload processing:

```bash
# .env
BULLMQ_WORKER_CONCURRENCY=5  # Process 5 uploads simultaneously
```

---

## 📈 Monitoring

### View Job Queue Status

```bash
# Redis CLI
docker exec -it formio-redis redis-cli

# List all jobs
KEYS "bull:gcs-upload:*"

# Get job details
HGETALL "bull:gcs-upload:123"
```

### Check GCS Uploads

```bash
# List uploaded files
curl http://localhost:4443/storage/v1/b/formio-uploads/o
```

### MongoDB Queries

```bash
# Check submissions
docker exec -it formio-mongo mongosh formioapp

db.submissions.find({}).pretty()
db.submissions.find({ "data.testFile.storage": "gcs" })
```

---

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart formio-server

# Rebuild
docker-compose build --no-cache formio-server
docker-compose up -d
```

### Job Queue Issues

```bash
# Clear failed jobs
docker exec -it formio-redis redis-cli FLUSHDB

# Restart worker
docker-compose restart formio-server
```

### Port Conflicts

```bash
# Change ports in .env
FORMIO_PORT=3002
TUS_PORT=1081

# Restart
docker-compose down
docker-compose up -d
```

---

## 🧹 Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
docker system prune -a --volumes
```

---

## 🚀 Production Deployment

### Security Checklist

- [ ] Change `JWT_SECRET` and `DB_SECRET`
- [ ] Use strong `ROOT_PASSWORD`
- [ ] Configure real GCS credentials
- [ ] Enable HTTPS (reverse proxy)
- [ ] Set `NODE_ENV=production`
- [ ] Configure monitoring (OpenTelemetry)
- [ ] Set up log aggregation
- [ ] Enable rate limiting (`DISABLE_RATE_LIMIT=false`)

### Recommended Production Setup

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with production values

# 2. Start full stack
docker-compose --profile full up -d

# 3. Verify health
curl https://your-domain.com/health

# 4. Monitor logs
docker-compose logs -f --tail=100
```

---

## 📚 Additional Resources

- [GCS Async Upload Implementation](./GCS_ASYNC_UPLOAD_IMPLEMENTATION.md)
- [Integration Status Report](./INTEGRATION_STATUS.md)
- [Form.io Documentation](https://help.form.io)
- [TUS Protocol Spec](https://tus.io/protocols/resumable-upload.html)
- [BullMQ Documentation](https://docs.bullmq.io)

---

## 🎯 Success Criteria

✅ **Infrastructure:**
- ONE Docker Compose file (DRY principle)
- Profile-based service selection
- All services health-checked
- Volumes persisted correctly

✅ **Testing:**
- 5 backend integration tests passing
- 4 E2E React tests passing
- All profiles work independently

✅ **Performance:**
- Async GCS upload enabled
- BullMQ worker processing jobs
- 3 concurrent workers default

---

**Questions?** Open an issue or check the troubleshooting section above.

**Last Updated:** October 5, 2025
**Maintained By:** Form.io Development Team
