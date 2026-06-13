import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { formatCents } from "@/lib/money";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpensesEmptyState } from "@/components/ExpensesEmptyState";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await requireUser();
  const { page: pageParam } = await searchParams;

  const total = await prisma.expense.count({ where: { userId: user.id } });
  const pg = paginate(total, Number(pageParam ?? "1"));

  const [rows, agg] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: pg.skip,
      take: pg.take,
      include: { category: { select: { name: true, color: true } } },
    }),
    prisma.expense.aggregate({ where: { userId: user.id }, _sum: { amountCents: true } }),
  ]);

  const totalCents = agg._sum.amountCents ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>
            EXPENSES
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {total} {total === 1 ? "expense" : "expenses"} · {formatCents(totalCents)}
          </p>
        </div>
      </header>

      {total === 0 ? (
        <ExpensesEmptyState />
      ) : (
        <>
          <ExpenseTable rows={rows} />
          <footer className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>{pg.label}</span>
            <span className="flex gap-2">
              <a
                aria-disabled={pg.page <= 1}
                href={`/expenses?page=${pg.page - 1}`}
                className="px-3 py-1.5"
                style={{ border: "2px solid var(--electric-sapphire)", color: "var(--electric-sapphire)", pointerEvents: pg.page <= 1 ? "none" : "auto", opacity: pg.page <= 1 ? 0.4 : 1 }}
              >
                ◀ Prev
              </a>
              <a
                aria-disabled={pg.page >= pg.pageCount}
                href={`/expenses?page=${pg.page + 1}`}
                className="px-3 py-1.5"
                style={{ border: "2px solid var(--electric-sapphire)", color: "var(--electric-sapphire)", pointerEvents: pg.page >= pg.pageCount ? "none" : "auto", opacity: pg.page >= pg.pageCount ? 0.4 : 1 }}
              >
                Next ▶
              </a>
            </span>
          </footer>
        </>
      )}
    </div>
  );
}
