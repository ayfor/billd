import * as React from 'react';

export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Pixel-icon name for the row. */
  icon?: string;
  iconBase?: string;
  label?: string;
  /** Active = Sapphire tint well + sapphire border. */
  active?: boolean;
  /** Element/tag to render. Default 'a'. */
  as?: any;
  href?: string;
}

/** A sidebar nav row — pixel icon + label, with a Sapphire active state. */
export function NavItem(props: NavItemProps): JSX.Element;
