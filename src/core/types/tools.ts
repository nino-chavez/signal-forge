/**
 * Tool Types
 *
 * Types for agent tools and their execution.
 */

export interface AgentTool {
  name: string;
  description: string;
  execute: (params: ToolParams) => Promise<ToolResult>;
}

export interface ToolParams {
  [key: string]: unknown;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
