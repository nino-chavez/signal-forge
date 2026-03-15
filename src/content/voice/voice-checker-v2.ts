/**
 * Enhanced Voice Checker (v2)
 *
 * Extends the original voice checker with:
 * - Revision suggestions with specific fixes
 * - Problem zones (text locations of issues)
 * - Preservation zones (strengths to keep)
 * - Confidence scoring
 */

import { checkVoice, type VoiceCheckResult } from './voice-checker.js';
import { VOICE_RULES, PROVISIONAL_PHRASES } from './voice-guide.js';
import type {
  EnhancedVoiceCheckResult,
  RevisionSuggestion,
  TextRange,
} from '../../core/types/index.js';

// =============================================================================
// Enhanced Checker
// =============================================================================

/**
 * Enhanced voice check with actionable suggestions
 */
export function checkVoiceEnhanced(content: string): EnhancedVoiceCheckResult {
  // Run base check first
  const baseResult = checkVoice(content);

  // Collect suggestions, problem zones, and preservation zones
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];
  const preservationZones: TextRange[] = [];

  // Analyze opening
  const openingAnalysis = analyzeOpening(content);
  if (openingAnalysis.issue) {
    suggestions.push(openingAnalysis.issue);
  }
  if (openingAnalysis.problemZone) {
    problemZones.push(openingAnalysis.problemZone);
  }
  if (openingAnalysis.preservationZone) {
    preservationZones.push(openingAnalysis.preservationZone);
  }

  // Analyze jargon
  const jargonAnalysis = analyzeJargon(content);
  suggestions.push(...jargonAnalysis.suggestions);
  problemZones.push(...jargonAnalysis.problemZones);

  // Analyze academic distance
  const academicAnalysis = analyzeAcademicDistance(content);
  suggestions.push(...academicAnalysis.suggestions);
  problemZones.push(...academicAnalysis.problemZones);

  // Analyze prescriptive authority
  const prescriptiveAnalysis = analyzePrescriptiveAuthority(content);
  suggestions.push(...prescriptiveAnalysis.suggestions);
  problemZones.push(...prescriptiveAnalysis.problemZones);

  // Analyze provisional language
  const provisionalAnalysis = analyzeProvisionalLanguage(content);
  if (provisionalAnalysis.issue) {
    suggestions.push(provisionalAnalysis.issue);
  }
  if (provisionalAnalysis.preservationZone) {
    preservationZones.push(provisionalAnalysis.preservationZone);
  }

  // Analyze evolution pattern
  const evolutionAnalysis = analyzeEvolutionPattern(content);
  if (evolutionAnalysis.issue) {
    suggestions.push(evolutionAnalysis.issue);
  }
  if (evolutionAnalysis.preservationZone) {
    preservationZones.push(evolutionAnalysis.preservationZone);
  }

  // Analyze self-interrogation
  const interrogationAnalysis = analyzeSelfInterrogation(content);
  if (interrogationAnalysis.issue) {
    suggestions.push(interrogationAnalysis.issue);
  }
  if (interrogationAnalysis.preservationZone) {
    preservationZones.push(interrogationAnalysis.preservationZone);
  }

  // Calculate confidence based on issue clarity
  const confidence = calculateConfidence(suggestions, baseResult);

  // Sort suggestions by priority
  suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return {
    ...baseResult,
    suggestions,
    preservationZones,
    problemZones,
    confidence,
  };
}

// =============================================================================
// Analysis Functions
// =============================================================================

function analyzeOpening(content: string): {
  issue?: RevisionSuggestion;
  problemZone?: TextRange;
  preservationZone?: TextRange;
} {
  const paragraphs = content.split('\n\n');
  const firstParagraph = paragraphs[0] || '';
  const hasQuestion = /[?]/.test(firstParagraph);
  const hasTension =
    /tension|uncomfortable|dilemma|challenge|paradox|contradiction/.test(
      firstParagraph.toLowerCase()
    );

  if (hasQuestion || hasTension) {
    return {
      preservationZone: {
        start: 0,
        end: firstParagraph.length,
        text: firstParagraph,
      },
    };
  }

  return {
    issue: {
      issue: 'Opening lacks question or tension hook',
      location: {
        start: 0,
        end: Math.min(firstParagraph.length, 200),
        text: firstParagraph.substring(0, 200),
      },
      currentText: firstParagraph.substring(0, 100),
      suggestedFix:
        'Start with a provocative question, an uncomfortable truth, or a tension that draws readers in. Example: "What if everything we\'ve assumed about X is wrong?"',
      priority: 'high',
    },
    problemZone: {
      start: 0,
      end: Math.min(firstParagraph.length, 200),
      text: firstParagraph.substring(0, 200),
    },
  };
}

