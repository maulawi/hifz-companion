import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {CHALLENGE_SCREENS, REGIONS} from '../../data/challenge';
import {Rect} from '../../data/mutashabihatPage';
import {useLayout} from '../../lib/layout';
import {mix, progress} from '../../lib/motion';
import {Placement, regionOnScreen} from '../../lib/screenMap';
import {alpha, colors, ease} from '../../styles/brand';

export const COMPARISON_T = {
  enter: 0,
  separate: 22,
  separateDuration: 30,
  shared: 60,
  connector: 80,
  differsCorrect: 104,
  differsSimilar: 114,
  headline: 10,
} as const;
const T = COMPARISON_T;

const SCREEN = CHALLENGE_SCREENS.comparison;
const R = REGIONS.comparison;
/** Each floating panel keeps its real label ("Correct Ayah" / "Similar Ayah") with the card. */
const CORRECT_BLOCK: Rect = {x: 26, y: R.correctLabel.y, w: 652, h: R.correctCard.y + R.correctCard.h - R.correctLabel.y};
const SIMILAR_BLOCK: Rect = {x: 26, y: R.similarLabel.y, w: 652, h: R.similarCard.y + R.similarCard.h - R.similarLabel.y};

/**
 * Scene 04 — the real "Correct Ayah" and "Similar Ayah" cards float apart; the
 * shared opening phrase is marked and connected, then the differing words are
 * framed in gold. Every mark is an overlay on the untouched screenshot.
 */
export const AyahComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const W = 940;
  const enter = progress(frame, T.enter, 22, ease.out);
  const sep = progress(frame, T.separate, T.separateDuration, ease.inOut);

  // Start overlapping (the similar verse tucked behind), then float apart
  const correct: Placement = {x: L.cx, y: mix(1050, 860, sep), width: W, crop: CORRECT_BLOCK};
  const similar: Placement = {x: L.cx, y: mix(1180, 1408, sep), width: W, crop: SIMILAR_BLOCK};
  const behind = 1 - sep; // similar panel depth before separating

  // Connector between the two occurrences of the shared phrase
  const a = regionOnScreen(correct, R.correctShared);
  const b = regionOnScreen(similar, R.similarShared);
  const conn = progress(frame, T.connector, 24, ease.inOut);
  const x1 = a.cx;
  const y1 = a.y + a.h + 6;
  const x2 = b.cx;
  const y2 = b.y - 6;
  const bend = 70;
  const path = `M${x1},${y1} C${x1 + bend},${y1 + (y2 - y1) * 0.35} ${x2 + bend},${y1 + (y2 - y1) * 0.65} ${x2},${y2}`;

  const shared = progress(frame, T.shared, 18, ease.out);
  const dC = progress(frame, T.differsCorrect, 18, ease.out);
  const dS1 = progress(frame, T.differsSimilar, 18, ease.out);
  const dS2 = progress(frame, T.differsSimilar + 8, 18, ease.out);
  const push = progress(frame, 0, 225, ease.soft);

  /** Same wording: a soft gold underline. Different wording: a gold frame. */
  const SharedMark: React.FC<{rect: Rect}> = ({rect}) => (
    <rect x={rect.x + 4} y={rect.y + rect.h - 2} width={(rect.w - 8) * shared} height={4} rx={2} fill={colors.gold} opacity={0.9} />
  );
  const diffStyle = {radius: 12, color: colors.goldDeep, stroke: 2.6, glow: 12};

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.035} focusX={L.cx} focusY={1130}>
        <ScreenPanel screen={SCREEN} crop={SIMILAR_BLOCK} width={W} x={similar.x} y={similar.y + (1 - enter) * 120} opacity={enter * mix(1, 0.75, behind)} scale={mix(1, 0.92, behind)} blur={behind * 2.5} rotateX={behind * 8} radius={30} edge={0.5}>
          <SharedMark rect={R.similarShared} />
          <GoldFrame rect={R.similarDiffers1} draw={dS1} {...diffStyle} />
          <GoldFrame rect={R.similarDiffers2} draw={dS2} {...diffStyle} />
        </ScreenPanel>

        <ScreenPanel screen={SCREEN} crop={CORRECT_BLOCK} width={W} x={correct.x} y={correct.y + (1 - enter) * 80} opacity={enter} radius={30} edge={0.5}>
          <SharedMark rect={R.correctShared} />
          <GoldFrame rect={R.correctDiffers} draw={dC} {...diffStyle} />
        </ScreenPanel>
        {/* Gold connector linking the shared phrase in both verses */}
        {conn > 0 ? (
          <svg width={L.w} height={L.h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path d={path} fill="none" stroke={alpha(colors.gold, 0.35)} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - conn} strokeLinecap="round" />
            <path d={path} fill="none" stroke={colors.goldDeep} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - conn} strokeLinecap="round" />
            <circle cx={x1} cy={y1} r={6 * Math.min(1, conn * 4)} fill={colors.goldDeep} />
            <circle cx={x2} cy={y2} r={6 * Math.max(0, conn * 4 - 3)} fill={colors.goldDeep} />
          </svg>
        ) : null}
      </CameraRig>

      <HeadlineBlock
        headline={'Recognise\nthe Differences.'}
        support="Train your memory to distinguish similar verses."
        start={T.headline}
        align="center"
        x={L.cx}
        y={200}
        width={1000}
        headlineSize={84}
        supportSize={34}
      />
    </AbsoluteFill>
  );
};
