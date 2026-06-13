import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { ExpensesClient, type ClientRow } from "@/components/ExpensesClient";
import { ExpensesEmptyState } from "@/components/ExpensesEmptyState";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireUser();
  const { page: pageParam } = await searchParams;

  const [total, categories] = await Promise.all([
    prisma.expense.count({ where: { userId: user.id } }),
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  const pg = paginate(total, Number(pageParam ?? "1"));

  const [expenses, agg] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: pg.skip,
      take: pg.take,
      include: { category: { select: { id: true, name: true, color: true } } },
    }),
    prisma.expense.aggregate({ where: { userId: user.id }, _sum: { amountCents: true } }),
  ]);

  const rows: ClientRow[] = expenses.map((e) => ({
    id: e.id,
    dateISO: e.date.toISOString(),
    description: e.description,
    category: e.category,
    amountCents: e.amountCents,
  }));

  return (
    <div className="flex flex-col gap-6">
      <ExpensesClient total={total} totalCents={agg._sum.amountCents ?? 0} rows={rows} categories={categories} />

      {total === 0 ? (
        <ExpensesEmptyState />
      ) : (
        <footer className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{pg.label}</span>
          <span className="flex gap-2">
            <a aria-disabled={pg.page <= 1} href={`/expenses?page=${pg.page - 1}`} className="px-3 py-1.5" style={{ border: "2px solid var(--electric-sapphire)", color: "var(--electric-sapphire)", pointerEvents: pg.page <= 1 ? "none" : "auto", opacity: pg.page <= 1 ? 0.4 : 1 }}>◀ Prev</a>
            <a aria-disabled={pg.page >= pg.pageCount} href={`/expenses?page=${pg.page + 1}`} className="px-3 py-1.5" style={{ border: "2px solid var(--electric-sapphire)", color: "var(--electric-sapphire)", pointerEvents: pg.page >= pg.pageCount ? "none" : "auto", opacity: pg.page >= pg.pageCount ? 0.4 : 1 }}>Next ▶</a>
          </span>
        </footer>
      )}
    </div>
  );
}
