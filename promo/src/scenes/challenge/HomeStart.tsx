import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {CHALLENGE_SCREENS, REGIONS} from '../../data/challenge';
import {APP_COLORS} from '../../compositions/challenge.timeline';
import {useLayout} from '../../lib/layout';
import {mix, progress} from '../../lib/motion';
import {regionOnScreen} from '../../lib/screenMap';
import {colors, ease} from '../../styles/brand';

export const HOME_T = {
  panelIn: 0,
  cards: 24, // first card enters (after the panel has settled)
  cardStagger: 9,
  pressStart: 70,
  push: 92,
  headline: 8,
} as const;
const T = HOME_T;

const SCREEN = CHALLENGE_SCREENS.home;
const R = REGIONS.home;
/** Real Home-screen cards, in the order they enter. */
const CARDS = [R.progressCard, R.startButton, R.learnTile, R.progressTile] as const;

/**
 * Scene 02 — the real Home screen assembles card by card, "Start Challenge"
 * is pressed, and the camera pushes into it.
 */
export const HomeStart: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const width = L.landscape ? 520 : 600;
  const full = {x: L.cx, y: L.landscape ? L.cy : 1190, width, crop: {x: 0, y: 0, w: SCREEN.natural.width, h: SCREEN.natural.height}};
  const panelIn = progress(frame, T.panelIn, 26, ease.out);
  const k = width / SCREEN.natural.width;

  // Press: a short dip and release on the real button, then a green/gold focus ring
  const press = progress(frame, T.pressStart, 8, ease.inOut) - progress(frame, T.pressStart + 8, 10, ease.out);
  const ring = progress(frame, T.pressStart + 4, 16, ease.out);
  const btn = regionOnScreen(full, R.startButton);

  const push = progress(frame, T.push, 135 - T.push, ease.in);
  const headExit = T.push;

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 1.6} focusX={btn.cx} focusY={btn.cy}>
        {/* Base screen: header, title and tab bar, with card slots masked until each card lands */}
        <ScreenPanel
          screen={SCREEN}
          width={width}
          x={full.x}
          y={full.y + (1 - panelIn) * 90}
          rotateY={mix(-14, 0, panelIn)}
          rotateX={mix(6, 0, panelIn)}
          opacity={panelIn}
          radius={34}
        >
          {CARDS.map((c, i) => {
            const landed = frame >= T.cards + i * T.cardStagger + 16;
            return landed ? null : <rect key={i} x={c.x - 2} y={c.y - 2} width={c.w + 4} height={c.h + 4} fill={APP_COLORS.background} />;
          })}
        </ScreenPanel>

        {/* Cards fly in individually and settle exactly onto their slots */}
        {CARDS.map((c, i) => {
          const t = progress(frame, T.cards + i * T.cardStagger, 16, ease.out);
          if (t <= 0 || t >= 1) return null;
          const at = regionOnScreen(full, c);
          return (
            <ScreenPanel
              key={i}
              screen={SCREEN}
              crop={c}
              width={at.w}
              x={at.cx + (1 - t) * (i % 2 === 0 ? -60 : 60)}
              y={at.cy + (1 - t) * 120}
              scale={mix(1.06, 1, t)}
              opacity={Math.min(1, t * 2)}
              radius={22 * k}
              shadow={(1 - t) * 0.8}
              edge={0}
            />
          );
        })}

        {/* Press feedback on the real Start Challenge button */}
        {frame >= T.pressStart - 2 ? (
          <ScreenPanel
            screen={SCREEN}
            crop={R.startButton}
            width={btn.w}
            x={btn.cx}
            y={btn.cy}
            scale={1 - press * 0.04 + ring * 0.02}
            radius={btn.h / 2}
            shadow={0.4 + ring * 0.6}
            edge={0}
          >
            <GoldFrame rect={{x: R.startButton.x + 4, y: R.startButton.y + 4, w: R.startButton.w - 8, h: R.startButton.h - 8}} draw={ring} radius={46} color={colors.gold} stroke={2.6} glow={14} />
          </ScreenPanel>
        ) : null}
      </CameraRig>

      <HeadlineBlock
        headline="Choose Your Juz."
        support="Begin your challenge."
        start={T.headline}
        exitStart={headExit}
        align="center"
        x={L.cx}
        y={L.landscape ? 120 : 250}
        width={960}
        headlineSize={L.landscape ? 88 : 96}
      />
    </AbsoluteFill>
  );
};
