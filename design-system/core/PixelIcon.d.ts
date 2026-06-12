import * as React from 'react';

export interface PixelIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Icon name without extension, e.g. "nav_dashboard", "cat_groceries". */
  name?: string;
  /** Explicit path to an SVG; overrides name+base. */
  src?: string;
  /** Directory the named icons live in. Default "assets/icons/". */
  base?: string;
  /** Pixel size (width = height). Default 16. */
  size?: number;
  /** Tint color. Default "currentColor". */
  color?: string;
}

/**
 * A 16×16 pixel icon from the billd set, tinted via CSS mask.
 */
export function PixelIcon(props: PixelIconProps): JSX.Element;
