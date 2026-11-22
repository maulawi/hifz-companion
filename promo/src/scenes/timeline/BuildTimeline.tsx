import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CalendarMotif} from '../../components/CalendarMotif';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {TIMELINE_COLORS, TIMELINE_REGIONS, TIMELINE_SCREENS} from '../../data/timeline';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {alpha, colors, ease} from '../../styles/brand';

export const BUILD_T = {
  circles: 4,
  circlesReveal: 10,
  halo: 40,
  calendar: 44,
  daysLit: 56,
  line: 70,
  rows: 86,
  rowStagger: 14,
  headline: 6,
} as const;
const T = BUILD_T;

const R = TIMELINE_REGIONS.timeline;
const Y = TIMELINE_REGIONS.byYear;

/**
 * Scene 03 — the real milestone circles reveal left to right with "you are
 * here" on Juz 1, a calendar strip fills, then a graphic timeline grows and
 * the real "Journey by Year" rows attach to it one by one.
 */
export const BuildTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const cIn = progress(frame, T.circles, 22, ease.out);
  const reveal = progress(frame, T.circlesReveal, 40, ease.inOut);
  const cover = {x: R.circles.x + R.circles.w * mix(0.12, 1, reveal), w: R.circles.w * (1 - mix(0.12, 1, reveal))};

  const lineX = 170;
  const lineTop = 960;
  const ROW_W = 760;
  const rowY = (i: number) => 1030 + i * 175;
  const line = progress(frame, T.line, 40, ease.inOut);
  const lineBottom = mix(lineTop, rowY(3) + 40, line);
  const push = progress(frame, 0, 180, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.04} focusX={L.cx} focusY={1050}>
        <ScreenPanel
          screen={TIMELINE_SCREENS.timeline}
          crop={R.circles}
          width={980}
          x={L.cx}
          y={620 + (1 - cIn) * 60}
          opacity={cIn}
          radius={26}
          edge={0.4}
          shadow={cIn * 0.8}
        >
          {/* Circles revealed left → right (cover retracts) */}
          <rect x={cover.x} y={R.circles.y} width={cover.w} height={R.circles.h} fill={TIMELINE_COLORS.card} />
          <GoldFrame
            rect={{x: R.firstCircle.cx - R.firstCircle.r - 6, y: R.firstCircle.cy - R.firstCircle.r - 6, w: (R.firstCircle.r + 6) * 2, h: (R.firstCircle.r + 6) * 2}}
            draw={progress(frame, T.halo, 18, ease.out)}
            radius={R.firstCircle.r + 6}
            color={colors.gold}
            stroke={2}
            glow={14}
          />
        </ScreenPanel>

        <CalendarMotif
          cols={7}
          rows={1}
          cell={56}
          gap={18}
          draw={progress(frame, T.calendar, 22, ease.out)}
          lit={Math.max(0, (frame - T.daysLit) / 6)}
          opacity={0.85}
          style={{position: 'absolute', left: L.cx - (7 * 56 + 6 * 18) / 2, top: 780}}
        />

        {/* Graphic timeline path with milestone markers */}
        <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {line > 0 ? <line x1={lineX} y1={lineTop} x2={lineX} y2={lineBottom} stroke={colors.gold} strokeWidth={2.4} strokeLinecap="round" /> : null}
          {Y.rows.map((_, i) => {
            const m = progress(frame, T.rows + i * T.rowStagger, 14, ease.out);
            return m > 0 ? (
              <g key={i}>
                <circle cx={lineX} cy={rowY(i)} r={16 * m} fill={alpha(colors.gold, 0.25)} />
                <circle cx={lineX} cy={rowY(i)} r={8 * m} fill={i === Y.rows.length - 1 ? colors.forest : colors.goldDeep} />
              </g>
            ) : null;
          })}
        </svg>

        {Y.rows.map((row, i) => {
          const t = progress(frame, T.rows + i * T.rowStagger, 22, ease.out);
          if (t <= 0) return null;
          return (
            <ScreenPanel
              key={i}
              screen={TIMELINE_SCREENS.byYear}
              crop={row}
              width={ROW_W}
              x={lineX + 50 + ROW_W / 2 + (1 - t) * 120}
              y={rowY(i) + float(frame, 3, 150, i) * t}
              opacity={Math.min(1, t * 2)}
              radius={18}
              edge={0.35}
              shadow={t * 0.6}
            />
          );
        })}
      </CameraRig>

      <HeadlineBlock headline={'Turn Your Daily Target\nInto a Long-Term Plan.'} start={T.headline} align="center" x={L.cx} y={220} width={1040} headlineSize={74} divider={false} />
    </AbsoluteFill>
  );
};
