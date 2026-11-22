import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {BookMockup, lerpPose, PAGE_SURFACE} from '../components/BookMockup';
import {BookPage, tablePlacement} from '../components/BookPage';
import {ComparisonPage, RowHighlight} from '../components/ComparisonPage';
import {GoldDivider} from '../components/GoldDivider';
import {KineticText} from '../components/KineticText';
import {assets} from '../data/assets';
import {EBOOK_PAGES} from '../data/ebookPages';
import {tableAspect, TableSpec} from '../data/mutashabihatPage';
import {Keyframe, keyframes} from '../lib/keyframes';
import {float, progress} from '../lib/motion';
import {alpha, colors, ease, shadows, type} from '../styles/brand';
import {pagePointOnScreen, POSES} from '../compositions/ebookShowcase.timeline';

/** Card state: centre (x, y), rest width, depth 0 (front) … 1 (far back), zoom around (fx, fy), tilt. */
type CardState = {x: number; y: number; w: number; d: number; zoom: number; fx: number; fy: number; rot: number};

/** Where a card emerges from the open spread (full pages 51 | 52): a point on the page, small and fading in. */
const fromPage = (side: 'left' | 'right', fy: number): CardState => {
  const pose = POSES.spreadFacing;
  const c = pagePointOnScreen(pose, side, PAGE_SURFACE.width / 2, PAGE_SURFACE.height * fy);
  return {x: c.x, y: c.y, w: PAGE_SURFACE.width * pose.scale * 0.72, d: 0, zoom: 1, fx: 0.5, fy: 0.5, rot: 0};
};

const HERO_A = {x: 540, y: 740, w: 960};
const HERO_SMALL = {x: 540, y: 790, w: 640}; // 445 px sources: capped near 1.5× native
const WAIT_L = {x: 290, y: 1150, w: 420, d: 0.5};
const WAIT_R = {x: 790, y: 1160, w: 420, d: 0.5};
const BACK_L = {x: 285, y: 500, w: 470, d: 0.78, rot: 12};
const BACK_R = {x: 800, y: 520, w: 470, d: 0.78, rot: -12};

const base = {d: 0, zoom: 1, fx: 0.5, fy: 0.5, rot: 0};

// Local timing (frames within the montage)
export const MONTAGE_T = {
  liftA: 0,
  liftB: 6,
  liftC: 10,
  liftDuration: 28,
  hlA: 36,
  zoomIn: 60,
  zoomOut: 96,
  swapB: 112,
  hlB: 140,
  swapC: 166,
  hlC: 176,
  text1: 26,
  text1Out: 108,
  text2: 126,
} as const;
const T = MONTAGE_T;

/** Ar-Raʿd row of the first table (zoom focus), normalised within the crop. */
const ZOOM_FOCUS = {fx: 0.5, fy: 0.61};

const CARD_A: Keyframe<CardState>[] = [
  {f: T.liftA, ...fromPage('right', 0.72)},
  {f: T.liftA + T.liftDuration, ...base, ...HERO_A},
  {f: T.zoomIn, ...base, ...HERO_A, ...ZOOM_FOCUS},
  {f: T.zoomIn + 20, ...base, ...HERO_A, ...ZOOM_FOCUS, zoom: 1.22},
  {f: T.zoomOut, ...base, ...HERO_A, ...ZOOM_FOCUS, zoom: 1.22},
  {f: T.swapB, ...base, ...HERO_A, ...ZOOM_FOCUS},
  {f: T.swapB + 28, ...base, ...BACK_L, ...ZOOM_FOCUS},
];
const CARD_B: Keyframe<CardState>[] = [
  {f: T.liftB, ...fromPage('left', 0.3)},
  {f: T.liftB + T.liftDuration, ...base, ...WAIT_L},
  {f: T.swapB, ...base, ...WAIT_L},
  {f: T.swapB + 28, ...base, ...HERO_SMALL},
  {f: T.swapC, ...base, ...HERO_SMALL},
  {f: T.swapC + 26, ...base, ...BACK_R},
];
const CARD_C: Keyframe<CardState>[] = [
  {f: T.liftC, ...fromPage('left', 0.72)},
  {f: T.liftC + T.liftDuration, ...base, ...WAIT_R},
  {f: T.swapC, ...base, ...WAIT_R},
  {f: T.swapC + 26, ...base, ...HERO_SMALL, y: 800},
];

type CardProps = {
  table: TableSpec;
  state: CardState;
  /** 0 = just emerging from the page, 1 = fully lifted. */
  lift: number;
  highlights: RowHighlight[];
  focusRow?: number | null;
  focus?: number;
};

const MontageCard: React.FC<CardProps> = ({table, state, lift, highlights, focusRow = null, focus = 0}) => {
  const {x, y, w, d, zoom, fx, fy, rot} = state;
  const aspect = tableAspect(table);
  const h0 = w / aspect;
  const W = w * zoom;
  const H = W / aspect;
  const focalX = x + (fx - 0.5) * w;
  const focalY = y + (fy - 0.5) * h0;
  const shadowK = lift * (1 - d * 0.7);
  return (
    <div
      style={{
        position: 'absolute',
        left: focalX - fx * W,
        top: focalY - fy * H,
        width: W,
        height: H,
        borderRadius: 10 * lift,
        overflow: 'hidden',
        opacity: (1 - d * 0.38) * Math.min(1, lift * 2.5),
        filter: d > 0.03 ? `blur(${d * 2.4}px)` : undefined,
        transform: Math.abs(rot) > 0.01 ? `perspective(1600px) rotateY(${rot}deg)` : undefined,
        boxShadow: shadowK > 0.001 ? shadows.card.replace(/rgba\(16,44,35,([\d.]+)\)/g, (_, a) => `rgba(16,44,35,${(parseFloat(a) * shadowK).toFixed(3)})`) : 'none',
        outline: `1px solid ${alpha(colors.gold, 0.35 * lift * (1 - d))}`,
      }}
    >
      <ComparisonPage table={table} width={W} feather={1 - lift} highlights={highlights} focusRow={focusRow} focus={focus} />
    </div>
  );
};

