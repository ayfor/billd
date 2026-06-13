import { prisma } from "@/lib/prisma";

export type CategoryUsage = { expenseCount: number; monthCents: number };

// Per-category usage: all-time expense count + current calendar-month spend.
// Month bounds are UTC-aligned, consistent with expenseQuery / budget math.
export async function categoryUsage(userId: string): Promise<Record<string, CategoryUsage>> {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [counts, monthSums] = await Promise.all([
    prisma.expense.groupBy({ by: ["categoryId"], where: { userId }, _count: { _all: true } }),
    prisma.expense.groupBy({ by: ["categoryId"], where: { userId, date: { gte: start, lt: end } }, _sum: { amountCents: true } }),
  ]);

  const out: Record<string, CategoryUsage> = {};
  for (const c of counts) out[c.categoryId] = { expenseCount: c._count._all, monthCents: 0 };
  for (const m of monthSums) {
    out[m.categoryId] = { expenseCount: out[m.categoryId]?.expenseCount ?? 0, monthCents: m._sum.amountCents ?? 0 };
  }
  return out;
}

// Count of records that block deleting a category. Expenses now; budgets &
// recurring templates are added to this sum when those models land (F4/F6).
export async function categoryReferenceCount(userId: string, categoryId: string): Promise<number> {
  const [expenses, budgets] = await Promise.all([
    prisma.expense.count({ where: { userId, categoryId } }),
    prisma.budget.count({ where: { userId, categoryId } }),
  ]);
  return expenses + budgets;
}
