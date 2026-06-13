import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { dashboardSummary } from "@/lib/queries/dashboard";
import { dailyCumulative, projectMonthEnd, daysInCurrentMonth } from "@/lib/queries/spendSeries";
import { SpendChart, type ChartPoint } from "@/components/SpendChart";
import { formatCents } from "@/lib/money";
import { BudgetBar } from "@/components/BudgetBar";
import { CategoryPill } from "@/components/CategoryPill";
import { RecentExpenses } from "@/components/RecentExpenses";

export default async function DashboardPage() {
  const user = await requireUser();
  const [summary, categories] = await Promise.all([
    dashboardSummary(user.id, new Date()),
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const { spentCents, expectedCents, budgets, recent } = summary;
  const now = new Date();
  const cumulative = await dailyCumulative(user.id, now);
  const today = now.getUTCDate();
  const dim = daysInCurrentMonth(now);
  const projectedEnd = projectMonthEnd(spentCents, now);
  const chartPoints: ChartPoint[] = [];
  for (let day = 1; day <= dim; day++) {
    const actualPt = cumulative.find((c) => c.day === day);
    chartPoints.push({
      day,
      actual: day <= today ? (actualPt ? actualPt.cents : 0) : null,
      projected: day === today ? spentCents : day > today ? Math.round(spentCents + ((projectedEnd - spentCents) * (day - today)) / (dim - today || 1)) : null,
    });
  }
  const month = new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric", timeZone: "UTC" });
  const ratio = expectedCents > 0 ? spentCents / expectedCents : 0;
  const topBudgets = budgets.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>DASHBOARD</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{month}</p>
        </div>
      </header>

      <div className="px-panel px-raise flex flex-col gap-3 p-6">
        <span className="text-xs font-bold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>TOTAL SPENT — {month.toUpperCase()}</span>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-2xl)", color: "var(--text-primary)", lineHeight: 1 }} className="tnum">{formatCents(spentCents)}</span>
        {expectedCents > 0 ? (
          <>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>of {formatCents(expectedCents)} expected</span>
            <BudgetBar ratio={ratio} over={spentCents > expectedCents} />
          </>
        ) : (
          <Link href="/budgets" className="text-sm" style={{ color: "var(--electric-sapphire)" }}>Set budgets to unlock projections →</Link>
        )}
      </div>

      {topBudgets.length > 0 && (
        <div className="px-panel px-raise flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>BUDGETS</span>
            {budgets.length > 4 && <Link href="/budgets" className="text-xs" style={{ color: "var(--electric-sapphire)" }}>View all</Link>}
          </div>
          {topBudgets.map((b) => (
            <div key={b.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <CategoryPill name={b.category.name} color={b.category.color} />
                <span className="tnum text-sm" style={{ color: "var(--text-primary)" }}>{formatCents(b.spentCents)} / {formatCents(b.budgetCents)}</span>
              </div>
              <BudgetBar ratio={b.ratio} over={b.over} />
            </div>
          ))}
        </div>
      )}

      <div className="px-panel px-raise flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>SPEND VS PROJECTION</span>
          <Link href="/expenses" className="text-xs" style={{ color: "var(--electric-sapphire)" }}>View expenses</Link>
        </div>
        <SpendChart points={chartPoints} expectedCents={expectedCents} today={today} empty={spentCents === 0} />
      </div>

      <RecentExpenses recent={recent} categories={categories} />
    </div>
  );
}
