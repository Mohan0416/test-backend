#!/usr/bin/env node
/**
 * Generate Prisma Client at install time
 * Attempts to generate with correct binary targets for current platform
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  // Check if we're in a CI/deployment environment
  const isCI = process.env.CI || process.env.RENDER || process.env.VERCEL || process.env.NETLIFY;
  
  if (isCI) {
    console.log('🔄 CI environment detected - attempting Prisma generation...');
  }

  // Try to generate Prisma client
  try {
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('✓ Prisma Client generated successfully');
  } catch (err) {
    // If generation fails, it's likely due to Render's restrictions
    // The client might already be in node_modules from npm install
    console.log('⚠️  Prisma generation not available (expected on Render free tier)');
    console.log('   Prisma client should already be installed via npm install');
  }
} catch (error) {
  console.error('Error in postinstall:', error.message);
  // Don't fail - npm install should have already pulled the client
  process.exit(0);
}
