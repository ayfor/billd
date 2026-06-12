import React from 'react';
import { PixelIcon } from './PixelIcon.jsx';

/**
 * IconButton — a square pixel button holding a single icon (toolbars, close).
 */
export function IconButton({
  icon,
  iconBase,
  variant = 'default',     // 'default' | 'ghost'
  size = 16,
  label,
  className = '',
  ...rest
}) {
  const cls = [
    'billd-iconbtn',
    variant === 'ghost' ? 'billd-iconbtn--ghost' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} aria-label={label || icon} {...rest}>
      <PixelIcon name={icon} base={iconBase} size={size} />
    </button>
  );
}
