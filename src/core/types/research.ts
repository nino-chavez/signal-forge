/**
 * Research Context Types
 *
 * Types for web research, document analysis, and fact verification.
 */

export interface ResearchContext {
  webResults?: WebSearchResult[];
  localDocuments?: DocumentResult[];
  facts?: VerifiedFact[];
  competitiveInsights?: CompetitiveInsight[];
  relevanceScore?: number;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevance: number;
}

export interface DocumentResult {
  path: string;
  title?: string;
  content: string;
  type: 'meeting-notes' | 'reference' | 'previous-content' | 'template';
  relevance: number;
}

export interface VerifiedFact {
  claim: string;
  verified: boolean;
  sources: string[];
  confidence: number;
}

export interface CompetitiveInsight {
  competitor: string;
  insight: string;
  source: string;
  relevance: number;
}
