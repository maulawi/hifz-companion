import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {CHALLENGE_SCREENS, REGIONS} from '../../data/challenge';
import {APP_COLORS} from '../../compositions/challenge.timeline';
import {useLayout} from '../../lib/layout';
import {float, mix, progress} from '../../lib/motion';
import {lerpRect, regionOnScreen} from '../../lib/screenMap';
import {colors, ease} from '../../styles/brand';

export const QUESTION_T = {
  juzHighlight: 6,
  expand: 30,
  expandDuration: 28,
  textReveal: 50, // prompt fades back as the card grows, then reveals right-to-left
  optionA: 70,
  optionB: 82,
  optionDuration: 24,
  select: 122,
  glare: 132,
  headline: 10,
} as const;
const T = QUESTION_T;

const SCREEN = CHALLENGE_SCREENS.question;
const R = REGIONS.question;
/** Area of the question card that holds the Arabic prompt (revealed right-to-left). */
const PROMPT_TEXT = {x: 150, y: 340, w: 410, h: 120};

/**
 * Scene 03 — the selected Juz range is marked, the real question card expands
 * into the frame, the ayah prompt is revealed and both options follow. Option A
 * is then selected (overlay highlight only — the app UI is not altered).
 */
export const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const full = {x: L.cx, y: 1190, width: 600, crop: {x: 0, y: 0, w: SCREEN.natural.width, h: SCREEN.natural.height}};
  const recede = progress(frame, T.expand, T.expandDuration, ease.inOut);

  // Big-card targets (≈1.47× native)
  const BIG_W = 960;
  const target = {
    card: {x: L.cx, y: 770, w: BIG_W},
    a: {x: L.cx, y: 1092, w: BIG_W},
    b: {x: L.cx, y: 1398, w: BIG_W},
  };
  const from = (region: typeof R.questionCard) => {
    const s = regionOnScreen(full, region);
    return {x: s.cx, y: s.cy, w: s.w};
  };

  const expand = progress(frame, T.expand, T.expandDuration, ease.inOut);
  const card = lerpRect(from(R.questionCard), target.card, expand);
  const tA = progress(frame, T.optionA, T.optionDuration, ease.out);
  const tB = progress(frame, T.optionB, T.optionDuration, ease.out);
  const a = lerpRect(from(R.optionA), target.a, tA);
  const b = lerpRect(from(R.optionB), target.b, tB);

  const reveal = progress(frame, T.textReveal, 30, ease.inOut);
  const sel = progress(frame, T.select, 14, ease.out);
  const idle = progress(frame, T.optionB + 20, 40, ease.soft);
  const push = progress(frame, 0, 195, ease.soft);

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.04} focusX={L.cx} focusY={1100}>
        {/* Full question screen with the Juz range marked, then receding */}
        <ScreenPanel
          screen={SCREEN}
          width={full.width}
          x={full.x}
          y={full.y}
          scale={mix(1, 0.86, recede)}
          opacity={mix(1, 0.22, recede)}
          blur={recede * 5}
          radius={34}
          shadow={1 - recede * 0.7}
        >
          <GoldFrame rect={{x: R.juzLabel.x - 6, y: R.juzLabel.y - 4, w: R.juzLabel.w + 12, h: R.juzLabel.h + 34}} draw={progress(frame, T.juzHighlight, 18, ease.out)} radius={14} color={colors.olive} stroke={3} glow={14} />
        </ScreenPanel>

        {/* Question card expanding out of the UI; the ayah prompt is revealed right-to-left */}
        {frame >= T.expand ? (
          <ScreenPanel
            screen={SCREEN}
            crop={R.questionCard}
            width={card.w}
            x={card.x}
            y={card.y + float(frame, 5, 130) * idle}
            radius={30 * (card.w / R.questionCard.w)}
            shadow={expand}
            edge={0.4}
            glare={frame > T.textReveal + 26 ? -0.3 + (frame - T.textReveal - 26) / 30 : -1}
          >
            <rect
              x={PROMPT_TEXT.x}
              y={PROMPT_TEXT.y}
              width={PROMPT_TEXT.w * (1 - reveal)}
              height={PROMPT_TEXT.h}
              fill={APP_COLORS.card}
              fillOpacity={Math.min(1, expand * 1.6)}
            />
          </ScreenPanel>
        ) : null}

        {/* Options lift out of the screen one after another */}
        {tB > 0 ? (
          <ScreenPanel
            screen={SCREEN}
            crop={R.optionB}
            width={b.w}
            x={b.x}
            y={b.y + float(frame, 4, 150, 2) * idle}
            opacity={Math.min(1, tB * 3) * mix(1, 0.5, sel)}
            scale={mix(1, 0.98, sel)}
            radius={24 * (b.w / R.optionB.w)}
            shadow={tB * (1 - sel * 0.6)}
            edge={0.3}
          />
        ) : null}
        {tA > 0 ? (
          <ScreenPanel
            screen={SCREEN}
            crop={R.optionA}
            width={a.w}
            x={a.x}
            y={a.y + float(frame, 4, 150, 1) * idle}
            opacity={Math.min(1, tA * 3)}
            scale={1 + sel * 0.035}
            radius={24 * (a.w / R.optionA.w)}
            shadow={tA * (1 + sel * 0.5)}
            edge={0.3}
            glare={frame > T.glare ? -0.3 + (frame - T.glare) / 28 : -1}
          >
            <GoldFrame rect={{x: R.optionA.x + 4, y: R.optionA.y + 4, w: R.optionA.w - 8, h: R.optionA.h - 8}} draw={sel} radius={20} color={colors.olive} stroke={3.2} glow={16} />
          </ScreenPanel>
        ) : null}
      </CameraRig>

      <HeadlineBlock
        headline={'Can You Recall\nthe Correct Ayah?'}
        start={T.headline}
        align="center"
        x={L.cx}
        y={215}
        width={1000}
        headlineSize={84}
        divider={false}
      />
    </AbsoluteFill>
  );
};