/** Faint, blurred real pages drifting far behind the cards (density without clutter). */
const DEEP_PAGES = [
  {id: 'contents', x: 175, y: 330, w: 290, rot: -8, phase: 0},
  {id: 'introduction', x: 905, y: 360, w: 290, rot: 7, phase: 2},
  {id: 'preface', x: 545, y: 235, w: 250, rot: -2, phase: 4},
] as const;

const DeepPages: React.FC<{presence: number; frame: number}> = ({presence, frame}) => (
  <>
    {DEEP_PAGES.map((p, i) => {
      const page = EBOOK_PAGES[p.id];
      const h = (p.w * page.natural.height) / page.natural.width;
      const appear = Math.min(1, Math.max(0, presence * 1.5 - i * 0.2));
      return (
        <Img
          key={p.id}
          src={page.src}
          style={{
            position: 'absolute',
            left: p.x - p.w / 2 + float(frame, 10, 160, p.phase) - frame * 0.15 * (i - 1),
            top: p.y - h / 2 + float(frame, 8, 190, p.phase) + (1 - appear) * 40,
            width: p.w,
            height: h,
            opacity: 0.38 * appear,
            filter: 'blur(1.6px)',
            transform: `rotate(${p.rot}deg)`,
            boxShadow: '0 20px 40px -12px rgba(16,44,35,0.25)',
          }}
        />
      );
    })}
  </>
);

const rowDraws = (frame: number, start: number, rows: number, gap: number): RowHighlight[] =>
  Array.from({length: rows}, (_, row) => ({row, draw: progress(frame, start + row * gap, 12, ease.out)}));

/** Scene D — tables rise out of the open spread and a layered montage shows the scale of the work. */
export const CollectionMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeBook = progress(frame, 4, 40, ease.soft);
  const bookPose = lerpPose(POSES.spreadFacing, POSES.spreadReceded, progress(frame, 0, 44, ease.out));
  const [tA] = tablePlacement('comparisonsA').map((p) => p.table);
  const [tB, tC] = tablePlacement('comparisonsB').map((p) => p.table);

  const liftA = progress(frame, T.liftA, T.liftDuration, ease.inOut);
  const liftB = progress(frame, T.liftB, T.liftDuration, ease.inOut);
  const liftC = progress(frame, T.liftC, T.liftDuration, ease.inOut);

  const sA = keyframes(frame, CARD_A);
  const sB = keyframes(frame, CARD_B);
  const sC = keyframes(frame, CARD_C);

  const zoomFocus = progress(frame, T.zoomIn, 12) * (1 - progress(frame, T.zoomOut, 14));
  const cards = [
    {key: 'A', d: sA.d, el: <MontageCard key="A" table={tA} state={sA} lift={liftA} highlights={rowDraws(frame, T.hlA, 3, 10)} focusRow={1} focus={zoomFocus} />},
    {key: 'B', d: sB.d, el: <MontageCard key="B" table={tB} state={sB} lift={liftB} highlights={rowDraws(frame, T.hlB, 3, 8)} />},
    {key: 'C', d: sC.d, el: <MontageCard key="C" table={tC} state={sC} lift={liftC} highlights={rowDraws(frame, T.hlC, 4, 7)} />},
  ].sort((a, b) => b.d - a.d);

  const count = progress(frame, T.text1 + 6, 34, ease.out);
  const eyebrow = progress(frame, T.text1 - 6, 18, ease.out);

  return (
    <AbsoluteFill>
      <BookMockup
        pose={bookPose}
        coverSrc={assets.ebook.coverFront.src}
        pageContent={<BookPage id="page52" />}
        leftPageContent={<BookPage id="page51" />}
        shadow={1 - fadeBook}
        blur={fadeBook * 8}
        veil={fadeBook}
      />
      <DeepPages presence={progress(frame, 16, 36, ease.soft)} frame={frame} />
      {cards.map((c) => c.el)}

      {/* Copy: the modern translated compilation (distinct from the classical poem) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1350, textAlign: 'center'}}>
        <div style={{...type.eyebrow, fontSize: 22, color: colors.goldDeep, opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * 12}px)`}}>
          The Translated Compilation
        </div>
        <div style={{position: 'relative', height: 170, marginTop: 22}}>
          <KineticText
            text={'More Than 800\nSimilar Quranic Verses'}
            start={T.text1}
            stagger={3}
            duration={22}
            exitStart={T.text1Out}
            style={{position: 'absolute', left: 0, right: 0, top: 0, ...type.headline, color: colors.forest}}
            wordStyles={{'800': {color: colors.goldDeep, fontStyle: 'italic', fontVariantNumeric: 'lining-nums tabular-nums', minWidth: '1.9em', textAlign: 'left'}}}
            renderWord={(w) => (w === '800' ? String(Math.round(800 * count)) : w)}
          />
          <KineticText
            text={'Carefully Compiled\nwith Translation'}
            start={T.text2}
            stagger={3}
            duration={22}
            style={{position: 'absolute', left: 0, right: 0, top: 0, ...type.headline, color: colors.forest}}
            wordStyles={{Translation: {fontStyle: 'italic', color: colors.olive}}}
          />
        </div>
        <GoldDivider width={420} progress={progress(frame, T.text1 + 10, 30)} style={{margin: '18px auto 0'}} />
      </div>
    </AbsoluteFill>
  );
};
