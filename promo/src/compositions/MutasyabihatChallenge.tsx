import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {BrandBackground} from '../components/BrandBackground';
import {crossFade} from '../lib/crossFade';
import {ease} from '../styles/brand';
import {Intro} from '../scenes/challenge/Intro';
import {HomeStart} from '../scenes/challenge/HomeStart';
import {Question} from '../scenes/challenge/Question';
import {AyahComparison} from '../scenes/challenge/AyahComparison';
import {ProgressScene} from '../scenes/challenge/Progress';
import {Outro} from '../scenes/challenge/Outro';
import {CHALLENGE_SCENES, CHALLENGE_STORYBOARD, CHALLENGE_TRANSITION, ChallengeSceneId} from './challenge.timeline';

const SCENE_COMPONENTS: Record<ChallengeSceneId, React.FC> = {
  intro: Intro,
  home: HomeStart,
  question: Question,
  comparison: AyahComparison,
  progress: ProgressScene,
  outro: Outro,
};

/** Batch 02 — Mutasyabihat Challenge. Each scene is an independent component. */
export const MutasyabihatChallenge: React.FC = () => (
  <AbsoluteFill>
    <BrandBackground />
    <TransitionSeries>
      {CHALLENGE_SCENES.flatMap((id, i) => {
        const Scene = SCENE_COMPONENTS[id];
        const seq = (
          <TransitionSeries.Sequence key={id} durationInFrames={CHALLENGE_STORYBOARD[id]} name={id}>
            <Scene />
          </TransitionSeries.Sequence>
        );
        return i === 0
          ? [seq]
          : [
              <TransitionSeries.Transition
                key={`${id}-in`}
                presentation={crossFade()}
                timing={linearTiming({durationInFrames: CHALLENGE_TRANSITION, easing: ease.inOut})}
              />,
              seq,
            ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
