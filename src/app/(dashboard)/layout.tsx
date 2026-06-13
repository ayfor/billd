import { requireUser } from "@/lib/session";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-svh" style={{ background: "var(--canvas)" }}>
      <Sidebar email={user.email ?? ""} />
      <div className="flex-1 overflow-x-hidden p-10">{children}</div>
    </div>
  );
}
