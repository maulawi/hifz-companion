import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {BrandBackground} from '../components/BrandBackground';
import {Intro} from '../scenes/challenge/Intro';
import {CHALLENGE_SCENES, CHALLENGE_STORYBOARD, ChallengeSceneId} from './challenge.timeline';

const SCENE_COMPONENTS: Partial<Record<ChallengeSceneId, React.FC>> = {
  intro: Intro,
};

/** Batch 02 — Mutasyabihat Challenge. Each scene is an independent component. */
export const MutasyabihatChallenge: React.FC = () => (
  <AbsoluteFill>
    <BrandBackground />
    <Series>
      {CHALLENGE_SCENES.map((id) => {
        const Scene = SCENE_COMPONENTS[id];
        return Scene ? (
          <Series.Sequence key={id} durationInFrames={CHALLENGE_STORYBOARD[id]} name={id}>
            <Scene />
          </Series.Sequence>
        ) : null;
      })}
    </Series>
  </AbsoluteFill>
);
