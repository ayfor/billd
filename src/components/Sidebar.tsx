"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOut } from "@/app/(auth)/actions-logout";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/categories", label: "Categories" },
  { href: "/budgets", label: "Budgets" },
  { href: "/recurring", label: "Recurring" },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <aside
      className="flex w-60 shrink-0 flex-col gap-1 p-4"
      style={{ borderRight: "2px solid var(--border-strong)", background: "var(--surface-card)" }}
    >
      <div className="mb-2 flex items-end gap-2 px-3">
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)", lineHeight: 1 }}>
          BILLD
        </span>
        <span aria-hidden className="mb-1 inline-block size-2.5" style={{ background: "var(--electric-sapphire)" }} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/pixel-divider.svg" alt="" width={208} height={8} className="pixelated mb-3" />
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => {
          const on = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm"
              style={{
                background: on ? "var(--electric-sapphire)" : "transparent",
                color: on ? "var(--lavender-mist)" : "var(--text-muted)",
                fontWeight: on ? 600 : 500,
              }}
            >
              <span aria-hidden className="inline-block size-3" style={{ background: on ? "var(--lavender-mist)" : "color-mix(in srgb, var(--lavender-mist) 35%, transparent)" }} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center justify-between gap-2 px-3 pt-4">
        <span className="text-xs" style={{ color: "var(--text-faint)" }}>{email}</span>
        <form action={logOut}>
          <button type="submit" className="text-xs" style={{ color: "var(--electric-sapphire)" }}>log out</button>
        </form>
      </div>
    </aside>
  );
}
