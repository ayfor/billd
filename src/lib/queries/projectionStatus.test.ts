import { describe, expect, it } from "vitest";
import { projectionStatus, projectMonthEnd } from "./spendSeries";

describe("projectionStatus", () => {
  it("is too early before day 3 (no number)", () => {
    const s = projectionStatus(5000, 240000, new Date(Date.UTC(2026, 5, 2)));
    expect(s.tooEarly).toBe(true);
    expect(s.label).toBe("Too early to call");
  });
  it("on pace → Seaweed when projected <= expected", () => {
    // June day 10, $300 spent → projected $900; expected $2400 → under
    const s = projectionStatus(30000, 240000, new Date(Date.UTC(2026, 5, 10)));
    expect(s.tooEarly).toBe(false);
    expect(s.onPace).toBe(true);
    expect(s.tone).toBe("positive");
    expect(s.label).toBe("On pace · under budget");
  });
  it("trending over → Amethyst when projected > expected", () => {
    // June day 10, $1000 spent → projected $3000; expected $2400 → over
    const s = projectionStatus(100000, 240000, new Date(Date.UTC(2026, 5, 10)));
    expect(s.onPace).toBe(false);
    expect(s.tone).toBe("attention");
    expect(s.label).toBe("Trending over · review budgets");
  });
  it("projected value equals the shared projectMonthEnd (chart & panel agree)", () => {
    const now = new Date(Date.UTC(2026, 5, 12));
    const s = projectionStatus(60000, 240000, now);
    expect(s.projectedCents).toBe(projectMonthEnd(60000, now));
  });
  it("uses UTC day math across a leap February", () => {
    // 2028 leap → Feb has 29 days; day 10, $290 → projected 290/10*29 = $841
    const s = projectionStatus(29000, 300000, new Date(Date.UTC(2028, 1, 10)));
    expect(s.projectedCents).toBe(Math.round(29000 / 10 * 29));
  });
});
