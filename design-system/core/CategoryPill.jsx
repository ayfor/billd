import React from 'react';
import { PixelIcon } from './PixelIcon.jsx';

const CATEGORY_ICONS = {
  groceries: 'cat_groceries',
  'dining out': 'cat_dining',
  dining: 'cat_dining',
  transit: 'cat_transit',
  hobbies: 'cat_hobbies',
  rent: 'cat_rent',
};

/**
 * CategoryPill — a category label prefixed by its pixel glyph. Square corners
 * to honour the pixel skin; neutral by default (color stays on the money).
 */
export function CategoryPill({
  category,
  icon,                    // override the resolved icon
  iconBase,
  className = '',
  style,
  ...rest
}) {
  const resolved = icon || CATEGORY_ICONS[String(category).toLowerCase()] || 'nav_expenses';
  return (
    <span
      className={`billd-categorypill ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)', color: 'var(--text-body)',
        background: 'rgba(var(--lavender-mist-rgb), 0.06)',
        border: 'var(--border-thin) solid var(--border-soft)',
        padding: '3px var(--space-2)', whiteSpace: 'nowrap', lineHeight: 1.3,
        ...style,
      }}
      {...rest}
    >
      <PixelIcon name={resolved} base={iconBase} size={14} color="var(--text-muted)" />
      {category}
    </span>
  );
}
