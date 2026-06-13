"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Option = { value: string; label: string };

export function ExpenseFilters({
  categories,
  months,
}: {
  categories: Option[];
  months: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const firstRender = useRef(true);

  // Push a merged param set, always resetting to page 1.
  const push = (patch: Record<string, string>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  // Debounced search.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => push({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const sortValue = `${sp.get("sort") ?? "date"}:${sp.get("dir") ?? "desc"}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search description…"
        className="billd-input"
        style={{ flex: "1 1 240px", minWidth: 200 }}
        aria-label="Search description"
      />
      <select aria-label="Category" className="billd-input" style={{ width: "auto" }} value={sp.get("categoryId") ?? ""} onChange={(e) => push({ categoryId: e.target.value })}>
        <option value="">Category: All</option>
        {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
      <select aria-label="Month" className="billd-input" style={{ width: "auto" }} value={sp.get("month") ?? ""} onChange={(e) => push({ month: e.target.value })}>
        <option value="">All time</option>
        {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select aria-label="Sort" className="billd-input" style={{ width: "auto" }} value={sortValue} onChange={(e) => { const [sort, dir] = e.target.value.split(":"); push({ sort, dir }); }}>
        <option value="date:desc">Date ↓</option>
        <option value="date:asc">Date ↑</option>
        <option value="amount:desc">Amount ↓</option>
        <option value="amount:asc">Amount ↑</option>
      </select>
    </div>
  );
}
