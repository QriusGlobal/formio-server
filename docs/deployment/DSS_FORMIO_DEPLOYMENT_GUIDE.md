# DSS Form.io Service - Docker Deployment Guide

**Last Updated**: 2025-10-14  
**Purpose**: Deploy customized Form.io server to Google Cloud Platform (GCP) using custom Docker images

---

## Overview

This guide covers deploying the **customized Form.io server** from the monorepo to GCP Cloud Run, replacing the community Docker Hub image with your own custom-built image containing your modifications.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  form-client-web-app (Frontend)                              │
│  - React application                                        │
│  - Deployed to: Vercel/Netlify/Cloud Storage + CDN         │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Form.io Server (Custom Docker Image)                       │
│  - Source: ./formio/ directory                              │
│  - Base: formio/formio:latest                               │
│  - Customizations: File upload, BullMQ workers              │
│  - Deployed to: GCP Cloud Run                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐   ┌─────────────────┐
│  Cloud SQL      │   │  Cloud Storage  │
│  (PostgreSQL)   │   │  (GCS Bucket)   │
│  - Forms data   │   │  - File uploads │
└─────────────────┘   └─────────────────┘
```

---

## Part 1: Build Custom Docker Image

### **Step 1: Review Customizations**

Your `formio/` directory contains customized Form.io server code:

**Key Customizations**:
1. **BullMQ Worker Integration** - Async file upload processing
2. **Health Check Endpoint** - `/health` for container orchestration
3. **Install Script Fixes** - Automated admin user creation
4. **GCS Integration** - Native Google Cloud Storage support

**Dockerfile**: `formio/Dockerfile` (multi-stage build)
- Stage 1: Dependencies (Node 20, isolated-vm native module)
- Stage 2: Build application
- Stage 3: Production runtime (minimal image)

---

### **Step 2: Build Docker Image Locally**

Test build locally before pushing to registry:

```bash
# Navigate to formio directory
cd formio/

# Build Docker image (multi-stage)
docker build \
  --target production \
  --tag formio-custom:latest \
  --tag formio-custom:$(git rev-parse --short HEAD) \
  .

# Verify image size (should be ~500-600MB)
docker images formio-custom:latest

# Test image locally
docker run -d \
  --name formio-test \
  -p 3001:3001 \
  -e MONGO=mongodb://host.docker.internal:27017/formioapp \
  -e JWT_SECRET=test-jwt-secret \
  -e DB_SECRET=test-db-secret \
  formio-custom:latest

# Check logs
docker logs -f formio-test

# Test health endpoint
curl http://localhost:3001/health

# Stop test container
docker stop formio-test && docker rm formio-test
```

**Expected Output**:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-14T10:30:00.000Z"
}
```

---

### **Step 3: Tag for Google Container Registry (GCR)**

Tag your custom image for GCP:

```bash
# Set GCP project ID
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"  # Or your preferred region

# Tag for GCR (gcr.io)
docker tag formio-custom:latest \
  gcr.io/${GCP_PROJECT_ID}/formio-server:latest

docker tag formio-custom:latest \
  gcr.io/${GCP_PROJECT_ID}/formio-server:$(git rev-parse --short HEAD)

# Or tag for Artifact Registry (ar.io) - Recommended for new projects
docker tag formio-custom:latest \
  ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio/server:latest

docker tag formio-custom:latest \
  ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio/server:$(git rev-parse --short HEAD)
```

---

### **Step 4: Push to Google Container Registry**

**Option A: Google Container Registry (GCR) - Legacy**

```bash
# Authenticate Docker with GCR
gcloud auth configure-docker

# Push images
docker push gcr.io/${GCP_PROJECT_ID}/formio-server:latest
docker push gcr.io/${GCP_PROJECT_ID}/formio-server:$(git rev-parse --short HEAD)
```

**Option B: Artifact Registry - Recommended**

```bash
# Create repository (one-time setup)
gcloud artifacts repositories create formio \
  --repository-format=docker \
  --location=${GCP_REGION} \
  --description="Form.io custom Docker images"

# Authenticate Docker with Artifact Registry
gcloud auth configure-docker ${GCP_REGION}-docker.pkg.dev

# Push images
docker push ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio/server:latest
docker push ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio/server:$(git rev-parse --short HEAD)
```

**Verify Upload**:
```bash
# List images
gcloud artifacts docker images list \
  ${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio

# Or for GCR
gcloud container images list --repository=gcr.io/${GCP_PROJECT_ID}
```

---

## Part 2: Deploy to GCP Cloud Run

### **Step 1: Prepare Cloud Resources**

