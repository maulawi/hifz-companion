import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {CHALLENGE_SCREENS, REGIONS} from '../../data/challenge';
import {Rect} from '../../data/mutashabihatPage';
import {APP_COLORS} from '../../compositions/challenge.timeline';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {ease} from '../../styles/brand';

export const PROGRESS_T = {
  cards: 16,
  cardStagger: 7,
  numbers: 30, // values wipe into view card by card
  perf: 52,
  bar: 74,
  headline: 8,
} as const;
const T = PROGRESS_T;

const SCREEN = CHALLENGE_SCREENS.progress;
const R = REGIONS.progress;
const TRACK = '#E5D6C3';

/** Value line inside a stat card (the big figure), in source px. */
const valueBand = (card: Rect): Rect => ({x: card.x + 14, y: card.y + 82, w: card.w - 28, h: 96});

/**
 * Scene 05 — the real Progress dashboard comes apart into floating cards.
 * Figures and the Juz bar are revealed with masks over the actual screenshot
 * (no numbers are re-typed, nothing is added to the session data shown).
 */
export const ProgressScene: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const stats = [
    {crop: R.statAnswered, x: L.cx - 242, y: 760},
    {crop: R.statCorrect, x: L.cx + 242, y: 760},
    {crop: R.statAccuracy, x: L.cx - 242, y: 1090},
    {crop: R.statChallenges, x: L.cx + 242, y: 1090},
  ];
  const statW = 440;

  const perfIn = progress(frame, T.perf, 24, ease.out);
  const bar = progress(frame, T.bar, 34, ease.inOut);
  const barX = R.perfBar1115.x + R.perfBar1115.w * bar;
  const push = progress(frame, 0, 165, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.04} focusX={L.cx} focusY={1150}>
        {stats.map((s, i) => {
          const t = progress(frame, T.cards + i * T.cardStagger, 22, ease.out);
          const v = progress(frame, T.numbers + i * T.cardStagger, 16, ease.inOut);
          const band = valueBand(s.crop);
          return (
            <ScreenPanel
              key={i}
              screen={SCREEN}
              crop={s.crop}
              width={statW}
              x={s.x + (1 - t) * (i % 2 ? 90 : -90)}
              y={s.y + (1 - t) * 140 + float(frame, 5, 140, i) * t}
              rotateY={(1 - t) * (i % 2 ? -18 : 18)}
              opacity={Math.min(1, t * 2)}
              radius={30}
              edge={0.4}
            >
              {/* value wipe: the real figure is uncovered top-to-bottom */}
              <rect x={band.x} y={band.y + band.h * v} width={band.w} height={band.h * (1 - v)} fill={APP_COLORS.card} />
            </ScreenPanel>
          );
        })}

        <ScreenPanel
          screen={SCREEN}
          crop={R.perfTitle}
          width={860}
          x={L.cx}
          y={1310 + (1 - perfIn) * 60}
          opacity={perfIn}
          radius={0}
          shadow={0}
          edge={0}
          style={{
            background: 'transparent',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)',
            WebkitMaskComposite: 'source-in',
          }}
        />
        <ScreenPanel
          screen={SCREEN}
          crop={R.perfCard}
          width={900}
          x={L.cx}
          y={mix(1640, 1560, perfIn) + float(frame, 4, 160, 3) * perfIn}
          opacity={perfIn}
          radius={30}
          edge={0.4}
        >
          {/* Juz 11–15 bar grows over its empty track */}
          <rect x={barX} y={R.perfBar1115.y} width={R.perfBar1115.x + R.perfBar1115.w - barX} height={R.perfBar1115.h} fill={APP_COLORS.card} />
          <rect x={barX} y={R.perfBar1115.y + 3.5} width={Math.max(0, R.perfBar1115.x + R.perfBar1115.w - barX - 2)} height={10} rx={5} fill={TRACK} />
        </ScreenPanel>
      </CameraRig>

      <HeadlineBlock
        headline={'Measure\nYour Progress.'}
        start={T.headline}
        align="center"
        x={L.cx}
        y={215}
        width={1000}
        headlineSize={84}
        divider={false}
      />
    </AbsoluteFill>
  );
};
