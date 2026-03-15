/**
 * Base Agent Abstract Class
 *
 * Foundation for all agents in the agentic content system.
 * Provides common functionality for provider interaction, memory, and tool usage.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import type {
  AgentInput,
  AgentOutput,
  AgentTool,
  AgentType,
  ContentTask,
  MemoryScope,
  ToolParams,
  ToolResult,
} from '../../core/types/index.js';

export interface AgentConfig {
  name: string;
  type: AgentType;
  provider: AIProviderInterface;
  memory?: AgentMemory;
  tools?: AgentTool[];
  maxRetries?: number;
  verbose?: boolean;
}

export interface AgentMemory {
  remember(key: string, value: unknown, scope?: MemoryScope): Promise<void>;
  recall(key: string, scope?: MemoryScope): Promise<unknown>;
  forget(key: string, scope?: MemoryScope): Promise<void>;
  search(pattern: string): Promise<Array<{ key: string; value: unknown }>>;
}

/**
 * Abstract base class for all agents
 */
export abstract class BaseAgent {
  protected readonly name: string;
  protected readonly type: AgentType;
  protected readonly provider: AIProviderInterface;
  protected readonly memory?: AgentMemory;
  protected readonly tools: Map<string, AgentTool>;
  protected readonly maxRetries: number;
  protected readonly verbose: boolean;

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.type = config.type;
    this.provider = config.provider;
    this.memory = config.memory;
    this.tools = new Map();
    this.maxRetries = config.maxRetries ?? 3;
    this.verbose = config.verbose ?? false;

    // Register provided tools
    if (config.tools) {
      for (const tool of config.tools) {
        this.registerTool(tool);
      }
    }
  }

  // ===========================================================================
  // Abstract Methods (must be implemented by subclasses)
  // ===========================================================================

  /**
   * Execute the agent's main task
   */
  abstract execute(input: AgentInput): Promise<AgentOutput>;

  /**
   * Check if this agent can handle the given task
   */
  abstract canHandle(task: ContentTask): boolean;

  // ===========================================================================
  // Tool Management
  // ===========================================================================

  /**
   * Register a tool for this agent
   */
  registerTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
    this.log(`Registered tool: ${tool.name}`);
  }

  /**
   * Use a registered tool
   */
  async useTool(toolName: string, params: ToolParams): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${toolName}`,
      };
    }

    try {
      this.log(`Using tool: ${toolName}`, params);
      const result = await tool.execute(params);
      this.log(`Tool result: ${toolName}`, result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Tool execution failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Check if a tool is available
   */
  hasTool(toolName: string): boolean {
    return this.tools.has(toolName);
  }

  /**
   * Get list of available tools
   */
  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }

  // ===========================================================================
  // Memory Operations
  // ===========================================================================

  /**
   * Store a value in memory
   */
  async remember(key: string, value: unknown, scope: MemoryScope = 'session'): Promise<void> {
    if (!this.memory) {
      this.log('Memory not available, skipping remember operation');
      return;
    }

    try {
      await this.memory.remember(key, value, scope);
      this.log(`Remembered: ${key} (${scope})`);
    } catch (error) {
      this.log(`Failed to remember: ${key}`, error);
    }
  }

  /**
   * Retrieve a value from memory
   */
  async recall(key: string, scope?: MemoryScope): Promise<unknown> {
    if (!this.memory) {
      return undefined;
    }

    try {
      const value = await this.memory.recall(key, scope);
      this.log(`Recalled: ${key} = ${value !== undefined ? 'found' : 'not found'}`);
      return value;
    } catch (error) {
      this.log(`Failed to recall: ${key}`, error);
      return undefined;
    }
  }

  /**
   * Remove a value from memory
   */
  async forget(key: string, scope?: MemoryScope): Promise<void> {
    if (!this.memory) {
      return;
    }

    try {
      await this.memory.forget(key, scope);
      this.log(`Forgot: ${key}`);
    } catch (error) {
      this.log(`Failed to forget: ${key}`, error);
    }
  }

  /**
   * Search memory for matching entries
   */
  async searchMemory(pattern: string): Promise<Array<{ key: string; value: unknown }>> {
    if (!this.memory) {
      return [];
    }

    try {
      return await this.memory.search(pattern);
    } catch (error) {
      this.log(`Failed to search memory: ${pattern}`, error);
      return [];
    }
  }

  // ===========================================================================
  // AI Provider Interaction
  // ===========================================================================

  /**
   * Generate content using the AI provider
   */
  protected async generate(options: {
    prompt: string;
    systemInstruction?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.log(`Generation attempt ${attempt}/${this.maxRetries}`);
        const result = await this.provider.generate(options);
        this.log(`Generated content in ${Date.now() - startTime}ms`);
        return result.content;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.log(`Generation attempt ${attempt} failed: ${lastError.message}`);

        if (attempt < this.maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Generation failed after all retries');
  }

  // ===========================================================================
  // Utility Methods
  // ===========================================================================

  /**
   * Log a message (if verbose mode is enabled)
   */
  protected log(message: string, data?: unknown): void {
    if (this.verbose) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${this.name}]`;
      if (data !== undefined) {
        console.log(prefix, message, JSON.stringify(data, null, 2));
      } else {
        console.log(prefix, message);
      }
    }
  }

  /**
   * Sleep for a specified duration
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Create a success output
   */
  protected successOutput(content: string, metadata?: Record<string, unknown>): AgentOutput {
    return {
      agentType: this.type,
      success: true,
      content,
      metadata,
    };
  }

  /**
   * Create a failure output
   */
  protected failureOutput(error: string, metadata?: Record<string, unknown>): AgentOutput {
    return {
      agentType: this.type,
      success: false,
      error,
      metadata,
    };
  }

  /**
   * Get agent info
   */
  getInfo(): { name: string; type: AgentType; tools: string[] } {
    return {
      name: this.name,
      type: this.type,
      tools: this.getAvailableTools(),
    };
  }
}

/**
 * Simple in-memory implementation of AgentMemory for session scope
 */
export class SimpleMemory implements AgentMemory {
  private store: Map<string, unknown> = new Map();

  async remember(key: string, value: unknown): Promise<void> {
    this.store.set(key, value);
  }

  async recall(key: string): Promise<unknown> {
    return this.store.get(key);
  }

  async forget(key: string): Promise<void> {
    this.store.delete(key);
  }

  async search(pattern: string): Promise<Array<{ key: string; value: unknown }>> {
    const regex = new RegExp(pattern, 'i');
    const results: Array<{ key: string; value: unknown }> = [];

    for (const [key, value] of this.store.entries()) {
      if (regex.test(key)) {
        results.push({ key, value });
      }
    }

    return results;
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}
