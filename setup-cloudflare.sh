#!/bin/bash

# Cloudflare Pages Setup Helper Script
# This script prepares your project for Cloudflare Pages deployment

echo "🚀 Preparing your project for Cloudflare Pages..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if .gitignore exists and has the right entries
if [ -f ".gitignore" ]; then
    echo "✅ .gitignore exists"
else
    echo "⚠️  .gitignore not found (creating one...)"
    cat > .gitignore << EOF
node_modules
dist
.env
*.log
.DS_Store
EOF
fi

# Build the project to make sure everything works
echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create a GitHub repository (if you haven't already)"
    echo "2. Run these commands:"
    echo "   git add ."
    echo "   git commit -m 'Ready for Cloudflare Pages'"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "   git push -u origin main"
    echo ""
    echo "3. Go to https://pages.cloudflare.com"
    echo "4. Connect your GitHub repository"
    echo "5. Use these build settings:"
    echo "   - Build command: npm run build"
    echo "   - Build output directory: dist"
    echo ""
    echo "6. Add environment variables (for Firebase):"
    echo "   - FIREBASE_PROJECT_ID"
    echo "   - FIREBASE_CLIENT_EMAIL"
    echo "   - FIREBASE_PRIVATE_KEY"
    echo ""
    echo "7. Deploy! 🎉"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

