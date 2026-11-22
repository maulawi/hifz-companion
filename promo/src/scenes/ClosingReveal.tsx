import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BookMockup, lerpPose} from '../components/BookMockup';
import {BrandLogo, logoHeightFor} from '../components/BrandLogo';
import {FloatingAccents} from '../components/FloatingAccents';
import {KineticText} from '../components/KineticText';
import {assets} from '../data/assets';
import {float, progress, settle} from '../lib/motion';
import {colors, ease, type} from '../styles/brand';
import {POSES, SCENES} from '../compositions/ebookShowcase.timeline';
import {REVEAL_ACCENTS} from './BookReveal';
import {highlightState, LiftedComparisonCard, MarketingLine} from './EbookPageReveal';
import {PrintedComparisonPage} from './PrintedComparisonPage';

const T = {
  cardReturn: 16,
  pullStart: 16,
  pullDuration: 32,
  closeStart: 18,
  closeDuration: 28,
  logo: 30,
  statement: 36,
  fadeStart: SCENES.closing - 12,
} as const;

const LOGO_W = 230;
const LOGO_CY = 360;

/** Scene 4 — page settles back, the book closes and floats beside the brand. */
export const ClosingReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 1) Card settles back onto the page (exact reverse of the scene-3 lift)
  const back = progress(frame, 0, T.cardReturn, ease.inOut);
  // Book recovers with the same curve the lift used, reversed
  const lift = 1 - back;
  // Highlights fade with the card; reuse scene-3 end state
  const hl = highlightState(SCENES.pageReveal);
  const hlFade = 1 - progress(frame, 0, 10, ease.out);

  // 2) Camera pulls back while the cover closes and the book turns to show its spine
  const pull = progress(frame, T.pullStart, T.pullDuration, ease.inOut);
  const floatIn = progress(frame, T.pullStart + 10, 40, ease.soft);
  let pose = frame < T.pullStart ? lerpPose(POSES.spreadReceded, POSES.spreadFacing, back) : lerpPose(POSES.spreadFacing, POSES.closingRest, pull);
  pose = {
    ...pose,
    y: pose.y + float(frame, 9, 96) * floatIn,
    rotateY: pose.rotateY + float(frame, 1.6, 120, 1) * floatIn,
    open: 1 - progress(frame, T.closeStart, T.closeDuration, ease.inOut),
  };

  const logo = settle(frame, fps, T.logo, 30);
  const finalPush = progress(frame, T.pullStart, SCENES.closing - T.pullStart, ease.soft);
  const fade = 1 - progress(frame, T.fadeStart, 12, ease.soft);
  const logoH = logoHeightFor(LOGO_W);

  return (
    <AbsoluteFill style={{opacity: fade, transform: `scale(${1 + finalPush * 0.025})`}}>
      <FloatingAccents accents={REVEAL_ACCENTS} presence={progress(frame, 20, 40)} drift={frame * 0.3} />
      <BookMockup
        pose={pose}
        coverSrc={assets.ebook.coverFront.src}
        pageContent={<PrintedComparisonPage showTable={frame >= T.cardReturn} />}
        shadow={1 - lift * 0.5}
        blur={lift * 7}
        veil={lift * 0.72}
        floorShadow={floatIn * 0.9}
        sheen={frame > T.pullStart + 20 ? -0.4 + (frame - T.pullStart - 20) / 40 : -1}
      />
      {frame < T.cardReturn ? (
        <LiftedComparisonCard
          lift={lift}
          focusRow={hl.focusRow}
          focus={hl.focus * hlFade}
          highlights={hl.highlights.map((h) => ({...h, draw: h.draw * hlFade}))}
        />
      ) : null}
      {/* Marketing line from scene 3 exits as the card settles */}
      <MarketingLine start={-200} exitStart={0} />

      <div style={{position: 'absolute', left: 540 - LOGO_W / 2, top: LOGO_CY - logoH / 2}}>
        <BrandLogo width={LOGO_W} reveal={logo} />
      </div>
      <KineticText
        text={'Understand the Differences.\nStrengthen Your Hifz.'}
        start={T.statement}
        stagger={3}
        duration={22}
        style={{position: 'absolute', left: 0, right: 0, top: 1300, ...type.headline, fontSize: 60, color: colors.forest}}
        wordStyles={{
          Strengthen: {fontStyle: 'italic', color: colors.olive},
          Your: {fontStyle: 'italic', color: colors.olive},
          'Hifz.': {fontStyle: 'italic', color: colors.goldDeep},
        }}
      />
    </AbsoluteFill>
  );
};
