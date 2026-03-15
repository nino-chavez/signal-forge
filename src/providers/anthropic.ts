import Anthropic from '@anthropic-ai/sdk';
import type { AIProviderInterface, GenerateOptions, GenerateResult } from './ai-provider.js';

export class AnthropicProvider implements AIProviderInterface {
  private client: Anthropic | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    if (this.apiKey) {
      this.client = new Anthropic({ apiKey: this.apiKey });
    }
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    if (!this.client) {
      throw new Error('Anthropic API key not configured');
    }

    const model = options.model || 'claude-sonnet-4-5-20250929';
    
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: options.prompt }
    ];

    const response = await this.client.messages.create({
      model: model as any,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.7,
      system: options.systemInstruction,
      messages,
    });

    const content = response.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('No text response from Anthropic');
    }

    return {
      content: content.text,
      provider: 'anthropic',
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  getProvider(): 'anthropic' {
    return 'anthropic';
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.client;
  }
}

