// The only money formatter in billd. Amounts are integer cents end to end;
// formatting happens only at the display edge.
const CAD = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export function formatCents(cents: number): string {
  return CAD.format(cents / 100);
}

// Parse a user-typed amount string ("1,234.56", "$12.34") to integer cents.
// Returns null on anything invalid. Used by S2.2 quick-add.
export function parseAmountToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [whole, frac = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function sumCents(amounts: number[]): number {
  return amounts.reduce((a, c) => a + c, 0);
}
