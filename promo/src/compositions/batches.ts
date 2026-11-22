import React from 'react';
import {FormatId} from '../styles/brand';
import {MutasyabihatChallenge} from './MutasyabihatChallenge';
import {CHALLENGE_DURATION} from './challenge.timeline';
import {EbookShowcase, ebookShowcaseDefaults} from './EbookShowcase';
import {EBOOK_SHOWCASE_DURATION} from './ebookShowcase.timeline';

/**
 * Registry of product batches. Each entry becomes its own composition and is
 * appended, in order, to the full "HifzLab-FullPromo" composition.
 *
 * To add a batch: build it in src/compositions/<Name>.tsx with its own
 * <name>.timeline.ts, then add an entry here. Nothing else needs to change.
 */
export type Batch = {
  id: string;
  title: string;
  component: React.FC<any>;
  durationInFrames: number;
  /** Output format; defaults to vertical 1080×1920. */
  format?: FormatId;
  defaultProps?: Record<string, unknown>;
};

export const BATCHES: Batch[] = [
  {
    id: 'Batch01-EbookShowcase',
    title: 'Mutashabihat Ebook',
    component: EbookShowcase,
    durationInFrames: EBOOK_SHOWCASE_DURATION,
    defaultProps: ebookShowcaseDefaults,
  },
  {
    id: 'Batch02-MutasyabihatChallenge',
    title: 'Mutasyabihat Challenge',
    component: MutasyabihatChallenge,
    durationInFrames: CHALLENGE_DURATION,
    // Vertical master to match the rest of the series (a landscape cut can be added later).
    format: 'vertical',
  },
  // { id: 'Batch03-HifzCompanion', ... },
  // { id: 'Batch04-HifzTimeline', ... },
];
