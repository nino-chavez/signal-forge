/**
 * Local File Publisher
 *
 * Publishes content to local files in various formats.
 * Uses existing exporters for PPTX, DOCX, PDF, and HTML.
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import type { OutputFormat, PublicationResult, ContentType } from '../../core/types/index.js';
import type { Publisher, PublishOptions } from '../../pipeline/agents/publication-agent.js';

/**
 * Extract title from markdown content
 * Looks for first H1 heading or returns a fallback
 */
function extractTitleFromContent(content: string, fallbackType?: ContentType): string {
  // Look for first H1 heading (# Title)
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }

  // Look for first line that looks like a title (non-empty, non-heading line at start)
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      // Return first non-empty, non-list, non-heading line as title (truncated)
      return trimmed.slice(0, 100);
    }
  }

  // Fallback to generated title
  const timestamp = new Date().toISOString().split('T')[0];
  const typeLabel = fallbackType ?? 'content';
  return `${typeLabel}-${timestamp}`;
}

// Dynamic imports for exporters (they may not all be available)
type ExportToWord = typeof import('../exporters/word-exporter.js').exportToWord;
type ExportToPDF = typeof import('../exporters/pdf-exporter.js').exportToPDF;
type ExportToPPTX = typeof import('../exporters/pptx-exporter.js').exportToPPTX;
type ExportToHTML = typeof import('../exporters/html-exporter.js').exportToHTML;

// =============================================================================
// Local File Publisher Configuration
// =============================================================================

export interface LocalFilePublisherConfig {
  outputDir?: string;
  createDirs?: boolean;
}

// =============================================================================
// Local File Publisher Implementation
// =============================================================================

export class LocalFilePublisher implements Publisher {
  readonly name = 'local';
  readonly type = 'local' as const;

  private readonly outputDir: string;
  private readonly createDirs: boolean;

  // Lazy-loaded exporters
  private exportToWord?: ExportToWord;
  private exportToPDF?: ExportToPDF;
  private exportToPPTX?: ExportToPPTX;
  private exportToHTML?: ExportToHTML;

  constructor(config?: LocalFilePublisherConfig) {
    this.outputDir = config?.outputDir ?? './output';
    this.createDirs = config?.createDirs ?? true;
  }

  /**
   * Check if publisher is configured
   */
  isConfigured(): boolean {
    return true; // Local file system is always available
  }

