import * as React from 'react';

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Integer cents — the preferred input (avoids float drift). */
  cents?: number;
  /** Decimal dollars, used only if `cents` is absent. */
  amount?: number;
  /** Semantic tone. Positive = Seaweed, attention = Amethyst. */
  tone?: 'default' | 'positive' | 'attention' | 'muted';
  /** Render in the bitmap display face — for large hero numerals only. */
  pixel?: boolean;
  /** Explicit font-size (e.g. "var(--pixel-2xl)" or 56). */
  size?: number | string;
  /** Prefix +/− for deltas. */
  showSign?: boolean;
  /** Text alignment. Default 'right'. */
  align?: 'left' | 'right' | 'center';
}

/**
 * CAD money, two decimals, tabular lining numerals, right-aligned.
 * @startingPoint section="Data" subtitle="Tabular CAD amount" viewport="240x80"
 */
export function Money(props: MoneyProps): JSX.Element;
