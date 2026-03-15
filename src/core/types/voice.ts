/**
 * Voice Types
 *
 * Types for voice checking, revision feedback, and text analysis.
 */

import type { VoiceCheckResult } from '../../content/voice/voice-checker.js';

export interface RevisionFeedback {
  voiceCheck: EnhancedVoiceCheckResult;
  strategicIssues?: string[];
  preserveStrengths: string[];
  targetScore: number;
}

export interface EnhancedVoiceCheckResult extends VoiceCheckResult {
  suggestions: RevisionSuggestion[];
  preservationZones: TextRange[];
  problemZones: TextRange[];
  confidence: number;
}

export interface RevisionSuggestion {
  issue: string;
  location?: TextRange;
  currentText?: string;
  suggestedFix?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TextRange {
  start: number;
  end: number;
  text: string;
}
