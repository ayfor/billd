import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { mostRecentCategoryId } from "@/lib/queries/recentCategory";
import { Sidebar } from "@/components/Sidebar";
import { QuickAdd } from "@/components/QuickAdd";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [categories, defaultCategoryId] = await Promise.all([
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    mostRecentCategoryId(user.id),
  ]);
  return (
    <div className="flex min-h-svh" style={{ background: "var(--canvas)" }}>
      <Sidebar email={user.email ?? ""} />
      <div className="flex-1 overflow-x-hidden p-10">
        <QuickAdd categories={categories} defaultCategoryId={defaultCategoryId}>
          {children}
        </QuickAdd>
      </div>
    </div>
  );
}
