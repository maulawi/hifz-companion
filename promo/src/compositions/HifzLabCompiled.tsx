import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {BrandBackground} from '../components/BrandBackground';
import {crossFade} from '../lib/crossFade';
import {ease} from '../styles/brand';
import {EbookShowcase} from './EbookShowcase';
import {MutasyabihatChallenge} from './MutasyabihatChallenge';
import {HifzCompanion} from './HifzCompanion';
import {HifzTimeline} from './HifzTimeline';
import {Opener} from '../scenes/compiled/Opener';
import {Finale} from '../scenes/compiled/Finale';
import {COMPILED_DURATION, JOIN, MUSIC, PARTS, PartId, SFX_CUES, TIMELINE_VO_SLOT, VO, VO_SECONDS} from './compiled.timeline';

const PART_COMPONENTS: Record<PartId, React.FC> = {
  opener: Opener,
  b01: EbookShowcase,
  b02: MutasyabihatChallenge,
  b03: HifzCompanion,
  b04: HifzTimeline,
  finale: Finale,
};

export type CompiledProps = {
  /** Play the optional Hifz Timeline narration from TIMELINE_VO_SLOT.src. */
  timelineVo?: boolean;
  /** Mute layers for review. */
  music?: boolean;
  sfx?: boolean;
  voiceover?: boolean;
};

/** Music level with ducking under each narration line. */
const musicVolume = (f: number, fps: number, withTimeline: boolean) => {
  const windows = VO.map((v) => [v.frame, v.frame + VO_SECONDS[v.id] * fps] as const);
  if (withTimeline) windows.push([TIMELINE_VO_SLOT.frame, TIMELINE_VO_SLOT.frame + 5 * fps]);
  let duck = 0;
  for (const [a, b] of windows) {
    duck = Math.max(duck, interpolate(f, [a - MUSIC.rampFrames, a, b, b + MUSIC.rampFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  const fades = interpolate(f, [0, 30, COMPILED_DURATION - 60, COMPILED_DURATION], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (MUSIC.base + (MUSIC.ducked - MUSIC.base) * duck) * fades;
};

/**
 * HifzLab-Compiled — opener, the four approved batches (trimmed so only one
 * ending remains), and the finale, with narration, music bed and sound design.
 */
export const HifzLabCompiled: React.FC<CompiledProps> = ({timelineVo = false, music = true, sfx = true, voiceover = true}) => (
  <AbsoluteFill>
    <BrandBackground />
    <TransitionSeries>
      {PARTS.flatMap((p, i) => {
        const Part = PART_COMPONENTS[p.id];
        const seq = (
          <TransitionSeries.Sequence key={p.id} durationInFrames={p.to - p.from} name={p.id}>
            <Sequence from={-p.from} name={`${p.id} @${p.from}`}>
              <Part />
            </Sequence>
          </TransitionSeries.Sequence>
        );
        return i === 0
          ? [seq]
          : [<TransitionSeries.Transition key={`${p.id}-join`} presentation={crossFade()} timing={linearTiming({durationInFrames: JOIN, easing: ease.inOut})} />, seq];
      })}
    </TransitionSeries>

    {/* ── Sound ── */}
    {music ? <Audio src={staticFile(MUSIC.src)} volume={(f) => musicVolume(f, 30, timelineVo)} /> : null}
    {voiceover
      ? VO.map((v) => (
          <Sequence key={v.id} from={v.frame} name={`VO ${v.id}`}>
            <Audio src={staticFile(v.src)} volume={1} />
          </Sequence>
        ))
      : null}
    {voiceover && timelineVo ? (
      <Sequence from={TIMELINE_VO_SLOT.frame} name="VO timeline (optional)">
        <Audio src={staticFile(TIMELINE_VO_SLOT.src)} volume={1} />
      </Sequence>
    ) : null}
    {sfx
      ? SFX_CUES.map((c, i) => (
          <Sequence key={i} from={c.frame} durationInFrames={150} name={`sfx ${c.sfx}`}>
            <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.volume} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
