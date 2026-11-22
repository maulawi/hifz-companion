import {Rect} from '../data/mutashabihatPage';

/** A ScreenPanel placement: centre, rendered width and the crop it shows. */
export type Placement = {x: number; y: number; width: number; crop: Rect};

/** Screen-space rectangle of a screenshot region inside an (unrotated) panel. */
export const regionOnScreen = (p: Placement, region: Rect) => {
  const k = p.width / p.crop.w;
  const left = p.x - p.width / 2;
  const top = p.y - (p.crop.h * k) / 2;
  return {
    x: left + (region.x - p.crop.x) * k,
    y: top + (region.y - p.crop.y) * k,
    w: region.w * k,
    h: region.h * k,
    cx: left + (region.x + region.w / 2 - p.crop.x) * k,
    cy: top + (region.y + region.h / 2 - p.crop.y) * k,
  };
};

export const panelHeight = (p: Pick<Placement, 'width' | 'crop'>) => (p.crop.h * p.width) / p.crop.w;

/** Interpolate between two placements of the same element. */
export const lerpRect = (a: {x: number; y: number; w: number}, b: {x: number; y: number; w: number}, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
});
