"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createRecurring, updateRecurring, toggleRecurringActive, deleteRecurring, type RecurringFormState } from "@/app/(dashboard)/recurring/actions";
import { CategoryPill } from "@/components/CategoryPill";
import { Money } from "@/components/Money";
import { formatCents } from "@/lib/money";
import { maskAmount } from "@/lib/amountMask";

export type ClientTemplate = {
  id: string;
  name: string;
  category: { id: string; name: string; color: string };
  amountCents: number;
  frequency: "weekly" | "monthly" | "yearly";
  anchorDay: number;
  startDateISO: string;
  active: boolean;
  nextISO: string;
};

const initial: RecurringFormState = {};
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });

export function RecurringClient({ templates, categories, monthlyTotalCents }: { templates: ClientTemplate[]; categories: { id: string; name: string }[]; monthlyTotalCents: number }) {
  const [modal, setModal] = useState<null | { mode: "create" } | { mode: "edit"; template: ClientTemplate }>(null);

  // sort: active by next date asc, then paused (reduced opacity) at the bottom
  const sorted = [...templates].sort((a, z) => {
    if (a.active !== z.active) return a.active ? -1 : 1;
    return a.nextISO < z.nextISO ? -1 : 1;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {templates.length} {templates.length === 1 ? "template" : "templates"} · {formatCents(monthlyTotalCents)} per month scheduled
        </p>
        <button className="billd-btn billd-btn--primary" onClick={() => setModal({ mode: "create" })}>Add recurring</button>
      </div>

      {templates.length === 0 ? (
        <div className="px-panel px-raise p-12 text-center" style={{ color: "var(--text-muted)" }}>No recurring templates yet.</div>
      ) : (
        <div className="px-panel px-raise">
          <div className="grid items-center gap-4 px-5 py-3.5 text-xs font-bold" style={{ gridTemplateColumns: "1fr 150px 110px 130px 100px 70px", color: "var(--text-muted)", background: "color-mix(in srgb, var(--lavender-mist) 8%, transparent)", letterSpacing: "0.06em" }}>
            <span>NAME</span><span>CATEGORY</span><span className="text-right">AMOUNT</span><span>FREQUENCY</span><span>NEXT</span><span className="text-right">ACTIVE</span>
          </div>
          {sorted.map((t, i) => (
            <div key={t.id} className="grid items-center gap-4 px-5 py-3.5 text-sm" style={{ gridTemplateColumns: "1fr 150px 110px 130px 100px 70px", borderTop: i === 0 ? "none" : "1px solid var(--border-soft)", opacity: t.active ? 1 : 0.45 }}>
              <button className="text-left" style={{ color: "var(--text-primary)" }} onClick={() => setModal({ mode: "edit", template: t })}>{t.name}</button>
              <span><CategoryPill name={t.category.name} color={t.category.color} /></span>
              <Money cents={t.amountCents} />
              <span style={{ color: "var(--text-muted)" }}>{t.frequency}</span>
              <span style={{ color: "var(--text-muted)" }}>{fmtDate(t.nextISO)}</span>
              <span className="flex justify-end">
                <input type="checkbox" checked={t.active} aria-label={`${t.name} active`} onChange={(e) => toggleRecurringActive(t.id, e.target.checked)} style={{ accentColor: "var(--electric-sapphire)" }} className="size-4" />
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-panel px-raise flex flex-col gap-2 p-5" style={{ maxWidth: 720 }}>
        <span className="text-xs font-bold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>HOW IT WORKS</span>
        <p className="text-sm" style={{ color: "var(--text-body)" }}>On each scheduled date, billd generates a real expense from the template. Generated expenses appear in Expenses and feed budgets and projections.</p>
      </div>

      {modal && <RecurringModal mode={modal.mode} template={modal.mode === "edit" ? modal.template : undefined} categories={categories} onClose={() => setModal(null)} />}
    </>
  );
}

function RecurringModal({ mode, template, categories, onClose }: { mode: "create" | "edit"; template?: ClientTemplate; categories: { id: string; name: string }[]; onClose: () => void }) {
  const base = mode === "edit" && template ? updateRecurring.bind(null, template.id) : createRecurring;
  const handled = useRef<RecurringFormState>(initial);
  const [confirm, setConfirm] = useState(false);
  const [freq, setFreq] = useState(template?.frequency ?? "monthly");
  const [state, formAction, pending] = useActionState<RecurringFormState, FormData>(async (prev, fd) => base(prev, fd), initial);

  useEffect(() => { if (state === handled.current) return; handled.current = state; if (state.ok) onClose(); }, [state, onClose]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);

  const v = state.values;
  const today = new Date().toISOString().slice(0, 10);
  const cat = v?.categoryId ?? template?.category.id ?? categories[0]?.id ?? "";
  const amount = v?.amount ?? (template ? (template.amountCents / 100).toFixed(2) : "");
  const startDate = v?.startDate ?? (template ? template.startDateISO.slice(0, 10) : today);
  const anchor = v?.anchorDay ?? String(template?.anchorDay ?? (freq === "monthly" ? 1 : freq === "weekly" ? 1 : 101));

  return (
    <div role="dialog" aria-modal="true" className="flex items-center justify-center" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} onClick={onClose}>
      <div className="px-panel px-raise flex w-[480px] flex-col gap-4 p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>{mode === "edit" ? "Edit recurring" : "Add recurring"}</h2>
          <button type="button" onClick={onClose} className="text-xs" style={{ color: "var(--text-muted)" }} aria-label="Close">Esc ✕</button>
        </div>
        <form action={formAction} className="flex flex-col gap-3.5">
          {state.errors?.form && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{state.errors.form}</p>}
          <Field label="NAME" error={state.errors?.name}><input name="name" defaultValue={v?.name ?? template?.name ?? ""} placeholder="e.g. Rent" className="billd-input" maxLength={120} autoFocus /></Field>
          <div className="flex gap-3">
            <Field label="CATEGORY" error={state.errors?.categoryId}><select name="categoryId" defaultValue={cat} className="billd-input">{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="AMOUNT" error={state.errors?.amount}><input name="amount" inputMode="decimal" defaultValue={amount} placeholder="$ 0.00" className="billd-input" onChange={(e) => { e.target.value = maskAmount(e.target.value); }} /></Field>
          </div>
          <div className="flex gap-3">
            <Field label="FREQUENCY" error={state.errors?.frequency}>
              <select name="frequency" value={freq} onChange={(e) => setFreq(e.target.value as typeof freq)} className="billd-input">
                <option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
              </select>
            </Field>
            <Field label={freq === "weekly" ? "WEEKDAY (0=Sun)" : freq === "monthly" ? "DAY OF MONTH" : "ANCHOR (MMDD)"} error={state.errors?.anchorDay}>
              <input name="anchorDay" defaultValue={anchor} className="billd-input" inputMode="numeric" />
            </Field>
          </div>
          <Field label="START DATE" error={state.errors?.startDate}><input name="startDate" type="date" defaultValue={startDate} className="billd-input" /></Field>
          <div className="mt-1 flex items-center justify-between">
            {mode === "edit" ? (
              confirm ? (
                <span className="flex items-center gap-2 text-xs" style={{ color: "var(--amethyst)" }}>Delete?
                  <button type="button" onClick={async () => { await deleteRecurring(template!.id); onClose(); }} style={{ fontWeight: 600 }}>Yes</button>
                  <button type="button" onClick={() => setConfirm(false)} style={{ color: "var(--text-muted)" }}>No</button>
                </span>
              ) : <button type="button" onClick={() => setConfirm(true)} className="text-xs" style={{ color: "color-mix(in srgb, var(--lavender-mist) 40%, transparent)" }}>Delete</button>
            ) : <span />}
            <span className="flex gap-2">
              <button type="button" onClick={onClose} className="billd-btn billd-btn--ghost">Cancel</button>
              <button type="submit" disabled={pending} className="billd-btn billd-btn--primary">{pending ? "Saving…" : "Save"}</button>
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
