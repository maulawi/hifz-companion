import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {BrandLogo, logoHeightFor} from '../../components/BrandLogo';
import {GeometricOrnament} from '../../components/GeometricOrnament';
import {KineticText} from '../../components/KineticText';
import {ScreenPanel} from '../../components/ScreenPanel';
import {CHALLENGE_ICON, CHALLENGE_SCREENS, REGIONS} from '../../data/challenge';
import {useLayout} from '../../lib/layout';
import {mix, progress, settle} from '../../lib/motion';
import {colors, ease, type} from '../../styles/brand';

export const OUTRO_T = {
  gather: 0,
  gatherDuration: 40,
  logo: 30,
  headline: 52,
  tagline: 80,
  fadeStart: 108,
} as const;
const T = OUTRO_T;

/** Scene 06 — floating UI pieces gather and dissolve into the QURRA mark. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();

  const g = progress(frame, T.gather, T.gatherDuration, ease.in);
  const centre = {x: L.cx, y: 760};
  const pieces = [
    {screen: CHALLENGE_SCREENS.question, crop: REGIONS.question.questionCard, w: 520, x: 300, y: 520, rot: -6},
    {screen: CHALLENGE_SCREENS.comparison, crop: REGIONS.comparison.correctCard, w: 520, x: 790, y: 980, rot: 5},
    {screen: CHALLENGE_SCREENS.progress, crop: REGIONS.progress.statAccuracy, w: 280, x: 250, y: 1180, rot: 8},
    {screen: CHALLENGE_SCREENS.home, crop: REGIONS.home.startButton, w: 480, x: 760, y: 1420, rot: -4},
  ];

  const logo = settle(frame, fps, T.logo, 32);
  const logoW = 420;
  const logoH = logoHeightFor(logoW);
  const fade = 1 - progress(frame, T.fadeStart, 12, ease.soft);
  const iconIn = progress(frame, 0, 14, ease.out) * (1 - g);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <GeometricOrnament
        size={900}
        draw={progress(frame, T.logo - 10, 50, ease.soft)}
        rotation={frame * 0.06}
        strokeWidth={1}
        opacity={0.35}
        style={{position: 'absolute', left: centre.x - 450, top: centre.y - 450}}
      />
      {pieces.map((p, i) => (
        <ScreenPanel
          key={i}
          screen={p.screen}
          crop={p.crop}
          width={p.w}
          x={mix(p.x, centre.x, g)}
          y={mix(p.y, centre.y, g)}
          rotateZ={p.rot * (1 - g)}
          scale={mix(1, 0.25, g)}
          opacity={(1 - g) * Math.min(1, progress(frame, 0, 10) * 2)}
          blur={g * 4}
          radius={26}
          edge={0.4}
        />
      ))}
      <AppIcon
        src={CHALLENGE_ICON.src}
        natural={CHALLENGE_ICON.natural}
        size={200}
        x={mix(L.cx + 300, centre.x, g)}
        y={mix(380, centre.y, g)}
        scale={mix(1, 0.3, g)}
        opacity={iconIn}
      />

      <div style={{position: 'absolute', left: centre.x - logoW / 2, top: centre.y - logoH / 2}}>
        <BrandLogo width={logoW} reveal={logo} />
      </div>
      <KineticText
        text={'Strengthen Your Hifz,\nOne Challenge at a Time.'}
        start={T.headline}
        stagger={3}
        duration={22}
        style={{position: 'absolute', left: 0, right: 0, top: 1150, ...type.headline, fontSize: 66, color: colors.forest}}
        wordStyles={{'Hifz,': {fontStyle: 'italic', color: colors.goldDeep}}}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1400,
          textAlign: 'center',
          ...type.eyebrow,
          fontSize: 26,
          letterSpacing: '0.42em',
          color: colors.goldDeep,
          opacity: progress(frame, T.tagline, 18, ease.out),
          transform: `translateY(${(1 - progress(frame, T.tagline, 18, ease.out)) * 12}px)`,
        }}
      >
        Learn&nbsp;&nbsp;·&nbsp;&nbsp;Preserve&nbsp;&nbsp;·&nbsp;&nbsp;Grow
      </div>
    </AbsoluteFill>
  );
};
