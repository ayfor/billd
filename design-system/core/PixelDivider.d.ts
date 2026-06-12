import * as React from 'react';

export interface PixelDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Path to the divider SVG relative to the page. */
  src?: string;
  /** Band height in px. Default 16. */
  height?: number;
}

/** The ornamental cross-stitch divider band — one per view, the brand moment. */
export function PixelDivider(props: PixelDividerProps): JSX.Element;
