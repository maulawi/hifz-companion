/**
 * Batch 02 — Mutasyabihat Challenge (1920×1080 landscape master, 30 fps).
 * Scene durations follow the 30-second storyboard. Only built scenes are
 * included in CHALLENGE_SCENES; the composition length follows automatically.
 */
export const CHALLENGE_STORYBOARD = {
  intro: 120, // 01 · 0–4 s
  home: 120, // 02 · 4–8 s   (Home screen in place of Juz cards)
  question: 180, // 03 · 8–14 s
  comparison: 210, // 04 · 14–21 s
  progress: 150, // 05 · 21–26 s
  outro: 120, // 06 · 26–30 s
} as const;

export type ChallengeSceneId = keyof typeof CHALLENGE_STORYBOARD;

/** Scenes built so far (Stage 2: opening scene as the visual test). */
export const CHALLENGE_SCENES: ChallengeSceneId[] = ['intro'];

export const CHALLENGE_DURATION = CHALLENGE_SCENES.reduce((n, id) => n + CHALLENGE_STORYBOARD[id], 0);
