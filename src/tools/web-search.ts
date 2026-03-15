/**
 * Web Search Tool
 *
 * Uses Perplexity API for web search with real-time results.
 * Parses search results into structured format for research context.
 */

import { PerplexityProvider } from '../providers/perplexity.js';
import type { AgentTool, ToolParams, ToolResult, WebSearchResult } from '../core/types/index.js';

// =============================================================================
// Web Search Tool Configuration
// =============================================================================

export interface WebSearchConfig {
  apiKey?: string;
  maxResults?: number;
  model?: string;
}

// =============================================================================
// Web Search Tool Implementation
// =============================================================================

export class WebSearchTool implements AgentTool {
  readonly name = 'webSearch';
  readonly description = 'Search the web for real-time information using Perplexity';

  private readonly provider: PerplexityProvider;
  private readonly maxResults: number;
  private readonly model: string;

  constructor(config?: WebSearchConfig) {
    this.provider = new PerplexityProvider(config?.apiKey);
    this.maxResults = config?.maxResults ?? 5;
    this.model = config?.model ?? 'llama-3.1-sonar-large-128k-online';
  }

  /**
   * Execute web search
   */
  async execute(params: ToolParams): Promise<ToolResult> {
    const query = params.query as string;
    if (!query) {
      return {
        success: false,
        error: 'Query parameter is required',
      };
    }

    if (!this.provider.isConfigured()) {
      return {
        success: false,
        error: 'Perplexity API key not configured',
      };
    }

    try {
      const results = await this.search(query);
      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Perform the actual search
   */
  private async search(query: string): Promise<WebSearchResult[]> {
    const prompt = `Search for: ${query}

Provide ${this.maxResults} relevant results. For each result, provide:
1. Title
2. URL (if available, otherwise use source name)
3. A brief snippet/summary (2-3 sentences)
4. Source name

Format your response as a JSON array:
[
  {
    "title": "Result title",
    "url": "https://example.com/article",
    "snippet": "Brief summary of the content...",
    "source": "Source Name"
  }
]`;

    const result = await this.provider.generate({
      prompt,
      systemInstruction: `You are a web search assistant. Return search results in valid JSON format only. Include real, recent sources when possible. Focus on authoritative sources.`,
      temperature: 0.3,
      maxTokens: 2000,
      model: this.model,
    });

    return this.parseResults(result.content, query);
  }

  /**
   * Parse Perplexity response into structured results
   */
  private parseResults(content: string, query: string): WebSearchResult[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{
          title: string;
          url: string;
          snippet: string;
          source: string;
        }>;

        return parsed.map((item, index) => ({
          title: item.title || `Result ${index + 1}`,
          url: item.url || `#result-${index}`,
          snippet: item.snippet || '',
          source: item.source || 'Web',
          relevance: this.calculateRelevance(item, query),
        }));
      }

      // Fallback: Create a single result from the full response
      return [
        {
          title: `Search results for: ${query}`,
          url: '#search-result',
          snippet: content.substring(0, 500),
          source: 'Perplexity',
          relevance: 0.5,
        },
      ];
    } catch (error) {
      // If JSON parsing fails, return raw content as single result
      return [
        {
          title: `Search results for: ${query}`,
          url: '#search-result',
          snippet: content.substring(0, 500),
          source: 'Perplexity',
          relevance: 0.5,
        },
      ];
    }
  }

  /**
   * Calculate relevance score for a result
   */
  private calculateRelevance(
    result: { title: string; snippet: string },
    query: string
  ): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const resultText = `${result.title} ${result.snippet}`.toLowerCase();
    const resultWords = resultText.split(/\s+/);

    const matchCount = queryWords.filter((word) =>
      resultWords.some((rw) => rw.includes(word) || word.includes(rw))
    ).length;

    return Math.min(1, matchCount / queryWords.length + 0.2);
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createWebSearchTool(config?: WebSearchConfig): WebSearchTool {
  return new WebSearchTool(config);
}

// =============================================================================
// Convenience Function
// =============================================================================

/**
 * Quick web search without creating a tool instance
 */
export async function searchWeb(
  query: string,
  config?: WebSearchConfig
): Promise<WebSearchResult[]> {
  const tool = new WebSearchTool(config);
  const result = await tool.execute({ query });

  if (result.success && result.data) {
    return result.data as WebSearchResult[];
  }

  throw new Error(result.error || 'Search failed');
}
