#!/bin/bash

echo "🔐 Setting up My Vault repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git initialized"
else
    echo "ℹ️  Git already initialized"
fi

# Add the remote repository
if ! git remote | grep -q "origin"; then
    git remote add origin https://github.com/webdevtodayjason/MyVault.git
    echo "✅ Remote repository added"
else
    echo "ℹ️  Remote repository already configured"
fi

# Create initial commit
echo "📦 Adding files..."
git add .
git commit -m "Initial commit: My Vault - Secure Key Manager

- 🔒 Biometric authentication with PIN fallback
- 📱 Progressive Web App support
- 🗂️ Manage Applications, API Keys, and Bookmarks
- 🎨 Beautiful glass morphism UI with pink glow theme
- 🐳 Docker ready for easy deployment
- 📤 Import/Export in multiple formats (JSON, CSV, Markdown)
- 🔐 All data stored locally for maximum security"

echo "🚀 Ready to push to GitHub!"
echo ""
echo "To push to your repository, run:"
echo "  git push -u origin main"
echo ""
echo "If you get an error about the branch name, try:"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "Repository: https://github.com/webdevtodayjason/MyVault"