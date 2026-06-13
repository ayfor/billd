export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div
        className="px-panel px-raise flex w-[420px] flex-col gap-4 p-8"
      >
        <div className="flex items-end gap-2">
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)", lineHeight: 1 }}>
            BILLD
          </span>
          <span aria-hidden className="mb-1 inline-block size-2.5" style={{ background: "var(--electric-sapphire)" }} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/pixel-divider.svg" alt="" width={356} height={8} className="pixelated" />
        {children}
      </div>
    </main>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs" style={{ color: "var(--amethyst)" }}>
      {message}
    </p>
  );
}
