# GitHub Wrapper Setup Guide

This guide will walk you through setting up the GitHub repository for the B2B Lead Generation Directory.

## 📋 Prerequisites

- GitHub account: [talhaXdev](https://github.com/talhaXdev)
- Git installed locally
- Node.js 18+ installed

## 🚀 Quick Setup

### Step 1: Create the GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `awesome-b2b-lead-generation`
3. Description: "A curated collection of 670+ B2B lead generation agencies and tools"
4. Make it **Public** (for SEO benefits)
5. Add README: No (we'll add our own)
6. Add .gitignore: Node
7. Add license: MIT
8. Click **Create repository**

### Step 2: Clone the Repository

```bash
cd /root/github-wrapper-b2bleadgen
git init
git remote add origin https://github.com/talhaXdev/awesome-b2b-lead-generation.git
```

### Step 3: Copy Generated Content

The content has already been generated in the `./content/` directory:

```bash
# Copy generated content to root
cp -r content/* .
```

### Step 4: Add Supporting Files

```bash
# Copy configuration files
cp package.json .
cp CONTRIBUTING.md .
cp LICENSE .
cp generate-markdown.js .
cp sync-to-github.js .
cp -r .github .
```

### Step 5: Create .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Generated content (we commit the output, not the source)
content/
data/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Environment variables
.env
.env.local
.env.*.local
EOF
```

### Step 6: Initial Commit

```bash
# Add all files
git add .

# Initial commit
git commit -m "🎉 Initial commit: 670+ B2B lead generation resources

- Added 670+ agency/tool entries organized by category
- Created category READMEs for easy navigation  
- Set up GitHub Actions for automated syncing
- Added contribution guidelines and MIT license
- Generated SEO-optimized markdown files

Categories included:
- Full-Service Agencies (113 entries)
- DIY Tools & Platforms (115 entries)
- Appointment Setting (111 entries)
- LinkedIn-Specific Agencies (111 entries)
- Email Outreach Services (110 entries)
- SaaS/Software Agencies (110 entries)"

# Push to GitHub
git push -u origin main
```

## ⚙️ Configuration

### GitHub Actions Setup

The `.github/workflows/sync-directory.yml` file is already configured. It will:

- Run daily at 2 AM UTC
- Process files in batches of 50
- Add 2-second delays between batches
- Handle rate limiting automatically

### Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click "I understand my workflows, go ahead and enable them"
4. The workflow will run automatically on schedule

### Manual Trigger

To run the sync manually:

1. Go to **Actions** tab
2. Click **Sync Directory Data**
3. Click **Run workflow**
4. Select sync type (full or incremental)
5. Click **Run workflow**

## 📊 Rate Limiting Strategy

GitHub has rate limits to prevent abuse. Our strategy:

### For GitHub Actions (Recommended)

```yaml
# Already configured in .github/workflows/sync-directory.yml
BATCH_SIZE: 50      # 50 files per commit
DELAY_MS: 2000      # 2 seconds between batches
```

### For Local Syncing

```bash
# Use the sync script with custom batch size
node sync-to-github.js --batch-size=30 --delay=3000
```

### GitHub API Limits

- **Authenticated**: 5,000 requests per hour
- **Unauthenticated**: 60 requests per hour
- **GitHub Actions**: Higher limits for GITHUB_TOKEN

Our batching ensures we stay well under these limits.

## 🎨 Making It Look Legitimate

### 1. Professional README

The main README includes:

- Clear description of the project
- Table of contents
- Category breakdown
- Top rated providers
- Usage instructions
- Contributing guidelines
- License information

### 2. Consistent Formatting

All entries follow the same structure:

- SEO-optimized titles
- Overview section
- Key details (pricing, turnaround)
- Backlink to full profile
- Consistent formatting

### 3. Regular Updates

- Automated daily syncs
- Timestamp showing last update
- Clear maintenance schedule
- Version history in commits

### 4. Community Features

- CONTRIBUTING.md for guidelines
- Issue templates for suggestions
- Clear license (MIT)
- Contact information

## 🔗 SEO Benefits

### Backlink Structure

Each entry links back to your website:

```markdown
👉 **[View Complete Agency Name Profile on B2B Lead Gen Directory](https://b2bleadgen.co/agencies/slug)**
```

This creates:
- 670+ high-quality backlinks
- Varied anchor text
- Contextual relevance
- Dofollow links from GitHub

### GitHub SEO Factors

- **Domain Authority**: GitHub has DA 95+
- **Indexation**: GitHub pages are indexed quickly
- **Freshness**: Regular commits signal fresh content
- **Organization**: Well-structured categories

## 🔄 Maintenance Workflow

### Daily (Automated)

1. GitHub Actions runs at 2 AM UTC
2. Fetches latest data
3. Generates new markdown files
4. Commits in batches
5. Pushes to repository

### Weekly (Manual Check)

```bash
# Pull latest changes
git pull origin main

# Check for any issues
npm run generate

# Review changes
git diff --stat
```

### Monthly (Review)

- Review category structure
- Check for broken links
- Update descriptions if needed
- Analyze traffic/engagement

## 🛡️ Avoiding "Link Farm" Detection

### Do's ✅

- Provide valuable, unique content
- Organize logically by category
- Update regularly
- Encourage community contributions
- Include detailed descriptions
- Follow GitHub's Terms of Service

### Don'ts ❌

- Create duplicate content
- Use spammy anchor text
- Mass-upload without organization
- Ignore community feedback
- Violate GitHub's ToS

## 📈 Expected Results

### Short Term (1-3 months)

- Repository indexed by Google
- Initial backlinks recognized
- Some referral traffic

### Medium Term (3-6 months)

- Improved domain authority
- Higher search rankings
- Steady referral traffic
- Community contributions

### Long Term (6+ months)

- Significant SEO boost
- Established as resource hub
- Potential for featured snippets
- Industry recognition

## 🆘 Troubleshooting

### Issue: "Repository not found"

```bash
# Check remote URL
git remote -v

# Fix if needed
git remote set-url origin https://github.com/talhaXdev/awesome-b2b-lead-generation.git
```

### Issue: "Permission denied"

```bash
# Use HTTPS with token or SSH
git remote set-url origin https://USERNAME:TOKEN@github.com/talhaXdev/awesome-b2b-lead-generation.git
```

### Issue: "Rate limit exceeded"

```bash
# Reduce batch size
node sync-to-github.js --batch-size=25 --delay=5000
```

### Issue: "Workflow not running"

1. Check Actions tab is enabled
2. Verify workflow file syntax
3. Check repository settings

## 📞 Support

- GitHub Issues: [Report problems](https://github.com/talhaXdev/awesome-b2b-lead-generation/issues)
- Website: [b2bleadgen.co](https://b2bleadgen.co)

---

**Next Steps**: After setup, your repository will start generating backlinks automatically. Monitor performance through Google Search Console and GitHub Insights!
