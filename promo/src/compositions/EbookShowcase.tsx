import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {crossFade} from '../lib/crossFade';
import {BrandBackground} from '../components/BrandBackground';
import {BrandIntro} from '../scenes/BrandIntro';
import {BookReveal} from '../scenes/BookReveal';
import {InsideTheBook} from '../scenes/InsideTheBook';
import {CollectionMontage} from '../scenes/CollectionMontage';
import {ClosingReveal} from '../scenes/ClosingReveal';
import {ease} from '../styles/brand';
import {AUDIO_CUES, AudioCueId, EBOOK_SHOWCASE_DURATION, SCENES, TRANSITIONS} from './ebookShowcase.timeline';

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
 * Batch 01 — Mutashabihat Ebook showcase (1080×1920, 30 fps, ~26.9 s).
 * Visually complete without audio; audio layers render only when provided.
 */
export const EbookShowcase: React.FC<EbookShowcaseProps> = ({musicSrc, musicVolume = 0.55, sfx = {}, sfxVolume = 0.35}) => {
  return (
    <AbsoluteFill>
      <BrandBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.origin} name="A Brand & scholarly origin">
          <BrandIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={crossFade()} timing={linearTiming({durationInFrames: TRANSITIONS.originToReveal, easing: ease.inOut})} />
        <TransitionSeries.Sequence durationInFrames={SCENES.bookReveal} name="B Book reveal">
          <BookReveal />
        </TransitionSeries.Sequence>
        {/* B→C→D share one continuous book pose, so these are seamless cuts */}
        <TransitionSeries.Sequence durationInFrames={SCENES.pages} name="C Pages come alive">
          <InsideTheBook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence durationInFrames={SCENES.montage} name="D Collection montage">
          <CollectionMontage />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={crossFade()} timing={linearTiming({durationInFrames: TRANSITIONS.montageToClosing, easing: ease.inOut})} />
        <TransitionSeries.Sequence durationInFrames={SCENES.closing} name="E Closing">
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
