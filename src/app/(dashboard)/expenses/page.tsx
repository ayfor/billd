import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { parseExpenseParams, buildWhere, buildOrderBy, recentMonths } from "@/lib/expenseQuery";
import { ExpensesClient, type ClientRow } from "@/components/ExpensesClient";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpensesEmptyState } from "@/components/ExpensesEmptyState";
import { FilteredEmptyState } from "@/components/FilteredEmptyState";

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const params = parseExpenseParams(sp);
  const where = buildWhere(user.id, params);

  const [grandTotal, categories] = await Promise.all([
    prisma.expense.count({ where: { userId: user.id } }),
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  const total = await prisma.expense.count({ where });
  const pg = paginate(total, params.page);

  const [expenses, agg] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: buildOrderBy(params),
      skip: pg.skip,
      take: pg.take,
      include: { category: { select: { id: true, name: true, color: true } } },
    }),
    prisma.expense.aggregate({ where, _sum: { amountCents: true } }),
  ]);

  const rows: ClientRow[] = expenses.map((e) => ({
    id: e.id,
    dateISO: e.date.toISOString(),
    description: e.description,
    category: e.category,
    amountCents: e.amountCents,
  }));

  const months = recentMonths(12, new Date());

  return (
    <div className="flex flex-col gap-6">
      <ExpensesClient total={total} totalCents={agg._sum.amountCents ?? 0} rows={rows} categories={categories} />

      {grandTotal === 0 ? (
        <ExpensesEmptyState />
      ) : (
        <>
          <ExpenseFilters
            categories={categories.map((c) => ({ value: c.id, label: c.name }))}
            months={months}
          />
          {total === 0 ? (
            <FilteredEmptyState />
          ) : (
            <footer className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{pg.label}</span>
              <span className="flex gap-2">
                <PageLink params={sp} page={pg.page - 1} disabled={pg.page <= 1}>◀ Prev</PageLink>
                <PageLink params={sp} page={pg.page + 1} disabled={pg.page >= pg.pageCount}>Next ▶</PageLink>
              </span>
            </footer>
          )}
        </>
      )}
    </div>
  );
}

function PageLink({
  params,
  page,
  disabled,
  children,
}: {
  params: Record<string, string | string[] | undefined>;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "string" && k !== "page") qs.set(k, v);
  }
  qs.set("page", String(page));
  return (
    <a
      aria-disabled={disabled}
      href={`/expenses?${qs.toString()}`}
      className="px-3 py-1.5"
      style={{ border: "2px solid var(--electric-sapphire)", color: "var(--electric-sapphire)", pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.4 : 1 }}
    >
      {children}
    </a>
  );
}
