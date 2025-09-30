#!/bin/bash
set -e

echo "🪣 Initializing local GCS emulator..."

# Wait for GCS emulator to be ready
echo "⏳ Waiting for GCS emulator to start..."
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  if curl -s http://localhost:4443/storage/v1/b > /dev/null 2>&1; then
    echo "✅ GCS emulator is ready"
    break
  fi
  retry_count=$((retry_count + 1))
  echo "   Attempt $retry_count/$max_retries..."
  sleep 2
done

if [ $retry_count -eq $max_retries ]; then
  echo "❌ GCS emulator failed to start"
  exit 1
fi

# Create bucket
echo "📦 Creating bucket: local-formio-uploads"
curl -X POST http://localhost:4443/storage/v1/b \
  -H "Content-Type: application/json" \
  -d '{
    "name": "local-formio-uploads",
    "location": "US"
  }' > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Bucket created successfully"
else
  echo "⚠️  Bucket might already exist (this is fine)"
fi

# Create uploads folder structure
echo "📁 Creating folder structure..."
curl -X POST "http://localhost:4443/upload/storage/v1/b/local-formio-uploads/o?uploadType=media&name=uploads/.keep" \
  -H "Content-Type: application/octet-stream" \
  -d "" > /dev/null 2>&1

echo "✅ GCS emulator initialized"
echo ""
echo "📊 Bucket status:"
curl -s http://localhost:4443/storage/v1/b/local-formio-uploads | jq -r '"  Name: \(.name)\n  Location: \(.location)"' 2>/dev/null || echo "  Bucket: local-formio-uploads"
echo ""