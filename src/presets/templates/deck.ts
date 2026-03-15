import type { TemplateDefinition } from '../../core/registries/types.js';

export const deckTemplate: TemplateDefinition = {
  id: 'deck',
  name: 'Strategic Deck',
  description: 'Slide deck structure with tension, context, pattern, framework, recommendations, and questions',
  forContentTypes: ['deck', 'tech-deck'],
  structure: {
    slides: [
      {
        title: '',
        content: [],
        type: 'title',
      },
      {
        title: 'The Tension',
        content: [
          "What's the uncomfortable truth?",
          'What question needs answering?',
          'Why does this matter now?',
        ],
        type: 'section',
      },
      {
        title: 'The Context',
        content: [
          'What prompted this?',
          'Current state vs. desired state',
          'Stakeholder landscape',
        ],
        type: 'content',
      },
      {
        title: 'The Pattern',
        content: [
          'Pattern recognition across examples',
          '"I\'ve noticed X across Y situations"',
          'Evidence/data points',
        ],
        type: 'content',
      },
      {
        title: 'The Framework',
        content: [
          'How to think about this',
          'Provisional approach ("Here\'s what I think—for now")',
          'Not prescriptive, but directional',
        ],
        type: 'content',
      },
      {
        title: 'The Recommendations',
        content: [
          'Clear, actionable next steps',
          'Acknowledge trade-offs',
          '"Your mileage may vary" language',
        ],
        type: 'content',
      },
      {
        title: 'The Questions',
        content: [
          'What we\'re still figuring out',
          'Open questions for discussion',
          'Invitation to think alongside',
        ],
        type: 'conclusion',
      },
    ],
  },
};
