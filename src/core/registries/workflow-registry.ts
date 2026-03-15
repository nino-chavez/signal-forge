/**
 * Workflow Registry
 *
 * Central registry for content generation workflow definitions.
 * Workflows define the ordered chain of roles that content passes
 * through during generation.
 *
 * Built-in workflows are registered at startup via registerBuiltInPresets().
 * Custom workflows can be registered at runtime via registerWorkflow().
 */

import type { WorkflowDefinition } from './types.js';

const workflows = new Map<string, WorkflowDefinition>();

// Reverse lookup: mode -> workflow id
let modeToWorkflowCache: Map<string, string> | null = null;

function invalidateCache(): void {
  modeToWorkflowCache = null;
}

function buildModeToWorkflowMap(): Map<string, string> {
  if (modeToWorkflowCache) return modeToWorkflowCache;
  const map = new Map<string, string>();
  for (const workflow of workflows.values()) {
    for (const mode of workflow.forModes) {
      map.set(mode, workflow.id);
    }
  }
  modeToWorkflowCache = map;
  return map;
}

/**
 * Register a workflow definition.
 */
export function registerWorkflow(definition: WorkflowDefinition): void {
  workflows.set(definition.id, definition);
  invalidateCache();
}

/**
 * Get a workflow definition by ID. Returns undefined if not found.
 */
export function getWorkflow(id: string): WorkflowDefinition | undefined {
  return workflows.get(id);
}

/**
 * Get the workflow for a given content mode.
 * Returns undefined if no workflow is registered for the mode.
 */
export function getWorkflowForMode(mode: string): WorkflowDefinition | undefined {
  const map = buildModeToWorkflowMap();
  const workflowId = map.get(mode);
  if (!workflowId) return undefined;
  return workflows.get(workflowId);
}

/**
 * List all registered workflows with metadata.
 */
export function listWorkflows(): Array<{ id: string; name: string; description: string; forModes: string[] }> {
  return Array.from(workflows.values()).map((w) => ({
    id: w.id,
    name: w.name,
    description: w.description,
    forModes: w.forModes,
  }));
}
