import type { AIProvider, AIProviderInterface } from './ai-provider.js';
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { GeminiProvider } from './gemini.js';
import { PerplexityProvider } from './perplexity.js';

/**
 * Create an AI provider instance
 */
export function createProvider(provider: AIProvider, apiKey?: string): AIProviderInterface {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'anthropic':
      return new AnthropicProvider(apiKey);
    case 'google':
      return new GeminiProvider(apiKey);
    case 'perplexity':
      return new PerplexityProvider(apiKey);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Get the default provider from environment
 */
export function getDefaultProvider(): AIProvider {
  const defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'anthropic';
  if (['openai', 'anthropic', 'google', 'perplexity'].includes(defaultProvider)) {
    return defaultProvider as AIProvider;
  }
  return 'anthropic';
}

/**
 * Get all configured providers
 */
export function getConfiguredProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  if (process.env.GOOGLE_API_KEY) providers.push('google');
  if (process.env.PERPLEXITY_API_KEY) providers.push('perplexity');
  
  return providers;
}

