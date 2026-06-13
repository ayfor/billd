"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createBudget, updateBudget, deleteBudget, type BudgetFormState } from "@/app/(dashboard)/budgets/actions";
import { CategoryPill } from "@/components/CategoryPill";
import { Money } from "@/components/Money";
import { maskAmount } from "@/lib/amountMask";

export type ClientBudget = {
  id: string;
  categoryId: string;
  category: { id: string; name: string; color: string };
  amountCents: number;
  timespan: "monthly" | "yearly";
};

const initial: BudgetFormState = {};

export function BudgetsClient({ budgets, categories }: { budgets: ClientBudget[]; categories: { id: string; name: string }[] }) {
  const [modal, setModal] = useState<null | { mode: "create" } | { mode: "edit"; budget: ClientBudget }>(null);
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{budgets.length} {budgets.length === 1 ? "budget" : "budgets"}</p>
        <button className="billd-btn billd-btn--primary" onClick={() => setModal({ mode: "create" })}>Add budget</button>
      </div>

      {budgets.length === 0 ? (
        <div className="px-panel px-raise p-12 text-center" style={{ color: "var(--text-muted)" }}>Set your first budget to track spending against a limit.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {budgets.map((b) => (
            <button key={b.id} onClick={() => setModal({ mode: "edit", budget: b })} className="px-panel px-raise flex items-center justify-between gap-4 p-5 text-left">
              <span className="flex items-center gap-3">
                <CategoryPill name={b.category.name} color={b.category.color} />
                <span className="px-2 py-0.5 text-xs" style={{ border: "1px solid var(--border-strong)", color: "var(--text-muted)" }}>{b.timespan}</span>
              </span>
              <Money cents={b.amountCents} className="text-base" />
            </button>
          ))}
        </div>
      )}

      {modal && (
        <BudgetModal
          mode={modal.mode}
          budget={modal.mode === "edit" ? modal.budget : undefined}
          categories={categories}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function BudgetModal({ mode, budget, categories, onClose }: { mode: "create" | "edit"; budget?: ClientBudget; categories: { id: string; name: string }[]; onClose: () => void }) {
  const base = mode === "edit" && budget ? updateBudget.bind(null, budget.id) : createBudget;
  const handled = useRef<BudgetFormState>(initial);
  const [confirm, setConfirm] = useState(false);
  const [state, formAction, pending] = useActionState<BudgetFormState, FormData>(async (prev, fd) => base(prev, fd), initial);

  useEffect(() => {
    if (state === handled.current) return;
    handled.current = state;
    if (state.ok) onClose();
  }, [state, onClose]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const v = state.values;
  const cat = v?.categoryId ?? budget?.categoryId ?? categories[0]?.id ?? "";
  const timespan = v?.timespan ?? budget?.timespan ?? "monthly";
  const amount = v?.amount ?? (budget ? (budget.amountCents / 100).toFixed(2) : "");

  return (
    <div role="dialog" aria-modal="true" className="flex items-center justify-center" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} onClick={onClose}>
      <div className="px-panel px-raise flex w-[460px] flex-col gap-4 p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>{mode === "edit" ? "Edit budget" : "Add budget"}</h2>
          <button type="button" onClick={onClose} className="text-xs" style={{ color: "var(--text-muted)" }} aria-label="Close">Esc ✕</button>
        </div>
        <form action={formAction} className="flex flex-col gap-3.5">
          {state.errors?.form && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{state.errors.form}</p>}
          <Field label="CATEGORY" error={state.errors?.categoryId}>
            <select name="categoryId" defaultValue={cat} className="billd-input">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="TIMESPAN" error={state.errors?.timespan}>
            <select name="timespan" defaultValue={timespan} className="billd-input">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </Field>
          <Field label="AMOUNT" error={state.errors?.amount}>
            <input name="amount" inputMode="decimal" defaultValue={amount} placeholder="$ 0.00" className="billd-input" autoFocus onChange={(e) => { e.target.value = maskAmount(e.target.value); }} />
          </Field>
          <div className="mt-1 flex items-center justify-between">
            {mode === "edit" ? (
              confirm ? (
                <span className="flex items-center gap-2 text-xs" style={{ color: "var(--amethyst)" }}>
                  Delete?
                  <button type="button" onClick={async () => { await deleteBudget(budget!.id); onClose(); }} style={{ fontWeight: 600 }}>Yes</button>
                  <button type="button" onClick={() => setConfirm(false)} style={{ color: "var(--text-muted)" }}>No</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirm(true)} className="text-xs" style={{ color: "color-mix(in srgb, var(--lavender-mist) 40%, transparent)" }}>Delete</button>
              )
            ) : <span />}
            <span className="flex gap-2">
              <button type="button" onClick={onClose} className="billd-btn billd-btn--ghost">Cancel</button>
              <button type="submit" disabled={pending} className="billd-btn billd-btn--primary">{pending ? "Saving…" : "Save budget"}</button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{error}</p>}
    </div>
  );
}
