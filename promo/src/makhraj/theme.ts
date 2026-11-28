import {staticFile} from 'remotion';
import {ScreenAsset} from '../components/ScreenPanel';
import {fonts} from '../styles/brand';

/** Makhraj Lab launch film — forest green leads, gold is an accent only. */
export const MK = {
  night: '#061F19',
  forest: '#092B23',
  emerald: '#0D382E',
  green: '#124737',
  gold: '#C8A45D',
  goldSoft: 'rgba(200,164,93,0.55)',
  ivory: '#F4F0E6',
  white: '#FFFFFF',
} as const;

export const MK_FPS = 30;
const f = (s: number) => Math.round(s * MK_FPS);

/**
 * Narration cue points (seconds → frames), measured word by word on the
 * supplied voice-over (Barnaby, 66.7 s). The voice-over is the master clock.
 */
export const CUE = {
  letters: f(0.62),
  but: f(1.54),
  where: f(3.52),
  every: f(5.04),
  origin: f(6.1),
  point: f(7.48),
  articulation: f(8.02),
  movement: f(9.3),
  anatomy: f(10.52),
  characteristic: f(11.6),
  sound: f(13.8),
  introducing: f(15.18),
  makhraj: f(15.82),
  newWay: f(17.04),
  quranic: f(19.76),
  discover: f(21.24),
  five: f(21.8),
  regions: f(22.64),
  explore: f(23.76),
  seventeen: f(24.4),
  interactive: f(26.52),
  model: f(28.0),
  see: f(29.0),
  eachLetter: f(29.38),
  formed: f(30.2),
  learnHow: f(31.18),
  understand: f(33.08),
  characteristics: f(33.96),
  compare: f(35.32),
  similar: f(36.56),
  differently: f(37.8),
  lessons: f(38.98),
  anatomy2: f(40.22),
  audio: f(41.52),
  practice: f(42.88),
  classical: f(44.2),
  everything: f(45.8),
  deepen: f(47.0),
  brought: f(49.24),
  immersive: f(50.48),
  notJust: f(52.72),
  seeing: f(55.26),
  understanding: f(56.3),
  refining: f(57.56),
  ctaExplore: f(60.28),
  ctaUnderstand: f(61.04),
  ctaRefine: f(62.0),
  ctaName: f(63.14),
  ctaDiscover: f(64.52),
  voEnd: f(66.69),
} as const;

/** Film length: narration + a held final frame for reading. */
export const MAKHRAJ_DURATION = f(71.5);

export const MK_TYPE = {
  /** Wide, editorial sans for English titles. */
  title: {fontFamily: fonts.sans, fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase' as const},
  body: {fontFamily: fonts.sans, fontWeight: 400},
  serif: {fontFamily: fonts.serif, fontWeight: 400},
  arabic: {fontFamily: '"Amiri", serif', direction: 'rtl' as const},
} as const;

const shot = (id: string, file: string, width: number, height: number): ScreenAsset => ({id, src: staticFile(`makhraj/screens/${file}`), natural: {width, height}});

export const MK_SCREENS = {
  home: shot('home', 'desktop-learn-home.webp', 1920, 1380),
  letters: shot('letters', 'desktop-28-letters.png', 1920, 1610),
  head: shot('head', '3d-head-17-points.webp', 957, 875),
  jaw: shot('jaw', '3d-jaw-point-5.png', 912, 863),
  waw: shot('waw', 'mobile-waw-lesson.jpg', 704, 1280),
  wawAudio: shot('wawAudio', 'mobile-waw-audio-classical.jpg', 835, 1280),
  practice: shot('practice', 'mobile-practice-q1.jpg', 703, 1280),
  glossary: shot('glossary', 'mobile-glossary.jpg', 703, 1280),
} satisfies Record<string, ScreenAsset>;

export const MK_ICON = {src: staticFile('makhraj/brand/makhraj-icon.webp'), natural: 1254, tile: {x: 173, y: 156, w: 895, h: 916}} as const;

const r = (x0: number, y0: number, x1: number, y1: number) => ({x: x0, y: y0, w: x1 - x0, h: y1 - y0});

/** Regions measured on the screenshots (source px). */
export const MK_REGIONS = {
  home: {
    hero: r(240, 120, 1100, 410),
    startCard: r(258, 442, 1662, 750),
    pathways: r(240, 800, 1680, 1240),
    makharij: r(258, 910, 712, 1236),
    sifat: r(733, 910, 1187, 1236),
    letters28: r(1208, 910, 1662, 1236),
  },
  letters: {
    grid: r(250, 296, 1670, 1056),
    tileHaa: r(1268, 306, 1458, 466), // ḥāʾ · Point 3 · al-Ḥalq
    tileHa: r(1066, 865, 1256, 1025), // hāʾ · Point 2 · al-Ḥalq
    tileWaw: r(1268, 865, 1458, 1047), // wāw · Point 16 · al-Shafatān
  },
  waw: {
    header: r(20, 160, 690, 380),
    intro: r(20, 450, 690, 790),
    whereHeading: r(20, 980, 690, 1140),
  },
  wawAudio: {
    audio: r(34, 28, 802, 418),
    classical: r(34, 612, 802, 1118),
    baytLine: r(200, 850, 640, 920),
  },
  practice: {
    card: r(28, 120, 676, 1180),
    question: r(60, 150, 640, 470),
    optHalq: r(66, 667, 636, 836),
  },
  glossary: {
    makhraj: r(28, 238, 676, 678),
    sifah: r(28, 690, 676, 1170),
    /** "Letters that share a makhraj are told apart by their ṣifāt." */
    sifahLine: r(44, 925, 668, 1002),
  },
  jaw: {point5: {x: 548, y: 462}},
} as const;

/**
 * Marker centres on the 3D head screenshot (957×875) and the general region
 * each point belongs to, following the app's own letter data (e.g. hamzah ·
 * Point 2 · al-Ḥalq; qāf · Point 5 · al-Lisān; bāʾ · Point 16 · al-Shafatān)
 * and its Jawf (madd) section.
 */
export const MK_MARKERS: Record<number, {x: number; y: number}> = {
  1: {x: 463, y: 443},
  2: {x: 353, y: 457},
  3: {x: 413, y: 396},
  4: {x: 353, y: 396},
  5: {x: 505, y: 363},
  6: {x: 555, y: 443},
  7: {x: 615, y: 443},
  8: {x: 615, y: 363},
  9: {x: 495, y: 503},
  10: {x: 435, y: 503},
  11: {x: 555, y: 503},
  12: {x: 680, y: 422},
  13: {x: 625, y: 508},
  14: {x: 568, y: 313},
  15: {x: 730, y: 375},
  16: {x: 721, y: 486},
  17: {x: 455, y: 287},
};

export const MK_REGIONS_5 = [
  {name: 'al-Jawf', gloss: 'the open space of mouth and throat', points: [1]},
  {name: 'al-Ḥalq', gloss: 'the throat', points: [2, 3, 4]},
  {name: 'al-Lisān', gloss: 'the tongue', points: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]},
  {name: 'al-Shafatān', gloss: 'the two lips', points: [15, 16]},
  {name: 'al-Khayshūm', gloss: 'the nasal cavity', points: [17]},
] as const;

/** The classical bayt on the number of makhārij (rendered as real Arabic type). */
export const BAYT = ['مَخَارِجُ الْحُرُوفِ سَبْعَةَ عَشَرْ', 'عَلَى الَّذِي يَخْتَارُهُ مَنِ اخْتَبَرْ'] as const;
