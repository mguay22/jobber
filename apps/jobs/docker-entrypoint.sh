#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node /app/dist/apps/jobs/main
