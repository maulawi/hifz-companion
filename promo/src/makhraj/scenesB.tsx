import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../components/CameraRig';
import {GoldFrame} from '../components/GoldFrame';
import {ScreenPanel} from '../components/ScreenPanel';
import {Rect} from '../data/mutashabihatPage';
import {useLayout} from '../lib/layout';
import {float, mix, progress} from '../lib/motion';
import {ease} from '../styles/brand';
import {LightSweepText, MakhrajIcon, ManuscriptBayt, VideoPanel, Wordmark} from './components';
import {Caption, DARK_PANEL, win} from './scenesA';
import {CUE, MK, MK_REGIONS, MK_SCREENS, MK_TYPE} from './theme';

const R = MK_REGIONS;
const union = (a: Rect, b: Rect): Rect => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return {x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y};
};

// ───────────────────────── 6 · Letters ─────────────────────────

/** "See where each letter is formed. Learn how it is articulated." */
export const SceneLetters: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, 862, 1000, 20, 18);
  if (v <= 0) return null;
  const enter = progress(frame, 862, 30, ease.out);
  const toLesson = progress(frame, CUE.learnHow - 6, 26, ease.inOut);
  const tileLit = progress(frame, CUE.eachLetter, 16, ease.out);
  const zoom = progress(frame, CUE.formed - 10, 40, ease.inOut);

  const gridW = L.landscape ? 1460 : 1020;
  const gridX = L.cx;
  const gridY = L.landscape ? L.cy + 20 : 820;
  const g = R.letters.grid;
  const k = gridW / g.w;
  const waw = R.letters.tileWaw;
  const wawX = gridX - gridW / 2 + (waw.x + waw.w / 2 - g.x) * k;
  const wawY = gridY - (g.h * k) / 2 + (waw.y + waw.h / 2 - g.y) * k;

  const lessonCrop = union(R.waw.header, R.waw.whereHeading);
  const lessonW = L.landscape ? 560 : 860;

  return (
    <AbsoluteFill style={{opacity: v}}>
      <CameraRig zoom={1 + zoom * 0.5} focusX={wawX} focusY={wawY}>
        <ScreenPanel
          screen={MK_SCREENS.letters}
          crop={g}
          width={gridW}
          x={gridX}
          y={gridY + (1 - enter) * 50}
          opacity={enter * (1 - toLesson)}
          radius={22}
          shadow={0}
          edge={0}
          style={DARK_PANEL}
        >
          <rect x={g.x} y={g.y} width={g.w} height={g.h} fill={`rgba(9,43,35,${0.35 * tileLit})`} />
          <GoldFrame rect={{x: waw.x - 2, y: waw.y - 2, w: waw.w + 4, h: waw.h + 4}} draw={tileLit} radius={18} color={MK.gold} stroke={2.4} glow={14} />
        </ScreenPanel>
      </CameraRig>
      {/* the wāw tile itself stays bright above the dimmed grid */}
      {tileLit > 0 && toLesson < 1 ? (
        <CameraRig zoom={1 + zoom * 0.5} focusX={wawX} focusY={wawY}>
          <ScreenPanel screen={MK_SCREENS.letters} crop={waw} width={waw.w * k} x={wawX} y={wawY - tileLit * 8} opacity={(1 - toLesson) * tileLit} radius={14} shadow={tileLit} edge={0} />
        </CameraRig>
      ) : null}

      {toLesson > 0 ? (
        <ScreenPanel
          screen={MK_SCREENS.waw}
          crop={lessonCrop}
          width={lessonW}
          x={L.landscape ? 1180 : L.cx}
          y={L.landscape ? L.cy : 820}
          scale={mix(0.9, 1, toLesson)}
          opacity={toLesson}
          radius={30}
          shadow={0}
          edge={0}
          style={DARK_PANEL}
        >
          <GoldFrame rect={{x: R.waw.whereHeading.x + 4, y: R.waw.whereHeading.y + 4, w: R.waw.whereHeading.w - 8, h: R.waw.whereHeading.h - 8}} draw={progress(frame, CUE.learnHow + 16, 18, ease.out)} radius={16} color={MK.gold} stroke={2} glow={10} />
        </ScreenPanel>
      ) : null}

      <div style={{position: 'absolute', left: L.landscape ? 170 : 0, right: L.landscape ? undefined : 0, top: L.landscape ? L.cy - 70 : 1500, textAlign: L.landscape ? 'left' : 'center'}}>
        <Caption text="Where each letter is formed" appear={win(frame, CUE.see, CUE.learnHow + 2, 14, 10)} size={L.landscape ? 22 : 26} />
      </div>
      <div style={{position: 'absolute', left: L.landscape ? 170 : 0, right: L.landscape ? undefined : 0, top: L.landscape ? L.cy - 70 : 1500, textAlign: L.landscape ? 'left' : 'center'}}>
        <Caption text="How it is articulated" appear={win(frame, CUE.learnHow + 4, 996, 14, 12)} size={L.landscape ? 22 : 26} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 7 · Ṣifāt & compare ─────────────────────────

/** "Understand its characteristics. Compare letters that sound similar but are formed differently." */
export const SceneSifat: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, 988, 1172, 18, 18);
  if (v <= 0) return null;
  const card = progress(frame, CUE.understand - 4, 26, ease.out);
  const line = progress(frame, CUE.compare + 6, 22, ease.out);
  const tilesIn = progress(frame, CUE.compare, 24, ease.out);
  const together = progress(frame, CUE.similar - 6, 18, ease.inOut) - progress(frame, CUE.differently - 8, 20, ease.inOut);
  const labels = progress(frame, CUE.differently - 4, 16, ease.out);

  const cardW = L.landscape ? 720 : 960;
  const cardX = L.landscape ? 620 : L.cx;
  const cardY = L.landscape ? L.cy : 640;
  const tileW = L.landscape ? 250 : 300;
  const tilesY = L.landscape ? L.cy : 1290;
  const base = L.landscape ? 1440 : L.cx;
  const gap = mix(L.landscape ? 170 : 190, L.landscape ? 128 : 150, Math.max(0, together));
  const th = (t: Rect) => ({x: t.x, y: t.y + t.h * 0.62, w: t.w, h: t.h * 0.34});

  return (
    <AbsoluteFill style={{opacity: v}}>
      <ScreenPanel
        screen={MK_SCREENS.glossary}
        crop={R.glossary.sifah}
        width={cardW}
        x={cardX}
        y={cardY + (1 - card) * 40 + float(frame, 4, 140) * card}
        opacity={card}
        radius={28}
        shadow={0}
        edge={0}
        style={DARK_PANEL}
      >
        <rect x={R.glossary.sifahLine.x + 2} y={R.glossary.sifahLine.y + R.glossary.sifahLine.h - 4} width={(R.glossary.sifahLine.w - 4) * line} height={3} fill={MK.gold} />
      </ScreenPanel>

      {/* ḥāʾ and hāʾ — two throat letters often confused, from different points */}
      {tilesIn > 0
        ? [R.letters.tileHaa, R.letters.tileHa].map((t, i) => (
            <ScreenPanel
              key={i}
              screen={MK_SCREENS.letters}
              crop={t}
              width={tileW}
              x={base + (i === 0 ? -gap : gap) + (1 - tilesIn) * (i === 0 ? -60 : 60)}
              y={tilesY + float(frame, 5, 120, i)}
              opacity={tilesIn}
              radius={22}
              shadow={0}
              edge={0}
              style={DARK_PANEL}
            >
              <GoldFrame rect={th(t)} draw={labels} radius={10} color={MK.gold} stroke={2} glow={8} />
            </ScreenPanel>
          ))
        : null}

      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? 150 : 210, textAlign: 'center'}}>
        <Caption text="Ṣifāt — the characteristics" appear={win(frame, CUE.understand, CUE.compare + 4, 14, 10)} size={L.landscape ? 22 : 26} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? 150 : 210, textAlign: 'center'}}>
        <Caption text="Similar sound · different origin" appear={win(frame, CUE.compare + 6, 1168, 14, 12)} size={L.landscape ? 22 : 26} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8 · Everything ─────────────────────────

