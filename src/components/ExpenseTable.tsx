import { CategoryPill } from "@/components/CategoryPill";
import { Money } from "@/components/Money";

export type ExpenseRow = {
  id: string;
  date: Date;
  description: string;
  category: { name: string; color: string };
  amountCents: number;
};

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });

export function ExpenseTable({ rows }: { rows: ExpenseRow[] }) {
  return (
    <div className="px-panel px-raise">
      <div
        className="grid items-center gap-4 px-5 py-3.5 text-xs font-bold"
        style={{ gridTemplateColumns: "110px 1fr 180px 120px", color: "var(--text-muted)", background: "color-mix(in srgb, var(--lavender-mist) 8%, transparent)", letterSpacing: "0.06em" }}
      >
        <span>DATE</span><span>DESCRIPTION</span><span>CATEGORY</span>
        <span className="text-right">AMOUNT</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.id}
          className="grid items-center gap-4 px-5 py-3.5 text-sm"
          style={{
            gridTemplateColumns: "110px 1fr 180px 120px",
            borderTop: i === 0 ? "none" : "1px solid var(--border-soft)",
            color: "var(--text-body)",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>{fmtDate(r.date)}</span>
          <span style={{ color: "var(--text-primary)" }}>{r.description}</span>
          <span><CategoryPill name={r.category.name} color={r.category.color} /></span>
          <Money cents={r.amountCents} />
        </div>
      ))}
    </div>
  );
}
