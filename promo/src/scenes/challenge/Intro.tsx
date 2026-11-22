import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {ArchSilhouette} from '../../components/ArchSilhouette';
import {BrandLogo, logoHeightFor} from '../../components/BrandLogo';
import {CameraRig} from '../../components/CameraRig';
import {GeometricOrnament} from '../../components/GeometricOrnament';
import {Curve, curvePoint, GoldLightTrail} from '../../components/GoldLightTrail';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {CHALLENGE_ICON, CHALLENGE_SCREENS} from '../../data/challenge';
import {useLayout} from '../../lib/layout';
import {float, mix, progress, settle} from '../../lib/motion';
import {ease} from '../../styles/brand';

/** Local timing (frames @ 30 fps) — edit here. */
export const INTRO_T = {
  logo: 2,
  logoMove: 30,
  arch: 8,
  panel: 42,
  icon: 40,
  iconArrive: 80,
  headline: 56,
  glare: 88,
} as const;
const T = INTRO_T;

/** Scene 01 — QURRA mark, then the Mutasyabihat Challenge icon flies in on a gold trail. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();

  // ── Layout (landscape master; vertical stacks the same elements) ──
  const textX = L.landscape ? 210 : L.safe.x;
  const iconTo = L.landscape ? {x: 1290, y: 600} : {x: L.cx - 110, y: 820};
  const panelAt = L.landscape ? {x: 1500, y: 545} : {x: L.cx + 150, y: 760};
  const logoBig = {w: 400, x: L.cx, y: L.cy - 20};
  const logoSmall = L.landscape ? {w: 128, x: textX + 64, y: 262} : {w: 150, x: L.cx, y: 250};

  // ── QURRA logo: resolve centre-stage, then settle into the lock-up ──
  const logoIn = settle(frame, fps, T.logo, 30);
  const move = progress(frame, T.logoMove, 28, ease.inOut);
  const logoW = mix(logoBig.w, logoSmall.w, move);
  const logoX = mix(logoBig.x, logoSmall.x, move);
  const logoY = mix(logoBig.y, logoSmall.y, move);
  const logoH = logoHeightFor(logoW);

  // ── App icon on a gold light trail ──
  const curve: Curve = {
    from: {x: L.w + 160, y: L.h + 180},
    c1: {x: L.w * 0.86, y: L.h * 0.25},
    c2: {x: iconTo.x + 260, y: iconTo.y - 260},
    to: iconTo,
  };
  const fly = progress(frame, T.icon, T.iconArrive - T.icon, ease.soft);
  const at = curvePoint(curve, fly);
  const arrived = progress(frame, T.iconArrive - 6, 30, ease.soft);
  const trailFade = 1 - progress(frame, T.iconArrive - 4, 20, ease.soft);
  const iconFloat = float(frame, 8, 110) * arrived;

  // ── Real Home screen, floating behind the icon as a teaser of the app ──
  const panelIn = progress(frame, T.panel, 40, ease.out);

  // Gentle continuous push-in for cinematic depth
  const push = progress(frame, 0, 120, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.035} focusX={L.cx} focusY={L.cy}>
        <GeometricOrnament
          size={760}
          draw={progress(frame, 0, 60, ease.soft)}
          rotation={frame * 0.08}
          strokeWidth={1}
          opacity={0.32}
          style={{position: 'absolute', left: iconTo.x - 380, top: iconTo.y - 380}}
        />
        <ArchSilhouette
          width={L.landscape ? 760 : 700}
          draw={progress(frame, T.arch, 70, ease.soft)}
          opacity={0.2}
          style={{position: 'absolute', left: L.landscape ? 1110 : L.cx - 350, top: L.landscape ? 640 : 860}}
        />

        <ScreenPanel
          screen={CHALLENGE_SCREENS.home}
          width={L.landscape ? 430 : 380}
          x={panelAt.x + (1 - panelIn) * 140}
          y={panelAt.y + iconFloat * -0.4}
          rotateY={-24 + panelIn * 6}
          rotateX={4}
          rotateZ={2}
          opacity={panelIn * 0.9}
          blur={(1 - panelIn) * 6 + 0.6}
          shadow={panelIn * 0.8}
          radius={30}
        />

        <GoldLightTrail curve={curve} head={fly} tail={0.32} opacity={trailFade} width={2.4} />
        {fly > 0 ? (
          <AppIcon
            src={CHALLENGE_ICON.src}
            natural={CHALLENGE_ICON.natural}
            size={L.landscape ? 290 : 300}
            x={at.x}
            y={at.y + iconFloat}
            rotateY={mix(70, 0, fly) + float(frame, 3, 140) * arrived}
            rotateX={mix(24, 0, fly) + float(frame, 2, 170, 1) * arrived}
            rotateZ={mix(-14, 0, fly)}
            scale={mix(0.55, 1, fly)}
            opacity={Math.min(1, fly * 3)}
            glare={frame > T.glare ? -0.4 + (frame - T.glare) / 26 : -1}
          />
        ) : null}

        <div style={{position: 'absolute', left: logoX - logoW / 2, top: logoY - logoH / 2}}>
          <BrandLogo width={logoW} reveal={logoIn} />
        </div>

        <HeadlineBlock
          headline={'Mutasyabihat\nChallenge'}
          support="Recognise. Compare. Remember."
          start={T.headline}
          align={L.landscape ? 'left' : 'center'}
          x={L.landscape ? textX : L.cx}
          y={L.landscape ? 400 : 1220}
          width={L.landscape ? 820 : 900}
          headlineSize={L.landscape ? 112 : 96}
          supportSize={40}
        />
      </CameraRig>
    </AbsoluteFill>
  );
};
