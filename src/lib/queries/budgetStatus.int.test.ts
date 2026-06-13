import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { budgetStatuses } from "./budgetStatus";

const EMAIL = "s42-status@example.com";
let userId = "", gro = "", din = "";

describe("budgetStatuses (DB)", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({ data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: [
      { name: "Groceries", color: "seaweed", sortOrder: 0 },
      { name: "Dining", color: "amethyst", sortOrder: 1 },
    ] } }, include: { categories: true } });
    userId = u.id;
    gro = u.categories.find((c) => c.name === "Groceries")!.id;
    din = u.categories.find((c) => c.name === "Dining")!.id;
    const now = new Date();
    const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 5));
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 5));
    await prisma.budget.createMany({ data: [
      { userId, categoryId: gro, amountCents: 70000, timespan: "monthly" },
      { userId, categoryId: din, amountCents: 30000, timespan: "monthly" },
    ] });
    await prisma.expense.createMany({ data: [
      { userId, categoryId: gro, amountCents: 61240, description: "g", date: thisMonth },
      { userId, categoryId: gro, amountCents: 99999, description: "old", date: lastMonth }, // excluded
      { userId, categoryId: din, amountCents: 38910, description: "d", date: thisMonth },
    ] });
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("sums only the current month and sorts by ratio desc (over first)", async () => {
    const s = await budgetStatuses(userId, new Date());
    expect(s).toHaveLength(2);
    // Dining is over (38910/30000 = 1.30) → first; Groceries under (0.87)
    expect(s[0].category.name).toBe("Dining");
    expect(s[0].over).toBe(true);
    expect(s[0].spentCents).toBe(38910);
    expect(s[1].category.name).toBe("Groceries");
    expect(s[1].spentCents).toBe(61240); // last month's 99999 excluded
    expect(s[1].over).toBe(false);
  });
});
