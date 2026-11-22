# QURRA · Hifz Lab — Promotional Video (Remotion)

Vertical 1080 × 1920 · 30 fps · H.264. Built in separate product batches that
share one design system.

| Batch | Composition id | Status |
|---|---|---|
| 01 · Mutashabihat Ebook | `Batch01-EbookShowcase` (26.9 s / 806 f) | Review (v2) |
| 02 · Mutasyabihat Challenge | `Batch02-MutasyabihatChallenge` (30.0 s / 900 f) | Review |
| 03 · Hifz Companion | — | not started |
| 04 · Hifz Timeline | — | not started |

`HifzLab-FullPromo` plays every registered batch back to back.

## Commands

```bash
npm install
npm run studio          # live preview / scrubbing
npm run render:preview  # out/batch01-preview.mp4  (review copy, 810×1440)
npm run render:final    # out/batch01-final.mp4    (after approval)
npm run typecheck
```

`remotion.config.ts` points Remotion at the system's headless Chromium
(`/opt/pw-browsers/chromium_headless_shell`). On another machine either delete
that line or set `REMOTION_BROWSER=/path/to/chrome`.

## Structure

```
public/
  brand/        qurra-logo.png (background removed) + untouched original
  ebook/        cover-front-flat.png (perspective-flattened) + untouched mockup
  ebook/pages/  authentic pages, unmodified: preface-nazm, contents,
                introduction, comparison-01/02/03
  products/     Hifz Lab icons (reserved for later batches)
  fonts/        Playfair Display + Inter (bundled, no network at render time)
  audio/        drop licensed audio here (see Audio)
src/
  styles/brand.ts        colours, type scale, easing, springs, safe area   ← design system
  lib/motion.ts          progress / settle / fadeOut / float helpers
  lib/keyframes.ts       generic keyframe interpolation (card choreography)
  lib/pageFlow.ts        page-turn sequencer: spreads, holds, turn timing
  components/            reusable, product-agnostic
    BookMockup           CSS-3D hardcover: boards, spine, page block, hinge,
                         left page on the open cover, curling turning leaves
    BookPage             renders any registered ebook page at book-page size
    ComparisonPage       shows a supplied table + SVG overlay highlights
    BrandBackground · BrandLogo · GeometricOrnament · GoldDivider
    KineticText · FloatingAccents
  data/
    ebookPages.ts        page registry (ids → images / table layouts)
    mutashabihatPage.ts  table specs: crop + pixel rects of rows / red phrases
    assets.ts            brand / cover registry
  scenes/                Batch 01: BrandIntro (A), BookReveal (B),
                         InsideTheBook (C), CollectionMontage (D), ClosingReveal (E)
  compositions/
    ebookShowcase.timeline.ts   page order, durations, poses, audio cues
    EbookShowcase.tsx           Batch 01 composition
    batches.ts                  batch registry → compositions + full promo
tools/logo_to_alpha.py   reproducible logo background removal
```

## Batch 01 — animation structure

| Scene | Frames (abs.) | What happens |
|---|---|---|
| A · Brand & origin | 0–129 | Rosette draws, logo resolves, “Preserve. Strengthen. Remember.” Logo glides up; a faint crop of the real Preface naẓm drifts behind “A Classical Legacy of Quranic Scholarship” / “Rooted in the urjuzah of Imam al-Sakhawi, a poem of some 400 lines”. |
| ↔ fade | 110–129 | 20 f cross-fade |
| B · Book reveal | 110–199 | Hardcover rises and turns into soft light; title lock-up. |
| C · Pages come alive | 200–495 | Cover opens flat; Preface & naẓm → page turn → Contents │ Introduction → page turn → comparison spread. A slow reading camera leans toward each page; small labels name them. |
| D · The collection | 496–705 | The three tables lift off the spread; the book dissolves; real pages drift far behind. The first table is highlighted and zoomed (Ar-Raʿd row), then cards rotate through the front: each highlighted. “The Translated Compilation — More Than 800 Similar Quranic Verses” → “Carefully Compiled with Translation”. |
| ↔ fade | 686–705 | 20 f cross-fade |
| E · Closing | 686–805 | Closed book floats beside the logo; “Understand the Differences. Strengthen Your Hifz.”; fade to cream. |

