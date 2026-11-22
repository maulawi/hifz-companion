import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BookMockup, BookPose, lerpPose} from '../components/BookMockup';
import {FloatingAccents, Accent} from '../components/FloatingAccents';
import {GoldDivider} from '../components/GoldDivider';
import {KineticText} from '../components/KineticText';
import {assets} from '../data/assets';
import {progress, settle} from '../lib/motion';
import {colors, ease, type} from '../styles/brand';
import {POSES, SCENES} from '../compositions/ebookShowcase.timeline';
import {PrintedComparisonPage} from './PrintedComparisonPage';

const ENTER_DELAY = 8;

export const REVEAL_ACCENTS: Accent[] = [
  {x: 150, y: 470, size: 22, depth: 0.9, kind: 'diamond'},
  {x: 935, y: 380, size: 14, depth: 0.6, kind: 'ring'},
  {x: 110, y: 1010, size: 7, depth: 0.35, kind: 'dot'},
  {x: 960, y: 960, size: 16, depth: 0.75, kind: 'diamond'},
  {x: 250, y: 280, size: 6, depth: 0.3, kind: 'dot'},
  {x: 860, y: 1230, size: 10, depth: 0.5, kind: 'ring'},
];

const addDelta = (base: BookPose, from: BookPose, to: BookPose, t: number): BookPose => {
  const d = lerpPose(from, to, t);
  return {
    x: base.x + d.x - from.x,
    y: base.y + d.y - from.y,
    z: base.z + d.z - from.z,
    rotateX: base.rotateX + d.rotateX - from.rotateX,
    rotateY: base.rotateY + d.rotateY - from.rotateY,
    rotateZ: base.rotateZ + d.rotateZ - from.rotateZ,
    scale: base.scale + d.scale - from.scale,
    open: base.open + d.open - from.open,
  };
};

/** Book pose for scene 2 (local frame). Ends exactly on POSES.revealEnd. */
export const revealPose = (frame: number, fps: number): BookPose => {
  // Delayed so the book rises as the intro clears, not on top of the logo
  const enter = settle(frame, fps, ENTER_DELAY, 54);
  const drift = progress(frame, 34, SCENES.bookReveal - 35, ease.soft);
  return addDelta(lerpPose(POSES.revealFrom, POSES.revealSettled, enter), POSES.revealSettled, POSES.revealEnd, drift);
};

type TitleProps = {enterStart: number; exitStart?: number};

/** Title lock-up under the book. Shared with scene 3, which plays its exit. */
export const RevealTitle: React.FC<TitleProps> = ({enterStart, exitStart}) => {
  const frame = useCurrentFrame();
  const eyebrow = progress(frame, enterStart, 20, ease.out);
  const divider = progress(frame, enterStart + 16, 30, ease.out);
  const exit = exitStart === undefined ? 0 : progress(frame, exitStart, 14, ease.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1330,
        textAlign: 'center',
        opacity: 1 - exit,
        transform: `translateY(${-exit * 30}px)`,
      }}
    >
      <div style={{...type.eyebrow, fontSize: 22, color: colors.goldDeep, opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * 14}px)`}}>
        Hifz Lab&nbsp;&nbsp;·&nbsp;&nbsp;Ebook
      </div>
      <KineticText
        text="A Compilation of"
        start={enterStart + 4}
        stagger={4}
        style={{...type.lead, fontSize: 42, color: colors.olive, marginTop: 26}}
      />
      <KineticText
        text="Mutashabihat Verses"
        start={enterStart + 10}
        stagger={5}
        duration={24}
        style={{...type.display, color: colors.forest, marginTop: 6}}
      />
      <GoldDivider width={420} progress={divider} style={{margin: '26px auto 0'}} />
    </div>
  );
};

/** Scene 2 — the hardcover rises into soft studio light. */
export const BookReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pose = revealPose(frame, fps);
  const enter = settle(frame, fps, ENTER_DELAY, 54);

  return (
    <AbsoluteFill>
      <FloatingAccents accents={REVEAL_ACCENTS} presence={progress(frame, 10, 40)} drift={frame * 0.4} />
      <BookMockup
        pose={pose}
        coverSrc={assets.ebook.coverFront.src}
        pageContent={<PrintedComparisonPage />}
        sheen={interpolate(frame, [30, 86], [-0.4, 1.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        floorShadow={enter * 0.9}
        style={{opacity: Math.min(1, enter * 2.2)}}
      />
      <RevealTitle enterStart={26} />
    </AbsoluteFill>
  );
};
