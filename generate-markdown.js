/**
 * B2B Lead Generation Directory - GitHub Wrapper Generator
 * 
 * This script extracts agency data from the frontend data.ts file
 * and generates SEO-optimized markdown files organized by category.
 * 
 * Usage: node generate-markdown.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DATA_FILE = '/root/directories/directories/b2b lead gen directory/frontend/lib/data.ts';
const OUTPUT_DIR = './content';
const WEBSITE_BASE_URL = 'https://b2bleadgen.co';
const REPO_NAME = 'awesome-b2b-lead-generation';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read the data file
console.log('Reading agency data...');
const dataContent = fs.readFileSync(SOURCE_DATA_FILE, 'utf8');

// Extract agencies using regex
const agencyPattern = /\{\s*id:\s*"(\d+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?website:\s*"([^"]+)",[\s\S]*?description:\s*"([^"]+)",[\s\S]*?listingType:\s*"([^"]+)",[\s\S]*?category:\s*"([^"]+)",[\s\S]*?costPerLeadLow:\s*(\d+),[\s\S]*?costPerLeadHigh:\s*(\d+),[\s\S]*?turnaroundWeeksMin:\s*(\d+),[\s\S]*?turnaroundWeeksMax:\s*(\d+),[\s\S]*?rating:\s*([\d.]+),/g;

const agencies = [];
let match;

while ((match = agencyPattern.exec(dataContent)) !== null) {
  agencies.push({
    id: match[1],
    slug: match[2],
    name: match[3],
    website: match[4],
    description: match[5].replace(/\s+/g, ' ').trim(),
    listingType: match[6],
    category: match[7],
    costPerLeadLow: parseInt(match[8]),
    costPerLeadHigh: parseInt(match[9]),
    turnaroundWeeksMin: parseInt(match[10]),
    turnaroundWeeksMax: parseInt(match[11]),
    rating: parseFloat(match[12])
  });
}

console.log(`Found ${agencies.length} agencies`);

// Category mapping for better names
const categoryNames = {
  'full-service-agencies': 'Full-Service Agencies',
  'email-outreach': 'Email Outreach Services',
  'appointment-setting': 'Appointment Setting',
  'linkedin-agencies': 'LinkedIn-Specific Agencies',
  'saas-agencies': 'SaaS/Software Agencies',
  'diy-tools': 'DIY Tools & Platforms'
};

// Group agencies by category
const agenciesByCategory = {};
agencies.forEach(agency => {
  if (!agenciesByCategory[agency.category]) {
    agenciesByCategory[agency.category] = [];
  }
  agenciesByCategory[agency.category].push(agency);
});

console.log(`Organized into ${Object.keys(agenciesByCategory).length} categories`);

// Generate individual markdown files for each agency
console.log('\nGenerating individual agency markdown files...');

agencies.forEach((agency, index) => {
  const categoryDir = path.join(OUTPUT_DIR, agency.category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const fileName = `${agency.slug}.md`;
  const filePath = path.join(categoryDir, fileName);

  // Generate SEO-optimized markdown content
  const markdown = generateAgencyMarkdown(agency);
  
  fs.writeFileSync(filePath, markdown);
  
  if ((index + 1) % 100 === 0) {
    console.log(`  Generated ${index + 1} files...`);
  }
});

console.log(`✓ Generated ${agencies.length} agency markdown files`);

// Generate category READMEs
console.log('\nGenerating category README files...');

Object.entries(agenciesByCategory).forEach(([category, categoryAgencies]) => {
  const categoryDir = path.join(OUTPUT_DIR, category);
  const readmePath = path.join(categoryDir, 'README.md');
  
  const categoryName = categoryNames[category] || category;
  
  const categoryReadme = generateCategoryReadme(category, categoryName, categoryAgencies);
  fs.writeFileSync(readmePath, categoryReadme);
  
  console.log(`  ✓ ${categoryName}: ${categoryAgencies.length} agencies`);
});

// Generate main README
console.log('\nGenerating main README...');
const mainReadme = generateMainReadme(agenciesByCategory);
fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), mainReadme);

console.log('\n✅ Generation complete!');
console.log(`\nOutput directory: ${OUTPUT_DIR}`);
console.log(`Total files: ${agencies.length + Object.keys(agenciesByCategory).length + 1}`);

// Helper function to generate agency markdown
function generateAgencyMarkdown(agency) {
  const url = `${WEBSITE_BASE_URL}/agencies/${agency.slug}`;
  const typeLabel = agency.listingType === 'tool' ? 'Software Tool' : 'Service Agency';
  
  return `# ${agency.name}

**${typeLabel}** | ⭐ Rating: ${agency.rating}/5

## Overview

${agency.description}

## Key Details

- **Type**: ${typeLabel}
- **Cost Per Lead**: $${agency.costPerLeadLow} - $${agency.costPerLeadHigh}
- **Turnaround Time**: ${agency.turnaroundWeeksMin} - ${agency.turnaroundWeeksMax} weeks
- **Official Website**: [${agency.website}](${agency.website})

## Why Choose ${agency.name}?

${agency.name} is a trusted ${agency.listingType === 'tool' ? 'solution' : 'provider'} in the B2B lead generation space. With a ${agency.rating}/5 rating and competitive pricing starting at $${agency.costPerLeadLow} per lead, they offer ${agency.listingType === 'tool' ? 'powerful tools' : 'professional services'} for businesses looking to scale their outreach.

## Learn More

For detailed reviews, pricing information, and alternatives, visit the full profile:

👉 **[View Complete ${agency.name} Profile on B2B Lead Gen Directory](${url})**

---

*This entry is part of the [Awesome B2B Lead Generation](${WEBSITE_BASE_URL}) resource collection. Last updated: ${new Date().toISOString().split('T')[0]}*
`;
}

// Helper function to generate category README
function generateCategoryReadme(category, categoryName, categoryAgencies) {
  const categoryUrl = `${WEBSITE_BASE_URL}/category/${category}`;
  
  let agencyList = categoryAgencies
    .sort((a, b) => b.rating - a.rating)
    .map(agency => `- [${agency.name}](./${agency.slug}.md) - ⭐ ${agency.rating}/5 | $${agency.costPerLeadLow}-$${agency.costPerLeadHigh}/lead`)
    .join('\n');

  return `# ${categoryName}

A curated collection of ${categoryAgencies.length} ${categoryName.toLowerCase()} for B2B lead generation.

## 📊 Category Overview

${categoryName} specialize in helping businesses generate qualified B2B leads through various methodologies and approaches.

👉 **[Browse All ${categoryName} on B2B Lead Gen Directory](${categoryUrl})**

## 🏆 Top Rated ${categoryName}

| Agency/Tool | Rating | Cost/Lead | Turnaround |
|-------------|--------|-----------|------------|
${categoryAgencies
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 10)
  .map(a => `| [${a.name}](./${a.slug}.md) | ⭐ ${a.rating} | $${a.costPerLeadLow}-$${a.costPerLeadHigh} | ${a.turnaroundWeeksMin}-${a.turnaroundWeeksMax}w |`)
  .join('\n')}

## 📋 Complete List

${agencyList}

## 🔍 How to Choose

When selecting a ${categoryName.slice(0, -1)}, consider:

1. **Budget**: Cost per lead ranges from $${Math.min(...categoryAgencies.map(a => a.costPerLeadLow))} to $${Math.max(...categoryAgencies.map(a => a.costPerLeadHigh))}
2. **Timeline**: Turnaround varies from ${Math.min(...categoryAgencies.map(a => a.turnaroundWeeksMin))} to ${Math.max(...categoryAgencies.map(a => a.turnaroundWeeksMax))} weeks
3. **Rating**: Look for providers with 4.5+ star ratings

## 📖 Resources

- [Full Directory](${WEBSITE_BASE_URL})
- [Compare Agencies](${WEBSITE_BASE_URL}/compare-agencies)
- [ROI Calculator](${WEBSITE_BASE_URL}/roi-calculator)

---

*Part of the [Awesome B2B Lead Generation](${WEBSITE_BASE_URL}) collection. Maintained by [B2B Lead Gen Directory](${WEBSITE_BASE_URL}).*
`;
}

// Helper function to generate main README
function generateMainReadme(agenciesByCategory) {
  const totalAgencies = Object.values(agenciesByCategory).reduce((sum, arr) => sum + arr.length, 0);
  
  const categoryLinks = Object.entries(agenciesByCategory)
    .map(([category, agencies]) => {
      const categoryName = categoryNames[category] || category;
      return `- **[${categoryName}](./${category}/)** (${agencies.length} entries)`;
    })
    .join('\n');

  const topAgencies = Object.values(agenciesByCategory)
    .flat()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 15)
    .map(a => `- [${a.name}](./${a.category}/${a.slug}.md) - ⭐ ${a.rating}/5`)
    .join('\n');

  return `# Awesome B2B Lead Generation 🎯

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![Website](https://img.shields.io/badge/Website-b2bleadgen.co-blue)](https://b2bleadgen.co)
[![Entries](https://img.shields.io/badge/Entries-${totalAgencies}+-green)]()
[![Last Updated](https://img.shields.io/badge/Last%20Updated-${new Date().toISOString().split('T')[0]}-orange)]()

> A comprehensive, curated collection of **${totalAgencies}+ B2B lead generation agencies and tools** - the largest open database of its kind.

This repository serves as an open resource archive for businesses seeking lead generation solutions. Each entry includes detailed information, pricing data, and direct links to comprehensive reviews.

## 🌐 Official Website

For the complete interactive directory with advanced filtering, comparison tools, and verified reviews:

👉 **[B2B Lead Gen Directory](https://b2bleadgen.co)**

## 📁 Categories

${categoryLinks}

## ⭐ Top Rated Providers

${topAgencies}

## 🔍 What's Inside

This repository contains:

- **${totalAgencies}+ Individual Entries**: Each agency/tool has its own detailed markdown file
- **6 Major Categories**: Organized by service type and methodology  
- **Verified Data**: Cost per lead, turnaround times, and ratings
- **Direct Links**: Every entry links back to comprehensive reviews on our website

## 📊 Coverage Statistics

| Metric | Count |
|--------|-------|
| Total Entries | ${totalAgencies} |
${Object.entries(agenciesByCategory).map(([cat, agencies]) => `| ${categoryNames[cat] || cat} | ${agencies.length} |`).join('\n')}

## 🚀 Quick Start

### Looking for a Lead Generation Agency?

1. Browse by category above
2. Check ratings and pricing
3. Click through to detailed profiles
4. Compare multiple providers

### Popular Searches

- [Full-Service Agencies](./full-service-agencies/)
- [Email Outreach Specialists](./email-outreach/)
- [LinkedIn Automation Tools](./linkedin-agencies/)
- [DIY Lead Gen Platforms](./diy-tools/)

## 📝 How to Use This Repository

Each markdown file follows a consistent format:

\`\`\`markdown
# Agency Name
**Type** | ⭐ Rating: X.X/5

## Overview
Brief description of the service/tool

## Key Details
- Cost Per Lead: $X - $Y
- Turnaround: X - Y weeks
- Website: [link](url)

## Learn More
[View Complete Profile](full-review-url)
\`\`\`

## 🔄 Maintenance & Updates

This repository is automatically synchronized with our main database. Updates occur:

- **Daily**: New entries added
- **Weekly**: Pricing and rating updates
- **Monthly**: Full content refresh

Last sync: ${new Date().toISOString().split('T')[0]}

## 🤝 Contributing

While this is primarily a mirror of our verified database, we welcome:

- Bug reports for incorrect information
- Suggestions for new categories
- Feedback on the organization

Please open an issue for any corrections.

## 📜 License

This database is provided as an open resource for the B2B community. 

Data sourced from [B2B Lead Gen Directory](https://b2bleadgen.co).

## 🔗 Connect With Us

- **Website**: [b2bleadgen.co](https://b2bleadgen.co)
- **Directory**: [Browse All ${totalAgencies}+ Entries](https://b2bleadgen.co/category/all)
- **Compare Tool**: [Side-by-Side Comparison](https://b2bleadgen.co/compare-agencies)

---

<p align="center">
  <i>Maintained with ❤️ by the B2B Lead Gen Directory team</i><br>
  <sub>${totalAgencies}+ verified agencies and tools | Updated daily</sub>
</p>
`;
}
