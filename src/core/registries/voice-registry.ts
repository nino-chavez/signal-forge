/**
 * Voice Registry
 *
 * Central registry for voice definitions. Each voice pairs system prompt
 * instructions with validation rules for a specific content mode.
 *
 * Built-in voices are registered at startup via registerBuiltInPresets().
 * Custom voices can be registered at runtime via registerVoice().
 */

import type { VoiceDefinition, Perspective } from './types.js';

const voices = new Map<string, VoiceDefinition>();

/**
 * Register a voice definition for a mode.
 */
export function registerVoice(definition: VoiceDefinition): void {
  voices.set(definition.modeId, definition);
}

/**
 * Get a voice definition by mode ID. Returns undefined if not found.
 */
export function getVoice(modeId: string): VoiceDefinition | undefined {
  return voices.get(modeId);
}

/**
 * List all registered voices with metadata.
 */
export function listVoices(): Array<{ modeId: string; name: string }> {
  return Array.from(voices.values()).map((v) => ({
    modeId: v.modeId,
    name: v.name,
  }));
}

/**
 * Check if a voice is registered for a mode.
 */
export function hasVoice(modeId: string): boolean {
  return voices.has(modeId);
}

// =============================================================================
// Perspective Framing
// =============================================================================

const PERSPECTIVE_BLOCKS: Record<Perspective, string> = {
  consultant: `
**Perspective**: Write from an external advisor perspective providing strategic guidance.
- Use "you" / "your organization" / "your team" naturally
- Show pattern recognition: "I've seen this across retail, manufacturing, and enterprise clients"
- Professional but not sterile — senior consultant expertise
- Ground recommendations in actual client context`,

  internal: `
**Perspective**: Write from an internal team perspective providing strategic guidance to leadership and cross-functional stakeholders.
- Use "we" / "our" / "our team" naturally — this is an internal document
- Reference specific teams, systems, and stakeholders by name where relevant
- Professional but direct — we're all on the same team
- No consultant framing — no "your organization" or "the client"`,

  neutral: '',
};

/**
 * Get voice instructions for a mode with perspective and config interpolation.
 *
 * Combines the registered voice instructions with perspective framing and
 * interpolates {author}, {persona}, {company} placeholders from config.
 */
export function getVoiceInstructionsFromRegistry(
  modeId: string,
  perspective: Perspective,
  config: { author: string; persona: string; company?: string }
): string {
  const voice = voices.get(modeId);
  if (!voice) {
    return `You are writing ${modeId} content.`;
  }

  // Interpolate placeholders
  let instructions = voice.instructions
    .replace(/\{author\}/g, config.author)
    .replace(/\{persona\}/g, config.persona)
    .replace(/\{company\}/g, config.company || 'the organization');

  // Append perspective framing
  const perspectiveBlock = PERSPECTIVE_BLOCKS[perspective];
  if (perspectiveBlock) {
    instructions += '\n' + perspectiveBlock;
  }

  return instructions;
}
