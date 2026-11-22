import React from 'react';
import {Img} from 'remotion';
import {AppIcon} from '../../components/AppIcon';
import {assets} from '../../data/assets';
import {CHALLENGE_ICON} from '../../data/challenge';
import {COMPANION_ICON} from '../../data/companion';
import {TIMELINE_ICON} from '../../data/timeline';
import {alpha, colors, type} from '../../styles/brand';

export const PRODUCTS = [
  {id: 'ebook', label: 'Ebook'},
  {id: 'challenge', label: 'Challenge'},
  {id: 'companion', label: 'Companion'},
  {id: 'timeline', label: 'Timeline'},
] as const;

type TileProps = {
  index: number;
  x: number;
  y: number;
  size: number;
  /** 0→1 entrance (opacity, rise, scale). */
  appear: number;
  scale?: number;
  opacity?: number;
  showLabel?: boolean;
};

/** One Hifz Lab product: the ebook cover or the official app icon, with a small label. */
export const ProductTile: React.FC<TileProps> = ({index, x, y, size, appear, scale = 1, opacity = 1, showLabel = true}) => {
  const id = PRODUCTS[index].id;
  const s = (0.7 + 0.3 * appear) * scale;
  const o = Math.min(1, appear * 1.6) * opacity;
  const lift = (1 - appear) * 60;
  return (
    <>
      {id === 'ebook' ? (
        <div
          style={{
            position: 'absolute',
            left: x - (size * 0.68) / 2,
            top: y + lift - (size * 1.02) / 2,
            width: size * 0.68,
            height: size * 1.02,
            opacity: o,
            transform: `scale(${s})`,
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: `0 20px 40px -12px ${alpha(colors.forest, 0.35)}, 0 4px 10px ${alpha(colors.forest, 0.12)}`,
          }}
        >
          <Img src={assets.ebook.coverFront.src} style={{width: '100%', height: '100%', display: 'block'}} />
        </div>
      ) : (
        <AppIcon
          src={(id === 'challenge' ? CHALLENGE_ICON : id === 'companion' ? COMPANION_ICON : TIMELINE_ICON).src}
          natural={(id === 'challenge' ? CHALLENGE_ICON : id === 'companion' ? COMPANION_ICON : TIMELINE_ICON).natural}
          size={size * 0.9}
          x={x}
          y={y + lift}
          scale={s}
          opacity={o}
          shadow={0.8}
        />
      )}
      {showLabel ? (
        <div
          style={{
            position: 'absolute',
            left: x - 120,
            width: 240,
            top: y + size * 0.62 + lift,
            textAlign: 'center',
            ...type.eyebrow,
            fontSize: 19,
            letterSpacing: '0.28em',
            color: colors.goldDeep,
            opacity: o,
          }}
        >
          {PRODUCTS[index].label}
        </div>
      ) : null}
    </>
  );
};
