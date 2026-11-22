import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandLogo, logoHeightFor} from '../../components/BrandLogo';
import {GeometricOrnament} from '../../components/GeometricOrnament';
import {KineticText} from '../../components/KineticText';
import {mix, progress, settle} from '../../lib/motion';
import {colors, ease, fonts, type} from '../../styles/brand';
import {ProductTile} from './ProductTiles';

/**
 * Local timing, synced to the finale narration (clip starts at frame 15):
 * "Four tools" 17 · "one purpose" ~45 · "Bringing structure…" 93 ·
 * "QURRA Hifz Lab" 172 · "Learn" 217 · "Preserve" 238 · "Grow" 268.
 */
export const FINALE_T = {
  tiles: 17,
  tileStagger: 8,
  headline: 17,
  support: 93,
  gather: 156,
  logo: 170,
  hifzLab: 178,
  learn: 217,
  preserve: 238,
  grow: 268,
  fadeStart: 302,
} as const;
const T = FINALE_T;

/** The single ending of the compiled film. */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const gather = progress(frame, T.gather, 26, ease.inOut);
  const logo = settle(frame, fps, T.logo, 30);
  const logoW = 360;
  const logoH = logoHeightFor(logoW);
  const fade = 1 - progress(frame, T.fadeStart, 18, ease.soft);
  const word = (start: number) => progress(frame, start, 14, ease.out);
  const hl = progress(frame, T.hifzLab, 20, ease.out);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <GeometricOrnament
        size={880}
        draw={progress(frame, T.gather - 10, 60, ease.soft)}
        rotation={frame * 0.05}
        strokeWidth={1}
        opacity={0.32}
        style={{position: 'absolute', left: 540 - 440, top: 760 - 440}}
      />

      {/* Four tools, gathering into the brand */}
      {[0, 1, 2, 3].map((i) => {
        const x0 = 180 + i * 240;
        return (
          <ProductTile
            key={i}
            index={i}
            x={mix(x0, 540, gather)}
            y={mix(700, 760, gather)}
            size={190}
            appear={progress(frame, T.tiles + i * T.tileStagger, 22, ease.out)}
            scale={mix(1, 0.3, gather)}
            opacity={1 - gather}
            showLabel
          />
        );
      })}

      <div style={{position: 'absolute', left: 0, right: 0, top: 980, textAlign: 'center', opacity: 1 - gather, transform: `translateY(${-gather * 30}px)`}}>
        <KineticText text="Four Tools. One Purpose." start={T.headline} stagger={7} duration={22} style={{...type.headline, fontSize: 76, color: colors.forest}} />
        <KineticText
          text={'Bringing structure to\nyour Hifz journey.'}
          start={T.support}
          stagger={3}
          duration={20}
          style={{...type.lead, fontSize: 44, lineHeight: 1.3, color: colors.olive, marginTop: 34}}
        />
      </div>

      {/* Brand */}
      <div style={{position: 'absolute', left: 540 - logoW / 2, top: 760 - logoH / 2}}>
        <BrandLogo width={logoW} reveal={logo} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1060,
          textAlign: 'center',
          fontFamily: fonts.serif,
          fontSize: 64,
          letterSpacing: '0.12em',
          color: colors.forest,
          opacity: hl,
          transform: `translateY(${(1 - hl) * 16}px)`,
        }}
      >
        Hifz Lab
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1190, textAlign: 'center', ...type.eyebrow, fontSize: 28, letterSpacing: '0.4em', color: colors.goldDeep}}>
        {[
          ['Learn', T.learn],
          ['·', T.preserve - 4],
          ['Preserve', T.preserve],
          ['·', T.grow - 4],
          ['Grow', T.grow],
        ].map(([w, s], i) => {
          const p = word(s as number);
          return (
            <span key={i} style={{display: 'inline-block', margin: '0 0.35em', opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
