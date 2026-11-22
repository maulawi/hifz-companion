import {staticFile} from 'remotion';

/**
 * The authentic comparison page supplied for the Mutashabihat ebook.
 *
 * The image is displayed as-is. Nothing in this file describes or re-creates the
 * Arabic text; it only stores pixel rectangles (measured on the source image,
 * 1170×508) where overlays are drawn ON TOP of the untouched page.
 */
export type Rect = {x: number; y: number; w: number; h: number};

const r = (x0: number, y0: number, x1: number, y1: number): Rect => ({x: x0, y: y0, w: x1 - x0, h: y1 - y0});

export const comparisonPage = {
  src: staticFile('ebook/page-comparison-01.jpg'),
  natural: {width: 1170, height: 508},
  /** Visible window: the table plus a parchment margin (crops away the clipped
   *  line of text above the table and the cut-off frame ornaments). */
  crop: r(100, 18, 1070, 478),
  table: r(144, 43, 1023, 454),
  /** Body rows (header excluded), top → bottom. */
  rows: [
    {
      label: 'Al-ʿAnkabūt 52',
      band: r(144, 99, 1023, 247),
      kalimatCell: r(308, 99, 473, 247),
      /** Red-coloured phrase(s) inside the verse column, measured from the image. */
      phrases: [r(722, 105, 888, 142)],
    },
    {
      label: 'Ar-Raʿd 43',
      band: r(144, 247, 1023, 350),
      kalimatCell: r(308, 247, 473, 350),
      phrases: [r(487, 265, 575, 287), r(943, 308, 1010, 333)],
    },
    {
      label: 'Al-Isrāʾ 96',
      band: r(144, 350, 1023, 454),
      kalimatCell: r(308, 350, 473, 454),
      phrases: [r(726, 365, 891, 390)],
    },
  ],
} as const;

export const cropAspect = comparisonPage.crop.w / comparisonPage.crop.h;
