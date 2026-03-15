#!/usr/bin/env tsx
/**
 * Migration script to move decks content to signal-forge
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const decksRoot = path.resolve(projectRoot, '../../decks');

async function migrate() {
  console.log('🔄 Migrating decks content to signal-forge...\n');

  try {
    // Migrate refs directory
    const refsSource = path.join(decksRoot, 'refs');
    const refsDest = path.join(projectRoot, 'refs');

    if (await fs.pathExists(refsSource)) {
      console.log('📁 Copying refs/ directory...');
      await fs.copy(refsSource, refsDest, { overwrite: false });
      console.log('✅ Copied refs/ directory\n');
    } else {
      console.log('⚠️  refs/ directory not found, skipping...\n');
    }

    // Migrate sig-feedo files
    const examplesDest = path.join(projectRoot, 'refs', 'examples');
    await fs.ensureDir(examplesDest);

    const sigFiles = ['sig-feedo.tsx', 'sig-feedo.html', 'sig-feedo-v2.html'];
    
    for (const file of sigFiles) {
      const sourcePath = path.join(decksRoot, file);
      const destPath = path.join(examplesDest, file);
      
      if (await fs.pathExists(sourcePath)) {
        console.log(`📄 Copying ${file}...`);
        await fs.copy(sourcePath, destPath);
      }
    }

    console.log('✅ Migration complete!\n');
    console.log('📦 Migrated content:');
    console.log('   - refs/ → signal-forge/refs/');
    console.log('   - sig-feedo.* → signal-forge/refs/examples/\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

