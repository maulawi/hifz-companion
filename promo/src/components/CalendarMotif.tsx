import React from 'react';
import {alpha, colors} from '../styles/brand';

type Props = {
  /** Columns × rows of day cells. */
  cols?: number;
  rows?: number;
  cell: number;
  gap?: number;
  /** 0→1 hairline draw-on of the grid. */
  draw: number;
  /** Number of cells filled in reading order (fractional = partly faded in). */
  lit?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * Abstract calendar grid (no dates or labels): hairline day cells that can
 * light up one after another to suggest steady, daily practice.
 */
export const CalendarMotif: React.FC<Props> = ({cols = 7, rows = 1, cell, gap = 14, draw, lit = 0, opacity = 1, style}) => {
  const w = cols * cell + (cols - 1) * gap;
  const h = rows * cell + (rows - 1) * gap;
  return (
    <svg width={w} height={h} style={{overflow: 'visible', opacity, ...style}}>
      {Array.from({length: cols * rows}, (_, i) => {
        const x = (i % cols) * (cell + gap);
        const y = Math.floor(i / cols) * (cell + gap);
        const d = Math.min(1, Math.max(0, draw * 1.6 - (i / (cols * rows)) * 0.6));
        const f = Math.min(1, Math.max(0, lit - i));
        return (
          <g key={i}>
            <rect x={x} y={y} width={cell} height={cell} rx={cell * 0.24} fill={alpha(colors.gold, 0.85 * f)} stroke={alpha(colors.gold, 0.7)} strokeWidth={1.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
          </g>
        );
      })}
    </svg>
  );
};
