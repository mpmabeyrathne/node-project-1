#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="/home/ubuntu/node-project-1"
HEALTH_URL="https://api.pasindumadhuwantha.com/health"

if [ -z "${PREVIOUS_COMMIT:-}" ]; then
  echo "PREVIOUS_COMMIT is required"
  exit 1
fi

cd "$APP_DIR"

rollback() {
  local exit_code=$?

  trap - ERR

  echo "Deployment failed."
  echo "Rolling back to: $PREVIOUS_COMMIT"

  git reset --hard "$PREVIOUS_COMMIT"

  docker compose up -d --build

  echo "Waiting for rollback health check..."

  for attempt in $(seq 1 12); do
    if curl -fsS "$HEALTH_URL" >/dev/null; then
      echo "Rollback successful. API is healthy."
      exit "$exit_code"
    fi

    echo "Rollback health attempt $attempt/12 failed"
    sleep 5
  done

  echo "CRITICAL: rollback completed but API is still unhealthy."
  exit "$exit_code"
}

trap rollback ERR

echo "Starting production deployment..."

docker compose up -d --build

echo "Waiting for application health..."

HEALTHY=false

for attempt in $(seq 1 12); do
  if curl -fsS "$HEALTH_URL" >/dev/null; then
    HEALTHY=true
    break
  fi

  echo "Health attempt $attempt/12 failed"
  sleep 5
done

if [ "$HEALTHY" != "true" ]; then
  echo "Production health check failed"
  false
fi

trap - ERR

echo "Production deployment successful."