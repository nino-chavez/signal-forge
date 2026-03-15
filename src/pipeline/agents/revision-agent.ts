/**
 * Revision Agent
 *
 * Applies targeted content fixes based on voice checker feedback.
 * Preserves identified strengths while addressing specific issues.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import { BaseAgent, type AgentConfig, type AgentMemory } from './base-agent.js';
import type {
  AgentInput,
  AgentOutput,
  ContentTask,
  EnhancedVoiceCheckResult,
  RevisionFeedback,
  RevisionStrategy,
  RevisionSuggestion,
  TextRange,
} from '../../core/types/index.js';

// =============================================================================
// Revision Agent Configuration
// =============================================================================

export interface RevisionAgentConfig {
  provider: AIProviderInterface;
  memory?: AgentMemory;
  verbose?: boolean;
  maxTokens?: number;
  temperature?: number;
}

// =============================================================================
// Revision Agent Implementation
// =============================================================================

export class RevisionAgent extends BaseAgent {
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(config: RevisionAgentConfig) {
    super({
      name: 'RevisionAgent',
      type: 'revision',
      provider: config.provider,
      memory: config.memory,
      verbose: config.verbose,
    });

    this.maxTokens = config.maxTokens ?? 8000;
    this.temperature = config.temperature ?? 0.5;
  }

  /**
   * Check if this agent can handle the task
   */
  canHandle(task: ContentTask): boolean {
    // Revision agent handles any content that needs voice fixes
    return true;
  }

  /**
   * Execute revision based on feedback
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    if (!input.feedback) {
      return this.failureOutput('No revision feedback provided');
    }

    try {
      const revisedContent = await this.revise(
        input.previousOutput?.content ?? '',
        input.feedback
      );

      return this.successOutput(revisedContent, {
        duration: Date.now() - startTime,
        strategy: input.feedback.voiceCheck.score < 5 ? 'strategic' : 'targeted',
      });
    } catch (error) {
      return this.failureOutput(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Revise content based on feedback
   */
  async revise(content: string, feedback: RevisionFeedback): Promise<string> {
    const strategy = this.determineStrategy(feedback);
    this.log(`Using revision strategy: ${strategy}`);

    switch (strategy) {
      case 'targeted':
        return this.targetedRevise(content, feedback);
      case 'strategic':
        return this.strategicRevise(content, feedback);
      case 'rewrite':
        return this.fullRewrite(content, feedback);
      default:
        return this.targetedRevise(content, feedback);
    }
  }

  /**
   * Targeted revision: Fix specific identified issues
   */
  async targetedRevise(content: string, feedback: RevisionFeedback): Promise<string> {
    const { voiceCheck } = feedback;
    const highPrioritySuggestions = voiceCheck.suggestions.filter(
      (s) => s.priority === 'high'
    );
    const otherSuggestions = voiceCheck.suggestions.filter(
      (s) => s.priority !== 'high'
    );

    const systemInstruction = this.buildTargetedSystemInstruction(feedback);
    const prompt = this.buildTargetedPrompt(
      content,
      highPrioritySuggestions,
      otherSuggestions,
      voiceCheck.preservationZones
    );

    return this.generate({
      prompt,
      systemInstruction,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    });
  }

  /**
   * Strategic revision: Restructure for better voice alignment
   */
  async strategicRevise(content: string, feedback: RevisionFeedback): Promise<string> {
    const systemInstruction = `You are a strategic content editor specializing in authentic, thought-leadership voice.

Your task is to restructure and rewrite content to achieve a voice score of ${feedback.targetScore}/10.

Current score: ${feedback.voiceCheck.score}/10

Key voice principles to apply:
1. **Question-first opening**: Start with tension, a question, or an uncomfortable truth
2. **Provisional language**: Use "for now," "today," "as I see it" - show current thinking, not absolute truth
3. **Evolution pattern**: Include "I used to think X, now I see Y" moments
4. **Self-interrogation**: Add "But that brings up..." or "I wonder if..." moments
5. **No corporate jargon**: Replace "leverage," "synergy," "move the needle" with plain language
6. **No academic distance**: Use "I think" not "Research shows," use "In my experience" not "Studies indicate"
7. **No prescriptive authority**: Offer guidance, don't dictate

Preserve what's working while restructuring what isn't.`;

    const prompt = `Content to revise (current score: ${feedback.voiceCheck.score}/10):

${content}

---

ISSUES TO FIX:
${feedback.voiceCheck.issues.map((i) => `- ${i}`).join('\n')}

STRENGTHS TO PRESERVE:
${feedback.preserveStrengths.map((s) => `- ${s}`).join('\n')}

---

Rewrite this content to achieve a voice score of ${feedback.targetScore}/10. Maintain the core message and strategic content while fundamentally improving voice consistency.`;

    return this.generate({
      prompt,
      systemInstruction,
      temperature: 0.6, // Slightly higher for strategic revision
      maxTokens: this.maxTokens,
    });
  }

  /**
   * Full rewrite: Complete content regeneration with voice focus
   */
  async fullRewrite(content: string, feedback: RevisionFeedback): Promise<string> {
    const systemInstruction = `You are rewriting content from scratch while preserving its core message.

The original content failed voice checks repeatedly. Your job is to extract the key ideas and completely rewrite them in an authentic, engaging voice.

Voice requirements:
1. Open with a question or tension
2. Use first person, experiential language
3. Show evolution of thinking
4. Include moments of self-doubt or questioning
5. Use provisional language ("for now," "today")
6. No jargon, no academic distance, no prescriptive authority
7. Use intentional fragments for rhythm
8. Make bold statements followed by nuance

Target voice score: ${feedback.targetScore}/10`;

    const prompt = `Original content to rewrite:

${content}

---

Key messages to preserve:
${this.extractKeyMessages(content)}

---

Completely rewrite this content in an authentic voice that would score ${feedback.targetScore}/10 on our voice checker. Focus on making it genuinely engaging while keeping the strategic content intact.`;

    return this.generate({
      prompt,
      systemInstruction,
      temperature: 0.7, // Higher for creative rewrite
      maxTokens: this.maxTokens,
    });
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private determineStrategy(feedback: RevisionFeedback): RevisionStrategy {
    const { voiceCheck } = feedback;

    // Very low score = full rewrite
    if (voiceCheck.score < 3) {
      return 'rewrite';
    }

    // Low score = strategic restructure
    if (voiceCheck.score < 5) {
      return 'strategic';
    }

    // Otherwise = targeted fixes
    return 'targeted';
  }

  private buildTargetedSystemInstruction(feedback: RevisionFeedback): string {
    return `You are a precision content editor. Your task is to apply specific fixes to content while preserving everything else.

Rules:
1. Make ONLY the changes specified in the suggestions
2. Do NOT change anything that is working well
3. Preserve the overall structure and flow
4. Maintain the authentic voice where it exists
5. Apply fixes surgically - minimal changes for maximum impact

Target: Improve voice score from ${feedback.voiceCheck.score}/10 to ${feedback.targetScore}/10`;
  }

  private buildTargetedPrompt(
    content: string,
    highPrioritySuggestions: RevisionSuggestion[],
    otherSuggestions: RevisionSuggestion[],
    preservationZones: TextRange[]
  ): string {
    let prompt = `Content to revise:\n\n${content}\n\n---\n\n`;

    if (highPrioritySuggestions.length > 0) {
      prompt += `HIGH PRIORITY FIXES (must address):\n`;
      for (const suggestion of highPrioritySuggestions) {
        prompt += `\n• Issue: ${suggestion.issue}`;
        if (suggestion.currentText) {
          prompt += `\n  Current: "${suggestion.currentText}"`;
        }
        if (suggestion.suggestedFix) {
          prompt += `\n  Fix: ${suggestion.suggestedFix}`;
        }
      }
      prompt += '\n\n';
    }

    if (otherSuggestions.length > 0) {
      prompt += `ADDITIONAL IMPROVEMENTS (address if possible):\n`;
      for (const suggestion of otherSuggestions) {
        prompt += `\n• ${suggestion.issue}`;
        if (suggestion.suggestedFix) {
          prompt += `: ${suggestion.suggestedFix}`;
        }
      }
      prompt += '\n\n';
    }

    if (preservationZones.length > 0) {
      prompt += `PRESERVE THESE SECTIONS (do not modify):\n`;
      for (const zone of preservationZones.slice(0, 3)) {
        const preview = zone.text.substring(0, 100).replace(/\n/g, ' ');
        prompt += `\n• "${preview}..."`;
      }
      prompt += '\n\n';
    }

    prompt += `Apply the fixes and return the complete revised content.`;

    return prompt;
  }

  private extractKeyMessages(content: string): string {
    // Extract headers and key statements
    const headers = content.match(/^#+\s*.+$/gm) || [];
    const recommendations = content.match(/I recommend.+\./gi) || [];
    const conclusions =
      content.match(
        /(In conclusion|To summarize|The key takeaway|The bottom line).+\./gi
      ) || [];

    const messages: string[] = [
      ...headers.map((h) => h.replace(/^#+\s*/, '')),
      ...recommendations,
      ...conclusions,
    ];

    return messages.length > 0
      ? messages.slice(0, 5).join('\n')
      : 'Preserve the core argument and recommendations';
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createRevisionAgent(config: RevisionAgentConfig): RevisionAgent {
  return new RevisionAgent(config);
}
