"use client";

import { useState } from "react";
import { CategoryPill } from "@/components/CategoryPill";
import { Money } from "@/components/Money";
import { ExpenseModal, type EditableExpense } from "@/components/ExpenseModal";
import { useQuickAdd } from "@/components/QuickAdd";
import { formatCents } from "@/lib/money";

export type ClientRow = {
  id: string;
  dateISO: string;
  description: string;
  category: { id: string; name: string; color: string };
  amountCents: number;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });

export function ExpensesClient({
  total,
  totalCents,
  rows,
  categories,
}: {
  total: number;
  totalCents: number;
  rows: ClientRow[];
  categories: { id: string; name: string }[];
}) {
  const { openQuickAdd } = useQuickAdd();
  const [editing, setEditing] = useState<EditableExpense | null>(null);

  return (
    <>
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>EXPENSES</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {total} {total === 1 ? "expense" : "expenses"} · {formatCents(totalCents)}
          </p>
        </div>
        <button className="billd-btn billd-btn--primary" onClick={openQuickAdd}>Add expense</button>
      </header>

      <div className="px-panel px-raise">
        <div className="grid items-center gap-4 px-5 py-3.5 text-xs font-bold" style={{ gridTemplateColumns: "110px 1fr 180px 120px", color: "var(--text-muted)", background: "color-mix(in srgb, var(--lavender-mist) 8%, transparent)", letterSpacing: "0.06em" }}>
          <span>DATE</span><span>DESCRIPTION</span><span>CATEGORY</span><span className="text-right">AMOUNT</span>
        </div>
        {rows.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setEditing({ id: r.id, amountCents: r.amountCents, description: r.description, categoryId: r.category.id, dateISO: r.dateISO })}
            className="grid w-full items-center gap-4 px-5 py-3.5 text-left text-sm"
            style={{ gridTemplateColumns: "110px 1fr 180px 120px", borderTop: i === 0 ? "none" : "1px solid var(--border-soft)", color: "var(--text-body)" }}
          >
            <span style={{ color: "var(--text-muted)" }}>{fmtDate(r.dateISO)}</span>
            <span style={{ color: "var(--text-primary)" }}>{r.description}</span>
            <span><CategoryPill name={r.category.name} color={r.category.color} /></span>
            <Money cents={r.amountCents} />
          </button>
        ))}
      </div>

      {editing && (
        <ExpenseModal
          mode="edit"
          categories={categories}
          expense={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
