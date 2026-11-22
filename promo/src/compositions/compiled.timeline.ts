/**
 * HifzLab-Compiled — the four approved batches as one film (1080×1920, 30 fps).
 *
 * Opener → Batch 01 → 02 → 03 → 04 → Finale. Each batch is played from `from`
 * to `to` (its own frames), which trims the repeated logo intros and the
 * per-product sign-offs so only the finale ends the film.
 */
export const COMPILED_FPS = 30;
export const JOIN = 15; // cross-fade between consecutive parts (frames)

export type PartId = 'opener' | 'b01' | 'b02' | 'b03' | 'b04' | 'finale';

export const PARTS: Array<{id: PartId; from: number; to: number}> = [
  {id: 'opener', from: 0, to: 150},
  {id: 'b01', from: 80, to: 686}, // starts as the logo settles; ends before its closing scene
  {id: 'b02', from: 56, to: 780}, // starts once its logo has settled (no repeated reveal); ends before its outro
  {id: 'b03', from: 0, to: 525}, // ends before its brand reveal
  {id: 'b04', from: 0, to: 540}, // ends before its brand reveal
  {id: 'finale', from: 0, to: 320},
];

/** Absolute start frame of each part in the compiled film. */
export const PART_START: Record<PartId, number> = (() => {
  const out = {} as Record<PartId, number>;
  let t = 0;
  PARTS.forEach((p, i) => {
    out[p.id] = t;
    t += p.to - p.from - (i < PARTS.length - 1 ? JOIN : 0);
  });
  return out;
})();

export const COMPILED_DURATION = PART_START.finale + (PARTS[PARTS.length - 1].to - PARTS[PARTS.length - 1].from);

/** Convert a part's own frame to an absolute compiled frame (null if trimmed away). */
export const at = (id: PartId, local: number): number | null => {
  const p = PARTS.find((x) => x.id === id)!;
  if (local < p.from || local >= p.to) return null;
  return PART_START[id] + (local - p.from);
};

// ───────────────────────── Voice-over ─────────────────────────
/**
 * Narration clips, cut at the natural pauses of the two supplied ElevenLabs
 * reads: the product lines (vo-*) and the scene headlines (h*). Each is anchored
 * to a frame of its own part, so it follows the picture if timings change.
 */
const vo = (id: string, part: PartId, local: number, seconds: number) => ({id, src: `audio/vo/${id}.wav`, frame: at(part, local) ?? 0, seconds});

export const VO = [
  vo('vo-01-intro', 'opener', 8, 5.55), // "Introducing Hifz Lab…"
  vo('vo-02-ebook', 'b01', 140, 7.53), // book rising
  vo('h00-origin', 'b01', 385, 3.15), // "Rooted in the classical work of Imam al-Sakhawi" — over the page turns
  vo('vo-03-challenge', 'b02', 60, 6.85), // icon in flight
  vo('h0a-recall', 'b02', 285, 1.91), // "Can you recall the correct ayah?"
  vo('h0b-differences', 'b02', 440, 4.86), // "Recognise the differences…"
  vo('h0c-progress', 'b02', 648, 1.44), // "Measure your progress."
  vo('vo-04-companion', 'b03', 19, 6.4), // icon rises
  vo('h0d-rhythm', 'b03', 257, 1.98), // "Find a rhythm that works for you."
  vo('h0e-small-steps', 'b03', 403, 1.99), // "Every small step matters."
  vo('h0f1-timeline', 'b04', 14, 2.37), // "And finally, Hifz Timeline."
  vo('h0f2-how-long', 'b04', 100, 1.76), // "How long will your journey take?"
  vo('h0g-capacity', 'b04', 165, 1.95), // "Start with your daily capacity."
  vo('h0h-long-term', 'b04', 255, 3.1), // "Turn your daily target into a long-term plan."
  vo('h0i-clearer', 'b04', 420, 2.53), // "A clearer picture of your Hifz journey."
  {id: 'vo-05-finale', src: 'audio/vo/vo-05-finale.wav', frame: PART_START.finale + 15, seconds: 9.0}, // "Four tools, one purpose…"
];

// ───────────────────────── Sound design ─────────────────────────
type Sfx =
  | 'whoosh-soft'
  | 'whoosh-wide'
  | 'whoosh-short'
  | 'page-turn'
  | 'chime-low'
  | 'chime-high'
  | 'shimmer'
  | 'tick'
  | 'tick-soft'
  | 'tap'
  | 'pop'
  | 'pop-high'
  | 'swell'
  | 'sweep-line';

export type Cue = {frame: number; sfx: Sfx; volume: number};

const cues: Cue[] = [];
const add = (id: PartId, local: number, sfx: Sfx, volume: number) => {
  const f = at(id, local);
  if (f !== null) cues.push({frame: f, sfx, volume});
};
const series = (id: PartId, start: number, count: number, step: number, sfx: Sfx, volume: number) => {
  for (let i = 0; i < count; i++) add(id, start + i * step, sfx, volume);
};

// Joins between parts
PARTS.slice(1).forEach((p) => cues.push({frame: PART_START[p.id] - 2, sfx: 'whoosh-wide', volume: 0.32}));

