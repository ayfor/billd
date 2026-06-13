import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { mostRecentCategoryId } from "./recentCategory";

const EMAIL = "recent-cat@example.com";
let userId = "", groceries = "", transit = "";

describe("mostRecentCategoryId", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({
      data: { email: EMAIL, name: "RC", passwordHash: "x", categories: { create: [
        { name: "Groceries", color: "seaweed", sortOrder: 0 },
        { name: "Transit", color: "sapphire", sortOrder: 1 },
      ] } },
      include: { categories: true },
    });
    userId = u.id;
    groceries = u.categories.find((c) => c.name === "Groceries")!.id;
    transit = u.categories.find((c) => c.name === "Transit")!.id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("falls back to the first category when there are no expenses", async () => {
    expect(await mostRecentCategoryId(userId)).toBe(groceries);
  });

  it("returns the category of the most recent expense", async () => {
    await prisma.expense.create({ data: { userId, categoryId: transit, amountCents: 9800, description: "bus", date: new Date("2026-06-11") } });
    expect(await mostRecentCategoryId(userId)).toBe(transit);
  });
});
