import type { AIProviderInterface, GenerateOptions } from '../../providers/ai-provider.js';
import { getVoiceInstructions } from '../../content/voice/voice-guide.js';
import { loadConfig } from '../../core/config.js';
import { getModeForContentType } from '../../core/registries/mode-registry.js';

export interface CopywriterInput {
  draft: string;
  contentType: 'deck' | 'pov' | 'paper';
  audience?: string;
  strategicObjectives?: string[];
}

export interface CopywriterOutput {
  refined: string;
  changes?: string[];
  metadata?: {
    provider: string;
    model?: string;
  };
}

/**
 * Copywriter Role
 *
 * Refines ghost-written content for clarity, impact, and strategic precision
 * Preserves voice authenticity while enhancing structure
 */
export class Copywriter {
  constructor(private provider: AIProviderInterface) {}

  async refine(input: CopywriterInput): Promise<CopywriterOutput> {
    const systemInstruction = this.buildSystemInstruction(input);
    const prompt = this.buildPrompt(input);

    const options: GenerateOptions = {
      prompt,
      systemInstruction,
      temperature: 0.6, // Lower temperature for refinement
      maxTokens: this.getMaxTokens(input.contentType),
    };

    const result = await this.provider.generate(options);

    return {
      refined: result.content,
      metadata: {
        provider: result.provider,
        model: result.model,
      },
    };
  }

  private buildSystemInstruction(input: CopywriterInput): string {
    const mode = getModeForContentType(input.contentType);
    const voiceInstructions = getVoiceInstructions(mode);

    const config = loadConfig();
    const { author } = config;

    return `You are ${author}'s Copywriter for strategic content. Your role is to:

1. **Preserve Voice**: Keep the ghost writer's authentic voice—don't over-polish
2. **Strengthen Structure**: Ensure logical flow, clear transitions, scannable headers
3. **Sharpen Language**: Make every word count—remove filler, strengthen key points
4. **Audience Optimization**: Adjust tone slightly for audience (${input.audience || 'strategic/executive'})
5. **Strategic Precision**: Ensure strategic recommendations are clear, actionable, and grounded

${voiceInstructions}

What to enhance:
- Opening hooks (make them more compelling while keeping voice)
- Section transitions (smooth but not formulaic)
- Key strategic points (emphasize without being prescriptive)
- Examples and evidence (make them more specific and impactful)
- Calls to action (clear but not pushy)

What NOT to change:
- Intentional voice markers (they're there for a reason)
- The core strategic thinking
- Natural conversational flow
- Rough edges that sound authentic

Voice checkpoints:
- Does it still sound like ${author}?
- Is the voice consistent with ${mode} mode?
- Is the work still visible (not just polished conclusions)?
- Is it professional but not sterile?`;
  }

  private buildPrompt(input: CopywriterInput): string {
    let prompt = `Refine this strategic content draft:\n\n`;
    prompt += `Content Type: ${input.contentType}\n`;

    if (input.audience) {
      prompt += `Target Audience: ${input.audience}\n`;
    }

    if (input.strategicObjectives && input.strategicObjectives.length > 0) {
      prompt += `Strategic Objectives:\n${input.strategicObjectives.map(obj => `- ${obj}`).join('\n')}\n\n`;
    }

    prompt += `Original Draft:\n${input.draft}\n\n`;
    prompt += `Refine this content to:\n`;
    prompt += `- Enhance clarity without losing voice\n`;
    prompt += `- Strengthen strategic arguments\n`;
    prompt += `- Optimize for ${input.audience || 'executive'} audience\n`;
    prompt += `- Preserve all voice markers and authenticity\n`;
    prompt += `- Make strategic recommendations more actionable\n`;

    return prompt;
  }

  private getMaxTokens(contentType: 'deck' | 'pov' | 'paper'): number {
    // Copywriter may expand content slightly, so allow more tokens
    switch (contentType) {
      case 'deck':
        return 5000;
      case 'pov':
        return 2500;
      case 'paper':
        return 10000;
      default:
        return 5000;
    }
  }
}
