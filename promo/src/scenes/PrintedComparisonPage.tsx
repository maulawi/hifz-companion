import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PAGE_SURFACE} from '../components/BookMockup';
import {ComparisonPage, comparisonPageHeight} from '../components/ComparisonPage';
import {PRINTED_PAGE_WIDTH} from '../compositions/ebookShowcase.timeline';

/**
 * The supplied comparison page as printed on the book's first page.
 * `showTable=false` while the page is lifted off as a card (the card sits
 * exactly over this spot at the hand-off frame, so the swap is invisible).
 */
export const PrintedComparisonPage: React.FC<{showTable?: boolean}> = ({showTable = true}) => {
  const h = comparisonPageHeight(PRINTED_PAGE_WIDTH);
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 80% 70% at 52% 48%, #EEDEC0 0%, #E7D3B0 65%, #DCC69E 100%)',
      }}
    >
      {showTable ? (
        <div
          style={{
            position: 'absolute',
            left: (PAGE_SURFACE.width - PRINTED_PAGE_WIDTH) / 2,
            top: (PAGE_SURFACE.height - h) / 2,
          }}
        >
          <ComparisonPage width={PRINTED_PAGE_WIDTH} feather={1} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
