import {ease} from '../styles/brand';

type EaseFn = (t: number) => number;

export type Keyframe<T extends Record<string, number>> = {f: number} & T;

/**
 * Interpolates a numeric record across keyframes (sorted by `f`), easing each
 * segment. Values hold before the first and after the last keyframe.
 */
export const keyframes = <T extends Record<string, number>>(frame: number, kfs: Keyframe<T>[], easing: EaseFn = ease.inOut): T => {
  const strip = (k: Keyframe<T>): T => {
    const {f: _f, ...rest} = k;
    return rest as unknown as T;
  };
  if (frame <= kfs[0].f) return strip(kfs[0]);
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (frame <= b.f) {
      const t = easing((frame - a.f) / Math.max(1, b.f - a.f));
      const out: Record<string, number> = {};
      for (const key of Object.keys(a)) {
        if (key === 'f') continue;
        const av = a[key] as number;
        const bv = (b[key] as number) ?? av;
        out[key] = av + (bv - av) * t;
      }
      return out as T;
    }
  }
  return strip(kfs[kfs.length - 1]);
};
