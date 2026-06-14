import { describe, expect, it } from "vitest";
import { clampDayToMonth, nextOccurrence, monthlyEquivalentCents } from "./recurrence";

describe("clampDayToMonth", () => {
  it("clamps day 31 to Feb 28 in a non-leap year", () => {
    expect(clampDayToMonth(2026, 1, 31)).toBe(28); // month 1 = Feb
  });
  it("clamps day 31 to Feb 29 in a leap year", () => {
    expect(clampDayToMonth(2028, 1, 31)).toBe(29);
  });
  it("leaves a valid day untouched", () => {
    expect(clampDayToMonth(2026, 3, 30)).toBe(30); // April has 30
  });
});

describe("nextOccurrence", () => {
  const start = new Date(Date.UTC(2026, 0, 1));
  it("monthly day-of-month, clamps in short months", () => {
    const t = { frequency: "monthly", anchorDay: 31, startDate: start };
    // after Jan 31 → next is Feb 28 (clamped)
    const n = nextOccurrence(t, new Date(Date.UTC(2026, 0, 31)));
    expect(n.toISOString().slice(0, 10)).toBe("2026-02-28");
  });
  it("weekly by weekday", () => {
    const t = { frequency: "weekly", anchorDay: 1, startDate: start }; // Monday
    const n = nextOccurrence(t, new Date(Date.UTC(2026, 5, 9))); // Jun 9 2026 is a Tue
    expect(n.getUTCDay()).toBe(1);
    expect(n > new Date(Date.UTC(2026, 5, 9))).toBe(true);
  });
  it("yearly by month+day", () => {
    const t = { frequency: "yearly", anchorDay: 701, startDate: start }; // Jul 1
    const n = nextOccurrence(t, new Date(Date.UTC(2026, 5, 1)));
    expect(n.toISOString().slice(0, 10)).toBe("2026-07-01");
  });
  it("never returns a date before startDate", () => {
    const late = new Date(Date.UTC(2027, 0, 15));
    const t = { frequency: "monthly", anchorDay: 1, startDate: late };
    const n = nextOccurrence(t, new Date(Date.UTC(2026, 5, 1)));
    expect(n >= late).toBe(true);
  });
});

describe("monthlyEquivalentCents", () => {
  it("weekly ×52/12", () => { expect(monthlyEquivalentCents({ frequency: "weekly", amountCents: 1200 })).toBe(Math.round(1200 * 52 / 12)); });
  it("yearly ÷12", () => { expect(monthlyEquivalentCents({ frequency: "yearly", amountCents: 120000 })).toBe(10000); });
  it("monthly ×1", () => { expect(monthlyEquivalentCents({ frequency: "monthly", amountCents: 5000 })).toBe(5000); });
});
