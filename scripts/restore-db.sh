#!/bin/sh
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/restore-db.sh <backup_file.sql>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file $BACKUP_FILE not found."
  exit 1
fi

if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_DB" ]; then
  echo "Error: POSTGRES_USER and POSTGRES_DB must be set."
  exit 1
fi

echo "Copying backup file to container..."
docker compose cp $BACKUP_FILE postgres:/tmp/restore.sql

echo "Restoring database..."
docker compose exec postgres pg_restore -U $POSTGRES_USER -d $POSTGRES_DB -c --if-exists /tmp/restore.sql

echo "Database restore completed successfully."
