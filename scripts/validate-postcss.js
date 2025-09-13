#!/usr/bin/env node

/**
 * PostCSS Configuration Validator
 * Validates PostCSS configuration and provides helpful error messages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function validatePostCSSConfig() {
  console.log('🔍 Validating PostCSS configuration...\n');

  // Check if package.json exists
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    return false;
  }

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check for required dependencies
  const requiredDeps = ['@tailwindcss/postcss', 'tailwindcss', 'postcss', 'autoprefixer'];
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );

  if (missingDeps.length > 0) {
    console.error('❌ Missing required dependencies:', missingDeps.join(', '));
    console.log('💡 Run: npm install', missingDeps.join(' '));
    return false;
  }

  // Check PostCSS config
  const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
  if (!fs.existsSync(postcssConfigPath)) {
    console.error('❌ postcss.config.js not found');
    return false;
  }

  // Read PostCSS config
  const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  
  // Validate configuration
  if (!postcssConfig.includes('@tailwindcss/postcss')) {
    console.error('❌ PostCSS config is missing @tailwindcss/postcss plugin');
    console.log('💡 Update postcss.config.js to use @tailwindcss/postcss: {}');
    return false;
  }

  if (!postcssConfig.includes('autoprefixer')) {
    console.warn('⚠️  PostCSS config is missing autoprefixer plugin');
  }

  // Check Tailwind config
  const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
  if (!fs.existsSync(tailwindConfigPath)) {
    console.error('❌ tailwind.config.js not found');
    return false;
  }

  console.log('✅ PostCSS configuration is valid');
  console.log('✅ All required dependencies are installed');
  console.log('✅ Tailwind CSS configuration found');
  
  return true;
}

function provideTroubleshootingTips() {
  console.log('\n🔧 Troubleshooting Tips:');
  console.log('1. Clear node_modules and reinstall:');
  console.log('   rm -rf node_modules package-lock.json && npm install');
  console.log('2. Clear Vite cache:');
  console.log('   rm -rf node_modules/.vite');
  console.log('3. Check for conflicting PostCSS plugins');
  console.log('4. Ensure all CSS imports are correct');
  console.log('5. Verify Tailwind CSS version compatibility');
}

// Run validation
if (validatePostCSSConfig()) {
  console.log('\n🎉 PostCSS configuration is ready!');
  process.exit(0);
} else {
  console.log('\n❌ PostCSS configuration has issues');
  provideTroubleshootingTips();
  process.exit(1);
}

