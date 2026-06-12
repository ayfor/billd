import React from 'react';

/**
 * Table — a thin wrapper for billd's data tables. Renders a column-config +
 * row data with proper alignment (money columns right-aligned, tabular).
 * Pass `renderCell` per column for custom content (pills, money components).
 */
export function Table({
  columns = [],            // [{ key, label, align, width, render }]
  rows = [],               // array of row objects
  rowKey = (r, i) => i,
  onRowClick,
  className = '',
  style,
  ...rest
}) {
  return (
    <table
      className={`billd-table ${className}`}
      style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
        ...style,
      }}
      {...rest}
    >
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: c.align || 'left',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)',
                fontWeight: 'var(--weight-semibold)',
                borderBottom: 'var(--border-px) solid var(--border-strong)',
                width: c.width,
              }}
            >{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={rowKey(r, i)}
            className="billd-row"
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            onClick={onRowClick ? () => onRowClick(r, i) : undefined}
          >
            {columns.map((c) => (
              <td
                key={c.key}
                className={c.align === 'right' ? 'tnum' : ''}
                style={{
                  textAlign: c.align || 'left',
                  padding: 'var(--space-3)',
                  color: 'var(--text-body)',
                  borderBottom: 'var(--border-thin) solid var(--border-soft)',
                  fontVariantNumeric: c.align === 'right' ? 'tabular-nums lining-nums' : undefined,
                }}
              >
                {c.render ? c.render(r[c.key], r, i) : r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
