import {staticFile} from 'remotion';
import {comparisonPage, comparisonTable02, comparisonTable03, TableSpec} from './mutashabihatPage';

/**
 * Reusable registry of authentic ebook pages for the page-turn system.
 *
 * - `image` pages are full scanned pages, shown whole (uniform scale, never cropped
 *   or stretched) on a parchment page of the 3D book.
 * - `tables` pages lay one or more supplied comparison tables onto a parchment page.
 *
 * Any batch can reference these ids; `<BookPage id=… />` renders them.
 */
export type EbookPage =
  | {kind: 'image'; id: string; title: string; src: string; natural: {width: number; height: number}}
  | {kind: 'tables'; id: string; title: string; tables: TableSpec[]};

export const EBOOK_PAGES = {
  preface: {
    kind: 'image',
    id: 'preface',
    title: 'Preface · The Nazm',
    src: staticFile('ebook/pages/preface-nazm.webp'),
    natural: {width: 532, height: 747},
  },
  contents: {
    kind: 'image',
    id: 'contents',
    title: 'Contents',
    src: staticFile('ebook/pages/contents.webp'),
    natural: {width: 515, height: 746},
  },
  introduction: {
    kind: 'image',
    id: 'introduction',
    title: 'Introduction',
    src: staticFile('ebook/pages/introduction.webp'),
    natural: {width: 520, height: 747},
  },
  comparisonsA: {kind: 'tables', id: 'comparisonsA', title: 'Comparisons', tables: [comparisonPage]},
  comparisonsB: {kind: 'tables', id: 'comparisonsB', title: 'Comparisons', tables: [comparisonTable02, comparisonTable03]},
} satisfies Record<string, EbookPage>;

export type EbookPageId = keyof typeof EBOOK_PAGES;

/** One open spread: left (verso) and right (recto) page. `null` = endpaper. */
export type Spread = {left: EbookPageId | null; right: EbookPageId};
