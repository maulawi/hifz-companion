import {staticFile} from 'remotion';
import {ScreenAsset} from '../components/ScreenPanel';

/**
 * Hifz Companion — supplied app screenshots (source of truth) and product icon.
 * Screens are only cropped, scaled, masked and moved in scenes.
 */
export const COMPANION_SCREENS = {
  today: {id: 'today', src: staticFile('companion/screens/today.jpg'), natural: {width: 704, height: 1280}},
  suggested: {id: 'suggested', src: staticFile('companion/screens/suggested-plan.jpg'), natural: {width: 711, height: 1280}},
  plan: {id: 'plan', src: staticFile('companion/screens/plan.jpg'), natural: {width: 704, height: 1280}},
  map: {id: 'map', src: staticFile('companion/screens/hifz-map.jpg'), natural: {width: 704, height: 1280}},
} satisfies Record<string, ScreenAsset>;

export const COMPANION_ICON = {
  /** Supplied icon (tile corners are clipped by <AppIcon>; file untouched). */
  src: staticFile('products/hifz-lab-icon-calendar.png'),
  natural: {width: 551, height: 519},
} as const;

const r = (x0: number, y0: number, x1: number, y1: number) => ({x: x0, y: y0, w: x1 - x0, h: y1 - y0});

/** UI regions measured on the screenshots (source px). */
export const COMPANION_REGIONS = {
  today: {
    title: r(16, 112, 400, 300),
    newMemCard: r(26, 344, 680, 742),
    /** "Al-Fatihah · Ayah 1 – 7 · Today's suggested target" */
    target: r(130, 474, 430, 596),
    murajaahCard: r(26, 760, 680, 990),
    ring: {cx: 584.5, cy: 436.5, r: 47, width: 10},
  },
  suggested: {
    planCard: r(26, 408, 686, 856),
    rowNewMem: r(40, 448, 672, 528),
    rowMurajaah: r(40, 532, 672, 610),
    rowTime: r(40, 614, 672, 692),
  },
  plan: {
    progressTitle: r(20, 672, 400, 730),
    progressCard: r(26, 744, 680, 1008),
    ring: {cx: 157, cy: 875.5, r: 76, width: 16},
    /** The dark 4 % arc, as angles clockwise from 12 o'clock (degrees). */
    arc: {from: -9, to: 24},
  },
  map: {
    legend: r(26, 364, 680, 514),
    /** Three grid rows (surahs 7–24) including the two memorised cells. */
    gridSection: r(24, 644, 680, 976),
    memorised: [r(246, 760, 347, 860), r(357, 760, 457, 860)],
  },
} as const;

/** App colours sampled from the screenshots (for reveal masks). */
export const COMPANION_COLORS = {background: '#F9F5E9', card: '#FCFBF7', track: '#E7D8C5'} as const;
