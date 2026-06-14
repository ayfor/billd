"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { recurringSchema } from "@/lib/validation/recurring";

export type RecurringFormState = {
  ok?: boolean;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function parse(fd: FormData) {
  return recurringSchema.safeParse({
    name: String(fd.get("name") ?? ""),
    categoryId: String(fd.get("categoryId") ?? ""),
    amount: String(fd.get("amount") ?? ""),
    frequency: String(fd.get("frequency") ?? ""),
    anchorDay: String(fd.get("anchorDay") ?? "0"),
    startDate: String(fd.get("startDate") ?? ""),
  });
}

function errs(parsed: ReturnType<typeof parse>, fd: FormData): RecurringFormState {
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
  return { errors, values: {
    name: String(fd.get("name") ?? ""), categoryId: String(fd.get("categoryId") ?? ""),
    amount: String(fd.get("amount") ?? ""), frequency: String(fd.get("frequency") ?? ""),
    anchorDay: String(fd.get("anchorDay") ?? ""), startDate: String(fd.get("startDate") ?? ""),
  } };
}

async function ownsCategory(userId: string, categoryId: string) {
  return !!(await prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } }));
}

export async function createRecurring(_prev: RecurringFormState, fd: FormData): Promise<RecurringFormState> {
  const user = await requireUser();
  const parsed = parse(fd);
  if (!parsed.success) return errs(parsed, fd);
  if (!(await ownsCategory(user.id, parsed.data.categoryId))) return { ...errs(parsed, fd), errors: { categoryId: "Pick one of your categories" } };
  await prisma.recurringTemplate.create({ data: {
    userId: user.id, categoryId: parsed.data.categoryId, name: parsed.data.name,
    amountCents: parsed.data.amount, frequency: parsed.data.frequency, anchorDay: parsed.data.anchorDay,
    startDate: new Date(parsed.data.startDate),
  } });
  revalidatePath("/recurring");
  return { ok: true };
}

export async function updateRecurring(id: string, _prev: RecurringFormState, fd: FormData): Promise<RecurringFormState> {
  const user = await requireUser();
  const parsed = parse(fd);
  if (!parsed.success) return errs(parsed, fd);
  if (!(await ownsCategory(user.id, parsed.data.categoryId))) return { ...errs(parsed, fd), errors: { categoryId: "Pick one of your categories" } };
  const res = await prisma.recurringTemplate.updateMany({ where: { id, userId: user.id }, data: {
    categoryId: parsed.data.categoryId, name: parsed.data.name, amountCents: parsed.data.amount,
    frequency: parsed.data.frequency, anchorDay: parsed.data.anchorDay, startDate: new Date(parsed.data.startDate),
  } });
  if (res.count === 0) return { errors: { form: "That template couldn't be found." } };
  revalidatePath("/recurring");
  return { ok: true };
}

export async function toggleRecurringActive(id: string, active: boolean): Promise<{ ok: boolean }> {
  const user = await requireUser();
  await prisma.recurringTemplate.updateMany({ where: { id, userId: user.id }, data: { active } });
  revalidatePath("/recurring");
  return { ok: true };
}

export async function deleteRecurring(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  await prisma.recurringTemplate.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/recurring");
  return { ok: true };
}
