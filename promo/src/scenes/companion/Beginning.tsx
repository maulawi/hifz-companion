import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {CalendarMotif} from '../../components/CalendarMotif';
import {CameraRig} from '../../components/CameraRig';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {COMPANION_ICON, COMPANION_SCREENS} from '../../data/companion';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {ease} from '../../styles/brand';

export const BEGINNING_T = {calendar: 0, icon: 12, layers: 34, headline: 58, glare: 70} as const;
const T = BEGINNING_T;

/** Scene 01 — a quiet calendar grid, the Hifz Companion icon, real UI layers drifting behind. */
export const Beginning: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const iconAt = {x: L.cx, y: 780};

  const icon = progress(frame, T.icon, 36, ease.out);
  const layers = progress(frame, T.layers, 40, ease.out);
  const settled = progress(frame, T.icon + 30, 30, ease.soft);
  const push = progress(frame, 0, 120, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.05} focusX={L.cx} focusY={iconAt.y}>
        <CalendarMotif
          cols={7}
          rows={5}
          cell={72}
          gap={18}
          draw={progress(frame, T.calendar, 56, ease.soft)}
          opacity={0.55}
          style={{position: 'absolute', left: L.cx - (7 * 72 + 6 * 18) / 2, top: iconAt.y - (5 * 72 + 4 * 18) / 2}}
        />

        {/* Real interface, floating as soft background layers */}
        <ScreenPanel
          screen={COMPANION_SCREENS.plan}
          width={330}
          x={230 - (1 - layers) * 80}
          y={940 + float(frame, 6, 150, 1) * layers}
          rotateY={20}
          rotateZ={-3}
          opacity={layers * 0.55}
          blur={3}
          shadow={layers * 0.6}
          radius={26}
        />
        <ScreenPanel
          screen={COMPANION_SCREENS.today}
          width={360}
          x={850 + (1 - layers) * 80}
          y={880 + float(frame, 6, 140, 2) * layers}
          rotateY={-20}
          rotateZ={3}
          opacity={layers * 0.75}
          blur={1.6}
          shadow={layers * 0.7}
          radius={28}
        />

        {icon > 0 ? (
          <AppIcon
            src={COMPANION_ICON.src}
            natural={COMPANION_ICON.natural}
            size={300}
            x={iconAt.x}
            y={iconAt.y + (1 - icon) * 170 + float(frame, 7, 120) * settled}
            rotateY={mix(32, 0, icon) + float(frame, 2.5, 150) * settled}
            rotateX={mix(14, 0, icon)}
            scale={mix(0.82, 1, icon)}
            opacity={Math.min(1, icon * 2.5)}
            glare={frame > T.glare ? -0.4 + (frame - T.glare) / 28 : -1}
          />
        ) : null}
      </CameraRig>

      <HeadlineBlock
        eyebrow="Hifz Companion"
        headline={'Every Hifz Journey\nNeeds Consistency.'}
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
