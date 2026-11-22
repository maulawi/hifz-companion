import {EbookPageId, Spread} from '../data/ebookPages';
import {ease} from '../styles/brand';

/**
 * Sequencer for the page-turn system: a list of spreads, how long each is held
 * and how long a turn takes. Change the order or timings in the config only.
 */
export type PageFlowConfig = {
  spreads: Spread[];
  /** Local frame at which the first spread is fully open. */
  start: number;
  /** Hold duration of each spread (frames). */
  holds: number[];
  /** Duration of one page turn (frames). */
  turn: number;
};

export type PageFlowState = {
  /** Spread currently resting (or being turned away from). */
  index: number;
  /** Left / right page ids visible under any turning leaf. */
  left: EbookPageId | null;
  right: EbookPageId;
  /** Present while a leaf is turning. `turn` is eased 0→1. */
  leaf: {front: EbookPageId; back: EbookPageId | null; turn: number; raw: number} | null;
  /** Frames since the current spread came to rest (for label / focus timing). */
  restFrame: number;
};

export const flowDuration = (c: PageFlowConfig) => c.start + c.holds.reduce((a, b) => a + b, 0) + c.turn * (c.spreads.length - 1);

/** Local frame at which spread `i` comes to rest. */
export const spreadRestStart = (c: PageFlowConfig, i: number) =>
  c.start + c.holds.slice(0, i).reduce((a, b) => a + b, 0) + c.turn * i;

export const pageFlowAt = (frame: number, c: PageFlowConfig): PageFlowState => {
  const last = c.spreads.length - 1;
  for (let i = 0; i <= last; i++) {
    const rest = spreadRestStart(c, i);
    const turnStart = rest + c.holds[i];
    if (i === last || frame < turnStart) {
      return {index: i, left: c.spreads[i].left, right: c.spreads[i].right, leaf: null, restFrame: frame - rest};
    }
    if (frame < turnStart + c.turn) {
      const raw = (frame - turnStart) / c.turn;
      return {
        index: i,
        left: c.spreads[i].left,
        right: c.spreads[i + 1].right,
        leaf: {front: c.spreads[i].right, back: c.spreads[i + 1].left, turn: ease.inOut(raw), raw},
        restFrame: frame - rest,
      };
    }
  }
  throw new Error('unreachable');
};
