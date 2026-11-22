import {BOOK, BookPose, facingZ, PAGE_SURFACE} from '../components/BookMockup';
import {PageFlowConfig, flowDuration} from '../lib/pageFlow';
import {canvas} from '../styles/brand';

/**
 * Batch 01 — Mutashabihat Ebook showcase.
 * All timing (frames @ 30 fps), page order and camera poses live here.
 */

// ───────────────────────── Page order & turn timing ─────────────────────────
/** The pages that "come alive" inside the book. Reorder / retime freely. */
export const PAGE_FLOW: PageFlowConfig = {
  spreads: [
    {left: null, right: 'preface'}, // endpaper | Preface & Arabic naẓm
    {left: 'contents', right: 'introduction'}, // Table of Contents | Introduction
    {left: 'page51', right: 'page52'}, // two full Mutashabihat pages (nazm, meaning, comparison tables)
  ],
  start: 42, // cover fully open
  holds: [66, 84, 52],
  turn: 26,
};

/** Small labels under each page while a spread rests. */
export const SPREAD_LABELS: Array<{left?: string; right?: string; center?: string}> = [
  {right: 'Preface  ·  The Nazm'},
  {left: 'Contents', right: 'Introduction'},
  {center: 'Mutashabihat Verses'},
];

// ───────────────────────── Scene durations ─────────────────────────
export const SCENES = {
  origin: 130, // A — brand + classical scholarly origin
  bookReveal: 90, // B — cover reveal
  pages: flowDuration(PAGE_FLOW), // C — pages come alive (296)
  montage: 210, // D — scale of the collection
  closing: 120, // E — closing reveal
} as const;

/** Cross-fades (frames). B→C and C→D are seamless cuts on matched poses. */
export const TRANSITIONS = {originToReveal: 20, montageToClosing: 20} as const;

export const EBOOK_SHOWCASE_DURATION =
  SCENES.origin + SCENES.bookReveal + SCENES.pages + SCENES.montage + SCENES.closing - TRANSITIONS.originToReveal - TRANSITIONS.montageToClosing;

/** Absolute start frame of each scene. */
export const SCENE_START = (() => {
  const origin = 0;
  const bookReveal = SCENES.origin - TRANSITIONS.originToReveal;
  const pages = bookReveal + SCENES.bookReveal;
  const montage = pages + SCENES.pages;
  const closing = montage + SCENES.montage - TRANSITIONS.montageToClosing;
  return {origin, bookReveal, pages, montage, closing};
})();

// ───────────────────────── Book camera poses ─────────────────────────
/** Vertical screen centre of the open spread. */
export const PAGE_FOCUS_Y = 880;

/**
 * Open spread square to the camera with the pages on the screen plane, so a
 * printed table can hand over to a flat 2D card with no visible jump. The
 * spread always stays inside the frame (headless Chromium can skip painting 3D
 * faces that straddle the frame edge).
 */
export const spreadFacing = (scale: number, rotateY = 0): BookPose => ({
  x: (BOOK.width / 2) * scale, // centre the two-page spread
  y: PAGE_FOCUS_Y - canvas.height / 2,
  z: facingZ(scale),
  rotateX: 0,
  rotateY,
  rotateZ: 0,
  scale,
  open: 1,
});

export const POSES = {
  revealFrom: {x: 0, y: 420, z: -320, rotateX: -16, rotateY: -42, rotateZ: -5, scale: 0.86, open: 0},
  revealSettled: {x: 0, y: -150, z: 0, rotateX: -6, rotateY: -21, rotateZ: -1.6, scale: 0.92, open: 0},
  revealEnd: {x: 0, y: -158, z: 50, rotateX: -5, rotateY: -15, rotateZ: -1, scale: 0.95, open: 0},
  spreadOpening: {x: 236, y: -96, z: 0, rotateX: -4, rotateY: -6, rotateZ: -0.5, scale: 0.8, open: 1},
  /** Hand-off pose: tables lift off the pages from here. */
  spreadFacing: spreadFacing(0.84),
  spreadReceded: spreadFacing(0.74),
  closingFrom: {x: 0, y: 260, z: -200, rotateX: -12, rotateY: 40, rotateZ: 4, scale: 0.56, open: 0},
  closingRest: {x: 0, y: -90, z: 0, rotateX: -6, rotateY: 22, rotateZ: 1.5, scale: 0.62, open: 0},
} satisfies Record<string, BookPose>;

/** Page-local x of the left / right page centres (book units). */
export const PAGE_CENTER_X = {
  right: PAGE_SURFACE.centerX,
  left: -BOOK.width / 2 - PAGE_SURFACE.width / 2,
} as const;

/** Screen position of a page-local point for a facing pose. */
export const pagePointOnScreen = (pose: BookPose, side: 'left' | 'right', px: number, py: number) => ({
  x: canvas.width / 2 + pose.x + pose.scale * (PAGE_CENTER_X[side] + px - PAGE_SURFACE.width / 2),
  y: canvas.height / 2 + pose.y + pose.scale * (py - PAGE_SURFACE.height / 2),
});

// ───────────────────────── Audio cue markers ─────────────────────────
const P = SCENE_START.pages;
const M = SCENE_START.montage;
const turnFrame = (i: number) => P + PAGE_FLOW.start + PAGE_FLOW.holds.slice(0, i + 1).reduce((a, b) => a + b, 0) + PAGE_FLOW.turn * i;

/** Absolute frames. Used by the optional <Audio> layer and documented in README. */
export const AUDIO_CUES = [
  {id: 'musicIn', frame: 0, note: 'Ambient bed fades in (0–15f)'},
  {id: 'logoReveal', frame: 4, note: 'Soft, airy shimmer as the logo resolves'},
  {id: 'originTitle', frame: 72, note: 'Low, warm tone under “A Classical Legacy…”'},
  {id: 'bookRise', frame: SCENE_START.bookReveal + 8, note: 'Gentle swell as the book rises'},
  {id: 'coverOpen', frame: P + 2, note: 'Hardcover board opening'},
  {id: 'pageTurn1', frame: turnFrame(0), note: 'Paper page turn'},
  {id: 'pageTurn2', frame: turnFrame(1), note: 'Paper page turn'},
  {id: 'cardLift', frame: M + 2, note: 'Light air movement as the tables lift'},
  {id: 'highlightA', frame: M + 36, note: 'Very soft tick — highlights'},
  {id: 'highlightB', frame: M + 140, note: 'Very soft tick — highlights'},
  {id: 'highlightC', frame: M + 176, note: 'Very soft tick — highlights'},
  {id: 'logoResolve', frame: SCENE_START.closing + 22, note: 'Closing shimmer with the logo'},
  {id: 'musicOut', frame: EBOOK_SHOWCASE_DURATION - 20, note: 'Bed fades out over the final 20f'},
] as const;

export type AudioCueId = (typeof AUDIO_CUES)[number]['id'];
