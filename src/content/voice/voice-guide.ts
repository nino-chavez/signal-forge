/**
 * Voice & Tone Guide for Strategic Content
 *
 * This module now delegates to the voice registry for mode-specific
 * instructions. The legacy exports (VOICE_RULES, PROVISIONAL_PHRASES,
 * EVOLUTION_PATTERN) are preserved for backward compatibility.
 */

import { loadConfig } from '../../core/config.js';
import { getVoiceInstructionsFromRegistry } from '../../core/registries/voice-registry.js';
import type { Perspective } from '../../core/registries/types.js';

export interface VoiceRules {
  openingPatterns: {
    questionFirst: boolean;
    uncomfortableTruth: boolean;
    avoidAcademic: string[];
    avoidCasual: string[];
  };
  structuralPatterns: {
    evolution: boolean;
    compareContrast: boolean;
    provisional: boolean;
    boldHeaders: boolean;
  };
  tonalElements: {
    selfInterrogation: boolean;
    culturalTouchstones: boolean;
    technicalDepth: boolean;
    conversational: boolean;
  };
  avoid: {
    corporateJargon: string[];
    academicDistance: string[];
    humbleBragging: string[];
    prescriptiveAuthority: string[];
  };
}

/** @deprecated Use voice registry instead. Preserved for backward compatibility. */
export const VOICE_RULES: VoiceRules = {
  openingPatterns: {
    questionFirst: true,
    uncomfortableTruth: true,
    avoidAcademic: [
      "In this post, I'll explore...",
      "This essay examines...",
      "Research shows...",
    ],
    avoidCasual: [
      "Today I want to talk about...",
      "Hey everyone...",
    ],
  },
  structuralPatterns: {
    evolution: true,
    compareContrast: true,
    provisional: true,
    boldHeaders: true,
  },
  tonalElements: {
    selfInterrogation: true,
    culturalTouchstones: true,
    technicalDepth: true,
    conversational: true,
  },
  avoid: {
    corporateJargon: [
      "leverage",
      "synergize",
      "drive value",
      "stakeholders",
      "deliver impactful solutions",
    ],
    academicDistance: [
      "Research shows",
      "One could argue",
      "It is evident that",
    ],
    humbleBragging: [
      "I'm no expert, but",
      "This might be obvious, but",
      "I'm just a",
    ],
    prescriptiveAuthority: [
      "You should always",
      "The right way to",
      "Here are the 7 steps to",
    ],
  },
};

/** @deprecated Use voice registry instead. */
export const PROVISIONAL_PHRASES = [
  "Here's where I've landed—for now",
  "This is what I think today",
  "For now, I'm trying to",
  "Maybe this isn't about X at all. Maybe it's about Y",
];

/** @deprecated Use voice registry instead. */
export const EVOLUTION_PATTERN = {
  template: "I used to [OLD APPROACH]. Now [NEW APPROACH]. That sounds like progress. And it is. But it also brings up a real question: [TENSION].",
};

/**
 * Get voice instructions for a specific mode with perspective handling.
 *
 * @param mode - Content mode (defaults to 'thought-leadership' for backward compat)
 * @param perspective - Writing perspective (defaults to config-based or 'consultant')
 */
export function getVoiceInstructions(
  mode: string = 'thought-leadership',
  perspective?: Perspective
): string {
  const config = loadConfig();
  const effectivePerspective = perspective ?? (config as any).perspective ?? 'consultant';

  return getVoiceInstructionsFromRegistry(mode, effectivePerspective, {
    author: config.author,
    persona: config.persona,
    company: config.company,
  });
}
