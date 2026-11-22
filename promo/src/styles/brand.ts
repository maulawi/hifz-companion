/**
 * QURRA / Hifz Lab design system — shared by every product batch.
 * Change values here, never inline in scenes.
 */
import {Easing} from 'remotion';

export const colors = {
  cream: '#F9F5EA',
  forest: '#102C23',
  olive: '#254E3D',
  gold: '#C9A85E',
  sand: '#E8D9C3',
  charcoal: '#252B28',
  // Derived tones (kept within the brand family)
  paper: '#FCF9F1',
  parchment: '#EAD8B7',
  goldDeep: '#A8873F',
  pageEdge: '#EFE6D3',
} as const;

export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const fonts = {
  serif: '"Playfair Display", "Times New Roman", serif',
  sans: '"Inter", "Helvetica Neue", Arial, sans-serif',
} as const;

/** Vertical 9:16 canvas used by all batches. */
export const canvas = {width: 1080, height: 1920, fps: 30} as const;

/**
 * Mobile-safe content box. Keeps type and key objects clear of the
 * Reels / TikTok / Shorts UI chrome at the top and bottom of the frame.
 */
export const safeArea = {top: 230, bottom: 1640, left: 90, right: 990} as const;

export const type = {
  eyebrow: {fontFamily: fonts.sans, fontWeight: 500, fontSize: 24, letterSpacing: '0.34em', textTransform: 'uppercase' as const},
  lead: {fontFamily: fonts.serif, fontStyle: 'italic' as const, fontWeight: 400, fontSize: 44, letterSpacing: '0.005em'},
  display: {fontFamily: fonts.serif, fontWeight: 500, fontSize: 84, letterSpacing: '-0.01em', lineHeight: 1.08},
  headline: {fontFamily: fonts.serif, fontWeight: 500, fontSize: 64, letterSpacing: '-0.005em', lineHeight: 1.12},
} as const;

/** Motion curves. Calm, decelerating, never bouncy. */
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.33, 0, 0.2, 1),
  in: Easing.bezier(0.5, 0, 0.75, 0),
} as const;

export const springs = {
  /** Critically damped — no overshoot. For objects and logos. */
  settle: {damping: 200, stiffness: 70, mass: 1},
  /** Slightly livelier, still no visible bounce. For type. */
  lift: {damping: 30, stiffness: 110, mass: 0.9},
} as const;

export const shadows = {
  card: '0 2px 4px rgba(16,44,35,0.06), 0 18px 40px -8px rgba(16,44,35,0.22), 0 50px 90px -30px rgba(16,44,35,0.30)',
} as const;