function analyzeJargon(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  const jargonReplacements: Record<string, string> = {
    leverage: 'use',
    utilize: 'use',
    synergy: 'collaboration',
    synergize: 'work together',
    'move the needle': 'make progress',
    'low-hanging fruit': 'quick wins',
    'circle back': 'return to',
    'deep dive': 'detailed look',
    'drill down': 'examine closely',
    bandwidth: 'capacity',
    'take offline': 'discuss separately',
    'align on': 'agree on',
    'socialize the idea': 'share the idea',
    'boil the ocean': 'try to do too much',
  };

  for (const jargon of VOICE_RULES.avoid.corporateJargon) {
    const regex = new RegExp(`\\b${escapeRegex(jargon)}\\b`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const replacement = jargonReplacements[jargon.toLowerCase()] || '[simpler alternative]';

      suggestions.push({
        issue: `Corporate jargon: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix: `Replace with "${replacement}"`,
        priority: 'medium',
      });

      problemZones.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzeAcademicDistance(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  const academicReplacements: Record<string, string> = {
    'research shows': "I've seen",
    'studies indicate': "In my experience",
    'one could argue': 'I think',
    'it could be said': 'Here\'s my take',
    'the literature suggests': "What I've observed",
    'scholars have noted': 'Others have pointed out',
  };

  for (const phrase of VOICE_RULES.avoid.academicDistance) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const replacement = academicReplacements[phrase.toLowerCase()] || '[more personal alternative]';

      suggestions.push({
        issue: `Academic distance: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix: `Replace with "${replacement}" - use first person and experiential language`,
        priority: 'medium',
      });

      problemZones.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzePrescriptiveAuthority(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  const prescriptiveReplacements: Record<string, string> = {
    'you should always': 'Consider',
    'the right way to': 'One approach that works',
    'best practice is': 'What I\'ve found effective',
    'you must': 'I recommend',
    'never do': 'I\'d avoid',
    'always ensure': 'It helps to',
  };

  for (const phrase of VOICE_RULES.avoid.prescriptiveAuthority) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const replacement = prescriptiveReplacements[phrase.toLowerCase()] || '[softer recommendation]';

      suggestions.push({
        issue: `Prescriptive authority: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix: `Replace with "${replacement}" - offer guidance without dictating`,
        priority: 'low',
      });

      problemZones.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzeProvisionalLanguage(content: string): {
  issue?: RevisionSuggestion;
  preservationZone?: TextRange;
} {
  for (const phrase of PROVISIONAL_PHRASES) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    const match = regex.exec(content);

    if (match) {
      // Find the surrounding sentence for preservation
      const sentenceStart = findSentenceStart(content, match.index);
      const sentenceEnd = findSentenceEnd(content, match.index + match[0].length);

      return {
        preservationZone: {
          start: sentenceStart,
          end: sentenceEnd,
          text: content.substring(sentenceStart, sentenceEnd),
        },
      };
    }
  }

  return {
    issue: {
      issue: 'Missing provisional language',
      suggestedFix:
        'Add phrases like "for now," "today," "as I see it," or "here\'s where I\'ve landed" to signal that conclusions are current thinking, not absolute truths',
      priority: 'medium',
    },
  };
}

function analyzeEvolutionPattern(content: string): {
  issue?: RevisionSuggestion;
  preservationZone?: TextRange;
} {
  const evolutionPatterns = [
    /I used to think[^.]+now I/gi,
    /I used to believe[^.]+but/gi,
    /My thinking (has )?evolved/gi,
    /That sounds like progress/gi,
    /I\'ve changed my mind/gi,
  ];

  for (const pattern of evolutionPatterns) {
    const match = pattern.exec(content);
    if (match) {
      const sentenceStart = findSentenceStart(content, match.index);
      const sentenceEnd = findSentenceEnd(content, match.index + match[0].length);

      return {
        preservationZone: {
          start: sentenceStart,
          end: sentenceEnd,
          text: content.substring(sentenceStart, sentenceEnd),
        },
      };
    }
  }

  return {
    issue: {
      issue: 'Missing evolution pattern',
      suggestedFix:
        'Include a moment where you show how your thinking has evolved: "I used to think X, but now I see Y" or "My perspective has shifted because..."',
      priority: 'low',
    },
  };
}

function analyzeSelfInterrogation(content: string): {
  issue?: RevisionSuggestion;
  preservationZone?: TextRange;
} {
  const interrogationPatterns = [
    /But that brings up/gi,
    /But that raises/gi,
    /I wonder (if|whether)/gi,
    /What if[^?]+\?/gi,
    /The question I\'m sitting with/gi,
    /What I\'m still wrestling with/gi,
  ];

  for (const pattern of interrogationPatterns) {
    const match = pattern.exec(content);
    if (match) {
      const sentenceStart = findSentenceStart(content, match.index);
      const sentenceEnd = findSentenceEnd(content, match.index + match[0].length);

      return {
        preservationZone: {
          start: sentenceStart,
          end: sentenceEnd,
          text: content.substring(sentenceStart, sentenceEnd),
        },
      };
    }
  }

  return {
    issue: {
      issue: 'Missing self-interrogation',
      suggestedFix:
        'Add moments of self-questioning: "But that brings up an interesting question..." or "I wonder if..." to show active thinking',
      priority: 'low',
    },
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSentenceStart(content: string, index: number): number {
  const sentenceEnders = /[.!?]/;
  let i = index - 1;
  while (i > 0 && !sentenceEnders.test(content[i])) {
    i--;
  }
  return i > 0 ? i + 1 : 0;
}

function findSentenceEnd(content: string, index: number): number {
  const sentenceEnders = /[.!?]/;
  let i = index;
  while (i < content.length && !sentenceEnders.test(content[i])) {
    i++;
  }
  return i < content.length ? i + 1 : content.length;
}

function calculateConfidence(
  suggestions: RevisionSuggestion[],
  baseResult: VoiceCheckResult
): number {
  // Higher confidence if:
  // - More specific suggestions (with locations)
  // - Clearer issues identified
  // - Base score is not borderline (clear pass or fail)

  const specificSuggestions = suggestions.filter((s) => s.location !== undefined);
  const specificityRatio =
    suggestions.length > 0 ? specificSuggestions.length / suggestions.length : 1;

  const scoreClearance = Math.abs(baseResult.score - 7) / 3; // Distance from threshold

  return Math.min(1, (specificityRatio + scoreClearance) / 2 + 0.3);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get a summary of what needs to be fixed
 */
export function getRevisionSummary(result: EnhancedVoiceCheckResult): string {
  const lines: string[] = [];

  if (result.passed) {
    lines.push(`Voice check passed (score: ${result.score}/10)`);
  } else {
    lines.push(`Voice check failed (score: ${result.score}/10)`);
  }

  if (result.suggestions.length > 0) {
    lines.push('\nRevision suggestions:');
    for (const suggestion of result.suggestions) {
      const priority = suggestion.priority.toUpperCase();
      lines.push(`[${priority}] ${suggestion.issue}`);
      if (suggestion.suggestedFix) {
        lines.push(`  → ${suggestion.suggestedFix}`);
      }
    }
  }

  if (result.preservationZones.length > 0) {
    lines.push('\nStrengths to preserve:');
    for (const zone of result.preservationZones) {
      const preview = zone.text.substring(0, 80).replace(/\n/g, ' ');
      lines.push(`  ✓ "${preview}..."`);
    }
  }

  return lines.join('\n');
}

/**
 * Extract only high-priority suggestions
 */
export function getHighPrioritySuggestions(
  result: EnhancedVoiceCheckResult
): RevisionSuggestion[] {
  return result.suggestions.filter((s) => s.priority === 'high');
}
