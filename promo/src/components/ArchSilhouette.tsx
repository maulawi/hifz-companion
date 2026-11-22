import React from 'react';
import {colors} from '../styles/brand';

type Props = {
  width: number;
  /** 0→1 line-draw progress. */
  draw?: number;
  opacity?: number;
  color?: string;
  style?: React.CSSProperties;
};

/**
 * Restrained architectural line drawing: a domed hall with a pointed central
 * arch, two side arches and slender minarets. Hairlines only, so it reads as
 * atmosphere rather than illustration.
 */
export const ArchSilhouette: React.FC<Props> = ({width, draw = 1, opacity = 1, color = colors.gold, style}) => {
  const paths = [
    // ground line
    'M10,300 L590,300',
    // main hall
    'M150,300 L150,170 L450,170 L450,300',
    // dome
    'M190,170 C190,95 245,62 300,52 C355,62 410,95 410,170',
    // finial
    'M300,52 L300,26 M294,34 C294,28 306,28 306,34',
    // central pointed arch
    'M255,300 L255,215 C255,188 280,176 300,166 C320,176 345,188 345,215 L345,300',
    // side arches
    'M175,300 L175,235 C175,218 190,208 200,204 C210,208 225,218 225,235 L225,300',
    'M375,300 L375,235 C375,218 390,208 400,204 C410,208 425,218 425,235 L425,300',
    // minarets
    'M95,300 L95,120 L115,120 L115,300 M92,120 L118,120 M105,120 L105,92 M105,92 C99,100 99,108 105,112',
    'M485,300 L485,120 L505,120 L505,300 M482,120 L508,120 M495,120 L495,92 M495,92 C489,100 489,108 495,112',
    // small domes on the wings
    'M150,170 C150,140 170,128 190,124 M450,170 C450,140 430,128 410,124',
  ];
  return (
    <svg width={width} height={(width * 320) / 600} viewBox="0 0 600 320" style={{overflow: 'visible', opacity, ...style}}>
      {paths.map((d, i) => {
        const p = Math.min(1, Math.max(0, draw * 1.3 - i * 0.03));
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
