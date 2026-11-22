import React from 'react';
import {Composition, Series} from 'remotion';
import {BATCHES} from './compositions/batches';
import {canvas, formats} from './styles/brand';
import {loadBrandFonts} from './styles/fonts';

loadBrandFonts();

/** Vertical batches back to back. (A landscape master of the series can be added the same way.) */
const VERTICAL_BATCHES = BATCHES.filter((b) => (b.format ?? 'vertical') === 'vertical');

const FullPromo: React.FC = () => (
  <Series>
    {VERTICAL_BATCHES.map(({id, component: C, durationInFrames, defaultProps}) => (
      <Series.Sequence key={id} durationInFrames={durationInFrames} name={id}>
        <C {...defaultProps} />
      </Series.Sequence>
    ))}
  </Series>
);

export const RemotionRoot: React.FC = () => (
  <>
    {BATCHES.map(({id, component, durationInFrames, format = 'vertical', defaultProps}) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={durationInFrames}
        fps={formats[format].fps}
        width={formats[format].width}
        height={formats[format].height}
        defaultProps={defaultProps}
      />
    ))}
    <Composition
      id="HifzLab-FullPromo"
      component={FullPromo}
      durationInFrames={VERTICAL_BATCHES.reduce((n, b) => n + b.durationInFrames, 0)}
      fps={canvas.fps}
      width={canvas.width}
      height={canvas.height}
    />
  </>
);
