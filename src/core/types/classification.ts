/**
 * Classification Types
 *
 * Types for content mode classification and signal detection.
 */

import type { ContentMode } from './content.js';

export interface ClassificationResult {
  mode: ContentMode;
  confidence: number;
  signals: ClassificationSignal[];
  alternativeModes: AlternativeMode[];
}

export interface ClassificationSignal {
  type: 'keyword' | 'audience' | 'structure' | 'output-type';
  value: string;
  weight: number;
  matchedMode: ContentMode;
}

export interface AlternativeMode {
  mode: ContentMode;
  confidence: number;
}
