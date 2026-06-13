"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { expenseSchema } from "@/lib/validation/expense";

export type ExpenseFormState = {
  ok?: boolean;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function parse(formData: FormData) {
  return expenseSchema.safeParse({
    amount: String(formData.get("amount") ?? ""),
    description: String(formData.get("description") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    date: String(formData.get("date") ?? ""),
  });
}

function fieldErrors(parsed: ReturnType<typeof parse>, formData: FormData): ExpenseFormState {
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
  return {
    errors,
    values: {
      amount: String(formData.get("amount") ?? ""),
      description: String(formData.get("description") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      date: String(formData.get("date") ?? ""),
    },
  };
}

async function assertOwnedCategory(userId: string, categoryId: string) {
  const cat = await prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } });
  return !!cat;
}

export async function createExpense(_prev: ExpenseFormState, formData: FormData): Promise<ExpenseFormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) return fieldErrors(parsed, formData);
  if (!(await assertOwnedCategory(user.id, parsed.data.categoryId)))
    return { ...fieldErrors(parsed, formData), errors: { categoryId: "Pick one of your categories" } };

  await prisma.expense.create({
    data: {
      userId: user.id,
      categoryId: parsed.data.categoryId,
      amountCents: parsed.data.amount,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
    },
  });
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateExpense(id: string, _prev: ExpenseFormState, formData: FormData): Promise<ExpenseFormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) return fieldErrors(parsed, formData);
  if (!(await assertOwnedCategory(user.id, parsed.data.categoryId)))
    return { ...fieldErrors(parsed, formData), errors: { categoryId: "Pick one of your categories" } };

  // user-scoped: updateMany with id+userId so another user's row is untouchable
  const res = await prisma.expense.updateMany({
    where: { id, userId: user.id },
    data: {
      categoryId: parsed.data.categoryId,
      amountCents: parsed.data.amount,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
    },
  });
  if (res.count === 0) return { errors: { form: "That expense couldn't be found." } };
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteExpense(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  await prisma.expense.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return { ok: true };
}
