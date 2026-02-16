/**
 * GitHub Sync Script with Rate Limiting
 * 
 * This script handles the git add, commit, and push operations
 * with built-in rate limiting to avoid GitHub API restrictions.
 * 
 * Usage: node sync-to-github.js [--batch-size=50] [--delay=2000]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  batchSize: parseInt(process.argv.find(arg => arg.startsWith('--batch-size='))?.split('=')[1]) || 50,
  delayMs: parseInt(process.argv.find(arg => arg.startsWith('--delay='))?.split('=')[1]) || 2000,
  maxRetries: 3,
  contentDir: './content'
};

console.log('🚀 GitHub Sync Script');
console.log('=====================');
console.log(`Batch size: ${CONFIG.batchSize}`);
console.log(`Delay: ${CONFIG.delayMs}ms`);
console.log('');

// Check if we're in a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Not a git repository. Please run this from the repo root.');
  process.exit(1);
}

// Check git status
console.log('📊 Checking git status...');
const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });

if (!statusOutput.trim()) {
  console.log('✅ No changes to sync. Repository is up to date.');
  process.exit(0);
}

const changedFiles = statusOutput
  .split('\n')
  .filter(line => line.trim())
  .map(line => line.substring(3)); // Remove status prefix

console.log(`Found ${changedFiles.length} changed files`);
console.log('');

// Configure git user if not set
try {
  execSync('git config user.name', { stdio: 'ignore' });
} catch {
  console.log('🔧 Configuring git user...');
  execSync('git config user.email "action@github.com"');
  execSync('git config user.name "GitHub Action"');
}

// Split files into batches
const batches = [];
for (let i = 0; i < changedFiles.length; i += CONFIG.batchSize) {
  batches.push(changedFiles.slice(i, i + CONFIG.batchSize));
}

console.log(`📦 Split into ${batches.length} batches`);
console.log('');

// Process each batch
async function processBatches() {
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNum = i + 1;
    
    console.log(`\n📤 Processing batch ${batchNum}/${batches.length} (${batch.length} files)...`);
    
    // Add files
    for (const file of batch) {
      try {
        execSync(`git add "${file}"`, { stdio: 'ignore' });
        console.log(`  + ${file}`);
      } catch (error) {
        console.error(`  ✗ Failed to add: ${file}`);
      }
    }
    
    // Commit
    const commitMessage = `📚 Update directory entries - Batch ${batchNum}/${batches.length} (${new Date().toISOString().split('T')[0]})`;
    
    try {
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });
      console.log(`  ✅ Committed: ${commitMessage}`);
    } catch (error) {
      console.log(`  ℹ️  No changes to commit in this batch`);
    }
    
    // Delay between batches (except for the last one)
    if (i < batches.length - 1) {
      console.log(`  ⏱️  Waiting ${CONFIG.delayMs}ms before next batch...`);
      await sleep(CONFIG.delayMs);
    }
  }
}

// Push changes
async function pushChanges() {
  console.log('\n📤 Pushing to GitHub...');
  
  let retries = 0;
  while (retries < CONFIG.maxRetries) {
    try {
      execSync('git push', { stdio: 'inherit' });
      console.log('✅ Successfully pushed to GitHub!');
      return;
    } catch (error) {
      retries++;
      console.error(`❌ Push failed (attempt ${retries}/${CONFIG.maxRetries})`);
      
      if (retries < CONFIG.maxRetries) {
        const backoffDelay = CONFIG.delayMs * retries;
        console.log(`⏱️  Retrying in ${backoffDelay}ms...`);
        await sleep(backoffDelay);
      }
    }
  }
  
  console.error('❌ Failed to push after maximum retries');
  process.exit(1);
}

// Utility: Sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the sync
(async () => {
  try {
    await processBatches();
    await pushChanges();
    
    console.log('\n✨ Sync complete!');
    console.log(`📊 Total files processed: ${changedFiles.length}`);
    console.log(`📦 Total batches: ${batches.length}`);
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
})();
