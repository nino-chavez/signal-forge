/**
 * Content Layout
 *
 * Colored header band with white title, content below on light
 * background with a white card panel. Left accent bar for visual weight.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { renderBullets, stripMarkdown } from './helpers.js';

export const renderContentSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, typography, spacing, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;
  const headerH = 1.1;

  // Light background
  slide.background = { color: colors.backgroundLight };

  // Header band — primary color
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: headerH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Title — white text in header band
  slide.addText(data.title, {
    x: spacing.marginLeft + 0.15,
    y: 0.1,
    w: spacing.contentWidth - 0.3,
    h: headerH - 0.2,
    fontSize: typography.sizes.slideTitle,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.textInverse,
    align: 'left',
    valign: 'middle',
    autoFit: true,
  });

  // White content card
  const cardY = headerH + 0.2;
  const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
  const cardH = H - cardY - spacing.marginBottom - footerReserve + 0.1;

  slide.addShape(pres.ShapeType.roundRect, {
    x: spacing.marginLeft,
    y: cardY,
    w: spacing.contentWidth,
    h: cardH,
    fill: { color: colors.backgroundWhite },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  // Left accent bar on card
  slide.addShape(pres.ShapeType.rect, {
    x: spacing.marginLeft,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Subtitle inside card (if present)
  let contentY = cardY + 0.2;
  if (data.subtitle) {
    slide.addText(stripMarkdown(data.subtitle), {
      x: spacing.marginLeft + 0.3,
      y: contentY,
      w: spacing.contentWidth - 0.6,
      h: 0.4,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontSecondary,
      italic: true,
      color: colors.textSecondary,
      align: 'left',
      valign: 'top',
    });
    contentY += 0.45;
  }

  // Bullets inside card
  if (data.bullets && data.bullets.length > 0) {
    const bulletMaxH = cardY + cardH - contentY - 0.15;
    renderBullets(slide, data.bullets, theme, contentY, {
      x: spacing.marginLeft + 0.3,
      w: spacing.contentWidth - 0.6,
      maxH: bulletMaxH,
    });
  }
};
