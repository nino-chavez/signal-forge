/**
 * Production Types
 *
 * Types for content production, iteration control, and revision strategies.
 */

import type { AIProvider } from '../../providers/ai-provider.js';
import type { VoiceCheckResult } from '../../content/voice/voice-checker.js';

export interface ProductionResult {
  content: string;
  voiceCheck: VoiceCheckResult;
  iterations: number;
  approved: boolean;
  warning?: string;
  metadata?: {
    provider: AIProvider;
    model?: string;
    totalTokens?: number;
  };
}

export interface IterationState {
  current: number;
  max: number;
  scores: number[];
  improvements: number[];
  stalled: boolean;
  strategy: RevisionStrategy;
}

export type RevisionStrategy = 'targeted' | 'strategic' | 'rewrite';

export interface IterationConfig {
  maxIterations: number;
  minScoreImprovement: number;
  voiceScoreThreshold: number;
  stallThreshold: number; // Number of iterations without improvement
}
