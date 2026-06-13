import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

const A = "s31-a@example.com";
const B = "s31-b@example.com";
let userA = "", userB = "";

describe("category persistence & uniqueness", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [A, B] } } });
    const a = await prisma.user.create({ data: { email: A, name: "A", passwordHash: "x" } });
    const b = await prisma.user.create({ data: { email: B, name: "B", passwordHash: "x" } });
    userA = a.id; userB = b.id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: { in: [A, B] } } }); });

  it("persists a category with a token colour (not hex)", async () => {
    const c = await prisma.category.create({ data: { userId: userA, name: "Pets", color: "seaweed", sortOrder: 0 } });
    expect(c.color).toBe("seaweed");
    expect(c.color.startsWith("#")).toBe(false);
  });

  it("detects a case-insensitive duplicate within a user", async () => {
    const dupe = await prisma.category.findFirst({ where: { userId: userA, name: { equals: "pets", mode: "insensitive" } } });
    expect(dupe).not.toBeNull();
  });

  it("allows the same name for a different user", async () => {
    const c = await prisma.category.create({ data: { userId: userB, name: "Pets", color: "sapphire", sortOrder: 0 } });
    expect(c.id).toBeTruthy();
  });

  it("user-scoped update can't touch another user's category", async () => {
    const aPets = await prisma.category.findFirst({ where: { userId: userA, name: "Pets" } });
    const res = await prisma.category.updateMany({ where: { id: aPets!.id, userId: userB }, data: { name: "Hacked" } });
    expect(res.count).toBe(0);
  });
});
