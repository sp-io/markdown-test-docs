#!/usr/bin/env node

/**
 * Build script for GitHub Action
 * Compiles TypeScript and ensures proper structure
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building GitHub Action...');

try {
  // Clean dist directory
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    console.log('🧹 Cleaning dist directory...');
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  // Create dist directory
  fs.mkdirSync(distDir, { recursive: true });

  // Build library
  console.log('📚 Building library...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Build action entry point
  console.log('⚡ Building action entry point...');
  execSync('npx tsc src/action.ts --outDir dist --target ES2019 --module CommonJS --esModuleInterop --declaration false --resolveJsonModule', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log('📁 Generated files:');
  
  // List generated files
  const files = fs.readdirSync(distDir);
  files.forEach(file => {
    console.log(`   - dist/${file}`);
  });

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
