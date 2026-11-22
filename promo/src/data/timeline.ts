import {staticFile} from 'remotion';
import {ScreenAsset} from '../components/ScreenPanel';

/**
 * Hifz Timeline — supplied app screenshots (source of truth) and product icon.
 * Note: the screens come from two different sessions (the Results screen is a
 * 10-Juz example; the timeline / by-year screens start from zero), so scenes
 * never place their figures side by side.
 */
export const TIMELINE_SCREENS = {
  start: {id: 'start', src: staticFile('timeline/screens/where-you-are.jpg'), natural: {width: 704, height: 1280}},
  results: {id: 'results', src: staticFile('timeline/screens/results.jpg'), natural: {width: 704, height: 1280}},
  timeline: {id: 'timeline', src: staticFile('timeline/screens/timeline.jpg'), natural: {width: 1162, height: 1280}},
  byYear: {id: 'byYear', src: staticFile('timeline/screens/by-year.jpg'), natural: {width: 847, height: 1280}},
} satisfies Record<string, ScreenAsset>;

export const TIMELINE_ICON = {src: staticFile('products/hifz-timeline-icon.png'), natural: {width: 552, height: 521}} as const;

const r = (x0: number, y0: number, x1: number, y1: number) => ({x: x0, y: y0, w: x1 - x0, h: y1 - y0});

/** Grid cell (Juz n, 1-based) on the "Where you are" screen. */
const CELL_X = [78, 190, 303, 416, 529];
const CELL_Y = [883, 995, 1108];
export const juzCell = (n: number) => {
  const i = n - 1;
  const x = CELL_X[i % 5];
  const y = CELL_Y[Math.floor(i / 5)];
  return r(x, y, x + 97, y + 97);
};

/** UI regions measured on the screenshots (source px). */
export const TIMELINE_REGIONS = {
  start: {
    brand: r(150, 52, 560, 150),
    title: r(20, 180, 684, 360),
    steps: r(26, 448, 678, 490),
    /** "2 · YOUR PACE" label inside the step bar. */
    stepPace: r(318, 452, 516, 488),
    question: r(36, 548, 668, 870),
    grid: r(64, 872, 640, 1214),
  },
  results: {
    steps: r(26, 186, 678, 226),
    card: r(36, 284, 668, 1232),
    hero: r(150, 330, 554, 512),
    completion: r(60, 540, 644, 760),
    statsGrid: r(78, 776, 628, 1188),
    /** Individual cells of the results grid (real values). */
    cellCurrent: r(80, 778, 355, 917),
    cellPace: r(355, 778, 627, 917),
    cellWeekly: r(80, 917, 355, 1047),
    cellRemaining: r(355, 917, 627, 1047),
    cellCompletion: r(80, 1047, 627, 1186),
  },
  timeline: {
    title: r(100, 100, 700, 270),
    /** Circles 1–8, cropped just below the app's own (clipped) "You are here" badge. */
    circles: r(120, 378, 1062, 508),
    firstCircle: {cx: 210, cy: 441, r: 58},
    legend: r(150, 568, 1010, 652),
    milestone: r(60, 802, 1104, 1194),
  },
  byYear: {
    title: r(80, 108, 600, 172),
    rows: [r(70, 190, 780, 300), r(70, 308, 780, 430), r(70, 437, 780, 558), r(70, 566, 780, 690)],
    disclaimer: r(50, 1150, 795, 1226),
  },
} as const;

export const TIMELINE_COLORS = {background: '#F6F2E6', card: '#FAF6EB'} as const;
