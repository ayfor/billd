import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { dailyCumulative } from "./spendSeries";

const EMAIL = "s52-series@example.com";
let userId = "", cat = "";

describe("dailyCumulative (DB)", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    const u = await prisma.user.create({ data: { email: EMAIL, name: "U", passwordHash: "x", categories: { create: { name: "Groceries", color: "seaweed", sortOrder: 0 } } }, include: { categories: true } });
    userId = u.id; cat = u.categories[0].id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { email: EMAIL } }); });

  it("returns a running cumulative sum by day for the current month", async () => {
    const now = new Date();
    const d3 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 3));
    const d5 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 5));
    // only run when today is >= 5 so both points are within 1..today
    if (now.getUTCDate() < 5) return;
    await prisma.expense.createMany({ data: [
      { userId, categoryId: cat, amountCents: 1000, description: "a", date: d3 },
      { userId, categoryId: cat, amountCents: 2000, description: "b", date: d5 },
    ] });
    const series = await dailyCumulative(userId, now);
    expect(series.find((p) => p.day === 3)!.cents).toBe(1000);
    expect(series.find((p) => p.day === 5)!.cents).toBe(3000); // cumulative
    expect(series[series.length - 1].day).toBe(now.getUTCDate());
  });
});
