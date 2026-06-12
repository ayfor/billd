import React from 'react';
import { IconButton } from './IconButton.jsx';

/**
 * Dialog — a centered modal in a notched pixel panel. Flat black backdrop
 * (no blur), quick stepped entrance, Esc / backdrop to close.
 */
export function Dialog({
  open = true,
  title,
  onClose,
  iconBase,
  width = 420,
  footer,
  children,
  className = '',
  ...rest
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-6)',
        animation: 'billd-fade 120ms steps(2) both',
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      <div
        className="px-raise"
        style={{ width, maxWidth: '100%', animation: 'billd-pop 140ms steps(2) both' }}
        role="dialog"
        aria-modal="true"
      >
        <div className={`px-panel ${className}`} style={{ '--notch': '6px' }} {...rest}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)',
            borderBottom: 'var(--border-px) solid var(--border-soft)',
          }}>
            {title && (
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-md)',
                color: 'var(--text-primary)', letterSpacing: 'var(--tracking-pixel)',
              }}>{title}</span>
            )}
            {onClose && <IconButton icon="close" label="Close" variant="ghost" onClick={onClose} iconBase={iconBase} />}
          </div>
          <div style={{ padding: 'var(--space-5)' }}>{children}</div>
          {footer && (
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)',
              padding: 'var(--space-4) var(--space-5)',
              borderTop: 'var(--border-px) solid var(--border-soft)',
            }}>{footer}</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes billd-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes billd-pop { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes billd-fade { from { opacity: 1 } to { opacity: 1 } }
          @keyframes billd-pop { from { opacity: 1; transform: none } to { opacity: 1; transform: none } }
        }
      `}</style>
    </div>
  );
}
