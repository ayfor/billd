/* DashboardView — June overview: spent vs projection hero, category budgets,
   spending-over-time chart, recent expenses. */
const { Card, Money, ProgressBar, Badge, CategoryPill, PixelDivider } = window.BilldDesignSystem_9669dd;

function Eyebrow({ children }) {
  return <div style={{
    fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
    letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)',
    fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)',
  }}>{children}</div>;
}

function CategoryRow({ c }) {
  const remaining = c.budget - c.spent;
  const over = c.spent > c.budget;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2)',
                  paddingBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <CategoryPill category={c.name} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
          <Money cents={c.spent} tone={over ? 'attention' : 'default'} />
          <span style={{ color: 'var(--text-faint)', fontSize: 13 }}>/ </span>
          <Money cents={c.budget} tone="muted" />
        </div>
      </div>
      <ProgressBar value={c.spent} max={c.budget} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {c.upcoming ? (
          <Badge tone="interactive">Upcoming · Jun 30</Badge>
        ) : over ? (
          <Badge tone="attention">${((c.spent - c.budget) / 100).toFixed(2)} over</Badge>
        ) : (
          <Badge tone="positive">${(remaining / 100).toFixed(2)} left</Badge>
        )}
      </div>
    </div>
  );
}

function DashboardView({ data }) {
  const leftToSpend = data.expectedCents - data.spentCents;            // 557.43
  const upcoming = data.categories.filter(c => c.upcoming).reduce((s, c) => s + c.budget, 0);
  const projected = data.spentCents + upcoming;                        // 2,792.57
  const projOver = projected - data.expectedCents;

  return (
    <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* Hero + projection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-6)' }}>
        <Card>
          <Eyebrow>Spent in June</Eyebrow>
          <Money cents={data.spentCents} pixel size="var(--pixel-2xl)" align="left" />
          <div style={{ marginTop: 'var(--space-3)', color: 'var(--text-muted)', fontSize: 15 }}>
            of <Money cents={data.expectedCents} tone="muted" align="left" style={{ fontSize: 15 }} /> expected
          </div>
          <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)',
                        borderTop: 'var(--border-thin) solid var(--border-soft)',
                        display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <Eyebrow>Left to spend</Eyebrow>
            <Money cents={leftToSpend} tone="positive" align="left" style={{ marginLeft: 'auto', fontSize: 20 }} />
          </div>
        </Card>

        <Card>
          <Eyebrow>Projected by Jun 30</Eyebrow>
          <Money cents={projected} pixel size="var(--pixel-xl)" tone="attention" align="left" />
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Badge tone="attention">${(projOver / 100).toFixed(2)} over expected</Badge>
          </div>
          <p style={{ marginTop: 'var(--space-4)', marginBottom: 0, color: 'var(--text-body)',
                      fontSize: 13, lineHeight: 1.5 }}>
            Includes <Money cents={upcoming} tone="muted" align="left" style={{ fontSize: 13 }} /> rent
            posting on the 1st. Dining out is running ahead.
          </p>
        </Card>
      </div>

      {/* Brand moment — the one ornamental divider for this view */}
      <PixelDivider src={(window.__resources && window.__resources.pixelDivider) || "../../assets/pixel-divider.svg"} />

      {/* Chart */}
      <Card title="SPENDING OVER TIME">
        <SpendChart data={data.cumulative} expectedCents={data.expectedCents}
                    daysInMonth={data.daysInMonth} today={data.today} />
      </Card>

      {/* Budgets + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        <Card title="BUDGETS">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.categories.map((c, i) => <CategoryRow key={i} c={c} />)}
          </div>
        </Card>

        <Card title="RECENT">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.recent.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-1) var(--space-3)',
                alignItems: 'center', padding: 'var(--space-3) 0',
                borderBottom: i < data.recent.length - 1 ? 'var(--border-thin) solid var(--border-soft)' : 'none',
              }}>
                <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{r.desc}</span>
                <Money cents={r.cents} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CategoryPill category={r.cat} />
                  <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.DashboardView = DashboardView;
