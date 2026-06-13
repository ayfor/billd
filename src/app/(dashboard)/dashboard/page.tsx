import { requireUser } from "@/lib/session";
import { logOut } from "../../(auth)/actions-logout";

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-8">
      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>
        DASHBOARD
      </h1>
      <p style={{ color: "var(--text-muted)" }}>Signed in as {user.email} — full dashboard lands in S5.1.</p>
      <form action={logOut}>
        <button type="submit" className="billd-btn billd-btn--ghost">Log out</button>
      </form>
    </main>
  );
}
