import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {juzCell, TIMELINE_REGIONS, TIMELINE_SCREENS} from '../../data/timeline';
import {Rect} from '../../data/mutashabihatPage';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {lerpRect, regionOnScreen} from '../../lib/screenMap';
import {alpha, colors, ease} from '../../styles/brand';

export const CAPACITY_T = {
  cells: 8, // Juz 1–10 marked one by one ("where you are")
  cellStagger: 3,
  steps: 40,
  paceStep: 60,
  rowPace: 68,
  paceFrame: 84,
  rowWeekly: 92,
  weeklyFrame: 112,
  connector: 104,
  headline: 6,
} as const;
const T = CAPACITY_T;

const START = TIMELINE_SCREENS.start;
const RES = TIMELINE_SCREENS.results;
const RS = TIMELINE_REGIONS.start;
const RR = TIMELINE_REGIONS.results;
const ROW1: Rect = {x: RR.cellCurrent.x, y: RR.cellCurrent.y, w: RR.cellPace.x + RR.cellPace.w - RR.cellCurrent.x, h: RR.cellCurrent.h};
const ROW2: Rect = {x: RR.cellWeekly.x, y: RR.cellWeekly.y, w: RR.cellRemaining.x + RR.cellRemaining.w - RR.cellWeekly.x, h: RR.cellWeekly.h};

/**
 * Scene 02 — where you are (Juz 1–10 marked on the real input grid), then the
 * real step bar moves on to "Your Pace" and the actual pace values float in:
 * "½ page × 4d/wk" → "2 pages/week". Values come from the supplied Results
 * screen; no input field is invented.
 */
export const DailyCapacity: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const full = {x: L.cx, y: 1230, width: 600, crop: {x: 0, y: 0, w: START.natural.width, h: 1214}};
  const recede = progress(frame, T.steps, 30, ease.inOut);
  const s = regionOnScreen(full, RS.steps);
  const steps = lerpRect({x: s.cx, y: s.cy, w: s.w}, {x: L.cx, y: 640, w: 1000}, recede);

  const W = 900;
  const r1 = progress(frame, T.rowPace, 24, ease.out);
  const r2 = progress(frame, T.rowWeekly, 24, ease.out);
  const row1 = {x: L.cx, y: 900, width: W, crop: ROW1};
  const row2 = {x: L.cx, y: 1190, width: W, crop: ROW2};
  const pace = regionOnScreen(row1, RR.cellPace);
  const weekly = regionOnScreen(row2, RR.cellWeekly);
  const conn = progress(frame, T.connector, 22, ease.inOut);
  const settled = progress(frame, T.rowWeekly + 20, 30, ease.soft);
  const push = progress(frame, 0, 150, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.04} focusX={L.cx} focusY={1000}>
        {/* The real input screen: Juz 1–10 marked, then receding */}
        <ScreenPanel
          screen={START}
          crop={full.crop}
          width={full.width}
          x={full.x}
          y={full.y + recede * 60}
          scale={mix(1, 0.88, recede)}
          opacity={mix(1, 0, recede)}
          blur={recede * 6}
          radius={34}
        >
          {Array.from({length: 10}, (_, i) => (
            <GoldFrame key={i} rect={juzCell(i + 1)} draw={progress(frame, T.cells + i * T.cellStagger, 10, ease.out)} radius={16} color={colors.olive} stroke={2.6} glow={8} fill={0.9} />
          ))}
        </ScreenPanel>

        {/* Step bar lifts out; "2 · Your Pace" is marked */}
        {frame >= T.steps ? (
          <ScreenPanel screen={START} crop={RS.steps} width={steps.w} x={steps.x} y={steps.y} radius={18} shadow={recede * 0.7} edge={0.3}>
            <GoldFrame rect={RS.stepPace} draw={progress(frame, T.paceStep, 16, ease.out)} radius={14} color={colors.goldDeep} stroke={2} glow={10} />
          </ScreenPanel>
        ) : null}

        {r1 > 0 ? (
          <ScreenPanel screen={RES} crop={ROW1} width={W} x={row1.x} y={row1.y + (1 - r1) * 90 + float(frame, 4, 140) * settled} opacity={Math.min(1, r1 * 2)} radius={22} edge={0.5} shadow={r1}>
            <GoldFrame rect={{x: RR.cellPace.x + 6, y: RR.cellPace.y + 6, w: RR.cellPace.w - 12, h: RR.cellPace.h - 12}} draw={progress(frame, T.paceFrame, 16, ease.out)} radius={12} color={colors.goldDeep} stroke={2.4} glow={10} />
          </ScreenPanel>
        ) : null}
        {r2 > 0 ? (
          <ScreenPanel screen={RES} crop={ROW2} width={W} x={row2.x} y={row2.y + (1 - r2) * 90 + float(frame, 4, 140, 1) * settled} opacity={Math.min(1, r2 * 2)} radius={22} edge={0.5} shadow={r2}>
            <GoldFrame rect={{x: RR.cellWeekly.x + 6, y: RR.cellWeekly.y + 6, w: RR.cellWeekly.w - 12, h: RR.cellWeekly.h - 12}} draw={progress(frame, T.weeklyFrame, 16, ease.out)} radius={12} color={colors.goldDeep} stroke={2.4} glow={10} />
          </ScreenPanel>
        ) : null}

        {/* Pace → weekly: a gold connector between the two real values */}
        {conn > 0 ? (
          <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path
              d={`M${pace.cx},${pace.y + pace.h - 4} C${pace.cx},${pace.y + pace.h + 70} ${weekly.cx},${weekly.y - 70} ${weekly.cx},${weekly.y + 4}`}
              fill="none"
              stroke={colors.goldDeep}
              strokeWidth={2.2}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - conn}
              strokeLinecap="round"
            />
            <circle cx={weekly.cx} cy={weekly.y + 4} r={6 * Math.max(0, conn * 4 - 3)} fill={colors.goldDeep} />
            <circle cx={pace.cx} cy={pace.y + pace.h - 4} r={10} fill={alpha(colors.gold, 0.3 * conn)} />
          </svg>
        ) : null}
      </CameraRig>

      <HeadlineBlock headline={'Start With Your\nDaily Capacity.'} start={T.headline} align="center" x={L.cx} y={220} width={1000} headlineSize={84} divider={false} />
    </AbsoluteFill>
  );
};
