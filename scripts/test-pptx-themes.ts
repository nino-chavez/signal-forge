/**
 * Test script: Generate PPTX decks directly from markdown using the engine.
 * Bypasses AI pipeline — feeds markdown straight to the theme engine.
 *
 * Usage: npx tsx scripts/test-pptx-themes.ts <input.md>
 */

import { readFileSync, mkdirSync } from 'fs';
import { renderDeckToPptx } from '../src/output/exporters/pptx-engine.js';
import { listThemes } from '../src/content/design-system/theme-registry.js';
import { registerBuiltInPresets } from '../src/presets/index.js';

registerBuiltInPresets();

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npx tsx scripts/test-pptx-themes.ts <input.md>');
  process.exit(1);
}

const content = readFileSync(inputPath, 'utf-8');
const outputDir = 'output/theme-tests';
mkdirSync(outputDir, { recursive: true });

const themes = listThemes();

async function main() {
  for (const theme of themes) {
    const outputPath = `${outputDir}/test-${theme.id}.pptx`;
    console.log(`Generating ${theme.id} → ${outputPath}`);
    await renderDeckToPptx({
      content,
      title: 'Theme Test',
      outputPath,
      themeId: theme.id,
      author: 'Signal Forge',
    });
    console.log(`  Done`);
  }
  console.log('\nAll decks generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
