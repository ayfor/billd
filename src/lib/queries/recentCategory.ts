import { prisma } from "@/lib/prisma";

// The category of the user's most recent expense, falling back to their first
// category by sortOrder. Returns "" if the user has no categories.
export async function mostRecentCategoryId(userId: string): Promise<string> {
  const latest = await prisma.expense.findFirst({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: { categoryId: true },
  });
  if (latest) return latest.categoryId;
  const first = await prisma.category.findFirst({
    where: { userId },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  return first?.id ?? "";
}
