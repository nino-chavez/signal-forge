/**
 * Registry Types
 *
 * Shared type definitions for all Signal Forge registries.
 * Registries separate engine behavior from preset data, enabling
 * custom modes, voices, workflows, and templates without modifying core code.
 */

// =============================================================================
// Content Mode Types
// =============================================================================

/** Built-in content modes — provides type safety for preset definitions */
export type BuiltInContentMode = 'thought-leadership' | 'architecture' | 'advisory' | 'documentation';

/**
 * A registered content mode definition.
 *
 * Modes define how content is classified by combining keyword, audience,
 * and structural signals. The classifier scores input against all registered
 * modes and picks the highest-scoring match.
 */
export interface ContentModeDefinition {
  /** Unique identifier (e.g. 'thought-leadership', 'architecture') */
  id: string;
  /** Display name (e.g. 'Thought Leadership') */
  name: string;
  /** One-line description of when to use this mode */
  description: string;
  /** Content types this mode is the default for (e.g. ['pov', 'paper']) */
  defaultFor: string[];
  /** Classification signals used to detect this mode in input text */
  signals: {
    /** Keywords and phrases that suggest this mode */
    keywords: string[];
    /** Audience markers that suggest this mode */
    audience: string[];
    /** Structural patterns (regex) that suggest this mode */
    structure: RegExp[];
  };
}

// =============================================================================
// Voice Types
// =============================================================================

/** Writing perspective — controls pronoun usage and framing in generated content */
export type Perspective = 'consultant' | 'internal' | 'neutral';

/**
 * A registered voice definition.
 *
 * Voice definitions pair system prompt instructions with validation rules.
 * The instructions tell the AI how to write; the check rules score whether
 * the output actually matches the intended voice.
 */
export interface VoiceDefinition {
  /** Mode this voice applies to */
  modeId: string;
  /** Display name */
  name: string;
  /** System prompt instructions — may contain {author}, {persona}, {company} placeholders */
  instructions: string;
  /** Rules for scoring content against this voice */
  checkRules: {
    openingPatterns: {
      required: RegExp[];
      forbidden: RegExp[];
    };
    voiceMarkers: {
      positive: RegExp[];
      negative: RegExp[];
    };
    structuralPatterns: {
      required: RegExp[];
    };
    jargonToAvoid: string[];
  };
  /** Optional mode-specific bonus scoring logic */
  bonusChecks?: (content: string) => {
    issues: string[];
    strengths: string[];
    scoreAdjustment: number;
  };
}

// =============================================================================
// Workflow Types
// =============================================================================

/** A single step in a content generation workflow */
export interface WorkflowStep {
  /** Role identifier (e.g. 'ghost-writer', 'copywriter', 'editor') */
  role: string;
  /** Optional role-specific configuration overrides */
  config?: Record<string, unknown>;
}

/**
 * A registered workflow definition.
 *
 * Workflows define the ordered chain of roles that content passes through
 * during generation. Different modes can use different workflows.
 */
export interface WorkflowDefinition {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of this workflow */
  description: string;
  /** Modes this workflow applies to */
  forModes: string[];
  /** Ordered role chain */
  steps: WorkflowStep[];
}

// =============================================================================
// Template Types
// =============================================================================

/**
 * A registered template definition.
 *
 * Templates define the structural skeleton for a content type.
 * Parsers (engine code) consume these structures but don't define them.
 */
export interface TemplateDefinition {
  /** Unique identifier (e.g. 'deck', 'pov', 'paper') */
  id: string;
  /** Display name */
  name: string;
  /** Description of this template */
  description: string;
  /** Content types that use this template */
  forContentTypes: string[];
  /** The template structure data — shape varies by template type */
  structure: Record<string, unknown>;
}
