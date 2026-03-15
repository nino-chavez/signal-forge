/**
 * Deck/Slide Template Structure
 */

export interface Slide {
  title: string;
  content: string[];
  type: 'title' | 'content' | 'section' | 'conclusion';
}

export interface DeckStructure {
  title: string;
  subtitle?: string;
  slides: Slide[];
}

export const DECK_TEMPLATE: DeckStructure = {
  title: '',
  subtitle: '',
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
};

export function parseDeckFromMarkdown(markdown: string): DeckStructure {
  const lines = markdown.split('\n');
  const slides: Slide[] = [];
  let currentSlide: Slide | null = null;
  
  for (const line of lines) {
    // Check for slide title (## or ###)
    if (line.match(/^#{2,3}\s+(.+)$/)) {
      if (currentSlide) {
        slides.push(currentSlide);
      }
      const title = line.replace(/^#{2,3}\s+/, '').trim();
      currentSlide = {
        title,
        content: [],
        type: slides.length === 0 ? 'title' : 'content',
      };
    } else if (line.trim() && currentSlide) {
      // Content line
      if (line.trim().startsWith('- ')) {
        currentSlide.content.push(line.trim().substring(2));
      } else if (line.trim().startsWith('* ')) {
        currentSlide.content.push(line.trim().substring(2));
      } else if (line.trim()) {
        currentSlide.content.push(line.trim());
      }
    }
  }
  
  if (currentSlide) {
    slides.push(currentSlide);
  }
  
  return {
    title: slides[0]?.title || '',
    slides: slides, // Include all slides including title slide
  };
}

