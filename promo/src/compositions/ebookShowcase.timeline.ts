import {BOOK, BookPose, facingZ, PAGE_SURFACE} from '../components/BookMockup';
import {canvas} from '../styles/brand';

/**
 * Batch 01 — Mutashabihat Ebook showcase.
 * All timing (frames @ 30 fps) and camera poses live here so scenes stay in sync.
 */
export const SCENES = {
  brandIntro: 64, // ~2.1 s
  bookReveal: 90, // 3.0 s
  pageReveal: 120, // 4.0 s
  closing: 106, // ~3.5 s
} as const;

/** Cross-fade from the brand intro into the book reveal. */
export const INTRO_TRANSITION = 20;

export const EBOOK_SHOWCASE_DURATION =
  SCENES.brandIntro + SCENES.bookReveal + SCENES.pageReveal + SCENES.closing - INTRO_TRANSITION; // 360 = 12.0 s

/** Absolute start frame of each scene in the composition. */
export const SCENE_START = {
  brandIntro: 0,
  bookReveal: SCENES.brandIntro - INTRO_TRANSITION,
  pageReveal: SCENES.brandIntro - INTRO_TRANSITION + SCENES.bookReveal,
  closing: SCENES.brandIntro - INTRO_TRANSITION + SCENES.bookReveal + SCENES.pageReveal,
} as const;

// ───────────────────────── Book camera poses ─────────────────────────
// Scenes 2→3→4 share one continuous book: each scene ends on the exact pose
// the next one starts from, so the cuts between them are invisible.

/** Width of the comparison page as printed on the book's first page. */
export const PRINTED_PAGE_WIDTH = PAGE_SURFACE.width - 56;
/** Vertical screen centre of the open spread and of the lifted card. */
export const PAGE_FOCUS_Y = 840;
/** Final on-screen width of the lifted comparison card. */
export const CARD_WIDTH = 1000;

/**
 * Open spread facing the camera head-on. The first page lies exactly on the
 * screen plane, so the printed page can hand over to a flat 2D card with no
 * visible jump. The whole spread stays inside the frame (headless Chromium can
 * skip painting 3D faces that straddle the frame edge).
 */
const spreadFacing = (scale: number): BookPose => ({
  x: (BOOK.width / 2) * scale, // centre the two-page spread
  y: PAGE_FOCUS_Y - canvas.height / 2,
  z: facingZ(scale),
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale,
  open: 1,
});

export const POSES = {
  revealFrom: {x: 0, y: 420, z: -320, rotateX: -16, rotateY: -42, rotateZ: -5, scale: 0.86, open: 0},
  revealSettled: {x: 0, y: -150, z: 0, rotateX: -6, rotateY: -21, rotateZ: -1.6, scale: 0.92, open: 0},
  revealEnd: {x: 0, y: -158, z: 50, rotateX: -5, rotateY: -15, rotateZ: -1, scale: 0.95, open: 0},
  /** Cover just opened: spread slightly angled, still settling. */
  spreadOpening: {x: 236, y: -126, z: 0, rotateX: -4, rotateY: -6, rotateZ: -0.5, scale: 0.79, open: 1},
  /** Spread square to camera; the hand-off pose for the lifted card. */
  spreadFacing: spreadFacing(0.84),
  /** Spread recedes behind the lifted card. */
  spreadReceded: spreadFacing(0.78),
  closingRest: {x: 0, y: -90, z: 0, rotateX: -6, rotateY: 22, rotateZ: 1.5, scale: 0.62, open: 0},
} satisfies Record<string, BookPose>;

/** Screen rectangle of the printed comparison page for a facing pose. */
export const printedPageOnScreen = (pose: BookPose) => ({
  cx: canvas.width / 2 + pose.x + pose.scale * PAGE_SURFACE.centerX,
  cy: canvas.height / 2 + pose.y,
  width: PRINTED_PAGE_WIDTH * pose.scale,
});

// ───────────────────────── Audio cue markers ─────────────────────────
// Absolute frames. Used by the optional <Audio> layer and documented in README.
export const AUDIO_CUES = [
  {id: 'musicIn', frame: 0, note: 'Ambient bed fades in (0–15f)'},
  {id: 'logoReveal', frame: 4, note: 'Soft, airy shimmer as the logo resolves'},
  {id: 'bookRise', frame: SCENE_START.bookReveal, note: 'Low, gentle swell as the book rises'},
  {id: 'coverOpen', frame: SCENE_START.pageReveal + 2, note: 'Hardcover board opening / paper movement'},
  {id: 'cardLift', frame: SCENE_START.pageReveal + 52, note: 'Light air movement as the page lifts'},
  {id: 'highlight1', frame: SCENE_START.pageReveal + 74, note: 'Very soft tick — row 1 highlight'},
  {id: 'highlight2', frame: SCENE_START.pageReveal + 89, note: 'Very soft tick — row 2 highlight'},
  {id: 'highlight3', frame: SCENE_START.pageReveal + 104, note: 'Very soft tick — row 3 highlight'},
  {id: 'coverClose', frame: SCENE_START.closing + 42, note: 'Muted board close'},
  {id: 'logoResolve', frame: SCENE_START.closing + 30, note: 'Closing shimmer with the logo'},
  {id: 'musicOut', frame: EBOOK_SHOWCASE_DURATION - 20, note: 'Bed fades out over the final 20f'},
] as const;

export type AudioCueId = (typeof AUDIO_CUES)[number]['id'];
