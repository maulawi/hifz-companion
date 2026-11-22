import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {alpha, colors} from '../styles/brand';
import {GeometricOrnament} from './GeometricOrnament';

/**
 * Premium hardcover built from real CSS 3D faces (front board, page block,
 * spine, back board) so it can rotate, open and catch light convincingly.
 * The supplied cover artwork is mapped onto the front board untouched; all
 * lighting is layered above it as separate overlays.
 */

export type BookPose = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  /** 0 = closed, 1 = front cover fully open. */
  open: number;
};

export const BOOK = {
  width: 600,
  height: 900, // 2:3 — matches the flattened cover
  thickness: 54,
  board: 5,
  pageInsetX: 9,
  pageInsetY: 7,
  openAngle: 172,
  perspective: 2400,
} as const;

/** Geometry of the first page surface (what is visible when the cover opens). */
export const PAGE_SURFACE = {
  width: BOOK.width - BOOK.pageInsetX,
  height: BOOK.height - 2 * BOOK.pageInsetY,
  centerX: -BOOK.pageInsetX / 2,
  z: BOOK.thickness / 2 - BOOK.board - 1,
} as const;

/** z offset that puts the page surface exactly on the screen plane (no perspective distortion). */
export const facingZ = (scale: number) => -scale * PAGE_SURFACE.z;

export const lerpPose = (a: BookPose, b: BookPose, t: number): BookPose => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
  rotateX: a.rotateX + (b.rotateX - a.rotateX) * t,
  rotateY: a.rotateY + (b.rotateY - a.rotateY) * t,
  rotateZ: a.rotateZ + (b.rotateZ - a.rotateZ) * t,
  scale: a.scale + (b.scale - a.scale) * t,
  open: a.open + (b.open - a.open) * t,
});

type FaceProps = {w: number; h: number; transform: string; style?: React.CSSProperties; children?: React.ReactNode};
const Face: React.FC<FaceProps> = ({w, h, transform, style, children}) => (
  <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, transform, ...style}}>{children}</div>
);

const BOARD_TAN = '#CDB07A';
const leather = `linear-gradient(90deg, #0A1F18 0%, #173A2E 35%, #1C4436 55%, #12302A 80%, #0A1F18 100%)`;
const pageEdgesV = `repeating-linear-gradient(90deg, #F4EDDC 0px, #F4EDDC 1.4px, #DCD0B6 1.4px, #DCD0B6 2.2px)`;
const pageEdgesH = `repeating-linear-gradient(0deg, #F4EDDC 0px, #F4EDDC 1.4px, #DCD0B6 1.4px, #DCD0B6 2.2px)`;

type Props = {
  pose: BookPose;
  coverSrc: string;
  /** Content printed on the first page (sized PAGE_SURFACE.width × height). */
  pageContent?: React.ReactNode;
  /** Specular sweep position across the cover; -1…2, 0.5 = centre. */
  sheen?: number;
  /** Drop-shadow strength 0…1. */
  shadow?: number;
  /** Soft floor shadow under a floating book 0…1. */
  floorShadow?: number;
  /** Depth-of-field blur in px (for receding focus). */
  blur?: number;
  /** Pushes the book back visually by fading it into the stage 0…1. */
  veil?: number;
  style?: React.CSSProperties;
};

