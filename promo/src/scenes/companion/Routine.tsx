import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CalendarMotif} from '../../components/CalendarMotif';
import {CameraRig} from '../../components/CameraRig';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {COMPANION_REGIONS, COMPANION_SCREENS} from '../../data/companion';
import {keyframes} from '../../lib/keyframes';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {regionOnScreen} from '../../lib/screenMap';
import {ease} from '../../styles/brand';

export const ROUTINE_T = {
  glimpse: 0,
  lift: 22, // rows leave the screen one by one
  liftStagger: 8,
  arrange: 62, // rows settle into a clean stack
  calendar: 70,
  daysLit: 88,
  headline: 8,
} as const;
const T = ROUTINE_T;

const SCREEN = COMPANION_SCREENS.suggested;
const R = COMPANION_REGIONS.suggested;
/** Only three details are shown: new memorisation, murajaah and study time. */
const ROWS = [R.rowNewMem, R.rowMurajaah, R.rowTime] as const;
/** Free-floating positions before the rows arrange themselves. */
const SCATTER = [
  {x: 360, y: 760, rot: -7, w: 760},
  {x: 720, y: 1000, rot: 6, w: 760},
  {x: 430, y: 1230, rot: -4, w: 760},
];

/**
 * Scene 03 — a brief glimpse of the Suggested Plan, then three real rows lift
 * out, drift independently and arrange into a calm stack while a calendar strip
 * fills day by day.
 */
export const Routine: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const full = {x: L.cx, y: 1150, width: 600, crop: {x: 0, y: 0, w: SCREEN.natural.width, h: SCREEN.natural.height}};
  const screenOut = progress(frame, T.lift, 40, ease.inOut);
  const ROW_W = 900;
  const rowH = (reg: (typeof ROWS)[number]) => (reg.h * ROW_W) / reg.w;
  const stackTop = 720;
  const gap = 26;

  const push = progress(frame, 0, 165, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.04} focusX={L.cx} focusY={950}>
        <ScreenPanel
          screen={SCREEN}
          width={full.width}
          x={full.x}
          y={full.y + screenOut * 40}
          scale={mix(1, 0.9, screenOut)}
          opacity={1 - screenOut}
          blur={screenOut * 6}
          radius={34}
        />

        {ROWS.map((reg, i) => {
          const start = T.lift + i * T.liftStagger;
          if (frame < start) return null;
          const s = regionOnScreen(full, reg);
          let top = stackTop;
          for (let j = 0; j < i; j++) top += rowH(ROWS[j]) + gap;
          const stack = {x: L.cx, y: top + rowH(reg) / 2, rot: 0, w: ROW_W};
          const st = keyframes<{x: number; y: number; rot: number; w: number}>(frame, [
            {f: start, x: s.cx, y: s.cy, rot: 0, w: s.w},
            {f: start + 26, ...SCATTER[i]},
            {f: T.arrange + i * 6, ...SCATTER[i], y: SCATTER[i].y + 20},
            {f: T.arrange + i * 6 + 28, ...stack},
          ]);
          const settled = progress(frame, T.arrange + i * 6 + 28, 30, ease.soft);
          return (
            <ScreenPanel
              key={i}
              screen={SCREEN}
              crop={reg}
              width={st.w}
              x={st.x}
              y={st.y + float(frame, 4, 140, i) * settled}
              rotateZ={st.rot}
              rotateY={st.rot * 1.4}
              radius={20}
              edge={0.45}
              shadow={progress(frame, start, 16)}
            />
          );
        })}

        <CalendarMotif
          cols={7}
          rows={1}
          cell={82}
          gap={22}
          draw={progress(frame, T.calendar, 26, ease.out)}
          lit={Math.max(0, (frame - T.daysLit) / 8)}
          opacity={0.9}
          style={{position: 'absolute', left: L.cx - (7 * 82 + 6 * 22) / 2, top: 1250}}
        />
      </CameraRig>

      <HeadlineBlock
        headline={'Find a Rhythm\nThat Works for You.'}
        start={T.headline}
        align="center"
        x={L.cx}
        y={240}
        width={1000}
        headlineSize={80}
        divider={false}
      />
    </AbsoluteFill>
  );
};
