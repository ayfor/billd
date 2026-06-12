import * as React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (e.g. spent, in cents or dollars — units must match max). */
  value: number;
  /** Budget / target. */
  max: number;
  /** Number of discrete pixel cells. Default 24. */
  segments?: number;
  /** Override tone; otherwise auto: positive under budget, attention over. */
  tone?: 'positive' | 'attention' | 'interactive';
  /** Bar height (CSS length). */
  height?: string;
}

/**
 * A pixelated stepped budget bar — Seaweed under budget, calm Amethyst over.
 * @startingPoint section="Data" subtitle="Pixelated budget progress bar" viewport="360x80"
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
