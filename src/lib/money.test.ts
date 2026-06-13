import { describe, expect, it } from "vitest";
import { formatCents, parseAmountToCents, sumCents } from "./money";

describe("formatCents", () => {
  it("formats integer cents as CAD two-decimal", () => {
    expect(formatCents(184257)).toBe("$1,842.57");
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(5)).toBe("$0.05");
    expect(formatCents(98000)).toBe("$980.00");
  });
});

describe("parseAmountToCents", () => {
  it("parses valid amounts to integer cents", () => {
    expect(parseAmountToCents("12.34")).toBe(1234);
    expect(parseAmountToCents("$1,842.57")).toBe(184257);
    expect(parseAmountToCents("980")).toBe(98000);
    expect(parseAmountToCents("0.05")).toBe(5);
  });
  it("rejects invalid / over-precise input", () => {
    expect(parseAmountToCents("12.345")).toBeNull();
    expect(parseAmountToCents("abc")).toBeNull();
    expect(parseAmountToCents("")).toBeNull();
  });
});

describe("sumCents", () => {
  it("sums as integers with no float drift", () => {
    // 0.1 + 0.2 in dollars famously != 0.3; in cents it is exact.
    expect(sumCents([10, 20])).toBe(30);
    const many = Array.from({ length: 100 }, () => 1); // 100 x $0.01
    expect(sumCents(many)).toBe(100);
    expect(Number.isInteger(sumCents([8432, 4218, 6185]))).toBe(true);
  });
});
