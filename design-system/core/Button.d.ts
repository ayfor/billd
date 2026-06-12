import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. primary = Sapphire fill, secondary = outlined, ghost = text. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Optional leading pixel-icon name. */
  icon?: string;
  /** Base path for the icon, forwarded to PixelIcon. */
  iconBase?: string;
}

/**
 * billd's action button — square corners, hard block shadow, tactile press.
 * @startingPoint section="Core" subtitle="Primary / secondary / ghost button" viewport="320x120"
 */
export function Button(props: ButtonProps): JSX.Element;
