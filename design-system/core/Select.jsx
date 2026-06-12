import React from 'react';
import { PixelIcon } from './PixelIcon.jsx';

/**
 * Select — native select styled to match billd fields, with a pixel chevron.
 */
export function Select({
  label,
  options = [],            // [{value, label}] or string[]
  iconBase,
  className = '',
  id,
  children,
  ...rest
}) {
  const fieldId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const opts = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );
  const control = (
    <span style={{ position: 'relative', display: 'block' }}>
      <select id={fieldId} className={`billd-field billd-select ${className}`} {...rest}>
        {children || opts.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <PixelIcon
        name="chevron_down"
        base={iconBase}
        size={16}
        color="var(--text-muted)"
        style={{
          position: 'absolute', right: 'var(--space-3)', top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }}
      />
    </span>
  );
  return label ? (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} htmlFor={fieldId}>
      <span style={{
        fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)',
        fontWeight: 'var(--weight-semibold)',
      }}>{label}</span>
      {control}
    </label>
  ) : control;
}
