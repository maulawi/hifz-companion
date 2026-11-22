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