type Beat = {at: number; label: string; screen: keyof typeof MK_SCREENS; crop?: Rect; width: [number, number]};

/** "From structured lessons and visual anatomy, to audio examples, interactive practice and classical references." */
export const SceneEverything: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, 1160, 1480, 16, 22);
  if (v <= 0) return null;

  const beats: Beat[] = [
    {at: CUE.lessons - 6, label: 'Structured lessons', screen: 'waw', crop: union(R.waw.header, R.waw.intro), width: [620, 900]},
    {at: CUE.anatomy2 - 6, label: 'Visual anatomy', screen: 'jaw', width: [420, 560]},
    {at: CUE.audio - 6, label: 'Audio examples', screen: 'wawAudio', crop: R.wawAudio.audio, width: [760, 940]},
    {at: CUE.practice - 6, label: 'Interactive practice', screen: 'practice', crop: R.practice.card, width: [520, 820]},
    {at: CUE.classical - 6, label: 'Classical references', screen: 'wawAudio', crop: R.wawAudio.classical, width: [760, 940]},
  ];
  const toManuscript = progress(frame, CUE.everything - 10, 30, ease.inOut);
  const cx = L.cx;
  const cy = L.landscape ? L.cy + 10 : 860;

  return (
    <AbsoluteFill style={{opacity: v}}>
      {beats.map((b, i) => {
        const appear = progress(frame, b.at, 18, ease.out);
        if (appear <= 0) return null;
        // Each later beat pushes this card one step back (eased); after two steps it fades away.
        const step = (j: number) => progress(frame, beats[i + j]?.at ?? 99999, 18, ease.inOut);
        const d = step(1) + step(2);
        const gone = step(3);
        const w = b.width[L.landscape ? 0 : 1];
        const side = i % 2 === 0 ? -1 : 1;
        if (b.screen === 'jaw') {
          return (
            <VideoPanel
              key={i}
              take="point5Intro"
              from={b.at}
              width={w}
              x={cx + d * side * (L.landscape ? 360 : 150) + (1 - appear) * side * -60}
              y={cy - d * (L.landscape ? 40 : 160) + (1 - appear) * 40}
              scale={1 - d * 0.16}
              opacity={appear * (1 - d * 0.35) * (1 - gone) * (1 - toManuscript)}
              tilt={3}
            />
          );
        }
        return (
          <ScreenPanel
            key={i}
            screen={MK_SCREENS[b.screen]}
            crop={b.crop}
            width={w}
            x={cx + d * side * (L.landscape ? 360 : 150) + (1 - appear) * side * -60}
            y={cy - d * (L.landscape ? 40 : 160) + (1 - appear) * 40}
            scale={1 - d * 0.16}
            rotateY={d * side * (L.landscape ? -10 : -6)}
            opacity={appear * (1 - d * 0.35) * (1 - gone) * (1 - toManuscript)}
            blur={d * 2.5 + toManuscript * 4}
            radius={26}
            shadow={0}
            edge={0}
            style={DARK_PANEL}
          >
            {b.screen === 'practice' ? (
              <GoldFrame rect={R.practice.optHalq} draw={progress(frame, CUE.practice + 14, 14, ease.out)} radius={26} color={MK.gold} stroke={2.6} glow={12} />
            ) : null}
            {b.label === 'Classical references' ? (
              <rect x={R.wawAudio.baytLine.x} y={R.wawAudio.baytLine.y + R.wawAudio.baytLine.h} width={R.wawAudio.baytLine.w * progress(frame, CUE.classical + 10, 22, ease.out)} height={3} fill={MK.gold} />
            ) : null}
          </ScreenPanel>
        );
      })}

      {/* Classical knowledge → modern understanding */}
      {toManuscript > 0 ? (
        <div style={{position: 'absolute', left: L.cx - (L.landscape ? 620 : 500), top: (L.landscape ? L.cy - 270 : 700)}}>
          <ManuscriptBayt
            width={L.landscape ? 1240 : 1000}
            appear={toManuscript}
            fontSize={L.landscape ? 68 : 60}
            lineProgress={[progress(frame, CUE.everything + 4, 34, ease.inOut), progress(frame, CUE.everything + 30, 34, ease.inOut)]}
          />
        </div>
      ) : null}

      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? L.h - 140 : L.h - 330, textAlign: 'center'}}>
        {beats.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0}}>
            <Caption text={b.label} appear={win(frame, b.at + 4, (beats[i + 1]?.at ?? CUE.everything - 6) + 2, 10, 8)} size={L.landscape ? 22 : 26} />
          </div>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0}}>
          <Caption text="Classical knowledge · Modern understanding" appear={win(frame, CUE.everything + 16, 1476, 16, 16)} size={L.landscape ? 22 : 24} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9 · Experience ─────────────────────────

