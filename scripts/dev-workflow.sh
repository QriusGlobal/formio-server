#!/bin/bash

# Development workflow automation
# Opens multiple terminal tabs/panes for parallel development

set -e

MONOREPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$MONOREPO_ROOT"

echo "🚀 Form.io Development Workflow Launcher"
echo "════════════════════════════════════════"
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
  echo "📺 Detected tmux - starting multi-pane session..."
  echo ""

  # Check if session already exists
  if tmux has-session -t formio-dev 2>/dev/null; then
    echo "⚠️  Session 'formio-dev' already exists"
    echo ""
    read -p "Attach to existing session? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      tmux attach-session -t formio-dev
      exit 0
    else
      echo "Exiting..."
      exit 0
    fi
  fi

  # Create new tmux session
  echo "Creating new tmux session 'formio-dev'..."

  # Window 0: Docker services
  tmux new-session -d -s formio-dev -n 'docker-services'
  tmux send-keys -t formio-dev:0 'cd '"$MONOREPO_ROOT"' && make local-up' C-m

  # Wait for services to start
  sleep 5

  # Window 1: formio-core watch
  tmux new-window -t formio-dev:1 -n 'formio-core'
  tmux send-keys -t formio-dev:1 'cd '"$MONOREPO_ROOT"'/formio-core && echo "Building formio-core..." && yarn build && echo "" && echo "👁️  Watching for changes..." && yarn build:watch' C-m

  # Window 2: formio server logs
  tmux new-window -t formio-dev:2 -n 'server-logs'
  tmux send-keys -t formio-dev:2 'cd '"$MONOREPO_ROOT"' && sleep 3 && make local-logs-formio' C-m

  # Window 3: test app
  tmux new-window -t formio-dev:3 -n 'test-app'
  tmux send-keys -t formio-dev:3 'cd '"$MONOREPO_ROOT"'/test-app && echo "Installing dependencies..." && npm install && echo "" && echo "🧪 Starting test app on port 64849..." && npm run dev' C-m

  # Window 4: shell for commands
  tmux new-window -t formio-dev:4 -n 'shell'
  tmux send-keys -t formio-dev:4 'cd '"$MONOREPO_ROOT"'' C-m
  tmux send-keys -t formio-dev:4 'clear' C-m
  tmux send-keys -t formio-dev:4 'echo "═══════════════════════════════════════════════════════════"' C-m
  tmux send-keys -t formio-dev:4 'echo "  Development Environment Ready!"' C-m
  tmux send-keys -t formio-dev:4 'echo "═══════════════════════════════════════════════════════════"' C-m
  tmux send-keys -t formio-dev:4 'echo ""' C-m
  tmux send-keys -t formio-dev:4 'echo "🌐 Test App:       http://localhost:64849"' C-m
  tmux send-keys -t formio-dev:4 'echo "🌐 Form.io Server: http://localhost:3001"' C-m
  tmux send-keys -t formio-dev:4 'echo "🪣 GCS Emulator:   http://localhost:4443"' C-m
  tmux send-keys -t formio-dev:4 'echo ""' C-m
  tmux send-keys -t formio-dev:4 'echo "📋 Useful commands:"' C-m
  tmux send-keys -t formio-dev:4 'echo "  make verify-upload  - Check uploaded files"' C-m
  tmux send-keys -t formio-dev:4 'echo "  make verify-services - Check service health"' C-m
  tmux send-keys -t formio-dev:4 'echo "  make local-reset    - Reset environment"' C-m
  tmux send-keys -t formio-dev:4 'echo ""' C-m
  tmux send-keys -t formio-dev:4 'echo "🔀 Switch windows: Ctrl+B then 0-4"' C-m
  tmux send-keys -t formio-dev:4 'echo "🚪 Detach session: Ctrl+B then D"' C-m
  tmux send-keys -t formio-dev:4 'echo "❌ Exit session:   Type 'exit' or Ctrl+B then :kill-session"' C-m
  tmux send-keys -t formio-dev:4 'echo ""' C-m

  # Select the shell window
  tmux select-window -t formio-dev:4

  # Attach to session
  tmux attach-session -t formio-dev

else
  echo "❌ tmux not found. Running in sequential mode..."
  echo ""
  echo "Please run these commands in separate terminals:"
  echo ""
  echo "Terminal 1: make local-up"
  echo "Terminal 2: cd formio-core && yarn build:watch"
  echo "Terminal 3: make test-app"
  echo "Terminal 4: make local-logs-formio"
  echo ""
  echo "Or install tmux for automatic setup:"
  echo "  macOS: brew install tmux"
  echo "  Linux: apt-get install tmux"
  echo ""
fi