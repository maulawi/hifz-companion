import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BookMockup, lerpPose} from '../components/BookMockup';
import {BookPage} from '../components/BookPage';
import {BrandLogo, logoHeightFor} from '../components/BrandLogo';
import {FloatingAccents} from '../components/FloatingAccents';
import {KineticText} from '../components/KineticText';
import {assets} from '../data/assets';
import {float, progress, settle} from '../lib/motion';
import {colors, ease, type} from '../styles/brand';
import {POSES, SCENES} from '../compositions/ebookShowcase.timeline';
import {REVEAL_ACCENTS} from './BookReveal';

const T = {
  bookIn: 0,
  logo: 22,
  statement: 36,
  fadeStart: SCENES.closing - 12,
} as const;

const LOGO_W = 230;
const LOGO_CY = 360;

/** Scene E — the closed book floats beside the brand with the closing statement. */
export const ClosingReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = settle(frame, fps, T.bookIn, 50);
  const floatIn = progress(frame, 24, 40, ease.soft);
  const p = lerpPose(POSES.closingFrom, POSES.closingRest, enter);
  const pose = {
    ...p,
    y: p.y + float(frame, 9, 96) * floatIn,
    rotateY: p.rotateY + float(frame, 1.6, 120, 1) * floatIn,
  };

  const logo = settle(frame, fps, T.logo, 30);
  const push = progress(frame, 0, SCENES.closing, ease.soft);
  const fade = 1 - progress(frame, T.fadeStart, 12, ease.soft);
  const logoH = logoHeightFor(LOGO_W);

  return (
    <AbsoluteFill style={{opacity: fade, transform: `scale(${1 + push * 0.025})`}}>
      <FloatingAccents accents={REVEAL_ACCENTS} presence={progress(frame, 10, 40)} drift={frame * 0.3} />
      <BookMockup
        pose={pose}
        coverSrc={assets.ebook.coverFront.src}
        pageContent={<BookPage id="preface" />}
        floorShadow={enter * 0.9}
        sheen={frame > 30 ? -0.4 + (frame - 30) / 45 : -1}
        style={{opacity: Math.min(1, enter * 2)}}
      />
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