export const BookMockup: React.FC<Props> = ({
  pose,
  coverSrc,
  pageContent,
  sheen = -1,
  shadow = 1,
  floorShadow = 0,
  blur = 0,
  veil = 0,
  style,
}) => {
  const {width: W, height: H, thickness: D, board: b, pageInsetX: ix, pageInsetY: iy} = BOOK;
  const Wp = PAGE_SURFACE.width;
  const Hp = PAGE_SURFACE.height;
  const pd = D - 2 * b; // page block depth
  const angle = BOOK.openAngle * pose.open;
  const s = pose.scale;

  const filters = [
    shadow > 0 ? `drop-shadow(0px ${34 * s}px ${44 * s}px ${alpha(colors.forest, 0.28 * shadow)})` : '',
    shadow > 0 ? `drop-shadow(0px ${6 * s}px ${8 * s}px ${alpha(colors.forest, 0.18 * shadow)})` : '',
    blur > 0.05 ? `blur(${blur}px)` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AbsoluteFill style={{opacity: 1 - veil, ...style}}>
      {floorShadow > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: W * s * 1.05,
            height: 70 * s,
            transform: `translate(-50%, -50%) translate(${pose.x}px, ${pose.y + (H / 2) * s + 90 * s}px)`,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${alpha(colors.forest, 0.22 * floorShadow)} 0%, ${alpha(colors.forest, 0)} 70%)`,
            filter: `blur(${14 * s}px)`,
          }}
        />
      ) : null}
      <AbsoluteFill style={{perspective: BOOK.perspective, perspectiveOrigin: '50% 50%', filter: filters || undefined}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformStyle: 'preserve-3d',
            transform: `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) rotateZ(${pose.rotateZ}deg) scale3d(${s}, ${s}, ${s})`,
          }}
        >
          {/* ── Back board ── */}
          <Face w={W} h={H} transform={`translateZ(${-D / 2}px) rotateY(180deg)`} style={{background: leather, borderRadius: '4px 0 0 4px'}} />
          <Face w={b} h={H} transform={`translate3d(${W / 2}px, 0, ${-D / 2 + b / 2}px) rotateY(90deg)`} style={{background: '#0E271F'}} />
          <Face w={W} h={b} transform={`translate3d(0, ${-H / 2}px, ${-D / 2 + b / 2}px) rotateX(90deg)`} style={{background: '#14362B'}} />
          <Face w={W} h={b} transform={`translate3d(0, ${H / 2}px, ${-D / 2 + b / 2}px) rotateX(-90deg)`} style={{background: '#0B2019'}} />

          {/* ── Spine ── */}
          <Face w={D} h={H} transform={`translateX(${-W / 2}px) rotateY(-90deg)`} style={{background: leather, borderRadius: 3}}>
            {[0.07, 0.093, 0.907, 0.93].map((t) => (
              <div key={t} style={{position: 'absolute', left: 6, right: 6, top: H * t, height: 1.2, background: alpha(colors.gold, 0.7)}} />
            ))}
          </Face>

          {/* ── Page block ── */}
          <Face w={pd} h={Hp} transform={`translate3d(${W / 2 - ix}px, 0, 0) rotateY(90deg)`} style={{background: pageEdgesV}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.10), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.12))'}} />
          </Face>
          <Face w={Wp} h={pd} transform={`translate3d(${-ix / 2}px, ${-Hp / 2}px, 0) rotateX(90deg)`} style={{background: pageEdgesH}} />
          <Face w={Wp} h={pd} transform={`translate3d(${-ix / 2}px, ${Hp / 2}px, 0) rotateX(-90deg)`} style={{background: pageEdgesH, filter: 'brightness(0.86)'}} />
          {/* First page */}
          <Face
            w={Wp}
            h={Hp}
            transform={`translate3d(${PAGE_SURFACE.centerX}px, 0, ${PAGE_SURFACE.z}px)`}
            style={{background: colors.paper, overflow: 'hidden'}}
          >
            {pageContent}
            {/* Gutter shadow */}
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(37,43,40,0.22) 0px, rgba(37,43,40,0.06) 26px, rgba(37,43,40,0) 60px)', pointerEvents: 'none'}} />
          </Face>

          {/* ── Front board (hinged at the spine) ── */}
          <div
            style={{
              position: 'absolute',
              transformStyle: 'preserve-3d',
              transform: `translate3d(${-W / 2}px, 0, ${D / 2 - b / 2}px) rotateY(${-angle}deg)`,
            }}
          >
            {/* Outer face: supplied cover artwork */}
            <Face w={W} h={H} transform={`translate3d(${W / 2}px, 0, ${b / 2}px)`} style={{overflow: 'hidden', borderRadius: '0 4px 4px 0', backfaceVisibility: 'hidden'}}>
              <Img src={coverSrc} style={{width: W, height: H, display: 'block'}} />
              {/* Hinge groove + gentle falloff toward the spine (lighting overlay only) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(37,43,40,0.20) 0px, rgba(37,43,40,0.06) 10px, rgba(255,255,255,0.10) 15px, rgba(37,43,40,0.07) 19px, rgba(0,0,0,0) 34px)',
                }}
              />
              {sheen > -1 && sheen < 2 ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: -H * 0.2,
                    background: `linear-gradient(105deg, rgba(255,255,255,0) ${sheen * 100 - 22}%, rgba(255,250,235,0.26) ${sheen * 100}%, rgba(255,255,255,0) ${sheen * 100 + 22}%)`,
                    mixBlendMode: 'soft-light',
                  }}
                />
              ) : null}
            </Face>
            {/* Inner face: turn-in border + forest endpaper */}
            <Face w={W} h={H} transform={`translate3d(${W / 2}px, 0, ${-b / 2}px) rotateY(180deg)`} style={{background: BOARD_TAN, borderRadius: '4px 0 0 4px', backfaceVisibility: 'hidden'}}>
              <div style={{position: 'absolute', inset: '14px 6px 14px 14px', background: colors.forest, overflow: 'hidden'}}>
                <GeometricOrnament size={W * 0.9} strokeWidth={1} opacity={0.22} style={{position: 'absolute', left: W * 0.04, top: H / 2 - W * 0.45}} />
                <div style={{position: 'absolute', inset: 18, border: `1px solid ${alpha(colors.gold, 0.35)}`}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 40px)'}} />
              </div>
            </Face>
            {/* Board edges */}
            <Face w={b} h={H} transform={`translate3d(${W}px, 0, 0) rotateY(90deg)`} style={{background: 'linear-gradient(90deg, #B89A62, #D9C08D)'}} />
            <Face w={W} h={b} transform={`translate3d(${W / 2}px, ${-H / 2}px, 0) rotateX(90deg)`} style={{background: '#D9C08D'}} />
            <Face w={W} h={b} transform={`translate3d(${W / 2}px, ${H / 2}px, 0) rotateX(-90deg)`} style={{background: '#A88C58'}} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
