#!/bin/bash
# Run Prisma migrations locally before deployment
# This must be executed before pushing to Render

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migrations failed"
  exit 1
fi
