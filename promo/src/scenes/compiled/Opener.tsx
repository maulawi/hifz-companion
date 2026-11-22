import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandLogo, logoHeightFor} from '../../components/BrandLogo';
import {GeometricOrnament} from '../../components/GeometricOrnament';
import {KineticText} from '../../components/KineticText';
import {progress, settle} from '../../lib/motion';
import {colors, ease, type} from '../../styles/brand';
import {ProductTile} from './ProductTiles';

/** Local timing — synced to "Introducing Hifz Lab, digital tools to support…" (VO at frame 8). */
export const OPENER_T = {logo: 2, eyebrow: 8, title: 14, tiles: 52, tileStagger: 9, exit: 118} as const;
const T = OPENER_T;

/**
 * Logo hand-off: the opener's QURRA logo ends exactly where Batch 01's logo sits
 * on the frame the compiled film cuts into it (frame 80), so the join is seamless.
 */
const LOGO = {w: 223.93, cy: 369.65};
const ORNAMENT = {size: 834.7, cy: 898.9, rotation: 0.5, opacity: 0.25};

/** Compiled-film opener — "Introducing Hifz Lab" with the four products. */
export const Opener: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = settle(frame, fps, T.logo, 30);
  const exit = progress(frame, T.exit, 22, ease.in);
  const eb = progress(frame, T.eyebrow, 18, ease.out);
  const logoH = logoHeightFor(LOGO.w);

  return (
    <AbsoluteFill>
      <GeometricOrnament
        size={ORNAMENT.size}
        draw={progress(frame, 0, 60, ease.soft)}
        rotation={ORNAMENT.rotation - (1 - progress(frame, 0, 150, ease.soft)) * 10}
        strokeWidth={1.1}
        opacity={ORNAMENT.opacity}
        style={{position: 'absolute', left: 540 - ORNAMENT.size / 2, top: ORNAMENT.cy - ORNAMENT.size / 2}}
      />
      <div style={{position: 'absolute', left: 540 - LOGO.w / 2, top: LOGO.cy - logoH / 2}}>
        <BrandLogo width={LOGO.w} reveal={logo} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: 1 - exit, transform: `translateY(${-exit * 30}px)`}}>
        <div style={{...type.eyebrow, fontSize: 24, color: colors.goldDeep, opacity: eb, transform: `translateY(${(1 - eb) * 12}px)`}}>Introducing</div>
        <KineticText text="Hifz Lab" start={T.title} stagger={6} duration={26} style={{...type.display, fontSize: 150, color: colors.forest, marginTop: 18}} />
      </div>

      {[0, 1, 2, 3].map((i) => (
        <ProductTile
          key={i}
          index={i}
          x={180 + i * 240}
          y={1140}
          size={180}
          appear={progress(frame, T.tiles + i * T.tileStagger, 22, ease.out)}
          opacity={1 - exit}
        />
      ))}
    </AbsoluteFill>
  );
};
