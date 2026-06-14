export type Frequency = "weekly" | "monthly" | "yearly";
export type RecurrenceLike = { frequency: string; anchorDay: number; startDate: Date };

// Days in a given UTC month (month: 0-11).
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// Clamp a day-of-month to the last valid day (Jan 31 → Feb 28/29).
export function clampDayToMonth(year: number, month: number, day: number): number {
  return Math.min(day, daysInMonth(year, month));
}

function atUTC(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

// Next scheduled occurrence strictly after `after`, never before startDate.
export function nextOccurrence(t: RecurrenceLike, after: Date): Date {
  const floor = after < t.startDate ? new Date(t.startDate.getTime() - 86400000) : after;

  if (t.frequency === "weekly") {
    const target = t.anchorDay % 7; // 0=Sun..6=Sat
    const d = new Date(floor.getTime());
    do {
      d.setUTCDate(d.getUTCDate() + 1);
    } while (d.getUTCDay() !== target);
    return d < t.startDate ? nextOccurrence(t, t.startDate) : new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  if (t.frequency === "monthly") {
    let year = floor.getUTCFullYear();
    let month = floor.getUTCMonth();
    const make = (y: number, m: number) => atUTC(y, m, clampDayToMonth(y, m, t.anchorDay));
    let cand = make(year, month);
    if (cand <= floor) {
      month += 1; if (month > 11) { month = 0; year += 1; }
      cand = make(year, month);
    }
    return cand < t.startDate ? make(t.startDate.getUTCFullYear(), t.startDate.getUTCMonth()) : cand;
  }

  // yearly: anchorDay encodes month*100 + day
  const m0 = Math.floor(t.anchorDay / 100) - 1;
  const dom = t.anchorDay % 100;
  const year = floor.getUTCFullYear();
  const make = (y: number) => atUTC(y, m0, clampDayToMonth(y, m0, dom));
  let cand = make(year);
  if (cand <= floor) cand = make(year + 1);
  return cand < t.startDate ? make(t.startDate.getUTCFullYear()) : cand;
}

// Monthly-equivalent cents for the header summary.
export function monthlyEquivalentCents(t: { frequency: string; amountCents: number }): number {
  if (t.frequency === "weekly") return Math.round((t.amountCents * 52) / 12);
  if (t.frequency === "yearly") return Math.round(t.amountCents / 12);
  return t.amountCents;
}
