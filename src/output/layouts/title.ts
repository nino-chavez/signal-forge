/**
 * Title Layout
 *
 * Two-tone hero slide — left panel in primary color with title text,
 * right panel in dark with accent shapes. Creates visual weight
 * and brand presence.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { stripMarkdown } from './helpers.js';

export const renderTitleSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, typography, spacing, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;
  const splitX = W * 0.6;

  // Left panel — primary color
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: splitX, h: H,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Right panel — dark
  slide.addShape(pres.ShapeType.rect, {
    x: splitX, y: 0, w: W - splitX, h: H,
    fill: { color: colors.dark },
    line: { width: 0 },
  });

  // Decorative accent bar on right panel
  slide.addShape(pres.ShapeType.rect, {
    x: splitX, y: H * 0.35, w: 0.08, h: H * 0.3,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });

  // Title text — left panel, vertically centered
  slide.addText(data.title, {
    x: spacing.marginLeft + 0.2,
    y: H * 0.25,
    w: splitX - spacing.marginLeft - 0.6,
    h: H * 0.35,
    fontSize: typography.sizes.hero,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.textInverse,
    align: 'left',
    valign: 'middle',
    autoFit: true,
  });

  // Subtitle — below title on left panel
  const subtitle = data.subtitle || (data.bullets && data.bullets.length > 0 ? stripMarkdown(data.bullets[0]) : undefined);
  if (subtitle) {
    slide.addText(subtitle, {
      x: spacing.marginLeft + 0.2,
      y: H * 0.62,
      w: splitX - spacing.marginLeft - 0.6,
      h: H * 0.15,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontSecondary,
      color: colors.textInverse,
      align: 'left',
      valign: 'top',
      autoFit: true,
    });
  }

  // Bottom highlight bar spanning full width
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: H - 0.06, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });
};
