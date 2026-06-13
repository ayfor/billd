import { formatCents } from "@/lib/money";

type Tone = "default" | "positive" | "attention" | "muted";

const TONE: Record<Tone, string> = {
  default: "var(--text-primary)",
  positive: "var(--seaweed)",
  attention: "var(--amethyst)",
  muted: "var(--text-muted)",
};

export function Money({
  cents,
  tone = "default",
  className = "",
}: {
  cents: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`tnum ${className}`} style={{ color: TONE[tone], textAlign: "right" }}>
      {formatCents(cents)}
    </span>
  );
}
