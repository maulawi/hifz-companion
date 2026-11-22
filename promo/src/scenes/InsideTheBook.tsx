import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BookMockup, BookPose, lerpPose, PAGE_SURFACE} from '../components/BookMockup';
import {BookPage} from '../components/BookPage';
import {assets} from '../data/assets';
import {keyframes} from '../lib/keyframes';
import {progress} from '../lib/motion';
import {pageFlowAt, spreadRestStart} from '../lib/pageFlow';
import {colors, ease, type} from '../styles/brand';
import {PAGE_FLOW, pagePointOnScreen, POSES, SCENES, SPREAD_LABELS, spreadFacing} from '../compositions/ebookShowcase.timeline';
import {RevealTitle} from './BookReveal';

const rest = (i: number) => spreadRestStart(PAGE_FLOW, i);
const turnStart = (i: number) => rest(i) + PAGE_FLOW.holds[i];

/**
 * Gentle "reading" camera while spreads rest: a slight push-in and a few
 * degrees of turn toward the page being looked at. Ends exactly square to the
 * camera so the montage can lift the tables off the page.
 */
const readingCamera = (frame: number) =>
  keyframes<{s: number; ry: number}>(frame, [
    {f: PAGE_FLOW.start, s: 0.84, ry: 0},
    {f: rest(0) + 30, s: 0.855, ry: -3}, // look at the Preface (right page)
    {f: turnStart(0) + 6, s: 0.85, ry: -1.5},
    {f: rest(1) + 18, s: 0.855, ry: 2.6}, // Contents (left page)…
    {f: rest(1) + 62, s: 0.855, ry: -2.6}, // …then Introduction (right page)
    {f: turnStart(1) + 10, s: 0.845, ry: -0.5},
    {f: rest(2) + 26, s: 0.84, ry: 0},
    {f: SCENES.pages, s: 0.84, ry: 0},
  ]);

/** Book pose for scene C (local frame). Ends on POSES.spreadFacing. */
export const pagesPose = (frame: number): BookPose => {
  if (frame >= PAGE_FLOW.start) {
    const cam = readingCamera(frame);
    return spreadFacing(cam.s, cam.ry);
  }
  const toOpen = progress(frame, 0, PAGE_FLOW.start - 6, ease.inOut);
  const toFacing = progress(frame, 26, PAGE_FLOW.start - 26, ease.inOut);
  const pose = lerpPose(lerpPose(POSES.revealEnd, POSES.spreadOpening, toOpen), POSES.spreadFacing, toFacing);
  return {...pose, open: progress(frame, 0, PAGE_FLOW.start - 2, ease.inOut)};
};

const Label: React.FC<{text: string; x: number; y: number; opacity: number}> = ({text, x, y, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 300,
      width: 600,
      top: y,
      textAlign: 'center',
      ...type.eyebrow,
      fontSize: 21,
      color: colors.goldDeep,
      opacity,
      transform: `translateY(${(1 - opacity) * 10}px)`,
    }}
  >
    {text}
  </div>
);

/** Small catalogue-style labels under the pages of the resting spread. */
const SpreadLabels: React.FC<{frame: number}> = ({frame}) => {
  const flow = pageFlowAt(frame, PAGE_FLOW);
  if (frame < PAGE_FLOW.start) return null;
  const hold = PAGE_FLOW.holds[flow.index];
  const o = progress(flow.restFrame, 8, 16, ease.out) * (1 - progress(flow.restFrame, hold - 12, 10, ease.in));
  if (o <= 0) return null;
  const labels = SPREAD_LABELS[flow.index] ?? {};
  const base = spreadFacing(0.84);
  const y = pagePointOnScreen(base, 'right', 0, PAGE_SURFACE.height).y + 46;
  const lx = pagePointOnScreen(base, 'left', PAGE_SURFACE.width / 2, 0).x;
  const rx = pagePointOnScreen(base, 'right', PAGE_SURFACE.width / 2, 0).x;
  return (
    <>
      {labels.left ? <Label text={labels.left} x={lx} y={y} opacity={o} /> : null}
      {labels.right ? <Label text={labels.right} x={rx} y={y} opacity={o} /> : null}
      {labels.center ? <Label text={labels.center} x={540} y={y} opacity={o} /> : null}
    </>
  );
};

/** Scene C — the cover opens and the real pages are turned, one spread at a time. */
export const InsideTheBook: React.FC = () => {
  const frame = useCurrentFrame();
  const flow = pageFlowAt(frame, PAGE_FLOW);
  const leaf = flow.leaf;

  return (
    <AbsoluteFill>
      <BookMockup
        pose={pagesPose(frame)}
        coverSrc={assets.ebook.coverFront.src}
        pageContent={<BookPage id={flow.right} />}
        leftPageContent={flow.left ? <BookPage id={flow.left} /> : undefined}
        leaves={
          leaf
            ? [
                {
                  front: <BookPage id={leaf.front} />,
                  back: leaf.back ? <BookPage id={leaf.back} /> : null,
                  turn: leaf.turn,
                },
              ]
            : []
        }
        pageShadow={leaf ? Math.sin(Math.PI * leaf.raw) * (1 - 0.4 * leaf.raw) : 0}
      />
      <RevealTitle enterStart={-200} exitStart={0} />
      <SpreadLabels frame={frame} />
    </AbsoluteFill>
  );
};
