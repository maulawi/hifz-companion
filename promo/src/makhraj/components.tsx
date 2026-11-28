import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {mix, progress} from '../lib/motion';
import {ease} from '../styles/brand';
import {BAYT, MK, MK_ICON, MK_TYPE} from './theme';

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// ───────────────────────── Stage ─────────────────────────

/** Deterministic pseudo-random for stable particle layouts. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

type StageProps = {
  /** 0…1 overall exposure (0 = near black). */
  exposure?: number;
  /** Optional warm light source. */
  light?: {x: number; y: number; radius: number; strength: number};
  dust?: number;
};

/** Deep forest-green environment with soft falloff, film grain and sparse dust. */
export const DarkStage: React.FC<StageProps> = ({exposure = 1, light, dust = 1}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: MK.night, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          opacity: exposure,
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${MK.green} 0%, ${MK.emerald} 38%, ${MK.forest} 70%, ${MK.night} 100%)`,
        }}
      />
      {light && light.strength > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle ${light.radius}px at ${light.x}px ${light.y}px, ${rgba(MK.gold, 0.22 * light.strength)} 0%, ${rgba(MK.gold, 0.06 * light.strength)} 45%, rgba(0,0,0,0) 100%)`,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      {dust > 0 ? (
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 46}, (_, i) => {
            const x = rand(i + 1) * 100;
            const y = (rand(i + 50) * 100 - frame * (0.01 + rand(i + 9) * 0.02)) % 100;
            const tw = 0.5 + 0.5 * Math.sin(frame / (40 + rand(i) * 60) + i);
            return <circle key={i} cx={`${x}%`} cy={`${(y + 100) % 100}%`} r={0.6 + rand(i + 3) * 1.4} fill={MK.gold} opacity={(0.08 + 0.18 * tw) * dust * exposure} />;
          })}
        </svg>
      ) : null}
      {/* grain */}
      <AbsoluteFill style={{opacity: 0.06, mixBlendMode: 'overlay'}}>
        <svg width="100%" height="100%">
          <filter id="mk-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 7} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mk-grain)" />
        </svg>
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Typography ─────────────────────────

type SweepProps = {
  text: string;
  start: number;
  size: number;
  /** Frames for the reveal. */
  duration?: number;
  exitStart?: number;
  color?: string;
  style?: React.CSSProperties;
  tracking?: [number, number];
};

/**
 * Cinematic title: letters resolve from wide spacing and soft focus while a
 * band of warm light travels across them.
 */
