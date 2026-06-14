import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { nextOccurrence, monthlyEquivalentCents } from "@/lib/recurrence";
import { RecurringClient, type ClientTemplate } from "@/components/RecurringClient";

export default async function RecurringPage() {
  const user = await requireUser();
  const [templates, categories] = await Promise.all([
    prisma.recurringTemplate.findMany({ where: { userId: user.id }, include: { category: { select: { id: true, name: true, color: true } } } }),
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const now = new Date();
  const rows: ClientTemplate[] = templates.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    amountCents: t.amountCents,
    frequency: t.frequency as "weekly" | "monthly" | "yearly",
    anchorDay: t.anchorDay,
    startDateISO: t.startDate.toISOString(),
    active: t.active,
    nextISO: nextOccurrence({ frequency: t.frequency, anchorDay: t.anchorDay, startDate: t.startDate }, now).toISOString(),
  }));

  const monthlyTotal = templates.filter((t) => t.active).reduce((s, t) => s + monthlyEquivalentCents(t), 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>RECURRING</h1>
      <RecurringClient templates={rows} categories={categories} monthlyTotalCents={monthlyTotal} />
    </div>
  );
}
