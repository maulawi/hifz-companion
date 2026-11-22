import {staticFile} from 'remotion';

/**
 * Single registry of supplied brand / product assets.
 * Files live in /public. Originals are kept untouched next to any derived file.
 */
export const assets = {
  brand: {
    /** Official logo, background removed (colour-to-alpha, colours & proportions unchanged). 754×823. */
    logo: {src: staticFile('brand/qurra-logo.png'), width: 754, height: 823},
    logoOriginal: staticFile('brand/qurra-logo-original.webp'),
  },
  products: {
    // Reserved for later batches (Hifz Companion / Hifz Timeline / Challenge).
    iconBrain: staticFile('products/hifz-lab-icon-brain.png'),
    iconCalendar: staticFile('products/hifz-lab-icon-calendar.png'),
  },
  ebook: {
    /**
     * Front cover, perspective-flattened from the supplied mockup to a 2:3 face
     * (geometry only — artwork untouched). 1000×1500.
     */
    coverFront: {src: staticFile('ebook/cover-front-flat.png'), width: 1000, height: 1500},
    coverMockupOriginal: staticFile('ebook/cover-mockup-original.webp'),
  },
} as const;
