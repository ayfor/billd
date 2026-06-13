import { describe, expect, it } from "vitest";
import { parseExpenseParams, buildWhere, buildOrderBy, recentMonths } from "./expenseQuery";

describe("parseExpenseParams", () => {
  it("applies safe defaults", () => {
    expect(parseExpenseParams({})).toEqual({ q: "", categoryId: "", month: "", sort: "date", dir: "desc", page: 1 });
  });
  it("accepts valid values and trims q", () => {
    const p = parseExpenseParams({ q: "  farm ", categoryId: "c1", month: "2026-06", sort: "amount", dir: "asc", page: "3" });
    expect(p).toEqual({ q: "farm", categoryId: "c1", month: "2026-06", sort: "amount", dir: "asc", page: 3 });
  });
  it("clamps bad sort/dir/page/month", () => {
    const p = parseExpenseParams({ sort: "bogus", dir: "nope", page: "-5", month: "2026/06" });
    expect(p).toMatchObject({ sort: "date", dir: "desc", page: 1, month: "" });
  });
});

describe("buildWhere", () => {
  it("adds case-insensitive contains for q", () => {
    expect(buildWhere("u1", parseExpenseParams({ q: "farm" }))).toMatchObject({ userId: "u1", description: { contains: "farm", mode: "insensitive" } });
  });
  it("filters by category", () => {
    expect(buildWhere("u1", parseExpenseParams({ categoryId: "c1" }))).toMatchObject({ categoryId: "c1" });
  });
  it("turns month into a UTC date range", () => {
    const w = buildWhere("u1", parseExpenseParams({ month: "2026-06" })) as { date: { gte: Date; lt: Date } };
    expect(w.date.gte.toISOString()).toBe("2026-06-01T00:00:00.000Z");
    expect(w.date.lt.toISOString()).toBe("2026-07-01T00:00:00.000Z");
  });
});

describe("buildOrderBy", () => {
  it("sorts by date desc with createdAt tie-break by default", () => {
    expect(buildOrderBy(parseExpenseParams({}))).toEqual([{ date: "desc" }, { createdAt: "desc" }]);
  });
  it("sorts by amount asc", () => {
    expect(buildOrderBy(parseExpenseParams({ sort: "amount", dir: "asc" }))).toEqual([{ amountCents: "asc" }, { createdAt: "desc" }]);
  });
});

describe("recentMonths", () => {
  it("lists N months newest-first as YYYY-MM", () => {
    const m = recentMonths(3, new Date(Date.UTC(2026, 5, 15)));
    expect(m.map((x) => x.value)).toEqual(["2026-06", "2026-05", "2026-04"]);
  });
});
