import { describe, expect, it } from "vitest";
import { expenseSchema } from "./expense";

const ok = { amount: "84.32", description: "Farm Boy run", categoryId: "c1", date: "2026-06-09" };

describe("expenseSchema", () => {
  it("accepts a valid expense and converts amount to cents", () => {
    const r = expenseSchema.safeParse(ok);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.amount).toBe(8432);
  });
  it("rejects zero / negative amounts", () => {
    expect(expenseSchema.safeParse({ ...ok, amount: "0" }).success).toBe(false);
    expect(expenseSchema.safeParse({ ...ok, amount: "-5" }).success).toBe(false);
  });
  it("rejects over the $999,999.99 limit", () => {
    expect(expenseSchema.safeParse({ ...ok, amount: "1000000" }).success).toBe(false);
  });
  it("rejects more than two decimal places", () => {
    expect(expenseSchema.safeParse({ ...ok, amount: "12.345" }).success).toBe(false);
  });
  it("rejects empty description and missing category", () => {
    expect(expenseSchema.safeParse({ ...ok, description: "" }).success).toBe(false);
    expect(expenseSchema.safeParse({ ...ok, categoryId: "" }).success).toBe(false);
  });
  it("rejects a date more than a year out", () => {
    expect(expenseSchema.safeParse({ ...ok, date: "2099-01-01" }).success).toBe(false);
  });
});
