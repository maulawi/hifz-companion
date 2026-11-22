import React from 'react';
import {Composition, Series} from 'remotion';
import {BATCHES} from './compositions/batches';
import {canvas} from './styles/brand';
import {loadBrandFonts} from './styles/fonts';

loadBrandFonts();

/** Plays every registered batch back to back (only Batch 01 exists for now). */
const FullPromo: React.FC = () => (
  <Series>
    {BATCHES.map(({id, component: C, durationInFrames, defaultProps}) => (
      <Series.Sequence key={id} durationInFrames={durationInFrames} name={id}>
        <C {...defaultProps} />
      </Series.Sequence>
    ))}
  </Series>
);

export const RemotionRoot: React.FC = () => (
  <>
    {BATCHES.map(({id, component, durationInFrames, defaultProps}) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={durationInFrames}
        fps={canvas.fps}
        width={canvas.width}
        height={canvas.height}
        defaultProps={defaultProps}
      />
    ))}
    <Composition
      id="HifzLab-FullPromo"
      component={FullPromo}
      durationInFrames={BATCHES.reduce((n, b) => n + b.durationInFrames, 0)}
      fps={canvas.fps}
      width={canvas.width}
      height={canvas.height}
    />
  </>
);