export const LightSweepText: React.FC<SweepProps> = ({text, start, size, duration = 40, exitStart, color = MK.ivory, style, tracking = [0.62, 0.3]}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration, ease.out);
  const sweep = progress(frame, start + 4, duration + 16, ease.inOut);
  const exit = exitStart === undefined ? 0 : progress(frame, exitStart, 16, ease.in);
  const spacing = `${mix(tracking[0], tracking[1], p)}em`;
  const common: React.CSSProperties = {
    ...MK_TYPE.title,
    fontSize: size,
    letterSpacing: spacing,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    paddingLeft: spacing, // optical centring of tracked caps
  };
  if (p <= 0) return null;
  return (
    <div style={{position: 'relative', opacity: 1 - exit, transform: `translateY(${-exit * 14}px)`, ...style}}>
      <div style={{...common, color, opacity: p * 0.92, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined}}>{text}</div>
      <div
        aria-hidden
        style={{
          ...common,
          position: 'absolute',
          inset: 0,
          color: 'transparent',
          backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep * 140 - 30}%, ${rgba('#FFF6DD', 0.95)} ${sweep * 140 - 15}%, ${rgba(MK.gold, 0.9)} ${sweep * 140 - 8}%, rgba(255,255,255,0) ${sweep * 140}%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          opacity: sweep < 1 ? 1 : 0,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ───────────────────────── Anatomy line drawing ─────────────────────────

/**
 * An original, schematic mid-sagittal drawing of the vocal tract (facing right):
 * nasal cavity, palate, tongue, pharynx, larynx, jaw and lips. Hairline gold,
 * drawn on like light; viewBox 600×600.
 */
export const VOCAL_TRACT_PATHS = [
  // head profile: forehead → nose → lips → chin → front neck
  'M300,70 C390,60 470,105 492,180 C500,205 500,222 520,250 C528,262 520,270 506,272 C512,282 514,292 506,300 C516,308 516,320 506,328 C500,350 498,372 486,392 C470,420 430,432 392,438 C384,470 384,520 386,575',
  // nasal cavity floor / hard palate
  'M318,236 C360,226 420,224 470,236 C480,240 488,246 496,256',
  // nasal cavity roof
  'M318,236 C330,200 380,170 440,178 C470,182 488,200 498,228',
  // soft palate + uvula
  'M318,236 C300,246 290,262 288,284 C287,296 292,302 298,298',
  // upper teeth & alveolar ridge
  'M470,236 C482,252 486,268 488,284',
  // tongue (root → dorsum → blade → tip)
  'M282,440 C278,380 300,320 352,300 C400,282 450,286 476,300 C488,306 490,316 480,322 C450,336 410,350 380,372',
  // floor of mouth / lower teeth
  'M480,322 C486,334 488,344 484,356',
  // pharynx back wall
  'M262,252 C246,300 244,380 252,450 C256,500 258,540 258,575',
  // epiglottis & larynx
  'M282,440 C290,452 300,456 308,452 M300,470 C304,500 304,540 302,575',
  // spine hint
  'M232,250 C222,320 222,420 230,575',
];

/** Anatomical anchors in the 600×600 drawing (for points and the hand-off to 3D). */
export const TRACT_ANCHORS = {
  throat: {x: 268, y: 392}, // al-Ḥalq (middle of the throat)
  tongueBack: {x: 340, y: 300},
  tongueTip: {x: 476, y: 300},
  lips: {x: 508, y: 300},
  nasal: {x: 410, y: 196},
} as const;

export const VocalTract: React.FC<{size: number; draw: number; glow?: number; opacity?: number; style?: React.CSSProperties}> = ({size, draw, glow = 1, opacity = 1, style}) => (
  <svg width={size} height={size} viewBox="0 0 600 600" style={{overflow: 'visible', opacity, ...style}}>
    <defs>
      <filter id="mk-tract-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={4} />
      </filter>
    </defs>
    {VOCAL_TRACT_PATHS.map((d, i) => {
      const p = Math.min(1, Math.max(0, draw * 1.35 - i * 0.04));
      return (
        <g key={i}>
          <path d={d} fill="none" stroke={rgba(MK.gold, 0.45 * glow)} strokeWidth={5} filter="url(#mk-tract-glow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeLinecap="round" />
          <path d={d} fill="none" stroke={MK.gold} strokeWidth={1.4} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeLinecap="round" />
        </g>
      );
    })}
  </svg>
);

// ───────────────────────── Precision point ─────────────────────────

/** A precise, scientific gold point: core, crosshair ticks and expanding rings. */
export const GoldPoint: React.FC<{x: number; y: number; appear: number; scale?: number; pulseFrom?: number}> = ({x, y, appear, scale = 1, pulseFrom = 0}) => {
  const frame = useCurrentFrame();
  if (appear <= 0) return null;
  const t = Math.max(0, frame - pulseFrom);
  const rings = [0, 22].map((off) => ((t + off) % 44) / 44);
  const s = scale;
  return (
    <svg style={{position: 'absolute', left: x - 120 * s, top: y - 120 * s, width: 240 * s, height: 240 * s, overflow: 'visible', opacity: appear}} viewBox="-120 -120 240 240">
      <defs>
        <radialGradient id="mk-core">
          <stop offset="0%" stopColor="#FFF7E0" />
          <stop offset="45%" stopColor={MK.gold} />
          <stop offset="100%" stopColor={rgba(MK.gold, 0)} />
        </radialGradient>
      </defs>
      <circle r={26 * appear} fill="url(#mk-core)" opacity={0.55} />
      {rings.map((p, i) => (
        <circle key={i} r={10 + p * 70} fill="none" stroke={MK.gold} strokeWidth={1.2} opacity={(1 - p) * 0.6} />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1={0} y1={-34} x2={0} y2={-24} stroke={MK.gold} strokeWidth={1.2} transform={`rotate(${a})`} opacity={0.85} />
      ))}
      <circle r={22} fill="none" stroke={rgba(MK.gold, 0.7)} strokeWidth={1} strokeDasharray="2 5" />
      <circle r={4.5} fill="#FFF7E0" />
    </svg>
  );
};

// ───────────────────────── Sound wave ─────────────────────────

/** A fine travelling waveform — the "distinct sound" of a letter. */
export const SoundWave: React.FC<{width: number; amp: number; draw: number; phase: number; opacity?: number; style?: React.CSSProperties}> = ({width, amp, draw, phase, opacity = 1, style}) => {
  const n = 160;
  const pts = Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const env = Math.sin(Math.PI * t) ** 1.5;
    const y = Math.sin(t * Math.PI * 14 + phase) * amp * env * (0.6 + 0.4 * Math.sin(t * Math.PI * 3 + phase * 0.3));
    return `${(t * width).toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={amp * 2 + 20} viewBox={`0 ${-amp - 10} ${width} ${amp * 2 + 20}`} style={{overflow: 'visible', opacity, ...style}}>
      <polyline points={pts.join(' ')} fill="none" stroke={MK.gold} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinecap="round" />
    </svg>
  );
};

// ───────────────────────── Brand ─────────────────────────

/** App icon, clipped to its own gold-rimmed tile, with a passing rim light. */
export const MakhrajIcon: React.FC<{size: number; appear: number; glare?: number; style?: React.CSSProperties}> = ({size, appear, glare = -1, style}) => {
  const {tile, natural, src} = MK_ICON;
  const k = size / tile.w;
  const h = tile.h * k;
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: h,
        borderRadius: size * 0.2,
        overflow: 'hidden',
        opacity: Math.min(1, appear * 1.5),
        transform: `scale(${mix(0.9, 1, appear)})`,
        boxShadow: `0 30px 80px -20px rgba(0,0,0,0.6), 0 0 ${60 * appear}px ${rgba(MK.gold, 0.12 * appear)}`,
        ...style,
      }}
    >
      <Img src={src} style={{position: 'absolute', left: -tile.x * k, top: -tile.y * k, width: natural * k, height: natural * k, maxWidth: 'none'}} />
      {glare > -1 && glare < 2 ? (
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${glare * 100 - 18}%, rgba(255,240,200,0.28) ${glare * 100}%, rgba(255,255,255,0) ${glare * 100 + 18}%)`, mixBlendMode: 'screen'}} />
      ) : null}
    </div>
  );
};

