import type { TemplateDefinition } from '../../core/registries/types.js';

export const paperTemplate: TemplateDefinition = {
  id: 'paper',
  name: 'Strategy Paper',
  description: 'Long-form strategy paper with executive summary, deep dives, and provisional conclusions',
  forContentTypes: ['paper', 'post', 'article'],
  structure: {
    sections: [
      'executiveSummary',
      'introduction',
      'context',
      'patternRecognition',
      'framework',
      'deepDive',
      'implementation',
      'questions',
      'conclusion',
    ],
  },
};
