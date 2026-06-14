import { describe, expect, it } from "vitest";
import { projectionStatus, projectMonthEnd } from "./spendSeries";

describe("projectionStatus with scheduled-remaining hook", () => {
  it("adds scheduled-but-unposted amounts to the projected figure", () => {
    const now = new Date(Date.UTC(2026, 5, 10));
    const base = projectMonthEnd(30000, now); // $300 spent by day 10
    const withSched = projectionStatus(30000, 500000, now, 95000); // + $950 rent due
    expect(withSched.projectedCents).toBe(base + 95000);
  });
});
