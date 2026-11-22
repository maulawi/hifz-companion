import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {BrandBackground} from '../components/BrandBackground';
import {crossFade} from '../lib/crossFade';
import {ease} from '../styles/brand';
import {Beginning} from '../scenes/companion/Beginning';
import {DailyCompanion} from '../scenes/companion/DailyCompanion';
import {Routine} from '../scenes/companion/Routine';
import {ProgressOverTime} from '../scenes/companion/ProgressOverTime';
import {CompanionReveal} from '../scenes/companion/CompanionReveal';
import {COMPANION_SCENES, COMPANION_STORYBOARD, COMPANION_TRANSITION, CompanionSceneId} from './companion.timeline';

const SCENE_COMPONENTS: Record<CompanionSceneId, React.FC> = {
  beginning: Beginning,
  daily: DailyCompanion,
  routine: Routine,
  progress: ProgressOverTime,
  reveal: CompanionReveal,
};

/** Batch 03 — Hifz Companion. Each scene is an independent component. */
export const HifzCompanion: React.FC = () => (
  <AbsoluteFill>
    <BrandBackground />
    <TransitionSeries>
      {COMPANION_SCENES.flatMap((id, i) => {
        const Scene = SCENE_COMPONENTS[id];
        const seq = (
          <TransitionSeries.Sequence key={id} durationInFrames={COMPANION_STORYBOARD[id]} name={id}>
            <Scene />
          </TransitionSeries.Sequence>
        );
        return i === 0
          ? [seq]
          : [<TransitionSeries.Transition key={`${id}-in`} presentation={crossFade()} timing={linearTiming({durationInFrames: COMPANION_TRANSITION, easing: ease.inOut})} />, seq];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
