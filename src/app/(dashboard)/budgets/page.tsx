import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { budgetStatuses } from "@/lib/queries/budgetStatus";
import { BudgetsClient } from "@/components/BudgetsClient";

export default async function BudgetsPage() {
  const user = await requireUser();
  const [statuses, categories] = await Promise.all([
    budgetStatuses(user.id, new Date()),
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const totalSpent = statuses.reduce((s, b) => s + b.spentCents, 0);
  const totalBudget = statuses.reduce((s, b) => s + b.budgetCents, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>BUDGETS</h1>
      <BudgetsClient statuses={statuses} categories={categories} totalSpent={totalSpent} totalBudget={totalBudget} />
    </div>
  );
}
