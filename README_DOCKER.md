# 🐳 Docker Quick Start - Form.io Monorepo

**ONE command to rule them all!**

---

## 🚀 Quick Start (30 seconds)

```bash
# 1. Setup environment
cp .env.example .env

# 2. Start everything
docker-compose up -d

# 3. Test it works
curl http://localhost:3001/health
```

**Done!** All services running with async GCS upload enabled.

---

## 📋 What You Get

- ✅ MongoDB (database)
- ✅ Redis (job queue)
- ✅ GCS Emulator (file storage)
- ✅ Form.io Server (API with async upload)
- ✅ TUS Server (resumable uploads)

---

## 🎯 Usage Modes

### Development (Core + React App)

```bash
docker-compose --profile dev up -d
```

**Includes:** Core services + test-app on http://localhost:64849

### Testing (Core + Playwright)

```bash
docker-compose --profile test up -d

# Run tests
cd formio && bun test src/upload/__tests__/integration.test.js
cd test-app && bun run test:e2e
```

### Full Stack (All Services)

```bash
docker-compose --profile full up -d
```

**Includes:** Core + nginx + upload processor + webhooks

---

## 🔍 Verify It's Working

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f formio-server

# Test upload
curl -X POST http://localhost:3001/form \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","components":[]}'
```

---

## 🧪 Run Tests

```bash
# Backend integration (5 tests)
cd formio
bun test src/upload/__tests__/integration.test.js

# E2E React (4 tests)
cd test-app
bun run test:e2e tests/e2e/gcs-upload.spec.ts
```

---

## 📊 Monitor Services

### Job Queue (Redis)

```bash
docker exec -it formio-redis redis-cli

# View jobs
KEYS "bull:gcs-upload:*"
```

### GCS Uploads

```bash
# List files
curl http://localhost:4443/storage/v1/b/formio-uploads/o
```

### Database

```bash
docker exec -it formio-mongo mongosh formioapp

# Query submissions
db.submissions.find({}).pretty()
```

---

## 🛑 Stop Services

```bash
# Stop (keeps data)
docker-compose down

# Stop and remove data
docker-compose down -v
```

---

## 📚 Full Documentation

- **Complete Guide:** [docs/DOCKER_COMPOSE_GUIDE.md](docs/DOCKER_COMPOSE_GUIDE.md)
- **Implementation Summary:** [docs/DOCKER_CONSOLIDATION_SUMMARY.md](docs/DOCKER_CONSOLIDATION_SUMMARY.md)
- **GCS Upload Details:** [docs/GCS_ASYNC_UPLOAD_IMPLEMENTATION.md](docs/GCS_ASYNC_UPLOAD_IMPLEMENTATION.md)

---

## 🔧 Configuration

Edit `.env` to customize:

```bash
# Async upload
ENABLE_ASYNC_GCS_UPLOAD=true
BULLMQ_WORKER_CONCURRENCY=3

# GCS
GCS_BUCKET_NAME=formio-uploads

# Secrets (change in production!)
JWT_SECRET=your-secret-here
```

---

## 🐛 Troubleshooting

**Service won't start?**
```bash
docker-compose logs <service-name>
docker-compose restart <service-name>
```

**Port conflict?**
```bash
# Change in .env
FORMIO_PORT=3002
TUS_PORT=1081
```

**Clear everything?**
```bash
docker-compose down -v
docker system prune -a
```

---

## ✅ Success!

You now have:
- ✅ Form.io server with async GCS upload
- ✅ Complete testing infrastructure
- ✅ 9 integration + E2E tests
- ✅ Production-ready configuration

**Next:** Test with `bun test` and deploy!

---

**Questions?** See [docs/DOCKER_COMPOSE_GUIDE.md](docs/DOCKER_COMPOSE_GUIDE.md)
