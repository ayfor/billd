import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const user = await requireUser();
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true, color: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "var(--pixel-lg)", color: "var(--text-primary)" }}>CATEGORIES</h1>
      <CategoriesClient categories={categories} />
    </div>
  );
}
