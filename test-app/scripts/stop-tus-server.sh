#!/bin/bash
# Stop TUS server

echo "🛑 Stopping TUS server..."

if docker ps | grep -q tusd-test; then
    docker stop tusd-test
    docker rm tusd-test
    echo "✅ TUS server stopped and removed"
else
    echo "ℹ️  No TUS server container running"
fi