/**
 * Debug: Show what layouts the parser assigns to each slide.
 *
 * Usage: npx tsx scripts/debug-slide-layouts.ts <input.md>
 */

import { readFileSync } from 'fs';
import { parseDeckFromMarkdownV2 } from '../src/content/templates/slide-model.js';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npx tsx scripts/debug-slide-layouts.ts <input.md>');
  process.exit(1);
}

const content = readFileSync(inputPath, 'utf-8');
const deck = parseDeckFromMarkdownV2(content);

console.log(`Deck: "${deck.title}" — ${deck.slides.length} slides\n`);
deck.slides.forEach((s, i) => {
  const bullets = s.bullets?.length ?? 0;
  const hasTable = s.table ? ` | table: ${s.table.headers.length}cols x ${s.table.rows.length}rows` : '';
  console.log(`  ${String(i + 1).padStart(2)}. [${s.layout.padEnd(18)}] ${s.title.slice(0, 60)}${bullets > 0 ? ` (${bullets} bullets)` : ''}${hasTable}`);
});