#### **A. Create Cloud SQL Instance (PostgreSQL)**

```bash
# Create Cloud SQL instance
gcloud sql instances create formio-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=${GCP_REGION} \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=03:00

# Set root password
gcloud sql users set-password postgres \
  --instance=formio-db \
  --password=$(openssl rand -base64 32)

# Create application database
gcloud sql databases create formioapp --instance=formio-db

# Create application user
gcloud sql users create formio_user \
  --instance=formio-db \
  --password=$(openssl rand -base64 32)

# Get connection name (format: project:region:instance)
gcloud sql instances describe formio-db --format='value(connectionName)'
```

---

#### **B. Create GCS Bucket for File Uploads**

```bash
# Create bucket
gsutil mb -p ${GCP_PROJECT_ID} -l ${GCP_REGION} gs://formio-uploads-${GCP_PROJECT_ID}

# Enable uniform bucket-level access
gsutil uniformbucketlevelaccess set on gs://formio-uploads-${GCP_PROJECT_ID}

# Set lifecycle policy (auto-delete uploads >90 days old)
cat > lifecycle.json << 'LIFECYCLE'
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 90}
      }
    ]
  }
}
LIFECYCLE

gsutil lifecycle set lifecycle.json gs://formio-uploads-${GCP_PROJECT_ID}
rm lifecycle.json
```

---

#### **C. Create Service Account**

```bash
# Create service account
gcloud iam service-accounts create formio-server \
  --display-name="Form.io Server" \
  --description="Service account for Form.io Cloud Run service"

# Grant Cloud SQL Client role
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:formio-server@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# Grant Storage Object Admin role (for GCS bucket)
gsutil iam ch \
  serviceAccount:formio-server@${GCP_PROJECT_ID}.iam.gserviceaccount.com:roles/storage.objectAdmin \
  gs://formio-uploads-${GCP_PROJECT_ID}

# Grant Secret Manager Accessor role (for JWT/DB secrets)
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:formio-server@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

#### **D. Create Secrets in Secret Manager**

```bash
# Create JWT secret
echo -n "$(openssl rand -base64 64)" | \
  gcloud secrets create formio-jwt-secret \
    --data-file=- \
    --replication-policy="automatic"

# Create DB secret
echo -n "$(openssl rand -base64 64)" | \
  gcloud secrets create formio-db-secret \
    --data-file=- \
    --replication-policy="automatic"

# Create root password
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create formio-root-password \
    --data-file=- \
    --replication-policy="automatic"

# Get Cloud SQL password (set earlier)
CLOUD_SQL_PASSWORD=$(gcloud secrets versions access latest --secret="formio-sql-password" 2>/dev/null || echo "$(openssl rand -base64 32)")
echo -n "${CLOUD_SQL_PASSWORD}" | \
  gcloud secrets create formio-sql-password \
    --data-file=- \
    --replication-policy="automatic"
```

---

### **Step 2: Deploy to Cloud Run**

#### **Deploy Command**

```bash
# Get Cloud SQL connection name
CLOUD_SQL_CONNECTION_NAME=$(gcloud sql instances describe formio-db --format='value(connectionName)')

