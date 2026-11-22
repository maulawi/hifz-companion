import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../lib/motion';
import {colors, ease, type} from '../styles/brand';
import {GoldDivider} from './GoldDivider';
import {KineticText} from './KineticText';

type Props = {
  eyebrow?: string;
  headline: string;
  support?: string;
  /** Local frame at which the block starts building. */
  start: number;
  exitStart?: number;
  align?: 'left' | 'center';
  /** Top-left of the block (left aligned) or top-centre (centered). */
  x: number;
  y: number;
  width: number;
  headlineSize?: number;
  supportSize?: number;
  divider?: boolean;
};

/**
 * Reusable editorial lock-up: optional gold eyebrow, kinetic serif headline,
 * hairline divider and a quiet supporting line.
 */
export const HeadlineBlock: React.FC<Props> = ({
  eyebrow,
  headline,
  support,
  start,
  exitStart,
  align = 'left',
  x,
  y,
  width,
  headlineSize = 96,
  supportSize = 38,
  divider = true,
}) => {
  const frame = useCurrentFrame();
  const eb = progress(frame, start - 4, 18, ease.out);
  const lines = headline.split('\n').length;
  const exit = exitStart === undefined ? 0 : progress(frame, exitStart, 14, ease.in);
  const words = headline.split(/\s+/).length;
  const supportStart = start + words * 4 + 10;
  const left = align === 'left' ? x : x - width / 2;
  return (
    <div style={{position: 'absolute', left, top: y, width, textAlign: align, opacity: 1 - exit, transform: `translateY(${-exit * 24}px)`}}>
      {eyebrow ? (
        <div style={{...type.eyebrow, fontSize: 22, color: colors.goldDeep, opacity: eb, transform: `translateY(${(1 - eb) * 12}px)`, marginBottom: 26}}>{eyebrow}</div>
      ) : null}
      <KineticText
        text={headline}
        start={start}
        stagger={4}
        duration={24}
        align={align}
        style={{...type.headline, fontSize: headlineSize, lineHeight: 1.06, color: colors.forest, minHeight: headlineSize * 1.06 * lines}}
      />
      {divider ? (
        <GoldDivider
          width={300}
          progress={progress(frame, supportStart - 6, 26)}
          style={{margin: align === 'left' ? '30px 0 0 -6px' : '30px auto 0'}}
        />
      ) : null}
      {support ? (
        <KineticText
          text={support}
          start={supportStart}
          stagger={3}
          duration={20}
          align={align}
          style={{...type.lead, fontSize: supportSize, color: colors.olive, marginTop: divider ? 24 : 30}}
        />
      ) : null}
    </div>
  );
};
