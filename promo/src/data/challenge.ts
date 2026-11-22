import {staticFile} from 'remotion';
import {ScreenAsset} from '../components/ScreenPanel';

/**
 * Mutasyabihat Challenge — supplied app screenshots (source of truth) and the
 * official product icon. Screens are only cropped / scaled / moved in scenes.
 */
export const CHALLENGE_SCREENS = {
  home: {id: 'home', src: staticFile('challenge/screens/home.jpg'), natural: {width: 704, height: 1280}},
  question: {id: 'question', src: staticFile('challenge/screens/question.jpg'), natural: {width: 704, height: 1280}},
  comparison: {id: 'comparison', src: staticFile('challenge/screens/answer-comparison.jpg'), natural: {width: 704, height: 1280}},
  progress: {id: 'progress', src: staticFile('challenge/screens/progress.jpg'), natural: {width: 708, height: 1280}},
} satisfies Record<string, ScreenAsset>;

export const CHALLENGE_ICON = {
  /** Corners cut out of the supplied icon (tile untouched); original kept alongside. */
  src: staticFile('products/mutasyabihat-challenge-icon.png'),
  natural: {width: 548, height: 521},
} as const;

const r = (x0: number, y0: number, x1: number, y1: number) => ({x: x0, y: y0, w: x1 - x0, h: y1 - y0});

/**
 * UI regions measured on the supplied screenshots (source px). Used to crop
 * real interface elements into floating panels and to position overlays.
 */
export const REGIONS = {
  home: {
    header: r(0, 0, 704, 104),
    title: r(16, 112, 690, 500),
    progressCard: r(26, 566, 680, 754),
    startButton: r(26, 781, 680, 882),
    learnTile: r(26, 908, 342, 1162),
    progressTile: r(362, 908, 678, 1162),
    tabBar: r(0, 1162, 704, 1280),
  },
  question: {
    header: r(0, 0, 704, 104),
    juzHeader: r(20, 112, 684, 214),
    juzLabel: r(258, 122, 452, 174),
    questionCard: r(26, 276, 678, 504),
    prompt: r(26, 538, 678, 588),
    optionA: r(26, 610, 678, 752),
    optionB: r(26, 767, 678, 982),
    submit: r(26, 1022, 678, 1124),
  },
  comparison: {
    correctLabel: r(26, 106, 360, 150),
    correctCard: r(26, 160, 678, 392),
    similarLabel: r(26, 408, 460, 456),
    similarCard: r(26, 464, 678, 776),
    notice: r(26, 796, 678, 1000),
    /**
     * Shared opening phrase "قَالَ يَٰٓإِبْلِيسُ مَا" (as quoted by the app's own
     * "What to Notice") and the differing continuations. Boundaries sit in the
     * blank ink columns between words (measured: مَا = x 431–450 / 428–447).
     */
    correctShared: r(425, 198, 616, 276),
    correctDiffers: r(88, 198, 423, 276),
    similarShared: r(421, 506, 616, 576),
    similarDiffers1: r(88, 506, 419, 576),
    similarDiffers2: r(110, 584, 593, 658), // whole second line (from بِيَدَيَّ; ink x 117–585)
  },
  progress: {
    title: r(20, 104, 690, 236),
    statAnswered: r(26, 274, 346, 510),
    statCorrect: r(362, 274, 682, 510),
    statAccuracy: r(26, 526, 346, 762),
    statChallenges: r(362, 526, 682, 762),
    perfTitle: r(20, 810, 690, 880),
    /** Ends after the Juz 11 – 15 row (the next row is cut off in the screenshot). */
    perfCard: r(26, 884, 682, 1122),
    /** Filled gold bar of the "Juz 11 – 15" row. */
    perfBar1115: r(256, 1075, 543, 1092),
  },
} as const;
