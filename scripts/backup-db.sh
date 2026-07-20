#!/bin/sh
set -e

echo "Starting database backup..."

if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_DB" ]; then
  echo "Error: POSTGRES_USER and POSTGRES_DB must be set."
  exit 1
fi

BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

echo "Running pg_dump..."
docker compose exec postgres pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -F c -f /tmp/$BACKUP_FILE

echo "Copying backup file from container..."
docker compose cp postgres:/tmp/$BACKUP_FILE ./$BACKUP_FILE

echo "Database backup completed: ./$BACKUP_FILE"
