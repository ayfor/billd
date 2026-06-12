import React from 'react';

/**
 * Input — modern, crisp text field (stays out of the pixel world).
 * Square corners, sunken well, sapphire focus border.
 */
export function Input({
  label,
  hint,
  size = 'md',             // 'md' | 'lg'
  prefix,                  // e.g. "$" for money entry
  className = '',
  id,
  style,
  ...rest
}) {
  const fieldId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const field = (
    <input
      id={fieldId}
      className={`billd-field ${size === 'lg' ? 'billd-field--lg' : ''} ${className}`}
      style={prefix ? { paddingLeft: '1.9em', ...style } : style}
      {...rest}
    />
  );
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} htmlFor={fieldId}>
      {label && (
        <span style={{
          fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)',
          fontWeight: 'var(--weight-semibold)',
        }}>{label}</span>
      )}
      {prefix ? (
        <span style={{ position: 'relative', display: 'block' }}>
          <span style={{
            position: 'absolute', left: 'var(--space-3)', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
            fontVariantNumeric: 'tabular-nums', pointerEvents: 'none',
          }}>{prefix}</span>
          {field}
        </span>
      ) : field}
      {hint && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{hint}</span>
      )}
    </label>
  );
}
