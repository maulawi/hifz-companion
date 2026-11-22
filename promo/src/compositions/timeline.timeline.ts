/**
 * Batch 04 — Hifz Timeline (1080×1920 vertical master to match the series, 30 fps, 23 s).
 * A teaser: daily capacity → long-term plan → estimate → brand. Timings editable here
 * and in each scene's *_T constants.
 */
export const TIMELINE_STORYBOARD = {
  question: 120, // 01 · ~0–4 s   How long will your Hifz journey take?
  capacity: 150, // 02 · ~4–9 s   Start with your daily capacity
  build: 180, // 03 · ~9–15 s     Turn your daily target into a long-term plan
  estimate: 150, // 04 · ~15–20 s A clearer picture
  reveal: 150, // 05 · ~20–23 s   Brand
} as const;

export type TimelineSceneId = keyof typeof TIMELINE_STORYBOARD;
export const TIMELINE_SCENES: TimelineSceneId[] = ['question', 'capacity', 'build', 'estimate', 'reveal'];
export const TIMELINE_TRANSITION = 15;

export const TIMELINE_DURATION =
  TIMELINE_SCENES.reduce((n, id) => n + TIMELINE_STORYBOARD[id], 0) - TIMELINE_TRANSITION * (TIMELINE_SCENES.length - 1); // 690
