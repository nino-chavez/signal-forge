/**
 * Document Reader Tool
 *
 * Reads and searches local documents (markdown, text, meeting notes).
 * Provides structured document results for research context.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, extname, join } from 'path';
import type { AgentTool, DocumentResult, ToolParams, ToolResult } from '../core/types/index.js';

// =============================================================================
// Document Reader Configuration
// =============================================================================

export interface DocumentReaderConfig {
  basePath?: string;
  extensions?: string[];
  maxFileSize?: number; // in bytes
  maxResults?: number;
}

const DEFAULT_EXTENSIONS = ['.md', '.txt', '.markdown', '.mdx'];
const DEFAULT_MAX_FILE_SIZE = 100 * 1024; // 100KB
const DEFAULT_MAX_RESULTS = 10;

// =============================================================================
// Document Reader Tool Implementation
// =============================================================================

export class DocumentReaderTool implements AgentTool {
  readonly name = 'documentReader';
  readonly description = 'Read and search local documents for relevant context';

  private readonly basePath: string;
  private readonly extensions: string[];
  private readonly maxFileSize: number;
  private readonly maxResults: number;

  constructor(config?: DocumentReaderConfig) {
    this.basePath = config?.basePath ?? process.cwd();
    this.extensions = config?.extensions ?? DEFAULT_EXTENSIONS;
    this.maxFileSize = config?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
    this.maxResults = config?.maxResults ?? DEFAULT_MAX_RESULTS;
  }

  /**
   * Execute document search
   */
  async execute(params: ToolParams): Promise<ToolResult> {
    const path = (params.path as string) ?? '';
    const patterns = (params.patterns as string[]) ?? [];
    const maxResults = (params.maxResults as number) ?? this.maxResults;

    try {
      const searchPath = join(this.basePath, path);

      if (!existsSync(searchPath)) {
        return {
          success: false,
          error: `Path not found: ${searchPath}`,
        };
      }

      const documents = await this.searchDocuments(searchPath, patterns, maxResults);

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Search documents in a directory
   */
  private async searchDocuments(
    dirPath: string,
    patterns: string[],
    maxResults: number
  ): Promise<DocumentResult[]> {
    const results: DocumentResult[] = [];
    const files = this.findFiles(dirPath);

    for (const file of files) {
      if (results.length >= maxResults) break;

      try {
        const document = this.readDocument(file);
        if (document) {
          // Calculate relevance if patterns provided
          if (patterns.length > 0) {
            document.relevance = this.calculateRelevance(document.content, patterns);
          }
          results.push(document);
        }
      } catch {
        // Skip files that can't be read
      }
    }

    // Sort by relevance if patterns were provided
    if (patterns.length > 0) {
      results.sort((a, b) => b.relevance - a.relevance);
    }

    return results.slice(0, maxResults);
  }

  /**
   * Recursively find all matching files
   */
  private findFiles(dirPath: string, files: string[] = []): string[] {
    try {
      const entries = readdirSync(dirPath);

      for (const entry of entries) {
        // Skip hidden files and node_modules
        if (entry.startsWith('.') || entry === 'node_modules') continue;

        const fullPath = join(dirPath, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          this.findFiles(fullPath, files);
        } else if (stat.isFile()) {
          const ext = extname(entry).toLowerCase();
          if (this.extensions.includes(ext) && stat.size <= this.maxFileSize) {
            files.push(fullPath);
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }

    return files;
  }

  /**
   * Read a document and extract metadata
   */
  private readDocument(filePath: string): DocumentResult | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const title = this.extractTitle(content, filePath);
      const type = this.detectDocumentType(content, filePath);

      return {
        path: filePath,
        title,
        content: this.truncateContent(content),
        type,
        relevance: 0,
      };
    } catch {
      return null;
    }
  }

  /**
   * Extract title from document
   */
  private extractTitle(content: string, filePath: string): string {
    // Try to extract from H1 header
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1].trim();
    }

    // Try to extract from frontmatter
    const frontmatterMatch = content.match(/^---\n[\s\S]*?title:\s*["']?(.+?)["']?\n[\s\S]*?---/);
    if (frontmatterMatch) {
      return frontmatterMatch[1].trim();
    }

    // Fall back to filename
    return basename(filePath, extname(filePath))
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /**
   * Detect document type based on content and path
   */
  private detectDocumentType(
    content: string,
    filePath: string
  ): 'meeting-notes' | 'reference' | 'previous-content' | 'template' {
    const lowerPath = filePath.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Meeting notes detection
    if (
      lowerPath.includes('meeting') ||
      lowerPath.includes('notes') ||
      lowerPath.includes('recap') ||
      lowerContent.includes('attendees') ||
      lowerContent.includes('action items') ||
      lowerContent.includes('meeting date')
    ) {
      return 'meeting-notes';
    }

    // Template detection
    if (
      lowerPath.includes('template') ||
      lowerContent.includes('{{') ||
      lowerContent.includes('${')
    ) {
      return 'template';
    }

    // Previous content detection
    if (
      lowerPath.includes('content/') ||
      lowerPath.includes('posts/') ||
      lowerPath.includes('articles/')
    ) {
      return 'previous-content';
    }

    // Default to reference
    return 'reference';
  }

  /**
   * Truncate content for storage
   */
  private truncateContent(content: string, maxLength: number = 5000): string {
    if (content.length <= maxLength) return content;

    // Try to truncate at a paragraph break
    const truncated = content.substring(0, maxLength);
    const lastParagraph = truncated.lastIndexOf('\n\n');

    if (lastParagraph > maxLength * 0.8) {
      return truncated.substring(0, lastParagraph) + '\n\n[... truncated]';
    }

    return truncated + '\n\n[... truncated]';
  }

  /**
   * Calculate relevance score based on pattern matches
   */
  private calculateRelevance(content: string, patterns: string[]): number {
    const lowerContent = content.toLowerCase();
    let matchCount = 0;
    let totalWeight = 0;

    for (const pattern of patterns) {
      const lowerPattern = pattern.toLowerCase();
      const patternWords = lowerPattern.split(/\s+/);

      // Check for exact phrase match (higher weight)
      if (lowerContent.includes(lowerPattern)) {
        matchCount += 2;
      }

      // Check for individual word matches
      for (const word of patternWords) {
        if (word.length > 2 && lowerContent.includes(word)) {
          matchCount += 1;
        }
        totalWeight += 1;
      }

      totalWeight += 2; // For phrase match weight
    }

    return totalWeight > 0 ? Math.min(1, matchCount / totalWeight) : 0;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createDocumentReaderTool(config?: DocumentReaderConfig): DocumentReaderTool {
  return new DocumentReaderTool(config);
}

// =============================================================================
// Convenience Functions
// =============================================================================

/**
 * Read a single file
 */
export function readDocument(filePath: string): DocumentResult | null {
  const tool = new DocumentReaderTool();
  try {
    const content = readFileSync(filePath, 'utf-8');
    return {
      path: filePath,
      title: basename(filePath, extname(filePath)),
      content,
      type: 'reference',
      relevance: 1,
    };
  } catch {
    return null;
  }
}

/**
 * Search documents with patterns
 */
export async function searchDocuments(
  path: string,
  patterns: string[],
  config?: DocumentReaderConfig
): Promise<DocumentResult[]> {
  const tool = new DocumentReaderTool(config);
  const result = await tool.execute({ path, patterns });

  if (result.success && result.data) {
    return result.data as DocumentResult[];
  }

  return [];
}
