/**
 * Layout Function Type Signature
 *
 * Every layout function receives the PptxGenJS presentation instance,
 * a fresh slide, the slide data, and the resolved theme. It renders
 * content onto the slide using PptxGenJS API calls.
 */

import type PptxGenJS from 'pptxgenjs';
import type { SlideData } from '../../content/templates/slide-model.js';
import type { PresentationTheme } from '../../content/design-system/theme-types.js';

export type LayoutFunction = (
  pres: PptxGenJS,
  slide: PptxGenJS.Slide,
  data: SlideData,
  theme: PresentationTheme,
) => void;
