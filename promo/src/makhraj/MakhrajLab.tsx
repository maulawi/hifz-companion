import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {useLayout} from '../lib/layout';
import {progress} from '../lib/motion';
import {ease} from '../styles/brand';
import {DarkStage} from './components';
import {SceneAnatomy, SceneModel, SceneOrigin, SceneReveal} from './scenesA';
import {SceneCTA, SceneEverything, SceneExperience, SceneLetters, SceneSifat} from './scenesB';
import {MAKHRAJ_DURATION} from './theme';
import {MAKHRAJ_MUSIC, MAKHRAJ_SFX} from './sound';

export type MakhrajProps = {
  /** Link shown under the call to action (left clean when empty). */
  url?: string;
  music?: boolean;
  sfx?: boolean;
  voiceover?: boolean;
};

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  // Darkness opens slowly; a warm light source follows the story's focus.
  const exposure = interpolate(frame, [0, 120, 1790, 1830], [0.25, 1, 1, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const light = {x: L.cx, y: L.cy - 40, radius: L.landscape ? 900 : 1000, strength: 0.6 + 0.4 * Math.sin(frame / 90)};
  return <DarkStage exposure={exposure} light={light} dust={1 - 0.5 * progress(frame, 630, 60, ease.soft) + 0.5 * progress(frame, 1790, 40, ease.soft)} />;
};

/**
 * Makhraj Lab — launch film. One composition, two formats (1920×1080 and
 * 1080×1920). The supplied voice-over is the master clock (see theme.CUE).
 */
export const MakhrajLab: React.FC<MakhrajProps> = ({url = '', music = true, sfx = true, voiceover = true}) => (
  <AbsoluteFill>
    <Stage />
    <SceneOrigin />
    <SceneAnatomy />
    <SceneReveal />
    <SceneModel />
    <SceneLetters />
    <SceneSifat />
    <SceneEverything />
    <SceneExperience />
    <SceneCTA url={url} />

    {voiceover ? <Audio src={staticFile('audio/makhraj/makhraj-voiceover.mp3')} volume={1} /> : null}
    {music ? <Audio src={staticFile(MAKHRAJ_MUSIC.src)} volume={(f) => MAKHRAJ_MUSIC.volume(f)} /> : null}
    {sfx
      ? MAKHRAJ_SFX.map((c, i) => (
          <Sequence key={i} from={c.frame} durationInFrames={Math.min(180, MAKHRAJ_DURATION - c.frame)} name={`sfx ${c.sfx}`}>
            <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.volume} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
