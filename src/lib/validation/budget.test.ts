import { describe, expect, it } from "vitest";
import { budgetSchema } from "./budget";

const ok = { categoryId: "c1", timespan: "monthly", amount: "700" };

describe("budgetSchema", () => {
  it("accepts a valid budget and converts amount to cents", () => {
    const r = budgetSchema.safeParse(ok);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.amount).toBe(70000);
  });
  it("rejects zero / missing category / bad timespan", () => {
    expect(budgetSchema.safeParse({ ...ok, amount: "0" }).success).toBe(false);
    expect(budgetSchema.safeParse({ ...ok, categoryId: "" }).success).toBe(false);
    expect(budgetSchema.safeParse({ ...ok, timespan: "weekly" }).success).toBe(false);
  });
});
