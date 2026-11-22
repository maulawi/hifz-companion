import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {CalendarMotif} from '../../components/CalendarMotif';
import {CameraRig} from '../../components/CameraRig';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {TIMELINE_ICON} from '../../data/timeline';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {alpha, colors, ease, fonts} from '../../styles/brand';

export const QUESTION_T = {calendar: 0, dial: 6, icon: 16, headline: 56, glare: 66} as const;
const T = QUESTION_T;

/** A slow dial of the 30 Juz — the numerical motif of the batch (no data, just the count). */
const JuzDial: React.FC<{cx: number; cy: number; radius: number; frame: number}> = ({cx, cy, radius, frame}) => (
  <>
    {Array.from({length: 30}, (_, i) => {
      const a = (i / 30) * Math.PI * 2 - Math.PI / 2 + frame * 0.0025;
      const appear = progress(frame, T.dial + i * 1.1, 14, ease.out);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cx + Math.cos(a) * radius - 30,
            top: cy + Math.sin(a) * radius - 20,
            width: 60,
            textAlign: 'center',
            fontFamily: fonts.serif,
            fontSize: i % 5 === 4 ? 30 : 22,
            color: alpha(i % 5 === 4 ? colors.goldDeep : colors.gold, 0.75),
            opacity: appear,
            transform: `scale(${mix(0.6, 1, appear)})`,
          }}
        >
          {i + 1}
        </div>
      );
    })}
  </>
);

/** Scene 01 — a calendar grid, a dial of 30 Juz and the Hifz Timeline icon. */
export const TheQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const c = {x: L.cx, y: 790};
  const icon = progress(frame, T.icon, 34, ease.out);
  const settled = progress(frame, T.icon + 30, 30, ease.soft);
  const push = progress(frame, 0, 120, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.05} focusX={c.x} focusY={c.y}>
        <CalendarMotif
          cols={7}
          rows={4}
          cell={58}
          gap={16}
          draw={progress(frame, T.calendar, 50, ease.soft)}
          opacity={0.38}
          style={{position: 'absolute', left: c.x - (7 * 58 + 6 * 16) / 2, top: c.y - (4 * 58 + 3 * 16) / 2}}
        />
        <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0}}>
          <circle cx={c.x} cy={c.y} r={300} fill="none" stroke={alpha(colors.gold, 0.35)} strokeWidth={1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress(frame, 0, 50, ease.soft)} />
        </svg>
        <JuzDial cx={c.x} cy={c.y} radius={350} frame={frame} />
        {icon > 0 ? (
          <AppIcon
            src={TIMELINE_ICON.src}
            natural={TIMELINE_ICON.natural}
            size={290}
            x={c.x}
            y={c.y + float(frame, 6, 120) * settled}
            rotateZ={mix(-24, 0, icon)}
            rotateY={mix(28, 0, icon) + float(frame, 2.5, 150) * settled}
            scale={mix(0.4, 1, icon)}
            opacity={Math.min(1, icon * 2.5)}
            glare={frame > T.glare ? -0.4 + (frame - T.glare) / 28 : -1}
          />
        ) : null}
      </CameraRig>

      <HeadlineBlock
        eyebrow="Hifz Timeline"
        headline={'How Long Will Your\nHifz Journey Take?'}
        start={T.headline}
        align="center"
        x={L.cx}
        y={1270}
        width={1000}
        headlineSize={80}
        divider={false}
      />
    </AbsoluteFill>
  );
};
