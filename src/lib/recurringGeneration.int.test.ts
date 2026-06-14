import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { generateDue, scheduledRemainingThisMonth } from "./recurringGeneration";

const EMAIL = "s62-gen@example.com";
let userId = "", cat = "";

async function template(over: Partial<{ active: boolean; anchorDay: number; startDate: Date; amountCents: number }> = {}) {
  return prisma.recurringTemplate.create({ data: {
    userId, categoryId: cat, name: "Rent", amountCents: over.amountCents ?? 95000,
    frequency: "monthly", anchorDay: over.anchorDay ?? 1,
    startDate: over.startDate ?? new Date(Date.UTC(2026, 0, 1)), active: over.active ?? true,
  } });
}

describe("generateDue (DB)", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({ data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: { name: "Bills", color: "sapphire", sortOrder: 0 } } }, include: { categories: true } });
    userId = u.id; cat = u.categories[0].id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("posts due occurrences as expenses + ledger rows, and is idempotent on re-run", async () => {
    await template({ startDate: new Date(Date.UTC(2026, 0, 1)) });
    const now = new Date(Date.UTC(2026, 2, 15)); // Mar 15 → Feb 1 + Mar 1 due (Jan 1 is before startDate-1 window? startDate Jan1 → from = Dec31; so Jan1,Feb1,Mar1)
    const r1 = await generateDue(userId, now);
    expect(r1.generated).toBeGreaterThanOrEqual(2);
    const afterFirst = await prisma.expense.count({ where: { userId, generatedFromId: { not: null } } });
    const r2 = await generateDue(userId, now); // second run: nothing new
    expect(r2.generated).toBe(0);
    const afterSecond = await prisma.expense.count({ where: { userId, generatedFromId: { not: null } } });
    expect(afterSecond).toBe(afterFirst);
  });

  it("paused templates generate nothing", async () => {
    await template({ active: false });
    const r = await generateDue(userId, new Date(Date.UTC(2026, 2, 15)));
    expect(r.generated).toBe(0);
  });

  it("deleting a generated expense does not resurrect it (ledger remains)", async () => {
    await template();
    await generateDue(userId, new Date(Date.UTC(2026, 1, 15))); // posts Jan 1, Feb 1
    const one = await prisma.expense.findFirst({ where: { userId, generatedFromId: { not: null } } });
    await prisma.expense.delete({ where: { id: one!.id } });
    const before = await prisma.expense.count({ where: { userId, generatedFromId: { not: null } } });
    const r = await generateDue(userId, new Date(Date.UTC(2026, 1, 15)));
    expect(r.generated).toBe(0); // ledger row remains → not regenerated
    const after = await prisma.expense.count({ where: { userId, generatedFromId: { not: null } } });
    expect(after).toBe(before);
  });

  it("caps catch-up at 12 for a long-dormant template", async () => {
    await template({ startDate: new Date(Date.UTC(2020, 0, 1)) });
    const r = await generateDue(userId, new Date(Date.UTC(2026, 0, 1)));
    expect(r.capped).toBe(true);
    expect(r.generated).toBe(12);
  });

  it("scheduledRemainingThisMonth sums upcoming occurrences", async () => {
    // anchor day 28, now mid-month → 1 occurrence remaining this month
    await template({ anchorDay: 28, amountCents: 5000, startDate: new Date(Date.UTC(2026, 0, 1)) });
    const cents = await scheduledRemainingThisMonth(userId, new Date(Date.UTC(2026, 5, 10)));
    expect(cents).toBe(5000);
  });
});
