import React from 'react';
import {colors} from '../styles/brand';

type Props = {
  width: number;
  /** 0→1: lines grow outward from the central diamond. */
  progress: number;
  color?: string;
  style?: React.CSSProperties;
};

/** Hairline divider with a central diamond — echoes the ornament on the ebook cover. */
export const GoldDivider: React.FC<Props> = ({width, progress, color = colors.gold, style}) => {
  const half = (width / 2 - 16) * progress;
  return (
    <div style={{position: 'relative', width, height: 18, ...style}}>
      <div
        style={{
          position: 'absolute',
          top: 8.5,
          right: width / 2 + 12,
          width: half,
          height: 1,
          background: `linear-gradient(to left, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 8.5,
          left: width / 2 + 12,
          width: half,
          height: 1,
          background: `linear-gradient(to right, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: width / 2 - 6,
          top: 3,
          width: 12,
          height: 12,
          border: `1.2px solid ${color}`,
          transform: `rotate(45deg) scale(${Math.min(1, progress * 2)})`,
          opacity: Math.min(1, progress * 3),
        }}
      >
        <div style={{position: 'absolute', inset: 3, background: color}} />
      </div>
    </div>
  );
};
