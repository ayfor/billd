// Live input mask for the amount field. Keeps digits + a single decimal point,
// caps at 2 decimals, and adds thousands separators to the whole part.
// parseAmountToCents() strips commas, so the masked value submits cleanly.
export function maskAmount(raw: string): string {
  let s = raw.replace(/[^\d.]/g, "");
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    // keep only the first dot
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  }
  const [wholeRaw, frac] = s.split(".");
  const whole = wholeRaw.replace(/^0+(?=\d)/, ""); // trim leading zeros
  const groupedWhole = whole ? Number(whole).toLocaleString("en-CA") : "";
  if (frac === undefined) return groupedWhole;
  return `${groupedWhole || "0"}.${frac.slice(0, 2)}`;
}
