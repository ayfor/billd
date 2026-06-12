import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pixel-icon name to render. */
  icon: string;
  iconBase?: string;
  variant?: 'default' | 'ghost';
  /** Icon pixel size. Default 16. */
  size?: number;
  /** Accessible label (defaults to icon name). */
  label?: string;
}

/** A square pixel button holding one icon — toolbars, close affordances. */
export function IconButton(props: IconButtonProps): JSX.Element;
