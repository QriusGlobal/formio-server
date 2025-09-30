#!/bin/bash
# Start TUS server for E2E testing

echo "🚀 Starting TUS server on port 1080..."

# Check if tusd is running
if curl -s http://localhost:1080 > /dev/null 2>&1; then
    echo "✅ TUS server already running on port 1080"
    exit 0
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker or use npx tusd"
    echo "Alternative: npx tusd -port=1080"
    exit 1
fi

# Start TUS server with Docker
echo "🐳 Starting TUS server with Docker..."
docker run -d \
    --name tusd-test \
    -p 1080:1080 \
    -v /tmp/tusd-data:/data \
    tusproject/tusd:latest \
    -behind-proxy \
    -hooks-enabled-events=pre-create,post-create,post-finish

# Wait for server to be ready
echo "⏳ Waiting for TUS server to start..."
for i in {1..30}; do
    if curl -s http://localhost:1080 > /dev/null 2>&1; then
        echo "✅ TUS server is ready!"
        echo "📍 Server: http://localhost:1080"
        echo "📁 Data directory: /tmp/tusd-data"
        exit 0
    fi
    sleep 1
done

echo "❌ TUS server failed to start within 30 seconds"
docker logs tusd-test
exit 1