# Render Deployment Guide

## Pre-Deployment Setup

### 1. Run Migrations Locally
Before each deployment, ensure all pending migrations are applied to your database:

```bash
npx prisma migrate deploy
```

This applies any new migrations in the `prisma/migrations/` folder to your Supabase database.

### 2. Verify Your Environment
Make sure you have the correct database connection in your `.env`:
```
DATABASE_URL_POOLER=postgresql://postgres.jyxdmdincaakoflpkjqb:manomohan@2004@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

## Deployment Process

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Step 2: Trigger Render Deployment
1. Go to [render.com](https://render.com)
2. Navigate to your **backend** service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

### What Happens During Build
1. ✅ `npm install` - Installs all dependencies
2. ✅ `postinstall` hook - Runs `npx prisma generate` (generates Prisma client)
3. ✅ `npm run build` - Compiles TypeScript to JavaScript
4. ✅ Service starts with `npm run start`

### What Does NOT Happen
- ❌ No migrations run on Render (due to free tier restrictions)
- ❌ No Prisma CLI execution on Render

## Important Notes

- **Migrations must be run locally** before deployment
- The Prisma client is generated automatically during `npm install` via postinstall
- TypeScript is compiled to JavaScript during the build
- Your database schema changes are applied before pushing code

## Environment Variables on Render

Ensure these are set in your Render dashboard:
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `DATABASE_URL_POOLER`: Your Supabase pooler connection string
- `JWT_SECRET`: Your JWT secret
- `CORS_ORIGIN`: Your frontend URL

## Troubleshooting

### Build Fails: "prisma: permission denied"
✅ **Fixed** - Prisma now generates via postinstall script, not during build

### Build Fails: "Cannot find module"
- Check that all dependencies are properly listed in `package.json`
- Ensure `typescript` and `@types/*` are in `dependencies`, not just `devDependencies`

### Application Starts but Crashes
- Check Render logs for errors
- Verify `DATABASE_URL_POOLER` is set correctly
- Check that migrations have been run on the database

### Can't Connect to Database
- Verify the pooler connection string is correct
- Ensure the string includes `?schema=public&pgbouncer=true`
- Check Supabase dashboard for connection issues
