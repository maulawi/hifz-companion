import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandLogo, logoHeightFor} from '../components/BrandLogo';
import {GeometricOrnament} from '../components/GeometricOrnament';
import {GoldDivider} from '../components/GoldDivider';
import {KineticText} from '../components/KineticText';
import {progress, settle} from '../lib/motion';
import {colors, ease, type} from '../styles/brand';

const LOGO_W = 500;
const LOGO_CY = 860;

/** Scene 1 — the QURRA mark resolves inside a hand-drawn rosette. */
export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoReveal = settle(frame, fps, 2, 34);
  const draw = progress(frame, 0, 50, ease.soft);
  const divider = progress(frame, 12, 26, ease.out);
  // Gentle continuous push so nothing ever sits perfectly still
  const drift = progress(frame, 0, 64, ease.soft);
  // Exit: lift away and soften while the cross-fade hands over to the book
  const exit = progress(frame, 40, 24, ease.in);
  const logoH = logoHeightFor(LOGO_W);

  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${-exit * 90}px) scale(${1 + drift * 0.025 - exit * 0.04})`,
        filter: exit > 0.01 ? `blur(${exit * 8}px)` : undefined,
      }}
    >
      <GeometricOrnament
        size={820}
        draw={draw}
        rotation={-12 + drift * 10}
        strokeWidth={1.1}
        opacity={0.5}
        style={{position: 'absolute', left: 540 - 410, top: LOGO_CY - 410}}
      />
      <div style={{position: 'absolute', left: 540 - LOGO_W / 2, top: LOGO_CY - logoH / 2}}>
        <BrandLogo width={LOGO_W} reveal={logoReveal} />
      </div>
      <GoldDivider width={360} progress={divider} style={{position: 'absolute', left: 540 - 180, top: LOGO_CY + logoH / 2 + 70}} />
      <KineticText
        text="Preserve. Strengthen. Remember."
        start={14}
        stagger={5}
        duration={18}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: LOGO_CY + logoH / 2 + 118,
          ...type.lead,
          color: colors.olive,
        }}
      />
    </AbsoluteFill>
  );
};
