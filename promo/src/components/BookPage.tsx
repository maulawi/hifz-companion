import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {EBOOK_PAGES, EbookPageId} from '../data/ebookPages';
import {PAGE_SURFACE} from './BookMockup';
import {ComparisonPage, comparisonPageHeight} from './ComparisonPage';

const PARCHMENT = 'radial-gradient(ellipse 85% 75% at 50% 48%, #E6CFA6 0%, #DCC193 70%, #CFB283 100%)';
const TABLE_PAGE = 'radial-gradient(ellipse 80% 70% at 52% 48%, #EEDEC0 0%, #E7D3B0 65%, #DCC69E 100%)';

type Props = {
  id: EbookPageId;
  /** Hide tables (by index) while they are lifted off as cards. */
  hidden?: number[];
  width?: number;
  height?: number;
};

/** Margins used when laying tables onto a page. */
export const TABLE_PAGE_LAYOUT = {marginX: 28, gap: 34} as const;

/** Top-left position (page-local px) of each table on a `tables` page. */
export const tablePlacement = (id: EbookPageId, width = PAGE_SURFACE.width, height = PAGE_SURFACE.height) => {
  const page = EBOOK_PAGES[id];
  if (page.kind !== 'tables') return [];
  const w = width - 2 * TABLE_PAGE_LAYOUT.marginX;
  const hs = page.tables.map((t) => comparisonPageHeight(w, t));
  const total = hs.reduce((a, b) => a + b, 0) + TABLE_PAGE_LAYOUT.gap * (hs.length - 1);
  let y = (height - total) / 2;
  return page.tables.map((t, i) => {
    const out = {table: t, x: TABLE_PAGE_LAYOUT.marginX, y, width: w, height: hs[i]};
    y += hs[i] + TABLE_PAGE_LAYOUT.gap;
    return out;
  });
};

/**
 * One authentic ebook page, rendered at book-page size.
 * Full pages are scaled uniformly to fit (never cropped or stretched).
 */
export const BookPage: React.FC<Props> = ({id, hidden = [], width = PAGE_SURFACE.width, height = PAGE_SURFACE.height}) => {
  const page = EBOOK_PAGES[id];
  if (page.kind === 'image') {
    const k = Math.min(width / page.natural.width, height / page.natural.height);
    const w = page.natural.width * k;
    const h = page.natural.height * k;
    return (
      <AbsoluteFill style={{background: PARCHMENT}}>
        <Img src={page.src} style={{position: 'absolute', left: (width - w) / 2, top: (height - h) / 2, width: w, height: h}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: TABLE_PAGE}}>
      {tablePlacement(id, width, height).map((p, i) =>
        hidden.includes(i) ? null : (
          <div key={p.table.id} style={{position: 'absolute', left: p.x, top: p.y}}>
            <ComparisonPage table={p.table} width={p.width} feather={1} />
          </div>
        ),
      )}
    </AbsoluteFill>
  );
};
