#!/usr/bin/env bash
set -euo pipefail

HOST=${HOST:-gitdata-ecs}
REMOTE=${REMOTE:-/var/www/gitdata/server/}
SERVICE_NAME=${SERVICE_NAME:-gitdata-server}
SITE=${SITE:-}

ssh -O check "$HOST" >/dev/null 2>&1 || ssh -MNf "$HOST"

pnpm build:server

ssh "$HOST" "mkdir -p '${REMOTE}/dist'"
rsync -avz --delete -e "ssh" server/dist/ "$HOST":"${REMOTE}/dist/"

if [ -f server/.env ]; then
  rsync -avz -e "ssh" server/.env "$HOST":"$REMOTE/.env"
elif [ -f .env ]; then
  rsync -avz -e "ssh" .env "$HOST":"$REMOTE/.env"
fi

ssh "$HOST" "\
  if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files | grep -q '^${SERVICE_NAME}\\.service'; then \
    sudo systemctl restart '${SERVICE_NAME}' && sudo systemctl status '${SERVICE_NAME}' --no-pager -l | head -n 50; \
  elif command -v pm2 >/dev/null 2>&1; then \
    pm2 restart '${SERVICE_NAME}' || pm2 start '${REMOTE}/dist/server/main.js' --name '${SERVICE_NAME}'; pm2 status | grep '${SERVICE_NAME}' || true; \
  else \
    pkill -f '${REMOTE}/dist/server/main.js' || true; \
    nohup node '${REMOTE}/dist/server/main.js' >/var/www/gitdata/server/nohup.out 2>&1 & sleep 1; \
    pgrep -f '${REMOTE}/dist/server/main.js' || true; \
  fi" || true

if [ -n "$SITE" ]; then
  curl -I "$SITE" || true
fi
