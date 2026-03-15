import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProviderInterface, GenerateOptions, GenerateResult } from './ai-provider.js';

export class GeminiProvider implements AIProviderInterface {
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_API_KEY || '';
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    if (!this.client) {
      throw new Error('Google API key not configured');
    }

    const modelName = options.model || 'gemini-1.5-pro';
    const model = this.client.getGenerativeModel({ 
      model: modelName,
      systemInstruction: options.systemInstruction,
    });

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    return {
      content: text,
      provider: 'google',
      model: modelName,
    };
  }

  getProvider(): 'google' {
    return 'google';
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.client;
  }
}

