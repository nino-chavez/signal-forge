/**
 * Built-in Presets
 *
 * Registers all built-in content mode definitions, voice definitions,
 * workflow definitions, and template definitions.
 *
 * Call registerBuiltInPresets() at application startup before any
 * classification or content generation occurs.
 */

import { registerMode } from '../core/registries/mode-registry.js';
import { registerVoice } from '../core/registries/voice-registry.js';
import { registerWorkflow } from '../core/registries/workflow-registry.js';
import { registerTemplate } from '../core/registries/template-registry.js';

// Mode presets
import { thoughtLeadershipMode } from './modes/thought-leadership.js';
import { architectureMode } from './modes/architecture.js';
import { advisoryMode } from './modes/advisory.js';
import { documentationMode } from './modes/documentation.js';

// Voice presets
import { thoughtLeadershipVoice } from './voices/thought-leadership.js';
import { architectureVoice } from './voices/architecture.js';
import { advisoryVoice } from './voices/advisory.js';
import { documentationVoice } from './voices/documentation.js';

// Workflow presets
import { standardWorkflow } from './workflows/standard.js';
import { documentationWorkflow } from './workflows/documentation.js';

// Template presets
import { deckTemplate } from './templates/deck.js';
import { povTemplate } from './templates/pov.js';
import { paperTemplate } from './templates/paper.js';

let registered = false;

/**
 * Register all built-in presets. Safe to call multiple times (idempotent).
 */
export function registerBuiltInPresets(): void {
  if (registered) return;

  // Content modes
  registerMode(thoughtLeadershipMode);
  registerMode(architectureMode);
  registerMode(advisoryMode);
  registerMode(documentationMode);

  // Voices
  registerVoice(thoughtLeadershipVoice);
  registerVoice(architectureVoice);
  registerVoice(advisoryVoice);
  registerVoice(documentationVoice);

  // Workflows
  registerWorkflow(standardWorkflow);
  registerWorkflow(documentationWorkflow);

  // Templates
  registerTemplate(deckTemplate);
  registerTemplate(povTemplate);
  registerTemplate(paperTemplate);

  registered = true;
}
