import { describe, expect, it } from "vitest";
import { recurringSchema } from "./recurring";

const ok = { name: "Rent", categoryId: "c1", amount: "950", frequency: "monthly", anchorDay: "1", startDate: "2026-06-01" };

describe("recurringSchema", () => {
  it("accepts valid input and converts amount", () => {
    const r = recurringSchema.safeParse(ok);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.amount).toBe(95000);
  });
  it("rejects empty name / $0 / bad frequency", () => {
    expect(recurringSchema.safeParse({ ...ok, name: "" }).success).toBe(false);
    expect(recurringSchema.safeParse({ ...ok, amount: "0" }).success).toBe(false);
    expect(recurringSchema.safeParse({ ...ok, frequency: "daily" }).success).toBe(false);
  });
});
