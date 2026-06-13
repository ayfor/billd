const palette = [
  { name: "Shadow Grey", hex: "#272727" },
  { name: "Lavender Mist", hex: "#efe9f4" },
  { name: "Electric Sapphire", hex: "#5863f8" },
  { name: "Seaweed", hex: "#00b295" },
  { name: "Amethyst", hex: "#935fa7" },
];

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <h1
        className="flex items-end gap-2"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--pixel-2xl)",
          color: "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        BILLD
        <span
          aria-hidden
          className="mb-2 inline-block size-3"
          style={{ background: "var(--electric-sapphire)" }}
        />
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pixel-divider.svg" alt="" width={288} height={8} className="pixelated" />
      <p style={{ color: "var(--text-muted)" }}>
        Personal expense tracker — quick-add, budgets, projections.
      </p>
      <ul className="flex gap-4">
        {palette.map((c) => (
          <li key={c.hex} className="flex flex-col items-center gap-2">
            <span
              className="size-10 border-2"
              style={{ background: c.hex, borderColor: "var(--border-strong)" }}
            />
            <span className="tnum text-xs" style={{ color: "var(--text-faint)" }}>
              {c.hex}
            </span>
          </li>
        ))}
      </ul>
      <p className="tnum text-sm" style={{ color: "var(--text-muted)" }}>
        $0.00 logged · June 2026
      </p>
    </main>
  );
}