/**
 * "…brought together in one immersive learning experience. Not just learning
 * where a letter comes from, but seeing it, understanding it, and refining the way you recite."
 */
export const SceneExperience: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = win(frame, 1464, 1805, 22, 26);
  if (v <= 0) return null;
  const gather = progress(frame, 1464, 44, ease.out);
  const drift = progress(frame, 1464, 340, ease.soft);

  // Which panel leads for each word
  const lead = frame >= CUE.refining - 4 ? 2 : frame >= CUE.understanding - 4 ? 1 : frame >= CUE.seeing - 4 ? 0 : -1;
  const panels: Array<{screen: keyof typeof MK_SCREENS; crop?: Rect; w: [number, number]; pos: [[number, number], [number, number]]}> = [
    {screen: 'jaw', w: [560, 420], pos: [[-560, -20], [-270, 0]]},
    {screen: 'waw', crop: union(R.waw.header, R.waw.intro), w: [460, 600], pos: [[0, 10], [0, 0]]},
    {screen: 'practice', crop: R.practice.card, w: [380, 440], pos: [[540, 0], [270, 0]]},
  ];
  const words = [
    {t: 'Seeing', at: CUE.seeing},
    {t: 'Understanding', at: CUE.understanding},
    {t: 'Refining', at: CUE.refining},
  ];
  const cy = L.landscape ? L.cy - 20 : 860;

  return (
    <AbsoluteFill style={{opacity: v}}>
      <AbsoluteFill style={{transform: `scale(${1.04 - drift * 0.04})`}}>
        {panels.map((p, i) => {
          const [dx, dy] = p.pos[L.landscape ? 0 : 1];
          const focus = lead === -1 ? 0 : lead === i ? 1 : -1;
          const f = progress(frame, lead === -1 ? 99999 : words[lead].at - 4, 16, ease.inOut);
          const w = p.w[L.landscape ? 0 : 1];
          if (p.screen === 'jaw') {
            return (
              <VideoPanel
                key={i}
                take="point5Orbit"
                from={1464}
                playbackRate={0.7}
                width={L.landscape ? 380 : 420}
                x={L.cx + dx * mix(1.4, 1, gather) * (focus === 1 && !L.landscape ? 1 - 0.75 * f : 1) + float(frame, 6, 160, i)}
                y={cy + dy + float(frame, 6, 140, i + 2)}
                scale={1 + (focus === 1 ? 0.1 * f : focus === -1 ? -0.06 * f : 0)}
                opacity={gather * (focus === -1 ? 1 - 0.45 * f : 1)}
                zIndex={focus === 1 ? 3 : 1}
              />
            );
          }
          return (
            <ScreenPanel
              key={i}
              screen={MK_SCREENS[p.screen]}
              crop={p.crop}
              width={w}
              x={L.cx + dx * mix(1.4, 1, gather) * (focus === 1 && !L.landscape ? 1 - 0.75 * f : 1) + float(frame, 6, 160, i)}
              y={cy + dy + float(frame, 6, 140, i + 2)}
              scale={1 + (focus === 1 ? 0.1 * f : focus === -1 ? -0.06 * f : 0)}
              opacity={gather * (focus === -1 ? 1 - 0.45 * f : 1)}
              blur={focus === -1 ? 2.5 * f : 0}
              rotateY={L.landscape ? (i - 1) * -8 * (1 - (focus === 1 ? f : 0)) : 0}
              radius={26}
              shadow={0}
              edge={0}
              style={{...DARK_PANEL, zIndex: focus === 1 ? 3 : 1}}
            />
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? L.h - 190 : 1420, textAlign: 'center'}}>
        <Caption text="One immersive learning experience" appear={win(frame, CUE.immersive - 10, CUE.seeing - 8, 14, 12)} size={L.landscape ? 22 : 26} />
      </div>
      {words.map((w, i) => (
        <div key={w.t} style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? L.h - 210 : 1400}}>
          <LightSweepText text={w.t} start={w.at - 4} size={L.landscape ? 54 : 56} duration={20} exitStart={i < 2 ? words[i + 1].at - 6 : 1782} tracking={[0.5, 0.26]} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ───────────────────────── 10 · Call to action ─────────────────────────

/** "Explore. Understand. Refine. Makhraj Lab. Discover the origin of every letter." */
export const SceneCTA: React.FC<{url?: string}> = ({url}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = progress(frame, 1796, 18, ease.out);
  if (v <= 0) return null;
  const triadOut = progress(frame, CUE.ctaName - 8, 18, ease.in);
  const icon = progress(frame, CUE.ctaName - 4, 30, ease.out);
  const word = progress(frame, CUE.ctaName + 4, 30, ease.out);
  const line = progress(frame, CUE.ctaDiscover, 26, ease.out);
  const link = progress(frame, CUE.ctaDiscover + 30, 24, ease.out);
  const triad = [
    {t: 'Explore.', at: CUE.ctaExplore},
    {t: 'Understand.', at: CUE.ctaUnderstand},
    {t: 'Refine.', at: CUE.ctaRefine},
  ];
  const iconSize = L.landscape ? 190 : 230;
  return (
    <AbsoluteFill style={{opacity: v}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? L.cy - 130 : L.cy - 230, opacity: 1 - triadOut, transform: `translateY(${-triadOut * 30}px)`}}>
        {triad.map((w) => (
          <div key={w.t} style={{marginBottom: L.landscape ? 14 : 26}}>
            <LightSweepText text={w.t} start={w.at - 4} size={L.landscape ? 58 : 64} duration={22} tracking={[0.5, 0.3]} />
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: L.cx - iconSize / 2, top: L.landscape ? 150 : 620, opacity: triadOut}}>
        <MakhrajIcon size={iconSize} appear={icon} glare={frame > CUE.ctaName + 20 ? -0.3 + (frame - CUE.ctaName - 20) / 34 : -1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? 420 : 970}}>
        <Wordmark size={L.landscape ? 60 : 62} appear={word * triadOut} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: L.landscape ? 640 : 1210,
          textAlign: 'center',
          ...MK_TYPE.serif,
          fontStyle: 'italic',
          fontSize: L.landscape ? 46 : 50,
          color: MK.ivory,
          opacity: line,
          transform: `translateY(${(1 - line) * 14}px)`,
        }}
      >
        Discover the origin of every letter.
      </div>
      {/* Link area — filled from the `url` prop; left clean until a URL is supplied */}
      <div style={{position: 'absolute', left: 0, right: 0, top: L.landscape ? 760 : 1340, textAlign: 'center', opacity: link}}>
        <div style={{width: 80, height: 1, background: MK.gold, margin: '0 auto 26px', opacity: 0.7}} />
        {url ? <div style={{...MK_TYPE.title, fontSize: L.landscape ? 24 : 28, letterSpacing: '0.18em', color: MK.gold}}>{url}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
