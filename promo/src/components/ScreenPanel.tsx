import React from 'react';
import {Img} from 'remotion';
import {Rect} from '../data/mutashabihatPage';
import {alpha, colors} from '../styles/brand';

export type ScreenAsset = {id: string; src: string; natural: {width: number; height: number}};

export type PanelPose = {
  /** Centre of the panel on screen (px). */
  x: number;
  y: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  /** Depth-of-field blur (px). */
  blur?: number;
};

type Props = PanelPose & {
  screen: ScreenAsset;
  /** Region of the screenshot to show (source px). Defaults to the whole screen. */
  crop?: Rect;
  /** Rendered width of the cropped region (px, before `scale`). */
  width: number;
  radius?: number;
  /** 0…1 floating shadow strength. */
  shadow?: number;
  /** Specular sweep position -1…2 (0.5 = centre). */
  glare?: number;
  /** Hairline gold edge 0…1. */
  edge?: number;
  /** SVG overlays drawn in the screenshot's own pixel coordinates. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * A floating panel cut from a real app screenshot. Never framed as a phone:
 * the UI itself is the object. The image is only cropped, scaled and moved;
 * overlays (highlights, markers) are drawn in an SVG layer above it, using the
 * screenshot's pixel coordinates.
 */
export const ScreenPanel: React.FC<Props> = ({
  screen,
  crop,
  width,
  x,
  y,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  opacity = 1,
  blur = 0,
  radius = 26,
  shadow = 1,
  glare = -1,
  edge = 0.6,
  children,
  style,
}) => {
  const c = crop ?? {x: 0, y: 0, w: screen.natural.width, h: screen.natural.height};
  const k = width / c.w;
  const height = c.h * k;
  const has3d = Math.abs(rotateX) + Math.abs(rotateY) > 0.01;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        opacity,
        transform: `${has3d ? 'perspective(2200px) ' : ''}rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        boxShadow:
          shadow > 0
            ? `0 2px 6px ${alpha(colors.forest, 0.06 * shadow)}, 0 30px 60px -18px ${alpha(colors.forest, 0.3 * shadow)}, 0 70px 120px -40px ${alpha(colors.forest, 0.28 * shadow)}`
            : undefined,
        outline: edge > 0 ? `1px solid ${alpha(colors.gold, 0.45 * edge)}` : undefined,
        background: colors.paper,
        ...style,
      }}
    >
      <Img
        src={screen.src}
        style={{position: 'absolute', left: -c.x * k, top: -c.y * k, width: screen.natural.width * k, height: screen.natural.height * k, maxWidth: 'none'}}
      />
      {children ? (
        <svg viewBox={`${c.x} ${c.y} ${c.w} ${c.h}`} width={width} height={height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {children}
        </svg>
      ) : null}
      {glare > -1 && glare < 2 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${glare * 100 - 18}%, rgba(255,252,240,0.38) ${glare * 100}%, rgba(255,255,255,0) ${glare * 100 + 18}%)`,
            mixBlendMode: 'soft-light',
          }}
        />
      ) : null}
    </div>
  );
};
