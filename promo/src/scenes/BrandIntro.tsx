import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandLogo, logoHeightFor} from '../components/BrandLogo';
import {GeometricOrnament} from '../components/GeometricOrnament';
import {GoldDivider} from '../components/GoldDivider';
import {KineticText} from '../components/KineticText';
import {EBOOK_PAGES} from '../data/ebookPages';
import {mix, progress, settle} from '../lib/motion';
import {colors, ease, type} from '../styles/brand';

const LOGO_W = 500;
const LOGO_CY = 860;
const LOGO_SMALL_W = 220;
const LOGO_SMALL_CY = 380;

const T = {
  logo: 2,
  tagline: 14,
  taglineOut: 50,
  logoMove: 54, // logo glides up to make room for the origin statement
  manuscript: 58,
  headline: 70,
  subline: 90,
} as const;

/**
 * The supplied Preface page holds the original Arabic naẓm. A crop of its verse
 * block drifts behind the origin statement as a faint, manuscript-like texture.
 * (Source pixels only: the image is scaled and faded, never redrawn.)
 */
const NAZM_CROP = {x: 40, y: 100, w: 456, h: 345};

const ManuscriptTexture: React.FC<{presence: number; drift: number}> = ({presence, drift}) => {
  const page = EBOOK_PAGES.preface;
  const width = 1000;
  const k = width / NAZM_CROP.w;
  const height = NAZM_CROP.h * k;
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - width / 2 + drift,
        top: 900 - height / 2,
        width,
        height,
        overflow: 'hidden',
        opacity: 0.13 * presence,
        filter: 'blur(0.6px) sepia(0.4)',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 35%, transparent 100%)',
      }}
    >
      <Img
        src={page.src}
        style={{position: 'absolute', left: -NAZM_CROP.x * k, top: -NAZM_CROP.y * k, width: page.natural.width * k, height: page.natural.height * k, maxWidth: 'none'}}
      />
    </div>
  );
};

/** Scene A — the QURRA mark resolves, then the classical scholarly origin is introduced. */
export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoReveal = settle(frame, fps, T.logo, 34);
  const draw = progress(frame, 0, 50, ease.soft);
  const divider = progress(frame, 12, 26, ease.out) * (1 - progress(frame, T.taglineOut, 12, ease.in));
  const drift = progress(frame, 0, 130, ease.soft);
  const move = progress(frame, T.logoMove, 26, ease.inOut);
  const manuscript = progress(frame, T.manuscript, 40, ease.soft);

  const logoW = mix(LOGO_W, LOGO_SMALL_W, move);
  const logoCY = mix(LOGO_CY, LOGO_SMALL_CY, move);
  const logoH = logoHeightFor(logoW);
  const bigH = logoHeightFor(LOGO_W);

  return (
    <AbsoluteFill style={{transform: `scale(${1 + drift * 0.02})`}}>
      <GeometricOrnament
        size={820}
        draw={draw}
        rotation={-12 + drift * 14}
        strokeWidth={1.1}
        opacity={0.5 - 0.25 * move}
        style={{position: 'absolute', left: 540 - 410, top: LOGO_CY - 410 + move * 40}}
      />
      <ManuscriptTexture presence={manuscript} drift={mix(30, -30, progress(frame, T.manuscript, 72, ease.soft))} />
      <div style={{position: 'absolute', left: 540 - logoW / 2, top: logoCY - logoH / 2}}>
        <BrandLogo width={logoW} reveal={logoReveal} />
      </div>
      <GoldDivider width={360} progress={divider} style={{position: 'absolute', left: 540 - 180, top: LOGO_CY + bigH / 2 + 70}} />
      <KineticText
        text="Preserve. Strengthen. Remember."
        start={T.tagline}
        stagger={5}
        duration={18}
        exitStart={T.taglineOut}
        exitDuration={12}
        style={{position: 'absolute', left: 0, right: 0, top: LOGO_CY + bigH / 2 + 118, ...type.lead, color: colors.olive}}
      />

      {/* ── Classical origin ── */}
      <KineticText
        text={'A Classical Legacy\nof Quranic Scholarship'}
        start={T.headline}
        stagger={4}
        duration={24}
        style={{position: 'absolute', left: 0, right: 0, top: 760, ...type.headline, fontSize: 70, color: colors.forest}}
      />
      <GoldDivider width={300} progress={progress(frame, T.subline - 6, 26)} style={{position: 'absolute', left: 540 - 150, top: 966}} />
      <KineticText
        text={'Rooted in the urjuzah of Imam al-Sakhawi,\na poem of some 400 lines'}
        start={T.subline}
        stagger={2}
        duration={20}
        style={{position: 'absolute', left: 0, right: 0, top: 1012, ...type.lead, fontSize: 36, lineHeight: 1.35, color: colors.olive}}
      />
    </AbsoluteFill>
  );
};
