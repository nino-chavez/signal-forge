/**
 * PPTX Engine
 *
 * Orchestrates theme resolution, content parsing, layout dispatch,
 * and footer/logo rendering to produce a themed PowerPoint deck.
 *
 * ```
 * Content (Markdown)
 *       ↓
 *  parseDeckFromMarkdownV2()  → DeckData (theme-agnostic)
 *       ↓
 *  renderDeckToPptx()         ← getTheme(themeId)
 *       ↓
 *  Layout Registry            → selects layout function per slide
 *       ↓
 *  Layout Functions           ← receives SlideData + PresentationTheme
 *       ↓
 *  PptxGenJS API calls        → .pptx file
 * ```
 */

import PptxGenJS from 'pptxgenjs';
import { parseDeckFromMarkdownV2 } from '../../content/templates/slide-model.js';
import type { DeckData } from '../../content/templates/slide-model.js';
import { getTheme } from '../../content/design-system/theme-registry.js';
import type { PresentationTheme } from '../../content/design-system/theme-types.js';
import { getLayoutFunction } from '../layouts/index.js';
import { addFooter, addLogo } from '../layouts/helpers.js';

export interface RenderDeckOptions {
  /** Markdown content to parse into slides */
  content: string;
  /** Deck title (used for presentation metadata) */
  title: string;
  /** Output file path */
  outputPath: string;
  /** Theme ID (default: 'signal-forge') */
  themeId?: string;
  /** Author name for PPTX metadata */
  author?: string;
  /** Pre-parsed deck data (skips markdown parsing if provided) */
  deck?: DeckData;
}

/**
 * Render a deck to a .pptx file using the theme engine.
 */
export async function renderDeckToPptx(options: RenderDeckOptions): Promise<void> {
  const { content, title, outputPath, themeId, author } = options;

  // Resolve theme
  const theme: PresentationTheme = getTheme(themeId);

  // Parse content into structured slides (or use pre-parsed)
  const deck: DeckData = options.deck ?? parseDeckFromMarkdownV2(content);

  // Create presentation
  const PptxGen = (PptxGenJS as any).default || PptxGenJS;
  const pres = new PptxGen();
  pres.author = author || '';
  pres.title = title || deck.title;

  // Set custom layout matching theme dimensions
  const layoutName = `THEME_${theme.id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
  pres.defineLayout({
    name: layoutName,
    width: theme.dimensions.width,
    height: theme.dimensions.height,
  });
  pres.layout = layoutName;

  const totalSlides = deck.slides.length;

  // Render each slide
  for (let i = 0; i < deck.slides.length; i++) {
    const slideData = deck.slides[i];
    const pptxSlide = pres.addSlide();

    // Dispatch to layout function
    const layoutFn = getLayoutFunction(slideData.layout);
    layoutFn(pres, pptxSlide, slideData, theme);

    // Add footer + slide number (skip title slide)
    if (slideData.layout !== 'title') {
      addFooter(pptxSlide, theme, i + 1, totalSlides);
    }

    // Add logo (skip title and full-image slides)
    if (slideData.layout !== 'title' && slideData.layout !== 'full-image') {
      addLogo(pptxSlide, theme);
    }

    // Speaker notes
    if (slideData.notes) {
      pptxSlide.addNotes(slideData.notes);
    }
  }

  // Write file
  await pres.writeFile({ fileName: outputPath });
}
