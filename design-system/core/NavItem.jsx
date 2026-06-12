import React from 'react';
import { PixelIcon } from './PixelIcon.jsx';

/**
 * NavItem — a sidebar navigation row: pixel icon + label + active state.
 */
export function NavItem({
  icon,
  iconBase,
  label,
  active = false,
  as = 'a',
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  return (
    <Tag
      className={`billd-navitem ${active ? 'billd-navitem--active' : ''} ${className}`}
      aria-current={active ? 'true' : undefined}
      {...rest}
    >
      {icon && (
        <PixelIcon
          name={icon}
          base={iconBase}
          size={16}
          color={active ? 'var(--interactive-fg)' : 'var(--text-muted)'}
        />
      )}
      <span>{label || children}</span>
    </Tag>
  );
}
