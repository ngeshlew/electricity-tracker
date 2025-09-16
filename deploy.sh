#!/bin/bash

# Netlify Deployment Script for Electricity Tracker

echo "🚀 Starting Netlify deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory"
echo ""
echo "🌐 Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Connect your GitHub repository"
echo "4. Set build command: npm run build"
echo "5. Set publish directory: dist"
echo "6. Add environment variables in Site settings > Environment variables"
echo "   - VITE_SERVER_URL: https://your-backend-url.herokuapp.com"
echo ""
echo "🔧 Don't forget to deploy your backend separately!"
echo "   Recommended: Railway, Heroku, or DigitalOcean App Platform"
