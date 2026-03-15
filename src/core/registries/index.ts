/**
 * Registries - Barrel Export
 *
 * Central access point for all Signal Forge registries.
 */

// Registry types
export type {
  BuiltInContentMode,
  ContentModeDefinition,
  Perspective,
  VoiceDefinition,
  WorkflowStep,
  WorkflowDefinition,
  TemplateDefinition,
} from './types.js';

// Mode registry
export {
  registerMode,
  getMode,
  getModeForContentType,
  isContentTypeInMode,
  listModes,
  getAllModes,
  isValidMode,
  getAllContentTypes,
  getDefaultModeId,
} from './mode-registry.js';

// Voice registry
export {
  registerVoice,
  getVoice,
  listVoices,
  hasVoice,
  getVoiceInstructionsFromRegistry,
} from './voice-registry.js';

// Workflow registry
export {
  registerWorkflow,
  getWorkflow,
  getWorkflowForMode,
  listWorkflows,
} from './workflow-registry.js';

// Template registry
export {
  registerTemplate,
  getTemplate,
  getTemplateForType,
  listTemplates,
} from './template-registry.js';
