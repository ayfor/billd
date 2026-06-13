import { formatCents } from "@/lib/money";
import type { ProjectionStatus } from "@/lib/queries/spendSeries";

const TONE: Record<string, string> = {
  positive: "var(--seaweed)",
  attention: "var(--amethyst)",
  muted: "color-mix(in srgb, var(--lavender-mist) 50%, transparent)",
};

export function ProjectionPanel({ status }: { status: ProjectionStatus }) {
  return (
    <div className="px-panel px-raise flex flex-col gap-2 p-6" style={{ minWidth: 260 }}>
      <span className="text-xs font-bold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>PROJECTION</span>
      {status.tooEarly ? (
        <span style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: TONE.muted }}>Too early to call</span>
      ) : (
        <span className="tnum" style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-xl)", color: "var(--text-primary)", lineHeight: 1 }}>
          {formatCents(status.projectedCents)}
        </span>
      )}
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>{status.tooEarly ? "Check back after a few days" : "projected month end"}</span>
      {!status.tooEarly && (
        <span className="text-sm" style={{ color: TONE[status.tone], fontWeight: 600 }}>{status.label}</span>
      )}
    </div>
  );
}
