import { describe, expect, it } from "vitest";
import { categorySchema } from "./category";

describe("categorySchema", () => {
  it("accepts a valid name + palette colour", () => {
    expect(categorySchema.safeParse({ name: "Pets", color: "seaweed" }).success).toBe(true);
  });
  it("trims and rejects empty names", () => {
    expect(categorySchema.safeParse({ name: "   ", color: "seaweed" }).success).toBe(false);
  });
  it("rejects names over 30 chars", () => {
    expect(categorySchema.safeParse({ name: "x".repeat(31), color: "seaweed" }).success).toBe(false);
  });
  it("rejects non-palette colours (no hex)", () => {
    expect(categorySchema.safeParse({ name: "Pets", color: "#ff0000" }).success).toBe(false);
    expect(categorySchema.safeParse({ name: "Pets", color: "red" }).success).toBe(false);
  });
});
