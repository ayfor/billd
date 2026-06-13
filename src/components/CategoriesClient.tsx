"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createCategory, updateCategory, type CategoryFormState } from "@/app/(dashboard)/categories/actions";
import { CategoryColorPicker } from "@/components/CategoryColorPicker";

export type ClientCategory = { id: string; name: string; color: string };

const TOKEN: Record<string, string> = {
  sapphire: "var(--electric-sapphire)",
  seaweed: "var(--seaweed)",
  amethyst: "var(--amethyst)",
  lavender: "var(--lavender-mist)",
};

const initial: CategoryFormState = {};

export function CategoriesClient({ categories }: { categories: ClientCategory[] }) {
  const [modal, setModal] = useState<null | { mode: "create" } | { mode: "edit"; category: ClientCategory }>(null);
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        <button className="billd-btn billd-btn--primary" onClick={() => setModal({ mode: "create" })}>Add category</button>
      </div>

      <div className="flex flex-wrap gap-5">
        {categories.map((c) => (
          <div key={c.id} className="px-panel px-raise flex w-[260px] flex-col gap-2.5 p-5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="size-4" style={{ background: TOKEN[c.color] ?? TOKEN.sapphire, border: "1px solid var(--border-strong)" }} />
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</span>
            </div>
            <button onClick={() => setModal({ mode: "edit", category: c })} className="self-start text-xs" style={{ color: "var(--electric-sapphire)" }}>Edit</button>
          </div>
        ))}
      </div>

      {modal && (
        <CategoryModal
          mode={modal.mode}
          category={modal.mode === "edit" ? modal.category : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function CategoryModal({ mode, category, onClose }: { mode: "create" | "edit"; category?: ClientCategory; onClose: () => void }) {
  const base = mode === "edit" && category ? updateCategory.bind(null, category.id) : createCategory;
  const [color, setColor] = useState(category?.color ?? "sapphire");
  const handled = useRef<CategoryFormState>(initial);
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    async (prev, fd) => {
      const r = await base(prev, fd);
      return r;
    },
    initial,
  );

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

  return (
    <div role="dialog" aria-modal="true" className="flex items-center justify-center" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} onClick={onClose}>
      <div className="px-panel px-raise flex w-[420px] flex-col gap-4 p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>
            {mode === "edit" ? "Edit category" : "Add category"}
          </h2>
          <button type="button" onClick={onClose} className="text-xs" style={{ color: "var(--text-muted)" }} aria-label="Close">Esc ✕</button>
        </div>
        <form action={formAction} className="flex flex-col gap-4">
          {state.errors?.form && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{state.errors.form}</p>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>NAME</label>
            <input name="name" defaultValue={state.values?.name ?? category?.name ?? ""} placeholder="e.g. Pets" className="billd-input" maxLength={30} autoFocus />
            {state.errors?.name && <p className="text-xs" style={{ color: "var(--amethyst)" }}>{state.errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>COLOUR</label>
            <CategoryColorPicker value={color} onChange={setColor} />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="billd-btn billd-btn--ghost">Cancel</button>
            <button type="submit" disabled={pending} className="billd-btn billd-btn--primary">{pending ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
