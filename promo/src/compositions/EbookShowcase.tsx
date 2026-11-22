import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {BrandBackground} from '../components/BrandBackground';
import {BrandIntro} from '../scenes/BrandIntro';
import {BookReveal} from '../scenes/BookReveal';
import {EbookPageReveal} from '../scenes/EbookPageReveal';
import {ClosingReveal} from '../scenes/ClosingReveal';
import {ease} from '../styles/brand';
import {AUDIO_CUES, AudioCueId, EBOOK_SHOWCASE_DURATION, INTRO_TRANSITION, SCENES} from './ebookShowcase.timeline';

export type EbookShowcaseProps = {
  /** Optional licensed/original ambient bed, path relative to /public (e.g. "audio/batch01-bed.wav"). */
  musicSrc?: string | null;
  musicVolume?: number;
  /** Optional sound effects keyed by cue id, paths relative to /public. */
  sfx?: Partial<Record<AudioCueId, string>>;
  sfxVolume?: number;
};

export const ebookShowcaseDefaults: EbookShowcaseProps = {
  musicSrc: null,
  musicVolume: 0.55,
  sfx: {},
  sfxVolume: 0.35,
};

/**
 * Batch 01 — Mutashabihat Ebook showcase (1080×1920, 30 fps, 12 s).
 * Visually complete without audio; audio layers render only when provided.
 */
export const EbookShowcase: React.FC<EbookShowcaseProps> = ({musicSrc, musicVolume = 0.55, sfx = {}, sfxVolume = 0.35}) => {
  return (
    <AbsoluteFill>
      <BrandBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.brandIntro} name="01 Brand intro">
          <BrandIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: INTRO_TRANSITION, easing: ease.inOut})} />
        <TransitionSeries.Sequence durationInFrames={SCENES.bookReveal} name="02 Book reveal">
          <BookReveal />
        </TransitionSeries.Sequence>
        {/* 02→03→04 share one continuous book pose, so these are seamless cuts */}
        <TransitionSeries.Sequence durationInFrames={SCENES.pageReveal} name="03 Inside the ebook">
          <EbookPageReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence durationInFrames={SCENES.closing} name="04 Closing">
          <ClosingReveal />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ── Audio (placeholder: silent until files are supplied) ── */}
      {musicSrc ? (
        <Audio
          src={staticFile(musicSrc)}
          volume={(f) =>
            musicVolume *
            interpolate(f, [0, 15, EBOOK_SHOWCASE_DURATION - 20, EBOOK_SHOWCASE_DURATION], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      ) : null}
      {AUDIO_CUES.map((cue) =>
        sfx[cue.id] ? (
          <Sequence key={cue.id} from={cue.frame} name={`sfx: ${cue.id}`}>
            <Audio src={staticFile(sfx[cue.id] as string)} volume={sfxVolume} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
