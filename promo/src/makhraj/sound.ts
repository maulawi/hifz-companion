import {interpolate} from 'remotion';
import {CUE, MAKHRAJ_DURATION} from './theme';

type Sfx =
  | 'whoosh-soft'
  | 'whoosh-wide'
  | 'whoosh-short'
  | 'page-turn'
  | 'chime-low'
  | 'shimmer'
  | 'tick'
  | 'tick-soft'
  | 'tap'
  | 'pop'
  | 'pop-high'
  | 'sweep-line'
  | 'impact-low'
  | 'gold-ping'
  | 'light-sweep';

const cues: Array<{frame: number; sfx: Sfx; volume: number}> = [];
const add = (frame: number, sfx: Sfx, volume: number) => cues.push({frame: Math.max(0, Math.round(frame)), sfx, volume});

// 1 · Origin
add(4, 'light-sweep', 0.22); // the first light crosses the dark
add(12, 'gold-ping', 0.1);
add(CUE.where - 4, 'light-sweep', 0.16);
// 2 · Anatomy
add(122, 'sweep-line', 0.16); // the drawing begins
add(CUE.point - 2, 'gold-ping', 0.26); // a precise point
add(CUE.anatomy - 6, 'whoosh-wide', 0.18); // into the real 3D view
add(CUE.characteristic + 4, 'sweep-line', 0.2); // sound wave
// 3 · Reveal
add(CUE.introducing - 3, 'impact-low', 0.5);
add(CUE.introducing + 4, 'shimmer', 0.2);
add(CUE.makhraj, 'light-sweep', 0.16);
// 4–5 · Regions & points
add(630, 'whoosh-soft', 0.2);
for (let i = 0; i < 5; i++) add(CUE.five + i * 9, 'tick-soft', 0.16);
for (let n = 0; n < 17; n += 2) add(CUE.seventeen + n * 3, 'tick-soft', 0.07);
add(CUE.interactive + 12, 'whoosh-short', 0.18);
add(CUE.interactive + 30, 'gold-ping', 0.16);
// 6 · Letters
add(862, 'whoosh-soft', 0.18);
add(CUE.eachLetter, 'tick', 0.22);
add(CUE.learnHow - 6, 'whoosh-short', 0.18);
// 7 · Ṣifāt & compare
add(988, 'whoosh-soft', 0.16);
add(CUE.compare + 6, 'sweep-line', 0.14);
add(CUE.similar - 4, 'pop', 0.18);
add(CUE.differently - 6, 'pop-high', 0.16);
// 8 · Everything
[CUE.lessons, CUE.anatomy2, CUE.audio, CUE.practice, CUE.classical].forEach((c) => add(c - 6, 'whoosh-short', 0.16));
add(CUE.practice + 14, 'tap', 0.28);
add(CUE.classical + 10, 'tick', 0.18);
add(CUE.everything - 8, 'page-turn', 0.16);
add(CUE.everything, 'chime-low', 0.18);
// 9 · Experience
add(1464, 'whoosh-wide', 0.2);
[CUE.seeing, CUE.understanding, CUE.refining].forEach((c) => add(c - 4, 'gold-ping', 0.14));
// 10 · CTA
add(1794, 'whoosh-wide', 0.18);
[CUE.ctaExplore, CUE.ctaUnderstand, CUE.ctaRefine].forEach((c) => add(c - 4, 'tick', 0.22));
add(CUE.ctaName - 6, 'impact-low', 0.36);
add(CUE.ctaName - 2, 'chime-low', 0.24);
add(CUE.ctaDiscover, 'shimmer', 0.16);

export const MAKHRAJ_SFX = cues.sort((a, b) => a.frame - b.frame);

/**
 * Music bed: kept low under the (almost continuous) narration; it opens up in
 * the natural gaps — before the reveal, before the ending, and after the last line.
 */
export const MAKHRAJ_MUSIC = {
  src: 'audio/music/makhraj-bed.mp3',
  volume: (f: number) => {
    const base = 0.16;
    const lifts = [
      [CUE.sound + 14, CUE.introducing + 10, 0.32],
      [Math.round(59.1 * 30), CUE.ctaExplore + 4, 0.3],
      [CUE.voEnd, MAKHRAJ_DURATION, 0.34],
    ] as const;
    let v = base;
    for (const [a, b, lvl] of lifts) v = Math.max(v, interpolate(f, [a - 8, a, b, b + 12], [base, lvl, lvl, base], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    const fade = interpolate(f, [0, 20, MAKHRAJ_DURATION - 45, MAKHRAJ_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return v * fade;
  },
};
