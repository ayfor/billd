import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { categoryUsage } from "@/lib/queries/categoryUsage";
import { CategoriesClient } from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const user = await requireUser();
  const [categories, usage] = await Promise.all([
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { name: "asc" }, select: { id: true, name: true, color: true } }),
    categoryUsage(user.id),
  ]);

  const withUsage = categories.map((c) => ({
    ...c,
    expenseCount: usage[c.id]?.expenseCount ?? 0,
    monthCents: usage[c.id]?.monthCents ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>CATEGORIES</h1>
      <CategoriesClient categories={withUsage} />
    </div>
  );
}
