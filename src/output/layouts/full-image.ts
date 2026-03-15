/**
 * Full-Image Layout
 *
 * Full-bleed image with a dark gradient overlay at bottom and
 * highlight accent bars for visual rhythm. Title overlaid on
 * the dark region.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { stripMarkdown } from './helpers.js';

export const renderFullImageSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, typography, spacing, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;

  // Dark background as fallback if image fails
  slide.background = { color: colors.dark };

  // Full-bleed image
  if (data.image) {
    slide.addImage({
      path: data.image,
      x: 0,
      y: 0,
      w: W,
      h: H,
    });
  }

  // Top highlight bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });

  // Dark overlay at bottom
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: H * 0.55,
    w: W,
    h: H * 0.45,
    fill: { color: colors.dark, transparency: 20 },
    line: { width: 0 },
  });

  // Primary-color accent bar above text area
  slide.addShape(pres.ShapeType.rect, {
    x: spacing.marginLeft, y: H * 0.58, w: 0.8, h: 0.06,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Title text over overlay
  slide.addText(stripMarkdown(data.title), {
    x: spacing.marginLeft,
    y: H * 0.62,
    w: spacing.contentWidth,
    h: 0.8,
    fontSize: typography.sizes.slideTitle,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.textInverse,
    align: 'left',
    valign: 'middle',
    autoFit: true,
  });

  // Subtitle / caption
  const caption = data.subtitle || data.imageAlt;
  if (caption) {
    slide.addText(stripMarkdown(caption), {
      x: spacing.marginLeft,
      y: H * 0.62 + 0.9,
      w: spacing.contentWidth * 0.7,
      h: 0.5,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontSecondary,
      color: colors.textMuted,
      align: 'left',
    });
  }

  // Bottom highlight bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: H - 0.06, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });
};
