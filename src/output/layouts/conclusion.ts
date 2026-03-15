/**
 * Conclusion Layout
 *
 * Dark background with a primary-colored title band at the top,
 * highlight accent bars, and centered next-steps content in a
 * subtle card panel.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { renderBullets, stripMarkdown } from './helpers.js';

export const renderConclusionSlide: LayoutFunction = (pres, slide, data, theme) => {
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

  // Primary title band
  const bandY = 0.06;
  const bandH = 1.2;
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: bandY, w: W, h: bandH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Title text in band
  slide.addText(stripMarkdown(data.title), {
    x: spacing.marginLeft + 0.15,
    y: bandY + 0.1,
    w: spacing.contentWidth - 0.3,
    h: bandH - 0.2,
    fontSize: typography.sizes.sectionTitle,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.textInverse,
    align: 'center',
    valign: 'middle',
    autoFit: true,
  });

  // Content area — subtle card for bullets
  if (data.bullets && data.bullets.length > 0) {
    const cardY = bandY + bandH + 0.3;
    const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
    const cardH = H - cardY - spacing.marginBottom - footerReserve - 0.1;
    const cardW = spacing.contentWidth * 0.7;
    const cardX = spacing.marginLeft + (spacing.contentWidth - cardW) / 2;

    // Subtle dark card
    slide.addShape(pres.ShapeType.roundRect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: colors.backgroundDark },
      line: { width: 0 },
      rectRadius: 0.08,
    });

    // Accent bar on card
    slide.addShape(pres.ShapeType.rect, {
      x: cardX,
      y: cardY,
      w: 0.06,
      h: cardH,
      fill: { color: colors.highlight },
      line: { width: 0 },
    });

    renderBullets(slide, data.bullets, theme, cardY + 0.2, {
      x: cardX + 0.25,
      w: cardW - 0.5,
      maxH: cardH - 0.4,
      color: colors.textMuted,
    });
  }

  // Bottom highlight bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: H - 0.06, w: W, h: 0.06,
    fill: { color: colors.highlight },
    line: { width: 0 },
  });
};
