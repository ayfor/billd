import { prisma } from "@/lib/prisma";
import { budgetStatuses, type BudgetStatus } from "@/lib/queries/budgetStatus";

export type RecentExpense = {
  id: string;
  dateISO: string;
  description: string;
  category: { id: string; name: string; color: string };
  amountCents: number;
};

export type DashboardSummary = {
  spentCents: number;
  expectedCents: number;
  budgets: BudgetStatus[];
  recent: RecentExpense[];
};

export async function dashboardSummary(userId: string, now: Date): Promise<DashboardSummary> {
  const mStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const mEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [spentAgg, allBudgets, statuses, recentRows] = await Promise.all([
    prisma.expense.aggregate({ where: { userId, date: { gte: mStart, lt: mEnd } }, _sum: { amountCents: true } }),
    prisma.budget.findMany({ where: { userId }, select: { amountCents: true, timespan: true } }),
    budgetStatuses(userId, now),
    prisma.expense.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 5,
      include: { category: { select: { id: true, name: true, color: true } } },
    }),
  ]);

  // Expected monthly spend = monthly budgets + yearly budgets / 12.
  const expectedCents = allBudgets.reduce(
    (sum, b) => sum + (b.timespan === "yearly" ? Math.round(b.amountCents / 12) : b.amountCents),
    0,
  );

  return {
    spentCents: spentAgg._sum.amountCents ?? 0,
    expectedCents,
    budgets: statuses,
    recent: recentRows.map((e) => ({
      id: e.id,
      dateISO: e.date.toISOString(),
      description: e.description,
      category: e.category,
      amountCents: e.amountCents,
    })),
  };
}
