#!/usr/bin/env tsx
/**
 * Export Document Script
 *
 * Converts standard markdown documents to HTML with professional styling
 */

import { readFileSync, writeFileSync } from 'fs';
import { marked } from 'marked';
import path from 'path';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateHTML(title: string, content: string): string {
  // Configure marked for better table rendering
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false
  });

  const htmlContent = marked.parse(content) as string;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>

  <style>
    :root {
      --color-brand-violet: #7c3aed;
      --color-brand-navy: #1a365d;
      --color-text-primary: #171717;
      --color-text-secondary: #404040;
      --color-text-body: #525252;
      --color-bg-primary: #ffffff;
      --color-bg-secondary: #f5f5f5;
      --color-bg-dark: #111827;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--color-bg-secondary);
      color: var(--color-text-body);
      line-height: 1.7;
      font-size: 16px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 60px 40px;
    }

    .document {
      background: var(--color-bg-primary);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      padding: 60px;
    }

    /* Headings */
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-brand-violet);
      margin-bottom: 32px;
      line-height: 1.2;
    }

    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-brand-violet);
      margin-top: 48px;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 3px solid var(--color-brand-violet);
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-top: 32px;
      margin-bottom: 16px;
    }

    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      margin-top: 24px;
      margin-bottom: 12px;
    }

    /* Paragraphs and text */
    p {
      margin-bottom: 16px;
      line-height: 1.7;
    }

    strong {
      color: var(--color-text-primary);
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    /* Lists */
    ul, ol {
      margin: 16px 0;
      padding-left: 32px;
    }

    li {
      margin-bottom: 8px;
      line-height: 1.7;
    }

    ul ul, ol ol, ul ol, ol ul {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 0.9rem;
      background: white;
    }

    thead {
      background: var(--color-bg-secondary);
    }

    th {
      padding: 12px 16px;
      font-weight: 600;
      border-bottom: 2px solid var(--color-brand-violet);
      color: var(--color-text-primary);
      text-align: left;
    }

    td {
      padding: 10px 16px;
      border-bottom: 1px solid #e5e5e5;
      vertical-align: top;
    }

    tbody tr:hover {
      background: #fafafa;
    }

    /* Code */
    code {
      background: var(--color-bg-secondary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
      color: var(--color-brand-violet);
    }

    pre {
      background: var(--color-bg-dark);
      color: #e5e5e5;
      padding: 20px 24px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 24px 0;
      font-size: 0.85rem;
      line-height: 1.6;
    }

    pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }

    /* Blockquotes */
    blockquote {
      border-left: 4px solid var(--color-brand-violet);
      padding-left: 20px;
      margin: 24px 0;
      color: var(--color-text-secondary);
      font-style: italic;
    }

    /* Horizontal rules */
    hr {
      border: none;
      border-top: 2px solid #e5e5e5;
      margin: 40px 0;
    }

    /* Links */
    a {
      color: var(--color-brand-violet);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    a:hover {
      border-bottom-color: var(--color-brand-violet);
    }

    /* Checkboxes */
    input[type="checkbox"] {
      margin-right: 8px;
    }

    /* Print styles */
    @media print {
      body {
        background: white;
        font-size: 11pt;
      }

      .container {
        max-width: 100%;
        padding: 0;
      }

      .document {
        box-shadow: none;
        padding: 0;
      }

      h1 {
        font-size: 24pt;
        page-break-after: avoid;
      }

      h2 {
        font-size: 18pt;
        page-break-after: avoid;
        margin-top: 24pt;
      }

      h3 {
        font-size: 14pt;
        page-break-after: avoid;
        margin-top: 16pt;
      }

      table {
        page-break-inside: avoid;
        font-size: 9pt;
      }

      thead {
        display: table-header-group;
      }

      tr {
        page-break-inside: avoid;
      }

      pre {
        page-break-inside: avoid;
        background: #f5f5f5 !important;
        color: #1e1e1e !important;
        border: 1pt solid #d4d4d4;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      a[href^="http"]:after {
        content: " (" attr(href) ")";
        font-size: 8pt;
        color: #666;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="document">
      ${htmlContent}
    </div>
  </div>
</body>
</html>`;
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npx tsx scripts/export-document.ts <input.md> [output.html]');
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1] || inputPath.replace(/\.md$/, '.html');

console.log(`📄 Reading: ${inputPath}`);
const markdown = readFileSync(inputPath, 'utf-8');

// Extract title from first H1
const titleMatch = markdown.match(/^# (.+)$/m);
const title = titleMatch ? titleMatch[1] : 'Document';

console.log(`🎨 Generating HTML...`);
const html = generateHTML(title, markdown);

console.log(`💾 Writing: ${outputPath}`);
writeFileSync(outputPath, html);

console.log(`\n✅ Done! Open ${outputPath} in a browser.`);
