/**
 * Content Classifier
 *
 * Automatically detects content mode based on input signals: keywords,
 * audience markers, structure, and output type. Signal definitions come
 * from the mode registry — no hardcoded mode data here.
 */

import type {
  ClassificationResult,
  ClassificationSignal,
} from '../../core/types/index.js';
import {
  getAllModes,
  getModeForContentType,
  isValidMode,
  getDefaultModeId,
} from '../../core/registries/mode-registry.js';

// =============================================================================
// Classifier Implementation
// =============================================================================

export class ContentClassifier {
  private readonly keywordWeight: number;
  private readonly audienceWeight: number;
  private readonly structureWeight: number;
  private readonly typeWeight: number;

  constructor(
    weights: {
      keyword?: number;
      audience?: number;
      structure?: number;
      type?: number;
    } = {}
  ) {
    this.keywordWeight = weights.keyword ?? 1.0;
    this.audienceWeight = weights.audience ?? 1.5;
    this.structureWeight = weights.structure ?? 1.2;
    this.typeWeight = weights.type ?? 2.0; // Output type is strongest signal
  }

  /**
   * Classify input content to determine the appropriate mode
   */
  async classify(input: string, requestedType?: string): Promise<ClassificationResult> {
    const signals: ClassificationSignal[] = [];
    const scores: Record<string, number> = {};
    const registeredModes = getAllModes();

    // Initialize scores for all registered modes
    for (const mode of registeredModes) {
      scores[mode.id] = 0;
    }

    // Collect keyword signals
    for (const mode of registeredModes) {
      for (const keyword of mode.signals.keywords) {
        if (input.toLowerCase().includes(keyword.toLowerCase())) {
          const signal: ClassificationSignal = {
            type: 'keyword',
            value: keyword,
            weight: this.keywordWeight,
            matchedMode: mode.id,
          };
          signals.push(signal);
          scores[mode.id] += this.keywordWeight;
        }
      }
    }

    // Collect audience signals
    for (const mode of registeredModes) {
      for (const marker of mode.signals.audience) {
        if (input.toLowerCase().includes(marker.toLowerCase())) {
          const signal: ClassificationSignal = {
            type: 'audience',
            value: marker,
            weight: this.audienceWeight,
            matchedMode: mode.id,
          };
          signals.push(signal);
          scores[mode.id] += this.audienceWeight;
        }
      }
    }

    // Collect structure signals
    for (const mode of registeredModes) {
      for (const pattern of mode.signals.structure) {
        if (pattern.test(input)) {
          const signal: ClassificationSignal = {
            type: 'structure',
            value: pattern.source,
            weight: this.structureWeight,
            matchedMode: mode.id,
          };
          signals.push(signal);
          scores[mode.id] += this.structureWeight;
        }
      }
    }

    // Apply output type signal (strongest)
    if (requestedType) {
      const mappedMode = getModeForContentType(requestedType);
      if (mappedMode && scores[mappedMode] !== undefined) {
        const signal: ClassificationSignal = {
          type: 'output-type',
          value: requestedType,
          weight: this.typeWeight,
          matchedMode: mappedMode,
        };
        signals.push(signal);
        scores[mappedMode] += this.typeWeight;
      }
    }

    // Determine winning mode
    const sortedModes = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([mode, score]) => ({ mode, score }));

    const defaultModeId = getDefaultModeId();
    const topMode = sortedModes[0] ?? { mode: defaultModeId, score: 0 };
    const totalScore = sortedModes.reduce((sum, { score }) => sum + score, 0);
    const confidence = totalScore > 0 ? topMode.score / totalScore : 0.33;

    // Build alternative modes
    const alternativeModes = sortedModes.slice(1).map(({ mode, score }) => ({
      mode,
      confidence: totalScore > 0 ? score / totalScore : 0.33,
    }));

    return {
      mode: topMode.mode,
      confidence: Math.round(confidence * 100) / 100,
      signals,
      alternativeModes,
    };
  }

  /**
   * Get the default mode for a content type
   */
  getDefaultMode(contentType: string): string {
    return getModeForContentType(contentType);
  }

  /**
   * Check if a mode is valid
   */
  isValidMode(mode: string): boolean {
    return isValidMode(mode);
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createClassifier(weights?: {
  keyword?: number;
  audience?: number;
  structure?: number;
  type?: number;
}): ContentClassifier {
  return new ContentClassifier(weights);
}

// =============================================================================
// Standalone Classification Function
// =============================================================================

/**
 * Quick classification without instantiating a classifier
 */
export async function classifyContent(
  input: string,
  requestedType?: string
): Promise<ClassificationResult> {
  const classifier = new ContentClassifier();
  return classifier.classify(input, requestedType);
}
