import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BudgetsClient, type ClientBudget } from "@/components/BudgetsClient";

export default async function BudgetsPage() {
  const user = await requireUser();
  const [budgets, categories] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: user.id },
      include: { category: { select: { id: true, name: true, color: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const rows: ClientBudget[] = budgets.map((b) => ({
    id: b.id,
    categoryId: b.categoryId,
    category: b.category,
    amountCents: b.amountCents,
    timespan: b.timespan as "monthly" | "yearly",
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>BUDGETS</h1>
      <BudgetsClient budgets={rows} categories={categories} />
    </div>
  );
}
