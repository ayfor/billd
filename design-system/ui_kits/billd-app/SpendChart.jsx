/* SpendChart — flat cumulative-spend chart. Sapphire actual series,
   Amethyst dashed projection, Lavender low-opacity gridlines. No gradients. */
const { Money } = window.BilldDesignSystem_9669dd;

function SpendChart({ data, expectedCents, daysInMonth, today }) {
  const W = 600, H = 210, padL = 6, padR = 6, padT = 12, padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxY = expectedCents;

  const xOf = (day) => padL + ((day - 1) / (daysInMonth - 1)) * plotW;
  const yOf = (c) => padT + (1 - c / maxY) * plotH;

  const pts = data.map((d) => `${xOf(d.day)},${yOf(d.cents)}`).join(' ');
  const last = data[data.length - 1];
  const areaPts = `${xOf(data[0].day)},${yOf(0)} ${pts} ${xOf(last.day)},${yOf(0)}`;

  // projection: linear pace to expected by end of month
  const projX1 = xOf(1), projY1 = yOf(expectedCents / daysInMonth);
  const projX2 = xOf(daysInMonth), projY2 = yOf(expectedCents);

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
           style={{ width: '100%', height: 210, display: 'block' }}>
        {/* gridlines */}
        {gridVals.map((v, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={yOf(v)} y2={yOf(v)}
                stroke="var(--border-faint)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {/* today marker */}
        <line x1={xOf(today)} x2={xOf(today)} y1={padT} y2={H - padB}
              stroke="rgba(var(--lavender-mist-rgb),0.18)" strokeWidth="1"
              strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        {/* actual area + line (Sapphire) */}
        <polygon points={areaPts} fill="rgba(var(--electric-sapphire-rgb),0.16)" />
        <polyline points={pts} fill="none" stroke="var(--interactive)" strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke" strokeLinejoin="miter" />
        {/* projection (Amethyst dashed) */}
        <line x1={projX1} y1={projY1} x2={projX2} y2={projY2}
              stroke="var(--attention)" strokeWidth="2" strokeDasharray="5 4"
              vectorEffect="non-scaling-stroke" />
        {/* data points as little squares (pixel feel) */}
        {data.map((d, i) => (
          <rect key={i} x={xOf(d.day) - 2.5} y={yOf(d.cents) - 2.5} width="5" height="5"
                fill="var(--interactive)" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {/* x axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4,
                    fontSize: 11, color: 'var(--text-faint)' }}>
        <span>Jun 1</span><span>Jun 15</span><span>Jun 30</span>
      </div>
      {/* legend */}
      <div style={{ display: 'flex', gap: 'var(--space-5)', marginTop: 'var(--space-3)', fontSize: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
          <span style={{ width: 14, height: 3, background: 'var(--interactive)', display: 'inline-block' }}></span>
          Actual spend
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
          <span style={{ width: 14, height: 3, background: 'var(--attention)', display: 'inline-block' }}></span>
          Expected pace
        </span>
      </div>
    </div>
  );
}

window.SpendChart = SpendChart;
