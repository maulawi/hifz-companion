import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../components/CameraRig';
import {ScreenPanel} from '../components/ScreenPanel';
import {useLayout} from '../lib/layout';
import {mix, progress} from '../lib/motion';
import {ease} from '../styles/brand';
import {ArabicLetterField, GoldPoint, LightSweepText, MakhrajIcon, SoundWave, TRACT_ANCHORS, VideoPanel, VocalTract, Wordmark} from './components';
import {CUE, MK, MK_MARKERS, MK_REGIONS_5, MK_SCREENS, MK_TYPE} from './theme';

/** Visibility window with eased fades (absolute frames). */
export const win = (frame: number, a: number, b: number, fin = 14, fout = 14) =>
  Math.min(progress(frame, a, fin, ease.out), 1 - progress(frame, b - fout, fout, ease.in));

export const DARK_PANEL: React.CSSProperties = {boxShadow: '0 50px 120px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(200,164,93,0.28)'};

export const Caption: React.FC<{text: string; appear: number; size?: number; style?: React.CSSProperties; color?: string}> = ({text, appear, size = 22, style, color = MK.gold}) => (
  <div
    style={{
      ...MK_TYPE.label,
      fontSize: size * 1.45,
      letterSpacing: `${mix(0.08, 0.015, appear)}em`,
      color,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 10}px)`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </div>
);

// ───────────────────────── 1 · Origin ─────────────────────────

/** "You know the letters, but have you ever truly explored where they come from?" */
export const SceneOrigin: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, 0, 160, 1, 20);
  if (v <= 0) return null;
  // A thin gold light crosses the darkness before the first word
  const streak = progress(frame, 0, 34, ease.inOut);
  const lift = progress(frame, CUE.but, 40, ease.inOut);
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div
        style={{
          position: 'absolute',
          top: L.cy - 1,
          left: mix(-L.w * 0.4, L.w * 1.0, streak),
          width: L.w * 0.4,
          height: 2,
          background: `linear-gradient(90deg, rgba(200,164,93,0), ${MK.gold}, rgba(255,246,221,0.9), rgba(200,164,93,0))`,
          filter: 'blur(0.5px)',
          opacity: 1 - progress(frame, 26, 10),
        }}
      />
      {/* "You know the letters" — the 28 letters surface in a slow depth field */}
      <ArabicLetterField w={L.w} h={L.h} clear={L.landscape ? {w: 640, h: 180} : {w: 470, h: 260}} start={CUE.letters - 8} gather={CUE.where + 18} />
      <div style={{position: 'absolute', left: 0, right: 0, top: L.cy - (L.landscape ? 60 : 56) - lift * (L.landscape ? 44 : 60)}}>
        <LightSweepText text="You know the letters." start={8} size={L.landscape ? 86 : 72} duration={36} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.cy + (L.landscape ? 40 : 50)}}>
        <LightSweepText text="Where do they come from?" start={CUE.where - 4} size={L.landscape ? 46 : 44} duration={30} color={MK.gold} italic />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2 · Anatomy ─────────────────────────

/** Geometry shared by the line drawing and the 3D hand-off. */
export const useTract = () => {
  const L = useLayout();
  const size = L.landscape ? 720 : 860;
  const left = L.cx - size / 2 - (L.landscape ? 0 : 30);
  const top = L.cy - size / 2 + (L.landscape ? 10 : -40);
  const k = size / 600;
  const anchor = (a: keyof typeof TRACT_ANCHORS) => ({x: left + TRACT_ANCHORS[a].x * k, y: top + TRACT_ANCHORS[a].y * k});
  return {size, left, top, k, anchor};
};

/** Head screenshot placement so marker 3 (middle of the throat) lands on the drawing's throat point. */
export const headPlacement = (tract: ReturnType<typeof useTract>) => {
  const width = tract.size * 0.98;
  const k = width / MK_SCREENS.head.natural.width;
  const h = MK_SCREENS.head.natural.height * k;
  const p = tract.anchor('throat');
  const m = MK_MARKERS[3];
  return {width, x: p.x - m.x * k + width / 2, y: p.y - m.y * k + h / 2, k};
};

/**
 * "Every letter has an origin, a precise point of articulation, a movement
 * within the human anatomy, and a characteristic that gives it its distinct sound."
 */
export const SceneAnatomy: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const tract = useTract();
  const v = win(frame, 118, 470, 20, 24);
  if (v <= 0) return null;
  const draw = progress(frame, 120, 150, ease.soft);
  const throat = tract.anchor('throat');
  const point = progress(frame, CUE.point - 4, 14, ease.out);
  const push = progress(frame, CUE.point, CUE.anatomy - CUE.point + 40, ease.inOut);
  const toReal = progress(frame, CUE.anatomy - 6, 30, ease.inOut);
  const head = headPlacement(tract);
  const wave = progress(frame, CUE.characteristic, 70, ease.inOut);

  return (
    <AbsoluteFill style={{opacity: v}}>
      <CameraRig zoom={1 + push * 0.22} focusX={throat.x} focusY={throat.y} panX={(L.cx - throat.x) * push * 0.4} panY={(L.cy - throat.y) * push * 0.3}>
        <VocalTract size={tract.size} draw={draw} opacity={1 - toReal * 0.75} style={{position: 'absolute', left: tract.left, top: tract.top}} />
        {toReal > 0 ? (
          <ScreenPanel
            screen={MK_SCREENS.head}
            width={head.width}
            x={head.x}
            y={head.y}
            opacity={toReal}
            radius={24}
            shadow={0}
            edge={0}
            style={{...DARK_PANEL, filter: toReal < 1 ? `blur(${(1 - toReal) * 6}px)` : undefined}}
          />
        ) : null}
        <GoldPoint x={throat.x} y={throat.y} appear={point} scale={0.8} pulseFrom={CUE.point} />
        {wave > 0 ? (
          <SoundWave
            width={L.landscape ? 760 : 620}
            amp={L.landscape ? 26 : 22}
            draw={wave}
            phase={frame * 0.25}
            opacity={1 - progress(frame, 440, 24)}
            style={{position: 'absolute', left: throat.x, top: throat.y - 40}}
          />
        ) : null}
      </CameraRig>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? L.h - 170 : L.h - 360, textAlign: 'center'}}>
        <Caption text="A precise point of articulation" appear={win(frame, CUE.point, CUE.anatomy + 4, 14, 12)} size={L.landscape ? 22 : 24} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? L.h - 170 : L.h - 360, textAlign: 'center'}}>
        <Caption text="A distinct sound" appear={win(frame, CUE.sound - 10, 462, 14, 14)} size={L.landscape ? 22 : 24} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3 · Reveal ─────────────────────────

/** "Introducing Makhraj Lab, a new way to explore the articulation of the Qur'anic letters." */
export const SceneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, CUE.introducing - 8, 650, 10, 22);
  if (v <= 0) return null;
  const bloom = progress(frame, CUE.introducing - 6, 18, ease.out) * (1 - progress(frame, CUE.introducing + 14, 30, ease.soft));
  const icon = progress(frame, CUE.introducing, 34, ease.out);
  const word = progress(frame, CUE.makhraj, 30, ease.out);
  const tag = progress(frame, CUE.newWay, 26, ease.out);
  const drift = progress(frame, CUE.introducing, 200, ease.soft);
  const iconSize = L.landscape ? 200 : 250;
  return (
    <AbsoluteFill style={{opacity: v, transform: `scale(${1 + drift * 0.03})`}}>
      <AbsoluteFill style={{background: `radial-gradient(circle ${300 + bloom * 500}px at ${L.cx}px ${L.cy - 60}px, rgba(200,164,93,${0.28 * bloom}), rgba(200,164,93,0) 70%)`}} />
      <div style={{position: 'absolute', left: L.cx - iconSize / 2, top: L.cy - (L.landscape ? 250 : 380)}}>
        <MakhrajIcon size={iconSize} appear={icon} glare={frame > CUE.introducing + 20 ? -0.3 + (frame - CUE.introducing - 20) / 36 : -1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.cy + (L.landscape ? 10 : -40)}}>
        <Wordmark size={L.landscape ? 54 : 58} appear={word} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: L.landscape ? L.cx - 520 : 90,
          right: L.landscape ? L.cx - 520 : 90,
          top: L.cy + (L.landscape ? 170 : 150),
          textAlign: 'center',
          ...MK_TYPE.label,
          fontSize: L.landscape ? 34 : 40,
          lineHeight: 1.45,
          color: MK.ivory,
          opacity: tag * 0.82,
          transform: `translateY(${(1 - tag) * 12}px)`,
        }}
      >
        A new way to explore the articulation of the Qur’anic letters.
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 4–5 · Regions & 17 points ─────────────────────────

/**
 * "Discover the five general regions. Explore the 17 articulation points
 * through an interactive three-dimensional model."
 */
export const SceneModel: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, 630, 880, 22, 20);
  if (v <= 0) return null;

  const enter = progress(frame, 630, 34, ease.out);
  const vidW = L.landscape ? 520 : 640;
  const headX = L.landscape ? 1260 : L.cx;
  const headY = L.landscape ? L.cy : 770;
  const push = progress(frame, CUE.seventeen, 100, ease.inOut);

  // Regions list, then the 17 points
  const regionsOn = win(frame, CUE.five - 6, CUE.explore + 6, 12, 14);
  const pointsOn = progress(frame, CUE.explore, 16, ease.out);
  const toJaw = progress(frame, CUE.interactive + 6, 22, ease.inOut);
  const activeRegion = MK_REGIONS_5.reduce((acc, _, i) => (frame >= CUE.five + i * 9 ? i : acc), -1);

  return (
    <AbsoluteFill style={{opacity: v}}>
      {/* The real 3D viewer: the head turns with all 17 markers, then the point-5 orbit */}
      <VideoPanel take="headRotate" from={640} width={vidW} x={headX + (1 - enter) * 60} y={headY} opacity={enter * (1 - toJaw)} scale={1 + push * 0.04} />
      <VideoPanel take="point5Orbit" from={CUE.interactive + 4} width={vidW} x={headX} y={headY} opacity={toJaw} scale={mix(1.04, 1, toJaw)} />

      {/* Copy */}
      <div style={{position: 'absolute', left: L.landscape ? 150 : 0, right: L.landscape ? undefined : 0, top: L.landscape ? 330 : 1330, textAlign: L.landscape ? 'left' : 'center', opacity: regionsOn}}>
        <Caption text="Five general regions" appear={regionsOn} size={L.landscape ? 20 : 24} style={{marginBottom: 30}} />
        {MK_REGIONS_5.map((r, i) => {
          const a = progress(frame, CUE.five + i * 9, 14, ease.out);
          return (
            <div key={r.name} style={{opacity: a * (i === activeRegion ? 1 : 0.55), transform: `translateX(${(1 - a) * (L.landscape ? -16 : 0)}px)`, marginBottom: L.landscape ? 16 : 10}}>
              <span style={{...MK_TYPE.serif, fontSize: L.landscape ? 40 : 42, color: i === activeRegion ? MK.gold : MK.ivory}}>{r.name}</span>
              {L.landscape ? <span style={{...MK_TYPE.label, fontSize: 22, color: MK.ivory, opacity: 0.6, marginLeft: 16}}>{r.gloss}</span> : null}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: L.landscape ? 150 : 0, right: L.landscape ? undefined : 0, top: L.landscape ? 360 : 1360, textAlign: L.landscape ? 'left' : 'center', opacity: pointsOn * (1 - progress(frame, 858, 18))}}>
        <div style={{...MK_TYPE.title, fontSize: L.landscape ? 190 : 210, lineHeight: 1, color: MK.ivory, letterSpacing: '-0.01em', fontVariantNumeric: 'lining-nums'}}>
          {Math.min(17, Math.max(1, Math.round(progress(frame, CUE.seventeen, 52, ease.out) * 17)))}
        </div>
        <Caption text="Articulation points" appear={pointsOn} size={L.landscape ? 22 : 26} style={{marginTop: 18}} />
        <Caption text="Interactive 3D model" appear={progress(frame, CUE.interactive, 16, ease.out)} size={L.landscape ? 18 : 22} color={MK.ivory} style={{marginTop: 22, opacity: 0.75}} />
      </div>
    </AbsoluteFill>
  );
};
