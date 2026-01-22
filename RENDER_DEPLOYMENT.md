# Render Deployment Guide

## Important: Render Free Tier Limitation
Render free tier **blocks execution of Prisma CLI** (prisma, npx prisma). Therefore:
- ❌ Prisma client generation **CANNOT** run on Render
- ❌ Migrations **CANNOT** run on Render  
- ✅ Only dependencies install + TypeScript build + app startup

## Pre-Deployment Setup

### Step 1: Generate Prisma Client Locally
Before each deployment, ensure Prisma client is generated:

```bash
npm run generate
```

This creates the Prisma client in `node_modules/@prisma/client/`.

### Step 2: Run Migrations Locally
Apply pending migrations to your Supabase database:

```bash
npm run migrate:local
```

This applies migrations in `prisma/migrations/` to your database.

### Step 3: Verify Everything Builds
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

## Deployment Process

### Step 1: Commit and Push
```bash
git add .
git commit -m "Pre-deployment: generate Prisma client and apply migrations"
git push origin main
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Navigate to your **backend** service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

### What Happens During Build on Render
1. ✅ `npm install` - Installs all dependencies (node_modules)
2. ✅ `npm run build` - Compiles TypeScript to JavaScript
3. ✅ `npm start` - Starts the Node.js server

### What Does NOT Happen on Render
- ❌ No Prisma client generation (pre-generated locally)
- ❌ No migrations (applied locally before deploy)
- ❌ No Prisma CLI execution (blocked on free tier)

## Complete Deployment Checklist

- [ ] Run `npm run generate` - Generate Prisma client
- [ ] Run `npm run migrate:local` - Apply migrations to database
- [ ] Run `npm run build` - Verify TypeScript compiles
- [ ] Run `git add . && git commit ... && git push` - Push to GitHub
- [ ] On Render: Click "Manual Deploy" and monitor build logs

## Environment Variables on Render

Ensure these are set in your Render dashboard under "Environment":
```
NODE_ENV=production
PORT=10000
DATABASE_URL_POOLER=postgresql://postgres.jyxdmdincaakoflpkjqb:manomohan@2004@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true
JWT_SECRET=<your-jwt-secret>
CORS_ORIGIN=<your-frontend-url>
```

## Troubleshooting

### "PrismaClientInitializationError: Prisma Client is missing"
**Cause**: Prisma client wasn't generated before deployment  
**Fix**: Run `npm run generate` locally before pushing

### "Can't reach database server"
**Cause**: DATABASE_URL_POOLER not set or incorrect  
**Fix**: Verify environment variable in Render dashboard

### Build fails with "Command failed"
1. Check Render logs for specific error
2. Verify all environment variables are set
3. Ensure Prisma client was generated: `npm run generate`

### Application crashes on startup
1. Check database connection: verify DATABASE_URL_POOLER
2. Verify all migrations have been applied: `npm run migrate:local`
3. Check application logs in Render dashboard

## Quick Reference

**Local commands before deployment:**
```bash
npm run generate          # Generate Prisma client
npm run migrate:local     # Run pending migrations
npm run build             # Compile TypeScript
git push origin main      # Push to GitHub
```

**Then on Render:** Manual Deploy → Deploy latest commit

## Notes
- Prisma client must be generated on **your local machine**, not on Render
- Migrations must be applied to Supabase **before deployment**
- Render will only run `npm install` and `npm run build`
- Application starts with `npm run start`
