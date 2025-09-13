#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Setting up Electricity Tracker Database...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one with your database configuration.');
  process.exit(1);
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  // Push database schema
  console.log('🚀 Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('📊 You can now start the server with: npm run dev');
  console.log('🔍 View your database with: npm run db:studio');
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('   - PostgreSQL running on your system');
  console.log('   - Correct DATABASE_URL in your .env file');
  console.log('   - Prisma CLI installed globally: npm install -g prisma');
  process.exit(1);
}
