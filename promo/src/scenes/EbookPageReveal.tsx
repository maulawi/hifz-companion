import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BookMockup, BookPose, lerpPose} from '../components/BookMockup';
import {ComparisonPage, comparisonPageHeight, RowHighlight} from '../components/ComparisonPage';
import {GoldDivider} from '../components/GoldDivider';
import {KineticText} from '../components/KineticText';
import {assets} from '../data/assets';
import {mix, progress} from '../lib/motion';
import {alpha, colors, ease, shadows, type} from '../styles/brand';
import {CARD_WIDTH, PAGE_FOCUS_Y, POSES, printedPageOnScreen} from '../compositions/ebookShowcase.timeline';
import {RevealTitle} from './BookReveal';
import {PrintedComparisonPage} from './PrintedComparisonPage';

// Local timing (frames within the 120-frame scene)
export const PAGE_T = {
  openEnd: 36, // cover fully open, spread settling
  squareUp: 34, // spread turns square to camera…
  handoff: 52, // …and is exactly facing here: printed page → 2D card
  liftDuration: 24,
  highlightStart: 74,
  highlightGap: 15,
  highlightDraw: 14,
  textStart: 64,
} as const;

/** Book pose for scene 3 (local frame). */
export const pagePose = (frame: number): BookPose => {
  if (frame >= PAGE_T.handoff) {
    return lerpPose(POSES.spreadFacing, POSES.spreadReceded, progress(frame, PAGE_T.handoff, PAGE_T.liftDuration, ease.out));
  }
  const toOpen = progress(frame, 0, PAGE_T.openEnd, ease.inOut);
  const toFacing = progress(frame, PAGE_T.squareUp, PAGE_T.handoff - PAGE_T.squareUp, ease.inOut);
  const pose = lerpPose(lerpPose(POSES.revealEnd, POSES.spreadOpening, toOpen), POSES.spreadFacing, toFacing);
  return {...pose, open: progress(frame, 0, PAGE_T.openEnd + 2, ease.inOut)};
};

type CardProps = {
  /** 0 = sitting on the page (pixel-matches the printed page), 1 = lifted to centre. */
  lift: number;
  focusRow: number | null;
  focus: number;
  highlights: RowHighlight[];
};

/** The comparison page lifted off the book: it rises, travels to centre and grows. */
export const LiftedComparisonCard: React.FC<CardProps> = ({lift, focusRow, focus, highlights}) => {
  const start = printedPageOnScreen(POSES.spreadFacing);
  const width = mix(start.width, CARD_WIDTH, lift);
  const cx = mix(start.cx, 540, lift);
  // A slight upward arc while travelling gives the move weight
  const cy = mix(start.cy, PAGE_FOCUS_Y, lift) - Math.sin(lift * Math.PI) * 40;
  const tilt = Math.sin(lift * Math.PI) * 6;
  const height = comparisonPageHeight(width);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - width / 2,
        top: cy - height / 2,
        width,
        height,
        transform: `perspective(1800px) rotateX(${tilt}deg) rotateY(${-tilt * 0.8}deg)`,
        borderRadius: 10 * lift,
        boxShadow:
          lift > 0.001
            ? shadows.card.replace(/rgba\(16,44,35,([\d.]+)\)/g, (_, a) => `rgba(16,44,35,${(parseFloat(a) * lift).toFixed(3)})`)
            : 'none',
        outline: `1px solid ${alpha(colors.gold, 0.35 * lift)}`,
        overflow: 'hidden',
      }}
    >
      <ComparisonPage width={width} feather={1 - lift} focusRow={focusRow} focus={focus} highlights={highlights} />
    </div>
  );
};

/** Highlight / focus state of the card at a given scene-3 frame. */
export const highlightState = (frame: number) => {
  const highlights: RowHighlight[] = [0, 1, 2].map((row) => ({
    row,
    draw: progress(frame, PAGE_T.highlightStart + row * PAGE_T.highlightGap, PAGE_T.highlightDraw, ease.out),
  }));
  const active = highlights.reduce((acc, h) => (h.draw > 0 ? h.row : acc), -1);
  return {
    highlights,
    focusRow: active >= 0 ? active : null,
    focus: progress(frame, PAGE_T.highlightStart, 10, ease.out),
  };
};

export const MARKETING_LINE = 'Explore More Than 800\nSimilar Quranic Verses.';

/** Marketing line with a count-up on the number. */
export const MarketingLine: React.FC<{start: number; exitStart?: number}> = ({start, exitStart}) => {
  const frame = useCurrentFrame();
  const count = progress(frame, start + 6, 30, ease.out);
  const exit = exitStart === undefined ? 0 : progress(frame, exitStart, 12, ease.in);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1190}}>
      <KineticText
        text={MARKETING_LINE}
        start={start}
        stagger={3}
        duration={22}
        exitStart={exitStart}
        style={{...type.headline, color: colors.forest}}
        wordStyles={{
          '800': {color: colors.goldDeep, fontStyle: 'italic', fontVariantNumeric: 'lining-nums tabular-nums', minWidth: '1.9em', textAlign: 'left'},
        }}
        renderWord={(w) => (w === '800' ? String(Math.round(800 * count)) : w)}
      />
      <GoldDivider width={420} progress={progress(frame, start + 14, 30) * (1 - exit)} style={{margin: '34px auto 0'}} />
    </div>
  );
};

/** Scene 3 — the cover opens, the spread squares up and the page lifts for a closer read. */
export const EbookPageReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = pagePose(frame);
  const lift = progress(frame, PAGE_T.handoff, PAGE_T.liftDuration, ease.inOut);
  const lifted = frame >= PAGE_T.handoff;
  const {highlights, focusRow, focus} = highlightState(frame);

  return (
    <AbsoluteFill>
      <BookMockup
        pose={pose}
        coverSrc={assets.ebook.coverFront.src}
        pageContent={<PrintedComparisonPage showTable={!lifted} />}
        shadow={1 - lift * 0.5}
        blur={lift * 7}
        veil={lift * 0.72}
      />
      <RevealTitle enterStart={-200} exitStart={0} />
      {lifted ? <LiftedComparisonCard lift={lift} focusRow={focusRow} focus={focus} highlights={highlights} /> : null}
      <MarketingLine start={PAGE_T.textStart} />
    </AbsoluteFill>
  );
};
