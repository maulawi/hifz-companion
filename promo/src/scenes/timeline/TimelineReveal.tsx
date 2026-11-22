import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {BrandLogo, logoHeightFor} from '../../components/BrandLogo';
import {Curve, curvePoint} from '../../components/GoldLightTrail';
import {KineticText} from '../../components/KineticText';
import {ScreenPanel} from '../../components/ScreenPanel';
import {TIMELINE_ICON, TIMELINE_REGIONS, TIMELINE_SCREENS} from '../../data/timeline';
import {useLayout} from '../../lib/layout';
import {mix, progress, settle} from '../../lib/motion';
import {alpha, colors, ease, type} from '../../styles/brand';

export const REVEAL_T = {rowsOut: 0, line: 6, lineDuration: 44, icon: 44, logo: 62, headline: 78, tagline: 108, fadeStart: 140} as const;
const T = REVEAL_T;

/**
 * Scene 05 — the year rows dissolve into a single clean gold line; it travels
 * past milestone dots to the Hifz Timeline icon, then the QURRA logo and lines.
 */
export const TimelineReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();

  const iconAt = {x: L.cx, y: 560};
  const curve: Curve = {
    from: {x: 170, y: 1520},
    c1: {x: 170, y: 1000},
    c2: {x: L.cx - 260, y: iconAt.y + 120},
    to: {x: iconAt.x - 160, y: iconAt.y},
  };
  const head = progress(frame, T.line, T.lineDuration, ease.inOut);
  const pathD = `M${curve.from.x},${curve.from.y} C${curve.c1.x},${curve.c1.y} ${curve.c2.x},${curve.c2.y} ${curve.to.x},${curve.to.y}`;
  const lineFade = 1 - progress(frame, T.icon + 20, 24, ease.soft);
  const rowsOut = progress(frame, T.rowsOut, 26, ease.in);

  const icon = settle(frame, fps, T.icon, 30);
  const logo = settle(frame, fps, T.logo, 30);
  const logoW = 260;
  const logoH = logoHeightFor(logoW);
  const tag = progress(frame, T.tagline, 18, ease.out);
  const fade = 1 - progress(frame, T.fadeStart, 10, ease.soft);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      {/* Year rows from the previous scene collapse into the line */}
      {TIMELINE_REGIONS.byYear.rows.map((row, i) =>
        rowsOut < 1 ? (
          <ScreenPanel
            key={i}
            screen={TIMELINE_SCREENS.byYear}
            crop={row}
            width={mix(760, 60, rowsOut)}
            x={mix(600, 170, rowsOut)}
            y={1030 + i * 175}
            opacity={1 - rowsOut}
            radius={18}
            edge={0.3}
          />
        ) : null,
      )}

      {/* The timeline becomes one clean gold line */}
      <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: lineFade}}>
        <path d={pathD} fill="none" stroke={alpha(colors.gold, 0.25)} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - head} />
        <path d={pathD} fill="none" stroke={colors.goldDeep} strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - head} />
      </svg>
      {[0.25, 0.5, 0.75].map((t) => {
        const p = curvePoint(curve, t);
        const on = progress(frame, T.line + t * T.lineDuration, 8, ease.out) * lineFade;
        return (
          <svg key={t} width={L.w} height={L.h} style={{position: 'absolute', inset: 0}}>
            <circle cx={p.x} cy={p.y} r={14 * on} fill={alpha(colors.gold, 0.25)} />
            <circle cx={p.x} cy={p.y} r={6 * on} fill={colors.goldDeep} />
          </svg>
        );
      })}

      <AppIcon
        src={TIMELINE_ICON.src}
        natural={TIMELINE_ICON.natural}
        size={230}
        x={iconAt.x}
        y={iconAt.y}
        rotateZ={mix(-18, 0, icon)}
        scale={mix(0.5, 1, icon)}
        opacity={icon}
        glare={frame > T.icon + 20 ? -0.4 + (frame - T.icon - 20) / 26 : -1}
      />
      <div style={{position: 'absolute', left: L.cx - logoW / 2, top: 900 - logoH / 2}}>
        <BrandLogo width={logoW} reveal={logo} />
      </div>
      <KineticText
        text={'Your Goal. Your Pace.\nYour Timeline.'}
        start={T.headline}
        stagger={3}
        duration={22}
        style={{position: 'absolute', left: 0, right: 0, top: 1150, ...type.headline, fontSize: 70, color: colors.forest}}
        wordStyles={{'Timeline.': {fontStyle: 'italic', color: colors.goldDeep}}}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1420,
          textAlign: 'center',
          ...type.eyebrow,
          fontSize: 24,
          letterSpacing: '0.42em',
          color: colors.goldDeep,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 12}px)`,
        }}
      >
        Learn&nbsp;&nbsp;·&nbsp;&nbsp;Preserve&nbsp;&nbsp;·&nbsp;&nbsp;Grow
      </div>
    </AbsoluteFill>
  );
};