/** Typeset product name (to be replaced by the official logotype when supplied). */
export const Wordmark: React.FC<{size: number; appear: number; style?: React.CSSProperties}> = ({size, appear, style}) => (
  <div style={{textAlign: 'center', opacity: appear, ...style}}>
    <div style={{...MK_TYPE.title, fontSize: size, letterSpacing: `${mix(0.7, 0.42, appear)}em`, paddingLeft: '0.42em', color: MK.ivory}}>Makhraj Lab</div>
    <div style={{...MK_TYPE.title, fontSize: size * 0.3, letterSpacing: '0.5em', paddingLeft: '0.5em', color: MK.gold, marginTop: size * 0.35, opacity: appear}}>by Qurra</div>
  </div>
);

// ───────────────────────── Manuscript ─────────────────────────

/**
 * Manuscript-inspired panel: a subtle paper texture under a deep-green veil,
 * with the classical bayt set in Amiri (real Arabic type, correct shaping).
 */
export const ManuscriptBayt: React.FC<{width: number; appear: number; lineProgress: [number, number]; fontSize: number}> = ({width, appear, lineProgress, fontSize}) => {
  const h = width * 0.42;
  return (
    <div style={{position: 'relative', width, height: h, opacity: appear, transform: `translateY(${(1 - appear) * 20}px)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 6, overflow: 'hidden'}}>
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          <filter id="mk-paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={4} seed={4} />
            <feColorMatrix values="0 0 0 0 0.86  0 0 0 0 0.78  0 0 0 0 0.6  0 0 0 0.9 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mk-paper)" />
        </svg>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${rgba(MK.forest, 0.82)}, ${rgba(MK.night, 0.88)})`}} />
        <div style={{position: 'absolute', inset: 14, border: `1px solid ${rgba(MK.gold, 0.35)}`}} />
        <div style={{position: 'absolute', inset: 20, border: `1px solid ${rgba(MK.gold, 0.15)}`}} />
      </div>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: fontSize * 0.35}}>
        {BAYT.map((line, i) => {
          const p = lineProgress[i];
          return (
            <div
              key={i}
              style={{
                ...MK_TYPE.arabic,
                fontSize,
                lineHeight: 1.5,
                color: i === 0 ? MK.gold : MK.ivory,
                opacity: Math.min(1, p * 1.4),
                // right-to-left wipe, following the direction of reading
                clipPath: `inset(-20% 0 -20% ${(1 - p) * 100}%)`,
                filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────── 3D recording panel ─────────────────────────

/** Clean, upscaled takes from the supplied 3D-viewer screen recording (768×1260). */
export const MK_TAKES = {
  headRotate: {src: 'makhraj/video/3d-head-rotate.mp4', frames: 210},
  point5Intro: {src: 'makhraj/video/3d-point5-intro.mp4', frames: 77},
  point5Orbit: {src: 'makhraj/video/3d-point5-orbit.mp4', frames: 218},
} as const;
export const TAKE_ASPECT = 1260 / 768;

type VideoPanelProps = {
  take: keyof typeof MK_TAKES;
  /** Absolute frame at which the take starts playing. */
  from: number;
  width: number;
  x: number;
  y: number;
  opacity?: number;
  scale?: number;
  /** Slow tilt drift amplitude (deg). */
  tilt?: number;
  playbackRate?: number;
  zIndex?: number;
};

/**
 * The real 3D viewer, presented as a floating glass-edged panel: rounded,
 * gold hairline rim, deep shadow and a soft gold underglow, with a slow,
 * weighted tilt drift. Kept at a size where the footage stays crisp.
 */
export const VideoPanel: React.FC<VideoPanelProps> = ({take, from, width, x, y, opacity = 1, scale = 1, tilt = 4, playbackRate = 1, zIndex}) => {
  const frame = useCurrentFrame();
  if (opacity <= 0) return null;
  const h = width * TAKE_ASPECT;
  const t = frame - from;
  const ry = Math.sin(t / 70) * tilt;
  const rx = Math.cos(t / 90) * tilt * 0.4;
  const {src, frames} = MK_TAKES[take];
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - width * 0.55,
          top: y + h * 0.42,
          width: width * 1.1,
          height: h * 0.2,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${rgba(MK.gold, 0.18 * opacity)}, rgba(0,0,0,0) 70%)`,
          filter: 'blur(30px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - width / 2,
          top: y - h / 2,
          width,
          height: h,
          borderRadius: width * 0.07,
          overflow: 'hidden',
          opacity,
          transform: `perspective(2400px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale})`,
          boxShadow: `0 60px 140px -40px rgba(0,0,0,0.8), 0 0 0 1px ${rgba(MK.gold, 0.45)}, inset 0 0 0 1px rgba(255,255,255,0.08)`,
          background: MK.ivory,
          zIndex,
        }}
      >
        <Sequence from={from} durationInFrames={Math.ceil(frames / playbackRate)} layout="none">
          <OffthreadVideo src={staticFile(src)} playbackRate={playbackRate} muted style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
        </Sequence>
        {/* glass sheen */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%)', pointerEvents: 'none'}} />
      </div>
    </>
  );
};
