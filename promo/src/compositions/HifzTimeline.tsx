import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {BrandBackground} from '../components/BrandBackground';
import {crossFade} from '../lib/crossFade';
import {ease} from '../styles/brand';
import {TheQuestion} from '../scenes/timeline/TheQuestion';
import {DailyCapacity} from '../scenes/timeline/DailyCapacity';
import {BuildTimeline} from '../scenes/timeline/BuildTimeline';
import {SeeEstimate} from '../scenes/timeline/SeeEstimate';
import {TimelineReveal} from '../scenes/timeline/TimelineReveal';
import {TIMELINE_SCENES, TIMELINE_STORYBOARD, TIMELINE_TRANSITION, TimelineSceneId} from './timeline.timeline';

const SCENE_COMPONENTS: Record<TimelineSceneId, React.FC> = {
  question: TheQuestion,
  capacity: DailyCapacity,
  build: BuildTimeline,
  estimate: SeeEstimate,
  reveal: TimelineReveal,
};

/** Batch 04 — Hifz Timeline. Each scene is an independent component. */
export const HifzTimeline: React.FC = () => (
  <AbsoluteFill>
    <BrandBackground />
    <TransitionSeries>
      {TIMELINE_SCENES.flatMap((id, i) => {
        const Scene = SCENE_COMPONENTS[id];
        const seq = (
          <TransitionSeries.Sequence key={id} durationInFrames={TIMELINE_STORYBOARD[id]} name={id}>
            <Scene />
          </TransitionSeries.Sequence>
        );
        return i === 0
          ? [seq]
          : [<TransitionSeries.Transition key={`${id}-in`} presentation={crossFade()} timing={linearTiming({durationInFrames: TIMELINE_TRANSITION, easing: ease.inOut})} />, seq];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
