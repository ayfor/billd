import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

// Exercises the persistence + ownership rules the actions enforce, directly
// against the DB (the actions themselves require an auth session / Next request
// scope, so we assert the same invariants at the data layer).

const A = "s22-a@example.com";
const B = "s22-b@example.com";
let userA = "", userB = "", catA = "", catB = "", expA = "";

describe("expense mutations — persistence & ownership", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [A, B] } } });
    const a = await prisma.user.create({ data: { email: A, name: "A", passwordHash: "x", categories: { create: { name: "Groceries", color: "seaweed", sortOrder: 0 } } }, include: { categories: true } });
    const b = await prisma.user.create({ data: { email: B, name: "B", passwordHash: "x", categories: { create: { name: "Rent", color: "sapphire", sortOrder: 0 } } }, include: { categories: true } });
    userA = a.id; catA = a.categories[0].id;
    userB = b.id; catB = b.categories[0].id;
    const e = await prisma.expense.create({ data: { userId: userA, categoryId: catA, amountCents: 8432, description: "seed", date: new Date("2026-06-09") } });
    expA = e.id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: { in: [A, B] } } }); });

  it("creates a user-scoped expense in exact cents", async () => {
    const e = await prisma.expense.create({ data: { userId: userA, categoryId: catA, amountCents: 1234, description: "lunch", date: new Date("2026-06-10") } });
    expect(e.amountCents).toBe(1234);
    expect(e.userId).toBe(userA);
  });

  it("user-scoped update cannot touch another user's expense (where id+userId)", async () => {
    const res = await prisma.expense.updateMany({ where: { id: expA, userId: userB }, data: { amountCents: 1 } });
    expect(res.count).toBe(0);
    const unchanged = await prisma.expense.findUnique({ where: { id: expA } });
    expect(unchanged?.amountCents).toBe(8432);
  });

  it("user-scoped delete cannot remove another user's expense", async () => {
    const res = await prisma.expense.deleteMany({ where: { id: expA, userId: userB } });
    expect(res.count).toBe(0);
    expect(await prisma.expense.findUnique({ where: { id: expA } })).not.toBeNull();
  });

  it("owner can update and delete their own expense", async () => {
    const upd = await prisma.expense.updateMany({ where: { id: expA, userId: userA }, data: { amountCents: 9999 } });
    expect(upd.count).toBe(1);
    const del = await prisma.expense.deleteMany({ where: { id: expA, userId: userA } });
    expect(del.count).toBe(1);
  });

  it("a category owned by another user is rejected by the ownership check", async () => {
    const owned = await prisma.category.findFirst({ where: { id: catB, userId: userA } });
    expect(owned).toBeNull(); // catB belongs to B, not A
  });
});
