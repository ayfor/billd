import Link from "next/link";

export function FilteredEmptyState() {
  return (
    <div className="px-panel px-raise flex flex-col items-center gap-3 p-12 text-center">
      <h2 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>
        No expenses match
      </h2>
      <p style={{ color: "var(--text-muted)" }}>Try a different search or filter.</p>
      <Link href="/expenses" className="billd-btn billd-btn--ghost">Clear filters</Link>
    </div>
  );
}
