/**
 * Batch 02 — Mutasyabihat Challenge (1080×1920 vertical master, 30 fps, 30 s).
 * Each scene is an independent component; durations and order live here.
 */
export const CHALLENGE_STORYBOARD = {
  intro: 135, // 01 · brand + icon            (~0–4 s)
  home: 135, // 02 · Home → Start Challenge   (~4–8 s)
  question: 195, // 03 · recall the ayah      (~8–14 s)
  comparison: 225, // 04 · compare verses     (~14–21 s)
  progress: 165, // 05 · track progress       (~21–26 s)
  outro: 120, // 06 · closing reveal          (~26–30 s)
} as const;

export type ChallengeSceneId = keyof typeof CHALLENGE_STORYBOARD;

export const CHALLENGE_SCENES: ChallengeSceneId[] = ['intro', 'home', 'question', 'comparison', 'progress', 'outro'];

/** Cross-fade between consecutive scenes (frames). */
export const CHALLENGE_TRANSITION = 15;

export const CHALLENGE_DURATION =
  CHALLENGE_SCENES.reduce((n, id) => n + CHALLENGE_STORYBOARD[id], 0) - CHALLENGE_TRANSITION * (CHALLENGE_SCENES.length - 1); // 900

/** App colours sampled from the screenshots (for reveal masks). */
export const APP_COLORS = {background: '#F9F5E9', card: '#FBFBF1'} as const;
