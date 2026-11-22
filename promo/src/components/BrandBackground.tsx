import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, colors} from '../styles/brand';
import {GeometricOrnament} from './GeometricOrnament';

type Props = {
  /** Strength of the large background rosettes (0 hides them). */
  ornament?: number;
};

/**
 * Persistent warm-cream stage shared by all batches: soft studio light falloff,
 * faint paper grain and two very slow, very faint geometric rosettes for depth.
 * Rendered once at the composition root so it never flickers between scenes.
 */
export const BrandBackground: React.FC<Props> = ({ornament = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: colors.cream, overflow: 'hidden'}}>
      {/* Studio light: brighter centre, sand falloff at the edges */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% 42%, ${alpha('#FFFFFF', 0.55)} 0%, ${alpha('#FFFFFF', 0)} 70%),
                       radial-gradient(ellipse 120% 90% at 50% 50%, ${alpha(colors.sand, 0)} 55%, ${alpha(colors.sand, 0.55)} 100%)`,
        }}
      />
      {ornament > 0 ? (
        <>
          <GeometricOrnament
            size={1500}
            rotation={frame * 0.03}
            strokeWidth={1}
            opacity={0.1 * ornament}
            style={{position: 'absolute', left: -560, top: -520}}
          />
          <GeometricOrnament
            size={1300}
            rotation={-frame * 0.025 + 22.5}
            strokeWidth={1}
            opacity={0.08 * ornament}
            style={{position: 'absolute', right: -620, bottom: -420}}
          />
        </>
      ) : null}
      {/* Paper grain */}
      <AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'multiply'}}>
        <svg width="100%" height="100%">
          <filter id="qurra-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#qurra-grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
