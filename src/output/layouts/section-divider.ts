/**
 * Section Divider Layout
 *
 * Deep dark background with centered title and a highlight-colored
 * accent bar for visual punctuation. Pure visual break.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { stripMarkdown } from './helpers.js';

export const renderSectionDividerSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, typography, spacing, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;

  slide.background = { color: colors.dark };

  // Highlight accent bar — top
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });

  // Decorative side accent
  slide.addShape(pres.ShapeType.rect, {
    x: spacing.marginLeft, y: H * 0.4, w: 0.08, h: H * 0.2,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Section title
  slide.addText(data.title, {
    x: spacing.marginLeft + 0.3,
    y: H * 0.32,
    w: spacing.contentWidth - 0.6,
    h: H * 0.36,
    fontSize: typography.sizes.sectionTitle,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.textInverse,
    align: 'left',
    valign: 'middle',
    autoFit: true,
  });

  // Subtitle (short, truncated)
  const raw = data.subtitle || (data.bullets && data.bullets[0]);
  if (raw) {
    let subtitle = stripMarkdown(raw);
    if (subtitle.length > 120) subtitle = subtitle.slice(0, 117) + '...';
    slide.addText(subtitle, {
      x: spacing.marginLeft + 0.3,
      y: H * 0.68,
      w: spacing.contentWidth * 0.7,
      h: 0.6,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontSecondary,
      color: colors.textMuted,
      align: 'left',
      valign: 'top',
      autoFit: true,
    });
  }

  // Bottom highlight bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: H - 0.06, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });
};
