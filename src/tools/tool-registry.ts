/**
 * Tool Registry
 *
 * Central registry for agent tools. Provides discovery, registration,
 * and execution of tools that agents can use.
 */

import type { AgentTool, ToolParams, ToolResult } from '../core/types/index.js';

// =============================================================================
// Tool Registry
// =============================================================================

export class ToolRegistry {
  private readonly tools: Map<string, AgentTool> = new Map();
  private readonly categories: Map<string, Set<string>> = new Map();

  /**
   * Register a tool
   */
  register(tool: AgentTool, category?: string): void {
    this.tools.set(tool.name, tool);

    if (category) {
      if (!this.categories.has(category)) {
        this.categories.set(category, new Set());
      }
      this.categories.get(category)!.add(tool.name);
    }
  }

  /**
   * Register multiple tools
   */
  registerAll(tools: AgentTool[], category?: string): void {
    for (const tool of tools) {
      this.register(tool, category);
    }
  }

  /**
   * Get a tool by name
   */
  get(name: string): AgentTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Check if a tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Execute a tool
   */
  async execute(name: string, params: ToolParams): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${name}`,
      };
    }

    try {
      return await tool.execute(params);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * List all tools
   */
  list(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * List tools by category
   */
  listByCategory(category: string): AgentTool[] {
    const toolNames = this.categories.get(category);
    if (!toolNames) return [];

    return Array.from(toolNames)
      .map((name) => this.tools.get(name))
      .filter((tool): tool is AgentTool => tool !== undefined);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  /**
   * Get tool descriptions for AI context
   */
  getToolDescriptions(): string {
    const descriptions: string[] = [];

    for (const tool of this.tools.values()) {
      descriptions.push(`- ${tool.name}: ${tool.description}`);
    }

    return descriptions.join('\n');
  }

  /**
   * Remove a tool
   */
  unregister(name: string): boolean {
    const tool = this.tools.get(name);
    if (!tool) return false;

    this.tools.delete(name);

    // Remove from categories
    for (const [, toolNames] of this.categories) {
      toolNames.delete(name);
    }

    return true;
  }

  /**
   * Clear all tools
   */
  clear(): void {
    this.tools.clear();
    this.categories.clear();
  }

  /**
   * Get registry size
   */
  size(): number {
    return this.tools.size;
  }
}

// =============================================================================
// Global Registry Instance
// =============================================================================

let globalRegistry: ToolRegistry | null = null;

/**
 * Get the global tool registry
 */
export function getToolRegistry(): ToolRegistry {
  if (!globalRegistry) {
    globalRegistry = new ToolRegistry();
  }
  return globalRegistry;
}

/**
 * Create a new tool registry
 */
export function createToolRegistry(): ToolRegistry {
  return new ToolRegistry();
}

// =============================================================================
// Tool Builder Helper
// =============================================================================

export interface ToolBuilder {
  name: string;
  description: string;
  execute: (params: ToolParams) => Promise<ToolResult>;
}

/**
 * Create a tool from a builder
 */
export function createTool(builder: ToolBuilder): AgentTool {
  return {
    name: builder.name,
    description: builder.description,
    execute: builder.execute,
  };
}

// =============================================================================
// Tool Composition Helpers
// =============================================================================

/**
 * Create a tool that runs multiple tools in sequence
 */
export function createSequentialTool(
  name: string,
  description: string,
  tools: AgentTool[]
): AgentTool {
  return {
    name,
    description,
    execute: async (params: ToolParams): Promise<ToolResult> => {
      const results: unknown[] = [];

      for (const tool of tools) {
        const result = await tool.execute(params);
        if (!result.success) {
          return {
            success: false,
            error: `Tool ${tool.name} failed: ${result.error}`,
            data: results,
          };
        }
        results.push(result.data);
      }

      return {
        success: true,
        data: results,
      };
    },
  };
}

/**
 * Create a tool that runs multiple tools in parallel
 */
export function createParallelTool(
  name: string,
  description: string,
  tools: AgentTool[]
): AgentTool {
  return {
    name,
    description,
    execute: async (params: ToolParams): Promise<ToolResult> => {
      const results = await Promise.allSettled(
        tools.map((tool) => tool.execute(params))
      );

      const data: unknown[] = [];
      const errors: string[] = [];

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            data.push(result.value.data);
          } else {
            errors.push(`${tools[i].name}: ${result.value.error}`);
          }
        } else {
          errors.push(`${tools[i].name}: ${result.reason}`);
        }
      }

      return {
        success: errors.length === 0,
        data,
        error: errors.length > 0 ? errors.join('; ') : undefined,
      };
    },
  };
}

/**
 * Create a tool with retry logic
 */
export function createRetryTool(
  tool: AgentTool,
  maxRetries: number = 3,
  delayMs: number = 1000
): AgentTool {
  return {
    name: tool.name,
    description: tool.description,
    execute: async (params: ToolParams): Promise<ToolResult> => {
      let lastError: string | undefined;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await tool.execute(params);
        if (result.success) {
          return result;
        }

        lastError = result.error;

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        }
      }

      return {
        success: false,
        error: `Failed after ${maxRetries} attempts: ${lastError}`,
      };
    },
  };
}
