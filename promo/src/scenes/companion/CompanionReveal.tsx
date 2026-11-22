import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {BrandLogo, logoHeightFor} from '../../components/BrandLogo';
import {GeometricOrnament} from '../../components/GeometricOrnament';
import {KineticText} from '../../components/KineticText';
import {ScreenPanel} from '../../components/ScreenPanel';
import {COMPANION_ICON, COMPANION_REGIONS, COMPANION_SCREENS} from '../../data/companion';
import {useLayout} from '../../lib/layout';
import {mix, progress, settle} from '../../lib/motion';
import {colors, ease, type} from '../../styles/brand';

export const REVEAL_T = {gather: 0, gatherDuration: 40, icon: 24, logo: 34, headline: 58, support: 86, endLockup: 110, fadeStart: 140} as const;
const T = REVEAL_T;
const R = COMPANION_REGIONS;

/** Scene 05 — UI pieces gather and dissolve; icon, logo and closing lines. */
export const CompanionReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();

  const g = progress(frame, T.gather, T.gatherDuration, ease.in);
  const centre = {x: L.cx, y: 640};
  const pieces = [
    {screen: COMPANION_SCREENS.today, crop: R.today.newMemCard, w: 520, x: 290, y: 560, rot: -5},
    {screen: COMPANION_SCREENS.suggested, crop: R.suggested.rowTime, w: 560, x: 780, y: 820, rot: 4},
    {screen: COMPANION_SCREENS.plan, crop: R.plan.progressCard, w: 520, x: 320, y: 1180, rot: 6},
    {screen: COMPANION_SCREENS.map, crop: R.map.memorised[0], w: 150, x: 820, y: 1300, rot: -8},
  ];

  const icon = settle(frame, fps, T.icon, 30);
  const logo = settle(frame, fps, T.logo, 32);
  const logoW = 280;
  const logoH = logoHeightFor(logoW);
  const end = progress(frame, T.endLockup, 18, ease.out);
  const fade = 1 - progress(frame, T.fadeStart, 10, ease.soft);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <GeometricOrnament
        size={820}
        draw={progress(frame, T.icon - 6, 50, ease.soft)}
        rotation={frame * 0.06}
        strokeWidth={1}
        opacity={0.32}
        style={{position: 'absolute', left: centre.x - 410, top: centre.y - 410}}
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
          opacity={(1 - g) * Math.min(1, progress(frame, 0, 8) * 2)}
          blur={g * 4}
          radius={22}
          edge={0.4}
        />
      ))}

      <AppIcon
        src={COMPANION_ICON.src}
        natural={COMPANION_ICON.natural}
        size={170}
        x={centre.x}
        y={420 + (1 - icon) * 40}
        scale={mix(0.85, 1, icon)}
        opacity={icon}
      />
      <div style={{position: 'absolute', left: centre.x - logoW / 2, top: 700 - logoH / 2}}>
        <BrandLogo width={logoW} reveal={logo} />
      </div>

      <KineticText
        text={'Stay Consistent.\nPreserve Your Hifz.'}
        start={T.headline}
        stagger={3}
        duration={22}
        style={{position: 'absolute', left: 0, right: 0, top: 960, ...type.headline, fontSize: 70, color: colors.forest}}
        wordStyles={{'Hifz.': {fontStyle: 'italic', color: colors.goldDeep}}}
      />
      <KineticText
        text="Your Hifz Journey, One Day at a Time."
        start={T.support}
        stagger={2}
        duration={20}
        style={{position: 'absolute', left: 0, right: 0, top: 1160, ...type.lead, fontSize: 38, color: colors.olive}}
      />

      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', opacity: end, transform: `translateY(${(1 - end) * 12}px)`}}>
        <div style={{...type.eyebrow, fontSize: 26, letterSpacing: '0.4em', color: colors.forest}}>QURRA Hifz Lab</div>
        <div style={{...type.eyebrow, fontSize: 21, letterSpacing: '0.42em', color: colors.goldDeep, marginTop: 22}}>
          Learn&nbsp;&nbsp;·&nbsp;&nbsp;Preserve&nbsp;&nbsp;·&nbsp;&nbsp;Grow
        </div>
      </div>
    </AbsoluteFill>
  );
};
