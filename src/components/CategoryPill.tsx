const TOKEN: Record<string, string> = {
  sapphire: "var(--electric-sapphire)",
  seaweed: "var(--seaweed)",
  amethyst: "var(--amethyst)",
  lavender: "var(--lavender-mist)",
};

export function CategoryPill({ name, color }: { name: string; color: string }) {
  const c = TOKEN[color] ?? "var(--electric-sapphire)";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs"
      style={{
        border: `1px solid ${c}`,
        background: `color-mix(in srgb, ${c} 18%, transparent)`,
        color: "var(--text-primary)",
      }}
    >
      <span aria-hidden className="inline-block size-2" style={{ background: c }} />
      {name}
    </span>
  );
}
