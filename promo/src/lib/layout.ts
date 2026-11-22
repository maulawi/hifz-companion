import {useVideoConfig} from 'remotion';

/**
 * Canvas-relative layout helpers so a scene can serve both the 1920×1080
 * landscape master and a later 1080×1920 vertical cut.
 */
export const useLayout = () => {
  const {width: w, height: h} = useVideoConfig();
  const landscape = w > h;
  return {
    w,
    h,
    landscape,
    cx: w / 2,
    cy: h / 2,
    /** Title/action-safe margins (5 % / 7.5 % of the short side). */
    safe: {x: landscape ? w * 0.075 : w * 0.083, y: landscape ? h * 0.08 : h * 0.12},
    /** Scale factor relative to a 1080-px short side. */
    unit: Math.min(w, h) / 1080,
  };
};
