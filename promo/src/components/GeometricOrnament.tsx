import React from 'react';
import {colors} from '../styles/brand';

type Props = {
  size: number;
  /** 0→1 line-draw progress. */
  draw?: number;
  rotation?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Eight-fold Islamic geometric rosette drawn with hairlines:
 * two interlaced squares (khatam), inner octagon and framing circles.
 * Stroke-dash animation reveals it as if drawn with a compass.
 */
export const GeometricOrnament: React.FC<Props> = ({
  size,
  draw = 1,
  rotation = 0,
  color = colors.gold,
  strokeWidth = 1.2,
  opacity = 1,
  style,
}) => {
  const c = 100;
  const sq = 62; // half-diagonal of the squares
  const square = (deg: number) => {
    const pts = [0, 90, 180, 270].map((a) => {
      const t = ((a + deg + 45) * Math.PI) / 180;
      return `${c + sq * Math.cos(t)},${c + sq * Math.sin(t)}`;
    });
    return `M${pts.join('L')}Z`;
  };
  const octagon = (() => {
    const rr = 33;
    const pts = Array.from({length: 8}, (_, i) => {
      const t = ((i * 45 + 22.5) * Math.PI) / 180;
      return `${c + rr * Math.cos(t)},${c + rr * Math.sin(t)}`;
    });
    return `M${pts.join('L')}Z`;
  })();
  // Radiating spokes between the star points
  const spokes = Array.from({length: 8}, (_, i) => {
    const t = (i * 45 * Math.PI) / 180;
    return `M${c + 33 * Math.cos(t)},${c + 33 * Math.sin(t)}L${c + 95 * Math.cos(t)},${c + 95 * Math.sin(t)}`;
  }).join('');

  const dash = (delay: number) => {
    const p = Math.min(1, Math.max(0, (draw - delay) / (1 - delay)));
    return {strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p > 0 ? 1 : 0};
  };

  const common = {fill: 'none', stroke: color, strokeWidth, vectorEffect: 'non-scaling-stroke' as const, pathLength: 1};

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{overflow: 'visible', transform: `rotate(${rotation}deg)`, opacity, ...style}}
    >
      <circle cx={c} cy={c} r={95} {...common} style={dash(0)} />
      <circle cx={c} cy={c} r={88} {...common} strokeWidth={strokeWidth * 0.6} style={dash(0.1)} />
      <path d={square(0)} {...common} style={dash(0.15)} />
      <path d={square(45)} {...common} style={dash(0.25)} />
      <path d={octagon} {...common} style={dash(0.4)} />
      <path d={spokes} {...common} strokeWidth={strokeWidth * 0.6} style={dash(0.5)} />
    </svg>
  );
};
