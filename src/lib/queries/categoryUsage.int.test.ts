import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { categoryUsage, categoryReferenceCount } from "./categoryUsage";

const EMAIL = "s32-usage@example.com";
let userId = "", cat = "", emptyCat = "";

describe("category usage + reference count", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({
      data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: [
        { name: "Groceries", color: "seaweed", sortOrder: 0 },
        { name: "Unused", color: "sapphire", sortOrder: 1 },
      ] } },
      include: { categories: true },
    });
    userId = u.id;
    cat = u.categories.find((c) => c.name === "Groceries")!.id;
    emptyCat = u.categories.find((c) => c.name === "Unused")!.id;
    const now = new Date();
    const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 10));
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 10));
    await prisma.expense.createMany({ data: [
      { userId, categoryId: cat, amountCents: 5000, description: "this month", date: thisMonth },
      { userId, categoryId: cat, amountCents: 3000, description: "this month 2", date: thisMonth },
      { userId, categoryId: cat, amountCents: 9999, description: "last month", date: lastMonth },
    ] });
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("counts all-time expenses and sums only the current month", async () => {
    const u = await categoryUsage(userId);
    expect(u[cat].expenseCount).toBe(3);
    expect(u[cat].monthCents).toBe(8000); // 5000 + 3000, last month excluded
  });

  it("referenceCount is >0 for a used category, 0 for an unused one", async () => {
    expect(await categoryReferenceCount(userId, cat)).toBe(3);
    expect(await categoryReferenceCount(userId, emptyCat)).toBe(0);
  });

  it("DB onDelete:Restrict refuses deleting a category that has expenses", async () => {
    await expect(prisma.category.delete({ where: { id: cat } })).rejects.toThrow();
  });

  it("an unused category can be deleted", async () => {
    const del = await prisma.category.deleteMany({ where: { id: emptyCat, userId } });
    expect(del.count).toBe(1);
  });
});
