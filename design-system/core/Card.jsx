import React from 'react';

/**
 * Card — the signature billd surface: a notched 2px pixel panel with an
 * optional hard block shadow and a pixel-face eyebrow title.
 */
export function Card({
  title,                   // pixel-face eyebrow (UPPERCASE rendering up to you)
  action,                  // node rendered top-right of the header
  raised = true,           // hard block shadow
  pad = 'var(--space-5)',
  notch = 6,
  children,
  className = '',
  style,
  bodyStyle,
  ...rest
}) {
  return (
    <div
      className={raised ? 'px-raise' : ''}
      style={{ display: 'block' }}
      {...rest}
    >
      <div
        className={`px-panel ${className}`}
        style={{ '--notch': `${notch}px`, ...style }}
      >
        {(title || action) && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 'var(--space-3)',
            padding: `var(--space-4) ${pad} 0`,
          }}>
            {title && (
              <span style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 'var(--pixel-md)',
                color: 'var(--text-primary)',
                letterSpacing: 'var(--tracking-pixel)',
              }}>{title}</span>
            )}
            {action}
          </div>
        )}
        <div style={{ padding: pad, ...bodyStyle }}>{children}</div>
      </div>
    </div>
  );
}
