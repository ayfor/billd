/* Sidebar — billd app left nav. Uses NavItem from the bundle. */
const { NavItem } = window.BilldDesignSystem_9669dd;

function Sidebar({ active, onNavigate }) {
  const items = [
    { id: 'dashboard',   icon: 'nav_dashboard',   label: 'Dashboard' },
    { id: 'expenses',    icon: 'nav_expenses',    label: 'Expenses' },
    { id: 'budgets',     icon: 'nav_budgets',     label: 'Budgets' },
    { id: 'projections', icon: 'nav_projections', label: 'Projections' },
  ];
  return (
    <aside style={{
      width: 'var(--sidebar-w)', flex: '0 0 auto', minHeight: '100%',
      borderRight: 'var(--border-px) solid var(--border-strong)',
      background: 'var(--surface-sunk)',
      display: 'flex', flexDirection: 'column',
      padding: 'var(--space-5) var(--space-4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '0 var(--space-2) var(--space-6)' }}>
        <img src={(window.__resources && window.__resources.logoMark) || "../../assets/logo-mark.svg"} width="28" height="28" style={{ imageRendering: 'pixelated' }} alt="billd" />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '20px', color: 'var(--text-primary)', letterSpacing: 'var(--tracking-pixel)' }}>
          bill<span style={{ color: 'var(--interactive)' }}>d</span>
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {items.map((it) => (
          <NavItem
            key={it.id}
            icon={it.icon}
            label={it.label}
            active={active === it.id}
            onClick={() => onNavigate && onNavigate(it.id)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <NavItem icon="settings" label="Settings" onClick={() => {}} style={{ cursor: 'pointer' }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-3) 0', marginTop: 'var(--space-2)',
          borderTop: 'var(--border-thin) solid var(--border-soft)',
        }}>
          <div style={{
            width: 28, height: 28, background: 'var(--attention-tint)',
            border: 'var(--border-thin) solid rgba(var(--amethyst-rgb),0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-pixel)', fontSize: 12, color: 'var(--attention)',
          }}>R</div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>Riel</div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Personal · CAD</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
