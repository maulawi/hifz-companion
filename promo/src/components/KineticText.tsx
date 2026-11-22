import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease} from '../styles/brand';
import {progress} from '../lib/motion';

type Props = {
  /** Use "\n" for explicit line breaks. */
  text: string;
  /** Local frame at which the first word starts. */
  start: number;
  /** Frames between words. */
  stagger?: number;
  /** Frames each word takes to settle. */
  duration?: number;
  /** Optional exit: all words fade/lift away together. */
  exitStart?: number;
  exitDuration?: number;
  style?: React.CSSProperties;
  /** Per-word style overrides, keyed by the word as written (punctuation included). */
  wordStyles?: Record<string, React.CSSProperties>;
  /** Replace a word's rendered content (e.g. a count-up number). */
  renderWord?: (word: string, wordProgress: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
};

/**
 * Editorial kinetic type: each word rises out of its own mask with a slight
 * focus pull, staggered across the line. Calm by default — no bounce.
 */
export const KineticText: React.FC<Props> = ({
  text,
  start,
  stagger = 4,
  duration = 22,
  exitStart,
  exitDuration = 12,
  style,
  wordStyles = {},
  renderWord,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const exit = exitStart === undefined ? 0 : progress(frame, exitStart, exitDuration, ease.in);
  let index = 0;
  const lines = text.split('\n');

  return (
    <div
      style={{
        textAlign: align,
        opacity: 1 - exit,
        transform: `translateY(${-exit * 24}px)`,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'block', whiteSpace: 'nowrap'}}>
          {line.split(' ').map((word, wi) => {
            const i = index++;
            const p = progress(frame, start + i * stagger, duration, ease.out);
            const y = interpolate(p, [0, 1], [105, 0]);
            const blur = (1 - p) * 6;
            return (
              <React.Fragment key={wi}>
                <span
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    verticalAlign: 'top',
                    paddingBottom: '0.18em',
                    marginBottom: '-0.18em',
                    paddingRight: '0.04em',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transform: `translateY(${y}%)`,
                      opacity: Math.min(1, p * 1.6),
                      filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                      ...wordStyles[word],
                    }}
                  >
                    {renderWord ? renderWord(word, p) : word}
                  </span>
                </span>
                {wi < line.split(' ').length - 1 ? ' ' : null}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
