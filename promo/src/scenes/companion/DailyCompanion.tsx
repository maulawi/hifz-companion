import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {RingReveal} from '../../components/RingReveal';
import {ScreenPanel} from '../../components/ScreenPanel';
import {COMPANION_COLORS, COMPANION_REGIONS, COMPANION_SCREENS} from '../../data/companion';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {lerpRect, regionOnScreen} from '../../lib/screenMap';
import {colors, ease} from '../../styles/brand';

export const DAILY_T = {
  lift: 26,
  liftDuration: 30,
  ring: 50,
  murajaahIn: 70,
  murajaahOut: 118,
  target: 96,
  zoom: 100,
  headline: 6,
} as const;
const T = DAILY_T;

const SCREEN = COMPANION_SCREENS.today;
const R = COMPANION_REGIONS.today;

/**
 * Scene 02 — Today's Plan: the New Memorisation card comes forward, its ring
 * draws, the Murajaah card makes a brief appearance, and the camera eases
 * toward today's target. The rest of the screen stays in the background.
 */
export const DailyCompanion: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const full = {x: L.cx, y: 1180, width: 600, crop: {x: 0, y: 0, w: SCREEN.natural.width, h: SCREEN.natural.height}};
  const lift = progress(frame, T.lift, T.liftDuration, ease.inOut);
  const from = (reg: typeof R.newMemCard) => {
    const s = regionOnScreen(full, reg);
    return {x: s.cx, y: s.cy, w: s.w};
  };

  const cardTarget = {x: L.cx, y: 880, w: 960};
  const card = lerpRect(from(R.newMemCard), cardTarget, lift);
  const mIn = progress(frame, T.murajaahIn, 24, ease.out);
  const mOut = progress(frame, T.murajaahOut, 18, ease.in);
  const mur = lerpRect(from(R.murajaahCard), {x: L.cx, y: 1450, w: 900}, mIn);
  const idle = progress(frame, T.lift + T.liftDuration, 30, ease.soft);

  // Camera eases toward today's target on the lifted card
  const cardPlacement = {x: cardTarget.x, y: cardTarget.y, width: cardTarget.w, crop: R.newMemCard};
  const tgt = regionOnScreen(cardPlacement, R.target);
  const zoom = progress(frame, T.zoom, 150 - T.zoom, ease.inOut);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + zoom * 0.14} focusX={tgt.cx} focusY={tgt.cy} panX={(L.cx - tgt.cx) * zoom * 0.45}>
        <ScreenPanel
          screen={SCREEN}
          width={full.width}
          x={full.x}
          y={full.y}
          scale={mix(1, 0.86, lift)}
          opacity={mix(1, 0.2, lift)}
          blur={lift * 5}
          radius={34}
          shadow={1 - lift * 0.7}
        />

        {mIn > 0 && mOut < 1 ? (
          <ScreenPanel
            screen={SCREEN}
            crop={R.murajaahCard}
            width={mur.w}
            x={mur.x}
            y={mur.y + mOut * 60}
            opacity={Math.min(1, mIn * 2) * (1 - mOut)}
            radius={30 * (mur.w / R.murajaahCard.w)}
            edge={0.4}
            shadow={mIn}
          />
        ) : null}

        {frame >= T.lift ? (
          <ScreenPanel
            screen={SCREEN}
            crop={R.newMemCard}
            width={card.w}
            x={card.x}
            y={card.y + float(frame, 5, 130) * idle}
            radius={30 * (card.w / R.newMemCard.w)}
            shadow={lift}
            edge={0.5}
            glare={frame > T.ring + 20 ? -0.3 + (frame - T.ring - 20) / 30 : -1}
          >
            <RingReveal {...R.ring} progress={progress(frame, T.ring, 30, ease.inOut)} coverColor={COMPANION_COLORS.card} />
            <GoldFrame rect={{x: R.target.x - 8, y: R.target.y - 2, w: R.target.w + 16, h: R.target.h + 8}} draw={progress(frame, T.target, 18, ease.out)} radius={14} color={colors.gold} stroke={2} glow={10} />
          </ScreenPanel>
        ) : null}
      </CameraRig>

      <HeadlineBlock
        headline={'A Clearer Plan\nfor Your Daily Hifz.'}
        support="New Memorisation. Daily Revision."
        start={T.headline}
        exitStart={T.zoom + 22}
        align="center"
        x={L.cx}
        y={200}
        width={1000}
        headlineSize={80}
        supportSize={36}
      />
    </AbsoluteFill>
  );
};
