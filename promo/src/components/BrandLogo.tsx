import React from 'react';
import {Img} from 'remotion';
import {assets} from '../data/assets';

type Props = {
  /** Rendered width in px; height always follows the official aspect ratio. */
  width: number;
  /** 0→1 reveal: opacity, a hint of scale and a soft focus pull. */
  reveal?: number;
  style?: React.CSSProperties;
};

/** Official QURRA logo. Proportions are locked to the source asset. */
export const BrandLogo: React.FC<Props> = ({width, reveal = 1, style}) => {
  const {src, width: w, height: h} = assets.brand.logo;
  const height = (width * h) / w;
  const scale = 0.94 + 0.06 * reveal;
  const blur = (1 - reveal) * 10;
  return (
    <Img
      src={src}
      style={{
        width,
        height,
        opacity: reveal,
        transform: `scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    />
  );
};

export const logoHeightFor = (width: number) => (width * assets.brand.logo.height) / assets.brand.logo.width;
