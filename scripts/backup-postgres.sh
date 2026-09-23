#!/usr/bin/env bash

S3_BUCKET="booking-system-backups-540389263579"
S3_PREFIX="postgres"

set -Eeuo pipefail

APP_DIR="/home/ubuntu/node-project-1"
BACKUP_DIR="/home/ubuntu/backups/postgres"
RETENTION_DAYS=7

TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
BACKUP_FILE="${BACKUP_DIR}/booking_db_${TIMESTAMP}.dump"

cd "$APP_DIR"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

echo "Starting PostgreSQL backup: $BACKUP_FILE"

docker compose exec -T postgres sh -lc \
  'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -Fc' > "$BACKUP_FILE"

if [ ! -s "$BACKUP_FILE" ]; then
  echo "Backup failed: file is empty"
  rm -f "$BACKUP_FILE"
  exit 1
fi

sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"

echo "Uploading backup to S3..."

aws s3 cp \
  "$BACKUP_FILE" \
  "s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "$BACKUP_FILE")"

aws s3 cp \
  "${BACKUP_FILE}.sha256" \
  "s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "${BACKUP_FILE}.sha256")"

echo "S3 upload completed successfully"

find "$BACKUP_DIR" \
  -type f \
  \( -name "*.dump" -o -name "*.sha256" \) \
  -mtime +"$RETENTION_DAYS" \
  -delete

echo "PostgreSQL backup completed successfully"
echo "Backup: $BACKUP_FILE"