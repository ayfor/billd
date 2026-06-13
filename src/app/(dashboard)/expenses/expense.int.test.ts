import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

const EMAIL = "exp-int@example.com";
let userId = "";
let categoryId = "";

describe("expense persistence", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({
      data: { email: EMAIL, name: "Exp", passwordHash: "x", categories: { create: { name: "Groceries", color: "seaweed", sortOrder: 0 } } },
      include: { categories: true },
    });
    userId = u.id;
    categoryId = u.categories[0].id;
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
  });

  it("stores amountCents as an exact integer and round-trips", async () => {
    const created = await prisma.expense.create({
      data: { userId, categoryId, amountCents: 184257, description: "test", date: new Date("2026-06-09") },
    });
    expect(Number.isInteger(created.amountCents)).toBe(true);
    const read = await prisma.expense.findUnique({ where: { id: created.id } });
    expect(read?.amountCents).toBe(184257);
  });

  it("blocks deleting a category still in use (onDelete: Restrict)", async () => {
    await expect(prisma.category.delete({ where: { id: categoryId } })).rejects.toThrow();
  });
});
