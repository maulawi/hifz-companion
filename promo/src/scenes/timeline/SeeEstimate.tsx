import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraRig} from '../../components/CameraRig';
import {GoldFrame} from '../../components/GoldFrame';
import {HeadlineBlock} from '../../components/HeadlineBlock';
import {ScreenPanel} from '../../components/ScreenPanel';
import {TIMELINE_COLORS, TIMELINE_REGIONS, TIMELINE_SCREENS} from '../../data/timeline';
import {useLayout} from '../../lib/layout';
import {float, progress} from '../../lib/motion';
import {colors, ease} from '../../styles/brand';

export const ESTIMATE_T = {hero: 14, heroWipe: 22, completion: 44, completionWipe: 52, frame: 86, disclaimer: 96, headline: 6} as const;
const T = ESTIMATE_T;

const RES = TIMELINE_SCREENS.results;
const R = TIMELINE_REGIONS.results;

/**
 * Scene 04 — a selected part of the real Results screen: "10 → 30" and the
 * estimated completion (~3.9 years, around October 2030) wipe into view, with
 * the app's own note that these are estimates, not a guarantee.
 */
export const SeeEstimate: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();

  const hero = progress(frame, T.hero, 22, ease.out);
  const heroWipe = progress(frame, T.heroWipe, 26, ease.inOut);
  const comp = progress(frame, T.completion, 22, ease.out);
  const compWipe = progress(frame, T.completionWipe, 28, ease.inOut);
  const disc = progress(frame, T.disclaimer, 20, ease.out);
  const settled = progress(frame, T.completion + 20, 30, ease.soft);
  const push = progress(frame, 0, 150, ease.soft);

  // "~3.9 years" line inside the completion crop
  const years = {x: 230, y: 606, w: 244, h: 66};

  return (
    <AbsoluteFill>
      <CameraRig zoom={1 + push * 0.045} focusX={L.cx} focusY={1000}>
        <ScreenPanel screen={RES} crop={R.hero} width={700} x={L.cx} y={790 + (1 - hero) * 70 + float(frame, 4, 140) * settled} opacity={hero} radius={24} edge={0.45} shadow={hero}>
          {/* left → right reveal of "10 → 30" */}
          <rect x={R.hero.x + R.hero.w * heroWipe} y={R.hero.y + 60} width={R.hero.w * (1 - heroWipe)} height={R.hero.h - 60} fill={TIMELINE_COLORS.card} />
        </ScreenPanel>

        <ScreenPanel screen={RES} crop={R.completion} width={900} x={L.cx} y={1150 + (1 - comp) * 80 + float(frame, 4, 150, 1) * settled} opacity={comp} radius={24} edge={0.45} shadow={comp}>
          {/* top → bottom reveal of the estimate */}
          <rect x={R.completion.x} y={R.completion.y + 50 + (R.completion.h - 50) * compWipe} width={R.completion.w} height={(R.completion.h - 50) * (1 - compWipe)} fill={TIMELINE_COLORS.card} />
          <GoldFrame rect={{x: years.x - 10, y: years.y - 6, w: years.w + 20, h: years.h + 12}} draw={progress(frame, T.frame, 18, ease.out)} radius={14} color={colors.goldDeep} stroke={2.2} glow={10} />
        </ScreenPanel>

        {/* The app's own wording: estimates, not a guarantee */}
        <ScreenPanel
          screen={TIMELINE_SCREENS.byYear}
          crop={TIMELINE_REGIONS.byYear.disclaimer}
          width={760}
          x={L.cx}
          y={1430 + (1 - disc) * 20}
          opacity={disc * 0.9}
          radius={0}
          shadow={0}
          edge={0}
          style={{background: 'transparent', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)'}}
        />
      </CameraRig>

      <HeadlineBlock
        headline={'A Clearer Picture\nof Your Hifz Journey.'}
        support="Plan with Purpose. Progress with Consistency."
        start={T.headline}
        align="center"
        x={L.cx}
        y={190}
        width={1000}
        headlineSize={78}
        supportSize={34}
      />
    </AbsoluteFill>
  );
};
