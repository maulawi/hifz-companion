import React from 'react';

type Props = {
  cx: number;
  cy: number;
  r: number;
  /** Stroke width of the ring being revealed (source px). */
  width: number;
  /** Angles clockwise from 12 o'clock (deg) covering the part to reveal. */
  from?: number;
  to?: number;
  /** 0 → fully covered, 1 → fully revealed (sweeps clockwise). */
  progress: number;
  /** Colour of whatever lies under the ring (card or track colour). */
  coverColor: string;
};

/**
 * Animates a progress ring that already exists in a screenshot: a cover arc in
 * the surrounding colour retreats clockwise, uncovering the real ring. For use
 * inside a ScreenPanel overlay (source-pixel coordinates).
 */
export const RingReveal: React.FC<Props> = ({cx, cy, r, width, from = 0, to = 360, progress, coverColor}) => {
  if (progress >= 1) return null;
  const start = from + (to - from) * progress;
  const len = to - start;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={coverColor}
      strokeWidth={width + 4}
      pathLength={360}
      strokeDasharray={`${len} 360`}
      transform={`rotate(${start - 90} ${cx} ${cy})`}
    />
  );
};
