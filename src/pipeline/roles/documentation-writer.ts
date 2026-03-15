import type { AIProviderInterface, GenerateOptions } from '../../providers/ai-provider.js';
import { getVoiceInstructionsForMode } from '../../content/voice/mode-voice-checker.js';

export type DocumentationType = 'guide' | 'reference' | 'tutorial';

export interface DocumentationWriterInput {
  rawContent: string;
  documentationType: DocumentationType;
  context?: string;
  audience?: string;
  productName?: string;
}

export interface DocumentationWriterOutput {
  draft: string;
  metadata?: {
    provider: string;
    model?: string;
  };
}

/**
 * Documentation Writer Role
 *
 * Generates user-focused documentation from raw input.
 * Uses instructional voice - direct, clear, actionable.
 * Optimized for guides, tutorials, and reference materials.
 */
export class DocumentationWriter {
  constructor(private provider: AIProviderInterface) {}

  async generate(input: DocumentationWriterInput): Promise<DocumentationWriterOutput> {
    const systemInstruction = this.buildSystemInstruction(input);
    const prompt = this.buildPrompt(input);

    const options: GenerateOptions = {
      prompt,
      systemInstruction,
      temperature: 0.5, // Lower creativity for consistency
      maxTokens: this.getMaxTokens(input.documentationType),
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

  private buildSystemInstruction(input: DocumentationWriterInput): string {
    const voiceInstructions = getVoiceInstructionsForMode('documentation');
    const typeInstructions = this.getTypeInstructions(input.documentationType);
    const productName = input.productName || 'the product';

    return `You are a Technical Documentation Writer. Your role is to:

1. **Focus on User Tasks**: Write about what users need to DO, not what the system IS
2. **Be Direct**: Use imperative voice - "Run this command" not "The command can be run"
3. **Show First, Explain After**: Lead with examples, follow with context
4. **Structure for Scanning**: Headers, numbered steps, tables, code blocks
5. **Make It Copy-Paste Ready**: All commands and code should work as-is

${voiceInstructions}

${typeInstructions}

**Product Context**: ${productName}
${input.audience ? `**Target Audience**: ${input.audience}` : ''}

**Voice Markers to Include**:
- Imperative verbs at step starts (Run, Install, Configure, Create, Add)
- Numbered steps for all procedures
- Code blocks with proper syntax highlighting
- Tables for options, commands, parameters
- Direct "you" address
- Expected output shown after commands

**Voice Markers to Avoid**:
- Questions or tension openings
- Provisional language ("for now," "here's where I've landed")
- Exploratory patterns ("I've been thinking about...")
- First person reflection ("I used to think...")
- Academic distance ("Research shows...")
- Corporate jargon without explanation

**Structure Requirements**:
- Clear hierarchy with H2 and H3 headers
- Quick Start section near the top
- Examples in every section
- Troubleshooting section at the end
- No walls of text - break up with code, lists, tables`;
  }

  private buildPrompt(input: DocumentationWriterInput): string {
    let prompt = `Generate ${input.documentationType} documentation from the following input:\n\n`;

    if (input.context) {
      prompt += `Context: ${input.context}\n\n`;
    }

    prompt += `Raw Input:\n${input.rawContent}\n\n`;

    prompt += `Generate ${input.documentationType} documentation that:\n`;
    prompt += `- Opens with what the user will accomplish\n`;
    prompt += `- Includes a Quick Start section\n`;
    prompt += `- Uses numbered steps for all procedures\n`;
    prompt += `- Has code blocks that are copy-paste ready\n`;
    prompt += `- Uses tables for options and commands\n`;
    prompt += `- Includes expected output where relevant\n`;
    prompt += `- Ends with troubleshooting tips\n`;

    return prompt;
  }

  private getTypeInstructions(documentationType: DocumentationType): string {
    switch (documentationType) {
      case 'guide':
        return `**Document Type: User Guide**
Structure:
1. Overview (2-3 sentences on what this does)
2. Quick Start (get running in 60 seconds)
3. Core Concepts (what users need to understand)
4. Features (detailed feature explanations)
5. Examples (real-world usage scenarios)
6. Troubleshooting (common issues and solutions)

Style:
- Comprehensive but scannable
- Progressive disclosure (basic → advanced)
- Every concept with an example`;

      case 'reference':
        return `**Document Type: Reference Documentation**
Structure:
1. Commands table (all commands with brief descriptions)
2. Options table (all options with defaults)
3. Examples section (common command patterns)
4. Troubleshooting (quick fixes)

Style:
- Ultra-scannable - tables preferred
- No narrative explanation
- Every option documented
- Copy-paste examples for every command`;

      case 'tutorial':
        return `**Document Type: Tutorial**
Structure:
1. Goal (what you'll build/accomplish)
2. Prerequisites (what you need before starting)
3. Steps (numbered, detailed steps)
4. Verification (how to confirm success)
5. Next Steps (where to go from here)

Style:
- Single learning objective
- Detailed enough to follow blind
- Show expected output at each step
- Celebrate completion`;

      default:
        return '';
    }
  }

  private getMaxTokens(documentationType: DocumentationType): number {
    switch (documentationType) {
      case 'guide':
        return 6000;
      case 'reference':
        return 4000;
      case 'tutorial':
        return 3000;
      default:
        return 4000;
    }
  }
}
