import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { categoryReferenceCount } from "@/lib/queries/categoryUsage";

const EMAIL = "s41-budget@example.com";
let userId = "", cat = "";

describe("budget persistence, uniqueness & category guard", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({ data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: { name: "Groceries", color: "seaweed", sortOrder: 0 } } }, include: { categories: true } });
    userId = u.id; cat = u.categories[0].id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("creates a budget with cents + timespan", async () => {
    const b = await prisma.budget.create({ data: { userId, categoryId: cat, amountCents: 70000, timespan: "monthly" } });
    expect(b.amountCents).toBe(70000);
    expect(b.timespan).toBe("monthly");
  });

  it("rejects a duplicate (category, timespan) via the unique index", async () => {
    await expect(prisma.budget.create({ data: { userId, categoryId: cat, amountCents: 5000, timespan: "monthly" } })).rejects.toThrow();
  });

  it("allows the same category with a different timespan", async () => {
    const b = await prisma.budget.create({ data: { userId, categoryId: cat, amountCents: 800000, timespan: "yearly" } });
    expect(b.id).toBeTruthy();
  });

  it("a category with a budget can't be deleted (guard counts budgets)", async () => {
    expect(await categoryReferenceCount(userId, cat)).toBeGreaterThan(0);
    await expect(prisma.category.delete({ where: { id: cat } })).rejects.toThrow();
  });

  it("user-scoped delete removes the budget without touching expenses", async () => {
    const b = await prisma.budget.findFirst({ where: { userId, timespan: "yearly" } });
    const res = await prisma.budget.deleteMany({ where: { id: b!.id, userId } });
    expect(res.count).toBe(1);
  });
});
