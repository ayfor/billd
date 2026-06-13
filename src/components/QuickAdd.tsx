"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ExpenseModal } from "@/components/ExpenseModal";

type Ctx = { openQuickAdd: () => void };
const QuickAddContext = createContext<Ctx>({ openQuickAdd: () => {} });

export function useQuickAdd() {
  return useContext(QuickAddContext);
}

export function QuickAdd({
  categories,
  defaultCategoryId,
  children,
}: {
  categories: { id: string; name: string }[];
  defaultCategoryId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openQuickAdd = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <QuickAddContext.Provider value={{ openQuickAdd }}>
      {children}
      {open && categories.length > 0 && (
        <ExpenseModal
          mode="create"
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onClose={() => setOpen(false)}
        />
      )}
    </QuickAddContext.Provider>
  );
}
