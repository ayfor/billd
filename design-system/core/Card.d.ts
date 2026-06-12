import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pixel-face eyebrow title shown in the header. */
  title?: string;
  /** Node rendered at the top-right of the header (e.g. a control). */
  action?: React.ReactNode;
  /** Hard block shadow. Default true. */
  raised?: boolean;
  /** Body padding (CSS length). */
  pad?: string;
  /** Corner-notch size in px. Default 6. */
  notch?: number;
  /** Extra style for the inner body. */
  bodyStyle?: React.CSSProperties;
}

/**
 * The notched pixel-panel surface, with optional block shadow + pixel title.
 * @startingPoint section="Core" subtitle="Notched pixel panel surface" viewport="360x200"
 */
export function Card(props: CardProps): JSX.Element;