B → C → D are plain cuts with no visible seam: each scene ends on exactly the
book pose (and page state) the next starts from.

### Adjusting

* **Page order / which pages:** `PAGE_FLOW.spreads` in the timeline file. Pages
  are ids from `data/ebookPages.ts`; add a page there once and use it anywhere.
* **Hold / turn timing:** `PAGE_FLOW.holds`, `PAGE_FLOW.turn`; scene C's length
  follows automatically.
* **Labels:** `SPREAD_LABELS`. **Reading camera:** `readingCamera()` in
  `InsideTheBook.tsx`. **Montage choreography:** keyframes and `MONTAGE_T` in
  `CollectionMontage.tsx`. **Scene lengths / fades:** `SCENES`, `TRANSITIONS`.

### Content integrity

* Every page and table is the supplied image, scaled uniformly (full pages are
  fitted whole, never cropped or stretched; tables are cropped only to their own
  border). Highlights and focus dimming are a separate SVG layer positioned from
  pixel rectangles measured on each source image. No Arabic is typeset,
  regenerated or recoloured anywhere.
* The supplied pages are low resolution (≈520 px wide; the two smaller tables
  ≈445 px). They are shown at roughly native size on the book and at most ≈1.5×
  as cards; the 1170 px table is the one used for the close zoom.
* Claims: the classical source (Imam al-Sakhawi's urjuzah of some 400 lines) is
  introduced in scene A; the 800+ examples with translation are presented in
  scene D as **the translated compilation**, not as al-Sakhawi's own collection.
* The cover is the supplied artwork, perspective-flattened for texturing.

### Rendering note

Headless Chromium can skip painting large CSS-3D faces that straddle the frame
edge, so the open book always stays fully in frame; close-ups use flat 2D cards
handed off at a pixel-matched frame. Keep this in mind for later batches.

## Audio

The composition renders silent and is visually complete without sound. To add
audio, put **original or properly licensed** files in `public/audio/` and pass
props (Studio props panel, or `--props`):

```json
{
  "musicSrc": "audio/batch01-bed.wav",
  "musicVolume": 0.55,
  "sfx": {"logoReveal": "audio/shimmer.wav", "coverOpen": "audio/board-open.wav"},
  "sfxVolume": 0.35
}
```

Cue markers (absolute frames @ 30 fps) are defined in `AUDIO_CUES`
(`src/compositions/ebookShowcase.timeline.ts`): music in/out, logo shimmer,
origin title, book rise, cover open, two page turns, card lift, highlight ticks
and the closing shimmer.

## Batch 02 — Mutasyabihat Challenge

Vertical 1080×1920 master, 30 s. Scenes live in `src/scenes/challenge/`
(Intro, HomeStart, Question, AyahComparison, Progress, Outro); durations,
order and cross-fades in `src/compositions/challenge.timeline.ts`; screenshot
regions in `src/data/challenge.ts`. Every interface element is a crop of a
supplied screenshot (`ScreenPanel`); highlights, the selection ring, value
wipes and the progress-bar reveal are overlays or masks over those pixels.
Asset notes: `docs/batch02-asset-manifest.md`.

## Adding the next batch

1. Create `src/compositions/<Name>.timeline.ts` (durations, poses, cues) and
   `src/compositions/<Name>.tsx`; put its scenes in `src/scenes/<name>/`.
2. Reuse `BrandBackground`, `BrandLogo`, `KineticText`, `GoldDivider`,
   `FloatingAccents`, `GeometricOrnament` and the tokens in `styles/brand.ts`.
   Product-specific visuals (e.g. a phone/app mockup for Hifz Companion) go in
   `components/` only if another batch can use them too.
3. Register it in `src/compositions/batches.ts`. It immediately appears as its
   own composition and is appended to `HifzLab-FullPromo`.
4. Add a render script to `package.json` mirroring `render:preview`.

Product icons for Hifz Companion / Hifz Timeline are already in
`public/products/` and `assets.products`.
