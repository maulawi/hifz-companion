import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../styles/brand';
import {float} from '../lib/motion';

export type Accent = {
  x: number;
  y: number;
  size: number;
  /** Parallax depth: higher drifts more. */
  depth: number;
  kind: 'diamond' | 'ring' | 'dot';
};

type Props = {
  accents: Accent[];
  /** 0→1 overall presence. */
  presence: number;
  /** Additional upward camera drift in px, multiplied by each depth. */
  drift?: number;
};

/** Small gold geometric accents floating at different depths — restrained parallax. */
export const FloatingAccents: React.FC<Props> = ({accents, presence, drift = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {accents.map((a, i) => {
        const y = a.y + float(frame, 10 * a.depth, 140 + i * 17, i) - drift * a.depth;
        const x = a.x + float(frame, 6 * a.depth, 190 + i * 23, i * 2);
        const appear = Math.min(1, Math.max(0, presence * 1.4 - i * 0.07));
        const common: React.CSSProperties = {
          position: 'absolute',
          left: x - a.size / 2,
          top: y - a.size / 2,
          width: a.size,
          height: a.size,
          opacity: appear * (0.45 + 0.35 * a.depth),
          transform: `scale(${0.6 + 0.4 * appear}) rotate(${a.kind === 'diamond' ? 45 + frame * 0.15 * a.depth : 0}deg)`,
          filter: a.depth < 0.5 ? `blur(${(0.5 - a.depth) * 3}px)` : undefined,
        };
        if (a.kind === 'diamond') return <div key={i} style={{...common, border: `1.3px solid ${colors.gold}`}} />;
        if (a.kind === 'ring') return <div key={i} style={{...common, borderRadius: '50%', border: `1.2px solid ${colors.gold}`}} />;
        return <div key={i} style={{...common, borderRadius: '50%', background: colors.gold}} />;
      })}
    </AbsoluteFill>
  );
};
