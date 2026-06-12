import React from 'react';
import { PixelIcon } from './PixelIcon.jsx';

/**
 * Button — billd's primary action control. Pixel-skinned: square corners,
 * hard block shadow, presses "into the board".
 */
export function Button({
  variant = 'primary',     // 'primary' | 'secondary' | 'ghost'
  size = 'md',             // 'sm' | 'md' | 'lg'
  icon,                    // icon name (left) — uses PixelIcon
  iconBase,                // base path for the icon, passed through
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'billd-btn',
    `billd-btn--${variant}`,
    size !== 'md' ? `billd-btn--${size}` : '',
    className,
  ].filter(Boolean).join(' ');

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <button className={cls} {...rest}>
      {icon && <PixelIcon name={icon} base={iconBase} size={iconSize} />}
      {children && <span>{children}</span>}
    </button>
  );
}
