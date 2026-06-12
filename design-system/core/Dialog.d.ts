import * as React from 'react';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the dialog is shown. Default true. */
  open?: boolean;
  /** Pixel-face title in the header. */
  title?: string;
  /** Called on Esc, backdrop click, or close button. */
  onClose?: () => void;
  iconBase?: string;
  /** Panel width in px. Default 420. */
  width?: number;
  /** Footer node (typically action buttons). */
  footer?: React.ReactNode;
}

/**
 * A centered modal in a notched pixel panel; flat black backdrop, no blur.
 * @startingPoint section="Core" subtitle="Modal dialog in a pixel panel" viewport="520x360"
 */
export function Dialog(props: DialogProps): JSX.Element | null;
