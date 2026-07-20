#!/bin/sh
set -e

echo "Starting database deployment..."

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

echo "Reminder: Did you backup your database before running this deployment? (Use scripts/backup-db.sh)"
read -p "Press enter to continue or Ctrl+C to abort..."

echo "Running prisma migrate deploy..."
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

echo "Database deployment completed successfully."
