import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export type BudgetStatus = {
  id: string;
  categoryId: string;
  category: { id: string; name: string; color: string };
  timespan: "monthly" | "yearly";
  budgetCents: number;
  spentCents: number;
  ratio: number;        // raw (can exceed 1); the bar caps display at 1
  over: boolean;
  deltaCents: number;   // |budget - spent|
  statusLabel: string;  // "Under by $X" | "Over by $X"
  statusTone: "positive" | "attention";
};

// Pure derivation — unit-tested directly.
export function computeStatus(spentCents: number, budgetCents: number): {
  ratio: number; over: boolean; deltaCents: number; statusLabel: string; statusTone: "positive" | "attention";
} {
  const ratio = budgetCents > 0 ? spentCents / budgetCents : 0;
  const over = spentCents > budgetCents;
  const deltaCents = Math.abs(budgetCents - spentCents);
  return over
    ? { ratio, over, deltaCents, statusLabel: `Over by ${formatCents(deltaCents)}`, statusTone: "attention" }
    : { ratio, over, deltaCents, statusLabel: `Under by ${formatCents(deltaCents)}`, statusTone: "positive" };
}

function monthBounds(now: Date) {
  return [new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))] as const;
}
function yearBounds(now: Date) {
  return [new Date(Date.UTC(now.getUTCFullYear(), 0, 1)), new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1))] as const;
}

// Source of truth for budget-vs-actual. Consumed by /budgets and (S5.1) /dashboard.
export async function budgetStatuses(userId: string, now: Date): Promise<BudgetStatus[]> {
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: { select: { id: true, name: true, color: true } } },
  });
  if (budgets.length === 0) return [];

  const [mStart, mEnd] = monthBounds(now);
  const [yStart, yEnd] = yearBounds(now);

  const statuses = await Promise.all(
    budgets.map(async (b) => {
      const [start, end] = b.timespan === "yearly" ? [yStart, yEnd] : [mStart, mEnd];
      const agg = await prisma.expense.aggregate({
        where: { userId, categoryId: b.categoryId, date: { gte: start, lt: end } },
        _sum: { amountCents: true },
      });
      const spentCents = agg._sum.amountCents ?? 0;
      const c = computeStatus(spentCents, b.amountCents);
      return {
        id: b.id,
        categoryId: b.categoryId,
        category: b.category,
        timespan: b.timespan as "monthly" | "yearly",
        budgetCents: b.amountCents,
        spentCents,
        ...c,
      };
    }),
  );

  return statuses.sort((a, z) => z.ratio - a.ratio);
}
