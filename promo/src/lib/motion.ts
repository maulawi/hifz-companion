import {interpolate, spring} from 'remotion';
import {ease} from '../styles/brand';

type EaseFn = (t: number) => number;

/** 0→1 progress between `start` and `start + duration`, clamped and eased. */
export const progress = (frame: number, start: number, duration: number, easing: EaseFn = ease.out) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Critically damped spring starting at `delay`. */
export const settle = (frame: number, fps: number, delay = 0, durationInFrames?: number) =>
  spring({frame: frame - delay, fps, config: {damping: 200, stiffness: 70, mass: 1}, durationInFrames});

/** Fade-out multiplier: 1 until `start`, then eases to 0 over `duration`. */
export const fadeOut = (frame: number, start: number, duration: number) =>
  1 - progress(frame, start, duration, ease.in);

/** Slow, organic floating offset (pixels) for idle objects. */
export const float = (frame: number, amplitude: number, periodFrames: number, phase = 0) =>
  Math.sin((frame / periodFrames) * Math.PI * 2 + phase) * amplitude;
