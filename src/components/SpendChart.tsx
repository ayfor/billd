"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts";
import { formatCents } from "@/lib/money";

export type ChartPoint = { day: number; actual: number | null; projected: number | null };

export function SpendChart({
  points,
  expectedCents,
  today,
  empty,
}: {
  points: ChartPoint[];
  expectedCents: number;
  today: number;
  empty?: boolean;
}) {
  if (empty) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm" style={{ color: "var(--text-muted)" }}>
        No spending yet this month.
      </div>
    );
  }
  // dollars for the axis; cents stay the source of truth
  const data = points.map((p) => ({ day: p.day, actual: p.actual === null ? null : p.actual / 100, projected: p.projected === null ? null : p.projected / 100 }));
  const expected = expectedCents / 100;
  const lavFaint = "color-mix(in srgb, #efe9f4 16%, transparent)";

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={lavFaint} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "rgba(239,233,244,0.45)", fontSize: 11 }} stroke={lavFaint} tickLine={false} />
          <YAxis tick={{ fill: "rgba(239,233,244,0.45)", fontSize: 11 }} stroke={lavFaint} tickLine={false} width={48} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            contentStyle={{ background: "#2d2d2d", border: "2px solid rgba(239,233,244,0.22)", borderRadius: 0, color: "#efe9f4" }}
            formatter={(v) => `$${Number(v).toFixed(2)}`}
            labelFormatter={(d) => `Day ${d}`}
          />
          {expectedCents > 0 && (
            <ReferenceLine y={expected} stroke="rgba(239,233,244,0.4)" strokeDasharray="6 4" label={{ value: `expected ${formatCents(expectedCents)}`, position: "insideTopLeft", fill: "rgba(239,233,244,0.5)", fontSize: 11 }} />
          )}
          <ReferenceLine x={today} stroke="rgba(239,233,244,0.3)" label={{ value: "today", position: "top", fill: "rgba(239,233,244,0.5)", fontSize: 11 }} />
          <Line type="stepAfter" dataKey="actual" stroke="#5863f8" strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
          <Line type="linear" dataKey="projected" stroke="#935fa7" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
