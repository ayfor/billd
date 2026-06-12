import React from 'react';

const CAD = new Intl.NumberFormat('en-CA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Money — renders a CAD amount with two decimals, tabular numerals,
 * right-aligned by default. Store value as integer cents under the hood.
 */
export function Money({
  cents,
  amount,
  tone = 'default',         // 'default' | 'positive' | 'attention' | 'muted'
  pixel = false,            // use the bitmap display face (for large numerals)
  size,                     // explicit font-size override
  showSign = false,         // prefix + / − for deltas
  align = 'right',
  style,
  className = '',
  ...rest
}) {
  const raw = cents != null ? cents / 100 : (amount ?? 0);
  const toneColor = {
    default: 'var(--text-primary)',
    positive: 'var(--positive)',
    attention: 'var(--attention)',
    muted: 'var(--text-muted)',
  }[tone];

  const sign = showSign ? (raw > 0 ? '+' : raw < 0 ? '−' : '') : '';
  const formatted = `${sign}$${CAD.format(Math.abs(raw))}`;

  return (
    <span
      className={`billd-money tnum ${className}`}
      style={{
        fontFamily: pixel ? 'var(--font-pixel)' : 'var(--font-sans)',
        fontVariantNumeric: 'tabular-nums lining-nums',
        fontFeatureSettings: '"tnum" 1, "lnum" 1',
        fontWeight: pixel ? 400 : 600,
        color: toneColor,
        textAlign: align,
        letterSpacing: pixel ? 'var(--tracking-pixel)' : '-0.01em',
        whiteSpace: 'nowrap',
        ...(size ? { fontSize: size } : null),
        ...style,
      }}
      {...rest}
    >
      {formatted}
    </span>
  );
}
