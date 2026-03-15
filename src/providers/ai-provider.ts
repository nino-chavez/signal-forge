/**
 * Unified AI Provider Interface
 * 
 * Abstraction layer for multiple AI providers (OpenAI, Anthropic, Gemini, Perplexity)
 */

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'perplexity';

export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface GenerateResult {
  content: string;
  provider: AIProvider;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AIProviderInterface {
  /**
   * Generate content using the AI provider
   */
  generate(options: GenerateOptions): Promise<GenerateResult>;

  /**
   * Get the provider name
   */
  getProvider(): AIProvider;

  /**
   * Check if the provider is configured
   */
  isConfigured(): boolean;
}

