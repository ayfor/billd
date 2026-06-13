"use client";

import { useState } from "react";
import { CategoryPill } from "@/components/CategoryPill";
import { Money } from "@/components/Money";
import { ExpenseModal, type EditableExpense } from "@/components/ExpenseModal";
import type { RecentExpense } from "@/lib/queries/dashboard";

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });

export function RecentExpenses({ recent, categories }: { recent: RecentExpense[]; categories: { id: string; name: string }[] }) {
  const [editing, setEditing] = useState<EditableExpense | null>(null);
  return (
    <div className="px-panel px-raise flex flex-col">
      <div className="px-5 py-3.5 text-xs font-bold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>RECENT EXPENSES</div>
      {recent.length === 0 ? (
        <div className="px-5 pb-5 text-sm" style={{ color: "var(--text-muted)" }}>No expenses yet.</div>
      ) : recent.map((r, i) => (
        <button
          key={r.id}
          onClick={() => setEditing({ id: r.id, amountCents: r.amountCents, description: r.description, categoryId: r.category.id, dateISO: r.dateISO })}
          className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-sm"
          style={{ borderTop: i === 0 ? "1px solid var(--border-soft)" : "1px solid var(--border-soft)", color: "var(--text-body)" }}
        >
          <span className="flex items-center gap-3">
            <span style={{ color: "var(--text-primary)" }}>{r.description}</span>
            <CategoryPill name={r.category.name} color={r.category.color} />
          </span>
          <span className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(r.dateISO)}</span>
            <Money cents={r.amountCents} />
          </span>
        </button>
      ))}
      {editing && (
        <ExpenseModal mode="edit" categories={categories} expense={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
