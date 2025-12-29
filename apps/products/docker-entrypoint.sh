#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/apps/products && npx drizzle-kit migrate

echo "Starting application..."
exec node /app/dist/apps/products/main
