export function ExpensesEmptyState() {
  return (
    <div className="px-panel px-raise flex flex-col items-center gap-3 p-12 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pixel-divider.svg" alt="" width={208} height={8} className="pixelated" />
      <h2 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>
        No expenses yet this month
      </h2>
      <p style={{ color: "var(--text-muted)" }}>
        Press <kbd className="px-1.5 py-0.5 text-xs" style={{ border: "1px solid var(--border-strong)", color: "var(--text-body)" }}>⌘K</kbd> to log your first one.
      </p>
    </div>
  );
}
