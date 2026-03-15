/**
 * Research Agent
 *
 * Gathers context autonomously before content production.
 * Uses web search (Perplexity) and local document reading
 * to build a comprehensive research context.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import { BaseAgent, type AgentConfig, type AgentMemory } from './base-agent.js';
import type {
  AgentInput,
  AgentOutput,
  ContentTask,
  DocumentResult,
  ResearchContext,
  VerifiedFact,
  WebSearchResult,
} from '../../core/types/index.js';

// =============================================================================
// Research Agent Configuration
// =============================================================================

export interface ResearchAgentConfig {
  provider: AIProviderInterface;
  memory?: AgentMemory;
  verbose?: boolean;
  maxWebResults?: number;
  maxDocuments?: number;
  webSearchEnabled?: boolean;
  localSearchEnabled?: boolean;
}

// =============================================================================
// Research Agent Implementation
// =============================================================================

export class ResearchAgent extends BaseAgent {
  private readonly maxWebResults: number;
  private readonly maxDocuments: number;
  private readonly webSearchEnabled: boolean;
  private readonly localSearchEnabled: boolean;

  constructor(config: ResearchAgentConfig) {
    super({
      name: 'ResearchAgent',
      type: 'research',
      provider: config.provider,
      memory: config.memory,
      verbose: config.verbose,
    });

    this.maxWebResults = config.maxWebResults ?? 5;
    this.maxDocuments = config.maxDocuments ?? 5;
    this.webSearchEnabled = config.webSearchEnabled ?? true;
    this.localSearchEnabled = config.localSearchEnabled ?? true;
  }

  /**
   * Check if this agent can handle the task
   */
  canHandle(task: ContentTask): boolean {
    // Research agent can handle any task that has input to analyze
    return task.input.length > 0;
  }

  /**
   * Execute research workflow
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    try {
      const context = await this.research(input.task);

      return this.successOutput(JSON.stringify(context), {
        webResults: context.webResults?.length ?? 0,
        localDocuments: context.localDocuments?.length ?? 0,
        facts: context.facts?.length ?? 0,
        relevanceScore: context.relevanceScore,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      return this.failureOutput(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Main research workflow
   */
  async research(task: ContentTask): Promise<ResearchContext> {
    this.log('Starting research', { type: task.type, mode: task.mode });

    // Extract research topics from input
    const topics = await this.extractTopics(task.input);
    this.log('Extracted topics', topics);

    // Run research in parallel
    const [webResults, localDocuments] = await Promise.all([
      this.webSearchEnabled ? this.searchWeb(topics, task) : Promise.resolve([]),
      this.localSearchEnabled ? this.searchLocalDocuments(topics, task) : Promise.resolve([]),
    ]);

    // Extract and verify key facts
    const facts = await this.extractFacts(task.input, webResults);

    // Calculate overall relevance
    const relevanceScore = this.calculateRelevance(webResults, localDocuments, facts);

    const context: ResearchContext = {
      webResults,
      localDocuments,
      facts,
      relevanceScore,
    };

    // Store in memory for potential reuse
    await this.remember(`research_${task.id}`, context, 'session');

    this.log('Research complete', {
      webResults: webResults.length,
      localDocuments: localDocuments.length,
      facts: facts.length,
      relevanceScore,
    });

    return context;
  }

  // ===========================================================================
  // Topic Extraction
  // ===========================================================================

  /**
   * Extract research topics from input using AI
   */
  private async extractTopics(input: string): Promise<string[]> {
    const prompt = `Extract 3-5 key research topics from this content that would benefit from additional context or verification.

Content:
${input.substring(0, 2000)}

Return only a JSON array of topic strings, e.g.: ["topic 1", "topic 2", "topic 3"]`;

    try {
      const result = await this.generate({
        prompt,
        systemInstruction: 'You are a research assistant. Extract key topics that would benefit from additional research. Return only valid JSON.',
        temperature: 0.3,
        maxTokens: 500,
      });

      // Parse JSON response
      const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned) as string[];
    } catch (error) {
      this.log('Topic extraction failed, using fallback', error);
      // Fallback: extract key noun phrases
      return this.extractTopicsFallback(input);
    }
  }

  /**
   * Fallback topic extraction using simple heuristics
   */
  private extractTopicsFallback(input: string): string[] {
    const topics: string[] = [];

    // Extract capitalized phrases (likely proper nouns/topics)
    const capitalizedPhrases = input.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
    const uniquePhrases = [...new Set(capitalizedPhrases)].slice(0, 3);
    topics.push(...uniquePhrases);

    // Extract quoted phrases
    const quotedPhrases = input.match(/"[^"]+"/g) || [];
    topics.push(...quotedPhrases.map((p) => p.replace(/"/g, '')).slice(0, 2));

    return topics.slice(0, 5);
  }

  // ===========================================================================
  // Web Search
  // ===========================================================================

  /**
   * Search the web for relevant context
   */
  private async searchWeb(
    topics: string[],
    task: ContentTask
  ): Promise<WebSearchResult[]> {
    const results: WebSearchResult[] = [];

    // Check if web search tool is available
    if (!this.hasTool('webSearch')) {
      this.log('Web search tool not available, skipping');
      return results;
    }

    for (const topic of topics.slice(0, 3)) {
      try {
        const searchQuery = this.buildSearchQuery(topic, task);
        const searchResult = await this.useTool('webSearch', { query: searchQuery });

        if (searchResult.success && searchResult.data) {
          const webResults = searchResult.data as WebSearchResult[];
          results.push(...webResults.slice(0, Math.ceil(this.maxWebResults / topics.length)));
        }
      } catch (error) {
        this.log(`Web search failed for topic: ${topic}`, error);
      }
    }

    // Score and sort by relevance
    return this.scoreAndSortResults(results, topics);
  }

  /**
   * Build an effective search query
   */
  private buildSearchQuery(topic: string, task: ContentTask): string {
    const modeModifiers: Record<string, string> = {
      'thought-leadership': 'trends insights analysis',
      architecture: 'technical implementation best practices',
      advisory: 'strategy business recommendations',
    };

    const modifier = task.mode ? modeModifiers[task.mode] : '';
    return `${topic} ${modifier} 2024 2025`.trim();
  }

  // ===========================================================================
  // Local Document Search
  // ===========================================================================

  /**
   * Search local documents for relevant context
   */
  private async searchLocalDocuments(
    topics: string[],
    task: ContentTask
  ): Promise<DocumentResult[]> {
    const results: DocumentResult[] = [];

    // Check if document reader tool is available
    if (!this.hasTool('documentReader')) {
      this.log('Document reader tool not available, skipping');
      return results;
    }

    // Search in relevant directories
    const searchPaths = ['refs/', 'content/', 'projects/'];

    for (const path of searchPaths) {
      try {
        const searchResult = await this.useTool('documentReader', {
          path,
          patterns: topics,
          maxResults: Math.ceil(this.maxDocuments / searchPaths.length),
        });

        if (searchResult.success && searchResult.data) {
          const docs = searchResult.data as DocumentResult[];
          results.push(...docs);
        }
      } catch (error) {
        this.log(`Local search failed for path: ${path}`, error);
      }
    }

    // Score and sort by relevance
    return this.scoreDocumentRelevance(results, topics);
  }

  // ===========================================================================
  // Fact Extraction & Verification
  // ===========================================================================

  /**
   * Extract key facts from content and verify against sources
   */
  private async extractFacts(
    input: string,
    webResults: WebSearchResult[]
  ): Promise<VerifiedFact[]> {
    const facts: VerifiedFact[] = [];

    // Extract potential factual claims from input
    const claims = await this.extractClaims(input);

    for (const claim of claims.slice(0, 5)) {
      const verification = this.verifyClaim(claim, webResults);
      facts.push(verification);
    }

    return facts;
  }

  /**
   * Extract factual claims from content
   */
  private async extractClaims(input: string): Promise<string[]> {
    const prompt = `Extract up to 5 factual claims from this content that could be verified.

Content:
${input.substring(0, 1500)}

Return only a JSON array of claim strings, e.g.: ["claim 1", "claim 2"]`;

    try {
      const result = await this.generate({
        prompt,
        systemInstruction: 'Extract verifiable factual claims. Return only valid JSON array.',
        temperature: 0.2,
        maxTokens: 500,
      });

      const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned) as string[];
    } catch (error) {
      this.log('Claim extraction failed', error);
      return [];
    }
  }

  /**
   * Verify a claim against web results
   */
  private verifyClaim(claim: string, webResults: WebSearchResult[]): VerifiedFact {
    const claimWords = claim.toLowerCase().split(/\s+/);
    const matchingSources: string[] = [];
    let totalRelevance = 0;

    for (const result of webResults) {
      const snippetWords = result.snippet.toLowerCase().split(/\s+/);
      const overlap = claimWords.filter((w) => snippetWords.includes(w)).length;
      const relevance = overlap / claimWords.length;

      if (relevance > 0.3) {
        matchingSources.push(result.url);
        totalRelevance += relevance;
      }
    }

    const confidence = matchingSources.length > 0
      ? Math.min(1, totalRelevance / matchingSources.length)
      : 0;

    return {
      claim,
      verified: matchingSources.length > 0,
      sources: matchingSources.slice(0, 3),
      confidence,
    };
  }

  // ===========================================================================
  // Relevance Scoring
  // ===========================================================================

  /**
   * Score and sort web results by relevance
   */
  private scoreAndSortResults(
    results: WebSearchResult[],
    topics: string[]
  ): WebSearchResult[] {
    const topicWords = topics.flatMap((t) => t.toLowerCase().split(/\s+/));

    return results
      .map((result) => {
        const snippetWords = result.snippet.toLowerCase().split(/\s+/);
        const titleWords = result.title.toLowerCase().split(/\s+/);
        const allWords = [...snippetWords, ...titleWords];

        const overlap = topicWords.filter((w) => allWords.includes(w)).length;
        const relevance = overlap / topicWords.length;

        return { ...result, relevance };
      })
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, this.maxWebResults);
  }

  /**
   * Score document relevance
   */
  private scoreDocumentRelevance(
    results: DocumentResult[],
    topics: string[]
  ): DocumentResult[] {
    const topicWords = topics.flatMap((t) => t.toLowerCase().split(/\s+/));

    return results
      .map((doc) => {
        const contentWords = doc.content.toLowerCase().split(/\s+/);
        const overlap = topicWords.filter((w) => contentWords.includes(w)).length;
        const relevance = overlap / topicWords.length;

        return { ...doc, relevance };
      })
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, this.maxDocuments);
  }

  /**
   * Calculate overall research relevance score
   */
  private calculateRelevance(
    webResults: WebSearchResult[],
    localDocuments: DocumentResult[],
    facts: VerifiedFact[]
  ): number {
    const webScore =
      webResults.length > 0
        ? webResults.reduce((sum, r) => sum + r.relevance, 0) / webResults.length
        : 0;

    const docScore =
      localDocuments.length > 0
        ? localDocuments.reduce((sum, d) => sum + d.relevance, 0) / localDocuments.length
        : 0;

    const factScore =
      facts.length > 0
        ? facts.filter((f) => f.verified).length / facts.length
        : 0;

    // Weighted average
    return (webScore * 0.4 + docScore * 0.3 + factScore * 0.3);
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createResearchAgent(config: ResearchAgentConfig): ResearchAgent {
  return new ResearchAgent(config);
}
