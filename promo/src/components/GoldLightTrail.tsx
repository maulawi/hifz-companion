import React from 'react';
import {AbsoluteFill} from 'remotion';
import {alpha, colors} from '../styles/brand';

export type Pt = {x: number; y: number};
export type Curve = {from: Pt; c1: Pt; c2: Pt; to: Pt};

/** Point on a cubic Bézier at t (0…1). */
export const curvePoint = ({from: a, c1: b, c2: c, to: d}: Curve, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
};

type Props = {
  curve: Curve;
  /** Head position along the curve 0…1. */
  head: number;
  /** Visible tail length as a fraction of the curve. */
  tail?: number;
  /** Overall opacity (fade the trail out after arrival). */
  opacity?: number;
  width?: number;
};

/** A soft gold streak that follows an object along a curve. */
export const GoldLightTrail: React.FC<Props> = ({curve, head, tail = 0.35, opacity = 1, width = 3}) => {
  if (opacity <= 0 || head <= 0) return null;
  const {from, c1, c2, to} = curve;
  const d = `M${from.x},${from.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${to.x},${to.y}`;
  const start = Math.max(0, head - tail);
  const len = head - start;
  const seg = {pathLength: 1, strokeDasharray: `${len} 2`, strokeDashoffset: -start, fill: 'none', strokeLinecap: 'round' as const};
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width="100%" height="100%" style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="qurra-trail" gradientUnits="userSpaceOnUse" x1={curvePoint(curve, start).x} y1={curvePoint(curve, start).y} x2={curvePoint(curve, head).x} y2={curvePoint(curve, head).y}>
            <stop offset="0%" stopColor={colors.goldDeep} stopOpacity={0} />
            <stop offset="70%" stopColor={colors.goldDeep} stopOpacity={0.7} />
            <stop offset="100%" stopColor={colors.gold} stopOpacity={1} />
          </linearGradient>
          <filter id="qurra-trail-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={5} />
          </filter>
        </defs>
        {/* soft halo, fine filament, and a thin bright core */}
        <path d={d} {...seg} stroke={alpha(colors.gold, 0.16)} strokeWidth={width * 3} filter="url(#qurra-trail-glow)" />
        <path d={d} {...seg} stroke="url(#qurra-trail)" strokeWidth={width} />
        <path d={d} {...seg} stroke="#FFF6DC" strokeOpacity={0.7} strokeWidth={width * 0.35} />
      </svg>
    </AbsoluteFill>
  );
};
