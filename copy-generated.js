#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'generated');
const destDir = path.join(__dirname, 'dist', 'generated');

// Create dest directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Recursive copy function
function copyDir(src, dest) {
  // Create dest dir if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

try {
  copyDir(srcDir, destDir);
  console.log('✓ Generated files copied to dist/generated');
} catch (err) {
  console.error('✗ Failed to copy generated files:', err.message);
  process.exit(1);
}
