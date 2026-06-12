import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** positive = Seaweed, attention = Amethyst, interactive = Sapphire. */
  tone?: 'neutral' | 'positive' | 'attention' | 'interactive';
}

/** A small square status chip (no rounding). */
export function Badge(props: BadgeProps): JSX.Element;
