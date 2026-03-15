/**
 * Quote Layout
 *
 * Dark background with large decorative quote mark in highlight color,
 * quote text in a centered card panel, and attribution below.
 * Accent bars top and bottom for visual rhythm.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { stripMarkdown } from './helpers.js';

export const renderQuoteSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, typography, spacing, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;

  // Dark background
  slide.background = { color: colors.dark };

  // Top highlight bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });

  // Large decorative quote mark
  slide.addText('\u201C', {
    x: spacing.marginLeft,
    y: H * 0.1,
    w: 1.5,
    h: 1.5,
    fontSize: 120,
    fontFace: typography.fontBold,
    color: colors.highlight,
    align: 'left',
    valign: 'top',
  });

  // Quote card panel
  const cardW = spacing.contentWidth * 0.8;
  const cardX = spacing.marginLeft + (spacing.contentWidth - cardW) / 2;
  const cardY = H * 0.25;
  const cardH = H * 0.4;

  slide.addShape(pres.ShapeType.roundRect, {
    x: cardX,
    y: cardY,
    w: cardW,
    h: cardH,
    fill: { color: colors.backgroundDark },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  // Left accent on card
  slide.addShape(pres.ShapeType.rect, {
    x: cardX,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Quote body text
  const quoteText = stripMarkdown(data.quoteText || data.title);
  slide.addText(quoteText, {
    x: cardX + 0.3,
    y: cardY + 0.2,
    w: cardW - 0.6,
    h: cardH - 0.4,
    fontSize: typography.sizes.slideTitle,
    fontFace: typography.fontPrimary,
    italic: true,
    color: colors.textInverse,
    align: 'left',
    valign: 'middle',
    autoFit: true,
  });

  // Attribution below card
  const attribution = data.quoteAttribution;
  if (attribution) {
    slide.addText(`\u2014 ${stripMarkdown(attribution)}`, {
      x: cardX + 0.3,
      y: cardY + cardH + 0.15,
      w: cardW - 0.6,
      h: 0.5,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontSecondary,
      color: colors.textMuted,
      align: 'right',
    });
  }

  // Bottom highlight bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: H - 0.06, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });
};
