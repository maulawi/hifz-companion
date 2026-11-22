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
import {colors, ease} from '../../styles/brand';

export const PROGRESS_T = {card: 10, arc: 34, map: 52, cells: 92, headline: 6} as const;
const T = PROGRESS_T;

const R = COMPANION_REGIONS;

/**
 * Scene 04 — a partial glimpse of progress: the real Hifz Progress ring draws
 * its arc, and a small, edge-faded section of the Hifz Map rises beneath it
 * with the memorised surahs softly lit. The rest stays undiscovered.
 */
export const ProgressOverTime: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const card = progress(frame, T.card, 26, ease.out);
  const map = progress(frame, T.map, 30, ease.out);
  const push = progress(frame, 0, 150, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.05} focusX={L.cx} focusY={1050}>
        {/* Partial Hifz Map, fading out at its edges — a glimpse, not the full map */}
        <ScreenPanel
          screen={COMPANION_SCREENS.map}
          crop={R.map.gridSection}
          width={960}
          x={L.cx}
          y={mix(1460, 1380, map) + float(frame, 4, 160, 2) * map}
          rotateX={mix(16, 6, map)}
          opacity={map}
          radius={0}
          shadow={0}
          edge={0}
          style={{
            background: 'transparent',
            WebkitMaskImage: 'radial-gradient(ellipse 58% 62% at 50% 50%, #000 55%, transparent 100%)',
          }}
        >
          {R.map.memorised.map((cell, i) => (
            <GoldFrame key={i} rect={{x: cell.x - 4, y: cell.y - 4, w: cell.w + 8, h: cell.h + 8}} draw={progress(frame, T.cells + i * 6, 18, ease.out)} radius={18} color={colors.gold} stroke={2.4} glow={14} />
          ))}
        </ScreenPanel>

        {/* Hifz Progress card: the real 4 % arc sweeps in */}
        <ScreenPanel
          screen={COMPANION_SCREENS.plan}
          crop={R.plan.progressCard}
          width={900}
          x={L.cx}
          y={mix(900, 840, card) + float(frame, 5, 140) * card}
          rotateX={mix(-10, 0, card)}
          opacity={Math.min(1, card * 2)}
          radius={30}
          edge={0.5}
          shadow={card}
          glare={frame > T.arc + 30 ? -0.3 + (frame - T.arc - 30) / 30 : -1}
        >
          <RingReveal {...R.plan.ring} from={R.plan.arc.from} to={R.plan.arc.to} progress={progress(frame, T.arc, 26, ease.inOut)} coverColor={COMPANION_COLORS.track} />
        </ScreenPanel>
      </CameraRig>

      <HeadlineBlock headline={'Every Small\nStep Matters.'} start={T.headline} align="center" x={L.cx} y={240} width={1000} headlineSize={84} divider={false} />
    </AbsoluteFill>
  );
};
