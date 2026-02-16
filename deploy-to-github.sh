#!/bin/bash

# Deploy GitHub Wrapper to GitHub
# Usage: ./deploy-to-github.sh

set -e  # Exit on error

echo "🚀 Deploying GitHub Wrapper to GitHub"
echo "======================================"
echo ""

# Configuration
REPO_URL="https://github.com/talhaXdev/awesome-b2b-lead-generation.git"
REPO_NAME="awesome-b2b-lead-generation"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ README.md not found. Are you in the github-wrapper-b2bleadgen directory?"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""

# Add remote origin
if git remote get-url origin &> /dev/null; then
    echo "📝 Remote 'origin' already exists. Updating..."
    git remote set-url origin "$REPO_URL"
else
    echo "📝 Adding remote origin..."
    git remote add origin "$REPO_URL"
fi
echo "✅ Remote origin set to: $REPO_URL"
echo ""

# Configure git user (if not set)
if ! git config user.name &> /dev/null; then
    echo "🔧 Configuring git user name..."
    git config user.name "B2B Lead Gen Directory"
fi

if ! git config user.email &> /dev/null; then
    echo "🔧 Configuring git user email..."
    git config user.email "directory@b2bleadgen.co"
fi
echo "✅ Git user configured"
echo ""

# Count files to be committed
FILE_COUNT=$(find . -type f -not -path './.git/*' -not -path './content/*' | wc -l)
echo "📊 Files to commit: $FILE_COUNT"
echo ""

# Add all files
echo "📤 Adding files to git..."
git add .
echo "✅ Files added"
echo ""

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit. Repository is up to date."
    exit 0
fi

# Commit
echo "💾 Committing changes..."
git commit -m "🎉 Initial commit: 670+ B2B lead generation resources

- Added 670 agency/tool entries organized by 6 categories
- Created category READMEs for easy navigation  
- Set up GitHub Actions for automated syncing
- Added contribution guidelines and MIT license
- Generated SEO-optimized markdown files with backlinks

Categories included:
- Full-Service Agencies (113 entries)
- DIY Tools & Platforms (115 entries)
- Appointment Setting (111 entries)
- LinkedIn-Specific Agencies (111 entries)
- Email Outreach Services (110 entries)
- SaaS/Software Agencies (110 entries)"

echo "✅ Changes committed"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
echo "   Repository: $REPO_URL"
echo ""

# Try to push
if git push -u origin main 2>&1 | tee /tmp/push_output.txt; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
elif git push -u origin master 2>&1 | tee /tmp/push_output.txt; then
    echo ""
    echo "✅ Successfully pushed to GitHub (master branch)!"
    echo ""
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "Common issues:"
    echo "1. Repository doesn't exist yet - Create it at:"
    echo "   https://github.com/new?name=$REPO_NAME"
    echo ""
    echo "2. Authentication failed - Use personal access token:"
    echo "   git remote set-url origin https://USERNAME:TOKEN@github.com/talhaXdev/$REPO_NAME.git"
    echo ""
    echo "3. Check error message above for details"
    echo ""
    exit 1
fi

# Success summary
echo "======================================"
echo "🎉 Deployment Complete!"
echo "======================================"
echo ""
echo "📊 Summary:"
echo "  • Repository: $REPO_URL"
echo "  • Files pushed: $FILE_COUNT"
echo "  • Categories: 6"
echo "  • Total entries: 670+"
echo ""
echo "🔗 Quick Links:"
echo "  • Repository: https://github.com/talhaXdev/$REPO_NAME"
echo "  • Your Profile: https://github.com/talhaXdev"
echo "  • Main Website: https://b2bleadgen.co"
echo ""
echo "⚙️  Next Steps:"
echo "  1. Visit: https://github.com/talhaXdev/$REPO_NAME"
echo "  2. Go to Actions tab and enable workflows"
echo "  3. The daily sync is now active!"
echo ""
echo "📈 Expected Results:"
echo "  • Week 1: Repository indexed by Google"
echo "  • Month 1: Initial backlinks recognized"
echo "  • Month 3: SEO ranking improvements"
echo "  • Month 6: Significant authority boost"
echo ""
echo "🛠️  Troubleshooting:"
echo "  • See SETUP.md for detailed instructions"
echo "  • Check GitHub Actions for sync status"
echo "  • Monitor Google Search Console for backlinks"
echo ""
