import puppeteer from 'puppeteer';
import { marked } from 'marked';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { loadConfig } from '../../core/config.js';

export interface PDFExportOptions {
  title: string;
  content: string;
  outputPath: string;
  author?: string;
}

/**
 * Export content to PDF
 * Uses Puppeteer to render HTML and convert to PDF
 */
export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const config = loadConfig();
  const { title, content, outputPath, author = config.author } = options;
  
  // Convert markdown to HTML
  const htmlContent = await marked(content);
  
  // Create full HTML document
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1 {
      font-size: 2.5em;
      margin-bottom: 0.5em;
      color: #1a1a1a;
      border-bottom: 3px solid #333;
      padding-bottom: 0.3em;
    }
    h2 {
      font-size: 1.8em;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: #2a2a2a;
    }
    h3 {
      font-size: 1.4em;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
      color: #3a3a3a;
    }
    p {
      margin-bottom: 1em;
    }
    ul, ol {
      margin-bottom: 1em;
      padding-left: 2em;
    }
    li {
      margin-bottom: 0.5em;
    }
    strong {
      font-weight: 600;
      color: #1a1a1a;
    }
    em {
      font-style: italic;
    }
    blockquote {
      border-left: 4px solid #ccc;
      padding-left: 1em;
      margin-left: 0;
      color: #666;
      font-style: italic;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #f4f4f4;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div style="color: #666; margin-bottom: 2em; font-size: 0.9em;">
    Author: ${author} | Generated: ${new Date().toLocaleDateString()}
  </div>
  ${htmlContent}
</body>
</html>
  `;
  
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}

