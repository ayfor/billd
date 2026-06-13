"use client";

import { useActionState, useEffect, useState } from "react";
import { createExpense, deleteExpense, updateExpense, type ExpenseFormState } from "@/app/(dashboard)/expenses/actions";

export type EditableExpense = {
  id: string;
  amountCents: number;
  description: string;
  categoryId: string;
  dateISO: string;
};

type Props = {
  mode: "create" | "edit";
  categories: { id: string; name: string }[];
  expense?: EditableExpense;
  onClose: () => void;
};

const initial: ExpenseFormState = {};

export function ExpenseModal({ mode, categories, expense, onClose }: Props) {
  const action = mode === "edit" && expense ? updateExpense.bind(null, expense.id) : createExpense;
  const [state, formAction, pending] = useActionState(action, initial);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  const v = state.values;
  const amount = v?.amount ?? (expense ? (expense.amountCents / 100).toFixed(2) : "");
  const desc = v?.description ?? expense?.description ?? "";
  const cat = v?.categoryId ?? expense?.categoryId ?? categories[0]?.id ?? "";
  const date = v?.date ?? (expense?.dateISO ? expense.dateISO.slice(0, 10) : today);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="flex items-center justify-center"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }}
      onClick={onClose}
    >
      <div className="px-panel px-raise flex w-[480px] flex-col gap-4 p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>
            {mode === "edit" ? "Edit expense" : "Add expense"}
          </h2>
          <button type="button" onClick={onClose} className="text-xs" style={{ color: "var(--text-muted)" }} aria-label="Close">Esc ✕</button>
        </div>

        <form action={formAction} className="flex flex-col gap-3.5">
          {state.errors?.form && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{state.errors.form}</p>}

          <Field label="AMOUNT" error={state.errors?.amount}>
            <input name="amount" inputMode="decimal" defaultValue={amount} placeholder="$ 0.00" className="billd-input" autoFocus />
          </Field>
          <Field label="DESCRIPTION" error={state.errors?.description}>
            <input name="description" defaultValue={desc} placeholder="What was it for?" className="billd-input" maxLength={120} />
          </Field>
          <div className="flex gap-3">
            <Field label="CATEGORY" error={state.errors?.categoryId}>
              <select name="categoryId" defaultValue={cat} className="billd-input">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="DATE" error={state.errors?.date}>
              <input name="date" type="date" defaultValue={date} className="billd-input" />
            </Field>
          </div>

          <div className="mt-1 flex items-center justify-between">
            {mode === "edit" ? (
              confirmDelete ? (
                <span className="flex items-center gap-2 text-xs" style={{ color: "var(--amethyst)" }}>
                  Delete?
                  <button type="button" disabled={deleting} onClick={async () => { setDeleting(true); await deleteExpense(expense!.id); onClose(); }} style={{ color: "var(--amethyst)", fontWeight: 600 }}>Yes</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} style={{ color: "var(--text-muted)" }}>No</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs" style={{ color: "color-mix(in srgb, var(--lavender-mist) 40%, transparent)" }}>Delete</button>
              )
            ) : <span />}
            <span className="flex gap-2">
              <button type="button" onClick={onClose} className="billd-btn billd-btn--ghost">Cancel</button>
              <button type="submit" disabled={pending} className="billd-btn billd-btn--primary">{pending ? "Saving…" : "Save expense"}</button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{error}</p>}
    </div>
  );
}
