import {staticFile} from 'remotion';

/**
 * Authentic comparison tables supplied from the Mutashabihat ebook.
 *
 * Each image is displayed as-is. Nothing here describes or re-creates the
 * Arabic text: the file only stores pixel rectangles, measured on each source
 * image, where gold overlays are drawn ON TOP of the untouched image.
 */
export type Rect = {x: number; y: number; w: number; h: number};

export type TableRow = {
  label: string;
  /** Full row area (used for focus dimming). */
  band: Rect;
  /** Optional "Kalimat" cell (only the first table has this column). */
  kalimatCell?: Rect;
  /** Red-coloured differing phrase(s) in the verse column. */
  phrases: Rect[];
};

export type TableSpec = {
  id: string;
  src: string;
  natural: {width: number; height: number};
  /** Visible window: table plus a small parchment margin. */
  crop: Rect;
  rows: TableRow[];
};

const r = (x0: number, y0: number, x1: number, y1: number): Rect => ({x: x0, y: y0, w: x1 - x0, h: y1 - y0});

/** Al-ʿAnkabūt / Ar-Raʿd / Al-Isrāʾ — 1170×508 (highest resolution: used for zooms). */
export const comparisonPage: TableSpec = {
  id: 'comparison-01',
  src: staticFile('ebook/pages/comparison-01.jpg'),
  natural: {width: 1170, height: 508},
  crop: r(100, 18, 1070, 478),
  rows: [
    {label: 'Al-ʿAnkabūt 52', band: r(144, 99, 1023, 247), kalimatCell: r(308, 99, 473, 247), phrases: [r(722, 105, 888, 142)]},
    {label: 'Ar-Raʿd 43', band: r(144, 247, 1023, 350), kalimatCell: r(308, 247, 473, 350), phrases: [r(487, 265, 575, 287), r(943, 308, 1010, 333)]},
    {label: 'Al-Isrāʾ 96', band: r(144, 350, 1023, 454), kalimatCell: r(308, 350, 473, 454), phrases: [r(726, 365, 891, 390)]},
  ],
};

/** Hūd / Yūsuf (Hujurāt row) / Fuṣṣilat — 447×167. */
export const comparisonTable02: TableSpec = {
  id: 'comparison-02',
  src: staticFile('ebook/pages/comparison-02.png'),
  natural: {width: 447, height: 167},
  crop: r(30, 9, 445, 166),
  rows: [
    {label: 'Hūd 19', band: r(36, 41, 439, 89), phrases: [r(406, 45, 434, 61), r(161, 45, 257, 62)]},
    {label: 'Yūsuf 37', band: r(36, 89, 439, 136), phrases: [r(194, 114, 290, 130)]},
    {label: 'Fuṣṣilat 7', band: r(36, 136, 439, 160), phrases: [r(412, 141, 434, 156), r(253, 141, 331, 156)]},
  ],
};

/** Āl ʿImrān / Maryam — 445×240. */
export const comparisonTable03: TableSpec = {
  id: 'comparison-03',
  src: staticFile('ebook/pages/comparison-03.png'),
  natural: {width: 445, height: 240},
  crop: r(12, 9, 427, 210),
  rows: [
    {label: 'Āl ʿImrān 47', band: r(18, 40, 421, 87), phrases: [r(303, 44, 378, 60)]},
    {label: 'Maryam 20', band: r(18, 87, 421, 112), phrases: [r(319, 90, 398, 106)]},
    {label: 'Āl ʿImrān 40', band: r(18, 112, 421, 158), phrases: [r(302, 115, 382, 131)]},
    {label: 'Maryam 8', band: r(18, 158, 421, 204), phrases: [r(302, 162, 379, 178)]},
  ],
};

export const tableAspect = (t: TableSpec) => t.crop.w / t.crop.h;
/** Kept for existing callers. */
export const cropAspect = tableAspect(comparisonPage);
