import { describe, expect, it } from "vitest";
import { projectMonthEnd, daysInCurrentMonth } from "./spendSeries";

describe("projectMonthEnd", () => {
  it("scales linearly by days elapsed", () => {
    // June has 30 days; on day 10 with $300 spent → projected $900
    const now = new Date(Date.UTC(2026, 5, 10));
    expect(projectMonthEnd(30000, now)).toBe(90000);
  });
  it("on day 1 projects spent × daysInMonth", () => {
    const now = new Date(Date.UTC(2026, 5, 1));
    expect(projectMonthEnd(1000, now)).toBe(30000); // $10 × 30
  });
  it("handles February leap year length", () => {
    const now = new Date(Date.UTC(2028, 1, 14)); // 2028 leap → 29 days
    expect(daysInCurrentMonth(now)).toBe(29);
  });
});
