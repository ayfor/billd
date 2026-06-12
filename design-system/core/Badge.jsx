import React from 'react';

const TONES = {
  neutral:   { fg: 'var(--text-muted)',  bg: 'rgba(var(--lavender-mist-rgb), 0.08)', bd: 'var(--border-strong)' },
  positive:  { fg: 'var(--positive)',    bg: 'var(--positive-tint)',  bd: 'rgba(var(--seaweed-rgb), 0.5)' },
  attention: { fg: 'var(--attention)',   bg: 'var(--attention-tint)', bd: 'rgba(var(--amethyst-rgb), 0.55)' },
  interactive:{ fg: 'var(--interactive)',bg: 'var(--interactive-tint)',bd: 'rgba(var(--electric-sapphire-rgb), 0.55)' },
};

/**
 * Badge — a small square-cornered status chip. No rounding (pixel skin).
 */
export function Badge({
  tone = 'neutral',        // 'neutral' | 'positive' | 'attention' | 'interactive'
  children,
  className = '',
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      className={`billd-badge ${className}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--weight-semibold)',
        textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)',
        color: t.fg, background: t.bg,
        border: `var(--border-thin) solid ${t.bd}`,
        padding: '2px var(--space-2)', lineHeight: 1.4, whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
