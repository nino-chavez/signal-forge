import type { AIProviderInterface, GenerateOptions, GenerateResult } from './ai-provider.js';

export class PerplexityProvider implements AIProviderInterface {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PERPLEXITY_API_KEY || '';
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key not configured');
    }

    const model = options.model || 'llama-3.1-sonar-large-128k-online';
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(options.systemInstruction ? [{ role: 'system', content: options.systemInstruction }] : []),
          { role: 'user', content: options.prompt }
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${error}`);
    }

    const data = await response.json() as any;
    const choice = data.choices?.[0];
    if (!choice || !choice.message) {
      throw new Error('No response from Perplexity');
    }

    return {
      content: choice.message.content || '',
      provider: 'perplexity',
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    };
  }

  getProvider(): 'perplexity' {
    return 'perplexity';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

