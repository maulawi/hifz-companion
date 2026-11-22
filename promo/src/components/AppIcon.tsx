import React from 'react';
import {Img} from 'remotion';
import {alpha, colors} from '../styles/brand';

type Props = {
  src: string;
  /** Natural size of the icon image. */
  natural: {width: number; height: number};
  /** Rendered width (px). */
  size: number;
  x: number;
  y: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  /** Specular sweep -1…2. */
  glare?: number;
  shadow?: number;
};

/** Official product icon as a floating tile with real perspective and a light sweep. */
export const AppIcon: React.FC<Props> = ({src, natural, size, x, y, rotateX = 0, rotateY = 0, rotateZ = 0, scale = 1, opacity = 1, glare = -1, shadow = 1}) => {
  const h = (size * natural.height) / natural.width;
  // Corner radius of the supplied tile (~13 % of its width); clipping to it removes
  // the original white background at the corners without touching the artwork.
  const radius = size * 0.13;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - h / 2,
        width: size,
        height: h,
        opacity,
        transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        borderRadius: radius,
        boxShadow: `0 ${24 * shadow}px ${50 * shadow}px -10px ${alpha(colors.forest, 0.32 * shadow)}, 0 6px 14px ${alpha(colors.forest, 0.12 * shadow)}`,
      }}
    >
      <Img src={src} style={{width: size, height: h, display: 'block', clipPath: `inset(0.6% round ${radius}px)`}} />
      {glare > -1 && glare < 2 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            overflow: 'hidden',
            background: `linear-gradient(120deg, rgba(255,255,255,0) ${glare * 100 - 20}%, rgba(255,250,232,0.5) ${glare * 100}%, rgba(255,255,255,0) ${glare * 100 + 20}%)`,
            mixBlendMode: 'soft-light',
          }}
        />
      ) : null}
    </div>
  );
};
