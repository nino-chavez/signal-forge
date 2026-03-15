import type { WorkflowDefinition } from '../../core/registries/types.js';

/**
 * Standard three-pass workflow: Ghost Writer -> Copywriter -> Editor
 *
 * Used for thought leadership, advisory, and architecture content.
 */
export const standardWorkflow: WorkflowDefinition = {
  id: 'standard',
  name: 'Standard Three-Pass',
  description: 'Ghost Writer generates draft, Copywriter refines, Editor reviews',
  forModes: ['thought-leadership', 'advisory', 'architecture'],
  steps: [
    { role: 'ghost-writer' },
    { role: 'copywriter' },
    { role: 'editor' },
  ],
};
