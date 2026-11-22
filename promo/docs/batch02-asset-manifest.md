# Batch 02 · Mutasyabihat Challenge — Asset Manifest

Status: **Stage 1 (asset preparation)**. No animation code yet.

## Available

| Asset | File | Size | Use | Notes |
|---|---|---|---|---|
| QURRA logo (transparent) | `public/brand/qurra-logo.png` | 754×823 | Scenes 01, 06 | Shared with Batch 01. Original kept. |
| Mutasyabihat Challenge icon | `public/products/hifz-lab-icon-brain.png` | 548×521 | Scene 01 | Identical to the icon supplied earlier. Off-white square background (needs the same colour-to-alpha step as the logo). |
| Home screen | `public/challenge/screens/home.jpg` | 704×1280 | Scene 01/02 bridge, Scene 06 | Title, description, Progress card ("No attempts yet"), Start Challenge, Learn / Progress tiles, tab bar. |
| Question screen | `public/challenge/screens/question.jpg` | 704×1280 | Scene 03 | "Juz 11 – 15 · Question 1 / 10", ayah prompt, options A / B, disabled Submit. **No option selected.** |
| Answer / comparison screen | `public/challenge/screens/answer-comparison.jpg` | 704×1280 | Scene 04 | Correct Ayah (Al-Hijr 32 · Juz 14), Similar Ayah (Sad 75 · Juz 23), "What to Notice", Next Question. Top of screen is scrolled off. |
| Progress screen | `public/challenge/screens/progress.jpg` | 708×1280 | Scene 05 | 1 answered · 1 correct · 100 % · 0 challenges; Performance by Juz down to "Juz 16 – 20" (rest cut off). |
| Motion reference | Spotify clip (uploads) | 1268×720 | Direction only | Not used as footage. |
| Fonts | `public/fonts/` | — | All | Playfair Display + Inter (match the app). |
| Design system | `src/styles`, `src/components`, `src/lib` | — | All | Colours, easing, KineticText, GoldDivider, GeometricOrnament, BrandBackground, keyframes, crossFade. |

## Missing or limited

1. **Juz selection screen (Scene 02)** — not supplied, and not in this repo
   (`index.html` is the Hifz Companion app). Scene 02 cannot show real Juz
   cards without it; I won't fabricate one.
2. **Answer-selected / correct-feedback state (Scene 03)** — only the unselected
   question exists. A selection highlight can be an overlay on the real option
   card, but a "Correct!" banner or green state would be invented UI. The
   comparison screen (titled "Correct Ayah") can serve as the feedback beat.
3. **Top of the comparison screen** — whatever sits above "Correct Ayah"
   (likely a result banner) is scrolled off.
4. **Rest of the Progress screen** — Performance by Juz is cut off after
   "Juz 16 – 20"; Juz 21–30 rows are missing.
5. **Progress figures are a single-answer session** (1 / 1 / 100 % / 0).
   Counting to "1" is weak, and "100 %" from one answer could read as an
   achievement claim. A screenshot with a realistic demo session (labelled as
   demo) would work better.
6. **Resolution** — screenshots are 704 px wide. In a 1920×1080 frame a full
   phone screen fits at ~1:1 (height 1080 ≈ 0.84×). Close-ups of Arabic beyond
   ~1.5× will soften; higher-resolution captures (e.g. 1408×2560) would allow
   tighter, sharper push-ins.
7. **Arabic font** — not needed if all Arabic comes from screenshots (the plan).
   If any Arabic must be typeset, the app uses **Amiri**
   (`@fontsource/amiri`, available on npm).

## Content observations

* The app spells the product **"Mutasyabihat Challenge"**; the Batch 01 ebook
  uses "Mutashabihat". Headline will follow the app's spelling unless told otherwise.
* Differing words for Scene 04 highlighting: after the shared phrase
  "قَالَ يَٰٓإِبْلِيسُ مَا" — "لَكَ أَلَّا تَكُونَ مَعَ ٱلسَّٰجِدِينَ" (Al-Hijr 32)
  vs "مَنَعَكَ أَن تَسْجُدَ …" (Sad 75). Highlights will be overlays positioned on
  the screenshot pixels, never retyped text.

## Format

Batch 02 targets a **1920×1080 landscape master** @ 30 fps; Batch 01 is
1080×1920. Canvas size will be a per-batch setting so a vertical cut can be
added later without rebuilding scenes.
