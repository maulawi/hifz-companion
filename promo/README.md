# QURRA · Hifz Lab — Promotional Video (Remotion)

Vertical 1080 × 1920 · 30 fps · H.264. Built in separate product batches that
share one design system.

| Batch | Composition id | Status |
|---|---|---|
| 01 · Mutashabihat Ebook | `Batch01-EbookShowcase` (12.0 s / 360 f) | Review |
| 02 · Mutashabihat Challenge | — | not started |
| 03 · Hifz Companion | — | not started |
| 04 · Hifz Timeline | — | not started |

`HifzLab-FullPromo` plays every registered batch back to back.

## Commands

```bash
npm install
npm run studio          # live preview / scrubbing
npm run render:preview  # out/batch01-preview.mp4  (review copy)
npm run render:final    # out/batch01-final.mp4    (after approval)
npm run typecheck
```

`remotion.config.ts` points Remotion at the system's headless Chromium
(`/opt/pw-browsers/chromium_headless_shell`). On another machine either delete
that line or set `REMOTION_BROWSER=/path/to/chrome`.

## Structure

```
public/
  brand/      qurra-logo.png (background removed) + untouched original
  ebook/      cover-front-flat.png (perspective-flattened) + untouched mockup,
              page-comparison-01.jpg (supplied page, unmodified)
  products/   Hifz Lab icons (reserved for later batches)
  fonts/      Playfair Display + Inter (bundled, no network at render time)
  audio/      drop licensed audio here (see Audio)
src/
  styles/brand.ts        colours, type scale, easing, springs, safe area   ← design system
  styles/fonts.ts        local font loading
  lib/motion.ts          progress / settle / fadeOut / float helpers
  components/            reusable, product-agnostic
    BrandBackground      persistent cream stage, light falloff, rosettes, grain
    BrandLogo            official logo, locked aspect, reveal
    GeometricOrnament    8-fold rosette with line-draw animation
    GoldDivider          hairline + diamond (echoes the cover)
    KineticText          masked word-by-word type, optional count-up
    FloatingAccents      small gold geometric parallax accents
    BookMockup           CSS-3D hardcover: boards, spine, page block, hinge
    ComparisonPage       displays the supplied page + SVG overlay highlights
  data/
    assets.ts            single asset registry
    mutashabihatPage.ts  pixel rectangles of rows / phrases on the page image
  scenes/                Batch 01 scenes (BrandIntro, BookReveal,
                         EbookPageReveal, ClosingReveal, PrintedComparisonPage)
  compositions/
    ebookShowcase.timeline.ts   durations, book camera poses, audio cues
    EbookShowcase.tsx           Batch 01 composition
    batches.ts                  batch registry → compositions + full promo
  Root.tsx
tools/logo_to_alpha.py   reproducible logo background removal
```

## Batch 01 — animation structure

| # | Scene | Frames (abs.) | What happens |
|---|---|---|---|
| 1 | Brand intro | 0–63 | Rosette draws on, logo resolves (opacity + 6 % scale + focus pull), divider, “Preserve. Strengthen. Remember.” word by word. Lifts away and softens. |
| ↔ | Cross-fade | 44–63 | `TransitionSeries` fade (20 f). |
| 2 | Book reveal | 44–133 | Hardcover rises on a critically damped spring, turns from −42° to −15°, slow push-in, light sheen sweeps the cover, floor shadow forms. Title lock-up. |
| 3 | Inside the ebook | 134–253 | Cover swings open on its hinge, spread squares up to camera. At the exact facing frame the printed page hands off to a flat card that lifts, arcs to centre and grows while the book recedes (blur + fade). Gold frames draw around each row’s phrases with soft focus dimming. “Explore More Than 800 Similar Quranic Verses.” with a count-up. |
| 4 | Closing | 254–359 | Card settles back onto the page, the cover closes and the book turns to show its spine, floating. Logo resolves above; “Understand the Differences. Strengthen Your Hifz.” Gentle push, then a 12-frame fade to cream (clean join for the next batch). |

Scenes 2 → 3 → 4 are plain cuts with **no visible seam**: each scene ends on
exactly the book pose the next one starts from (`POSES` in the timeline file),
so the book reads as one continuous camera move.

### Content integrity

* The comparison page image is drawn as supplied, scaled uniformly and cropped to
  the table (the clipped line of text above it and the cut-off frame ornaments are
  outside the window). Highlights and focus dimming are a separate SVG layer
  positioned with coordinates measured on the original image. No Arabic is
  typeset, regenerated or recoloured anywhere in the project.
* The cover was supplied as a perspective mockup. `cover-front-flat.png` is the
  front face mapped back to a flat 2 : 3 rectangle (geometry only; artwork
  unchanged) so it can be wrapped onto the 3D book. Lighting (hinge groove,
  sheen) is an overlay on top.
* The logo keeps its exact colours and aspect ratio; only the paper background
  was removed (`tools/logo_to_alpha.py`).

### Rendering note

Headless Chromium can skip painting large CSS-3D faces that straddle the frame
edge. The camera path is therefore designed so the open book always stays fully
in frame. Keep that in mind when designing 3D moves for later batches.

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

Cue markers (absolute frames @ 30 fps, from `AUDIO_CUES`):

| Cue | Frame | Time | Suggested sound |
|---|---|---|---|
| musicIn | 0 | 0.00 s | ambient bed fades in over 15 f |
| logoReveal | 4 | 0.13 s | soft, airy shimmer |
| bookRise | 44 | 1.47 s | low, gentle swell |
| coverOpen | 136 | 4.53 s | hardcover board / paper movement |
| cardLift | 186 | 6.20 s | light air movement |
| highlight1–3 | 208 · 223 · 238 | 6.93 · 7.43 · 7.93 s | very soft ticks |
| logoResolve | 284 | 9.47 s | closing shimmer |
| coverClose | 296 | 9.87 s | muted board close |
| musicOut | 340 | 11.33 s | bed fades out over 20 f |

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
