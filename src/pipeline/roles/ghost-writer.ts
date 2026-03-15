import type { AIProviderInterface, GenerateOptions } from '../../providers/ai-provider.js';
import { getVoiceInstructions } from '../../content/voice/voice-guide.js';
import { loadConfig } from '../../core/config.js';
import { getModeForContentType } from '../../core/registries/mode-registry.js';

export interface GhostWriterInput {
  rawContent: string;
  contentType: 'deck' | 'pov' | 'paper';
  context?: string;
  audience?: string;
}

export interface GhostWriterOutput {
  draft: string;
  alternativeAngles?: string[];
  metadata?: {
    provider: string;
    model?: string;
  };
}

/**
 * Ghost Writer Role
 *
 * Generates initial content from raw input (meeting notes, recaps, etc.)
 * Applies voice principles from the start
 * May generate multiple angles/approaches
 */
export class GhostWriter {
  constructor(private provider: AIProviderInterface) {}

  async generate(input: GhostWriterInput): Promise<GhostWriterOutput> {
    const systemInstruction = this.buildSystemInstruction(input);
    const prompt = this.buildPrompt(input);

    const options: GenerateOptions = {
      prompt,
      systemInstruction,
      temperature: 0.8, // Higher creativity for initial generation
      maxTokens: this.getMaxTokens(input.contentType),
    };

    const result = await this.provider.generate(options);

    return {
      draft: result.content,
      metadata: {
        provider: result.provider,
        model: result.model,
      },
    };
  }

  private buildSystemInstruction(input: GhostWriterInput): string {
    const mode = getModeForContentType(input.contentType);
    const voiceInstructions = getVoiceInstructions(mode);
    const contentTypeInstructions = this.getContentTypeInstructions(input.contentType);

    const config = loadConfig();
    const { author } = config;

    return `You are ${author}'s Ghost Writer for strategic content. Your role is to:

1. **Absorb Context**: Read meeting notes, recaps, stakeholder concerns, and raw data
2. **Identify Key Themes**: Find the central ideas and arguments
3. **Structure Strategically**: Choose the right structure based on content type (${input.contentType})
4. **Generate in Voice**: Write in the appropriate voice for ${mode} content
5. **Multiple Angles**: Consider different approaches to the same content

${voiceInstructions}

${contentTypeInstructions}

${input.audience ? `Target Audience: ${input.audience}` : ''}`;
  }

  private buildPrompt(input: GhostWriterInput): string {
    const mode = getModeForContentType(input.contentType);

    let prompt = `Generate strategic content from the following input:\n\n`;

    if (input.context) {
      prompt += `Context: ${input.context}\n\n`;
    }

    prompt += `Raw Input:\n${input.rawContent}\n\n`;

    prompt += `Generate ${input.contentType} content in ${mode} mode that:\n`;
    prompt += `- Follows the voice guidelines provided\n`;
    prompt += `- Uses bold headers for structure\n`;
    prompt += `- Grounds content in actual experience\n`;
    prompt += `- Is appropriate for the target audience\n`;

    return prompt;
  }

  private getContentTypeInstructions(contentType: 'deck' | 'pov' | 'paper'): string {
    switch (contentType) {
      case 'deck':
        return `Content Type: Strategic Deck/Slides
- Each slide should have one clear message
- Use slide titles as questions or tensions
- Bullet points as fragments (not full sentences)
- Show evolution ("We used to think X, now Y")
- Pattern recognition highlighted`;

      case 'pov':
        return `Content Type: Short-Form Strategy POV (800-1200 words)
- Executive-friendly format
- Clear strategic recommendations upfront
- Concise but compelling evidence
- Actionable next steps
- Conversational but strategic tone`;

      case 'paper':
        return `Content Type: Long-Form Strategy Paper (3000-8000 words)
- Deep strategic thinking
- Detailed frameworks
- Comprehensive examples
- Nuances and edge cases explored
- Thoughtful conclusions`;

      default:
        return '';
    }
  }

  private getMaxTokens(contentType: 'deck' | 'pov' | 'paper'): number {
    switch (contentType) {
      case 'deck':
        return 4000;
      case 'pov':
        return 2000;
      case 'paper':
        return 8000;
      default:
        return 4000;
    }
  }
}
