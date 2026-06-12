/* App — wires the billd kit: view switching, Cmd+K quick-add, save toast. */
const { Sidebar, Topbar, DashboardView, ExpensesView, QuickAddModal } = window;
const { Money } = window.BilldDesignSystem_9669dd;

function App() {
  const data = window.BILLD_DATA;
  const [view, setView] = React.useState('dashboard');
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setQuickOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onSave = (entry) => {
    setToast(entry);
    setTimeout(() => setToast(null), 2600);
  };

  const titles = { dashboard: 'Dashboard', expenses: 'Expenses', budgets: 'Budgets', projections: 'Projections' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar active={view} onNavigate={setView} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={titles[view] || 'billd'} onQuickAdd={() => setQuickOpen(true)} />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {view === 'dashboard' && <DashboardView data={data} />}
          {view === 'expenses' && <ExpensesView data={data} onQuickAdd={() => setQuickOpen(true)} />}
          {(view === 'budgets' || view === 'projections') && (
            <div style={{ padding: 'var(--space-12)', color: 'var(--text-faint)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-pixel)', fontSize: 'var(--pixel-md)', color: 'var(--text-muted)' }}>
                {titles[view]}
              </p>
              <p>This surface isn't part of the kit demo — see Dashboard and Expenses.</p>
            </div>
          )}
        </div>
      </main>

      <QuickAddModal open={quickOpen} onClose={() => setQuickOpen(false)} onSave={onSave} />

      {toast && (
        <div className="px-raise" style={{
          position: 'fixed', bottom: 'var(--space-8)', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1100, animation: 'billd-toast 160ms steps(2) both',
        }}>
          <div className="px-panel" style={{
            '--notch': '6px', display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-5)', borderColor: 'rgba(var(--seaweed-rgb),0.5)',
          }}>
            <span style={{ color: 'var(--positive)', fontFamily: 'var(--font-pixel)', fontSize: 14 }}>✓</span>
            <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>
              Expense added{toast.desc ? ` — ${toast.desc}` : ''}
            </span>
            {toast.amount && <Money amount={parseFloat(toast.amount) || 0} tone="positive" align="left" />}
          </div>
        </div>
      )}

      <style>{`
        @keyframes billd-toast { from { opacity: 0; transform: translate(-50%, 8px) } to { opacity: 1; transform: translate(-50%, 0) } }
        @media (prefers-reduced-motion: reduce) { @keyframes billd-toast { from { opacity: 1 } to { opacity: 1 } } }
      `}</style>
    </div>
  );
}

window.BilldApp = App;
