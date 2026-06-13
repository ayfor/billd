import type { Prisma } from "@/generated/prisma/client";

export type ExpenseParams = {
  q: string;
  categoryId: string; // "" = all
  month: string;      // "YYYY-MM" or "" = all time
  sort: "date" | "amount";
  dir: "asc" | "desc";
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function parseExpenseParams(sp: RawParams): ExpenseParams {
  const sort = str(sp.sort) === "amount" ? "amount" : "date";
  const dir = str(sp.dir) === "asc" ? "asc" : "desc";
  const page = Math.max(1, Math.floor(Number(str(sp.page)) || 1));
  const month = /^\d{4}-\d{2}$/.test(str(sp.month)) ? str(sp.month) : "";
  return { q: str(sp.q).trim(), categoryId: str(sp.categoryId), month, sort, dir, page };
}

export function buildWhere(userId: string, p: ExpenseParams): Prisma.ExpenseWhereInput {
  const where: Prisma.ExpenseWhereInput = { userId };
  if (p.q) where.description = { contains: p.q, mode: "insensitive" };
  if (p.categoryId) where.categoryId = p.categoryId;
  if (p.month) {
    const [y, m] = p.month.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1));
    where.date = { gte: start, lt: end };
  }
  return where;
}

export function buildOrderBy(p: ExpenseParams): Prisma.ExpenseOrderByWithRelationInput[] {
  const field = p.sort === "amount" ? "amountCents" : "date";
  return [{ [field]: p.dir }, { createdAt: "desc" }];
}

// Recent "YYYY-MM" months for the filter dropdown, newest first.
export function recentMonths(count: number, from: Date): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() - i, 1));
    const value = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-CA", { month: "short", year: "numeric", timeZone: "UTC" });
    out.push({ value, label });
  }
  return out;
}
