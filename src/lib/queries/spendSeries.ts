import { prisma } from "@/lib/prisma";

export type CumulativePoint = { day: number; cents: number };

function daysInMonth(now: Date) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
}

// Pure linear-pace projection of month-end spend. Shared with S5.3's panel.
export function projectMonthEnd(spentCents: number, now: Date): number {
  const elapsed = now.getUTCDate();
  if (elapsed <= 0) return spentCents;
  return Math.round((spentCents / elapsed) * daysInMonth(now));
}

// Running cumulative spend by day for the current month, days 1..today.
export async function dailyCumulative(userId: string, now: Date): Promise<CumulativePoint[]> {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const rows = await prisma.expense.findMany({
    where: { userId, date: { gte: start, lt: end } },
    select: { date: true, amountCents: true },
  });

  const byDay = new Map<number, number>();
  for (const r of rows) {
    const d = r.date.getUTCDate();
    byDay.set(d, (byDay.get(d) ?? 0) + r.amountCents);
  }

  const today = now.getUTCDate();
  const out: CumulativePoint[] = [];
  let running = 0;
  for (let day = 1; day <= today; day++) {
    running += byDay.get(day) ?? 0;
    out.push({ day, cents: running });
  }
  return out;
}

export function daysInCurrentMonth(now: Date) {
  return daysInMonth(now);
}
