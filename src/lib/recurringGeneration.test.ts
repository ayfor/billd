import { describe, expect, it } from "vitest";
import { dueOccurrences, CATCH_UP_CAP } from "./recurringGeneration";

const monthly = { frequency: "monthly", anchorDay: 1, startDate: new Date(Date.UTC(2026, 0, 1)) };

describe("dueOccurrences", () => {
  it("lists scheduled dates within the window", () => {
    const occ = dueOccurrences(monthly, new Date(Date.UTC(2026, 0, 1)), new Date(Date.UTC(2026, 3, 1)));
    expect(occ.map((d) => d.toISOString().slice(0, 10))).toEqual(["2026-02-01", "2026-03-01", "2026-04-01"]);
  });
  it("returns nothing when none are due", () => {
    expect(dueOccurrences(monthly, new Date(Date.UTC(2026, 5, 2)), new Date(Date.UTC(2026, 5, 30)))).toEqual([]);
  });
  it("can exceed the cap (caller slices) — returns cap+1 to detect overflow", () => {
    const dormant = { frequency: "monthly", anchorDay: 1, startDate: new Date(Date.UTC(2020, 0, 1)) };
    const occ = dueOccurrences(dormant, new Date(Date.UTC(2020, 0, 1)), new Date(Date.UTC(2026, 0, 1)));
    expect(occ.length).toBe(CATCH_UP_CAP + 1);
  });
});
