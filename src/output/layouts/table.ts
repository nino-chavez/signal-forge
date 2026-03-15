/**
 * Table Layout
 *
 * Colored header band with title, formatted data table in a white
 * card panel, optional bullets below the table.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { stripMarkdown, renderBullets } from './helpers.js';

export const renderTableSlide: LayoutFunction = (pres, slide, data, theme) => {
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

  if (!data.table) return;

  const { headers, rows } = data.table;
  const colCount = headers.length || 1;
  const colW = spacing.contentWidth / colCount;
  const tableFontSize = Math.min(typography.sizes.body, 10);

  // White card for table
  const cardY = headerH + 0.15;
  const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
  const hasBullets = data.bullets && data.bullets.length > 0;
  const bulletReserve = hasBullets ? 1.2 : 0;
  const cardH = H - cardY - spacing.marginBottom - footerReserve - bulletReserve + 0.05;

  slide.addShape(pres.ShapeType.roundRect, {
    x: spacing.marginLeft,
    y: cardY,
    w: spacing.contentWidth,
    h: cardH,
    fill: { color: colors.backgroundWhite },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  // Build table rows
  const tableRows: PptxGenJS.TableRow[] = [];

  // Header row
  const headerRow: PptxGenJS.TableCell[] = headers.map((cell) => ({
    text: stripMarkdown(cell.text),
    options: {
      fill: { color: colors.tableHeaderBg },
      color: colors.tableHeaderText,
      fontSize: tableFontSize,
      fontFace: typography.fontBold,
      bold: true,
      align: (cell.align as PptxGenJS.HAlign) || 'left',
      valign: 'middle' as const,
      border: [
        { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
        { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
        { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
        { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
      ],
      margin: [3, 5, 3, 5],
    },
  }));
  tableRows.push(headerRow);

  // Data rows
  rows.forEach((row, rowIdx) => {
    const isStripe = rowIdx % 2 === 1;
    const dataRow: PptxGenJS.TableCell[] = row.map((cell) => ({
      text: stripMarkdown(cell.text),
      options: {
        fill: { color: isStripe ? colors.tableStripeBg : colors.backgroundWhite },
        color: colors.textBody,
        fontSize: tableFontSize,
        fontFace: typography.fontSecondary,
        bold: cell.bold || false,
        align: (cell.align as PptxGenJS.HAlign) || 'left',
        valign: 'top' as const,
        border: [
          { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
          { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
          { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
          { type: 'solid' as const, pt: 0.5, color: colors.tableBorderColor },
        ],
        margin: [3, 5, 3, 5],
      },
    }));
    tableRows.push(dataRow);
  });

  // Auto-compute row height
  const totalRows = tableRows.length;
  const tableMaxH = cardH - 0.2;
  const rowH = Math.min(0.42, Math.max(0.28, tableMaxH / totalRows));

  slide.addTable(tableRows, {
    x: spacing.marginLeft + 0.1,
    y: cardY + 0.1,
    w: spacing.contentWidth - 0.2,
    colW: Array(colCount).fill((spacing.contentWidth - 0.2) / colCount),
    rowH,
    autoPage: false,
  });

  // Bullets below card
  if (hasBullets) {
    const bulletY = cardY + cardH + 0.1;
    const bulletMaxH = H - bulletY - spacing.marginBottom - footerReserve;
    renderBullets(slide, data.bullets!, theme, bulletY, {
      maxH: bulletMaxH,
    });
  }
};
