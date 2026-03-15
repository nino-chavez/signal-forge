import type { TemplateDefinition } from '../../core/registries/types.js';

export const povTemplate: TemplateDefinition = {
  id: 'pov',
  name: 'Point of View',
  description: 'Short-form strategy POV with opening hook, context, pattern, framework, and recommendations',
  forContentTypes: ['pov', 'brief'],
  structure: {
    sections: [
      'openingHook',
      'context',
      'pattern',
      'framework',
      'recommendations',
      'questions',
      'nextSteps',
    ],
  },
};
