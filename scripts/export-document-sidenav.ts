#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'fs';
import { marked } from 'marked';
import { basename } from 'path';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  text: string;
  anchor: string;
  level: number;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function extractNavigation(content: string): NavSection[] {
  const lines = content.split('\n');
  const sections: NavSection[] = [];
  let currentSection: NavSection | null = null;

  for (const line of lines) {
    // Match ## headings (H2)
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      const title = h2Match[1].replace(/\*\*/g, '');
      const anchor = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      currentSection = { title, items: [] };
      sections.push(currentSection);
      continue;
    }

    // Match ### headings (H3) - add to current section
    const h3Match = line.match(/^### (.+)$/);
    if (h3Match && currentSection) {
      const text = h3Match[1].replace(/\*\*/g, '');
      const anchor = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      currentSection.items.push({ text, anchor, level: 3 });
    }
  }

  return sections;
}

function generateHTML(title: string, docType: string, content: string, navigation: NavSection[]): string {
  // Configure marked
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false
  });

  const htmlContent = marked.parse(content) as string;

  // Generate sidebar navigation
  const navHtml = navigation.map(section => `
    <div class="nav-section">
      <div class="nav-section-title">${escapeHtml(section.title)}</div>
      ${section.items.map(item => `
        <a href="#${item.anchor}" class="nav-link">${escapeHtml(item.text)}</a>
      `).join('')}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --bg-tertiary: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent-cyan: #22d3ee;
            --accent-orange: #f97316;
            --accent-green: #22c55e;
            --accent-purple: #a855f7;
            --accent-blue: #3b82f6;
            --border-color: #334155;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
        }

        .layout {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            width: 280px;
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            padding: 24px 0;
        }

        .sidebar-header {
            padding: 0 24px 24px;
            border-bottom: 1px solid var(--border-color);
        }

        .sidebar-header h1 {
            font-size: 15px;
            font-weight: 600;
            color: var(--accent-cyan);
            margin-bottom: 4px;
        }

        .sidebar-header .doc-type {
            font-size: 11px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .nav-section {
            padding: 16px 0;
            border-bottom: 1px solid var(--border-color);
        }

        .nav-section-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 0 24px 8px;
        }

        .nav-link {
            display: block;
            padding: 8px 24px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 13px;
            transition: all 0.15s ease;
        }

        .nav-link:hover {
            color: var(--text-primary);
            background: rgba(34, 211, 238, 0.05);
        }

        .nav-link.active {
            color: var(--accent-cyan);
            background: rgba(34, 211, 238, 0.1);
            border-right: 2px solid var(--accent-cyan);
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 280px;
            padding: 48px 64px 96px;
            max-width: 1200px;
        }

        .doc-header {
            margin-bottom: 48px;
            padding-bottom: 32px;
            border-bottom: 1px solid var(--border-color);
        }

        .classification {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(168, 85, 247, 0.1);
            color: var(--accent-purple);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
        }

        .doc-header h1 {
            font-size: 36px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 12px;
        }

        .doc-subtitle {
            font-size: 18px;
            color: var(--text-secondary);
            margin-bottom: 24px;
        }

        .doc-meta {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
        }

        .meta-item {
            font-size: 13px;
            color: var(--text-muted);
        }

        .meta-item strong {
            color: var(--text-secondary);
        }

        /* Typography */
        h2 {
            font-size: 24px;
            font-weight: 600;
            color: var(--accent-cyan);
            margin: 48px 0 24px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
        }

        h2:first-child {
            margin-top: 0;
        }

        h3 {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 32px 0 16px;
        }

        h4 {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-secondary);
            margin: 24px 0 12px;
        }

        h5 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-muted);
            margin: 20px 0 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        p {
            margin-bottom: 16px;
            color: var(--text-secondary);
            line-height: 1.7;
        }

        strong {
            color: var(--text-primary);
            font-weight: 600;
        }

        em {
            color: var(--accent-cyan);
            font-style: italic;
        }

        /* Lists */
        ul, ol {
            margin: 16px 0 16px 24px;
            color: var(--text-secondary);
        }

        li {
            margin: 8px 0;
            line-height: 1.6;
        }

        li::marker {
            color: var(--accent-cyan);
        }

        /* Code Blocks */
        pre {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
            margin: 20px 0;
        }

        code {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 13px;
            color: var(--text-primary);
        }

        pre code {
            display: block;
            line-height: 1.5;
        }

        p code, li code, td code {
            background: var(--bg-tertiary);
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 12px;
            color: var(--accent-cyan);
            border: 1px solid var(--border-color);
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background: var(--bg-secondary);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--border-color);
        }

        thead {
            background: var(--bg-tertiary);
        }

        th {
            padding: 12px 16px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            color: var(--accent-cyan);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--border-color);
        }

        td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 14px;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover {
            background: rgba(34, 211, 238, 0.03);
        }

        /* Blockquotes */
        blockquote {
            border-left: 3px solid var(--accent-cyan);
            padding: 16px 24px;
            margin: 24px 0;
            background: var(--bg-secondary);
            border-radius: 0 8px 8px 0;
            color: var(--text-secondary);
            font-style: italic;
        }

        blockquote p:last-child {
            margin-bottom: 0;
        }

        /* Images */
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            margin: 24px 0;
        }

        /* Horizontal Rules */
        hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 48px 0;
        }

        /* Links */
        a {
            color: var(--accent-cyan);
            text-decoration: none;
            transition: color 0.15s ease;
        }

        a:hover {
            color: var(--accent-blue);
            text-decoration: underline;
        }

        /* Checkboxes (for task lists) */
        input[type="checkbox"] {
            margin-right: 8px;
            accent-color: var(--accent-cyan);
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--bg-tertiary);
            border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--border-color);
        }

        /* Active nav highlighting on scroll */
        @media (max-width: 1024px) {
            .sidebar {
                width: 240px;
            }

            .main-content {
                margin-left: 240px;
                padding: 32px 40px;
            }
        }

        @media (max-width: 768px) {
            .layout {
                flex-direction: column;
            }

            .sidebar {
                position: relative;
                width: 100%;
                height: auto;
                border-right: none;
                border-bottom: 1px solid var(--border-color);
            }

            .main-content {
                margin-left: 0;
                padding: 24px;
            }
        }

        /* Print styles */
        @media print {
            .sidebar {
                display: none;
            }

            .main-content {
                margin-left: 0;
                max-width: 100%;
            }

            body {
                background: white;
                color: black;
            }

            h2 {
                color: #1e293b;
                border-top-color: #cbd5e1;
            }

            h3, h4 {
                color: #334155;
            }

            pre, code {
                background: #f1f5f9;
                color: #1e293b;
            }

            table {
                border-color: #cbd5e1;
            }

            th {
                background: #f1f5f9;
                color: #1e293b;
            }
        }
    </style>
</head>
<body>
    <div class="layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>${escapeHtml(title)}</h1>
                <div class="doc-type">${escapeHtml(docType)}</div>
            </div>

            ${navHtml}
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            ${htmlContent}
        </main>
    </div>

    <script>
        // Highlight active nav item on scroll
        const navLinks = document.querySelectorAll('.nav-link');
        const headings = document.querySelectorAll('h2, h3');

        function updateActiveNav() {
            let current = '';

            headings.forEach(heading => {
                const sectionTop = heading.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = heading.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();

        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>`;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: export-document-sidenav.ts <input.md> <output.html> [docType]');
    console.error('Example: export-document-sidenav.ts handoff.md handoff.html "Technical Handoff"');
    process.exit(1);
  }

  const [inputPath, outputPath, docType = 'Technical Documentation'] = args;

  try {
    console.log(`📄 Reading: ${inputPath}`);
    const content = readFileSync(inputPath, 'utf-8');

    // Extract title from first H1 or use filename
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : basename(inputPath, '.md');

    console.log('🔍 Extracting navigation...');
    const navigation = extractNavigation(content);

    console.log('🎨 Generating HTML with sidebar...');
    const html = generateHTML(title, docType, content, navigation);

    console.log(`💾 Writing: ${outputPath}`);
    writeFileSync(outputPath, html, 'utf-8');

    console.log('\n✅ Done! Open', outputPath, 'in a browser.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
