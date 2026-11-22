import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

/**
 * True cross-fade: the exiting scene fades out while the entering one fades in.
 * (`fade()` from @remotion/transitions only fades the entering scene, which
 * leaves an exiting scene with a transparent background fully visible until
 * it cuts out.)
 */
const CrossFadeComponent: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const opacity = presentationDirection === 'entering' ? presentationProgress : 1 - presentationProgress;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const crossFade = (): TransitionPresentation<Record<string, never>> => ({
  component: CrossFadeComponent,
  props: {},
});
