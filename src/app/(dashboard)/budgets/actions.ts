"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { budgetSchema } from "@/lib/validation/budget";

export type BudgetFormState = {
  ok?: boolean;
  errors?: Record<string, string>;
  values?: { categoryId?: string; timespan?: string; amount?: string };
};

function parse(formData: FormData) {
  return budgetSchema.safeParse({
    categoryId: String(formData.get("categoryId") ?? ""),
    timespan: String(formData.get("timespan") ?? ""),
    amount: String(formData.get("amount") ?? ""),
  });
}

function errs(parsed: ReturnType<typeof parse>, formData: FormData): BudgetFormState {
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
  return { errors, values: { categoryId: String(formData.get("categoryId") ?? ""), timespan: String(formData.get("timespan") ?? ""), amount: String(formData.get("amount") ?? "") } };
}

async function ownsCategory(userId: string, categoryId: string) {
  return !!(await prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } }));
}

const dupeMsg = (timespan: string) => `That category already has a ${timespan} budget — edit it instead`;

export async function createBudget(_prev: BudgetFormState, formData: FormData): Promise<BudgetFormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) return errs(parsed, formData);
  if (!(await ownsCategory(user.id, parsed.data.categoryId))) return { ...errs(parsed, formData), errors: { categoryId: "Pick one of your categories" } };

  const existing = await prisma.budget.findFirst({ where: { userId: user.id, categoryId: parsed.data.categoryId, timespan: parsed.data.timespan }, select: { id: true } });
  if (existing) return { ...errs(parsed, formData), errors: { timespan: dupeMsg(parsed.data.timespan) } };

  try {
    await prisma.budget.create({ data: { userId: user.id, categoryId: parsed.data.categoryId, timespan: parsed.data.timespan, amountCents: parsed.data.amount } });
  } catch {
    return { ...errs(parsed, formData), errors: { timespan: dupeMsg(parsed.data.timespan) } };
  }
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateBudget(id: string, _prev: BudgetFormState, formData: FormData): Promise<BudgetFormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) return errs(parsed, formData);
  if (!(await ownsCategory(user.id, parsed.data.categoryId))) return { ...errs(parsed, formData), errors: { categoryId: "Pick one of your categories" } };

  const clash = await prisma.budget.findFirst({ where: { userId: user.id, categoryId: parsed.data.categoryId, timespan: parsed.data.timespan, NOT: { id } }, select: { id: true } });
  if (clash) return { ...errs(parsed, formData), errors: { timespan: dupeMsg(parsed.data.timespan) } };

  const res = await prisma.budget.updateMany({ where: { id, userId: user.id }, data: { categoryId: parsed.data.categoryId, timespan: parsed.data.timespan, amountCents: parsed.data.amount } });
  if (res.count === 0) return { errors: { form: "That budget couldn't be found." } };
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteBudget(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  await prisma.budget.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  return { ok: true };
}
