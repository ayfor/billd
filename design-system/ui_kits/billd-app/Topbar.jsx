/* Topbar — page title (pixel face) + month select + quick-add with ⌘K hint. */
const { Button, Select } = window.BilldDesignSystem_9669dd;

function Topbar({ title, onQuickAdd }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 'var(--space-4)', padding: 'var(--space-6) var(--space-8)',
      borderBottom: 'var(--border-px) solid var(--border-strong)',
    }}>
      <h1 style={{
        margin: 0, fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-lg)',
        color: 'var(--text-primary)', letterSpacing: 'var(--tracking-pixel)', fontWeight: 400,
      }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: 150 }}>
          <Select options={['June 2026', 'May 2026', 'April 2026']} defaultValue="June 2026" aria-label="Month" />
        </div>
        <Button variant="primary" icon="plus" onClick={onQuickAdd}>
          Add expense
          <kbd style={{
            marginLeft: 'var(--space-2)', display: 'inline-flex', alignItems: 'center', gap: 2,
            fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--interactive-fg)',
            opacity: 0.7, border: '1px solid rgba(var(--lavender-mist-rgb),0.4)',
            padding: '1px 5px', lineHeight: 1.4,
          }}>⌘K</kbd>
        </Button>
      </div>
    </header>
  );
}

window.Topbar = Topbar;
