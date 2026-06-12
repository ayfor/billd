import React from 'react';

const TONE_FILL = {
  positive:   'var(--positive)',
  attention:  'var(--attention)',
  interactive:'var(--interactive)',
};

/**
 * ProgressBar — a pixelated, stepped budget bar. Renders discrete cells;
 * tone derives from over/under budget (calm Amethyst when over).
 */
export function ProgressBar({
  value = 0,
  max = 100,
  segments = 24,
  tone,                    // override; else auto positive/attention
  height = 'var(--pixel-bar-h)',
  className = '',
  style,
  ...rest
}) {
  const ratio = max > 0 ? value / max : 0;
  const over = ratio > 1;
  const resolvedTone = tone || (over ? 'attention' : 'positive');
  const fill = TONE_FILL[resolvedTone] || TONE_FILL.positive;
  const filled = Math.max(0, Math.min(segments, Math.round(ratio * segments)));

  return (
    <div
      className={`billd-progress ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      style={{
        display: 'flex', gap: '2px', height,
        background: 'var(--surface-sunk)',
        border: 'var(--border-px) solid var(--border-strong)',
        padding: '2px',
        ...style,
      }}
      {...rest}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            background: i < filled ? fill : 'rgba(var(--lavender-mist-rgb), 0.06)',
          }}
        />
      ))}
    </div>
  );
}
