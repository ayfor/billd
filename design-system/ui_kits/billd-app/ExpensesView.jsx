/* ExpensesView — filterable expenses table with a quick-add affordance.
   Uses the real sample data (3 June expenses) — no invented rows. */
const { Table, CategoryPill, Money, Input, Select, Button } = window.BilldDesignSystem_9669dd;

function ExpensesView({ data, onQuickAdd }) {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('All categories');

  const rows = data.recent.filter((r) => {
    const matchQ = !query || r.desc.toLowerCase().includes(query.toLowerCase());
    const matchC = cat === 'All categories' || r.cat === cat;
    return matchQ && matchC;
  });
  const total = rows.reduce((s, r) => s + r.cents, 0);

  return (
    <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div style={{ width: 280 }}>
          <Input label="Search" placeholder="Search descriptions…"
                 value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div style={{ width: 200 }}>
          <Select label="Category" value={cat} onChange={(e) => setCat(e.target.value)}
                  options={['All categories', 'Groceries', 'Dining out', 'Transit', 'Hobbies', 'Rent']} />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button variant="primary" icon="plus" onClick={onQuickAdd}>
            Add expense
            <kbd style={{
              marginLeft: 'var(--space-2)', fontSize: 11, opacity: 0.7,
              border: '1px solid rgba(var(--lavender-mist-rgb),0.4)', padding: '1px 5px', lineHeight: 1.4,
            }}>⌘K</kbd>
          </Button>
        </div>
      </div>

      {/* Table in a notched card */}
      <div className="px-raise">
        <div className="px-panel" style={{ '--notch': '6px', padding: 'var(--space-4) var(--space-5) var(--space-2)' }}>
          <Table
            columns={[
              { key: 'date', label: 'Date', width: 90 },
              { key: 'desc', label: 'Description' },
              { key: 'cat', label: 'Category', render: (v) => <CategoryPill category={v} /> },
              { key: 'cents', label: 'Amount', align: 'right', render: (v) => <Money cents={v} /> },
            ]}
            rows={rows}
            onRowClick={() => {}}
          />
          {/* total + count footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: 'var(--space-3) var(--space-3) var(--space-2)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              Showing {rows.length} of {data.recent.length} this month
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
                             letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)',
                             fontWeight: 600 }}>Total</span>
              <Money cents={total} style={{ fontSize: 17 }} />
            </div>
          </div>
        </div>
      </div>

      {rows.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 14, textAlign: 'center', padding: 'var(--space-6)' }}>
          No expenses match those filters.
        </p>
      )}
    </div>
  );
}

window.ExpensesView = ExpensesView;