  /**
   * Publish content to a local file
   */
  async publish(
    content: string,
    format: OutputFormat,
    options: PublishOptions
  ): Promise<PublicationResult> {
    const outputPath = options.outputPath ?? this.outputDir;
    // Extract title from content if not provided
    const title = options.title ?? extractTitleFromContent(content, options.contentType);
    const filename = this.generateFilename(title, format);
    const fullPath = join(outputPath, filename);

    try {
      // Ensure directory exists
      if (this.createDirs) {
        const dir = dirname(fullPath);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
      }

      // Export based on format
      await this.exportToFormat(content, format, fullPath, title, options);

      return {
        target: { type: 'local', platform: 'local' },
        success: true,
        path: fullPath,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        target: { type: 'local', platform: 'local' },
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Export content to the specified format
   */
  private async exportToFormat(
    content: string,
    format: OutputFormat,
    outputPath: string,
    title: string,
    options: PublishOptions
  ): Promise<void> {
    switch (format) {
      case 'markdown':
        await this.exportMarkdown(content, outputPath, title);
        break;

      case 'html':
        await this.exportHTML(content, outputPath, title, options.contentType);
        break;

      case 'docx':
        await this.exportDOCX(content, outputPath, title);
        break;

      case 'pdf':
        await this.exportPDF(content, outputPath, title);
        break;

      case 'pptx':
        await this.exportPPTX(content, outputPath, title, options.theme);
        break;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export to Markdown
   */
  private async exportMarkdown(
    content: string,
    outputPath: string,
    title: string
  ): Promise<void> {
    const fullContent = `# ${title}\n\n${content}`;
    writeFileSync(outputPath, fullContent, 'utf-8');
  }

  /**
   * Export to HTML
   */
  private async exportHTML(
    content: string,
    outputPath: string,
    title: string,
    contentType?: ContentType
  ): Promise<void> {
    try {
      if (!this.exportToHTML) {
        const module = await import('../exporters/html-exporter.js');
        this.exportToHTML = module.exportToHTML;
      }

      // Map content type to HTML exporter content type
      const htmlContentType = this.mapToHtmlContentType(contentType);

      await this.exportToHTML({
        title,
        content,
        outputPath,
        contentType: htmlContentType,
      });
    } catch (error) {
      // Fallback: simple HTML generation
      const html = this.generateSimpleHTML(content, title);
      writeFileSync(outputPath, html, 'utf-8');
    }
  }

  /**
   * Export to DOCX
   */
  private async exportDOCX(
    content: string,
    outputPath: string,
    title: string
  ): Promise<void> {
    if (!this.exportToWord) {
      const module = await import('../exporters/word-exporter.js');
      this.exportToWord = module.exportToWord;
    }

    await this.exportToWord({
      title,
      content,
      outputPath,
    });
  }

  /**
   * Export to PDF
   */
  private async exportPDF(
    content: string,
    outputPath: string,
    title: string
  ): Promise<void> {
    if (!this.exportToPDF) {
      const module = await import('../exporters/pdf-exporter.js');
      this.exportToPDF = module.exportToPDF;
    }

    await this.exportToPDF({
      title,
      content,
      outputPath,
    });
  }

  /**
   * Export to PPTX
   */
  private async exportPPTX(
    content: string,
    outputPath: string,
    title: string,
    theme?: string,
  ): Promise<void> {
    if (!this.exportToPPTX) {
      const module = await import('../exporters/pptx-exporter.js');
      this.exportToPPTX = module.exportToPPTX;
    }

    await this.exportToPPTX({
      title,
      content,
      outputPath,
      theme,
    });
  }

  /**
   * Generate a simple HTML document as fallback
   */
  private generateSimpleHTML(content: string, title: string): string {
    // Basic markdown to HTML conversion
    let html = content
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/g, '<p>')
      .replace(/$/g, '</p>');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #333;
    }
    h1, h2, h3 { color: #1a1a1a; }
    h1 { border-bottom: 2px solid #333; padding-bottom: 0.3em; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${html}
</body>
</html>`;
  }

  /**
   * Generate a title from content type
   */
  private generateTitle(contentType?: ContentType): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const typeLabel = contentType ?? 'content';
    return `${typeLabel}-${timestamp}`;
  }

  /**
   * Map content type to HTML exporter compatible type
   */
  private mapToHtmlContentType(
    contentType?: ContentType
  ): 'deck' | 'pov' | 'paper' | 'guide' | 'reference' | 'tutorial' {
    if (!contentType) return 'paper';

    // Documentation types
    if (contentType === 'guide') return 'guide';
    if (contentType === 'reference') return 'reference';
    if (contentType === 'tutorial') return 'tutorial';

    // Presentation types
    if (contentType === 'deck' || contentType === 'roadmap' || contentType === 'brief') {
      return 'deck';
    }

    // Thought leadership
    if (contentType === 'pov') return 'pov';

    // Everything else -> paper (architecture, adr, spec, paper, etc.)
    return 'paper';
  }

  /**
   * Generate filename with extension
   */
  private generateFilename(title: string, format: OutputFormat): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const extensions: Record<OutputFormat, string> = {
      markdown: '.md',
      html: '.html',
      docx: '.docx',
      pdf: '.pdf',
      pptx: '.pptx',
      slides: '.pptx',
    };

    return `${slug}${extensions[format] || '.txt'}`;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createLocalFilePublisher(
  config?: LocalFilePublisherConfig
): LocalFilePublisher {
  return new LocalFilePublisher(config);
}
