import { describe, expect, it } from "vitest";
import { computeStatus } from "./budgetStatus";

describe("computeStatus", () => {
  it("under budget → positive, ratio < 1, 'Under by'", () => {
    const s = computeStatus(61240, 70000);
    expect(s.over).toBe(false);
    expect(s.ratio).toBeCloseTo(0.874857, 4);
    expect(s.statusTone).toBe("positive");
    expect(s.statusLabel).toBe("Under by $87.60");
  });
  it("over budget → attention, raw ratio > 1, 'Over by'", () => {
    const s = computeStatus(38910, 30000);
    expect(s.over).toBe(true);
    expect(s.ratio).toBeGreaterThan(1);
    expect(s.statusTone).toBe("attention");
    expect(s.statusLabel).toBe("Over by $89.10");
  });
  it("exactly at budget is not over", () => {
    const s = computeStatus(50000, 50000);
    expect(s.over).toBe(false);
    expect(s.deltaCents).toBe(0);
  });
});