# Deploy to Cloud Run
gcloud run deploy formio-server \
  --image=${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio/server:latest \
  --platform=managed \
  --region=${GCP_REGION} \
  --allow-unauthenticated \
  --service-account=formio-server@${GCP_PROJECT_ID}.iam.gserviceaccount.com \
  --add-cloudsql-instances=${CLOUD_SQL_CONNECTION_NAME} \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=10 \
  --port=3001 \
  --timeout=300 \
  --set-env-vars="PORT=3001,NODE_ENV=production,HOST=0.0.0.0" \
  --set-env-vars="FORMIO_FILES_SERVER=gcs,GCS_BUCKET_NAME=formio-uploads-${GCP_PROJECT_ID}" \
  --set-env-vars="MONGO=postgresql://formio_user:${CLOUD_SQL_PASSWORD}@/formioapp?host=/cloudsql/${CLOUD_SQL_CONNECTION_NAME}" \
  --set-secrets="JWT_SECRET=formio-jwt-secret:latest,DB_SECRET=formio-db-secret:latest,ROOT_PASSWORD=formio-root-password:latest"

# Get service URL
gcloud run services describe formio-server \
  --region=${GCP_REGION} \
  --format='value(status.url)'
```

**Expected Output**:
```
Service URL: https://formio-server-xxxxxxxxxx-uc.a.run.app
```

---

### **Step 3: Verify Deployment**

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe formio-server --region=${GCP_REGION} --format='value(status.url)')

# Test health endpoint
curl ${SERVICE_URL}/health

# Test Form.io API
curl ${SERVICE_URL}/health

# View logs
gcloud run services logs read formio-server --region=${GCP_REGION} --limit=50
```

---

## Part 3: Update docker-compose.yml for Local Development

Update `docker-compose.yml` to use your custom image:

```yaml
services:
  formio-server:
    # Option 1: Build from local source (development)
    build:
      context: ./formio
      dockerfile: Dockerfile
      target: production
    
    # Option 2: Use custom registry image (staging/production)
    # image: gcr.io/${GCP_PROJECT_ID}/formio-server:latest
    
    container_name: formio-server
    ports:
      - "${FORMIO_PORT:-3001}:3001"
    environment:
      # ... existing environment variables ...
      
    # Add labels for custom image tracking
    labels:
      - "com.qrius.formio.custom=true"
      - "com.qrius.formio.version=${GIT_COMMIT_SHA:-local}"
```

---

## Part 4: CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy-formio.yml`:

```yaml
name: Deploy Form.io Server

on:
  push:
    branches: [main]
    paths:
      - 'formio/**'
      - '.github/workflows/deploy-formio.yml'

env:
  GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  GCP_REGION: us-central1
  SERVICE_NAME: formio-server

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write  # For Workload Identity Federation
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker ${{ env.GCP_REGION }}-docker.pkg.dev
      
      - name: Build Docker image
        working-directory: ./formio
        run: |
          docker build \
            --target production \
            --tag ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/formio/server:${{ github.sha }} \
            --tag ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/formio/server:latest \
            .
      
      - name: Push Docker image
        run: |
          docker push ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/formio/server:${{ github.sha }}
          docker push ${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/formio/server:latest
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image=${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/formio/server:${{ github.sha }} \
            --region=${{ env.GCP_REGION }} \
            --platform=managed
      
      - name: Test deployment
        run: |
          SERVICE_URL=$(gcloud run services describe ${{ env.SERVICE_NAME }} \
            --region=${{ env.GCP_REGION }} \
            --format='value(status.url)')
          
          curl -f ${SERVICE_URL}/health || exit 1
```

---

## Part 5: Cost Optimization

### **Cloud Run Pricing** (us-central1 as of 2025)

- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: First 2 million free, then $0.40 per million

**Example Monthly Cost** (1,000 requests/day, 500ms avg response):
- 30,000 requests/month
- CPU: 15 vCPU-hours = **$0.86**
- Memory: 15 GiB-hours = **$0.04**
- Requests: Free tier
- **Total**: ~$1/month (plus Cloud SQL ~$10/month)

### **Cost Reduction Tips**

1. **Use min-instances=0** for dev/staging (cold starts acceptable)
2. **Use Cloud SQL Proxy** instead of public IP (+$0, more secure)
3. **Set lifecycle policies** on GCS buckets (auto-delete old files)
4. **Use preemptible Cloud SQL** for non-prod environments (-70% cost)

---

## Part 6: Monitoring & Logging

### **View Logs**

```bash
# Real-time logs
gcloud run services logs tail formio-server --region=${GCP_REGION}

# Last 50 entries
gcloud run services logs read formio-server --region=${GCP_REGION} --limit=50

# Filter by severity
gcloud run services logs read formio-server \
  --region=${GCP_REGION} \
  --filter='severity>=ERROR'
```

### **Cloud Monitoring Dashboard**

```bash
# Enable Cloud Monitoring API
gcloud services enable monitoring.googleapis.com

# View metrics in Cloud Console
echo "https://console.cloud.google.com/run/detail/${GCP_REGION}/formio-server/metrics?project=${GCP_PROJECT_ID}"
```

---

## Summary

### **What You've Deployed**

✅ **Custom Form.io Docker image** - Built from your `formio/` directory  
✅ **Cloud Run service** - Serverless, auto-scaling  
✅ **Cloud SQL database** - Managed PostgreSQL  
✅ **Cloud Storage bucket** - File uploads  
✅ **Secret Manager** - Secure credential storage  
✅ **CI/CD pipeline** - Automated deployments on push  

### **Your Custom Image URL**

```
${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/formio/server:latest
```

### **Next Steps**

1. Update `form-client-web-app` to point to Cloud Run URL
2. Configure custom domain (e.g., `api.yourdomain.com`)
3. Enable Cloud CDN for static assets
4. Set up Cloud Armor for DDoS protection
5. Configure alerting for errors/downtime

---

**Questions?** See:
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
