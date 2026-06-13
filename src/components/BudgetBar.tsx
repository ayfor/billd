export function BudgetBar({ ratio, over }: { ratio: number; over: boolean }) {
  const color = over ? "var(--amethyst)" : "var(--seaweed)";
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ position: "relative", height: 14, background: "color-mix(in srgb, var(--lavender-mist) 12%, transparent)", border: "1px solid var(--border-strong)" }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          bottom: 2,
          width: `calc(${pct}% - 4px)`,
          minWidth: pct > 0 ? 8 : 0,
          backgroundImage: `repeating-linear-gradient(90deg, ${color} 0, ${color} 12px, transparent 12px, transparent 16px)`,
        }}
      />
    </div>
  );
}
