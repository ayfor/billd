import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { dashboardSummary } from "./dashboard";

const EMAIL = "s51-dash@example.com";
let userId = "", gro = "";

describe("dashboardSummary (DB)", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({ data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: { name: "Groceries", color: "seaweed", sortOrder: 0 } } }, include: { categories: true } });
    userId = u.id; gro = u.categories[0].id;
    const now = new Date();
    const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 5));
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 5));
    await prisma.budget.createMany({ data: [
      { userId, categoryId: gro, amountCents: 70000, timespan: "monthly" },
      { userId, categoryId: gro, amountCents: 120000, timespan: "yearly" },
    ] });
    await prisma.expense.createMany({ data: [
      { userId, categoryId: gro, amountCents: 5000, description: "now1", date: thisMonth },
      { userId, categoryId: gro, amountCents: 3000, description: "now2", date: thisMonth },
      { userId, categoryId: gro, amountCents: 9999, description: "old", date: lastMonth },
    ] });
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("sums spent for the current month only", async () => {
    const s = await dashboardSummary(userId, new Date());
    expect(s.spentCents).toBe(8000); // last month's 9999 excluded
  });

  it("computes expected as monthly + yearly/12", async () => {
    const s = await dashboardSummary(userId, new Date());
    expect(s.expectedCents).toBe(70000 + Math.round(120000 / 12)); // 70000 + 10000
  });

  it("returns recent expenses (latest first) and budget tiles", async () => {
    const s = await dashboardSummary(userId, new Date());
    expect(s.recent.length).toBeGreaterThan(0);
    expect(s.recent[0].dateISO >= s.recent[s.recent.length - 1].dateISO).toBe(true);
    expect(s.budgets.length).toBe(2);
  });
});
