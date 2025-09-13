#!/usr/bin/env node

/**
 * PostCSS Fix Script
 * Automatically fixes common PostCSS configuration issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function fixPostCSSConfig() {
  log('🔧 Fixing PostCSS configuration...', 'info');

  try {
    // Check if @tailwindcss/postcss is installed
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.dependencies?.['@tailwindcss/postcss']) {
      log('📦 Installing @tailwindcss/postcss...', 'info');
      execSync('npm install @tailwindcss/postcss', { 
        cwd: projectRoot, 
        stdio: 'inherit' 
      });
    }

    // Update PostCSS config
    const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
    const newPostcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}`;

    fs.writeFileSync(postcssConfigPath, newPostcssConfig);
    log('✅ Updated postcss.config.js', 'success');

    // Clear caches
    log('🧹 Clearing caches...', 'info');
    try {
      execSync('rm -rf node_modules/.vite', { cwd: projectRoot, stdio: 'pipe' });
    } catch (e) {
      // Ignore if cache doesn't exist
    }

    log('🎉 PostCSS configuration fixed successfully!', 'success');
    log('💡 Run "npm run dev" to test the fix', 'info');

  } catch (error) {
    log(`❌ Error fixing PostCSS configuration: ${error.message}`, 'error');
    process.exit(1);
  }
}

function validateFix() {
  log('🔍 Validating fix...', 'info');
  
  try {
    execSync('npm run validate:postcss', { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });
    log('✅ Fix validated successfully!', 'success');
  } catch (error) {
    log('⚠️  Fix validation failed, but configuration should still work', 'warning');
  }
}

// Run the fix
fixPostCSSConfig();
validateFix();

