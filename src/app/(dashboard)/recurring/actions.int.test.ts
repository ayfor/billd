import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { categoryReferenceCount } from "@/lib/queries/categoryUsage";

const EMAIL = "s61-rec@example.com";
let userId = "", cat = "";

describe("recurring persistence + category guard", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({ data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: { name: "Bills", color: "sapphire", sortOrder: 0 } } }, include: { categories: true } });
    userId = u.id; cat = u.categories[0].id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("persists a template and toggles active", async () => {
    const t = await prisma.recurringTemplate.create({ data: { userId, categoryId: cat, name: "Rent", amountCents: 95000, frequency: "monthly", anchorDay: 1, startDate: new Date("2026-06-01") } });
    expect(t.active).toBe(true);
    const upd = await prisma.recurringTemplate.updateMany({ where: { id: t.id, userId }, data: { active: false } });
    expect(upd.count).toBe(1);
  });

  it("a category with a template can't be deleted (guard counts recurring)", async () => {
    expect(await categoryReferenceCount(userId, cat)).toBeGreaterThan(0);
    await expect(prisma.category.delete({ where: { id: cat } })).rejects.toThrow();
  });

  it("PostingLedger enforces (templateId, scheduledDate) uniqueness", async () => {
    const t = await prisma.recurringTemplate.findFirst({ where: { userId } });
    const date = new Date("2026-07-01");
    await prisma.postingLedger.create({ data: { templateId: t!.id, scheduledDate: date } });
    await expect(prisma.postingLedger.create({ data: { templateId: t!.id, scheduledDate: date } })).rejects.toThrow();
  });
});
