import OpenAI from 'openai';
import type { AIProviderInterface, GenerateOptions, GenerateResult } from './ai-provider.js';

export class OpenAIProvider implements AIProviderInterface {
  private client: OpenAI | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (this.apiKey) {
      const baseURL = process.env.OPENAI_BASE_URL || undefined;
      this.client = new OpenAI({ apiKey: this.apiKey, baseURL });
    }
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    const defaultModel = process.env.OPENAI_BASE_URL ? 'anthropic/claude-sonnet-4.6' : 'gpt-4o';
    const model = options.model || defaultModel;
    
    const response = await this.client.chat.completions.create({
      model,
      messages: [
        ...(options.systemInstruction ? [{ role: 'system' as const, content: options.systemInstruction }] : []),
        { role: 'user' as const, content: options.prompt }
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    });

    const choice = response.choices[0];
    if (!choice || !choice.message) {
      throw new Error('No response from OpenAI');
    }

    return {
      content: choice.message.content || '',
      provider: 'openai',
      model: response.model,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  }

  getProvider(): 'openai' {
    return 'openai';
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.client;
  }
}

