import {continueRender, delayRender, staticFile} from 'remotion';

/** Brand fonts are bundled locally (from @fontsource) so renders never depend on the network. */
const ARABIC_RANGE = 'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200E';
const FACES: Array<[family: string, file: string, weight: string, style: string, unicodeRange?: string]> = [
  ['Playfair Display', 'playfair-display-latin-400-normal.woff2', '400', 'normal'],
  ['Playfair Display', 'playfair-display-latin-500-normal.woff2', '500', 'normal'],
  ['Playfair Display', 'playfair-display-latin-400-italic.woff2', '400', 'italic'],
  ['Playfair Display', 'playfair-display-latin-500-italic.woff2', '500', 'italic'],
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-500-normal.woff2', '500', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Amiri', 'amiri-arabic-400-normal.woff2', '400', 'normal', ARABIC_RANGE],
  ['Amiri', 'amiri-arabic-700-normal.woff2', '700', 'normal', ARABIC_RANGE],
];

let started = false;

export const loadBrandFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading QURRA brand fonts');
  Promise.all(
    FACES.map(([family, file, weight, style, unicodeRange]) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, style, ...(unicodeRange ? {unicodeRange} : {})})
        .load()
        .then((face) => document.fonts.add(face)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error('Font loading failed', err);
      continueRender(handle);
    });
};
