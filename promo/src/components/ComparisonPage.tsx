import React from 'react';
import {Img} from 'remotion';
import {comparisonPage, Rect, tableAspect, TableSpec} from '../data/mutashabihatPage';
import {alpha, colors} from '../styles/brand';

export type RowHighlight = {
  row: number;
  /** 0→1 gold frame draw-on. */
  draw: number;
};

type Props = {
  width: number;
  /** Which supplied table to show (defaults to the first comparison page). */
  table?: TableSpec;
  /** Row currently in focus (others are softly dimmed by an overlay). */
  focusRow?: number | null;
  /** 0→1 strength of the focus dimming. */
  focus?: number;
  highlights?: RowHighlight[];
  /** 0→1: feather the parchment margins so the page blends into a book page. */
  feather?: number;
  style?: React.CSSProperties;
};

const pad = (r: Rect, px: number, py = px): Rect => ({x: r.x - px, y: r.y - py, w: r.w + 2 * px, h: r.h + 2 * py});

/**
 * Displays the supplied comparison page exactly as provided (scaled uniformly,
 * cropped to the table window). All emphasis lives in an SVG layer above the
 * image using the page's own pixel coordinates — the image itself is never
 * edited, recoloured or re-typeset.
 */
export const ComparisonPage: React.FC<Props> = ({width, table = comparisonPage, focusRow = null, focus = 0, highlights = [], feather = 0, style}) => {
  const {crop, natural, rows, src} = table;
  const k = width / crop.w;
  const height = width / tableAspect(table);
  const fx = 3.5 * feather;
  const fy = 4 * feather;
  const featherMask = feather > 0.001
    ? {
        WebkitMaskImage: `linear-gradient(to right, transparent 0%, #000 ${fx}%, #000 ${100 - fx}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fy}%, #000 ${100 - fy}%, transparent 100%)`,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }
    : {};

  return (
    <div style={{position: 'relative', width, height, overflow: 'hidden', ...featherMask, ...style}}>
      <Img
        src={src}
        style={{
          position: 'absolute',
          left: -crop.x * k,
          top: -crop.y * k,
          width: natural.width * k,
          height: natural.height * k,
          maxWidth: 'none',
        }}
      />
      <svg
        viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
        width={width}
        height={height}
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        {/* Focus: soften the rows that are not being discussed */}
        {focus > 0
          ? rows.map((row, i) =>
              i === focusRow ? null : (
                <rect
                  key={`dim-${i}`}
                  x={row.band.x + 1}
                  y={row.band.y + 1}
                  width={row.band.w - 2}
                  height={row.band.h - 2}
                  fill={alpha('#EFE3CB', 0.62 * focus)}
                />
              ),
            )
          : null}
        {highlights.map(({row, draw}) => {
          if (draw <= 0) return null;
          const data = rows[row];
          const sx = Math.max(2, 4 * (crop.w / 970)); // paddings scale with the source resolution
          const targets = [...(data.kalimatCell ? [pad(data.kalimatCell, -7)] : []), ...data.phrases.map((p) => pad(p, sx, 8 * (crop.w / 970) + 1.5))];
          return targets.map((t, j) => {
            const local = Math.min(1, Math.max(0, draw * 1.25 - j * 0.12));
            return (
              <g key={`hl-${row}-${j}`} opacity={Math.min(1, local * 3)}>
                {/* soft glow */}
                <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={8 * (crop.w / 970) + 2} fill="none" stroke={alpha(colors.gold, 0.28 * local)} strokeWidth={9} vectorEffect="non-scaling-stroke" />
                {/* hairline frame that draws on */}
                <rect
                  x={t.x}
                  y={t.y}
                  width={t.w}
                  height={t.h}
                  rx={8 * (crop.w / 970) + 2}
                  fill="none"
                  stroke={colors.goldDeep}
                  strokeWidth={2.4}
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - local}
                />
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
};

export const comparisonPageHeight = (width: number, table: TableSpec = comparisonPage) => width / tableAspect(table);
