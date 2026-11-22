/**
 * Batch 03 — Hifz Companion (1080×1920 vertical master to match the series, 30 fps, ~22.5 s).
 * A teaser, not a tour: a few real moments from the app, then the brand.
 */
export const COMPANION_STORYBOARD = {
  beginning: 120, // 01 · ~0–4 s
  daily: 150, // 02 · ~4–9 s
  routine: 165, // 03 · ~9–14 s
  progress: 150, // 04 · ~14–19 s
  reveal: 150, // 05 · ~19–22.5 s
} as const;

export type CompanionSceneId = keyof typeof COMPANION_STORYBOARD;
export const COMPANION_SCENES: CompanionSceneId[] = ['beginning', 'daily', 'routine', 'progress', 'reveal'];
export const COMPANION_TRANSITION = 15;

export const COMPANION_DURATION =
  COMPANION_SCENES.reduce((n, id) => n + COMPANION_STORYBOARD[id], 0) - COMPANION_TRANSITION * (COMPANION_SCENES.length - 1); // 675
