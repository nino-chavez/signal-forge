/**
 * Image-Text Layout
 *
 * Header band with title, split layout below — image in a card on the
 * left, text content in a card on the right. Falls back gracefully
 * if no image is provided.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { renderBullets, stripMarkdown } from './helpers.js';

export const renderImageTextSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, spacing, typography, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;
  const headerH = 1.1;

  // Light background
  slide.background = { color: colors.backgroundLight };

  // Header band
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: headerH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Title in header band
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

  // Card geometry
  const cardY = headerH + 0.15;
  const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
  const cardH = H - cardY - spacing.marginBottom - footerReserve + 0.05;
  const gutter = spacing.columnGutter;
  const halfW = (spacing.contentWidth - gutter) / 2;

  // Left card (image)
  const imgX = spacing.marginLeft;
  slide.addShape(pres.ShapeType.roundRect, {
    x: imgX,
    y: cardY,
    w: halfW,
    h: cardH,
    fill: { color: colors.backgroundWhite },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  if (data.image) {
    slide.addImage({
      path: data.image,
      x: imgX + 0.1,
      y: cardY + 0.1,
      w: halfW - 0.2,
      h: cardH - 0.2,
    });
  }

  // Right card (text)
  const textX = spacing.marginLeft + halfW + gutter;
  slide.addShape(pres.ShapeType.roundRect, {
    x: textX,
    y: cardY,
    w: halfW,
    h: cardH,
    fill: { color: colors.backgroundWhite },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  // Right accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: textX,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  let textContentY = cardY + 0.2;

  // Subtitle
  if (data.subtitle) {
    slide.addText(stripMarkdown(data.subtitle), {
      x: textX + 0.2,
      y: textContentY,
      w: halfW - 0.4,
      h: 0.4,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontSecondary,
      italic: true,
      color: colors.textSecondary,
      align: 'left',
      valign: 'top',
    });
    textContentY += 0.5;
  }

  // Bullets
  if (data.bullets && data.bullets.length > 0) {
    const bulletMaxH = cardY + cardH - textContentY - 0.15;
    renderBullets(slide, data.bullets, theme, textContentY, {
      x: textX + 0.2,
      w: halfW - 0.4,
      maxH: bulletMaxH,
    });
  }
};
