import React from 'react';
import {Rect} from '../data/mutashabihatPage';
import {alpha, colors} from '../styles/brand';

type Props = {
  rect: Rect;
  /** 0→1 draw-on progress. */
  draw: number;
  radius?: number;
  /** Stroke widths in screen px (non-scaling). */
  stroke?: number;
  glow?: number;
  color?: string;
  /** Optional faint fill behind the frame (0…1). */
  fill?: number;
};

/**
 * Gold highlight frame for use inside a ScreenPanel / ComparisonPage SVG layer
 * (coordinates are the source image's pixels). Pure overlay: the underlying UI
 * or Arabic text is never touched.
 */
export const GoldFrame: React.FC<Props> = ({rect: r, draw, radius = 10, stroke = 2.4, glow = 9, color = colors.goldDeep, fill = 0}) => {
  if (draw <= 0) return null;
  const common = {x: r.x, y: r.y, width: r.w, height: r.h, rx: radius, vectorEffect: 'non-scaling-stroke' as const};
  return (
    <g opacity={Math.min(1, draw * 3)}>
      {fill > 0 ? <rect {...common} fill={alpha(colors.gold, 0.12 * fill * draw)} stroke="none" /> : null}
      <rect {...common} fill="none" stroke={alpha(colors.gold, 0.3 * draw)} strokeWidth={glow} />
      <rect {...common} fill="none" stroke={color} strokeWidth={stroke} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    </g>
  );
};