// Opener
add('opener', 4, 'chime-low', 0.3);
add('opener', 16, 'whoosh-soft', 0.22);
series('opener', 52, 4, 9, 'pop', 0.32);
add('opener', 54, 'shimmer', 0.16);

// Batch 01 — ebook (frames from ebookShowcase.timeline)
add('b01', 118, 'swell', 0.32); // book rises
add('b01', 202, 'whoosh-soft', 0.28); // cover opens
add('b01', 308, 'page-turn', 0.45); // page turn 1
add('b01', 418, 'page-turn', 0.45); // page turn 2
add('b01', 498, 'whoosh-short', 0.3); // tables lift
series('b01', 532, 3, 10, 'tick', 0.22); // highlights
add('b01', 608, 'whoosh-short', 0.24); // swap B
series('b01', 636, 3, 8, 'tick-soft', 0.2);
add('b01', 662, 'whoosh-short', 0.24); // swap C
series('b01', 672, 2, 7, 'tick-soft', 0.18);

// Batch 02 — challenge (scene starts: home 120, question 240, comparison 420, progress 630)
add('b02', 40, 'whoosh-soft', 0.28); // icon on its gold trail
add('b02', 80, 'chime-high', 0.26); // icon lands
series('b02', 144, 4, 9, 'pop', 0.28); // home cards
add('b02', 190, 'tap', 0.4); // Start Challenge pressed
add('b02', 212, 'whoosh-wide', 0.28); // push-in
add('b02', 246, 'tick', 0.26); // Juz range marked
add('b02', 270, 'whoosh-short', 0.28); // question card expands
add('b02', 290, 'shimmer', 0.14); // ayah reveals
add('b02', 310, 'pop', 0.28);
add('b02', 322, 'pop', 0.28); // options
add('b02', 362, 'tap', 0.38); // option A selected
add('b02', 364, 'chime-high', 0.16);
add('b02', 442, 'whoosh-soft', 0.28); // panels separate
add('b02', 480, 'tick', 0.22); // shared phrase
add('b02', 500, 'sweep-line', 0.26); // connector
add('b02', 524, 'tick', 0.26);
add('b02', 534, 'tick', 0.24); // differences framed
series('b02', 646, 4, 7, 'pop', 0.26); // stat cards
add('b02', 704, 'sweep-line', 0.22); // Juz bar grows

// Batch 03 — companion (scene starts: daily 105, routine 240, progress 390)
add('b03', 28, 'chime-low', 0.28); // icon
add('b03', 36, 'whoosh-soft', 0.18); // UI layers drift in
add('b03', 131, 'whoosh-short', 0.28); // card lifts
add('b03', 155, 'sweep-line', 0.18); // ring draws
add('b03', 175, 'pop', 0.24); // murajaah card
add('b03', 201, 'tick', 0.24); // daily target
series('b03', 262, 3, 8, 'pop', 0.28); // plan rows lift
add('b03', 302, 'whoosh-soft', 0.22); // rows arrange
series('b03', 328, 7, 8, 'tick-soft', 0.14); // days light up
add('b03', 400, 'pop', 0.28); // progress card
add('b03', 424, 'sweep-line', 0.22); // arc
add('b03', 442, 'whoosh-soft', 0.18); // map rises
series('b03', 482, 2, 6, 'tick', 0.22); // memorised cells

// Batch 04 — timeline (scene starts: capacity 105, build 240, estimate 405)
add('b04', 30, 'chime-low', 0.28); // icon
series('b04', 113, 10, 3, 'tick-soft', 0.09); // Juz 1–10 marked
add('b04', 145, 'whoosh-short', 0.28); // step bar lifts
add('b04', 165, 'tick', 0.26); // "Your Pace"
add('b04', 173, 'pop', 0.28);
add('b04', 197, 'pop', 0.28); // pace & weekly rows
add('b04', 209, 'sweep-line', 0.22); // connector
add('b04', 244, 'pop', 0.28); // circles
add('b04', 280, 'tick', 0.24); // you are here
series('b04', 296, 7, 6, 'tick-soft', 0.11); // days
add('b04', 310, 'sweep-line', 0.24); // timeline line grows
series('b04', 326, 4, 14, 'pop-high', 0.22); // year rows
add('b04', 419, 'pop', 0.28); // 10 → 30
add('b04', 449, 'pop', 0.28); // estimate
add('b04', 491, 'tick', 0.28); // ~3.9 years framed

// Finale (synced to the VO words: four tools 17, bringing 93, QURRA 172, learn 217, preserve 238, grow 268)
add('finale', 12, 'whoosh-soft', 0.22);
series('finale', 17, 4, 8, 'pop', 0.3);
add('finale', 93, 'shimmer', 0.12);
add('finale', 160, 'whoosh-wide', 0.28);
add('finale', 172, 'chime-low', 0.34);
add('finale', 174, 'shimmer', 0.2);
add('finale', 217, 'tick', 0.22);
add('finale', 238, 'tick', 0.22);
add('finale', 268, 'chime-high', 0.2);

export const SFX_CUES: Cue[] = cues.sort((a, b) => a.frame - b.frame);

/** Music bed level: base, and ducked level while narration plays. */
export const MUSIC = {src: 'audio/music/hifzlab-bed.mp3', base: 0.26, ducked: 0.1, rampFrames: 12} as const;
